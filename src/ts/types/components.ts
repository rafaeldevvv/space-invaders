/**
 * @file Defines types that describe the components of the game.
 * @author Rafael Maia <https://rafaeldevvv.github.io/portfolio>
 */

import { Size, Coords, TShooters, TAliens, IVector } from "./common";
import {
  TStateStatuses,
  PlayerStatuses,
  AlienSetAlienStates,
  BossStatuses,
} from "./status";
import { KeysTracker, KeyboardEventHandler } from "./events";

/**
 * A wrapper for a set of {@link Alien}s
 */
interface IAlienSet {
  pos: IVector;
  size: Size;
  numColumns: number;
  numRows: number;
  aliens: AlienSetAlienStates[][];

  /**
   * The number of aliens that are currently alive.
   */
  alive: number;

  /**
   * Tracks the alien set entrance animation.
   */
  entering: boolean;
  update(timeStep: number): void;

  /**
   * Adapts the alien set, so that it has a correct size and position.
   */
  adapt(): void;

  /**
   * Gets the absolute position of an alien within the view.
   *
   * @param param0
   */
  getAlienPos({ x, y }: Coords): IVector;

  /**
   * Removes an alien from the set.
   *
   * @param alien
   */
  removeAlien(alien: IAlien): void;

  /**
   * Iterates through the AlienSet, yielding every alien in the set,
   * and also the alien's row and column.
   */
  [Symbol.iterator](): Iterator<{
    alien: IAlien | null | "exploding";
    row: number;
    column: number;
  }>;
}

interface IAlien {
  /**
   * What kind of object it is.
   */
  readonly actorType: "alien";

  gridPos: Coords;
  readonly score: number;
  readonly gun: IGun;

  /**
   * What kind of alien it is.
   */
  readonly alienType: TAliens;

  /**
   * Fires an alien bullet.
   *
   * @param alienPos - The position from where the alien fires.
   * @returns - The fired bullet or null if the gun wasn't able to fire.
   */
  fire(alienPos: Coords): IBullet | null;
}

interface IBoss {
  timeSinceDeath: number;
  status: BossStatuses;
  pos: IVector;
  score: number;
  update(timeStep: number): void;
  isOutOfBounds(): boolean;
}

interface IBullet {
  readonly from: TShooters;
  pos: IVector;
  readonly speed: IVector;
  readonly size: Size;
  update(timeStep: number): void;
  isOutOfBounds(): boolean;
}

type AlienBullet = IBullet & { from: "alien" };
type PlayerBullet = IBullet & { from: "player" };

interface IEnvironment {
  alienSet: IAlienSet;
  player: IPlayer;
  walls: IWall[];
  alienSetTouchesPlayer(): boolean;
  handleAlienSetContactWithWall(): void;
  bulletTouchesObject(bullet: IBullet, objPos: Coords, objSize: Size): boolean;
  bulletTouchesOtherBullet(bullet1: IBullet, bullet2: IBullet): boolean
}

interface IGun {
  bulletSize: Size;
  owner: TShooters;
  fireInterval: number;

  /**
   * Fires a bullet from a position.
   *
   * @param pos - The position from where the gun is fired.
   * @param direction - The direction the bullet goes.
   * @returns - A bullet or null if the gun wasn't able to fire.
   */
  fire(pos: IVector, direction: "up" | "down"): IBullet | null;
  update(timeStep: number): void;
  canFire(): boolean;
}

interface IPlayer {
  /**
   * What kind of object it is.
   */
  readonly actorType: "player";
  pos: IVector;
  lives: number;
  score: number;
  status: PlayerStatuses;
  timeSinceResurrection: number;
  gun: IGun;
  fire(): IBullet;
  resetPos(): void;
  update(state: IGameState, timeStep: number, keys: KeysTracker): void;
}

interface IWall {
  /**
   * The pieces of the wall as a matrix of boolean values.
   */
  readonly pieces: IIterablePieces;

  /** The size of each piece of the wall. */
  readonly pieceSize: Size;
  readonly pos: Coords;
  readonly size: Size;

  /**
   * Calculates the absolute position of a piece of the wall within the view.
   *
   * @param column - The column of the piece.
   * @param row - The row of the piece
   * @returns - The position of the piece as a {@link Coords} object.
   */
  getPiecePos(column: number, row: number): Coords;

  /**
   * This method is called when an object might touch the wall.
   * It checks which pieces the object has touched and removes them.
   *
   * @param objPos - The position of the object.
   * @param objSize - The size of the object.
   * @returns - A boolean that tells whether the object touches a piece of the wall.
   */
  collide(objPos: Coords, objSize: Size): boolean;
}

type IExplosion = {
  /** time since the explosion started */
  timeSinceBeginning: number;
  size: Size;
  pos: Coords;
  duration: number;
  update(timeStep: number): void;
};

interface IGameState {
  bullets: IBullet[];
  status: TStateStatuses;
  boss: IBoss | null;
  bulletCollisions: IExplosion[];

  /**
   * The number of bosses the player killed.
   */
  bossesKilled: number;
  /**
   * The number of aiens the player killed.
   */
  aliensKilled: number;

  /**
   * Whether there's a player bullet in the game.
   */
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

type ViewConstructor = new (
  state: IGameState,
  parentElement: HTMLElement
) => IView<IGameState>;

interface IView<State> {
  syncState(state: State, timeStep: number): void;
  adaptDisplaySize(): void;

  /**
   * Tracks the keys of the game as a map object from Key to Boolean.
   */
  trackedKeys: KeysTracker;
  addKeyHandler(key: string, handler: KeyboardEventHandler): void;
}

type IteratedPiece = { row: number; column: number; piece: boolean };

interface IIterablePieces {
  pieces: boolean[][];
  breakPiece(column: number, row: number): void;
  [Symbol.iterator](): Generator<IteratedPiece>;
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
  ViewConstructor,
  IIterablePieces,
  IteratedPiece,
  IExplosion
};
