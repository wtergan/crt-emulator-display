type PowerState = "off" | "booting" | "live";

const channelPresets = [
  {
    title: "PCSX2 favorite slot",
    description: "Future active game slot for PS2 launches and window placement."
  },
  {
    title: "Dolphin or PrimeHack slot",
    description: "Reserved for GameCube and Wii favorites with channel-style switching."
  },
  {
    title: "Mesen retro slot",
    description: "Home for scanned NES, SNES, and handheld favorites after the library pass."
  }
];

const crtScreen = document.querySelector<HTMLElement>("#crt-screen");
const title = document.querySelector<HTMLElement>("#screen-title");
const description = document.querySelector<HTMLElement>("#screen-description");
const chip = document.querySelector<HTMLElement>("#channel-chip");
const menuOverlay = document.querySelector<HTMLElement>("#menu-overlay");
const lamp = document.querySelector<HTMLElement>("#status-lamp");

const state = {
  power: "off" as PowerState,
  channel: 0,
  menuOpen: false
};

function render() {
  if (!crtScreen || !title || !description || !chip || !menuOverlay || !lamp) {
    return;
  }

  const preset = channelPresets[state.channel];
  chip.textContent = `CH ${String(state.channel + 1).padStart(2, "0")}`;

  crtScreen.classList.remove("screen-off", "screen-booting", "screen-live");
  crtScreen.classList.add(`screen-${state.power}`);
  menuOverlay.classList.toggle("hidden", !state.menuOpen || state.power === "off");
  lamp.classList.toggle("status-lamp-live", state.power === "live");

  if (state.power === "off") {
    title.textContent = "TV off";
    description.textContent =
      "This scaffold is ready for the launcher, ROM scan, and window placement layers.";
    return;
  }

  if (state.power === "booting") {
    title.textContent = "Powering on";
    description.textContent = "Static, glow, and wobble layers are staged here for the CRT startup sequence.";
    return;
  }

  title.textContent = preset.title;
  description.textContent = preset.description;
}

function togglePower() {
  if (state.power === "off") {
    state.menuOpen = false;
    state.power = "booting";
    render();
    window.setTimeout(() => {
      state.power = "live";
      render();
    }, 900);
    return;
  }

  state.menuOpen = false;
  state.power = "off";
  render();
}

function changeChannel(delta: number) {
  state.channel = (state.channel + delta + channelPresets.length) % channelPresets.length;
  render();
}

function adjustVolume(delta: number) {
  const direction = delta > 0 ? "up" : "down";
  if (description && state.power === "live") {
    description.textContent = `Volume ${direction} placeholder. This will map to Windows system volume in the real shell.`;
  }
}

function toggleMenu() {
  if (state.power !== "live") {
    return;
  }

  state.menuOpen = !state.menuOpen;
  render();
}

document.querySelector("#power-toggle")?.addEventListener("click", togglePower);
document.querySelector("#ch-down")?.addEventListener("click", () => changeChannel(-1));
document.querySelector("#ch-up")?.addEventListener("click", () => changeChannel(1));
document.querySelector("#vol-down")?.addEventListener("click", () => adjustVolume(-1));
document.querySelector("#vol-up")?.addEventListener("click", () => adjustVolume(1));
document.querySelector("#menu-toggle")?.addEventListener("click", toggleMenu);

window.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "p":
      togglePower();
      break;
    case "[":
      changeChannel(-1);
      break;
    case "]":
      changeChannel(1);
      break;
    case "m":
      toggleMenu();
      break;
    default:
      break;
  }
});

render();
