import { createClient } from '@supabase/supabase-js'

// 🌟 FIX: Change this back to your unique project URL from your earlier step
const supabaseUrl = 'https://vhlxlvjsuzrqicjrxjnm.supabase.co'

// Keep your anon key exactly the same as it is
const supabaseAnonKey = 'sb_publishable_QoAaJHgDYCwCbrrZ-VLt0g_U4VDXUQt' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
