import { TShooters, Size, IVector, IBullet } from "@/ts/types";
import { LAYOUT } from "@/game-config";

/**
 * Class representing a bullet.
 * @implements {IBullet}
 */
export default class Bullet implements IBullet {
  /**
   * Creates a bullet.
   *
   * @param from - A string representing the object that fired.
   * @param pos - The position from where the bullet was fired.
   * @param speed - The speed of the bullet.
   * @param size - The size of the bullet.
   * @param wiggly - Whether the bullet is a wiggly bullet.
   */
  constructor(
    public readonly from: TShooters,
    public pos: IVector,
    public readonly speed: IVector,
    public readonly size: Size,
    public readonly wiggly: boolean = false
  ) {}

  /**
   * Updates the bullet's position.
   *
   * @param timeStep
   */
  update(timeStep: number) {
    this.pos = this.pos.plus(this.speed.times(timeStep));
  }

  isOutOfBounds() {
    return (
      this.pos.x > 100 ||
      this.pos.x < -this.size.w ||
      this.pos.y + this.size.h >= LAYOUT.floorYPos ||
      this.pos.y < -this.size.h
    );
  }
}
