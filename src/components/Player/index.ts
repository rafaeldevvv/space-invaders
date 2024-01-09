import Gun from "../Gun";
import Vector from "@/utils/common/Vector";
import {
  KeysTracker,
  IPlayer,
  IVector,
  PlayerStatuses,
  IGameState,
  IBullet,
  IGun,
} from "@/ts/types";
import { DIMENSIONS, LAYOUT, ACTION_KEYS } from "@/game-config";

export const playerXSpeed = 30,
  playerExplodingTime = 1,
  playerRevivingTime = 3;

/**
 * Class representing the player.
 */
export default class Player implements IPlayer {
  public readonly actorType = "player" as const;

  private baseXPos = 50 - DIMENSIONS.player.w / 2;

  public pos: IVector = new Vector(this.baseXPos, LAYOUT.playerYPos);

  public readonly gun: IGun = new Gun("player", 70, { w: 0.5, h: 3 }, 0);

  public lives = 3;
  public score = 0;
  public status: PlayerStatuses = "alive";
  private timeSinceExplosion: number = 0;
  private timeSinceResurrection = 0;

  /**
   * Fires a player bullet.
   *
   * @returns - A player bullet.
   */
  public fire(): IBullet {
    /* from the center of the player */
    const bulletPosX =
      this.pos.x + DIMENSIONS.player.w / 2 - this.gun.bulletSize.w / 2;

    return this.gun.fire(new Vector(bulletPosX, this.pos.y), "up")!;
  }

  public resetPos() {
    this.pos = new Vector(this.baseXPos, LAYOUT.playerYPos);
  }

  /**
   * Updates the Player and pushes a new bullet into the state
   * if {@link ACTION_KEYS.fire} is pressed and there's no player
   * bullet present in the game.
   *
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param keys - An object that tracks which keys are currently held down.
   */
  public update(state: IGameState, timeStep: number, keys: KeysTracker) {
    const movedX = new Vector(timeStep * playerXSpeed, 0);

    this.handleStatus(timeStep);

    // The player can only move and fire when they are not exploding
    if (this.status !== "exploding") {
      if (keys[ACTION_KEYS.moveLeft] && this.pos.x > LAYOUT.padding.hor) {
        this.pos = this.pos.minus(movedX);
      } else if (
        keys[ACTION_KEYS.moveRight] &&
        this.pos.x + DIMENSIONS.player.w < 100 - LAYOUT.padding.hor
      ) {
        this.pos = this.pos.plus(movedX);
      }

      if (
        keys[ACTION_KEYS.fire] &&
        !state.isPlayerBulletPresent &&
        !state.alienSet.entering // the player can only fire when the alien set is not entering into the view
      ) {
        state.bullets.push(this.fire());
        state.isPlayerBulletPresent = true;
      }
    }
  }

  private handleStatus(timeStep: number) {
    if (this.status === "exploding") {
      this.timeSinceExplosion += timeStep;
    }

    if (this.status === "reviving") {
      this.timeSinceResurrection += timeStep;
    }

    if (this.timeSinceExplosion >= playerExplodingTime) {
      this.status = "reviving";
      this.timeSinceExplosion = 0;
      this.resetPos();
    }

    if (this.timeSinceResurrection >= playerRevivingTime) {
      this.status = "alive";
      this.timeSinceResurrection = 0;
    }
  }
}
