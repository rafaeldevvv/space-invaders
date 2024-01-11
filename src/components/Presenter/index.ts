import {
  IView,
  IGameState,
  GameStateConstructor,
  ViewConstructor,
} from "@/ts/types";
import { ACTION_KEYS } from "@/game-config";
import aliensPlan from "@/plans/alien-set";
import { runAnimation } from "./utils";

/**
 * A class responsible for managing the flow of information
 * between model (state) and view (display).
 */
export default class GamePresenter {
  State: GameStateConstructor;
  state: IGameState;
  view: IView<IGameState>;

  constructor(
    State: GameStateConstructor,
    View: ViewConstructor,
    parent: HTMLElement
  ) {
    this.State = State;
    this.state = State.start(aliensPlan);
    this.view = new View(this.state, parent);
    this.view.syncState(this.state, 0);

    this.runGame();
    this.addEventHandlers();
  }

  private addEventHandlers() {
    this.view.addKeyHandler(ACTION_KEYS.pauseGame, this.handlePause.bind(this));
    this.view.addKeyHandler(
      ACTION_KEYS.startGame,
      this.handleStartGame.bind(this)
    );
    this.view.addKeyHandler(
      ACTION_KEYS.restartGame,
      this.handleRestartGame.bind(this)
    );
  }

  private handlePause(this: GamePresenter, e: KeyboardEvent) {
    e.preventDefault();
    if (this.state.status !== "running" && this.state.status !== "paused") {
      return;
    }

    if (this.state.status === "paused") {
      this.state.status = "running";
      this.runGame();
    } else {
      this.state.status = "paused";
    }
  }

  private handleStartGame(this: GamePresenter, e: KeyboardEvent) {
    e.preventDefault();

    if (this.state.status === "start") {
      this.state.status = "running";
    }
  }

  private handleRestartGame(this: GamePresenter, e: KeyboardEvent) {
    e.preventDefault();

    if (this.state.status === "lost") {
      this.state = this.State.start(aliensPlan);
      this.state.status = "running";
    }
  }

  private runGame(this: GamePresenter) {
    runAnimation((timeStep) => this.frame(timeStep));
  }

  private frame(this: GamePresenter, timeStep: number) {
    if (this.state.status === "paused") {
      this.view.syncState(this.state, timeStep);
      return false;
    }

    this.state.update(timeStep, this.view.trackedKeys);
    this.view.syncState(this.state, timeStep);

    return true;
  }
}
