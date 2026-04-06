import { supabase, CHURCH_ID } from './supabase'

async function getBraceletUUID(braceletNumber: string): Promise<string | null> {
  const { data } = await supabase
    .from('bracelets')
    .select('id')
    .eq('church_id', CHURCH_ID)
    .eq('number', braceletNumber)
    .single()
  return data?.id ?? null
}

export async function acionarPulseira(braceletNumber: string, reason?: string) {
  try {
    const braceletId = await getBraceletUUID(braceletNumber)
    if (!braceletId) return false
    const { error } = await supabase.from('gateway_commands').insert({
      church_id: CHURCH_ID,
      bracelet_id: braceletId,
      command: 'acionar',
      reason: reason || null,
      status: 'pending',
    })
    return !error
  } catch {
    return false
  }
}

export async function encerrarPulseira(braceletNumber: string) {
  try {
    const braceletId = await getBraceletUUID(braceletNumber)
    if (!braceletId) return false
    const { error } = await supabase.from('gateway_commands').insert({
      church_id: CHURCH_ID,
      bracelet_id: braceletId,
      command: 'encerrar',
      reason: null,
      status: 'pending',
    })
    return !error
  } catch {
    return false
  }
}
