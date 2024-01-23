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
  protected unregisterFunctions: (() => void)[] = [];

  protected abstract mobileButtons: HTMLDivElement;

  protected abstract setUpControlMethods(): void;
  protected abstract createMobileControls(): void;
  public abstract syncState(state?: IGameState, timeStep?: number): void;

  protected fontFamily = "'VT323', monospace";

  protected ctx: CanvasRenderingContext2D;
  constructor(protected canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
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

  protected clearScreen() {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

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
}
