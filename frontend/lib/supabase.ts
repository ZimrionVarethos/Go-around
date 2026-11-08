import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtcozobptgwetdnvqedp.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Lz-KGUMtaP6ROODL2TbP1g_hspSwPFq';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

