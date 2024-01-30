import IterablePieces from "@/components/IterablePieces";
import wigglyBullet from "@/plans/wiggly-bullet";
import { LAYOUT } from "@/game-config";

export const INITIAL_SCREEN_LAYOUT = {
  titlePos: { x: 5, y: 8 },
  soundHintPos: { x: 5, y: LAYOUT.padding.ver },
  controlsGuidePos: { x: 5, y: 45 },
  // the x pos in this one is the position of the right edge of each image in the scores showcase
  scoresPos: { x: 73, y: 10 },
  twinkleMessagePos: { x: 65, y: 80 },
  /**
   * This one represents the position of the right and bottom edges, not
   * top and left as the other ones.
   */
  authorAttributionPos: {
    x: 100 - LAYOUT.padding.hor,
    y: 100 - LAYOUT.padding.ver,
  },
} as const;

export const GAMEOVER_SCREEN_LAYOUT = {
  titleYPos: 16,
  pressMessageYPos: 80,
  soundHintPos: { x: LAYOUT.padding.hor, y: LAYOUT.padding.ver },
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
