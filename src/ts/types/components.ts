import { Size, Coords, TShooters, TAliens } from "./common";
import {
  TStateStatuses,
  PlayerStatuses,
  AlienSetAlienStates,
  BossStatuses,
} from "./status";
import { KeysTracker, KeyboardEventHandler } from "./events";

interface IVector {
  x: number;
  y: number;
  plus(other: IVector): IVector;
  minus(other: IVector): IVector;
  times(factor: number): IVector;
}

interface IAlienSet {
  pos: IVector;
  size: Size;
  numColumns: number;
  numRows: number;
  aliens: AlienSetAlienStates[][];
  alive: number;
  entering: boolean;
  update(timeStep: number): void;
  adapt(): void;
  getAlienPos({ x, y }: Coords): IVector;
  removeAlien(alien: IAlien): void;
  [Symbol.iterator](): Iterator<{
    alien: IAlien | null | "exploding";
    row: number;
    column: number;
  }>;
}

interface IAlien {
  readonly actorType: "alien";
  gridPos: Coords;
  readonly score: number;
  readonly gun: IGun;
  readonly alienType: TAliens;
  fire(alienPos: Coords): IBullet | null;
}

interface IBoss {
  timeSinceDeath: number;
  status: BossStatuses;
  pos: IVector;
  update(timeStep: number): void;
  isOutOfBounds(): boolean;
}

interface IBullet {
  readonly from: TShooters;
  pos: IVector;
  readonly speed: IVector;
  readonly size: Size;
  update(timeStep: number): void;
  collide(state: IGameState): void;
}

type AlienBullet = IBullet & { from: "alien" };
type PlayerBullet = IBullet & { from: "player" };

interface IEnvironment {
  alienSet: IAlienSet;
  player: IPlayer;
  walls: IWall[];
  isBulletOutOfBounds(bullet: IBullet): boolean;
  alienSetTouchesPlayer(): boolean;
  handleAlienSetContactWithWall(): void;
  bulletTouchesObject(bullet: IBullet, objPos: Coords, objSize: Size): boolean;
}

interface IGun {
  bulletSize: Size;
  owner: TShooters;
  fireInterval: number;
  timeSinceLastShot: number;
  fire(pos: IVector, direction: "up" | "down"): IBullet | null;
  update(timeStep: number): void;
  canFire(): boolean;
}

interface IPlayer {
  readonly actorType: "player";
  pos: IVector;
  readonly gun: IGun;
  lives: number;
  score: number;
  status: PlayerStatuses;
  fire(): IBullet;
  resetPos(): void;
  update(state: IGameState, timeStep: number, keys: KeysTracker): void;
}

interface IWall {
  readonly piecesMatrix: boolean[][];
  readonly pieceSize: Size;
  readonly pos: Coords;
  readonly size: Size;
  getPiecePos(column: number, row: number): Coords;
  collide(objPos: Coords, objSize: Size): boolean;
  [Symbol.iterator](): Iterator<{
    row: number;
    column: number;
    piece: boolean;
  }>;
}

interface IGameState {
  bullets: IBullet[];
  status: TStateStatuses;
  boss: IBoss | null;
  bossesKilled: number;
  aliensKilled: number;
  isPlayerBulletPresent: boolean;
  alienSet: IAlienSet;
  player: IPlayer;
  env: IEnvironment;
  update(timeStep: number, keys: KeysTracker): void;
}

interface GameStateConstructor {
  new (alienSet: IAlienSet, player: IPlayer, env: IEnvironment): IGameState;
  start(plan: string): IGameState;
}

interface IView<State> {
  syncState(state: State, timeStep: number): void;
  setDisplaySize(): void;
  trackedKeys: KeysTracker;
  addKeyHandler(key: string, handler: KeyboardEventHandler): void;
}

export type {
  IView,
  GameStateConstructor,
  IGameState,
  IAlien,
  IAlienSet,
  IBoss,
  IPlayer,
  IEnvironment,
  IWall,
  IGun,
  IBullet,
  PlayerBullet,
  AlienBullet,
};
