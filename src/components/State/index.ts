import Boss from "../Boss";
import type { default as Bullet, AlienBullet, PlayerBullet } from "../Bullet";
import Wall from "../Wall";
import Player from "../Player";
import { LAYOUT, BOSS_CONFIG, DIMENSIONS } from "@/game-config";
import randomNum from "@/utils/common/randomNum";
import AlienSet from "../AlienSet";
import Alien from "../Alien";
import GameEnv from "../Environment";
import { KeysTracker } from "@/ts/types";
import shieldLikeWall from "@/plans/walls";

import aliensPlan from "@/plans/alien-set";

function generateRandomBossAppearanceInterval() {
  return randomNum(
    0.8 * BOSS_CONFIG.baseAppearanceInterval,
    1.2 * BOSS_CONFIG.baseAppearanceInterval
  );
}

/**
 * Class that manages the state of a running game.
 */
export default class GameState {
  public bullets: Bullet[] = [];
  public status: "lost" | "running" | "start" | "paused" = "start";
  public boss: Boss | null = null;
  public bossesKilled = 0;
  public aliensKilled = 0;
  public isPlayerBulletPresent = false;
  private timeSinceBossLastAppearance = 0;
  private bossAppearanceInterval = generateRandomBossAppearanceInterval();

  /**
   * Initializes the state.
   *
   * @param alienSet - The aliens.
   * @param player - The player.
   * @param env - The game environment.
   */
  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public env: GameEnv
  ) {}

  /**
   * Updates the state of the game, including player, bullets, walls and aliens.
   *
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param keys - An object that tracks which keys on the keyboard are currently being pressed down.
   */
  public update(timeStep: number, keys: KeysTracker) {
    if (this.status !== "running") return;

    this.player.update(this, timeStep, keys);
    if (this.player.status === "exploding") return;

    this.alienSet.update(timeStep);

    /* 
       If the alien set is entering into the view,
       we don't want any of the things below here to happen
     */
    if (this.alienSet.entering) {
      return;
    }

    this.fireAliens();

    this.handleBullets(timeStep);
    this.handleBoss(timeStep);
    this.env.handleAlienSetContactWithWall();

    if (this.alienSet.alive === 0) {
      this.alienSet = new AlienSet(aliensPlan);
      this.bullets = [];
      this.env.alienSet = this.alienSet;
      this.player.lives++;
    } else if (this.player.lives < 1 || this.env.alienSetTouchesPlayer()) {
      this.status = "lost";
    }
  }

  /**
   * Handles all bullets in the game, using GameEnv to check collision, removing out of bounds bullets and so on.
   */
  private handleBullets(timeStep: number) {
    this.bullets.forEach((bullet) => bullet.update(timeStep));

    const newBullets: Bullet[] = [];

    let isSomeAlienKilled = false;
    for (const b of this.bullets) {
      const outOfBounds = this.env.isBulletOutOfBounds(b);
      if (outOfBounds) {
        if (b.from === "player") this.isPlayerBulletPresent = false;
        continue;
      }

      if (b.from === "alien") {
        const touchedPlayer = this.handleBulletContactWithPlayer(
          b as AlienBullet
        );
        if (touchedPlayer) continue;
      } else {
        const touchedAlien = this.handleBulletContactWithAlien(
          b as PlayerBullet
        );
        const touchedBoss = this.handleBulletContactWithBoss(b as PlayerBullet);

        if (!isSomeAlienKilled) isSomeAlienKilled = touchedAlien;
        if (touchedAlien || touchedBoss) {
          this.isPlayerBulletPresent = false;
          continue;
        }
      }

      const touchedWall = this.handleBulletContactWithWalls(b);
      if (touchedWall) {
        if (b.from === "player") this.isPlayerBulletPresent = false;
        continue;
      }

      newBullets.push(b);
    }

    if (isSomeAlienKilled) this.alienSet.adapt();
    this.bullets = newBullets;
  }

  /**
   * Checks whether the bullet touches the player, and, if it does,
   * the player loses one life and resets it position.
   *
   * @param b - A bullet from an alien.
   * @returns - A boolean that tells whether the bullet touched the player
   */
  private handleBulletContactWithPlayer(b: AlienBullet) {
    /* 
       if the bullet hits the player, the it
       is removed and the player resets its 
       position and loses one life 
     */
    if (
      this.player.status === "alive" &&
      this.env.bulletTouchesObject(b, this.player.pos, DIMENSIONS.player)
    ) {
      this.player.lives--;
      this.player.status = "exploding";
      return true;
    }
    return false;
  }

  /**
   * Checks whether a player bullet touches an alien, and, if it does,
   * the player score increases and the touched alien is removed from the set.
   *
   * @param b - A bullet from the player.
   * @returns - A boolean value that tells whether the bullet touches an alien in the set.
   */
  private handleBulletContactWithAlien(b: PlayerBullet) {
    for (const { alien } of this.alienSet) {
      if (!(alien instanceof Alien)) continue;

      const alienPos = this.alienSet.getAlienPos(alien.gridPos);
      if (this.env.bulletTouchesObject(b, alienPos, DIMENSIONS.alien)) {
        this.player.score += alien.score;
        this.aliensKilled++;
        this.alienSet.removeAlien(alien);
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether the bullet touches a wall, and if so, calls
   * the collide method on the wall if available.
   *
   * @param b - A bullet.
   * @returns - A boolean value that tells whether the bullet touches a wall.
   */
  private handleBulletContactWithWalls(b: Bullet) {
    let touchedPiece = false;
    for (const wall of this.env.walls) {
      touchedPiece = wall.collide(b.pos, b.size);
      if (touchedPiece) break;
    }

    return touchedPiece;
  }

  private handleBulletContactWithBoss(b: PlayerBullet) {
    if (this.boss === null || this.boss.status !== "alive") return false;
    if (this.env.bulletTouchesObject(b, this.boss.pos, DIMENSIONS.boss)) {
      this.player.score += BOSS_CONFIG.score;
      this.boss.status = "exploding";
      this.bossesKilled++;
      this.bossAppearanceInterval = generateRandomBossAppearanceInterval();
      return true;
    }
  }

  /**
   * Fires the aliens that can fire.
   */
  private fireAliens() {
    const newBullets: Bullet[] = [];

    for (const { alien } of this.alienSet) {
      if (!(alien instanceof Alien)) continue;

      if (alien.gun.canFire()) {
        const alienPos = this.alienSet.getAlienPos(alien.gridPos);
        const b = alien.fire(alienPos)!;
        newBullets.push(b);
      }
    }

    this.bullets.push(...newBullets);
  }

  private handleBoss(timeStep: number) {
    if (this.boss !== null) this.boss.update(timeStep);
    else this.timeSinceBossLastAppearance += timeStep;

    if (this.timeSinceBossLastAppearance >= this.bossAppearanceInterval) {
      this.boss = new Boss();
      this.timeSinceBossLastAppearance = 0;
      this.bossAppearanceInterval = generateRandomBossAppearanceInterval();
    }

    if (
      this.boss &&
      (this.boss.isOutOfBounds() || this.boss.status === "dead")
    ) {
      this.boss = null;
    }
  }

  /**
   * Creates a basic initial game state.
   *
   * @param plan - A string represeting an arranged set of aliens.
   * @returns - A initial state for the game.
   */
  static start(plan: string) {
    const alienSet = new AlienSet(plan);
    const player = new Player();

    const gap = (100 - LAYOUT.wallsSize.w * LAYOUT.numWalls) / 5;

    const walls: Wall[] = new Array(LAYOUT.numWalls)
      .fill(undefined)
      .map((_, i) => {
        return new Wall(
          { x: (i + 1) * gap + LAYOUT.wallsSize.w * i, y: LAYOUT.wallYPos },
          LAYOUT.wallsSize,
          shieldLikeWall
        );
      });

    const env = new GameEnv(alienSet, player, walls);

    return new GameState(alienSet, player, env);
  }
}
