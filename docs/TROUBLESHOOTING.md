# Troubleshooting

## Blank page / nothing renders
Check the browser console for build/parse errors.

Common causes in this project:
- Duplicate declarations in `src/App.jsx` (fixed by keeping the Gemini helper components valid).

Quick checks:
- Run `npm run build` to surface compile errors.
- Ensure you’re not editing generated bundles.

## “Missing Gemini API key”
`src/App.jsx` throws this when `VITE_GEMINI_API_KEY` is not set.

Fix:
- Create/update `.env.local` in the repo root:
  - `VITE_GEMINI_API_KEY=...`
- Restart the dev server.

## JSON contract validation failed
If Gemini returns a non-JSON string, the JSON parser may fail.

What to do:
- Verify the user input isn’t empty.
- Ensure you’re connected and Gemini is reachable.
- Re-run generation; the app tries multiple Gemini model candidates.

## Copy to clipboard does nothing
- Some browsers require HTTPS or user interaction for clipboard access.
- Click the “copy” button again after the output renders.

