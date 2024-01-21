import Vector from "@/utils/common/Vector";
import { LAYOUT, DIMENSIONS } from "@/game-config";
import { HorizontalDirection } from "@/ts/enums";
import { IVector, IBoss, IGameState } from "@/ts/types";
import { bossExplodingTime, speedX } from "./config";
import audios from "@/audios";

/**
 * Class representing the boss in the game.
 * @implements {IBoss}
 */
export default class Boss implements IBoss {
  public timeSinceDeath = 0;
  public status: "alive" | "exploding" | "dead" = "alive";
  public pos: IVector;
  public stopPitch: () => void;
  private numOfPlayerFires: number;
  private direction: HorizontalDirection =
    Math.random() > 0.5 ? HorizontalDirection.Right : HorizontalDirection.Left;

  constructor(state: IGameState) {
    this.numOfPlayerFires = state.numOfPlayerFires;
    if (this.direction === HorizontalDirection.Left) {
      this.pos = new Vector(100, LAYOUT.bossYPos);
    } else {
      this.pos = new Vector(-DIMENSIONS.boss.w, LAYOUT.bossYPos);
    }
    this.stopPitch = audios.boss_lowpitch();
  }

  /**
   * Returns a score based on how many bullets the player has fired.
   * For every alien set, the 23rd bullet of the player that
   * hits the boss is worth 300 points. From there, every
   * 15th shot is also worth 300. So if I hit the player with shot 23rd,
   * and then with shot 38th, and then with the 53th shot, I get 300 points
   * those three times. If none of those conditions hold, then we get a number
   * between 0 and 200 based on how many bullets the player needs to fire
   * in order to get one of those 300-point shots.
   *
   * @see {@link https://www.classicgaming.cc/classics/space-invaders/play-guide Space Invaders Play Guide}
   */
  public get score() {
    if (
      this.numOfPlayerFires === 23 ||
      (this.numOfPlayerFires - 23) % 15 === 0
    ) {
      return 300;
    }
    const hundredPercent = this.numOfPlayerFires < 23 ? 23 : 15;
    const progress = (this.numOfPlayerFires % hundredPercent) / hundredPercent;
    return Math.round((progress * 200) / 10) * 10;
  }

  public update(state: IGameState, timeStep: number) {
    if (state.numOfPlayerFires !== this.numOfPlayerFires) {
      this.numOfPlayerFires = state.numOfPlayerFires;
    }
    if (this.status === "exploding") {
      this.timeSinceDeath += timeStep;
      if (this.timeSinceDeath >= bossExplodingTime) {
        this.status = "dead";
      }
      return;
    }

    this.pos = this.pos.plus(new Vector(this.direction * speedX * timeStep, 0));
  }

  public isOutOfBounds() {
    if (this.direction === HorizontalDirection.Right) {
      return this.pos.x >= 100;
    } else {
      return this.pos.x <= -DIMENSIONS.boss.w;
    }
  }
}
