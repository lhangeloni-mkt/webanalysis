import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://tjcuvjeznkeweewkjjkw.supabase.co',
  'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv'
);

const MISTAKES = [
  'Mic Issue', 'Late Start', 'Slide Deck Error', 'Audio Delay',
  'URLs (short/direct), page external title & Page speed -> No marketing terms, avoid capital letters',
  'CTAs in Email and landing pages (copyright, function, and redirect destination)',
  'Countdowns & closing dates in Emails and Landing pages (must be accurate)',
  'Guarantee must be consistent and correct across emails and pages',
  'Checkout (correct offer linked, Card disclaimer text correct)',
  'Prices (follows the requested amount from the Account Manager)',
  'Mobile version (all content must be coherent with Desktop version)',
  'Spelling mistakes in the landing pages and Emails'
];

const USERS = [
  { specialist: 'John Doe', creator: 'monetincelle' },
  { specialist: 'Jane Smith', creator: '9monkeys' },
  { specialist: 'John Doe', creator: 'akangshaspalette' },
  { specialist: 'Jane Smith', creator: 'adamrichesart' },
  { specialist: 'John Doe', creator: 'agatadelbarco' },
  { specialist: 'Jane Smith', creator: 'alemanicia' },
  { specialist: 'John Doe', creator: 'angiebryantart' },
  { specialist: 'Jane Smith', creator: 'anniwoodeco' },
  { specialist: 'John Doe', creator: 'artistjodysteel' },
  { specialist: 'Jane Smith', creator: 'artofalan' }
];

const PLANETS = ['Jupiter', 'Saturn', 'Innovation/LP', 'Mars', 'Uranus'];
const PAGE_TYPES = ['Post Webinar', 'Pre Webinar', 'Moderation', 'Whatsapp'];
const TEST_TAG = 'STRESS_TEST_2026_06_16';

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomMistakes(count) {
  const selected = [];
  for (let i = 0; i < count; i++) {
    selected.push(pickRandom(MISTAKES));
  }
  return selected;
}

let passed = 0, failed = 0, totalTests = 0;

function assert(condition, label) {
  totalTests++;
  if (condition) { passed++; console.log(`  ✓ ${label}`); }
  else { failed++; console.log(`  ✗ ${label}`); }
}

function generateEntry(userIdx, pageType) {
  const user = USERS[userIdx % USERS.length];
  const mistakeCount = Math.floor(Math.random() * 10) + 1; // 1-10
  return {
    date: '2026-06-16',
    planet: pickRandom(PLANETS),
    specialist: user.specialist,
    creator: `${user.creator}_${TEST_TAG}_${pageType}_${userIdx}`,
    mistakes: randomMistakes(mistakeCount)
  };
}

console.log('==============================================');
console.log('  STRESS TEST: 10 CONCURRENT USERS');
console.log('  Testing: Insert, Read, Update, Delete');
console.log('==============================================\n');

// ============ PHASE 1: Concurrent Inserts ============
console.log('--- PHASE 1: 10 users inserting entries concurrently (all 4 page types) ---\n');

const insertPromises = [];
for (let u = 0; u < 10; u++) {
  for (let p = 0; p < PAGE_TYPES.length; p++) {
    const entry = generateEntry(u, PAGE_TYPES[p]);
    insertPromises.push(
      supabase.from('webinar_entries').insert([entry]).select().single()
        .then(res => ({ user: u, pageType: PAGE_TYPES[p], entry, res }))
    );
  }
}

const insertResults = await Promise.all(insertPromises);

let insertsOk = 0, insertsFail = 0;
const insertedIds = [];
for (const r of insertResults) {
  if (r.res.error) {
    insertsFail++;
    console.log(`  ✗ User ${r.user} ${r.pageType}: ${r.res.error.message}`);
  } else {
    insertsOk++;
    insertedIds.push(r.res.data.id);
  }
}
assert(insertsOk === 40, `All 40 entries inserted successfully (${insertsFail} failed)`);
console.log('');

// ============ PHASE 2: Verify all entries in DB ============
console.log('--- PHASE 2: Verify all inserted entries exist ---\n');

const { data: verifyInserts, error: verifyError } = await supabase
  .from('webinar_entries')
  .select('id, date, planet, specialist, creator, mistakes')
  .in('id', insertedIds)
  .order('date', { ascending: false });

assert(!verifyError, 'Read back all entries (no query error)');
assert(verifyInserts.length === 40, `All ${verifyInserts.length}/40 entries present in DB`);

let dataIntegrityOk = 0;
for (const entry of verifyInserts) {
  const required = ['id', 'date', 'planet', 'specialist', 'creator', 'mistakes'];
  let valid = true;
  for (const f of required) { if (!entry[f]) valid = false; }
  if (!Array.isArray(entry.mistakes) || entry.mistakes.length < 1) valid = false;
  if (valid) dataIntegrityOk++;
}
assert(dataIntegrityOk === 40, 'Data integrity check (all fields present and valid)');
console.log('');

// ============ PHASE 3: Test mistake count variations ============
console.log('--- PHASE 3: Mistake count edge cases (1, 3, 5, 10 mistakes) ---\n');

const edgeCases = [
  { count: 1, desc: 'Minimum (1 mistake)' },
  { count: 3, desc: 'Medium (3 mistakes)' },
  { count: 5, desc: 'Test (5 mistakes)' },
  { count: 10, desc: 'Maximum (10 mistakes)' }
];

