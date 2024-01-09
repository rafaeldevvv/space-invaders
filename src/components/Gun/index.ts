import type { TShooters, Size } from "@/ts/types";
import Vector from "@/utils/common/Vector";
import Bullet from "../Bullet";
import randomNumberInFactorRange from "@/utils/common/randomNumberInFactorRange";
import randomNum from "@/utils/common/randomNum";

/**
 * Class representing a gun.
 */
export default class Gun {
  public fireInterval: number;
  public timeSinceLastShot: number = 0;

  /**
   * Creates a Gun.
   *
   * @param owner - The object which fires the gun.
   * @param bulletSpeed - The speed of the bullet the gun fires.
   * @param bulletSize - The size of the bullet the gun fires.
   * @param baseFireInterval - The time it takes for the gun to fire again.
   */
  constructor(
    public owner: TShooters,
    private bulletSpeed: number,
    public bulletSize: Size,
    private baseFireInterval: number
  ) {
    // to give a random initial fireInterval
    this.fireInterval = randomNumberInFactorRange(baseFireInterval, 0.2);
    // for the first bullet to be really random
    this.timeSinceLastShot = randomNum(0, this.fireInterval);
  }

  /**
   * Fires a bullet from a position.
   *
   * @param pos - The position from where the gun is fired.
   * @param direction - The direction the bullet goes.
   * @returns - A bullet or null if the gun wasn't able to fire.
   */
  fire(pos: Vector, direction: "up" | "down") {
    const bullet = new Bullet(
      this.owner,
      pos,
      new Vector(0, direction === "up" ? -this.bulletSpeed : this.bulletSpeed),
      this.bulletSize
    );

    if (this.baseFireInterval === 0) {
      return bullet;
    }

    if (this.canFire()) {
      /* update lastFire prop to track the time of the last shot */
      this.timeSinceLastShot = 0;

      /* generate random fire interval for dynamic gameplay */
      this.fireInterval = randomNumberInFactorRange(this.baseFireInterval, 0.2);

      return bullet;
    }

    /* it returns null if it wasn't able to fire */
    return null;
  }

  /**
   * Updates the time that has passed since the last shot.
   *
   * @param timeStep
   */
  update(timeStep: number) {
    this.timeSinceLastShot += timeStep * 1000;
  }

  /**
   * Checks whether the gun can be fired.
   *
   * @returns - A boolean value saying whether the gun can fire.
   */
  canFire() {
    if (this.baseFireInterval === 0) return true;
    return this.timeSinceLastShot >= this.fireInterval;
  }
}
