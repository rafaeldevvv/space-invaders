import { TAliens } from "@/ts/types";
import IterablePieces from "@/components/IterablePieces";
import wigglyBullet from "@/plans/wiggly-bullet";

export const INITIAL_SCREEN_LAYOUT = {
  titleYPos: 30,
  pressMessageYPos: 80,
} as const;

export const GAMEOVER_SCREEN_LAYOUT = {
  titleYPos: 16,
  pressMessageYPos: 80,
} as const;

export const GAME_DISPLAY = {
  maxWidth: 1024,
  aspectRatio: 4 / 3,
};

/**
 * The colors of the objects in the game.
 */
export const colors = {
  boss: "#ff4242",
} as const;

export const wigglyBulletPieces = [
  new IterablePieces(wigglyBullet[0]),
  new IterablePieces(wigglyBullet[1]),
];
