# 🧩 Tower of Hanoi (Monochrome Edition)

Minimal, fast Tower of Hanoi built with **Vite**, **TypeScript**, and a custom **monochrome CSS** theme. Supports drag (desktop) and tap (mobile) with basic accessibility and offline (PWA) capability.

![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-latest-646CFF) ![PWA](https://img.shields.io/badge/PWA-Ready-black) ![Mode](https://img.shields.io/badge/Theme-Monochrome-lightgray)

## ✨ Current Features

- 🎨 Pure monochrome UI (no Tailwind at runtime; handcrafted CSS)
- 🖱️ Desktop: drag top disk OR click towers
- 📱 Mobile / Touch: tap source → tap destination (one‑time help banner)
- 🔁 Dynamic orientation handling (portrait towers stack vertically)
- 📦 Difficulty 3–5 disks (6 removed for small‑screen vertical fit)
- 🧠 Move counter + optimal move display
- 🚫 Invalid move feedback: red flash + subtle shake + haptic (where supported)
- ♿ ARIA roles + live region announcements (baseline)
- 🔌 PWA: service worker caching core assets (v1.0.1)
- 🖼️ Unified icon set (mono / simple / mask) + correct favicon references

## 🗺️ Near‑Term Roadmap

1. Persist dismissal of touch help (localStorage)
2. Keyboard controls (Arrow / Enter / Esc)
3. Focus styling & tab order improvements
4. Centralize and validate max disk enforcement (URL params)
5. Introduce `BaseComponent` abstraction then extract `Disk`, `Tower`, `GameHeader`

## 🚀 Quick Start

```bash
git clone https://github.com/appunni/toh.git
cd toh
npm install
npm run dev
# Open http://localhost:3000/toh/
```

## 🎮 How to Play

**Goal**: Move the full stack to the Destination tower using the fewest moves (optimal = 2^n - 1).

**Rules**: Move one disk at a time. Only the top disk of a tower may be moved. No larger disk on a smaller disk.

## 🛠️ Tech Stack

- Vite + ESBuild dev pipeline
- TypeScript game + UI logic (`TowerOfHanoi.ts`, `UIRenderer.ts`)
- Custom CSS (`style.css`) – no utility framework at runtime
- Service Worker (`public/sw.js`) for offline shell

## 📁 Structure

```
public/
  icons/ (mono, simple, mask)
  manifest.json
  sw.js              # Service worker (v1.0.1 cache)
src/
  TowerOfHanoi.ts    # Game state & move rules
  UIRenderer.ts      # Monolithic legacy renderer (to be split)
  utils/viewport.ts  # Layout mode detection (data-layout attr)
  style.css          # Monochrome styling
  main.ts            # App bootstrap
```

## ♿ Accessibility (Baseline)

- Towers rendered as grouped regions with labels (SRC/AUX/DST)
- Live region announces picks & moves
- Needs: keyboard interaction, focus indicators, motion preference respect

## 🔒 Security / Hardening

- CSP meta tag restricting scripts/styles to self
- Service Worker limits scope to `/toh/` & same origin
- Minimal external surface (no third‑party scripts)

(Planned) Additional: stricter runtime validation, error boundaries, analytics opt‑in.

## 🧪 Testing (Upcoming)

Planned introduction of unit tests for `TowerOfHanoi` logic and component tests post‑extraction.

## 🏗️ Modernization Phases (Planned)

1. Component extraction (Disk, Tower, Header)
2. Reactive Store (undo/redo, persistence)
3. Device‑adaptive dedicated layouts
4. Performance / code splitting / metrics
5. Deployment & CI (lint, test, build, PWA audits)

## 📦 Build Scripts

- `npm run dev` – Dev server
- `npm run build` – Production build
- `npm run preview` – Preview dist

## 📄 License

MIT – see [LICENSE](LICENSE).

---

Enjoy the puzzle! Minimal now – structured for progressive modernization.
