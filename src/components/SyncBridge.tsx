import { useEffect } from 'react';
import { initSync, onSyncEvent, onInitEvent } from '@/lib/syncClient';
import { useStore } from '@/store/useStore';

// Inicializa conexão uma vez
let initialized = false;

export function SyncBridge() {
  const addCall        = useStore((s) => s.addCall);
  const answerCall     = useStore((s) => s.answerCall);
  const reactivateCall = useStore((s) => s.reactivateCall);
  const addChild       = useStore((s) => s.addChild);
  const updateChild    = useStore((s) => s.updateChild);
  const updateBracelet = useStore((s) => s.updateBracelet);
  const bracelets      = useStore((s) => s.bracelets);
  const novoCulto      = useStore((s) => s.novoCulto);
  const hydrateFromServer = useStore((s) => s.hydrateFromServer);

  useEffect(() => {
    if (!initialized) {
      initSync();
      initialized = true;
    }

    const unsubInit = onInitEvent((event) => {
      console.log('[SYNC] Estado inicial recebido do servidor');
      hydrateFromServer({
        children: event.children,
        calls: event.calls,
        bracelets: event.bracelets,
      });
    });

    const unsubSync = onSyncEvent((event) => {
      console.log('[SYNC] Evento recebido:', event.type);

      switch (event.type) {
        case 'addCall':
          addCall(event.payload);
          break;
        case 'answerCall':
          answerCall(event.payload.callId, event.payload.answeredBy);
          break;
        case 'reactivateCall':
          reactivateCall(event.payload.callId);
          break;
        case 'addChild':
          addChild(event.payload);
          break;
        case 'updateChild':
          updateChild(event.payload.id, event.payload.updates);
          break;
        case 'checkout': {
          const { childId, braceletNumber } = event.payload;
          updateChild(childId, { status: 'left', braceletNumber: null });
          if (braceletNumber) {
            const b = bracelets.find((b) => b.number === braceletNumber);
            if (b) updateBracelet(b.id, { status: 'available', guardianName: null, childId: null });
          }
          break;
        }
        case 'novoCulto':
          novoCulto();
          break;
      }
    });

    return () => { unsubInit(); unsubSync(); };
  }, []);

  return null;
}
