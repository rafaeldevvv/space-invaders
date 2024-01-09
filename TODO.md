- Split index.ts into many files for better organization
  - Explain the interfaces (just copy and paste tsdoc comments)
  - Improve the configuration of the game
- Commit "Break aplication down into multiple files and folders"

- Refactor everything, every class, every function, break classes down, remove methods and so on

- refactor the alien set configuration above the class (put the values in the prototype, you may see decorators)
- commit & update README
00000000000000000000
- refactor the player configuration above the class (put the values in the prototype)
- commit & update README

- Add visual clue to show player's resurrection
- commit & update README

- Increase Z alien's score to 40
- commit & update README

- Make boss score random (or don't, it doesn't make sense to be random)
- commit & update README

- Make boss be drawn after the esc message
- commit & update README

- Add Bullets collision
- commit & update README

- Refactor wall and rendering of explosion (too much repeated logic)
  - Create a class called IterablePieces with a `pieces` property and an interator interface
- commit & update README

- Implement score showing up when alien or boss is killed
- commit & update README

- Implement mobile controls
  - You might need to change your approach regarding the keys
    - Idea 1: Actions instead of keys.
  - When you implement the styles for the mobile buttons, put them into 
  a css file inside src and import it into the ts file, so that the code is contained within one file.
- commit & update README

- Improve controller
  - Make it take objects instead of constructors
  - Make it possible to pass the parent element to the controller
- commit & update README

- Improve view
  - Refactor it
- commit & update README for each one

- Improve alien set
  - Refactor it
  - Break it down, it's too big
- commit & update README for each one

- Make the assets, styles and so on (or maybe make something similar to the wall for the pixel art images)
  - Add images
  - Add sounds
  - Add font (vt323)
- commit & update README

- Add alien scores to start screen
- commit & update README

- Refactor the code
- commit & update README

- Read more about eslint, webpack and tsdoc

- Remember to try using webpack to load assets such as css and images
- commit & update README

- Minify the code (look for an html plugin for that)
- commit & update README

- See more tags available for TSDoc comments.
- commit & update README

- Put the code on codepen.


- Generate TSDoc docs
  - npx typedoc _path_
- commit & update README

- Add screenshots
- commit & update README

- Update the code snippets of `README.md` file
- commit