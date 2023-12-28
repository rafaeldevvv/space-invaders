/* ====================================================================== */
/* ========================= Interfaces and Types ======================= */
/* ====================================================================== */

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

interface Display {
  syncState(state: GameState): void;
}

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

const alienTypesRegExp = new RegExp(`(\\w*(${alienTypes.join("|")})*\\w*)+`);

/**
 * It takes a union of strings and generate an object type whose
 * property names are the strings passed in and whose property values are booleans.
 */
type FlagsFromUnion<Keys extends string> = {
  [Key in Keys]: boolean;
};

type GameKeys = " " | "ArrowLeft" | "ArrowRight";
// this is for methods that expect a keys tracker
type KeysTracker = FlagsFromUnion<GameKeys>;

/* helpers */
type NumOrNull = number | null;

/* ============================================================== */
/* ========================== constants ========================= */
/* ============================================================== */

/**
 * The dimensions of all objects in the game.
 * The sizes are percentages within the display, from 0 to 100.
 */
const DIMENSIONS: {
  readonly alien: Size;
  readonly player: Size;
  readonly alienSetGap: Size;
} = {
  alien: {
    w: 4, // 4% of the display width
    h: 6, // 6% of the display height
  },
  player: {
    w: 5, // 5% of the display width
    h: 7, // 7% of the display height
  },
  alienSetGap: {
    w: 1, // 1% of the display width
    h: 1.5, // 1.5% of the display height
  },
};

/**
 * the padding within the display.
 */
const displayPadding = {
  hor: 3,
  ver: 5,
};

const moveRightActionKey = "ArrowRight";
const moveLeftActionKey = "ArrowLeft";
const fireActionKey = " ";

const displayMaxWidth = 720;
const displayAspectRatio = 4 / 3;

const basicInvaderPlan = `
X.......
........
.......Z`;

const customWall1 = `
........######################################........
.....############################################.....
...################################################...
..##################################################..
.###################################################..
.############.......##############.......############.
.##########...........##########...........##########.
##########..............######..............##########
#########......##........####.........##.....#########
########......##..........##...........##....#########
########......##.........####..........##.....########
########......###......#########......###.....########
########.......#####..####..######..####......########
########........########......########........########
########.........#####..........#####.........########
#########....................................#########
.#########..................................#########.
..##########..............................##########..
`;

const customWall2 = `
...#...............................................#...
..###.............................................###..
..####...........................................####..
.######....................#....................######.
.#######..................###..................#######.
#########................#####................#########
##########..............#######..............##########
############.........#############.........############
##############..#..#################..#..##############
#######################################################
.#####################################################.
...#################################################...
......###########################################......
........###########..................##########........
..........#######......................#######.........
`;

/* ============================================================== */
/* ========================== utilities ========================= */
/* ============================================================== */

/**
 * Class representing a vector.
 */
class Vector {
  x: number;
  y: number;

