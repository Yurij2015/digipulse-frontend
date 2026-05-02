<script setup lang="ts">
const { t } = useI18n()
const { gtag } = useGtag()

const isVisible = useState('cookie-consent-visible', () => false)
const consentStatus = useState<'all' | 'partial' | 'none'>('cookie-consent-status', () => 'none')
const showSettings = ref(false)

const preferences = ref({
  analytics: true,
  marketing: false
})

onMounted(() => {
  const consent = localStorage.getItem('cookie_consent_v2')
  if (!consent) {
    isVisible.value = true
    consentStatus.value = 'none'
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
  const allGranted = { analytics: true, marketing: true }
  saveAndApply(allGranted)
}

const rejectAll = () => {
  const allDenied = { analytics: false, marketing: false }
  saveAndApply(allDenied)
}

const savePreferences = () => {
  saveAndApply(preferences.value)
}

function saveAndApply(values: { analytics: boolean, marketing: boolean }) {
  localStorage.setItem('cookie_consent_v2', JSON.stringify(values))
  applyConsent(values)
  isVisible.value = false
  showSettings.value = false
}

function applyConsent(values: { analytics: boolean, marketing: boolean }) {
  const allGranted = values.analytics && values.marketing
  consentStatus.value = allGranted ? 'all' : 'partial'

  gtag('consent', 'update', {
    ad_user_data: values.marketing ? 'granted' : 'denied',
    ad_personalization: values.marketing ? 'granted' : 'denied',
    ad_storage: values.marketing ? 'granted' : 'denied',
    analytics_storage: values.analytics ? 'granted' : 'denied'
  })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="transform translate-y-20 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-20 opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:max-w-lg"
    >
      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-2xl">
        <!-- Mesh Background Effect -->
        <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from),_transparent_40%)] from-primary-500/10"></div>
        
        <div v-if="!showSettings">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 rounded-full bg-primary-500/20 p-2 text-primary-400">
              <UIcon name="i-heroicons-shield-check" class="h-6 w-6" />
            </div>
            
            <div class="flex-1">
              <h3 class="text-base font-semibold text-white">
                {{ t('common.cookie.title') }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-gray-400">
                {{ t('common.cookie.description') }}
              </p>
              
              <div class="mt-6 flex flex-wrap items-center justify-end gap-3">
                <UButton
                  variant="ghost"
                  size="sm"
                  class="text-gray-400 hover:text-white"
                  @click="showSettings = true"
                >
                  {{ t('common.cookie.settings') }}
                </UButton>
                <UButton
                  variant="soft"
                  color="neutral"
                  size="sm"
                  @click="rejectAll"
                >
                  {{ t('common.cookie.decline') }}
                </UButton>
                <UButton
                  color="primary"
                  size="sm"
                  class="px-6"
                  @click="acceptAll"
                >
                  {{ t('common.cookie.accept') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold text-white">{{ t('common.cookie.settings') }}</h3>
            <UButton
              variant="ghost"
              icon="i-heroicons-x-mark"
              color="neutral"
              @click="showSettings = false"
            />
          </div>

          <div class="space-y-4">
            <!-- Essential -->
            <div class="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-white">{{ t('common.cookie.essential') }}</span>
                  <UBadge size="xs" variant="soft" color="neutral">Always Active</UBadge>
                </div>
                <p class="mt-1 text-xs text-gray-500">{{ t('common.cookie.essential_desc') }}</p>
              </div>
              <USwitch disabled :model-value="true" />
            </div>

            <!-- Analytics -->
            <div class="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div class="flex-1">
                <span class="text-sm font-medium text-white">{{ t('common.cookie.analytics') }}</span>
                <p class="mt-1 text-xs text-gray-500">{{ t('common.cookie.analytics_desc') }}</p>
              </div>
              <USwitch v-model="preferences.analytics" />
            </div>

            <!-- Marketing -->
            <div class="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-white/5 p-4">
              <div class="flex-1">
                <span class="text-sm font-medium text-white">{{ t('common.cookie.marketing') }}</span>
                <p class="mt-1 text-xs text-gray-500">{{ t('common.cookie.marketing_desc') }}</p>
              </div>
              <USwitch v-model="preferences.marketing" />
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <UButton
              variant="soft"
              color="neutral"
              @click="showSettings = false"
            >
              Back
            </UButton>
            <UButton
              color="primary"
              class="px-6"
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
