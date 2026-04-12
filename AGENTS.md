<nuxt4-frontend-guidelines>
=== foundation rules ===

# Nuxt 4 Frontend Guidelines

These guidelines are specifically curated for the DigiPulse frontend project. Follow them to ensure consistency and high-quality UI/UX.

## Foundational Context

This application is a Nuxt 4 application. Ensure you abide by these specific packages & versions.

- **Nuxt** - v4.x
- **Nuxt UI** - v4.x
- **Tailwind CSS** - v4.x
- **Vue** - v3.5+

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

- Use `useAsyncData` for initial data fetching on pages.
- Ensure proper localization using `@nuxtjs/i18n`.
- Keep components small and focused.

</nuxt4-frontend-guidelines>
