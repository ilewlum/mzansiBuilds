// Initializes and exports the Supabase client for database interactions
import { createClient } from '@supabase/supabase-js'

// Load Supabase URL and anonymous key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase