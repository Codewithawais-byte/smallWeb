'use client';

import type { Person } from '@/lib/api';

export function PersonPicker({
  people,
  current,
  onChange,
}: {
  people: Person[];
  current: string | null;
  onChange: (personId: string) => void;
}) {
  return (
    <select
      value={current ?? ''}
      onChange={(e) => onChange(e.target.value)}
      className="rounded border border-gray-300 px-2 py-1 text-sm bg-white"
    >
      <option value="" disabled>
        Browsing as…
      </option>
      {people.map((p) => (
        <option key={p._id} value={p._id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
