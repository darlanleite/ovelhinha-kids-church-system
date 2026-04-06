import { supabase, CHURCH_ID } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

async function getBraceletUUID(braceletNumber: string): Promise<string | null> {
  const { data } = await supabase
    .from('bracelets')
    .select('id')
    .eq('church_id', CHURCH_ID)
    .eq('number', braceletNumber)
    .single()
  return data?.id ?? null
}

async function insertGatewayCommand(braceletId: string, command: string, reason?: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/gateway_commands`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      church_id: CHURCH_ID,
      bracelet_id: braceletId,
      command,
      reason: reason || null,
      status: 'pending',
    }),
  })
  return res.ok
}

export async function acionarPulseira(braceletNumber: string, reason?: string) {
  try {
    const braceletId = await getBraceletUUID(braceletNumber)
    if (!braceletId) return false
    return await insertGatewayCommand(braceletId, 'acionar', reason)
  } catch {
    return false
  }
}

export async function encerrarPulseira(braceletNumber: string) {
  try {
    const braceletId = await getBraceletUUID(braceletNumber)
    if (!braceletId) return false
    return await insertGatewayCommand(braceletId, 'encerrar')
  } catch {
    return false
  }
}
