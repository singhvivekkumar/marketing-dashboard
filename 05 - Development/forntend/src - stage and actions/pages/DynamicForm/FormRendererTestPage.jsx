// src/pages/FormRendererTestPage.jsx
// DEV ONLY — drop this page on a route like /dev/form-renderer-test
// Lets you switch between all mock forms and test the renderer

import React, { useState } from 'react';
import {
  Box, Container, ToggleButtonGroup, ToggleButton, Typography,
  Chip, Stack, Paper, Alert,
} from '@mui/material';
import { BugReport } from '@mui/icons-material';
import FormRenderer from './FormRenderer';
import { MOCK_FORMS } from './data/formMockData';

const FORM_OPTIONS = [
  { key: 'enquiry',            label: 'Enquiry',       color: 'primary' },
  { key: 'vendor_registration', label: 'Vendor Reg',   color: 'secondary' },
  { key: 'feedback',           label: 'Feedback',      color: 'success' },
  { key: 'complaint',          label: 'Complaint',     color: 'error' },
];

const FormRendererTestPage = () => {
  const [selected, setSelected] = useState('enquiry');
  const form = MOCK_FORMS[selected];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 4 }}>
      {/* Dev Banner */}
      <Container maxWidth="md">
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'warning.light', border: '1px solid', borderColor: 'warning.main' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BugReport color="warning" />
            <Typography variant="subtitle2" fontWeight={600}>
              DEV MODE — FormRenderer Test Page
            </Typography>
            <Chip label="Mock Data" size="small" color="warning" />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            No API calls are made. Submission is intercepted and logged to console.
            Switch between form types below.
          </Typography>
        </Paper>

        {/* Form Switcher */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600} color="text.secondary">
            Test Form:
          </Typography>
          <ToggleButtonGroup
            value={selected}
            exclusive
            onChange={(_, val) => val && setSelected(val)}
            size="small"
          >
            {FORM_OPTIONS.map(opt => (
              <ToggleButton key={opt.key} value={opt.key} color={opt.color}>
                {opt.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>

        {/* Info */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>{form.name}</strong> · {form.schema.fields.length} fields ·{' '}
          {form.schema.fields.filter(f => f.required).length} required ·{' '}
          Type: <strong>{form.type}</strong>
        </Alert>

        {/* Renderer — pass mock data directly, no formId fetch */}
        <FormRenderer formData={form} />

        <Typography
          variant="caption" color="text.disabled"
          align="center" display="block" sx={{ mt: 3 }}
        >
          Check browser console to see submitted form data
        </Typography>
      </Container>
    </Box>
  );
};

export default FormRendererTestPage;

/*
  USAGE:
  1. Add route in App.jsx:
       <Route path="/dev/form-renderer-test" element={<FormRendererTestPage />} />

  2. Open: http://localhost:5173/dev/form-renderer-test

  3. Switch between Enquiry / Vendor Reg / Feedback / Complaint tabs

  NOTE:
  FormRenderer has a prop called `formData` for direct data injection.
  When `formData` is passed, it skips the API fetch entirely.
  When only `formId` is passed, it fetches from /api/forms/:id/schema.
*/