  /**
   * Creates a Vector.
   *
   * @param x - The position along the horizontal axis.
   * @param y - The position along the vertical axis.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Adds two Vector objects' axes' values.
   *
   * @param other - Another Vector to add to the current one.
   * @returns - A Vector with the added axes of both previous vectors.
   */
  plus(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtracts one Vector's axes' values from another Vector.
   *
   * @param other - Another Vector to subtract from the current one.
   * @returns - A Vector with subtracted axes.
   */
  minus(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  /**
   * Mulitplies a Vector's axes' values by a number.
   *
   * @param factor - A number by which the method will multiply the Vector's axes.
   * @returns - A Vector with multiplied axes.
   */
  times(factor: number) {
    return new Vector(this.x * factor, this.y * factor);
  }
}

/**
 * Runs an animation.
 *
 * @param callback - A function to be called everytime a frame can be painted to the screen.
 */
function runAnimation(callback: (timeStep: number) => boolean) {
  let lastTime: null | number = null;

  /**
   * A function that manages each frame of the animation.
   *
   * @param time - The current time since the application started.
   */
  function frame(time: number) {
    let shouldContinue: boolean;

    if (lastTime) {
      const timeStep = Math.min(time - lastTime, 100) / 1000;
      lastTime = time;

      shouldContinue = callback(timeStep);
    } else {
      lastTime = time;
      shouldContinue = true;
    }

    if (shouldContinue) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/**
 * Generates a random number between two numbers.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns - A random number between min and max value.
 */
function randomNum(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Checks whether two objects overlap.
 *
 * @param pos1 - The position of the first object.
 * @param size1 - The size of the first objet.
 * @param pos2 - The position of the second object.
 * @param size2 - The size of the second objet.
 * @returns - A boolean stating whether the two objects overlap.
 */
function overlap(pos1: Coords, size1: Size, pos2: Coords, size2: Size) {
  return (
    pos1.x + size1.w > pos2.x &&
    pos1.x < pos2.x + size2.w &&
    pos1.y + size1.h > pos2.y &&
    pos1.y < pos2.y + size2.h
  );
}

/**
 * Calculates the size of an HTML Element excluding padding, border and margin
 *
 * @param element
 * @returns - The size of the element excluding padding, border and margin
 */
function getElementInnerDimensions(element: HTMLElement): Size {
  /* ############################################################################################################################################ */
  /* ############################################################################################################################################ */
  /* ############################################################################################################################################ */
  /* ############################################################################################################################################ */
  /* ############################################################################################################################################ */
  /* ############################################################################################################################################ */
  /* ############################################################################################################################################ */
  // if you have problems with the canvas width or canvas height, check this
  // because there might be something going wrong in here

  const cs = getComputedStyle(element);

  const paddingY =
    parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);
  const paddingX =
    parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);

  const marginY =
    parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);
  const marginX =
    parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);

  return {
    w: element.offsetWidth - paddingX - marginX,
    h: element.offsetHeight - paddingY - marginY,
  };
}

/**
 * Keeps track of which keyboard keys are currently held down.
 *
 * @param keys - An array of strings representing key names.
 * @returns - An object whose property names are the strings within `keys` and values are booleans.
 */
function trackKeys<Type extends string>(keys: Type[]): FlagsFromUnion<Type> {
  const down = {} as FlagsFromUnion<Type>;
  keys.forEach((key) => (down[key] = false));

  function onPressKey(e: KeyboardEvent) {
    for (const key of keys) {
      if (e.key === key) {
        down[e.key as Type] = e.type === "keydown";
      }
    }
  }

  window.addEventListener("keydown", onPressKey);
  window.addEventListener("keyup", onPressKey);

  return down;
}

/* =================== AlienSet utilities ===================== */

/**
 * Checks whether a particular column in the set has all its aliens dead.
 *
 * @param rows - The rows
 * @param column - The column
 * @returns
 */
function isColumnDead(rows: AlienSet["aliens"], column: number) {
  return rows.every((row) => row[column] === null);
}

/**
 * Same as {@link isColumnDead}, but for a row in the AlienSet.
 * @param row
 * @returns
 */
function isRowDead(row: AlienSet["aliens"][number]) {
  return row.every((alien) => alien === null);
}

/**
 * Gets the first or last column in a set of aliens if either is dead.
 * The first column takes precedence over the last column.
 *
 * @param rows - The same thing that the {@link AlienSet.aliens} property holds.
 * @returns - The first or last column or null if neither of them is dead.
 */
function getFirstOrLastColumnIfDead(rows: AlienSet["aliens"]): number | null {
  const isFirstColumnDead = isColumnDead(rows, 0);
  const isLastColumnDead = isColumnDead(rows, rows[0].length - 1);

  if (isFirstColumnDead) return 0;
  if (isLastColumnDead) return rows[0].length - 1;
  else return null;
}

/**
 * Same as {@link getFirstOrLastColumnIfDead}, but for rows.
 */
function getFirstOrLastRowIfDead(rows: AlienSet["aliens"]): number | null {
  const isFirstRowDead = isRowDead(rows[0]);
  const isLastRowDead = isRowDead(rows[rows.length - 1]);

  if (isFirstRowDead) return 0;
  if (isLastRowDead) return rows.length - 1;
  else return null;
}

/* ==================================================================== */
/* ===================== Game Components ============================== */
/* ==================================================================== */
/**
 * This is to adjust the step of the alien set when it
 * is close to the edge of the display. With this, the alien
 * set will not seem stagnant when there's just a small distance
 * for it to reach the edge
 */
const alienSetStepToEdgeAdjustment = 1.33;
const alienSetTimeDecreaseFactor = 0.92;

/**
 * The horizontal directions that {@link AlienSet} can move.
 */
enum HorizontalDirection {
  Right = 1,
  Left = -1,
}

/**
 * A class represeting a set of {@link Alien}s
 */
class AlienSet {
  public pos: Vector;
  public size: Size;

  private yStep = 3;
  private xStep: number;

  public numColumns: number;
  public numRows: number;

  public aliens: (Alien | null)[][];
  public alive: number;

  private timeToUpdate = 1;
  private direction: HorizontalDirection = 1;

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
  constructor(plan: string) {
    if (!alienTypesRegExp.test(plan)) {
      throw new Error(
        `Invalid character(s) in plan ${plan}. Consider using only valid characters (${alienTypes.join(
          ","
        )})`
      );
    }

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
    this.pos = new Vector(50 - w / 2, displayPadding.ver + 10);

    /*
      `(100 - displayPadding.hor * 2 - w)` is the area within the padding edges,
      divide it by fifteen so that we have 15 steps along the display
    */
    this.xStep = (100 - displayPadding.hor * 2 - w) / 15;

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
    this.timeStepSum += timeStep;

    const movedY = this.moveVertically();
    const movedX = this.moveHorizontally(movedY);

    /* reset */
    if (this.timeStepSum >= this.timeToUpdate) {
      this.timeStepSum = 0;
    }

    // if it moved down, decreases the updateTime
    if (movedY > 0) {
      this.timeToUpdate *= alienSetTimeDecreaseFactor;
    }

    this.pos = this.pos.plus(new Vector(movedX, movedY));
    for (const alien of this) {
      if (alien) alien.gun.update(timeStep);
    }
  }

  private moveVertically() {
    let movedY = 0;

    /* 
      if it is going right and it has touched 
      the padding edge and it can update its position
    */
    if (
      this.pos.x + this.size.w >= 100 - displayPadding.hor &&
      this.timeStepSum >= this.timeToUpdate &&
      this.direction === HorizontalDirection.Right
    ) {
      movedY = this.yStep;
      this.direction = HorizontalDirection.Left;
    } else if (
      /* if it is going left and has touched the padding edge and can update */
      this.pos.x <= displayPadding.hor &&
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
          100 - this.pos.x - displayPadding.hor - this.size.w;
        if (rightDistance < this.xStep * alienSetStepToEdgeAdjustment) {
          movedX = rightDistance;
        } else {
          movedX = this.xStep;
        }
        // movedX = Math.min(this.xStep, rightDistance);
      } else {
        /*
          get either the distance left to reach the inner left padding edge
          or the normal step to move
        */
        const leftDistance = this.pos.x - displayPadding.hor;
        if (leftDistance < this.xStep * alienSetStepToEdgeAdjustment) {
          movedX = leftDistance;
        } else {
          movedX = this.xStep;
        }
        // movedX = Math.min(this.xStep, leftDistance);
      }
      movedX *= this.direction;
    }

