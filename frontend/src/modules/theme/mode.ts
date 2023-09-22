import { persist, retrieve } from "@/core/storage";
import { createObservable, notify } from "@externals/observables";

let _mode: ThemeMode;
const STORAGE_KEY = "darkMode";

const getDefaultDarkMode = (): boolean => retrieve(STORAGE_KEY) || false;

export class ThemeMode {
  static getInstance(): ThemeMode {
    return (_mode ??= new ThemeMode());
  }

  isDark: boolean = getDefaultDarkMode();

  switchMode() {
    this.isDark = !this.isDark;
    persist(STORAGE_KEY, this.isDark);
    notify(isDarkObservable, this.isDark);
  }

  get name(): string {
    return this.isDark ? "lightmode" : "darkmode";
  }

  get color(): string {
    return this.isDark ? "#4C5155" : "#C1C8CD";
  }
}

export const isDarkObservable = createObservable(
  ThemeMode.getInstance().isDark
);

export function getThemeMode() {
  return ThemeMode.getInstance();
}
