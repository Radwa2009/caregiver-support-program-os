/* =========================================================
   Caregiver Support Program OS — app logic
   Everything renders from AppState (see data.js).
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  loadState();
  initNav();
  initIntakeForm();
  initCaregiverList();
  initWorkshops();
  initAssistant();
  initReport();
  renderAll();

  document.getElementById("resetData").addEventListener("click", () => {
    if (confirm("Reset all demo data back to the original fictional examples?")) {
      resetDemoData();
      renderAll();
      showSection("dashboard");
    }
  });
});

function renderAll() {
  renderDashboard();
  renderCaregiverTable();
  renderWorkshopTable();
  renderFeedback();
}

/* ---------- utilities ---------- */

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function urgencyBadge(u) {
  const cls = u === "High" ? "clay" : u === "Medium" ? "amber" : "pine";
  return `<span class="badge ${cls}">${esc(u)}</span>`;
}

function statusBadge(s) {
  const cls = s === "Follow-up due" ? "amber" : s === "Closed" ? "gray" : s === "New referral" ? "blue" : "pine";
  return `<span class="badge ${cls}">${esc(s)}</span>`;
}

function fillSelect(id, options, includeAll) {
  const sel = document.getElementById(id);
  sel.innerHTML = "";
  if (includeAll) sel.appendChild(el(`<option value="">${includeAll}</option>`));
  options.forEach(o => sel.appendChild(el(`<option value="${esc(o)}">${esc(o)}</option>`)));
}

function barChart(container, entries, max) {
  container.innerHTML = "";
  if (!entries.length) { container.innerHTML = `<div class="empty">No data yet.</div>`; return; }
  const top = max || entries[0][1];
  entries.forEach(([label, count]) => {
    container.appendChild(el(`
      <div class="bar-row">
        <span>${esc(label)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.max(6, (count / top) * 100)}%"></div></div>
        <span class="bar-count">${count}</span>
      </div>`));
  });
}

/* ---------- navigation ---------- */

function initNav() {
  document.querySelectorAll(".nav button").forEach(btn => {
    btn.addEventListener("click", () => showSection(btn.dataset.section));
  });
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.toggle("visible", s.id === id));
  document.querySelectorAll(".nav button").forEach(b => b.classList.toggle("active", b.dataset.section === id));
  window.scrollTo({ top: 0 });
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {
  const cgs = AppState.caregivers;
  const open = cgs.filter(c => c.status !== "Closed");
  const today = new Date().toISOString().slice(0, 10);
  const followupsDue = open.filter(c => c.followUpDate && c.followUpDate <= today || c.status === "Follow-up due");
  const review = open.filter(needsHumanReview);
  const workshops = AppState.workshops;
  const surveys = AppState.surveys;
  const avgScore = avg(surveys.map(s => s.score));
  const topNeeds = countBy(open, c => c.needs);

  // plain-language impact sentence (the dashboard's signature)
  const topNeed = topNeeds.length ? topNeeds[0][0].toLowerCase() : "support";
  document.getElementById("impactSentence").textContent =
    `The program is currently supporting ${open.length} caregivers, ` +
    `${followupsDue.length} of whom are due for follow-up. ` +
    `The most requested support is ${topNeed}, and caregivers rate recent workshops ${avgScore.toFixed(1)} out of 5.`;

  // stat cards
  const stats = [
    { n: cgs.length, l: "Total caregivers served" },
    { n: open.length, l: "Open referrals" },
    { n: followupsDue.length, l: "Follow-ups due", attention: followupsDue.length > 0 },
    { n: workshops.length, l: "Workshops completed" },
    { n: surveys.length, l: "Survey responses collected" },
    { n: review.length, l: "Flagged for human review", attention: review.length > 0 },
    { n: avgScore.toFixed(1) + " / 5", l: "Average feedback score" },
    { n: workshops.reduce((a, w) => a + (w.attendance || 0), 0), l: "Total workshop attendance" }
  ];
  const cardsBox = document.getElementById("statCards");
  cardsBox.innerHTML = "";
  stats.forEach(s => cardsBox.appendChild(el(`
    <div class="card stat ${s.attention ? "attention" : ""}">
      <div class="stat-num">${s.n}</div>
      <div class="stat-label">${esc(s.l)}</div>
    </div>`)));

  // needs bars
  barChart(document.getElementById("needsBars"), topNeeds.slice(0, 6));

  // review list
  const rl = document.getElementById("reviewList");
  rl.innerHTML = "";
  if (!review.length) rl.innerHTML = `<div class="empty">No cases flagged right now.</div>`;
  review.forEach(c => rl.appendChild(el(`
    <div style="display:flex;justify-content:space-between;gap:0.6rem;align-items:center;padding:0.45rem 0;border-bottom:1px solid var(--line);">
      <div><strong>${esc(c.id)}</strong> · ${esc(c.initials)} — ${urgencyBadge(c.urgency)} ${statusBadge(c.status)}</div>
      <button class="btn secondary small" data-open="${esc(c.id)}">Open</button>
    </div>`)));
  rl.querySelectorAll("[data-open]").forEach(b => b.addEventListener("click", () => {
    showSection("caregivers");
    openProfile(b.dataset.open);
  }));

  // snapshot
  const monthName = new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });
  document.getElementById("snapshot").innerHTML = `
    <p><strong>${esc(monthName)}:</strong> ${cgs.length} caregivers served to date, ${open.length} open referrals,
    ${workshops.length} workshops logged with ${workshops.reduce((a, w) => a + (w.attendance || 0), 0)} total attendees,
    and ${surveys.length} survey responses averaging ${avgScore.toFixed(1)}/5.
    ${review.length} case${review.length === 1 ? "" : "s"} flagged for human review.
    Generate the full narrative in <a href="#" data-goto="report">Monthly report</a>.</p>`;
  document.querySelector('#snapshot [data-goto]').addEventListener("click", (e) => {
    e.preventDefault(); showSection("report");
  });
}

