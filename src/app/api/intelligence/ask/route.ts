/**
 * POST /api/intelligence/ask
 * The main AI agent endpoint.
 *
 * Flow:
 * 1. Receive question
 * 2. Run agent (analyzes question, queries DB, builds evidence cards)
 * 3. If Ollama is available, enhance synthesis with LLM reasoning
 * 4. Return structured response with cards, synthesis, follow-ups
 */

import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/ai/agent";
import { isOllamaAvailable, chat, AGENT_SYSTEM_PROMPT } from "@/lib/ai/ollama";
import { withErrorHandler } from "@/lib/errors/handler";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const { question, context } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  // Step 1: Run the agent (DB queries + evidence assembly)
  const agentResult = await runAgent(question);

  // Step 2: Try to enhance with Ollama LLM
  const ollamaUp = await isOllamaAvailable();
  let enhancedSynthesis = agentResult.synthesis;
  let aiPowered = false;

  if (ollamaUp && agentResult.cards.length > 0) {
    // Build context from agent's gathered evidence
    const evidenceContext = agentResult.cards
      .map((c, i) => `${i + 1}. [${c.tradition}] ${c.title}: ${c.text}`)
      .join("\n");

    const prompt = `The user asked: "${question}"

I searched the His Voice database and found these ${agentResult.cards.length} evidence points:

${evidenceContext}

The user's detected skeptic level is ${agentResult.level}/4 (0=atheist, 4=believer).
${context ? `Page context: ${context}` : ""}

Based on this evidence, provide a concise synthesis (3-5 sentences) that:
- Addresses the question directly
- Cites the strongest evidence by name and date
- Follows the reasoning level rules (level ${agentResult.level})
- Highlights hostile witnesses if level <= 1
- Ends with what the overall evidence points to

Be concise and evidence-driven. No fluff.`;

    const llmResponse = await chat([
      { role: "system", content: AGENT_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ]);

    if (llmResponse) {
      enhancedSynthesis = llmResponse;
      aiPowered = true;
    }
  }

  return NextResponse.json({
    ...agentResult,
    synthesis: enhancedSynthesis,
    aiPowered,
    ollamaAvailable: ollamaUp,
  });
});
