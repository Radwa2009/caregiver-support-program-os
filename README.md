# Caregiver Support Program OS

A frontend web app prototype that helps nonprofit and public health teams manage caregiver support referrals, track needs, organize workshops and advance care planning conversations, collect feedback, and generate monthly evaluation reports — with responsible AI use built into the workflow.

**Live demo:** deploy with GitHub Pages (instructions below). All data is fictional and de-identified.

---

## The problem

Caregiver support programs often manage referrals, needs assessments, workshops, follow-ups, and survey feedback across scattered notes, spreadsheets, and emails. That makes three basic questions hard to answer:

1. Who needs follow-up right now?
2. What do caregivers actually need most?
3. Is the program working — and how do we show that to leadership and funders?

Coordinators end up rebuilding the same monthly report by hand, high-need caregivers can slip through the cracks, and institutional knowledge lives in one person's inbox.

## Why I built this

During my public health practicum with Comfort Homesake, I worked on program development and evaluation for caregivers, older adults, and individuals needing care coordination. I saw firsthand how much coordinator time goes into tracking and reporting instead of supporting people. This prototype is my answer to that gap: one calm workspace where intake, follow-up, workshops, feedback, and reporting live together — designed for non-technical staff, with AI used only where it's safe.

## Target users

- Public health program coordinators
- Nonprofit caregiver support staff
- Community health workers and volunteers
- Program evaluators
- Leadership reviewing monthly impact

## What I built

A single-page web app (HTML, CSS, vanilla JavaScript, localStorage) with nine connected sections:

| Section | What it does |
|---|---|
| **Dashboard** | Plain-language monthly impact sentence, key stats, most common needs, human-review flags, monthly snapshot |
| **Referral intake** | De-identified intake form with consent requirement, privacy reminder, and light validation against identifying data |
| **Caregiver list** | Search plus filters by status, need, and urgency |
| **Caregiver profile** | Needs checklist, notes timeline, session history, missing-information checklist, staff next steps, human-review reminder, status updates |
| **Workshop tracker** | Title, topic, date, attendance, language, feedback score, follow-up flag |
| **Survey & feedback** | Average score, themes, barriers, requested resources, confidence before/after |
| **AI assistant (demo)** | Eight copy-ready Claude prompt templates, each with built-in guardrails — no API calls |
| **Monthly report generator** | One-click draft report from current data, with copy and print, framed as a draft for human review |
| **Documentation & handoff** | Usage rules, data-entry restrictions, privacy guidelines, new-staff training plan, maintenance rhythm, 2-week pilot plan, success metrics |

## Key features

- **Human review is a first-class concept.** High-urgency cases and flagged notes surface an amber "Human review" flag everywhere they appear. The tool points a trained person at a file; it never decides.
- **Privacy by design, even in a demo.** Case IDs and initials only, consent required to save, a privacy reminder in the form, and validation that rejects contact-detail patterns in the initials field.
- **A plain-language impact sentence** at the top of the dashboard, auto-written from the data — because leadership reads sentences, not tables.
- **Missing-information checklists** computed per caregiver, so incomplete intakes become visible work rather than silent gaps.
- **Documentation lives inside the app**, so the tool can be handed off and outlive any single staff member.

## Role of Claude

I built this prototype with Claude as a product-thinking and coding partner. I designed the workflow based on public health, caregiver support, and nonprofit program evaluation experience; Claude helped me pressure-test the product decisions and write the frontend code. The AI assistant panel in the app reflects the same philosophy: AI drafts, summarizes, and organizes — trained humans review, edit, and decide.

## Responsible AI and privacy approach

This tool must not make medical, legal, financial, or eligibility decisions, and it is built so it can't be quietly used that way:

- Every AI prompt template embeds the same guardrail block: de-identified data only; no medical/legal/financial/eligibility decisions; don't invent facts; flag uncertainty; final decisions stay with trained humans; verify translations before sending.
- One template exists specifically to **review AI output for risk** before anything reaches a caregiver.
- The report generator labels its output as a draft for coordinator review and states its limitations.
- I would keep medical, legal, financial, eligibility, and service decisions with trained humans in every version of this tool, prototype or production.

