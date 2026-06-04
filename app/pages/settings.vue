<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white mesh-bg">
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

      <div class="w-full">
        <!-- Two-column grid: left = Profile + Security, right = Integrations + MCP + Notifications -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

        <!-- Left column -->
        <div class="space-y-12">
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
                  <div class="flex items-center justify-center p-2 rounded-lg bg-neutral-100 dark:bg-white/5 text-neutral-500">
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
                <div class="mt-4 px-3 py-1 rounded-full bg-neutral-200/50 dark:bg-white/5 text-neutral-500 text-[10px] font-black tracking-tight border border-neutral-300 dark:border-white/10 flex items-center gap-2">
                  <UIcon name="i-heroicons-envelope" />
                  {{ user?.email }}
                </div>
                <div v-if="(user as any)?.is_verified" class="mt-3 flex items-center justify-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                  <UIcon name="i-heroicons-check-badge" class="text-sm" />
                  {{ t('profile.verified') }}
                </div>
                <div v-else class="mt-3 flex flex-col items-center gap-3">
                  <div class="flex items-center justify-center gap-1.5 text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                    <UIcon name="i-heroicons-exclamation-triangle" class="text-sm" />
                    {{ t('profile.not_verified') }}
                  </div>
                  <UButton
                    size="xs"
                    variant="link"
                    color="primary"
                    class="font-black text-[10px] uppercase tracking-widest p-0"
                    :loading="isResendingVerification"
                    @click="resendVerification"
                  >
                    {{ t('profile.verify_now') }}
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div>
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-shield-check" class="text-primary-500" />
            {{ t('profile.security') }}
          </h2>

          <div class="glass-card p-10 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 to-primary-500/20 opacity-50"></div>

            <UForm :state="passwordForm" @submit="onChangePassword">
              <div class="grid grid-cols-3 gap-4 mb-6">
                <UInput v-model="passwordForm.current_password" type="password" icon="i-heroicons-lock-closed" size="lg" :placeholder="t('profile.current_password')" class="w-full" :ui="{ base: 'rounded-2xl' }" />
                <UInput v-model="passwordForm.password" type="password" icon="i-heroicons-key" size="lg" :placeholder="t('profile.new_password')" class="w-full" :ui="{ base: 'rounded-2xl' }" />
                <UInput v-model="passwordForm.password_confirmation" type="password" icon="i-heroicons-check-badge" size="lg" :placeholder="t('profile.confirm_new_password')" class="w-full" :ui="{ base: 'rounded-2xl' }" />
              </div>

              <UButton type="submit" color="primary" class="rounded-xl font-black px-10 shadow-lg shadow-primary-500/10" :loading="isChangingPassword">
                {{ t('profile.change_password') }}
              </UButton>
            </UForm>
          </div>
        </div>

        <!-- Notifications Section -->
        <div>
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-bell-alert" class="text-primary-500" />
            {{ t('profile.notifications') }}
          </h2>

          <div class="glass-card p-8 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden group">
            <div class="space-y-6">
              <div class="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/2 border border-transparent dark:border-white/5 group/item transition-colors hover:border-primary-500/20 will-change-transform">
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center p-3 rounded-xl bg-primary-500/10 text-primary-500 group-hover/item:scale-110 transition-transform will-change-transform">
                    <UIcon name="i-heroicons-envelope" class="text-xl" />
                  </div>
                  <div>
                    <h3 class="font-bold text-neutral-900 dark:text-white">{{ t('profile.notify_email') }}</h3>
                    <p class="text-xs text-neutral-500">{{ t('profile.notify_email_desc') }}</p>
                  </div>
                </div>
                <USwitch
                  v-model="notifyEmail"
                  color="primary"
                  :loading="isUpdatingSettings"
                  @update:model-value="updateNotificationSettings"
                />
              </div>

              <div class="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/2 border border-neutral-100 dark:border-white/5 group/item transition-colors hover:border-sky-500/20">
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center p-3 rounded-xl bg-sky-500/10 text-sky-500 group-hover/item:scale-110 transition-transform will-change-transform">
                    <UIcon name="i-heroicons-paper-airplane" class="text-xl" />
                  </div>
                  <div>
                    <h3 class="font-bold text-neutral-900 dark:text-white">{{ t('profile.notify_telegram') }}</h3>
                    <p class="text-xs text-neutral-500">{{ t('profile.notify_telegram_desc') }}</p>
                  </div>
                </div>
                <USwitch
                  v-model="notifyTelegram"
                  color="primary"
                  :loading="isUpdatingSettings"
                  :disabled="!(user as any)?.telegram_chat_id"
                  @update:model-value="updateNotificationSettings"
                />
              </div>

              <div v-if="!(user as any)?.telegram_chat_id" class="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <UIcon name="i-heroicons-information-circle" class="text-amber-500 text-lg" />
                <p class="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  {{ t('profile.telegram_required_for_notify') }}
                </p>
              </div>
            </div>

            <div class="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>

        </div><!-- /left column -->

        <!-- Right column -->
        <div class="space-y-12">

        <!-- Integrations Section -->
        <div>
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-cpu-chip" class="text-primary-500" />
            {{ t('profile.integrations') }}
          </h2>

          <div class="glass-card p-8 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden group">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div class="flex items-start gap-5">
                <div class="flex items-center justify-center p-4 rounded-2xl bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20 shadow-inner group-hover:scale-110 transition-transform will-change-transform">
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
                    <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 will-change-transform"></div>
                    <div class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  {{ t('profile.telegram_connected') }}
                </div>
                <UButton
                  v-if="!(user as any)?.telegram_chat_id"
                  size="xl"
                  variant="ghost"
                  class="group relative overflow-hidden px-8 py-5 rounded-3xl border border-neutral-200 dark:border-white/10 hover:border-sky-500/30 hover:bg-sky-500/5 transition-colors duration-500"
                  :loading="isTelegramConnecting"
                  @click="connectTelegram"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center p-2.5 rounded-2xl bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-500 shadow-lg shadow-sky-500/5">
                      <UIcon name="i-heroicons-paper-airplane" class="text-xl" />
                    </div>
                    <span class="text-base font-black text-neutral-900 dark:text-white">
                      {{ t('profile.telegram_connect') }}
                    </span>
                  </div>
                  <div class="absolute -bottom-12 -right-12 w-24 h-24 bg-sky-500/10 blur-3xl group-hover:bg-sky-500/20 transition-colors duration-700"></div>
                </UButton>

                <UButton
                  v-else
                  size="xl"
                  variant="ghost"
                  class="group relative overflow-hidden px-8 py-5 rounded-3xl border border-neutral-200 dark:border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors duration-500"
                  :loading="isTelegramTesting"
                  @click="sendTelegramTest"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 shadow-lg shadow-emerald-500/5">
                      <UIcon name="i-heroicons-bell" class="text-xl" />
                    </div>
                    <span class="text-base font-black text-neutral-900 dark:text-white">
                      {{ t('profile.telegram_test') }}
                    </span>
                  </div>
                  <div class="absolute -bottom-12 -right-12 w-24 h-24 bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
                </UButton>

                <UButton
                  v-if="(user as any)?.telegram_chat_id"
                  size="xl"
                  variant="ghost"
                  class="group relative overflow-hidden px-8 py-5 rounded-3xl border border-neutral-200 dark:border-white/10 hover:border-rose-500/30 hover:bg-rose-500/5 transition-colors duration-500"
                  :loading="isTelegramDisconnecting"
                  @click="disconnectTelegram"
                >
                  <div class="flex items-center gap-4">
                    <div class="flex items-center justify-center p-2.5 rounded-2xl bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-500 shadow-lg shadow-rose-500/5">
                      <UIcon name="i-heroicons-trash" class="text-xl" />
                    </div>
                    <span class="text-base font-black text-neutral-900 dark:text-white">
                      {{ t('profile.telegram_disconnect') }}
                    </span>
                  </div>
                  <div class="absolute -bottom-12 -right-12 w-24 h-24 bg-rose-500/10 blur-3xl group-hover:bg-rose-500/20 transition-colors duration-700"></div>
                </UButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Tokens Section -->
        <div>
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-command-line" class="text-primary-500" />
            {{ t('profile.mcp_tokens.title') }}
          </h2>

          <div class="glass-card p-8 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
              <p class="text-sm text-neutral-500 font-medium leading-relaxed max-w-md">
                {{ t('profile.mcp_tokens.description') }}
              </p>
              <UButton
                icon="i-heroicons-plus"
                color="primary"
                class="rounded-xl font-black shrink-0"
                @click="isCreateTokenModalOpen = true"
              >
                {{ t('profile.mcp_tokens.create') }}
              </UButton>
            </div>

            <div v-if="tokensLoading" class="flex justify-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="text-2xl text-neutral-400 animate-spin" />
            </div>

            <p v-else-if="mcpTokens.length === 0" class="text-center py-8 text-neutral-400 font-medium text-sm">
              {{ t('profile.mcp_tokens.no_tokens') }}
            </p>

            <div v-else class="space-y-3">
              <div
                v-for="mcpToken in mcpTokens"
                :key="mcpToken.id"
                class="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-white/2 border border-neutral-100 dark:border-white/5 group/item transition-colors hover:border-primary-500/20 will-change-transform"
              >
                <div class="flex items-center gap-4">
                  <div class="flex items-center justify-center p-3 rounded-xl bg-primary-500/10 text-primary-500">
                    <UIcon name="i-heroicons-key" class="text-xl" />
                  </div>
                  <div>
                    <h3 class="font-bold text-neutral-900 dark:text-white">{{ mcpToken.name }}</h3>
                    <div class="flex flex-wrap items-center gap-2 mt-0.5">
                      <span class="text-xs text-neutral-400">{{ formatTokenDate(mcpToken.created_at) }}</span>
                      <span class="text-xs text-neutral-300 dark:text-neutral-600">·</span>
                      <span class="text-xs text-neutral-400">
                        {{ t('profile.mcp_tokens.last_used') }}:
                        {{ mcpToken.last_used_at ? formatTokenDate(mcpToken.last_used_at) : t('profile.mcp_tokens.never') }}
                      </span>
                    </div>
                  </div>
                </div>
                <UButton
                  size="sm"
                  variant="ghost"
                  color="error"
                  class="rounded-xl font-bold"
                  @click="openRevokeConfirm(mcpToken)"
                >
                  {{ t('profile.mcp_tokens.revoke') }}
                </UButton>
              </div>
            </div>

            <div class="absolute bottom-0 left-0 w-32 h-32 bg-primary-500/5 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>

        <!-- MCP Config Example Section -->
        <div>
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-code-bracket" class="text-primary-500" />
            {{ t('profile.mcp_tokens.mcp_config_label') }}
          </h2>
          <div class="glass-card p-8 rounded-3xl border-neutral-200/50 dark:border-white/5 relative overflow-hidden">
            <p class="text-sm text-neutral-500 font-medium mb-4">
              {{ t('profile.mcp_tokens.mcp_config_hint') }}
            </p>

            <pre class="rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-4 text-xs font-mono text-neutral-600 dark:text-neutral-300 overflow-x-auto">{{ mcpConfigExample }}</pre>

            <div class="mt-6">
              <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-3">
                {{ t('profile.mcp_tokens.mcp_config_agents') }}
              </div>
              <div class="flex flex-wrap gap-2">
                <a
                  v-for="agent in mcpAgents"
                  :key="agent.name"
                  :href="agent.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:border-primary-500/40 hover:text-primary-500 transition-colors"
                >
                  <UIcon name="i-heroicons-arrow-top-right-on-square" class="text-[10px]" />
                  {{ agent.name }}
                </a>
              </div>
            </div>
          </div>
        </div>

        </div><!-- /right column -->
        </div><!-- /grid -->

        <!-- Danger Zone Section -->
        <div class="mt-12 mb-24">
          <h2 class="text-xl font-black text-neutral-900 dark:text-white mb-6 px-2 flex items-center gap-3">
            <UIcon name="i-heroicons-exclamation-triangle" class="text-rose-500" />
            {{ t('profile.danger_zone') }}
          </h2>

          <div class="glass-card p-8 rounded-3xl border-rose-200/50 dark:border-rose-500/10 bg-rose-500/5 relative overflow-hidden group">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="max-w-md">
                <h3 class="text-lg font-black text-neutral-900 dark:text-white mb-1">
                  {{ t('profile.delete_account') }}
                </h3>
                <p class="text-sm text-neutral-500 font-medium">
                  {{ t('profile.delete_account_warning') }}
                </p>
              </div>
              <UButton
                color="error"
                variant="soft"
                size="xl"
                class="rounded-2xl font-black px-8 py-4 shadow-lg shadow-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-300"
                @click="isDeleteModalOpen = true"
              >
                {{ t('profile.delete_account') }}
              </UButton>
            </div>
          </div>
        </div>

        <!-- Create Token Modal -->
        <UModal v-model:open="isCreateTokenModalOpen">
          <template #content>
            <UCard variant="soft" class="glass-card border-neutral-200/50! dark:border-white/10! overflow-hidden relative shadow-2xl">
              <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary-500 to-purple-500"></div>

              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-primary-500/10 text-primary-500 border border-primary-500/20">
                  <UIcon name="i-heroicons-key" class="text-2xl" />
                </div>
                <h3 class="text-xl font-black text-neutral-900 dark:text-white">
                  {{ newMcpUrl ? t('profile.mcp_tokens.created') : t('profile.mcp_tokens.create') }}
                </h3>
              </div>

              <!-- Success state: show mcp_url -->
              <template v-if="newMcpUrl">
                <div class="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-5">
                  <UIcon name="i-heroicons-exclamation-triangle" class="text-amber-500 text-lg shrink-0 mt-0.5" />
                  <p class="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    {{ t('profile.mcp_tokens.url_once_warning') }}
                  </p>
                </div>

                <div class="mb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  {{ t('profile.mcp_tokens.url_label') }}
                </div>
                <div class="flex items-center gap-2">
                  <UInput
                    :model-value="newMcpUrl"
                    readonly
                    class="rounded-xl flex-1 font-mono text-xs"
                    @click="($event.target as HTMLInputElement).select()"
                  />
                  <UButton
                    :icon="mcpUrlCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                    :color="mcpUrlCopied ? 'success' : 'primary'"
                    variant="subtle"
                    class="rounded-xl font-bold shrink-0"
                    @click="copyMcpUrl"
                  >
                    {{ mcpUrlCopied ? t('profile.mcp_tokens.copied') : '' }}
                  </UButton>
                </div>

                <div class="mt-6">
                  <div class="flex items-center justify-between mb-2">
                    <div class="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      {{ t('profile.mcp_tokens.mcp_config_label') }}
                    </div>
                    <UButton
                      size="xs"
                      :icon="mcpConfigCopied ? 'i-heroicons-check' : 'i-heroicons-clipboard-document'"
                      :color="mcpConfigCopied ? 'success' : 'neutral'"
                      variant="subtle"
                      class="rounded-lg font-bold"
                      @click="copyMcpConfig"
                    >
                      {{ mcpConfigCopied ? t('profile.mcp_tokens.mcp_config_copied') : t('profile.mcp_tokens.copy') }}
                    </UButton>
                  </div>
                  <pre class="rounded-xl bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-4 text-xs font-mono text-neutral-700 dark:text-neutral-300 overflow-x-auto">{{ mcpConfigJson }}</pre>
                </div>

                <div class="flex justify-end mt-6">
                  <UButton
                    size="lg"
                    color="primary"
                    class="rounded-xl font-black px-8"
                    @click="isCreateTokenModalOpen = false"
                  >
                    {{ t('common.close') }}
                  </UButton>
                </div>
              </template>

              <!-- Form state -->
              <template v-else>
                <UForm :state="createTokenForm" class="space-y-5" @submit="onCreateToken">
                  <UFormField :label="t('profile.mcp_tokens.token_name')" name="name">
                    <UInput
                      v-model="createTokenForm.name"
                      :placeholder="t('profile.mcp_tokens.token_name_placeholder')"
                      maxlength="64"
                      icon="i-heroicons-tag"
                      class="rounded-xl"
                    />
                  </UFormField>

                  <div class="flex justify-end gap-3 pt-2">
                    <UButton
                      size="lg"
                      variant="subtle"
                      color="neutral"
                      class="rounded-xl font-bold px-6"
                      @click="isCreateTokenModalOpen = false"
                    >
                      {{ t('common.cancel') }}
                    </UButton>
                    <UButton
                      type="submit"
                      size="lg"
                      color="primary"
                      class="rounded-xl font-black px-6 shadow-lg shadow-primary-500/20"
                      :loading="isCreatingToken"
                    >
                      {{ t('profile.mcp_tokens.create') }}
                    </UButton>
                  </div>
                </UForm>
              </template>
            </UCard>
          </template>
        </UModal>

        <!-- Revoke Token Confirmation Modal -->
        <UModal v-model:open="isRevokeModalOpen">
          <template #content>
            <UCard variant="soft" class="glass-card border-neutral-200/50! dark:border-white/10! overflow-hidden relative shadow-2xl">
              <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-500 to-rose-600"></div>

              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-rose-500/10 text-rose-600 border border-rose-500/20">
                  <UIcon name="i-heroicons-exclamation-triangle" class="text-2xl" />
                </div>
                <h3 class="text-xl font-black text-neutral-900 dark:text-white">
                  {{ t('profile.mcp_tokens.revoke_confirm_title') }}
                </h3>
              </div>

              <p class="text-neutral-500 font-medium leading-relaxed mb-8">
                {{ t('profile.mcp_tokens.revoke_confirm') }}
              </p>

              <div class="flex justify-end gap-3">
                <UButton
                  size="lg"
                  variant="subtle"
                  color="neutral"
                  class="rounded-xl font-bold px-6"
                  @click="isRevokeModalOpen = false"
                >
                  {{ t('common.cancel') }}
                </UButton>
                <UButton
                  size="lg"
                  color="error"
                  class="rounded-xl font-black px-6 shadow-lg shadow-rose-500/20"
                  :loading="isRevokingToken"
                  @click="confirmRevoke"
                >
                  {{ t('profile.mcp_tokens.revoke') }}
                </UButton>
              </div>
            </UCard>
          </template>
        </UModal>

        <!-- Disconnect Confirmation Modal -->
        <UModal v-model:open="isDisconnectModalOpen">
          <template #content>
            <UCard variant="soft" class="glass-card border-neutral-200/50! dark:border-white/10! overflow-hidden relative shadow-2xl">
              <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-500 to-rose-600"></div>

              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-rose-500/10 відеtext-rose-600 border border-rose-500/20">
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

        <!-- Delete Account Confirmation Modal -->
        <UModal v-model:open="isDeleteModalOpen">
          <template #content>
            <UCard variant="soft" class="glass-card border-neutral-200/50! dark:border-white/10! overflow-hidden relative shadow-2xl">
              <div class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-rose-600 to-rose-700"></div>
              
              <div class="flex items-center gap-4 mb-6">
                <div class="p-3 rounded-2xl bg-rose-600/10 text-rose-600 border border-rose-600/20">
                  <UIcon name="i-heroicons-trash" class="text-2xl" />
                </div>
                <h3 class="text-xl font-black text-neutral-900 dark:text-white">
                  {{ t('profile.delete_account_confirm_title') }}
                </h3>
              </div>
              
              <p class="text-neutral-500 font-medium leading-relaxed mb-8">
                {{ t('profile.delete_account_confirm') }}
              </p>
              
              <div class="flex justify-end gap-3">
                <UButton
                  size="lg"
                  variant="subtle"
                  color="neutral"
                  class="rounded-xl font-bold px-6"
                  @click="isDeleteModalOpen = false"
                >
                  {{ t('common.cancel') }}
                </UButton>
                <UButton
                  size="lg"
                  color="error"
                  class="rounded-xl font-black px-6 shadow-lg shadow-rose-600/20"
                  :loading="isDeletingAccount"
                  @click="confirmDeleteAccount"
                >
                  {{ t('profile.delete_account') }}
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
import { computed, ref, onMounted, watch } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { uk, pl, enUS } from 'date-fns/locale';
import type { Token } from '~/composables/useTokens';

