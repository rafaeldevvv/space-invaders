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

/***/ "./src/components/AlienSet/config.ts":
/*!*******************************************!*\
  !*** ./src/components/AlienSet/config.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.entranceSpeed = exports.baseYPos = exports.timeDecreaseFactor = exports.stepToEdgeAdjustment = void 0;\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nexports.stepToEdgeAdjustment = 1.33;\nexports.timeDecreaseFactor = 0.92;\nexports.baseYPos = game_config_1.LAYOUT.padding.ver + 12;\nexports.entranceSpeed = 30;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/AlienSet/config.ts?");

/***/ }),

/***/ "./src/components/AlienSet/index.ts":
/*!******************************************!*\
  !*** ./src/components/AlienSet/index.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst config_1 = __webpack_require__(/*! ../Alien/config */ \"./src/components/Alien/config.ts\");\nconst Alien_1 = __importDefault(__webpack_require__(/*! ../Alien */ \"./src/components/Alien/index.ts\"));\nconst enums_1 = __webpack_require__(/*! @/ts/enums */ \"./src/ts/enums.ts\");\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst config_2 = __webpack_require__(/*! ./config */ \"./src/components/AlienSet/config.ts\");\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/components/AlienSet/utils.ts\");\nclass AlienSet {\n    constructor(plan) {\n        this.yStep = 2;\n        this.timeToUpdate = 1;\n        this.direction = 1;\n        this.entering = true;\n        this.timeStepSum = 0;\n        if (!config_1.alienTypesRegExp.test(plan)) {\n            throw new Error(`Invalid character(s) in plan ${plan}. Consider using only valid characters (${config_1.alienTypes.join(\",\")})`);\n        }\n        const rows = plan\n            .trim()\n            .split(\"\\n\")\n            .map((l) => [...l]);\n        this.numColumns = rows[0].length;\n        this.numRows = rows.length;\n        this.alive = this.numColumns * this.numRows;\n        const w = this.numColumns * game_config_1.DIMENSIONS.alien.w +\n            (this.numColumns - 1) * game_config_1.DIMENSIONS.alienSetGap.w;\n        const h = this.numRows * game_config_1.DIMENSIONS.alien.h +\n            (this.numRows - 1) * game_config_1.DIMENSIONS.alienSetGap.h;\n        this.size = { w, h };\n        this.pos = new Vector_1.default(50 - w / 2, -h * 1.5);\n        this.xStep = (100 - game_config_1.LAYOUT.padding.hor * 2 - w) / 15;\n        this.aliens = rows.map((row, y) => {\n            return row.map((ch, x) => {\n                return Alien_1.default.create(ch, { x, y });\n            });\n        });\n    }\n    update(timeStep) {\n        if (this.entering) {\n            this.pos = this.pos.plus(new Vector_1.default(0, config_2.entranceSpeed * timeStep));\n            if (this.pos.y >= config_2.baseYPos) {\n                this.entering = false;\n                this.pos.y = config_2.baseYPos;\n            }\n            else\n                return;\n        }\n        this.timeStepSum += timeStep;\n        const movedY = this.moveVertically();\n        const movedX = this.moveHorizontally(movedY);\n        if (this.timeStepSum >= this.timeToUpdate) {\n            this.timeStepSum = 0;\n        }\n        if (movedY > 0) {\n            this.timeToUpdate *= config_2.timeDecreaseFactor;\n        }\n        if (movedY !== 0 || movedX !== 0) {\n            this.removeDeadAliens();\n        }\n        this.pos = this.pos.plus(new Vector_1.default(movedX, movedY));\n        for (const { alien } of this) {\n            if (alien instanceof Alien_1.default)\n                alien.gun.update(timeStep);\n        }\n    }\n    moveVertically() {\n        let movedY = 0;\n        if (this.pos.x + this.size.w >= 100 - game_config_1.LAYOUT.padding.hor &&\n            this.timeStepSum >= this.timeToUpdate &&\n            this.direction === enums_1.HorizontalDirection.Right) {\n            movedY = this.yStep;\n            this.direction = enums_1.HorizontalDirection.Left;\n        }\n        else if (this.pos.x <= game_config_1.LAYOUT.padding.hor &&\n            this.timeStepSum >= this.timeToUpdate &&\n            this.direction === enums_1.HorizontalDirection.Left) {\n            movedY = this.yStep;\n            this.direction = enums_1.HorizontalDirection.Right;\n        }\n        return movedY;\n    }\n    moveHorizontally(movedY) {\n        let movedX = 0;\n        if (this.timeStepSum >= this.timeToUpdate && movedY === 0) {\n            if (this.direction === enums_1.HorizontalDirection.Right) {\n                const rightDistance = 100 - this.pos.x - game_config_1.LAYOUT.padding.hor - this.size.w;\n                if (rightDistance < this.xStep * config_2.stepToEdgeAdjustment) {\n                    movedX = rightDistance;\n                }\n                else {\n                    movedX = this.xStep;\n                }\n            }\n            else {\n                const leftDistance = this.pos.x - game_config_1.LAYOUT.padding.hor;\n                if (leftDistance < this.xStep * config_2.stepToEdgeAdjustment) {\n                    movedX = leftDistance;\n                }\n                else {\n                    movedX = this.xStep;\n                }\n            }\n            movedX *= this.direction;\n        }\n        return movedX;\n    }\n    adapt() {\n        (0, utils_1.adaptPos)(this);\n        (0, utils_1.adaptSize)(this);\n        (0, utils_1.removeDeadRowsAndColumns)(this);\n    }\n    getAlienPos({ x, y }) {\n        return new Vector_1.default(this.pos.x + x * game_config_1.DIMENSIONS.alien.w + x * game_config_1.DIMENSIONS.alienSetGap.w, this.pos.y + y * game_config_1.DIMENSIONS.alien.h + y * game_config_1.DIMENSIONS.alienSetGap.h);\n    }\n    removeAlien(alien) {\n        this.aliens[alien.gridPos.y][alien.gridPos.x] = \"exploding\";\n        this.alive--;\n    }\n    removeDeadAliens() {\n        for (const { alien, row, column } of this) {\n            if (alien === \"exploding\") {\n                this.aliens[row][column] = null;\n            }\n        }\n    }\n    *[Symbol.iterator]() {\n        for (let y = 0; y < this.numRows; y++) {\n            for (let x = 0; x < this.numColumns; x++) {\n                yield { alien: this.aliens[y][x], column: x, row: y };\n            }\n        }\n    }\n}\nexports[\"default\"] = AlienSet;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/AlienSet/index.ts?");

/***/ }),

