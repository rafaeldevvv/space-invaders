/**
 * Generates a random number between two numbers.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns - A random number between min and max value.
 */
export default function randomNum(min: number, max: number) {
  return min + Math.random() * (max - min);
}
