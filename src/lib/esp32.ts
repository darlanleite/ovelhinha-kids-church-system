/**
 * Comunicação com o backend Ovelhinha via HTTP.
 * Configure VITE_BACKEND_URL no .env para apontar ao servidor local ou remoto.
 * Padrão: http://localhost:3001
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const FETCH_HEADERS = {
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': '1',
};

export async function acionarPulseira(braceletId: string, reason?: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/acionar`, {
    method: 'POST',
    headers: FETCH_HEADERS,
    body: JSON.stringify({ braceletId, reason }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { error?: string }).error || `Erro ao acionar pulseira #${braceletId}`);
  }
}

export async function encerrarPulseira(braceletId: string): Promise<void> {
  const response = await fetch(`${BACKEND_URL}/api/encerrar`, {
    method: 'POST',
    headers: FETCH_HEADERS,
    body: JSON.stringify({ braceletId }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { error?: string }).error || `Erro ao encerrar pulseira #${braceletId}`);
  }
}

export async function statusPulseiras(): Promise<{
  gatewaysConectados: number;
  pulseirasAtivas: Array<{ braceletId: string; reason: string; acionadoAt: string }>;
}> {
  const response = await fetch(`${BACKEND_URL}/api/status`, { headers: FETCH_HEADERS });
  if (!response.ok) throw new Error('Erro ao buscar status das pulseiras');
  return response.json();
}
