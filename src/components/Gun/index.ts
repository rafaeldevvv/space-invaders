import type { TShooters, Size, IVector, IGun } from "@/ts/types";
import Vector from "@/utils/common/Vector";
import Bullet from "../Bullet";
import { randomNum, randomNumberInFactorRange } from "@/utils/common/numbers";

/**
 * Class representing a gun.
 * @implements {IGun}
 */
export default class Gun implements IGun {
  public fireInterval: number;
  private timeSinceLastShot: number = 0;

  /**
   * Creates a Gun.
   *
   * @param owner - The object which fires the gun.
   * @param bulletSpeed - The speed of the bullet the gun fires.
   * @param bulletSize - The size of the bullet the gun fires.
   * @param baseFireInterval - The time it takes for the gun to fire again.
   */
  constructor(
    public readonly owner: TShooters,
    private readonly bulletSpeed: number,
    public readonly bulletSize: Size,
    private readonly baseFireInterval: number,
    private readonly isBulletWiggly = false,
  ) {
    // to give a random initial fireInterval
    this.fireInterval =
      this.baseFireInterval === 0
        ? 0
        : randomNumberInFactorRange(baseFireInterval, 0.2);
    // for the first bullet to be really random
    this.timeSinceLastShot =
      this.baseFireInterval === 0 ? 0 : randomNum(0, this.fireInterval);
  }

  /**
   * Fires a bullet from a position.
   *
   * @param pos - The position from where the gun is fired.
   * @param direction - The direction the bullet goes.
   * @returns - A bullet or null if the gun wasn't able to fire.
   */
  fire(pos: IVector, direction: "up" | "down") {
    const bullet = new Bullet(
      this.owner,
      pos,
      new Vector(0, direction === "up" ? -this.bulletSpeed : this.bulletSpeed),
      this.bulletSize,
      this.isBulletWiggly
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
   * Updates the gun.
   */
  update(timeStep: number) {
    if (this.baseFireInterval === 0) return;
    this.timeSinceLastShot += timeStep * 1000;
  }

  canFire() {
    if (this.baseFireInterval === 0) return true;
    return this.timeSinceLastShot >= this.fireInterval;
  }
}
