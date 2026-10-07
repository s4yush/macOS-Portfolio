import type { StateCreator } from "zustand";
import { enterFullScreen, exitFullScreen } from "~/utils";

export type AppearanceMode = "auto" | "light" | "dark";
export type IconStyle = "default" | "dark" | "clear" | "tinted";

export interface SystemSlice {
  dark: boolean;
  volume: number;
  brightness: number;
  wifi: boolean;
  bluetooth: boolean;
  airdrop: boolean;
  fullscreen: boolean;
  safariUrl: string;
  focusMode: boolean;
  appearanceMode: AppearanceMode;
  iconStyle: IconStyle;
  tintWindows: boolean;
  toggleDark: () => void;
  toggleWIFI: () => void;
  toggleBluetooth: () => void;
  toggleAirdrop: () => void;
  toggleFullScreen: (v: boolean) => void;
  toggleFocus: () => void;
  setVolume: (v: number) => void;
  setBrightness: (v: number) => void;
  setSafariUrl: (v: string) => void;
  setAppearanceMode: (v: AppearanceMode) => void;
  setIconStyle: (v: IconStyle) => void;
  setTintWindows: (v: boolean) => void;
}

const loadSetting = <T>(key: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(`macos-settings-${key}`);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const saveSetting = (key: string, value: unknown) => {
  try {
    localStorage.setItem(`macos-settings-${key}`, JSON.stringify(value));
  } catch {
    // Continue with in-memory settings when browser storage is blocked.
  }
};

// Automatic appearance currently defaults to light mode.
const resolveDark = (mode: AppearanceMode): boolean => mode === "dark";

const applyDarkClass = (dark: boolean) => {
  if (dark) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
};

const initialAppearanceMode = loadSetting<AppearanceMode>("appearanceMode", "light");
const initialDark = resolveDark(initialAppearanceMode);

export const createSystemSlice: StateCreator<SystemSlice> = (set) => ({
  dark: initialDark,
  volume: 50,
  brightness: 50,
  wifi: true,
  bluetooth: true,
  airdrop: true,
  fullscreen: false,
  safariUrl: "",
  focusMode: false,
  appearanceMode: initialAppearanceMode,
  iconStyle: loadSetting<IconStyle>("iconStyle", "default"),
  tintWindows: loadSetting<boolean>("tintWindows", true),
  toggleDark: () =>
    set((state) => {
      const next = !state.dark;
      applyDarkClass(next);
      const mode: AppearanceMode = next ? "dark" : "light";
      saveSetting("appearanceMode", mode);
      return { dark: next, appearanceMode: mode };
    }),
  toggleWIFI: () => set((state) => ({ wifi: !state.wifi })),
  toggleBluetooth: () => set((state) => ({ bluetooth: !state.bluetooth })),
  toggleAirdrop: () => set((state) => ({ airdrop: !state.airdrop })),
  toggleFullScreen: (v) =>
    set(() => {
      v ? enterFullScreen() : exitFullScreen();
      return { fullscreen: v };
    }),
  toggleFocus: () => set((state) => ({ focusMode: !state.focusMode })),
  setVolume: (v) => set(() => ({ volume: v })),
  setBrightness: (v) => set(() => ({ brightness: v })),
  setSafariUrl: (v) => set(() => ({ safariUrl: v })),
  setAppearanceMode: (v) =>
    set(() => {
      const dark = resolveDark(v);
      applyDarkClass(dark);
      saveSetting("appearanceMode", v);
      return { appearanceMode: v, dark };
    }),
  setIconStyle: (v) =>
    set(() => {
      saveSetting("iconStyle", v);
      return { iconStyle: v };
    }),
  setTintWindows: (v) =>
    set(() => {
      saveSetting("tintWindows", v);
      return { tintWindows: v };
    }),
});
