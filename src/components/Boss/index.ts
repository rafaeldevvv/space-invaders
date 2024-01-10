import Vector from "@/utils/common/Vector";
import { LAYOUT, DIMENSIONS } from "@/game-config";
import { HorizontalDirection } from "@/ts/enums";
import { IVector, IBoss } from "@/ts/types";
import { bossExplodingTime, speedX } from "./config";

/**
 * Class representing the boss in the game.
 * @implements {IBoss}
 */
export default class Boss implements IBoss {
  public timeSinceDeath = 0;
  public status: "alive" | "exploding" | "dead" = "alive";
  public pos: IVector;
  private direction: HorizontalDirection =
    Math.random() > 0.5 ? HorizontalDirection.Right : HorizontalDirection.Left;

  constructor() {
    if (this.direction === HorizontalDirection.Left) {
      this.pos = new Vector(100, LAYOUT.bossYPos);
    } else {
      this.pos = new Vector(-DIMENSIONS.boss.w, LAYOUT.bossYPos);
    }
  }

  public update(timeStep: number) {
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
