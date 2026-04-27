import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from './theme'

// ── Layout ──
import AppShell from './components/Layout/AppShell'
import { Box, Typography, Chip } from '@mui/material'

// ── Pages ──
import Dashboard    from './pages/Dashboard'

// Module 01 — Lead Creation
import LeadListPage   from './pages/leads/LeadListPage'
import LeadCreatePage from './pages/leads/LeadCreatePage'
import LeadDetailPage from './pages/leads/LeadDetailPage'

// Module 02 — Budgetary Quotation
import BQListPage   from './pages/bq/BQListPage'
import BQCreatePage from './pages/bq/BQCreatePage'
import BQDetailPage from './pages/bq/BQDetailPage'

function ComingSoon({ module, num, color }) {
  return (
    <AppShell topbarProps={{ title: module }}>
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Chip
          label={`MODULE ${num}`}
          sx={{
            fontFamily: "'JetBrains Mono'",
            fontSize: '0.72rem',
            fontWeight: 700,
            mb: 2,
            backgroundColor: `${color}15`,
            color,
            border: `1px solid ${color}40`,
          }}
        />
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236', mb: 1 }}>
          {module}
        </Typography>
        <Typography variant="body2" sx={{ color: '#97a3b5', maxWidth: 420, mx: 'auto', lineHeight: 1.7 }}>
          This module follows the same structure as Lead Creation and Budgetary Quotation —
          pass the Lead Reference ID from the previous module to auto-populate all project details here.
        </Typography>
      </Box>
    </AppShell>
  )
}

export default function EnquiryApp() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Module 01 — Lead Creation */}
          <Route path="/leads"       element={<LeadListPage />} />
          <Route path="/leads/new"   element={<LeadCreatePage />} />
          <Route path="/leads/:id"   element={<LeadDetailPage />} />

          {/* Module 02 — Budgetary Quotation */}
          <Route path="/bq"          element={<BQListPage />} />
          <Route path="/bq/new"      element={<BQCreatePage />} />
          <Route path="/bq/:id"      element={<BQDetailPage />} />

          {/* Module 03 — Tender Management (placeholder) */}
          <Route path="/tender"      element={<ComingSoon module="Tender Management"  num="03" color="#0e7c7b" />} />
          <Route path="/tender/*"    element={<ComingSoon module="Tender Management"  num="03" color="#0e7c7b" />} />

          {/* Module 04 — Bidding (placeholder) */}
          <Route path="/bidding"     element={<ComingSoon module="Bidding"            num="04" color="#b45309" />} />
          <Route path="/bidding/*"   element={<ComingSoon module="Bidding"            num="04" color="#b45309" />} />

          {/* Module 05 — Order Acquisition (placeholder) */}
          <Route path="/acquisition"   element={<ComingSoon module="Order Acquisition" num="05" color="#0e7c61" />} />
          <Route path="/acquisition/*" element={<ComingSoon module="Order Acquisition" num="05" color="#0e7c61" />} />

          {/* Module 06 — Order Received (placeholder) */}
          <Route path="/order"       element={<ComingSoon module="Order Received"     num="06" color="#c2410c" />} />
          <Route path="/order/*"     element={<ComingSoon module="Order Received"     num="06" color="#c2410c" />} />

          {/* Module 07 — Future Initiatives (placeholder) */}
          <Route path="/future"      element={<ComingSoon module="Future Initiatives" num="07" color="#be185d" />} />
          <Route path="/future/*"    element={<ComingSoon module="Future Initiatives" num="07" color="#be185d" />} />

          {/* Fallback */}
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
