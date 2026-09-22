const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export type Person = { _id: string; name: string };
export type Site = { _id: string; address: string; title: string; body: string; authorId: string };
export type Visit = {
  _id: string;
  personId: string;
  address: string;
  resolvedSiteId: string | null;
  via: string;
  at: string;
};

export async function getPeople(): Promise<Person[]> {
  const res = await fetch(`${API}/people`, { cache: 'no-store' });
  return res.json();
}

// Returns null (not throw) for a dead address — "nowhere" is an
// expected, first-class result here, not an error condition to catch.
export async function getSite(address: string): Promise<Site | null> {
  const res = await fetch(`${API}/sites/${encodeURIComponent(address)}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  return res.json();
}

export async function searchSites(q: string): Promise<Site[]> {
  const res = await fetch(`${API}/sites/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
  return res.json();
}

export async function publishSite(params: {
  address: string;
  title: string;
  body: string;
  authorId: string;
}): Promise<Site> {
  const res = await fetch(`${API}/sites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Publish failed');
  return res.json();
}

export async function recordVisit(params: { personId: string; address: string; via: string }) {
  await fetch(`${API}/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
}

export async function getHistory(personId: string): Promise<Visit[]> {
  const res = await fetch(`${API}/visits?personId=${personId}`, { cache: 'no-store' });
  return res.json();
}
