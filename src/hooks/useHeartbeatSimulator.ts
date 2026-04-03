// Simulator replaced by real connectivity data from Supabase (last_seen_at → deriveConnectivity in useBracelets)
export function useHeartbeatSimulator() {
  return { onlineBracelets: 0, warningBracelets: 0, unreachableBracelets: 0 }
}
