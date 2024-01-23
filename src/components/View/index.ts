import {
  IGameState,
  IView,
  RunningActionsTracker,
  RunningScreenActions,
  TStateStatuses,
  ViewHandlers,
  Screen
} from "@/ts/types";
import { getElementInnerDimensions } from "./utils";
import { GAME_DISPLAY } from "./config";

import InitialScreen from "./screens/InitialScreen";
import GameOverScreen from "./screens/GameOverScreen";
import RunningGameScreen from "./screens/RunningGameScreen";

import "./styles/buttons.css";

/**
 * Class represeting a view component used to display the game state.
 * It uses the HTML Canvas API.
 *
 * @implements {IView<IGameState>}
 */
export default class CanvasView implements IView {
  private canvas: HTMLCanvasElement;

  private currentScreen: Screen;

  /** The actions the player is currently performing. */
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

    this.currentScreen = new InitialScreen(this.canvas, handlers.onStartGame);

    this.defineEventListeners();
    this.adaptDisplaySize();
    this.syncState(state, 0);
  }

  /**
   * Adapts the size of the canvas based on the size of the its parent element.
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
   * Cleans up the current screen for the next screen
   * by removing event listeners, dom elements and so on.
   * It doesn't handle clean up from "running" to "pause"
   * or vice-versa, though, because both statuses happen in
   * the same screen.
   *
   * @param newStateStatus - The status represeting the new screen.
   */
  public cleanUpFor(newStateStatus: TStateStatuses) {
    switch (newStateStatus) {
      case "start": {
        break;
      }
      case "running": {
        this.currentScreen.cleanUp();
        this.currentScreen = new RunningGameScreen(
          this.canvas,
          this.syncAction.bind(this),
          this.handlers.onPauseGame
        );
        break;
      }
      case "lost": {
        this.currentScreen.cleanUp();
        this.currentScreen = new GameOverScreen(
          this.canvas,
          this.handlers.onRestartGame
        );
        break;
      }
    }
  }

  /**
   * Synchonizes the view with a new model (state).
   * Even though the game is using a mutable approach,
   * this handles new states because maybe i can change
   * my mind later.
   *
   * @param state - A new game state.
   */
  public syncState(this: CanvasView, state: IGameState, timeStep: number) {
    this.state = state;
    if (state.status === "lost") {
      const actions = Object.keys(this.actions) as RunningScreenActions[];
      actions.forEach((a) => (this.actions[a] = false));
    }

    this.currentScreen.syncState(state, timeStep);
  }

  private defineEventListeners() {
    window.addEventListener("resize", () => this.adaptDisplaySize());
  }

  private syncAction(action: RunningScreenActions, pressed: boolean) {
    this.actions[action] = pressed;
  }
}
