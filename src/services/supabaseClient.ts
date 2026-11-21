import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://finvlqihyqmasupqapar.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mqHt2iT2oRD1-ns5VDgy6A_KQsjicjw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
