import {
  LAYOUT,
  DIMENSIONS,
  RUNNING_GAME_KEY_ACTIONS,
  ACTION_KEYS,
} from "@/game-config";
import {
  IGameState,
  IAlien,
  Size,
  IBoss,
  IWall,
  IStateLastScore,
  RunningScreenActions,
} from "@/ts/types";
import BaseCanvasWrapper from "./BaseCanvasWrapper";
import { colors } from "../config";
import explosionPlan from "@/plans/explosions";
import IterablePieces from "@/utils/common/IterablePieces";
import * as playerConfig from "@/components/Player/config";
import { drawProgressBar, trackKeys, elt } from "../utils";

function findTouch(touches: TouchList, id: number) {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === id) return touches[i];
  }
  return null;
}

function findUntrackedTouch(touches: TouchList, ids: number[]) {
  for (let i = 0; i < touches.length; i++) {
    if (!ids.some((id) => id === touches[i].identifier)) return touches[i];
  }
  return null;
}

const explosion = new IterablePieces(explosionPlan);
const lastScoreAppearanceDuration = 1;

export default class RunningGameScreen extends BaseCanvasWrapper {
  /* i've decided to put the last score animation here because
  it is a matter of how the view will present it, the animation thus
  should not be part of the business logic */
  private lastScore: IStateLastScore = { value: null, id: null };
  private timeSinceLastScoreChange = 0;

  protected buttons: HTMLDivElement = elt("div", {
    className: "btn-container btn-container--state-running",
  });
  private pauseBtn: HTMLButtonElement | null = null;

  private trackedTouchIds: number[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    private readonly syncAction: (
      action: RunningScreenActions,
      isHappening: boolean
    ) => void,
    private onPauseGame: () => void
  ) {
    super(canvas);
    this.setUpControlMethods();
  }

  protected setUpControlMethods() {
    document.body.appendChild(this.buttons);

    const keys = Object.keys(
      RUNNING_GAME_KEY_ACTIONS
    ) as (keyof typeof RUNNING_GAME_KEY_ACTIONS)[];

    const trackedKeys = trackKeys(keys, (key, pressed) => {
      const action = RUNNING_GAME_KEY_ACTIONS[key];
      this.syncAction(action, pressed);
    });
    this.unregisterFunctions.push(trackedKeys.unregister);

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === ACTION_KEYS.pauseGame) {
        e.preventDefault();
        this.onPauseGame();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    this.unregisterFunctions.push(() => {
      window.removeEventListener("keydown", handleKeydown);
    });

    this.createMobileControls();
  }

  /**
   * Manages the touch events for the mobile buttons.
   *
   * @param btn - The button.
   * @param action - The action the button is associated with.
   */
  protected manageMobileButtonTouchEvents(
    btn: HTMLButtonElement,
    action: RunningScreenActions
  ) {
    let id: number | null = null;

    const handleStart = (ev: TouchEvent) => {
      const touches = ev.touches;
      const touch = findUntrackedTouch(touches, this.trackedTouchIds);
      if (touch) {
        id = touch.identifier;
        this.syncAction(action, true);
        btn.addEventListener("touchmove", handleMove);
        btn.addEventListener("touchend", handleEnd);
        btn.addEventListener("touchcancel", handleEnd);
        btn.classList.add("active");
      }
    };

    const handleMove = (ev: TouchEvent) => {
      const touches = ev.touches;
      const touch = findTouch(touches, id!); // id should not be null if touch is moving
      if (touch) {
        const { top, left, right, bottom } = btn.getBoundingClientRect();
        const { clientX: x, clientY: y } = touch;

        if (x > left && x < right && y > top && y < bottom) {
          this.syncAction(action, true);
        } else {
          endTouch();
        }
      } else {
        endTouch();
      }
    };

    const handleEnd = () => {
      endTouch();
    };

    btn.addEventListener("touchstart", handleStart);

    const endTouch = () => {
      this.syncAction(action, false);
      btn.removeEventListener("touchend", handleEnd);
      btn.removeEventListener("touchmove", handleMove);
      btn.removeEventListener("touchcancel", handleEnd);
      this.trackedTouchIds = this.trackedTouchIds.filter(
        (trackedId) => trackedId !== id
      );
      btn.classList.remove("active");
    };
    
    this.unregisterFunctions.push(() => {
      btn.removeEventListener("touchstart", handleStart);
      btn.removeEventListener("touchmove", handleMove);
      btn.removeEventListener("touchend", handleEnd);
      btn.removeEventListener("touchcancel", handleEnd);
      btn.classList.remove("active");
    });
  }

