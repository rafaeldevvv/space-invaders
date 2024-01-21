import Boss from "../Boss";
import Wall from "../Wall";
import Player from "../Player";
import Explosion from "../Explosion";
import { LAYOUT, DIMENSIONS } from "@/game-config";
import { randomNumberInFactorRange } from "@/utils/common/numbers";
import AlienSet from "../AlienSet";
import Alien from "../Alien";
import GameEnv from "../Environment";
import {
  IBullet,
  IGameState,
  PlayerBullet,
  AlienBullet,
  IWall,
  IEnvironment,
  IPlayer,
  IAlienSet,
  IExplosion,
  IStateLastScore,
  RunningActionsTracker,
} from "@/ts/types";
import shieldLikeWall from "@/plans/walls";
import * as BOSS_CONFIG from "../Boss/config";
import audios from "@/audios";

import aliensPlan from "@/plans/alien-set";

function generateRandomBossAppearanceInterval() {
  return randomNumberInFactorRange(BOSS_CONFIG.baseAppearanceInterval, 0.1);
}

/**
 * The time the explosion of the bullet collision lasts.
 */
const bulletCollisionExplosionDuration = 0.3;

/**
 * Class that manages the state of a running game.
 * @implements {IGameState}
 */
export default class GameState implements IGameState {
  public bullets: IBullet[] = [];
  public status: "lost" | "running" | "start" | "paused" = "start";
  public boss: Boss | null = null;
  public bossesKilled = 0;
  public aliensKilled = 0;
  /** there can be only one player bullet in the game, and this tracks when it is present */
  public isPlayerBulletPresent = false;
  public bulletCollisions: IExplosion[] = [];
  public lastScore: IStateLastScore = { value: null, id: null };
  public numOfPlayerFires: number = 0;
  private timeSinceBossLastAppearance = 0;
  private bossAppearanceInterval = generateRandomBossAppearanceInterval();

  /**
   * Initializes the state.
   *
   * @param alienSet - The aliens.
   * @param player - The player.
   * @param env - The game environment.
   * @param bestScore - The best score of the player at the moment the class instantiated.
   */
  constructor(
    public alienSet: IAlienSet,
    public player: IPlayer,
    public env: IEnvironment
  ) {}

