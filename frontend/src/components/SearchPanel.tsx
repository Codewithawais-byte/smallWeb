"use client";

import { useState } from "react";
import { searchSites, type Site } from "@/lib/api";

export function SearchPanel({ onOpen }: { onOpen: (address: string) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Site[] | null>(null);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setResults(await searchSites(q.trim()));
  }

  return (
    <div className="p-3">
      <form onSubmit={runSearch} className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search the web…"
          className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
        />
        <button
          type="submit"
          className="px-3 py-1 text-sm rounded bg-gray-800 text-white hover:bg-gray-700"
        >
          Search
        </button>
      </form>

      {results !== null && (
        <ul className="mt-3 space-y-1">
          {results.map((s) => (
            <li key={s._id}>
              <button
                onClick={() => onOpen(s.address)}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-gray-100"
              >
                <div className="text-sm font-medium">{s.title}</div>
                <div className="text-xs text-gray-400 font-mono">
                  {s.address}
                </div>
              </button>
            </li>
          ))}
          {results.length === 0 && (
            <li className="text-sm text-gray-400 px-2 py-1.5">No matches.</li>
          )}
        </ul>
      )}
    </div>
  );
}
