import { IIterablePieces, IteratedPiece, Plan } from "@/ts/types";
import readSolidPlan from "../../utils/common/readSolidPlan";

/**
 * Class representing pieces of a 2-dimensional object.
 * `true` values mean the piece is solid (should be rendered
 * and taken into account). `false` values mean the piece is not
 * solid and should not be taken into account.
 */
export default class IterablePieces implements IIterablePieces {
  /**
   * A matrix of boolean values, where true represents a solid piece,
   * while false represents a non-existent piece.
   */
  public pieces: boolean[][];

  /**
   * The number of columns of the matrix.
   */
  public numOfColumns: number;
  /**
   * The number of rows of the matrix.
   */
  public numOfRows: number;

  /**
   * @param plan - A plan reprenseting the matrix of pieces.
   * @param solidCharacter - A character representing a solid piece,
   * which maps to true in the matrix. Any other character us mapped to false.
   */
  constructor(plan: Plan, solidCharacter = "#") {
    const pieces = readSolidPlan(plan, solidCharacter);
    this.pieces = pieces;
    this.numOfColumns = pieces[0].length;
    this.numOfRows = pieces.length;
  }

  /**
   * Turns the piece in the specified row and column into a non-solid piece (`false`).
   *
   * @param column
   * @param row
   */
  breakPiece(column: number, row: number) {
    this.pieces[row][column] = false;
  }

  /**
   * A generator that iterates through the matrix of pieces.
   * @yields {IteratedPiece} on each iteration.
   */
  *[Symbol.iterator](): Generator<IteratedPiece> {
    const rows = this.pieces.length;
    for (let row = 0; row < rows; row++) {
      const rowLength = this.pieces[row].length;
      for (let column = 0; column < rowLength; column++) {
        const piece = this.pieces[row][column];
        yield { row, column, piece };
      }
    }
  }
}
