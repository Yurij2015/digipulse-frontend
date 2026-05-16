<nuxt4-frontend-guidelines>
=== foundation rules ===

# Nuxt 4 Frontend Guidelines

These guidelines are specifically curated for the DigiPulse frontend project. Follow them to ensure consistency and high-quality UI/UX.

## Foundational Context

This application is a Nuxt 4 application. The exact installed versions (from `package.json`) are:

- **nuxt** - `^4.4.2`
- **@nuxt/ui** - `^4.6.1`
- **tailwindcss** - `^4.2.2`
- **@tailwindcss/vite** - `4.2.2`
- **vue** - `^3.5.31`
- **vue-router** - `^5.0.4`
- **pinia** - `^3.0.4`
- **@pinia/nuxt** - `^0.11.3`
- **@nuxtjs/i18n** - `^10.2.4`
- **@nuxtjs/color-mode** - `^4.0.0`
- **@nuxtjs/turnstile** - `^1.1.2`
- **@nuxtjs/sitemap** - `^8.0.15`
- **nuxt-gtag** - `4.1.0`
- **laravel-echo** - `^2.3.4`
- **pusher-js** - `^8.5.0`
- **chart.js** - `^4.5.1`
- **vue-chartjs** - `^5.3.3`
- **date-fns** - `^4.1.0`
- **yup** - `^1.4.0`

## MANDATORY: Version Check Before Writing UI Code

**Before creating or modifying any component**, you MUST verify the API of the relevant package against the installed version. This is a hard requirement, not optional.

**Why:** Nuxt UI v4 introduced breaking changes vs v3 (e.g., `USelect` with `:options` was replaced by `USelectMenu` with `:items` + `value-key`). Using v3 patterns silently fails in v4.

**How to verify:**
1. Read `package.json` in the project root to confirm the installed version of the relevant package.
2. Use `search-docs` or check the official documentation for the **exact installed version** before using any component, composable, or API.
3. If documentation conflicts with the installed version, always trust `package.json` + the source in `node_modules`.

**Known breaking changes to be aware of:**
- **Nuxt UI v4**: `USelect` (v3) → `USelectMenu` (v4). Props changed: `:options` → `:items`, add `value-key="value"` for primitive v-model binding.
- **Nuxt UI v4**: Always check official docs at https://ui.nuxt.com for the correct component name and props.
- **Tailwind CSS v4**: Configuration moved from `tailwind.config.js` to CSS-first config in the main CSS file.
- **Vue Router v5**: Some APIs changed vs v4.

## Conventions

- **Directory Structure**: Always use the `app/` directory as the root for source files (pages, components, stores, etc.).
- **Routing**: If a directory `pages/feature/` exists, the main list page must be `pages/feature/index.vue`, not `pages/feature.vue`, to prevent routing conflicts with child pages.
- **Components**: Use Nuxt UI components where possible.
- **Icons**: Use Lucide icons (i-heroicons-*).

## Aesthetics & Design

- **Premium Feel**: Use the "Premium Scholar" aesthetic.
- **Theme**: Full support for light and dark modes.
- **Visuals**: Use glass-cards, mesh backgrounds, and smooth transitions.
- **Animations**: Implement subtle micro-animations for interactions.

## Best Practices

- Always check `package.json` and verify component API against the installed version **before** writing any code.
- Use `useAsyncData` for initial data fetching on pages.
- Ensure proper localization using `@nuxtjs/i18n`.
- Keep components small and focused.

</nuxt4-frontend-guidelines>
