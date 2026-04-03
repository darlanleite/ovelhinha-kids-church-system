import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  userRole: 'reception' | 'tia' | null
  tiaRoom: string | null
  login: (role: 'reception' | 'tia', roomId?: string) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userRole: null,
      tiaRoom: null,
      login: (role, roomId) => set({ userRole: role, tiaRoom: roomId || null }),
      logout: () => set({ userRole: null, tiaRoom: null }),
    }),
    { name: 'ovelhinha-auth' }
  )
)