const { t, locale } = useI18n();

const localePath = useLocalePath();

// MCP Tokens
const { tokens: mcpTokens, loading: tokensLoading, fetchTokens, createToken, revokeToken } = useTokens();
const isCreateTokenModalOpen = ref(false);
const isRevokeModalOpen = ref(false);
const isCreatingToken = ref(false);
const isRevokingToken = ref(false);
const newMcpUrl = ref<string | null>(null);
const mcpUrlCopied = ref(false);
const mcpConfigCopied = ref(false);
const tokenToRevoke = ref<Token | null>(null);
const createTokenForm = ref({ name: '' });

const mcpAgents = [
  { name: 'Claude Desktop', url: 'https://modelcontextprotocol.io/quickstart/user' },
  { name: 'Cursor', url: 'https://docs.cursor.com/context/model-context-protocol' },
  { name: 'Windsurf', url: 'https://docs.codeium.com/windsurf/mcp' },
  { name: 'VS Code', url: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers' },
  { name: 'Zed', url: 'https://zed.dev/docs/assistant/model-context-protocol' },
  { name: 'Cline', url: 'https://docs.cline.bot/mcp-servers/mcp-quickstart' },
];

const mcpConfigExample = JSON.stringify({
  digipulse: {
    type: 'streamableHttp',
    url: 'https://api.digipulse.cloud/mcp',
    headers: { Authorization: 'Bearer YOUR_TOKEN' }
  }
}, null, 2);

const mcpConfigJson = computed(() => {
  if (!newMcpUrl.value) return '';
  const url = new URL(newMcpUrl.value);
  const plainToken = url.searchParams.get('token') ?? '';
  const baseUrl = `${url.origin}${url.pathname}`;
  return JSON.stringify({
    digipulse: {
      type: 'streamableHttp',
      url: baseUrl,
      headers: { Authorization: `Bearer ${plainToken}` }
    }
  }, null, 2);
});

const dateLocales = { uk, pl, en: enUS };

const formatTokenDate = (dateStr: string) => {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: dateLocales[locale.value as keyof typeof dateLocales] || enUS
    });
  } catch {
    return dateStr;
  }
};

