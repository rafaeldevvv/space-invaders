import { Size, Coords, IWall, IIterablePieces, Plan } from "@/ts/types";
import overlap from "@/utils/common/overlap";
import IterablePieces from "@/utils/common/IterablePieces";

/**
 * Class representing a wall in the game.
 *
 * @implements {IWall}
 */
export default class Wall implements IWall {
  /**
   * The pieces of the wall as a matrix.
   */
  readonly pieces: IIterablePieces;
  readonly pieceSize: Size;

  /**
   *
   * @param pos
   * @param size
   * @param plan - A string representing how the pieces are arranged in the wall.
   */
  constructor(
    public readonly pos: Coords,
    public readonly size: Size,
    plan: Plan
  ) {
    const ip: IIterablePieces = new IterablePieces(plan);

    this.pieceSize = {
      w: size.w / ip.pieces[0].length,
      h: size.h / ip.pieces.length,
    };
    this.pieces = ip;
  }

  /**
   * Gets the position of a piece of the wall within the whole display screen in percentage values.
   *
   * @param column - The column in which the piece is.
   * @param row - The row in which the piece is.
   * @returns - The position of the piece within the whole display in percentage values.
   */
  getPiecePos(column: number, row: number): Coords {
    return {
      x: this.pos.x + column * this.pieceSize.w,
      y: this.pos.y + row * this.pieceSize.h,
    };
  }

  /**
   * This method is called when an object might touch the wall.
   * It checks which pieces the object has touched and removes them.
   *
   * @param objPos - The position of the object.
   * @param objSize - The size of the object.
   * @returns - A boolean that tells whether the object touches a piece of the wall.
   */
  collide(objPos: Coords, objSize: Size) {
    if (!overlap(this.pos, this.size, objPos, objSize)) return false;

    let touchedPiece = false;
    for (const { row, column, piece } of this.pieces) {
      if (!piece) continue;

      const piecePos = this.getPiecePos(column, row);

      if (overlap(objPos, objSize, piecePos, this.pieceSize)) {
        this.pieces.breakPiece(column, row);
        if (!touchedPiece) touchedPiece = true;
      }
    }

    return touchedPiece;
  }
}
