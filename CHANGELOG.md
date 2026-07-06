# Changelog — Caregiver Support Program OS

All notable changes to this prototype are documented here.

## [1.0.0] — 2026-07-06

### Added
- Initial prototype release (frontend only, fictional de-identified demo data in localStorage).
- **Dashboard**: plain-language monthly impact sentence, stat cards (caregivers served, open referrals, follow-ups due, workshops, survey responses, human-review flags, average feedback score, attendance), most-common-needs chart, human-review case list, monthly snapshot, visible prototype scope note.
- **Referral intake form**: case ID auto-suggestion, initials-only field with light validation against contact details, preferred language, care recipient age group, relationship, ten support-need categories, urgency level, follow-up date, notes, required consent checkbox, privacy reminder.
- **Caregiver list**: text search plus status, need, and urgency filters.
- **Caregiver profile panel**: needs checklist, notes timeline with add-note, session history, computed missing-information checklist, generated staff next steps, human-review flag, status and follow-up date updates.
- **Workshop & session tracker**: add form and log with title, topic, date, attendance, language, feedback score, follow-up flag, notes.
- **Survey & feedback dashboard**: average score, response count, confidence before/after, themes, barriers, requested resources, response table.
- **AI assistant panel (demo, no API)**: eight copy-ready Claude prompt templates — summarize notes, identify missing information, draft follow-up message, feedback → themes, monthly narrative, workshop outline, plain-language rewrite, review AI output for risk — each embedding the shared guardrail block.
- **Monthly evaluation report generator**: one-click draft from current data with copy and print, suggested operational improvements, and a limitations section.
- **Documentation & handoff section**: usage rules, prohibited data, privacy/consent guidance, 1-hour training plan, maintenance rhythm, 2-week pilot plan, success metrics.
- **About section**: builder attribution and project framing.
- Reset-demo-data control; responsive layout; print styles for the report; reduced-motion support; visible keyboard focus states.
- `README.md`, `PORTFOLIO_NOTES.md`, single-file HTML build for quick testing.

### Design
- Warm, calm palette (paper background, deep pine primary, sage surfaces; amber reserved for "needs attention," clay for high urgency).
- Type pairing: Bitter (headings) with Public Sans (body) — Public Sans was designed for U.S. public services.

## Planned (not yet built)
- Firebase backend with authentication and role-based access
- Audit log of record edits
- CSV export and funder-ready PDF report layout
- Follow-up reminders and Spanish-language interface
- Organization-approved Claude API integration with human-approval steps
