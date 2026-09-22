'use client';

import { useState } from 'react';
import { publishSite } from '@/lib/api';

export function PublishForm({
  authorId,
  onPublished,
}: {
  authorId: string | null;
  onPublished: (address: string) => void;
}) {
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorId) {
      setError('Pick who you\u2019re publishing as first.');
      return;
    }
    setError(null);
    try {
      const site = await publishSite({ address, title, body, authorId });
      setAddress('');
      setTitle('');
      setBody('');
      onPublished(site.address);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form onSubmit={submit} className="p-3 space-y-2">
      <h2 className="text-xs font-semibold uppercase text-gray-400 tracking-wide">Publish</h2>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="address, e.g. myplace.zz"
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm font-mono"
        required
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="title"
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        required
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="<p>your page…</p>"
        rows={4}
        className="w-full rounded border border-gray-300 px-2 py-1 text-sm font-mono"
        required
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Publish
      </button>
    </form>
  );
}