const onCreateToken = async () => {
  if (!createTokenForm.value.name.trim()) {
    toast.add({ title: t('profile.mcp_tokens.name_required'), icon: 'i-heroicons-x-circle', color: 'error' });
    return;
  }
  isCreatingToken.value = true;
  try {
    const response = await createToken(createTokenForm.value.name.trim());
    newMcpUrl.value = response.mcp_url;
    createTokenForm.value.name = '';
  } catch (error: any) {
    toast.add({ title: t('common.error'), description: error.data?.message || t('common.error'), icon: 'i-heroicons-x-circle', color: 'error' });
  } finally {
    isCreatingToken.value = false;
  }
};

const copyMcpUrl = async () => {
  if (!newMcpUrl.value) return;
  await navigator.clipboard.writeText(newMcpUrl.value);
  mcpUrlCopied.value = true;
  setTimeout(() => { mcpUrlCopied.value = false; }, 2000);
};

const copyMcpConfig = async () => {
  if (!mcpConfigJson.value) return;
  await navigator.clipboard.writeText(mcpConfigJson.value);
  mcpConfigCopied.value = true;
  setTimeout(() => { mcpConfigCopied.value = false; }, 2000);
};

watch(isCreateTokenModalOpen, (open) => {
  if (!open) {
    if (newMcpUrl.value) fetchTokens();
    newMcpUrl.value = null;
    mcpUrlCopied.value = false;
    mcpConfigCopied.value = false;
    createTokenForm.value.name = '';
  }
});