  protected createMobileControls() {
    const fireBtn = elt(
        "button",
        {
          className: "fire-btn btn-container__btn",
        },
        "fire"
      ),
      moveRightBtn = elt(
        "button",
        {
          className: "move-right-btn btn-container__btn",
        },
        "right"
      ),
      moveLeftBtn = elt(
        "button",
        {
          className: "move-left-btn btn-container__btn",
        },
        "left"
      ),
      pauseBtn = elt(
        "button",
        {
          className: "pause-btn btn-container__btn",
          onclick: () => {
            this.onPauseGame();
          },
        },
        "pause"
      );

    this.pauseBtn = pauseBtn;

    this.manageMobileButtonTouchEvents(moveLeftBtn, "moveLeft");
    this.manageMobileButtonTouchEvents(moveRightBtn, "moveRight");
    this.manageMobileButtonTouchEvents(fireBtn, "fire");

    this.buttons.appendChild(fireBtn);
    this.buttons.appendChild(moveLeftBtn);
    this.buttons.appendChild(moveRightBtn);
    this.buttons.appendChild(pauseBtn);
  }

  public cleanUp() {
    super.cleanUp();
    this.pauseBtn = null;
    this.trackedTouchIds = [];
  }

  public syncState(state: IGameState, timeStep: number) {
    this.clearScreen();

    if (state.lastScore.id !== this.lastScore.id) {
      this.timeSinceLastScoreChange = 0;
      this.lastScore.id = state.lastScore.id;
      this.lastScore.value = state.lastScore.value;

      /* can't do `this.lastScore = state.lastScore` 
      cuz im using a mutable approach and `this.lastScore`
      would always have the last values */
    }
    this.timeSinceLastScoreChange += timeStep;

    this.drawFloor();
    this.drawPlayer(state.player);
    this.drawAlienSet(state.alienSet);
    this.drawBullets(state.bullets);
    this.drawCollisions(state.bulletCollisions);
    this.drawWalls(state.env.walls);
    this.drawMetadata(state, timeStep);
    this.drawPressEscMessage();
    if (state.boss !== null) this.drawBoss(state.boss);
    if (state.status === "paused") this.drawPauseHint();
    this.pauseBtn!.textContent =
      state.status === "paused" ? "unpause" : "pause";
  }

  private drawFloor() {
    const floorWidth = 100 - LAYOUT.padding.hor * 2,
      w = this.horPixels(floorWidth),
      h = this.verPixels(DIMENSIONS.floorHeight);
    const x = this.horPixels(LAYOUT.padding.hor),
      y = this.verPixels(100 - DIMENSIONS.floorHeight - 1.5);

    this.ctx.fillStyle = "#fff";
    this.ctx.fillRect(x, y, w, h);
  }

  private drawAlienSet(alienSet: IGameState["alienSet"]) {
    for (const { alien, row, column } of alienSet) {
      if (alien === null) continue;

      const xPercentage =
        alienSet.pos.x +
        column * (DIMENSIONS.alienSetGap.w + DIMENSIONS.alien.w);

      const yPercentage =
        alienSet.pos.y + row * (DIMENSIONS.alienSetGap.h + DIMENSIONS.alien.h);

      const alienPos = {
        x: xPercentage,
        y: yPercentage,
      };

      if (alien !== "exploding") {
        this.drawAlien(alien, alienPos);
      } else {
        this.drawExplosion(alienPos, DIMENSIONS.alien);
      }
    }

    /* this is meant for tests, remove it later */
    const { x, y } = this.getPixelPos(alienSet.pos);
    const { w, h } = this.getPixelSize(alienSet.size);
    this.ctx.fillStyle = "rgba(255,255,255,0.4)";
    this.ctx.fillRect(x, y, w, h);
  }

  private drawAlien(alien: IAlien, pos: Coords) {
    const { w, h } = this.getPixelSize(DIMENSIONS.alien);
    const { x, y } = this.getPixelPos(pos);

    this.ctx.fillStyle = colors[alien.alienType];
    this.ctx.fillRect(x, y, w, h);
  }

