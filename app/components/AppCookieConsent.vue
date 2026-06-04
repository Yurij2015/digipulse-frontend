<script setup lang="ts">
import {
  buildCookieConsentRecord,
  COOKIE_CONSENT_DISMISS_SESSION_KEY,
  COOKIE_CONSENT_STORAGE_KEY,
  COOKIE_CONSENT_VERSION,
  consentStatusFromChoice,
  parseCookieConsent,
  type CookieConsentChoice,
} from '~/utils/cookie-consent'

const { t } = useI18n()
const localePath = useLocalePath()
const { gtag } = useGtag()

const consentButtonClass =
  'justify-center border-white/25 font-semibold text-white hover:bg-white/10 sm:flex-1'

const isVisible = useState('cookie-consent-visible', () => false)
/** unset = no choice; denied = reject all; essential = essential only; granted = accept all */
const consentStatus = useState<'unset' | 'denied' | 'essential' | 'granted'>('cookie-consent-status', () => 'unset')
const reopenBanner = useState('cookie-consent-reopen', () => false)

function persistAndApply(choice: CookieConsentChoice) {
  sessionStorage.removeItem(COOKIE_CONSENT_DISMISS_SESSION_KEY)
  const record = buildCookieConsentRecord(choice)
  localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(record))
  applyConsent(choice)
  isVisible.value = false
}

function applyConsent(choice: CookieConsentChoice) {
  consentStatus.value = consentStatusFromChoice(choice)
  const analytics = choice === 'accept_all'

  gtag('consent', 'update', {
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    ad_storage: 'denied',
    analytics_storage: analytics ? 'granted' : 'denied',
    functionality_storage: 'denied',
    security_storage: 'granted',
  })
}

/** Close without saving — banner hidden for this session only */
function dismissBanner() {
  sessionStorage.setItem(COOKIE_CONSENT_DISMISS_SESSION_KEY, '1')
  isVisible.value = false
}

watch(reopenBanner, (shouldOpen) => {
  if (!shouldOpen) return
  sessionStorage.removeItem(COOKIE_CONSENT_DISMISS_SESSION_KEY)
  isVisible.value = true
  reopenBanner.value = false
})

onMounted(() => {
  const saved = parseCookieConsent(localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY))
  if (!saved) {
    if (!sessionStorage.getItem(COOKIE_CONSENT_DISMISS_SESSION_KEY)) {
      setTimeout(() => {
        isVisible.value = true
        consentStatus.value = 'unset'
      }, 1500)
    }
    return
  }

  if (saved.version < COOKIE_CONSENT_VERSION) {
    // Policy updated — apply safe default and show banner again so user re-confirms
    applyConsent('essential_only')
    if (!sessionStorage.getItem(COOKIE_CONSENT_DISMISS_SESSION_KEY)) {
      setTimeout(() => { isVisible.value = true }, 1500)
    }
    return
  }

  applyConsent(saved.choice)
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-400 ease-out"
    enter-from-class="translate-y-full scale-95"
    enter-to-class="translate-y-0 scale-100"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0 scale-100"
    leave-to-class="translate-y-full scale-95"
  >
    <div
      v-if="isVisible"
      class="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:max-w-2xl"
    >
      <div class="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition-[transform,box-shadow] duration-300 hover:border-white/20">
        <button
          type="button"
          class="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
          :aria-label="t('common.cookie.close')"
          @click="dismissBanner"
        >
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5" />
        </button>

        <div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-500/10 blur-[80px] transition-opacity duration-700 group-hover:opacity-20"></div>
        <div class="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]"></div>

        <div class="relative">
          <div class="flex flex-col gap-6 md:flex-row md:items-center">
            <div class="flex-shrink-0">
              <div class="relative flex h-14 w-14 items-center justify-center">
                <div class="absolute inset-0 animate-pulse rounded-2xl bg-primary-500/20"></div>
                <UIcon name="i-heroicons-shield-check" class="relative h-8 w-8 text-primary-400" />
              </div>
            </div>

            <div class="flex-1 pr-8">
              <h3 class="text-lg font-bold tracking-tight text-white">
                {{ t('common.cookie.title') }}
              </h3>
              <p class="mt-1 text-sm leading-relaxed text-gray-200">
                {{ t('common.cookie.description') }}
                <NuxtLink :to="localePath('/privacy')" class="ml-1 font-bold text-primary-400 underline-offset-4 hover:underline">
                  {{ t('index.privacy_policy') }}
                </NuxtLink>
              </p>
            </div>
          </div>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <UButton
              variant="outline"
              color="neutral"
              size="lg"
              block
              :class="consentButtonClass"
              @click="persistAndApply('essential_only')"
            >
              {{ t('common.cookie.decline') }}
            </UButton>
            <UButton
              variant="outline"
              color="neutral"
              size="lg"
              block
              :class="consentButtonClass"
              @click="persistAndApply('accept_all')"
            >
              {{ t('common.cookie.accept') }}
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
