import { useQuery } from '@tanstack/react-query'
import { CHURCH_ID } from '@/lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export interface GatewayCommandLog {
  id: string
  command: string
  reason: string | null
  status: string
  bracelet_id: string
  gateway_id: string | null
  gateway_name: string | null
  delivered_at: string | null
  attempts: number
  created_at: string
}

export function useGatewayCommands() {
  const { data, isLoading } = useQuery({
    queryKey: ['gateway_commands_log', CHURCH_ID],
    queryFn: async (): Promise<GatewayCommandLog[]> => {
      const url = `${SUPABASE_URL}/rest/v1/gateway_commands?church_id=eq.${CHURCH_ID}&order=created_at.desc&limit=50&select=id,command,reason,status,bracelet_id,gateway_id,delivered_at,attempts,created_at`
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      })
      if (!res.ok) return []
      const commands: GatewayCommandLog[] = await res.json()

      // Busca nomes dos gateways
      const gwRes = await fetch(
        `${SUPABASE_URL}/rest/v1/gateways?church_id=eq.${CHURCH_ID}&select=id,name`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      )
      const gateways: { id: string; name: string }[] = gwRes.ok ? await gwRes.json() : []
      const gwMap = Object.fromEntries(gateways.map((g) => [g.id, g.name]))

      return commands.map((c) => ({
        ...c,
        gateway_name: c.gateway_id ? gwMap[c.gateway_id] ?? null : null,
      }))
    },
    refetchInterval: 15_000,
  })

  return { commands: data ?? [], isLoading }
}