/* =========================================================
   INTAKE
   ========================================================= */

function initIntakeForm() {
  fillSelect("f-language", LANGUAGE_OPTIONS);
  fillSelect("f-age", AGE_GROUPS);
  fillSelect("f-rel", RELATIONSHIPS);
  fillSelect("f-urgency", URGENCY_LEVELS);
  const needsBox = document.getElementById("f-needs");
  NEED_OPTIONS.forEach(n => needsBox.appendChild(el(
    `<label><input type="checkbox" value="${esc(n)}" /> ${esc(n)}</label>`)));
  document.getElementById("f-caseid").value = nextCaseId();

  document.getElementById("intakeForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("intakeMsg");
    const initials = document.getElementById("f-initials").value.trim();
    const consent = document.getElementById("f-consent").checked;
    const needs = [...needsBox.querySelectorAll("input:checked")].map(i => i.value);

    if (!consent) { msg.textContent = "Consent must be documented before saving a referral."; msg.className = "form-msg error"; return; }
    if (/\d{3,}|@/.test(initials)) { msg.textContent = "Initials only, please — no numbers or contact details."; msg.className = "form-msg error"; return; }

    const cg = {
      id: document.getElementById("f-caseid").value.trim() || nextCaseId(),
      initials: initials || "—",
      language: document.getElementById("f-language").value,
      recipientAge: document.getElementById("f-age").value,
      relationship: document.getElementById("f-rel").value,
      urgency: document.getElementById("f-urgency").value,
      status: "New referral",
      needs,
      consent: true,
      followUpDate: document.getElementById("f-followup").value,
      createdAt: new Date().toISOString().slice(0, 10),
      notes: [],
      sessions: []
    };
    const noteText = document.getElementById("f-notes").value.trim();
    if (noteText) cg.notes.push({ date: cg.createdAt, author: "Intake", text: noteText });

    AppState.caregivers.unshift(cg);
    saveState();
    e.target.reset();
    document.getElementById("f-caseid").value = nextCaseId();
    msg.textContent = `Saved ${cg.id}. It now appears in the caregiver list and dashboard.`;
    msg.className = "form-msg";
    renderAll();
  });
}

/* =========================================================
   CAREGIVER LIST + PROFILE
   ========================================================= */

function initCaregiverList() {
  fillSelect("cg-status", STATUS_OPTIONS, "All statuses");
  fillSelect("cg-need", NEED_OPTIONS, "All needs");
  fillSelect("cg-urgency", URGENCY_LEVELS, "All urgency levels");
  ["cg-search", "cg-status", "cg-need", "cg-urgency"].forEach(id =>
    document.getElementById(id).addEventListener("input", renderCaregiverTable));
}

