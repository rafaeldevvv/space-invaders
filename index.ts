/* ========================= Interfaces and Types ======================= */

interface Coords {
  x: number;
  y: number;
}

interface DisplaySize {
  w: DisplayUnit;
  h: DisplayUnit;
}

interface Size {
  w: number;
  h: number;
}

interface Wall {
  pos: Coords;
  size: {
    w: DisplayUnit;
    h: DisplayUnit;
  };
}

type TShooters = "player" | "alien";
type GameKeys = "Space" | "ArrowLeft" | "ArrowRight";

type Flags<Keys extends string> = {
  [Key in Keys]: boolean;
};

type KeysTracker = Flags<GameKeys>;

type DisplayUnit = `${number}d${"w" | "h"}`;

/* ========================== constants ========================= */

/* 
  the sizes are percentages within the display, from 0 to 100. 
  `cw` stands for display width, `ch` for display height
*/
const DIMENSIONS: {
  readonly alien: Size;
  readonly player: Size;
  readonly bullet: Size;
  readonly alienSetGap: Size;
} = {
  alien: {
    w: 5, // 5% of the display width
    h: 7, // 5% of the display height
  },
  player: {
    w: 5, // 5% of the display width
    h: 7, // 5% of the display height
  },
  bullet: {
    w: 2, // 2% of the display width
    h: 10, // 4% of the display height
  },
  alienSetGap: {
    w: 1, // 1% of the display width
    h: 1, // 1% of the display height
  },
};

const displayPadding = {
  hor: 3,
  ver: 5,
};

