# CLAUDE.md — AI GTM Africa

Project documentation and engineering memory for **AI GTM Africa** (`aigtmafrica.xyz`).

---

## 1. Project Overview

**AI GTM Africa** is the flagship 2026 tour bringing African founders, business leaders, growth operators, and product marketers together to apply artificial intelligence to real customer acquisition, sales, and operational business leverage.

- **Production URL:** [https://www.aigtmafrica.xyz](https://www.aigtmafrica.xyz)
- **Vercel Project:** `ai-gtm-africa` (Scope: `sodunketomide-7272s-projects`)
- **GitHub Repository:** [`WilliamsBRAND/ai-gtm-africa`](https://github.com/WilliamsBRAND/ai-gtm-africa)
- **Google Sheets Tracker:** [AI GTM Africa - Registrations](https://docs.google.com/spreadsheets/d/1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0/edit)
  - Spreadsheet ID: `1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0`
  - Active Tab: `Responses`

### 2026 Tour Cities & Dates
| City | Country | Event Date |
|---|---|---|
| **Kigali** | Rwanda | 8 October 2026 |
| **Nairobi** | Kenya | 5 November 2026 (iHub, CcHub, Jahazi Building, 154 James Gichuru Road) |
| **Lagos** | Nigeria | 28 November 2026 |
| **Cotonou** | Benin | 19 December 2026 |
| **Accra** | Ghana | 29 December 2026 |

---

## 2. How the Form & Email Automation Was Discovered and Solved

### The Challenge
When attendees register on the website, we needed to:
1. Append all 10 registration details immediately to the Google Sheet tracker.
2. Send an instant, dynamic confirmation email to the attendee from Tomide's personal Gmail account (`sodunketomide@gmail.com`) using the signature TW dark/crimson HTML template with dynamic First Name, Selected City, and Event Date.
3. Keep the process 100% automated in the cloud without requiring manual script setups or running background jobs on a local machine.

### The Root Cause of the Earlier Bottleneck
- Standard Vercel-to-Google Cloud Workload Identity Federation uses a **Service Account** (`ai-gtm-registration@...`).
- Service accounts can edit Google Sheets easily, but **Google does not allow service accounts to send emails on behalf of a `@gmail.com` user** without Domain-Wide Delegation (which is restricted to Google Workspace corporate domains, not personal Gmail addresses).

### How We Solved It (The Proven Blueprint)
By inspecting Tomide's other working production applications:
1. **`master-ai-like-a-baby` / `ebook-landing-app`:** Stored `GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON` as a secure environment variable on Vercel containing the OAuth `refresh_token`, `client_id`, and `client_secret`.
2. **`Agentic AI Mastery` (`send_ben_peace_jimoh.mjs` & `draft_send_kenneth_amarachi.mjs`):** Used the Google Workspace CLI / Gmail API endpoint (`https://gmail.googleapis.com/gmail/v1/users/me/messages/send`) with base64url RFC 2822 MIME-encoded messages.
3. **Decryption via `gws`:** We used `gws auth export --unmasked` to extract the full unmasked Google Workspace OAuth credentials and deployed them to Vercel's production environment.

### The Live End-to-End Pipeline (`api/register.js`)
When an attendee registers on [aigtmafrica.xyz](https://www.aigtmafrica.xyz):
1. **Frontend:** Submits form payload to `/api/register`.
2. **Token Exchange:** The serverless function exchanges the refresh token directly at `https://oauth2.googleapis.com/token` for an access token with both `spreadsheets` and `gmail.send` scopes.
3. **Google Sheets:** Appends row with columns: `Timestamp`, `Full Name`, `Email`, `Phone`, `City`, `Role`, `Industry`, `Heard`, `Sponsor`, `Status: New`.
4. **Gmail API:** Directly dispatches the branded HTML confirmation email from Tomide's email address using `users/me/messages/send`.
5. **Response:** Returns `{ ok: true }` back to the browser in under 1 second.

---

## 3. Mobile Design System & UI Specifications

The site follows strict design guidelines, especially for mobile viewports (`max-width: 768px`):
- **Hero Section:** Full immersive height (`min-height: 100svh`), background photo covering the full bleed (`object-fit: cover`), dark gradient vignette (`rgba(0,0,0,0.25)` to `rgba(0,0,0,0.92)`), with text layered over the image backdrop.
- **Event Format Stats:** Strictly horizontal 3-column row (`6 HOURS | 50-100 PEOPLE | 5 CITIES`) without vertical stacking borders.
- **Focus Areas:** 2-column tab grid (`64px` height, `13.5px` bold text) and matching `15px` bullet points with SVG arrows, preserving consistent typography with the rest of the page.
- **City & Programme Carousels:** Snapping starts strictly at Index `0` (Kigali / 01 Practical Sessions) on load without awkward half-cuts.
- **Footer:** No raw text emojis. Uses Lucide SVG arrows (`ArrowRight`, `ArrowUpRight`) and official SVG icons in a single horizontal row for **LinkedIn**, **Instagram**, and **X**.
- **Final CTA:** Buttons are positioned side-by-side on mobile:
  - *Register Your Interest:* White background, black text.
  - *Become a Partner:* Black background, white text.

---

## 4. Operational Best Practices & Moving Forward

### Edition responsive corrections 24 October 2026
- Latest CTA correction: all paired hero, gallery, final and venue CTAs on Nairobi and Kigali use equal-width two-column grids and identical 56px heights, never stacked on phones. Allow readable label wrapping inside a button if needed; do not make Register narrower. Venue has only View in Google Maps and Register, no Calendar pair. Gallery CTA wording is See all photos without counts. No time badges or photo-caption/credit overlays on any edition image.
- Kigali attendance correction: Hinda Ruton did not attend; omit from panel, programme and derived marquee. User identified Ntirushwa JeanMarc as the checked-shirt panelist (089), and Mugisha Nehemie as the suited panelist (088). Keep their existing shared panel frame; two panelists, not three.
- Keep the existing combined panelist frame. Tomide explicitly withdrew the individual-panelist-card redesign.
- Speaker rows use the shared SpeakerCarousel: visible arrows, native swipe and keyboard navigation, 4.5-second autoplay, pause control, reduced-motion support and pause during focus/hover.
- Gallery preview figures are flat masonry children. Do not reintroduce display:contents wrappers inside CSS columns; this caused missing/clipped mobile photos.
- Venue View in Google Maps/Register pair remains equal-width and horizontal down to 320px; the extra Calendar pair was removed at Tomide’s request. Nairobi is 5 November, 09:00–12:00 EAT (06:00–09:00 UTC).
- Peter uses the user-supplied 24 October portrait. Vikas replacement is the named CEO East Africa interview photograph: https://www.ceo.co.ug/wp-content/uploads/2025/08/Vikas-Mehta-Resized.jpeg (article: https://www.ceo.co.ug/qa-vikas-mehta-on-agility-innovation-and-reinventing-ogilvy-africa-for-advertisings-next-wave-in-sub-saharan-africa/).
- Kigali event-photo mappings supplied by Tomide: Omolara, female embassy speaker (040); Ugwu, black-shirt keynote (074); Anuoluwa, Kozo speaker holding a phone (116); Tomide in cap (094); Scholastica panel moderator (084); Ben event moderator (030). Do not substitute unrelated stock portraits. Panelist identities not specified by these descriptions remain unchanged.

1. **Monitoring New Registrations:**
   - Check the [Google Sheet Tracker](https://docs.google.com/spreadsheets/d/1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0/edit) regularly.
   - Any new lead will have `Status: New`. You can manually change status to `Contacted`, `Confirmed`, or `VIP` as your outreach progresses.
2. **Handling Changes to City Dates:**
   - If a city date changes, update the `CITY_DATES` object in `api/register.js`, `src/main.jsx`, and `templates/registration-email.html`.
3. **Google OAuth Token Health:**
   - `GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON` on Vercel uses long-lived refresh tokens. If Google auth ever expires, run `gws auth export --unmasked` and update Vercel with `npx vercel env add GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON production`.
4. **Follow-Up Drips / Sequences:**
   - For secondary emails (reminders 1 week before the event, venue announcements, etc.), use the same Gmail API pattern via Node scripts or Vercel cron endpoints.

### Nairobi WhatsApp registration redirect — 25 October 2026
- After a successful /api/register response, Nairobi registrations on both the general-site form and dedicated Nairobi page automatically navigate to https://chat.whatsapp.com/EtILw0pfpZuJyZsCJ7Rpf3 in the same tab. No new button is added.
- Group URL source: src/registration.js. General-site redirect applies only to the Nairobi city selection; other cities retain their success screen.
- The existing API finishes its registration write and email attempts before replying. Failed/invalid submissions never redirect. Email delivery remains the existing best-effort behaviour; this change does not guarantee inbox delivery.
- Verified production build and isolated execution of both real submit handlers with mocked success, failure, invalid, pending and other-city cases. No test registrations or emails were sent.

### Vikas speaker visibility — 26 October 2026
- Vikas Mehta has not accepted the Nairobi invitation. `src/NairobiPage.jsx` sets `VIKAS_CONFIRMED = false`, which displays a neutral "Yet to be confirmed" card, marquee and 10:00 AM programme label while retaining his topic and time.
- His original speaker record and portrait path remain in the source; the portrait file `public/images/speakers/vikas-mehta-professional.jpeg` has not been deleted. When Tomide explicitly confirms Vikas, set `VIKAS_CONFIRMED = true` and deploy. Do not reveal him before that request.


### Nairobi audience size — 28 October 2026
Nairobi is 50–100 people. Keep the Nairobi page, general registration success copy and confirmation email consistent. Other city confirmation ranges remain unchanged. The static email reference uses AudienceSize (Nairobi: 50 to 100; other cities: 20 to 30).

### Registration subject encoding — 30 October 2026
Team alerts containing styled Unicode names were garbled in the subject while the HTML body retained the correct name. Both Gmail API message builders now use `lib/mail-headers.cjs` for RFC 2047 UTF-8 subject encoding, with code-point-safe folding. Keep the original attendee name in the registration record and email body. `node --test tests/mail-headers.test.cjs` covers Unicode, header injection and the mocked registration-to-alert flow; it sends no real mail or registrations. Old sent email subjects are unchanged.

### iHub collaboration — 30 October 2026
At the user's request, the Nairobi hero credits iHub with “In collaboration with” beneath the event facts. `public/images/partners/ihub.png` is the supplied horizontal green-and-black logo (“a CcHUB Company (6)@2x.png”) from William Chesoni's 30 October email in the “Novembr 7th Event at iHUB.” thread. Preserve the supplied colours and CcHUB attribution. Layout checked at 1440px, 375px and 320px without horizontal overflow.

### Second Nairobi keynote replacement — 30 October 2026
The user replaced Vikas's unconfirmed slot with Ms. Muthoni Njoroge. Her supplied title is “5X Award-winning Personal Branding & LinkedIn Expert for Leaders.” The card and 10:00 AM programme now use “Personal Branding & LinkedIn for Leaders” as the session heading; the speaker marquee names her too. Her supplied photo `1793294112408.jpeg` is stored at `public/images/speakers/muthoni-njoroge.jpeg` and framed with a dedicated CSS headshot crop. This supersedes the earlier Vikas visibility instruction; do not restore his slot.

### Corrected Nairobi programme — 30 October 2026
The user clarified: FOUR keynote speakers (Esther, Håvar, Dr Liz, Ms. Muthoni); Tomide is NOT a keynote speaker. He leads a separate 20-minute fireside chat on “Building Go-to-Market Strategies for African Markets with AI” immediately before the existing 25-minute panel. Do not merge or replace the panel. Håvar is second and Ms. Muthoni is the last keynote (superseding the earlier Dr Liz-last instruction). Tomide's portfolio portrait remains on his fireside-chat section and panel profile.

Final programme (EAT): 09:00 check-in; 09:10 welcome; 09:30 Esther (30m); 10:00 Håvar (30m); 10:30 Tomide fireside chat (20m); 10:50 panel (25m, existing topic and Jasmine/Peter/Tomide participants); 11:15 Dr Liz (30m); 11:45 Ms. Muthoni (30m); 12:15 Tomide vote of thanks (5m); 12:20 group photos and networking. Supersedes the mistakenly deployed five-keynote/merged-panel programme. No speaker emails sent.

### Individual panelist cards — 30 October 2026
The user explicitly superseded the earlier combined-panel-frame instruction: Jasmine Gathoga and Peter Maina Njoroge now have individual cards in the same carousel/frame as keynote speakers, each labelled Panelist · 25 mins and showing the shared topic “When AI Can Do Almost Everything, What Makes You Stand Out?”. Remove the old combined panel block. Tomide no longer participates in the panel and is removed from its programme entry; retain his separate 20-minute fireside chat, welcome and vote of thanks. The 10:50 panel and all programme times stay unchanged. Attached Nairobi logo uploaded as “AI GTM Africa - Nairobi Logo.png” to Drive Sponsors and Partners folder `1IVZK2je7Cn4ng7e50XJ2aDuYG6RclHbx`, file `1v-7ebvAtCiKcXS-PDXZJJ0KIk_kMGwVp`.

### Speaker-frame correction — 30 October 2026
The section heading is “Who you’ll learn from.” Tomide's portfolio portrait MUST appear as a full card in the SAME carousel as speakers/panelists, after Håvar, labelled “Fireside chat · 20 mins” with the GTM topic. Do not put him in a separate small circular portrait block or label him a keynote/panelist. Removed the former standalone fireside block. Programme unchanged.

### Muthoni talk-topic correction — 30 October 2026
The user supplied her session topic: “Becoming a Business Leader the Market Can’t Ignore in the Age of AI”. Use this on her speaker card and 11:45 AM programme entry (maximum 30 minutes). Her professional title remains “5X Award-winning Personal Branding & LinkedIn Expert for Leaders.” The earlier “Personal Branding & LinkedIn for Leaders” talk heading was an incorrect inference and must not be restored.

### Arrivals and kickoff correction — 30 October 2026
User specified 08:00 arrivals/check-in, 08:30 red carpet, 09:00 event kickoff. The programme now opens with those three entries; the first keynote remains 09:30 and all later sessions remain unchanged. Hero, registration modal, duration summary and venue information show arrivals from 08:00 EAT and photos/networking from 12:20. This supersedes the earlier 09:00 check-in / 09:10 welcome entries.

### Panel moderator — 30 October 2026
User supplied Raphail John, Co-founder, Investspring, as panel moderator. His individual card immediately precedes Jasmine and Peter in the speaker carousel, labelled Panel moderator · 25 mins with the same panel topic. Programme panel entry identifies him as moderator; times unchanged. Supplied Downloads/3163221.jpg copied to public/images/speakers/raphail-john.jpg and framed tightly around face/shoulders with dedicated CSS to exclude the large top/bottom bands.

### Volunteer applications — 31 October 2026
Simple Nairobi-branded form: `/volunteer`, also selected by hostname `volunteer.*`. `src/volunteer-options.json` owns city-edition and 15 role dropdowns. `api/volunteer.js` validates fields/consent, rejects unknown editions/roles, uses RAW Sheet writes and honeypot, and saves only to the new `Volunteers` tab in existing spreadsheet `1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0`. Fields: timestamp, name, email, WhatsApp, location, edition, role, availability, optional experience/portfolio, consent, New status. No applicant emails are sent. Uses existing Google OAuth or Vercel workload-identity fallback via `lib/volunteer-google-auth.cjs` (existing attendee API unchanged). Volunteer success is an application acknowledgement, not acceptance.

Production form deployed at https://www.aigtm.africa/volunteer . Live save/readback verified; unique disposable test row removed. Responsive checks 1440/375/320, mocked retry/success UI and backend validation/save tests passed. Domain `volunteer.aigtm.africa` added to this Vercel project but DNS was NXDOMAIN at deployment. User asked to add Namecheap CNAME host `volunteer` -> `1af036d53e648a50.vercel-dns-017.com` (same target as Nairobi); DNS completion still requires verification. Do not claim subdomain live until DNS/HTTPS checks pass.

User added the DNS record on 31 October 2026. Google and Cloudflare DNS now resolve the correct CNAME. Verified HTTPS 200 with valid certificate and the volunteer form/15 roles on https://volunteer.aigtm.africa/ using fresh public DNS (local negative cache briefly persisted). Subdomain is live.

### Volunteer WhatsApp redirect — 31 October 2026
After a successful saved volunteer application, redirect in the same tab to the user-supplied group https://chat.whatsapp.com/B7b5Nzaxm8X0AYr9fjS1F2?s=cl&p=a&iam=2 . Failed submissions retain the form and never redirect. The saved-success screen has a manual Join the WhatsApp group fallback link. This volunteer group is separate from the Nairobi attendee group.

### Volunteer form wording — 31 October 2026
Replace optional Experience or portfolio with required “Why join us?”: ask why the applicant wants to volunteer/should be considered and invite a previous-event volunteering link if available. Keep storage key `experience`/existing sheet column for compatibility. Availability options are “Planning and event day”, “Event day only”, “Let’s discuss”.

### Panelist update — 31 October 2026
User replaced Peter Maina Njoroge's portrait with the supplied smiling-beanie photo (`public/images/speakers/peter-maina-njoroge.jpeg`, CSS `is-peter-headshot`) and added Michael Simba, Founding Growth & GTM Marketing Lead, Helicode, as a third panelist (`public/images/speakers/michael-simba.webp`, CSS `is-simba-headshot`). He has an individual Panelist · 25 mins card after Peter, appears in the 10:50 AM programme entry and in the marquee. Panel time and moderator unchanged. Deployed to production with `vercel deploy --prod`; live image URLs and bundle verified.
