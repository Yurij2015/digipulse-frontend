import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')
  const realtimeDebugEnabled = import.meta.client && localStorage.getItem('debug:realtime') === '1'

  let echo: Echo<'pusher'> | null = null

  if (config.public.pusherAppKey && import.meta.client) {
    (window as any).Pusher = Pusher

    if (realtimeDebugEnabled) {
      Pusher.logToConsole = true
      console.info('[realtime] Initializing Echo', {
        apiBase: config.public.apiBase,
        hasToken: Boolean(token.value),
        keyPresent: Boolean(config.public.pusherAppKey),
      })
    }

    echo = new Echo<'pusher'>({
      broadcaster: 'pusher',
      key: config.public.pusherAppKey,
      cluster: config.public.pusherAppCluster,
      forceTLS: true,
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
        console.info('[realtime] Pusher connected', { socketId: (echo as any).socketId?.() })
      })
      connection.bind('disconnected', () => {
        console.warn('[realtime] Pusher disconnected')
      })
      connection.bind('error', (error: any) => {
        console.error('[realtime] Pusher error', error)
      })
      connection.bind('state_change', (states: any) => {
        console.info('[realtime] Pusher state change', states)
      })
    }
  } else if (realtimeDebugEnabled) {
    console.warn('[realtime] Echo not initialized: missing NUXT_PUBLIC_PUSHER_APP_KEY')
  }

  return {
    provide: {
      echo
    }
  }
})
