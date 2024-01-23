import { TAliens } from "@/ts/types";
import { X, Z, Y } from "@/plans/aliens";
import bossPlan from "@/plans/boss";
import IterablePieces from "@/components/IterablePieces";
import playerPlan from "@/plans/player";
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
  maxWidth: 920,
  aspectRatio: 4 / 3,
};

/**
 * The colors of the objects in the game.
 */
export const colors: {
  [Key in TAliens]: string;
} & { boss: string } = {
  X: "limegreen",
  Y: "orange",
  Z: "pink",
  boss: "#f77",
};

export const aliensPieces = {
  X: [new IterablePieces(X[0]), new IterablePieces(X[1])],
  Y: [new IterablePieces(Y[0]), new IterablePieces(Y[1])],
  Z: [new IterablePieces(Z[0]), new IterablePieces(Z[1])],
} as const;

export const bossPieces = new IterablePieces(bossPlan);

export const playerPieces = new IterablePieces(playerPlan);

export const wigglyBulletPieces = [
  new IterablePieces(wigglyBullet[0]),
  new IterablePieces(wigglyBullet[1]),
];