  private drawExplosion(pos: Coords, size: Size, color = "#fff") {
    const { w, h } = this.getPixelSize(size);
    const { x, y } = this.getPixelPos(pos);

    const pieceHeight = h / explosion.pieces.length,
      pieceWidth = w / explosion.pieces[0].length;

    this.ctx.save();
    this.ctx.translate(x, y);

    this.ctx.fillStyle = color;
    for (const { piece, row, column } of explosion) {
      if (!piece) continue;
      this.ctx.fillRect(
        column * pieceWidth,
        row * pieceHeight,
        pieceWidth,
        pieceHeight
      );
    }
    this.ctx.restore();
  }

  private drawBullets(bullets: IGameState["bullets"]) {
    for (const bullet of bullets) {
      this.drawBullet(bullet);
    }
  }

  private drawBullet(bullet: IGameState["bullets"][number]) {
    const { x, y } = this.getPixelPos(bullet.pos);
    const { w, h } = this.getPixelSize(bullet.size);

    this.ctx.fillStyle = bullet.from === "alien" ? "limegreen" : "white";
    this.ctx.fillRect(x, y, w, h);
  }

  private drawPlayer(player: IGameState["player"]) {
    if (player.status === "exploding") {
      this.drawExplosion(player.pos, DIMENSIONS.player);
      return;
    } else {
      const progress =
        player.status === "reviving"
          ? Math.min(
              player.timeSinceResurrection / playerConfig.revivingTime,
              1
            )
          : 1;

      const { x, y } = this.getPixelPos(player.pos);
      const { w, h } = this.getPixelSize(DIMENSIONS.player);

      if (player.status === "reviving") {
        const progressBarWidth = w * 1.2,
          widthDifference = progressBarWidth - w;

        drawProgressBar(
          this.ctx,
          progress,
          { x: x - widthDifference / 2, y: y + 1.1 * h },
          { w: progressBarWidth, h: this.verPixels(1) }
        );
      }

      this.ctx.fillStyle = `rgba(255 255 255 / ${progress})`;
      this.ctx.fillRect(x, y, w, h);
    }
  }

  private drawBoss(boss: IBoss) {
    if (boss.status === "exploding") {
      this.drawExplosion(boss.pos, DIMENSIONS.boss, colors.boss);
    } else {
      const { x, y } = this.getPixelPos(boss.pos);
      const { w, h } = this.getPixelSize(DIMENSIONS.boss);

      this.ctx.fillStyle = colors.boss;
      this.ctx.fillRect(x, y, w, h);
    }
  }

  private drawWalls(walls: IWall[]) {
    for (const wall of walls) {
      this.drawWall(wall);
    }
  }

  private drawWall(wall: IWall) {
    const { x, y } = this.getPixelPos(wall.pos);

    this.ctx.save();
    this.ctx.translate(x, y);

    const { w, h } = wall.pieceSize;
    const piecePixelWidth = this.horPixels(w),
      piecePixelHeight = this.verPixels(h);

    for (const { row, column, piece } of wall.pieces) {
      if (piece) {
        const xPixels = this.horPixels(column * w),
          yPixels = this.verPixels(row * h);

        this.ctx.fillStyle = "#fff";
        this.ctx.fillRect(xPixels, yPixels, piecePixelWidth, piecePixelHeight);
      }
    }

    this.ctx.restore();
  }

  /**
   * Draws metadata such as score, player remaining lives and so on.
   *
   * @param state
   */
  private drawMetadata(state: IGameState, timeStep: number) {
    const fontSize = this.getFontSize("md");
    const yPixelsPadding = this.verPixels(LAYOUT.padding.ver);

    this.ctx.textBaseline = "top";
    this.ctx.font = `${fontSize}px ${this.fontFamily}`;

    this.drawScore(
      state.player.score,
      this.horPixels(LAYOUT.padding.hor),
      yPixelsPadding
    );

    // draw how many fps the game is running at
    this.drawFPS(timeStep, this.horPixels(50), yPixelsPadding);

    // draw how many lives the player has
    this.drawPlayerLives(
      state.player.lives,
      this.horPixels(100 - LAYOUT.padding.hor),
      yPixelsPadding
    );
  }

