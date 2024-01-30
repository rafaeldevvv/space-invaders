import { volumeFactor } from "@/audios";
import { elt } from "../utils";
import SoundIcon from "../images/sound-icon.png";

export default class MobileVolumeSlider {
  container: HTMLElement;
  input: HTMLInputElement;
  inputValue: HTMLElement;

  constructor(initialValue: number, onChange: (newVolume: number) => void) {
    this.input = elt("input", {
      oninput: (e) => {
        onChange(
          Number((e.target as EventTarget & { value: string }).value)
        );
      },
      value: initialValue.toString(),
      type: "range",
      className: "slider-container__slider",
      min: "0",
      max: "1",
      step: (volumeFactor).toString(),
      id: "volume-slider",
    });
    const percentage = Math.round(initialValue * 100) + "%";
    this.inputValue = elt("div", null, percentage);
    this.container = elt(
      "label",
      { className: "slider-container", htmlFor: "volume-slider" },
      elt("span", { className: "sr-only" }, "volume"),
      elt("img", {
        className: "slider-container__icon",
        src: SoundIcon,
        alt: "",
      }),
      this.input,
      this.inputValue
    );
  }

  /**
   * @param newVolume The new volume, which is a number from 0 to 1.
   */
  update(newVolume: number) {
    this.input.value = newVolume.toString();
    const percentage = Math.round(newVolume * 100) + "%";
    this.inputValue.textContent = percentage;
  }
}
