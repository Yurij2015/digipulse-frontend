# DigiPulse Frontend (Nuxt 4)

Part of **DigiPulse** — a production SaaS for website and SSL monitoring. This repository contains the user-facing dashboard: real-time status updates, uptime history charts, site and team management.

## Technology Stack

- **Nuxt 4** (SSR, Nitro runtime)
- **Vue 3** / Composition API
- **Pinia** for state management
- **Vanilla CSS** (no utility-class frameworks)
- **Cloudflare Turnstile** for bot protection on auth forms

## Deployment (CI/CD)

Deployments are automated via **GitHub Actions**.

### Workflow:
1. **Build**: `pnpm build` generates a self-contained `.output` bundle.
2. **Environment**: Public variables are injected at build time from GitHub Variables.
3. **Deploy**: The `.output` bundle is uploaded to the server via SCP and activated with a symlink swap.
4. **Runtime**: A Node.js container runs the Nitro server.

### Required GitHub Variables/Secrets:

| Variable | Description |
|---|---|
| `NUXT_PUBLIC_API_BASE` | URL of the Backend API (e.g., `https://api.example.com/api`). |
| `NUXT_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Site Key. |
| `SSH_KEY` (Secret) | Private SSH key for the server. |

## Local Development

1. Clone the repository.
2. Install dependencies: `pnpm install`.
3. Start dev server: `pnpm dev`.
4. Open `http://localhost:3000`.

Set `NUXT_PUBLIC_API_BASE` in `.env` to point to a local or staging backend instance.