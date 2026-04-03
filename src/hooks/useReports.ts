import { useQuery } from '@tanstack/react-query'
import { supabase, CHURCH_ID } from '@/lib/supabase'
import type { ServiceHistory } from '@/store/types'

export function useReports() {
  const { data: history = [], isLoading: loading } = useQuery({
    queryKey: ['service_history', CHURCH_ID],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_history')
        .select('*')
        .eq('church_id', CHURCH_ID)
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data.map((r): ServiceHistory => ({
        id: r.id,
        date: r.service_date,
        serviceName: r.service_name,
        childrenCount: r.children_count,
        callsCount: r.calls_count,
      }))
    },
  })

  function getTodayStats() {
    const today = new Date().toISOString().split('T')[0]
    const todayRecords = history.filter((h) => h.date === today)
    return {
      childrenCount: todayRecords.reduce((s, h) => s + h.childrenCount, 0),
      callsCount: todayRecords.reduce((s, h) => s + h.callsCount, 0),
    }
  }

  return { history, loading, getTodayStats }
}
