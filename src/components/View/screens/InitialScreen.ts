import { ACTION_KEYS } from "@/game-config";
import { INITIAL_SCREEN_LAYOUT } from "../config";
import { drawTwinkleMessage, elt } from "../utils";
import BaseScreen from "./BaseScreen";
import { alienTypesConfig } from "@/components/Alien/config";
import { IGameState, Size, TAliens } from "@/ts/types";

import { aliensSprite, bossImage, arrowKeys, spaceKey } from "../images";

type InvaderScore = {
  score: number | null;
  iconSize: Size;
  image: HTMLImageElement;
  tiles: [x: number, y: number];
  imageSize: [w: number, h: number];
};

const invadersScores: InvaderScore[] = (
  Object.keys(alienTypesConfig) as TAliens[]
).map((c, i) => ({
  image: aliensSprite,
  score: alienTypesConfig[c].score,
  iconSize: { w: 3.5, h: 5 },
  tiles: [i * 200, 0],
  imageSize: [100, 100],
}));
invadersScores.push({
  score: null,
  iconSize: { w: 10, h: 6.5 },
  image: bossImage,
  tiles: [0, 0],
  imageSize: [bossImage.naturalWidth, bossImage.naturalHeight],
});

const keysTiles = {
  left: 0,
  right: 150,
  up: 300,
  down: 450,
} as const;

const squareKeySize = [5, 6.5] as const,
  rectangleKeySize = [26, 6.5] as const;

export default class InitialScreen extends BaseScreen {
  protected mobileButtons: HTMLDivElement = elt("div", {
    className: "btn-container btn-container--state-start",
  });

  constructor(
    canvas: HTMLCanvasElement,
    private readonly onStartGame: () => void
  ) {
    super(canvas);
    this.setUpControlMethods();
  }

  protected handleKeydown(this: InitialScreen, e: KeyboardEvent) {
    if (ACTION_KEYS.startGame === e.key) {
      e.preventDefault();
      this.onStartGame();
    }
  }

  protected setUpControlMethods() {
    document.body.appendChild(this.mobileButtons);
    const handler = (e: KeyboardEvent) => this.handleKeydown(e);
    window.addEventListener("keydown", handler);
    this.unregisterFunctions.push(() => {
      window.removeEventListener("keydown", handler);
    });
    this.createMobileControls();
  }

  protected createMobileControls() {
    const startBtn = elt(
      "button",
      {
        className: "start-btn btn-container__btn",
        onclick: this.onStartGame,
      },
      "start"
    );

    this.mobileButtons.appendChild(startBtn);
  }

  syncState(state: IGameState) {
    this.clearScreen();

    this.drawTitle();
    this.drawBestScore(state.player.bestScore);
    this.drawScores();
    const messagePos = this.getPixelPos({
      y: INITIAL_SCREEN_LAYOUT.pressMessageYPos,
      x: 5,
    });
    drawTwinkleMessage(this.ctx, "Press space to start", messagePos, {
      fontSize: this.getFontSize("md"),
      fontFamily: this.fontFamily,
      align: "start",
    });
    this.drawKeysGuide();
  }

  protected drawTitle() {
    const fontSize = this.getFontSize("xl");
    const { ctx } = this;
    ctx.font = `${fontSize}px ${this.fontFamily}`;

    const xPixelPos = this.horPixels(5),
      yPixelPos = this.verPixels(8);

    ctx.fillStyle = "white";
    ctx.textAlign = "start";
    ctx.textBaseline = "hanging";
    ctx.fillText("SPACE", xPixelPos, yPixelPos);
    const spaceMetrics = ctx.measureText("SPACE");
    const { actualBoundingBoxDescent: h } = spaceMetrics;
    ctx.fillText("INVADERS", xPixelPos, yPixelPos + h + this.verPixels(1));
  }

  private drawBestScore(bestScore: number) {
    if (bestScore === 0) return;

    const { ctx } = this;
    this.ctx.font = `${this.getFontSize("md")}px ${this.fontFamily}`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    ctx.fillText(
      `Your Best Score is ${bestScore}`,
      this.horPixels(5),
      this.verPixels(34)
    );
  }

  private drawKeysGuide() {
    const titleFontSize = this.getFontSize("lg"), // For "CONTROLS"
      bodyFontSize = this.getFontSize("md"); // For text following keys

    const { ctx } = this;
    ctx.font = `${titleFontSize}px ${this.fontFamily}`;
    ctx.textAlign = "start";
    ctx.textBaseline = "hanging"; // only for the title

    let y = this.verPixels(45);
    const x = this.horPixels(5);

    ctx.fillText("CONTROLS", x, y);
    const controlsMetrics = ctx.measureText("CONTROLS");
    y += this.verPixels(4) + controlsMetrics.actualBoundingBoxDescent;

    ctx.font = `${bodyFontSize}px ${this.fontFamily}`;

    const [keyW, keyH] = squareKeySize,
      keyPixelW = this.horPixels(keyW),
      keyPixelH = this.verPixels(keyH),
      horGap = this.horPixels(1);

    ctx.drawImage(
      arrowKeys,
      keysTiles.left,
      0,
      150,
      150,
      x,
      y,
      keyPixelW,
      keyPixelH
    );
    ctx.drawImage(
      arrowKeys,
      keysTiles.right,
      0,
      150,
      150,
      x + keyPixelW + horGap,
      y,
      keyPixelW,
      keyPixelH
    );
    ctx.textBaseline = "middle";
    ctx.fillText(
      "-> MOVEMENT",
      x + keyPixelW * 2 + horGap * 2,
      y + keyPixelH / 2
    );

    y += keyPixelH + this.verPixels(2);

    const [spaceW, spaceH] = rectangleKeySize,
      spacePixelW = this.horPixels(spaceW),
      spacePixelH = this.verPixels(spaceH);

    ctx.drawImage(spaceKey, x, y, spacePixelW, spacePixelH);
    ctx.fillText("-> FIRE", x + spacePixelW + horGap, y + spacePixelH / 2);
  }

  protected drawScores() {
    const baseYPos = 10;

    /* the position of the right edge of the icon */
    const baseXPos = this.horPixels(73);
    /* the space between the icon, the equals sign and the score */
    const gap = this.horPixels(1.5);

    const { ctx } = this;

    ctx.font = `${this.getFontSize("md")}px ${this.fontFamily}`;
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "start";

    invadersScores.forEach(
      ({ iconSize, score, image, tiles, imageSize }, i) => {
        const { w, h } = this.getPixelSize(iconSize);
        const y = this.verPixels(baseYPos + i * 7);

        ctx.save();
        ctx.translate(baseXPos, y);

        ctx.save();

        ctx.translate(-w, 0);
        ctx.drawImage(
          image,
          tiles[0],
          tiles[1],
          imageSize[0],
          imageSize[1],
          0,
          0,
          w,
          h
        );

        ctx.restore();

        ctx.translate(gap, h / 2);
        ctx.fillText("=", 0, 0);
        const equalsSignMetrics = ctx.measureText("=");
        ctx.translate(gap + equalsSignMetrics.width, 0);
        ctx.fillText(score === null ? "????" : score + " points", 0, 0);

        ctx.restore();
      }
    );
  }
}
