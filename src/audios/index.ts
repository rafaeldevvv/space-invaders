import ExplosionAudio from "./explosion.wav";
import FastInvader1 from "./fastinvader1.wav";
import FastInvader2 from "./fastinvader2.wav";
import FastInvader3 from "./fastinvader3.wav";
import FastInvader4 from "./fastinvader4.wav";
import InvaderKilled from "./invaderkilled.wav";
import Shoot from "./shoot.wav";
import Boss_Highpitch from "./ufo_highpitch.wav";
import Boss_Lowpitch from "./ufo_lowpitch.wav";

const explosion = new Audio(ExplosionAudio),
  fastInvader1 = new Audio(FastInvader1),
  fastInvader2 = new Audio(FastInvader2),
  fastInvader3 = new Audio(FastInvader3),
  fastInvader4 = new Audio(FastInvader4),
  alienKilled = new Audio(InvaderKilled),
  shoot = new Audio(Shoot),
  boss_highpitch = new Audio(Boss_Highpitch),
  boss_lowpitch = new Audio(Boss_Lowpitch);

/**
 * Checks if media is loaded and plays it if it is.
 *
 * @param media - The media element.
 */
function checkAndPlay(media: HTMLMediaElement) {
  if (media.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
    media.currentTime = 0;
    media.play();
  }
}

/**
 * Sets up a media element so that it repeats on ending.
 *
 * @param media - The media element.
 * @returns - A function to stop the repeating process.
 */
function repeat(media: HTMLMediaElement) {
  checkAndPlay(media);
  const onEnd = () => {
    media.currentTime = 0;
    media.play();
  };

  media.addEventListener("ended", onEnd);
  return () => {
    media.currentTime = 0;
    media.pause();
    media.removeEventListener("ended", onEnd);
  };
}

/**
 * An object holding the functions to trigger the sounds of the game.
 */
const audios = {
  /** Triggers the player explosion sound. */
  explosion() {
    checkAndPlay(explosion);
  },
  /** Triggers the fast invader audio corresponding to the number passed in. */
  fastInvader(number: 1 | 2 | 3 | 4) {
    switch (number) {
      case 1: {
        checkAndPlay(fastInvader1);
        break;
      }
      case 2: {
        checkAndPlay(fastInvader2);
        break;
      }
      case 3: {
        checkAndPlay(fastInvader3);
        break;
      }
      case 4: {
        checkAndPlay(fastInvader4);
        break;
      }
    }
  },
  /** Triggers a sound for when an alien is killed. */
  alienKilled() {
    checkAndPlay(alienKilled);
  },
  /** Triggers a sound for when the player shoots. */
  shoot() {
    checkAndPlay(shoot);
  },
  /**
   * Triggers a high pitch sound for the boss.
   *
   * @returns - A function to stop the pitch.
   */
  boss_highpitch() {
    return repeat(boss_highpitch);
  },
  /**
   * Triggers a low pitch sound for the boss.
   *
   * @returns - A function to stop the pitch.
   */
  boss_lowpitch() {
    return repeat(boss_lowpitch);
  },
} as const;

export default audios;
