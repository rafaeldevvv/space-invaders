/* ========================= Interfaces and Types ======================= */

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
 * `.` represents the lowest level alien.
 * `x` represents the medium level alien.
 * `o` represents the highest level alien.
 */
const alienTypes = [".", "x", "o"] as const;
type TAliens = (typeof alienTypes)[number];

const alienTypesRegExp = new RegExp(
  `(\\w*(${alienTypes.join("|")})*\\w*)+`,
  ""
);

/**
 * It takes a union of strings and generate an object type whose
 * property names are the strings passed in and whose property values are booleans.
 */
type FlagsFromUnion<Keys extends string> = {
  [Key in Keys]: boolean;
};

// this is for methods that expect a keys tracker
type GameKeys = " " | "ArrowLeft" | "ArrowRight";
type KeysTracker = FlagsFromUnion<GameKeys>;

/* ========================== constants ========================= */

/**
 * The dimensions of all objects in the game.
 * The sizes are percentages within the display, from 0 to 100.
 */
const DIMENSIONS: {
  readonly alien: Size;
  readonly player: Size;
  readonly bullet: Size;
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
  bullet: {
    w: 0.5, // 0.5% of the display width
    h: 3, // 3% of the display height
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

const arrowRightKey = "ArrowRight";
const arrowLeftKey = "ArrowLeft";
const spaceKey = " ";

const displayMaxWidth = 720;
const displayAspectRatio = 4 / 3;

/* ========================== utilities ========================= */

/**
 * Class representing a vector.
 */
class Vector {
  x: number;
  y: number;

  /**
   * Create a Vector.
   *
   * @param x - The position along the horizontal axis.
   * @param y - The position along the vertical axis.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add two Vector objects' axes' values.
   *
   * @param other - Another Vector to add to the current one.
   * @returns - A Vector with the added axes of both previous vectors.
   */
  plus(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  /**
   * Subtract one Vector's axes' values from another Vector.
   *
   * @param other - Another Vector to subtract from the current one.
   * @returns - A Vector with subtracted axes.
   */
  minus(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  /**
   * Mulitply a Vector's axes' values by a number.
   *
   * @param factor - A number by which the method will multiply the Vector's axes.
   * @returns - A Vector with multiplied axes.
   */
  times(factor: number) {
    return new Vector(this.x * factor, this.y * factor);
  }
}

/**
 * Run an animation.
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
      const timeStep = Math.min((time - lastTime) / 1000, 0.1);
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
 * Generate a random number between two numbers.
 *
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns - A random number between min and max value.
 */
function randomNum(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/**
 * Check whether two objects overlap.
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
 * Calculate the size of an HTML Element excluding padding, border and margin
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
 * Keep track of which keyboard keys are currently held down.
 *
 * @param keys - An array of strings representing key names.
 * @returns - An object whose property names are the strings within `keys`.
 */
function keysTracker<Type extends string>(keys: Type[]): FlagsFromUnion<Type> {
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

/* ==================================================================== */
/* ===================== Game Components ============================== */
/* ==================================================================== */

/*
  `(100 - displayPadding.hor * 2)` is the area within the padding edges
  divide it by twenty so that we have 20 steps along the display
*/
const alienSetXStep = (100 - displayPadding.hor * 2) / 20;
const alienSetYStep = 5;
const alienSetMoveTime = 1;

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
  public pos: Vector | null = null;
  public numColumns: number;
  public numRows: number;
  public aliens: (Alien | null)[][];
  public direction: HorizontalDirection = 1;

  /**
   * A variable that manages when the AlienSet's position can update.
   * When it is greater than or equal to alienSetMoveTime, then the alien set can move.
   */
  private timeStepSum = 0;

  /**
   * Create an AlienSet.
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

    this.aliens = rows.map((row, y) => {
      return row.map((ch, x) => {
        return Alien.create(ch as TAliens, { x, y });
      });
    });
  }

  /**
   * Update the AlienSet instance.
   *
   * @param timeStep - The time that has passed since the last update.
   */
  update(timeStep: number) {
    this.timeStepSum += timeStep;

    let movedY = 0;

    /* 
      if it is going right and it has touched 
      the padding area and it can update its position
    */
    if (
      this.pos!.x + state.env.alienSetWidth >= 100 - displayPadding.hor &&
      this.timeStepSum >= alienSetMoveTime &&
      this.direction === HorizontalDirection.Right
    ) {
      this.direction = HorizontalDirection.Left;
      movedY = alienSetYStep;
    } else if (
      /* if it is going left and has touched the padding area and can update */
      this.pos!.x <= displayPadding.hor &&
      this.timeStepSum >= alienSetMoveTime &&
      this.direction === HorizontalDirection.Left
    ) {
      this.direction = HorizontalDirection.Right;
      movedY = alienSetYStep;
    }

    let movedX = 0;
    /* if can update and has not moved down */
    if (this.timeStepSum >= alienSetMoveTime && movedY === 0) {
      if (this.direction === HorizontalDirection.Right) {
        /*
          here we get either the distance left to reach the inner right padding edge
          or the normal step to move
        */
        movedX = Math.min(
          alienSetXStep,
          100 - this.pos!.x - displayPadding.hor - state.env.alienSetWidth
        );
      } else {
        /*
          here we get either the distance left to reach the inner left padding edge
          or the normal step to move
        */
        movedX = Math.min(alienSetXStep, this.pos!.x - displayPadding.hor);
      }
      movedX *= this.direction;
    }

    /* reset */
    if (this.timeStepSum >= alienSetMoveTime) {
      this.timeStepSum = 0;
    }

    this.pos = this.pos!.plus(new Vector(movedX, movedY));
  }

  /**
   * Remove an alien from the set.
   *
   * @param x - The X position of the alien within the grid.
   * @param y - The Y position of the alien within the grid.
   */
  removeAlien(x: number, y: number) {
    this.aliens[y][x] = null;
  }

  /**
   * The current number of aliens that are alive.
   */
  get length() {
    return this.aliens.reduce((allAliensCount, row) => {
      const rowCount = row.reduce((rowCount, alien) => {
        if (alien !== null) return rowCount + 1;
        else return rowCount;
      }, 0);

      return allAliensCount + rowCount;
    }, 0);
  }

  /**
   * Iterate through the AlienSet, yielding every alien in the set
   */
  *[Symbol.iterator]() {
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
   * Create an Alien.
   *
   * @param gridPos - The position of the alien within the alien set.
   * @param score - The score the player gets when it kills this alien.
   * @param gun - The gun of the alien.
   * @param alienType - The type of the alien.
   */
  constructor(
    public readonly gridPos: Coords,
    public readonly score: number,
    public readonly gun: Gun,
    public readonly alienType: TAliens
  ) {}

  /**
   * Fire an alien bullet.
   *
   * @param alienPos - The position from where the alien fires.
   * @returns {Bullet | null} - The fired bullet or null if the gun wasn't able to fire.
   */
  fire(alienPos: Coords) {
    /* bullet is fired from the center of the alien */
    const bulletX =
      alienPos.x + DIMENSIONS.alien.w / 2 - DIMENSIONS.bullet.w / 2;

    return this.gun.fire(new Vector(bulletX, alienPos.y), "down");
  }

  /**
   * Create an alien based on a character.
   *
   * @param ch - The type of the alien represented by a character.
   * @param gridPos - The position of the alien within the grid.
   * @returns - A specific alien type.
   */
  static create(ch: TAliens, gridPos: Coords) {
    switch (ch) {
      case ".": {
        return new Alien(gridPos, 20, new Gun("alien", 40, 4000), ch);
      }
      case "x": {
        return new Alien(gridPos, 40, new Gun("alien", 60, 6000), ch);
      }
      case "o": {
        return new Alien(gridPos, 60, new Gun("alien", 80, 7000), ch);
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

  public readonly gun: Gun = new Gun("player", 70, 400);

  public lives = 3;
  public score = 0;

  /**
   * Fire a player's bullet.
   *
   * @returns {Bullet | null} - The fired bullet or null if the fun wasn't able to fire.
   */
  fire() {
    /* from the center of the player */
    const bulletPosX =
      this.pos.x + DIMENSIONS.player.w / 2 - DIMENSIONS.bullet.w / 2;

    return this.gun.fire(new Vector(bulletPosX, this.pos.y), "up");
  }

  /**
   * Reset the position of the Player.
   */
  resetPos() {
    this.pos = new Vector(this.baseXPos, this.baseYPos);
  }

  /**
   * Update the Player.
   *
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param keys - An object that tracks which keys are currently held down.
   */
  update(state: GameState, timeStep: number, keys: KeysTracker) {
    const movedX = new Vector(timeStep * playerXSpeed, 0);

    if (keys[arrowLeftKey] && this.pos.x > displayPadding.hor) {
      this.pos = this.pos.minus(movedX);
    } else if (
      keys[arrowRightKey] &&
      this.pos.x + DIMENSIONS.player.w < 100 - displayPadding.hor
    ) {
      this.pos = this.pos.plus(movedX);
    }

    if (keys[spaceKey] && this.gun.canFire()) {
      state.bullets.push(this.fire()!);
    }
  }
}

/**
 * Class representing a gun.
 */
class Gun {
  private lastFire: number;
  private fireInterval: number;

  /**
   * Create a Gun.
   *
   * @param owner - The object which fires the gun.
   * @param bulletSpeed - The speed of the bullet.
   * @param baseFireInterval - The time it takes for the gun to fire again.
   */
  constructor(
    public owner: TShooters,
    private bulletSpeed: number,
    private baseFireInterval: number,
  ) {
    // to give a random initial fireInterval
    this.fireInterval = randomNum(0.9 * baseFireInterval, baseFireInterval);
    this.lastFire = performance.now() - randomNum(0, baseFireInterval);
  }

  /**
   * Fire a bullet from a position.
   *
   * @param pos - The position from where the gun is fired.
   * @param direction - The direction the bullet goes.
   * @returns - A bullet or null if the gun wasn't able to fire.
   */
  fire(pos: Vector, direction: "up" | "down") {
    if (this.canFire()) {
      /* update lastFire prop to track the time of the last shot */
      this.lastFire = performance.now();

      /* generate random fire interval for dynamic gameplay */
      this.fireInterval = randomNum(0.9 * this.baseFireInterval, this.baseFireInterval);
      
      return new Bullet(
        this.owner,
        pos,
        new Vector(0, direction === "up" ? -this.bulletSpeed : this.bulletSpeed)
      );
    }

    /* it returns null if it wasn't able to fire */
    return null;
  }

  /**
   * Check whether the gun can be fired.
   *
   * @returns - A boolean value saying whether the gun can fire.
   */
  canFire() {
    const lastFire = this.lastFire;
    const now = performance.now();

    const timeStep = now - lastFire;
    return timeStep >= this.fireInterval;
  }
}

/**
 * Class representing a bullet.
 */
class Bullet {
  /**
   * Create a bullet.
   *
   * @param from - A string representing the object that fired.
   * @param pos - The position from where the bullet was fired.
   * @param speed - The speed of the bullet.
   */
  constructor(
    public from: TShooters,
    public pos: Vector,
    public speed: Vector
  ) {}

  update(timeStep: number) {
    this.pos = this.pos.plus(this.speed.times(timeStep));
  }

  collide(state: GameState) {
    state.bullets = state.bullets.filter((bullet) => bullet !== this);
  }
}

/**
 * Class representing a wall.
 */
class Wall {
  /**
   * Create a wall.
   *
   * @param pos - The position of the wall.
   * @param size - The size of the wall.
   */
  constructor(public pos: Coords, public size: Size) {}
}

/* ========================================================================= */
/* ========================== Environment and State ======================== */
/* ========================================================================= */

/**
 * Class representing the Game Environment responsible
 * for managing the positions and sizes
 * of the objects and checking things like colision.
 */
class GameEnv {
  /* these are all percentages within the display */
  public alienSetWidth: number;
  public alienSetHeight: number;

  /**
   * Initialize the game environment.
   *
   * @param alienSet - The aliens.
   * @param player - The player.
   * @param walls - The walls.
   */
  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public walls: Wall[]
  ) {
    this.alienSetWidth =
      DIMENSIONS.alien.w * alienSet.numColumns +
      DIMENSIONS.alienSetGap.w * (alienSet.numColumns - 1);
    this.alienSetHeight =
      DIMENSIONS.alien.h * alienSet.numRows +
      DIMENSIONS.alienSetGap.h * (this.alienSet.numRows - 1);

    alienSet.pos = new Vector(
      50 - this.alienSetWidth / 2,
      displayPadding.ver + 10
    );
    this.alienSet = alienSet;
  }

  /**
   * Get the position of an alien within the whole game screen.
   *
   * @param param0 - The alien.
   * @returns - The position of the alien.
   */
  getAlienPos({ gridPos: { x, y } }: Alien): Vector {
    return new Vector(
      /* alienSet positions + sizes + gaps */
      this.alienSet.pos!.x +
        x * DIMENSIONS.alien.w +
        x * DIMENSIONS.alienSetGap.w,
      this.alienSet.pos!.y +
        y * DIMENSIONS.alien.h +
        y * DIMENSIONS.alienSetGap.h
    );
  }

  /**
   * Check whether a bullet touches a wall.
   *
   * @param bullet - The bullet whose position needs to be checked as overlapping a wall.
   * @returns - A boolean value which says whether the bullet touches a wall.
   */
  bulletTouchesWall(bullet: Bullet) {
    return this.walls.some((wall) => {
      return overlap(wall.pos, wall.size, bullet.pos, DIMENSIONS.bullet);
    });
  }

  /**
   * Check whether the bullet is outside the boundaries of the screen.
   * 
   * @param bullet
   * @returns
   */
  isBulletOffLimits(bullet: Bullet) {
    return bullet.pos.y >= 100 || bullet.pos.y + DIMENSIONS.bullet.h <= 0;
  }

  /**
   * Check whether the alien set has reached the wall.
   *
   * @returns - A boolean value that says whether the alien set has reached a wall.
   */
  alienSetReachedWall() {
    return this.alienSet.pos!.y + this.alienSetHeight >= this.walls[0].pos.y;
  }

  /**
   * Check whether an object in the game has been shot.
   *
   * @param bullet - A bullet that may hit the object.
   * @param actorPos - The position of the object.
   * @param actorSize - The size of the object.
   * @returns - A boolean value that says whether the object is shot.
   */
  isActorShot(bullet: Bullet, actorPos: Coords, actorSize: Size) {
    return overlap(bullet.pos, DIMENSIONS.bullet, actorPos, actorSize);
  }
}

/**
 * Class that manages the state of a running game.
 */
class GameState {
  public bullets: Bullet[] = [];
  public status: "lost" | "won" | "running" = "running";

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
   * Update the state of the game.
   *
   * @param timeStep - The time in seconds that has passed since the last update.
   * @param keys - An object that tracks which keys on the keyboard are currently being pressed down.
   */
  update(timeStep: number, keys: KeysTracker) {
    this.alienSet.update(timeStep);
    this.bullets.forEach((bullet) => bullet.update(timeStep));

    this.player.update(this, timeStep, keys);

    const playerBullets = this.bullets.filter(
      (bullet) => bullet.from === "player"
    );

    /*  
      check if any of the player bullets hits an alien, and if it does, 
      the score is increased and alien and bullet are removed 
    */
    for (const playerBullet of playerBullets) {
      for (const alien of this.alienSet) {
        if (!alien) continue;

        if (
          this.env.isActorShot(
            playerBullet,
            this.env.getAlienPos(alien),
            DIMENSIONS.alien
          )
        ) {
          this.player.score += alien.score;
          this.alienSet.removeAlien(alien.gridPos.x, alien.gridPos.y);
          playerBullet.collide(this);
        }
      }
    }


    for (const alien of this.alienSet) {
      if (!alien) continue;

      if (alien.gun.canFire()) {
        this.bullets.push(alien.fire(this.env.getAlienPos(alien))!);
      }
    }

    const alienBullets = this.bullets.filter(
      (bullet) => bullet.from === "alien"
    );

    alienBullets.forEach((b) => {
      if (this.env.isActorShot(b, this.player.pos, DIMENSIONS.player)) {
        this.player.lives--;
        this.player.resetPos();
        b.collide(this);
      }
    });

    if (this.alienSet.length === 0) {
      this.status = "won";
    } else if (this.player.lives === 0) {
      this.status = "lost";
    }

    if (this.env.alienSetReachedWall()) {
      this.env.walls = [];
      this.status = "lost";
    }

    this.removeUnnecessaryBullets();
  }

  /**
   * Remove the bullets that are not relevant for the game anymore.
   */
  removeUnnecessaryBullets() {
    const necessaryBullets = [];
    for (const bullet of this.bullets) {
      if (
        !this.env.isBulletOffLimits(bullet) &&
        !this.env.bulletTouchesWall(bullet)
      ) {
        necessaryBullets.push(bullet);
      }
    }

    this.bullets = necessaryBullets;
  }

  /**
   * Create a basic initial game state.
   *
   * @param plan - A string represeting an arranged set of aliens.
   * @returns - A initial state for the game.
   */
  static start(plan: string) {
    const alienSet = new AlienSet(plan);
    const player = new Player();
    const walls: Wall[] = [
      new Wall({ x: 20, y: 75 }, { w: 20, h: 5 }),
      new Wall({ x: 60, y: 75 }, { w: 20, h: 5 }),
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
  ".": "limegreen",
  x: "orange",
  o: "pink",
};

/**
 * Class represeting a view component used to display the game state.
 * It uses the HTML Canvas API.
 */
class CanvasDisplay {
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  /**
   * Create a view component for the game that uses the Canvas API.
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

    this.setDisplaySize();
    this.defineEventListeners();
    this.syncState(state);
  }

  defineEventListeners() {
    window.addEventListener("resize", () => {
      this.setDisplaySize();
      this.syncState(this.state);
    });
  }

  private get canvasWidth() {
    return this.canvas.width;
  }

  private get canvasHeight() {
    return this.canvas.height;
  }

  /**
   * Calculate the horizontal pixels according to a percentage of the canvas width.
   *
   * @param percentage - The percentage of the canvas width.
   * @returns - The corresponding horizontal pixels.
   */
  private horPixels(percentage: number) {
    return (percentage / 100) * this.canvasWidth;
  }

  /**
   * Calculate the vertical pixels according to a percentage of the canvas height.
   *
   * @param percentage - The percentage of the canvas heigth.
   * @returns - The corresponding vertical pixels.
   */
  private verPixels(percentage: number) {
    return (percentage / 100) * this.canvasHeight;
  }

  /**
   * Calculate the pixel position of an object within the canvas based on a percentage position.
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
   * Calculate the pixel size of an object within the canvas based on a percentage size.
   *
   * @param percentagePos - The percentage size.
   * @returns - The corresponding pixel size.
   */
  private getPixelSize(percentageSize: Size): PixelSize {
    return {
      w: this.horPixels(percentageSize.w),
      h: this.verPixels(percentageSize.h),
    };
  }

  /**
   * Set the size of the canvas based on the size of the its parent element.
   */
  setDisplaySize() {
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
   * Synchonize the view with a new model (state).
   *
   * @param state - A new game state.
   */
  syncState(state: GameState) {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawAlienSet(state.alienSet);
    this.drawPlayer(state.player);
    this.drawBullets(state.bullets);
    this.drawWalls(state.env.walls);
    this.drawMetadata(state);
  }

  /**
   * Draw the alien set onto the canvas.
   *
   * @param alienSet
   */
  drawAlienSet(alienSet: AlienSet) {
    const alienSetXPos = alienSet.pos!.x;

    for (const alien of alienSet) {
      if (!alien) continue;

      const xPercentage =
        alienSetXPos +
        alien.gridPos.x * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);

      const yPercentage =
        alienSet.pos!.y +
        alien.gridPos.y * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);

      this.drawAlien(alien, {
        x: xPercentage,
        y: yPercentage,
      });
    }
  }

  /**
   * Draw an alien onto the canvas.
   *
   * @param alien
   * @param pos - A percentage position.
   */
  drawAlien(alien: Alien, pos: Coords) {
    const { w, h } = this.getPixelSize(DIMENSIONS.alien);
    const { x, y } = this.getPixelPos(pos);

    this.canvasContext.fillStyle = alienColors[alien.alienType];
    this.canvasContext.fillRect(x, y, w, h);
  }

  /**
   * Draw an array of bullets onto the canvas.
   *
   * @param bullets
   */
  drawBullets(bullets: Bullet[]) {
    for (const bullet of bullets) {
      this.drawBullet(bullet);
    }
  }

  /**
   * Draw a bullet onto the canvas.
   *
   * @param bullet
   */
  drawBullet(bullet: Bullet) {
    const { x, y } = this.getPixelPos(bullet.pos);
    const { w, h } = this.getPixelSize(DIMENSIONS.bullet);

    this.canvasContext.fillStyle =
      bullet.from === "alien" ? "limegreen" : "white";
    this.canvasContext.fillRect(x, y, w, h);
  }

  /**
   * Draw player onto the canvas.
   *
   * @param player
   */
  drawPlayer(player: Player) {
    const { x, y } = this.getPixelPos(player.pos);
    const { w, h } = this.getPixelSize(DIMENSIONS.player);

    this.canvasContext.fillStyle = "white";
    this.canvasContext.fillRect(x, y, w, h);
  }

  /**
   * Draw walls onto canvas.
   *
   * @param walls
   */
  drawWalls(walls: Wall[]) {
    for (const wall of walls) {
      const { x, y } = this.getPixelPos(wall.pos);
      const { w, h } = this.getPixelSize(wall.size);

      this.canvasContext.fillStyle = "#ffffff";
      this.canvasContext.fillRect(x, y, w, h);
    }
  }

  /**
   * Draw metadata such as score, player remaining lives and so on.
   *
   * @param state
   */
  drawMetadata(state: GameState) {
    // draw hearts to show player's lives
    // draw score
    const fontSize = Math.min(30, this.verPixels(8));

    this.canvasContext.fillStyle = "#fff";
    this.canvasContext.font = `${fontSize}px monospace`;

    this.canvasContext.textAlign = "start";
    this.canvasContext.fillText(
      `SCORE ${state.player.score}`,
      this.horPixels(displayPadding.hor),
      fontSize + this.verPixels(displayPadding.ver)
    );

    this.canvasContext.textAlign = "end";
    this.canvasContext.fillText(
      `Lives ${state.player.lives}`,
      this.horPixels(100 - displayPadding.hor),
      fontSize + this.verPixels(displayPadding.ver)
    );
  }

  /**
   * Draw a screen for when the game is over.
   */
  drawGameOverScreen() {}
}

/* ========================================================================= */
/* ========================== Controller =================================== */
/* ========================================================================= */

/**
 * A class responsible for managing the flow of information between model (state) and view (display).
 */
class GameController {}

const basicInvaderPlan = `
.xxooxx.
.oo..oo.
...xx...`;

//
const a: Alien = {
  actorType: "alien",
  alienType: ".",
  gridPos: { x: 8, y: 8 },
  score: 899,
  gun: new Gun("alien", 5, 200),
  fire(from: Coords): Bullet {
    throw "";
  },
};

const state = GameState.start(basicInvaderPlan);
const canvasDisplay = new CanvasDisplay(
  state,
  new GameController(),
  document.body
);

const keys = keysTracker([arrowRightKey, arrowLeftKey, spaceKey]);

runAnimation((timeStep) => {
  canvasDisplay.syncState(state);

  if (state.status === "lost") {
    console.log("lost");
    return false;
  } else if (state.status === "won") {
    console.log("won");
    return false;
  } else {
    state.update(timeStep, keys);
    return true;
  }
});
