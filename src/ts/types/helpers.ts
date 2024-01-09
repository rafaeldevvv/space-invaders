type MappedObjectFromUnion<Keys extends string, Type> = {
  [Key in Keys]: Type;
};
type RemoveFirstElement<Type> = Type extends [infer A, ...infer R] ? R : never;

type NumOrNull = number | null;

export type { NumOrNull, MappedObjectFromUnion, RemoveFirstElement };
