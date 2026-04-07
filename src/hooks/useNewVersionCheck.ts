import { useRegisterSW } from 'virtual:pwa-register/react'

// Usa o mecanismo nativo do service worker para detectar updates.
// Isso funciona em desktop e mobile pois bypassa o cache do SW completamente.
export function useNewVersionCheck() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      // Verifica update a cada 30s chamando r.update() diretamente no SW
      setInterval(() => {
        registration?.update()
      }, 30_000)
    },
  })

  return { updateAvailable: needRefresh, updateServiceWorker }
}