function renderCaregiverTable() {
  const q = document.getElementById("cg-search").value.toLowerCase();
  const st = document.getElementById("cg-status").value;
  const nd = document.getElementById("cg-need").value;
  const ur = document.getElementById("cg-urgency").value;

  const rows = document.getElementById("cgRows");
  rows.innerHTML = "";
  const list = AppState.caregivers.filter(c => {
    const hay = [c.id, c.initials, c.language, (c.notes || []).map(n => n.text).join(" ")].join(" ").toLowerCase();
    return (!q || hay.includes(q)) &&
      (!st || c.status === st) &&
      (!nd || (c.needs || []).includes(nd)) &&
      (!ur || c.urgency === ur);
  });

  if (!list.length) {
    rows.appendChild(el(`<tr><td colspan="7" class="empty">No caregivers match these filters. Clear a filter or log a new referral.</td></tr>`));
    return;
  }

  list.forEach(c => {
    const tr = el(`
      <tr class="clickable">
        <td><strong>${esc(c.id)}</strong><br /><span class="hint">${esc(c.initials)}</span>
          ${needsHumanReview(c) ? '<br /><span class="review-flag">⚑ Human review</span>' : ""}</td>
        <td>${esc(c.language)}</td>
        <td>${(c.needs || []).slice(0, 3).map(n => `<span class="badge pine">${esc(n)}</span>`).join(" ")}${(c.needs || []).length > 3 ? ` <span class="hint">+${c.needs.length - 3}</span>` : ""}</td>
        <td>${urgencyBadge(c.urgency)}</td>
        <td>${statusBadge(c.status)}</td>
        <td>${fmtDate(c.followUpDate)}</td>
        <td><button class="btn secondary small" type="button">View</button></td>
      </tr>`);
    tr.addEventListener("click", () => openProfile(c.id));
    rows.appendChild(tr);
  });
}

