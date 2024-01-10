import { DIMENSIONS } from "@/game-config";
import Vector from "@/utils/common/Vector";
import { Coords, IGun, IAlien, TAliens } from "@/ts/types";
import { alienTypesConfig } from "./config";
import Gun from "@/components/Gun";

/**
 * Class representing an alien.
 * @implements {IAlien}
 */
export default class Alien implements IAlien {
  public readonly actorType = "alien" as const;

  /**
   * Creates an Alien.
   *
   * @param gridPos - The position of the alien within the alien set.
   * @param score - The score the player gets when it kills this alien.
   * @param gun - The gun of the alien.
   * @param alienType - The type of the alien.
   */
  constructor(
    public gridPos: Coords,
    public readonly score: number,
    public readonly gun: IGun,
    public readonly alienType: TAliens
  ) {}

  /**
   * Fires an alien bullet.
   *
   * @param alienPos - The position from where the alien fires.
   * @returns - The fired bullet or null if the gun wasn't able to fire.
   */
  public fire(alienPos: Coords) {
    /* bullet is fired from the center of the alien */
    const bulletX =
      alienPos.x + DIMENSIONS.alien.w / 2 - this.gun.bulletSize.w / 2;

    return this.gun.fire(new Vector(bulletX, alienPos.y), "down");
  }

  /**
   * Creates an alien based on a character.
   *
   * @param ch - The type of the alien represented by a character.
   * @param gridPos - The position of the alien within the grid.
   * @returns - A specific alien type.
   */
  public static create(ch: TAliens | ".", gridPos: Coords) {
    if (ch === ".") {
      return null;
    } else {
      const { score, gunConfig } = alienTypesConfig[ch];
      return new Alien(gridPos, score, new Gun("alien", ...gunConfig), ch);
    }
  }
}
