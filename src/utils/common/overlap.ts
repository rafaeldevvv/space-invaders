import { Size } from "@/ts/types";

/**
 * Checks whether two objects overlap.
 *
 * @param pos1 - The position of the first object.
 * @param size1 - The size of the first objet.
 * @param pos2 - The position of the second object.
 * @param size2 - The size of the second objet.
 * @returns - A boolean stating whether the two objects overlap.
 */
export default function overlap(pos1: Coords, size1: Size, pos2: Coords, size2: Size) {
   return (
     pos1.x + size1.w > pos2.x &&
     pos1.x < pos2.x + size2.w &&
     pos1.y + size1.h > pos2.y &&
     pos1.y < pos2.y + size2.h
   );
 }