    return movedX;
  }

  public adapt() {
    this.adaptPos();
    this.adaptSize();
    this.removeDeadRowsAndColumns();
  }

  /**
   * Adapts the size of the alien set when enough aliens have been removed.
   */
  private adaptSize() {
    let firstLivingAlienRow: NumOrNull = null,
      lastLivingAlienRow: NumOrNull = null,
      firstLivingAlienColumn: NumOrNull = null,
      lastLivingAlienColumn: NumOrNull = null;

    for (const alien of this) {
      if (!alien) continue;
      const { x: column, y: row } = alien.gridPos;

      /* 
        `row < firstLivingAlienRow` isn't needed here because 
        it will always check top-bottom
      */
      if (firstLivingAlienRow === null) {
        firstLivingAlienRow = row;
      }
      lastLivingAlienRow = row;

      /* 
        if the  first column is null or the current one is less than the previous 
        one, then this is the first living alien column 
      */
      if (firstLivingAlienColumn === null || column < firstLivingAlienColumn) {
        firstLivingAlienColumn = column;
      }
      if (lastLivingAlienColumn === null || column > lastLivingAlienColumn) {
        lastLivingAlienColumn = column;
      }
    }

    if (firstLivingAlienRow !== null) {
      const newH =
        // add one because if the living aliens are on the same row, the new height would be zero
        // same thing for columns
        (lastLivingAlienRow! - firstLivingAlienRow + 1) * DIMENSIONS.alien.h +
        (lastLivingAlienRow! - firstLivingAlienRow) * DIMENSIONS.alienSetGap.h;
      const newW =
        (lastLivingAlienColumn! - firstLivingAlienColumn! + 1) *
          DIMENSIONS.alien.w +
        (lastLivingAlienColumn! - firstLivingAlienColumn!) *
          DIMENSIONS.alienSetGap.w;

      this.size = {
        w: newW,
        h: newH,
      };
    }
  }

  /**
   * Adapts the position of the alien set when enough aliens have been removed.
   */
  private adaptPos(): void {
    let firstLivingAlienColumn: NumOrNull = null;
    let firstLivingAlienRow: NumOrNull = null;

    for (const alien of this) {
      if (!alien) continue;

      const { x, y } = alien.gridPos;

      if (firstLivingAlienColumn === null || x < firstLivingAlienColumn) {
        firstLivingAlienColumn = x;
      }

      console.log("alive is alive at row", y);
      if (firstLivingAlienRow === null) {
        firstLivingAlienRow = y;
      }
    }

    /* if there is still aliens */
    if (firstLivingAlienColumn !== null && firstLivingAlienRow !== null) {
      this.pos = this.getAlienPos({
        x: firstLivingAlienColumn,
        y: firstLivingAlienRow,
      });
    }
  }

  /**
   * Removes rows or columns that have no living aliens.
   */
  private removeDeadRowsAndColumns() {
    let columnToRemove: number | null;
    while (
      (columnToRemove = getFirstOrLastColumnIfDead(this.aliens)) !== null
    ) {
      this.aliens = this.aliens.map((row) => {
        return row.filter((_, x) => x !== columnToRemove);
      });

      /* 
        this is totally necessary for this logic to work
        it ensures that after a row or column is removed, the 
        this.getFirstOrLastColumnIfDead method will return 0 
        for the next column to be removed 
      */
      this.syncAliensGridPos();
    }

    let rowToRemove: number | null;
    while (
      (rowToRemove = getFirstOrLastRowIfDead(this.aliens)) !== null &&
      this.aliens.length !== 0
    ) {
      this.aliens = this.aliens.filter((_, y) => y !== rowToRemove);
      this.syncAliensGridPos();
    }

    this.syncNumOfColsAndRows();
  }

  /**
   * After the unnecessary rows and columns are removed, the grid position of the aliens are going to be messed up.
   * This ensures that the grid position of the aliens are consistent within the new set.
   */
  private syncAliensGridPos() {
    this.aliens.forEach((row, y) => {
      row.forEach((alien, x) => {
        if (alien) alien.gridPos = { x, y };
      });
    });
  }

  private syncNumOfColsAndRows() {
    this.numColumns = this.aliens[0].length;
    this.numRows = this.aliens.length;
  }

  /**
   * Gets the position of an alien within the whole game screen.
   *
   * @param param0 - The alien.
   * @returns - The position of the alien.
   */
  public getAlienPos({ x, y }: Coords): Vector {
    return new Vector(
      /* alienSet positions + sizes + gaps */
      this.pos.x + x * DIMENSIONS.alien.w + x * DIMENSIONS.alienSetGap.w,
      this.pos.y + y * DIMENSIONS.alien.h + y * DIMENSIONS.alienSetGap.h
    );
  }

  /**
   * Removes an alien from the set.
   *
   * @param x - The X position of the alien within the grid.
   * @param y - The Y position of the alien within the grid.
   */
  public removeAlien(alien: Alien) {
    this.aliens[alien.gridPos.y][alien.gridPos.x] = null;
    this.alive--;
  }

  /**
   * Iterates through the AlienSet, yielding every alien in the set
   */
  public *[Symbol.iterator]() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        yield this.aliens[y][x];
      }
    }
  }
}

