import {
  IView,
  IGameState,
  GameStateConstructor,
  ViewConstructor,
} from "@/ts/types";
import aliensPlan from "@/plans/alien-set";
import { runAnimation } from "./utils";
import { TStateStatuses } from "@/ts/types";
import { ACTION_KEYS } from "@/game-config";
import * as audiosWrapper from "@/audios";

/**
 * A class responsible for managing the flow of information
 * between model (state) and view (display).
 */
export default class GamePresenter {
  private state: IGameState;
  private view: IView;
  private status: TStateStatuses = "start";
  private bestScore: number;

  constructor(
    private readonly State: GameStateConstructor,
    View: ViewConstructor,
    parent: HTMLElement
  ) {
    this.bestScore = this.getBestScore();
    this.state = State.start(aliensPlan, this.bestScore);
    this.view = new View(
      this.state,
      {
        onPauseGame: this.handlePause.bind(this),
        onStartGame: this.handleStartGame.bind(this),
        onRestartGame: this.handleRestartGame.bind(this),
        onChangeVolume: (newVolume) => {
          this.view.syncState(this.state, 1 / 60);
          audiosWrapper.setVolume(newVolume);
        },
      },
      parent
    );
    this.view.syncState(this.state, 0);

    this.view.keyDownHandlers.set(ACTION_KEYS.turnDownVolume, () => {
      audiosWrapper.turnDownVolume();
      if (this.state.status === "paused")
        this.view.syncState(this.state, 1 / 60);
    });
    this.view.keyDownHandlers.set(ACTION_KEYS.turnUpVolume, () => {
      audiosWrapper.turnUpVolume();
      if (this.state.status === "paused")
        this.view.syncState(this.state, 1 / 60);
    });

    this.runGame();
  }

  private getBestScore() {
    const bestScore = localStorage.getItem("bestScore");
    return bestScore === null ? 0 : Number(bestScore);
  }

  private setBestScore(score: number) {
    localStorage.setItem("bestScore", score.toString());
    this.bestScore = score;
  }

  private handlePause(this: GamePresenter) {
    if (this.state.status !== "running" && this.state.status !== "paused") {
      return;
    }

    if (this.state.status === "paused") {
      this.state.status = "running";
      this.status = "running";
      this.state.boss?.startPitch();
      this.runGame();
    } else {
      this.state.boss?.stopPitch();
      this.state.status = "paused";
      this.status = "paused";
    }
  }

  private handleStartGame(this: GamePresenter) {
    if (this.state.status === "start") {
      this.state.status = "running";
    }
  }

  private handleRestartGame(this: GamePresenter) {
    if (this.state.status === "lost") {
      this.state = this.State.start(aliensPlan, this.bestScore);
      this.state.status = "running";
    }
  }

  private runGame(this: GamePresenter) {
    runAnimation((timeStep) => this.frame(timeStep));
  }

  private frame(this: GamePresenter, timeStep: number) {
    this.state.update(timeStep, this.view.actions);

    /* We don't want to clean up when we go from "running" to "paused"
    or vice-versa, so we check if the previous status was "paused" and
    inside the clean up function, we don't handle clean up for "paused" */
    if (this.state.status !== this.status) {
      /* i could do it in handleStartGame or handleRestartGame,
      but it wouldn't capture the change to "lost" */
      this.view.cleanUpFor(this.state.status);
      this.status = this.state.status;

      if (
        this.status === "lost" &&
        this.bestScore < this.state.player.bestScore
      ) {
        this.setBestScore(this.state.player.score);
      }
    }

    this.view.syncState(this.state, timeStep);
    if (this.state.status === "paused") return false;

    return true;
  }
}
