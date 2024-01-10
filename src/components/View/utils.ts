import { PixelSize, MappedObjectFromUnion } from "@/ts/types";

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