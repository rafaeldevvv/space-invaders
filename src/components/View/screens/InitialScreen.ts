import { ACTION_KEYS } from "@/game-config";
import { INITIAL_SCREEN_LAYOUT } from "../config";
import { drawTwinkleMessage, elt } from "../utils";
import BaseScreen from "./BaseScreen";
import { alienTypesConfig } from "@/components/Alien/config";
import { IGameState, PixelSize, Size, TAliens } from "@/ts/types";

import {
  aliensSprite,
  bossImage,
  arrowKeysSprite,
  spaceKeyImage,
} from "../images";

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

const arrowKeysSpriteHorOffset = {
  left: 0,
  right: 150,
  up: 300,
  down: 450,
} as const;

const arrowKeySize = [5, 6.5] as const,
  rectangleKeySize = [26, 6.5] as const;

const arrowKeySourceImageSize = 150;

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
    this.drawControlsGuide();
  }

  protected drawTitle() {
    this.setFontSize("xl");

    const { ctx } = this;

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
    this.setFontSize("md");
    ctx.fillStyle = "#fff";
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    ctx.fillText(
      `Your Best Score is ${bestScore}`,
      this.horPixels(5),
      this.verPixels(34)
    );
  }

  private drawControlsGuide() {
    this.setFontSize("lg"); // for `CONTROLS`

    const { ctx } = this;
    ctx.textAlign = "start";
    ctx.textBaseline = "hanging"; // only for the title

    ctx.save();
    const y = this.verPixels(45),
      x = this.horPixels(5);

    ctx.translate(x, y);

    ctx.fillText("CONTROLS", 0, 0);
    const controlsMetrics = ctx.measureText("CONTROLS");
    ctx.translate(
      0,
      this.verPixels(4) + controlsMetrics.actualBoundingBoxDescent // move down with a gap
    );

    this.setFontSize("md");

    const [arrowW, arrowH] = arrowKeySize,
      arrrowKeyPixelW = this.horPixels(arrowW),
      arrowKeyPixelH = this.verPixels(arrowH),
      horGap = this.horPixels(1),
      verGap = this.verPixels(2);

    const { left, right } = arrowKeysSpriteHorOffset;
    const sequenceWidth = this.drawSpriteSequence(
      arrowKeysSprite,
      arrowKeySourceImageSize,
      { w: arrrowKeyPixelW, h: arrowKeyPixelH },
      horGap,
      [left, right]
    );

    ctx.textBaseline = "middle";

    ctx.save(); // save for horizontal translation
    // move to the right side of the images and down the middle of it
    ctx.translate(sequenceWidth + horGap, arrowKeyPixelH / 2); 
    ctx.fillText("-> MOVEMENT", 0, 0);
    ctx.restore();

    // move down below the sequence above with a gap
    ctx.translate(0, arrowKeyPixelH + verGap);

    const [spaceW, spaceH] = rectangleKeySize,
      spacePixelW = this.horPixels(spaceW),
      spacePixelH = this.verPixels(spaceH);

    ctx.drawImage(spaceKeyImage, 0, 0, spacePixelW, spacePixelH);

    // move to the right side of the image and down the middle of it
    ctx.translate(spacePixelW + horGap, spacePixelH / 2); 

    ctx.fillText("-> FIRE", 0, 0);

    ctx.restore();
  }

  /**
   * Draws a horizontal sequence of images in a sprite.
   * All images in the sprite must be same-sized squares.
   * The images are drawn at the origin (0, 0), so you should
   * use `context.translate()` before calling this method.
   *
   * @param sprite - The sprite itself.
   * @param sourceImageSize - The size of each image in the sprite in pixels.
   * @param targetImageSize - The size with which each image will be drawn onto the canvas in pixels.
   * @param offsets - The offsets from the horizontal origin (0) in pixels.
   * @param gap - The gaps between the images in the sequence in pixels.
   * @returns - The width of the sequence in pixels.
   */
  private drawSpriteSequence(
    sprite: HTMLImageElement,
    sourceImageSize: number,
    targetImageSize: PixelSize,
    gap: number,
    offsets: number[]
  ) {
    const { ctx } = this;
    let width = 0;
    ctx.save();
    offsets.forEach((os) => {
      ctx.drawImage(
        sprite,
        os,
        0,
        sourceImageSize,
        sourceImageSize,
        0,
        0,
        targetImageSize.w,
        targetImageSize.h
      );
      width += targetImageSize.w + gap;
      ctx.translate(targetImageSize.w + gap, 0);
    });
    ctx.restore();
    return width;
  }

  protected drawScores() {
    const baseYPos = 10;

    /* the position of the right edge of the icon */
    const baseXPos = this.horPixels(73);
    /* the space between the icon, the equals sign and the score */
    const gap = this.horPixels(1.5);

    const { ctx } = this;

    this.setFontSize("md");
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
