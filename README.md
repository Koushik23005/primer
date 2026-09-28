# Primer - Meeting Prep Agent

A meeting prep agent that uses [Hindsight](https://hindsight.vectorize.io) as its
persistent memory layer. Built for the "AI Agents That Learn Using Hindsight" hackathon
(Product & Strategy category).

- **Pre-meeting**: pulls a contact's full history from Hindsight (retain/recall/reflect)
  and generates a specific, personalized prep brief.
- **Post-meeting**: extracts new facts, commitments, and sentiment from your notes and
  writes them back into that contact's memory bank.
- Comes seeded with 3 fictional contacts at different relationship depths (1, 3, and 5
  logged meetings) so you can demo the "generic -> personalized" learning curve.

## Prerequisites
- Node.js 18+
- A Hindsight Cloud account: https://ui.hindsight.vectorize.io (promo code `MEMHACK99`
  for $50 credit, added in the billing section AFTER you register)
- A Groq API key: https://console.groq.com

## Setup
1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in `HINDSIGHT_API_KEY` and `GROQ_API_KEY`
3. `npm run seed` — pushes the synthetic meeting history into Hindsight (one bank per
   contact, id `primer-contact-<id>`)
4. `npm run dev` — open http://localhost:3000

## How Hindsight is used
- One memory **bank** per contact (`lib/hindsight.ts` -> `bankIdForContact`)
- `retainBatch` — writes extracted facts (commitments, objections, sentiment, personal
  details) after each logged meeting (`app/api/log-meeting/route.ts`)
- `recall` — pulls the raw memories relevant to the upcoming meeting topic
  (`app/api/brief/route.ts`)
- `reflect` — asks Hindsight to synthesize a disposition-aware summary of the contact
  before Primer formats the final brief

## Project structure
```
app/
  page.tsx                  main dashboard (contact list, brief, meeting log)
  api/contacts/route.ts     GET contact list
  api/brief/route.ts        POST -> recall + reflect + format a prep brief
  api/log-meeting/route.ts  POST -> extract facts from notes, retain to Hindsight
lib/
  hindsight.ts               Hindsight client wrapper
  groq.ts                    Groq chat completion wrapper
  contacts.ts                seed data (3 contacts + meeting history)
scripts/
  seed.ts                     pushes seed data into Hindsight
```
