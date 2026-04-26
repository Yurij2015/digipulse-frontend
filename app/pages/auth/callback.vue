<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter, useAuth, useRuntimeConfig } from '#imports'

const route = useRoute()
const router = useRouter()
const { setAuth } = useAuth()
const config = useRuntimeConfig()

onMounted(async () => {
  console.log('Callback page mounted, checking for token...')
  let token = route.query.token as string
  let userDataRaw = route.query.user as string

  // Handle token from URL fragment (#token=xxx)
  // We check window.location.hash directly as route.hash might be empty during some redirects
  const hash = route.hash || (typeof window !== 'undefined' ? window.location.hash : '')
  console.log('Current hash:', hash)

  if (!token && hash) {
    const hashParams = new URLSearchParams(hash.substring(1))
    token = hashParams.get('token') || ''
    userDataRaw = hashParams.get('user') || ''
  }

  console.log('Token found:', token ? 'YES (truncated: ' + token.substring(0, 5) + '...)' : 'NO')

  if (!token) {
    console.error('No token found in callback')
    await router.push('/auth/login?error=no_token')
    return
  }

  try {
    let user = null
    
    if (userDataRaw) {
      // Decode user data from URL if provided (base64 or JSON)
      try {
        user = JSON.parse(decodeURIComponent(userDataRaw))
      } catch (e) {
        console.warn('Failed to parse user data from URL, will try fetching from API')
      }
    }

    // If no user data in URL, fetch it from backend
    if (!user) {
      const response = await $fetch<any>(`${config.public.apiBase}/api/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Frontend-Key': config.public.frontendKey as string
        }
      })
      user = response.user || response
    }

    // Initialize session
    setAuth({ token, user })

    // Smooth transition to dashboard
    setTimeout(() => {
      router.push('/dashboard')
    }, 500)
    
  } catch (error) {
    console.error('Authentication failed:', error)
    await router.push('/auth/login?error=auth_failed')
  }
})

// Prevent access directly through URL
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="fixed inset-0 bg-[#050505] flex items-center justify-center overflow-hidden">
    <!-- Refined Backdrop -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]"></div>
    </div>

    <div class="relative z-10 flex flex-col items-center gap-8">
      <!-- Animated Logo / Loader -->
      <div class="relative group">
        <div class="absolute -inset-4 bg-linear-to-r from-violet-600 to-cyan-600 rounded-full blur opacity-20 group-hover:opacity-40 animate-pulse transition duration-1000"></div>
        <div class="relative p-6 bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full">
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 text-white animate-spin opacity-80" />
        </div>
      </div>

      <div class="text-center space-y-2">
        <h1 class="text-2xl font-light tracking-widest text-white/90 uppercase">
          {{ $t('auth.callback.authenticating') || 'Authenticating' }}
        </h1>
        <p class="text-white/40 text-sm font-light tracking-wide">
          {{ $t('auth.callback.redirecting') || 'Preparing your workspace...' }}
        </p>
      </div>

      <!-- Glassy Terminal-like Progress Bar -->
      <div class="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden relative border border-white/10">
        <div class="absolute inset-0 bg-linear-to-r from-violet-600 via-cyan-500 to-violet-600 bg-size-[200%_100%] animate-[shimmer_2s_infinite_linear] opacity-100"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
</style>
