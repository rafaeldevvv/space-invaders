/**
 * @file Describes all types used in the game.
 */

/**
 * A two-dimensional position.
 */
interface Coords {
  x: number;
  y: number;
}

/**
 * This interface is meant to be used by the CanvasDisplay just
 * to make it clear what the method expects.
 *
 * @extends - Interface representing percentage coordinates.
 */
interface PixelCoords extends Coords {}

/**
 * A two-dimensional size
 */
interface Size {
  w: number;
  h: number;
}

/**
 * Just like {@link PixelCoords}, it is meant to improve clarity.
 *
 * @extends - Interface representing percentage sizes.
 */
interface PixelSize extends Size {}

/**
 * Strings representing the objects which can fire.
 */
type TShooters = "player" | "alien";

/**
 * String characters representing which kind of aliens can be created. These were chosen arbitrarily.
 *
 * `X` represents the lowest level alien.
 * `Y` represents the medium level alien.
 * `Z` represents the highest level alien.
 */
const alienTypes = ["X", "Y", "Z"] as const;
type TAliens = (typeof alienTypes)[number];

/**
 * It takes a union of strings and generate an object type whose
 * property names are the strings passed in and whose property values are booleans.
 */
type MappedObjectFromUnion<Keys extends string, Type> = {
  [Key in Keys]: Type;
};
type RemoveFirstElement<Type> = Type extends [infer A, ...infer R] ? R : never;

type GameKeys = " " | "ArrowLeft" | "ArrowRight";
// this is for methods that expect a keys tracker
type KeysTracker = MappedObjectFromUnion<GameKeys, boolean>;

/* helpers */
type NumOrNull = number | null;
type KeyboardEventHandler = (e: KeyboardEvent) => void;

/* Components */
type TStateStatuses = "lost" | "running" | "start" | "paused";

interface IVector {
  x: number;
  y: number;
  plus(other: IVector): IVector;
  minus(other: IVector): IVector;
  times(factor: number): IVector;
}

type AlienSetAlienStates = IAlien | null | "exploding";

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
  [Symbol.iterator]: Iterator<{
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

type BossStatuses = "alive" | "exploding" | "dead";

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

type PlayerStatuses = "alive" | "exploding" | "reviving";

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
  collide(objPos: Coords, objSize: Size): void;
  [Symbol.iterator]: Iterator<{ row: number; column: number; piece: boolean }>;
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

export {
  Coords,
  NumOrNull,
  KeyboardEventHandler,
  KeysTracker,
  GameKeys,
  RemoveFirstElement,
  MappedObjectFromUnion,
  TAliens,
  TShooters,
  Size,
  PixelCoords,
  PixelSize,
  IView,
  IGameState,
  TStateStatuses,
  IAlien,
  IAlienSet,
  IBoss,
  IBullet,
  IEnvironment,
  IGun,
  IPlayer,
  IVector,
  IWall,
  BossStatuses,
  PlayerStatuses,
  AlienBullet,
  PlayerBullet,
  AlienSetAlienStates,
  GameStateConstructor
};
