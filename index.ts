/* ========================= Interfaces and Types ======================= */

interface Coords {
  x: number;
  y: number;
}

/* 
this is just to make it clear what
 kind of coords the function expects 
 */
interface PixelCoords extends Coords {}

interface Display {
  syncState(state: GameState): void;
}

interface DisplaySize {
  w: DisplayUnit;
  h: DisplayUnit;
}

type DisplayUnit = `${number}d${"w" | "h"}`;

interface Size {
  w: number;
  h: number;
}

interface PixelSize extends Size {}

type TShooters = "player" | "alien";
type GameKeys = " " | "ArrowLeft" | "ArrowRight";
type TAliens = "." | "x" | "o";

type Flags<Keys extends string> = {
  [Key in Keys]: boolean;
};

type KeysTracker = Flags<GameKeys>;


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
    w: 1, // 2% of the display width
    h: 3, // 4% of the display height
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

function runAnimation(callback: (timeStep: number) => boolean) {
  let lastTime: null | number = null;
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

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
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

const alienSetXSpeed = 10;
const alienSetYSpeed = 5;

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

    if (this.pos!.x + state.env.alienSetWidth >= 100 - displayPadding.hor) {
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
  public readonly actorType: "alien" = "alien";

  constructor(
    public readonly gridPos: Coords,
    public readonly score: number,
    public readonly gun: Gun,
    public readonly alienType: TAliens
  ) {}

  fire(from: Coords) {
    /* bullet is fired from the center of the alien */
    const bulletX = from.x + DIMENSIONS.alien.w / 2 - DIMENSIONS.bullet.w / 2;

    return this.gun.fire(new Vector(bulletX, from.y), "down");
  }

  canFire() {
    return this.gun.canFire();
  }

  static create(ch: string, gridPos: Coords) {
    switch (ch) {
      case ".": {
        return new Alien(gridPos, 100, new Gun("alien", 50, 2000), ch);
      }
      case "x": {
        return new Alien(gridPos, 300, new Gun("alien", 80, 5500), ch);
      }
      case "o": {
        return new Alien(gridPos, 500, new Gun("alien", 30, 3000), ch);
      }
      default: {
        throw new Error("Unexpected character: " + ch);
      }
    }
  }
}

const playerXSpeed = 30;

class Player {
  public readonly actorType: "player" = "player";

  public pos: Vector = new Vector(50 - DIMENSIONS.player.w / 2, 90);
  public speed: Vector = new Vector(5, 0);
  public gun: Gun = new Gun("player", 70, 500);

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
      this.pos.x + DIMENSIONS.player.w < 100 - displayPadding.hor
    ) {
      this.pos = this.pos.plus(movedX);
    }
  }
}

class Gun {
  private lastFire: number;

  constructor(
    public owner: TShooters,
    public bulletSpeed: number,
    public fireInterval: number
  ) {
    // to give a random initial fireInterval
    this.lastFire = performance.now() - random(0, fireInterval);
  }

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

  update(state: GameState, timeStep: number) {
    this.pos = this.pos.plus(this.speed.times(timeStep));

    /* const shotPlayer =
      this.from === "alien" &&
      state.env.isActorShot([this], state.player.pos, DIMENSIONS.player);
    let shotAlien = false;

    for (const { alien } of state.alienSet) {
      if (!alien) continue;

      shotAlien =
        state.env.isActorShot(
          [this],
          state.env.getAlienPos(alien),
          DIMENSIONS.alien
        ) && this.from === "player";
    }

    if (
      this.pos.y >= 100 ||
      this.pos.y + DIMENSIONS.bullet.h <= 0 ||
      state.env.bulletTouchesWall(this) ||
      shotPlayer ||
      shotAlien
    ) {
      state.bullets = state.bullets.filter((bullet) => bullet !== this);
    } */
  }
}

class Wall {
  constructor(public pos: Coords, public size: Size) {}
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

  bulletTouchesWall(bullet: Bullet) {
    return this.walls.some((wall) => {
      return overlap(wall.pos, wall.size, bullet.pos, DIMENSIONS.bullet);
    });
  }

