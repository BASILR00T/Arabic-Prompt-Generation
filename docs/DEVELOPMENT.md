# Development Guide

## Local setup
1. Install dependencies:
   - `npm install`
2. Create `.env.local` in the repo root:
   - `VITE_GEMINI_API_KEY=your_gemini_api_key_here`
3. Start the dev server:
   - `npm run dev`

## Project structure (high signal)
- `src/App.jsx`: Main single-page UI + Gemini request/response handling.
- `src/index.css`: Tailwind + project theme + shared styles.
- `what to build.md`: Product spec and UX requirements.

## How the Gemini call works
- `src/App.jsx` function `fetchEnhancedPrompt()`:
  - sends the user Arabic requirements to Gemini (`generateContent`)
  - uses a system instruction that forces a JSON response contract
  - parses/validates the model output before updating the UI

## Workspace panel UX (Input vs Output)
The Workspace avoids long page scroll by showing **either**:
- `Requirements Input` panel (requirements + mode settings + Quick Templates)
- `Final Infrastructure Code` panel (output + verification summary)

In code:
- `workspacePanel` state controls which panel is rendered.
- After a successful generation, the UI switches to the `output` panel automatically.

## Coding Pro (Vibe) v3.0
Coding (Pro) uses a Vibe Coding Pro v3.0 style system instruction that generates a master prompt for downstream coding agents:
- Read -> Plan -> Ask (clarify & stop) -> Meta-Prompt Engineering (skill injection + verification)

See: [`docs/VIBE_CODING_PRO.md`](docs/VIBE_CODING_PRO.md)

## Adding a new UX mode or focus area
1. Update the mode tabs in `src/App.jsx` (workspace header).
2. Ensure `fetchEnhancedPrompt()` includes the selected `Mode:` in the system instruction.
3. Update the focus grid so `options.focus` is one of:
   - `Logic`, `UI`, `Security`, `Optimization`, `Testing`, `Architecture`

## Quick Templates configuration
Quick Templates (the “مكتبة الأوامر السريعة” cards) are data-driven instead of hard-coded.
- Source of truth: `src/config/vibeModeConfig.json`
- Each template declares which `promptTypes` it belongs to (so the library is mode-accurate).

