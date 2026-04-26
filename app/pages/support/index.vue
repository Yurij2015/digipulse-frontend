<script setup lang="ts">
const { t } = useI18n()
const { user, token } = useAuth()
const config = useRuntimeConfig()
const { $echo } = useNuxtApp() as any

definePageMeta({
  middleware: 'auth'
})

const loading = ref(false)
const ticketsLoading = ref(true)
const messagesLoading = ref(false)
const tickets = ref<any[]>([])
const activeTicket = ref<any>(null)
const newMessage = ref('')
const replyMessage = ref('')
const isSendingReply = ref(false)
const showNewTicketForm = ref(false)

const state = reactive({
  subject: '',
  message: '',
  priority: { id: 'medium', label: t('support.priority_medium'), color: 'yellow' }
})

const priorities = [
  { id: 'low', label: t('support.priority_low'), color: 'info' },
  { id: 'medium', label: t('support.priority_medium'), color: 'warning' },
  { id: 'high', label: t('support.priority_high'), color: 'error' }
]

// Fetch tickets
const fetchTickets = async () => {
  ticketsLoading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/api/support/tickets`, {
      headers: {
        'X-Frontend-Key': config.public.frontendKey,
        'Authorization': `Bearer ${token.value}`
      }
    })
    tickets.value = (data as any).data || []
    
    // Auto-select latest ticket if none is active and not showing new ticket form
    if (tickets.value.length > 0 && !activeTicket.value && !showNewTicketForm.value) {
      selectTicket(tickets.value[0])
    }
  } catch (e) {
    console.error('Failed to fetch tickets', e)
  } finally {
    ticketsLoading.value = false
  }
}

// Fetch messages for active ticket
const fetchMessages = async (ticketId: number) => {
  messagesLoading.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/api/support/tickets/${ticketId}`, {
      headers: {
        'X-Frontend-Key': config.public.frontendKey,
        'Authorization': `Bearer ${token.value}`
      }
    })
    activeTicket.value = (data as any).data
    
    scrollToBottom()
  } catch (e) {
    console.error('Failed to fetch ticket details', e)
  } finally {
    messagesLoading.value = false
  }
}

const selectTicket = (ticket: any) => {
  showNewTicketForm.value = false
  fetchMessages(ticket.id)
}

