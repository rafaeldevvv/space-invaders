/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (() => {

eval("\nconst DIMENSIONS = {\n    alien: {\n        w: 5,\n        h: 7,\n    },\n    player: {\n        w: 5,\n        h: 7,\n    },\n    bullet: {\n        w: 1,\n        h: 3,\n    },\n    alienSetGap: {\n        w: 1,\n        h: 1,\n    },\n};\nconst displayPadding = {\n    hor: 3,\n    ver: 5,\n};\nconst arrowRightKey = \"ArrowRight\";\nconst arrowLeftKey = \"ArrowLeft\";\nconst spaceKey = \" \";\nconst displayMaxWidth = 720;\nconst displayAspectRatio = 4 / 3;\nclass Vector {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    plus(other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    }\n    minus(other) {\n        return new Vector(this.x - other.x, this.y - other.y);\n    }\n    times(factor) {\n        return new Vector(this.x * factor, this.y * factor);\n    }\n}\nfunction runAnimation(callback) {\n    let lastTime = null;\n    function frame(time) {\n        let shouldContinue;\n        if (lastTime) {\n            const timeStep = Math.min((time - lastTime) / 1000, 0.1);\n            lastTime = time;\n            shouldContinue = callback(timeStep);\n        }\n        else {\n            lastTime = time;\n            shouldContinue = true;\n        }\n        if (shouldContinue)\n            requestAnimationFrame(frame);\n    }\n    requestAnimationFrame(frame);\n}\nfunction randomNum(min, max) {\n    return min + Math.random() * (max - min);\n}\nfunction overlap(pos1, size1, pos2, size2) {\n    return (pos1.x + size1.w > pos2.x &&\n        pos1.x < pos2.x + size2.w &&\n        pos1.y + size1.h > pos2.y &&\n        pos1.y < pos2.y + size2.h);\n}\nfunction getElementInnerDimensions(element) {\n    const cs = getComputedStyle(element);\n    const paddingY = parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);\n    const paddingX = parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);\n    const marginY = parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);\n    const marginX = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);\n    return {\n        w: element.offsetWidth - paddingX - marginX,\n        h: element.offsetHeight - paddingY - marginY,\n    };\n}\nfunction keysTracker(keys) {\n    const down = {};\n    keys.forEach((key) => (down[key] = false));\n    function onPressKey(e) {\n        for (const key of keys) {\n            if (e.key === key) {\n                down[e.key] = e.type === \"keydown\";\n            }\n        }\n    }\n    window.addEventListener(\"keydown\", onPressKey);\n    window.addEventListener(\"keyup\", onPressKey);\n    return down;\n}\nconst alienSetXStep = (100 - displayPadding.hor * 2) / 20;\nconst alienSetYStep = 5;\nconst alienSetMoveTime = 1;\nvar HorizontalDirection;\n(function (HorizontalDirection) {\n    HorizontalDirection[HorizontalDirection[\"Right\"] = 1] = \"Right\";\n    HorizontalDirection[HorizontalDirection[\"Left\"] = -1] = \"Left\";\n})(HorizontalDirection || (HorizontalDirection = {}));\nclass AlienSet {\n    constructor(plan) {\n        this.pos = null;\n        this.direction = 1;\n        this.timeStepSum = 0;\n        const rows = plan\n            .trim()\n            .split(\"\\n\")\n            .map((l) => [...l]);\n        this.numColumns = rows[0].length;\n        this.numRows = rows.length;\n        this.aliens = rows.map((row, y) => {\n            return row.map((ch, x) => {\n                return Alien.create(ch, { x, y });\n            });\n        });\n    }\n    update(timeStep) {\n        this.timeStepSum += timeStep;\n        let movedY = 0;\n        if (this.pos.x + state.env.alienSetWidth >= 100 - displayPadding.hor &&\n            this.timeStepSum >= alienSetMoveTime &&\n            this.direction === HorizontalDirection.Right) {\n            this.direction = HorizontalDirection.Left;\n            movedY = alienSetYStep;\n        }\n        else if (this.pos.x <= displayPadding.hor &&\n            this.timeStepSum >= alienSetMoveTime &&\n            this.direction === HorizontalDirection.Left) {\n            this.direction = HorizontalDirection.Right;\n            movedY = alienSetYStep;\n        }\n        let movedX = 0;\n        if (this.timeStepSum >= alienSetMoveTime && movedY === 0) {\n            if (this.direction === HorizontalDirection.Right) {\n                movedX = Math.min(alienSetXStep, 100 - this.pos.x - displayPadding.hor - state.env.alienSetWidth);\n            }\n            else {\n                movedX = Math.min(alienSetXStep, this.pos.x - displayPadding.hor);\n            }\n            movedX *= this.direction;\n        }\n        if (this.timeStepSum >= alienSetMoveTime) {\n            this.timeStepSum = 0;\n        }\n        this.pos = this.pos.plus(new Vector(movedX, movedY));\n    }\n    removeAlien(x, y) {\n        this.aliens[y][x] = null;\n    }\n    get length() {\n        return this.aliens.reduce((allAliensCount, row) => {\n            const rowCount = row.reduce((rowCount, alien) => {\n                if (alien !== null)\n                    return rowCount + 1;\n                else\n                    return rowCount;\n            }, 0);\n            return allAliensCount + rowCount;\n        }, 0);\n    }\n    *[Symbol.iterator]() {\n        for (let y = 0; y < this.numRows; y++) {\n            for (let x = 0; x < this.numColumns; x++) {\n                yield this.aliens[y][x];\n            }\n        }\n    }\n}\nclass Alien {\n    constructor(gridPos, score, gun, alienType) {\n        this.gridPos = gridPos;\n        this.score = score;\n        this.gun = gun;\n        this.alienType = alienType;\n        this.actorType = \"alien\";\n    }\n    fire(alienPos) {\n        const bulletX = alienPos.x + DIMENSIONS.alien.w / 2 - DIMENSIONS.bullet.w / 2;\n        return this.gun.fire(new Vector(bulletX, alienPos.y), \"down\");\n    }\n    static create(ch, gridPos) {\n        switch (ch) {\n            case \".\": {\n                return new Alien(gridPos, 100, new Gun(\"alien\", 50, 2000), ch);\n            }\n            case \"x\": {\n                return new Alien(gridPos, 300, new Gun(\"alien\", 80, 5500), ch);\n            }\n            case \"o\": {\n                return new Alien(gridPos, 500, new Gun(\"alien\", 30, 3000), ch);\n            }\n            default: {\n                throw new Error(\"Unexpected character: \" + ch);\n            }\n        }\n    }\n}\nconst playerXSpeed = 30;\nclass Player {\n    constructor() {\n        this.actorType = \"player\";\n        this.baseXPos = 50 - DIMENSIONS.player.w / 2;\n        this.baseYPos = 90;\n        this.pos = new Vector(this.baseXPos, this.baseYPos);\n        this.gun = new Gun(\"player\", 70, 500);\n        this.lives = 3;\n        this.score = 0;\n    }\n    fire() {\n        const bulletPosX = this.pos.x + DIMENSIONS.player.w / 2;\n        return this.gun.fire(new Vector(bulletPosX, this.pos.y), \"up\");\n    }\n    resetPos() {\n        this.pos = new Vector(this.baseXPos, this.baseYPos);\n    }\n    update(timeStep, keys) {\n        const movedX = new Vector(timeStep * playerXSpeed, 0);\n        if (keys.ArrowLeft && this.pos.x > displayPadding.hor) {\n            this.pos = this.pos.minus(movedX);\n        }\n        else if (keys.ArrowRight &&\n            this.pos.x + DIMENSIONS.player.w < 100 - displayPadding.hor) {\n            this.pos = this.pos.plus(movedX);\n        }\n    }\n}\nclass Gun {\n    constructor(owner, bulletSpeed, fireInterval) {\n        this.owner = owner;\n        this.bulletSpeed = bulletSpeed;\n        this.fireInterval = fireInterval;\n        this.lastFire = performance.now() - randomNum(0, fireInterval);\n    }\n    fire(pos, direction) {\n        if (this.canFire()) {\n            this.lastFire = performance.now();\n            return new Bullet(this.owner, pos, new Vector(0, direction === \"up\" ? -this.bulletSpeed : this.bulletSpeed));\n        }\n        return null;\n    }\n    canFire() {\n        const lastFire = this.lastFire;\n        const now = performance.now();\n        const timeStep = now - lastFire;\n        return timeStep >= this.fireInterval;\n    }\n}\nclass Bullet {\n    constructor(from, pos, speed) {\n        this.from = from;\n        this.pos = pos;\n        this.speed = speed;\n    }\n    update(timeStep) {\n        this.pos = this.pos.plus(this.speed.times(timeStep));\n    }\n    collide(state) {\n        state.bullets = state.bullets.filter((bullet) => bullet !== this);\n    }\n}\nclass Wall {\n    constructor(pos, size) {\n        this.pos = pos;\n        this.size = size;\n    }\n}\nclass GameEnv {\n    constructor(alienSet, player, walls) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.walls = walls;\n        this.alienSetWidth =\n            DIMENSIONS.alien.w * alienSet.numColumns +\n                DIMENSIONS.alienSetGap.w * (alienSet.numColumns - 1);\n        this.alienSetHeight =\n            DIMENSIONS.alien.h * alienSet.numRows +\n                DIMENSIONS.alienSetGap.h * (this.alienSet.numRows - 1);\n        alienSet.pos = new Vector(50 - this.alienSetWidth / 2, 10);\n        this.alienSet = alienSet;\n    }\n    getAlienPos({ gridPos: { x, y } }) {\n        return new Vector(this.alienSet.pos.x +\n            x * DIMENSIONS.alien.w +\n            x * DIMENSIONS.alienSetGap.w, this.alienSet.pos.y +\n            y * DIMENSIONS.alien.h +\n            y * DIMENSIONS.alienSetGap.h);\n    }\n    bulletTouchesWall(bullet) {\n        return this.walls.some((wall) => {\n            return overlap(wall.pos, wall.size, bullet.pos, DIMENSIONS.bullet);\n        });\n    }\n    bulletShouldBeRemoved(bullet) {\n        let touches = false;\n        if (bullet.pos.y >= 100 || bullet.pos.y + DIMENSIONS.bullet.h <= 0) {\n            touches = true;\n        }\n        if (this.isActorShot(bullet, this.player.pos, DIMENSIONS.player) &&\n            bullet.from === \"alien\") {\n            touches = true;\n        }\n        if (this.bulletTouchesWall(bullet))\n            touches = true;\n        for (const alien of this.alienSet) {\n            if (bullet.from === \"alien\")\n                break;\n            if (!alien)\n                continue;\n            if (this.isActorShot(bullet, this.getAlienPos(alien), DIMENSIONS.alien)) {\n                touches = true;\n                break;\n            }\n        }\n        return touches;\n    }\n    alienSetReachedWall() {\n        return this.alienSet.pos.y + this.alienSetHeight >= this.walls[0].pos.y;\n    }\n    isActorShot(bullet, actorPos, actorSize) {\n        return overlap(bullet.pos, DIMENSIONS.bullet, actorPos, actorSize);\n    }\n    isActorShot2(actorPos, actorSize) {\n    }\n}\nclass GameState {\n    constructor(alienSet, player, env) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.env = env;\n        this.bullets = [];\n        this.status = \"running\";\n    }\n    update(timeStep, keys) {\n        this.alienSet.update(timeStep);\n        this.bullets.forEach((bullet) => bullet.update(timeStep));\n        this.player.update(timeStep, keys);\n        if (keys[\" \"] && this.player.gun.canFire()) {\n            this.bullets.push(this.player.fire());\n        }\n        const playerBullets = this.bullets.filter((bullet) => bullet.from === \"player\");\n        for (const playerBullet of playerBullets) {\n            for (const alien of this.alienSet) {\n                if (!alien)\n                    continue;\n                if (this.env.isActorShot(playerBullet, this.env.getAlienPos(alien), DIMENSIONS.alien)) {\n                    this.player.score += alien.score;\n                    this.alienSet.removeAlien(alien.gridPos.x, alien.gridPos.y);\n                    playerBullet.collide(this);\n                }\n            }\n        }\n        for (const alien of this.alienSet) {\n            if (!alien)\n                continue;\n            if (alien.gun.canFire()) {\n                this.bullets.push(alien.fire(this.env.getAlienPos(alien)));\n            }\n        }\n        const alienBullets = this.bullets.filter((bullet) => bullet.from === \"alien\");\n        alienBullets.forEach((b) => {\n            if (this.env.isActorShot(b, this.player.pos, DIMENSIONS.player)) {\n                this.player.lives--;\n                this.player.resetPos();\n                b.collide(this);\n            }\n        });\n        if (this.alienSet.length === 0) {\n            this.status = \"won\";\n        }\n        else if (this.player.lives === 0) {\n            this.status = \"lost\";\n        }\n        if (this.env.alienSetReachedWall()) {\n            this.env.walls = [];\n            this.status = \"lost\";\n        }\n        this.removeUnnecessaryBullets();\n    }\n    removeUnnecessaryBullets() {\n        const necessaryBullets = [];\n        for (const bullet of this.bullets) {\n            if (!this.env.bulletShouldBeRemoved(bullet)) {\n                necessaryBullets.push(bullet);\n            }\n        }\n        this.bullets = necessaryBullets;\n        console.log(this.bullets.filter((bullet) => bullet.from == \"player\"));\n    }\n    static Start(plan) {\n        const alienSet = new AlienSet(plan);\n        const player = new Player();\n        const walls = [\n            new Wall({ x: 20, y: 75 }, { w: 20, h: 5 }),\n            new Wall({ x: 60, y: 75 }, { w: 20, h: 5 }),\n        ];\n        const env = new GameEnv(alienSet, player, walls);\n        return new GameState(alienSet, player, env);\n    }\n}\nconst alienColors = {\n    \".\": \"limegreen\",\n    x: \"orange\",\n    o: \"pink\",\n};\nclass CanvasDisplay {\n    constructor(state, controller, parent) {\n        this.state = state;\n        this.controller = controller;\n        this.parent = parent;\n        this.canvas = document.createElement(\"canvas\");\n        this.canvasContext = this.canvas.getContext(\"2d\");\n        this.canvas.style.display = \"block\";\n        this.canvas.style.marginInline = \"auto\";\n        this.parent.appendChild(this.canvas);\n        this.setDisplaySize();\n        this.defineEventListeners();\n        this.syncState(state);\n    }\n    defineEventListeners() {\n        window.addEventListener(\"resize\", () => {\n            this.setDisplaySize();\n            this.syncState(this.state);\n        });\n    }\n    get canvasWidth() {\n        return this.canvas.width;\n    }\n    get canvasHeight() {\n        return this.canvas.height;\n    }\n    horPixels(percentage) {\n        return (percentage / 100) * this.canvasWidth;\n    }\n    verPixels(percentage) {\n        return (percentage / 100) * this.canvasHeight;\n    }\n    getPixelPos(percentagePos) {\n        return {\n            x: this.horPixels(percentagePos.x),\n            y: this.verPixels(percentagePos.y),\n        };\n    }\n    getPixelSize(percentageSize) {\n        return {\n            w: this.horPixels(percentageSize.w),\n            h: this.verPixels(percentageSize.h),\n        };\n    }\n    setDisplaySize() {\n        const canvasWidth = Math.min(displayMaxWidth, getElementInnerDimensions(this.canvas.parentNode).w);\n        this.canvas.setAttribute(\"width\", canvasWidth.toString());\n        this.canvas.setAttribute(\"height\", (canvasWidth / displayAspectRatio).toString());\n    }\n    syncState(state) {\n        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);\n        this.canvasContext.fillStyle = \"black\";\n        this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);\n        this.drawAlienSet(state.alienSet);\n        this.drawPlayer(state.player);\n        this.drawBullets(state.bullets);\n        this.drawWalls(state.env.walls);\n        this.drawMetadata(state);\n    }\n    drawAlienSet(alienSet) {\n        const alienSetXPos = alienSet.pos.x;\n        for (const alien of alienSet) {\n            if (!alien)\n                continue;\n            const xPercentage = alienSetXPos +\n                alien.gridPos.x * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);\n            const yPercentage = alienSet.pos.y +\n                alien.gridPos.y * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);\n            this.drawAlien(alien, {\n                x: xPercentage,\n                y: yPercentage,\n            });\n        }\n    }\n    drawAlien(alien, pos) {\n        const { w, h } = this.getPixelSize(DIMENSIONS.alien);\n        const { x, y } = this.getPixelPos(pos);\n        this.canvasContext.fillStyle = alienColors[alien.alienType];\n        this.canvasContext.fillRect(x, y, w, h);\n    }\n    drawBullets(bullets) {\n        for (const bullet of bullets) {\n            this.drawBullet(bullet);\n        }\n    }\n    drawBullet(bullet) {\n        const { x, y } = this.getPixelPos(bullet.pos);\n        const { w, h } = this.getPixelSize(DIMENSIONS.bullet);\n        this.canvasContext.fillStyle =\n            bullet.from === \"alien\" ? \"limegreen\" : \"white\";\n        this.canvasContext.fillRect(x, y, w, h);\n    }\n    drawPlayer(player) {\n        const { x, y } = this.getPixelPos(player.pos);\n        const { w, h } = this.getPixelSize(DIMENSIONS.player);\n        this.canvasContext.fillStyle = \"white\";\n        this.canvasContext.fillRect(x, y, w, h);\n    }\n    drawWalls(walls) {\n        for (const wall of walls) {\n            const { x, y } = this.getPixelPos(wall.pos);\n            const { w, h } = this.getPixelSize(wall.size);\n            this.canvasContext.fillStyle = \"#ffffff\";\n            this.canvasContext.fillRect(x, y, w, h);\n        }\n    }\n    drawMetadata(state) {\n        const fontSize = Math.min(30, this.verPixels(8));\n        this.canvasContext.fillStyle = \"#fff\";\n        this.canvasContext.font = `${fontSize}px monospace`;\n        this.canvasContext.textAlign = \"start\";\n        this.canvasContext.fillText(`SCORE ${state.player.score}`, this.horPixels(displayPadding.hor), fontSize + this.verPixels(1));\n        this.canvasContext.textAlign = \"end\";\n        this.canvasContext.fillText(`Lives ${state.player.lives}`, this.horPixels(100 - displayPadding.hor), fontSize + this.verPixels(1));\n    }\n    drawGameOverScreen() { }\n}\nclass GameController {\n}\nconst basicInvaderPlan = `\r\n.xxooxx.\r\n.oo..oo.\r\n...xx...`;\nconst a = {\n    actorType: \"alien\",\n    alienType: \".\",\n    gridPos: { x: 8, y: 8 },\n    score: 899,\n    gun: new Gun(\"alien\", 5, 200),\n    fire(from) {\n        throw \"\";\n    },\n};\nconst state = GameState.Start(basicInvaderPlan);\nconst canvasDisplay = new CanvasDisplay(state, new GameController(), document.body);\nconst keys = keysTracker([\"ArrowRight\", \"ArrowLeft\", \" \"]);\nrunAnimation((timeStep) => {\n    canvasDisplay.syncState(state);\n    if (state.status === \"lost\") {\n        console.log(\"lost\");\n        return false;\n    }\n    else if (state.status === \"won\") {\n        console.log(\"won\");\n        return false;\n    }\n    else {\n        state.update(timeStep, keys);\n        return true;\n    }\n});\n\n\n//# sourceURL=webpack://space-invaders/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.ts"]();
/******/ 	
/******/ })()
;