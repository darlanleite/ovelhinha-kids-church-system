import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const CHURCH_ID: string =
  import.meta.env.VITE_CHURCH_ID || '00000000-0000-0000-0000-000000000001'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