/* ========================== utilities ========================= */

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  plus(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  minus(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  times(factor: number) {
    return new Vector(this.x * factor, this.y * factor);
  }
}

function runAnimation(callback: (timeStep: number) => void) {
  let lastTime: null | number = null;
  function frame(time: number) {
    if (lastTime) {
      const timeStep = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      callback(timeStep);
    } else {
      lastTime = time;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function numberFromDisplayUnit(unit: DisplayUnit) {
  return Number(unit.replace(/d(w|h)/, ""));
}

function displayObjectPercentageWidth(unit: DisplayUnit | DisplaySize) {
  if (typeof unit === "string") {
    return numberFromDisplayUnit(unit);
  } else {
    return numberFromDisplayUnit(unit.w);
  }
}

function displayObjectPercentageHeight(unit: DisplayUnit | DisplaySize) {
  if (typeof unit === "string") {
    return numberFromDisplayUnit(unit);
  } else {
    return numberFromDisplayUnit(unit.h);
  }
}

function overlap(pos1: Coords, size1: Size, pos2: Coords, size2: Size) {
  return (
    pos1.x + size1.w > pos2.x &&
    pos1.x < pos2.x + size2.w &&
    pos1.y + size1.h > pos2.y &&
    pos1.y < pos2.y + size2.h
  );
}

/* ========================== classes ========================= */

const alienSetXSpeed = 5;
const alienSetYSpeed = 3;

class AlienSet {
  public pos: Vector | null = null;
  public numColumns: number;
  public numRows: number;
  public aliens: (Alien | null)[][];
  public direction: 1 | -1 = 1;

  constructor(plan: string) {
    const rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);

    this.numColumns = rows[0].length;
    this.numRows = rows.length;

    this.aliens = rows.map((row, y) => {
      return row.map((ch, x) => {
        return Alien.create(ch, { x, y });
      });
    });
  }

  update(state: GameState, timeStep: number) {
    let ySpeed = 0;

    if (this.pos!.x >= 100 - displayPadding.hor) {
      this.direction = -1;
      ySpeed = alienSetYSpeed;
    } else if (this.pos!.x <= displayPadding.hor) {
      this.direction = 1;
      ySpeed = alienSetYSpeed;
    }

    let xSpeed = alienSetXSpeed * this.direction;

    this.pos = this.pos!.plus(new Vector(xSpeed * timeStep, ySpeed));
  }

  removeAlien(x: number, y: number) {
    this.aliens[y][x] = null;
  }

  get length() {
    return this.aliens.reduce((allAliensCount, row) => {
      const rowCount = row.reduce((count, alien) => {
        if (alien !== null) return count + 1;
        else return count;
      }, 0);
      return allAliensCount + rowCount;
    }, 0);
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.numRows; y++) {
      for (let x = 0; x < this.numColumns; x++) {
        yield { x, y, alien: this.aliens[y][x] };
      }
    }
  }
}

class Alien {
  public readonly kind: "alien" = "alien";

  constructor(public gridPos: Coords, public score: number, public gun: Gun) {}

  fire(from: Coords) {
    /* bullet is fired from the center of the alien */
    const bulletX = from.x + DIMENSIONS.alien.w / 2;

    return this.gun.fire(new Vector(bulletX, from.y), "down");
  }

  canFire() {
    return this.gun.canFire();
  }

  static create(ch: string, gridPos: Coords) {
    switch (ch) {
      case ".": {
        return new Alien(gridPos, 100, new Gun("alien", 5, 1500));
      }
      case "x": {
        return new Alien(gridPos, 300, new Gun("alien", 10, 2500));
      }
      case "o": {
        return new Alien(gridPos, 500, new Gun("alien", 3, 1000));
      }
      default: {
        throw new Error("Unexpected character: " + ch);
      }
    }
  }
}

const playerXSpeed = 5;

class Player {
  public readonly kind: "player" = "player";

  public pos: Vector = new Vector(50, 95);
  public speed: Vector = new Vector(5, 0);
  public gun: Gun = new Gun("player", 4, 500);

  fire() {
    /* from the center of the player */
    const bulletPosX = this.pos.x + DIMENSIONS.player.w / 2;

    return this.gun.fire(new Vector(bulletPosX, this.pos.y), "up");
  }

  canFire() {
    return this.gun.canFire();
  }

  update(timeStep: number, keys: KeysTracker) {
    const movedX = new Vector(timeStep * playerXSpeed, 0);

    if (keys.ArrowLeft && this.pos.x > displayPadding.hor) {
      this.pos = this.pos.minus(movedX);
    } else if (
      keys.ArrowRight &&
      this.pos.x + DIMENSIONS.player.w < displayPadding.hor
    ) {
      this.pos = this.pos.plus(movedX);
    }
  }
}

class Gun {
  private lastFire?: number;

  constructor(
    public owner: TShooters,
    public bulletSpeed: number,
    public fireInterval: number
  ) {}

  fire(pos: Vector, direction: "up" | "down") {
    if (this.canFire()) {
      /* update lastFire prop to track the time of the last shot */
      this.lastFire = performance.now();
      return new Bullet(
        this.owner,
        pos,
        new Vector(0, direction === "up" ? -this.bulletSpeed : this.bulletSpeed)
      );
    }

    /* it returns null if it wasn't able to fire */
    return null;
  }

  canFire() {
    const lastFire = this.lastFire;
    const now = performance.now();

    if (!lastFire) {
      // if it hasn't fired yet, assign the current time to lastFire
      // prop, so that it can fire after the fireInterval has passed
      this.lastFire = now;
      return false;
    }

    const timeStep = now - lastFire;
    return timeStep >= this.fireInterval;
  }
}

class Bullet {
  constructor(
    public from: TShooters,
    public pos: Vector,
    public speed: Vector
  ) {}

  update(timeStep: number) {
    this.pos = this.pos.plus(this.speed.times(timeStep));
  }
}

/* 
Game Environment

this class is supposed to manage the position and sizes
of the objects and check things like colision */
class GameEnv {
  /* these are all percentages within the display */
  public alienSize: number;
  public alienSetWidth: number;
  public alienSetHeight: number;
  public alienSetGap: number;

  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public walls: Wall[]
  ) {
    this.alienSize = DIMENSIONS.alien.w;
    this.alienSetGap = DIMENSIONS.alienSetGap.w;

    this.alienSetWidth =
      this.alienSize * alienSet.numColumns +
      this.alienSetGap * (alienSet.numColumns - 1);
    this.alienSetHeight =
      this.alienSize * alienSet.numRows +
      this.alienSetGap * (this.alienSet.numRows - 1);

    alienSet.pos = new Vector(50 - this.alienSetWidth / 2, 10);
    this.alienSet = alienSet;
  }

  getAlienPos({ gridPos: { x, y } }: Alien): Vector {
    return new Vector(
      /* alienSet positions + sizes + gaps */
      this.alienSet.pos!.x + x * this.alienSize + x * this.alienSetGap,
      this.alienSet.pos!.y + y * this.alienSize + y * this.alienSetGap
    );
  }

  isActorShot(bullets: Bullet[], actorPos: Coords, actorSize: Size) {
    return bullets.some((bullet) => {
      return overlap(bullet.pos, DIMENSIONS.bullet, actorPos, actorSize);
    });
  }
}

class GameState {
  public bullets: Bullet[] = [];
  public playerLives: number = 3;
  public status: "lost" | "won" | "running" = "running";

  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public env: GameEnv
  ) {}

  /*
    ####################################################################################
    IMPLEMENT THIS ONE #################################################################
    ####################################################################################
  */
  update(timeStep: number, keys: KeysTracker) {
    this.alienSet.update(this, timeStep);
    this.bullets.forEach(bullet => bullet.update(timeStep));

    this.player.update(timeStep, keys);
    if (keys.Space && this.player.canFire()) {
      this.bullets.push(this.player.fire()!);
    }

    const playerBullets = this.bullets.filter(
      (bullet) => bullet.from === "player"
    );

    for (const { x, y, alien } of this.alienSet) {
      if (!alien) continue;

      if (
        this.env.isActorShot(
          playerBullets,
          this.env.getAlienPos(alien),
          DIMENSIONS.alien
        )
      ) {
        this.alienSet.removeAlien(x, y);
      }

      if (alien.canFire()) {
        this.bullets.push(alien.fire(this.env.getAlienPos(alien))!);
      }
    }

    const alienBullets = this.bullets.filter(
      (bullet) => bullet.from === "alien"
    );
    
    if (
      this.env.isActorShot(alienBullets, this.player.pos, DIMENSIONS.player)
    ) {
      this.playerLives--;
    }

    if (this.alienSet.length === 0) {
      this.status = "won";
    } else if (this.playerLives === 0) {
      this.status = "lost";
    }
  }
}

const basicInvaderPlan = `
..xxooooxx..
............`;


const alienSet = new AlienSet(basicInvaderPlan);
console.log("AlienSet has", alienSet.length, "length");

const i = Alien.create("x", { x: 0, y: 0 });
console.log(i);

let a: Alien = {
  kind: "alien",
  gridPos: { x: 8, y: 8 },
  score: 899,
  gun: new Gun("alien", 5, 200),
  fire(from: Coords): Bullet {
    throw "";
  },
  canFire(): boolean {
    throw "";
  },
};