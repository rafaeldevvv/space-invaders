import Gun from "@/components/Gun";
import { RemoveFirstElement, MappedObjectFromUnion, TAliens } from "@/ts/types";

/**
 * String characters representing which kind of aliens can be created. These were chosen arbitrarily.
 *
 * `X` represents the lowest level alien.
 * `Y` represents the medium level alien.
 * `Z` represents the highest level alien.
 */
export const alienTypes = ["X", "Y", "Z"] as const;

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