function openProfile(id) {
  const c = getCaregiver(id);
  if (!c) return;
  const panel = document.getElementById("profilePanel");
  const missing = missingInfoFor(c);
  const sessions = (c.sessions || []).map(sid => AppState.workshops.find(w => w.id === sid)).filter(Boolean);

  const nextSteps = [];
  if (c.status === "New referral") nextSteps.push("Complete a needs assessment call and set a follow-up date.");
  if (c.followUpDate) nextSteps.push(`Follow up by ${fmtDate(c.followUpDate)}.`);
  if ((c.needs || []).includes("Advance care planning")) nextSteps.push("Schedule an advance care planning conversation with a trained facilitator — no medical or legal advice.");
  if ((c.needs || []).includes("Benefits navigation")) nextSteps.push("Refer to the benefits navigation partner; staff do not determine eligibility.");
  if (missing.length) nextSteps.push("Fill in the missing information listed below at the next contact.");
  if (!nextSteps.length) nextSteps.push("No pending actions — confirm at the next monthly review.");

  panel.innerHTML = "";
  panel.appendChild(el(`
  <div class="card">
    <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.6rem;align-items:baseline;">
      <h2 style="margin:0;">${esc(c.id)} · ${esc(c.initials)}</h2>
      <div>${urgencyBadge(c.urgency)} ${statusBadge(c.status)} ${needsHumanReview(c) ? '<span class="review-flag">⚑ Human review required before any decision</span>' : ""}</div>
    </div>
    <p class="hint" style="margin:0.3rem 0 0.9rem;">
      ${esc(c.language)} · care recipient ${esc(c.recipientAge)} · ${esc(c.relationship)} · referred ${fmtDate(c.createdAt)}
    </p>

    <div class="profile-grid">
      <div>
        <h3>Notes timeline</h3>
        <ul class="timeline">
          ${(c.notes || []).slice().reverse().map(n => `
            <li><span class="t-date">${fmtDate(n.date)}</span> · <span class="t-author">${esc(n.author)}</span>
            <p>${esc(n.text)}</p></li>`).join("") || '<li><p class="empty">No notes yet.</p></li>'}
        </ul>
        <div class="field">
          <label for="newNote">Add a note <span class="hint">(de-identified only)</span></label>
          <textarea id="newNote"></textarea>
          <button class="btn small" id="addNote" type="button" style="margin-top:0.4rem;">Add note</button>
        </div>
      </div>
      <div>
        <h3>Needs checklist</h3>
        <ul class="checklist">
          ${(c.needs || []).map(n => `<li><span class="dot">●</span>${esc(n)}</li>`).join("") || '<li class="empty">No needs recorded.</li>'}
        </ul>

        <h3>Missing information</h3>
        <ul class="checklist missing">
          ${missing.map(m => `<li><span class="dot">◦</span>${esc(m)}</li>`).join("") || '<li><span class="dot" style="color:var(--pine)">●</span>Nothing missing — record is complete.</li>'}
        </ul>

        <h3>Session history</h3>
        <ul class="checklist">
          ${sessions.map(w => `<li><span class="dot">●</span>${esc(w.title)} <span class="hint">(${fmtDate(w.date)})</span></li>`).join("") || '<li class="empty">No sessions attended yet.</li>'}
        </ul>

        <h3>Staff next steps</h3>
        <ul class="checklist">
          ${nextSteps.map(s => `<li><span class="dot">→</span>${esc(s)}</li>`).join("")}
        </ul>

        <div class="field" style="margin-top:0.8rem;">
          <label for="statusUpdate">Update status</label>
          <select id="statusUpdate">${STATUS_OPTIONS.map(s => `<option ${s === c.status ? "selected" : ""}>${esc(s)}</option>`).join("")}</select>
        </div>
        <div class="field">
          <label for="fuUpdate">Follow-up date</label>
          <input type="date" id="fuUpdate" value="${esc(c.followUpDate || "")}" />
        </div>
        <button class="btn small" id="saveProfile" type="button">Save changes</button>
        <span class="copied" id="profileMsg"></span>
      </div>
    </div>
  </div>`));

  panel.querySelector("#addNote").addEventListener("click", () => {
    const t = panel.querySelector("#newNote").value.trim();
    if (!t) return;
    c.notes.push({ date: new Date().toISOString().slice(0, 10), author: "Staff", text: t });
    saveState();
    openProfile(id);
    renderAll();
  });

  panel.querySelector("#saveProfile").addEventListener("click", () => {
    c.status = panel.querySelector("#statusUpdate").value;
    c.followUpDate = panel.querySelector("#fuUpdate").value;
    saveState();
    renderAll();
    openProfile(id);
    panel.querySelector("#profileMsg").textContent = "Saved.";
  });

  panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =========================================================
   WORKSHOPS
   ========================================================= */

function initWorkshops() {
  fillSelect("w-topic", TOPIC_OPTIONS);
  document.getElementById("wsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = document.getElementById("wsMsg");
    const title = document.getElementById("w-title").value.trim();
    if (!title) { msg.textContent = "Please add a workshop title."; msg.className = "form-msg error"; return; }
    AppState.workshops.unshift({
      id: "WS-" + (200 + AppState.workshops.length + 1),
      title,
      topic: document.getElementById("w-topic").value,
      date: document.getElementById("w-date").value || new Date().toISOString().slice(0, 10),
      attendance: parseInt(document.getElementById("w-att").value, 10) || 0,
      language: document.getElementById("w-lang").value.trim() || "English",
      feedbackScore: parseFloat(document.getElementById("w-score").value) || null,
      followUpNeeded: document.getElementById("w-follow").checked,
      notes: document.getElementById("w-notes").value.trim()
    });
    saveState();
    e.target.reset();
    msg.textContent = "Workshop saved.";
    msg.className = "form-msg";
    renderAll();
  });
}

function renderWorkshopTable() {
  const rows = document.getElementById("wsRows");
  rows.innerHTML = "";
  const list = AppState.workshops.slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  list.forEach(w => rows.appendChild(el(`
    <tr>
      <td>${fmtDate(w.date)}</td>
      <td><strong>${esc(w.title)}</strong>${w.notes ? `<br /><span class="hint">${esc(w.notes)}</span>` : ""}</td>
      <td><span class="badge pine">${esc(w.topic)}</span></td>
      <td>${w.attendance}</td>
      <td>${esc(w.language)}</td>
      <td>${w.feedbackScore != null ? w.feedbackScore.toFixed(1) : "—"}</td>
      <td>${w.followUpNeeded ? '<span class="badge amber">Yes</span>' : '<span class="badge gray">No</span>'}</td>
    </tr>`)));
}

/* =========================================================
   FEEDBACK
   ========================================================= */