  bulletShouldBeRemoved(bullet: Bullet) {
    let touches = false;

    if (
      this.isActorShot([bullet], this.player.pos, DIMENSIONS.player) &&
      bullet.from === "alien"
    )
      touches = true;

    if (this.bulletTouchesWall(bullet)) touches = true;

    for (const { alien } of this.alienSet) {
      if (bullet.from === "alien") break;
      if (!alien) continue;

      if (
        this.isActorShot([bullet], this.getAlienPos(alien), DIMENSIONS.alien)
      ) {
        touches = true;
        break;
      }
    }

    return touches;
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
    this.bullets.forEach((bullet) => bullet.update(this, timeStep));

    this.player.update(timeStep, keys);
    if (keys[" "] && this.player.canFire()) {
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

    this.removeUnnecessaryBullets();
  }

  removeUnnecessaryBullets() {
    for (const bullet of this.bullets) {
      if (
        bullet.pos.y >= 100 ||
        bullet.pos.y + DIMENSIONS.bullet.h <= 0 ||
        this.env.bulletShouldBeRemoved(bullet)
      ) {
        this.bullets = this.bullets.filter((b) => b !== bullet);
      }
    }
  }

  static Start(plan: string) {
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

function getElementInnerDimensions(element: HTMLElement): Size {
  const cs = getComputedStyle(element);

  console.log(cs.paddingInlineStart);

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

const alienColors: {
  [Key in TAliens]: string;
} = {
  ".": "limegreen",
  x: "orange",
  o: "pink",
};

class CanvasDisplay {
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

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
    this.syncState(state);
  }

  private get canvasWidth() {
    return this.canvas.width;
  }

  private get canvasHeight() {
    return this.canvas.height;
  }

  private horPixels(percentage: number) {
    return (percentage / 100) * this.canvasWidth;
  }

  private verPixels(percentage: number) {
    return (percentage / 100) * this.canvasHeight;
  }

  private getPixelPos(percentagePos: Coords): PixelCoords {
    return {
      x: this.horPixels(percentagePos.x),
      y: this.verPixels(percentagePos.y),
    };
  }

  private getPixelSize(percentageSize: Size): PixelSize {
    return {
      w: this.horPixels(percentageSize.w),
      h: this.verPixels(percentageSize.h),
    };
  }

  setDisplaySize() {
    const canvasWidth = Math.min(
      720,
      getElementInnerDimensions(this.canvas.parentNode as HTMLElement).w
    );
    console.log(canvasWidth);

    this.canvas.setAttribute("width", canvasWidth.toString());
    this.canvas.setAttribute("height", ((canvasWidth / 4) * 3).toString());
  }

  syncState(state: CanvasDisplay["state"]) {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.canvasContext.fillStyle = "black";
    this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.drawAlienSet(state.alienSet);
    this.drawPlayer(state.player);
    this.drawBullets(state.bullets);
    this.drawWalls(state.env.walls);
  }

  drawAlienSet(alienSet: AlienSet) {
    for (const { alien, x, y } of alienSet) {
      if (!alien) continue;

      const xPercentage =
        alienSet.pos!.x + x * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);

      const yPercentage =
        alienSet.pos!.y + y * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);

      this.drawAlien(alien, {
        x: xPercentage,
        y: yPercentage,
      });
    }
  }

  drawAlien(alien: Alien, pos: Coords) {
    const { w, h } = this.getPixelSize(DIMENSIONS.alien);
    const { x, y } = this.getPixelPos(pos);

    this.canvasContext.fillStyle = alienColors[alien.alienType];
    this.canvasContext.fillRect(x, y, w, h);
  }

  drawBullets(bullets: Bullet[]) {
    for (const bullet of bullets) {
      this.drawBullet(bullet);
    }
  }

  drawBullet(bullet: Bullet) {
    const { x, y } = this.getPixelPos(bullet.pos);
    const { w, h } = this.getPixelSize(DIMENSIONS.bullet);

    this.canvasContext.fillStyle =
      bullet.from === "alien" ? "limegreen" : "white";
    this.canvasContext.fillRect(x, y, w, h);
  }

  drawPlayer(player: Player) {
    const { x, y } = this.getPixelPos(player.pos);
    const { w, h } = this.getPixelSize(DIMENSIONS.player);

    this.canvasContext.fillStyle = "white";
    this.canvasContext.fillRect(x, y, w, h);
  }

  drawWalls(walls: Wall[]) {
    for (const wall of walls) {
      const { x, y } = this.getPixelPos(wall.pos);
      const { w, h } = this.getPixelSize(wall.size);

      this.canvasContext.fillStyle = "#ffffff";
      this.canvasContext.fillRect(x, y, w, h);
    }
  }

  drawMetadata(state: CanvasDisplay["state"]) {
    // draw hearts to show player's lives
    // draw score
    //
  }

  drawGameOverScreen() {}
}

class GameController {}

const basicInvaderPlan = `
.xxooxx.
.oo..oo.
...xx...`;

const alienSet = new AlienSet(basicInvaderPlan);
console.log("AlienSet has", alienSet.length, "length");

const i = Alien.create("x", { x: 0, y: 0 });
console.log(i);

let a: Alien = {
  actorType: "alien",
  alienType: ".",
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

let state = GameState.Start(basicInvaderPlan);
const canvasDisplay = new CanvasDisplay(
  state,
  new GameController(),
  document.body
);

function keysTracker<Type extends string>(
  keys: Type[]
): {
  [Key in Type]: boolean;
} {
  const down = {} as {
    [Key in Type]: boolean;
  };
  keys.forEach((key) => (down[key] = false));

  function onPress(e: KeyboardEvent) {
    console.log(e.keyCode);
    //@ts-ignore
    if (keys.some((key) => key === e.key)) down[e.key] = e.type === "keydown";
  }

  window.addEventListener("keydown", onPress);
  window.addEventListener("keyup", onPress);

  return down;
}

const keys = keysTracker(["ArrowRight", "ArrowLeft", " "]);

runAnimation((timeStep) => {
  console.log(state.playerLives);
  if (state.status === "lost") {
    console.log("lost");
    return false;
  } else if (state.status === "won") {
    console.log("won");
    return false;
  } else {
    state.update(timeStep, keys);
    canvasDisplay.syncState(state);
    return true;
  }
});
