import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your project's URL and anon key
const supabaseUrl = 'https://dcvkeqtirdxmmzupvcmh.supabase.co';
const supabaseKey = 'sb_publishable_6s-pX6YD2rbSrxf6fmfeAQ_odl3OpRd';

if (!supabaseUrl || supabaseUrl === 'https://dcvkeqtirdxmmzupvcmh.supabase.co') {
    console.warn(`Supabase URL is not configured. Please add it to supabaseClient.ts`);
}
if (!supabaseKey || supabaseKey === 'sb_publishable_6s-pX6YD2rbSrxf6fmfeAQ_odl3OpRd') {
    console.warn(`Supabase Key is not configured. Please add it to supabaseClient.ts`);
}


export const supabase = createClient(supabaseUrl, supabaseKey);
