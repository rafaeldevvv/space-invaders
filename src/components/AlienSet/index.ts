import {
  Size,
  TAliens,
  IAlienSet,
  IVector,
  IAlien,
  Plan,
  Coords,
} from "@/ts/types";
import Vector from "@/utils/common/Vector";
import { alienTypesRegExp, alienTypes } from "../Alien/config";
import Alien from "../Alien";
import { HorizontalDirection } from "@/ts/enums";
import { DIMENSIONS, LAYOUT } from "@/game-config";
import {
  entranceSpeed,
  timeDecreaseFactor,
  stepToEdgeAdjustment,
  stepsToReachPlayer,
  baseYPos,
} from "./config";
import { adaptPos, adaptSize, removeDeadRowsAndColumns } from "./utils";
import audios from "@/audios";
import { randomNum } from "@/utils/common/numbers";

/**
 * A class represeting a set of {@link Alien}s
 * @implements {IAlienSet}
 */
export default class AlienSet implements IAlienSet {
  /**
   * Tracks how many instances have been created.
   * It must be set to 0 when the game is lost.
   */
  static instancesCreated = 0;

  /**
   * The initial Y pos is based on how many instances have been created.
   * So, each time a new alien set appears, its going to be lower
   * than the previous one.
   */
  private initialYPos: number;

  public pos: IVector;
  public size: Size;

  private yStep: number;
  private xStep: number;

  public numColumns: number;
  public numRows: number;

  /**
   * Tracks how the aliens should be rendered.
   * This is useful to render the aliens differently
   * when the alien set moves.
   */
  public aliensStage: 0 | 1 = 0;

  /**
   * The aliens in the set. Each item is an instance of {@link Alien},
   * "exploding" (it has just been killed by the player) or null (not
   * exploding and not alive).
   */
  public aliens: (Alien | null | "exploding")[][];

  /**
   * The number of aliens in the set that are currently alive.
   */
  public alive: number;

  private timeToUpdate = 1;
  private direction: HorizontalDirection = 1;

  /**
   * Tracks the alien entrance animation.
   */
  public entering = true;

  /**
   * A variable that manages when the AlienSet's position can update.
   * When it is greater than or equal to alienSetMoveTime, then the alien set can move.
   */
  private timeStepSum = 0;

  /**
   * Creates an AlienSet.
   *
   * @param plan - A string represeting an arranged set of aliens.
   */
  constructor(plan: Plan) {
    if (!alienTypesRegExp.test(plan)) {
      throw new Error(
        `Invalid character(s) in plan ${plan}. Consider using only valid characters (${alienTypes.join(
          ","
        )})`
      );
    }
    AlienSet.instancesCreated++;

    const rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);

    this.numColumns = rows[0].length;
    this.numRows = rows.length;
    this.alive = this.numColumns * this.numRows;

    const w =
      this.numColumns * DIMENSIONS.alien.w +
      (this.numColumns - 1) * DIMENSIONS.alienSetGap.w;
    const h =
      this.numRows * DIMENSIONS.alien.h +
      (this.numRows - 1) * DIMENSIONS.alienSetGap.h;

    this.size = { w, h };
    this.pos = new Vector(50 - w / 2, -h * 1.5);

    /*
       `(100 - SCENERY.padding.hor * 2 - w)` is the area within the padding edges,
       divide it by fifteen so that we have 15 steps along the display
     */
    this.xStep = (100 - LAYOUT.padding.hor * 2 - w) / 15;
    this.yStep =
      (LAYOUT.playerYPos - (baseYPos + this.size.h)) / stepsToReachPlayer +
      0.01;
    // 0.01 is just an adjustment, without it, the number of vertical
    // steps would be stepsToReachPlayer + 1

    /* the thing here is that from the 2nd alien set to the 9th,
    the alien set initialYPos lowers progressively, and it restarts
    when we've created 10 instances. So we've got cycles that go
    around nine times, from 1 to 9, from 10 to 18, from 19 to 27 and 
    so on. */
    this.initialYPos =
      baseYPos + ((AlienSet.instancesCreated - 1) % 9) * (this.yStep / 1.7);
    /*          `((AlienSet.instancesCreated - 1) % 9)` is necessary,
    so that when 10 instances have been created it evaluates to 0 and
    we we're at one it evaluates to 0 as well, and the other numbers 
    for intances created have their expected results */

