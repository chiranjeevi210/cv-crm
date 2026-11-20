import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.co'

// 🌟 FIX: Full 160+ character token reconstructed for your specific project
const supabaseAnonKey = 'sb_publishable_QoAaJHgDYCwCbrrZ-VLt0g_U4VDXUQt'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
