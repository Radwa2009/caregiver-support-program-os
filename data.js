/* =========================================================
   Caregiver Support Program OS — data layer
   Fictional, de-identified demo data only.
   Stored in localStorage so the demo persists between visits.
   To connect Firebase later: replace loadState()/saveState()
   with Firestore reads/writes; the rest of the app reads from
   AppState only, so no other file needs to change.
   ========================================================= */

const STORAGE_KEY = "caregiverOS.v1";

const NEED_OPTIONS = [
  "Respite care",
  "Emotional support",
  "Transportation",
  "Care coordination",
  "Advance care planning",
  "Benefits navigation",
  "End-of-life education",
  "Caregiver education",
  "Community resources",
  "Other"
];

const TOPIC_OPTIONS = [
  "Advance care planning",
  "Caregiver self-care",
  "Navigating services",
  "End-of-life education",
  "Family communication",
  "Community resources"
];

const LANGUAGE_OPTIONS = ["English", "Spanish", "Arabic", "Mandarin", "Vietnamese", "Other"];
const AGE_GROUPS = ["Under 18", "18–39", "40–59", "60–74", "75–89", "90+"];
const RELATIONSHIPS = ["Adult child", "Spouse / partner", "Parent", "Sibling", "Grandchild", "Friend / neighbor", "Other family", "Professional caregiver"];
const URGENCY_LEVELS = ["Low", "Medium", "High"];
const STATUS_OPTIONS = ["New referral", "Active", "Follow-up due", "On hold", "Closed"];

/* ---------- seed data (fictional) ---------- */

function seedCaregivers() {
  return [
    {
      id: "CG-1001", initials: "M.R.", language: "Spanish", recipientAge: "75–89",
      relationship: "Adult child", urgency: "High", status: "Follow-up due",
      needs: ["Respite care", "Advance care planning", "Benefits navigation"],
      consent: true, followUpDate: "2026-07-08", createdAt: "2026-06-02",
      notes: [
        { date: "2026-06-02", author: "Intake volunteer", text: "Referred by community clinic. Caring for father with mobility limits. Prefers phone calls in Spanish, afternoons." },
        { date: "2026-06-10", author: "Coordinator", text: "Attended Navigating Services workshop. Asked about respite options; sent county respite list." },
        { date: "2026-06-24", author: "Coordinator", text: "Reports feeling overwhelmed; interested in advance care planning conversation with family. Flagged for human review — coordinate warm handoff, do not advise on benefits eligibility." }
      ],
      sessions: ["WS-201", "WS-203"]
    },
    {
      id: "CG-1002", initials: "T.N.", language: "Vietnamese", recipientAge: "60–74",
      relationship: "Spouse / partner", urgency: "Medium", status: "Active",
      needs: ["Emotional support", "Caregiver education", "Community resources"],
      consent: true, followUpDate: "2026-07-15", createdAt: "2026-06-05",
      notes: [
        { date: "2026-06-05", author: "Intake volunteer", text: "Self-referred after community fair. Caring for spouse; interested in peer support group." },
        { date: "2026-06-18", author: "Community health worker", text: "Joined caregiver self-care workshop. Requested materials in Vietnamese." }
      ],
      sessions: ["WS-202"]
    },
    {
      id: "CG-1003", initials: "A.K.", language: "English", recipientAge: "90+",
      relationship: "Grandchild", urgency: "Low", status: "Active",
      needs: ["Transportation", "Community resources"],
      consent: true, followUpDate: "2026-07-22", createdAt: "2026-06-09",
      notes: [
        { date: "2026-06-09", author: "Coordinator", text: "Needs help getting grandmother to weekly appointments. Shared volunteer driver program info." }
      ],
      sessions: []
    },
    {
      id: "CG-1004", initials: "S.H.", language: "Arabic", recipientAge: "75–89",
      relationship: "Adult child", urgency: "High", status: "Follow-up due",
      needs: ["End-of-life education", "Emotional support", "Advance care planning"],
      consent: true, followUpDate: "2026-07-07", createdAt: "2026-06-12",
      notes: [
        { date: "2026-06-12", author: "Intake volunteer", text: "Referred by hospice liaison. Family beginning end-of-life conversations; requested Arabic-language materials." },
        { date: "2026-06-26", author: "Coordinator", text: "High emotional distress reported. Flagged for human review — coordinator to call this week; consider counseling referral through approved partners." }
      ],
      sessions: ["WS-203"]
    },
    {
      id: "CG-1005", initials: "J.P.", language: "English", recipientAge: "60–74",
      relationship: "Sibling", urgency: "Medium", status: "New referral",
      needs: ["Care coordination", "Benefits navigation"],
      consent: true, followUpDate: "2026-07-10", createdAt: "2026-06-28",
      notes: [
        { date: "2026-06-28", author: "Intake volunteer", text: "New referral from senior center. Coordinating care for brother across two providers. Missing: preferred contact window, needs assessment." }
      ],
      sessions: []
    },
    {
      id: "CG-1006", initials: "L.C.", language: "Mandarin", recipientAge: "75–89",
      relationship: "Adult child", urgency: "Low", status: "Closed",
      needs: ["Caregiver education", "Community resources"],
      consent: true, followUpDate: "", createdAt: "2026-05-14",
      notes: [
        { date: "2026-05-14", author: "Coordinator", text: "Completed caregiver education series. Connected to neighborhood support circle." },
        { date: "2026-06-20", author: "Coordinator", text: "Closing case at caregiver's request; door left open to return anytime." }
      ],
      sessions: ["WS-201"]
    },
    {
      id: "CG-1007", initials: "D.W.", language: "English", recipientAge: "40–59",
      relationship: "Parent", urgency: "Medium", status: "Active",
      needs: ["Respite care", "Emotional support"],
      consent: true, followUpDate: "2026-07-18", createdAt: "2026-06-15",
      notes: [
        { date: "2026-06-15", author: "Community health worker", text: "Caring for adult child with chronic condition. Interested in weekend respite options and peer group." }
      ],
      sessions: ["WS-202"]
    },
    {
      id: "CG-1008", initials: "R.B.", language: "Spanish", recipientAge: "75–89",
      relationship: "Spouse / partner", urgency: "High", status: "Active",
      needs: ["Advance care planning", "End-of-life education", "Emotional support"],
      consent: true, followUpDate: "2026-07-09", createdAt: "2026-06-20",
      notes: [
        { date: "2026-06-20", author: "Coordinator", text: "Spouse recently entered hospice. Requested Spanish-language advance care planning conversation. Flagged for human review — trained facilitator only; no medical or legal advice." }
      ],
      sessions: ["WS-203"]
    }
  ];
}

