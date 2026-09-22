/**
 * Deterministic, idempotent seed. Uses `upsert` keyed on unique fields
 * (person name, site address) so running this twice does not double
 * the web — it just converges to the same state.
 *
 * Run: npm run seed
 */
import mongoose from 'mongoose';
import { Person } from '../schemas/person.schema';
import { Site } from '../schemas/site.schema';
import { Visit } from '../schemas/visit.schema';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/small-web';

const PEOPLE = ['mara', 'oskar', 'lin', 'devi', 'foss'];

// authorOf[i] picks who wrote SITES[i]; two authors (mara, devi) get
// more than one site, per the brief.
const SITES: { address: string; title: string; author: string; body: string; links: string[] }[] = [
  {
    address: 'tidepool.zz',
    title: 'Tidepool',
    author: 'mara',
    links: ['driftnotes.zz', 'saltmap.zz', 'nowhere.zz'],
    body: `<h1>Tidepool</h1><p>Notes on the pools past the breakwater. Every low tide, something new.
    See also <a href="driftnotes.zz">driftnotes</a> and the <a href="saltmap.zz">salt map</a>.
    There used to be a page at <a href="nowhere.zz">nowhere.zz</a> but I think it's gone.</p>`,
  },
  {
    address: 'driftnotes.zz',
    title: 'Drift Notes',
    author: 'mara',
    links: ['tidepool.zz', 'lighthouse.zz'],
    body: `<h1>Drift Notes</h1><p>Where things wash up and why. Cross-reference with
    <a href="tidepool.zz">Tidepool</a>. The <a href="lighthouse.zz">lighthouse keeper</a> logs wrecks too.</p>`,
  },
  {
    address: 'lighthouse.zz',
    title: "The Keeper's Log",
    author: 'oskar',
    links: ['saltmap.zz', 'fogline.zz'],
    body: `<h1>The Keeper's Log</h1><p>Forty years of weather and one very stubborn lamp.
    Charts live at <a href="saltmap.zz">saltmap</a>. My apprentice writes at <a href="fogline.zz">fogline</a>.</p>`,
  },
  {
    address: 'saltmap.zz',
    title: 'Salt Map',
    author: 'oskar',
    links: ['tidepool.zz', 'harborwatch.zz'],
    body: `<h1>Salt Map</h1><p>A hand-drawn chart of every inlet worth naming.
    Compare against <a href="tidepool.zz">Tidepool</a> and <a href="harborwatch.zz">Harborwatch</a>.</p>`,
  },
  {
    address: 'fogline.zz',
    title: 'Fogline',
    author: 'lin',
    links: ['lighthouse.zz', 'ferryboard.zz', 'wreckindex.zz'],
    body: `<h1>Fogline</h1><p>Visibility reports, mostly wrong. Back to
    <a href="lighthouse.zz">the keeper</a>. See what's sailing at <a href="ferryboard.zz">ferryboard</a>.
    An old wreck registry lives at <a href="wreckindex.zz">wreckindex</a>, if it's still there.</p>`,
  },
  {
    address: 'harborwatch.zz',
    title: 'Harborwatch',
    author: 'lin',
    links: ['ferryboard.zz', 'driftnotes.zz'],
    body: `<h1>Harborwatch</h1><p>Who's docked, who left. Ferries at <a href="ferryboard.zz">ferryboard</a>,
    and what washes up eventually reaches <a href="driftnotes.zz">Drift Notes</a>.</p>`,
  },
  {
    address: 'ferryboard.zz',
    title: 'Ferry Board',
    author: 'devi',
    links: ['harborwatch.zz', 'tollhouse.zz'],
    body: `<h1>Ferry Board</h1><p>Departures, mostly on time. Fees at
    <a href="tollhouse.zz">the tollhouse</a>. Arrivals logged at <a href="harborwatch.zz">Harborwatch</a>.</p>`,
  },
  {
    address: 'tollhouse.zz',
    title: 'The Tollhouse',
    author: 'devi',
    links: ['ferryboard.zz', 'oldpier.zz'],
    body: `<h1>The Tollhouse</h1><p>Prices haven't changed since the pier did. See
    <a href="oldpier.zz">Old Pier</a> for why, or back to <a href="ferryboard.zz">Ferry Board</a>.</p>`,
  },
  {
    address: 'oldpier.zz',
    title: 'Old Pier',
    author: 'foss',
    links: ['tidepool.zz', 'brokenlamp.zz'],
    body: `<h1>Old Pier</h1><p>Half of it is underwater now. Read about what's left at
    <a href="tidepool.zz">Tidepool</a>. The <a href="brokenlamp.zz">broken lamp</a> page never loaded for me either.</p>`,
  },
  {
    address: 'brokenlamp.zz',
    title: 'The Broken Lamp',
    author: 'foss',
    links: ['lighthouse.zz', 'wreckindex.zz'],
    body: `<h1>The Broken Lamp</h1><p>A short history of the light that used to warn ships off Old Pier.
    Compare to the working one at <a href="lighthouse.zz">the lighthouse</a>. I keep meaning to fix
    <a href="wreckindex.zz">wreckindex</a> too.</p>`,
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  const PersonModel = mongoose.model('Person', Person.schema ?? new mongoose.Schema({ name: String }));

  // --- People (upsert by name) ---
  const personIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const name of PEOPLE) {
    const doc = await mongoose.connection.collection('people').findOneAndUpdate(
      { name },
      { $setOnInsert: { name } },
      { upsert: true, returnDocument: 'after' },
    );
    personIds[name] = doc!._id;
  }

  // --- Sites (upsert by address) ---
  const siteIds: Record<string, mongoose.Types.ObjectId> = {};
  for (const s of SITES) {
    const doc = await mongoose.connection.collection('sites').findOneAndUpdate(
      { address: s.address },
      {
        $set: { title: s.title, body: s.body, authorId: personIds[s.author] },
        $setOnInsert: { address: s.address, createdAt: new Date('2026-01-01') },
      },
      { upsert: true, returnDocument: 'after' },
    );
    siteIds[s.address] = doc!._id;
  }
  await mongoose.connection.collection('sites').createIndex({ title: 'text', body: 'text' });

  // --- Visits: deterministic ~1 hour of history, seeded per person ---
  // Clear old seed-visits first (idempotent re-seed), keyed by a marker.
  await mongoose.connection.collection('visits').deleteMany({ seeded: true });

  const addresses = SITES.map((s) => s.address);
  const dead = ['nowhere.zz', 'wreckindex.zz']; // referenced, never published
  const base = new Date('2026-09-20T09:00:00Z').getTime();

  // Deterministic pseudo-random walk (LCG) so re-seeding is identical.
  function lcg(seed: number) {
    let s = seed;
    return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648);
  }

  const visitDocs: any[] = [];
  let tOffset = 0;
  PEOPLE.forEach((name, pIdx) => {
    const rand = lcg(pIdx * 97 + 13);
    const personId = personIds[name];
    // 'foss' has been nearly everywhere; others get shorter trails.
    const stops = name === 'foss' ? 18 : 6 + Math.floor(rand() * 6);
    let current: string | null = null;
    for (let i = 0; i < stops; i++) {
      const goDead = rand() < 0.12;
      const pool = goDead ? dead : addresses;
      const address = pool[Math.floor(rand() * pool.length)];
      const via = i === 0 ? 'typed' : rand() < 0.7 ? 'link' : 'history';
      visitDocs.push({
        personId,
        address,
        resolvedSiteId: siteIds[address] ?? null,
        via,
        at: new Date(base + tOffset * 60000),
        seeded: true,
      });
      tOffset += 2 + Math.floor(rand() * 5);
      current = address;
    }
  });

  await mongoose.connection.collection('visits').insertMany(visitDocs);

  console.log(`Seeded ${SITES.length} sites, ${PEOPLE.length} people, ${visitDocs.length} visits.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
