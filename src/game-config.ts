/**
 * Describes the layout of the game.
 */
const LAYOUT = {
  padding: {
    hor: 3,
    ver: 1.5,
  },
  numWalls: 4,
  wallsSize: {
    w: 10,
    h: 8.3, // .83333333
  },
  wallYPos: 70,
  playerYPos: 86,
  floorYPos: 97,
  bossYPos: 8,
} as const;

/**
 * The dimensions of all objects in the game.
 * The sizes are percentages within the display, from 0 to 100.
 */
const DIMENSIONS = {
  alien: {
    w: 3.5, // 3.5% of the display width
    h: 4.5, // 4.5% of the display height
  },
  player: {
    w: 4,
    h: 6,
  },
  alienSetGap: {
    w: 1.2,
    h: 2,
  },
  boss: {
    w: 8,
    h: 5.5,
  },
  floorHeight: 1,
  bulletCollision: { w: 2, h: 1.5 },
} as const;

const ACTION_KEYS = {
  moveRight: "ArrowRight",
  moveLeft: "ArrowLeft",
  fire: " ",
  startGame: " ",
  restartGame: " ",
  pauseGame: "Escape",
} as const;

const RUNNING_GAME_KEY_ACTIONS = {
  ArrowRight: "moveRight",
  ArrowLeft: "moveLeft",
  [" "]: "fire",
} as const;

export {
  ACTION_KEYS,
  LAYOUT,
  DIMENSIONS,
  RUNNING_GAME_KEY_ACTIONS,
};