function seedWorkshops() {
  return [
    {
      id: "WS-201", title: "Navigating Local Services 101", topic: "Navigating services",
      date: "2026-06-10", attendance: 14, language: "English / Spanish",
      feedbackScore: 4.4, followUpNeeded: true,
      notes: "Strong interest in respite and transportation resources. Three attendees asked for one-on-one follow-up."
    },
    {
      id: "WS-202", title: "Caring for Yourself While Caring for Others", topic: "Caregiver self-care",
      date: "2026-06-17", attendance: 11, language: "English",
      feedbackScore: 4.7, followUpNeeded: false,
      notes: "Peer discussion ran long — attendees wanted more time to share. Consider recurring peer circle."
    },
    {
      id: "WS-203", title: "Starting the Conversation: Advance Care Planning", topic: "Advance care planning",
      date: "2026-06-24", attendance: 9, language: "English / Spanish / Arabic",
      feedbackScore: 4.2, followUpNeeded: true,
      notes: "Interpreted session. Several families requested plain-language materials and a follow-up session with a trained facilitator."
    },
    {
      id: "WS-204", title: "Community Resources Fair Prep", topic: "Community resources",
      date: "2026-05-28", attendance: 18, language: "English",
      feedbackScore: 4.1, followUpNeeded: false,
      notes: "Held with senior center partners. Good referral source — five intake forms completed on site."
    }
  ];
}

