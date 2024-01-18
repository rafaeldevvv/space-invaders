- Fix: Last score is being animated when you unpause the game

- take a a look at the rules of the game in some website
  - try this one: https://www.classicgaming.cc/classics/space-invaders/play-guide
  - Implement wiggly shots
  - When an invader's missile collides with a player's laser shot, the player's shot is always destroyed but the invader's missile occasionally survives, almost certainly if it is a wiggly missile.
  - The invaders travel sideways and each time they touch the side they drop down 1 line. On screen 1 they need to drop 11 lines to reach the bottom and 'invade'. From screen 2 through to screen 9 they start progressively lower down the screen. At screen 10 the game reverts to the screen 1 start position and the cycle begins again.
  - Any missiles dropped by an invader on the row above 'invasion' row will not harm the player's laser. This is a very important feature and one that must be fully exploited in order to obtain a high score. This will be dealt with in detail later.

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