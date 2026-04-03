import type { Child, Call, Bracelet } from '@/store/types';

export type SyncEvent =
  | { _sync: true; type: 'addCall'; payload: Call }
  | { _sync: true; type: 'answerCall'; payload: { callId: string; answeredBy: 'reception' | 'tia' } }
  | { _sync: true; type: 'reactivateCall'; payload: { callId: string } }
  | { _sync: true; type: 'addChild'; payload: Child }
  | { _sync: true; type: 'updateChild'; payload: { id: string; updates: Partial<Child> } }
  | { _sync: true; type: 'checkout'; payload: { childId: string; braceletNumber: string | null } }
  | { _sync: true; type: 'novoCulto'; payload: Record<string, never> };

export type InitEvent = {
  _init: true;
  children: Child[];
  calls: Call[];
  bracelets: Pick<Bracelet, 'id' | 'number' | 'status' | 'guardianName' | 'childId'>[];
};

const WS_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001')
  .replace(/^https/, 'wss')
  .replace(/^http/, 'ws');

type Handler = (event: SyncEvent) => void;
type InitHandler = (event: InitEvent) => void;
const handlers = new Set<Handler>();
const initHandlers = new Set<InitHandler>();
let socket: WebSocket | null = null;

function connect() {
  socket = new WebSocket(WS_URL);
  socket.onopen  = () => console.log('[SYNC] Conectado ao backend');
  socket.onclose = () => { console.log('[SYNC] Desconectado — reconectando...'); setTimeout(connect, 3000); };
  socket.onerror = () => {};
  socket.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      if (data._sync) handlers.forEach((h) => h(data as SyncEvent));
      else if (data._init) initHandlers.forEach((h) => h(data as InitEvent));
    } catch {}
  };
}

export function initSync() {
  connect();
}

export function emitSync(event: Omit<SyncEvent, '_sync'>) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ ...event, _sync: true }));
  }
}

export function onSyncEvent(handler: Handler) {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export function onInitEvent(handler: InitHandler) {
  initHandlers.add(handler);
  return () => initHandlers.delete(handler);
}
