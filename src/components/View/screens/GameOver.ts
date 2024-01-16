import { drawTwinkleMessage, elt } from "../utils";
import { IGameState } from "@/ts/types";
import BaseCanvasWrapper from "./BaseCanvasWrapper";
import { GAMEOVER_SCREEN_LAYOUT } from "../config";
import { ACTION_KEYS } from "@/game-config";

export default class GameOver extends BaseCanvasWrapper {
  private buttons: HTMLDivElement = elt("div", {
    className: "btn-container btn-container--state-restart",
  });

  private unregisterFunctions: (() => void)[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    private readonly onRestartGame: () => void
  ) {
    super(canvas);
    this.setUpControlMethods();
  }

  private handleKeydown(e: KeyboardEvent) {
    if (e.key === ACTION_KEYS.restartGame) {
      e.preventDefault();
      this.onRestartGame();
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
    const restartBtn = elt(
      "button",
      {
        className: "restart-btn btn-container__btn",
        onclick: this.onRestartGame,
      },
      "restart"
    );

    this.buttons.appendChild(restartBtn);
  }

  public syncState(state: IGameState) {
    this.clearScreen();
    if (this.buttons.textContent === "") this.setUpControlMethods();
    this.drawTitle();
    this.drawStateData(state);

    const messagePos = this.getPixelPos({
      y: GAMEOVER_SCREEN_LAYOUT.pressMessageYPos,
      x: 50,
    });
    drawTwinkleMessage(this.ctx, "Press space to play again", messagePos, {
      fontSize: this.getFontSize("md"),
      fontFamily: this.fontFamily,
    });
  }

  public unset() {
    this.buttons.textContent = "";
    this.buttons.remove();
    window.removeEventListener("keydown", this.handleKeydown);
  }

  private drawTitle() {
    const titleFontSize = this.getFontSize("xl");

    const xPixelPos = this.horPixels(50),
      yPixelPos = this.verPixels(16);

    this.ctx.font = `${titleFontSize}px ${this.fontFamily}`;
    this.ctx.fillStyle = "#f77";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";

    this.ctx.fillText("GAME", xPixelPos, yPixelPos);
    this.ctx.fillText("OVER", xPixelPos, this.verPixels(27));
  }

  private drawStateData(state: IGameState) {
    const {
      bossesKilled,
      aliensKilled,
      player: { score },
    } = state;

    const subtitleFontSize = this.getFontSize("md");

    this.ctx.font = `${subtitleFontSize}px ${this.fontFamily}`;
    this.ctx.fillStyle = "#fff";

    const aliens = aliensKilled === 1 ? "alien" : "aliens";
    const bosses = bossesKilled === 1 ? "boss" : "bosses";
    this.ctx.fillText(
      `You killed ${aliensKilled} ${aliens} and ${bossesKilled} ${bosses}`,
      this.horPixels(50),
      this.verPixels(50)
    );
    this.ctx.fillText(
      `Your score is ${score}`,
      this.horPixels(50),
      this.verPixels(57)
    );
  }
}
