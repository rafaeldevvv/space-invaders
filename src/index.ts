import Presenter from "@/components/Presenter";
import View from "@/components/View";
import State from "@/components/State";

new Presenter(State, View, document.body);

/* this is just a test */
/* only to start out the audios on iPhone */
import audios from "./audios";
const startAudio = () => {
  const stop = audios.boss_highpitch();
  setTimeout(() => {
    stop();
    window.removeEventListener("click", startAudio);
    window.removeEventListener("keydown", startAudio);
  }, 20);
};
window.addEventListener("click", startAudio);
window.addEventListener("keydown", startAudio);
