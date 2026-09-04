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
| **Kigali** | Rwanda | 10 October 2026 |
| **Nairobi** | Kenya | 30 October 2026 |
| **Lagos** | Nigeria | 21 November 2026 |
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
- **Event Format Stats:** Strictly horizontal 3-column row (`6 HOURS | 20-30 PEOPLE | 5 CITIES`) without vertical stacking borders.
- **Focus Areas:** 2-column tab grid (`64px` height, `13.5px` bold text) and matching `15px` bullet points with SVG arrows, preserving consistent typography with the rest of the page.
- **City & Programme Carousels:** Snapping starts strictly at Index `0` (Kigali / 01 Practical Sessions) on load without awkward half-cuts.
- **Footer:** No raw text emojis. Uses Lucide SVG arrows (`ArrowRight`, `ArrowUpRight`) and official SVG icons in a single horizontal row for **LinkedIn**, **Instagram**, and **X**.
- **Final CTA:** Buttons are positioned side-by-side on mobile:
  - *Register Your Interest:* White background, black text.
  - *Become a Partner:* Black background, white text.

---

## 4. Operational Best Practices & Moving Forward

1. **Monitoring New Registrations:**
   - Check the [Google Sheet Tracker](https://docs.google.com/spreadsheets/d/1Ydfb1xoTXM45MDNA3OQf5PGgS8kTjnZF7JnNC3HLT_0/edit) regularly.
   - Any new lead will have `Status: New`. You can manually change status to `Contacted`, `Confirmed`, or `VIP` as your outreach progresses.
2. **Handling Changes to City Dates:**
   - If a city date changes, update the `CITY_DATES` object in `api/register.js`, `src/main.jsx`, and `templates/registration-email.html`.
3. **Google OAuth Token Health:**
   - `GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON` on Vercel uses long-lived refresh tokens. If Google auth ever expires, run `gws auth export --unmasked` and update Vercel with `npx vercel env add GOOGLE_WORKSPACE_CLI_CREDENTIALS_JSON production`.
4. **Follow-Up Drips / Sequences:**
   - For secondary emails (reminders 1 week before the event, venue announcements, etc.), use the same Gmail API pattern via Node scripts or Vercel cron endpoints.
