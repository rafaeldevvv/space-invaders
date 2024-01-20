import { IIterablePieces, IteratedPiece, Plan } from "@/ts/types";
import readSolidPlan from "./readSolidPlan";

/**
 * Class representing a matrix of iterable pieces,
 * implementing an iterator for the matrix.
 */
export default class IterablePieces implements IIterablePieces {
  /**
   * A matrix of boolean values, where true represents a solid piece,
   * while false represents a non-existent piece.
   */
  public pieces: boolean[][];

  public numOfRows: number;
  public numOfColumns: number;

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

  breakPiece(column: number, row: number) {
    this.pieces[row][column] = false;
  }

  /**
   * Iterates over the pieces.
   *
   * @yields
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
