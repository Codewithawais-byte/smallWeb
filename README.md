# the small web

## Run it

Requires a local MongoDB running on `mongodb://localhost:27017`.

```bash
# backend
cd backend
npm install
npm run seed        # deterministic, idempotent — safe to re-run
npm run start:dev   # http://localhost:4000

# frontend (new terminal)
cd frontend
npm install
npm run dev          # http://localhost:3000
```

Optional env vars: `MONGO_URI` (backend), `NEXT_PUBLIC_API_URL` (frontend, defaults to `http://localhost:4000`).
