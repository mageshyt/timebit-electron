import focusImg from "./oled/focus.txt?raw";
import shortBreakImg from "./oled/short_break.txt?raw";
import longBreakImg from "./oled/long_break.txt?raw";
import defaultImg from "./oled/default.txt?raw";
import hydrationImg from "./oled/hydration.txt?raw";
import completedImg from "./oled/completed.txt?raw";

export const OLED_IMAGES = {
  focus: focusImg.trim(),
  shortBreak: shortBreakImg.trim(),
  longBreak: longBreakImg.trim(),
  default: defaultImg.trim(),
  hydration: hydrationImg.trim(),
  completed: completedImg.trim(),
};
