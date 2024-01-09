/**
 * @file Defines types that are used across the entire codebase.
 * @author Rafael Maia <https://rafaeldevvv.github.io/portfolio>
 */

/**
 * A two-dimensional position.
 */
interface Coords {
  x: number;
  y: number;
}

/**
 * This interface is meant to be used by the CanvasDisplay just
 * to make it clear what the method expects.
 *
 * @extends - Interface representing percentage coordinates.
 */
interface PixelCoords extends Coords {}

/**
 * A two-dimensional size.
 */
interface Size {
  w: number;
  h: number;
}

/**
 * Just like {@link PixelCoords}, it is meant to improve clarity.
 *
 * @extends - Interface representing percentage sizes.
 */
interface PixelSize extends Size {}

/**
 * Strings representing the objects which can fire.
 */
type TShooters = "player" | "alien";

/**
 * String characters representing which kind of aliens can be created. These were chosen arbitrarily.
 *
 * `X` represents the lowest level alien.
 * `Y` represents the medium level alien.
 * `Z` represents the highest level alien.
 */
const alienTypes = ["X", "Y", "Z"] as const;
type TAliens = (typeof alienTypes)[number];

/**
 * A two-dimensional vector object wrapper.
 */
interface IVector {
  x: number;
  y: number;
  plus(other: IVector): IVector;
  minus(other: IVector): IVector;
  times(factor: number): IVector;
}

export type {
  PixelCoords,
  PixelSize,
  Size,
  Coords,
  IVector,
  TShooters,
  TAliens,
};