  private drawScore(score: number, x: number, y: number) {
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "start";
    const scoreText = `SCORE ${score.toString().padStart(5, "0")}`;
    this.ctx.fillText(scoreText, x, y);
    const scoreTextMetrics = this.ctx.measureText(scoreText);

    if (
      this.lastScore.value &&
      this.timeSinceLastScoreChange < lastScoreAppearanceDuration
    ) {
      const progress =
        this.timeSinceLastScoreChange / lastScoreAppearanceDuration;

      this.drawLastScoreAnimation(
        this.lastScore.value,
        this.horPixels(LAYOUT.padding.hor) +
          scoreTextMetrics.width +
          this.horPixels(2),
        y,
        progress
      );
    }
  }

  /**
   * Draws a nice little animation for the score the player just got.
   *
   * @param score
   * @param x - The x position of the animation.
   * @param baseY - The base vertical positon for the animation.
   * @param progress - The progress of the animation.
   */
  private drawLastScoreAnimation(
    score: number,
    x: number,
    baseY: number,
    progress: number
  ) {
    /* 
      Stage 1: The text is appearing upwards, varying its opacity from transparent to opaque.
      Stage 2: The text is totally opaque and still in the screen. This is the most lasting stage.
      Stage 3: The text is disappearing upwards, varying its opacity from opaque to transparent.

      Each stage has its own progress based on the original progress (progress parameter).
    */

    const stage: 1 | 2 | 3 = progress < 0.2 ? 1 : progress < 0.8 ? 2 : 3;

    let y = baseY;
    let opacity = 1;

    /* it doesn't move if we are in stage two */
    const translation = stage !== 2 ? this.verPixels(3) : 0;

    switch (stage) {
      case 1: {
        const stageOneProgress = progress / 0.2;
        opacity = stageOneProgress;
        /* `1 - stageOneProgress` cuz we're going bottom 
        up here, from below the base vertical position */
        y += translation * (1 - stageOneProgress);
        break;
      }
      case 2: {
        break;
      }
      case 3: {
        const stageThreeProgress = (progress - 0.8) / 0.2;
        /* from opaque to transparent, so it is the opposite */
        opacity = 1 - stageThreeProgress;
        /* we're going bottom up here, above the base vertical position */
        y -= translation * stageThreeProgress;
        break;
      }
    }

    this.ctx.fillStyle = `rgba(255 255 255 / ${opacity})`;
    this.ctx.fillText(`+${score}`, x, y);
  }

  private drawFPS(timeStep: number, x: number, y: number) {
    const fps = Math.round(1 / timeStep);
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${fps} FPS`, x, y);
  }

  private drawPlayerLives(lives: number, x: number, y: number) {
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "end";
    this.ctx.fillText(`LIVES ${lives}`, x, y);
  }

  private drawPauseHint() {
    const hintWidth = this.horPixels(24),
      hintHeight = this.verPixels(10);
    const hintXPos = this.horPixels(50) - hintWidth / 2,
      hintYPos = this.verPixels(50) - hintHeight / 2;

    this.ctx.fillStyle = "#fff";
    // the `- 4` part is just an adjustment
    this.ctx.fillRect(hintXPos, hintYPos - 4, hintWidth, hintHeight);

    const fontSize = this.getFontSize("lg");
    this.ctx.fillStyle = "#000";
    this.ctx.font = `${fontSize}px ${this.fontFamily}`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("PAUSED", this.horPixels(50), this.verPixels(50));
  }

  private drawPressEscMessage() {
    const fontSize = this.getFontSize("sm");

    const xPixelPos = this.horPixels(LAYOUT.padding.hor),
      yPixelPos = this.verPixels(8);

    this.ctx.font = `${fontSize}px ${this.fontFamily}`;
    this.ctx.fillStyle = "#fff";
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "top";

    this.ctx.fillText('Press "Esc" to pause/unpause', xPixelPos, yPixelPos);
  }

  private drawCollisions(collisions: IGameState["bulletCollisions"]) {
    for (const c of collisions) {
      this.drawExplosion(
        { y: c.pos.y - c.size.h / 2, x: c.pos.x - c.size.w / 2 },
        c.size
      );
    }
  }
}
