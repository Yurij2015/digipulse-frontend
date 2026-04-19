<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 lg:ml-72 min-h-screen">
      <header class="mb-16">
        <UButton :to="localePath('/dashboard')" icon="i-heroicons-arrow-left" variant="ghost" color="neutral" class="mb-8 font-bold hover:gap-3 transition-all">
          {{ t('add_website.back') }}
        </UButton>
        <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">{{ t('profile.title') }}</h1>
        <p class="text-neutral-500 font-medium">{{ t('profile.subtitle') }}</p>
      </header>

      <div class="max-w-3xl">
        <div class="glass-card p-10 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary-500 to-purple-500"></div>
          
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-wider">
              {{ t('profile.title') }}
            </h2>
            <UButton
              v-if="!isEditing"
              icon="i-heroicons-pencil-square"
              variant="subtle"
              color="primary"
              class="rounded-xl font-bold"
              @click="toggleEdit"
            >
              {{ t('profile.edit_profile') }}
            </UButton>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            <!-- Info List / Edit Form -->
            <div class="space-y-8">
              <template v-if="!isEditing">
                <div v-for="field in profileFields" :key="field.label">
                  <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">{{ t(field.label) }}</div>
                  <div class="flex items-center gap-3">
                    <div class="p-2 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500">
                      <UIcon :name="field.icon" class="text-lg" />
                    </div>
                    <div class="text-lg font-bold text-neutral-900 dark:text-white">
                      {{ field.value || '—' }}
                    </div>
                  </div>
                </div>
              </template>
              <UForm v-else :state="editForm" class="space-y-6" @submit="onUpdateProfile">
                <UFormField :label="t('profile.username')" name="name">
                  <UInput v-model="editForm.name" icon="i-heroicons-at-symbol" class="rounded-xl" />
                </UFormField>
                <UFormField :label="t('profile.first_name')" name="first_name">
                  <UInput v-model="editForm.first_name" icon="i-heroicons-user" class="rounded-xl" />
                </UFormField>
                <UFormField :label="t('profile.last_name')" name="last_name">
                  <UInput v-model="editForm.last_name" icon="i-heroicons-user" class="rounded-xl" />
                </UFormField>
                
                <div class="flex gap-3 pt-4">
                  <UButton type="submit" color="primary" class="rounded-xl font-black px-6" :loading="isUpdatingProfile">
                    {{ t('profile.save_changes') }}
                  </UButton>
                  <UButton variant="ghost" color="neutral" class="rounded-xl font-bold" @click="isEditing = false">
                    {{ t('common.cancel') }}
                  </UButton>
                </div>
              </UForm>
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
                <div class="mt-4 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-[10px] font-black tracking-tight border border-primary-500/20">
                  {{ user?.email }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div class="mt-12">
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-shield-check" class="text-primary-500" />
            {{ t('profile.security') }}
          </h2>
          
          <div class="glass-card p-10 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 to-primary-500/20 opacity-50"></div>
            
            <UForm :state="passwordForm" class="space-y-6 max-w-md" @submit="onChangePassword">
              <UFormField :label="t('profile.current_password')" name="current_password">
                <UInput v-model="passwordForm.current_password" type="password" icon="i-heroicons-lock-closed" class="rounded-xl" />
              </UFormField>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UFormField :label="t('profile.new_password')" name="password">
                  <UInput v-model="passwordForm.password" type="password" icon="i-heroicons-key" class="rounded-xl" />
                </UFormField>
                <UFormField :label="t('profile.confirm_new_password')" name="password_confirmation">
                  <UInput v-model="passwordForm.password_confirmation" type="password" icon="i-heroicons-check-badge" class="rounded-xl" />
                </UFormField>
              </div>
              
              <div class="pt-4">
                <UButton type="submit" color="indigo" class="rounded-xl font-black px-10 shadow-lg shadow-indigo-500/10" :loading="isChangingPassword">
                  {{ t('profile.change_password') }}
                </UButton>
              </div>
            </UForm>
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
                    {{ t('profile.telegram_title') }}
                  </h3>
                  <p class="text-sm text-neutral-500 font-medium leading-relaxed">
                    {{ t('profile.telegram_desc') }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-4">
                <div v-if="(user as any)?.telegram_chat_id" class="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/15 backdrop-blur-md text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/5">
                  <div class="relative flex h-2 w-2">
                    <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></div>
                    <div class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  {{ t('profile.telegram_connected') }}
                </div>
                <UButton
                  v-if="!(user as any)?.telegram_chat_id"
                  size="xl"
                  variant="ghost"
                  class="group relative overflow-hidden px-8 py-5 rounded-3xl border border-neutral-200 dark:border-white/10 hover:border-sky-500/30 hover:bg-sky-500/5 transition-all duration-500"
                  :loading="isTelegramConnecting"
                  @click="connectTelegram"
                >
                  <div class="flex items-center gap-4">
                    <div class="p-2.5 rounded-2xl bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-sky-500/5">
                      <UIcon name="i-heroicons-paper-airplane" class="text-xl" />
                    </div>
                    <span class="text-base font-black text-neutral-900 dark:text-white">
                      {{ t('profile.telegram_connect') }}
                    </span>
                  </div>
                  <div class="absolute -bottom-12 -right-12 w-24 h-24 bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-all duration-700"></div>
                </UButton>

                <UButton
                  v-else
                  size="xl"
                  variant="ghost"
                  class="group relative overflow-hidden px-8 py-5 rounded-3xl border border-neutral-200 dark:border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 transition-all duration-500"
                  :loading="isTelegramDisconnecting"
                  @click="disconnectTelegram"
                >
                  <div class="flex items-center gap-4">
                    <div class="p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-rose-500/5">
                      <UIcon name="i-heroicons-trash" class="text-xl" />
                    </div>
                    <span class="text-base font-black text-neutral-900 dark:text-white">
                      {{ t('profile.telegram_disconnect') }}
                    </span>
                  </div>
                  <div class="absolute -bottom-12 -right-12 w-24 h-24 bg-rose-500/10 blur-3xl group-hover:bg-rose-500/20 transition-all duration-700"></div>
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Disconnect Confirmation Modal -->
        <UModal v-model:open="isDisconnectModalOpen">
          <template #content>
            <UCard class="glass-card border-neutral-200/50! dark:border-white/10! overflow-hidden relative shadow-2xl">
              <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-500 to-rose-600"></div>
              
              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  <UIcon name="i-heroicons-exclamation-triangle" class="text-2xl" />
                </div>
                <h3 class="text-xl font-black text-neutral-900 dark:text-white">
                  {{ t('profile.telegram_disconnect_confirm_title') }}
                </h3>
              </div>
              
              <p class="text-neutral-500 font-medium leading-relaxed mb-8">
                {{ t('profile.telegram_disconnect_confirm') }}
              </p>
              
              <div class="flex justify-end gap-3">
                <UButton
                  size="lg"
                  variant="subtle"
                  color="neutral"
                  class="rounded-xl font-bold px-6"
                  @click="isDisconnectModalOpen = false"
                >
                  {{ t('common.cancel') }}
                </UButton>
                <UButton
                  size="lg"
                  color="error"
                  class="rounded-xl font-black px-6 shadow-lg shadow-rose-500/20"
                  :loading="isTelegramDisconnecting"
                  @click="confirmDisconnect"
                >
                  {{ t('profile.telegram_disconnect') }}
                </UButton>
              </div>
            </UCard>
          </template>
        </UModal>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
const { t } = useI18n();

const localePath = useLocalePath();
const isTelegramConnecting = ref(false);
const isTelegramDisconnecting = ref(false);
const isDisconnectModalOpen = ref(false);

// Edit States
const isEditing = ref(false);
const isUpdatingProfile = ref(false);
const editForm = ref({
  name: '',
  first_name: '',
  last_name: ''
});

// Password States
const isChangingPassword = ref(false);
const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
});

