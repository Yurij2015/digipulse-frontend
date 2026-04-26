<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter, useAuth, useRuntimeConfig } from '#imports';
import { useI18n, useLocalePath } from '#i18n';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const localePath = useLocalePath();
const config = useRuntimeConfig();
const { logout, token, user } = useAuth();

const isSidebarOpen = ref(false);

const userInitials = computed(() => {
  if (!user.value) return '??';
  const u = user.value as any;
  if (!u.first_name || !u.last_name) return u.name?.substring(0, 2).toUpperCase() || '??';
  return (u.first_name[0] + u.last_name[0]).toUpperCase();
});

const links = computed(() => [
  { label: t('dashboard.title'), icon: 'i-heroicons-home', to: localePath('/dashboard') },
  { label: t('sites.title'), icon: 'i-heroicons-globe-alt', to: localePath('/sites') },
  { label: t('dashboard.settings'), icon: 'i-heroicons-cog-6-tooth', to: localePath('/settings') }
]);

async function handleLogout() {
  try {
    await $fetch(`${config.public.apiBase}/api/logout`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
  } catch (error) {
    console.error('Logout API Error:', error);
  } finally {
    logout();
    router.push(localePath('/'));
  }
}
</script>

<template>
  <div>
    <!-- Mobile Header -->
    <header class="lg:hidden flex items-center justify-between p-5 border-b border-neutral-200 dark:border-white/5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-50">
      <div class="text-xl font-black tracking-tight">DigiPulse</div>
      <div class="flex items-center gap-2">
        <ThemeSwitcher />
        <UButton icon="i-heroicons-bars-3" variant="ghost" color="neutral" @click="isSidebarOpen = !isSidebarOpen" class="cursor-pointer" />
      </div>
    </header>

    <!-- Sidebar Overlay for Mobile -->
    <div v-if="isSidebarOpen" class="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm z-51 lg:hidden cursor-pointer" @click="isSidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-52 w-72 h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-white/5 p-8 transition-transform lg:fixed lg:translate-x-0 flex flex-col',
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    ]">
      <div class="flex items-center justify-between mb-12">
        <div class="text-2xl font-black tracking-tight">DigiPulse</div>
        <UButton class="lg:hidden cursor-pointer" icon="i-heroicons-x-mark" variant="ghost" color="neutral" @click="isSidebarOpen = false" />
      </div>

      <nav class="space-y-1">
        <UButton
          v-for="link in links" :key="link.to"
          :to="link.to"
          :variant="route.path === link.to ? 'soft' : 'ghost'"
          :color="route.path === link.to ? 'primary' : 'neutral'"
          class="w-full justify-start gap-4 font-bold py-3 px-5 rounded-lg transition-all transform active:scale-95 cursor-pointer"
          :class="route.path === link.to ? 'shadow-sm bg-primary-100/10 dark:bg-primary-500/10 ring-1 ring-primary-500/20' : 'text-neutral-500'"
        >
          <UIcon :name="link.icon" class="text-xl" />
          <span class="text-[13px] tracking-tight">{{ link.label }}</span>
        </UButton>
      </nav>

      <div class="mt-auto pt-8 border-t border-neutral-100 dark:border-white/5 space-y-4">
        <!-- User Profile Block -->
        <NuxtLink :to="localePath('/settings')" class="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/5 transition-all group cursor-pointer">
          <div class="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 font-black text-sm border border-primary-500/20 group-hover:scale-110 transition-transform">
            {{ userInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="text-sm font-black text-neutral-900 dark:text-white truncate uppercase tracking-tight">
              {{ user?.name || 'User' }}
            </div>
            <div class="text-[11px] font-medium text-neutral-500 truncate">
              {{ user?.email }}
            </div>
          </div>
        </NuxtLink>

        <div class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-white/5">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>

        <UButton
          :to="localePath('/support')"
          variant="ghost"
          color="neutral"
          class="w-full justify-start gap-3 font-bold py-2.5 px-4 rounded-lg transition-all text-neutral-500 hover:text-primary-500 cursor-pointer"
        >
          <UIcon name="i-heroicons-question-mark-circle" class="text-xl" />
          <span class="text-[13px] tracking-tight">{{ t('support.title') }}</span>
        </UButton>
        <UButton 
          icon="i-heroicons-arrow-left-on-rectangle" 
          color="neutral" 
          variant="ghost" 
          :label="t('dashboard.sign_out')" 
          block 
          @click="handleLogout"
          class="justify-start gap-3 text-neutral-500 font-bold py-2.5 hover:text-error cursor-pointer" 
        />
      </div>
    </aside>
  </div>
</template>
