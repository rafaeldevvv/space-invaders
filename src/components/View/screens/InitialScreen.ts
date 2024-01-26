import { ACTION_KEYS } from "@/game-config";
import { INITIAL_SCREEN_LAYOUT } from "../config";
import { drawTwinkleMessage, elt } from "../utils";
import BaseScreen from "./BaseScreen";
import { alienTypesConfig } from "@/components/Alien/config";
import { IGameState, Size, TAliens } from "@/ts/types";

import { aliensSprite, bossImage } from "../images";

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
      x: 50,
    });
    drawTwinkleMessage(this.ctx, "Press space to start", messagePos, {
      fontSize: this.getFontSize("md"),
      fontFamily: this.fontFamily,
    });
  }

  protected drawTitle() {
    const fontSize = this.getFontSize("xl");
    this.ctx.font = `${fontSize}px ${this.fontFamily}`;

    const xPixelPos = this.horPixels(50),
      yPixelPos = this.verPixels(13);

    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("SPACE", xPixelPos, yPixelPos);
    this.ctx.fillText("INVADERS", xPixelPos, yPixelPos + this.verPixels(12));
  }

  private drawBestScore(bestScore: number) {
    if (bestScore === 0) return;

    const { ctx } = this;
    this.ctx.font = `${this.getFontSize("md")}px ${this.fontFamily}`;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.fillText(
      `Your Best Score is ${bestScore}`,
      this.horPixels(50),
      this.verPixels(34)
    );
  }

  protected drawScores() {
    const baseYPos = 43;

    /* the position of the right edge of the icon */
    const baseXPos = this.horPixels(43);
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
