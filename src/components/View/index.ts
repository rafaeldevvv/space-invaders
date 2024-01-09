import {
  TAliens,
  MappedObjectFromUnion,
  KeysTracker,
  KeyboardEventHandler,
  PixelSize,
  PixelCoords,
  Coords,
  Size,
  IGameState,
  IAlien,
  IBoss,
  IWall,
  IView,
} from "@/ts/types";
import { ACTION_KEYS, LAYOUT, DIMENSIONS } from "@/game-config";
import getElementInnerDimensions from "@/utils/View/getElementInnerDimensions";
import trackKeys from "@/utils/View/trackKeys";
import readSolidPlan from "@/utils/common/readSolidPlan";
import explosionPlan from "@/plans/explosions";

const explosionPieces = readSolidPlan(explosionPlan);

/**
 * The colors of the aliens
 */
export const colors: {
  [Key in TAliens]: string;
} & { boss: string } = {
  X: "limegreen",
  Y: "orange",
  Z: "pink",
  boss: "#f77",
};

const GAME_DISPLAY_SETTINGS = {
  maxWidth: 920,
  aspectRatio: 4 / 3,
};

export type FontSizes = "sm" | "md" | "lg" | "xl";

/**
 * Object representing standard font sizes.
 * The property names are font size names, and the values are percentages
 * of the width of the canvas.
 */
const fontSizes: MappedObjectFromUnion<FontSizes, number> = {
  sm: 2.5,
  md: 4,
  lg: 6,
  xl: 10,
};

/**
 * Class represeting a view component used to display the game state.
 * It uses the HTML Canvas API.
 * 
 * @implements {IView<IGameState>}
 */
export default class CanvasView implements IView<IGameState> {
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private canvasFontFamily = "monospace";

  public trackedKeys = {} as KeysTracker;
  private keysHandlers: Map<string, KeyboardEventHandler[]> = new Map();

  /**
   * Creates a view component for the game that uses the Canvas API.
   *
   * @param state - The initial state of the game.
   * @param parent - The HTML Element used to display the view.
   */
  constructor(public state: IGameState, public parent: HTMLElement) {
    this.canvas = document.createElement("canvas");
    this.canvasContext = this.canvas.getContext("2d")!;

    this.canvas.style.display = "block";
    this.canvas.style.marginInline = "auto";

    this.parent.appendChild(this.canvas);

    this.defineEventListeners();
    this.setDisplaySize();
    this.syncState(state, 0);
  }

  /**
   * Sets the size of the canvas based on the size of the its parent element.
   */
  public setDisplaySize(this: CanvasView) {
    let canvasWidth = Math.min(
      GAME_DISPLAY_SETTINGS.maxWidth,
      getElementInnerDimensions(this.canvas.parentNode as HTMLElement).w
    );

    let canvasHeight = canvasWidth / GAME_DISPLAY_SETTINGS.aspectRatio;

    if (canvasHeight > innerHeight) {
      canvasHeight = innerHeight;
      canvasWidth = canvasHeight * GAME_DISPLAY_SETTINGS.aspectRatio;
    }

    this.canvas.setAttribute("width", canvasWidth.toString());
    this.canvas.setAttribute("height", canvasHeight.toString());
    this.syncState(this.state, 1 / 60);
  }

  /**
   * Synchonizes the view with a new model (state).
   *
   * @param state - A new game state.
   */
  public syncState(this: CanvasView, state: IGameState, timeStep: number) {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    switch (state.status) {
      case "running": {
        this.drawRunningGame(state, timeStep);
        break;
      }
      case "paused": {
        this.drawRunningGame(state, timeStep);
        this.drawPauseHint();
        break;
      }
      case "start": {
        this.drawInitialScreen();
        break;
      }
      case "lost": {
        this.drawGameOverScreen(state);
        break;
      }
      default: {
        const _never: never = state.status;
        throw new Error("Unexpected state status", _never);
      }
    }
  }

  public addKeyHandler(
    this: CanvasView,
    key: string,
    handler: KeyboardEventHandler
  ) {
    if (this.keysHandlers.has(key)) {
      const handlers = this.keysHandlers.get(key)!;
      this.keysHandlers.set(key, [...handlers, handler]);
    } else {
      this.keysHandlers.set(key, [handler]);
    }
  }

