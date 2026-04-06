<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />

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
  { label: 'Username', value: user.value?.name, icon: 'i-heroicons-at-symbol' },
  { label: 'First Name', value: user.value?.first_name, icon: 'i-heroicons-user' },
  { label: 'Last Name', value: user.value?.last_name, icon: 'i-heroicons-user' },
  { label: 'Email Address', value: user.value?.email, icon: 'i-heroicons-envelope' },
]);
</script>