/***/ "./src/components/AlienSet/utils.ts":
/*!******************************************!*\
  !*** ./src/components/AlienSet/utils.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.isAlien = exports.adaptPos = exports.adaptSize = exports.syncNumOfColsAndRows = exports.syncAliensGridPos = exports.removeDeadRowsAndColumns = exports.getFirstOrLastRowIfDead = exports.getFirstOrLastColumnIfDead = exports.isRowDead = exports.isColumnDead = void 0;\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nfunction isColumnDead(rows, column) {\n    return rows.every((row) => row[column] === null || row[column] === \"exploding\");\n}\nexports.isColumnDead = isColumnDead;\nfunction isRowDead(row) {\n    return row.every((alien) => alien === null || alien === \"exploding\");\n}\nexports.isRowDead = isRowDead;\nfunction getFirstOrLastColumnIfDead(rows) {\n    const isFirstColumnDead = isColumnDead(rows, 0);\n    const isLastColumnDead = isColumnDead(rows, rows[0].length - 1);\n    if (isFirstColumnDead)\n        return 0;\n    if (isLastColumnDead)\n        return rows[0].length - 1;\n    else\n        return null;\n}\nexports.getFirstOrLastColumnIfDead = getFirstOrLastColumnIfDead;\nfunction getFirstOrLastRowIfDead(rows) {\n    const isFirstRowDead = isRowDead(rows[0]);\n    const isLastRowDead = isRowDead(rows[rows.length - 1]);\n    if (isFirstRowDead)\n        return 0;\n    if (isLastRowDead)\n        return rows.length - 1;\n    else\n        return null;\n}\nexports.getFirstOrLastRowIfDead = getFirstOrLastRowIfDead;\nfunction removeDeadRowsAndColumns(alienSet) {\n    let columnToRemove;\n    while ((columnToRemove = getFirstOrLastColumnIfDead(alienSet.aliens)) !== null) {\n        alienSet.aliens = alienSet.aliens.map((row) => {\n            return row.filter((_, x) => x !== columnToRemove);\n        });\n        syncAliensGridPos(alienSet);\n    }\n    let rowToRemove;\n    while (alienSet.aliens.length !== 0 &&\n        (rowToRemove = getFirstOrLastRowIfDead(alienSet.aliens)) !== null) {\n        alienSet.aliens = alienSet.aliens.filter((_, y) => y !== rowToRemove);\n        syncAliensGridPos(alienSet);\n    }\n    syncNumOfColsAndRows(alienSet);\n}\nexports.removeDeadRowsAndColumns = removeDeadRowsAndColumns;\nfunction syncAliensGridPos(alienSet) {\n    alienSet.aliens.forEach((row, y) => {\n        row.forEach((alien, x) => {\n            if (alien !== null && alien !== \"exploding\")\n                alien.gridPos = { x, y };\n        });\n    });\n}\nexports.syncAliensGridPos = syncAliensGridPos;\nfunction syncNumOfColsAndRows(alienSet) {\n    alienSet.numRows = alienSet.aliens.length;\n    alienSet.numColumns = alienSet.numRows === 0 ? 0 : alienSet.aliens[0].length;\n}\nexports.syncNumOfColsAndRows = syncNumOfColsAndRows;\nfunction adaptSize(alienSet) {\n    let firstLivingAlienRow = null, lastLivingAlienRow = null, firstLivingAlienColumn = null, lastLivingAlienColumn = null;\n    for (const { alien } of alienSet) {\n        if (alien === \"exploding\" || alien === null)\n            continue;\n        const { x: column, y: row } = alien.gridPos;\n        if (firstLivingAlienRow === null) {\n            firstLivingAlienRow = row;\n        }\n        lastLivingAlienRow = row;\n        if (firstLivingAlienColumn === null || column < firstLivingAlienColumn) {\n            firstLivingAlienColumn = column;\n        }\n        if (lastLivingAlienColumn === null || column > lastLivingAlienColumn) {\n            lastLivingAlienColumn = column;\n        }\n    }\n    if (firstLivingAlienRow !== null) {\n        const newH = (lastLivingAlienRow - firstLivingAlienRow + 1) * game_config_1.DIMENSIONS.alien.h +\n            (lastLivingAlienRow - firstLivingAlienRow) * game_config_1.DIMENSIONS.alienSetGap.h;\n        const newW = (lastLivingAlienColumn - firstLivingAlienColumn + 1) *\n            game_config_1.DIMENSIONS.alien.w +\n            (lastLivingAlienColumn - firstLivingAlienColumn) *\n                game_config_1.DIMENSIONS.alienSetGap.w;\n        alienSet.size = {\n            w: newW,\n            h: newH,\n        };\n    }\n}\nexports.adaptSize = adaptSize;\nfunction adaptPos(alienSet) {\n    let firstLivingAlienColumn = null;\n    let firstLivingAlienRow = null;\n    for (const { alien } of alienSet) {\n        if (!isAlien(alien))\n            continue;\n        const { x, y } = alien.gridPos;\n        if (firstLivingAlienColumn === null || x < firstLivingAlienColumn) {\n            firstLivingAlienColumn = x;\n        }\n        if (firstLivingAlienRow === null) {\n            firstLivingAlienRow = y;\n        }\n    }\n    if (firstLivingAlienColumn !== null && firstLivingAlienRow !== null) {\n        alienSet.pos = alienSet.getAlienPos({\n            x: firstLivingAlienColumn,\n            y: firstLivingAlienRow,\n        });\n    }\n}\nexports.adaptPos = adaptPos;\nfunction isAlien(alien) {\n    return alien !== null && alien !== \"exploding\";\n}\nexports.isAlien = isAlien;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/AlienSet/utils.ts?");

/***/ }),

/***/ "./src/components/Alien/config.ts":
/*!****************************************!*\
  !*** ./src/components/Alien/config.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.alienTypesConfig = exports.alienTypesRegExp = exports.alienTypes = void 0;\nexports.alienTypes = [\"X\", \"Y\", \"Z\"];\nexports.alienTypesRegExp = new RegExp(`(\\\\w*(${exports.alienTypes.join(\"|\")})*\\\\w*)+`);\nexports.alienTypesConfig = {\n    X: {\n        score: 10,\n        gunConfig: [40, { w: 0.5, h: 3 }, 20000],\n    },\n    Y: {\n        score: 20,\n        gunConfig: [60, { w: 1, h: 3 }, 30000],\n    },\n    Z: {\n        score: 30,\n        gunConfig: [80, { w: 1.5, h: 3 }, 40000],\n    },\n};\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Alien/config.ts?");

/***/ }),

/***/ "./src/components/Alien/index.ts":
/*!***************************************!*\
  !*** ./src/components/Alien/index.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/Alien/config.ts\");\nconst Gun_1 = __importDefault(__webpack_require__(/*! @/components/Gun */ \"./src/components/Gun/index.ts\"));\nclass Alien {\n    constructor(gridPos, score, gun, alienType) {\n        this.gridPos = gridPos;\n        this.score = score;\n        this.gun = gun;\n        this.alienType = alienType;\n        this.actorType = \"alien\";\n    }\n    fire(alienPos) {\n        const bulletX = alienPos.x + game_config_1.DIMENSIONS.alien.w / 2 - this.gun.bulletSize.w / 2;\n        return this.gun.fire(new Vector_1.default(bulletX, alienPos.y), \"down\");\n    }\n    static create(ch, gridPos) {\n        if (ch === \".\") {\n            return null;\n        }\n        else {\n            const { score, gunConfig } = config_1.alienTypesConfig[ch];\n            return new Alien(gridPos, score, new Gun_1.default(\"alien\", ...gunConfig), ch);\n        }\n    }\n}\nexports[\"default\"] = Alien;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Alien/index.ts?");

/***/ }),

/***/ "./src/components/Boss/config.ts":
/*!***************************************!*\
  !*** ./src/components/Boss/config.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.score = exports.baseAppearanceInterval = exports.speedX = exports.bossExplodingTime = void 0;\nexports.bossExplodingTime = 1;\nexports.speedX = 13;\nexports.baseAppearanceInterval = 25;\nexports.score = 200;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Boss/config.ts?");

/***/ }),

/***/ "./src/components/Boss/index.ts":
/*!**************************************!*\
  !*** ./src/components/Boss/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst enums_1 = __webpack_require__(/*! @/ts/enums */ \"./src/ts/enums.ts\");\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/Boss/config.ts\");\nclass Boss {\n    constructor() {\n        this.timeSinceDeath = 0;\n        this.status = \"alive\";\n        this.direction = Math.random() > 0.5 ? enums_1.HorizontalDirection.Right : enums_1.HorizontalDirection.Left;\n        if (this.direction === enums_1.HorizontalDirection.Left) {\n            this.pos = new Vector_1.default(100, game_config_1.LAYOUT.bossYPos);\n        }\n        else {\n            this.pos = new Vector_1.default(-game_config_1.DIMENSIONS.boss.w, game_config_1.LAYOUT.bossYPos);\n        }\n    }\n    update(timeStep) {\n        if (this.status === \"exploding\") {\n            this.timeSinceDeath += timeStep;\n            if (this.timeSinceDeath >= config_1.bossExplodingTime) {\n                this.status = \"dead\";\n            }\n            return;\n        }\n        this.pos = this.pos.plus(new Vector_1.default(this.direction * config_1.speedX * timeStep, 0));\n    }\n    isOutOfBounds() {\n        if (this.direction === enums_1.HorizontalDirection.Right) {\n            return this.pos.x >= 100;\n        }\n        else {\n            return this.pos.x <= -game_config_1.DIMENSIONS.boss.w;\n        }\n    }\n}\nexports[\"default\"] = Boss;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Boss/index.ts?");

/***/ }),

/***/ "./src/components/Bullet/index.ts":
/*!****************************************!*\
  !*** ./src/components/Bullet/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nclass Bullet {\n    constructor(from, pos, speed, size) {\n        this.from = from;\n        this.pos = pos;\n        this.speed = speed;\n        this.size = size;\n    }\n    update(timeStep) {\n        this.pos = this.pos.plus(this.speed.times(timeStep));\n    }\n    isOutOfBounds() {\n        return (this.pos.x > 100 ||\n            this.pos.x < -this.size.w ||\n            this.pos.y >= game_config_1.LAYOUT.floorYPos ||\n            this.pos.y < -this.size.h);\n    }\n}\nexports[\"default\"] = Bullet;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Bullet/index.ts?");

/***/ }),

