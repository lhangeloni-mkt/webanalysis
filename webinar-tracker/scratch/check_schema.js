import { createClient } from '@supabase/supabase-js';
const supabase = createClient(
  'https://tjcuvjeznkeweewkjjkw.supabase.co',
  'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv'
);

// Read current data
const { data, error } = await supabase.from('webinar_settings').select('mistakes').single();
if (error) { console.error('ERROR:', error); process.exit(1); }

const m = data.mistakes;
console.log('Type:', typeof m, 'IsArray:', Array.isArray(m));
console.log('Length:', m.length);
console.log('Item 0 type:', typeof m[0]);
console.log('Item 0 raw:', m[0]);
if (typeof m[0] === 'string') {
  try {
    const parsed = JSON.parse(m[0]);
    console.log('Item 0 parsed:', parsed);
  } catch(e) {
    console.log('Cannot parse as JSON');
  }
}
