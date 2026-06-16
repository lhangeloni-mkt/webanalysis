const newMistakes = [
  { label: 'Webinar POST delivered after deadline (If delivered after deadline , rating is automatically 3/5 or lower)', type: 'post' },
  { label: 'URLs (short/direct) & page external title and Page speed -> No marketing terms , avoid using capital letters', type: 'post' },
  { label: 'CTAs in both Emails and landing pages (copyright and function-> where does it redirect)', type: 'post' },
  { label: 'Countdowns , closing dates both Emails and Landing pages (ex. "Registrations close on Sunday 15th of March at 9PM EDT , this is incorrect)', type: 'post' },
  { label: 'Guarantee should be consistent and correct across both emails and pages', type: 'post' },
  { label: 'Checkout (correct offer linked, Card disclaimer text correct)', type: 'post' },
  { label: 'Prices (Pricing is following the requested amount from the Account Manager)', type: 'post' },
  { label: 'Mobile version (all content is coherent with Desktop version)', type: 'post' },
  { label: 'Spelling mistakes in the landing pages and Emails', type: 'post' },
  { label: 'Incorrect currency used in landing pages and emails', type: 'post' },
  { label: 'Incorrect timezones mentioned in Reminder emails, Offer emails and in the landing pages', type: 'post' },
  { label: 'Page or Email not finished, missing content or email fully missing', type: 'post' },
  { label: 'CTA links within email banner images that lead to incorrect pages', type: 'post' },
  { label: 'Emails with banner images that present a different course or a different topic would be incorrect', type: 'post' },
  { label: 'Emails scheduling timing (If timing greater than 2-3 hours)', type: 'post' },
  { label: 'Emails with banner images that have an incorrect page linked within the image', type: 'post' },
  { label: 'Webinar topic (Webinar topic is following the requested narrative from the Account Manager)', type: 'post' },
  { label: 'Segmentation mistakes (e.x Wrong Webinar form selected in emails)', type: 'post' },
  { label: 'Incorrect Upsells being sold instead of requested ones', type: 'post' },
  { label: 'Urgency/Scarcity narrative incorrectly used in pages and emails', type: 'post' },
  { label: 'WebinarJam Slides and WebinarJam Copywriting + Landing page link (ex. copywriting mentions an urgency discount when it does not apply)', type: 'post' },
  { label: 'Timing of the event incorrectly inputted into Webjam', type: 'post' },
  { label: 'Discounted amounts depicted incorrectly (100$ off instead of 50$)', type: 'post' },
  { label: 'Emails and landing pages should not presenting seasonal narrative', type: 'post' },
  { label: 'Design changes on Emails and Checkouts (ex. Thumbnail image is low quality image)', type: 'post' },
  { label: 'Amount of Video Lessons , Hours of Content and excercises (Course Content) , should be consistent across all emails , sales pages and offers', type: 'post' },
  { label: 'Using COLD offers and pages in an ORG webinar is incorrect | Or using COLD A in one offer and COLD B in another offer (Even if this is done multiple times , it counts as 1 yellow mistake)', type: 'post' },
  { label: 'Video settings (fully missing or partially missing)', type: 'post' },
  { label: 'Upsell content mistakes (ex. Course has been released but the upsell copy suggests the opposite, or the other way around)', type: 'post' },
  { label: 'Spelling mistakes on the FAQ Section of Sales pages', type: 'post' },
  { label: 'If webinar happens on the weekend , replay email should be automated', type: 'post' },
  { label: 'Footer (terms and conditions, privacy & policy, copyright, and no faq)', type: 'post' },
  { label: 'First Quadrant (Header: no spaces, correctly positioned and aligned)', type: 'post' },
  { label: 'CTA Size', type: 'post' },
  { label: 'Page Distribution', type: 'post' },
  { label: 'Timezones (Adding EST instead of EDT)', type: 'post' },
  { label: 'URLs (short/direct) & page external title and Page speed', type: 'pre' },
  { label: 'CTAs in both Emails and landing pages (copywriting and function-> where does it redirect)', type: 'pre' },
  { label: 'Countdowns , timezones (Mentioning EST instead of CET)', type: 'pre' },
  { label: 'Date of webinar presented incorrectly (ex. Wednesday 12th 9PM , instead of Friday 9th 1PM)', type: 'pre' },
  { label: 'Spelling mistakes in the landing pages and Emails', type: 'pre' },
  { label: 'Poor syntax & difficulty in understanding some copy components [On pages and emails]', type: 'pre' },
  { label: 'Incorrect timezones mentioned in Invitation emails , confirmation emails', type: 'pre' },
  { label: 'Copywriting within the registration page or thank you page that mentions a different creator or course (ex. Irish language found in Watercolor workshops , or Irish with Mollie mentioned in a different creators webinar)', type: 'pre' },
  { label: 'Page or email not finished or missing content', type: 'pre' },
  { label: 'Mobile version (all content is coherent with Desktop version)', type: 'pre' },
  { label: 'Emails with banner images that present a different course or a different topic would be incorrect', type: 'pre' },
  { label: 'Emails scheduling timing (Invitation emails or Confirmation email)', type: 'pre' },
  { label: 'Webinar topic (Webinar topic is following the requested narrative from the Account Manager)', type: 'pre' },
  { label: 'Segmentation mistakes (e.x Wrong Webinar form selected in invitation emails)', type: 'pre' },
  { label: 'Timing of the event incorrectly inputted into Webjam', type: 'pre' },
  { label: 'Confirmation email incorrectly set up or there is incorrect copywriting', type: 'pre' },
  { label: 'Forms being incorrectly added into registration pages', type: 'pre' },
  { label: 'Invitation emails correctly set up and scheduled', type: 'pre' },
  { label: 'Forms redirecting to incorrect thank you pages', type: 'pre' },
  { label: 'Forms should always be a "Single opt-in"', type: 'pre' },
  { label: 'No two step opt in forms being included in CTAs of Registration pages', type: 'pre' },
  { label: 'Multiple impactful design changes needed in pages and emails (if overall visual appearance of reg page is not desirable)', type: 'pre' },
  { label: 'Invitation emails left unscheduled', type: 'pre' },
  { label: "Webinar Jam incorrectly set up (Creator's images , backgrounds , topic)", type: 'pre' },
  { label: 'Minor design changes in pages and emails (ex. Thumbnail image is low quality image and it has to be updated)', type: 'pre' },
  { label: 'Inside of the Calendar, invitation links are missing (ex. Live event link or group chat link missing from Calendar even invitation)', type: 'pre' },
  { label: 'Minor Webinar jam waiting room design changes (Background image low quality)', type: 'pre' },
  { label: 'Footer (terms and conditions, privacy & policy, copyright, and no faq)', type: 'pre' },
  { label: 'CTA Size', type: 'pre' },
  { label: 'Page Distribution', type: 'pre' },
  { label: 'Timezones (Adding EST instead of EDT)', type: 'pre' },
  { label: 'No Show - Track and log no-show events', type: 'mod' },
  { label: 'Communicate Errors - AM', type: 'mod' },
  { label: 'Communicate Errors - WS', type: 'mod' },
  { label: 'Not sharing the offer during moderation', type: 'mod' },
  { label: 'Sharing wrong links', type: 'whatsapp' },
  { label: 'Miscommunication within group chat', type: 'whatsapp' }
];

const url = 'https://tjcuvjeznkeweewkjjkw.supabase.co/rest/v1/webinar_settings?id=eq.1';
const response = await fetch(url, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv',
    'Authorization': 'Bearer sb_publishable_cuZaaDoyp_NMomudOPys5w_DkO8WtAv',
    'Prefer': 'return=representation'
  },
  body: JSON.stringify({ mistakes: newMistakes })
});

if (!response.ok) {
  console.error('PATCH ERROR:', response.status, await response.text());
  process.exit(1);
}

const data = await response.json();
console.log('Updated. Got', data.length, 'rows back');
const m = data[0].mistakes;
console.log('Total mistakes:', m.length);
console.log('First item type:', typeof m[0]);
console.log('First item:', JSON.stringify(m[0]));
console.log('Post count:', m.filter(x => x.type === 'post').length);
console.log('Pre count:', m.filter(x => x.type === 'pre').length);
console.log('Mod count:', m.filter(x => x.type === 'mod').length);
console.log('Whatsapp count:', m.filter(x => x.type === 'whatsapp').length);
