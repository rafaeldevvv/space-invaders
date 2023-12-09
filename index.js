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
        w: 2,
        h: 10,
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
        if (lastTime) {
            const timeStep = Math.min((time - lastTime) / 1000, 0.1);
            lastTime = time;
            callback(timeStep);
        }
        else {
            lastTime = time;
        }
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
const alienSetXSpeed = 5;
const alienSetYSpeed = 3;
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
        if (this.pos.x >= 100 - displayPadding.hor) {
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
    constructor(gridPos, score, gun) {
        this.gridPos = gridPos;
        this.score = score;
        this.gun = gun;
        this.kind = "alien";
    }
    fire(from) {
        const bulletX = from.x + DIMENSIONS.alien.w / 2;
        return this.gun.fire(new Vector(bulletX, from.y), "down");
    }
    canFire() {
        return this.gun.canFire();
    }
    static create(ch, gridPos) {
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
    constructor() {
        this.kind = "player";
        this.pos = new Vector(50, 95);
        this.speed = new Vector(5, 0);
        this.gun = new Gun("player", 4, 500);
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
            this.pos.x + DIMENSIONS.player.w < displayPadding.hor) {
            this.pos = this.pos.plus(movedX);
        }
    }
}
class Gun {
    constructor(owner, bulletSpeed, fireInterval) {
        this.owner = owner;
        this.bulletSpeed = bulletSpeed;
        this.fireInterval = fireInterval;
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
        if (!lastFire) {
            this.lastFire = now;
            return false;
        }
        const timeStep = now - lastFire;
        return timeStep >= this.fireInterval;
    }
}
class Bullet {
    constructor(from, pos, speed) {
        this.from = from;
        this.pos = pos;
        this.speed = speed;
    }
    update(timeStep) {
        this.pos = this.pos.plus(this.speed.times(timeStep));
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
        this.bullets.forEach(bullet => bullet.update(timeStep));
        this.player.update(timeStep, keys);
        if (keys.Space && this.player.canFire()) {
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
    }
}
const basicInvaderPlan = `
..xxooooxx..
............`;
const alienSet = new AlienSet(basicInvaderPlan);
console.log("AlienSet has", alienSet.length, "length");
const i = Alien.create("x", { x: 0, y: 0 });
console.log(i);
let a = {
    kind: "alien",
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
