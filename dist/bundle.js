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

eval("\nconst alienTypes = [\"X\", \"Y\", \"Z\"];\nconst alienTypesRegExp = new RegExp(`(\\\\w*(${alienTypes.join(\"|\")})*\\\\w*)+`);\nconst DIMENSIONS = {\n    alien: {\n        w: 4,\n        h: 6,\n    },\n    player: {\n        w: 5,\n        h: 7,\n    },\n    alienSetGap: {\n        w: 1,\n        h: 1.5,\n    },\n};\nconst displayPadding = {\n    hor: 3,\n    ver: 5,\n};\nconst moveRightActionKey = \"ArrowRight\";\nconst moveLeftActionKey = \"ArrowLeft\";\nconst fireActionKey = \" \";\nconst displayMaxWidth = 720;\nconst displayAspectRatio = 4 / 3;\nconst basicInvaderPlan = `\r\nXXYZZYXX\r\nXXZYYZXX\r\nZXXYYXXZ`;\nconst customWall1 = `\r\n........######################################........\r\n.....############################################.....\r\n...################################################...\r\n..##################################################..\r\n.###################################################..\r\n.############.......##############.......############.\r\n.##########...........##########...........##########.\r\n##########..............######..............##########\r\n#########......##........####.........##.....#########\r\n########......##..........##...........##....#########\r\n########......##.........####..........##.....########\r\n########......###......#########......###.....########\r\n########.......#####..####..######..####......########\r\n########........########......########........########\r\n########.........#####..........#####.........########\r\n#########....................................#########\r\n.#########..................................#########.\r\n..##########..............................##########..\r\n`;\nconst customWall2 = `\r\n...#...............................................#...\r\n..###.............................................###..\r\n..####...........................................####..\r\n.######....................#....................######.\r\n.#######..................###..................#######.\r\n#########................#####................#########\r\n##########..............#######..............##########\r\n############.........#############.........############\r\n##############..#..#################..#..##############\r\n#######################################################\r\n.#####################################################.\r\n...#################################################...\r\n......###########################################......\r\n........###########..................##########........\r\n..........#######......................#######.........\r\n`;\nclass Vector {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    plus(other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    }\n    minus(other) {\n        return new Vector(this.x - other.x, this.y - other.y);\n    }\n    times(factor) {\n        return new Vector(this.x * factor, this.y * factor);\n    }\n}\nfunction runAnimation(callback) {\n    let lastTime = null;\n    function frame(time) {\n        let shouldContinue;\n        if (lastTime) {\n            const timeStep = Math.min(time - lastTime, 100) / 1000;\n            lastTime = time;\n            shouldContinue = callback(timeStep);\n        }\n        else {\n            lastTime = time;\n            shouldContinue = true;\n        }\n        if (shouldContinue)\n            requestAnimationFrame(frame);\n    }\n    requestAnimationFrame(frame);\n}\nfunction randomNum(min, max) {\n    return min + Math.random() * (max - min);\n}\nfunction overlap(pos1, size1, pos2, size2) {\n    return (pos1.x + size1.w > pos2.x &&\n        pos1.x < pos2.x + size2.w &&\n        pos1.y + size1.h > pos2.y &&\n        pos1.y < pos2.y + size2.h);\n}\nfunction getElementInnerDimensions(element) {\n    const cs = getComputedStyle(element);\n    const paddingY = parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);\n    const paddingX = parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);\n    const marginY = parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);\n    const marginX = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);\n    return {\n        w: element.offsetWidth - paddingX - marginX,\n        h: element.offsetHeight - paddingY - marginY,\n    };\n}\nfunction trackKeys(keys) {\n    const down = {};\n    keys.forEach((key) => (down[key] = false));\n    function onPressKey(e) {\n        for (const key of keys) {\n            if (e.key === key) {\n                down[e.key] = e.type === \"keydown\";\n            }\n        }\n    }\n    window.addEventListener(\"keydown\", onPressKey);\n    window.addEventListener(\"keyup\", onPressKey);\n    return down;\n}\nfunction isColumnDead(rows, column) {\n    return rows.every((row) => row[column] === null);\n}\nfunction isRowDead(row) {\n    return row.every((alien) => alien === null);\n}\nfunction getFirstOrLastColumnIfDead(rows) {\n    const isFirstColumnDead = isColumnDead(rows, 0);\n    const isLastColumnDead = isColumnDead(rows, rows[0].length - 1);\n    if (isFirstColumnDead)\n        return 0;\n    if (isLastColumnDead)\n        return rows[0].length - 1;\n    else\n        return null;\n}\nfunction getFirstOrLastRowIfDead(rows) {\n    const isFirstRowDead = isRowDead(rows[0]);\n    const isLastRowDead = isRowDead(rows[rows.length - 1]);\n    if (isFirstRowDead)\n        return 0;\n    if (isLastRowDead)\n        return rows.length - 1;\n    else\n        return null;\n}\nconst alienSetStepToEdgeAdjustment = 1.33;\nconst alienSetTimeDecreaseFactor = 0.92;\nvar HorizontalDirection;\n(function (HorizontalDirection) {\n    HorizontalDirection[HorizontalDirection[\"Right\"] = 1] = \"Right\";\n    HorizontalDirection[HorizontalDirection[\"Left\"] = -1] = \"Left\";\n})(HorizontalDirection || (HorizontalDirection = {}));\nclass AlienSet {\n    constructor(plan) {\n        this.yStep = 3;\n        this.timeToUpdate = 1;\n        this.direction = 1;\n        this.timeStepSum = 0;\n        if (!alienTypesRegExp.test(plan)) {\n            throw new Error(`Invalid character(s) in plan ${plan}. Consider using only valid characters (${alienTypes.join(\",\")})`);\n        }\n        const rows = plan\n            .trim()\n            .split(\"\\n\")\n            .map((l) => [...l]);\n        this.numColumns = rows[0].length;\n        this.numRows = rows.length;\n        this.alive = this.numColumns * this.numRows;\n        const w = this.numColumns * DIMENSIONS.alien.w +\n            (this.numColumns - 1) * DIMENSIONS.alienSetGap.w;\n        const h = this.numRows * DIMENSIONS.alien.h +\n            (this.numRows - 1) * DIMENSIONS.alienSetGap.h;\n        this.size = { w, h };\n        this.pos = new Vector(50 - w / 2, displayPadding.ver + 10);\n        this.xStep = (100 - displayPadding.hor * 2 - w) / 15;\n        this.aliens = rows.map((row, y) => {\n            return row.map((ch, x) => {\n                return Alien.create(ch, { x, y });\n            });\n        });\n    }\n    update(timeStep) {\n        this.timeStepSum += timeStep;\n        const movedY = this.moveVertically();\n        const movedX = this.moveHorizontally(movedY);\n        if (this.timeStepSum >= this.timeToUpdate) {\n            this.timeStepSum = 0;\n        }\n        if (movedY > 0) {\n            this.timeToUpdate *= alienSetTimeDecreaseFactor;\n        }\n        this.pos = this.pos.plus(new Vector(movedX, movedY));\n        for (const alien of this) {\n            if (alien)\n                alien.gun.update(timeStep);\n        }\n    }\n    moveVertically() {\n        let movedY = 0;\n        if (this.pos.x + this.size.w >= 100 - displayPadding.hor &&\n            this.timeStepSum >= this.timeToUpdate &&\n            this.direction === HorizontalDirection.Right) {\n            movedY = this.yStep;\n            this.direction = HorizontalDirection.Left;\n        }\n        else if (this.pos.x <= displayPadding.hor &&\n            this.timeStepSum >= this.timeToUpdate &&\n            this.direction === HorizontalDirection.Left) {\n            movedY = this.yStep;\n            this.direction = HorizontalDirection.Right;\n        }\n        return movedY;\n    }\n    moveHorizontally(movedY) {\n        let movedX = 0;\n        if (this.timeStepSum >= this.timeToUpdate && movedY === 0) {\n            if (this.direction === HorizontalDirection.Right) {\n                const rightDistance = 100 - this.pos.x - displayPadding.hor - this.size.w;\n                if (rightDistance < this.xStep * alienSetStepToEdgeAdjustment) {\n                    movedX = rightDistance;\n                }\n                else {\n                    movedX = this.xStep;\n                }\n            }\n            else {\n                const leftDistance = this.pos.x - displayPadding.hor;\n                if (leftDistance < this.xStep * alienSetStepToEdgeAdjustment) {\n                    movedX = leftDistance;\n                }\n                else {\n                    movedX = this.xStep;\n                }\n            }\n            movedX *= this.direction;\n        }\n        return movedX;\n    }\n    adapt() {\n        this.adaptPos();\n        this.adaptSize();\n        this.removeDeadRowsAndColumns();\n    }\n    adaptSize() {\n        let firstLivingAlienRow = null, lastLivingAlienRow = null, firstLivingAlienColumn = null, lastLivingAlienColumn = null;\n        for (const alien of this) {\n            if (!alien)\n                continue;\n            const { x: column, y: row } = alien.gridPos;\n            if (firstLivingAlienRow === null) {\n                firstLivingAlienRow = row;\n            }\n            lastLivingAlienRow = row;\n            if (firstLivingAlienColumn === null || column < firstLivingAlienColumn) {\n                firstLivingAlienColumn = column;\n            }\n            if (lastLivingAlienColumn === null || column > lastLivingAlienColumn) {\n                lastLivingAlienColumn = column;\n            }\n        }\n        if (firstLivingAlienRow !== null) {\n            const newH = (lastLivingAlienRow - firstLivingAlienRow + 1) * DIMENSIONS.alien.h +\n                (lastLivingAlienRow - firstLivingAlienRow) * DIMENSIONS.alienSetGap.h;\n            const newW = (lastLivingAlienColumn - firstLivingAlienColumn + 1) *\n                DIMENSIONS.alien.w +\n                (lastLivingAlienColumn - firstLivingAlienColumn) *\n                    DIMENSIONS.alienSetGap.w;\n            this.size = {\n                w: newW,\n                h: newH,\n            };\n        }\n    }\n    adaptPos() {\n        let firstLivingAlienColumn = null;\n        let firstLivingAlienRow = null;\n        for (const alien of this) {\n            if (!alien)\n                continue;\n            const { x, y } = alien.gridPos;\n            if (firstLivingAlienColumn === null || x < firstLivingAlienColumn) {\n                firstLivingAlienColumn = x;\n            }\n            if (firstLivingAlienRow === null) {\n                firstLivingAlienRow = y;\n            }\n        }\n        if (firstLivingAlienColumn !== null && firstLivingAlienRow !== null) {\n            this.pos = this.getAlienPos({\n                x: firstLivingAlienColumn,\n                y: firstLivingAlienRow,\n            });\n        }\n    }\n    removeDeadRowsAndColumns() {\n        let rowToRemove;\n        while ((rowToRemove = getFirstOrLastRowIfDead(this.aliens)) !== null &&\n            this.aliens.length === 0) {\n            this.aliens = this.aliens.filter((_, y) => y !== rowToRemove);\n            this.syncAliensGridPos();\n        }\n        let columnToRemove;\n        while ((columnToRemove = getFirstOrLastColumnIfDead(this.aliens)) !== null) {\n            this.aliens = this.aliens.map((row) => {\n                return row.filter((_, x) => x !== columnToRemove);\n            });\n            this.syncAliensGridPos();\n        }\n        this.syncNumOfColsAndRows();\n    }\n    syncAliensGridPos() {\n        this.aliens.forEach((row, y) => {\n            row.forEach((alien, x) => {\n                if (alien)\n                    alien.gridPos = { x, y };\n            });\n        });\n    }\n    syncNumOfColsAndRows() {\n        this.numColumns = this.aliens[0].length;\n        this.numRows = this.aliens.length;\n    }\n    getAlienPos({ x, y }) {\n        return new Vector(this.pos.x + x * DIMENSIONS.alien.w + x * DIMENSIONS.alienSetGap.w, this.pos.y + y * DIMENSIONS.alien.h + y * DIMENSIONS.alienSetGap.h);\n    }\n    removeAlien(alien) {\n        this.aliens[alien.gridPos.y][alien.gridPos.x] = null;\n        this.alive--;\n    }\n    *[Symbol.iterator]() {\n        for (let y = 0; y < this.numRows; y++) {\n            for (let x = 0; x < this.numColumns; x++) {\n                yield this.aliens[y][x];\n            }\n        }\n    }\n}\nclass Alien {\n    constructor(gridPos, score, gun, alienType) {\n        this.gridPos = gridPos;\n        this.score = score;\n        this.gun = gun;\n        this.alienType = alienType;\n        this.actorType = \"alien\";\n    }\n    fire(alienPos) {\n        const bulletX = alienPos.x + DIMENSIONS.alien.w / 2 - this.gun.bulletSize.w / 2;\n        return this.gun.fire(new Vector(bulletX, alienPos.y), \"down\");\n    }\n    static create(ch, gridPos) {\n        switch (ch) {\n            case \"X\": {\n                return new Alien(gridPos, 20, new Gun(\"alien\", 40, { w: 0.5, h: 3 }, 4000), ch);\n            }\n            case \"Y\": {\n                return new Alien(gridPos, 40, new Gun(\"alien\", 60, { w: 1, h: 3 }, 6000), ch);\n            }\n            case \"Z\": {\n                return new Alien(gridPos, 60, new Gun(\"alien\", 80, { w: 1.5, h: 3 }, 7000), ch);\n            }\n            case \".\": {\n                return null;\n            }\n            default: {\n                const _never = ch;\n                throw new Error(\"Unexpected character: \" + _never);\n            }\n        }\n    }\n}\nconst playerXSpeed = 30;\nclass Player {\n    constructor() {\n        this.actorType = \"player\";\n        this.baseXPos = 50 - DIMENSIONS.player.w / 2;\n        this.baseYPos = 90;\n        this.pos = new Vector(this.baseXPos, this.baseYPos);\n        this.gun = new Gun(\"player\", 70, { w: 0.5, h: 3 }, 400);\n        this.lives = 3;\n        this.score = 0;\n    }\n    fire() {\n        const bulletPosX = this.pos.x + DIMENSIONS.player.w / 2 - this.gun.bulletSize.w / 2;\n        return this.gun.fire(new Vector(bulletPosX, this.pos.y), \"up\");\n    }\n    resetPos() {\n        this.pos = new Vector(this.baseXPos, this.baseYPos);\n    }\n    update(state, timeStep, keys) {\n        const movedX = new Vector(timeStep * playerXSpeed, 0);\n        if (keys[moveLeftActionKey] && this.pos.x > displayPadding.hor) {\n            this.pos = this.pos.minus(movedX);\n        }\n        else if (keys[moveRightActionKey] &&\n            this.pos.x + DIMENSIONS.player.w < 100 - displayPadding.hor) {\n            this.pos = this.pos.plus(movedX);\n        }\n        this.gun.update(timeStep);\n        if (keys[fireActionKey] && this.gun.canFire()) {\n            state.bullets.push(this.fire());\n        }\n    }\n}\nclass Gun {\n    constructor(owner, bulletSpeed, bulletSize, baseFireInterval) {\n        this.owner = owner;\n        this.bulletSpeed = bulletSpeed;\n        this.bulletSize = bulletSize;\n        this.baseFireInterval = baseFireInterval;\n        this.timeSinceLastShot = 0;\n        this.fireInterval = randomNum(0.9 * baseFireInterval, baseFireInterval);\n        this.timeSinceLastShot = randomNum(0, this.fireInterval);\n    }\n    fire(pos, direction) {\n        if (this.canFire()) {\n            this.timeSinceLastShot = 0;\n            this.fireInterval = randomNum(0.9 * this.baseFireInterval, this.baseFireInterval);\n            return new Bullet(this.owner, pos, new Vector(0, direction === \"up\" ? -this.bulletSpeed : this.bulletSpeed), this.bulletSize);\n        }\n        return null;\n    }\n    update(timeStep) {\n        this.timeSinceLastShot += timeStep * 1000;\n    }\n    canFire() {\n        return this.timeSinceLastShot >= this.fireInterval;\n    }\n}\nclass Bullet {\n    constructor(from, pos, speed, size) {\n        this.from = from;\n        this.pos = pos;\n        this.speed = speed;\n        this.size = size;\n    }\n    update(timeStep) {\n        this.pos = this.pos.plus(this.speed.times(timeStep));\n    }\n    collide(state) {\n        state.bullets = state.bullets.filter((bullet) => bullet !== this);\n    }\n}\nclass UnbreakableWall {\n    constructor(pos, size) {\n        this.pos = pos;\n        this.size = size;\n    }\n}\nclass BreakableWall {\n    constructor(pos, size, numRows = 6, numColumns = 20) {\n        this.pos = pos;\n        this.size = size;\n        this.numRows = numRows;\n        this.numColumns = numColumns;\n        this.piecesMatrix = new Array(numRows)\n            .fill(undefined)\n            .map(() => new Array(numColumns).fill(true));\n        this.pieceSize = {\n            w: size.w / numColumns,\n            h: size.h / numRows,\n        };\n    }\n    getPiecePos(column, row) {\n        return {\n            x: this.pos.x + column * this.pieceSize.w,\n            y: this.pos.y + row * this.pieceSize.h,\n        };\n    }\n    collide(state, objPos, objSize, obj) {\n        if (!overlap(this.pos, this.size, objPos, objSize))\n            return;\n        for (const { row, column, piece } of this) {\n            if (!piece)\n                continue;\n            const piecePos = this.getPiecePos(column, row);\n            if (overlap(objPos, objSize, piecePos, this.pieceSize)) {\n                this.piecesMatrix[row][column] = false;\n                obj === null || obj === void 0 ? void 0 : obj.collide(state);\n            }\n        }\n    }\n    *[Symbol.iterator]() {\n        const rows = this.piecesMatrix.length;\n        for (let row = 0; row < rows; row++) {\n            const columnLength = this.piecesMatrix[row].length;\n            for (let column = 0; column < columnLength; column++) {\n                const piece = this.piecesMatrix[row][column];\n                yield { row, column, piece };\n            }\n        }\n    }\n}\nclass CustomBreakableWall {\n    constructor(pos, size, plan) {\n        this.pos = pos;\n        this.size = size;\n        this.piecesMatrix = plan\n            .trim()\n            .split(\"\\n\")\n            .map((row) => [...row].map((ch) => (ch === \"#\" ? true : false)));\n        this.pieceSize = {\n            w: this.size.w / this.piecesMatrix[0].length,\n            h: this.size.h / this.piecesMatrix.length,\n        };\n    }\n    getPiecePos(column, row) {\n        return {\n            x: this.pos.x + column * this.pieceSize.w,\n            y: this.pos.y + row * this.pieceSize.h,\n        };\n    }\n    collide(state, objPos, objSize, obj) {\n        if (!overlap(this.pos, this.size, objPos, objSize))\n            return;\n        for (const { row, column, piece } of this) {\n            if (!piece)\n                continue;\n            const piecePos = this.getPiecePos(column, row);\n            if (overlap(objPos, objSize, piecePos, this.pieceSize)) {\n                this.piecesMatrix[row][column] = false;\n                obj === null || obj === void 0 ? void 0 : obj.collide(state);\n            }\n        }\n    }\n    *[Symbol.iterator]() {\n        const rows = this.piecesMatrix.length;\n        for (let row = 0; row < rows; row++) {\n            const columnLength = this.piecesMatrix[row].length;\n            for (let column = 0; column < columnLength; column++) {\n                const piece = this.piecesMatrix[row][column];\n                yield { row, column, piece };\n            }\n        }\n    }\n}\nclass GameEnv {\n    constructor(alienSet, player, walls) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.walls = walls;\n    }\n    bulletTouchesWall(bullet, wall) {\n        return overlap(wall.pos, wall.size, bullet.pos, bullet.size);\n    }\n    isBulletOutOfBounds(bullet) {\n        return bullet.pos.y >= 100 || bullet.pos.y + bullet.size.h <= 0;\n    }\n    alienSetTouchesPlayer() {\n        return this.alienSet.pos.y + this.alienSet.size.h >= this.player.pos.y;\n    }\n    alienSetTouchesWall(wall) {\n        return this.alienSet.pos.y + this.alienSet.size.h >= wall.pos.y;\n    }\n    bulletTouchesObject(bullet, objPos, objSize) {\n        return overlap(bullet.pos, bullet.size, objPos, objSize);\n    }\n}\nclass GameState {\n    constructor(alienSet, player, env) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.env = env;\n        this.bullets = [];\n        this.status = \"running\";\n    }\n    update(timeStep, keys) {\n        this.alienSet.update(timeStep);\n        this.player.update(this, timeStep, keys);\n        this.fireAliens();\n        this.handleBulletsContactWithWall();\n        this.bullets.forEach((bullet) => bullet.update(timeStep));\n        this.handleBulletsThatHitAlien();\n        this.handleBulletsThatHitPlayer();\n        this.removeOutOfBoundsBullets();\n        this.handleAlienContactWithWall();\n        if (this.alienSet.alive === 0) {\n            this.alienSet = new AlienSet(basicInvaderPlan);\n            this.env.alienSet = this.alienSet;\n            this.player.lives++;\n        }\n        else if (this.player.lives < 1) {\n            this.status = \"lost\";\n        }\n        if (this.env.alienSetTouchesPlayer()) {\n            this.env.walls = [];\n            this.status = \"lost\";\n        }\n    }\n    handleBulletsContactWithWall() {\n        for (const bullet of this.bullets) {\n            for (const wall of this.env.walls) {\n                if (!this.env.bulletTouchesWall(bullet, wall))\n                    continue;\n                if (wall instanceof UnbreakableWall) {\n                    bullet.collide(this);\n                }\n                else {\n                    wall.collide(this, bullet.pos, bullet.size, bullet);\n                }\n            }\n        }\n    }\n    handleBulletsThatHitAlien() {\n        const playerBullets = this.bullets.filter((bullet) => bullet.from === \"player\");\n        for (const playerBullet of playerBullets) {\n            for (const alien of this.alienSet) {\n                if (!alien)\n                    continue;\n                if (this.env.bulletTouchesObject(playerBullet, this.alienSet.getAlienPos(alien.gridPos), DIMENSIONS.alien)) {\n                    this.player.score += alien.score;\n                    this.alienSet.removeAlien(alien);\n                    playerBullet.collide(this);\n                }\n            }\n        }\n        this.alienSet.adapt();\n    }\n    fireAliens() {\n        for (const alien of this.alienSet) {\n            if (!alien)\n                continue;\n            if (alien.gun.canFire()) {\n                this.bullets.push(alien.fire(this.alienSet.getAlienPos(alien.gridPos)));\n            }\n        }\n    }\n    handleBulletsThatHitPlayer() {\n        const alienBullets = this.bullets.filter((bullet) => bullet.from === \"alien\");\n        alienBullets.forEach((b) => {\n            if (this.env.bulletTouchesObject(b, this.player.pos, DIMENSIONS.player)) {\n                this.player.lives--;\n                this.player.resetPos();\n                b.collide(this);\n            }\n        });\n    }\n    removeOutOfBoundsBullets() {\n        const necessaryBullets = [];\n        for (const bullet of this.bullets) {\n            if (!this.env.isBulletOutOfBounds(bullet)) {\n                necessaryBullets.push(bullet);\n            }\n        }\n        this.bullets = necessaryBullets;\n    }\n    handleAlienContactWithWall() {\n        for (const wall of this.env.walls) {\n            if (wall instanceof UnbreakableWall)\n                continue;\n            if (overlap(this.alienSet.pos, this.alienSet.size, wall.pos, wall.size)) {\n                for (const alien of this.alienSet) {\n                    if (!alien)\n                        continue;\n                    const alienPos = this.alienSet.getAlienPos(alien.gridPos);\n                    wall.collide(this, alienPos, DIMENSIONS.alien);\n                }\n            }\n        }\n    }\n    static start(plan) {\n        const alienSet = new AlienSet(plan);\n        const player = new Player();\n        const walls = [\n            new CustomBreakableWall({ x: 20, y: 70 }, { w: 20, h: 15 }, customWall1),\n            new CustomBreakableWall({ x: 60, y: 70 }, { w: 20, h: 15 }, customWall1),\n        ];\n        const env = new GameEnv(alienSet, player, walls);\n        return new GameState(alienSet, player, env);\n    }\n}\nconst alienColors = {\n    X: \"limegreen\",\n    Y: \"orange\",\n    Z: \"pink\",\n};\nclass CanvasDisplay {\n    constructor(state, controller, parent) {\n        this.state = state;\n        this.controller = controller;\n        this.parent = parent;\n        this.canvas = document.createElement(\"canvas\");\n        this.canvasContext = this.canvas.getContext(\"2d\");\n        this.canvas.style.display = \"block\";\n        this.canvas.style.marginInline = \"auto\";\n        this.parent.appendChild(this.canvas);\n        this.setDisplaySize();\n        this.defineEventListeners();\n        this.syncState(state, 0);\n    }\n    defineEventListeners() {\n        window.addEventListener(\"resize\", () => {\n            this.setDisplaySize();\n            this.syncState(this.state, 0);\n        });\n    }\n    get canvasWidth() {\n        return this.canvas.width;\n    }\n    get canvasHeight() {\n        return this.canvas.height;\n    }\n    horPixels(percentage) {\n        return (percentage / 100) * this.canvasWidth;\n    }\n    verPixels(percentage) {\n        return (percentage / 100) * this.canvasHeight;\n    }\n    getPixelPos(percentagePos) {\n        return {\n            x: this.horPixels(percentagePos.x),\n            y: this.verPixels(percentagePos.y),\n        };\n    }\n    getPixelSize(percentageSize) {\n        return {\n            w: this.horPixels(percentageSize.w),\n            h: this.verPixels(percentageSize.h),\n        };\n    }\n    setDisplaySize() {\n        const canvasWidth = Math.min(displayMaxWidth, getElementInnerDimensions(this.canvas.parentNode).w);\n        this.canvas.setAttribute(\"width\", canvasWidth.toString());\n        this.canvas.setAttribute(\"height\", (canvasWidth / displayAspectRatio).toString());\n    }\n    syncState(state, timeStep) {\n        this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);\n        this.canvasContext.fillStyle = \"black\";\n        this.canvasContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);\n        this.drawAlienSet(state.alienSet);\n        this.drawPlayer(state.player);\n        this.drawBullets(state.bullets);\n        this.drawWalls(state.env.walls);\n        this.drawMetadata(state, timeStep);\n    }\n    drawAlienSet(alienSet) {\n        for (const alien of alienSet) {\n            if (!alien)\n                continue;\n            const xPercentage = alienSet.pos.x +\n                alien.gridPos.x * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);\n            const yPercentage = alienSet.pos.y +\n                alien.gridPos.y * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);\n            this.drawAlien(alien, {\n                x: xPercentage,\n                y: yPercentage,\n            });\n        }\n        const { x, y } = this.getPixelPos(alienSet.pos);\n        const { w, h } = this.getPixelSize(alienSet.size);\n        this.canvasContext.fillStyle = \"rgba(255,255,255,0.4)\";\n        this.canvasContext.fillRect(x, y, w, h);\n    }\n    drawAlien(alien, pos) {\n        const { w, h } = this.getPixelSize(DIMENSIONS.alien);\n        const { x, y } = this.getPixelPos(pos);\n        this.canvasContext.fillStyle = alienColors[alien.alienType];\n        this.canvasContext.fillRect(x, y, w, h);\n    }\n    drawBullets(bullets) {\n        for (const bullet of bullets) {\n            this.drawBullet(bullet);\n        }\n    }\n    drawBullet(bullet) {\n        const { x, y } = this.getPixelPos(bullet.pos);\n        const { w, h } = this.getPixelSize(bullet.size);\n        this.canvasContext.fillStyle =\n            bullet.from === \"alien\" ? \"limegreen\" : \"white\";\n        this.canvasContext.fillRect(x, y, w, h);\n    }\n    drawPlayer(player) {\n        const { x, y } = this.getPixelPos(player.pos);\n        const { w, h } = this.getPixelSize(DIMENSIONS.player);\n        this.canvasContext.fillStyle = \"white\";\n        this.canvasContext.fillRect(x, y, w, h);\n        this.drawPlayerGunReloadVisualClue(player);\n    }\n    drawPlayerGunReloadVisualClue(player) {\n        const { gun, pos } = player;\n        const extraWidth = DIMENSIONS.player.w * 0.15;\n        const gap = DIMENSIONS.player.h * 0.1;\n        const clueHeight = 1, clueWidth = DIMENSIONS.player.w + extraWidth, cluePixelsHeight = this.verPixels(clueHeight), cluePixelsWidth = this.horPixels(clueWidth);\n        const x = pos.x - extraWidth / 2, y = pos.y + DIMENSIONS.player.h + gap, xPixels = this.horPixels(x), yPixels = this.verPixels(y);\n        const loadedPercentage = Math.min(1, gun.timeSinceLastShot / gun.fireInterval);\n        this.canvasContext.save();\n        this.canvasContext.translate(xPixels, yPixels);\n        this.canvasContext.fillStyle = \"#0f0\";\n        this.canvasContext.fillRect(0 - extraWidth / 2, 0, loadedPercentage * cluePixelsWidth, cluePixelsHeight);\n        this.canvasContext.fillStyle = \"#999\";\n        this.canvasContext.fillRect(loadedPercentage * cluePixelsWidth - extraWidth / 2, 0, cluePixelsWidth - loadedPercentage * cluePixelsWidth, cluePixelsHeight);\n        this.canvasContext.restore();\n    }\n    drawWalls(walls) {\n        for (const wall of walls) {\n            if (wall instanceof UnbreakableWall) {\n                this.drawUnbreakableWall(wall);\n            }\n            else {\n                this.drawWallWithPieces(wall);\n            }\n        }\n    }\n    drawUnbreakableWall(wall) {\n        const { x, y } = this.getPixelPos(wall.pos);\n        this.canvasContext.save();\n        this.canvasContext.translate(x, y);\n        const { w, h } = this.getPixelSize(wall.size);\n        this.canvasContext.fillStyle = \"#ffffff\";\n        this.canvasContext.fillRect(0, 0, w, h);\n        this.canvasContext.restore();\n    }\n    drawWallWithPieces(wall) {\n        const { x, y } = this.getPixelPos(wall.pos);\n        this.canvasContext.save();\n        this.canvasContext.translate(x, y);\n        const { w, h } = wall.pieceSize;\n        const pieceWPixels = this.horPixels(w), pieceHPixels = this.horPixels(h);\n        for (const { row, column, piece } of wall) {\n            if (piece) {\n                const xPixels = this.horPixels(column * w), yPixels = this.verPixels(row * h);\n                this.canvasContext.fillStyle = \"#ffffff\";\n                this.canvasContext.fillRect(xPixels, yPixels, pieceWPixels, pieceHPixels);\n            }\n        }\n        this.canvasContext.restore();\n    }\n    drawMetadata(state, timeStep) {\n        const fontSize = Math.min(30, this.verPixels(8));\n        const yPixelsPadding = this.verPixels(displayPadding.ver);\n        this.canvasContext.fillStyle = \"#fff\";\n        this.canvasContext.font = `${fontSize}px monospace`;\n        this.canvasContext.textAlign = \"start\";\n        this.canvasContext.fillText(`SCORE ${state.player.score}`, this.horPixels(displayPadding.hor), fontSize + yPixelsPadding);\n        this.canvasContext.textAlign = \"end\";\n        this.canvasContext.fillText(`Lives ${state.player.lives}`, this.horPixels(100 - displayPadding.hor), fontSize + yPixelsPadding);\n        const fps = Math.round(1 / timeStep);\n        this.canvasContext.textAlign = \"center\";\n        this.canvasContext.fillText(`${fps} FPS`, this.horPixels(50), fontSize + yPixelsPadding);\n    }\n    drawGameOverScreen() { }\n}\nclass GameController {\n}\nconst state = GameState.start(basicInvaderPlan);\nconst canvasDisplay = new CanvasDisplay(state, new GameController(), document.body);\nconst keys = trackKeys([moveRightActionKey, moveLeftActionKey, fireActionKey]);\nrunAnimation((timeStep) => {\n    state.update(timeStep, keys);\n    canvasDisplay.syncState(state, timeStep);\n    if (state.status === \"lost\") {\n        console.log(\"lost\");\n        return false;\n    }\n    else {\n        return true;\n    }\n});\n\n\n//# sourceURL=webpack://space-invaders/./src/index.ts?");

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