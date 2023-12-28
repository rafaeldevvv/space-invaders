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
   - [Useful Resources](#useful-resources)
- [Author](#author)

## Overview

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
    this.canvasContext.fillRect(
      0,
      0,
      cluePixelsWidth,
      cluePixelsHeight
    );
  
    this.canvasContext.globalCompositeOperation = "source-over";
    this.canvasContext.restore();
  }
}
```

#### Goddamn zero

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

#### Silly error

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

#### Comments

- [JSDoc](https://jsdoc.app/) - very effective way of adding comments.
- [JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#param-and-returns)
- [What is TSDoc?](https://tsdoc.org/) - very effective way of adding comments in `.ts` files.
- [TSDoc | Play](https://tsdoc.org/play/) - Playground for TSDoc comments.
- [`@microsoft/tsdoc`](https://www.npmjs.com/package/@microsoft/tsdoc) 
- [TypeDoc](https://typedoc.org/) - It generates a documentation for TSCode.
- [`typedoc` NPM package](https://www.npmjs.com/package/typedoc)
- [TS: What is TSDoc?](https://medium.com/suyeonme/ts-what-is-tsdoc-6e11427c9704)

#### ESLint

- [ESLint Docs](https://eslint.org/docs)
- [typescript-eslint](https://typescript-eslint.io/)
- [Ignore files](https://eslint.org/docs/latest/use/configure/ignore)

#### Webpack

- [WebPack Docs](https://webpack.js.org/concepts/)
- [`package.json` file](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
- [html-webpack-plugin options](https://github.com/jantimon/html-webpack-plugin#options)

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