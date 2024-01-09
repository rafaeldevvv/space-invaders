import Vector from "@/utils/common/Vector";
import { LAYOUT, DIMENSIONS, BOSS_CONFIG } from "@/game-config";
import { HorizontalDirection } from "@/ts/enums";

const bossExplodingTime = 1;

export default class Boss {
  timeSinceDeath = 0;
  status: "alive" | "exploding" | "dead" = "alive";
  pos: Vector;
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