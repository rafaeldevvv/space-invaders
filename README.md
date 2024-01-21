# Space Invaders

[![Language](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)](https://www.typescriptlang.org/)
[![Release](https://img.shields.io/badge/v1.0-limegreen.svg?style=flat)](./dist/)

This is an implementation of the classic Space Invaders game using [TypeScript](https://www.typescriptlang.org/) and the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Table of Contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
  - [Built with](#built-with)
- [Process](#process)
  - [Objects Positions Problem](#objects-positions-problem)
  - [Sizes](#sizes)
  - [Collisions](#collisions)
  - [Aliens](#aliens)
  - [Display](#display)
  - [Comments](#comments)
  - [`Array.prototpe.fill()` sucks](#arrayprototpefill-sucks)
  - [Canvas `clip()` and `globalCompositeOperation` misunderstanding](#canvas-clip-and-globalcompositeoperation-misunderstanding)
  - [Goddamn zero](#goddamn-zero)
  - [Stagnant values](#stagnant-values)
  - [Silly error](#silly-error)
  - [The miracle of separation of concerns](#the-miracle-of-separation-of-concerns)
  - [Useful Resources](#useful-resources)
- [Author](#author)

## Overview

### Links

[Live site](https://rafaeldevvv.github.io/space-invaders/)

### Screenshot

### Built with

- [TypeScript](https://www.typescriptlang.org/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [ESlint](https://eslint.org/)
- [Webpack](https://webpack.js.org/)

## Process

I had fun building this game and I took a different approach that allowed me to build it quicker than building [my implementation of the Snake Game](https://github.com/rafaeldevvv/snake-game).

This time I got totally focused on the smaller components, such as bullets, aliens and so on, first and didn't worry about the high-level ones like state, rendering method, controller and so on. This allowed me to build my way up really fast.

I got very excited about trying new technologies and so I used [ESLint](https://eslint.org/docs), [WebPack](https://webpack.js.org/concepts/) (which is not new for me, but it was the first time I read through the documentation) and [TSDoc](https://tsdoc.org/) comments.

### Objects Positions Problem

The best approach i could think of, taking into account that I would like the canvas to resize, is using percentage for the position of the objects. For example, if the `x` property of the `pos` property of an object was 20, then the object would be 20% off the left border of the canvas.

This approach worked very well and the game can easily be adapted to work with the DOM or even SVG by just changing the class responsible for displaying stuff.

### Sizes

All the sizes can be found in the global variable called `DIMENSIONS`, except for the walls' size, which i wanted to make more customizable:

```ts
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
```

```ts
class Wall {
  constructor(public pos: Coords, public size: Size) {}
}
```

I thought of using `DisplayUnits` which would be:

```ts
type DisplayUnit = `${number}d${"w" | "h"}`;
```

This would be like: `"10dw"` would mean 10% of the display width and `"50dh"` would mean 50% of the display height. But I realized that'd be tremendously error-prone and I would have a hard time trying to detect collision and put everything in place.

I even started building the game with that approach in mind, but I am glad I changed because the folling code snippet is part of the work I would have:

```ts
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
```

### Collisions

I've made a class to manage collisions and sizes to separate the concerns of the game. It makes use of the `overlap` function to detect collision.

```ts
function overlap(pos1: Coords, size1: Size, pos2: Coords, size2: Size) {
  return (
    pos1.x + size1.w > pos2.x &&
    pos1.x < pos2.x + size2.w &&
    pos1.y + size1.h > pos2.y &&
    pos1.y < pos2.y + size2.h
  );
}
```

```ts
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
  ) {}

  getAlienPos({ gridPos: { x, y } }: Alien): Vector {}

  bulletTouchesWall(bullet: Bullet) {}

  bulletShouldBeRemoved(bullet: Bullet) {}

  isActorShot(bullets: Bullet[], actorPos: Coords, actorSize: Size) {}
}
```

### Aliens

I made a convenient class to read a set of aliens:

```ts
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
```

As you can see, I built my own iterator for this class because at some points of the code I need to have access to all aliens as well as their positions within the set. And there's also a `length` property to check how many aliens are alive.

### Display

I've made the game state agnostic to the display method used. You can adapt it to DOM, SVG or canvas because I used percentages for everything. You just need a system to convert the percentage units relative to your chosen rendering method.

I chose the canvas API because it is a little bit more challenging than using the DOM and it is also very interesting and fun to mess with.

This is the class I wrote (not the complete version neither the final version):

```ts
class CanvasDisplay {
  canvas: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;

  constructor(
    public state: GameState,
    public controller: GameController,
    public parent: HTMLElement
  ) {}

  get canvasWidth() {}

  get canvasHeight() {}

  horPixels(percentage: number) {}

  verPixels(percentage: number) {}

  getPixelPos(percentagePos: Coords): PixelCoords {}

  getPixelSize(percentageSize: Size): PixelSize {}

  setCanvasSize() {}

  syncState(state: CanvasDisplay["state"]) {}

  drawAlienSet(alienSet: AlienSet) {}

  drawAlien(alien: Alien, pos: Coords) {}

  drawBullets(bullets: Bullet[]) {}

  drawBullet(bullet: Bullet) {}

  drawPlayer(player: Player) {}

  drawWalls(walls: Wall[]) {}

  drawMetadata(state: CanvasDisplay["state"]) {}

  drawGameOverScreen() {}
}
```

### Comments

I found two different ways of adding comments to `.js` and `.ts` files and I filled my code with comments to practice these new approaches.

I started writing [JSDoc](https://jsdoc.app/) comments but soon I realized that I was writing TypeScript code. So I looked for a JSDoc version for typescript and I found [TSDoc](https://tsdoc.org/). [Bing](https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx) helped me find a way to generate a documentation from `.ts` files and it was the [`typedoc` package on NPM](https://www.npmjs.com/package/typedoc).

I liked it. I feel like TSDoc comments make the code more meaningful somehow.

Check out the [generated docs](./docs/) to see how it looks like. It's nice, isn't it?

### `Array.prototpe.fill()` sucks

I was building the first version of a breakable wall and I ran into this mistake:

```ts
class BreakableWall {
  piecesMatrix: boolean[][];
  pieceSize: Size;

  constructor(
    public pos: Coords,
    public size: Size,
    public numRows = 6,
    public numColumns = 20
  ) {
    /* 
      the problem with this is that the same array is assined to each row
      so when i update a piece in a row, i actually update a piece in 
      all the rows in the same column
     */
    this.piecesMatrix = new Array(numRows).fill(
      new Array(numColumns).fill(true)
    );

    console.log(this.piecesMatrix);

    this.pieceSize = {
      w: this.size.w / numColumns,
      h: this.size.h / numRows,
    };
  }
}
```

At first glance you might think that the code is okay, like I am just creating an array of arrays of boolean values, but this code is extremely faulty.

The thing is that all of the arrays in the `piecesMatrix` property refer to the same array. So all rows are the same! Gee-whiz! And when I updated a piece in a row, I was actually updating the same piece in all rows, which would update a whole column!

So be aware that the `fill()` method assigns the value you pass in to all elements in the array, without creating new instances.

### Canvas `clip()` and `globalCompositeOperation` misunderstanding

I was reading [Compositing and clipping on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing) and I thought about implementing the player's gun reloaxd clue using the `clip()` method and `globalCompositeOperation` property. I started doing it and I tried really hard to make it work, but it didn't because those properties don't interact directly.

I was trying to make a rectangle be drawn outside the clipping path, which was also a rectangle. But the `clip()` method makes the current path into a clipping region inside of which new shapes are drawn.

This was the code I got (it doesn't work):

```ts
class CanvasDisplay {
  private drawGunReloadVisualClue(gun: Gun) {
    const clueHeight = 20,
      clueWidth = 1,
      cluePixelsHeight = this.verPixels(clueHeight),
      cluePixelsWidth = this.horPixels(clueWidth);
    const x = 98,
      y = 50,
      xPixels = this.horPixels(x),
      yPixels = this.verPixels(y - clueHeight / 2);

    const loadedPercentage = Math.min(
      1,
      gun.timeSinceLastShot / gun.fireInterval
    );

    this.canvasContext.save();
    this.canvasContext.translate(xPixels, yPixels);

    const clueRegion = new Path2D();
    clueRegion.rect(
      0,
      0,
      cluePixelsWidth,
      cluePixelsHeight - loadedPercentage * cluePixelsHeight
    );
    this.canvasContext.clip();

    this.canvasContext.globalCompositeOperation = "source-out";

    this.canvasContext.fillStyle = "#ffffff";
    this.canvasContext.fillRect(0, 0, cluePixelsWidth, cluePixelsHeight);

    this.canvasContext.globalCompositeOperation = "source-over";
    this.canvasContext.restore();
  }
}
```

### Goddamn zero

I was just writing a method that had all the correct logic to work, but I naively tested a variable that could be zero instead of testing it against `null`:

```ts
class AlienSet {
  public adaptSize() {
    console.log("adpating size, current is", JSON.stringify(this.size));
    type NumOrNull = number | null;

    let firstLivingAlienRow: NumOrNull = null,
      lastLivingAlienRow: NumOrNull = null,
      firstLivingAlienColumn: NumOrNull = null,
      lastLivingAlienColumn: NumOrNull = null;

    for (const alien of this) {
      if (!alien) continue;
      const { x: column, y: row } = alien.gridPos;

      if (firstLivingAlienRow === null) {
        firstLivingAlienRow = row;
      }
      lastLivingAlienRow = row;

      /* 
        if the current column is null or is less than the previous 
        one set, then this is the first living alien column 
      */
      if (firstLivingAlienColumn === null || column < firstLivingAlienColumn) {
        firstLivingAlienColumn = column;
      }
      if (lastLivingAlienColumn === null || column > lastLivingAlienColumn) {
        lastLivingAlienColumn = column;
      }
    }

    console.log(`first row is ${firstLivingAlienRow}`);
    console.log(`first column is ${firstLivingAlienColumn}`);
    console.log(`last row is ${lastLivingAlienRow}`);
    console.log(`last column is ${lastLivingAlienColumn}`);

    if (firstLivingAlienRow) {
      const newH =
        // add one because if the living aliens are on the same row, the new height would be zero
        // same thing for columns
        (lastLivingAlienRow! - firstLivingAlienRow + 1) * DIMENSIONS.alien.h +
        (lastLivingAlienColumn! - firstLivingAlienRow) *
          DIMENSIONS.alienSetGap.h;
      const newW =
        (lastLivingAlienColumn! - firstLivingAlienColumn! + 1) *
          DIMENSIONS.alien.w +
        (lastLivingAlienColumn! - firstLivingAlienRow) *
          DIMENSIONS.alienSetGap.w;
      this.size = {
        w: newW,
        h: newH,
      };
    }

    console.log("new one is", JSON.stringify(this.size));
  }
}
```

As `firstLivingAlienRow` was zero most of the time, and zero is a falsy value, the method didn't work as expected. The correct check here is `if (firstLivingAlienRow !== null) { ... }`

### Stagnant values

I was writing my adaptation logic for the AlienSet, and I had to change a lot if things in the code for that. For example, i went from:

```ts
class AlienSet {
  public removeAlien(alien: Alien) {
    this.aliens[alien.gridPos.y][alien.gridPos.x] = null;
    this.adaptPos();
    this.adaptSize();
    this.removeDeadRowsAndColumns();
  }
}
```

```ts
class GameState {
  private handleBulletsThatHitAlien() {
    const playerBullets = this.bullets.filter(
      (bullet) => bullet.from === "player"
    );

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
        }
      }
    }
  }
}
```

to:

```ts
class AlienSet {
  public adapt() {
    this.adaptPos();
    this.adaptSize();
    this.removeDeadRowsAndColumns();
  }

  public removeAlien(alien: Alien) {
    this.aliens[alien.gridPos.y][alien.gridPos.x] = null;
    this.alive--;
  }
}
```

```ts
class GameState {
  private handleBulletsThatHitAlien() {
    const playerBullets = this.bullets.filter(
      (bullet) => bullet.from === "player"
    );

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
        }
      }
    }
    this.alienSet.adapt();
  }
}
```

The problem with the first implementation was that, because I was adapting the alien set every time an alien was removed, the `for... of...` loop was still iterating over the previous version of the alien set, which had a different number of columns and rows. Thus, the iterator was throwing and error like `TypeError: Cannot read properties of undefined (reading '4')`. This was an error that not even TypeScript was able to catch.

### Silly error

Can you spot the error?

```ts
class AlienSet {
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
      this.aliens.length === 0
    ) {
      this.aliens = this.aliens.filter((_, y) => y !== rowToRemove);
      this.syncAliensGridPos();
    }

    this.syncNumOfColsAndRows();
  }
}
```

I hope you found it. If you didn't, it is the `this.aliens.length === 0` check. It should be `this.aliens.length !== 0` instead.

### The miracle of separation of concerns

I had written the `GameState` class and it was too complex, so I decided to refactor it and change how it worked inside.

I went from:

```ts
class GameState {
  public bullets: Bullet[] = [];
  public status: "lost" | "running" | "start" | "paused" = "start";
  public boss: Boss | null = null;
  private timeSinceBossLastAppearance = 0;
  private bossAppearanceInterval = generateRandomBossAppearanceInterval();

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
    if (this.status === "start" || this.status === "lost") return;

    this.alienSet.update(timeStep);
    this.player.update(this, timeStep, keys);
    this.fireAliens();

    this.handleBulletsContactWithWall();

    this.bullets.forEach((bullet) => bullet.update(timeStep));

    this.handleBulletsThatHitAlien();
    this.handleBulletsThatHitPlayer();
    this.handleBoss(timeStep);
    this.removeOutOfBoundsBullets();
    this.handleAlienContactWithWall();

    if (this.alienSet.alive === 0) {
      this.alienSet = new AlienSet(basicInvaderPlan);
      this.env.alienSet = this.alienSet;
      this.player.lives++;
    } else if (this.player.lives < 1 || this.env.alienSetTouchesPlayer()) {
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

  private handleBoss(timeStep: number) {
    if (this.boss) this.boss.update(timeStep);
    if (this.boss === null) this.timeSinceBossLastAppearance += timeStep;

    if (this.timeSinceBossLastAppearance >= this.bossAppearanceInterval) {
      this.boss = new Boss();
      this.timeSinceBossLastAppearance = 0;
    }

    if (this.boss === null) return;
    if (this.boss.pos.x >= 100) this.boss = null;

    const playerBullets = this.bullets.filter((b) => b.from === "player");
    for (const b of playerBullets) {
      if (this.env.bulletTouchesObject(b, this.boss!.pos, DIMENSIONS.boss)) {
        this.player.score += bossScore;
        this.boss = null;
        this.bossAppearanceInterval = generateRandomBossAppearanceInterval();
        break;
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

    const numWalls = 4;
    const wallWidth = 12;
    const wallHeight = 10;
    const gap = (100 - wallWidth * numWalls) / 5;

    const walls: BreakableWall[] = new Array(numWalls)
      .fill(undefined)
      .map((_, i) => {
        return new BreakableWall(
          { x: (i + 1) * gap + wallWidth * i, y: 75 },
          { w: wallWidth, h: wallHeight },
          customWall3
        );
      });

    const env = new GameEnv(alienSet, player, walls);

    return new GameState(alienSet, player, env);
  }
}
```

to

```ts
class GameState {
  public bullets: Bullet[] = [];
  public status: "lost" | "running" | "start" | "paused" = "start";
  public boss: Boss | null = null;
  private timeSinceBossLastAppearance = 0;
  private bossAppearanceInterval = generateRandomBossAppearanceInterval();

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
    if (this.status === "start" || this.status === "lost") return;

    this.alienSet.update(timeStep);
    this.player.update(this, timeStep, keys);

    this.fireAliens();
    this.bullets.forEach((bullet) => bullet.update(timeStep));

    this.handleBullets();
    this.handleBoss(timeStep);

    if (this.alienSet.alive === 0) {
      this.alienSet = new AlienSet(basicInvaderPlan);
      this.env.alienSet = this.alienSet;
      this.player.lives++;
    } else if (this.player.lives < 1 || this.env.alienSetTouchesPlayer()) {
      this.status = "lost";
    }
  }

  /**
   * Handles all bullets in the game, using GameEnv to check collision, removing out of bounds bullets and so on.
   */
  handleBullets() {
    const newBullets: Bullet[] = [];

    let isSomeAlienKilled = false;
    for (const b of this.bullets) {
      const outOfBounds = this.env.isBulletOutOfBounds(b);
      if (outOfBounds) continue;

      if (b.from === "alien") {
        const touchedPlayer = this.handleBulletContactWithPlayer(
          b as AlienBullet
        );
        if (touchedPlayer) continue;
      } else {
        const touchedAlien = this.handleBulletContactWithAlien(
          b as PlayerBullet
        );
        const touchedBoss = this.handleBulletContactWithBoss(b as PlayerBullet);

        if (!isSomeAlienKilled) isSomeAlienKilled = touchedAlien;
        if (touchedAlien || touchedBoss) continue;
      }

      const touchedWall = this.handleBulletContactWithWall(b);
      if (touchedWall) continue;

      newBullets.push(b);
    }

    if (isSomeAlienKilled) this.alienSet.adapt();
    this.bullets = newBullets;
  }

  /**
   * Checks whether the bullet touches the player, and, if it does,
   * the player loses one life and resets it position.
   *
   * @param b - A bullet from an alien.
   * @returns - A boolean that tells whether the bullet touched the player
   */
  private handleBulletContactWithPlayer(b: AlienBullet) {
    /* 
      if the bullet hits the player, the it
      is removed and the player resets its 
      position and loses one life 
    */
    if (this.env.bulletTouchesObject(b, this.player.pos, DIMENSIONS.player)) {
      this.player.lives--;
      this.player.resetPos();
      return true;
    }
    return false;
  }

  /**
   * Checks whether a player bullet touches an alien, and, if it does,
   * the player score increases and the touched alien is removed from the set.
   *
   * @param b - A bullet from the player.
   * @returns - A boolean value that tells whether the bullet touches an alien in the set.
   */
  private handleBulletContactWithAlien(b: PlayerBullet) {
    for (const alien of this.alienSet) {
      if (alien === null) continue;

      const alienPos = this.alienSet.getAlienPos(alien.gridPos);
      if (this.env.bulletTouchesObject(b, alienPos, DIMENSIONS.alien)) {
        this.player.score += alien.score;
        this.alienSet.removeAlien(alien);
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether the bullet touches a wall, and if so, calls
   * the collide method on the wall if available.
   *
   * @param b - A bullet.
   * @returns - A boolean value that tells whether the bullet touches a wall.
   */
  private handleBulletContactWithWall(b: Bullet) {
    for (const wall of this.env.walls) {
      if (this.env.bulletTouchesWall(b, wall)) {
        if (wall instanceof BreakableWall) wall.collide(this, b.pos, b.size);
        return true;
      }
    }

    return false;
  }

  private handleBulletContactWithBoss(b: PlayerBullet) {
    if (this.boss === null) return false;
    if (this.env.bulletTouchesObject(b, this.boss.pos, DIMENSIONS.boss)) {
      this.player.score += bossScore;
      this.boss = null;
      this.bossAppearanceInterval = generateRandomBossAppearanceInterval();
      return true;
    }
  }

  /**
   * Fires the aliens that can fire.
   */
  private fireAliens() {
    const newBullets: Bullet[] = [];

    for (const alien of this.alienSet) {
      if (!alien) continue;

      if (alien.gun.canFire()) {
        const alienPos = this.alienSet.getAlienPos(alien.gridPos);
        const b = alien.fire(alienPos)!;
        newBullets.push(b);
      }
    }

    this.bullets.push(...newBullets);
  }

  private handleBoss(timeStep: number) {
    if (this.boss !== null) this.boss.update(timeStep);
    else this.timeSinceBossLastAppearance += timeStep;

    if (this.timeSinceBossLastAppearance >= this.bossAppearanceInterval) {
      this.boss = new Boss();
      this.timeSinceBossLastAppearance = 0;
    }

    if (this.boss && this.boss.pos.x >= 100) {
      this.boss = null;
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

    const numWalls = 4;
    const wallWidth = 12;
    const wallHeight = 10;
    const gap = (100 - wallWidth * numWalls) / 5;

    const walls: BreakableWall[] = new Array(numWalls)
      .fill(undefined)
      .map((_, i) => {
        return new BreakableWall(
          { x: (i + 1) * gap + wallWidth * i, y: 75 },
          { w: wallWidth, h: wallHeight },
          customWall3
        );
      });

    const env = new GameEnv(alienSet, player, walls);

    return new GameState(alienSet, player, env);
  }
}
```

What amazed me and inspired me to talk about it here is that I only had to change the GameState class and I didn't have to mess with anything except that. I guess that's a good sign that I am applying the Single Responsibility Principle and Separation of Concerns well.

### Cyclic imports

The reason why I created the `ts/types/components` file is that using the components' class types themselves would cause a lot of cyclic imports. And also because if code that uses a component needs the component to implement a new feature, I just need to change the interface that it expects and TypeScript will signal to me what needs to be done for the component to comply with the interface, and I think that's a great thing.

### Webpack config problem

Webpack wasn't being able to resolve the dependencies of my module and throwing an error like `Field 'browser' doesn't contain a valid alias configuration`. This was the configuration:

```js
module.exports = {
   mode: "development",
   entry: './src/index.ts',
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
            exclude: /node_modules/,
         }
      ],
   },
   resolve: {
      extensions: ['.ts', '.js'],
      alias: {
         "@/": path.resolve(__dirname, "/src/"),
      }
   },
   stats: {
      errorDetails: true
   },
};
```

I had to change it to:

```js
module.exports = {
   mode: "development",
   entry: './src/index.ts',
   // devtool: 'inline-source-map',
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
         },
         {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
            exclude: /node_modules/,
         }
      ],
   },
   resolve: {
      extensions: ['.ts', '.js'],
      alias: {
         "@": path.resolve(__dirname, "./src"),
      }
   },
   stats: {
      errorDetails: true
   },
};
```

I raised [a question on stack overflow about it](https://stackoverflow.com/questions/77809657/webpack-field-browser-doesnt-contain-a-valid-alias-configuration-using-al), answer me and help me if you can.

### Useful Resources

#### General

- [Generating a `tsconfig.json` file](https://stackoverflow.com/questions/36916989/how-can-i-generate-a-tsconfig-json-file)
- [Eloquent JS - Project: A Platform Game](https://eloquentjavascript.net/16_game.html)
- [tsc apparently not picking up tsconfig.json](https://github.com/microsoft/TypeScript/issues/6591)
- [Is there a Typescript way of adding properties to a prototype?](https://stackoverflow.com/questions/74033732/is-there-a-typescript-way-of-adding-properties-to-a-prototype)
- [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)
- [How to define a private property when implementing an interface in Typescript?](https://stackoverflow.com/questions/37791947/how-to-define-a-private-property-when-implementing-an-interface-in-typescript)
- [KeyboardEvent.keyCode deprecated. What does this mean in practice?](https://stackoverflow.com/questions/35394937/keyboardevent-keycode-deprecated-what-does-this-mean-in-practice)
- [Bing](https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx) - I love AIs ❤
- [Intro | Shields.io](https://shields.io/docs) - A service for concise, consistent, and legible badges, which can easily be included in GitHub readmes or any other web page.
- [HEAD Meta elements list](https://github.com/joshbuchea/HEAD#meta)
- [Aspect Ratio | Definition, Formula & Examples](https://study.com/academy/lesson/aspect-ratio-definition-calculation.html#:~:text=long%2C%20thin%20wings-,Lesson%20Summary,height%3A%20r%20%3D%20w%20h%20.)
- [Javascript efficiency: 'for' vs 'forEach' \[closed\]](https://stackoverflow.com/questions/43031988/javascript-efficiency-for-vs-foreach) - This made me decide to use readable and maintainable approaches.
- [Nonzero-Rule Wikipedia](https://en.wikipedia.org/wiki/Nonzero-rule)
- [`CanvasRenderingContext2D` `clip()`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/clip)
- [`globalCompositeOperation`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation#examples)
- [Canvas API - Compositing and clipping](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing)
- [Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)
- [MDN AI Help](https://developer.mozilla.org/en-US/plus/ai-help)
- [How to write a good commit message - Focus on starting verbs](https://www.reddit.com/r/git/comments/f502nz/how_to_write_a_good_commit_message_focus_on/)
- [subsurface-for-dirk / README](https://github.com/torvalds/subsurface-for-dirk/blob/a48494d2fbed58c751e9b7e8fbff88582f9b2d02/README)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [Create prototype property](https://stackoverflow.com/questions/70342973/create-prototype-property)
- [Typescript: accessing an array element does not account for the possibility of undefined return values](https://stackoverflow.com/questions/50647399/typescript-accessing-an-array-element-does-not-account-for-the-possibility-of-u)
- [Suggestion: option to include undefined in index signatures](https://github.com/Microsoft/TypeScript/issues/13778)
- [Canvas API - Drawing text](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text)
- [Difference between Single Responsibility Principle and Separation of Concerns](https://stackoverflow.com/questions/1724469/difference-between-single-responsibility-principle-and-separation-of-concerns)
- [Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Property accessors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors)
- [What are enums and why are they useful?](https://stackoverflow.com/questions/4709175/what-are-enums-and-why-are-they-useful)
- [Space Invaders game rules](https://users.cs.northwestern.edu/~etm453/Gaming/SpaceInvadersRules.htm)
- [Removing Entries from Tuple Types in Typescript](https://copyprogramming.com/howto/typescript-remove-entries-from-tuple-type)
- [Semantic Commit Messages](https://sparkbox.com/foundry/semantic_commit_messages)
- [pokenode-ts](https://github.com/Gabb-c/pokenode-ts) - I used it as an example of commits.
- [<link>: The External Resource Link element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
- [Free Invaders](https://freeinvaders.org) - A game reference.
- [Hash Symbol Secrets](https://www.pixartprinting.co.uk/blog/hash-symbol-secrets/)
- [TypeScript - Iterators and Generators](https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html)
- [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#cyclic_imports)
- [Quentin Trimble](https://blog.logrocket.com/when-how-use-interfaces-classes-typescript/#:~:text=When%20should%20we%20use%20classes%20and%20interfaces%3F,interface%20is%20best%20for%20you.)
- [When use a interface or class in Typescript [duplicate]](https://stackoverflow.com/questions/51716808/when-use-a-interface-or-class-in-typescript)
- [lowcode-engine](https://github.com/alibaba/lowcode-engine/) - I used it as a reference to organize files, structure interfaces and make commits.
- [Refactoring](https://refactoring.com)
- [Typescript: different return type based on parameter](https://stackoverflow.com/questions/74174908/typescript-different-return-type-based-on-parameter)
- [Javascript | Composition vs Inheritance](https://jordan-eckowitz.medium.com/javascript-composition-vs-inheritance-4b99234593a9#:~:text=This%20approach%20makes%20use%20of,instances%20be%20chosen%20over%20inheritance.)
- ['File name differs from already included file name only in casing' on relative path with same casing](https://stackoverflow.com/questions/51197940/file-name-differs-from-already-included-file-name-only-in-casing-on-relative-p)
- [Javascript - function with optional parameters as object?](https://stackoverflow.com/questions/27735855/javascript-function-with-optional-parameters-as-object)
- [How to un-commit last un-pushed git commit without losing the changes](https://stackoverflow.com/questions/19859486/how-to-un-commit-last-un-pushed-git-commit-without-losing-the-changes)
- [https://www.w3schools.com/jsref/canvas_measuretext.asp#:~:text=Description,writing%20it%20on%20the%20canvas.](https://www.w3schools.com/jsref/canvas_measuretext.asp#:~:text=Description,writing%20it%20on%20the%20canvas.)
- [CanvasRenderingContext2D: measureText() method](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText)
- [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics)
- [Fundamentals of data structures: Dictionaries](https://en.wikibooks.org/wiki/A-level_Computing/AQA/Paper_1/Fundamentals_of_data_structures/Dictionaries)
- [Is there a data structure that can get value by key and get key by value both in Python?](https://stackoverflow.com/questions/25479479/is-there-a-data-structure-that-can-get-value-by-key-and-get-key-by-value-both-in)
- [Google Search Operators: The Complete List (44 Advanced Operators)](https://ahrefs.com/blog/google-advanced-search-operators/)
- [Array.prototype.splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
- [How to remove all listeners in an element? [duplicate]](https://stackoverflow.com/questions/9251837/how-to-remove-all-listeners-in-an-element)
- [CSS media query for whether a physical keyboard is attached](https://stackoverflow.com/questions/36976117/css-media-query-for-whether-a-physical-keyboard-is-attached)
- [Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Does removing an element also remove its event listeners? [duplicate]](https://stackoverflow.com/questions/18986520/does-removing-an-element-also-remove-its-event-listeners)
- [PLAY GUIDE FOR SPACE INVADERS](https://www.classicgaming.cc/classics/space-invaders/play-guide)
- [SPACE INVADER SOUNDS](https://www.classicgaming.cc/classics/space-invaders/sounds)
- [Disable Pinch Zoom on Mobile Web](https://stackoverflow.com/questions/11689353/disable-pinch-zoom-on-mobile-web)
- [Adverbs of Frequency: Types](https://langeek.co/en/grammar/course/473/adverbs-of-frequency#:~:text=Indefinite%20Adverbs%20of%20Frequency,-Indefinite%20adverbs%20of&text=frequently%20→%2070%25,hardly%20ever%20→%205%25)
- [Invaders Image Reference](https://static.wikia.nocookie.net/villains/images/9/9b/Spaceinvaders.png/revision/latest?cb=20130815215326)
- [HTMLAudioElement: Audio() constructor](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio)
- [HTMLAudioElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement)
- [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement#events)
- [Codepen Space Invaders example](https://codepen.io/adelciotto/pen/WNzRYy)

#### Comments

- [JSDoc](https://jsdoc.app/) - very effective way of adding comments.
- [JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns)
- [What is TSDoc?](https://tsdoc.org/) - very effective way of adding comments in `.ts` files.
- [TSDoc | Play](https://tsdoc.org/play/) - Playground for TSDoc comments.
- [`@microsoft/tsdoc`](https://www.npmjs.com/package/@microsoft/tsdoc)
- [TypeDoc](https://typedoc.org/) - It generates a documentation for TSCode.
- [`typedoc` NPM package](https://www.npmjs.com/package/typedoc)
- [TS: What is TSDoc?](https://medium.com/suyeonme/ts-what-is-tsdoc-6e11427c9704)
- [@use JSDoc](https://jsdoc.app/tags-inline-link)

#### ESLint

- [ESLint Docs](https://eslint.org/docs)
- [typescript-eslint](https://typescript-eslint.io/)
- [Ignore files](https://eslint.org/docs/latest/use/configure/ignore)

#### Webpack

- [WebPack Docs](https://webpack.js.org/concepts/)
- [`package.json` file](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
- [html-webpack-plugin options](https://github.com/jantimon/html-webpack-plugin#options)
- [Webpack loaders](https://webpack.js.org/loaders/)
- [style-loader](https://webpack.js.org/loaders/style-loader/)
- [css-loader](https://webpack.js.org/loaders/css-loader/)
- [Can I use webpack to generate CSS and JS separately?](https://stackoverflow.com/questions/35322958/can-i-use-webpack-to-generate-css-and-js-separately)
- [Resolve | Webpack](https://webpack.js.org/configuration/resolve/#resolvemainfiles)
- [Using webpack to use require modules in browser](https://stackoverflow.com/questions/40207277/using-webpack-to-use-require-modules-in-browser)
- [Webpack doesn't resolve properly my alias](https://stackoverflow.com/questions/36365550/webpack-doesnt-resolve-properly-my-alias)
- [eslint-plugin-import Issue #854](https://github.com/import-js/eslint-plugin-import/issues/854)
- [What does a trailing slash in the parameter of `require.resolve()` mean?](https://stackoverflow.com/questions/64413530/what-does-a-trailing-slash-in-the-parameter-of-require-resolve-mean)
- [Field 'browser' doesn't contain a valid alias configuration](https://stackoverflow.com/questions/43037590/field-browser-doesnt-contain-a-valid-alias-configuration)

## Author

- [Instagram](https://www.instagram.com/rafaeldevvv)
- [Portfolio](https://rafaeldevvv.github.io/portfolio)
- [X](https://www.twitter.com/rafaeldevvv)
- [Linkedin](https://www.linkedin.com/in/rafael-maia-b69662263)

## LICENSE

The MIT License

Copyright 2023-2024 Rafael Maia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
