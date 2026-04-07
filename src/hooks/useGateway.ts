import { useQuery } from '@tanstack/react-query'
import { supabase, CHURCH_ID } from '@/lib/supabase'

type GatewayStatus = 'online' | 'warning' | 'offline' | 'unknown'

function computeStatus(lastSeen: string | null): GatewayStatus {
  if (!lastSeen) return 'unknown'
  const secs = (Date.now() - new Date(lastSeen).getTime()) / 1000
  if (secs < 60) return 'online'
  if (secs < 120) return 'warning'
  return 'offline'
}

export function useGateway() {
  const { data, isLoading } = useQuery({
    queryKey: ['gateway', CHURCH_ID],
    queryFn: async () => {
      const { data } = await supabase
        .from('gateways')
        .select('name, last_seen')
        .eq('church_id', CHURCH_ID)
        .order('last_seen', { ascending: false })
        .limit(1)
        .maybeSingle()
      return data
    },
    refetchInterval: 15_000, // atualiza a cada 15s
  })

  const lastSeen = data?.last_seen ?? null
  const status = computeStatus(lastSeen)
  const secsAgo = lastSeen ? Math.floor((Date.now() - new Date(lastSeen).getTime()) / 1000) : null

  return { status, lastSeen, secsAgo, name: data?.name ?? 'Gateway-01', isLoading }
}
