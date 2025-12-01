import React from "react";
import {
  Box, Grid, Paper, Typography, TextField, MenuItem, Button
} from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";

const TENDER_TYPES = ["Single Tender","EOI","RFI","RFP","BQ","Open"];
const LEAD_SOURCES = ["GeM","CPPP","Newspaper","Email","Partner","Consultant","Direct"];
const LEAD_STATUSES = ["New","Under Review","Submitted","Lost","Won","Cancelled"];
const CLIENT_TYPES = ["Central Govt","State Govt","PSU","Private","Other"];

function CRMForm({ onSuccess }) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      leadId: "",
      referenceNumber: "",
      title: "",
      category: "",
      source: "",
      status: "New",
      customer: "",
      clientType: "",
      customerLocation: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      tenderType: "",
      modeOfSubmission: "",
      publishDate: "",
      closingDate: "",
      preBidDate: "",
      bidOpeningDate: "",
      estimatedValue: "",
      emdRequired: false,
      emdAmount: "",
      tenderFee: "",
      pbgRequired: false,
      goNoGo: "Go",
      goNoGoReason: "",
      scopeSummary: "",
      technicalSummary: "",
      commercialSummary: "",
      complianceLevel: "",
      riskNotes: "",
      bidManager: "",
      technicalLead: "",
      salesOwner: "",
      partnerConsortium: [{ name: "", role: "", share: "" }],
      competitors: [{ name: "", address: "" }],
      technicalScores: [{ competitor: "", score: "" }],
      quotedPrices: [{ competitor: "", price: "" }],
      internalCost: "",
      quoteValue: "",
      finalSubmittedPrice: "",
      submissionBy: "",
      submissionTimestamp: "",
      attachments: [] // optionally store file names or URLs
    }
  });

  const { fields: partnerFields, append: addPartner, remove: removePartner } =
    useFieldArray({ control, name: "partnerConsortium" });

  const { fields: competitorFields, append: addCompetitor, remove: removeCompetitor } =
    useFieldArray({ control, name: "competitors" });

  const { fields: techFields, append: addTech, remove: removeTech } =
    useFieldArray({ control, name: "technicalScores" });

  const { fields: priceFields, append: addPrice, remove: removePrice } =
    useFieldArray({ control, name: "quotedPrices" });

  // submit to backend
  const onSubmit = async (data) => {
    // attach submission timestamp
    data.submissionTimestamp = new Date().toISOString();

    // optional: convert numeric fields
    data.estimatedValue = data.estimatedValue || null;
    data.emdAmount = data.emdAmount || null;
    data.internalCost = data.internalCost || null;
    data.quoteValue = data.quoteValue || null;
    data.finalSubmittedPrice = data.finalSubmittedPrice || null;

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save");

      const saved = await res.json();
      if (onSuccess) onSuccess(saved);
      reset();
      alert("Lead saved.");
    } catch (err) {
      console.error(err);
      alert("Error saving lead.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>CRM — Tender Lead Form</Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Identification */}
          <Grid item xs={12} sm={4}>
            <TextField label="Lead ID / Serial" fullWidth {...register("leadId", { required: true })} error={!!errors.leadId} helperText={errors.leadId && "Required"} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Ref. Number" fullWidth {...register("referenceNumber")} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Category" fullWidth {...register("category")} />
          </Grid>

          <Grid item xs={12}>
            <TextField label="Title / Tender Description" fullWidth multiline {...register("title", { required: true })} error={!!errors.title} helperText={errors.title && "Required"} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField select label="Source" fullWidth defaultValue="" {...register("source")}>
              {LEAD_SOURCES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField select label="Status" fullWidth defaultValue="New" {...register("status")}>
              {LEAD_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField select label="Tender Type" fullWidth defaultValue="" {...register("tenderType")}>
              {TENDER_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </TextField>
          </Grid>

          {/* Customer */}
          <Grid item xs={12} sm={6}>
            <TextField label="Customer / Department" fullWidth {...register("customer", { required: true })} error={!!errors.customer} helperText={errors.customer && "Required"} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select label="Client Type" fullWidth {...register("clientType")}>
              {CLIENT_TYPES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Contact Person" fullWidth {...register("contactName")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Contact Email" fullWidth type="email" {...register("contactEmail")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Contact Phone" fullWidth {...register("contactPhone")} />
          </Grid>

          {/* Dates & values */}
          <Grid item xs={12} sm={4}>
            <TextField label="Publish Date" type="date" InputLabelProps={{ shrink: true }} fullWidth {...register("publishDate")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Closing Date" type="date" InputLabelProps={{ shrink: true }} fullWidth {...register("closingDate")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Pre-Bid Date" type="date" InputLabelProps={{ shrink: true }} fullWidth {...register("preBidDate")} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Estimated Value" type="number" fullWidth {...register("estimatedValue")} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="EMD Amount" type="number" fullWidth {...register("emdAmount")} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Tender Fee" type="number" fullWidth {...register("tenderFee")} />
          </Grid>

          {/* Internal assessment */}
          <Grid item xs={12}>
            <TextField label="Scope Summary" fullWidth multiline {...register("scopeSummary")} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Technical Summary" fullWidth multiline {...register("technicalSummary")} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Commercial Summary" fullWidth multiline {...register("commercialSummary")} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField label="Bid Manager" fullWidth {...register("bidManager")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Technical Lead" fullWidth {...register("technicalLead")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Sales Owner" fullWidth {...register("salesOwner")} />
          </Grid>

          {/* Partner consortium */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Partner / Consortium</Typography>
          </Grid>

          {partnerFields.map((p, idx) => (
            <Grid container spacing={1} key={p.id} sx={{ mb: 1 }}>
              <Grid item xs={4}>
                <TextField label="Partner Name" fullWidth {...register(`partnerConsortium.${idx}.name`)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Role" fullWidth {...register(`partnerConsortium.${idx}.role`)} />
              </Grid>
              <Grid item xs={3}>
                <TextField label="Share (%)" type="number" fullWidth {...register(`partnerConsortium.${idx}.share`)} />
              </Grid>
              <Grid item xs={1}>
                <Button color="error" variant="text" onClick={() => removePartner(idx)}>Remove</Button>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="outlined" onClick={() => addPartner({ name: "", role: "", share: "" })}>+ Add Partner</Button>
          </Grid>

          {/* Competitors */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Competitors</Typography>
          </Grid>

          {competitorFields.map((c, idx) => (
            <Grid container spacing={1} key={c.id} sx={{ mb: 1 }}>
              <Grid item xs={5}>
                <TextField label="Competitor Name" fullWidth {...register(`competitors.${idx}.name`)} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Address / Region" fullWidth {...register(`competitors.${idx}.address`)} />
              </Grid>
              <Grid item xs={1}>
                <Button color="error" variant="text" onClick={() => removeCompetitor(idx)}>Remove</Button>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="outlined" onClick={() => addCompetitor({ name: "", address: "" })}>+ Add Competitor</Button>
          </Grid>

          {/* Technical scores */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Technical Scores</Typography>
          </Grid>

          {techFields.map((t, idx) => (
            <Grid container spacing={1} key={t.id} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <TextField label="Competitor" fullWidth {...register(`technicalScores.${idx}.competitor`)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Score" fullWidth type="number" {...register(`technicalScores.${idx}.score`)} />
              </Grid>
              <Grid item xs={2}>
                <Button color="error" variant="text" onClick={() => removeTech(idx)}>Remove</Button>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="outlined" onClick={() => addTech({ competitor: "", score: "" })}>+ Add Technical Score</Button>
          </Grid>

          {/* Quoted prices */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mt: 2 }}>Quoted Prices</Typography>
          </Grid>

          {priceFields.map((p, idx) => (
            <Grid container spacing={1} key={p.id} sx={{ mb: 1 }}>
              <Grid item xs={6}>
                <TextField label="Competitor" fullWidth {...register(`quotedPrices.${idx}.competitor`)} />
              </Grid>
              <Grid item xs={4}>
                <TextField label="Price" type="number" fullWidth {...register(`quotedPrices.${idx}.price`)} />
              </Grid>
              <Grid item xs={2}>
                <Button color="error" variant="text" onClick={() => removePrice(idx)}>Remove</Button>
              </Grid>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="outlined" onClick={() => addPrice({ competitor: "", price: "" })}>+ Add Quoted Price</Button>
          </Grid>

          {/* Pricing & submission */}
          <Grid item xs={12} sm={4}>
            <TextField label="Internal Cost" type="number" fullWidth {...register("internalCost")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Quote Value" type="number" fullWidth {...register("quoteValue")} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Final Submitted Price" type="number" fullWidth {...register("finalSubmittedPrice")} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField label="Submission By" fullWidth {...register("submissionBy")} />
          </Grid>

          <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="flex-end">
            <Button variant="contained" type="submit">Save Lead</Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}


export default CRMForm;