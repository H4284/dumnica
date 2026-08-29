# Dumnica — Handover

Copy this document into the ClickUp Doc **Dumnica — Handover**. Do not change DNS until MX records are written down.

## Before launch (P10.4)

1. Export current MX records for `dumnicagroup.com` and keep a screenshot.
2. Point the domain to Vercel only after MX is documented. SSL padlock must show on `https://dumnicagroup.com`.
3. Test sending and receiving email on the client mailbox.
4. Submit `https://dumnicagroup.com/sitemap.xml` in Google Search Console on launch morning (weekday, not Friday afternoon).
5. Tell the client: Google rankings can drop for 2–4 weeks after a rebuild. That is expected.

Hash URLs (`#/afarizmi`, `#/projektet`, …) are handled in the browser on the homepage. WordPress path `/veranda-27/` 301s to `/projects`. Remaining WordPress URLs must come from Search Console — do not guess.

## Training video (Albanian) — record and send

Show only the tasks the client will do in Sanity Studio (`/studio`):

1. Add a project (title, city, photos, description).
2. Add apartments / units (code, rooms, area, floor, status, price).
3. Mark an apartment as sold (`status` → sold / `i_shitur`).
4. Change contact details (phone, WhatsApp, email, address) in Site settings.
5. Upload photos (project gallery, facade, floor plans).

Acceptance: the client marks one apartment as sold **alone**. If they cannot, improve the Studio labels — it is not their fault.

## Live session

The client does each task above. Watch only. Where they struggle, fix the CMS field titles/descriptions.

## Accounts and ownership

Move Vercel and Sanity to the **client’s ownership**. Keep the agency as team members.

| Service | What it is for | Who should own it | Monthly cost |
| --- | --- | --- | --- |
| Domain registrar (dumnicagroup.com) | Domain + DNS / MX | Client | Registrar invoice |
| Vercel | Hosting, SSL, Speed Insights | Client (agency as member) | Vercel plan on dashboard |
| Sanity | CMS (projects, units, site settings) | Client (agency as member) | Sanity plan on dashboard |
| Resend | Contact / lead emails | Client | Resend plan on dashboard |
| Upstash Redis | Form rate limit | Client | Upstash plan on dashboard |
| Cloudflare Turnstile | Spam protection on forms | Client | Usually free |
| Google Analytics 4 | Traffic and events after cookie consent | Client | Free |
| Meta Pixel | Ads measurement after cookie consent | Client | Free |
| Google Search Console | Sitemap and coverage | Client | Free |
| Google Sheets / Airtable | Lead backup and `/report` | Client | Provider invoice |

Fill exact euro amounts from each provider dashboard before sending this to the client.

## Monthly support offer (send to the client)

Proposed monthly retainer covering:

- Dependency and security updates
- Uptime / form / email monitoring
- Content help (projects, apartments, photos)
- Small feature and bug fixes

Price: set commercially before sending. This is the offer text, not a signed contract.

## Two weeks after launch (P10.1)

Check Vercel Speed Insights (real users, mobile). Target: Performance 90+, CLS under 0.1. Watch Search Console coverage for two weeks.