for (const edge of edgeCases) {
  const { error } = await supabase.from('webinar_entries').insert([{
    date: '2026-06-16',
    planet: 'Mars',
    specialist: 'John Doe',
    creator: `${TEST_TAG}_EDGE_${edge.count}`,
    mistakes: randomMistakes(edge.count)
  }]).select();
  assert(!error, `${edge.desc} — inserted successfully`);
  if (!error) {
    const { data } = await supabase.from('webinar_entries')
      .select('mistakes')
      .eq('creator', `${TEST_TAG}_EDGE_${edge.count}`)
      .single();
    assert(data && data.mistakes.length === edge.count, `${edge.desc} — stored with correct count (${data?.mistakes.length})`);
  }
}
console.log('');

// ============ PHASE 4: Concurrent updates ============
console.log('--- PHASE 4: Update entries concurrently ---\n');

const entriesToUpdate = verifyInserts.slice(0, 10);
const updatePromises = entriesToUpdate.map((entry, i) =>
  supabase.from('webinar_entries')
    .update({
      planet: pickRandom(PLANETS),
      mistakes: randomMistakes((i % 10) + 1)
    })
    .eq('id', entry.id)
    .select()
);

const updateResults = await Promise.all(updatePromises);
let updatesOk = 0, updatesFail = 0;
for (const r of updateResults) {
  if (r.error) updatesFail++;
  else updatesOk++;
}
assert(updatesOk === 10, `10 concurrent updates (${updatesFail} failed)`);
console.log('');

// ============ PHASE 5: Verify updates stuck ============
console.log('--- PHASE 5: Verify updates persisted ---\n');

const { data: updatedEntries, error: readUpdatedError } = await supabase
  .from('webinar_entries')
  .select('id, planet, mistakes')
  .in('id', entriesToUpdate.map(e => e.id))
  .order('date', { ascending: false });

assert(!readUpdatedError, 'Read updated entries without error');
assert(updatedEntries.length === 10, 'All 10 updated entries found');

let updatesVerified = 0;
for (const entry of updatedEntries) {
  if (entry.planet && entry.mistakes.length >= 1) updatesVerified++;
}
assert(updatesVerified === 10, 'All updates have valid data');
console.log('');

// ============ PHASE 6: Delete entries concurrently ============
console.log('--- PHASE 6: Delete entries concurrently ---\n');

const entriesToDelete = verifyInserts.slice(10, 20);
const deletePromises = entriesToDelete.map(entry =>
  supabase.from('webinar_entries').delete().eq('id', entry.id)
);
const deleteResults = await Promise.all(deletePromises);
let deletesOk = 0, deletesFail = 0;
for (const r of deleteResults) {
  if (r.error) deletesFail++;
  else deletesOk++;
}
assert(deletesOk === 10, `10 concurrent deletes (${deletesFail} failed)`);
console.log('');

// Verify deletions
const { data: remaining } = await supabase
  .from('webinar_entries')
  .select('id')
  .in('id', entriesToDelete.map(e => e.id));
assert(remaining.length === 0, 'All deleted entries confirmed gone');
console.log('');

// ============ PHASE 7: Aggregate queries ============
console.log('--- PHASE 7: Aggregate analysis queries ---\n');

const { data: allEntries, error: allError, count } = await supabase
  .from('webinar_entries')
  .select('*', { count: 'exact' });
assert(!allError, 'Full table read without error');
assert(count > 0, `Count returned: ${count} total entries`);

// Group by planet (like the Analysis page does)
const planetCounts = {};
for (const e of allEntries) { planetCounts[e.planet] = (planetCounts[e.planet] || 0) + 1; }
assert(Object.keys(planetCounts).length > 0, 'Planet grouping works');

// Count total mistakes
let totalMistakes = 0;
for (const e of allEntries) totalMistakes += e.mistakes.length;
assert(totalMistakes > 0, `Total mistakes calculated: ${totalMistakes}`);

// Check for empty mistake arrays (should not happen)
const emptyMistakes = allEntries.filter(e => !e.mistakes || e.mistakes.length === 0);
assert(emptyMistakes.length === 0, 'No entries with empty mistakes array');
console.log('');

// ============ CLEANUP ============
console.log('--- CLEANUP: Removing test data ---\n');

const { data: testEntries } = await supabase
  .from('webinar_entries')
  .select('id')
  .like('creator', `%${TEST_TAG}%`);

if (testEntries && testEntries.length > 0) {
  const { error: cleanupError } = await supabase
    .from('webinar_entries')
    .delete()
    .in('id', testEntries.map(e => e.id));
  assert(!cleanupError, `Cleaned up ${testEntries.length} test entries`);
} else {
  assert(true, 'No test entries to clean up');
}

const { count: finalCount } = await supabase
  .from('webinar_entries')
  .select('*', { count: 'exact', head: true });
console.log(`\n  Final DB record count: ${finalCount}`);

// ============ RESULTS ============
console.log('\n==============================================');
console.log('  STRESS TEST RESULTS');
console.log('==============================================');
console.log(`  Total tests: ${totalTests}`);
console.log(`  Passed:      ${passed}`);
console.log(`  Failed:      ${failed}`);
console.log(`  Status:      ${failed === 0 ? '✓ ALL PASSED' : '✗ SOME FAILED'}`);
console.log('==============================================');
