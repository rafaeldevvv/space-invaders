import { LAYOUT, DIMENSIONS } from "@/game-config";
import { IGameState, IAlien, Size, IBoss, IWall } from "@/ts/types";
import BaseCanvasWrapper from "./BaseCanvasWrapper";
import { colors } from "../config";
import explosionPlan from "@/plans/explosions";
import IterablePieces from "@/utils/common/IterablePieces";

const explosion = new IterablePieces(explosionPlan);

export default class RunningGame extends BaseCanvasWrapper {
  public syncState(state: IGameState, timeStep: number) {
    this.clear();

    this.drawFloor();
    this.drawPlayer(state.player);
    this.drawAlienSet(state.alienSet);
    this.drawBullets(state.bullets);
    this.drawWalls(state.env.walls);
    this.drawMetadata(state, timeStep);
    this.drawPressEscMessage();
    if (state.boss !== null) this.drawBoss(state.boss);
    if (state.status === "paused") this.drawPauseHint();
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
    } else if (
      player.status === "alive" ||
      (player.status === "reviving" &&
        Math.round(performance.now() / 400) % 2 === 0)
    ) {
      const { x, y } = this.getPixelPos(player.pos);
      const { w, h } = this.getPixelSize(DIMENSIONS.player);

      this.ctx.fillStyle = "white";
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
    // draw hearts to show player's lives
    // draw score
    const fontSize = this.getFontSize("md");
    const yPixelsPadding = this.verPixels(LAYOUT.padding.ver);

    this.ctx.fillStyle = "#fff";
    this.ctx.textBaseline = "top";
    this.ctx.font = `${fontSize}px ${this.fontFamily}`;

    // draw the score of the player
    this.ctx.textAlign = "start";
    this.ctx.fillText(
      `SCORE ${state.player.score}`,
      this.horPixels(LAYOUT.padding.hor),
      yPixelsPadding
    );

    // draw how many lives the player has
    this.ctx.textAlign = "end";
    this.ctx.fillText(
      `Lives ${state.player.lives}`,
      this.horPixels(100 - LAYOUT.padding.hor),
      yPixelsPadding
    );

    // draw how many fps the game is running at
    const fps = Math.round(1 / timeStep);
    this.ctx.textAlign = "center";
    this.ctx.fillText(`${fps} FPS`, this.horPixels(50), yPixelsPadding);
  }

  private drawPauseHint() {
    const hintWidth = this.horPixels(24),
      hintHeight = this.verPixels(10);
    const hintXPos = this.horPixels(50) - hintWidth / 2,
      hintYPos = this.verPixels(50) - hintHeight / 2;

    this.ctx.fillStyle = "#fff";
    // the `- 3` part is just an adjustment
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
}
