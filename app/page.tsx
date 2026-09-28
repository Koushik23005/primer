"use client";

import { useEffect, useState } from "react";

type Contact = {
  id: string;
  name: string;
  role: string;
  company: string;
  meetingsLogged: number;
};

type MemoryItem = { text: string; type: string };

export default function Home() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [topic, setTopic] = useState("");
  const [brief, setBrief] = useState<string | null>(null);
  const [memoriesUsed, setMemoriesUsed] = useState<MemoryItem[]>([]);
  const [briefLoading, setBriefLoading] = useState(false);

  const [notes, setNotes] = useState("");
  const [storedItems, setStoredItems] = useState<{ content: string; context?: string }[]>([]);
  const [logLoading, setLogLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/contacts")
      .then((r) => r.json())
      .then((d) => {
        setContacts(d.contacts);
        if (d.contacts.length > 0) setSelectedId(d.contacts[0].id);
      });
  }, []);

  const selected = contacts.find((c) => c.id === selectedId) || null;

  async function generateBrief() {
    if (!selected) return;
    setBriefLoading(true);
    setBrief(null);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selected.id, topic }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setBrief(data.brief);
      setMemoriesUsed(data.memoriesUsed || []);
    } catch (e: any) {
      setBrief(`Error generating brief: ${e.message}`);
    } finally {
      setBriefLoading(false);
    }
  }

  async function logMeeting() {
    if (!selected || !notes.trim()) return;
    setLogLoading(true);
    try {
      const res = await fetch("/api/log-meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selected.id, notes }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setStoredItems(data.stored || []);
      setToast(`Remembered ${data.stored?.length ?? 0} new things about ${selected.name}`);
      setNotes("");
      setTimeout(() => setToast(null), 4000);
    } catch (e: any) {
      setToast(`Error: ${e.message}`);
    } finally {
      setLogLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/10 p-4 space-y-2">
        <h1 className="text-xl font-semibold mb-4">Primer</h1>
        <p className="text-xs text-white/50 mb-4">Meeting prep, powered by Hindsight memory</p>
        {contacts.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedId(c.id);
              setBrief(null);
              setMemoriesUsed([]);
            }}
            className={`w-full text-left p-3 rounded-lg border ${
              selectedId === c.id ? "border-emerald-400/60 bg-emerald-400/10" : "border-white/10 hover:bg-white/5"
            }`}
          >
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-white/50">
              {c.role}, {c.company}
            </div>
            <div className="text-xs text-white/30 mt-1">{c.meetingsLogged} meetings logged</div>
          </button>
        ))}
      </aside>

      {/* Main panel */}
      <section className="flex-1 p-6 space-y-6 max-w-3xl">
        {selected && (
          <>
            <div>
              <h2 className="text-2xl font-semibold">{selected.name}</h2>
              <p className="text-white/50">
                {selected.role} at {selected.company}
              </p>
            </div>

            {/* Brief generator */}
            <div className="border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="font-medium">Generate pre-meeting brief</h3>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Topic of the upcoming meeting (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm"
              />
              <button
                onClick={generateBrief}
                disabled={briefLoading}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-medium px-4 py-2 rounded-lg text-sm"
              >
                {briefLoading ? "Recalling memory..." : "Generate brief"}
              </button>

              {brief && (
                <div className="mt-4 whitespace-pre-wrap text-sm bg-black/30 rounded-lg p-4 border border-white/10">
                  {brief}
                </div>
              )}

              {memoriesUsed.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-white/40 mb-1">
                    {memoriesUsed.length} memories recalled from Hindsight to build this brief
                  </div>
                  <ul className="text-xs text-white/40 space-y-1 list-disc list-inside">
                    {memoriesUsed.map((m, i) => (
                      <li key={i}>
                        [{m.type}] {m.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Post-meeting logging */}
            <div className="border border-white/10 rounded-xl p-4 space-y-3">
              <h3 className="font-medium">Log a meeting</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Paste meeting notes or transcript..."
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm"
              />
              <button
                onClick={logMeeting}
                disabled={logLoading}
                className="bg-white/10 hover:bg-white/20 disabled:opacity-50 px-4 py-2 rounded-lg text-sm"
              >
                {logLoading ? "Extracting memories..." : "Log meeting & remember"}
              </button>

              {storedItems.length > 0 && (
                <ul className="text-xs text-white/50 space-y-1 list-disc list-inside">
                  {storedItems.map((it, i) => (
                    <li key={i}>
                      <span className="text-white/30">[{it.context}]</span> {it.content}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>

      {toast && (
        <div className="fixed bottom-4 right-4 bg-emerald-500 text-black text-sm px-4 py-2 rounded-lg shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