  private defineEventListeners() {
    window.addEventListener("resize", () => this.setDisplaySize());
    window.addEventListener("keydown", (e) => {
      if (this.keysHandlers.has(e.key)) {
        const handlers = this.keysHandlers.get(e.key)!;
        handlers.forEach((h) => h(e));
      }
    });

    this.trackedKeys = trackKeys([
      ACTION_KEYS.moveLeft,
      ACTION_KEYS.moveRight,
      ACTION_KEYS.fire,
    ]);
  }

  // readonly, cuz there's no setter
  private get canvasWidth() {
    return this.canvas.width;
  }

  // readonly, cuz there's no setter
  private get canvasHeight() {
    return this.canvas.height;
  }

  /**
   * Calculates the horizontal pixels according to a percentage of the canvas width.
   *
   * @param percentage - The percentage of the canvas width.
   * @returns - The corresponding horizontal pixels.
   */
  private horPixels(percentage: number) {
    return (percentage / 100) * this.canvasWidth;
  }

  /**
   * Calculates the vertical pixels according to a percentage of the canvas height.
   *
   * @param percentage - The percentage of the canvas heigth.
   * @returns - The corresponding vertical pixels.
   */
  private verPixels(percentage: number) {
    return (percentage / 100) * this.canvasHeight;
  }

  /**
   * Calculates the pixel position of an object within the canvas based on a percentage position.
   *
   * @param percentagePos - The percentage position.
   * @returns - The corresponding pixel position.
   */
  private getPixelPos(percentagePos: Coords): PixelCoords {
    return {
      x: this.horPixels(percentagePos.x),
      y: this.verPixels(percentagePos.y),
    };
  }

  /**
    * Calculates the pixel size of an object within the canvas based on a percentage size.
    
    * @param percentagePos - The percentage size.
   * @returns - The corresponding pixel size.
   */
  private getPixelSize(percentageSize: Size): PixelSize {
    return {
      w: this.horPixels(percentageSize.w),
      h: this.verPixels(percentageSize.h),
    };
  }

  private getFontSize(size: FontSizes) {
    return this.horPixels(fontSizes[size]);
  }

  /**
   * Draws a running game.
   *
   * @param state
   * @param timeStep
   */
  private drawRunningGame(state: IGameState, timeStep: number) {
    this.drawFloor();
    this.drawPlayer(state.player);
    this.drawAlienSet(state.alienSet);
    this.drawBullets(state.bullets);
    this.drawWalls(state.env.walls);
    this.drawMetadata(state, timeStep);
    if (state.boss !== null) this.drawBoss(state.boss);
    this.drawPressEscMessage();
  }

  private drawFloor() {
    const floorWidth = 100 - LAYOUT.padding.hor * 2,
      w = this.horPixels(floorWidth),
      h = this.verPixels(DIMENSIONS.floorHeight);
    const x = this.horPixels(LAYOUT.padding.hor),
      y = this.verPixels(100 - DIMENSIONS.floorHeight - 1.5);

    this.canvasContext.fillStyle = "#fff";
    this.canvasContext.fillRect(x, y, w, h);
  }

  private drawAlienSet(alienSet: IGameState["alienSet"]) {
    for (const { alien, row, column } of alienSet) {
      if (alien === null) continue;

      const xPercentage =
        alienSet.pos.x +
        column * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);

      const yPercentage =
        alienSet.pos.y + row * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);

      const alienPos = {
        x: xPercentage,
        y: yPercentage,
      };

