import type {
  DisplaySettings,
  LibraryGame,
  ShellController,
  ShellState
} from "../core/create-shell-controller";

const DISPLAY_LABELS: Record<keyof DisplaySettings, string> = {
  curvature: "Curvature",
  scanlines: "Scanlines",
  glow: "Glow",
  staticAmount: "Static",
  wobble: "Wobble"
};

export interface MountedShellApp {
  render(): void;
}

export interface MountShellAppOptions {
  bootDurationMs?: number;
}

const HOTKEY_CLEANUP_KEY = "__crtOverlayHotkeyCleanup";

export function mountShellApp(
  root: HTMLElement,
  controller: ShellController,
  options: MountShellAppOptions = {}
): MountedShellApp {
  const bootDurationMs = options.bootDurationMs ?? 900;
  let bootTimer: number | undefined;
  const browserWindow = root.ownerDocument.defaultView as (Window & {
    [HOTKEY_CLEANUP_KEY]?: () => void;
  }) | null;

  function scheduleBootCompletion() {
    if (controller.getState().power === "booting") {
      window.clearTimeout(bootTimer);
      bootTimer = window.setTimeout(() => {
        controller.completeBoot();
        render();
      }, bootDurationMs);
    }
  }

  function togglePower() {
    controller.togglePower();
    render();
    scheduleBootCompletion();
  }

  function render() {
    const state = controller.getState();
    applyDisplayVariables(root, state.display);
    root.innerHTML = createShellMarkup(state);
    bindInteractions();
  }

  function bindInteractions() {
    root.querySelector<HTMLButtonElement>("[data-action='power-toggle']")?.addEventListener("click", () => {
      togglePower();
    });

    root.querySelector<HTMLButtonElement>("[data-action='channel-down']")?.addEventListener("click", () => {
      controller.changeChannel(-1);
      render();
    });

    root.querySelector<HTMLButtonElement>("[data-action='channel-up']")?.addEventListener("click", () => {
      controller.changeChannel(1);
      render();
    });

    root.querySelector<HTMLButtonElement>("[data-action='volume-down']")?.addEventListener("click", () => {
      controller.adjustVolume(-5);
      render();
    });

    root.querySelector<HTMLButtonElement>("[data-action='volume-up']")?.addEventListener("click", () => {
      controller.adjustVolume(5);
      render();
    });

    root.querySelector<HTMLButtonElement>("[data-action='menu-toggle']")?.addEventListener("click", () => {
      controller.toggleMenu();
      render();
    });

    root.querySelectorAll<HTMLButtonElement>("[data-library-index]").forEach((button) => {
      button.addEventListener("click", () => {
        controller.highlightLibraryGame(Number(button.dataset.libraryIndex));
        render();
      });
    });

    root.querySelectorAll<HTMLButtonElement>("[data-favorite-slot]").forEach((button) => {
      button.addEventListener("click", () => {
        controller.assignHighlightedLibraryGameToFavorite(Number(button.dataset.favoriteSlot));
        render();
      });
    });

    root.querySelectorAll<HTMLInputElement>("[data-display-setting]").forEach((input) => {
      input.addEventListener("input", () => {
        const setting = input.dataset.displaySetting as keyof DisplaySettings;
        controller.setDisplaySetting(setting, Number(input.value));
        render();
      });
    });
  }

  browserWindow?.[HOTKEY_CLEANUP_KEY]?.();
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key.toLowerCase()) {
      case "p":
        togglePower();
        break;
      case "[":
        controller.changeChannel(-1);
        render();
        break;
      case "]":
        controller.changeChannel(1);
        render();
        break;
      case "m":
        controller.toggleMenu();
        render();
        break;
      case "-":
        controller.adjustVolume(-5);
        render();
        break;
      case "=":
        controller.adjustVolume(5);
        render();
        break;
      default:
        break;
    }
  };
  browserWindow?.addEventListener("keydown", handleKeydown);
  if (browserWindow) {
    browserWindow[HOTKEY_CLEANUP_KEY] = () => {
      browserWindow.removeEventListener("keydown", handleKeydown);
    };
  }

  render();

  return {
    render
  };
}

