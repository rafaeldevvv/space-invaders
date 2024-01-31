import {
  PixelSize,
  MappedObjectFromUnion,
  PixelCoords,
  HTMLAttributes,
  Unregisterable
} from "@/ts/types";

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
  keys: Type[],
  onKeyChange?: (key: Type, pressed: boolean) => void
): MappedObjectFromUnion<Type, boolean> & Unregisterable {
  type ReturnedMap = MappedObjectFromUnion<Type, boolean>;
  
  const down = {} as ReturnedMap & Unregisterable;
  keys.forEach(
    (key) => ((down as MappedObjectFromUnion<Type, boolean>)[key] = false)
  );

  function onPressKey(e: KeyboardEvent) {
    for (const key of keys) {
      if (e.key === key) {
        e.preventDefault();
        const pressed = e.type === "keydown";
        (down as ReturnedMap)[e.key as Type] = pressed;
        if (onKeyChange) onKeyChange(key, pressed);
      }
    }
  }

  window.addEventListener("keydown", onPressKey);
  window.addEventListener("keyup", onPressKey);

  down.unregister = () => {
    window.removeEventListener("keydown", onPressKey);
    window.removeEventListener("keyup", onPressKey);
  };

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

export interface ProgressBarOptions {
  positiveColor?: string;
  negativeColor?: string;
}

/**
 * Draws a progress bar onto the canvas.
 *
 * @param ctx - The 2d context of the canvas.
 * @param progress - The progress, which has to be a value between 0 and 1.
 * @param pos - The pos of the progress bar in pixels.
 * @param size - The size of the progress bar in pixels.
 * @param options - Customization options for the progress bar.
 */
export function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  progress: number,
  pos: PixelCoords,
  size: PixelSize,
  options?: ProgressBarOptions
) {
  const { positiveColor = "limegreen", negativeColor = "gray" } = options || {};

  const positiveWidth = progress * size.w,
    negativeWidth = (1 - progress) * size.w;

  ctx.fillStyle = positiveColor;
  ctx.fillRect(pos.x, pos.y, positiveWidth, size.h);
  ctx.fillStyle = negativeColor;
  ctx.fillRect(pos.x + positiveWidth, pos.y, negativeWidth, size.h);
}

/* type ShallowHTMLAttributes = {
  className: string;
} & {
  [Event in keyof GlobalEventHandlersEventMap as `on${Event & string}`]+?: (
    event: GlobalEventHandlersEventMap[Event]
  ) => void;
}; */

/**
 * Creates an HTML element.
 * 
 * @param type - The type of the element
 * @param attrs - The attributes of the element.
 * @param children - The children of the element.
 * @returns - A specific HTML element for the type passed in.
 */
export function elt<Type extends keyof HTMLElementTagNameMap>(
  type: Type,
  attrs: HTMLAttributes | null,
  ...children: (Node | string)[]
): HTMLElementTagNameMap[Type] {
  const element = document.createElement(type);
  if (attrs) Object.assign(element, attrs);

  for (const child of children) {
    if (typeof child === "string") {
      element.textContent = child;
    } else {
      element.appendChild(child);
    }
  }

  return element;
}

/**
 * Finds a touch in a `TouchList`.
 * 
 * @param touches
 * @param id - The id of the touch to find.
 * @returns - The `Touch` whose id is the same as the value passed in 
 * for the if parameter or null if a `Touch` could not be found.
 */
export function findTouch(touches: TouchList, id: number) {
  for (let i = 0; i < touches.length; i++) {
    if (touches[i].identifier === id) return touches[i];
  }
  return null;
}

/**
 * Finds the first `Touch` in a `TouchList` that is not included in `ids`.
 * 
 * @param touches
 * @param ids - An array of Touch ids.
 * @returns - The untracked touch or null.
 */
export function findUntrackedTouch(touches: TouchList, ids: number[]) {
  for (let i = 0; i < touches.length; i++) {
    if (!ids.some((id) => id === touches[i].identifier)) return touches[i];
  }
  return null;
}

/**
 * Flips the 2d context of a {@link HTMLCanvasElement} horizontally.
 * 
 * @param context
 * @param around - The position to flip the context around.
 */
export function flipHorizontally(context: CanvasRenderingContext2D, around: number) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}