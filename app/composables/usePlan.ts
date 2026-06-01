import { computed } from 'vue';
import { useAuth } from '#imports';
import { useI18n } from '#i18n';
import { useSitesStore } from '~/stores/sites';
import {
  resolvePlanSlug,
  resolveSiteLimit,
  type PlanSlug,
} from '~/types/plan';

export const usePlan = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const sitesStore = useSitesStore();

  const planSlug = computed<PlanSlug>(() => resolvePlanSlug(user.value?.plan));

  const siteLimit = computed(() => resolveSiteLimit(planSlug.value, user.value?.site_limit));

  const planName = computed(() => t(`plans.${planSlug.value}`));

  const sitesUsed = computed(() => sitesStore.statusCounts.total);

  const usagePercent = computed(() => {
    if (siteLimit.value <= 0) return 0;
    return Math.min((sitesUsed.value / siteLimit.value) * 100, 100);
  });

  const hasReachedSiteLimit = computed(() => sitesUsed.value >= siteLimit.value);

  const canAddSite = computed(() => {
    if (user.value?.is_admin) return true;
    return !hasReachedSiteLimit.value;
  });

  return {
    planSlug,
    planName,
    siteLimit,
    sitesUsed,
    usagePercent,
    hasReachedSiteLimit,
    canAddSite,
  };
};