const openRevokeConfirm = (mcpToken: Token) => {
  tokenToRevoke.value = mcpToken;
  isRevokeModalOpen.value = true;
};

const confirmRevoke = async () => {
  if (!tokenToRevoke.value) return;
  isRevokingToken.value = true;
  try {
    await revokeToken(tokenToRevoke.value.id);
    toast.add({ title: t('profile.mcp_tokens.revoked'), icon: 'i-heroicons-check-circle', color: 'success' });
    isRevokeModalOpen.value = false;
    tokenToRevoke.value = null;
  } catch (error: any) {
    toast.add({ title: t('common.error'), description: error.data?.message || t('common.error'), icon: 'i-heroicons-x-circle', color: 'error' });
  } finally {
    isRevokingToken.value = false;
  }
};

const isTelegramConnecting = ref(false);
const isTelegramDisconnecting = ref(false);
const isTelegramTesting = ref(false);
const isDisconnectModalOpen = ref(false);
const isUpdatingSettings = ref(false);
const isDeleteModalOpen = ref(false);
const isDeletingAccount = ref(false);

const notifyEmail = ref(true);
const notifyTelegram = ref(true);

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

// Verification States
const isResendingVerification = ref(false);

const { user, token, fetchUser, logout: authLogout } = useAuth();
const config = useRuntimeConfig();
const toast = useToast();

