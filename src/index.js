"use strict";
/* ========================= Interfaces and Types ======================= */
/* ========================== constants ========================= */
/**
 * The dimensions of all objects in the game.
 * The sizes are percentages within the display, from 0 to 100.
 *
 * @type {TDIMENSIONS}
 */
const DIMENSIONS = {
    alien: {
        w: 5,
        h: 7, // 5% of the display height
    },
    player: {
        w: 5,
        h: 7, // 5% of the display height
    },
    bullet: {
        w: 1,
        h: 3, // 4% of the display height
    },
    alienSetGap: {
        w: 1,
        h: 1, // 1% of the display height
    },
};
/**
 * the padding within the display.
 */
const displayPadding = {
    hor: 3,
    ver: 5,
};
const arrowRightKey = "ArrowRight";
const arrowLeftKey = "ArrowLeft";
const spaceKey = " ";
/* ========================== utilities ========================= */
/**
 * Class representing a vector
 */
class Vector {
    /**
     * Create a Vector.
     *
     * @param x - The position along the horizontal axis.
     * @param y - The position along the vertical axis.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * Add two Vector objects' axes' values.
     *
     * @param {Vector} other - Another Vector to add to the current one.
     * @returns {Vector} - A Vector with the added axes of both previous vectors.
     */
    plus(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }
    /**
     * Subtract one Vector's axes' values from another Vector.
     *
     * @param {Vector} other - Another Vector to subtract from the current one.
     * @returns {Vector} - A Vector with subtracted axes.
     */
    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }
    /**
     * Mulitply a Vector's axes' values by a number.
     *
     * @param {number} factor - A number by which the method will multiply the Vector's axes.
     * @returns {Vector} - A Vector with multiplied axes.
     */
    times(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
}
/**
 * Run an animation.
 *
 * @param {function} callback - A function to be called everytime a frame can be painted to the screen.
 */
function runAnimation(callback) {
    let lastTime = null;
    /**
     * A function that manages each frame of the animation.
     *
     * @param {number} time - The current time since the application started.
     */
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
/**
 * Generate a random number between two numbers.
 *
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} - The random number between min and max value.
 */
function random(min, max) {
    return min + Math.random() * (max - min);
}
/**
 * Check whether two objects overlap.
 *
 * @param {Coords} pos1 - The position of the first object.
 * @param {Size} size1 - The size of the first objet.
 * @param {Coords} pos2 - The position of the second object.
 * @param {Size} size2 - The size of the second objet.
 * @returns {boolean} - A boolean stating whether the two objects overlap.
 */
function overlap(pos1, size1, pos2, size2) {
    return (pos1.x + size1.w > pos2.x &&
        pos1.x < pos2.x + size2.w &&
        pos1.y + size1.h > pos2.y &&
        pos1.y < pos2.y + size2.h);
}
/**
 * Calculate the size of the element excluding padding, border and margin
 *
 * @param element - An HTML Element
 * @returns - The size of the element excluding padding, border and margin
 */
function getElementInnerDimensions(element) {
    /* ############################################################################################################################################ */
    /* ############################################################################################################################################ */
    /* ############################################################################################################################################ */
    /* ############################################################################################################################################ */
    /* ############################################################################################################################################ */
    /* ############################################################################################################################################ */
    /* ############################################################################################################################################ */
    // if you have problems with the canvas width or canvas height, check this
    // because there might be something going wrong in here
    const cs = getComputedStyle(element);
    const paddingY = parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);
    const paddingX = parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);
    const marginY = parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);
    const marginX = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);
    return {
        w: element.offsetWidth - paddingX - marginX,
        h: element.offsetHeight - paddingY - marginY,
    };
}
/**
 *
 *
 * @param keys - An array of strings
 * @returns - An object whose property names are the strings withing `keys`
 */
function keysTracker(keys) {
    const down = {};
    keys.forEach((key) => (down[key] = false));
    function onPressKey(e) {
        for (const key of keys) {
            if (e.key === key) {
                down[e.key] = e.type === "keydown";
            }
        }
    }
    window.addEventListener("keydown", onPressKey);
    window.addEventListener("keyup", onPressKey);
    return down;
}
/* ==================================================================== */
/* ===================== Game Components ============================== */
/* ==================================================================== */
/*
  `(100 - displayPadding.hor * 2)` is the area within the padding edges
  divide it by twenty so that we have 20 steps along the display
*/
const alienSetXStep = (100 - displayPadding.hor * 2) / 20;
const alienSetYStep = 5;
const alienSetMoveTime = 1;
var HorizontalDirection;
(function (HorizontalDirection) {
    HorizontalDirection[HorizontalDirection["Right"] = 1] = "Right";
    HorizontalDirection[HorizontalDirection["Left"] = -1] = "Left";
})(HorizontalDirection || (HorizontalDirection = {}));
/**
 * A class represeting a set of {@link Alien}s
 */
