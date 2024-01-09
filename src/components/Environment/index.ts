import Alien from "../Alien";
import type AlienSet from "../AlienSet";
import type Player from "../Player";
import type Wall from "../Wall";
import type Bullet from "../Bullet";
import { LAYOUT, DIMENSIONS } from "@/game-config";
import overlap from "@/utils/common/overlap";
import { Size } from "@/ts/types";

/**
 * Class representing the Game Environment responsible
 * for managing collision.
 */
export default class GameEnv {
  /**
   * Initializes the game environment.
   *
   * @param alienSet - The aliens.
   * @param player - The player.
   * @param walls - The walls.
   */
  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public walls: Wall[]
  ) {}

  /**
   * Checks whether the bullet is outside the boundaries of the screen.
   *
   * @param bullet
   * @returns
   */
  public isBulletOutOfBounds(bullet: Bullet) {
    return (
      bullet.pos.y + bullet.size.h >= LAYOUT.floorYPos ||
      bullet.pos.y + bullet.size.h <= 0
    );
  }

  /**
   * Checks whether the alien set has reached the wall.
   *
   * @returns - A boolean value that says whether the alien set has reached a wall.
   */
  public alienSetTouchesPlayer() {
    return this.alienSet.pos.y + this.alienSet.size.h >= this.player.pos.y;
  }

  /**
   * Checks whether an object in the game has been shot.
   *
   * @param bullet - A bullet that may hit the object.
   * @param objPos - The position of the object.
   * @param objSize - The size of the object.
   * @returns - A boolean value that says whether the object is shot.
   */
  public bulletTouchesObject(bullet: Bullet, objPos: Coords, objSize: Size) {
    return overlap(bullet.pos, bullet.size, objPos, objSize);
  }

  public handleAlienSetContactWithWall() {
    for (const wall of this.walls) {
      for (const { alien } of this.alienSet) {
        if (!(alien instanceof Alien)) continue;

        const alienPos = this.alienSet.getAlienPos(alien.gridPos);
        wall.collide(alienPos, DIMENSIONS.alien);
      }
    }
    return false;
  }
}
