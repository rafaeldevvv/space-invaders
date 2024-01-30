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

  /**
   * The aliens in the set. Each item is an instance of {@link Alien},
   * "exploding" (it has just been killed by the player) or null (not
   * exploding and not alive).
   */
  aliens: AlienSetAlienStates[][];

  /**
   * Tracks how the aliens should be rendered.
   * This is useful to render the aliens differently
   * when the alien set moves.
   */
  aliensStage: 0 | 1;

  /**
   * The number of aliens that are currently alive.
   */
  alive: number;

  /**
   * Tracks the alien set entrance animation.
   */
  entering: boolean;

  /**
   * Updates the AlienSet instance.
   *
   * @param timeStep - The time that has passed since the last update.
   */
  update(timeStep: number): void;

  /**
   * Adapts the alien set, so that it has a correct size and position.
   */
  adapt(): void;

  /**
   * Gets the position of an alien within the whole game screen.
   *
   * @param param0 - The grid position of the alien within the alien set.
   * @returns - The position of the alien.
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

  /**
   * The position of the alien relative to the grid layout formed by the alien set.
   */
  gridPos: Coords;

  /** The score the player gets when it kills this alien. */
  readonly score: number;

  /** The gun of the alien. */
  readonly gun: IGun;

  /**
   * The type of the alien.
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

  /**
   * Starts the annoying sound of the boss.
   */
  startPitch(): IBoss["stopPitch"];
  /**
   * Stops the annoying sound of the boss.
   */
  stopPitch(): void;
  update(state: IGameState, timeStep: number): void;
  isOutOfBounds(): boolean;
}

interface IBullet {
  /** A string representing the object that fired. */
  readonly from: TShooters;
  pos: IVector;
  readonly speed: IVector;
  readonly size: Size;

  /** Whether the bullet is a wiggly bullet. */
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
  /**
   * Checks whether the alien set has reached the player.
   *
   * @returns - A boolean value that says whether the alien set has reached the player.
   */
  alienSetTouchesPlayer(): boolean;
  /**
   * Handles what happens when the alien set touches a wall.
   */
  handleAlienSetContactWithWall(): void;
  /**
   * Checks whether an object in the game has been shot.
   *
   * @param bullet - A bullet that may hit the object.
   * @param objPos - The position of the object.
   * @param objSize - The size of the object.
   * @returns - A boolean value that says whether the object is shot.
   */
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
  /**
   * Updates the gun.
   *
   * @param timeStep
   */
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
  /** the best score the player has ever gotten */
  bestScore: number;
  status: PlayerStatuses;

  /** The time since the player revived. */
  timeSinceResurrection: number;
  gun: IGun;

  /**
   * Fires a player bullet. It always return a bullet, but the
   * player can only fire one bullet at a time.
   *
   * @returns - A player bullet.
   */
  fire(): IBullet;
  resetPos(): void;

  /**
   * Updates the Player and pushes a new bullet into the state
   * if {@link RunningActionsTracker.fire} is true and there's no player
   * bullet present in the game.
   *
   * @param state - The current state of the game.
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param actions - An object representing actions that the user is currently performing.
   */
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

  /** the size of each piece of the wall. All pieces have the same size. */
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

/**
 * An object representing the last score the player got.
 */
interface IStateLastScore {
  /** the score itself */
  value: NumOrNull;
  /**
   * the id of the score so that when the player
   * gets the same score value in a row the new same
   * score can be animated.
   * */
  id: NumOrNull;
}

interface IGameState {
  bullets: IBullet[];
  status: TStateStatuses;
  boss: IBoss | null;

  /**
   * The volume of the game, from 0 to 1.
   * It is a getter because the state isn't supposed
   * to control it. It gotten from the live binding named volume in
   * the audios/index.ts module.
   */
  get volume(): number;

  /**
   * When bullets collide they leave behind a little explosion.
   * This array tracks all those collisions to render them.
   */
  bulletCollisions: IExplosion[];

  lastScore: IStateLastScore;

  /**
   * How many times the player fired since the
   * current alien set appeared.
   */
  numOfPlayerFires: number;

  /**
   * The number of bosses the player killed.
   */
  bossesKilled: number;
  /**
   * The number of aiens the player killed.
   */
  aliensKilled: number;

  /** there can be only one player bullet in the game, and this tracks when it is present */
  isPlayerBulletPresent: boolean;
  alienSet: IAlienSet;
  player: IPlayer;
  env: IEnvironment;
  /**
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param actions - The actions the player is currently performing.
   */
  update(timeStep: number, actions: RunningActionsTracker): void;
}

/**
 * A constructor that creates {@link IGameState} objects.
 */
interface GameStateConstructor {
  new (alienSet: IAlienSet, player: IPlayer, env: IEnvironment): IGameState;
  /**
   * Creates a basic initial game state.
   *
   * @param plan - A string represeting an arranged set of aliens.
   * @param bestScore - The best score the player got in previous states.
   * @returns - A initial state for the game.
   */
  start(plan: string, bestScore: number): IGameState;
}

/**
 * Handlers for actions the user takes.
 */
interface ViewHandlers {
  onPauseGame: () => void;
  onStartGame: () => void;
  onRestartGame: () => void;
  onChangeVolume: (newVolume: number) => void;
}

/**
 * A constructor for an {@link IView<IGameState>} object.
 */
type ViewConstructor = new (
  state: IGameState,
  handlers: ViewHandlers,
  parentElement: HTMLElement
) => IView;

/**
 * A view for {@link IGameState}.
 */
interface IView {
  /**
   * Synchonizes the view with a new model (state).
   * Even though the game is using a mutable approach,
   * this handles new states because maybe i can change
   * my mind later.
   *
   * @param state - A new game state.
   */
  syncState(state: IGameState, timeStep: number): void;
  /**
   * Adapts the size of the canvas based on the size of the its parent element.
   */
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

  /** The actions the player is currently performing. */
  actions: RunningActionsTracker;

  keyDownHandlers: Map<string, KeyboardEventHandler>;
}

/**
 * The object returned on each iteration of {@link IIterablePieces}.
 */
type IteratedPiece = { row: number; column: number; piece: boolean };

/**
 * An object representing pieces of a 2-dimensional object.
 * `true` values mean the piece is solid (should be rendered
 * and taken into account). `false` values mean the piece is not
 * solid and should not be taken into account.
 */
interface IIterablePieces {
  /**
   * A matrix of boolean values, where `true` represents a solid piece,
   * while `false` represents a non-solid piece.
   */
  pieces: boolean[][];
  /**
   * The number of columns of the matrix.
   */
  numOfColumns: number;
  /**
   * The number of rows of the matrix.
   */
  numOfRows: number;
  /**
   * Turns the piece in the specified row and column into a non-solid piece (`false`).
   *
   * @param column
   * @param row
   */
  breakPiece(column: number, row: number): void;
  /**
   * A generator that iterates through the matrix of pieces.
   * It yields a {@link IteratedPiece} on each iteration.
   */
  [Symbol.iterator](): Generator<IteratedPiece>;
}

/**
 * An object representing a screen of the game, e.g. an initial screen
 * or a game over screen.
 */
interface Screen {
  /** Cleans screen's side effects such as event handlers, dom nodes and so on. */
  cleanUp(): void;
  /** Synchronizes the screen with the current state. */
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
  Screen,
};
