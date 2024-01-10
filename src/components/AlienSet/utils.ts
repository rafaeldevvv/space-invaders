import { IAlienSet } from "@/ts/types";

/**
 * Checks whether a particular column in the set has all its aliens dead.
 *
 * @param rows - The rows
 * @param column - The column
 * @returns
 */
export function isColumnDead(rows: IAlienSet["aliens"], column: number) {
  return rows.every(
    (row) => row[column] === null || row[column] === "exploding"
  );
}

/**
 * Same as {@link isColumnDead}, but for a row in the AlienSet.
 * @param row
 * @returns
 */
export function isRowDead(row: IAlienSet["aliens"][number]) {
  return row.every((alien) => alien === null || alien === "exploding");
}

/**
 * Gets the first or last column in a set of aliens if either is dead.
 * The first column takes precedence over the last column.
 *
 * @param rows - The same thing that the {@link AlienSet.aliens} property holds.
 * @returns - The first or last column or null if neither of them is dead.
 */
export function getFirstOrLastColumnIfDead(
  rows: IAlienSet["aliens"]
): number | null {
  const isFirstColumnDead = isColumnDead(rows, 0);
  const isLastColumnDead = isColumnDead(rows, rows[0].length - 1);

  if (isFirstColumnDead) return 0;
  if (isLastColumnDead) return rows[0].length - 1;
  else return null;
}

/**
 * Same as {@link getFirstOrLastColumnIfDead}, but for rows.
 */
export function getFirstOrLastRowIfDead(
  rows: IAlienSet["aliens"]
): number | null {
  const isFirstRowDead = isRowDead(rows[0]);
  const isLastRowDead = isRowDead(rows[rows.length - 1]);

  if (isFirstRowDead) return 0;
  if (isLastRowDead) return rows.length - 1;
  else return null;
}
