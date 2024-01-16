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
    this.view = new View(
      this.state,
      {
        onPauseGame: this.handlePause.bind(this),
        onStartGame: this.handleStartGame.bind(this),
        onRestartGame: this.handleRestartGame.bind(this),
      },
      parent
    );
    this.view.syncState(this.state, 0);

    this.runGame();
  }

  private handlePause(this: GamePresenter) {
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

  private handleStartGame(this: GamePresenter) {
    if (this.state.status === "start") {
      this.state.status = "running";
    }
  }

  private handleRestartGame(this: GamePresenter) {
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

    this.state.update(timeStep, this.view.actions);
    this.view.syncState(this.state, timeStep);

    return true;
  }
}