    this.aliens = rows.map((row, y) => {
      return row.map((ch, x) => {
        return Alien.create(ch as TAliens, { x, y });
      });
    });
  }

  /**
   * Updates the AlienSet instance.
   *
   * @param timeStep - The time that has passed since the last update.
   */
  public update(timeStep: number) {
    if (this.entering) {
      this.pos = this.pos.plus(new Vector(0, entranceSpeed * timeStep));

      /* if it is in the place where it is supposed to be initially */
      if (this.pos.y >= this.initialYPos) {
        this.entering = false;
        /* adjustment */
        this.pos.y = this.initialYPos;
      } else return;
    }

    this.timeStepSum += timeStep;

    const movedY = this.moveVertically();
    const movedX = this.moveHorizontally(movedY);

    // reset
    if (this.timeStepSum >= this.timeToUpdate) {
      this.timeStepSum = 0;
    }

    if (movedY !== 0 || movedX !== 0) {
      audios.fastInvader(Math.ceil(randomNum(0, 4)) as 1 | 2 | 3 | 4);
      this.removeDeadAliens();
      this.aliensStage = this.aliensStage === 1 ? 0 : 1;
    }

    // update position
    this.pos = this.pos.plus(new Vector(movedX, movedY));

    // update alien guns
    for (const { alien } of this) {
      if (alien instanceof Alien) alien.gun.update(timeStep);
    }
  }

  private moveVertically() {
    let movedY = 0;

    /* 
       if it is going right and it has touched 
       the padding edge and it can update its position
     */
    if (
      this.pos.x + this.size.w >= 100 - LAYOUT.padding.hor &&
      this.timeStepSum >= this.timeToUpdate &&
      this.direction === HorizontalDirection.Right
    ) {
      movedY = this.yStep;
      this.direction = HorizontalDirection.Left;
    } else if (
      /* if it is going left and has touched the padding edge and can update */
      this.pos.x <= LAYOUT.padding.hor &&
      this.timeStepSum >= this.timeToUpdate &&
      this.direction === HorizontalDirection.Left
    ) {
      movedY = this.yStep;
      this.direction = HorizontalDirection.Right;
    }

    return movedY;
  }

  private moveHorizontally(movedY: number) {
    let movedX = 0;
    /* if can update and has not moved down */
    if (this.timeStepSum >= this.timeToUpdate && movedY === 0) {
      if (this.direction === HorizontalDirection.Right) {
        /*
           get either the distance left to reach the inner right padding edge
           or the normal step to move
         */
        const rightDistance =
          100 - this.pos.x - LAYOUT.padding.hor - this.size.w;
        if (rightDistance < this.xStep * stepToEdgeAdjustment) {
          movedX = rightDistance;
        } else {
          movedX = this.xStep;
        }
      } else {
        /*
           get either the distance left to reach the inner left padding edge
           or the normal step to move
         */
        const leftDistance = this.pos.x - LAYOUT.padding.hor;
        if (leftDistance < this.xStep * stepToEdgeAdjustment) {
          movedX = leftDistance;
        } else {
          movedX = this.xStep;
        }
      }
      movedX *= this.direction;
    }

    return movedX;
  }

  /**
   * Adapts the alien set, so that it has a correct size and position.
   */
  public adapt() {
    adaptPos(this);
    adaptSize(this);
    removeDeadRowsAndColumns(this);
  }

  /**
   * Gets the position of an alien within the whole game screen.
   *
   * @param param0 - The grid position of the alien within the alien set.
   * @returns - The position of the alien.
   */
  public getAlienPos({ x, y }: Coords): IVector {
    return new Vector(
      /* alienSet positions + sizes + gaps */
      this.pos.x + x * DIMENSIONS.alien.w + x * DIMENSIONS.alienSetGap.w,
      this.pos.y + y * DIMENSIONS.alien.h + y * DIMENSIONS.alienSetGap.h
    );
  }

  /**
   * Removes an alien from the set.
   */
  public removeAlien(alien: IAlien) {
    this.aliens[alien.gridPos.y][alien.gridPos.x] = "exploding";
    this.alive--;
    /* each time an alien is killed, the alien set speed increases */
    this.timeToUpdate *= timeDecreaseFactor;
    audios.alienKilled();
  }

  /**
   * Turns `"exploding"` in {@link AlienSet.aliens} into `null`.
   */
  private removeDeadAliens() {
    for (const { alien, row, column } of this) {
      if (alien === "exploding") {
        this.aliens[row][column] = null;
      }
    }
  }

  /**
   * Iterates through the AlienSet, yielding every alien in the set,
   * and also the alien's row and column.
   */
  public *[Symbol.iterator]() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        yield { alien: this.aliens[y][x], column: x, row: y };
      }
    }
  }
}
