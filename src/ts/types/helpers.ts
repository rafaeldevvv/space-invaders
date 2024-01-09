/**
 * @file Defines types that help during development.
 */

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

export type { NumOrNull, MappedObjectFromUnion, RemoveFirstElement };
