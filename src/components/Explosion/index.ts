import { Size, Coords, IExplosion } from "@/ts/types";

/**
 * Class representing an explosion in the game.
 */
export default class Explosion implements IExplosion {
  /** time since the explosion started */
  timeSinceBeginning: number;

  constructor(public size: Size, public pos: Coords, public duration: number) {
    this.timeSinceBeginning = 0;
  }

  update(timeStep: number) {
    this.timeSinceBeginning += timeStep;
  }
}
