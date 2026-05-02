import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')

  let echo: Echo<'pusher'> | null = null

  if (config.public.pusherAppKey && import.meta.client) {
    (window as any).Pusher = Pusher

    echo = new Echo<'pusher'>({
      broadcaster: 'pusher',
      key: config.public.pusherAppKey,
      cluster: config.public.pusherAppCluster,
      forceTLS: true,
      authEndpoint: `${config.public.apiBase}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'X-Frontend-Key': config.public.frontendKey,
          Accept: 'application/json'
        }
      }
    })
  }

  return {
    provide: {
      echo
    }
  }
})