/***/ "./src/components/Environment/index.ts":
/*!*********************************************!*\
  !*** ./src/components/Environment/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Alien_1 = __importDefault(__webpack_require__(/*! ../Alien */ \"./src/components/Alien/index.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst overlap_1 = __importDefault(__webpack_require__(/*! @/utils/common/overlap */ \"./src/utils/common/overlap.ts\"));\nclass GameEnv {\n    constructor(alienSet, player, walls) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.walls = walls;\n    }\n    alienSetTouchesPlayer() {\n        return this.alienSet.pos.y + this.alienSet.size.h >= this.player.pos.y;\n    }\n    bulletTouchesObject(bullet, objPos, objSize) {\n        return (0, overlap_1.default)(bullet.pos, bullet.size, objPos, objSize);\n    }\n    handleAlienSetContactWithWall() {\n        for (const wall of this.walls) {\n            for (const { alien } of this.alienSet) {\n                if (!(alien instanceof Alien_1.default))\n                    continue;\n                const alienPos = this.alienSet.getAlienPos(alien.gridPos);\n                wall.collide(alienPos, game_config_1.DIMENSIONS.alien);\n            }\n        }\n        return false;\n    }\n}\nexports[\"default\"] = GameEnv;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Environment/index.ts?");

/***/ }),

/***/ "./src/components/Gun/index.ts":
/*!*************************************!*\
  !*** ./src/components/Gun/index.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst Bullet_1 = __importDefault(__webpack_require__(/*! ../Bullet */ \"./src/components/Bullet/index.ts\"));\nconst randomNumberInFactorRange_1 = __importDefault(__webpack_require__(/*! @/utils/common/randomNumberInFactorRange */ \"./src/utils/common/randomNumberInFactorRange.ts\"));\nconst randomNum_1 = __importDefault(__webpack_require__(/*! @/utils/common/randomNum */ \"./src/utils/common/randomNum.ts\"));\nclass Gun {\n    constructor(owner, bulletSpeed, bulletSize, baseFireInterval) {\n        this.owner = owner;\n        this.bulletSpeed = bulletSpeed;\n        this.bulletSize = bulletSize;\n        this.baseFireInterval = baseFireInterval;\n        this.timeSinceLastShot = 0;\n        this.fireInterval =\n            this.baseFireInterval === 0\n                ? 0\n                : (0, randomNumberInFactorRange_1.default)(baseFireInterval, 0.2);\n        this.timeSinceLastShot =\n            this.baseFireInterval === 0 ? 0 : (0, randomNum_1.default)(0, this.fireInterval);\n    }\n    fire(pos, direction) {\n        const bullet = new Bullet_1.default(this.owner, pos, new Vector_1.default(0, direction === \"up\" ? -this.bulletSpeed : this.bulletSpeed), this.bulletSize);\n        if (this.baseFireInterval === 0) {\n            return bullet;\n        }\n        if (this.canFire()) {\n            this.timeSinceLastShot = 0;\n            this.fireInterval = (0, randomNumberInFactorRange_1.default)(this.baseFireInterval, 0.2);\n            return bullet;\n        }\n        return null;\n    }\n    update(timeStep) {\n        if (this.baseFireInterval === 0)\n            return;\n        this.timeSinceLastShot += timeStep * 1000;\n    }\n    canFire() {\n        if (this.baseFireInterval === 0)\n            return true;\n        return this.timeSinceLastShot >= this.fireInterval;\n    }\n}\nexports[\"default\"] = Gun;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Gun/index.ts?");

/***/ }),

/***/ "./src/components/Player/config.ts":
/*!*****************************************!*\
  !*** ./src/components/Player/config.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.revivingTime = exports.explodingTime = exports.xSpeed = void 0;\nexports.xSpeed = 30, exports.explodingTime = 1, exports.revivingTime = 3;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Player/config.ts?");

/***/ }),

/***/ "./src/components/Player/index.ts":
/*!****************************************!*\
  !*** ./src/components/Player/index.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Gun_1 = __importDefault(__webpack_require__(/*! ../Gun */ \"./src/components/Gun/index.ts\"));\nconst Vector_1 = __importDefault(__webpack_require__(/*! @/utils/common/Vector */ \"./src/utils/common/Vector.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/Player/config.ts\");\nclass Player {\n    constructor() {\n        this.actorType = \"player\";\n        this.baseXPos = 50 - game_config_1.DIMENSIONS.player.w / 2;\n        this.pos = new Vector_1.default(this.baseXPos, game_config_1.LAYOUT.playerYPos);\n        this.gun = new Gun_1.default(\"player\", 70, { w: 0.5, h: 3 }, 0);\n        this.lives = 3;\n        this.score = 0;\n        this.status = \"alive\";\n        this.timeSinceExplosion = 0;\n        this.timeSinceResurrection = 0;\n    }\n    fire() {\n        const bulletPosX = this.pos.x + game_config_1.DIMENSIONS.player.w / 2 - this.gun.bulletSize.w / 2;\n        return this.gun.fire(new Vector_1.default(bulletPosX, this.pos.y), \"up\");\n    }\n    resetPos() {\n        this.pos = new Vector_1.default(this.baseXPos, game_config_1.LAYOUT.playerYPos);\n    }\n    update(state, timeStep, keys) {\n        const movedX = new Vector_1.default(timeStep * config_1.xSpeed, 0);\n        this.handleStatus(timeStep);\n        if (this.status !== \"exploding\") {\n            if (keys[game_config_1.ACTION_KEYS.moveLeft] && this.pos.x > game_config_1.LAYOUT.padding.hor) {\n                this.pos = this.pos.minus(movedX);\n            }\n            else if (keys[game_config_1.ACTION_KEYS.moveRight] &&\n                this.pos.x + game_config_1.DIMENSIONS.player.w < 100 - game_config_1.LAYOUT.padding.hor) {\n                this.pos = this.pos.plus(movedX);\n            }\n            if (keys[game_config_1.ACTION_KEYS.fire] &&\n                !state.isPlayerBulletPresent &&\n                !state.alienSet.entering) {\n                state.bullets.push(this.fire());\n                state.isPlayerBulletPresent = true;\n            }\n        }\n    }\n    handleStatus(timeStep) {\n        if (this.status === \"exploding\") {\n            this.timeSinceExplosion += timeStep;\n        }\n        if (this.status === \"reviving\") {\n            this.timeSinceResurrection += timeStep;\n        }\n        if (this.timeSinceExplosion >= config_1.explodingTime) {\n            this.status = \"reviving\";\n            this.timeSinceExplosion = 0;\n            this.resetPos();\n        }\n        if (this.timeSinceResurrection >= config_1.revivingTime) {\n            this.status = \"alive\";\n            this.timeSinceResurrection = 0;\n        }\n    }\n}\nexports[\"default\"] = Player;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Player/index.ts?");

/***/ }),

/***/ "./src/components/Presenter/index.ts":
/*!*******************************************!*\
  !*** ./src/components/Presenter/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst alien_set_1 = __importDefault(__webpack_require__(/*! @/plans/alien-set */ \"./src/plans/alien-set.ts\"));\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/components/Presenter/utils.ts\");\nclass GamePresenter {\n    constructor(State, View, parent) {\n        this.State = State;\n        this.state = State.start(alien_set_1.default);\n        this.view = new View(this.state, parent);\n        this.view.syncState(this.state, 0);\n        this.runGame();\n        this.addEventHandlers();\n    }\n    addEventHandlers() {\n        this.view.addKeyHandler(game_config_1.ACTION_KEYS.pauseGame, this.handlePause.bind(this));\n        this.view.addKeyHandler(game_config_1.ACTION_KEYS.startGame, this.handleStartGame.bind(this));\n        this.view.addKeyHandler(game_config_1.ACTION_KEYS.restartGame, this.handleRestartGame.bind(this));\n    }\n    handlePause(e) {\n        e.preventDefault();\n        if (this.state.status !== \"running\" && this.state.status !== \"paused\") {\n            return;\n        }\n        if (this.state.status === \"paused\") {\n            this.state.status = \"running\";\n            this.runGame();\n        }\n        else {\n            this.state.status = \"paused\";\n        }\n    }\n    handleStartGame(e) {\n        e.preventDefault();\n        if (this.state.status === \"start\") {\n            this.state.status = \"running\";\n        }\n    }\n    handleRestartGame(e) {\n        e.preventDefault();\n        if (this.state.status === \"lost\") {\n            this.state = this.State.start(alien_set_1.default);\n            this.state.status = \"running\";\n        }\n    }\n    runGame() {\n        (0, utils_1.runAnimation)((timeStep) => this.frame(timeStep));\n    }\n    frame(timeStep) {\n        if (this.state.status === \"paused\") {\n            this.view.syncState(this.state, timeStep);\n            return false;\n        }\n        this.state.update(timeStep, this.view.trackedKeys);\n        this.view.syncState(this.state, timeStep);\n        return true;\n    }\n}\nexports[\"default\"] = GamePresenter;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Presenter/index.ts?");