function renderFeedback() {
  const s = AppState.surveys;
  const before = avg(s.map(x => x.confidenceBefore));
  const after = avg(s.map(x => x.confidenceAfter));

  const statsBox = document.getElementById("fbStats");
  statsBox.innerHTML = "";
  [
    { n: avg(s.map(x => x.score)).toFixed(1) + " / 5", l: "Average feedback score" },
    { n: s.length, l: "Responses collected" },
    { n: `${before.toFixed(1)} → ${after.toFixed(1)}`, l: "Average confidence, before → after (1–5)" }
  ].forEach(x => statsBox.appendChild(el(`
    <div class="card stat"><div class="stat-num">${x.n}</div><div class="stat-label">${esc(x.l)}</div></div>`)));

  barChart(document.getElementById("fbThemes"), countBy(s, x => x.themes).slice(0, 6));
  barChart(document.getElementById("fbBarriers"), countBy(s, x => x.barriers).slice(0, 6));
  barChart(document.getElementById("fbResources"), countBy(s, x => x.resources).slice(0, 6));

  document.getElementById("fbConfidence").innerHTML = `
    <div class="bar-row"><span>Before workshops</span><div class="bar-track"><div class="bar-fill" style="width:${(before / 5) * 100}%;background:var(--sage-line);"></div></div><span class="bar-count">${before.toFixed(1)}</span></div>
    <div class="bar-row"><span>After workshops</span><div class="bar-track"><div class="bar-fill" style="width:${(after / 5) * 100}%;"></div></div><span class="bar-count">${after.toFixed(1)}</span></div>
    <p class="hint" style="margin-top:0.5rem;">Self-reported confidence managing caregiving tasks, scale of 1–5. Demo data.</p>`;

  const rows = document.getElementById("fbRows");
  rows.innerHTML = "";
  s.forEach(x => {
    const w = AppState.workshops.find(w => w.id === x.workshopId);
    rows.appendChild(el(`
      <tr>
        <td>${esc(w ? w.title : x.workshopId)}</td>
        <td>${x.score}/5</td>
        <td>${x.confidenceBefore} → ${x.confidenceAfter}</td>
        <td>${esc(x.comment)}</td>
      </tr>`));
  });
}

/* =========================================================
   AI ASSISTANT — demo prompt library (no API calls)
   ========================================================= */

const GUARDRAIL_BLOCK =
`Guardrails (follow all of these):
- Work only with the de-identified information I provide (case IDs and initials, never names or contact details).
- Do not make or imply medical, legal, financial, or eligibility decisions or recommendations.
- Do not invent facts. If information is missing or unclear, say so explicitly.
- Flag anything uncertain, sensitive, or high-risk for human review.
- Your output is a draft. A trained staff member will review, edit, and approve it before any use.
- If a translation is involved, note that it must be verified by a qualified speaker before sending.`;

