import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://tjcuvjeznkeweewkjjkw.supabase.co',
  'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv'
);

// Try direct RPC with SQL
const { data, error } = await supabase.rpc('exec_sql', {
  sql: `UPDATE webinar_settings 
        SET mistakes = '[{"label":"test","type":"post"}]'::jsonb 
        WHERE id = 1 
        RETURNING id, mistakes`
});
console.log('RPC result:', JSON.stringify({ data, error }));
