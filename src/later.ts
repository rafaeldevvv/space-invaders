// you already have it in index.ts
interface Coords {
  x: number;
  y: number;
}

interface TextualDrawingOptions {
   baseline?: CanvasTextBaseline;
   align?: CanvasTextAlign;
   color: string;
   size?: number;
   family?: string;
   maxWidth?: number;
 }
 
 function drawText(
   ctx: CanvasRenderingContext2D,
   text: string,
   pos: Coords,
   {
     color = "#fff",
     align = "start",
     baseline = "alphabetic",
     size = 16,
     family = "Arial, sans-serif",
     maxWidth,
   }: TextualDrawingOptions
 ) {
   if (baseline) {
     ctx.textBaseline = baseline;
   }
   if (align) {
     ctx.textAlign = align;
   }
   ctx.fillStyle = color;
   ctx.font = `${size}px ${family}`;
   ctx.fillText(text, pos.x, pos.y, maxWidth);
 }