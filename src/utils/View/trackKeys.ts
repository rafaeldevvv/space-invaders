/**
 * Keeps track of which keyboard keys are currently held down.
 *
 * @param keys - An array of strings representing key names.
 * @returns - An object whose property names are the strings within `keys` and values are booleans.
 */
export default function trackKeys<Type extends string>(
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