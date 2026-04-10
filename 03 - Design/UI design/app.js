const stages = [
  "Pre-Qualification",
  "Technical Qualification",
  "Commercial Qualification",
  "Evaluation",
  "Result",
  "Closed",
];

const leads = [
  {
    id: crypto.randomUUID(),
    companyName: "Bharat Strategic Systems",
    contactPerson: "N. Sharma",
    sector: "Defence",
    customerType: "PSU",
    tenderName: "Integrated Naval Control Upgrade",
    referenceNo: "RFP-26-NS-118",
    documentType: "RFP",
    tenderType: "Open",
    businessDomain: "Naval Electronics",
    leadOwner: "Amit Singh",
    estimatedValue: 18.4,
    submissionDate: "2026-04-18",
    currentStage: "Technical Qualification",
    priority: "High",
    health: "Amber",
    goNoGo: "Go",
    stageNotes: "Customer has requested two compliance clarifications before technical opening.",
    history: ["Created from direct tender entry", "Moved from Pre-Qualification to Technical Qualification"],
  },
  {
    id: crypto.randomUUID(),
    companyName: "Metro Civil Infra Board",
    contactPerson: "P. Verma",
    sector: "Civil",
    customerType: "Government - State",
    tenderName: "Urban Transit Operations Platform",
    referenceNo: "NIT-UTOP-92",
    documentType: "NIT",
    tenderType: "Limited",
    businessDomain: "Smart Infrastructure",
    leadOwner: "Sneha Rao",
    estimatedValue: 7.8,
    submissionDate: "2026-04-13",
    currentStage: "Pre-Qualification",
    priority: "Critical",
    health: "Red",
    goNoGo: "Pending",
    stageNotes: "Turnover certificate and MSME proof still pending from finance team.",
    history: ["Created from EOI conversion"],
  },
  {
    id: crypto.randomUUID(),
    companyName: "Defence Research Wing",
    contactPerson: "A. Khan",
    sector: "Defence",
    customerType: "Government - Central",
    tenderName: "Autonomous Sensor Trial Package",
    referenceNo: "EOI-RFP-57",
    documentType: "RFP",
    tenderType: "Global Tender",
    businessDomain: "Autonomous Systems",
    leadOwner: "Ritika Jain",
    estimatedValue: 22.15,
    submissionDate: "2026-04-29",
    currentStage: "Evaluation",
    priority: "High",
    health: "Green",
    goNoGo: "Go",
    stageNotes: "Round 2 evaluation response submitted. Awaiting negotiation note.",
    history: [
      "Converted from budgetary quotation",
      "Technical Qualification completed",
      "Commercial Qualification completed",
    ],
  },
];

const stageBoard = document.getElementById("stageBoard");
const leadDetail = document.getElementById("leadDetail");
const stats = document.getElementById("stats");
const leadForm = document.getElementById("leadForm");
const formFeedback = document.getElementById("formFeedback");

let selectedLeadId = leads[0]?.id ?? null;

function renderStats() {
  const openLeads = leads.filter((lead) => lead.currentStage !== "Closed").length;
  const overdueLeads = leads.filter((lead) => lead.health === "Red").length;
  const highPriority = leads.filter((lead) => ["High", "Critical"].includes(lead.priority)).length;
  const goDecisions = leads.filter((lead) => lead.goNoGo === "Go").length;

  const items = [
    { label: "Open Leads", value: openLeads },
    { label: "Overdue Stages", value: overdueLeads },
    { label: "High Priority", value: highPriority },
    { label: "Go Decisions", value: goDecisions },
  ];

  stats.innerHTML = items
    .map(
      (item) => `
        <article>
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </article>
      `,
    )
    .join("");
}

function renderBoard() {
  stageBoard.innerHTML = stages
    .map((stage) => {
      const stageLeads = leads.filter((lead) => lead.currentStage === stage);

      return `
        <section class="stage-column">
          <div class="stage-column-header">
            <h4>${stage}</h4>
            <span class="stage-count">${stageLeads.length}</span>
          </div>
          <div class="stage-column-body">
            ${stageLeads.length ? stageLeads.map(renderLeadCard).join("") : `<div class="empty-state">No leads in this stage.</div>`}
          </div>
        </section>
      `;
    })
    .join("");

  bindCardEvents();
}

function renderLeadCard(lead) {
  return `
    <article class="lead-card ${lead.id === selectedLeadId ? "selected" : ""}" data-id="${lead.id}">
      <header>
        <div>
          <h4>${lead.tenderName}</h4>
          <small>${lead.companyName}</small>
        </div>
        <span class="badge ${lead.health.toLowerCase()}">${lead.health}</span>
      </header>
      <div class="card-meta">
        <span>${lead.referenceNo || "No Ref"}</span>
        <span>${lead.priority} Priority</span>
      </div>
      <div class="card-meta">
        <span>Owner: ${lead.leadOwner || "Unassigned"}</span>
        <span>Due: ${formatDate(lead.submissionDate)}</span>
      </div>
      <p>${lead.stageNotes}</p>
      <div class="card-actions">
        <button class="ghost-btn" type="button" data-action="back" data-id="${lead.id}">Back</button>
        <button class="primary-btn" type="button" data-action="next" data-id="${lead.id}">Advance</button>
      </div>
    </article>
  `;
}

