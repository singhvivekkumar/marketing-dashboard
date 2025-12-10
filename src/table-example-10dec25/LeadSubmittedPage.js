// src/pages/LeadSubmittedPage.js

import { useState } from "react";
import LeadTable from "./LeadTable";
import LeadForm from "./LeadForm";
import { sampleLeads } from "./sampleLeads";

export default function LeadSubmittedPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      {!showForm ? (
        <LeadTable rows={sampleLeads} onAdd={() => setShowForm(true)} />
      ) : (
        <LeadForm onBack={() => setShowForm(false)} />
      )}
    </div>
  );
}
