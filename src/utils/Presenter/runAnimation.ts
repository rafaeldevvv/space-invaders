/**
 * Runs an animation.
 *
 * @param callback - A function to be called everytime a frame can be painted to the screen.
 */
export default function runAnimation(callback: (timeStep: number) => boolean) {
   let lastTime: null | number = null;
 
   /**
    * A function that manages each frame of the animation.
    *
    * @param time - The current time since the application started.
    */
   function frame(time: number) {
     let shouldContinue: boolean;
 
     if (lastTime) {
       const timeStep = Math.min(time - lastTime, 100) / 1000;
       lastTime = time;
 
       shouldContinue = callback(timeStep);
     } else {
       lastTime = time;
       shouldContinue = true;
     }
 
     if (shouldContinue) requestAnimationFrame(frame);
   }
   requestAnimationFrame(frame);
 }