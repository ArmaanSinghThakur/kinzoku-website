# Kinzoku website

Next.js rebuild of [kinzokutrade.com](https://www.kinzokutrade.com), following
`docs/Kinzoku Website Rebuild Plan.pdf`. Content decisions are in `docs/content-report.md`.

## Run it locally

Needs Node 24 and Docker Desktop.

```bash
npm install                 # also prepares the database client
cp .env.example .env        # first time only, then choose a database password (on both lines)
npm run services:up         # start the database and the mail catcher (Docker)
npm run db:migrate          # create or update the tables
npm run dev                 # http://localhost:3000
```

Pages work without the database; quote requests, the admin area and live chat need it.
Files attached to quote requests are saved in `storage/uploads` (not in git). Emails sent locally
are caught by Mailpit: read them at http://localhost:8025.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with live reload |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` / `npm run typecheck` | Code checks |
| `npm run services:up` / `npm run services:down` | Start / stop the local database and mail catcher (data is kept) |
| `npm run db:migrate -- --name <change>` | After editing `prisma/schema.prisma`: record and apply the change |
| `npm run db:deploy` | Apply recorded changes only (server) |
| `npm run db:check` | Database check with test data that is removed afterwards |
| `npm run staff:add -- --name "Jane Doe" --email jane@kinzokutrade.com --role admin` | Add a staff member; prints a temporary password once |
| `node scripts/check-urls.mjs http://localhost:3000` | Every old address, the sitemap and every internal link |

The staff admin area is at `/admin` (log in with an account made by `staff:add`).
`/api/health` answers `{"status":"ok"}` when the site and database are up (503 otherwise).