/**
 * Class representing an alien.
 */
class Alien {
  public readonly actorType = "alien" as const;

  /**
   * Creates an Alien.
   *
   * @param gridPos - The position of the alien within the alien set.
   * @param score - The score the player gets when it kills this alien.
   * @param gun - The gun of the alien.
   * @param alienType - The type of the alien.
   */
  constructor(
    public gridPos: Coords,
    public readonly score: number,
    public readonly gun: Gun,
    public readonly alienType: TAliens
  ) {}

  /**
   * Fires an alien bullet.
   *
   * @param alienPos - The position from where the alien fires.
   * @returns - The fired bullet or null if the gun wasn't able to fire.
   */
  public fire(alienPos: Coords): Bullet | null {
    /* bullet is fired from the center of the alien */
    const bulletX =
      alienPos.x + DIMENSIONS.alien.w / 2 - this.gun.bulletSize.w / 2;

    return this.gun.fire(new Vector(bulletX, alienPos.y), "down");
  }

  /**
   * Creates an alien based on a character.
   *
   * @param ch - The type of the alien represented by a character.
   * @param gridPos - The position of the alien within the grid.
   * @returns - A specific alien type.
   */
  public static create(ch: TAliens | ".", gridPos: Coords) {
    switch (ch) {
      case "X": {
        return new Alien(
          gridPos,
          20,
          new Gun("alien", 40, { w: 0.5, h: 3 }, 4000),
          ch
        );
      }
      case "Y": {
        return new Alien(
          gridPos,
          40,
          new Gun("alien", 60, { w: 1, h: 3 }, 6000),
          ch
        );
      }
      case "Z": {
        return new Alien(
          gridPos,
          60,
          new Gun("alien", 80, { w: 1.5, h: 3 }, 7000),
          ch
        );
      }
      case ".": {
        return null;
      }
      default: {
        const _never: never = ch;
        throw new Error("Unexpected character: " + _never);
      }
    }
  }
}

const playerXSpeed = 30;

/**
 * Class representing the player.
 */
class Player {
  public readonly actorType = "player" as const;

  private baseXPos = 50 - DIMENSIONS.player.w / 2;
  private baseYPos = 90;

  public pos: Vector = new Vector(this.baseXPos, this.baseYPos);

  public readonly gun: Gun = new Gun("player", 70, { w: 0.5, h: 3 }, 400);

  public lives = 3;
  public score = 0;

  /**
   * Fires a player's bullet.
   *
   * @returns - The fired bullet or null if the fun wasn't able to fire.
   */
  public fire(): Bullet | null {
    /* from the center of the player */
    const bulletPosX =
      this.pos.x + DIMENSIONS.player.w / 2 - this.gun.bulletSize.w / 2;

    return this.gun.fire(new Vector(bulletPosX, this.pos.y), "up");
  }

  public resetPos() {
    this.pos = new Vector(this.baseXPos, this.baseYPos);
  }

  /**
   * Updates the Player.
   *
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param keys - An object that tracks which keys are currently held down.
   */
  public update(state: GameState, timeStep: number, keys: KeysTracker) {
    const movedX = new Vector(timeStep * playerXSpeed, 0);

    if (keys[moveLeftActionKey] && this.pos.x > displayPadding.hor) {
      this.pos = this.pos.minus(movedX);
    } else if (
      keys[moveRightActionKey] &&
      this.pos.x + DIMENSIONS.player.w < 100 - displayPadding.hor
    ) {
      this.pos = this.pos.plus(movedX);
    }

    this.gun.update(timeStep);
    if (keys[fireActionKey] && this.gun.canFire()) {
      state.bullets.push(this.fire()!);
    }
  }
}

/**
 * Class representing a gun.
 */
class Gun {
  public fireInterval: number;
  public timeSinceLastShot: number = 0;

  /**
   * Creates a Gun.
   *
   * @param owner - The object which fires the gun.
   * @param bulletSpeed - The speed of the bullet the gun fires.
   * @param bulletSize - The size of the bullet the gun fires.
   * @param baseFireInterval - The time it takes for the gun to fire again.
   */
  constructor(
    public owner: TShooters,
    private bulletSpeed: number,
    public bulletSize: Size,
    private baseFireInterval: number
  ) {
    // to give a random initial fireInterval
    this.fireInterval = randomNum(0.9 * baseFireInterval, baseFireInterval);
    this.timeSinceLastShot = randomNum(0, this.fireInterval);
  }

  /**
   * Fires a bullet from a position.
   *
   * @param pos - The position from where the gun is fired.
   * @param direction - The direction the bullet goes.
   * @returns - A bullet or null if the gun wasn't able to fire.
   */
  fire(pos: Vector, direction: "up" | "down") {
    if (this.canFire()) {
      /* update lastFire prop to track the time of the last shot */
      this.timeSinceLastShot = 0;

      /* generate random fire interval for dynamic gameplay */
      this.fireInterval = randomNum(
        0.9 * this.baseFireInterval,
        this.baseFireInterval
      );

      return new Bullet(
        this.owner,
        pos,
        new Vector(
          0,
          direction === "up" ? -this.bulletSpeed : this.bulletSpeed
        ),
        this.bulletSize
      );
    }

    /* it returns null if it wasn't able to fire */
    return null;
  }

  /**
   * Updates the time that has passed since the last shot
   *
   * @param timeStep
   */
  update(timeStep: number) {
    this.timeSinceLastShot += timeStep * 1000;
  }

