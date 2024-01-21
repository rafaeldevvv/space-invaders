const explosion = new Audio("./assets/audios/explosion.wav"),
  fastInvader1 = new Audio("./assets/audios/fastinvader1.wav"),
  fastInvader2 = new Audio("./assets/audios/fastinvader2.wav"),
  fastInvader3 = new Audio("./assets/audios/fastinvader3.wav"),
  fastInvader4 = new Audio("./assets/audios/fastinvader4.wav"),
  alienKilled = new Audio("./assets/audios/invaderkilled.wav"),
  shoot = new Audio("./assets/audios/shoot.wav"),
  boss_highpitch = new Audio("./assets/audios/ufo_highpitch.wav"),
  boss_lowpitch = new Audio("./assets/audios/ufo_lowpitch.wav");

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
  }
};

export default audios;
