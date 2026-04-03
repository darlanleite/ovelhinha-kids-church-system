export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      churches: {
        Row: {
          id: string
          name: string
          daily_code: string
          reactivate_minutes: number
          heartbeat_interval_seconds: number
          heartbeat_warning_threshold: number
          heartbeat_offline_threshold: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          daily_code?: string
          reactivate_minutes?: number
          heartbeat_interval_seconds?: number
          heartbeat_warning_threshold?: number
          heartbeat_offline_threshold?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['churches']['Insert']>
      }
      rooms: {
        Row: {
          id: string
          church_id: string
          name: string
          emoji: string
          age_range: string
          created_at: string
        }
        Insert: {
          id?: string
          church_id: string
          name: string
          emoji: string
          age_range: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>
      }
      children: {
        Row: {
          id: string
          church_id: string
          name: string
          birth_date: string
          room_id: string
          medical_notes: string | null
          bracelet_number: string | null
          authorized_pickup: string | null
          status: 'present' | 'called' | 'left'
          checked_in_at: string
          created_at: string
        }
        Insert: {
          id?: string
          church_id: string
          name: string
          birth_date: string
          room_id: string
          medical_notes?: string | null
          bracelet_number?: string | null
          authorized_pickup?: string | null
          status?: 'present' | 'called' | 'left'
          checked_in_at?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['children']['Insert']>
      }
      guardians: {
        Row: {
          id: string
          child_id: string
          name: string
          phone: string
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          child_id: string
          name: string
          phone: string
          is_primary?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['guardians']['Insert']>
      }
      bracelets: {
        Row: {
          id: string
          church_id: string
          number: string
          esp_id: string | null
          status: 'available' | 'in-use' | 'charging' | 'offline'
          battery: number
          guardian_name: string | null
          child_id: string | null
          last_heartbeat: string | null
          connectivity_status: 'online' | 'warning' | 'unreachable'
          last_gateway_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          church_id: string
          number: string
          esp_id?: string | null
          status?: 'available' | 'in-use' | 'charging' | 'offline'
          battery?: number
          guardian_name?: string | null
          child_id?: string | null
          last_heartbeat?: string | null
          connectivity_status?: 'online' | 'warning' | 'unreachable'
          last_gateway_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['bracelets']['Insert']>
      }
      calls: {
        Row: {
          id: string
          church_id: string
          child_id: string
          bracelet_number: string
          room_id: string
          reason: string
          reason_icon: string
          status: 'open' | 'answered' | 'reactivated'
          answered_by: 'reception' | 'tia' | null
          created_at: string
          answered_at: string | null
          bracelet_connectivity_at_call: string
          ble_delivery_status: 'pending' | 'delivered' | 'failed'
          ble_attempts: number
          ble_last_attempt_at: string | null
          fallback_triggered: boolean
          fallback_attempts: Json
        }
        Insert: {
          id?: string
          church_id: string
          child_id: string
          bracelet_number: string
          room_id: string
          reason: string
          reason_icon: string
          status?: 'open' | 'answered' | 'reactivated'
          answered_by?: 'reception' | 'tia' | null
          created_at?: string
          answered_at?: string | null
          bracelet_connectivity_at_call?: string
          ble_delivery_status?: 'pending' | 'delivered' | 'failed'
          ble_attempts?: number
          ble_last_attempt_at?: string | null
          fallback_triggered?: boolean
          fallback_attempts?: Json
        }
        Update: Partial<Database['public']['Tables']['calls']['Insert']>
      }
      service_history: {
        Row: {
          id: string
          church_id: string
          date: string
          service_name: string
          children_count: number
          calls_count: number
          created_at: string
        }
        Insert: {
          id?: string
          church_id: string
          date: string
          service_name: string
          children_count: number
          calls_count: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['service_history']['Insert']>
      }
    }
    Functions: {
      answer_call: {
        Args: { p_call_id: string; p_answered_by: string }
        Returns: void
      }
      close_service: {
        Args: { p_church_id: string }
        Returns: void
      }
    }
    Enums: Record<string, never>
  }
}
