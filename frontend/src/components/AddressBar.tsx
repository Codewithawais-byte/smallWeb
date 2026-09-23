"use client";

import { useState, useEffect } from "react";

export function AddressBar({
  current,
  canBack,
  canForward,
  onNavigate,
  onBack,
  onForward,
}: {
  current: string | null;
  canBack: boolean;
  canForward: boolean;
  onNavigate: (address: string) => void;
  onBack: () => void;
  onForward: () => void;
}) {
  const [value, setValue] = useState(current ?? "");

  useEffect(() => setValue(current ?? ""), [current]);

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2">
      <button
        onClick={onBack}
        disabled={!canBack}
        className="px-2 py-1 rounded text-sm text-gray-600 disabled:text-gray-300 hover:bg-gray-100"
        aria-label="Back"
      >
        ←
      </button>
      <button
        onClick={onForward}
        disabled={!canForward}
        className="px-2 py-1 rounded text-sm text-gray-600 disabled:text-gray-300 hover:bg-gray-100"
        aria-label="Forward"
      >
        →
      </button>
      <form
        className="flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onNavigate(value.trim());
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="type an address…"
          className="w-full rounded-full border border-gray-300 px-4 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </form>
    </div>
  );
}
