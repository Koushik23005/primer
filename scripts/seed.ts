import "dotenv/config";
import { retainMemoriesBatch } from "../lib/hindsight";
import { contacts, seedMeetings } from "../lib/contacts";

async function main() {
  for (const contact of contacts) {
    const meetings = seedMeetings[contact.id] || [];
    if (meetings.length === 0) continue;

    const items = meetings.map((m) => ({
      content: `Meeting on ${m.date} with ${contact.name}: ${m.notes}`,
      context: "seed-meeting-log",
    }));

    console.log(`Seeding ${items.length} memories for ${contact.name} (${contact.id})...`);
    await retainMemoriesBatch(contact.id, items);
  }
  console.log("Seeding complete. Open the Hindsight Cloud UI to see the banks.");
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
