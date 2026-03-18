# Vibe Coding Pro (Vibe Workflow)

This project’s **Coding (Pro)** mode generates a **master prompt** (in English) that tells a downstream coding agent to behave like an *independent engineering agent* instead of a “command executor”.

The app outputs a JSON object with:
- `englishPrompt`: the master prompt (copy/paste to another AI agent)
- `arabicSummary`: a short Arabic logic/verification summary shown in the UI

## The Vibe Workflow (mandatory 4 phases)

### Phase 1: Read
Before changing anything, the downstream agent must:
- Read `what to build.md` (product intent)
- Inspect the repo (`src/`) and relevant docs (`docs/`)
- Identify architecture patterns, state/data flows, and where bugs/risks are likely to appear
- Prioritize reading that matches the selected **Focus Area**

### Phase 2: Plan
The downstream agent must produce:
- A file-level roadmap (what changes, where, and why)
- Acceptance criteria (what “done” means)
- Risk list + mitigations (security/performance/test brittleness)

### Phase 3: Ask (Clarify & Stop)
If the request is ambiguous or missing critical constraints, the downstream agent must:
- Ask up to 5 clarifying questions
- STOP and wait for answers

Only proceed without questions when the plan remains safe and verifiable.

### Phase 4: Meta-Prompt Engineering (Skill Injection + Execute)
The downstream agent must convert the plan into an execution instruction set and apply “skill units”:
- Security Hardening Unit
- Performance Unit
- Testing Unit
- Architecture Unit

Finally, it must include explicit verification commands/tests appropriate for the selected **Technical Environment**.

## Categorization Strategy (derived from Goal)

- `implementation` => Development Mode: build the feature end-to-end.
- `logic-fix` => Fix/Audit Mode: reproduce, trace root cause, fix, and prevent regression.
- `optimize` => Ultimate Goal: optimize with evidence and avoid behavior changes.

## Evolution Log (local growth)

In the Coding (Pro) workspace you can add **Evolution Notes**.

After each Coding (Pro) run, the app stores an entry locally in `localStorage` (your browser only):
- timestamp
- selected focus + goal
- the returned `arabicSummary`
- your optional Evolution Notes (if provided)

On the next Coding (Pro) generation, the app injects an `[EVOLUTION_CONTEXT]` block into the Arabic input so the downstream agent can:
- incorporate lessons learned into Phase 2 acceptance criteria
- avoid repeating prior mistakes

## Quick-start
1. Choose **Mode: Coding (Pro)**
2. Choose **Goal** and **Focus Area**
3. Paste your Arabic requirements
4. (Optional) Add Evolution Notes for the next run
5. Click **إصدار الأمر البرمجي المعزز**
6. Copy `englishPrompt` and use it in your favorite coding agent (Claude Code, Gemini, etc.)

