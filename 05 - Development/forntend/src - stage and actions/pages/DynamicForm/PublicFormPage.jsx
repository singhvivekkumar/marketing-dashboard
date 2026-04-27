// src/pages/PublicFormPage.jsx
// Customer-facing page — accessed via /forms/:formId
// Renders the form dynamically and saves submission to DB
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import FormRenderer from './FormRenderer';

const PublicFormPage = () => {
  const { formId } = useParams();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 6 }}>
      <Container maxWidth="md">
        <FormRenderer formId={formId} />
        <Typography
          variant="caption" color="text.disabled"
          align="center" display="block" sx={{ mt: 3 }}
        >
          Powered by Marketing Portal · Your information is secure
        </Typography>
      </Container>
    </Box>
  );
};

export default PublicFormPage;
