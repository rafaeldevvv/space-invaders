import {
  KeysTracker,
  KeyboardEventHandler,
  IGameState,
  IView,
} from "@/ts/types";
import { ACTION_KEYS } from "@/game-config";
import { getElementInnerDimensions, trackKeys } from "./utils";
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

  public trackedKeys = {} as KeysTracker;
  private keysHandlers: Map<string, KeyboardEventHandler[]> = new Map();

  /**
   * Creates a view component for the game that uses the Canvas API.
   *
   * @param state - The initial state of the game.
   * @param parent - The HTML Element used to display the view.
   */
  constructor(public state: IGameState, parent: HTMLElement) {
    this.canvas = document.createElement("canvas");

    this.canvas.style.display = "block";
    this.canvas.style.marginInline = "auto";

    parent.appendChild(this.canvas);

    this.initialScreen = new InitialScreen(this.canvas);
    this.runningGameScreen = new RunningGame(this.canvas);
    this.gameOverScreen = new GameOver(this.canvas);

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
    switch (state.status) {
      case "paused":
      case "running": {
        this.runningGameScreen.syncState(state, timeStep);
        break;
      }
      case "start": {
        this.initialScreen.syncState();
        break;
      }
      case "lost": {
        this.gameOverScreen.syncState(state);
        break;
      }
      default: {
        const _never: never = state.status;
        throw new Error("Unexpected state status", _never);
      }
    }
  }

  public addKeyHandler(
    this: CanvasView,
    key: string,
    handler: KeyboardEventHandler
  ) {
    if (this.keysHandlers.has(key)) {
      const handlers = this.keysHandlers.get(key)!;
      this.keysHandlers.set(key, [...handlers, handler]);
    } else {
      this.keysHandlers.set(key, [handler]);
    }
  }

  private defineEventListeners() {
    window.addEventListener("resize", () => this.adaptDisplaySize());
    window.addEventListener("keydown", (e) => {
      if (this.keysHandlers.has(e.key)) {
        const handlers = this.keysHandlers.get(e.key)!;
        handlers.forEach((h) => h(e));
      }
    });

    this.trackedKeys = trackKeys([
      ACTION_KEYS.moveLeft,
      ACTION_KEYS.moveRight,
      ACTION_KEYS.fire,
    ]);
  }
}
