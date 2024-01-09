import { MappedObjectFromUnion } from "./helpers";
type KeysTracker = MappedObjectFromUnion<GameKeys, boolean>;
type KeyboardEventHandler = (e: KeyboardEvent) => void;
type GameKeys = " " | "ArrowLeft" | "ArrowRight";

export type { KeysTracker, KeyboardEventHandler, GameKeys };
