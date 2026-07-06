# Portfolio Notes — Caregiver Support Program OS

Working notes for presenting this project in the Claude Corps application, interviews, and on LinkedIn.

---

## Short portfolio description (for portfolio site / application)

**Caregiver Support Program OS** — A web app prototype that gives nonprofit and public health caregiver programs one calm workspace for referrals, follow-ups, workshops, survey feedback, and monthly evaluation reports. Built with HTML/CSS/JavaScript and fictional de-identified demo data, with an AI assistant panel of guardrailed Claude prompt templates for staff. Designed from public health practicum experience in caregiver support and program evaluation; built with Claude as a product-thinking and coding partner. AI organizes, summarizes, and drafts — trained humans make every medical, legal, financial, eligibility, and service decision.

## 60-second interview explanation

> "In my public health practicum, I worked on program development and evaluation for caregivers and older adults, and I kept seeing the same problem: referrals in one spreadsheet, workshop feedback in another, follow-ups in someone's inbox. Coordinators couldn't quickly answer 'who needs follow-up today?' and monthly funder reports took hours to rebuild by hand.
>
> So I built a prototype: one workspace with a dashboard, a de-identified intake form that requires documented consent, a filterable caregiver list, workshop and survey tracking, and a one-click draft of the monthly evaluation report.
>
> The AI piece is deliberately scoped. There's an assistant panel with copy-ready Claude prompts — summarize case notes, find missing information, draft a follow-up message, turn feedback into themes — and every prompt carries the same guardrails: de-identified data only, no medical, legal, financial, or eligibility decisions, flag uncertainty, and final decisions stay with trained humans. There's even a prompt whose only job is reviewing AI output for risk.
>
> I built it with Claude as a product-thinking and coding partner — I brought the workflow and program knowledge, Claude helped me ship it. And because nonprofits inherit tools they can't maintain, the documentation, staff training plan, and a 2-week pilot plan live inside the app itself."

## LinkedIn post draft

---

Caregiver support programs do vital work with scattered tools: referrals in spreadsheets, feedback in email threads, monthly reports rebuilt by hand.

For my second Claude Corps portfolio project, I built the **Caregiver Support Program OS** — a web app prototype that gives program staff one workspace for:

🗂️ De-identified referral intake (consent required, privacy reminders built in)
📋 A caregiver list with follow-up dates, needs, and human-review flags
🧑‍🏫 Workshop and session tracking, from advance care planning to caregiver self-care
📊 Survey themes, barriers, and caregiver confidence before/after
📄 A one-click draft of the monthly evaluation report for leadership and funders

It also includes an AI assistant panel: copy-ready Claude prompt templates for summarizing notes, spotting missing information, drafting follow-up messages, and turning feedback into themes. Every prompt carries the same guardrails — de-identified data only, no medical, legal, financial, or eligibility decisions, flag uncertainty, and final decisions stay with trained humans.

I designed the workflow from my public health practicum experience in caregiver support and program evaluation, and built the prototype with Claude as a product-thinking and coding partner. The documentation, staff training plan, and a 2-week pilot plan live inside the app, because a tool a nonprofit can't sustain isn't a tool.

Demo uses fictional data. Feedback from public health and nonprofit folks very welcome — what would your program need this to do?

#PublicHealth #Nonprofits #CaregiverSupport #ResponsibleAI #ClaudeCorps

---

## Talking points if asked "why not a real API integration?"

- The demo runs anywhere with zero setup and zero risk — no keys, no data leaving the browser.
- It models the *correct organizational sequence*: staff learn prompt discipline and guardrails first; API automation comes after an organization approves privacy policies and review steps.
- The data layer is isolated (`loadState`/`saveState` in `js/data.js`), so a Firebase + API version is an incremental step, not a rewrite.

## Talking points if asked about risk

- The tool's scope note is on the dashboard, not buried in a README.
- Consent is enforced by the intake form, not just requested.
- "Human review" is a visible flag across the dashboard, list, and profile — the tool routes attention, it never decides.
- The eight prompt templates all embed the same guardrail block, and one template exists purely to red-team AI output before it reaches a caregiver.

## Positioning reminder

I present as a **public health and nonprofit AI workflow builder**, not a senior software engineer. The value story is: I understand the program workflow, I can build a working practical tool with Claude, I can train non-technical staff, and I leave behind documentation and a pilot plan.
