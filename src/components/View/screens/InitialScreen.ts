import { ACTION_KEYS } from "@/game-config";
import { INITIAL_SCREEN_LAYOUT } from "../config";
import { drawTwinkleMessage, elt } from "../utils";
import BaseScreen from "./BaseScreen";
import { alienTypesConfig } from "@/components/Alien/config";
import { aliensPieces, bossPieces } from "../config";
import { alienTypes } from "@/components/Alien/config";
import { IIterablePieces, Size } from "@/ts/types";

type TAlienTypes = (typeof alienTypes)[number];

type ScoreShowcase = {
  pieces: IIterablePieces;
  score: number | null;
  iconSize: Size;
  color?: string;
};

const scoreShowcases: ScoreShowcase[] = (
  Object.keys(alienTypesConfig) as TAlienTypes[]
).map((c) => ({
  pieces: aliensPieces[c][0],
  score: alienTypesConfig[c].score,
  iconSize: { w: 3.5, h: 5 },
}));
scoreShowcases.push({
  pieces: bossPieces,
  score: null,
  iconSize: { w: 6, h: 6.5 },
  color: "#f77",
});

export default class InitialScreen extends BaseScreen {
  protected buttons: HTMLDivElement = elt("div", {
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
    document.body.appendChild(this.buttons);
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

    this.buttons.appendChild(startBtn);
  }

  syncState() {
    this.clearScreen();

    this.drawTitle();
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
      yPixelPos = this.verPixels(18);

    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("SPACE", xPixelPos, yPixelPos);
    this.ctx.fillText("INVADERS", xPixelPos, yPixelPos + this.verPixels(12));
  }

  protected drawScores() {
    const baseY = 43;

    const baseX = this.horPixels(43);
    const gap = this.horPixels(1.5);

    this.ctx.font = `${this.getFontSize("md")}px ${this.fontFamily}`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "start";

    scoreShowcases.forEach(({ iconSize, pieces, score, color }, i) => {
      const { w, h } = this.getPixelSize(iconSize);
      const y = this.verPixels(baseY + i * 7);

      this.ctx.save();
      this.ctx.translate(baseX, y);

      this.ctx.save();

      this.ctx.translate(-w, 0);
      this.drawPieces(
        pieces,
        {
          w: w / pieces.numOfColumns,
          h: h / pieces.numOfRows,
        },
        color
      );

      this.ctx.restore();

      this.ctx.translate(gap, h / 2);
      this.ctx.fillText("=", 0, 0);
      const equalSignMeasures = this.ctx.measureText("=");
      this.ctx.translate(gap + equalSignMeasures.width, 0);
      this.ctx.fillText(score === null ? "????" : score + " points", 0, 0);

      this.ctx.restore();
    });
  }
}
