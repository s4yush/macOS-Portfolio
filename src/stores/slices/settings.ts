import type { StateCreator } from "zustand";

// Accent colors accept a preset name or a custom hex value.
export type AccentColorKey =
  | "blue" | "purple" | "pink" | "red"
  | "orange" | "yellow" | "green" | "graphite";

export type AccentColor = AccentColorKey | string;

export const ACCENT_HEX: Record<AccentColorKey, string> = {
  blue: "#007AFF",
  purple: "#AF52DE",
  pink: "#FF2D55",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  graphite: "#8E8E93",
};

export type DockPosition = "bottom" | "left" | "right";

export interface WallpaperSet {
  id: string;
  name: string;
  day: string;
  night: string;
  thumbnail?: string;
}

export const wallpaperSets: WallpaperSet[] = [
  {
    id: "tahoe",
    name: "macOS Tahoe",
    day: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
  },
  {
    id: "tahoe-light",
    name: "Tahoe Light",
    day: "wallpapers/macOS_Tahoe_LightDefault.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/macOS_Tahoe_LightDefault.jpg",
  },
  {
    id: "tahoe-beach",
    name: "Tahoe Beach",
    day: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    night: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
    thumbnail: "wallpapers/DefaultAerial_Tahoe_Beach.jpg",
  },
  {
    id: "ventura",
    name: "macOS Ventura",
    day: "img/ui/macOS-ventura-light.jpg",
    night: "img/ui/macOS-ventura-dark.jpg",
    thumbnail: "img/ui/macOS-ventura-light.jpg",
  },
];

export interface SettingsSlice {
  wallpaperSets: WallpaperSet[];
  activeWallpaperSet: string;
  setActiveWallpaperSet: (id: string) => void;
  /** @deprecated Use activeWallpaperSet instead. */
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  getWallpaper: () => WallpaperSet;

  accentColor: string;
  setAccentColor: (color: string) => void;
  getAccentHex: () => string;

  dockPosition: DockPosition;
  setDockPosition: (pos: DockPosition) => void;
  dockAutoHide: boolean;
  setDockAutoHide: (v: boolean) => void;

  notificationSound: string;
  setNotificationSound: (sound: string) => void;
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

export const createSettingsSlice: StateCreator<SettingsSlice> = (set, get) => ({
  wallpaperSets,
  activeWallpaperSet: loadSetting("activeWallpaperSet", "tahoe"),
  setActiveWallpaperSet: (id) => {
    saveSetting("activeWallpaperSet", id);
    saveSetting("wallpaperId", id);
    set({ activeWallpaperSet: id, wallpaperId: id });
  },
  /** @deprecated Use activeWallpaperSet instead. */
  wallpaperId: loadSetting("wallpaperId", "tahoe"),
  setWallpaperId: (id) => {
    saveSetting("wallpaperId", id);
    saveSetting("activeWallpaperSet", id);
    set({ wallpaperId: id, activeWallpaperSet: id });
  },
  getWallpaper: () => {
    const id = get().activeWallpaperSet;
    return wallpaperSets.find((w) => w.id === id) ?? wallpaperSets[0];
  },

  accentColor: loadSetting("accentColor", "#007AFF"),
  setAccentColor: (color) => {
    const hex = ACCENT_HEX[color as AccentColorKey] ?? color;
    saveSetting("accentColor", hex);
    set({ accentColor: hex });
    document.documentElement.style.setProperty("--accent-primary", hex);
  },
  getAccentHex: () => {
    const color = get().accentColor;
    return ACCENT_HEX[color as AccentColorKey] ?? color;
  },

  dockPosition: loadSetting("dockPosition", "bottom" as DockPosition),
  setDockPosition: (pos) => {
    saveSetting("dockPosition", pos);
    set({ dockPosition: pos });
  },

  dockAutoHide: loadSetting("dockAutoHide", false),
  setDockAutoHide: (v) => {
    saveSetting("dockAutoHide", v);
    set({ dockAutoHide: v });
  },

  notificationSound: loadSetting(
    "notificationSound",
    "music/Samantha (Legacy)-2024_08_12-6.wav"
  ),
  setNotificationSound: (sound) => {
    saveSetting("notificationSound", sound);
    set({ notificationSound: sound });
  },
});
