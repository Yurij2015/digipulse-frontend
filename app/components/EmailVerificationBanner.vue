<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '#i18n'
import { useAuth, useRuntimeConfig, useToast } from '#imports'

const { t } = useI18n()
const { user, token } = useAuth()
const config = useRuntimeConfig()
const toast = useToast()

const sending = ref(false)
const cooldownUntil = ref(0)

const cooldownActive = computed(() => Date.now() < cooldownUntil.value)

async function resend() {
  if (sending.value || cooldownActive.value) return

  sending.value = true
  try {
    await $fetch(`${config.public.apiBase}/api/email/verification-notification`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        Authorization: `Bearer ${token.value}`,
      },
    })
    cooldownUntil.value = Date.now() + 10_000 // 6 req/min → 10s cooldown
    toast.add({ title: t('auth.verify_email.resend_sent'), color: 'success' })
  } catch (err: any) {
    if (err?.status === 429) {
      cooldownUntil.value = Date.now() + 10_000
      toast.add({ title: t('auth.verify_email.resend_wait'), color: 'warning' })
    } else {
      toast.add({ title: t('common.error'), color: 'error' })
    }
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div
    v-if="user && !user.is_verified"
    class="flex items-start gap-3 rounded-xl px-4 py-3 bg-amber-500/10 border border-amber-500/25 dark:border-amber-500/15"
  >
    <UIcon name="i-heroicons-envelope" class="text-amber-500 shrink-0 mt-0.5 text-base" />
    <div class="flex-1 min-w-0">
      <p class="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-snug">
        {{ t('auth.verify_email.verify_banner') }}
      </p>
      <button
        class="mt-1 text-[10px] font-black text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 underline underline-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        :disabled="sending || cooldownActive"
        @click="resend"
      >
        {{ sending ? '…' : t('auth.verify_email.resend') }}
      </button>
    </div>
  </div>
</template>