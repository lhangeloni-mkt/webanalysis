import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tjcuvjeznkeweewkjjkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
  console.log("--- FETCHING WEBINAR_SETTINGS ---");
  const { data: settings, error: settingsErr } = await supabase.from('webinar_settings').select('*');
  console.log("Settings:", JSON.stringify(settings, null, 2));
  if (settingsErr) console.error("Settings error:", settingsErr);

  console.log("--- FETCHING WEBINAR_SECURITY ---");
  const { data: security, error: securityErr } = await supabase.from('webinar_security').select('*');
  console.log("Security:", JSON.stringify(security, null, 2));
  if (securityErr) console.error("Security error:", securityErr);

  console.log("--- FETCHING WEBINAR_ENTRIES (LIMIT 5) ---");
  const { data: entries, error: entriesErr } = await supabase.from('webinar_entries').select('*').limit(5);
  console.log("Entries:", JSON.stringify(entries, null, 2));
  if (entriesErr) console.error("Entries error:", entriesErr);
}

main();
