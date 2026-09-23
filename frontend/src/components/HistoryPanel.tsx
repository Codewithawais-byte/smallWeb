"use client";

import type { Visit } from "@/lib/api";

export function HistoryPanel({
  visits,
  onJump,
  loading,
}: {
  visits: Visit[];
  onJump: (address: string) => void;
  loading: boolean;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <h2 className="px-3 pt-3 pb-1 text-xs font-semibold uppercase text-gray-400 tracking-wide">
        History
      </h2>
      <ul>
        {visits.map((v) => (
          <li key={v._id}>
            <button
              onClick={() => onJump(v.address)}
              disabled={loading}
              className="w-full text-left px-3 py-1.5 hover:bg-gray-100 flex flex-col"
            >
              <span className="text-sm font-mono truncate">{v.address}</span>
              <span className="text-xs text-gray-400">
                {new Date(v.at).toLocaleTimeString()} · {v.via}
                {!v.resolvedSiteId && " · dead"}
              </span>
            </button>
          </li>
        ))}
        {visits.length === 0 && (
          <li className="px-3 py-4 text-sm text-gray-400">No visits yet.</li>
        )}
      </ul>
    </div>
  );
}