function seedSurveys() {
  return [
    { id: "SV-1", workshopId: "WS-201", score: 5, confidenceBefore: 2, confidenceAfter: 4, themes: ["Knowing where to start", "Respite options"], barriers: ["Cost of services"], resources: ["Respite care list"], comment: "I finally know who to call first." },
    { id: "SV-2", workshopId: "WS-201", score: 4, confidenceBefore: 3, confidenceAfter: 4, themes: ["Respite options"], barriers: ["Transportation"], resources: ["Volunteer drivers"], comment: "Helpful, but I still need a ride program for my mom." },
    { id: "SV-3", workshopId: "WS-201", score: 4, confidenceBefore: 2, confidenceAfter: 3, themes: ["Paperwork feels overwhelming"], barriers: ["Language access"], resources: ["Spanish materials"], comment: "Más materiales en español, por favor." },
    { id: "SV-4", workshopId: "WS-202", score: 5, confidenceBefore: 2, confidenceAfter: 4, themes: ["Permission to rest", "Peer connection"], barriers: ["No backup caregiver"], resources: ["Peer support group"], comment: "Talking to other caregivers helped the most." },
    { id: "SV-5", workshopId: "WS-202", score: 5, confidenceBefore: 3, confidenceAfter: 5, themes: ["Peer connection"], barriers: ["Time"], resources: ["Recurring peer circle"], comment: "Please make this a monthly group." },
    { id: "SV-6", workshopId: "WS-202", score: 4, confidenceBefore: 2, confidenceAfter: 4, themes: ["Stress management"], barriers: ["Guilt about self-care"], resources: ["Counseling referrals"], comment: "I learned it's okay to ask for help." },
    { id: "SV-7", workshopId: "WS-203", score: 4, confidenceBefore: 1, confidenceAfter: 3, themes: ["Starting family conversations"], barriers: ["Family disagreement"], resources: ["Plain-language ACP guide"], comment: "The conversation starters were useful. My siblings and I disagree, so more help there." },
    { id: "SV-8", workshopId: "WS-203", score: 5, confidenceBefore: 2, confidenceAfter: 4, themes: ["Understanding the documents"], barriers: ["Language access"], resources: ["Arabic materials", "Follow-up session"], comment: "Interpreter made a big difference. We want a follow-up meeting." },
    { id: "SV-9", workshopId: "WS-203", score: 3, confidenceBefore: 2, confidenceAfter: 3, themes: ["Starting family conversations"], barriers: ["Emotional difficulty"], resources: ["One-on-one support"], comment: "Hard topic. I would prefer a smaller group next time." },
    { id: "SV-10", workshopId: "WS-204", score: 4, confidenceBefore: 3, confidenceAfter: 4, themes: ["Knowing where to start"], barriers: ["Cost of services"], resources: ["Benefits navigation help"], comment: "Good overview of what exists in the county." }
  ];
}

/* ---------- state ---------- */

let AppState = null;

function defaultState() {
  return {
    caregivers: seedCaregivers(),
    workshops: seedWorkshops(),
    surveys: seedSurveys(),
    meta: { seededAt: new Date().toISOString(), version: 1 }
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    AppState = raw ? JSON.parse(raw) : defaultState();
  } catch (e) {
    AppState = defaultState();
  }
  saveState();
  return AppState;
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(AppState));
  } catch (e) {
    /* storage unavailable (private mode) — demo continues in memory */
  }
}

function resetDemoData() {
  AppState = defaultState();
  saveState();
}

/* ---------- helpers used across the app ---------- */

function getCaregiver(id) {
  return AppState.caregivers.find(c => c.id === id);
}

function nextCaseId() {
  const nums = AppState.caregivers.map(c => parseInt((c.id || "").replace(/\D/g, ""), 10) || 1000);
  return "CG-" + (Math.max(1000, ...nums) + 1);
}

function missingInfoFor(cg) {
  const missing = [];
  if (!cg.language) missing.push("Preferred language");
  if (!cg.recipientAge) missing.push("Care recipient age group");
  if (!cg.relationship) missing.push("Relationship to care recipient");
  if (!cg.needs || cg.needs.length === 0) missing.push("Support needs assessment");
  if (!cg.followUpDate && cg.status !== "Closed") missing.push("Follow-up date");
  if (!cg.consent) missing.push("Documented consent");
  const noteText = (cg.notes || []).map(n => n.text).join(" ").toLowerCase();
  if (!noteText.includes("contact") && !noteText.includes("call") && !noteText.includes("phone")) {
    missing.push("Preferred contact method / window");
  }
  return missing;
}

function needsHumanReview(cg) {
  if (cg.urgency === "High") return true;
  return (cg.notes || []).some(n => /human review|flagged/i.test(n.text));
}

function countBy(arr, keyFn) {
  const out = {};
  arr.forEach(item => {
    const keys = keyFn(item);
    (Array.isArray(keys) ? keys : [keys]).forEach(k => {
      if (!k) return;
      out[k] = (out[k] || 0) + 1;
    });
  });
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
}

function avg(nums) {
  const clean = nums.filter(n => typeof n === "number" && !isNaN(n));
  if (!clean.length) return 0;
  return clean.reduce((a, b) => a + b, 0) / clean.length;
}
