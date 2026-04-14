<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 lg:ml-72 min-h-screen">
      <header class="mb-16">
        <UButton :to="localePath('/dashboard')" icon="i-heroicons-arrow-left" variant="ghost" color="neutral" class="mb-8 font-bold hover:gap-3 transition-all">
          {{ $t('add_website.back') }}
        </UButton>
        <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">{{ $t('profile.title') }}</h1>
        <p class="text-neutral-500 font-medium">{{ $t('profile.subtitle') }}</p>
      </header>

      <div class="max-w-3xl">
        <div class="glass-card p-10 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary-500 to-purple-500"></div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Info List -->
            <div class="space-y-8">
              <div v-for="field in profileFields" :key="field.label">
                <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{{ $t(field.label) }}</div>
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500">
                    <UIcon :name="field.icon" class="text-lg" />
                  </div>
                  <div class="text-lg font-bold text-neutral-900 dark:text-white">
                    {{ field.value || '—' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Visual Profile Card -->
            <div class="hidden md:flex flex-col items-center justify-center p-8 rounded-2xl bg-neutral-50 dark:bg-white/2 border border-neutral-100 dark:border-white/5">
              <div class="w-24 h-24 rounded-3xl bg-linear-to-br from-primary-500 to-purple-600 flex items-center justify-center text-3xl text-white font-black shadow-2xl shadow-primary-500/30 mb-6 transform hover:rotate-6 transition-transform">
                {{ userInitials }}
              </div>
              <div class="text-center">
                <div class="text-xl font-black text-neutral-900 dark:text-white">
                  {{ user?.first_name }} {{ user?.last_name }}
                </div>
                <div class="text-sm text-neutral-500 font-medium lowercase">
                  @{{ user?.name }}
                </div>
                <div class="mt-4 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-tighter border border-primary-500/20">
                  {{ $t('profile.premium_member') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Integrations Section -->
        <div class="mt-12">
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-cpu-chip" class="text-primary-500" />
            Integrations
          </h2>
          
          <div class="glass-card p-8 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden group">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="flex items-start gap-5">
                <div class="p-4 rounded-2xl bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 shadow-inner group-hover:scale-110 transition-transform">
                  <UIcon name="i-heroicons-paper-airplane" class="text-2xl -rotate-45 translate-x-0.5" />
                </div>
                <div class="max-w-md">
                  <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-1">
                    {{ $t('profile.telegram_title') }}
                  </h3>
                  <p class="text-sm text-neutral-500 font-medium leading-relaxed">
                    {{ $t('profile.telegram_desc') }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div v-if="(user as any)?.telegram_chat_id" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 text-xs font-black uppercase tracking-tight">
                  <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  {{ $t('profile.telegram_connected') }}
                </div>
                <UButton
                  v-else
                  icon="i-heroicons-plus-circle"
                  size="xl"
                  class="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black px-8 py-4 rounded-2xl hover:scale-[1.05] active:scale-95 transition-all shadow-xl shadow-primary-500/10"
                  @click="connectTelegram"
                >
                  {{ $t('profile.telegram_connect') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLocalePath } from '#i18n';
import { useAuth } from '#imports';

const localePath = useLocalePath();
const { user } = useAuth();

definePageMeta({
  middleware: 'auth'
});

const userInitials = computed(() => {
  if (!user.value) return '??';
  const u = user.value as any;
  if (!u.first_name || !u.last_name) return u.name?.substring(0, 2).toUpperCase() || '??';
  return (u.first_name[0] + u.last_name[0]).toUpperCase();
});

const profileFields = computed(() => [
  { label: 'profile.username', value: user.value?.name, icon: 'i-heroicons-at-symbol' },
  { label: 'profile.first_name', value: user.value?.first_name, icon: 'i-heroicons-user' },
  { label: 'profile.last_name', value: user.value?.last_name, icon: 'i-heroicons-user' },
  { label: 'profile.email', value: user.value?.email, icon: 'i-heroicons-envelope' },
]);

const connectTelegram = () => {
  // Logic to redirect to Telegram Bot with user-specific token
  window.open('https://t.me/YourDigiPulseBot', '_blank');
};
</script>
