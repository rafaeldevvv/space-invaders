import { ACTION_KEYS } from "@/game-config";
import { INITIAL_SCREEN_LAYOUT } from "../config";
import { drawTwinkleMessage, elt } from "../utils";
import BaseCanvasWrapper from "./BaseCanvasWrapper";

export default class InitialScreen extends BaseCanvasWrapper {
  private buttons: HTMLDivElement = elt("div", {
    className: "btn-container btn-container--state-start",
  });

  unregisterFunctions: (() => void)[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    private readonly onStartGame: () => void
  ) {
    super(canvas);
    this.setUpControlMethods();
  }
  
  private handleKeydown(this: InitialScreen, e: KeyboardEvent) {
    if (ACTION_KEYS.startGame === e.key) {
      e.preventDefault();
      console.log(this.onStartGame);
      this.onStartGame();
    }
  }
  
  private setUpControlMethods() {
    document.body.appendChild(this.buttons);
    const handler = (e: KeyboardEvent) => this.handleKeydown(e);
    window.addEventListener("keydown", handler);
    this.unregisterFunctions.push(() => {
      window.removeEventListener("keydown", handler);
    });
    this.createMobileControls();
  }

  private createMobileControls() {
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

  public unset() {
    this.buttons.textContent = "";
    this.buttons.remove();
    this.unregisterFunctions.forEach(f => f());
    this.unregisterFunctions = [];
  }

  syncState() {
    this.clearScreen();
    if (this.buttons.textContent === "") this.setUpControlMethods();

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
      yPixelPos = this.verPixels(30);

    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("SPACE", xPixelPos, yPixelPos);
    this.ctx.fillText("INVADERS", xPixelPos, yPixelPos + fontSize);
  }
}
