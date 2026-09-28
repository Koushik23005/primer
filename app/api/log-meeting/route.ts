import { NextRequest, NextResponse } from "next/server";
import { retainMemoriesBatch } from "@/lib/hindsight";
import { callGroq } from "@/lib/groq";
import { contacts } from "@/lib/contacts";

export async function POST(req: NextRequest) {
  try {
    const { contactId, notes } = await req.json();
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }
    if (!notes || !notes.trim()) {
      return NextResponse.json({ error: "Notes cannot be empty" }, { status: 400 });
    }

    // Ask the LLM to break freeform notes into atomic, memory-worthy facts.
    const extraction = await callGroq(
      [
        {
          role: "system",
          content:
            'Extract discrete, memory-worthy facts from these meeting notes. Return ONLY a JSON object: {"items": [{"content": string, "context": string}]}. Each item is ONE atomic fact (a commitment made by either side, an objection or concern, a preference, a sentiment reading, a personal detail, or a topic discussed). Keep each content string under 25 words and self-contained (include the contact\'s name). "context" is a short label such as "commitment", "objection", "sentiment", "personal", or "topic".',
        },
        { role: "user", content: `Contact: ${contact.name}\nMeeting notes:\n${notes}` },
      ],
      true
    );

    let items: { content: string; context?: string }[] = [];
    try {
      const parsed = JSON.parse(extraction);
      items = Array.isArray(parsed.items) ? parsed.items : [];
    } catch {
      // Fallback: store the raw note as a single memory if extraction wasn't valid JSON.
      items = [{ content: notes.slice(0, 500), context: "raw-note" }];
    }

    if (items.length > 0) {
      await retainMemoriesBatch(contactId, items);
    }

    return NextResponse.json({ stored: items });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Logging failed" }, { status: 500 });
  }
}
