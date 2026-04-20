import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tjcuvjeznkeweewkjjkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv'; // using ANON key as it might have access or not

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const newMistakes = [
  "URLs (short/direct), page external title & Page speed -> No marketing terms, avoid capital letters",
  "CTAs in Emails and landing pages (copyright, function, and redirect destination)",
  "Countdowns & closing dates in Emails and Landing pages (must be accurate)",
  "Guarantee must be consistent and correct across emails and pages",
  "Checkout (correct offer linked, Card disclaimer text correct)",
  "Prices (follows the requested amount from the Account Manager)",
  "Mobile version (all content must be coherent with Desktop version)",
  "Spelling mistakes in the landing pages and Emails",
  "Incorrect currency used in landing pages and emails",
  "Poor syntax & difficulty understanding copy components [On pages and emails]",
  "Incorrect timezones mentioned in Reminder emails, Offer emails and landing pages",
  "Page or Email not finished, missing content, or email fully missing",
  "CTA links within email banner images leading to incorrect pages",
  "Emails with banner images presenting a different course or topic",
  "Emails scheduling timing",
  "Webinar topic (follows the requested narrative from the Account Manager)",
  "Segmentation mistakes (ex. Wrong Webinar form selected in emails)",
  "Incorrect Upsells being sold instead of requested ones",
  "Urgency/Scarcity narrative incorrectly used in pages and emails",
  "WebinarJam Slides & Copywriting + Landing page link (ex. inapplicable urgency discounts)",
  "Timing of the event incorrectly inputted into Webjam",
  "Discounted amounts depicted incorrectly (ex. $100 off instead of $50)",
  "Emails and landing pages should not present seasonal narrative",
  "Design changes on Emails and Checkouts (ex. Thumbnail image is low quality)",
  "Course Content amount (Video Lessons, Hours, exercises) consistent across emails, pages, and offers",
  "Using COLD offers/pages in an ORG webinar | Or mixing COLD A and B (counts as 1 yellow mistake)",
  "Video settings (fully missing or partially missing)",
  "Upsell content mistakes (ex. Upsell copy contradicts course release status)",
  "Spelling mistakes on the FAQ Section of Sales pages",
  "If webinar happens on the weekend, replay email should be automated",
  "Footer (terms and conditions, privacy & policy, copyright, and no faq)",
  "First Quadrant (Header: no spaces, correctly positioned and aligned)",
  "CTA Size",
  "Page Distribution",
  "Timezones (Adding EST instead of EDT)"
];

async function updateDb() {
  console.log("Fetching current settings...");
  const { data, error } = await supabase.from('webinar_settings').select('*').single();
  
  if (error) {
    console.error("Error fetching:");
    console.error(error);
    return;
  }
  
  if (data) {
    console.log("Got settings. Updating mistakes...");
    const currentMistakes = data.mistakes || [];
    const combined = [...currentMistakes];
    for (const m of newMistakes) {
      if (!combined.includes(m)) {
        combined.push(m);
      }
    }
    
    const { error: updateError } = await supabase
      .from('webinar_settings')
      .update({ mistakes: combined })
      .eq('id', data.id || 1);
      
    if (updateError) {
      console.error("Update error:");
      console.error(updateError);
    } else {
      console.log("Successfully updated mistakes in DB!");
    }
  }
}

updateDb();