  /**
   * Updates the state of the game, including player, bullets, walls and aliens.
   *
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param keys - An object that tracks which keys on the keyboard are currently being pressed down.
   */
  public update(timeStep: number, actions: RunningActionsTracker) {
    if (this.status !== "running") return;

    this.handleCollisions(timeStep);

    this.player.update(this, timeStep, actions);
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
      this.isPlayerBulletPresent = false;
      this.env.alienSet = this.alienSet;
      this.player.lives++;
      this.numOfPlayerFires = 0;
      if (this.boss !== null) {
        this.boss.stopPitch();
        this.boss = null;
      }
    } else if (this.player.lives < 1 || this.env.alienSetTouchesPlayer()) {
      this.status = "lost";
      this.boss?.stopPitch();
      const { bestScore, score } = this.player;
      this.player.bestScore = score > bestScore ? score : bestScore;
      AlienSet.instancesCreated = 0;
    }
  }

  /**
   * Handles all bullets in the game, using GameEnv to check collision, removing out of bounds bullets and so on.
   */
  private handleBullets(timeStep: number) {
    this.bullets.forEach((bullet) => bullet.update(timeStep));

    let newBullets: IBullet[] = [];

    let isSomeAlienKilled = false;
    /** this is for detecting collision between bullets */
    let playerBulletCollided = false;
    for (const b of this.bullets) {
      /* continue basically means "remove bullet" in this loop */

      const outOfBounds = b.isOutOfBounds();
      if (outOfBounds) {
        if (b.from === "player") this.isPlayerBulletPresent = false;
        continue;
      }

      if (b.from === "alien") {
        const touchedPlayer = this.handleBulletContactWithPlayer(
          b as AlienBullet
        );
        if (touchedPlayer) continue;
      } else if (b.from === "player") {
        if (playerBulletCollided) {
          this.isPlayerBulletPresent = false;
          continue;
        }

        const touchedAlien = this.handleBulletContactWithAlien(
          b as PlayerBullet
        );
        if (!isSomeAlienKilled) isSomeAlienKilled = touchedAlien;
        if (touchedAlien) {
          this.isPlayerBulletPresent = false;
          continue;
        }

        const touchedBoss = this.handleBulletContactWithBoss(b as PlayerBullet);
        if (touchedBoss) {
          this.isPlayerBulletPresent = false;
          continue;
        }
      }

      const touchedWall = this.handleBulletContactWithWalls(b);
      if (touchedWall) {
        if (b.from === "player") this.isPlayerBulletPresent = false;
        continue;
      }

      if (b.from === "alien") {
        const playerBullet = this.bullets.find((b) => b.from === "player");
        if (playerBullet) {
          const touchedPlayerBullet = this.env.bulletTouchesOtherBullet(
            b,
            playerBullet
          );
          if (touchedPlayerBullet) {
            this.bulletCollisions.push(
              new Explosion(
                DIMENSIONS.bulletCollision,
                {
                  y: playerBullet.pos.y,
                  x: playerBullet.pos.x + this.player.gun.bulletSize.w / 2,
                },
                bulletCollisionExplosionDuration
              )
            );
            playerBulletCollided = true;
            /* the alien set bullet occasionally (30%) survives */
            if (Math.random() > 0.3) continue;
          }
        }
      }

      newBullets.push(b);
    }

    if (this.isPlayerBulletPresent && playerBulletCollided) {
      // need to filter here because if the player bullet is checked before the
      // bullet that it collides with, it is included in newBullets.
      newBullets = newBullets.filter((b) => b.from !== "player");
      this.isPlayerBulletPresent = false;
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
      audios.explosion();
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
        this.lastScore.value = alien.score;
        if (this.lastScore.id !== null) this.lastScore.id++;
        else this.lastScore.id = 0;
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
  private handleBulletContactWithWalls(b: IBullet) {
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
      this.lastScore.value = this.boss.score;
      if (this.lastScore.id !== null) this.lastScore.id++;
      else this.lastScore.id = 0;
      this.player.score += this.boss.score;
      this.boss.status = "exploding";
      this.boss.stopPitch();
      this.bossesKilled++;
      this.bossAppearanceInterval = generateRandomBossAppearanceInterval();
      audios.alienKilled();
      return true;
    }
  }

  /**
   * Fires the aliens that can fire.
   */
  private fireAliens() {
    const newBullets: IBullet[] = [];

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
    if (this.boss !== null) this.boss.update(this, timeStep);
    else this.timeSinceBossLastAppearance += timeStep;

    if (this.timeSinceBossLastAppearance >= this.bossAppearanceInterval) {
      this.boss = new Boss(this);
      this.timeSinceBossLastAppearance = 0;
      this.bossAppearanceInterval = generateRandomBossAppearanceInterval();
    }

    if (
      this.boss &&
      (this.boss.isOutOfBounds() || this.boss.status === "dead")
    ) {
      this.boss.stopPitch();
      this.boss = null;
    }
  }

  private handleCollisions(timeStep: number) {
    this.bulletCollisions.forEach((c) => c.update(timeStep));
    this.bulletCollisions = this.bulletCollisions.filter(
      (c) => c.timeSinceBeginning < c.duration
    );
  }

  /**
   * Creates a basic initial game state.
   *
   * @param plan - A string represeting an arranged set of aliens.
   * @returns - A initial state for the game.
   */
  static start(plan: string, bestScore: number) {
    const alienSet = new AlienSet(plan);
    const player = new Player(bestScore);

    const gap = (100 - LAYOUT.wallsSize.w * LAYOUT.numWalls) / 5;

    const walls: IWall[] = new Array(LAYOUT.numWalls)
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
