import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'

import Dashboard from './pages/Dashboard'
import LeadListPage from './pages/leads/LeadListPage'
import LeadDetailPage from './pages/leads/LeadDetailPage'
import LeadCreatePage from './pages/leads/LeadCreatePage'

// Placeholder for modules 02–07 (same structure, different data)
import AppShell from './components/Layout/AppShell'
import { Box, Typography, Chip } from '@mui/material'

function ComingSoon({ module, num, color }) {
  return (
    <AppShell topbarProps={{ title: module }}>
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Chip
          label={`MODULE ${num}`}
          sx={{
            fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', fontWeight: 700,
            mb: 2, backgroundColor: `${color}15`, color, border: `1px solid ${color}40`,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236', mb: 1 }}>
          {module}
        </Typography>
        <Typography variant="body2" sx={{ color: '#97a3b5', maxWidth: 400, mx: 'auto', lineHeight: 1.7 }}>
          This module follows the same structure as Lead Creation — pass the Lead Reference ID
          from the previous module to auto-populate all project details here.
        </Typography>
      </Box>
    </AppShell>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/"            element={<Dashboard />} />

          {/* Module 01 — Lead Creation (fully built) */}
          <Route path="/leads"       element={<LeadListPage />} />
          <Route path="/leads/new"   element={<LeadCreatePage />} />
          <Route path="/leads/:id"   element={<LeadDetailPage />} />

          {/* Modules 02–07 — placeholder, replicate Lead structure */}
          <Route path="/bq"          element={<ComingSoon module="Budgetary Quotation" num="02" color="#7c3aed" />} />
          <Route path="/tender"      element={<ComingSoon module="Tender Management"   num="03" color="#0e7c7b" />} />
          <Route path="/bidding"     element={<ComingSoon module="Bidding"             num="04" color="#b45309" />} />
          <Route path="/acquisition" element={<ComingSoon module="Order Acquisition"   num="05" color="#0e7c61" />} />
          <Route path="/order"       element={<ComingSoon module="Order Received"      num="06" color="#c2410c" />} />
          <Route path="/future"      element={<ComingSoon module="Future Initiatives"  num="07" color="#be185d" />} />

          {/* Fallback */}
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
