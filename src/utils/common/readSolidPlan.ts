import { Plan } from "@/ts/types";

/**
 * Reads a string plan in which hash symbols (#) represent solid pieces (true)
 * and any other character represents no pieces (false)
 *
 * @param plan - A string with hash symbols (#) and any other characters.
 * @returns - An array of arrays of booleans.
 */
export default function readSolidPlan(
  plan: Plan,
  solidCharacter = "#"
): boolean[][] {
  const pieces = plan
    .trim()
    .split("\n")
    .map((row) => [...row].map((ch) => ch === solidCharacter));

  return pieces;
}
