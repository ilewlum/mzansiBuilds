// Supabase client configuration and initialization

import {createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// Admin client , auth verification (no RLS)
export const supabaseAdmin = createClient(
                              process.env.SUPABASE_URL,
                              process.env.SUPABASE_SERVICE_ROLE_KEY
                            )

// User-scoped client — RLS applies
export function creatUserClient(token){
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )
}