onMounted(async () => {
  await fetchUser();
  await fetchTokens();
});

watch(user, (val) => {
  if (val) {
    notifyEmail.value = (val as any).notify_email ?? true;
    notifyTelegram.value = (val as any).notify_telegram ?? true;
  }
}, { immediate: true });

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
    await $fetch(`${config.public.apiBase}/api/v1/profile`, {
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
      title: t('common.success'),
      description: t('profile.profile_updated'),
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    toast.add({
      title: t('common.error'),
      description: error.data?.message || t('common.error'),
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isUpdatingProfile.value = false;
  }
};

const updateNotificationSettings = async () => {
  if (isUpdatingSettings.value) return;
  isUpdatingSettings.value = true;
  
  try {
    await $fetch(`${config.public.apiBase}/api/v1/profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      },
      body: {
        notify_email: notifyEmail.value,
        notify_telegram: notifyTelegram.value
      }
    });
    
    await fetchUser();
    toast.add({
      title: t('common.success'),
      description: t('profile.profile_updated'),
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });
  } catch (error: any) {
    console.error('Update settings error:', error);
    toast.add({
      title: t('common.error'),
      description: t('common.error'),
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
    // Revert state on error
    if (user.value) {
      notifyEmail.value = (user.value as any).notify_email ?? true;
      notifyTelegram.value = (user.value as any).notify_telegram ?? true;
    }
  } finally {
    isUpdatingSettings.value = false;
  }
};

const onChangePassword = async () => {
  if (isChangingPassword.value) return;
  isChangingPassword.value = true;

  try {
    await $fetch(`${config.public.apiBase}/api/v1/profile/password`, {
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
      title: t('common.success'),
      description: t('profile.password_changed'),
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    toast.add({
      title: t('common.error'),
      description: error.data?.message || t('common.error'),
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
  { label: 'common.status', value: (user.value as any)?.is_verified ? t('profile.verified') : t('profile.not_verified'), icon: 'i-heroicons-shield-check' },
]);

const connectTelegram = async () => {
  if (isTelegramConnecting.value) return;
  
  try {
    isTelegramConnecting.value = true;
    
    const response = await $fetch<{ url: string }>(`${config.public.apiBase}/api/v1/telegram/connect`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      }
    });
    
    if (response.url) {
      window.open(response.url, '_blank');
      toast.add({
        title: t('profile.telegram_bot'),
        description: t('profile.telegram_connect_pending'),
        icon: 'i-heroicons-paper-airplane',
        color: 'info'
      });
    }
  } catch (error) {
    console.error('Failed to get Telegram link:', error);
    toast.add({
      title: t('common.error'),
      description: t('profile.telegram_connect_error'),
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isTelegramConnecting.value = false;
  }
};

const sendTelegramTest = async () => {
  if (isTelegramTesting.value) return;
  isTelegramTesting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/v1/telegram/test`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Frontend-Key': config.public.frontendKey as string,
        'Authorization': `Bearer ${token.value}`
      }
    });
    toast.add({ title: t('profile.telegram_test_sent'), color: 'success', icon: 'i-heroicons-check-circle' });
  } catch {
    toast.add({ title: t('profile.telegram_test_error'), color: 'error', icon: 'i-heroicons-exclamation-circle' });
  } finally {
    isTelegramTesting.value = false;
  }
};

