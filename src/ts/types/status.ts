import { IAlien } from "../types";

type TStateStatuses = "lost" | "running" | "start" | "paused";
type AlienSetAlienStates = IAlien | null | "exploding";
type BossStatuses = "alive" | "exploding" | "dead";
type PlayerStatuses = "alive" | "exploding" | "reviving";

export type {
  TStateStatuses,
  AlienSetAlienStates,
  BossStatuses,
  PlayerStatuses,
};
