# Primer: meeting prep with memory

Primer is an AI meeting-prep agent. It remembers every conversation you've had with a contact and writes a pre-meeting brief from those memories, so you walk into each meeting knowing the history, the commitments, and the open concerns.

Built for the Hindsight (Vectorize) AI agent memory hackathon, Product & Strategy category.

## How it works

- **Log a meeting:** paste your notes. Primer extracts the commitments, objections, and key facts and stores them in that contact's Hindsight memory bank (retain).
- **Generate a brief:** enter the topic of your next meeting. Primer recalls the relevant memories for that contact and writes a brief with Groq (recall).
- **Memory compounds:** each logged meeting makes the next brief better, because the agent keeps what it learned.

Each contact has their own Hindsight memory bank, so nothing leaks between people.

## Tech stack

- Next.js 14 and TypeScript
- Hindsight Cloud for long-term agent memory
- Groq (`openai/gpt-oss-120b`) for generation
- Tailwind CSS

## Run it locally

1. Install dependencies:
```
   npm install
```
2. Copy `.env.example` to `.env.local` and fill in your keys:
```
   HINDSIGHT_API_KEY=your_hindsight_key
   HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
   GROQ_API_KEY=your_groq_key
   GROQ_MODEL=openai/gpt-oss-120b
```
3. The seed script reads `.env`, so make a copy of the file with that name too.
4. Seed the three demo contacts:
```
   npm run seed
```
5. Start the app and open http://localhost:3000:
```
   npm run dev
```

## Demo walkthrough

1. Pick a contact and generate a brief. It uses the seeded history.
2. Log a new meeting, for example: "Q4 budget approved, wants a demo next week, worried about onboarding time."
3. Generate a brief again and notice the new commitments and the objection show up.

Never commit `.env` or `.env.local`. They are already in `.gitignore`.