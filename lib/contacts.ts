import { Contact, SeedMeeting } from "./types";

// Three fictional contacts, deliberately at different points in the
// relationship so the demo shows the memory "learning curve":
//  - priya:  1 meeting  -> brief should look thin/generic
//  - daniel: 5 meetings -> brief should look sharp and specific
//  - elena:  3 meetings -> somewhere in between

export const contacts: Contact[] = [
  {
    id: "priya",
    name: "Priya Shah",
    role: "VP of Operations",
    company: "Nimbus Retail",
  },
  {
    id: "daniel",
    name: "Daniel Cho",
    role: "Director of Engineering",
    company: "Fintrack",
  },
  {
    id: "elena",
    name: "Elena Volkov",
    role: "Head of Marketing",
    company: "Solace Health",
  },
];

export const seedMeetings: Record<string, SeedMeeting[]> = {
  priya: [
    {
      date: "2026-09-10",
      notes:
        "First intro call. Priya is evaluating tools to cut manual work in her ops team. Mentioned budget approval takes ~3 weeks at Nimbus. No pricing discussed yet. Neutral, professional tone.",
    },
  ],
  daniel: [
    {
      date: "2026-07-14",
      notes:
        "Kickoff call. Daniel is skeptical of switching tools, burned by a bad migration last year. Wants a proof of concept before committing budget. Mentioned his team is mid-migration to a new data warehouse.",
    },
    {
      date: "2026-07-28",
      notes:
        "Demo call. Daniel raised concern about SSO/SAML support being a hard requirement for Fintrack's security team. We promised to confirm SSO timeline by next week. He seemed more engaged, asked about API rate limits.",
    },
    {
      date: "2026-08-11",
      notes:
        "Follow-up. Confirmed SSO support ships in Q4. Daniel pushed back on pricing, said it's 20% over budget. Proposed a phased rollout to reduce year-1 cost. He mentioned his daughter just started college, in a good mood overall.",
    },
    {
      date: "2026-08-25",
      notes:
        "Technical deep dive with Daniel's team. One engineer flagged a rate-limit concern for their batch jobs. We promised a higher limit tier at no extra cost. Daniel said this was the smoothest vendor call he'd had all quarter. Sentiment clearly warming.",
    },
    {
      date: "2026-09-15",
      notes:
        "Check-in call. Daniel confirmed budget was approved internally. Still waiting on legal review of the SSO/security addendum, expects it done in 2 weeks. Asked for a reference customer in fintech. We promised to send one by Friday - still outstanding.",
    },
  ],
  elena: [
    {
      date: "2026-08-05",
      notes:
        "Intro call. Elena wants better reporting on content performance across channels. Currently stitching data manually in spreadsheets, frustrated by the time cost. Positive, high energy.",
    },
    {
      date: "2026-08-20",
      notes:
        "Demo call. Elena loved the reporting dashboard but raised a concern about data residency for EU customers - Solace Health has EU clients under GDPR. We said we'd check with our infra team and follow up. Still open.",
    },
    {
      date: "2026-09-05",
      notes:
        "Follow-up. Confirmed EU data residency option exists on the enterprise tier. Elena asked about onboarding timeline since her Q4 planning starts in 3 weeks. She mentioned she's presenting this to her CMO next week and wants a one-pager she can share.",
    },
  ],
};
