import { LAYOUT } from "@/game-config";

/**
 * This is to adjust the step of the alien set when it
 * is close to the edge of the display. With this, the alien
 * set will not seem stagnant when there's just a small distance
 * for it to reach the edge
 */
export const stepToEdgeAdjustment = 1.33;
export const timeDecreaseFactor = 0.96;
export const entranceSpeed = 30;
export const stepsToReachPlayer = 11;
export const baseYPos = LAYOUT.padding.ver + 14;
