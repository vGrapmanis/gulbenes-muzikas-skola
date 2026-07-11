# Prompt: Generate the privacy policy (Privātuma politika)

Use this to generate a GDPR-compliant privacy policy for the site. **Output must be
in Latvian** and published at `/privatuma-politika`.

## Task

Generate a clear, plain-Latvian privacy policy for the Gulbenes Mūzikas skola
website. It must reflect what this site actually does — do not invent processing
that doesn't happen.

## Facts about this site (use these; confirm blanks with the school)

- **Pārzinis (controller):** Gulbenes Mūzikas skola, O. Kalpaka iela 43, Gulbene,
  Gulbenes novads, LV-4401. Founder: Gulbenes novada pašvaldība. Confirm the exact
  legal controller and a contact email/phone.
- **Hosting / processors:** Cloudflare (Workers + R2, content delivery),
  Supabase (database + authentication, EU/Frankfurt region). Both are data
  processors; data is hosted in the EU/EEA where configured.
- **What's processed:**
  - Public visitors: minimal. Standard server/CDN logs (IP, request metadata) for
    security and operation; essential cookies only by default.
  - Cookies: an essential consent-preference cookie; **no non-essential/tracking
    cookies load before consent**. State whether any analytics is used (prefer a
    privacy-respecting, cookieless option) and gate it on consent.
  - Admin: a single staff login (email + password) via Supabase Auth, for content
    management only.
  - Content: photos/posters/documents the school publishes may contain personal
    data of students/staff — published lawfully by the school; include how someone
    can request removal.
- **No public contact form** on this site (Kontakti has none). If the school
  collects data elsewhere, that's out of scope here — say so.

## Must include (GDPR)

1. Identity & contact of the controller (and DPO if one exists).
2. What personal data is processed and for what **purposes** + **legal basis**.
3. Cookies/consent and how to change the choice.
4. Recipients/processors (Cloudflare, Supabase) and any transfers + safeguards.
5. **Retention** periods (or criteria).
6. Data-subject **rights** (access, rectification, erasure, restriction,
   objection, portability where applicable) and how to exercise them.
7. Right to lodge a complaint with **Datu valsts inspekcija** (Latvia's DPA).
8. How to request removal of a photo/personal data from published content.
9. Last-updated date and how changes are communicated.

## Style

- Plain Latvian, short sentences, headings, scannable. Avoid legalese where a clear
  word works. Accurate, not boilerplate.

## After generating

- Flag every placeholder the school must fill (controller contact, retention
  periods, whether analytics is used).
- **State that this is a draft for legal review**, not legal advice; the school
  should have it checked before publishing.
- Add a matching short cookie-banner copy (Latvian) consistent with the policy.
