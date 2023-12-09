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
type DisplayUnit = `${number}d${"w" | "h"}`;

/* ========================== constants ========================= */

/* 
  the sizes are percentages within the display, from 0 to 100. 
  `cw` stands for display width, `ch` for display height 
*/
const DIMENSIONS: {
  readonly alien: DisplayUnit;
  readonly player: DisplayUnit;
  readonly bullet: DisplaySize;
  readonly padding: DisplayUnit;
  readonly alienSetGap: DisplayUnit;
} = {
  alien: `5dw`, // 5% of the display width
  player: `5dw`, // 5% of the display width
  padding: `3dw`,
  bullet: {
    w: "2dw",
    h: "4dw",
  }, // 3% of the display width
  alienSetGap: `1dw`,
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

function numberFromCanvasUnit(unit: DisplayUnit) {
  return Number(unit.replace(/d(w|h)/, ""));
}

function canvasObjectPercentageWidth(unit: DisplayUnit | DisplaySize) {
  if (typeof unit === "string") {
    return numberFromCanvasUnit(unit);
  } else {
    return numberFromCanvasUnit(unit.w);
  }
}

function canvasObjectPercentageHeight(unit: DisplayUnit | DisplaySize) {
  if (typeof unit === "string") {
    return numberFromCanvasUnit(unit);
  } else {
    return numberFromCanvasUnit(unit.h);
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

class AlienSet {
  public pos: Vector | null = null;
  width: number;
  height: number;
  aliens: Alien[][];

  constructor(plan: string) {
    const rows = plan
      .trim()
      .split("\n")
      .map((l) => [...l]);

    this.width = rows[0].length;
    this.height = rows.length;

    this.aliens = rows.map((row, y) => {
      return row.map((ch, x) => {
        return Alien.create(ch, { x, y });
      });
    });
  }

  *[Symbol.iterator]() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        yield { x, y, alien: this.aliens[y][x] };
      }
    }
  }
}

class Alien {
  kind: "alien" = "alien";

  constructor(public gridPos: Coords, public score: number, public gun: Gun) {}

  fire(from: Coords) {
    /* bullet is fired from the center of the alien */
    const bulletX = from.x + canvasObjectPercentageWidth(DIMENSIONS.alien) / 2;

    return this.gun.fire(new Vector(bulletX, from.y));
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

class Player {
  public kind: "player" = "player";

  public pos: Vector = new Vector(50, 95);
  public speed: Vector = new Vector(5, 0);
  public gun: Gun = new Gun("player", 4, 500);

  fire() {
    return new Bullet("player", this.pos, new Vector(0, 4));
  }

  canFire() {
    return this.gun.canFire();
  }

  update(timeStep: number) {
    this.pos = this.pos.plus(this.speed.times(timeStep));
  }
}

class Gun {
  private lastFire?: number;

  constructor(
    public owner: TShooters,
    public bulletSpeed: number,
    public fireInterval: number
  ) {}

  fire(pos: Vector) {
    if (this.canFire()) {
      /* update lastFire prop to track the time of the last shot */
      this.lastFire = performance.now();
      return new Bullet(this.owner, pos, new Vector(0, this.bulletSpeed));
    }

    /* it return false if it wasn't able to fire */
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

/* this class is supposed to manage the position
 of the objects and check things like colision */
class GameEnvironment {
  bullets: Bullet[] = [];
  alienPercentageSize: number;
  alienSetGap: number;

  constructor(
    public alienSet: AlienSet,
    public player: Player,
    public walls: Wall[]
  ) {
    const alientSetWidth = alienSet.width;

    this.alienPercentageSize = canvasObjectPercentageWidth(DIMENSIONS.alien);
    this.alienSetGap = canvasObjectPercentageWidth(DIMENSIONS.alienSetGap);

    const alienSetCanvasWidth =
      this.alienPercentageSize * alientSetWidth +
      this.alienSetGap * (alientSetWidth - 1);

    alienSet.pos = new Vector(50 - alienSetCanvasWidth / 2, 10);
    this.alienSet = alienSet;
  }

  getAlienPos(gridX: number, gridY: number): Vector {
    return new Vector(
      /* sizes + gaps */
      gridX * this.alienPercentageSize + gridX * this.alienSetGap,
      gridY * this.alienPercentageSize + gridY * this.alienSetGap
    );
  }

  isActorShot(actor: Alien | Player): boolean {
    let actorSize: Size;

    if (actor.kind == "alien") {
      actorSize = {
        w: canvasObjectPercentageWidth(DIMENSIONS.alien),
        h: canvasObjectPercentageHeight(DIMENSIONS.alien),
      };
    } else {
      actorSize = {
        w: canvasObjectPercentageWidth(DIMENSIONS.player),
        h: canvasObjectPercentageHeight(DIMENSIONS.player),
      };
    }

    let bulletSize = {
      w: canvasObjectPercentageWidth(DIMENSIONS.bullet),
      h: canvasObjectPercentageHeight(DIMENSIONS.bullet),
    };

    /* if some bullet overlaps the actor */
    return this.bullets.some((bullet) => {
      if (
        overlap(
          actor.kind == "alien"
            ? this.getAlienPos(actor.gridPos.x, actor.gridPos.y)
            : actor.pos,
          actorSize,
          bullet.pos,
          bulletSize
        )
      ) {
      }
    });
  }
}

/*
  All classes, except for the one responsible for displaying things, 
  manage positions and size with percentages 
*/
class GameState {}

const basicInvaderPlan = `
..xxooooxx..
............`;

const alienSet = new AlienSet(basicInvaderPlan);

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
