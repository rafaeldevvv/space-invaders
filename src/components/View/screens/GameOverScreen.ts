import { drawTwinkleMessage, elt } from "../utils";
import { IGameState } from "@/ts/types";
import BaseScreen from "./BaseScreen";
import { GAMEOVER_SCREEN_LAYOUT } from "../config";
import { ACTION_KEYS } from "@/game-config";
import MobileVolumeSlider from "../dom-components/mobile-volume-slider";

export default class GameOverScreen extends BaseScreen {
  protected mobileButtons: HTMLDivElement = elt("div", {
    className: "btn-container btn-container--state-lost",
  });

  protected mobileVolumeSlider!: MobileVolumeSlider;

  constructor(
    canvas: HTMLCanvasElement,
    public state: IGameState,
    private readonly onRestartGame: () => void,
    private readonly onChangeVolume: (newVolume: number) => void
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
    const restartBtn = elt(
      "button",
      {
        className: "restart-btn btn-container__btn",
        onclick: this.onRestartGame,
      },
      "restart"
    );

    const volumeSlider = new MobileVolumeSlider(
      this.state.volume,
      this.onChangeVolume
    );
    this.mobileVolumeSlider = volumeSlider;

    this.mobileButtons.appendChild(restartBtn);
    this.mobileButtons.appendChild(volumeSlider.container);
  }

  public syncState(state: IGameState) {
    this.clearScreen();

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
    this.drawVolumeHint(state.volume, GAMEOVER_SCREEN_LAYOUT.soundHintPos);
    this.mobileVolumeSlider.update(state.volume);
  }

  private drawTitle() {
    const xPixelPos = this.horPixels(50),
      yPixelPos = this.verPixels(11);

    this.setFontSize("xl");
    this.ctx.fillStyle = "#f77";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";

    this.ctx.fillText("GAME", xPixelPos, yPixelPos);
    this.ctx.fillText("OVER", xPixelPos, yPixelPos + this.verPixels(11));
  }

  private drawStateData(state: IGameState) {
    const {
      bossesKilled,
      aliensKilled,
      player: { score, bestScore },
    } = state;

    this.setFontSize("md");
    this.ctx.fillStyle = "#fff";

    const aliens = aliensKilled === 1 ? "alien" : "aliens";
    const bosses = bossesKilled === 1 ? "boss" : "bosses";
    this.ctx.fillText(
      `You killed ${aliensKilled} ${aliens} and ${bossesKilled} ${bosses}`,
      this.horPixels(50),
      this.verPixels(45)
    );
    this.ctx.fillText(
      `Your score is ${score}`,
      this.horPixels(50),
      this.verPixels(52)
    );
    this.ctx.fillText(
      `Your best score is ${bestScore}`,
      this.horPixels(50),
      this.verPixels(59)
    );
  }
}
