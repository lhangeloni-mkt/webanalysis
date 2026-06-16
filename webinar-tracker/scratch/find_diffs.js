import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://tjcuvjeznkeweewkjjkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const backupPath = 'src/data.json/webinar_data_backup_2026-06-08 (1).json';

async function main() {
  const fileData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  const backupSettings = fileData.settings || {};

  const { data: dbSettingsList } = await supabase
    .from('webinar_settings')
    .select('*');
  
  const dbSettings = dbSettingsList[0] || {};
  
  const missingSpecialists = (backupSettings.specialists || []).filter(s => !(dbSettings.specialists || []).includes(s));
  const missingCreators = (backupSettings.creators || []).filter(c => !(dbSettings.creators || []).includes(c));

  console.log("Missing Specialists in DB:", JSON.stringify(missingSpecialists, null, 2));
  console.log("Number of Missing Creators in DB:", missingCreators.length);
  console.log("First 10 missing creators:", JSON.stringify(missingCreators.slice(0, 10), null, 2));
}

main();
