# CRT Emulator Overlay AGENTS

Project-specific instructions for `~/Code/crt-emulator-overlay`.

## Project Goal

Build a Windows-first desktop app that presents a Samsung-style early-2000s CRT shell around emulator gameplay.

The first implementation target is:
- Transparent overlay shell above a live emulator window
- Samsung-inspired TV body and button layout
- `POWER`, `CH +/-`, `VOL +/-`, and `MENU` interactions
- ROM scanning plus favorite channel slots
- Automatic emulator window placement inside the CRT screen cutout
- Basic in-shell CRT treatment first

Keep these follow-up phases in mind, but do not fold them into the first implementation unless explicitly requested:
- Phase 1.5: integrate higher-fidelity shader tools
- Future phase: capture the emulator window into the app itself instead of using the lower-latency overlay approach

## Product Decisions

- Platform: Windows only for v1
- TV style: single Samsung-inspired set for v1
- Render strategy: overlay shell over the emulator window
- Channel behavior: favorite game slots
- Setup model: ROM folder scanning
- Input model: mouse plus hotkeys
- Power behavior: boot/shut down the shell with off/static/live transitions, without closing the emulator
- Volume behavior: adjust Windows system volume
- Menu scope: library browser, favorite assignment, and display settings

## Preferred Stack

- Desktop shell: `Electron`
- Language: `TypeScript`
- UI: HTML/CSS plus a lightweight renderer for screen effects
- Process orchestration: Electron main process
- Settings storage: JSON file in the project app data area
- Emulator launch control: per-emulator command templates
- Window management: Windows-specific layer or helper if Electron-only APIs are not sufficient

## Basic CRT Effect Scope

The first CRT pass should be intentionally modest and shell-driven:
- Curved screen mask
- Scanline overlay
- Glow/bloom layer
- Vignette and subtle tube darkening
- Static/noise during power transitions
- Light wobble or instability

Do not claim phosphor-accurate CRT simulation in v1. That belongs in the shader integration phase after the shell is working.

## Before Implementation Starts

We should have the following ready before real feature work begins:

- `Node.js 22 LTS`
- `npm` or `pnpm`
- A Windows 10 or Windows 11 machine for development or at minimum for live testing
- Installed emulator executables for the systems we want to support first:
  - `PCSX2`
  - `Dolphin` and/or `PrimeHack`
  - `Mesen`
- ROM folders available locally for scanning
- The actual image files for the hand-drawn sketch and Samsung CRT reference, so they can live in the vault/project attachments cleanly

These are likely needed soon after scaffolding:
- A decision on package manager: `npm` unless the user asks for `pnpm`
- A Windows-safe way to detect and reposition external emulator windows
- Test ROMs or legally owned backups the user is comfortable using during development

## Working Rules

- Keep the implementation Windows-first and avoid premature cross-platform abstractions.
- Preserve the Samsung TV illusion; do not drift into a generic launcher UI.
- Favor small, reviewable commits and verify behavior as features land.
- When a design choice could increase latency, prefer the lower-latency option unless the user explicitly chooses otherwise.
- If a feature requires native Windows APIs, isolate that code behind a narrow interface so the future capture-in-app version is easier to explore.

## Early Milestones

1. Scaffold Electron + TypeScript app.
2. Render the static Samsung TV shell.
3. Add power-on/off animation states.
4. Add emulator launch and ROM scan plumbing.
5. Auto-place emulator windows behind the CRT cutout.
6. Add menu, favorite channels, and settings persistence.
7. Polish the basic CRT overlay layers.
