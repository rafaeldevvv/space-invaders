import { Size, Coords, IWall } from "@/ts/types";
import readSolidPlan from "@/utils/common/readSolidPlan";
import overlap from "@/utils/common/overlap";

/**
 * Class representing a wall in the game.
 * 
 * @implements {IWall}
 */
export default class Wall implements IWall {
   /**
    * The pieces of the wall as a matrix.
    */
   readonly piecesMatrix: boolean[][];
   readonly pieceSize: Size;
 
   /**
    * @param pos
    * @param size
    * @param numColumnsOrPlan - The number of columns of breakable pieces or a string representing how the pieces are arranged.
    * @param numRows - The number of rows of breakable pieces.
    */
   constructor(pos: Coords, size: Size, plan: string);
   constructor(pos: Coords, size: Size, numColumns: number, numRows: number);
   constructor(
     public readonly pos: Coords,
     public readonly size: Size,
     numColumnsOrPlan: number | string,
     numRows?: number
   ) {
     let pieces: boolean[][];
     let pieceSize: Size;
 
     if (typeof numColumnsOrPlan === "string") {
       pieces = readSolidPlan(numColumnsOrPlan);
       pieceSize = {
         w: this.size.w / pieces[0].length,
         h: this.size.h / pieces.length,
       };
     } else {
       pieces = new Array(numRows!)
         .fill(undefined)
         .map(() => new Array(numColumnsOrPlan).fill(true));
       pieceSize = {
         w: size.w / numColumnsOrPlan,
         h: size.h / numRows!,
       };
     }
 
     this.pieceSize = pieceSize;
     this.piecesMatrix = pieces;
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
     for (const { row, column, piece } of this) {
       if (!piece) continue;
 
       const piecePos = this.getPiecePos(column, row);
 
       if (overlap(objPos, objSize, piecePos, this.pieceSize)) {
         this.piecesMatrix[row][column] = false;
         if (!touchedPiece) touchedPiece = true;
       }
     }
 
     return touchedPiece;
   }
 
   /**
    * Iterates over the pieces of the wall.
    */
   *[Symbol.iterator]() {
     const rows = this.piecesMatrix.length;
     for (let row = 0; row < rows; row++) {
       const columnLength = this.piecesMatrix[row].length;
       for (let column = 0; column < columnLength; column++) {
         const piece = this.piecesMatrix[row][column];
         yield { row, column, piece };
       }
     }
   }
 }