import ExplosionAudio from "./explosion.mp3";
import FastInvader1 from "./fastinvader1.mp3";
import FastInvader2 from "./fastinvader2.mp3";
import FastInvader3 from "./fastinvader3.mp3";
import FastInvader4 from "./fastinvader4.mp3";
import InvaderKilled from "./invaderkilled.mp3";
import Shoot from "./shoot.mp3";
import Boss_Highpitch from "./ufo_highpitch.mp3";
import Boss_Lowpitch from "./ufo_lowpitch.mp3";

export let volume = 1;

const explosion = new Audio(ExplosionAudio),
  fastInvader1 = new Audio(FastInvader1),
  fastInvader2 = new Audio(FastInvader2),
  fastInvader3 = new Audio(FastInvader3),
  fastInvader4 = new Audio(FastInvader4),
  alienKilled = new Audio(InvaderKilled),
  shoot = new Audio(Shoot),
  boss_highpitch = new Audio(Boss_Highpitch),
  boss_lowpitch = new Audio(Boss_Lowpitch);

const audiosArr = [
  explosion,
  fastInvader1,
  fastInvader2,
  fastInvader3,
  fastInvader4,
  alienKilled,
  shoot,
  boss_highpitch,
  boss_lowpitch,
];

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

export function setVolume(newVolume: number) {
  volume = newVolume;
  audiosArr.forEach((a) => (a.volume = newVolume));
}

setVolume(volume);

export const volumeFactor = 0.05;

export function turnUpVolume() {
  const v = Math.min(1, volume + volumeFactor);
  setVolume(v);
}

export function turnDownVolume() {
  const v = Math.max(0, volume - volumeFactor);
  setVolume(v);
}