/***/ }),

/***/ "./src/components/Presenter/utils.ts":
/*!*******************************************!*\
  !*** ./src/components/Presenter/utils.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.runAnimation = void 0;\nfunction runAnimation(callback) {\n    let lastTime = null;\n    function frame(time) {\n        let shouldContinue;\n        if (lastTime) {\n            const timeStep = Math.min(time - lastTime, 100) / 1000;\n            lastTime = time;\n            shouldContinue = callback(timeStep);\n        }\n        else {\n            lastTime = time;\n            shouldContinue = true;\n        }\n        if (shouldContinue)\n            requestAnimationFrame(frame);\n    }\n    requestAnimationFrame(frame);\n}\nexports.runAnimation = runAnimation;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Presenter/utils.ts?");

/***/ }),

/***/ "./src/components/State/index.ts":
/*!***************************************!*\
  !*** ./src/components/State/index.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    var desc = Object.getOwnPropertyDescriptor(m, k);\n    if (!desc || (\"get\" in desc ? !m.__esModule : desc.writable || desc.configurable)) {\n      desc = { enumerable: true, get: function() { return m[k]; } };\n    }\n    Object.defineProperty(o, k2, desc);\n}) : (function(o, m, k, k2) {\n    if (k2 === undefined) k2 = k;\n    o[k2] = m[k];\n}));\nvar __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {\n    Object.defineProperty(o, \"default\", { enumerable: true, value: v });\n}) : function(o, v) {\n    o[\"default\"] = v;\n});\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (k !== \"default\" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);\n    __setModuleDefault(result, mod);\n    return result;\n};\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Boss_1 = __importDefault(__webpack_require__(/*! ../Boss */ \"./src/components/Boss/index.ts\"));\nconst Wall_1 = __importDefault(__webpack_require__(/*! ../Wall */ \"./src/components/Wall/index.ts\"));\nconst Player_1 = __importDefault(__webpack_require__(/*! ../Player */ \"./src/components/Player/index.ts\"));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst randomNum_1 = __importDefault(__webpack_require__(/*! @/utils/common/randomNum */ \"./src/utils/common/randomNum.ts\"));\nconst AlienSet_1 = __importDefault(__webpack_require__(/*! ../AlienSet */ \"./src/components/AlienSet/index.ts\"));\nconst Alien_1 = __importDefault(__webpack_require__(/*! ../Alien */ \"./src/components/Alien/index.ts\"));\nconst Environment_1 = __importDefault(__webpack_require__(/*! ../Environment */ \"./src/components/Environment/index.ts\"));\nconst walls_1 = __importDefault(__webpack_require__(/*! @/plans/walls */ \"./src/plans/walls.ts\"));\nconst BOSS_CONFIG = __importStar(__webpack_require__(/*! ../Boss/config */ \"./src/components/Boss/config.ts\"));\nconst alien_set_1 = __importDefault(__webpack_require__(/*! @/plans/alien-set */ \"./src/plans/alien-set.ts\"));\nfunction generateRandomBossAppearanceInterval() {\n    return (0, randomNum_1.default)(0.8 * BOSS_CONFIG.baseAppearanceInterval, 1.2 * BOSS_CONFIG.baseAppearanceInterval);\n}\nclass GameState {\n    constructor(alienSet, player, env) {\n        this.alienSet = alienSet;\n        this.player = player;\n        this.env = env;\n        this.bullets = [];\n        this.status = \"start\";\n        this.boss = null;\n        this.bossesKilled = 0;\n        this.aliensKilled = 0;\n        this.isPlayerBulletPresent = false;\n        this.timeSinceBossLastAppearance = 0;\n        this.bossAppearanceInterval = generateRandomBossAppearanceInterval();\n    }\n    update(timeStep, keys) {\n        if (this.status !== \"running\")\n            return;\n        this.player.update(this, timeStep, keys);\n        if (this.player.status === \"exploding\")\n            return;\n        this.alienSet.update(timeStep);\n        if (this.alienSet.entering) {\n            return;\n        }\n        this.fireAliens();\n        this.handleBullets(timeStep);\n        this.handleBoss(timeStep);\n        this.env.handleAlienSetContactWithWall();\n        if (this.alienSet.alive === 0) {\n            this.alienSet = new AlienSet_1.default(alien_set_1.default);\n            this.bullets = [];\n            this.env.alienSet = this.alienSet;\n            this.player.lives++;\n        }\n        else if (this.player.lives < 1 || this.env.alienSetTouchesPlayer()) {\n            this.status = \"lost\";\n        }\n    }\n    handleBullets(timeStep) {\n        this.bullets.forEach((bullet) => bullet.update(timeStep));\n        const newBullets = [];\n        let isSomeAlienKilled = false;\n        for (const b of this.bullets) {\n            const outOfBounds = b.isOutOfBounds();\n            if (outOfBounds) {\n                if (b.from === \"player\")\n                    this.isPlayerBulletPresent = false;\n                continue;\n            }\n            if (b.from === \"alien\") {\n                const touchedPlayer = this.handleBulletContactWithPlayer(b);\n                if (touchedPlayer)\n                    continue;\n            }\n            else {\n                const touchedAlien = this.handleBulletContactWithAlien(b);\n                const touchedBoss = this.handleBulletContactWithBoss(b);\n                if (!isSomeAlienKilled)\n                    isSomeAlienKilled = touchedAlien;\n                if (touchedAlien || touchedBoss) {\n                    this.isPlayerBulletPresent = false;\n                    continue;\n                }\n            }\n            const touchedWall = this.handleBulletContactWithWalls(b);\n            if (touchedWall) {\n                if (b.from === \"player\")\n                    this.isPlayerBulletPresent = false;\n                continue;\n            }\n            newBullets.push(b);\n        }\n        if (isSomeAlienKilled)\n            this.alienSet.adapt();\n        this.bullets = newBullets;\n    }\n    handleBulletContactWithPlayer(b) {\n        if (this.player.status === \"alive\" &&\n            this.env.bulletTouchesObject(b, this.player.pos, game_config_1.DIMENSIONS.player)) {\n            this.player.lives--;\n            this.player.status = \"exploding\";\n            return true;\n        }\n        return false;\n    }\n    handleBulletContactWithAlien(b) {\n        for (const { alien } of this.alienSet) {\n            if (!(alien instanceof Alien_1.default))\n                continue;\n            const alienPos = this.alienSet.getAlienPos(alien.gridPos);\n            if (this.env.bulletTouchesObject(b, alienPos, game_config_1.DIMENSIONS.alien)) {\n                this.player.score += alien.score;\n                this.aliensKilled++;\n                this.alienSet.removeAlien(alien);\n                return true;\n            }\n        }\n        return false;\n    }\n    handleBulletContactWithWalls(b) {\n        let touchedPiece = false;\n        for (const wall of this.env.walls) {\n            touchedPiece = wall.collide(b.pos, b.size);\n            if (touchedPiece)\n                break;\n        }\n        return touchedPiece;\n    }\n    handleBulletContactWithBoss(b) {\n        if (this.boss === null || this.boss.status !== \"alive\")\n            return false;\n        if (this.env.bulletTouchesObject(b, this.boss.pos, game_config_1.DIMENSIONS.boss)) {\n            this.player.score += BOSS_CONFIG.score;\n            this.boss.status = \"exploding\";\n            this.bossesKilled++;\n            this.bossAppearanceInterval = generateRandomBossAppearanceInterval();\n            return true;\n        }\n    }\n    fireAliens() {\n        const newBullets = [];\n        for (const { alien } of this.alienSet) {\n            if (!(alien instanceof Alien_1.default))\n                continue;\n            if (alien.gun.canFire()) {\n                const alienPos = this.alienSet.getAlienPos(alien.gridPos);\n                const b = alien.fire(alienPos);\n                newBullets.push(b);\n            }\n        }\n        this.bullets.push(...newBullets);\n    }\n    handleBoss(timeStep) {\n        if (this.boss !== null)\n            this.boss.update(timeStep);\n        else\n            this.timeSinceBossLastAppearance += timeStep;\n        if (this.timeSinceBossLastAppearance >= this.bossAppearanceInterval) {\n            this.boss = new Boss_1.default();\n            this.timeSinceBossLastAppearance = 0;\n            this.bossAppearanceInterval = generateRandomBossAppearanceInterval();\n        }\n        if (this.boss &&\n            (this.boss.isOutOfBounds() || this.boss.status === \"dead\")) {\n            this.boss = null;\n        }\n    }\n    static start(plan) {\n        const alienSet = new AlienSet_1.default(plan);\n        const player = new Player_1.default();\n        const gap = (100 - game_config_1.LAYOUT.wallsSize.w * game_config_1.LAYOUT.numWalls) / 5;\n        const walls = new Array(game_config_1.LAYOUT.numWalls)\n            .fill(undefined)\n            .map((_, i) => {\n            return new Wall_1.default({ x: (i + 1) * gap + game_config_1.LAYOUT.wallsSize.w * i, y: game_config_1.LAYOUT.wallYPos }, game_config_1.LAYOUT.wallsSize, walls_1.default);\n        });\n        const env = new Environment_1.default(alienSet, player, walls);\n        return new GameState(alienSet, player, env);\n    }\n}\nexports[\"default\"] = GameState;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/State/index.ts?");

