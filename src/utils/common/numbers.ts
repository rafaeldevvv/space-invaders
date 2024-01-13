/**
 * Generates a random integer between min and max (both inclusive).
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns - The random integer.
 */
export function randomInt(min: number, max: number) {
  return Math.round(randomNum(min, max));
}

/**
 * Generates a random number between two numbers.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns - A random number between min and max value.
 */
export function randomNum(min: number, max: number) {
  if (min > max) {
    const savedMax = max;
    max = min;
    min = savedMax;
  }
  return min + Math.random() * (max - min);
}

/**
 * Generates a random number between min and max in steps.
 * 
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @param step - The step by which you jump to the next value from the minimum value.
 * @returns - A random step-generated number.
 * 
 * @example
 * randomNumInSteps(0, 20, 5) // might generate 0, 5, 10, 15 or 20
 * randomNumInSteps(0, 21, 5) // might generate 0, 5, 10, 15 or 20 (21 is not included)
 */
export function randomNumInSteps(min: number, max: number, step: number = 1) {
  if (min > max) {
    const savedMax = max;
    max = min;
    min = savedMax;
  }
  const difference = max - min;
  const numSteps = Math.floor(difference / step);
  const randomStep = randomInt(0, numSteps);

  return min + randomStep * step;
}

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
export function randomNumberInFactorRange(
  n: number,
  subtractingFactor: number,
  addingFactor = subtractingFactor
) {
  return randomNum((1 - subtractingFactor) * n, (1 + addingFactor) * n);
}
