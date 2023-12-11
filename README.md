# Space Invaders

This is an implementation of the classic Space Invaders game using [TypeScript](https://www.typescriptlang.org/) and the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).

## Table of Contents
- [Overview](#overview)
   - [Built with](#built-with)
   - [Screenshot](#screenshot)
- [Process](#process)
   - [Useful Resources](#useful-resources)
- [Author](#author)

## Overview

### Screenshot

### Built with

- TypeScript
- Canvas API

## Process

I had fun building this game and I took a different approach that allowed me to build it quicker than building [my implementation of the Snake Game](https://github.com/rafaeldevvv/snake-game).

This time I got totally focused on the smaller components, such as bullets, aliens and so on, first and didn't worry about the high-level ones like state, rendering method, controller and so on. This allowed me to build my way up really fast.

### Objects Position Problem

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
  ) {
  }

  getAlienPos({ gridPos: { x, y } }: Alien): Vector {
  }

  bulletTouchesWall(bullet: Bullet) {
  }

  bulletShouldBeRemoved(bullet: Bullet) {
  }

  isActorShot(bullets: Bullet[], actorPos: Coords, actorSize: Size) {
  }
}
```

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
  ) {
  }

  get canvasWidth() {
  }

  get canvasHeight() {
  }

  horPixels(percentage: number) {
  }

  verPixels(percentage: number) {
  }

  getPixelPos(percentagePos: Coords): PixelCoords {
  }

  getPixelSize(percentageSize: Size): PixelSize {
  }

  setCanvasSize() {
  }

  syncState(state: CanvasDisplay["state"]) {
  }

  drawAlienSet(alienSet: AlienSet) {
  }

  drawAlien(alien: Alien, pos: Coords) {
  }

  drawBullets(bullets: Bullet[]) {
  }

  drawBullet(bullet: Bullet) {
  }

  drawPlayer(player: Player) {
    
  }

  drawWalls(walls: Wall[]) {
  }

  drawMetadata(state: CanvasDisplay["state"]) {
  }

  drawGameOverScreen() {}
}
```


### Useful Resources
- [Generating a `tsconfig.json` file](https://stackoverflow.com/questions/36916989/how-can-i-generate-a-tsconfig-json-file)
- [Eloquent JS - Project: A Platform Game](https://eloquentjavascript.net/16_game.html)
- [tsc apparently not picking up tsconfig.json](https://github.com/microsoft/TypeScript/issues/6591)
- [Is there a Typescript way of adding properties to a prototype?](https://stackoverflow.com/questions/74033732/is-there-a-typescript-way-of-adding-properties-to-a-prototype)
- [Iteration protocols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)
- [How to define a private property when implementing an interface in Typescript?](https://stackoverflow.com/questions/37791947/how-to-define-a-private-property-when-implementing-an-interface-in-typescript)
- []()

## Author
- [Instagram](https://www.instagram.com/rafaeldevvv)
- [Portfolio](https://rafaeldevvv.github.io/portfolio)
- [X](https://www.twitter.com/rafaeldevvv)
- [Linkedin](https://www.linkedin.com/in/rafael-maia-b69662263)