/***/ }),

/***/ "./src/components/View/config.ts":
/*!***************************************!*\
  !*** ./src/components/View/config.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.colors = exports.GAME_DISPLAY = exports.GAMEOVER_SCREEN_LAYOUT = exports.INITIAL_SCREEN_LAYOUT = void 0;\nexports.INITIAL_SCREEN_LAYOUT = {\n    titleYPos: 30,\n    pressMessageYPos: 75,\n};\nexports.GAMEOVER_SCREEN_LAYOUT = {\n    titleYPos: 16,\n    pressMessageYPos: 75,\n};\nexports.GAME_DISPLAY = {\n    maxWidth: 920,\n    aspectRatio: 4 / 3,\n};\nexports.colors = {\n    X: \"limegreen\",\n    Y: \"orange\",\n    Z: \"pink\",\n    boss: \"#f77\",\n};\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/config.ts?");

/***/ }),

/***/ "./src/components/View/index.ts":
/*!**************************************!*\
  !*** ./src/components/View/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst utils_1 = __webpack_require__(/*! ./utils */ \"./src/components/View/utils.ts\");\nconst config_1 = __webpack_require__(/*! ./config */ \"./src/components/View/config.ts\");\nconst InitialScreen_1 = __importDefault(__webpack_require__(/*! ./screens/InitialScreen */ \"./src/components/View/screens/InitialScreen.ts\"));\nconst GameOver_1 = __importDefault(__webpack_require__(/*! ./screens/GameOver */ \"./src/components/View/screens/GameOver.ts\"));\nconst RunningGame_1 = __importDefault(__webpack_require__(/*! ./screens/RunningGame */ \"./src/components/View/screens/RunningGame.ts\"));\nclass CanvasView {\n    constructor(state, parent) {\n        this.state = state;\n        this.trackedKeys = {};\n        this.keysHandlers = new Map();\n        this.canvas = document.createElement(\"canvas\");\n        this.canvas.style.display = \"block\";\n        this.canvas.style.marginInline = \"auto\";\n        parent.appendChild(this.canvas);\n        this.initialScreen = new InitialScreen_1.default(this.canvas);\n        this.runningGameScreen = new RunningGame_1.default(this.canvas);\n        this.gameOverScreen = new GameOver_1.default(this.canvas);\n        this.defineEventListeners();\n        this.adaptDisplaySize();\n        this.syncState(state, 0);\n    }\n    adaptDisplaySize() {\n        let canvasWidth = Math.min(config_1.GAME_DISPLAY.maxWidth, (0, utils_1.getElementInnerDimensions)(this.canvas.parentNode).w);\n        let canvasHeight = canvasWidth / config_1.GAME_DISPLAY.aspectRatio;\n        if (canvasHeight > innerHeight) {\n            canvasHeight = innerHeight;\n            canvasWidth = canvasHeight * config_1.GAME_DISPLAY.aspectRatio;\n        }\n        this.canvas.setAttribute(\"width\", canvasWidth.toString());\n        this.canvas.setAttribute(\"height\", canvasHeight.toString());\n        this.syncState(this.state, 1 / 60);\n    }\n    syncState(state, timeStep) {\n        switch (state.status) {\n            case \"paused\":\n            case \"running\": {\n                this.runningGameScreen.syncState(state, timeStep);\n                break;\n            }\n            case \"start\": {\n                this.initialScreen.syncState();\n                break;\n            }\n            case \"lost\": {\n                this.gameOverScreen.syncState(state);\n                break;\n            }\n            default: {\n                const _never = state.status;\n                throw new Error(\"Unexpected state status\", _never);\n            }\n        }\n    }\n    addKeyHandler(key, handler) {\n        if (this.keysHandlers.has(key)) {\n            const handlers = this.keysHandlers.get(key);\n            this.keysHandlers.set(key, [...handlers, handler]);\n        }\n        else {\n            this.keysHandlers.set(key, [handler]);\n        }\n    }\n    defineEventListeners() {\n        window.addEventListener(\"resize\", () => this.adaptDisplaySize());\n        window.addEventListener(\"keydown\", (e) => {\n            if (this.keysHandlers.has(e.key)) {\n                const handlers = this.keysHandlers.get(e.key);\n                handlers.forEach((h) => h(e));\n            }\n        });\n        this.trackedKeys = (0, utils_1.trackKeys)([\n            game_config_1.ACTION_KEYS.moveLeft,\n            game_config_1.ACTION_KEYS.moveRight,\n            game_config_1.ACTION_KEYS.fire,\n        ]);\n    }\n}\nexports[\"default\"] = CanvasView;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/index.ts?");

/***/ }),

/***/ "./src/components/View/screens/BaseCanvasWrapper.ts":
/*!**********************************************************!*\
  !*** ./src/components/View/screens/BaseCanvasWrapper.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.fontSizes = exports.colors = void 0;\nexports.colors = {\n    X: \"limegreen\",\n    Y: \"orange\",\n    Z: \"pink\",\n    boss: \"#f77\",\n};\nexports.fontSizes = {\n    sm: 2.5,\n    md: 4,\n    lg: 6,\n    xl: 10,\n};\nclass BaseCanvasWrapper {\n    constructor(canvas) {\n        this.canvas = canvas;\n        this.fontFamily = \"monospace\";\n        this.ctx = canvas.getContext(\"2d\");\n    }\n    get canvasWidth() {\n        return this.canvas.width;\n    }\n    get canvasHeight() {\n        return this.canvas.height;\n    }\n    horPixels(percentage) {\n        return (percentage / 100) * this.canvasWidth;\n    }\n    verPixels(percentage) {\n        return (percentage / 100) * this.canvasHeight;\n    }\n    getPixelPos(percentagePos) {\n        return {\n            x: this.horPixels(percentagePos.x),\n            y: this.verPixels(percentagePos.y),\n        };\n    }\n    getPixelSize(percentageSize) {\n        return {\n            w: this.horPixels(percentageSize.w),\n            h: this.verPixels(percentageSize.h),\n        };\n    }\n    getFontSize(size) {\n        return this.horPixels(exports.fontSizes[size]);\n    }\n    clear() {\n        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);\n        this.ctx.fillStyle = \"#000\";\n        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);\n    }\n}\nexports[\"default\"] = BaseCanvasWrapper;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/BaseCanvasWrapper.ts?");

/***/ }),

