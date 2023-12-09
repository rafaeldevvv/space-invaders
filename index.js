"use strict";
const DIMENSIONS = {
    alien: `5cw`,
    player: `5cw`,
    padding: `3cw`,
};
class Vec {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    plus(other) {
        return new Vec(this.x + other.x, this.y + other.y);
    }
    times(factor) {
        return new Vec(this.x * factor, this.y * factor);
    }
}
function runAnimation(callback) {
    let lastTime = null;
    function frame(time) {
        if (lastTime) {
            const timeStep = Math.min((time - lastTime) / 1000, 0.1);
            callback(timeStep);
            lastTime = time;
        }
        else {
            lastTime = time;
        }
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
}
class AlienSet {
    constructor(plan) {
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
    constructor(gridPos, score, gun) {
        this.size = 5;
        this.gridPos = gridPos;
        this.score = score;
        this.gun = gun;
    }
    fire(from) {
        const bulletX = from.x + this.size / 2;
        return this.gun.fire(new Vec(bulletX, from.y));
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
class Player {
    constructor() {
        this.pos = new Vec(50, 95);
        this.speed = new Vec(5, 0);
        this.gun = new Gun("player", 4, 500);
    }
    fire() {
        return new Bullet("player", this.pos, new Vec(0, 4));
    }
    canFire() {
        return this.gun.canFire();
    }
    update(timeStep) {
        this.pos = this.pos.plus(this.speed.times(timeStep));
    }
}
class Gun {
    constructor(owner, bulletSpeed, fireInterval) {
        this.owner = owner;
        this.bulletSpeed = bulletSpeed;
        this.fireInterval = fireInterval;
    }
    fire(pos) {
        if (this.canFire()) {
            this.lastFire = performance.now();
            return new Bullet(this.owner, pos, new Vec(0, this.bulletSpeed));
        }
        return false;
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
}
class Scenery {
}
class GameState {
}
const basicInvaderPlan = `
..xxooooxx..
............`;
const alienSet = new AlienSet(basicInvaderPlan);
const i = Alien.create("x", { x: 0, y: 0 });
console.log(i);
