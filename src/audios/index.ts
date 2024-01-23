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

function checkAndPlay(media: HTMLMediaElement) {
  if (media.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
    media.currentTime = 0;
    media.play();
  }
}

function repeat(media: HTMLMediaElement) {
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

const audios = {
  explosion() {
    checkAndPlay(explosion);
  },
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
  alienKilled() {
    checkAndPlay(alienKilled);
  },
  shoot() {
    checkAndPlay(shoot);
  },
  boss_highpitch() {
    checkAndPlay(boss_highpitch);
    return repeat(boss_highpitch);
  },
  boss_lowpitch() {
    checkAndPlay(boss_lowpitch);
    return repeat(boss_lowpitch);
  },
};

export default audios;