      if (alien !== "exploding") {
        this.drawAlien(alien, alienPos);
      } else {
        this.drawExplosion(alienPos, DIMENSIONS.alien);
      }
    }

    /* this is meant for tests, remove it later */
    const { x, y } = this.getPixelPos(alienSet.pos);
    const { w, h } = this.getPixelSize(alienSet.size);
    this.canvasContext.fillStyle = "rgba(255,255,255,0.4)";
    this.canvasContext.fillRect(x, y, w, h);
  }

  private drawAlien(alien: IAlien, pos: Coords) {
    const { w, h } = this.getPixelSize(DIMENSIONS.alien);
    const { x, y } = this.getPixelPos(pos);

    this.canvasContext.fillStyle = colors[alien.alienType];
    this.canvasContext.fillRect(x, y, w, h);
  }

  private drawExplosion(pos: Coords, size: Size, color = "#fff") {
    const { w, h } = this.getPixelSize(size);
    const { x, y } = this.getPixelPos(pos);

    const pieceHeight = h / explosionPieces.length,
      pieceWidth = w / explosionPieces[0].length;

    this.canvasContext.save();
    this.canvasContext.translate(x, y);

    this.canvasContext.fillStyle = color;
    for (let y = 0; y < explosionPieces.length; y++) {
      for (let x = 0; x < explosionPieces[0].length; x++) {
        if (!explosionPieces[y][x]) continue;

        this.canvasContext.fillRect(
          x * pieceWidth,
          y * pieceHeight,
          pieceWidth,
          pieceHeight
        );
      }
    }
    this.canvasContext.restore();
  }

  private drawBullets(bullets: IGameState["bullets"]) {
    for (const bullet of bullets) {
      this.drawBullet(bullet);
    }
  }

  private drawBullet(bullet: IGameState["bullets"][number]) {
    const { x, y } = this.getPixelPos(bullet.pos);
    const { w, h } = this.getPixelSize(bullet.size);

    this.canvasContext.fillStyle =
      bullet.from === "alien" ? "limegreen" : "white";
    this.canvasContext.fillRect(x, y, w, h);
  }

  private drawPlayer(player: IGameState["player"]) {
    if (player.status === "exploding") {
      this.drawExplosion(player.pos, DIMENSIONS.player);
      return;
    } else if (
      player.status === "alive" ||
      (player.status === "reviving" &&
        Math.round(performance.now() / 400) % 2 === 0)
    ) {
      const { x, y } = this.getPixelPos(player.pos);
      const { w, h } = this.getPixelSize(DIMENSIONS.player);

      this.canvasContext.fillStyle = "white";
      this.canvasContext.fillRect(x, y, w, h);
    }
  }

  private drawBoss(boss: IBoss) {
    if (boss.status === "exploding") {
      this.drawExplosion(boss.pos, DIMENSIONS.boss, colors.boss);
    } else {
      const { x, y } = this.getPixelPos(boss.pos);
      const { w, h } = this.getPixelSize(DIMENSIONS.boss);

      this.canvasContext.fillStyle = colors.boss;
      this.canvasContext.fillRect(x, y, w, h);
    }
  }

  private drawWalls(walls: IWall[]) {
    for (const wall of walls) {
      this.drawWall(wall);
    }
  }

  private drawWall(wall: IWall) {
    const { x, y } = this.getPixelPos(wall.pos);

    this.canvasContext.save();
    this.canvasContext.translate(x, y);

    const { w, h } = wall.pieceSize;
    const piecePixelWidth = this.horPixels(w),
      piecePixelHeight = this.verPixels(h);

    for (const { row, column, piece } of wall) {
      if (piece) {
        const xPixels = this.horPixels(column * w),
          yPixels = this.verPixels(row * h);

        this.canvasContext.fillStyle = "#ffffff";
        this.canvasContext.fillRect(
          xPixels,
          yPixels,
          piecePixelWidth,
          piecePixelHeight
        );
      }
    }

    this.canvasContext.restore();
  }

  /**
   * Draws metadata such as score, player remaining lives and so on.
   *
   * @param state
   */
  private drawMetadata(state: IGameState, timeStep: number) {
    // draw hearts to show player's lives
    // draw score
    const fontSize = this.getFontSize("md");
    const yPixelsPadding = this.verPixels(LAYOUT.padding.ver);

    this.canvasContext.fillStyle = "#fff";
    this.canvasContext.textBaseline = "top";
    this.canvasContext.font = `${fontSize}px ${this.canvasFontFamily}`;

    // draw the score of the player
    this.canvasContext.textAlign = "start";
    this.canvasContext.fillText(
      `SCORE ${state.player.score}`,
      this.horPixels(LAYOUT.padding.hor),
      yPixelsPadding
    );

    // draw how many lives the player has
    this.canvasContext.textAlign = "end";
    this.canvasContext.fillText(
      `Lives ${state.player.lives}`,
      this.horPixels(100 - LAYOUT.padding.hor),
      yPixelsPadding
    );

    // draw how many fps the game is running at
    const fps = Math.round(1 / timeStep);
    this.canvasContext.textAlign = "center";
    this.canvasContext.fillText(
      `${fps} FPS`,
      this.horPixels(50),
      yPixelsPadding
    );
  }

  private drawPauseHint() {
    const hintWidth = this.horPixels(24),
      hintHeight = this.verPixels(10);
    const hintXPos = this.horPixels(50) - hintWidth / 2,
      hintYPos = this.verPixels(50) - hintHeight / 2;

    this.canvasContext.fillStyle = "#fff";
    // the `- 3` part is just an adjustment
    this.canvasContext.fillRect(hintXPos, hintYPos - 4, hintWidth, hintHeight);

    const fontSize = this.getFontSize("lg");
    this.canvasContext.fillStyle = "#000";
    this.canvasContext.font = `${fontSize}px ${this.canvasFontFamily}`;
    this.canvasContext.textAlign = "center";
    this.canvasContext.textBaseline = "middle";
    this.canvasContext.fillText(
      "PAUSED",
      this.horPixels(50),
      this.verPixels(50)
    );
  }

  private drawInitialScreen() {
    this.drawTitle();
    this.drawTwinkleMessage("Press space to start");
  }

  private drawTitle() {
    const fontSize = this.getFontSize("xl");
    this.canvasContext.font = `${fontSize}px ${this.canvasFontFamily}`;

    const xPixelPos = this.horPixels(50),
      yPixelPos = this.verPixels(30);

    this.canvasContext.fillStyle = "white";
    this.canvasContext.textAlign = "center";
    this.canvasContext.fillText("SPACE", xPixelPos, yPixelPos);
    this.canvasContext.fillText("INVADERS", xPixelPos, yPixelPos + fontSize);
  }

  private drawTwinkleMessage(message: string) {
    if (Math.round(performance.now() / 800) % 2 === 0) {
      const fontSize = this.getFontSize("md");
      this.canvasContext.font = `${fontSize}px ${this.canvasFontFamily}`;
      this.canvasContext.textAlign = "center";
      this.canvasContext.fillStyle = "#fff";

      const xPixelPos = this.horPixels(50),
        yPixelPos = this.verPixels(75);

      this.canvasContext.fillText(message, xPixelPos, yPixelPos);
    }
  }

  /**
   * Draws a screen for when the game is over.
   */
  private drawGameOverScreen(state: IGameState) {
    const titleFontSize = this.getFontSize("xl");

    const {
      bossesKilled,
      aliensKilled,
      player: { score },
    } = state;

    const xPixelPos = this.horPixels(50),
      yPixelPos = this.verPixels(16);

    this.canvasContext.font = `${titleFontSize}px ${this.canvasFontFamily}`;
    this.canvasContext.fillStyle = "#f77";
    this.canvasContext.textAlign = "center";
    this.canvasContext.textBaseline = "top";

    this.canvasContext.fillText("GAME", xPixelPos, yPixelPos);
    this.canvasContext.fillText("OVER", xPixelPos, this.verPixels(27));

    const subtitleFontSize = this.getFontSize("md");

    this.canvasContext.font = `${subtitleFontSize}px ${this.canvasFontFamily}`;
    this.canvasContext.fillStyle = "#fff";

    const aliens = aliensKilled === 1 ? "alien" : "aliens";
    const bosses = bossesKilled === 1 ? "boss" : "bosses";
    this.canvasContext.fillText(
      `You killed ${aliensKilled} ${aliens} and ${bossesKilled} ${bosses}`,
      this.horPixels(50),
      this.verPixels(50)
    );
    this.canvasContext.fillText(
      `Your score is ${score}`,
      this.horPixels(50),
      this.verPixels(57)
    );

    this.drawTwinkleMessage("Press space to play again");
  }

  private drawPressEscMessage() {
    const fontSize = this.getFontSize("sm");

    const xPixelPos = this.horPixels(LAYOUT.padding.hor),
      yPixelPos = this.verPixels(8);

    this.canvasContext.font = `${fontSize}px ${this.canvasFontFamily}`;
    this.canvasContext.fillStyle = "#fff";
    this.canvasContext.textAlign = "left";
    this.canvasContext.textBaseline = "top";

    this.canvasContext.fillText(
      'Press "Esc" to pause/unpause',
      xPixelPos,
      yPixelPos
    );
  }
}
