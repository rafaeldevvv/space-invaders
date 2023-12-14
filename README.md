# Space Invaders

[![Language](https://img.shields.io/badge/language-typescript-blue.svg?style=flat)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
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