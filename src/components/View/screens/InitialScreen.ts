import { INITIAL_SCREEN_LAYOUT } from "../config";
import { drawTwinkleMessage } from "../utils";
import BaseCanvasWrapper from "./BaseCanvasWrapper";

export default class InitialScreen extends BaseCanvasWrapper {
  syncState() {
    this.clear();
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
    this.ctx.fillText("SPACE", xPixelPos, yPixelPos);
    this.ctx.fillText("INVADERS", xPixelPos, yPixelPos + fontSize);
  }
}
