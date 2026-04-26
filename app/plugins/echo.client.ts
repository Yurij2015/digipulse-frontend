import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const token = useCookie('auth-token')

  if (!config.public.pusherAppKey) {
    return {
      provide: {
        echo: null
      }
    }
  }

  // @ts-ignore
  if (process.client) {
    // @ts-ignore
    window.Pusher = Pusher

    const echo = new Echo({
      broadcaster: 'pusher',
      key: config.public.pusherAppKey,
      cluster: config.public.pusherAppCluster,
      forceTLS: true,
      authEndpoint: `${config.public.apiBase}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token.value}`,
          'X-Frontend-Key': config.public.frontendKey,
          'Accept': 'application/json'
        }
      }
    })

    return {
      provide: {
        echo
      }
    }
  }
})
