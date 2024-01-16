import {
  IGameState,
  IView,
  RunningActionsTracker,
  RunningScreenActions,
  ViewHandlers,
} from "@/ts/types";
import { getElementInnerDimensions } from "./utils";
import { GAME_DISPLAY } from "./config";

import InitialScreen from "./screens/InitialScreen";
import GameOver from "./screens/GameOver";
import RunningGame from "./screens/RunningGame";

/**
 * Class represeting a view component used to display the game state.
 * It uses the HTML Canvas API.
 *
 * @implements {IView<IGameState>}
 */
export default class CanvasView implements IView<IGameState> {
  private canvas: HTMLCanvasElement;

  /* screens */
  private initialScreen: InitialScreen;
  private runningGameScreen: RunningGame;
  private gameOverScreen: GameOver;

  public actions = {} as RunningActionsTracker;

  /**
   * Creates a view component for the game that uses the Canvas API.
   *
   * @param state - The initial state of the game.
   * @param parent - The HTML Element used to display the view.
   */
  constructor(
    public state: IGameState,
    private handlers: ViewHandlers,
    parent: HTMLElement
  ) {
    this.canvas = document.createElement("canvas");

    this.canvas.style.display = "block";
    this.canvas.style.marginInline = "auto";

    parent.appendChild(this.canvas);

    this.initialScreen = new InitialScreen(this.canvas, handlers.onStartGame);
    this.runningGameScreen = new RunningGame(
      this.canvas,
      this.syncAction.bind(this),
      handlers.onPauseGame
    );
    this.gameOverScreen = new GameOver(this.canvas, handlers.onRestartGame);

    this.defineEventListeners();
    this.adaptDisplaySize();
    this.syncState(state, 0);
  }

  /**
   * Sets the size of the canvas based on the size of the its parent element.
   */
  public adaptDisplaySize(this: CanvasView) {
    let canvasWidth = Math.min(
      GAME_DISPLAY.maxWidth,
      getElementInnerDimensions(this.canvas.parentNode as HTMLElement).w
    );

    let canvasHeight = canvasWidth / GAME_DISPLAY.aspectRatio;

    if (canvasHeight > innerHeight) {
      canvasHeight = innerHeight;
      canvasWidth = canvasHeight * GAME_DISPLAY.aspectRatio;
    }

    this.canvas.setAttribute("width", canvasWidth.toString());
    this.canvas.setAttribute("height", canvasHeight.toString());
    this.syncState(this.state, 1 / 60); // 60 fps
  }

  /**
   * Synchonizes the view with a new model (state).
   *
   * @param state - A new game state.
   */
  public syncState(this: CanvasView, state: IGameState, timeStep: number) {
    if (state.status === "lost") {
      const actions = Object.keys(this.actions) as RunningScreenActions[];
      actions.forEach((a) => (this.actions[a] = false));
    }
    
    switch (state.status) {
      case "start": {
        this.initialScreen.syncState();
        this.runningGameScreen.unset();
        this.gameOverScreen.unset();
        break;
      }
      case "paused":
      case "running": {
        this.gameOverScreen.unset();
        this.initialScreen.unset();
        this.runningGameScreen.syncState(state, timeStep);
        break;
      }
      case "lost": {
        this.gameOverScreen.syncState(state);
        this.initialScreen.unset();
        this.runningGameScreen.unset();
        break;
      }
      default: {
        const _never: never = state.status;
        throw new Error("Unexpected state status", _never);
      }
    }
  }

  private defineEventListeners() {
    window.addEventListener("resize", () => this.adaptDisplaySize());
  }

  private syncAction(action: RunningScreenActions, pressed: boolean) {
    this.actions[action] = pressed;
  }
}