  /**
   * Checks whether the gun can be fired.
   *
   * @returns - A boolean value saying whether the gun can fire.
   */
  canFire() {
    return this.timeSinceLastShot >= this.fireInterval;
  }
}

/**
 * Class representing a bullet.
 */
class Bullet {
  /**
   * Creates a bullet.
   *
   * @param from - A string representing the object that fired.
   * @param pos - The position from where the bullet was fired.
   * @param speed - The speed of the bullet.
   * @param size - The size of the bullet.
   */
  constructor(
    public from: TShooters,
    public pos: Vector,
    public speed: Vector,
    public size: Size
  ) {}

  /**
   * Updates the bullet's position.
   *
   * @param timeStep
   */
  update(timeStep: number) {
    this.pos = this.pos.plus(this.speed.times(timeStep));
  }

  /**
   * Is called when the bullet hits something.
   *
   * @param state - The state of the game.
   */
  collide(state: GameState) {
    state.bullets = state.bullets.filter((bullet) => bullet !== this);
  }
}

/**
 * Class representing an unbreakable wall.
 */
class Wall {
  /**
   * Creates an unbreakable wall.
   *
   * @param pos - The position of the wall.
   * @param size - The size of the wall.
   */
  constructor(public readonly pos: Coords, public readonly size: Size) {}
}

class BreakableWall {
  /**
   * The pieces of the wall as a matrix.
   */
  readonly piecesMatrix: boolean[][];
  readonly pieceSize: Size;

  /**
   * @param pos
   * @param size
   * @param numColumnsOrPlan - The number of columns of breakable pieces or a string representing how the pieces are arranged.
   * @param numRows - The number of rows of breakable pieces.
   */
  constructor(pos: Coords, size: Size, plan: string);
  constructor(pos: Coords, size: Size, numColumns: number, numRows: number);
  constructor(
    public readonly pos: Coords,
    public readonly size: Size,
    numColumnsOrPlan: number | string,
    numRows?: number
  ) {
    let pieces: boolean[][];
    let pieceSize: Size;

    if (typeof numColumnsOrPlan === "string") {
      pieces = numColumnsOrPlan
        .trim()
        .split("\n")
        .map((row) => [...row].map((ch) => ch === "#"));
      pieceSize = {
        w: this.size.w / pieces[0].length,
        h: this.size.h / pieces.length,
      };
    } else {
      pieces = new Array(numRows!)
        .fill(undefined)
        .map(() => new Array(numColumnsOrPlan).fill(true));
      pieceSize = {
        w: size.w / numColumnsOrPlan,
        h: size.h / numRows!,
      };
    }

    this.pieceSize = pieceSize;
    this.piecesMatrix = pieces;
  }

  /**
   * Gets the position of a piece of the wall within the whole display screen in percentage values.
   *
   * @param column - The column in which the piece is.
   * @param row - The row in which the piece is.
   * @returns - The position of the piece within the whole display in percentage values.
   */
  getPiecePos(column: number, row: number): Coords {
    return {
      x: this.pos.x + column * this.pieceSize.w,
      y: this.pos.y + row * this.pieceSize.h,
    };
  }

  /**
   * This method is called when an object hits the wall.
   * It checks which pieces the object has hit and removes them,
   * calling `collide` on the object if it was passed in and it hits a piece.
   *
   * @param state - The state of the game.
   * @param objPos - The position of the object.
   * @param objSize - The size of the object.
   * @param obj - The object itself. The object must have a collide method
   * that takes the state as the only argument and returns nothing.
   */
  collide<State>(
    state: State,
    objPos: Coords,
    objSize: Size,
    obj?: { collide(state: State): void }
  ) {
    if (!overlap(this.pos, this.size, objPos, objSize)) return;

    for (const { row, column, piece } of this) {
      if (!piece) continue;

      const piecePos = this.getPiecePos(column, row);

      if (overlap(objPos, objSize, piecePos, this.pieceSize)) {
        this.piecesMatrix[row][column] = false;
        obj?.collide(state);
      }
    }
  }

  /**
   * Iterates over the pieces of the wall.
   */
  *[Symbol.iterator]() {
    const rows = this.piecesMatrix.length;
    for (let row = 0; row < rows; row++) {
      const columnLength = this.piecesMatrix[row].length;
      for (let column = 0; column < columnLength; column++) {
        const piece = this.piecesMatrix[row][column];
        yield { row, column, piece };
      }
    }
  }
}

/**
 * Class representing a breakable wall.
 */

type TWalls = BreakableWall | Wall;

/* ========================================================================= */
/* ========================== Environment and State ======================== */
/* ========================================================================= */

/**
 * Class representing the Game Environment responsible
 * for managing colision.
 */
class GameEnv {
  /**
   * Initializes the game environment.
   *
   * @param alienSet - The aliens.
   * @param player - The player.
   * @param walls - The walls.
   */
  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public walls: TWalls[]
  ) {}

  /**
   * Checks whether a bullet touches a wall.
   *
   * @param bullet - The bullet whose position needs to be checked as overlapping a wall.
   * @returns - A boolean value which says whether the bullet touches a wall.
   */
  bulletTouchesWall(bullet: Bullet, wall: TWalls): boolean {
    return overlap(wall.pos, wall.size, bullet.pos, bullet.size);
  }

  /**
   * Checks whether the bullet is outside the boundaries of the screen.
   *
   * @param bullet
   * @returns
   */
  isBulletOutOfBounds(bullet: Bullet) {
    return bullet.pos.y >= 100 || bullet.pos.y + bullet.size.h <= 0;
  }

  /**
   * Checks whether the alien set has reached the wall.
   *
   * @returns - A boolean value that says whether the alien set has reached a wall.
   */
  alienSetTouchesPlayer() {
    return this.alienSet.pos.y + this.alienSet.size.h >= this.player.pos.y;
  }

  alienSetTouchesWall(wall: TWalls) {
    return this.alienSet.pos.y + this.alienSet.size.h >= wall.pos.y;
  }

  /**
   * Checks whether an object in the game has been shot.
   *
   * @param bullet - A bullet that may hit the object.
   * @param objPos - The position of the object.
   * @param objSize - The size of the object.
   * @returns - A boolean value that says whether the object is shot.
   */
  bulletTouchesObject(bullet: Bullet, objPos: Coords, objSize: Size) {
    return overlap(bullet.pos, bullet.size, objPos, objSize);
  }
}

