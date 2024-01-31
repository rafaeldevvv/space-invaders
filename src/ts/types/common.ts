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
 * This interface is same as {@link Coords}, it only exists
 * for the meaning it is given, i.e. it is measured in pixels
 * within the display.
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
 * This interface is same as {@link Size}, it only exists
 * for the meaning it is given, i.e. it is measured in pixels
 * within the display.
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

/**
 * String characters represeting aliens.
 */
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

/**
 * Maps a string union type to an object whose property types are the specified Type.
 */
type MappedObjectFromUnion<Keys extends string, Type> = {
  [Key in Keys]: Type;
};

/**
 * Removes the first type of a tuple type or an array.
 */
type RemoveFirstElement<Type> = Type extends [infer A, ...infer R] ? R : never;

type NumOrNull = number | null;

/**
 * A multi-line string representing how objects in a grid-like layout should be arranged.
 */
type Plan = string;

/** Makes all properties of an object type optional. */
type MakeOptional<Type> = {
  [Key in keyof Type]+?: Type[Key];
};

/** All the HTMLElement properties, but all of them are optional. */
type HTMLAttributes = MakeOptional<HTMLElement> &
  MakeOptional<HTMLInputElement> &
  MakeOptional<HTMLLabelElement>;

/**
 * A function that can unregister events.
 */
type Unregisterable = {
  unregister: () => void;
};

export type {
  PixelCoords,
  PixelSize,
  Size,
  Coords,
  IVector,
  TShooters,
  TAliens,
  NumOrNull,
  MappedObjectFromUnion,
  RemoveFirstElement,
  Plan,
  HTMLAttributes,
  MakeOptional,
  Unregisterable
};