function bindCardEvents() {
  document.querySelectorAll(".lead-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) {
        return;
      }

      selectedLeadId = card.dataset.id;
      renderBoard();
      renderLeadDetail();
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      moveLead(button.dataset.id, button.dataset.action === "next" ? 1 : -1);
    });
  });
}

function renderLeadDetail() {
  const lead = leads.find((item) => item.id === selectedLeadId);

  if (!lead) {
    leadDetail.innerHTML = `<div class="empty-state">Select a lead card to view its stage details.</div>`;
    return;
  }

  const currentIndex = stages.indexOf(lead.currentStage);
  const nextStage = stages[currentIndex + 1] || "Completed";

  leadDetail.innerHTML = `
    <div class="detail-top">
      <div>
        <p class="eyebrow">Current lead</p>
        <h3>${lead.tenderName}</h3>
        <p>${lead.companyName} · ${lead.documentType} · ${lead.tenderType}</p>
      </div>
      <span class="badge ${lead.health.toLowerCase()}">${lead.currentStage}</span>
    </div>

    <div class="detail-grid">
      <div class="detail-item">
        <span>Lead Owner</span>
        <strong>${lead.leadOwner || "Not assigned"}</strong>
      </div>
      <div class="detail-item">
        <span>Go / No-Go</span>
        <strong>${lead.goNoGo}</strong>
      </div>
      <div class="detail-item">
        <span>Estimated Value</span>
        <strong>${Number(lead.estimatedValue).toFixed(2)} Cr</strong>
      </div>
      <div class="detail-item">
        <span>Submission Due Date</span>
        <strong>${formatDate(lead.submissionDate)}</strong>
      </div>
      <div class="detail-item">
        <span>Business Domain</span>
        <strong>${lead.businessDomain || "Not provided"}</strong>
      </div>
      <div class="detail-item">
        <span>Next Suggested Stage</span>
        <strong>${nextStage}</strong>
      </div>
    </div>

    <div class="detail-item">
      <span>Stage Notes</span>
      <strong>${lead.stageNotes || "No stage notes added yet."}</strong>
    </div>

    <div class="detail-actions">
      <button class="ghost-btn" type="button" id="detailBack">Move Back</button>
      <button class="primary-btn" type="button" id="detailNext">Move To Next Stage</button>
    </div>

    <div>
      <p class="eyebrow">Stage History Preview</p>
      <div class="timeline">
        ${lead.history.map((item) => `<div class="timeline-item">${item}</div>`).join("")}
      </div>
    </div>
  `;

  document.getElementById("detailBack").addEventListener("click", () => moveLead(lead.id, -1));
  document.getElementById("detailNext").addEventListener("click", () => moveLead(lead.id, 1));
}

function moveLead(id, delta) {
  const lead = leads.find((item) => item.id === id);
  if (!lead) {
    return;
  }

  const currentIndex = stages.indexOf(lead.currentStage);
  const newIndex = currentIndex + delta;
  if (newIndex < 0 || newIndex >= stages.length) {
    return;
  }

  const fromStage = lead.currentStage;
  const toStage = stages[newIndex];

  lead.currentStage = toStage;
  lead.history.unshift(`Moved from ${fromStage} to ${toStage}`);
  selectedLeadId = lead.id;

  renderStats();
  renderBoard();
  renderLeadDetail();
}

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(leadForm);

  const lead = {
    id: crypto.randomUUID(),
    companyName: formData.get("companyName"),
    contactPerson: formData.get("contactPerson"),
    sector: formData.get("sector"),
    customerType: formData.get("customerType"),
    tenderName: formData.get("tenderName"),
    referenceNo: formData.get("referenceNo"),
    documentType: formData.get("documentType"),
    tenderType: formData.get("tenderType"),
    businessDomain: formData.get("businessDomain"),
    leadOwner: formData.get("leadOwner"),
    estimatedValue: formData.get("estimatedValue"),
    submissionDate: formData.get("submissionDate"),
    currentStage: formData.get("currentStage"),
    priority: formData.get("priority"),
    health: formData.get("health"),
    goNoGo: formData.get("goNoGo"),
    stageNotes: formData.get("stageNotes"),
    history: ["Created from lead intake form"],
  };

  leads.unshift(lead);
  selectedLeadId = lead.id;

  formFeedback.textContent = `${lead.tenderName} added. In your real app, this action should create records in customers, tenders, and bidding_process and then refresh the stage board.`;
  leadForm.reset();

  renderStats();
  renderBoard();
  renderLeadDetail();
});

renderStats();
renderBoard();
renderLeadDetail();
