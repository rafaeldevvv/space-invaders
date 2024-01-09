/**
 * Class representing a vector.
 */
export default class Vector {
   x: number;
   y: number;
 
   /**
    * Creates a Vector.
    *
    * @param x - The position along the horizontal axis.
    * @param y - The position along the vertical axis.
    */
   constructor(x: number, y: number) {
     this.x = x;
     this.y = y;
   }
 
   /**
    * Adds two Vector objects' axes' values.
    *
    * @param other - Another Vector to add to the current one.
    * @returns - A Vector with the added axes of both previous vectors.
    */
   plus(other: Vector) {
     return new Vector(this.x + other.x, this.y + other.y);
   }
 
   /**
    * Subtracts one Vector's axes' values from another Vector.
    *
    * @param other - Another Vector to subtract from the current one.
    * @returns - A Vector with subtracted axes.
    */
   minus(other: Vector) {
     return new Vector(this.x - other.x, this.y - other.y);
   }
 
   /**
    * Mulitplies a Vector's axes' values by a number.
    *
    * @param factor - A number by which the method will multiply the Vector's axes.
    * @returns - A Vector with multiplied axes.
    */
   times(factor: number) {
     return new Vector(this.x * factor, this.y * factor);
   }
 }