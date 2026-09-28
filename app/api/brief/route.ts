import { NextRequest, NextResponse } from "next/server";
import { recallMemories, reflectOnContact } from "@/lib/hindsight";
import { callGroq } from "@/lib/groq";
import { contacts } from "@/lib/contacts";

export async function POST(req: NextRequest) {
  try {
    const { contactId, topic } = await req.json();
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    // 1. Recall raw memories relevant to the upcoming meeting.
    const recall = await recallMemories(
      contactId,
      `Everything relevant to an upcoming meeting about: ${topic || "general check-in"}`,
      { budget: "high" }
    );

    // 2. Ask Hindsight to reflect: synthesize a disposition-aware answer
    //    from everything it knows about this contact.
    const reflection = await reflectOnContact(
      contactId,
      `What should I know before meeting ${contact.name} again? Focus on open commitments, concerns, and sentiment.`,
      "preparing for an upcoming meeting"
    );

    // 3. Format into a scannable brief. If memory is thin, the model is
    //    told to say so rather than invent detail - this is what makes
    //    the "generic vs personalized" demo contrast honest.
    const briefText = await callGroq(
      [
        {
          role: "system",
          content:
            "You are Primer, a meeting-prep assistant. Turn the memory context into a tight, scannable prep brief with these sections: Who They Are, Relationship Snapshot, Open Commitments, Risks/Watch-outs, Suggested Talking Points. Be specific and cite details from memory. If memory is thin, say so plainly instead of inventing details.",
        },
        {
          role: "user",
          content: `Contact: ${contact.name}, ${contact.role} at ${contact.company}
Upcoming topic: ${topic || "general check-in"}

Hindsight reflection:
${reflection.text}

Raw recalled memories:
${recall.results.map((r: any, i: number) => `${i + 1}. [${r.type}] ${r.text}`).join("\n") || "(none found)"}`,
        },
      ],
      false
    );

    return NextResponse.json({
      brief: briefText,
      memoriesUsed: recall.results,
      reflection: reflection.text,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Brief generation failed" }, { status: 500 });
  }
}