/**
 * Class that manages the state of a running game.
 */
class GameState {
  public bullets: Bullet[] = [];
  public status: "lost" | "running" = "running";

  /**
   * Initializes the state.
   *
   * @param alienSet - The aliens.
   * @param player - The player.
   * @param env - The game environment.
   */
  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public env: GameEnv
  ) {}

  /**
   * Updates the state of the game, including player, bullets, walls and aliens.
   *
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param keys - An object that tracks which keys on the keyboard are currently being pressed down.
   */
  public update(timeStep: number, keys: KeysTracker) {
    this.alienSet.update(timeStep);
    this.player.update(this, timeStep, keys);
    this.fireAliens();

    this.handleBulletsContactWithWall();

    this.bullets.forEach((bullet) => bullet.update(timeStep));

    this.handleBulletsThatHitAlien();
    this.handleBulletsThatHitPlayer();
    this.removeOutOfBoundsBullets();
    this.handleAlienContactWithWall();

    if (this.alienSet.alive === 0) {
      this.alienSet = new AlienSet(basicInvaderPlan);
      this.env.alienSet = this.alienSet;
      this.player.lives++;
    } else if (this.player.lives < 1) {
      this.status = "lost";
    }

    if (this.env.alienSetTouchesPlayer()) {
      this.env.walls = [];
      this.status = "lost";
    }
  }

  /**
   * Removes the bullets that hit the wall and update the wall if needed.
   */
  private handleBulletsContactWithWall() {
    for (const bullet of this.bullets) {
      for (const wall of this.env.walls) {
        if (!this.env.bulletTouchesWall(bullet, wall)) continue;

        if (wall instanceof Wall) {
          bullet.collide(this);
        } else {
          wall.collide(this, bullet.pos, bullet.size, bullet);
        }
      }
    }
  }

  /**
   * Checks if any alien is hit by a player bullet, removes the bullet
   * and the alien and increases player's score by the score of the alien.
   */
  private handleBulletsThatHitAlien() {
    const playerBullets = this.bullets.filter(
      (bullet) => bullet.from === "player"
    );

    let isSomeAlienKilled = false;
    for (const playerBullet of playerBullets) {
      for (const alien of this.alienSet) {
        if (!alien) continue;

        if (
          this.env.bulletTouchesObject(
            playerBullet,
            this.alienSet.getAlienPos(alien.gridPos),
            DIMENSIONS.alien
          )
        ) {
          this.player.score += alien.score;
          this.alienSet.removeAlien(alien);
          playerBullet.collide(this);
          isSomeAlienKilled = true;
        }
      }
    }
    if (isSomeAlienKilled) this.alienSet.adapt();
  }

  /**
   * Fires the aliens that can fire.
   */
  private fireAliens() {
    for (const alien of this.alienSet) {
      if (!alien) continue;

      if (alien.gun.canFire()) {
        this.bullets.push(
          alien.fire(this.alienSet.getAlienPos(alien.gridPos))!
        );
      }
    }
  }

  /**
   * Checks which bullets hit the player, removes them and decreases the player's lives.
   */
  private handleBulletsThatHitPlayer() {
    const alienBullets = this.bullets.filter(
      (bullet) => bullet.from === "alien"
    );

    /* 
      check if any alien bullet hits the player and if it does, the bullet
      is removed and the player resets its position and loses one life 
    */
    alienBullets.forEach((b) => {
      if (this.env.bulletTouchesObject(b, this.player.pos, DIMENSIONS.player)) {
        this.player.lives--;
        this.player.resetPos();
        b.collide(this);
      }
    });
  }

  private removeOutOfBoundsBullets() {
    const necessaryBullets = [];
    for (const bullet of this.bullets) {
      if (!this.env.isBulletOutOfBounds(bullet)) {
        necessaryBullets.push(bullet);
      }
    }

    this.bullets = necessaryBullets;
  }

  private handleAlienContactWithWall() {
    for (const wall of this.env.walls) {
      if (wall instanceof Wall) continue;
      if (overlap(this.alienSet.pos, this.alienSet.size, wall.pos, wall.size)) {
        for (const alien of this.alienSet) {
          if (!alien) continue;
          const alienPos = this.alienSet.getAlienPos(alien.gridPos);
          wall.collide(this, alienPos, DIMENSIONS.alien);
        }
      }
    }
  }

  /**
   * Creates a basic initial game state.
   *
   * @param plan - A string represeting an arranged set of aliens.
   * @returns - A initial state for the game.
   */
  static start(plan: string) {
    const alienSet = new AlienSet(plan);
    const player = new Player();
    const walls: BreakableWall[] = [
      new BreakableWall({ x: 20, y: 70 }, { w: 20, h: 15 }, customWall1),
      new BreakableWall({ x: 60, y: 70 }, { w: 20, h: 15 }, customWall1),
    ];
    const env = new GameEnv(alienSet, player, walls);

    return new GameState(alienSet, player, env);
  }
}

