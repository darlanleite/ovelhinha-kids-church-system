import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Child, Bracelet, Call, Room, ServiceHistory, AppSettings, Gateway } from './types';
import { mockChildren, mockBracelets, mockCalls, mockRooms, mockHistory, mockSettings, mockGateways } from './mockData';

interface AppState {
  // Auth
  userRole: 'reception' | 'tia' | null;
  tiaRoom: string | null;
  login: (role: 'reception' | 'tia', roomId?: string) => void;
  logout: () => void;

  // Data
  children: Child[];
  bracelets: Bracelet[];
  calls: Call[];
  rooms: Room[];
  history: ServiceHistory[];
  settings: AppSettings;
  gateways: Gateway[];

  // Actions — children
  addChild: (child: Child) => void;
  updateChild: (id: string, updates: Partial<Child>) => void;

  // Actions — calls
  addCall: (call: Omit<Call, 'id'>) => void;
  answerCall: (callId: string, answeredBy: 'reception' | 'tia') => void;
  reactivateCall: (callId: string) => void;

  // Actions — bracelets
  updateBracelet: (id: string, updates: Partial<Bracelet>) => void;
  addBracelet: (bracelet: Bracelet) => void;
  updateHeartbeat: (braceletId: string, gatewayId: string) => void;
  markBraceletUnreachable: (braceletId: string) => void;

  // Actions — settings & rooms
  updateSettings: (updates: Partial<AppSettings>) => void;
  addRoom: (room: Room) => void;
  removeRoom: (id: string) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;

  // Actions — gateways
  addGateway: (gateway: Gateway) => void;
  updateGateway: (id: string, updates: Partial<Gateway>) => void;
  removeGateway: (id: string) => void;

  // Actions — culto
  novoCulto: () => void;
  hydrateFromServer: (serverState: {
    children: Child[];
    calls: Call[];
    bracelets: Pick<Bracelet, 'id' | 'number' | 'status' | 'guardianName' | 'childId'>[];
  }) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      userRole: null,
      tiaRoom: null,
      login: (role, roomId) => set({ userRole: role, tiaRoom: roomId || null }),
      logout: () => set({ userRole: null, tiaRoom: null }),

      children: mockChildren,
      bracelets: mockBracelets,
      calls: mockCalls,
      rooms: mockRooms,
      history: mockHistory,
      settings: mockSettings,
      gateways: mockGateways,

      addChild: (child) => set((s) => ({ children: [...s.children, child] })),
      updateChild: (id, updates) => set((s) => ({
        children: s.children.map((c) => c.id === id ? { ...c, ...updates } : c),
      })),

      addCall: (callData) => set((s) => ({
        calls: [...s.calls, callData as Call],
      })),

      answerCall: (callId, answeredBy) => set((s) => {
        const call = s.calls.find((c) => c.id === callId);
        return {
          calls: s.calls.map((c) =>
            c.id === callId
              ? { ...c, status: 'answered' as const, answeredAt: new Date().toISOString(), answeredBy }
              : c
          ),
          children: call
            ? s.children.map((ch) =>
                ch.id === call.childId ? { ...ch, status: 'present' as const } : ch
              )
            : s.children,
          bracelets: call
            ? s.bracelets.map((b) =>
                b.number === call.braceletNumber
                  ? { ...b, status: 'available' as const, guardianName: null, childId: null }
                  : b
              )
            : s.bracelets,
        };
      }),

      reactivateCall: (callId) => set((s) => ({
        calls: s.calls.map((c) =>
          c.id === callId
            ? { ...c, status: 'reactivated' as const, createdAt: new Date().toISOString(), answeredAt: null, answeredBy: null }
            : c
        ),
      })),

      updateBracelet: (id, updates) => set((s) => ({
        bracelets: s.bracelets.map((b) => b.id === id ? { ...b, ...updates } : b),
      })),

      addBracelet: (bracelet) => set((s) => ({ bracelets: [...s.bracelets, bracelet] })),

      updateHeartbeat: (braceletId, gatewayId) => set((s) => ({
        bracelets: s.bracelets.map((b) =>
          b.id === braceletId
            ? { ...b, lastHeartbeat: new Date().toISOString(), lastGatewayId: gatewayId, connectivityStatus: 'online' as const }
            : b
        ),
      })),

      markBraceletUnreachable: (braceletId) => set((s) => ({
        bracelets: s.bracelets.map((b) =>
          b.id === braceletId
            ? { ...b, connectivityStatus: 'unreachable' as const }
            : b
        ),
      })),

      updateSettings: (updates) => set((s) => ({ settings: { ...s.settings, ...updates } })),
      addRoom: (room) => set((s) => ({ rooms: [...s.rooms, room] })),
      removeRoom: (id) => set((s) => ({ rooms: s.rooms.filter((r) => r.id !== id) })),
      updateRoom: (id, updates) => set((s) => ({
        rooms: s.rooms.map((r) => r.id === id ? { ...r, ...updates } : r),
      })),

      addGateway: (gateway) => set((s) => ({ gateways: [...s.gateways, gateway] })),
      updateGateway: (id, updates) => set((s) => ({
        gateways: s.gateways.map((g) => g.id === id ? { ...g, ...updates } : g),
      })),
      removeGateway: (id) => set((s) => ({ gateways: s.gateways.filter((g) => g.id !== id) })),

      hydrateFromServer: (serverState) => set((s) => ({
        children: serverState.children,
        calls: serverState.calls,
        bracelets: s.bracelets.map((b) => {
          const sb = serverState.bracelets.find((x) => x.number === b.number);
          return sb
            ? { ...b, status: sb.status, guardianName: sb.guardianName, childId: sb.childId }
            : b;
        }),
      })),

      novoCulto: () => set((s) => ({
        children: [],
        calls: [],
        bracelets: s.bracelets.map((b) => ({
          ...b,
          status: b.status === 'in-use' ? 'available' as const : b.status,
          guardianName: null,
          childId: null,
        })),
      })),
    }),
    { name: 'ovelhinha-storage' }
  )
);