const PROMPTS = [
  {
    title: "Summarize caregiver notes",
    body:
`You are helping a caregiver support program coordinator organize case notes.

${GUARDRAIL_BLOCK}

Task: Summarize the de-identified case notes below into: (1) a 3–4 sentence situation summary, (2) the caregiver's stated needs in their own framing, (3) open questions for staff. Do not add interpretations that are not supported by the notes.

Case notes:
[PASTE DE-IDENTIFIED NOTES HERE — case ID and initials only]`
  },
  {
    title: "Identify missing information",
    body:
`You are helping a caregiver support program check whether an intake record is complete.

${GUARDRAIL_BLOCK}

Task: Compare the de-identified record below against this standard intake checklist: preferred language, care recipient age group, relationship, support needs, urgency, consent documented, follow-up date, preferred contact window. List what is present, what is missing, and 2–3 respectful questions staff could ask to fill the gaps. Do not guess at missing values.

Record:
[PASTE DE-IDENTIFIED RECORD HERE]`
  },
  {
    title: "Draft a follow-up message",
    body:
`You are helping a caregiver support coordinator draft a warm, plain-language follow-up message.

${GUARDRAIL_BLOCK}

Task: Draft a short follow-up message (under 120 words) that: thanks the caregiver for connecting, reflects the need they raised, offers the specific next step staff listed below, and invites questions. Sixth-grade reading level. Do not promise services, outcomes, or eligibility. Leave a [STAFF NAME] and [PROGRAM PHONE] placeholder.

Context (de-identified):
- Need raised: [e.g., respite care]
- Staff-approved next step: [e.g., share county respite list, invite to July workshop]
- Preferred language: [language — if not English, provide English draft plus a note that translation must be verified]`
  },
  {
    title: "Turn survey feedback into themes",
    body:
`You are helping a program evaluator organize open-ended survey feedback.

${GUARDRAIL_BLOCK}

Task: Group the de-identified survey comments below into 3–6 themes. For each theme: a short name, a one-sentence description, an approximate count, and one representative paraphrased comment (do not quote identifying details). Then list anything that appears only once but seems important for staff to read directly. Note the limits of this analysis (small sample, self-selected respondents).

Survey comments:
[PASTE DE-IDENTIFIED COMMENTS HERE]`
  },
  {
    title: "Generate monthly evaluation narrative",
    body:
`You are helping a program coordinator draft the narrative section of a monthly evaluation report for leadership and funders.

${GUARDRAIL_BLOCK}

Task: Using only the numbers and themes below, draft a 3-paragraph narrative: (1) reach and activity this month, (2) what caregivers told us (themes, confidence change, barriers), (3) operational follow-ups and open cases needing human review. Neutral, factual tone. Do not extrapolate impact beyond the data. Mark any place where the coordinator should add context with [COORDINATOR: ...].

Program data:
[PASTE MONTHLY REPORT NUMBERS HERE — the app's report generator produces this]`
  },
  {
    title: "Create caregiver workshop outline",
    body:
`You are helping design a 60-minute community workshop for family caregivers.

${GUARDRAIL_BLOCK}

Task: Draft an outline for a workshop on [TOPIC — e.g., caregiver self-care] for [AUDIENCE — e.g., adult children caring for older parents]. Include: learning goals, a welcome that acknowledges caregiving stress, 3 interactive segments with timing, discussion prompts, a resource-sharing segment, and a closing feedback survey moment. Educational content only — no medical, legal, or financial advice; direct such questions to qualified professionals.`
  },
  {
    title: "Rewrite care-planning language in plain language",
    body:
`You are helping staff make advance care planning materials easier to read.

${GUARDRAIL_BLOCK}

Task: Rewrite the passage below at a sixth-grade reading level while keeping the meaning accurate. Do not simplify away legally or medically meaningful distinctions — if a term cannot be simplified safely, keep it and add a one-line plain-language explanation. Flag any sentence where you are unsure the simplified version preserves the original meaning, so staff can verify it with the document owner.

Passage:
[PASTE PASSAGE HERE]`
  },
  {
    title: "Review AI output for risk",
    body:
`You are acting as a second-pass reviewer of an AI-drafted document for a caregiver support program.

${GUARDRAIL_BLOCK}

Task: Review the draft below and flag, line by line where relevant: (1) anything that could be read as medical, legal, financial, or eligibility advice, (2) any claim not supported by the source data, (3) any possibly identifying detail, (4) tone problems for a stressed caregiver audience, (5) anything a trained human must verify before use. End with a clear "safe to send after edits: yes/no/needs discussion" recommendation for the staff reviewer — the final decision is theirs.

Draft to review:
[PASTE AI DRAFT HERE]`
  }
];

function initAssistant() {
  const box = document.getElementById("promptCards");
  PROMPTS.forEach((p, i) => {
    const card = el(`
      <div class="card prompt-card">
        <h3>${esc(p.title)}
          <span><button class="btn secondary small" type="button">Copy prompt</button> <span class="copied"></span></span>
        </h3>
        <pre>${esc(p.body)}</pre>
      </div>`);
    card.querySelector("button").addEventListener("click", async () => {
      const note = card.querySelector(".copied");
      try {
        await navigator.clipboard.writeText(p.body);
        note.textContent = "Copied — paste into Claude";
      } catch {
        note.textContent = "Select the text below to copy";
      }
      setTimeout(() => { note.textContent = ""; }, 2500);
    });
    box.appendChild(card);
  });
}

/* =========================================================
   MONTHLY REPORT
   ========================================================= */

let lastReportText = "";

function initReport() {
  document.getElementById("genReport").addEventListener("click", renderReport);
  document.getElementById("copyReport").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(lastReportText);
      document.getElementById("reportCopied").textContent = "Copied.";
      setTimeout(() => document.getElementById("reportCopied").textContent = "", 2000);
    } catch { /* clipboard unavailable */ }
  });
  document.getElementById("printReport").addEventListener("click", () => window.print());
}