class AlienSet {
    /**
     * Create an AlienSet.
     *
     * @param plan - A string represeting an arranged set of aliens.
     */
    constructor(plan) {
        this.pos = null;
        this.direction = 1;
        /**
         * A variable that manages when the AlienSet's position can update.
         * When it is greater than or equal to alienSetMoveTime, then the alien set can move.
         */
        this.timeStepSum = 0;
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
    /**
     * Update the AlienSet instance.
     *
     * @param {number} timeStep - The time that has passed since the last update.
     */
    update(timeStep) {
        this.timeStepSum += timeStep;
        let movedY = 0;
        /*
          if it is going right and it has touched
          the padding area and it can update its position
        */
        if (this.pos.x + state.env.alienSetWidth >= 100 - displayPadding.hor &&
            this.timeStepSum >= alienSetMoveTime &&
            this.direction === HorizontalDirection.Right) {
            this.direction = HorizontalDirection.Left;
            movedY = alienSetYStep;
        }
        else if (
        /* if it is going left and has touched the padding area and can update */
        this.pos.x <= displayPadding.hor &&
            this.timeStepSum >= alienSetMoveTime &&
            this.direction === HorizontalDirection.Left) {
            this.direction = HorizontalDirection.Right;
            movedY = alienSetYStep;
        }
        let movedX = 0;
        /* if can update and has not moved down */
        if (this.timeStepSum >= alienSetMoveTime && movedY === 0) {
            if (this.direction === HorizontalDirection.Right) {
                /*
                  here we get either the distance left to reach the inner right padding edge
                  or the normal step to move
                */
                movedX = Math.min(alienSetXStep, 100 - this.pos.x - displayPadding.hor - state.env.alienSetWidth);
            }
            else {
                /*
                  here we get either the distance left to reach the inner left padding edge
                  or the normal step to move
                */
                movedX = Math.min(alienSetXStep, this.pos.x - displayPadding.hor);
            }
            movedX *= this.direction;
        }
        /* reset */
        if (this.timeStepSum >= alienSetMoveTime) {
            this.timeStepSum = 0;
        }
        this.pos = this.pos.plus(new Vector(movedX, movedY));
    }
    /**
     * Remove an alien from the set.
     *
     * @param {number} x - The X position of the alien within the grid.
     * @param {number} y - The Y position of the alien within the grid.
     */
    removeAlien(x, y) {
        this.aliens[y][x] = null;
    }
    /**
     * The current number of aliens that are alive.
     */
    get length() {
        return this.aliens.reduce((allAliensCount, row) => {
            const rowCount = row.reduce((rowCount, alien) => {
                if (alien !== null)
                    return rowCount + 1;
                else
                    return rowCount;
            }, 0);
            return allAliensCount + rowCount;
        }, 0);
    }
    /**
     * Iterate through the AlienSet, yielding an alien as well as its position within the grid.
     */
    *[Symbol.iterator]() {
        for (let y = 0; y < this.numRows; y++) {
            for (let x = 0; x < this.numColumns; x++) {
                yield { x, y, alien: this.aliens[y][x] };
            }
        }
    }
}
/**
 * Class representing an alien.
 */
class Alien {
    /**
     * Create an Alien.
     *
     * @param {Coords} gridPos - The position of the alien within the alien set.
     * @param {number} score - The score the player gets when it kills this alien.
     * @param {Gun} gun - The gun of the alien.
     * @param {TAliens} alienType - The type of the alien.
     */
    constructor(gridPos, score, gun, alienType) {
        this.gridPos = gridPos;
        this.score = score;
        this.gun = gun;
        this.alienType = alienType;
        this.actorType = "alien";
    }
    /**
     * Fire an alien bullet.
     *
     * @param {Coords} from - The position from where the alien fires.
     * @returns {Bullet | null} - The fired bullet or null if the gun wasn't able to fire.
     */
    fire(from) {
        /* bullet is fired from the center of the alien */
        const bulletX = from.x + DIMENSIONS.alien.w / 2 - DIMENSIONS.bullet.w / 2;
        return this.gun.fire(new Vector(bulletX, from.y), "down");
    }
    /**
     * Check whether the alien's gun can be fired.
     *
     * @returns {boolean} - Boolean representing whether the alien's gun can be fired.
     */
    canFire() {
        return this.gun.canFire();
    }
    /**
     * Create an alien based on a character.
     *
     * @param {string} ch - The type of the alien represented by a character.
     * @param {Coords} gridPos - The position of the alien within the grid.
     * @returns {Alien} - A specific alien type.
     */
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
/**
 * Class representing the player.
 */
class Player {
    constructor() {
        this.actorType = "player";
        this.baseXPos = 50 - DIMENSIONS.player.w / 2;
        this.baseYPos = 90;
        this.pos = new Vector(this.baseXPos, this.baseYPos);
        this.gun = new Gun("player", 70, 500);
        this.lives = 3;
        this.score = 0;
    }
    /**
     * Fire a player's bullet.
     *
     * @returns {Bulelt | null} - The fired bullet or null if the fun wasn't able to fire.
     */
    fire() {
        /* from the center of the player */
        const bulletPosX = this.pos.x + DIMENSIONS.player.w / 2;
        return this.gun.fire(new Vector(bulletPosX, this.pos.y), "up");
    }
    /**
     * Reset the position of the Player.
     */
    resetPos() {
        this.pos = new Vector(this.baseXPos, this.baseYPos);
    }
    /**
     * Update the Player.
     *
     * @param {number} timeStep - The time in seconds that has passed since the last update.
     * @param {KeysTracker} keys - An object that tracks which keys are currently held down.
     */
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
/**
 * Class representing a gun.
 */
class Gun {
    /**
     * Create a Gun.
     *
     * @param {TShooters} owner - The object which fires the gun.
     * @param {number} bulletSpeed - The speed of the bullet.
     * @param {number} fireInterval - The time it takes for the gun to fire again.
     */
    constructor(owner, bulletSpeed, fireInterval) {
        this.owner = owner;
        this.bulletSpeed = bulletSpeed;
        this.fireInterval = fireInterval;
        // to give a random initial fireInterval
        this.lastFire = performance.now() - random(0, fireInterval);
    }
    /**
     * Fire a bullet from a position.
     *
     * @param {Vector} pos - The position from where the gun is fired.
     * @param {"up" | "down"} direction - The direction the bullet goes.
     * @returns {Bullet | null} - A bullet or null if the gun wasn't able to fire.
     */
    fire(pos, direction) {
        if (this.canFire()) {
            /* update lastFire prop to track the time of the last shot */
            this.lastFire = performance.now();
            return new Bullet(this.owner, pos, new Vector(0, direction === "up" ? -this.bulletSpeed : this.bulletSpeed));
        }
        /* it returns null if it wasn't able to fire */
        return null;
    }
    /**
     * Check whether the gun can be fired.
     *
     * @returns {boolean} - A boolean value saying whether the gun can fire.
     */
    canFire() {
        const lastFire = this.lastFire;
        const now = performance.now();
        const timeStep = now - lastFire;
        return timeStep >= this.fireInterval;
    }
}
/**
 * Class representing a bullet.
 */
class Bullet {
    /**
     * Create a bullet.
     *
     * @param {TShooters} from - A string representing the object that fired.
     * @param {Vector} pos - The position from where the bullet was fired.
     * @param {Vector} speed - The speed of the bullet.
     */
    constructor(from, pos, speed) {
        this.from = from;
        this.pos = pos;
        this.speed = speed;
    }
    update(timeStep) {
        this.pos = this.pos.plus(this.speed.times(timeStep));
    }
}
/**
 * Class representing a wall.
 */
class Wall {
    /**
     * Create a wall.
     *
     * @param {Coords} pos - The position of the wall.
     * @param {Size} size - The size of the wall.
     */
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
    }
}
/* ========================================================================= */
/* ========================== Environment and State ======================== */
/* ========================================================================= */
/**
 * Class representing the Game Environment responsible
 * for managing the positions and sizes
 * of the objects and checking things like colision.
 */
class GameEnv {
    /**
     * Initialize the game environment.
     *
     * @param {AlienSet} alienSet - The aliens.
     * @param {Player} player - The player.
     * @param {Wall[]} walls - The walls.
     */
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
    /**
     * Get the position of an alien within the whole game screen.
     *
     * @param param0 - The alien.
     * @returns {Vector} - The position of the alien.
     */
    getAlienPos({ gridPos: { x, y } }) {
        return new Vector(
        /* alienSet positions + sizes + gaps */
        this.alienSet.pos.x + x * this.alienSize + x * this.alienSetGap, this.alienSet.pos.y + y * this.alienSize + y * this.alienSetGap);
    }
    /**
     * Check whether a bullet touches a wall.
     *
     * @param bullet - The bullet whose position needs to be checked as overlapping a wall.
     * @returns {boolean} - A boolean value which says whether the bullet touches a wall.
     */
    bulletTouchesWall(bullet) {
        return this.walls.some((wall) => {
            return overlap(wall.pos, wall.size, bullet.pos, DIMENSIONS.bullet);
        });
    }
    /**
     * Perform checks to check whether a bullet needs to be removed from the game environment.
     *
     * @param bullet - A bullet that may need to be removed.
     * @returns {boolean} - A boolean value that says whether the bullet should be removed.
     */
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
    /**
     * Check whether the alien set has reached the wall.
     *
     * @returns {boolean} - A boolean value that says whether the alien set has reached a wall.
     */
    alienSetReachedWall() {
        return this.alienSet.pos.y + this.alienSetHeight >= this.walls[0].pos.y;
    }
    /**
     * Check whether an object in the game has been shot.
     *
     * @param {Bullet[]} bullets - An array of the bullets that may hit the object.
     * @param {Coords} actorPos - The position of the object.
     * @param {Size} actorSize - The size of the object.
     * @returns {boolean} - A boolean value that says whether the object is shot.
     */
    isActorShot(bullets, actorPos, actorSize) {
        return bullets.some((bullet) => {
            return overlap(bullet.pos, DIMENSIONS.bullet, actorPos, actorSize);
        });
    }
}
/**
 * Class that manages the state of a running game.
 */
class GameState {
    /**
     * Initializes the state.
     *
     * @param {AlienSet} alienSet - The aliens.
     * @param {Player} player - The player.
     * @param {GameEnv} env - The game environment.
     */
    constructor(alienSet, player, env) {
        this.alienSet = alienSet;
        this.player = player;
        this.env = env;
        this.bullets = [];
        this.status = "running";
    }
    /**
     * Update the state of the game.
     *
     * @param timeStep - The time in seconds that has passed since the last update.
     * @param keys - An object that tracks which keys on the keyboard are currently being pressed down.
     */
    update(timeStep, keys) {
        this.alienSet.update(timeStep);
        this.bullets.forEach((bullet) => bullet.update(timeStep));
        this.player.update(timeStep, keys);
        if (keys[" "] && this.player.gun.canFire()) {
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
            this.player.lives--;
            this.player.resetPos();
        }
        if (this.alienSet.length === 0) {
            this.status = "won";
        }
        else if (this.player.lives === 0) {
            this.status = "lost";
        }
        this.removeUnnecessaryBullets();
    }
    /**
     * Remove the bullets that are not relevant for the game anymore.
     */
    removeUnnecessaryBullets() {
        for (const bullet of this.bullets) {
            if (bullet.pos.y >= 100 ||
                bullet.pos.y + DIMENSIONS.bullet.h <= 0 ||
                this.env.bulletShouldBeRemoved(bullet)) {
                this.bullets = this.bullets.filter((b) => b !== bullet);
            }
        }
    }
    /**
     * Create a basic initial game state.
     *
     * @param plan - A string represeting an arranged set of aliens.
     * @returns {GameState} - A initial state for the game.
     */
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
/* ========================================================================= */
/* ================================= Display =============================== */
/* ========================================================================= */
/**
 * The colors of the aliens
 */
const alienColors = {
    ".": "limegreen",
    x: "orange",
    o: "pink",
};
/**
 * Class represeting a view component used to display the game state.
 * It uses the HTML Canvas API.
 */
class CanvasDisplay {
    /**
     * Create a view component for the game that uses the Canvas API.
     *
     * @param {GameState} state - The initial state of the game.
     * @param {GameController} controller - The component responsible for coordinating the information flow between the View and the Model (state).
     * @param {HTMLElement} parent - The HTML Element used to display the view.
     */
    constructor(state, controller, parent) {
        this.state = state;
        this.controller = controller;
        this.parent = parent;
        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.canvas.style.display = "block";
        this.canvas.style.marginInline = "auto";
        this.parent.appendChild(this.canvas);
        this.setDisplaySize();
        this.syncState(state);
    }
    get canvasWidth() {
        return this.canvas.width;
    }
    get canvasHeight() {
        return this.canvas.height;
    }
    /**
     * Calculate the horizontal pixels according to a percentage of the canvas width.
     *
     * @param {number} percentage - The percentage of the canvas width.
     * @returns {number} - The corresponding horizontal pixels.
     */
    horPixels(percentage) {
        return (percentage / 100) * this.canvasWidth;
    }
    /**
     * Calculate the vertical pixels according to a percentage of the canvas height.
     *
     * @param {number} percentage - The percentage of the canvas heigth.
     * @returns {number} - The corresponding vertical pixels.
     */
    verPixels(percentage) {
        return (percentage / 100) * this.canvasHeight;
    }
    /**
     * Calculate the pixel position of an object within the canvas based on a percentage position.
     *
     * @param {Coords} percentagePos - The percentage position.
     * @returns {PixelCoords} - The corresponding pixel position.
     */
    getPixelPos(percentagePos) {
        return {
            x: this.horPixels(percentagePos.x),
            y: this.verPixels(percentagePos.y),
        };
    }
    /**
     * Calculate the pixel size of an object within the canvas based on a percentage size.
     *
     * @param {Coords} percentagePos - The percentage size.
     * @returns {PixelCoords} - The corresponding pixel size.
     */
    getPixelSize(percentageSize) {
        return {
            w: this.horPixels(percentageSize.w),
            h: this.verPixels(percentageSize.h),
        };
    }
    /**
     * Set the size of the canvas based on the size of the its parent element.
     */
    setDisplaySize() {
        const canvasWidth = Math.min(720, getElementInnerDimensions(this.canvas.parentNode).w);
        this.canvas.setAttribute("width", canvasWidth.toString());
        this.canvas.setAttribute("height", ((canvasWidth / 4) * 3).toString());
    }
    /**
     * Synchonize the view with a new model (state).
     *
     * @param {GameState} state - A new game state.
     */
    syncState(state) {
        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.canvasContext.fillStyle = "black";
        this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawAlienSet(state.alienSet);
        this.drawPlayer(state.player);
        this.drawBullets(state.bullets);
        this.drawWalls(state.env.walls);
    }
    /**
     * Draw the alien set in the canvas.
     *
     * @param {AlienSet} alienSet
     */
    drawAlienSet(alienSet) {
        const alienSetXPos = alienSet.pos.x;
        for (const { alien, x, y } of alienSet) {
            if (!alien)
                continue;
            const xPercentage = alienSetXPos + x * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);
            const yPercentage = alienSet.pos.y + y * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);
            this.drawAlien(alien, {
                x: xPercentage,
                y: yPercentage,
            });
        }
    }
    /**
     * Draw an alien in the canvas.
     *
     * @param {Alien} alien
     * @param {Coords} pos - A percentage position.
     */
    drawAlien(alien, pos) {
        const { w, h } = this.getPixelSize(DIMENSIONS.alien);
        const { x, y } = this.getPixelPos(pos);
        this.canvasContext.fillStyle = alienColors[alien.alienType];
        this.canvasContext.fillRect(x, y, w, h);
    }
    /**
     * Draw an array of bullets on the canvas.
     *
     * @param {Bullet[]} bullets
     */
    drawBullets(bullets) {
        for (const bullet of bullets) {
            this.drawBullet(bullet);
        }
    }
    /**
     * Draw a bullet on the canvas.
     *
     * @param {Bullet} bullet
     */
    drawBullet(bullet) {
        const { x, y } = this.getPixelPos(bullet.pos);
        const { w, h } = this.getPixelSize(DIMENSIONS.bullet);
        this.canvasContext.fillStyle =
            bullet.from === "alien" ? "limegreen" : "white";
        this.canvasContext.fillRect(x, y, w, h);
    }
    /**
     * Draw player on the canvas.
     *
     * @param {Player} player
     */
    drawPlayer(player) {
        const { x, y } = this.getPixelPos(player.pos);
        const { w, h } = this.getPixelSize(DIMENSIONS.player);
        this.canvasContext.fillStyle = "white";
        this.canvasContext.fillRect(x, y, w, h);
    }
    /**
     * Draw walls on canvas.
     *
     * @param {Wall[]} walls
     */
    drawWalls(walls) {
        for (const wall of walls) {
            const { x, y } = this.getPixelPos(wall.pos);
            const { w, h } = this.getPixelSize(wall.size);
            this.canvasContext.fillStyle = "#ffffff";
            this.canvasContext.fillRect(x, y, w, h);
        }
    }
    /**
     * Draw metadata such as score, player remaining lives and so on.
     *
     * @param {GameState} state
     */
    drawMetadata(state) {
        // draw hearts to show player's lives
        // draw score
        //
    }
    /**
     * Draw a screen for when the game is over.
     */
    drawGameOverScreen() { }
}
/* ========================================================================= */
/* ========================== Controller =================================== */
/* ========================================================================= */
/**
 * A class responsible for managing the flow of information between state and view.
 */
class GameController {
}
const basicInvaderPlan = `
.xxooxx.
.oo..oo.
...xx...`;
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
const keys = keysTracker(["ArrowRight", "ArrowLeft", " "]);
runAnimation((timeStep) => {
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
