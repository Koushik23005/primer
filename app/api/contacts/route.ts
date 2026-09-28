import { NextResponse } from "next/server";
import { contacts, seedMeetings } from "@/lib/contacts";

export async function GET() {
  const withCounts = contacts.map((c) => ({
    ...c,
    meetingsLogged: seedMeetings[c.id]?.length ?? 0,
  }));
  return NextResponse.json({ contacts: withCounts });
}