const onSubmit = async () => {
  loading.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/api/support/tickets`, {
      method: 'POST',
      body: {
        ...state,
        priority: state.priority.id,
        contact_email: user.value?.email,
        // Turnstile response removed
      },
      headers: {
        'X-Frontend-Key': config.public.frontendKey,
        'Authorization': `Bearer ${token.value}`
      }
    })

    useToast().add({
      title: t('common.success'),
      description: t('support.success_message'),
      color: 'success'
    })

    // Reset form and refresh list
    state.subject = ''
    state.message = ''
    showNewTicketForm.value = false
    await fetchTickets()
  } catch (e: any) {
    useToast().add({
      title: t('common.error'),
      description: e.data?.message || t('common.something_went_wrong'),
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const sendReply = async () => {
  if (!replyMessage.value.trim() || !activeTicket.value || isSendingReply.value) return
  
  isSendingReply.value = true
  try {
    const data = await $fetch(`${config.public.apiBase}/api/support/tickets/${activeTicket.value.id}/reply`, {
      method: 'POST',
      body: { message: replyMessage.value },
      headers: {
        'X-Frontend-Key': config.public.frontendKey,
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    // Optimistically add message or just refresh
    if (activeTicket.value.messages) {
      activeTicket.value.messages.push((data as any).data)
    }
    
    replyMessage.value = ''
    
    scrollToBottom()
  } catch (e: any) {
    useToast().add({
      title: t('common.error'),
      description: e.data?.message || t('common.something_went_wrong'),
      color: 'error'
    })
  } finally {
    isSendingReply.value = false
  }
}

const scrollToBottom = () => {
  const scroll = () => {
    const container = document.getElementById('chat-messages-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }
  
  // Try multiple times to account for rendering and transitions
  nextTick(scroll)
  setTimeout(scroll, 50)
  setTimeout(scroll, 150)
  setTimeout(scroll, 300)
}

onMounted(() => {
  fetchTickets()
})

// Real-time listener
watch(activeTicket, (newTicket, oldTicket) => {
  // Stop listening to previous ticket channel
  if (oldTicket && $echo) {
    $echo.private(`tickets.${oldTicket.id}`).stopListening('.message.sent')
  }
  
  // Start listening to new ticket channel
  if (newTicket?.id && $echo) {
    $echo.private(`tickets.${newTicket.id}`)
      .listen('.message.sent', (data: any) => {
        if (!activeTicket.value.messages) activeTicket.value.messages = []
        
        // Avoid duplicates (e.g. from optimistic update)
        if (activeTicket.value.messages.some((m: any) => m.id === data.id)) return
        
        activeTicket.value.messages.push(data)
        scrollToBottom()

        // Show toast if message is from the other party
        const isFromOther = (data.is_admin_reply && !user.value?.email.includes('admin')) || 
                           (!data.is_admin_reply && user.value?.email.includes('admin'))

        if (isFromOther) {
          useToast().add({
            title: data.is_admin_reply ? t('support.agent_reply') : t('support.user_reply'),
            description: data.message.substring(0, 100) + (data.message.length > 100 ? '...' : ''),
            icon: 'i-heroicons-chat-bubble-left-right',
            color: 'primary'
          })
        }
      })
  }
}, { immediate: true })

onUnmounted(() => {
  if (activeTicket.value?.id && $echo) {
    $echo.private(`tickets.${activeTicket.value.id}`).stopListening('.message.sent')
  }
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'primary'
    case 'in_progress': return 'warning'
    case 'resolved': return 'success'
    case 'closed': return 'neutral'
    default: return 'neutral'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    case 'low': return 'info'
    default: return 'neutral'
  }
}
</script>

<template>
  <div class="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white transition-colors duration-500 mesh-bg">
    <AppSidebar />

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-12 lg:ml-72 min-h-screen">
      <header class="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-4xl font-black text-neutral-900 dark:text-white mb-3">{{ $t('support.title') }}</h1>
          <p class="text-neutral-500 font-medium">{{ $t('support.subtitle') }}</p>
        </div>
        
        <UButton
          v-if="!showNewTicketForm"
          icon="i-heroicons-plus"
          size="lg"
          color="primary"
          class="rounded-xl font-bold"
          @click="showNewTicketForm = true"
        >
          {{ $t('support.new_ticket') }}
        </UButton>
        <UButton
          v-else
          icon="i-heroicons-list-bullet"
          variant="soft"
          size="lg"
          color="neutral"
          class="rounded-xl font-bold"
          @click="showNewTicketForm = false"
        >
          {{ $t('support.my_tickets') }}
        </UButton>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Sidebar: Tickets List -->
        <div class="lg:col-span-4 space-y-4 h-[calc(100vh-250px)]">
          <div class="glass-card rounded-3xl border-neutral-200/50 dark:border-white/5 overflow-hidden h-full flex flex-col">
            <div class="p-6 border-b border-neutral-200/50 dark:border-white/5">
              <h3 class="text-lg font-bold flex items-center gap-2">
                <UIcon name="i-heroicons-ticket" class="text-primary-500" />
                {{ $t('support.my_tickets') }}
              </h3>
            </div>

            <div v-if="ticketsLoading" class="p-6 space-y-4">
              <USkeleton class="h-20 w-full rounded-2xl" v-for="i in 3" :key="i" />
            </div>

            <div v-else-if="tickets.length === 0" class="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div class="p-4 bg-neutral-100 dark:bg-white/5 rounded-full mb-4 text-neutral-500">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-8 h-8" />
              </div>
              <p class="text-neutral-500 font-medium">{{ $t('support.no_tickets') }}</p>
            </div>

            <div v-else class="flex-1 overflow-y-auto p-4 space-y-3">
              <div
                v-for="ticket in tickets"
                :key="ticket.id"
                @click="selectTicket(ticket)"
                class="p-4 rounded-2xl border transition-all cursor-pointer relative"
                :class="[
                  activeTicket?.id === ticket.id 
                    ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-900/50' 
                    : 'bg-neutral-50 dark:bg-white/2 border-neutral-100 dark:border-white/5 hover:border-neutral-200 dark:hover:border-white/10'
                ]"
              >
                <!-- Selection Indicator -->
                <div 
                  v-if="activeTicket?.id === ticket.id"
                  class="absolute left-0 top-3 bottom-3 w-1 bg-primary-500 rounded-r-md"
                ></div>

                <div class="flex justify-between items-start mb-2">
                  <UBadge :color="getStatusColor(ticket.status)" variant="subtle" size="sm" class="rounded-lg">
                    {{ $t(`support.status_${ticket.status}`) }}
                  </UBadge>
                  <span class="text-xs text-neutral-400 font-medium">
                    {{ new Date(ticket.created_at).toLocaleDateString() }}
                  </span>
                </div>
                <h4 class="font-bold truncate" :class="activeTicket?.id === ticket.id ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-900 dark:text-white'">
                  {{ ticket.subject }}
                </h4>
                <div class="flex items-center gap-2 mt-2">
                  <div class="w-2 h-2 rounded-full" :class="`bg-${getPriorityColor(ticket.priority)}-500`"></div>
                  <span class="text-xs text-neutral-500 capitalize font-medium">{{ ticket.priority }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Area -->
        <div class="lg:col-span-8 h-[calc(100vh-250px)]">
          <Transition name="fade" mode="out-in">
            <!-- New Ticket Form -->
            <div v-if="showNewTicketForm" key="form" class="h-full">
              <div class="glass-card rounded-3xl border-neutral-200/50 dark:border-white/5 overflow-hidden p-8 h-full overflow-y-auto">
                <div class="flex items-center gap-4 mb-8">
                  <div class="p-3 bg-neutral-100 dark:bg-white/5 rounded-2xl text-neutral-500">
                    <UIcon name="i-heroicons-pencil-square" class="w-6 h-6" />
                  </div>
                  <div>
                    <h2 class="text-2xl font-black uppercase tracking-wider">{{ $t('support.new_ticket') }}</h2>
                    <p class="text-neutral-500 font-medium">{{ $t('support.form_subtitle') }}</p>
                  </div>
                </div>

                <UForm :state="state" @submit="onSubmit" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UFormField :label="$t('support.subject')" name="subject" required>
                      <UInput
                        v-model="state.subject"
                        size="lg"
                        icon="i-heroicons-bookmark"
                        :placeholder="$t('support.subject_placeholder')"
                        class="rounded-xl w-full"
                      />
                    </UFormField>

                    <UFormField :label="$t('support.priority')" name="priority">
                      <USelectMenu
                        v-model="state.priority"
                        :items="priorities"
                        size="lg"
                        class="rounded-xl w-full"
                      >
                        <template #item="{ item }">
                          <div class="flex items-center gap-2">
                            <span :class="`w-2 h-2 rounded-full bg-${item.color}-500`" />
                            <span class="font-medium">{{ item.label }}</span>
                          </div>
                        </template>
                      </USelectMenu>
                    </UFormField>
                  </div>

                  <UFormField :label="$t('support.message')" name="message" required>
                    <UTextarea
                      v-model="state.message"
                      size="lg"
                      :placeholder="$t('support.message_placeholder')"
                      :rows="6"
                      class="rounded-xl w-full"
                    />
                  </UFormField>

                  <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 mt-8 border-t border-neutral-200/50 dark:border-white/5">


                    <UButton
                      type="submit"
                      size="xl"
                      color="primary"
                      :loading="loading"
                      class="rounded-xl font-black px-10 py-3 w-full sm:w-auto text-center justify-center transition-transform hover:scale-[1.02]"
                    >
                      {{ $t('support.submit') }}
                    </UButton>
                  </div>
                </UForm>
              </div>
            </div>

            <!-- Ticket Conversation View -->
            <div v-else-if="activeTicket" key="conversation" class="h-full">
              <div class="glass-card rounded-3xl border-neutral-200/50 dark:border-white/5 overflow-hidden h-full flex flex-col">
                <div class="p-6 border-b border-neutral-200/50 dark:border-white/5 flex items-center justify-between bg-transparent">
                  <div class="flex items-center gap-4">
                    <UButton
                      icon="i-heroicons-chevron-left"
                      variant="ghost"
                      color="neutral"
                      class="lg:hidden"
                      @click="activeTicket = null"
                    />
                    <div>
                      <h3 class="text-xl font-black">{{ activeTicket.subject }}</h3>
                      <div class="flex items-center gap-2 mt-1">
                        <UBadge :color="getStatusColor(activeTicket.status)" variant="subtle" size="xs">
                          {{ $t(`support.status_${activeTicket.status}`) }}
                        </UBadge>
                        <span class="text-xs text-neutral-500 font-medium">
                          Ticket #{{ activeTicket.id }} • {{ new Date(activeTicket.created_at).toLocaleString() }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div id="chat-messages-container" class="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
                  <!-- Initial Question -->
                  <div class="flex flex-col items-end">
                    <div class="max-w-[85%] bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 p-4 rounded-2xl rounded-tr-none">
                      <div class="flex items-center justify-end gap-2 mb-2">
                        <span class="text-[10px] text-neutral-400 font-medium">{{ new Date(activeTicket.created_at).toLocaleTimeString() }}</span>
                        <span class="text-xs font-bold text-primary-600 dark:text-primary-400">{{ user?.name || 'You' }}</span>
                      </div>
                      <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ activeTicket.message }}</p>
                    </div>
                  </div>

                  <!-- Conversation Messages -->
                  <template v-if="activeTicket.messages">
                    <div 
                      v-for="msg in activeTicket.messages" 
                      :key="msg.id"
                      class="flex flex-col"
                      :class="msg.is_admin_reply ? 'items-start' : 'items-end'"
                    >
                      <div 
                        class="max-w-[85%] p-4 rounded-2xl"
                        :class="[
                          msg.is_admin_reply 
                            ? 'bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-tl-none' 
                            : 'bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30 rounded-tr-none'
                        ]"
                      >
                        <div class="flex items-center gap-2 mb-2" :class="msg.is_admin_reply ? 'justify-start' : 'justify-end'">
                          <template v-if="msg.is_admin_reply">
                            <UIcon name="i-heroicons-shield-check" class="text-primary-500 w-4 h-4" />
                            <span class="text-xs font-bold text-neutral-700 dark:text-neutral-300">Support Agent</span>
                            <span class="text-[10px] text-neutral-400 font-medium">{{ new Date(msg.created_at).toLocaleTimeString() }}</span>
                          </template>
                          <template v-else>
                            <span class="text-[10px] text-neutral-400 font-medium">{{ new Date(msg.created_at).toLocaleTimeString() }}</span>
                            <span class="text-xs font-bold text-primary-600 dark:text-primary-400">{{ user?.name || 'You' }}</span>
                          </template>
                        </div>
                        <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ msg.message }}</p>
                      </div>
                    </div>
                  </template>
                </div>

                <div v-if="activeTicket.status !== 'closed'" class="p-6 border-t border-neutral-200/50 dark:border-white/5 bg-transparent">
                  <div class="flex items-center gap-3 bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 rounded-2xl py-1 px-2 pl-4 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                    <UTextarea
                      v-model="replyMessage"
                      :placeholder="t('support.message_placeholder')"
                      :rows="1"
                      autoresize
                      variant="none"
                      class="flex-1 bg-transparent border-none py-2 focus:ring-0 text-sm"
                      @keydown.enter.exact.prevent="sendReply"
                    />
                    <UButton
                      icon="i-heroicons-paper-airplane"
                      size="md"
                      color="primary"
                      :loading="isSendingReply"
                      :disabled="!replyMessage.trim()"
                      class="rounded-xl shadow-lg shadow-primary-500/20 shrink-0"
                      @click="sendReply"
                    />
                  </div>
                  <p class="text-neutral-400 text-[10px] mt-2 px-1 font-medium">
                    {{ $t('support.response_time_desc') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else key="empty" class="h-full flex items-center justify-center">
              <div class="glass-card rounded-3xl border-neutral-200/50 dark:border-white/5 max-w-md w-full text-center p-10">
                <div class="p-5 bg-neutral-100 dark:bg-white/5 rounded-2xl w-20 h-20 mx-auto mb-6 flex items-center justify-center text-neutral-500">
                  <UIcon name="i-heroicons-lifebuoy" class="w-10 h-10" />
                </div>
                <h2 class="text-xl font-black uppercase tracking-wider mb-2">{{ $t('support.title') }}</h2>
                <p class="text-neutral-500 font-medium mb-8">{{ $t('support.subtitle') }}</p>
                <UButton
                  size="lg"
                  color="primary"
                  class="rounded-xl font-bold"
                  @click="showNewTicketForm = true"
                >
                  {{ $t('support.new_ticket') }}
                </UButton>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