/***/ "./src/components/View/screens/GameOver.ts":
/*!*************************************************!*\
  !*** ./src/components/View/screens/GameOver.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/components/View/utils.ts\");\nconst BaseCanvasWrapper_1 = __importDefault(__webpack_require__(/*! ./BaseCanvasWrapper */ \"./src/components/View/screens/BaseCanvasWrapper.ts\"));\nconst config_1 = __webpack_require__(/*! ../config */ \"./src/components/View/config.ts\");\nclass GameOver extends BaseCanvasWrapper_1.default {\n    syncState(state) {\n        this.clear();\n        this.drawTitle();\n        this.drawStateData(state);\n        const messagePos = this.getPixelPos({\n            y: config_1.GAMEOVER_SCREEN_LAYOUT.pressMessageYPos,\n            x: 50,\n        });\n        (0, utils_1.drawTwinkleMessage)(this.ctx, \"Press space to play again\", messagePos, {\n            fontSize: this.getFontSize(\"md\"),\n            fontFamily: this.fontFamily,\n        });\n    }\n    drawTitle() {\n        const titleFontSize = this.getFontSize(\"xl\");\n        const xPixelPos = this.horPixels(50), yPixelPos = this.verPixels(16);\n        this.ctx.font = `${titleFontSize}px ${this.fontFamily}`;\n        this.ctx.fillStyle = \"#f77\";\n        this.ctx.textAlign = \"center\";\n        this.ctx.textBaseline = \"top\";\n        this.ctx.fillText(\"GAME\", xPixelPos, yPixelPos);\n        this.ctx.fillText(\"OVER\", xPixelPos, this.verPixels(27));\n    }\n    drawStateData(state) {\n        const { bossesKilled, aliensKilled, player: { score }, } = state;\n        const subtitleFontSize = this.getFontSize(\"md\");\n        this.ctx.font = `${subtitleFontSize}px ${this.fontFamily}`;\n        this.ctx.fillStyle = \"#fff\";\n        const aliens = aliensKilled === 1 ? \"alien\" : \"aliens\";\n        const bosses = bossesKilled === 1 ? \"boss\" : \"bosses\";\n        this.ctx.fillText(`You killed ${aliensKilled} ${aliens} and ${bossesKilled} ${bosses}`, this.horPixels(50), this.verPixels(50));\n        this.ctx.fillText(`Your score is ${score}`, this.horPixels(50), this.verPixels(57));\n    }\n}\nexports[\"default\"] = GameOver;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/GameOver.ts?");

/***/ }),

/***/ "./src/components/View/screens/InitialScreen.ts":
/*!******************************************************!*\
  !*** ./src/components/View/screens/InitialScreen.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst config_1 = __webpack_require__(/*! ../config */ \"./src/components/View/config.ts\");\nconst utils_1 = __webpack_require__(/*! ../utils */ \"./src/components/View/utils.ts\");\nconst BaseCanvasWrapper_1 = __importDefault(__webpack_require__(/*! ./BaseCanvasWrapper */ \"./src/components/View/screens/BaseCanvasWrapper.ts\"));\nclass InitialScreen extends BaseCanvasWrapper_1.default {\n    syncState() {\n        this.clear();\n        this.drawTitle();\n        const messagePos = this.getPixelPos({\n            y: config_1.INITIAL_SCREEN_LAYOUT.pressMessageYPos,\n            x: 50,\n        });\n        (0, utils_1.drawTwinkleMessage)(this.ctx, \"Press space to start\", messagePos, {\n            fontSize: this.getFontSize(\"md\"),\n            fontFamily: this.fontFamily,\n        });\n    }\n    drawTitle() {\n        const fontSize = this.getFontSize(\"xl\");\n        this.ctx.font = `${fontSize}px ${this.fontFamily}`;\n        const xPixelPos = this.horPixels(50), yPixelPos = this.verPixels(30);\n        this.ctx.fillStyle = \"white\";\n        this.ctx.textAlign = \"center\";\n        this.ctx.fillText(\"SPACE\", xPixelPos, yPixelPos);\n        this.ctx.fillText(\"INVADERS\", xPixelPos, yPixelPos + fontSize);\n    }\n}\nexports[\"default\"] = InitialScreen;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/InitialScreen.ts?");

/***/ }),

/***/ "./src/components/View/screens/RunningGame.ts":
/*!****************************************************!*\
  !*** ./src/components/View/screens/RunningGame.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst game_config_1 = __webpack_require__(/*! @/game-config */ \"./src/game-config.ts\");\nconst BaseCanvasWrapper_1 = __importDefault(__webpack_require__(/*! ./BaseCanvasWrapper */ \"./src/components/View/screens/BaseCanvasWrapper.ts\"));\nconst config_1 = __webpack_require__(/*! ../config */ \"./src/components/View/config.ts\");\nconst explosions_1 = __importDefault(__webpack_require__(/*! @/plans/explosions */ \"./src/plans/explosions.ts\"));\nconst IterablePieces_1 = __importDefault(__webpack_require__(/*! @/utils/common/IterablePieces */ \"./src/utils/common/IterablePieces.ts\"));\nconst explosion = new IterablePieces_1.default(explosions_1.default);\nclass RunningGame extends BaseCanvasWrapper_1.default {\n    syncState(state, timeStep) {\n        this.clear();\n        this.drawFloor();\n        this.drawPlayer(state.player);\n        this.drawAlienSet(state.alienSet);\n        this.drawBullets(state.bullets);\n        this.drawWalls(state.env.walls);\n        this.drawMetadata(state, timeStep);\n        this.drawPressEscMessage();\n        if (state.boss !== null)\n            this.drawBoss(state.boss);\n        if (state.status === \"paused\")\n            this.drawPauseHint();\n    }\n    drawFloor() {\n        const floorWidth = 100 - game_config_1.LAYOUT.padding.hor * 2, w = this.horPixels(floorWidth), h = this.verPixels(game_config_1.DIMENSIONS.floorHeight);\n        const x = this.horPixels(game_config_1.LAYOUT.padding.hor), y = this.verPixels(100 - game_config_1.DIMENSIONS.floorHeight - 1.5);\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.fillRect(x, y, w, h);\n    }\n    drawAlienSet(alienSet) {\n        for (const { alien, row, column } of alienSet) {\n            if (alien === null)\n                continue;\n            const xPercentage = alienSet.pos.x +\n                column * (game_config_1.DIMENSIONS.alienSetGap.w + game_config_1.DIMENSIONS.alien.w);\n            const yPercentage = alienSet.pos.y + row * (game_config_1.DIMENSIONS.alienSetGap.h + game_config_1.DIMENSIONS.alien.h);\n            const alienPos = {\n                x: xPercentage,\n                y: yPercentage,\n            };\n            if (alien !== \"exploding\") {\n                this.drawAlien(alien, alienPos);\n            }\n            else {\n                this.drawExplosion(alienPos, game_config_1.DIMENSIONS.alien);\n            }\n        }\n        const { x, y } = this.getPixelPos(alienSet.pos);\n        const { w, h } = this.getPixelSize(alienSet.size);\n        this.ctx.fillStyle = \"rgba(255,255,255,0.4)\";\n        this.ctx.fillRect(x, y, w, h);\n    }\n    drawAlien(alien, pos) {\n        const { w, h } = this.getPixelSize(game_config_1.DIMENSIONS.alien);\n        const { x, y } = this.getPixelPos(pos);\n        this.ctx.fillStyle = config_1.colors[alien.alienType];\n        this.ctx.fillRect(x, y, w, h);\n    }\n    drawExplosion(pos, size, color = \"#fff\") {\n        const { w, h } = this.getPixelSize(size);\n        const { x, y } = this.getPixelPos(pos);\n        const pieceHeight = h / explosion.pieces.length, pieceWidth = w / explosion.pieces[0].length;\n        this.ctx.save();\n        this.ctx.translate(x, y);\n        this.ctx.fillStyle = color;\n        for (const { piece, row, column } of explosion) {\n            if (!piece)\n                continue;\n            this.ctx.fillRect(column * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight);\n        }\n        this.ctx.restore();\n    }\n    drawBullets(bullets) {\n        for (const bullet of bullets) {\n            this.drawBullet(bullet);\n        }\n    }\n    drawBullet(bullet) {\n        const { x, y } = this.getPixelPos(bullet.pos);\n        const { w, h } = this.getPixelSize(bullet.size);\n        this.ctx.fillStyle = bullet.from === \"alien\" ? \"limegreen\" : \"white\";\n        this.ctx.fillRect(x, y, w, h);\n    }\n    drawPlayer(player) {\n        if (player.status === \"exploding\") {\n            this.drawExplosion(player.pos, game_config_1.DIMENSIONS.player);\n            return;\n        }\n        else if (player.status === \"alive\" ||\n            (player.status === \"reviving\" &&\n                Math.round(performance.now() / 400) % 2 === 0)) {\n            const { x, y } = this.getPixelPos(player.pos);\n            const { w, h } = this.getPixelSize(game_config_1.DIMENSIONS.player);\n            this.ctx.fillStyle = \"white\";\n            this.ctx.fillRect(x, y, w, h);\n        }\n    }\n    drawBoss(boss) {\n        if (boss.status === \"exploding\") {\n            this.drawExplosion(boss.pos, game_config_1.DIMENSIONS.boss, config_1.colors.boss);\n        }\n        else {\n            const { x, y } = this.getPixelPos(boss.pos);\n            const { w, h } = this.getPixelSize(game_config_1.DIMENSIONS.boss);\n            this.ctx.fillStyle = config_1.colors.boss;\n            this.ctx.fillRect(x, y, w, h);\n        }\n    }\n    drawWalls(walls) {\n        for (const wall of walls) {\n            this.drawWall(wall);\n        }\n    }\n    drawWall(wall) {\n        const { x, y } = this.getPixelPos(wall.pos);\n        this.ctx.save();\n        this.ctx.translate(x, y);\n        const { w, h } = wall.pieceSize;\n        const piecePixelWidth = this.horPixels(w), piecePixelHeight = this.verPixels(h);\n        for (const { row, column, piece } of wall.pieces) {\n            if (piece) {\n                const xPixels = this.horPixels(column * w), yPixels = this.verPixels(row * h);\n                this.ctx.fillStyle = \"#fff\";\n                this.ctx.fillRect(xPixels, yPixels, piecePixelWidth, piecePixelHeight);\n            }\n        }\n        this.ctx.restore();\n    }\n    drawMetadata(state, timeStep) {\n        const fontSize = this.getFontSize(\"md\");\n        const yPixelsPadding = this.verPixels(game_config_1.LAYOUT.padding.ver);\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.textBaseline = \"top\";\n        this.ctx.font = `${fontSize}px ${this.fontFamily}`;\n        this.ctx.textAlign = \"start\";\n        this.ctx.fillText(`SCORE ${state.player.score}`, this.horPixels(game_config_1.LAYOUT.padding.hor), yPixelsPadding);\n        this.ctx.textAlign = \"end\";\n        this.ctx.fillText(`Lives ${state.player.lives}`, this.horPixels(100 - game_config_1.LAYOUT.padding.hor), yPixelsPadding);\n        const fps = Math.round(1 / timeStep);\n        this.ctx.textAlign = \"center\";\n        this.ctx.fillText(`${fps} FPS`, this.horPixels(50), yPixelsPadding);\n    }\n    drawPauseHint() {\n        const hintWidth = this.horPixels(24), hintHeight = this.verPixels(10);\n        const hintXPos = this.horPixels(50) - hintWidth / 2, hintYPos = this.verPixels(50) - hintHeight / 2;\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.fillRect(hintXPos, hintYPos - 4, hintWidth, hintHeight);\n        const fontSize = this.getFontSize(\"lg\");\n        this.ctx.fillStyle = \"#000\";\n        this.ctx.font = `${fontSize}px ${this.fontFamily}`;\n        this.ctx.textAlign = \"center\";\n        this.ctx.textBaseline = \"middle\";\n        this.ctx.fillText(\"PAUSED\", this.horPixels(50), this.verPixels(50));\n    }\n    drawPressEscMessage() {\n        const fontSize = this.getFontSize(\"sm\");\n        const xPixelPos = this.horPixels(game_config_1.LAYOUT.padding.hor), yPixelPos = this.verPixels(8);\n        this.ctx.font = `${fontSize}px ${this.fontFamily}`;\n        this.ctx.fillStyle = \"#fff\";\n        this.ctx.textAlign = \"left\";\n        this.ctx.textBaseline = \"top\";\n        this.ctx.fillText('Press \"Esc\" to pause/unpause', xPixelPos, yPixelPos);\n    }\n}\nexports[\"default\"] = RunningGame;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/screens/RunningGame.ts?");

