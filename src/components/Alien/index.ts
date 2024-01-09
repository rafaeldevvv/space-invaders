import { DIMENSIONS } from "@/game-config";
import Vector from "@/utils/common/Vector";
import { Coords, RemoveFirstElement, MappedObjectFromUnion } from "@/ts/types";
import type Bullet from "@/components/Bullet";
import Gun from "@/components/Gun";

/**
 * String characters representing which kind of aliens can be created. These were chosen arbitrarily.
 *
 * `X` represents the lowest level alien.
 * `Y` represents the medium level alien.
 * `Z` represents the highest level alien.
 */
export const alienTypes = ["X", "Y", "Z"] as const;
export type TAliens = (typeof alienTypes)[number];

export const alienTypesRegExp = new RegExp(
  `(\\w*(${alienTypes.join("|")})*\\w*)+`
);

/**
 * An alien type configuration interface.
 */
export interface AlienTypeConfig {
  score: number;
  gunConfig: RemoveFirstElement<ConstructorParameters<typeof Gun>>;
}

/**
 * Configurations for each alien type.
 */
export const alienTypesConfig: MappedObjectFromUnion<TAliens, AlienTypeConfig> =
  {
    X: {
      score: 10,
      gunConfig: [40, { w: 0.5, h: 3 }, 20000],
    },
    Y: {
      score: 20,
      gunConfig: [60, { w: 1, h: 3 }, 30000],
    },
    Z: {
      score: 30,
      gunConfig: [80, { w: 1.5, h: 3 }, 40000],
    },
  };

/**
 * Class representing an alien.
 */
export default class Alien {
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
    public readonly gun: Gun,
    public readonly alienType: TAliens
  ) {}

  /**
   * Fires an alien bullet.
   *
   * @param alienPos - The position from where the alien fires.
   * @returns - The fired bullet or null if the gun wasn't able to fire.
   */
  public fire(alienPos: Coords): Bullet | null {
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