/* ========================================================================= */
/* ================================= Display =============================== */
/* ========================================================================= */

/**
 * The colors of the aliens
 */
const alienColors: {
  [Key in TAliens]: string;
} = {
  X: "limegreen",
  Y: "orange",
  Z: "pink",
};

/**
 * Class represeting a view component used to display the game state.
 * It uses the HTML Canvas API.
 */
class CanvasDisplay {
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  public keys = {} as KeysTracker;

  /**
   * Creates a view component for the game that uses the Canvas API.
   *
   * @param state - The initial state of the game.
   * @param controller - The component responsible for coordinating the information flow between the View and the Model (state).
   * @param parent - The HTML Element used to display the view.
   */
  constructor(
    public state: GameState,
    public controller: GameController,
    public parent: HTMLElement
  ) {
    this.canvas = document.createElement("canvas");
    this.canvasContext = this.canvas.getContext("2d")!;

    this.canvas.style.display = "block";
    this.canvas.style.marginInline = "auto";

    this.parent.appendChild(this.canvas);

    this.defineEventListeners();
    this.setDisplaySize();
    this.syncState(state, 0);
  }

  /**
   * Sets the size of the canvas based on the size of the its parent element.
   */
  public setDisplaySize() {
    const canvasWidth = Math.min(
      displayMaxWidth,
      getElementInnerDimensions(this.canvas.parentNode as HTMLElement).w
    );

    this.canvas.setAttribute("width", canvasWidth.toString());
    this.canvas.setAttribute(
      "height",
      (canvasWidth / displayAspectRatio).toString()
    );
  }

  /**
   * Synchonizes the view with a new model (state).
   *
   * @param state - A new game state.
   */
  public syncState(state: GameState, timeStep: number) {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawPlayer(state.player);
    this.drawAlienSet(state.alienSet);
    this.drawBullets(state.bullets);
    this.drawWalls(state.env.walls);
    this.drawMetadata(state, timeStep);
  }

  private defineEventListeners() {
    window.addEventListener("resize", () => {
      this.setDisplaySize();
      this.syncState(this.state, 0);
    });

    this.keys = trackKeys([
      moveLeftActionKey,
      moveRightActionKey,
      fireActionKey,
    ]);
  }

  // readonly, cuz there's no setter
  private get canvasWidth() {
    return this.canvas.width;
  }

  // readonly, cuz there's no setter
  private get canvasHeight() {
    return this.canvas.height;
  }

  /**
   * Calculates the horizontal pixels according to a percentage of the canvas width.
   *
   * @param percentage - The percentage of the canvas width.
   * @returns - The corresponding horizontal pixels.
   */
  private horPixels(percentage: number) {
    return (percentage / 100) * this.canvasWidth;
  }

  /**
   * Calculates the vertical pixels according to a percentage of the canvas height.
   *
   * @param percentage - The percentage of the canvas heigth.
   * @returns - The corresponding vertical pixels.
   */
  private verPixels(percentage: number) {
    return (percentage / 100) * this.canvasHeight;
  }

  /**
   * Calculates the pixel position of an object within the canvas based on a percentage position.
   *
   * @param percentagePos - The percentage position.
   * @returns - The corresponding pixel position.
   */
  private getPixelPos(percentagePos: Coords): PixelCoords {
    return {
      x: this.horPixels(percentagePos.x),
      y: this.verPixels(percentagePos.y),
    };
  }

  /**
   * Calculates the pixel size of an object within the canvas based on a percentage size.
   
   * @param percentagePos - The percentage size.
   * @returns - The corresponding pixel size.
   */
  private getPixelSize(percentageSize: Size): PixelSize {
    return {
      w: this.horPixels(percentageSize.w),
      h: this.verPixels(percentageSize.h),
    };
  }

  private drawAlienSet(alienSet: AlienSet) {
    for (const alien of alienSet) {
      if (!alien) continue;

      const xPercentage =
        alienSet.pos.x +
        alien.gridPos.x * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);

      const yPercentage =
        alienSet.pos.y +
        alien.gridPos.y * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);