/***/ }),

/***/ "./src/components/View/utils.ts":
/*!**************************************!*\
  !*** ./src/components/View/utils.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.drawTwinkleMessage = exports.trackKeys = exports.getElementInnerDimensions = void 0;\nfunction getElementInnerDimensions(element) {\n    const cs = getComputedStyle(element);\n    const paddingY = parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);\n    const paddingX = parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);\n    const marginY = parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);\n    const marginX = parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);\n    return {\n        w: element.offsetWidth - paddingX - marginX,\n        h: element.offsetHeight - paddingY - marginY,\n    };\n}\nexports.getElementInnerDimensions = getElementInnerDimensions;\nfunction trackKeys(keys) {\n    const down = {};\n    keys.forEach((key) => (down[key] = false));\n    function onPressKey(e) {\n        for (const key of keys) {\n            if (e.key === key) {\n                e.preventDefault();\n                down[e.key] = e.type === \"keydown\";\n            }\n        }\n    }\n    window.addEventListener(\"keydown\", onPressKey);\n    window.addEventListener(\"keyup\", onPressKey);\n    return down;\n}\nexports.trackKeys = trackKeys;\nfunction drawTwinkleMessage(ctx, message, pos, options) {\n    const { fontSize = 16, fontFamily = \"monospace\", align = \"center\", baseline = \"middle\", color = \"#fff\", } = options || {};\n    if (Math.round(performance.now() / 800) % 2 === 0) {\n        ctx.font = `${fontSize}px ${fontFamily}`;\n        ctx.textAlign = align;\n        ctx.textBaseline = baseline;\n        ctx.fillStyle = color;\n        const { x, y } = pos;\n        ctx.fillText(message, x, y);\n    }\n}\nexports.drawTwinkleMessage = drawTwinkleMessage;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/View/utils.ts?");

/***/ }),

/***/ "./src/components/Wall/index.ts":
/*!**************************************!*\
  !*** ./src/components/Wall/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst overlap_1 = __importDefault(__webpack_require__(/*! @/utils/common/overlap */ \"./src/utils/common/overlap.ts\"));\nconst IterablePieces_1 = __importDefault(__webpack_require__(/*! @/utils/common/IterablePieces */ \"./src/utils/common/IterablePieces.ts\"));\nclass Wall {\n    constructor(pos, size, plan) {\n        this.pos = pos;\n        this.size = size;\n        const ip = new IterablePieces_1.default(plan);\n        this.pieceSize = {\n            w: size.w / ip.pieces[0].length,\n            h: size.h / ip.pieces.length,\n        };\n        this.pieces = ip;\n    }\n    getPiecePos(column, row) {\n        return {\n            x: this.pos.x + column * this.pieceSize.w,\n            y: this.pos.y + row * this.pieceSize.h,\n        };\n    }\n    collide(objPos, objSize) {\n        if (!(0, overlap_1.default)(this.pos, this.size, objPos, objSize))\n            return false;\n        let touchedPiece = false;\n        for (const { row, column, piece } of this.pieces) {\n            if (!piece)\n                continue;\n            const piecePos = this.getPiecePos(column, row);\n            if ((0, overlap_1.default)(objPos, objSize, piecePos, this.pieceSize)) {\n                this.pieces.breakPiece(column, row);\n                if (!touchedPiece)\n                    touchedPiece = true;\n            }\n        }\n        return touchedPiece;\n    }\n}\nexports[\"default\"] = Wall;\n\n\n//# sourceURL=webpack://space-invaders/./src/components/Wall/index.ts?");

/***/ }),

