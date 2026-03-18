# Gemini JSON Contract

## Required output (contract)
The app expects Gemini to return a JSON object with exactly these fields:

```json
{
  "englishPrompt": "string",
  "arabicSummary": "string"
}
```

`englishPrompt` is the final, structured English prompt the user can copy.

`arabicSummary` is a short Arabic logic/verification summary shown in the UI.

## What the app does in code
In `src/App.jsx`, `fetchEnhancedPrompt()`:
1. Sends the Arabic input plus a system instruction that forces the JSON contract.
2. Extracts the JSON by:
   - stripping code fences (e.g. ```json ... ```)
   - taking the first `{` and the last `}` found in the returned text
3. Validates types:
   - `englishPrompt` must be a string
   - `arabicSummary` must be a string
4. On validation failure, it tries the next model; if all fail, it surfaces the error.

## Example (shape)
```json
{
  "englishPrompt": "Build a production-ready ...",
  "arabicSummary": "تم تحسين ... مع التركيز على ..."
}
```

## Optional fields
The UI renders `suggestedTools` only if it exists, but the validation does NOT require it.

