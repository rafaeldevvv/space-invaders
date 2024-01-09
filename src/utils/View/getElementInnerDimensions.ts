/**
 * Calculates the size of an HTML Element excluding padding, border and margin
 *
 * @param element
 * @returns - The size of the element excluding padding, border and margin
 */
export default function getElementInnerDimensions(element: HTMLElement): Size {
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