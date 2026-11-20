import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.co'
// Click the copy icon next to the Publishable key (sb_publishable_...) and paste it below:
const supabaseAnonKey = 'sb_publishable_QoAaJHgDYCwCbrrZ-VLt0g_U4VDXUQt' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
