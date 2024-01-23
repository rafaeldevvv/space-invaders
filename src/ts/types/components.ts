/**
 * @file Defines types that describe the components of the game.
 * @author Rafael Maia <https://rafaeldevvv.github.io/portfolio>
 */

import { Size, Coords, TShooters, TAliens, IVector, NumOrNull } from "./common";
import {
  TStateStatuses,
  PlayerStatuses,
  AlienSetAlienStates,
  BossStatuses,
} from "./status";
import { KeyboardEventHandler, RunningActionsTracker } from "./events";

/**
 * A wrapper for a set of {@link Alien}s
 */
interface IAlienSet {
  pos: IVector;
  size: Size;
  numColumns: number;
  numRows: number;
  aliens: AlienSetAlienStates[][];
  aliensStage: 0 | 1;

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
  /**
   * Returns a score based on how many bullets the player has fired.
   * For every alien set, the 23rd bullet of the player that
   * hits the boss is worth 300 points. From there, every
   * 15th shot is also worth 300. So if I hit the player with shot 23rd,
   * and then with shot 38th, and then with the 53th shot, I get 300 points
   * those three times. If none of those conditions hold, then we get a number
   * between 0 and 200 based on how many bullets the player needs to fire
   * in order to get one of those 300-point shots.
   *
   * @see {@link https://www.classicgaming.cc/classics/space-invaders/play-guide Space Invaders Play Guide}
   */
  get score(): number;
  startPitch(): IBoss["stopPitch"];
  stopPitch(): void;
  update(state: IGameState, timeStep: number): void;
  isOutOfBounds(): boolean;
}

interface IBullet {
  readonly from: TShooters;
  pos: IVector;
  readonly speed: IVector;
  readonly size: Size;
  readonly wiggly: boolean;
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
  bulletTouchesOtherBullet(bullet1: IBullet, bullet2: IBullet): boolean;
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
  bestScore: number;
  status: PlayerStatuses;
  timeSinceResurrection: number;
  gun: IGun;
  fire(): IBullet;
  resetPos(): void;
  update(
    state: IGameState,
    timeStep: number,
    actions: RunningActionsTracker
  ): void;
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

interface IExplosion {
  /** time since the explosion started */
  timeSinceBeginning: number;
  size: Size;
  pos: Coords;
  duration: number;
  update(timeStep: number): void;
}

interface IStateLastScore {
  value: NumOrNull;
  id: NumOrNull;
}

interface IGameState {
  bullets: IBullet[];
  status: TStateStatuses;
  boss: IBoss | null;
  bulletCollisions: IExplosion[];
  lastScore: IStateLastScore;
  numOfPlayerFires: number;

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
  update(timeStep: number, actions: RunningActionsTracker): void;
}

interface GameStateConstructor {
  new (alienSet: IAlienSet, player: IPlayer, env: IEnvironment): IGameState;
  start(plan: string, bestScore: number): IGameState;
}

interface ViewHandlers {
  onPauseGame: () => void;
  onStartGame: () => void;
  onRestartGame: () => void;
}

type ViewConstructor = new (
  state: IGameState,
  handlers: ViewHandlers,
  parentElement: HTMLElement
) => IView<IGameState>;

interface IView<State> {
  syncState(state: State, timeStep: number): void;
  adaptDisplaySize(): void;
  /**
   * Cleans up the current screen for the next screen
   * by removing event listeners, dom elements and so on.
   * It doesn't handle clean up from "running" to "pause" 
   * or vice-versa, though, because both statuses happen in
   * the same screen.
   * 
   * @param newStateStatus - The status represeting the new screen.
   */
  cleanUpFor(newStateStatus: TStateStatuses): void;

  /** tracks the actions the user took in the game */
  actions: RunningActionsTracker;
}

type IteratedPiece = { row: number; column: number; piece: boolean };

interface IIterablePieces {
  pieces: boolean[][];
  numOfColumns: number;
  numOfRows: number;
  breakPiece(column: number, row: number): void;
  [Symbol.iterator](): Generator<IteratedPiece>;
}

interface Screen {
  cleanUp(): void;
  syncState(state?: IGameState, timeStep?: number): void;
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
  IExplosion,
  IStateLastScore,
  ViewHandlers,
  Screen
};
