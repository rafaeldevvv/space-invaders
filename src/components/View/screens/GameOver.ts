import { drawTwinkleMessage } from "../utils";
import { IGameState } from "@/ts/types";
import BaseCanvasWrapper from "./BaseCanvasWrapper";
import { GAMEOVER_SCREEN_LAYOUT } from "../config";

export default class GameOver extends BaseCanvasWrapper {
  syncState(state: IGameState) {
    this.clear();
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
