"use strict";
const DIMENSIONS = {
    alien: {
        w: 5,
        h: 7,
    },
    player: {
        w: 5,
        h: 7,
    },
    bullet: {
        w: 1,
        h: 3,
    },
    alienSetGap: {
        w: 1,
        h: 1,
    },
};
const displayPadding = {
    hor: 3,
    ver: 5,
};
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    times(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
}
function runAnimation(callback) {
    let lastTime = null;
    function frame(time) {
        let shouldContinue;
        if (lastTime) {
            const timeStep = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;
            shouldContinue = callback(timeStep);
        }
        else {
            lastTime = time;
            shouldContinue = true;
        }
        if (shouldContinue)
            requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
function numberFromDisplayUnit(unit) {
    return Number(unit.replace(/d(w|h)/, ""));
}
function displayObjectPercentageWidth(unit) {
    if (typeof unit === "string") {
        return numberFromDisplayUnit(unit);
    }
    else {
        return numberFromDisplayUnit(unit.w);
    }
}
function displayObjectPercentageHeight(unit) {
    if (typeof unit === "string") {
        return numberFromDisplayUnit(unit);
    }
    else {
        return numberFromDisplayUnit(unit.h);
    }
}
function overlap(pos1, size1, pos2, size2) {
    return (pos1.x + size1.w > pos2.x &&
        pos1.x < pos2.x + size2.w &&
        pos1.y + size1.h > pos2.y &&
        pos1.y < pos2.y + size2.h);
}
const alienSetXSpeed = 10;
const alienSetYSpeed = 5;
class AlienSet {
    constructor(plan) {
        this.pos = null;
        this.direction = 1;
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
    update(state, timeStep) {
        let ySpeed = 0;
        if (this.pos.x + state.env.alienSetWidth >= 100 - displayPadding.hor) {
            this.direction = -1;
            ySpeed = alienSetYSpeed;
        }
        else if (this.pos.x <= displayPadding.hor) {
            this.direction = 1;
            ySpeed = alienSetYSpeed;
        }
        let xSpeed = alienSetXSpeed * this.direction;
        this.pos = this.pos.plus(new Vector(xSpeed * timeStep, ySpeed));
    }
    removeAlien(x, y) {
        this.aliens[y][x] = null;
    }
    get length() {
        return this.aliens.reduce((allAliensCount, row) => {
            const rowCount = row.reduce((count, alien) => {
                if (alien !== null)
                    return count + 1;
                else
                    return count;
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
    constructor(gridPos, score, gun, alienType) {
        this.gridPos = gridPos;
        this.score = score;
        this.gun = gun;
        this.alienType = alienType;
        this.actorType = "alien";
    }
    fire(from) {
        const bulletX = from.x + DIMENSIONS.alien.w / 2 - DIMENSIONS.bullet.w / 2;
        return this.gun.fire(new Vector(bulletX, from.y), "down");
    }
    canFire() {
        return this.gun.canFire();
    }
    static create(ch, gridPos) {
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
    constructor() {
        this.actorType = "player";
        this.pos = new Vector(50 - DIMENSIONS.player.w / 2, 90);
        this.speed = new Vector(5, 0);
        this.gun = new Gun("player", 70, 500);
    }
    fire() {
        const bulletPosX = this.pos.x + DIMENSIONS.player.w / 2;
        return this.gun.fire(new Vector(bulletPosX, this.pos.y), "up");
    }
    canFire() {
        return this.gun.canFire();
    }
    update(timeStep, keys) {
        const movedX = new Vector(timeStep * playerXSpeed, 0);
        if (keys.ArrowLeft && this.pos.x > displayPadding.hor) {
            this.pos = this.pos.minus(movedX);
        }
        else if (keys.ArrowRight &&
            this.pos.x + DIMENSIONS.player.w < 100 - displayPadding.hor) {
            this.pos = this.pos.plus(movedX);
        }
    }
}
class Gun {
    constructor(owner, bulletSpeed, fireInterval) {
        this.owner = owner;
        this.bulletSpeed = bulletSpeed;
        this.fireInterval = fireInterval;
        this.lastFire = performance.now() - random(0, fireInterval);
    }
    fire(pos, direction) {
        if (this.canFire()) {
            this.lastFire = performance.now();
            return new Bullet(this.owner, pos, new Vector(0, direction === "up" ? -this.bulletSpeed : this.bulletSpeed));
        }
        return null;
    }
    canFire() {
        const lastFire = this.lastFire;
        const now = performance.now();
        const timeStep = now - lastFire;
        return timeStep >= this.fireInterval;
    }
}
function random(min, max) {
    return min + Math.random() * (max - min);
}
class Bullet {
    constructor(from, pos, speed) {
        this.from = from;
        this.pos = pos;
        this.speed = speed;
    }
    update(state, timeStep) {
        this.pos = this.pos.plus(this.speed.times(timeStep));
    }
}
class Wall {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }
}
class GameEnv {
    constructor(alienSet, player, walls) {
        this.alienSet = alienSet;
        this.player = player;
        this.walls = walls;
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
    getAlienPos({ gridPos: { x, y } }) {
        return new Vector(this.alienSet.pos.x + x * this.alienSize + x * this.alienSetGap, this.alienSet.pos.y + y * this.alienSize + y * this.alienSetGap);
    }
    bulletTouchesWall(bullet) {
        return this.walls.some((wall) => {
            return overlap(wall.pos, wall.size, bullet.pos, DIMENSIONS.bullet);
        });
    }
    bulletShouldBeRemoved(bullet) {
        let touches = false;
        if (this.isActorShot([bullet], this.player.pos, DIMENSIONS.player) &&
            bullet.from === "alien")
            touches = true;
        if (this.bulletTouchesWall(bullet))
            touches = true;
        for (const { alien } of this.alienSet) {
            if (bullet.from === "alien")
                break;
            if (!alien)
                continue;
            if (this.isActorShot([bullet], this.getAlienPos(alien), DIMENSIONS.alien)) {
                touches = true;
                break;
            }
        }
        return touches;
    }
    isActorShot(bullets, actorPos, actorSize) {
        return bullets.some((bullet) => {
            return overlap(bullet.pos, DIMENSIONS.bullet, actorPos, actorSize);
        });
    }
}
class GameState {
    constructor(alienSet, player, env) {
        this.alienSet = alienSet;
        this.player = player;
        this.env = env;
        this.bullets = [];
        this.playerLives = 3;
        this.status = "running";
    }
    update(timeStep, keys) {
        this.alienSet.update(this, timeStep);
        this.bullets.forEach((bullet) => bullet.update(this, timeStep));
        this.player.update(timeStep, keys);
        if (keys[" "] && this.player.canFire()) {
            this.bullets.push(this.player.fire());
        }
        const playerBullets = this.bullets.filter((bullet) => bullet.from === "player");
        for (const { x, y, alien } of this.alienSet) {
            if (!alien)
                continue;
            if (this.env.isActorShot(playerBullets, this.env.getAlienPos(alien), DIMENSIONS.alien)) {
                this.alienSet.removeAlien(x, y);
            }
            if (alien.canFire()) {
                this.bullets.push(alien.fire(this.env.getAlienPos(alien)));
            }
        }
        const alienBullets = this.bullets.filter((bullet) => bullet.from === "alien");
        if (this.env.isActorShot(alienBullets, this.player.pos, DIMENSIONS.player)) {
            this.playerLives--;
        }
        if (this.alienSet.length === 0) {
            this.status = "won";
        }
        else if (this.playerLives === 0) {
            this.status = "lost";
        }
        this.removeUnnecessaryBullets();
    }
    removeUnnecessaryBullets() {
        for (const bullet of this.bullets) {
            if (bullet.pos.y >= 100 ||
                bullet.pos.y + DIMENSIONS.bullet.h <= 0 ||
                this.env.bulletShouldBeRemoved(bullet)) {
                this.bullets = this.bullets.filter((b) => b !== bullet);
            }
        }
    }
    static Start(plan) {
        const alienSet = new AlienSet(plan);
        const player = new Player();
        const walls = [
            new Wall({ x: 20, y: 75 }, { w: 20, h: 5 }),
            new Wall({ x: 60, y: 75 }, { w: 20, h: 5 }),
        ];
        const env = new GameEnv(alienSet, player, walls);
        return new GameState(alienSet, player, env);
    }
}
function getElementInnerDimensions(element) {
    const cs = getComputedStyle(element);
    console.log(cs.paddingInlineStart);
    const paddingY = parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);
    const paddingX = parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);
    const marginY = parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);
    const marginX = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);
    return {
        w: element.offsetWidth - paddingX - marginX,
        h: element.offsetHeight - paddingY - marginY,
    };
}
const alienColors = {
    ".": "limegreen",
    x: "orange",
    o: "pink",
};
class CanvasDisplay {
    constructor(state, controller, parent) {
        this.state = state;
        this.controller = controller;
        this.parent = parent;
        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.canvas.style.display = "block";
        this.canvas.style.marginInline = "auto";
        this.parent.appendChild(this.canvas);
        this.setCanvasSize();
        this.syncState(state);
    }
    get canvasWidth() {
        return this.canvas.width;
    }
    get canvasHeight() {
        return this.canvas.height;
    }
    horPixels(percentage) {
        return (percentage / 100) * this.canvasWidth;
    }
    verPixels(percentage) {
        return (percentage / 100) * this.canvasHeight;
    }
    getPixelPos(percentagePos) {
        return {
            x: this.horPixels(percentagePos.x),
            y: this.verPixels(percentagePos.y),
        };
    }
    getPixelSize(percentageSize) {
        return {
            w: this.horPixels(percentageSize.w),
            h: this.verPixels(percentageSize.h),
        };
    }
    setCanvasSize() {
        const canvasWidth = Math.min(720, getElementInnerDimensions(this.canvas.parentNode).w);
        console.log(canvasWidth);
        this.canvas.setAttribute("width", canvasWidth.toString());
        this.canvas.setAttribute("height", ((canvasWidth / 4) * 3).toString());
    }
    syncState(state) {
        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvasContext.fillStyle = "black";
        this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawAlienSet(state.alienSet);
        this.drawPlayer(state.player);
        this.drawBullets(state.bullets);
        this.drawWalls(state.env.walls);
    }
    drawAlienSet(alienSet) {
        for (const { alien, x, y } of alienSet) {
            if (!alien)
                continue;
            const xPercentage = alienSet.pos.x + x * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);
            const yPercentage = alienSet.pos.y + y * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);
            this.drawAlien(alien, {
                x: xPercentage,
                y: yPercentage,
            });
        }
    }
    drawAlien(alien, pos) {
        const { w, h } = this.getPixelSize(DIMENSIONS.alien);
        const { x, y } = this.getPixelPos(pos);
        this.canvasContext.fillStyle = alienColors[alien.alienType];
        this.canvasContext.fillRect(x, y, w, h);
    }
    drawBullets(bullets) {
        for (const bullet of bullets) {
            this.drawBullet(bullet);
        }
    }
    drawBullet(bullet) {
        const { x, y } = this.getPixelPos(bullet.pos);
        const { w, h } = this.getPixelSize(DIMENSIONS.bullet);
        this.canvasContext.fillStyle =
            bullet.from === "alien" ? "limegreen" : "white";
        this.canvasContext.fillRect(x, y, w, h);
    }
    drawPlayer(player) {
        const { x, y } = this.getPixelPos(player.pos);
        const { w, h } = this.getPixelSize(DIMENSIONS.player);
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(x, y, w, h);
    }
    drawWalls(walls) {
        for (const wall of walls) {
            const { x, y } = this.getPixelPos(wall.pos);
            const { w, h } = this.getPixelSize(wall.size);
            this.canvasContext.fillStyle = "#ffffff";
            this.canvasContext.fillRect(x, y, w, h);
        }
    }
    drawMetadata(state) {
    }
    drawGameOverScreen() { }
}
class GameController {
}
const basicInvaderPlan = `
.xxooxx.
.oo..oo.
...xx...`;
const alienSet = new AlienSet(basicInvaderPlan);
console.log("AlienSet has", alienSet.length, "length");
const i = Alien.create("x", { x: 0, y: 0 });
console.log(i);
let a = {
    actorType: "alien",
    alienType: ".",
    gridPos: { x: 8, y: 8 },
    score: 899,
    gun: new Gun("alien", 5, 200),
    fire(from) {
        throw "";
    },
    canFire() {
        throw "";
    },
};
let state = GameState.Start(basicInvaderPlan);
const canvasDisplay = new CanvasDisplay(state, new GameController(), document.body);
function keysTracker(keys) {
    const down = {};
    keys.forEach((key) => (down[key] = false));
    function onPress(e) {
        console.log(e.keyCode);
        if (keys.some((key) => key === e.key))
            down[e.key] = e.type === "keydown";
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
    }
    else if (state.status === "won") {
        console.log("won");
        return false;
    }
    else {
        state.update(timeStep, keys);
        canvasDisplay.syncState(state);
        return true;
    }
});
