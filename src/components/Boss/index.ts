import Vector from "@/utils/common/Vector";
import { LAYOUT, DIMENSIONS, BOSS_CONFIG } from "@/game-config";
import { HorizontalDirection } from "@/ts/enums";
import { IVector,IBoss } from "@/ts/types";

const bossExplodingTime = 1;

/**
 * Class representing the boss in the game.
 * @implements {IBoss}
 */
export default class Boss implements IBoss {
  timeSinceDeath = 0;
  status: "alive" | "exploding" | "dead" = "alive";
  pos: IVector;
  private direction: HorizontalDirection = Math.random() > 0.5 ? 1 : -1;

  constructor() {
    if (this.direction === HorizontalDirection.Left) {
      this.pos = new Vector(100, LAYOUT.bossYPos);
    } else {
      this.pos = new Vector(-DIMENSIONS.boss.w, LAYOUT.bossYPos);
    }
  }

  update(timeStep: number) {
    if (this.status === "exploding") {
      this.timeSinceDeath += timeStep;
      if (this.timeSinceDeath >= bossExplodingTime) {
        this.status = "dead";
      }
      return;
    }

    this.pos = this.pos.plus(
      new Vector(this.direction * BOSS_CONFIG.speedX * timeStep, 0)
    );
  }

  isOutOfBounds() {
    if (this.direction === HorizontalDirection.Right) {
      return this.pos.x >= 100;
    } else {
      return this.pos.x <= -DIMENSIONS.boss.w;
    }
  }
}