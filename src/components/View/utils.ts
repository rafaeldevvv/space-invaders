import { PixelSize, MappedObjectFromUnion, PixelCoords } from "@/ts/types";

/**
 * Calculates the size of an HTML Element excluding padding, border and margin
 *
 * @param element
 * @returns - The size of the element excluding padding, border and margin
 */
export function getElementInnerDimensions(element: HTMLElement): PixelSize {
  const cs = getComputedStyle(element);

  const paddingY =
    parseFloat(cs.paddingBlockStart) + parseFloat(cs.paddingBlockEnd);
  const paddingX =
    parseFloat(cs.paddingInlineStart) + parseFloat(cs.paddingInlineEnd);

  const marginY =
    parseFloat(cs.marginBlockStart) + parseFloat(cs.marginBlockEnd);
  const marginX =
    parseFloat(cs.marginInlineStart) + parseFloat(cs.marginInlineEnd);

  return {
    w: element.offsetWidth - paddingX - marginX,
    h: element.offsetHeight - paddingY - marginY,
  };
}

/**
 * Keeps track of which keyboard keys are currently held down.
 *
 * @param keys - An array of strings representing key names.
 * @returns - An object whose property names are the strings within `keys` and values are booleans.
 */
export function trackKeys<Type extends string>(
  keys: Type[]
): MappedObjectFromUnion<Type, boolean> {
  const down = {} as MappedObjectFromUnion<Type, boolean>;
  keys.forEach((key) => (down[key] = false));

  function onPressKey(e: KeyboardEvent) {
    for (const key of keys) {
      if (e.key === key) {
        e.preventDefault();
        down[e.key as Type] = e.type === "keydown";
      }
    }
  }

  window.addEventListener("keydown", onPressKey);
  window.addEventListener("keyup", onPressKey);

  return down;
}

export interface TwinkleMessageOptions {
  /** pixel value */
  fontSize?: number;
  fontFamily?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  color?: string;
}

/**
 * Draws a message that appears and disappears on the screen.
 *
 * @param ctx - The canvas 2D rendering context.
 * @param message - The message.
 * @param pos - The position of the message.
 * @param param3 - The options to customize the message.
 */
export function drawTwinkleMessage(
  ctx: CanvasRenderingContext2D,
  message: string,
  pos: PixelCoords,
  options?: TwinkleMessageOptions
) {
  const {
    fontSize = 16,
    fontFamily = "monospace",
    align = "center",
    baseline = "middle",
    color = "#fff",
  } = options || {};

  if (Math.round(performance.now() / 800) % 2 === 0) {
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.fillStyle = color;

    const { x, y } = pos;

    ctx.fillText(message, x, y);
  }
}