const { user, token, fetchUser } = useAuth();
const config = useRuntimeConfig();
const toast = useToast();

onMounted(async () => {
  await fetchUser();
});

definePageMeta({
  middleware: 'auth'
});

const toggleEdit = () => {
  if (user.value) {
    editForm.value = {
      name: user.value.name || '',
      first_name: (user.value as any).first_name || '',
      last_name: (user.value as any).last_name || ''
    };
    isEditing.value = true;
  }
};

const onUpdateProfile = async () => {
  if (isUpdatingProfile.value) return;
  isUpdatingProfile.value = true;

  try {
    await $fetch(`${config.public.apiBase}/api/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      },
      body: editForm.value
    });

    await fetchUser();
    isEditing.value = false;
    toast.add({
      title: 'Success',
      description: 'Profile updated successfully.',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to update profile.',
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isUpdatingProfile.value = false;
  }
};

const onChangePassword = async () => {
  if (isChangingPassword.value) return;
  isChangingPassword.value = true;

  try {
    await $fetch(`${config.public.apiBase}/api/profile/password`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      },
      body: passwordForm.value
    });

    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: ''
    };

    toast.add({
      title: 'Success',
      description: 'Password changed successfully.',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    toast.add({
      title: 'Error',
      description: error.data?.message || 'Failed to change password.',
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isChangingPassword.value = false;
  }
};

const userInitials = computed(() => {
  if (!user.value) return '??';
  const u = user.value as any;
  if (!u.first_name || !u.last_name) return u.name?.substring(0, 2).toUpperCase() || '??';
  return (u.first_name[0] + u.last_name[0]).toUpperCase();
});

const profileFields = computed(() => [
  { label: 'profile.username', value: user.value?.name, icon: 'i-heroicons-at-symbol' },
  { label: 'profile.first_name', value: (user.value as any)?.first_name, icon: 'i-heroicons-user' },
  { label: 'profile.last_name', value: (user.value as any)?.last_name, icon: 'i-heroicons-user' },
  { label: 'profile.email', value: user.value?.email, icon: 'i-heroicons-envelope' },
]);

const connectTelegram = async () => {
  if (isTelegramConnecting.value) return;
  
  try {
    isTelegramConnecting.value = true;
    
    const response = await $fetch<{ url: string }>(`${config.public.apiBase}/api/telegram/connect`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      }
    });
    
    if (response.url) {
      window.open(response.url, '_blank');
      toast.add({
        title: 'Telegram Bot',
        description: 'Please complete the connection in your Telegram app.',
        icon: 'i-heroicons-paper-airplane',
        color: 'info'
      });
    }
  } catch (error) {
    console.error('Failed to get Telegram link:', error);
    toast.add({
      title: 'Connection Error',
      description: 'Failed to generate Telegram connection link.',
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isTelegramConnecting.value = false;
  }
};

const disconnectTelegram = () => {
  isDisconnectModalOpen.value = true;
};

const confirmDisconnect = async () => {
  if (isTelegramDisconnecting.value) return;

  isTelegramDisconnecting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/telegram/disconnect`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      }
    });
    
    // Update local user state from Single Source of Truth (/api/me)
    await fetchUser();

    toast.add({
      title: 'Telegram Disconnected',
      description: 'Telegram notifications have been successfully unlinked.',
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });

  } catch (error) {
    console.error('Failed to disconnect Telegram:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to disconnect Telegram notifications. Please try again.',
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isTelegramDisconnecting.value = false;
    isDisconnectModalOpen.value = false;
  }
};
</script>
