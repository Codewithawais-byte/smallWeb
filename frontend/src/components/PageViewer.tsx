'use client';

import type React from 'react';
import DOMPurify from 'dompurify';
import type { Site } from '@/lib/api';

// SAME allowlist philosophy as the backend (backend/src/sites/sites.service.ts) —
// intentionally NOT the same trust boundary. The backend sanitizes what
// gets stored; this sanitizes what gets rendered. Two independent checks
// mean a bug or bypass in one doesn't hand an author a working <script>.
const ALLOWED_TAGS = [
  'p', 'a', 'b', 'i', 'em', 'strong', 'br', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'blockquote', 'code', 'pre',
];

export function PageViewer({
  address,
  site,
  loading,
  onNavigate,
}: {
  address: string;
  site: Site | null;
  loading: boolean;
  onNavigate: (address: string) => void;
}) {
  // Links inside dangerouslySetInnerHTML aren't React elements, so we
  // can't attach onClick to them directly — intercept via delegation
  // on the container instead, and treat the href as an "address" the
  // same way a typed one is, including ones that lead nowhere.
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;
    e.preventDefault();
    const href = anchor.getAttribute('href');
    if (href) onNavigate(href);
  }
  if (loading) {
    return <div className="p-6 text-sm text-gray-400">Loading {address}…</div>;
  }

  if (!site) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-400 font-mono mb-2">{address}</p>
        <h2 className="text-lg font-semibold text-gray-700">This address doesn&apos;t exist.</h2>
        <p className="text-sm text-gray-500 mt-1">No site has ever been published here.</p>
      </div>
    );
  }

  const clean = DOMPurify.sanitize(site.body, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ['href'],
  });

  return (
    <article className="p-6 max-w-2xl">
      <p className="text-xs text-gray-400 font-mono mb-3">{site.address}</p>
      <h1 className="text-2xl font-bold mb-4">{site.title}</h1>
      {/* Content is sanitized twice (write-time + render-time) before
          reaching dangerouslySetInnerHTML — see comment above. */}
      <div
        className="prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: clean }}
        onClick={handleClick}
      />
    </article>
  );
}
