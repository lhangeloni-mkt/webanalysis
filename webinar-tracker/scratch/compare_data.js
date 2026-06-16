import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://tjcuvjeznkeweewkjjkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const backupPath = 'src/data.json/webinar_data_backup_2026-06-08 (1).json';

async function compare() {
  const fileData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  const backupEntries = fileData.entries || [];
  const backupSettings = fileData.settings || {};

  console.log(`Backup file has ${backupEntries.length} entries.`);
  
  // Fetch all DB entries
  const { data: dbEntries, error: entriesError } = await supabase
    .from('webinar_entries')
    .select('*');
    
  if (entriesError) {
    console.error("Error fetching db entries:", entriesError);
    return;
  }
  
  console.log(`DB has ${dbEntries.length} entries.`);

  // Let's see how many backup entries already exist in DB by ID
  const dbEntryIds = new Set(dbEntries.map(e => e.id));
  let existingCount = 0;
  let missingCount = 0;
  for (const entry of backupEntries) {
    if (dbEntryIds.has(entry.id)) {
      existingCount++;
    } else {
      missingCount++;
    }
  }
  console.log(`Backup entries: ${existingCount} already exist in DB, ${missingCount} are new.`);

  // Fetch db settings
  const { data: dbSettingsList, error: settingsError } = await supabase
    .from('webinar_settings')
    .select('*');
    
  if (settingsError) {
    console.error("Error fetching db settings:", settingsError);
    return;
  }
  
  const dbSettings = dbSettingsList[0] || {};
  console.log("Planets in DB:", dbSettings.planets?.length, "vs Backup:", backupSettings.planets?.length);
  console.log("Specialists in DB:", dbSettings.specialists?.length, "vs Backup:", backupSettings.specialists?.length);
  console.log("Creators in DB:", dbSettings.creators?.length, "vs Backup:", backupSettings.creators?.length);
  console.log("Mistakes in DB:", dbSettings.mistakes?.length, "vs Backup:", backupSettings.mistakes?.length);
}

compare();
