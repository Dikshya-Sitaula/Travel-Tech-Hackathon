/**
 * offlineLlmService.js
 * -----------------------------------------------------------------------
 * Talks to a LOCAL Ollama server running the quantized Gemma 2 2B model
 * ("gemma-offline", built from models/Modelfile). No internet required.
 *
 * Domain notes from models/finetune/nepal_travel.jsonl are retrieved and
 * attached as few-shot context (this machine has no GPU for weight LoRA).
 * -----------------------------------------------------------------------
 */

import corpusRaw from "../../../models/finetune/nepal_travel.jsonl?raw";

const OLLAMA_BASE_URL = "http://localhost:11434";
const OFFLINE_MODEL_NAME = "gemma-offline";
const RETRIEVE_K = 3;

const CORPUS = corpusRaw
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    try {
      const row = JSON.parse(line);
      return {
        instruction: String(row.instruction || row.input || "").trim(),
        output: String(row.output || row.response || "").trim(),
      };
    } catch {
      return null;
    }
  })
  .filter((row) => row && row.instruction && row.output);

function tokenize(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function retrieveNotes(query, k = RETRIEVE_K) {
  const qTokens = tokenize(query);
  if (!qTokens.length || !CORPUS.length) return [];

  const scored = CORPUS.map((row) => {
    const hay = tokenize(`${row.instruction} ${row.output}`);
    const overlap = qTokens.filter((t) => hay.includes(t)).length;
    return { row, score: overlap };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, k).map((s) => s.row);
}

function withRetrievedNotes(userText) {
  const notes = retrieveNotes(userText);
  if (!notes.length) return userText;

  const block = notes
    .map((n) => `Q: ${n.instruction}\nA: ${n.output}`)
    .join("\n\n");

  return `${userText}\n\n---\nLocal notes (use if relevant, don't recite them verbatim):\n${block}`;
}

function toOllamaMessages(history, userText) {
  const messages = [];
  for (const msg of history || []) {
    if (!msg || msg.isError) continue;
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    const content = String(msg.content || "").trim();
    if (!content) continue;
    messages.push({ role: msg.role, content });
  }
  messages.push({ role: "user", content: withRetrievedNotes(userText) });
  return messages;
}

function cleanReply(text) {
  return String(text || "")
    .replace(/<end_of_turn>/g, "")
    .replace(/<eos>/g, "")
    .trim();
}

/**
 * @param {string} prompt
 * @param {object} [options]
 * @param {Array<{role:string,content:string,isError?:boolean}>} [options.history]
 * @param {number} [options.temperature=0.4]
 * @param {AbortSignal} [options.signal]
 */
export async function askOfflineAgent(prompt, options = {}) {
  const { temperature = 0.4, signal, history = [] } = options;

  if (!prompt || !prompt.trim()) {
    throw new Error("Prompt cannot be empty.");
  }

  const requestBody = {
    model: OFFLINE_MODEL_NAME,
    messages: toOllamaMessages(history, prompt.trim()),
    stream: false,
    options: {
      temperature,
      stop: ["<end_of_turn>", "<eos>"],
    },
  };

  let response;
  try {
    response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal,
    });
  } catch {
    throw new Error(
      "Could not reach the local Ollama server. Is 'ollama serve' running on http://localhost:11434?"
    );
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(
      `Offline model request failed (${response.status}): ${errText || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data.message?.content || data.response || "";
  return cleanReply(text);
}

export async function askOfflineAgentStream(prompt, onToken, options = {}) {
  const { temperature = 0.4, signal, history = [] } = options;

  const response = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OFFLINE_MODEL_NAME,
      messages: toOllamaMessages(history, prompt.trim()),
      stream: true,
      options: { temperature, stop: ["<end_of_turn>", "<eos>"] },
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Offline streaming request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        const chunk = parsed.message?.content || parsed.response;
        if (chunk) onToken(chunk);
      } catch {
        // ignore malformed partial JSON line
      }
    }
  }
}

export async function checkOfflineStatus() {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      method: "GET",
    });
    if (!res.ok) return { serverUp: false, modelReady: false };

    const data = await res.json();
    const models = data.models || [];
    const modelReady = models.some((m) =>
      (m.name || m.model || "").startsWith(OFFLINE_MODEL_NAME)
    );

    return { serverUp: true, modelReady };
  } catch {
    return { serverUp: false, modelReady: false };
  }
}
