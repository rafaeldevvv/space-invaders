import { AlienSetAlienStates, IAlienSet, NumOrNull, IAlien } from "@/ts/types";
import { DIMENSIONS } from "@/game-config";

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

/**
 * Removes rows or columns that have no living aliens.
 */
export function removeDeadRowsAndColumns(alienSet: IAlienSet) {
  let columnToRemove: number | null;
  while (
    (columnToRemove = getFirstOrLastColumnIfDead(alienSet.aliens)) !== null
  ) {
    alienSet.aliens = alienSet.aliens.map((row) => {
      return row.filter((_, x) => x !== columnToRemove);
    });

    /* 
       this is totally necessary for this logic to work
       it ensures that after a row or column is removed, the 
       getFirstOrLastColumnIfDead function will return 0 or
       `aliens.length - 1` for the next column to be removed 
     */
    syncAliensGridPos(alienSet);
  }

  let rowToRemove: number | null;
  while (
    alienSet.aliens.length !== 0 &&
    (rowToRemove = getFirstOrLastRowIfDead(alienSet.aliens)) !== null
  ) {
    alienSet.aliens = alienSet.aliens.filter((_, y) => y !== rowToRemove);
    syncAliensGridPos(alienSet);
  }

  syncNumOfColsAndRows(alienSet);
}

export function syncAliensGridPos(alienSet: IAlienSet) {
  alienSet.aliens.forEach((row, y) => {
    row.forEach((alien, x) => {
      if (alien !== null && alien !== "exploding") alien.gridPos = { x, y };
    });
  });
}

export function syncNumOfColsAndRows(alienSet: IAlienSet) {
  alienSet.numRows = alienSet.aliens.length;
  alienSet.numColumns = alienSet.numRows === 0 ? 0 : alienSet.aliens[0].length;
}

/**
 * Adapts the size of the alien set when enough aliens have been removed.
 */
export function adaptSize(alienSet: IAlienSet) {
  let firstLivingAlienRow: NumOrNull = null,
    lastLivingAlienRow: NumOrNull = null,
    firstLivingAlienColumn: NumOrNull = null,
    lastLivingAlienColumn: NumOrNull = null;

  for (const { alien } of alienSet) {
    if (alien === "exploding" || alien === null) continue;
    const { x: column, y: row } = alien.gridPos;

    /* 
       `row < firstLivingAlienRow` isn't needed here because 
       it will always check top-bottom
     */
    if (firstLivingAlienRow === null) {
      firstLivingAlienRow = row;
    }
    lastLivingAlienRow = row;

    /* 
       if the  first column is null or the current one is less than the previous 
       one, then this is the first living alien column 
     */
    if (firstLivingAlienColumn === null || column < firstLivingAlienColumn) {
      firstLivingAlienColumn = column;
    }
    if (lastLivingAlienColumn === null || column > lastLivingAlienColumn) {
      lastLivingAlienColumn = column;
    }
  }

  if (firstLivingAlienRow !== null) {
    const newH =
      // add one because if the living aliens are on the same row, the new height would be zero
      // same thing for columns
      (lastLivingAlienRow! - firstLivingAlienRow + 1) * DIMENSIONS.alien.h +
      (lastLivingAlienRow! - firstLivingAlienRow) * DIMENSIONS.alienSetGap.h;
    const newW =
      (lastLivingAlienColumn! - firstLivingAlienColumn! + 1) *
        DIMENSIONS.alien.w +
      (lastLivingAlienColumn! - firstLivingAlienColumn!) *
        DIMENSIONS.alienSetGap.w;

    alienSet.size = {
      w: newW,
      h: newH,
    };
  }
}

/**
 * Adapts the position of the alien set when enough aliens have been removed.
 */
export function adaptPos(alienSet: IAlienSet): void {
  let firstLivingAlienColumn: NumOrNull = null;
  let firstLivingAlienRow: NumOrNull = null;

  for (const { alien } of alienSet) {
    if (!isAlien(alien)) continue;

    const { x, y } = alien.gridPos;

    if (firstLivingAlienColumn === null || x < firstLivingAlienColumn) {
      firstLivingAlienColumn = x;
    }

    if (firstLivingAlienRow === null) {
      firstLivingAlienRow = y;
    }
  }

  /* if there is still aliens */
  if (firstLivingAlienColumn !== null && firstLivingAlienRow !== null) {
    alienSet.pos = alienSet.getAlienPos({
      x: firstLivingAlienColumn,
      y: firstLivingAlienRow,
    });
  }
}

export function isAlien(alien: AlienSetAlienStates): alien is IAlien {
  return alien !== null && alien !== "exploding";
}
