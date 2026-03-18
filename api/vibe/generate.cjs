const BASE_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

const ALLOWED_PROMPT_TYPES = new Set(["coding", "image", "writing", "general"]);
const ALLOWED_GOALS = new Set([
  "implementation",
  "logic-fix",
  "optimize",
  "concept",
  "design",
  "refine",
  "draft",
  "edit",
  "polish",
  "plan",
  "execute",
  "improve"
]);

function parseAllowedOrigins() {
  const raw = process.env.CORS_ALLOW_ORIGINS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isLocalhostOrigin(origin) {
  return (
    origin.startsWith("http://localhost") ||
    origin.startsWith("http://127.0.0.1") ||
    origin.startsWith("https://localhost") ||
    origin.startsWith("https://127.0.0.1")
  );
}

function setCorsOrReject(req, res) {
  const origin = req?.headers?.origin;
  const allowedOrigins = parseAllowedOrigins();

  // Allow non-browser calls (no Origin header).
  if (!origin) return true;

  const host = req?.headers?.host;
  const proto =
    req?.headers?.["x-forwarded-proto"] ||
    req?.headers?.["x-forwarded-protocol"] ||
    "https";
  const sameOrigin = host ? `${String(proto)}://${String(host)}` : null;

  const allowed =
    (sameOrigin && origin === sameOrigin) ||
    isLocalhostOrigin(origin) ||
    (allowedOrigins.length > 0 && allowedOrigins.includes(origin));

  if (!allowed) {
    res.status(403).json({ error: "CORS origin not allowed" });
    return false;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  return true;
}

function getModeLabel(promptType) {
  switch (promptType) {
    case "coding":
      return "Coding (Pro)";
    case "image":
      return "Image Generation";
    case "writing":
      return "Creative Writing";
    case "general":
      return "General";
    default:
      return String(promptType || "");
  }
}

function buildSystemPrompt({ promptType, options, modeLabel }) {
  const focus = options?.focus ?? "";
  const goal = options?.goal ?? "";
  const language = options?.language ?? "";

  const commonContext = `
CONTEXT:
- Technical Environment: ${language}
- Mode: ${modeLabel}
- Focus Area: ${focus}
- Goal: ${goal}`.trim();

  const baseSystemPrompt = `You are an elite Prompt Engineer. Convert Arabic requirements into a mode-appropriate ENGLISH MASTER PROMPT for any AI agent.

${commonContext}

MANDATORY WORKFLOW (embedded inside englishPrompt):
Phase 1 — Read:
- Extract the objective, constraints, and definitions.

Phase 2 — Plan:
- Provide a safe step-by-step execution plan with acceptance criteria.

Phase 3 — Ask (clarify & stop):
- If unclear or risky, ask clarifying questions and STOP.

Phase 4 — Execute:
- Generate the final master instructions for the downstream agent with a verification checklist.

OUTPUT RULES:
1. Return JSON ONLY with englishPrompt + arabicSummary.
2. Never output code in this JSON.

OUTPUT STRUCTURE (JSON):
{
  "englishPrompt": "A structured master prompt (plan + verification + any questions if STOP is required).",
  "arabicSummary": "ملخص عربي موجز يوضح ما تم تحسينه وفق Focus/Goal."
}`.trim();

  const imageSystemPrompt = `You are "Vibe Image Prompt Pro". Convert Arabic user requirements into a single high-fidelity ENGLISH MASTER PROMPT for image generation.

Mode: Image Generation
${commonContext}

MANDATORY WORKFLOW (embedded inside englishPrompt):
Phase 1 — Read:
- Extract the subject, intended use (web/app/print), and the requested visual constraints.
- Determine the assumed image tool/workflow using "Technical Environment / Tooling".

Phase 2 — Plan:
- Propose a clear prompt structure: subject, style, composition, lighting, color palette, quality/detail level.
- If typography/text is mentioned, define how it should be handled.

Phase 3 — Ask (clarify & stop):
- If any critical detail is missing (style, aspect ratio, subject specifics, text overlay requirements), output clarifying questions and STOP.

Phase 4 — Meta-Prompt Engineering:
- Produce the final English prompt in a structured format usable by a downstream image agent.
- Include POSITIVE_PROMPT, NEGATIVE_PROMPT (if applicable), and TOOL_SETTINGS when possible.

OUTPUT RULES:
Return JSON ONLY with englishPrompt (English) + arabicSummary (Arabic).

OUTPUT STRUCTURE (JSON):
{
  "englishPrompt": "Structured POSITIVE_PROMPT / NEGATIVE_PROMPT / TOOL_SETTINGS + any clarifying questions if STOP was triggered.",
  "arabicSummary": "ملخص عربي موجز يوضح تحسين التركيز والهدف (Focus/Goal) لنسخة توليد الصور."
}`.trim();

  const writingSystemPrompt = `You are "Vibe Writing Prompt Pro". Convert Arabic user requirements into a high-fidelity ENGLISH MASTER PROMPT for a writing agent.

Mode: Creative Writing
${commonContext}

WORKFLOW (embedded inside englishPrompt):
Phase 1 — Read:
- Identify topic, audience, desired tone, and length constraints.

Phase 2 — Plan:
- Create an outline aligned with Focus Area and Goal.

Phase 3 — Ask (clarify & stop):
- If essential details are missing (tone, audience, POV, genre, length), ask clarifying questions and STOP.

Phase 4 — Execute:
- Instruct the downstream agent to produce the final text with the requested structure.
- Include a short self-check/verification checklist appropriate for writing.

OUTPUT RULES:
Return JSON ONLY with englishPrompt + arabicSummary. Never output code.

OUTPUT STRUCTURE (JSON):
{
  "englishPrompt": "A complete master prompt for writing (outline + generation instructions + self-check).",
  "arabicSummary": "ملخص عربي يوضح تحسين Focus/Goal لنوع الكتابة المطلوب."
}`.trim();

  const codingSystemPrompt = `You are Vibe Coding Pro — an independent engineering agent prompt designer.

${commonContext}

VIBE WORKFLOW (mandatory):
Phase 1: Read
- Read project specs and relevant files.
- Identify key modules, patterns, and risks aligned with the selected Focus Area.

Phase 2: Plan
- Create a safe roadmap before execution: files to change, rationale, acceptance criteria, risks + mitigations.

Phase 3: Ask (Clarify & Stop)
- If anything is ambiguous/missing/risky: ask up to 5 clarifying questions and STOP until answered.

Phase 4: Meta-Prompt Engineering (Skill Injection + Execute)
- Convert the plan into execution-ready instructions.
- Apply Skill Units as mandatory checklists:
  1) Security Hardening Unit
  2) Performance Unit
  3) Testing Unit
  4) Architecture Unit
- Include explicit verification commands/tests.

EVOLUTION SUPPORT:
- If the user input contains an [EVOLUTION_CONTEXT] block, incorporate lessons and avoid repeating mistakes.

CRITICAL OUTPUT RULES:
1) Return JSON ONLY with exactly: englishPrompt, arabicSummary
2) Do NOT output code in this JSON.

OUTPUT STRUCTURE (JSON):
{
  "englishPrompt": "The full Vibe Coding Pro MASTER PROMPT in English (must include Phase 1/2/3/4 + Skill Units + verification).",
  "arabicSummary": "Arabic verification/logic summary focused on what was optimized for this request."
}`.trim();

  if (promptType === "coding") return codingSystemPrompt;
  if (promptType === "image") return imageSystemPrompt;
  if (promptType === "writing") return writingSystemPrompt;
  return baseSystemPrompt;
}

async function handler(req, res) {
  if (!setCorsOrReject(req, res)) return;

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = req.body || {};
    const input = body.input;
    const promptType = body.promptType || "coding";
    const options = body.options || {};

    if (!ALLOWED_PROMPT_TYPES.has(promptType)) {
      res.status(400).json({ error: "Invalid `promptType`." });
      return;
    }

    const maxChars = 12000;
    if (typeof input === "string" && input.length > maxChars) {
      res
        .status(400)
        .json({ error: `Input too large (max ${maxChars} chars).` });
      return;
    }

    if (typeof input !== "string" || !input.trim()) {
      res.status(400).json({ error: "Missing or empty `input` (Arabic requirements)." });
      return;
    }

    // Public demo deployments typically use a free/shared Gemini API key.
    // That key can hit rate limits, so self-hosters should set their own key:
    // - `GEMINI_API_KEY` (recommended for server-side usage)
    // - fallback: `VITE_GEMINI_API_KEY` (used in existing local/dev docs)
    const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
    if (!API_KEY) {
      res.status(500).json({
        error:
          "Missing Gemini API key. Set `GEMINI_API_KEY` (recommended) or `VITE_GEMINI_API_KEY` in Vercel env vars."
      });
      return;
    }

    const modeLabel = getModeLabel(promptType);

    if (options && typeof options.goal === "string" && options.goal.length > 0) {
      if (!ALLOWED_GOALS.has(options.goal)) {
        res.status(400).json({ error: "Invalid `options.goal`." });
        return;
      }
    }

    const systemPrompt = buildSystemPrompt({
      promptType,
      options,
      modeLabel
    });

    const model = "gemini-2.5-flash-lite";

    const response = await fetch(
      `${BASE_URL}/${model}:generateContent?key=${encodeURIComponent(API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `User Requirements (Arabic): ${input}` }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({
        error: data?.error?.message || response.statusText
      });
      return;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      res.status(500).json({ error: "Model returned empty content." });
      return;
    }

    // Extract JSON object from the model text (supports extra text + code fences).
    const cleaned = String(text)
      .replace(/```(?:json)?\s*/g, "")
      .replace(/```/g, "")
      .trim();

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    const jsonStr =
      start >= 0 && end >= start ? cleaned.slice(start, end + 1) : cleaned;

    const parsed = JSON.parse(jsonStr);

    if (
      !parsed ||
      typeof parsed.englishPrompt !== "string" ||
      typeof parsed.arabicSummary !== "string"
    ) {
      res.status(500).json({
        error:
          "JSON contract validation failed: expected {englishPrompt, arabicSummary} strings."
      });
      return;
    }

    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({
      error: err?.message || "Unknown error"
    });
  }
}

module.exports = handler;