function createShellMarkup(state: ShellState): string {
  const screenCopy = getScreenCopy(state);

  return `
    <section class="app-shell app-shell--${state.power}" data-shell-app>
      <div class="room-backdrop"></div>

      <article class="samsung-tv" data-power-state="${state.power}">
        <div class="samsung-tv__cabinet">
          <div class="samsung-tv__wear"></div>
          <div class="samsung-tv__top-curve"></div>

          <section class="samsung-tv__screen-panel">
            <div class="samsung-tv__inner-bezel">
              <div class="tube" data-screen-state="${state.power}">
                <div class="tube__phosphor"></div>
                <div class="tube__noise"></div>
                <div class="tube__scanlines"></div>
                <div class="tube__glare"></div>

                <div class="tube__content">
                  <div class="tube__topbar">
                    <span class="screen-chip screen-chip--system" data-emulator-chip>${escapeHtml(state.currentFavorite.system)} via ${escapeHtml(state.currentFavorite.emulator)}</span>
                    <span class="screen-chip screen-chip--channel" data-channel-chip>CH ${String(state.currentChannelIndex + 1).padStart(2, "0")}</span>
                  </div>

                  <div class="tube__copy">
                    <p class="tube__eyebrow">${escapeHtml(screenCopy.eyebrow)}</p>
                    <h1 class="tube__title" data-screen-title>${escapeHtml(screenCopy.title)}</h1>
                    <p class="tube__description">${escapeHtml(screenCopy.description)}</p>
                  </div>

                  <div class="tube__status-row">
                    <span class="tube__status-pill">Volume ${String(state.volume).padStart(2, "0")}</span>
                    <span class="tube__status-pill">Favorites ${state.favorites.length}</span>
                  </div>
                </div>

                ${
                  state.menuOpen
                    ? `
                  <section class="osd-menu" data-menu-overlay>
                    <header class="osd-menu__header">
                      <p class="osd-menu__title">Library</p>
                      <div class="osd-menu__tabs">
                        <span class="osd-menu__tab osd-menu__tab--active">Library</span>
                        <span class="osd-menu__tab">Favorites</span>
                        <span class="osd-menu__tab">Display</span>
                      </div>
                    </header>

                    <div class="osd-menu__grid">
                      <section class="osd-panel">
                        <h2>Library</h2>
                        <div class="osd-list">
                          ${state.library
                            .map((game, index) =>
                              renderLibraryItem(game, index, index === state.highlightedLibraryIndex)
                            )
                            .join("")}
                        </div>
                      </section>

                      <section class="osd-panel">
                        <h2>Favorites</h2>
                        <div class="favorite-slots">
                          ${state.favorites
                            .map(
                              (favorite, index) => `
                                <button
                                  class="favorite-slot ${index === state.currentChannelIndex ? "favorite-slot--active" : ""}"
                                  data-favorite-slot="${index}"
                                  type="button"
                                >
                                  <span class="favorite-slot__channel">CH ${String(index + 1).padStart(2, "0")}</span>
                                  <strong>${escapeHtml(favorite.title)}</strong>
                                  <span>${escapeHtml(favorite.system)} / ${escapeHtml(favorite.emulator)}</span>
                                </button>
                              `
                            )
                            .join("")}
                        </div>
                      </section>

                      <section class="osd-panel">
                        <h2>Display</h2>
                        <div class="display-controls">
                          ${renderDisplaySliders(state.display)}
                        </div>
                      </section>
                    </div>
                  </section>
                `
                    : ""
                }
              </div>
            </div>
          </section>

          <section class="samsung-tv__brand-panel">
            <div class="samsung-tv__logo-wrap">
              <p class="samsung-tv__logo">SAMSUNG</p>
            </div>

            <div class="samsung-tv__controls">
              <div class="samsung-tv__button-group">
                <div class="samsung-tv__button-stack">
                  <span class="samsung-tv__button-label">MENU</span>
                  <button class="tv-button tv-button--small" data-action="menu-toggle" type="button" aria-label="Menu"></button>
                </div>

                <div class="samsung-tv__button-stack">
                  <span class="samsung-tv__button-label">VOL</span>
                  <div class="samsung-tv__button-pair">
                    <button class="tv-button tv-button--small" data-action="volume-down" type="button" aria-label="Volume down"></button>
                    <button class="tv-button tv-button--small" data-action="volume-up" type="button" aria-label="Volume up"></button>
                  </div>
                </div>

                <div class="samsung-tv__button-stack">
                  <span class="samsung-tv__button-label">CH</span>
                  <div class="samsung-tv__button-pair">
                    <button class="tv-button tv-button--small" data-action="channel-down" type="button" aria-label="Channel down"></button>
                    <button class="tv-button tv-button--small" data-action="channel-up" type="button" aria-label="Channel up"></button>
                  </div>
                </div>
              </div>

              <div class="samsung-tv__power-cluster">
                <div class="samsung-tv__standby">
                  <span class="samsung-tv__standby-text">STAND-BY / TIMER</span>
                  <span class="samsung-tv__lamp ${state.power === "live" ? "samsung-tv__lamp--live" : ""}"></span>
                </div>

                <div class="samsung-tv__power-block">
                  <span class="samsung-tv__power-label">POWER</span>
                  <button class="tv-button tv-button--power" data-action="power-toggle" type="button" aria-label="Power">
                    <span class="tv-button__power-icon"></span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </article>
    </section>
  `;
}

function renderLibraryItem(game: LibraryGame, index: number, isActive: boolean): string {
  return `
    <button
      class="library-item ${isActive ? "library-item--active" : ""}"
      data-library-index="${index}"
      data-library-item="${escapeHtml(game.id)}"
      type="button"
    >
      <strong>${escapeHtml(game.title)}</strong>
      <span>${escapeHtml(game.system)} / ${escapeHtml(game.emulator)}</span>
    </button>
  `;
}

function renderDisplaySliders(display: DisplaySettings): string {
  return Object.entries(display)
    .map(
      ([setting, value]) => `
        <label class="display-slider">
          <span>${DISPLAY_LABELS[setting as keyof DisplaySettings]}</span>
          <input
            data-display-setting="${setting}"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value="${value}"
          />
        </label>
      `
    )
    .join("");
}

function getScreenCopy(state: ShellState) {
  if (state.power === "off") {
    return {
      eyebrow: "Standby",
      title: "Samsung CRT",
      description: "Press POWER to warm up the tube and resume your favorite channel."
    };
  }

  if (state.power === "booting") {
    return {
      eyebrow: "Heating phosphors",
      title: "Warming up",
      description: "Static is rolling in while the overlay wakes the tube."
    };
  }

  return {
    eyebrow: "Favorite channel",
    title: state.currentFavorite.title,
    description: `${state.currentFavorite.system} through ${state.currentFavorite.emulator} with live channel switching and display tuning.`
  };
}

function applyDisplayVariables(root: HTMLElement, display: DisplaySettings) {
  root.style.setProperty("--display-curvature", display.curvature.toFixed(2));
  root.style.setProperty("--display-scanlines", display.scanlines.toFixed(2));
  root.style.setProperty("--display-glow", display.glow.toFixed(2));
  root.style.setProperty("--display-static", display.staticAmount.toFixed(2));
  root.style.setProperty("--display-wobble", display.wobble.toFixed(2));
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