      this.drawAlien(alien, {
        x: xPercentage,
        y: yPercentage,
      });
    }

    /* this is meant for tests, remove it later */
    const { x, y } = this.getPixelPos(alienSet.pos);
    const { w, h } = this.getPixelSize(alienSet.size);
    this.canvasContext.fillStyle = "rgba(255,255,255,0.4)";
    this.canvasContext.fillRect(x, y, w, h);
  }

  private drawAlien(alien: Alien, pos: Coords) {
    const { w, h } = this.getPixelSize(DIMENSIONS.alien);
    const { x, y } = this.getPixelPos(pos);

    this.canvasContext.fillStyle = alienColors[alien.alienType];
    this.canvasContext.fillRect(x, y, w, h);
  }

  private drawBullets(bullets: Bullet[]) {
    for (const bullet of bullets) {
      this.drawBullet(bullet);
    }
  }

  private drawBullet(bullet: Bullet) {
    const { x, y } = this.getPixelPos(bullet.pos);
    const { w, h } = this.getPixelSize(bullet.size);

    this.canvasContext.fillStyle =
      bullet.from === "alien" ? "limegreen" : "white";
    this.canvasContext.fillRect(x, y, w, h);
  }

  private drawPlayer(player: Player) {
    const { x, y } = this.getPixelPos(player.pos);
    const { w, h } = this.getPixelSize(DIMENSIONS.player);

    this.canvasContext.fillStyle = "white";
    this.canvasContext.fillRect(x, y, w, h);
    this.drawPlayerGunReloadVisualClue(player);
  }

  private drawPlayerGunReloadVisualClue(player: Player) {
    const { gun, pos } = player;

    const extraWidth = DIMENSIONS.player.w * 0.15;
    const gap = DIMENSIONS.player.h * 0.1;

    // Calculate the size of the clue
    const clueHeight = 1,
      clueWidth = DIMENSIONS.player.w + extraWidth,
      cluePixelsHeight = this.verPixels(clueHeight),
      cluePixelsWidth = this.horPixels(clueWidth);

    // Calculate the position of the clue within the display
    const x = pos.x - extraWidth / 2,
      y = pos.y + DIMENSIONS.player.h + gap,
      xPixels = this.horPixels(x),
      yPixels = this.verPixels(y);

    const loadedPercentage = Math.min(
      1,
      gun.timeSinceLastShot / gun.fireInterval
    );

    this.canvasContext.save();
    this.canvasContext.translate(xPixels, yPixels);

    // draw how much the gun is reloaded (green)
    this.canvasContext.fillStyle = "#0f0";
    this.canvasContext.fillRect(
      0 - extraWidth / 2,
      0,
      loadedPercentage * cluePixelsWidth,
      cluePixelsHeight
    );

    // draw how much the gun is not reloaded (gray)
    this.canvasContext.fillStyle = "#999";
    this.canvasContext.fillRect(
      loadedPercentage * cluePixelsWidth - extraWidth / 2,
      0,
      cluePixelsWidth - loadedPercentage * cluePixelsWidth,
      cluePixelsHeight
    );

    this.canvasContext.restore();
  }

  private drawWalls(walls: TWalls[]) {
    for (const wall of walls) {
      if (wall instanceof Wall) {
        this.drawUnbreakableWall(wall);
      } else {
        this.drawBreakableWall(wall);
      }
    }
  }

  private drawUnbreakableWall(wall: Wall) {
    const { x, y } = this.getPixelPos(wall.pos);

    this.canvasContext.save();
    this.canvasContext.translate(x, y);

    const { w, h } = this.getPixelSize(wall.size);
    this.canvasContext.fillStyle = "#ffffff";
    this.canvasContext.fillRect(0, 0, w, h);

    this.canvasContext.restore();
  }

  private drawBreakableWall(wall: BreakableWall) {
    const { x, y } = this.getPixelPos(wall.pos);

    this.canvasContext.save();
    this.canvasContext.translate(x, y);

    const { w, h } = wall.pieceSize;
    const piecePixelWidth = this.horPixels(w),
      piecePixelHeight = this.verPixels(h);

    for (const { row, column, piece } of wall) {
      if (piece) {
        const xPixels = this.horPixels(column * w),
          yPixels = this.verPixels(row * h);

        this.canvasContext.fillStyle = "#ffffff";
        this.canvasContext.fillRect(
          xPixels,
          yPixels,
          piecePixelWidth,
          piecePixelHeight
        );
      }
    }

    this.canvasContext.restore();
  }

  /**
   * Draws metadata such as score, player remaining lives and so on.
   *
   * @param state
   */
  private drawMetadata(state: GameState, timeStep: number) {
    // draw hearts to show player's lives
    // draw score
    const fontSize = Math.min(30, this.verPixels(8));
    const yPixelsPadding = this.verPixels(displayPadding.ver);

    this.canvasContext.fillStyle = "#fff";
    this.canvasContext.font = `${fontSize}px monospace`;

    // draw the score of the player
    this.canvasContext.textAlign = "start";
    this.canvasContext.fillText(
      `SCORE ${state.player.score}`,
      this.horPixels(displayPadding.hor),
      fontSize + yPixelsPadding
    );

    // draw how many lives the player has
    this.canvasContext.textAlign = "end";
    this.canvasContext.fillText(
      `Lives ${state.player.lives}`,
      this.horPixels(100 - displayPadding.hor),
      fontSize + yPixelsPadding
    );

    // draw how many fps the game is running at
    const fps = Math.round(1 / timeStep);
    this.canvasContext.textAlign = "center";
    this.canvasContext.fillText(
      `${fps} FPS`,
      this.horPixels(50),
      fontSize + yPixelsPadding
    );
  }

  /**
   * Draws a screen for when the game is over.
   */
  private drawGameOverScreen() {}
}

/* ========================================================================= */
/* ========================== Controller =================================== */
/* ========================================================================= */

interface IView<State> {
  syncState(state: State, timeStep: number): void;
  setDisplaySize(): void;
  keys: KeysTracker;
}

/**
 * A class responsible for managing the flow of information between model (state) and view (display).
 */
class GameController {
  state: GameState;
  view: IView<GameState>;

  constructor(
    State: typeof GameState,
    Display: {
      new (
        state: GameState,
        controller: GameController,
        parentElement: HTMLElement
      ): IView<GameState>;
    }
  ) {
    this.state = State.start(basicInvaderPlan);
    this.view = new Display(this.state, this, document.body);
    this.view.syncState(this.state, 0);

    this.startAnimation();
  }

  private startAnimation() {
    runAnimation((timeStep) => {
      this.state.update(timeStep, this.view.keys);
      this.view.syncState(this.state, timeStep);

      if (this.state.status === "lost") {
        console.log("lost");
        return false;
      } else {
        return true;
      }
    });
  }
}

new GameController(GameState, CanvasDisplay);
