/**
 * @file Defines types related to events of any sort in the game.
 * @author Rafael Maia <https://rafaeldevvv.github.io/portfolio>
 */

import { MappedObjectFromUnion } from "./common";
type KeysTracker = MappedObjectFromUnion<GameKeys, boolean>;
type KeyboardEventHandler = (e: KeyboardEvent) => void;
type GameKeys = " " | "ArrowLeft" | "ArrowRight";

type RunningScreenActions = "moveRight" | "moveLeft" | "fire";

type StartScreenActions = "startGame";
type LostScreenActions = "restartGame";

type Actions = RunningScreenActions & StartScreenActions & LostScreenActions;
type RunningActionsTracker = MappedObjectFromUnion<
  RunningScreenActions,
  boolean
>;

export type {
  KeysTracker,
  KeyboardEventHandler,
  GameKeys,
  Actions,
  RunningActionsTracker,
  RunningScreenActions,
  StartScreenActions,
  LostScreenActions,
};
