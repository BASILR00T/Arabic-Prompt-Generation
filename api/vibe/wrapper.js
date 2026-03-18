function buildWrapper({ ide, masterPrompt }) {
  const IDE_ALLOWLIST = new Set(["cursor", "claude_code", "vscode_continue", "generic"]);

  if (!IDE_ALLOWLIST.has(ide)) ide = "generic";

  switch (ide) {
    case "cursor":
      return `Cursor Integration Instructions (English content):
Role: You are a coding agent inside Cursor. Work inside this repository.
Rules:
1) Use the master prompt below as the controlling instruction.
2) Follow the Vibe Coding Pro 4-phase workflow: Read → Plan → Ask (Clarify & Stop if needed) → Meta-Prompt Engineering + Execute.
3) If you ask clarifying questions, ask first and do not start implementation until the user answers.
4) After applying changes, run the verification commands/tests listed in the master prompt.
5) Do NOT force Arabic UI/localization unless it is explicitly requested by the user.
    
MASTER PROMPT:
"""
${masterPrompt}
"""`;

    case "claude_code":
      return `Claude Code Integration Instructions:
Role: You are Claude Code acting as an independent engineering agent.
Rules:
1) Treat the master prompt below as system-level control.
2) If critical details are missing, ask clarifying questions and STOP until answered.
3) Implement with minimal non-regressive changes.
4) Run the verification commands/tests listed in the master prompt.
    
MASTER PROMPT:
"""
${masterPrompt}
"""`;

    case "vscode_continue":
      return `VS Code (Continue) Integration Instructions:
Role: You are an AI coding assistant in VS Code using Continue.
Rules:
1) Use the master prompt below as the controlling instruction (do not deviate from the required workflow).
2) Ask clarifying questions and STOP when needed.
3) Propose and apply code changes, then verify using the commands/tests in the master prompt.
    
MASTER PROMPT:
"""
${masterPrompt}
"""`;

    default:
      return masterPrompt;
  }
}

async function handler(req, res) {
  const origin = req?.headers?.origin;
  const raw = process.env.CORS_ALLOW_ORIGINS || "";
  const allowedOrigins = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const isLocalhost =
    origin &&
    (origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1") ||
      origin.startsWith("https://localhost") ||
      origin.startsWith("https://127.0.0.1"));

  // Allow non-browser calls (no Origin header).
  const host = req?.headers?.host;
  const proto =
    req?.headers?.["x-forwarded-proto"] ||
    req?.headers?.["x-forwarded-protocol"] ||
    "https";
  const sameOrigin = host ? `${String(proto)}://${String(host)}` : null;

  const allowed =
    !origin ||
    (sameOrigin && origin === sameOrigin) ||
    isLocalhost ||
    (allowedOrigins.length > 0 && allowedOrigins.includes(origin));

  if (!allowed) {
    res.status(403).json({ error: "CORS origin not allowed" });
    return;
  }

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

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
    const englishPrompt = body.englishPrompt;
    const ide = body.ide || body.integrationIde || "generic";

    if (typeof englishPrompt !== "string" || !englishPrompt.trim()) {
      res.status(400).json({ error: "Missing or empty `englishPrompt`." });
      return;
    }

    const wrapper = buildWrapper({ ide, masterPrompt: englishPrompt });
    res.status(200).json({ wrapper });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Unknown error" });
  }
}

export default handler;

