import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://tjcuvjeznkeweewkjjkw.supabase.co',
  'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv'
);

const { data, error } = await supabase.from('webinar_settings').select('mistakes').single();
if (error) { console.error('ERROR:', error.message); process.exit(1); }
const m = data.mistakes;
console.log('Total:', m.length);
console.log('First item:', JSON.stringify(m[0]));
console.log('Type of first item:', typeof m[0]);
console.log('Post count:', m.filter(x => x.type === 'post').length);
