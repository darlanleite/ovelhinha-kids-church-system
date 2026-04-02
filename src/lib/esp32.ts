/**
 * Utilitário para comunicação com o ESP32 via HTTP local.
 * O ESP32 deve estar na mesma rede Wi-Fi e com CORS habilitado.
 */

export async function callEsp32(baseUrl: string, endpoint: '/on' | '/off'): Promise<boolean> {
  if (!baseUrl) return false;
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3s timeout
    });
    return res.ok;
  } catch {
    // Rede indisponível, ESP32 offline ou CORS bloqueado
    return false;
  }
}
