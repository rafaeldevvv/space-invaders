import { ACTION_KEYS } from "@/game-config";
import { INITIAL_SCREEN_LAYOUT } from "../config";
import { drawTwinkleMessage, elt } from "../utils";
import BaseCanvasWrapper from "./BaseCanvasWrapper";

export default class InitialScreen extends BaseCanvasWrapper {
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
    const messagePos = this.getPixelPos({
      y: INITIAL_SCREEN_LAYOUT.pressMessageYPos,
      x: 50,
    });
    drawTwinkleMessage(this.ctx, "Press space to start", messagePos, {
      fontSize: this.getFontSize("md"),
      fontFamily: this.fontFamily,
    });
  }

  private drawTitle() {
    const fontSize = this.getFontSize("xl");
    this.ctx.font = `${fontSize}px ${this.fontFamily}`;

    const xPixelPos = this.horPixels(50),
      yPixelPos = this.verPixels(23);

    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("SPACE", xPixelPos, yPixelPos);
    this.ctx.fillText("INVADERS", xPixelPos, yPixelPos + this.verPixels(12));
  }
}
