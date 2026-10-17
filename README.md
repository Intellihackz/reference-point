# Reference Point

Creators get paid in USDC every time an AI agent uses their work as a reference. Built for the MoonPay x PayBox hackathon.

- `app/`: Next.js website and API (publish, browse, pay-to-use via x402 on Base). Deploy to Vercel with **Root Directory = `app`** and an Upstash Redis store.
- `plugin/`: the PayBox plugin (TypeScript MCP server). `pnpm install --frozen-lockfile && pnpm test` builds `dist/plugin.mjs`.

## Deploy the app

Environment variables (Vercel):

| Variable | Purpose |
|---|---|
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Storage (added by the Upstash integration) |
| `ADMIN_KEY` | Optional. Allows `DELETE /api/refs/:id` with header `x-admin-key` |
| `FACILITATOR_URL` | Optional. Defaults to `https://facilitator.payai.network` |

Seed sample content: `node app/scripts/seed.mjs https://YOUR-APP.vercel.app 0xYourBaseWallet "Your Name"`

## Plugin settings (PayBox portal)

- Network host: your Vercel hostname
- Environment variable `REFERENCE_API` = `https://YOUR-APP.vercel.app`
