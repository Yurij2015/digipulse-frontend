export const PLAN_SLUGS = ['start', 'growth', 'agency'] as const;

export type PlanSlug = typeof PLAN_SLUGS[number];

export interface PlanDefinition {
  slug: PlanSlug;
  siteLimit: number;
}

export const PLAN_DEFINITIONS: Record<PlanSlug, PlanDefinition> = {
  start: { slug: 'start', siteLimit: 6 },
  growth: { slug: 'growth', siteLimit: 20 },
  agency: { slug: 'agency', siteLimit: 60 },
};

export const DEFAULT_PLAN_SLUG: PlanSlug = 'start';

export function isPlanSlug(value: string | null | undefined): value is PlanSlug {
  return !!value && PLAN_SLUGS.includes(value as PlanSlug);
}

export function resolvePlanSlug(value: string | null | undefined): PlanSlug {
  return isPlanSlug(value) ? value : DEFAULT_PLAN_SLUG;
}

export function resolveSiteLimit(plan: PlanSlug, override?: number | null): number {
  if (typeof override === 'number' && override >= 0) {
    return override;
  }

  return PLAN_DEFINITIONS[plan].siteLimit;
}
