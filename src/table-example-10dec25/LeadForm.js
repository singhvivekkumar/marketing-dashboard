// src/components/LeadForm/LeadForm.js

import { Button, TextField, Paper } from "@mui/material";

export default function LeadForm({ onBack }) {
  return (
    <Paper style={{ padding: 20 }}>
      <h2>Add Lead</h2>

      <TextField fullWidth label="Tender Name" margin="normal" />
      <TextField fullWidth label="Customer" margin="normal" />
      <TextField fullWidth label="Tender Ref No" margin="normal" />

      <Button variant="contained" color="primary" style={{ marginTop: 20 }}>
        Submit
      </Button>

      <Button onClick={onBack} style={{ marginLeft: 10 }}>
        Back
      </Button>
    </Paper>
  );
}
