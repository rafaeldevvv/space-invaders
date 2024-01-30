import {
  Size,
  PixelCoords,
  PixelSize,
  Coords,
  TAliens,
  MappedObjectFromUnion,
  IIterablePieces,
  Screen,
  IGameState,
} from "@/ts/types";

import { soundIcon } from "../images";
import type MobileVolumeSlider from "../dom-components/mobile-volume-slider";

export const colors: {
  [Key in TAliens]: string;
} & { boss: string } = {
  X: "limegreen",
  Y: "orange",
  Z: "pink",
  boss: "#f77",
};

/**
 * Object representing standard font sizes.
 * The property names are font size names, and the values are percentages
 * of the width of the canvas.
 */
export const fontSizes: MappedObjectFromUnion<FontSizes, number> = {
  sm: 2.5,
  md: 4,
  lg: 6,
  xl: 12,
};

export type FontSizes = "sm" | "md" | "lg" | "xl";

export default abstract class BaseCanvasWrapper implements Screen {
  /** An array of functions to be called on clean up to remove event handlers. */
  protected unregisterFunctions: (() => void)[] = [];

  /** The container of the buttons. */
  protected abstract mobileButtons: HTMLDivElement;
  /** it is created inside the `createMobileControls()` method */
  protected abstract mobileVolumeSlider: MobileVolumeSlider;

  /** Sets up event handlers to handle user input. */
  protected abstract setUpControlMethods(): void;
  protected abstract createMobileControls(): void;
  /** Synchronizes the screen with the current state. */
  public abstract syncState(state?: IGameState, timeStep?: number): void;

  protected readonly fontFamily = "'VT323', monospace";

  protected ctx: CanvasRenderingContext2D;
  constructor(protected canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.ctx.imageSmoothingEnabled = false;
  }

  // readonly, cuz there's no setter
  protected get canvasWidth() {
    return this.canvas.width;
  }

  // readonly, cuz there's no setter
  protected get canvasHeight() {
    return this.canvas.height;
  }

  /**
   * Calculates the horizontal pixels according to a percentage of the canvas width.
   *
   * @param percentage - The percentage of the canvas width.
   * @returns - The corresponding horizontal pixels.
   */
  protected horPixels(percentage: number) {
    return (percentage / 100) * this.canvasWidth;
  }

  /**
   * Calculates the vertical pixels according to a percentage of the canvas height.
   *
   * @param percentage - The percentage of the canvas heigth.
   * @returns - The corresponding vertical pixels.
   */
  protected verPixels(percentage: number) {
    return (percentage / 100) * this.canvasHeight;
  }

  /**
   * Calculates the pixel position of an object within the canvas based on a percentage position.
   *
   * @param percentagePos - The percentage position.
   * @returns - The corresponding pixel position.
   */
  protected getPixelPos(percentagePos: Coords): PixelCoords {
    return {
      x: this.horPixels(percentagePos.x),
      y: this.verPixels(percentagePos.y),
    };
  }

  /**
   * Calculates the pixel size of an object within the canvas based on a percentage size.
   
   * @param percentagePos - The percentage size.
  * @returns - The corresponding pixel size.
  */
  protected getPixelSize(percentageSize: Size): PixelSize {
    return {
      w: this.horPixels(percentageSize.w),
      h: this.verPixels(percentageSize.h),
    };
  }

  protected getFontSize(size: FontSizes) {
    return this.horPixels(fontSizes[size]);
  }

  protected setFontSize(size: FontSizes) {
    this.ctx.font = `${this.getFontSize(size)}px ${this.fontFamily}`;
  }

  protected clearScreen() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "#000";
    this.drawBackground();
  }

  protected drawBackground() {
    const { ctx } = this;
    ctx.save();

    const size = this.horPixels(1);
    const radius = size / 2;

    const center = size / 2;
    const gradient = this.ctx.createRadialGradient(
      center,
      center,
      radius / 3,
      center,
      center,
      radius
    );
    gradient.addColorStop(0, "#222");
    gradient.addColorStop(0.8, "#000");

    ctx.scale(this.canvasWidth / size, this.canvasHeight / size);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    ctx.restore();
  }

  /** Cleans screen's side effects such as event handlers, dom nodes and so on. */
  public cleanUp() {
    this.mobileButtons.textContent = "";
    this.mobileButtons.remove();
    this.unregisterFunctions.forEach((f) => f());
    this.unregisterFunctions = [];
  }

  protected drawPieces(
    pieces: IIterablePieces,
    pieceSize: PixelSize,
    color = "#fff"
  ) {
    this.ctx.fillStyle = color;
    const { w, h } = pieceSize;
    for (const { piece, row, column } of pieces) {
      if (!piece) continue;
      this.ctx.fillRect(column * w, row * h, w, h);
    }
  }

  /**
   * @param volume - The current volume.
   * @param pos - The position of the hint, left and top edges.
   */
  protected drawVolumeHint(volume: number, pos: Coords) {
    const { x, y } = this.getPixelPos(pos);

    const { ctx } = this;
    ctx.save();
    this.setFontSize("sm");
    ctx.textAlign = "start";
    ctx.textBaseline = "top";

    ctx.translate(x, y);

    const iconW = this.horPixels(3),
      volumeText = `| ${Math.round(volume * 100)}`,
      { fontBoundingBoxDescent } = ctx.measureText(volumeText),
      gap = this.horPixels(1);

    ctx.drawImage(soundIcon, 0, 0, iconW, fontBoundingBoxDescent);
    ctx.translate(iconW + gap, 0);
    ctx.fillText(volumeText, 0, 0);
    ctx.restore();
  }
}
