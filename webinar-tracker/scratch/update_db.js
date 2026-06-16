import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://tjcuvjeznkeweewkjjkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const backupPath = 'src/data.json/webinar_data_backup_2026-06-08 (1).json';

async function main() {
  console.log("Reading backup file...");
  const fileData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  const backupSettings = fileData.settings || {};
  const backupEntries = fileData.entries || [];

  console.log("Fetching current DB settings...");
  const { data: dbSettingsList, error: getSettingsError } = await supabase
    .from('webinar_settings')
    .select('*');

  if (getSettingsError) {
    console.error("Error fetching db settings:", getSettingsError);
    return;
  }

  const dbSettings = dbSettingsList[0] || {};
  
  // Merge settings
  const mergeLists = (dbList = [], backupList = []) => {
    const combined = new Set([...dbList, ...backupList]);
    return Array.from(combined).sort();
  };

  const updatedPlanets = mergeLists(dbSettings.planets, backupSettings.planets);
  const updatedSpecialists = mergeLists(dbSettings.specialists, backupSettings.specialists);
  const updatedCreators = mergeLists(dbSettings.creators, backupSettings.creators);
  const updatedMistakes = mergeLists(dbSettings.mistakes, backupSettings.mistakes);

  console.log("Merged settings counts:");
  console.log(`- Planets: ${dbSettings.planets?.length || 0} -> ${updatedPlanets.length}`);
  console.log(`- Specialists: ${dbSettings.specialists?.length || 0} -> ${updatedSpecialists.length}`);
  console.log(`- Creators: ${dbSettings.creators?.length || 0} -> ${updatedCreators.length}`);
  console.log(`- Mistakes: ${dbSettings.mistakes?.length || 0} -> ${updatedMistakes.length}`);

  console.log("Updating webinar_settings in database...");
  const { data: updatedSettingsData, error: updateSettingsError } = await supabase
    .from('webinar_settings')
    .update({
      planets: updatedPlanets,
      specialists: updatedSpecialists,
      creators: updatedCreators,
      mistakes: updatedMistakes
    })
    .eq('id', dbSettings.id || 1)
    .select();

  if (updateSettingsError) {
    console.error("Error updating settings:", updateSettingsError);
  } else {
    console.log("Successfully updated settings in DB!");
  }

  // Double check if any backup entries need to be inserted/upserted
  console.log("Checking entries...");
  const { data: dbEntries, error: getEntriesError } = await supabase
    .from('webinar_entries')
    .select('id');

  if (getEntriesError) {
    console.error("Error fetching db entries:", getEntriesError);
    return;
  }

  const dbEntryIds = new Set(dbEntries.map(e => e.id));
  const missingEntries = backupEntries.filter(e => !dbEntryIds.has(e.id));

  if (missingEntries.length > 0) {
    console.log(`Found ${missingEntries.length} missing entries. Inserting them...`);
    const { error: insertEntriesError } = await supabase
      .from('webinar_entries')
      .insert(missingEntries);

    if (insertEntriesError) {
      console.error("Error inserting missing entries:", insertEntriesError);
    } else {
      console.log(`Successfully inserted ${missingEntries.length} missing entries!`);
    }
  } else {
    console.log("All backup entries are already present in the DB. No entry inserts needed.");
  }
}

main();
