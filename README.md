# DigiPulse Frontend (Nuxt 4)

A modern, high-performance monitoring dashboard built with Nuxt 4 and Vanilla CSS, featuring a premium Bento Grid UI.

## Technology Stack

- **Nuxt 4** (SSR)
- **Styling**: Vanilla CSS (Modern CSS features)
- **State Management**: Pinia / Nuxt Built-ins
- **UI Components**: Custom Bento Grid implementation
- **Security**: Cloudflare Turnstile integration

## Key Features

- **Live Dashboard**: Real-time site status updates.
- **Bento Grid Layout**: Responsive and visually stunning data presentation.
- **Glassmorphism**: Modern aesthetics with backdrop filters and smooth transitions.
- **SEO Optimized**: Meta tags and structured data included.

## Deployment (CI/CD)

Deployments are automated via **GitHub Actions**.

### Workflow:
1.  **Build**: Project is built using `pnpm build`, generating a self-contained `.output`.
2.  **Environment**: Public variables are injected during the build process from GitHub Variables.
3.  **Deploy**: The `.output` bundle is uploaded to the server via SCP and symlinked to `/home/yurii/digi-pulse-frontend/current`.
4.  **Runtime**: A Node.js container on the server executes the Nitro build.

### Required GitHub Variables/Secrets:

| Variable | Description |
|---|---|
| `NUXT_PUBLIC_API_BASE` | URL of the Backend API (e.g., `https://api.pulse.digispace.pro/api`). |
| `NUXT_TURNSTILE_SITE_KEY` | Cloudflare Turnstile Site Key. |
| `SSH_KEY` (Secret) | Private SSH key for the Hetzner server. |

## Local Development

1.  Clone the repository.
2.  Install dependencies: `pnpm install`.
3.  Start dev server: `pnpm dev`.
4.  Open `http://localhost:3000`.

## Design Principles

- **Rich Aesthetics**: Avoid browser defaults. Use harmonious color palettes and modern typography.
- **Micro-animations**: Subtle interactions for improved UX.
- **Performance First**: Minimal external dependencies, leveraging native browser capabilities.