## Prototype scope

This is a frontend demo using fictional, de-identified data stored in the browser's localStorage. A production version would require an approved backend, authentication, role-based access, audit logs, organization-approved privacy policies, staff training, and clinical/legal review where appropriate. The data layer is isolated in `js/data.js` (a single `loadState`/`saveState` pair), so connecting Firebase later means replacing two functions, not rewriting the app.

## Pilot plan (2 weeks)

1. **Week 0:** choose 2–3 staff testers, agree on de-identification rules, reset demo data.
2. **Week 1:** double-enter all new referrals and one workshop alongside the current process.
3. **Week 2:** run the daily morning check-in from the dashboard; draft one follow-up message with an AI template plus staff review.
4. **Close-out:** 30-minute debrief and a go/no-go decision on a production build.

## Success metrics

- 100% of pilot referrals logged with documented consent and zero identifying data entered
- "Who needs follow-up today?" answerable in under 2 minutes
- Monthly report drafted in under 30 minutes (versus a multi-hour manual process)
- Every AI-drafted message shows human editing before send
- Staff confidence with the tool rated 4+/5 at debrief

## What I learned

- Workflow design matters more than features: the hardest part was deciding what *not* to store, and making "human review" visible rather than implied.
- Non-technical usability is a design constraint, not a polish step — labels, empty states, and error messages carry the training load.
- Writing the guardrails into the prompts themselves is more durable than writing them into a policy document nobody opens.

## What I would improve next

- Firebase backend with authentication and role-based access (coordinator vs. volunteer views)
- Audit log of edits to case records
- CSV export for evaluators and a funder-ready PDF report layout
- Reminder scheduling for follow-ups, and a Spanish-language interface
- Real (organization-approved) Claude API integration behind the AI panel, with logging and human-approval steps

## How this connects to Claude Corps

The fellowship values people who can enter mission-driven organizations, understand messy workflows, build practical AI-assisted tools, train non-technical staff, and leave behind sustainable systems. This project maps directly: the intake/dashboard flow comes from understanding a real messy workflow; the AI panel demonstrates safe, practical AI adoption; and the in-app documentation, training plan, and pilot plan are the "leave behind a sustainable system" part — written so the tool works after I'm gone.

## Interview-ready explanation

> "Caregiver support programs run on scattered spreadsheets and emails, so coordinators can't quickly see who needs follow-up or prove impact to funders. I built a prototype workspace that brings intake, follow-up, workshops, feedback, and monthly reporting into one place, designed for non-technical staff. I built it with Claude as a product-thinking and coding partner, and the AI features are deliberately scoped: AI summarizes, drafts, and finds gaps — trained humans make every medical, legal, financial, eligibility, and service decision. It ships with in-app documentation, a training plan, and a 2-week pilot plan, because a tool a nonprofit can't sustain isn't a tool."

---

## Running it locally

No build step. Open `index.html` in a browser, or run a simple server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

`caregiver-support-os-single-file.html` is a standalone version of the same app in one file for quick testing.

## Deploying on GitHub Pages

1. Create a new GitHub repository (e.g., `caregiver-support-os`).
2. Push the project files (keep `index.html` at the repository root):
   ```bash
   git init
   git add .
   git commit -m "Caregiver Support Program OS prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/caregiver-support-os.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**, choose branch **main** and folder **/(root)**, and save.
5. Wait a minute or two, then visit `https://YOUR-USERNAME.github.io/caregiver-support-os/`.
6. Add that URL to the repository description and your portfolio.

---

Built by **Radwa Gebreil** — Public Health & Nonprofit AI Workflow Builder · MPH, UC Berkeley · BA Communication, UC Davis. Designed as a Claude Corps portfolio project. All data in this demo is fictional.
