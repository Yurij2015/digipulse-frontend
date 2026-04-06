<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <!-- Sidebar (same as dashboard) -->
    <aside class="hidden lg:flex fixed inset-y-0 left-0 z-52 w-72 h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-white/5 p-8 flex-col">
      <div class="flex items-center justify-between mb-12">
        <div class="text-2xl font-black tracking-tight cursor-pointer" @click="navigateTo(localePath('/dashboard'))">DigiPulse</div>
      </div>

      <nav class="space-y-1">
        <UButton
          v-for="link in links" :key="link.to"
          :to="link.to"
          :variant="route.path === link.to ? 'soft' : 'ghost'"
          :color="route.path === link.to ? 'primary' : 'neutral'"
          class="w-full justify-start gap-4 font-bold py-3 px-5 rounded-lg transition-all"
          :class="route.path === link.to ? 'shadow-sm bg-primary-100/10 dark:bg-primary-500/10 ring-1 ring-primary-500/20' : 'text-neutral-500'"
        >
          <UIcon :name="link.icon" class="text-xl" />
          <span class="text-[13px] tracking-tight">{{ link.label }}</span>
        </UButton>
      </nav>

      <div class="mt-auto pt-8 border-t border-neutral-100 dark:border-white/5 space-y-4">
        <div class="flex items-center gap-3 p-3 rounded-xl bg-primary-50 dark:bg-primary-500/5 border border-primary-500/10">
          <div class="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary-500/20">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-black text-neutral-900 dark:text-white truncate uppercase tracking-tight">
              {{ user?.name }}
            </div>
            <div class="text-[11px] font-medium text-neutral-500 truncate italic">
              Settings Mode
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-white/5">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 lg:ml-72 min-h-screen">
      <header class="mb-16">
        <UButton :to="localePath('/dashboard')" icon="i-heroicons-arrow-left" variant="ghost" color="neutral" class="mb-8 font-bold hover:gap-3 transition-all">
          {{ $t('add_website.back') }}
        </UButton>
        <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">User Profile</h1>
        <p class="text-neutral-500 font-medium">Manage your personal information and account security.</p>
      </header>

      <div class="max-w-3xl">
        <div class="glass-card p-10 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary-500 to-purple-500"></div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Info List -->
            <div class="space-y-8">
              <div v-for="field in profileFields" :key="field.label">
                <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{{ field.label }}</div>
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
                  Premium Member
                </div>
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
import { useI18n, useLocalePath } from '#i18n';
import { useRoute, useRouter, useAuth } from '#imports';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();
const { user } = useAuth();

definePageMeta({
  middleware: 'auth'
});

const userInitials = computed(() => {
  if (!user.value) return '??';
  if (!user.value.first_name || !user.value.last_name) return user.value.name?.substring(0, 2).toUpperCase() || '??';
  return (user.value.first_name[0] + user.value.last_name[0]).toUpperCase();
});

const profileFields = computed(() => [
  { label: 'Username', value: user.value?.name, icon: 'i-heroicons-at-symbol' },
  { label: 'First Name', value: user.value?.first_name, icon: 'i-heroicons-user' },
  { label: 'Last Name', value: user.value?.last_name, icon: 'i-heroicons-user' },
  { label: 'Email Address', value: user.value?.email, icon: 'i-heroicons-envelope' },
]);

const links = computed(() => [
  { label: t('dashboard.title'), icon: 'i-heroicons-home', to: localePath('/dashboard') },
  { label: t('sites.title'), icon: 'i-heroicons-globe-alt', to: localePath('/sites') },
  { label: t('dashboard.monitor_node'), icon: 'i-heroicons-plus-circle', to: localePath('/add-website') },
  { label: t('dashboard.settings'), icon: 'i-heroicons-cog-6-tooth', to: localePath('/settings') }
]);
</script>
