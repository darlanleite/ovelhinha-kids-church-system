import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/useAppStore'

const DEVICE_ID_KEY = 'ovelhinha-device-id'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const CHURCH_ID = import.meta.env.VITE_CHURCH_ID as string
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

async function upsertSubscription(sub: PushSubscription, role: string, roomId: string | null) {
  const deviceId = getOrCreateDeviceId()
  await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      church_id: CHURCH_ID,
      device_id: deviceId,
      role,
      room_id: roomId || null,
      subscription: sub.toJSON(),
      updated_at: new Date().toISOString(),
    }),
  })
}

export function usePushNotifications() {
  const userRole = useAppStore((s) => s.userRole)
  const tiaRoom = useAppStore((s) => s.tiaRoom)

  const isSupported = typeof window !== 'undefined'
    && 'serviceWorker' in navigator
    && 'PushManager' in window

  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? Notification.permission : 'denied'
  )
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Re-inscreve quando a sala da tia muda (garante room_id atualizado)
  useEffect(() => {
    if (!isSupported || !userRole || permission !== 'granted') return
    navigator.serviceWorker.ready.then(async (reg) => {
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await upsertSubscription(sub, userRole, tiaRoom)
        setIsSubscribed(true)
      }
    })
  }, [userRole, tiaRoom, permission, isSupported])

  const subscribe = useCallback(async () => {
    if (!isSupported || !userRole) return
    try {
      const perm = await Notification.requestPermission()
      setPermission(perm)
      if (perm !== 'granted') return

      const reg = await navigator.serviceWorker.ready
      let sub = await reg.pushManager.getSubscription()
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })
      }
      await upsertSubscription(sub, userRole, tiaRoom)
      setIsSubscribed(true)
    } catch (err) {
      console.error('[Push] Erro ao ativar notificações:', err)
    }
  }, [isSupported, userRole, tiaRoom])

  return { isSupported, permission, isSubscribed, subscribe }
}
