import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')
  const realtimeDebugEnabled = import.meta.client && localStorage.getItem('debug:realtime') === '1'

  let echo: Echo<'reverb'> | null = null

  if (config.public.reverbAppKey && import.meta.client) {
    (window as any).Pusher = Pusher

    if (realtimeDebugEnabled) {
      Pusher.logToConsole = true
      console.info('[realtime] Initializing Echo', {
        apiBase: config.public.apiBase,
        hasToken: Boolean(token.value),
        keyPresent: Boolean(config.public.reverbAppKey),
        host: config.public.reverbHost,
      })
    }

    echo = new Echo<'reverb'>({
      broadcaster: 'reverb',
      key: config.public.reverbAppKey,
      wsHost: config.public.reverbHost,
      wsPort: config.public.reverbScheme === 'https' ? undefined : Number(config.public.reverbPort),
      wssPort: config.public.reverbScheme === 'https' ? Number(config.public.reverbPort) : undefined,
      forceTLS: config.public.reverbScheme === 'https',
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${config.public.apiBase}/api/v1/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'X-Frontend-Key': config.public.frontendKey,
          Accept: 'application/json'
        }
      }
    })

    if (realtimeDebugEnabled && (echo as any)?.connector?.pusher?.connection) {
      const connection = (echo as any).connector.pusher.connection
      connection.bind('connected', () => {
        console.info('[realtime] Reverb connected', { socketId: (echo as any).socketId?.() })
      })
      connection.bind('disconnected', () => {
        console.warn('[realtime] Reverb disconnected')
      })
      connection.bind('error', (error: any) => {
        console.error('[realtime] Reverb error', error)
      })
      connection.bind('state_change', (states: any) => {
        console.info('[realtime] Reverb state change', states)
      })
    }
  } else if (realtimeDebugEnabled) {
    console.warn('[realtime] Echo not initialized: missing NUXT_PUBLIC_REVERB_APP_KEY')
  }

  return {
    provide: {
      echo
    }
  }
})