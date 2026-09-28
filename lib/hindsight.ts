import { HindsightClient } from "@vectorize-io/hindsight-client";

let client: HindsightClient | null = null;

/**
 * One Hindsight bank per contact = one isolated memory store per relationship.
 * See: https://hindsight.vectorize.io/sdks/nodejs
 */
export function getHindsightClient(): HindsightClient {
  if (!client) {
    client = new HindsightClient({
      baseUrl: process.env.HINDSIGHT_BASE_URL || "https://api.hindsight.vectorize.io",
      apiKey: process.env.HINDSIGHT_API_KEY,
    });
  }
  return client;
}

export function bankIdForContact(contactId: string) {
  return `primer-contact-${contactId}`;
}

export async function retainMemory(contactId: string, content: string, context?: string) {
  const c = getHindsightClient();
  return c.retain(bankIdForContact(contactId), content, context ? { context } : undefined);
}

export async function retainMemoriesBatch(
  contactId: string,
  items: { content: string; context?: string }[]
) {
  const c = getHindsightClient();
  return c.retainBatch(bankIdForContact(contactId), items);
}

export async function recallMemories(
  contactId: string,
  query: string,
  opts?: { budget?: "low" | "mid" | "high" }
) {
  const c = getHindsightClient();
  return c.recall(bankIdForContact(contactId), query, opts);
}

export async function reflectOnContact(contactId: string, query: string, context?: string) {
  const c = getHindsightClient();
  return c.reflect(bankIdForContact(contactId), query, context ? { context } : undefined);
}