/***/ "./src/game-config.ts":
/*!****************************!*\
  !*** ./src/game-config.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.DIMENSIONS = exports.LAYOUT = exports.ACTION_KEYS = void 0;\nconst LAYOUT = {\n    padding: {\n        hor: 3,\n        ver: 3,\n    },\n    numWalls: 4,\n    wallsSize: {\n        w: 12,\n        h: 10,\n    },\n    wallYPos: 70,\n    playerYPos: 86,\n    floorYPos: 97,\n    bossYPos: 6,\n};\nexports.LAYOUT = LAYOUT;\nconst DIMENSIONS = {\n    alien: {\n        w: 3.5,\n        h: 5,\n    },\n    player: {\n        w: 4,\n        h: 6,\n    },\n    alienSetGap: {\n        w: 1,\n        h: 1.5,\n    },\n    boss: {\n        w: 7,\n        h: 7.5,\n    },\n    floorHeight: 1,\n};\nexports.DIMENSIONS = DIMENSIONS;\nconst ACTION_KEYS = {\n    moveRight: \"ArrowRight\",\n    moveLeft: \"ArrowLeft\",\n    fire: \" \",\n    startGame: \" \",\n    restartGame: \" \",\n    pauseGame: \"Escape\",\n};\nexports.ACTION_KEYS = ACTION_KEYS;\n\n\n//# sourceURL=webpack://space-invaders/./src/game-config.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst Presenter_1 = __importDefault(__webpack_require__(/*! @/components/Presenter */ \"./src/components/Presenter/index.ts\"));\nconst View_1 = __importDefault(__webpack_require__(/*! @/components/View */ \"./src/components/View/index.ts\"));\nconst State_1 = __importDefault(__webpack_require__(/*! @/components/State */ \"./src/components/State/index.ts\"));\nnew Presenter_1.default(State_1.default, View_1.default, document.body);\n\n\n//# sourceURL=webpack://space-invaders/./src/index.ts?");

/***/ }),

/***/ "./src/plans/alien-set.ts":
/*!********************************!*\
  !*** ./src/plans/alien-set.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst defaultAliensPlan = `\r\nZZZZZZZZZZ\r\nYYYYYYYYYY\r\nYYYYYYYYYY\r\nXXXXXXXXXX\r\nXXXXXXXXXX\r\n`;\nexports[\"default\"] = defaultAliensPlan;\n\n\n//# sourceURL=webpack://space-invaders/./src/plans/alien-set.ts?");

/***/ }),

/***/ "./src/plans/explosions.ts":
/*!*********************************!*\
  !*** ./src/plans/explosions.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst normalExplosion = `\r\n....#.......\r\n....##...###\r\n.....#..##..\r\n.....##.#...\r\n.###........\r\n##......###.\r\n....#.##..##\r\n...##..##...\r\n...#....##..\r\n...#.....#..\r\n`;\nexports[\"default\"] = normalExplosion;\n\n\n//# sourceURL=webpack://space-invaders/./src/plans/explosions.ts?");

/***/ }),

/***/ "./src/plans/walls.ts":
/*!****************************!*\
  !*** ./src/plans/walls.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.fancyWall = exports.fancyShieldLikeWall = void 0;\nexports.fancyShieldLikeWall = `\r\n........######################################........\r\n.....############################################.....\r\n...################################################...\r\n..##################################################..\r\n.###################################################..\r\n.############.......##############.......############.\r\n.##########...........##########...........##########.\r\n##########..............######..............##########\r\n#########......##........####.........##.....#########\r\n########......##..........##...........##....#########\r\n########......##.........####..........##.....########\r\n########......###......#########......###.....########\r\n########.......#####..####..######..####......########\r\n########........########......########........########\r\n########.........#####..........#####.........########\r\n#########....................................#########\r\n.#########..................................#########.\r\n..##########..............................##########..\r\n`;\nexports.fancyWall = `\r\n...#...............................................#...\r\n..###.............................................###..\r\n..####...........................................####..\r\n.######....................#....................######.\r\n.#######..................###..................#######.\r\n#########................#####................#########\r\n##########..............#######..............##########\r\n############.........#############.........############\r\n##############..#..#################..#..##############\r\n#######################################################\r\n.#####################################################.\r\n...#################################################...\r\n......###########################################......\r\n........###########..................##########........\r\n..........#######......................#######.........\r\n`;\nconst shieldLikeWall = `\r\n............######################################............\r\n.........############################################.........\r\n.......################################################.......\r\n......##################################################......\r\n....####################################################......\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....######################################################....\r\n....#############............................#############....\r\n....############..............................############....\r\n....###########................................###########....\r\n...###########..................................###########...\r\n...###########..................................###########...\r\n..#############................................#############..\r\n.###############..............................###############.\r\n##################..........................##################\r\n`;\nexports[\"default\"] = shieldLikeWall;\n\n\n//# sourceURL=webpack://space-invaders/./src/plans/walls.ts?");

/***/ }),

/***/ "./src/ts/enums.ts":
/*!*************************!*\
  !*** ./src/ts/enums.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.HorizontalDirection = void 0;\nvar HorizontalDirection;\n(function (HorizontalDirection) {\n    HorizontalDirection[HorizontalDirection[\"Right\"] = 1] = \"Right\";\n    HorizontalDirection[HorizontalDirection[\"Left\"] = -1] = \"Left\";\n})(HorizontalDirection || (exports.HorizontalDirection = HorizontalDirection = {}));\n\n\n//# sourceURL=webpack://space-invaders/./src/ts/enums.ts?");

/***/ }),

/***/ "./src/utils/common/IterablePieces.ts":
/*!********************************************!*\
  !*** ./src/utils/common/IterablePieces.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst readSolidPlan_1 = __importDefault(__webpack_require__(/*! ./readSolidPlan */ \"./src/utils/common/readSolidPlan.ts\"));\nclass IterablePieces {\n    constructor(plan, solidCharacter = \"#\") {\n        this.pieces = (0, readSolidPlan_1.default)(plan, solidCharacter);\n    }\n    breakPiece(column, row) {\n        this.pieces[row][column] = false;\n    }\n    *[Symbol.iterator]() {\n        const rows = this.pieces.length;\n        for (let row = 0; row < rows; row++) {\n            const rowLength = this.pieces[row].length;\n            for (let column = 0; column < rowLength; column++) {\n                const piece = this.pieces[row][column];\n                yield { row, column, piece };\n            }\n        }\n    }\n}\nexports[\"default\"] = IterablePieces;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/IterablePieces.ts?");

/***/ }),

/***/ "./src/utils/common/Vector.ts":
/*!************************************!*\
  !*** ./src/utils/common/Vector.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nclass Vector {\n    constructor(x, y) {\n        this.x = x;\n        this.y = y;\n    }\n    plus(other) {\n        return new Vector(this.x + other.x, this.y + other.y);\n    }\n    minus(other) {\n        return new Vector(this.x - other.x, this.y - other.y);\n    }\n    times(factor) {\n        return new Vector(this.x * factor, this.y * factor);\n    }\n}\nexports[\"default\"] = Vector;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/Vector.ts?");

/***/ }),

/***/ "./src/utils/common/overlap.ts":
/*!*************************************!*\
  !*** ./src/utils/common/overlap.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nfunction overlap(pos1, size1, pos2, size2) {\n    return (pos1.x + size1.w > pos2.x &&\n        pos1.x < pos2.x + size2.w &&\n        pos1.y + size1.h > pos2.y &&\n        pos1.y < pos2.y + size2.h);\n}\nexports[\"default\"] = overlap;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/overlap.ts?");

/***/ }),

/***/ "./src/utils/common/randomNum.ts":
/*!***************************************!*\
  !*** ./src/utils/common/randomNum.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nfunction randomNum(min, max) {\n    return min + Math.random() * (max - min);\n}\nexports[\"default\"] = randomNum;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/randomNum.ts?");

/***/ }),

/***/ "./src/utils/common/randomNumberInFactorRange.ts":
/*!*******************************************************!*\
  !*** ./src/utils/common/randomNumberInFactorRange.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst randomNum_1 = __importDefault(__webpack_require__(/*! ./randomNum */ \"./src/utils/common/randomNum.ts\"));\nfunction randomNumberInFactorRange(n, subtractingFactor, addingFactor = subtractingFactor) {\n    return (0, randomNum_1.default)((1 - subtractingFactor) * n, (1 + addingFactor) * n);\n}\nexports[\"default\"] = randomNumberInFactorRange;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/randomNumberInFactorRange.ts?");

/***/ }),

/***/ "./src/utils/common/readSolidPlan.ts":
/*!*******************************************!*\
  !*** ./src/utils/common/readSolidPlan.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nfunction readSolidPlan(plan, solidCharacter = \"#\") {\n    const pieces = plan\n        .trim()\n        .split(\"\\n\")\n        .map((row) => [...row].map((ch) => ch === solidCharacter));\n    return pieces;\n}\nexports[\"default\"] = readSolidPlan;\n\n\n//# sourceURL=webpack://space-invaders/./src/utils/common/readSolidPlan.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;