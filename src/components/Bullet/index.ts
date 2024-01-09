import { TShooters, Size, IVector, IGameState, IBullet } from "@/ts/types";

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
   */
  constructor(
    public readonly from: TShooters,
    public pos: IVector,
    public readonly speed: IVector,
    public readonly size: Size
  ) {}

  /**
   * Updates the bullet's position.
   *
   * @param timeStep
   */
  update(timeStep: number) {
    this.pos = this.pos.plus(this.speed.times(timeStep));
  }

  /**
   * Is called when the bullet hits something.
   *
   * @param state - The state of the game.
   */
  collide(state: IGameState) {
    state.bullets = state.bullets.filter((bullet) => bullet !== this);
  }
}

export type AlienBullet = Bullet & { from: "alien" };
export type PlayerBullet = Bullet & { from: "player" };
