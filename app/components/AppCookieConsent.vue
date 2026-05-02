<script setup lang="ts">
const { t } = useI18n()
const { gtag } = useGtag()

const isVisible = useState('cookie-consent-visible', () => false)
const consentStatus = useState<'all' | 'partial' | 'none'>('cookie-consent-status', () => 'none')
const showSettings = ref(false)

const preferences = ref({
  analytics: true,
  marketing: false,
  personalization: false,
  security: true // Always active but can be mapped
})

onMounted(() => {
  const consent = localStorage.getItem('cookie_consent_v2')
  if (!consent) {
    // Small delay for better UX impression
    setTimeout(() => {
      isVisible.value = true
      consentStatus.value = 'none'
    }, 1500)
  } else {
    try {
      const saved = JSON.parse(consent)
      applyConsent(saved)
    } catch {
      isVisible.value = true
      consentStatus.value = 'none'
    }
  }
})

const acceptAll = () => {
  const allGranted = { analytics: true, marketing: true, personalization: true }
  saveAndApply(allGranted)
}

const rejectAll = () => {
  const allDenied = { analytics: false, marketing: false, personalization: false }
  saveAndApply(allDenied)
}

const savePreferences = () => {
  saveAndApply(preferences.value)
}

function saveAndApply(values: { analytics: boolean, marketing: boolean, personalization?: boolean }) {
  localStorage.setItem('cookie_consent_v2', JSON.stringify(values))
  applyConsent(values)
  isVisible.value = false
  showSettings.value = false
}

function applyConsent(values: { analytics: boolean, marketing: boolean, personalization?: boolean }) {
  const isAll = values.analytics && values.marketing && (values.personalization ?? false)
  consentStatus.value = isAll ? 'all' : 'partial'

  gtag('consent', 'update', {
    ad_user_data: values.marketing ? 'granted' : 'denied',
    ad_personalization: values.personalization ? 'granted' : 'denied',
    ad_storage: values.marketing ? 'granted' : 'denied',
    analytics_storage: values.analytics ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-700 ease-out"
    enter-from-class="transform translate-y-full opacity-0 scale-95"
    enter-to-class="transform translate-y-0 opacity-100 scale-100"
    leave-active-class="transition duration-500 ease-in"
    leave-from-class="transform translate-y-0 opacity-100 scale-100"
    leave-to-class="transform translate-y-full opacity-0 scale-95"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:max-w-xl"
    >
      <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition-[transform,opacity,box-shadow] duration-500 hover:border-white/20">
        <!-- Premium Mesh Backgrounds -->
        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-[80px] transition-opacity duration-700 group-hover:opacity-20"></div>
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]"></div>

        <!-- Main Banner View -->
        <div v-if="!showSettings" class="relative">
          <div class="flex flex-col gap-6 md:flex-row md:items-center">
            <div class="flex-shrink-0">
              <div class="relative flex h-14 w-14 items-center justify-center">
                <div class="absolute inset-0 animate-pulse rounded-2xl bg-primary-500/20"></div>
                <UIcon name="i-heroicons-shield-check" class="relative h-8 w-8 text-primary-400" />
              </div>
            </div>
            
            <div class="flex-1">
              <h3 class="text-lg font-bold tracking-tight text-white">
                {{ t('common.cookie.title') }}
              </h3>
              <p class="mt-1 text-sm leading-relaxed text-gray-200">
                {{ t('common.cookie.description') }}
                <NuxtLink to="/privacy" class="ml-1 font-bold text-primary-400 underline-offset-4 hover:underline">
                  {{ t('index.privacy_policy') }}
                </NuxtLink>
              </p>
            </div>
          </div>
          
          <div class="mt-8 flex flex-wrap items-center justify-end gap-3">
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              class="text-gray-400 hover:bg-white/5 hover:text-white"
              @click="showSettings = true"
            >
              {{ t('common.cookie.settings') }}
            </UButton>
            <UButton
              variant="soft"
              color="neutral"
              size="md"
              class="bg-white/5 font-medium text-white hover:bg-white/10"
              @click="rejectAll"
            >
              {{ t('common.cookie.decline') }}
            </UButton>
            <UButton
              color="primary"
              size="md"
              class="px-8 font-bold shadow-lg shadow-primary-500/20 transition-transform active:scale-95"
              @click="acceptAll"
            >
              {{ t('common.cookie.accept') }}
            </UButton>
          </div>
        </div>

        <!-- Settings Detailed View -->
        <div v-else class="relative space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <UButton
                variant="ghost"
                icon="i-heroicons-arrow-left"
                color="neutral"
                class="rounded-full"
                @click="showSettings = false"
              />
              <h3 class="text-lg font-bold text-white">{{ t('common.cookie.settings') }}</h3>
            </div>
          </div>

          <div class="grid gap-3">
            <!-- Essential -->
            <div class="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-opacity hover:bg-white/5">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="font-semibold text-white">{{ t('common.cookie.essential') }}</span>
                  <UBadge size="xs" variant="soft" color="neutral" class="bg-white/10 text-[10px] uppercase tracking-wider">Required</UBadge>
                </div>
                <p class="mt-1 text-xs text-gray-400">{{ t('common.cookie.essential_desc') }}</p>
              </div>
              <USwitch disabled :model-value="true" />
            </div>

            <!-- Analytics -->
            <div class="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-opacity hover:bg-white/5">
              <div class="flex-1">
                <span class="font-semibold text-white">{{ t('common.cookie.analytics') }}</span>
                <p class="mt-1 text-xs text-gray-400">{{ t('common.cookie.analytics_desc') }}</p>
              </div>
              <USwitch v-model="preferences.analytics" />
            </div>

            <!-- Marketing -->
            <div class="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-opacity hover:bg-white/5">
              <div class="flex-1">
                <span class="font-semibold text-white">{{ t('common.cookie.marketing') }}</span>
                <p class="mt-1 text-xs text-gray-400">{{ t('common.cookie.marketing_desc') }}</p>
              </div>
              <USwitch v-model="preferences.marketing" />
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <UButton
              color="primary"
              block
              size="lg"
              class="font-bold"
              @click="savePreferences"
            >
              {{ t('common.cookie.save') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

