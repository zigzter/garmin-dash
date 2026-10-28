# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal single-user dashboard for Garmin health and activity data. Hono API server + React (Vite) frontend, all TypeScript, Node 24 (`.nvmrc`).

## Commands

- `npm run dev` — runs the API server (`tsx watch`, port 8787) and Vite dev server together; Vite proxies `/api` to `127.0.0.1:8787`.
- `npm run build` — builds the frontend into `dist/` (repo root), which the server serves statically.
- `npm start` — runs the server with plain `node` (native TS type stripping, no build step for the server).
- `npm run typecheck` — `tsc --noEmit` over `server/` and `web/src/`.
- `npm test` — vitest. Single test: `npx vitest run server/splits.test.ts -t "<name>"`.
- `npm run probe` — dumps raw Garmin API responses for the last few days; use it to inspect real response shapes.
- Docker: `docker compose up --build` (see `Dockerfile`, `compose.yaml`; targets a Synology NAS).

Requires `GARMIN_API_KEY` in `.env` (see `.env.example`). `HOST` defaults to `127.0.0.1`; the Docker image sets `0.0.0.0`.

## Architecture

- `server/garmin.ts` — the only Garmin client. Exchanges the personal API key for a JWT bearer token at `personal.connectapi.garmin.com`, caches it until its `exp`, and retries once with a fresh token on 401. Throws `GarminError` with `kind: "auth" | "upstream"`; `index.ts` maps these to `ApiError` JSON (502). The browser never talks to Garmin and never sees the key.
- `server/index.ts` — three routes: `/api/health` (merges daily summaries, sleep and HRV by `calendarDate`, newest first), `/api/activities`, `/api/activities/:id/splits`. Dates use `toLocaleDateString("en-CA")` for local `YYYY-MM-DD`, so the server `TZ` matters.
- `server/splits.ts` — splits come from the activity's downloaded FIT file (zip → `fflate` → `@garmin/fitsdk`), not from a JSON endpoint. Returns laps first, then run/walk/stand segments (`rwdRun`/`rwdWalk`/`rwdStand` split messages). Unit conversions (running cadence strides→steps, step length mm→m) happen here. `toSplits` is the tested pure function.
- `server/garmin.types.ts` holds raw Garmin response shapes; `server/api.types.ts` holds the shapes the server returns. The frontend imports `api.types.ts` directly (`../../server/api.types.ts`) — keep it type-only.
- `web/src/` — `App.tsx` loads health and activities via `useJson` (which normalizes all failures into `ApiError`). `Recovery` and `History` share a `cursor` (selected date) lifted into `App`. Split CSV export is client-side via `csv.ts`.
- Imports use explicit `.ts`/`.tsx` extensions and `verbatimModuleSyntax` / `erasableSyntaxOnly` are on, so use `import type` and avoid enums/namespaces/parameter properties (Node runs the server source directly).

## Product and design constraints

`PRODUCT.md` and `DESIGN.md` (Impeccable-managed, tokens in `DESIGN.md` frontmatter) define the product. Key rules:
- Missing data shows as missing, never estimated or defaulted.
- Show only metrics that make sense for the activity type (e.g. strength has no distance/pace).
- Dark, dense, conventional dashboard style; follow the `DESIGN.md` tokens rather than inventing colors.
- The dashboard exposes personal health data; access control for the hosted deployment is still an open decision, so don't widen exposure (e.g. CORS, binding) casually.