function renderReport() {
  const cgs = AppState.caregivers;
  const open = cgs.filter(c => c.status !== "Closed");
  const review = open.filter(needsHumanReview);
  const today = new Date().toISOString().slice(0, 10);
  const due = open.filter(c => (c.followUpDate && c.followUpDate <= today) || c.status === "Follow-up due");
  const ws = AppState.workshops;
  const sv = AppState.surveys;
  const attendance = ws.reduce((a, w) => a + (w.attendance || 0), 0);
  const score = avg(sv.map(s => s.score));
  const needs = countBy(open, c => c.needs).slice(0, 5);
  const barriers = countBy(sv, s => s.barriers).slice(0, 5);
  const before = avg(sv.map(x => x.confidenceBefore));
  const after = avg(sv.map(x => x.confidenceAfter));
  const monthName = new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const improvements = [];
  if (due.length) improvements.push(`Schedule a weekly follow-up block: ${due.length} caregiver(s) are currently due or overdue for follow-up.`);
  const langNeeds = countBy(open.filter(c => c.language !== "English"), c => c.language);
  if (langNeeds.length) improvements.push(`Expand language access: open cases include ${langNeeds.map(([l, n]) => `${l} (${n})`).join(", ")}; verify translated materials are available for these languages.`);
  if (barriers.length) improvements.push(`Address the top reported barrier — "${barriers[0][0]}" — in next month's workshop planning or partner referrals.`);
  if (ws.some(w => w.followUpNeeded)) improvements.push(`Close the loop on workshops marked "follow-up needed" before scheduling new sessions on the same topics.`);
  improvements.push("Review all human-review flags with the program lead; decisions and any service, benefits, or care determinations remain with trained staff and qualified partners.");

  const html = `
  <div class="report" id="reportBody">
    <h2>Monthly Program Evaluation Report — ${esc(monthName)}</h2>
    <p class="hint">Draft generated from program data for coordinator review. Fictional demo data. All figures should be verified and narrative context added by a trained staff member before sharing.</p>

    <h3>Reach &amp; activity</h3>
    <ul>
      <li>Caregivers served to date: <strong>${cgs.length}</strong> (open referrals: ${open.length}; new this month: ${cgs.filter(c => c.createdAt && c.createdAt.slice(0, 7) === today.slice(0, 7)).length})</li>
      <li>Referrals received (all time in demo): <strong>${cgs.length}</strong></li>
      <li>Workshops completed: <strong>${ws.length}</strong>, total attendance <strong>${attendance}</strong></li>
    </ul>

    <h3>What caregivers told us</h3>
    <ul>
      <li>Average workshop feedback score: <strong>${score.toFixed(1)} / 5</strong> (${sv.length} responses)</li>
      <li>Self-reported confidence: <strong>${before.toFixed(1)} → ${after.toFixed(1)}</strong> (1–5 scale, before → after)</li>
      <li>Top needs: ${needs.map(([n, c]) => `${esc(n)} (${c})`).join(" · ")}</li>
      <li>Barriers reported: ${barriers.map(([b, c]) => `${esc(b)} (${c})`).join(" · ")}</li>
    </ul>

    <h3>Follow-up &amp; open cases</h3>
    <ul>
      <li>Follow-ups due or overdue: <strong>${due.length}</strong> (${due.map(c => esc(c.id)).join(", ") || "none"})</li>
      <li>Cases flagged for human review: <strong>${review.length}</strong> (${review.map(c => esc(c.id)).join(", ") || "none"})</li>
    </ul>

    <h3>Suggested operational improvements (for discussion)</h3>
    <ul>${improvements.map(i => `<li>${esc(i)}</li>`).join("")}</ul>

    <h3>Notes &amp; limitations</h3>
    <p>This report organizes program records and self-reported survey data; it does not measure clinical outcomes and does not make eligibility, medical, legal, or financial determinations. Small sample sizes mean percentages should be interpreted cautiously.</p>
  </div>`;

  document.getElementById("reportOut").innerHTML = html;
  lastReportText = document.getElementById("reportBody").innerText;
  document.getElementById("copyReport").style.display = "inline-block";
  document.getElementById("printReport").style.display = "inline-block";
}
