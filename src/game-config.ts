import { Size } from "@/ts/types";

/**
 * Describes the layout of the game.
 */
const LAYOUT = {
  padding: {
    hor: 3,
    ver: 3,
  },
  numWalls: 4,
  wallsSize: {
    w: 12,
    h: 10,
  },
  wallYPos: 70,
  playerYPos: 86,
  floorYPos: 97,
  bossYPos: 6,
} as const;

/**
 * The dimensions of all objects in the game.
 * The sizes are percentages within the display, from 0 to 100.
 */
const DIMENSIONS: {
  readonly alien: Size;
  readonly player: Size;
  readonly alienSetGap: Size;
  readonly boss: Size;
  readonly floorHeight: number;
} = {
  alien: {
    w: 3.5, // 3.5% of the display width
    h: 5, // 5% of the display height
  },
  player: {
    w: 4,
    h: 6,
  },
  alienSetGap: {
    w: 1,
    h: 1.5,
  },
  boss: {
    w: 7,
    h: 7.5,
  },
  floorHeight: 1,
};

const ACTION_KEYS = {
  moveRight: "ArrowRight",
  moveLeft: "ArrowLeft",
  fire: " ",
  startGame: " ",
  restartGame: " ",
  pauseGame: "Escape",
} as const;

/**
 * The configuration of the boss.
 */
const BOSS_CONFIG = {
  speedX: 13,
  baseAppearanceInterval: 25,
  score: 200,
};

export { BOSS_CONFIG, ACTION_KEYS, LAYOUT, DIMENSIONS };
