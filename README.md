# CRT Emulator Overlay

Windows-first desktop app for wrapping emulator gameplay in a Samsung-style early-2000s CRT shell.

## Current Status

This repository currently contains:
- Electron + TypeScript scaffold
- Samsung-inspired CRT shell prototype UI
- Placeholder `POWER`, `CH`, `VOL`, and `MENU` interactions
- Build and typecheck setup

Planned next phases:
- Add a proper TDD test harness
- Move renderer behavior behind testable public interfaces
- Implement ROM scanning and emulator launch plumbing
- Add Windows window placement for external emulator windows
- Replace placeholder CRT behavior with real shell state and settings

## Stack

- Electron
- TypeScript
- esbuild

## Getting Started

Requirements:
- Node.js 22+
- npm 10+

Install dependencies:

```bash
npm install
```

Build the app:

```bash
npm run build
```

Run typecheck:

```bash
npm run typecheck
```

Start the current prototype:

```bash
npm run dev
```

## Project Direction

The v1 target is a transparent overlay shell above a live emulator window, with:
- Favorite-channel style game switching
- ROM folder scanning
- Mouse + hotkey interaction
- System volume control
- Menu-driven library and display settings

The first CRT pass is intentionally lightweight and shell-driven. Higher-fidelity shader integration comes after the shell workflow is stable.
