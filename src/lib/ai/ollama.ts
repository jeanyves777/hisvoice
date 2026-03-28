/**
 * Ollama Integration — Self-hosted LLM on VPS
 * Connects to Ollama running locally (dev) or on VPS (production)
 * Uses Llama 3, Mistral, Phi-3, or any model installed on the server
 *
 * No external APIs. No Groq. No cloud. 100% self-hosted.
 */

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama3.1";

interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OllamaResponse {
  model: string;
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

/**
 * Check if Ollama is running and accessible
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * List available models on the Ollama server
 */
export async function listModels(): Promise<string[]> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map((m: { name: string }) => m.name);
  } catch {
    return [];
  }
}

/**
 * Chat with Ollama — non-streaming (full response)
 */
export async function chat(
  messages: OllamaMessage[],
  model?: string
): Promise<string | null> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 1024,
        },
      }),
      signal: AbortSignal.timeout(60000), // 60s timeout for generation
    });

    if (!res.ok) {
      console.error("[Ollama] Chat failed:", res.status, await res.text());
      return null;
    }

    const data: OllamaResponse = await res.json();
    return data.message?.content || null;
  } catch (error) {
    console.error("[Ollama] Chat error:", error);
    return null;
  }
}

/**
 * Chat with Ollama — streaming (token by token)
 * Returns a ReadableStream for real-time responses
 */
export async function chatStream(
  messages: OllamaMessage[],
  model?: string
): Promise<ReadableStream<string> | null> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: model || DEFAULT_MODEL,
        messages,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 1024,
        },
      }),
      signal: AbortSignal.timeout(120000),
    });

    if (!res.ok || !res.body) return null;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    return new ReadableStream<string>({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        // Ollama sends NDJSON — each line is a JSON object
        const lines = chunk.split("\n").filter(Boolean);
        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              controller.enqueue(parsed.message.content);
            }
            if (parsed.done) {
              controller.close();
              return;
            }
          } catch {
            // Skip malformed lines
          }
        }
      },
    });
  } catch (error) {
    console.error("[Ollama] Stream error:", error);
    return null;
  }
}

/**
 * Generate embeddings using Ollama (for semantic search)
 */
export async function embed(
  text: string,
  model = "nomic-embed-text"
): Promise<number[] | null> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/embeddings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt: text }),
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.embedding || null;
  } catch {
    return null;
  }
}

/**
 * The system prompt for the His Voice AI agent
 */
export const AGENT_SYSTEM_PROMPT = `You are the His Voice Intelligence — the most knowledgeable historian of Jesus of Nazareth ever created. You have access to 70+ primary sources from 10 different civilizations spanning 3,000 years.

CORE RULES:
1. NEVER use the Bible to convince someone who rejects it. Start with evidence they accept.
2. Always start where the questioner stands — detect their level of belief.
3. Hostile witnesses first, friendly witnesses second. A Roman governor confirming Jesus's execution is more powerful to a skeptic than a gospel account.
4. Never be preachy — let the evidence speak. Say "here's what the evidence shows" not "you should believe."
5. Always cite your sources with dates and tradition labels.
6. When you have database search results, USE THEM. Reference specific sources by name and date.

REASONING LEVELS:
- Level 0 (atheist): Use ONLY science, math, philosophy. No religious texts.
- Level 1 (open): Use hostile witnesses, prophecy math, cross-tradition evidence. Not Bible as authority.
- Level 2 (interested): Bible paired with external confirmation. Never Bible-only.
- Level 3 (exploring): All sources valid. Personal application.
- Level 4 (believer): Full depth — harmony, removed books, original languages.

FORMAT: Be concise. Use specific citations. Bold important facts with **double asterisks**.`;
