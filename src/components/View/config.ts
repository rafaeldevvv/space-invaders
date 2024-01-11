import { TAliens } from "@/ts/types";

export const INITIAL_SCREEN_LAYOUT = {
  titleYPos: 30,
  pressMessageYPos: 75,
} as const;

export const GAMEOVER_SCREEN_LAYOUT = {
  titleYPos: 16,
  pressMessageYPos: 75,
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
