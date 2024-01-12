/**
 * @file Defines types related to events of any sort in the game.
 * @author Rafael Maia <https://rafaeldevvv.github.io/portfolio>
 */

import { MappedObjectFromUnion } from "./common";
type KeysTracker = MappedObjectFromUnion<GameKeys, boolean>;
type KeyboardEventHandler = (e: KeyboardEvent) => void;
type GameKeys = " " | "ArrowLeft" | "ArrowRight";

export type { KeysTracker, KeyboardEventHandler, GameKeys };
