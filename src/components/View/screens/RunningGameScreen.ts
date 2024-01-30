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
  Coords,
} from "@/ts/types";
import BaseScreen from "./BaseScreen";
import { colors } from "../config";
import explosionPlan from "@/plans/explosions";
import IterablePieces from "@/components/IterablePieces";
import * as playerConfig from "@/components/Player/config";
import {
  drawProgressBar,
  trackKeys,
  elt,
  findTouch,
  findUntrackedTouch,
  flipHorizontally,
} from "../utils";

import {
  playerSpaceship,
  aliensSprite,
  bossImage,
  wigglyBulletImage,
  soundIcon,
} from "../images";
import MobileVolumeSlider from "../dom-components/mobile-volume-slider";

/**
 * An object that holds the tile position of each alien in the aliens sprite.
 * Each property holds a tuple whose first element holds the horizontal
 * position of the alien's first stage and whose second element represents the
 * second stage.
 */
const aliensTileX = {
  X: [0, 100],
  Y: [200, 300],
  Z: [400, 500],
} as const;

/** The size of each alien image in the sprite. */
const alienImageSize = { w: 100, h: 100 };

const explosion = new IterablePieces(explosionPlan);
const lastScoreAppearanceDuration = 1;

export default class RunningGameScreen extends BaseScreen {
  /* i've decided to put the last score animation here because
  it is a matter of how the view will present it, the animation thus
  should not be part of the business logic */
  private lastScore: IStateLastScore = { value: null, id: null };
  private timeSinceLastScoreChange = 0;

  protected mobileButtons: HTMLDivElement = elt("div", {
    className: "btn-container btn-container--state-running",
  });
  protected mobileVolumeSlider!: MobileVolumeSlider;
  private pauseBtn: HTMLButtonElement | null = null;

  private trackedTouchIds: number[] = [];

  constructor(
    canvas: HTMLCanvasElement,
    public state: IGameState,
    private readonly syncAction: (
      action: RunningScreenActions,
      isHappening: boolean
    ) => void,
    private readonly onPauseGame: () => void,
    private readonly onChangeVolume: (newVolume: number) => void
  ) {
    super(canvas);
    this.setUpControlMethods();
  }

  protected setUpControlMethods() {
    document.body.appendChild(this.mobileButtons);

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
    const volumeSlider = new MobileVolumeSlider(
      this.state.volume,
      this.onChangeVolume
    );
    this.mobileVolumeSlider = volumeSlider;

    this.manageMobileButtonTouchEvents(moveLeftBtn, "moveLeft");
    this.manageMobileButtonTouchEvents(moveRightBtn, "moveRight");
    this.manageMobileButtonTouchEvents(fireBtn, "fire");

    this.mobileButtons.appendChild(fireBtn);
    this.mobileButtons.appendChild(moveLeftBtn);
    this.mobileButtons.appendChild(moveRightBtn);
    this.mobileButtons.appendChild(pauseBtn);
    this.mobileButtons.appendChild(volumeSlider.container);
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
    if (state.boss !== null) this.drawBoss(state.boss);
    if (state.status === "paused") this.drawPauseHint();
    this.pauseBtn!.textContent =
      state.status === "paused" ? "unpause" : "pause";
    this.mobileVolumeSlider.update(state.volume);
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
        this.drawAlien(alien, alienPos, alienSet.aliensStage);
      } else {
        this.drawExplosion(alienPos, DIMENSIONS.alien);
      }
    }
  }

  private drawAlien(alien: IAlien, pos: Coords, stage: 0 | 1) {
    const { w, h } = this.getPixelSize(DIMENSIONS.alien);
    const { x, y } = this.getPixelPos(pos);

    const { ctx } = this;

    const tileX = aliensTileX[alien.alienType][stage];
    ctx.save();
    ctx.translate(x, y);
    ctx.drawImage(
      aliensSprite,
      tileX,
      0,
      alienImageSize.w,
      alienImageSize.h,
      0,
      0,
      w,
      h
    );
    ctx.restore();
  }

  private drawExplosion(pos: Coords, size: Size, color = "#fff") {
    const { w, h } = this.getPixelSize(size);
    const { x, y } = this.getPixelPos(pos);

    const pieceHeight = h / explosion.numOfRows,
      pieceWidth = w / explosion.numOfColumns;

    this.ctx.save();
    this.ctx.translate(x, y);

    this.drawPieces(explosion, { w: pieceWidth, h: pieceHeight }, color);

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

    const { ctx } = this;
    if (bullet.wiggly) {
      const stage = Math.round(performance.now() / 200) % 2 === 1 ? 1 : 0;
      ctx.save();
      ctx.translate(x, y);
      if (stage === 1) flipHorizontally(ctx, w / 2);
      ctx.drawImage(wigglyBulletImage, 0, 0, w, h);
      ctx.restore();
    } else {
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, w, h);
    }
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

      this.ctx.save();
      this.ctx.translate(x, y);

      this.ctx.globalAlpha = progress;
      this.ctx.drawImage(playerSpaceship, 0, 0, w, h);

      this.ctx.restore();
    }
  }

  private drawBoss(boss: IBoss) {
    if (boss.status === "exploding") {
      this.drawExplosion(boss.pos, DIMENSIONS.boss, colors.boss);
    } else {
      const { x, y } = this.getPixelPos(boss.pos);
      const { w, h } = this.getPixelSize(DIMENSIONS.boss);

      const { ctx } = this;

      ctx.save();
      ctx.translate(x, y);
      ctx.drawImage(bossImage, 0, 0, w, h);
      ctx.restore();
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
    const yPixelsPadding = this.verPixels(LAYOUT.padding.ver);

    this.setFontSize("md");
    this.ctx.textBaseline = "top";

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

    const {hor, ver} = LAYOUT.padding;
    this.drawVolumeHint(state.volume, { x: hor, y: ver + 5.5 });
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
    this.ctx.fillRect(
      hintXPos,
      hintYPos - this.verPixels(0.1),
      hintWidth,
      hintHeight
    );

    this.ctx.fillStyle = "#000";
    this.setFontSize("lg");
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("PAUSED", this.horPixels(50), this.verPixels(50));
  }
  /* 
  private drawVolumeHintt(v: number) {
    const { ctx } = this;
    this.setFontSize("sm");
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    const iconW = this.horPixels(3),
      vText = `| ${Math.round(v * 100)}`,
      { width, fontBoundingBoxDescent } = ctx.measureText(vText),
      rightEdge = this.horPixels(100 - LAYOUT.padding.hor),
      topEdge = this.verPixels(6.5);

    ctx.fillText(vText, rightEdge - width, topEdge);
    ctx.drawImage(
      soundIcon,
      rightEdge - width - this.horPixels(1) - iconW,
      topEdge,
      iconW,
      fontBoundingBoxDescent
    );
  } */

  private drawCollisions(collisions: IGameState["bulletCollisions"]) {
    for (const c of collisions) {
      this.drawExplosion(
        { y: c.pos.y - c.size.h / 2, x: c.pos.x - c.size.w / 2 },
        c.size
      );
    }
  }
}