const disconnectTelegram = () => {
  isDisconnectModalOpen.value = true;
};

const confirmDisconnect = async () => {
  if (isTelegramDisconnecting.value) return;

  isTelegramDisconnecting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/api/v1/telegram/disconnect`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      }
    });
    
    // Update local user state from Single Source of Truth (/api/v1/me)
    await fetchUser();

    toast.add({
      title: t('profile.telegram_disconnected_title'),
      description: t('profile.telegram_disconnected_success'),
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });

  } catch (error) {
    console.error('Failed to disconnect Telegram:', error);
    toast.add({
      title: t('common.error'),
      description: t('profile.telegram_disconnect_error'),
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isTelegramDisconnecting.value = false;
    isDisconnectModalOpen.value = false;
  }
};

const confirmDeleteAccount = async () => {
  if (isDeletingAccount.value) return;
  isDeletingAccount.value = true;

  try {
    await $fetch(`${config.public.apiBase}/api/v1/profile`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      }
    });

    toast.add({
      title: t('profile.account_deleted_title'),
      description: t('profile.account_deleted_desc'),
      icon: 'i-heroicons-trash',
      color: 'success'
    });

    // Logout and redirect to home
    authLogout();
    navigateTo(localePath('/'));
  } catch (error: any) {
    console.error('Delete account error:', error);
    toast.add({
      title: t('common.error'),
      description: error.data?.message || t('common.error'),
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isDeletingAccount.value = false;
    isDeleteModalOpen.value = false;
  }
};

const resendVerification = async () => {
  if (isResendingVerification.value) return;
  isResendingVerification.value = true;

  try {
    await $fetch(`${config.public.apiBase}/api/v1/email/verification-notification`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'X-Frontend-Key': config.public.frontendKey as string,
        Accept: 'application/json',
      }
    });

    toast.add({
      title: t('forgot_password.success_title'),
      description: t('forgot_password.success_desc'),
      icon: 'i-heroicons-check-circle',
      color: 'success'
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    toast.add({
      title: t('common.error'),
      description: error.data?.message || t('profile.verify_email_resend_error'),
      icon: 'i-heroicons-x-circle',
      color: 'error'
    });
  } finally {
    isResendingVerification.value = false;
  }
};
</script>
