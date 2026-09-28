const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/**
 * Thin wrapper around Groq's chat completions endpoint.
 * Recommended models: openai/gpt-oss-120b, qwen/qwen3-32b.
 * Wrap calls in try/catch upstream to handle occasional function-calling / JSON errors.
 */
export async function callGroq(messages: ChatMessage[], jsonMode = false): Promise<string> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.4,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}
