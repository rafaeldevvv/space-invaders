import Alien from "../Alien";
import { DIMENSIONS } from "@/game-config";
import overlap from "@/utils/common/overlap";
import { Size, IAlienSet, IPlayer, IWall, IBullet, IEnvironment } from "@/ts/types";

/**
 * Class representing the Game Environment responsible
 * for managing collision.
 * @implements {IEnvironment}
 */
export default class GameEnv implements IEnvironment {
  /**
   * Initializes the game environment.
   *
   * @param alienSet - The aliens.
   * @param player - The player.
   * @param walls - The walls.
   */
  constructor(
    public alienSet: IAlienSet,
    public player: IPlayer,
    public walls: IWall[]
  ) {}

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
  public bulletTouchesObject(bullet: IBullet, objPos: Coords, objSize: Size) {
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
