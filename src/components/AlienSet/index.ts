import {
  Size,
  NumOrNull,
  TAliens,
  IAlienSet,
  IVector,
  IAlien,
} from "@/ts/types";
import Vector from "@/utils/common/Vector";
import Alien, { alienTypesRegExp, alienTypes } from "../Alien";
import { HorizontalDirection } from "@/ts/enums";
import { DIMENSIONS, LAYOUT } from "@/game-config";

/**
 * Checks whether a particular column in the set has all its aliens dead.
 *
 * @param rows - The rows
 * @param column - The column
 * @returns
 */
function isColumnDead(rows: IAlienSet["aliens"], column: number) {
  return rows.every(
    (row) => row[column] === null || row[column] === "exploding"
  );
}

/**
 * Same as {@link isColumnDead}, but for a row in the AlienSet.
 * @param row
 * @returns
 */
function isRowDead(row: IAlienSet["aliens"][number]) {
  return row.every((alien) => alien === null || alien === "exploding");
}

/**
 * Gets the first or last column in a set of aliens if either is dead.
 * The first column takes precedence over the last column.
 *
 * @param rows - The same thing that the {@link AlienSet.aliens} property holds.
 * @returns - The first or last column or null if neither of them is dead.
 */
function getFirstOrLastColumnIfDead(rows: IAlienSet["aliens"]): number | null {
  const isFirstColumnDead = isColumnDead(rows, 0);
  const isLastColumnDead = isColumnDead(rows, rows[0].length - 1);

  if (isFirstColumnDead) return 0;
  if (isLastColumnDead) return rows[0].length - 1;
  else return null;
}

/**
 * Same as {@link getFirstOrLastColumnIfDead}, but for rows.
 */
function getFirstOrLastRowIfDead(rows: IAlienSet["aliens"]): number | null {
  const isFirstRowDead = isRowDead(rows[0]);
  const isLastRowDead = isRowDead(rows[rows.length - 1]);

  if (isFirstRowDead) return 0;
  if (isLastRowDead) return rows.length - 1;
  else return null;
}

/**
 * This is to adjust the step of the alien set when it
 * is close to the edge of the display. With this, the alien
 * set will not seem stagnant when there's just a small distance
 * for it to reach the edge
 */
const alienSetStepToEdgeAdjustment = 1.33;
const alienSetTimeDecreaseFactor = 0.92;
const alienSetBaseYPos = LAYOUT.padding.ver + 12;
const alienSetEntranceSpeed = 30;

/**
 * A class represeting a set of {@link Alien}s
 * @implements {IAlienSet}
 */
export default class AlienSet implements IAlienSet {
  public pos: IVector;
  public size: Size;

  private yStep = 2;
  private xStep: number;

  public numColumns: number;
  public numRows: number;

  /**
   * The aliens in the set. Each item is an instance of {@link Alien},
   * "exploding" (it has just been killed by an alien)
   */
  public aliens: (Alien | null | "exploding")[][];
  public alive: number;

  private timeToUpdate = 1;
  private direction: HorizontalDirection = 1;

  /**
   * Tracks the alien entrance animation.
   */
  public entering = true;

  /**
   * A variable that manages when the AlienSet's position can update.
   * When it is greater than or equal to alienSetMoveTime, then the alien set can move.
   */
  private timeStepSum = 0;

  /**
   * Creates an AlienSet.
   *
   * @param plan - A string represeting an arranged set of aliens.
   */
  constructor(plan: string) {
    if (!alienTypesRegExp.test(plan)) {
      throw new Error(
        `Invalid character(s) in plan ${plan}. Consider using only valid characters (${alienTypes.join(
          ","
        )})`
      );
    }

    const rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);

    this.numColumns = rows[0].length;
    this.numRows = rows.length;
    this.alive = this.numColumns * this.numRows;

