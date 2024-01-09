/**
 * Generates a number which is a random number between
 * the given number multiplied by `1 - subtractingFactor` and the given
 * number multiplied by `1 + addingFactor`.
 *
 * @param n - A number.
 * @param subtractingFactor - The number that will be subtracted from 1.
 * The result of the subtraction is multiplied by n and the result is the
 * minimum value of the range.
 * @param addingFactor - The number that will be added to 1.
 * The result of the addition is multiplied by n and the result is the
 * maximum value of the range.
 * @returns - A random number between the resulting range.
 */
export default function randomNumberInFactorRange(
  n: number,
  subtractingFactor: number,
  addingFactor = subtractingFactor
) {
  return randomNum((1 - subtractingFactor) * n, (1 + addingFactor) * n);
}
