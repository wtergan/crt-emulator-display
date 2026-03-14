export type PowerState = "off" | "booting" | "live";

export interface FavoriteChannel {
  id: string;
  title: string;
  system: string;
  emulator: string;
}

export type MenuSection = "guide" | "library" | "favorites" | "display";

export interface LibraryGame {
  id: string;
  title: string;
  system: string;
  emulator: string;
}

export interface DisplaySettings {
  curvature: number;
  scanlines: number;
  glow: number;
  staticAmount: number;
  wobble: number;
}

export interface ShellState {
  power: PowerState;
  currentChannelIndex: number;
  favorites: FavoriteChannel[];
  currentFavorite: FavoriteChannel;
  menuOpen: boolean;
  activeMenuSection: MenuSection;
  library: LibraryGame[];
  highlightedLibraryIndex: number;
  volume: number;
  display: DisplaySettings;
}

export interface ShellController {
  getState(): ShellState;
  togglePower(): void;
  completeBoot(): void;
  changeChannel(delta: number): void;
  toggleMenu(): void;
  highlightLibraryGame(index: number): void;
  assignHighlightedLibraryGameToFavorite(slotIndex: number): void;
  adjustVolume(delta: number): void;
  setDisplaySetting(setting: keyof DisplaySettings, value: number): void;
}

export function createShellController(): ShellController {
  const library: LibraryGame[] = [
    {
      id: "shadow-of-the-colossus",
      title: "Shadow of the Colossus",
      system: "PS2",
      emulator: "PCSX2"
    },
    {
      id: "wind-waker",
      title: "The Legend of Zelda: The Wind Waker",
      system: "GameCube",
      emulator: "Dolphin"
    },
    {
      id: "super-metroid",
      title: "Super Metroid",
      system: "SNES",
      emulator: "Mesen"
    },
    {
      id: "metroid-prime",
      title: "Metroid Prime",
      system: "GameCube",
      emulator: "PrimeHack"
    },
    {
      id: "super-mario-world",
      title: "Super Mario World",
      system: "SNES",
      emulator: "Mesen"
    }
  ];

  const favorites: FavoriteChannel[] = [
    library[0],
    library[1],
    library[2]
  ];

  const state: ShellState = {
    power: "off",
    currentChannelIndex: 0,
    favorites,
    currentFavorite: favorites[0],
    menuOpen: false,
    activeMenuSection: "library",
    library,
    highlightedLibraryIndex: 0,
    volume: 20,
    display: {
      curvature: 0.76,
      scanlines: 0.52,
      glow: 0.44,
      staticAmount: 0.18,
      wobble: 0.1
    }
  };

  return {
    getState() {
      return {
        ...state,
        favorites: [...state.favorites],
        library: [...state.library],
        currentFavorite: state.favorites[state.currentChannelIndex]
      };
    },
    togglePower() {
      state.power = state.power === "off" ? "booting" : "off";
      state.menuOpen = false;
    },
    completeBoot() {
      if (state.power === "booting") {
        state.power = "live";
      }
    },
    changeChannel(delta) {
      if (state.power !== "live") {
        return;
      }

      state.currentChannelIndex =
        (state.currentChannelIndex + delta + state.favorites.length) % state.favorites.length;
      state.currentFavorite = state.favorites[state.currentChannelIndex];
    },
    toggleMenu() {
      if (state.power !== "live") {
        return;
      }

      state.menuOpen = !state.menuOpen;
      state.activeMenuSection = "library";
    },
    highlightLibraryGame(index) {
      if (index < 0 || index >= state.library.length) {
        return;
      }

      state.highlightedLibraryIndex = index;
    },
    assignHighlightedLibraryGameToFavorite(slotIndex) {
      if (slotIndex < 0 || slotIndex >= state.favorites.length) {
        return;
      }

      const highlightedGame = state.library[state.highlightedLibraryIndex];
      state.favorites[slotIndex] = highlightedGame;

      if (state.currentChannelIndex === slotIndex) {
        state.currentFavorite = highlightedGame;
      }
    },
    adjustVolume(delta) {
      if (state.power !== "live") {
        return;
      }

      state.volume = Math.max(0, Math.min(100, state.volume + delta));
    },
    setDisplaySetting(setting, value) {
      state.display = {
        ...state.display,
        [setting]: Math.max(0, Math.min(1, value))
      };
    }
  };
}