    const w =
      this.numColumns * DIMENSIONS.alien.w +
      (this.numColumns - 1) * DIMENSIONS.alienSetGap.w;
    const h =
      this.numRows * DIMENSIONS.alien.h +
      (this.numRows - 1) * DIMENSIONS.alienSetGap.h;

    this.size = { w, h };
    this.pos = new Vector(50 - w / 2, -h * 1.5);

    /*
       `(100 - SCENERY.padding.hor * 2 - w)` is the area within the padding edges,
       divide it by fifteen so that we have 15 steps along the display
     */
    this.xStep = (100 - LAYOUT.padding.hor * 2 - w) / 15;

    this.aliens = rows.map((row, y) => {
      return row.map((ch, x) => {
        return Alien.create(ch as TAliens, { x, y });
      });
    });
  }

  /**
   * Updates the AlienSet instance.
   *
   * @param timeStep - The time that has passed since the last update.
   */
  public update(timeStep: number) {
    if (this.entering) {
      this.pos = this.pos.plus(new Vector(0, alienSetEntranceSpeed * timeStep));

      /* if it is in the place where it is supposed to be initially */
      if (this.pos.y >= alienSetBaseYPos) {
        this.entering = false;
        /* adjustment */
        this.pos.y = alienSetBaseYPos;
      } else return;
    }

    this.timeStepSum += timeStep;

    const movedY = this.moveVertically();
    const movedX = this.moveHorizontally(movedY);

    // reset
    if (this.timeStepSum >= this.timeToUpdate) {
      this.timeStepSum = 0;
    }

    // if it moved down, decreases the updateTime
    if (movedY > 0) {
      this.timeToUpdate *= alienSetTimeDecreaseFactor;
    }

    if (movedY !== 0 || movedX !== 0) {
      this.removeDeadAliens();
    }

    // update position
    this.pos = this.pos.plus(new Vector(movedX, movedY));

    // update alien guns
    for (const { alien } of this) {
      if (alien instanceof Alien) alien.gun.update(timeStep);
    }
  }

  private moveVertically() {
    let movedY = 0;

    /* 
       if it is going right and it has touched 
       the padding edge and it can update its position
     */
    if (
      this.pos.x + this.size.w >= 100 - LAYOUT.padding.hor &&
      this.timeStepSum >= this.timeToUpdate &&
      this.direction === HorizontalDirection.Right
    ) {
      movedY = this.yStep;
      this.direction = HorizontalDirection.Left;
    } else if (
      /* if it is going left and has touched the padding edge and can update */
      this.pos.x <= LAYOUT.padding.hor &&
      this.timeStepSum >= this.timeToUpdate &&
      this.direction === HorizontalDirection.Left
    ) {
      movedY = this.yStep;
      this.direction = HorizontalDirection.Right;
    }

    return movedY;
  }

  private moveHorizontally(movedY: number) {
    let movedX = 0;
    /* if can update and has not moved down */
    if (this.timeStepSum >= this.timeToUpdate && movedY === 0) {
      if (this.direction === HorizontalDirection.Right) {
        /*
           get either the distance left to reach the inner right padding edge
           or the normal step to move
         */
        const rightDistance =
          100 - this.pos.x - LAYOUT.padding.hor - this.size.w;
        if (rightDistance < this.xStep * alienSetStepToEdgeAdjustment) {
          movedX = rightDistance;
        } else {
          movedX = this.xStep;
        }
        // movedX = Math.min(this.xStep, rightDistance);
      } else {
        /*
           get either the distance left to reach the inner left padding edge
           or the normal step to move
         */
        const leftDistance = this.pos.x - LAYOUT.padding.hor;
        if (leftDistance < this.xStep * alienSetStepToEdgeAdjustment) {
          movedX = leftDistance;
        } else {
          movedX = this.xStep;
        }
        // movedX = Math.min(this.xStep, leftDistance);
      }
      movedX *= this.direction;
    }

    return movedX;
  }

  public adapt() {
    this.adaptPos();
    this.adaptSize();
    this.removeDeadRowsAndColumns();
  }

  /**
   * Adapts the size of the alien set when enough aliens have been removed.
   */
  private adaptSize() {
    let firstLivingAlienRow: NumOrNull = null,
      lastLivingAlienRow: NumOrNull = null,
      firstLivingAlienColumn: NumOrNull = null,
      lastLivingAlienColumn: NumOrNull = null;

    for (const { alien } of this) {
      if (!(alien instanceof Alien)) continue;
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

      this.size = {
        w: newW,
        h: newH,
      };
    }
  }

  /**
   * Adapts the position of the alien set when enough aliens have been removed.
   */
  private adaptPos(): void {
    let firstLivingAlienColumn: NumOrNull = null;
    let firstLivingAlienRow: NumOrNull = null;

    for (const { alien } of this) {
      if (!(alien instanceof Alien)) continue;

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
      this.pos = this.getAlienPos({
        x: firstLivingAlienColumn,
        y: firstLivingAlienRow,
      });
    }
  }

  /**
   * Removes rows or columns that have no living aliens.
   */
  private removeDeadRowsAndColumns() {
    let columnToRemove: number | null;
    while (
      (columnToRemove = getFirstOrLastColumnIfDead(this.aliens)) !== null
    ) {
      this.aliens = this.aliens.map((row) => {
        return row.filter((_, x) => x !== columnToRemove);
      });

      /* 
         this is totally necessary for this logic to work
         it ensures that after a row or column is removed, the 
         this.getFirstOrLastColumnIfDead method will return 0 
         for the next column to be removed 
       */
      this.syncAliensGridPos();
    }

    let rowToRemove: number | null;
    while (
      this.aliens.length !== 0 &&
      (rowToRemove = getFirstOrLastRowIfDead(this.aliens)) !== null
    ) {
      this.aliens = this.aliens.filter((_, y) => y !== rowToRemove);
      this.syncAliensGridPos();
    }

    this.syncNumOfColsAndRows();
  }

  /**
   * After the unnecessary rows and columns are removed, the grid position of the aliens are going to be messed up.
   * This ensures that the grid position of the aliens are consistent within the new set.
   */
  private syncAliensGridPos() {
    this.aliens.forEach((row, y) => {
      row.forEach((alien, x) => {
        if (alien instanceof Alien) alien.gridPos = { x, y };
      });
    });
  }

  private syncNumOfColsAndRows() {
    this.numRows = this.aliens.length;
    this.numColumns = this.numRows === 0 ? 0 : this.aliens[0].length;
  }

  /**
   * Gets the position of an alien within the whole game screen.
   *
   * @param param0 - The grid position of the alien within the alien set.
   * @returns - The position of the alien.
   */
  public getAlienPos({ x, y }: Coords): IVector {
    return new Vector(
      /* alienSet positions + sizes + gaps */
      this.pos.x + x * DIMENSIONS.alien.w + x * DIMENSIONS.alienSetGap.w,
      this.pos.y + y * DIMENSIONS.alien.h + y * DIMENSIONS.alienSetGap.h
    );
  }

  /**
   * Removes an alien from the set.
   *
   * @param x - The X position of the alien within the grid.
   * @param y - The Y position of the alien within the grid.
   */
  public removeAlien(alien: IAlien) {
    this.aliens[alien.gridPos.y][alien.gridPos.x] = "exploding";
    this.alive--;
  }

  private removeDeadAliens() {
    for (const { alien, row, column } of this) {
      if (alien === "exploding") {
        this.aliens[row][column] = null;
      }
    }
  }

  /**
   * Iterates through the AlienSet, yielding every alien in the set, 
   * and also the alien's row and column.
   */
  public *[Symbol.iterator]() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        yield { alien: this.aliens[y][x], column: x, row: y };
      }
    }
  }
}
