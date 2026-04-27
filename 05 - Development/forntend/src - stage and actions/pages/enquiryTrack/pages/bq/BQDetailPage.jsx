import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Chip, Tabs, Tab,
  Divider, Paper, Stack, Button, Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import AppShell from '../../components/Layout/AppShell'
import BQStageTracker from './components/BQStageTracker'
import BQStageActionPanel from './components/BQStageActionPanel'
import CompetitorsTab from './components/CompetitorsTab'
import BQAuditLogTab from './components/BQAuditLogTab'
import { mockBQs, BQ_STAGES } from '../../data/mockBQ'

const STATUS_CHIP = {
  Draft:               { bg: '#f0f3f8', color: '#5a6880' },
  'Scope Study':       { bg: '#e8f0fb', color: '#1a56a0' },
  Feasibility:         { bg: '#fef8e8', color: '#c07000' },
  'Technical Proposal':{ bg: '#f3eeff', color: '#7c3aed' },
  'Tech Head Approval':{ bg: '#fef3da', color: '#b45309' },
  'Finance Approval':  { bg: '#e6f6f1', color: '#0e7c61' },
  Submitted:           { bg: '#d4f0e5', color: '#1b8a5a' },
  Revised:             { bg: '#fef8e8', color: '#c07000' },
  Won:                 { bg: '#d4f0e5', color: '#1b8a5a' },
  Lost:                { bg: '#fde8e6', color: '#c0392b' },
}

function InfoRow({ label, value, mono, accent, highlight }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.9, borderBottom: '1px solid #eaeff6' }}>
      <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.07em', mt: 0.2, flexShrink: 0 }}>
        {label}
      </Typography>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography sx={{
          fontSize: '0.82rem', color: accent ? '#7c3aed' : highlight ? '#1b8a5a' : '#1a2236',
          fontFamily: mono ? "'JetBrains Mono'" : 'inherit',
          fontWeight: mono || highlight ? 600 : 400,
          textAlign: 'right', maxWidth: '65%',
        }}>
          {value || '—'}
        </Typography>
      ) : value}
    </Box>
  )
}

function SectionLabel({ children }) {
  return (
    <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1.2 }}>
      {children}
    </Typography>
  )
}

export default function BQDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const bq = mockBQs.find((b) => b.id === id)

  if (!bq) {
    return (
      <AppShell>
        <Box sx={{ p: 4 }}>
          <Alert severity="error">BQ not found: {id}</Alert>
          <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate('/bq')}>Back</Button>
        </Box>
      </AppShell>
    )
  }

  const cs = STATUS_CHIP[bq.status] || STATUS_CHIP['Draft']
  const currSymbol = bq.currency === 'INR' ? '₹' : bq.currency === 'GBP' ? '£' : '$'
  const crumbs = [
    { label: 'Budgetary Quotation', onClick: () => navigate('/bq') },
    { label: `${bq.id} — ${bq.projectName}` },
  ]

  return (
    <AppShell topbarProps={{ crumbs }}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2.5}>

          {/* ── MAIN ── */}
          <Grid item xs={12} lg={8}>

            {/* Header card */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1.5} flexWrap="wrap">
                  <Chip label="BQ" size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#f3eeff', color: '#7c3aed' }} />
                  <Chip label={bq.customerType} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: bq.customerType === 'Internal' ? '#e6f6f1' : '#fef8e8', color: bq.customerType === 'Internal' ? '#0e7c61' : '#c07000' }} />
                  <Chip label={bq.sector} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: bq.sector === 'Defence' ? '#fef3da' : '#f0f3f8', color: bq.sector === 'Defence' ? '#b45309' : '#5a6880' }} />
                  <Chip label={bq.status} size="small" sx={{ ...cs, fontFamily: "'JetBrains Mono'" }} />
                  <Box sx={{ ml: 'auto' }}>
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#97a3b5' }}>{bq.id}</Typography>
                  </Box>
                </Stack>

                <Typography variant="h5" sx={{ color: '#1a2236', mb: 0.5 }}>{bq.projectName}</Typography>
                <Typography variant="body2" sx={{ color: '#5a6880', mb: 0.5 }}>
                  {bq.customer} &nbsp;·&nbsp; {bq.domain} &nbsp;·&nbsp; {bq.market}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: '#97a3b5' }}>Lead:</Typography>
                  <Typography
                    sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: '#1a56a0', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline dotted' }}
                    onClick={() => navigate(`/leads/${bq.leadRef}`)}
                  >
                    {bq.leadRef}
                  </Typography>
                  <OpenInNewIcon sx={{ fontSize: 12, color: '#97a3b5', cursor: 'pointer' }} onClick={() => navigate(`/leads/${bq.leadRef}`)} />
                </Box>

                {/* Stage tracker */}
                <Box sx={{ mt: 3, mb: 1 }}>
                  <SectionLabel>Stage Progress</SectionLabel>
                  <BQStageTracker currentStage={bq.currentStage} />
                </Box>
              </CardContent>
            </Card>

            {/* Tabbed card */}
            <Card>
              <Tabs
                value={tab} onChange={(_, v) => setTab(v)}
                sx={{ px: 2, borderBottom: '1px solid #dde3ed', '& .MuiTabs-flexContainer': { gap: 0.5 } }}
              >
                <Tab label="Overview" />
                <Tab label="Stage & Actions" />
                <Tab label="Technical Proposal" />
                <Tab label="Competitors" />
                <Tab label="Audit Log" />
              </Tabs>

              <CardContent sx={{ p: 2.5 }}>

                {/* OVERVIEW */}
                {tab === 0 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <SectionLabel>Lead Reference</SectionLabel>
                        <InfoRow label="Lead Ref #" value={bq.leadRef} mono accent />
                        <InfoRow label="Project" value={bq.projectName} />
                        <InfoRow label="Customer" value={bq.customer} />
                        <InfoRow label="Contact" value={bq.contactPerson} />
                        <InfoRow label="Email" value={bq.contactEmail} mono />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <SectionLabel>Classification</SectionLabel>
                        <InfoRow label="Customer Type" value={bq.customerType} />
                        <InfoRow label="Sector" value={bq.sector} />
                        <InfoRow label="Market" value={bq.market} />
                        <InfoRow label="Domain" value={bq.domain} />
                        <InfoRow label="BQ Owner" value={bq.owner} />
                      </Grid>

                      <Grid item xs={12}><Divider /></Grid>

                      {/* Financials */}
                      <Grid item xs={12}>
                        <SectionLabel>Financial Details</SectionLabel>
                        <Grid container spacing={1.5}>
                          {[
                            { label: 'Currency',           value: bq.currency },
                            { label: 'Value Ex-GST',       value: `${currSymbol} ${bq.estimatedValueExGST.toFixed(2)} Cr` },
                            { label: 'GST',                value: `${bq.gstPercent}%` },
                            { label: 'Value Inc-GST',      value: `${currSymbol} ${bq.estimatedValueIncGST.toFixed(2)} Cr` },
                          ].map(({ label, value }) => (
                            <Grid item xs={6} sm={3} key={label}>
                              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block', mb: 0.3 }}>{label}</Typography>
                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#1a2236', fontFamily: "'JetBrains Mono'" }}>{value}</Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>

                      <Grid item xs={12}><Divider /></Grid>

                      {/* Dates */}
                      <Grid item xs={12}>
                        <SectionLabel>Key Dates</SectionLabel>
                        <Grid container spacing={1.5}>
                          {[
                            { label: 'RFQ Date',             value: bq.rfqDate || '—',        warn: false },
                            { label: 'Created',              value: bq.createdDate,            warn: false },
                            { label: 'Submission Due',       value: bq.submissionDate,         warn: true },
                            { label: 'Extended Date',        value: bq.extendedDate || '—',    warn: false },
                            { label: 'Letter Date',          value: bq.letterDate || '—',      warn: false },
                          ].map(({ label, value, warn }) => (
                            <Grid item xs={6} sm={4} key={label}>
                              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block', mb: 0.3 }}>{label}</Typography>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: "'JetBrains Mono'", color: warn && value !== '—' ? '#c07000' : '#1a2236' }}>{value}</Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>

                      {/* Scope */}
                      {bq.scopeSummary && (
                        <Grid item xs={12}>
                          <Divider sx={{ mb: 2 }} />
                          <SectionLabel>Scope of Work</SectionLabel>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafd' }}>
                            <Typography variant="body2" sx={{ color: '#5a6880', lineHeight: 1.7 }}>{bq.scopeSummary}</Typography>
                          </Paper>
                        </Grid>
                      )}

                      {bq.remarks && (
                        <Grid item xs={12}>
                          <SectionLabel>Remarks</SectionLabel>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafd' }}>
                            <Typography variant="body2" sx={{ color: '#5a6880', lineHeight: 1.7 }}>{bq.remarks}</Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                      <Button variant="outlined" startIcon={<EditOutlinedIcon />}>Edit BQ</Button>
                      <Button variant="contained" onClick={() => setTab(1)}>Update Stage →</Button>
                    </Box>
                  </Box>
                )}

                {/* STAGE & ACTIONS */}
                {tab === 1 && <BQStageActionPanel bq={bq} />}

                {/* TECHNICAL PROPOSAL */}
                {tab === 2 && (
                  <Box>
                    <SectionLabel>Technical Proposal Details</SectionLabel>
                    <Stack spacing={0} divider={<Divider />} sx={{ border: '1px solid #dde3ed', borderRadius: 2, overflow: 'hidden', mb: 2.5 }}>
                      {[
                        { label: 'Prepared By', value: bq.techProposal.preparedBy },
                        { label: 'Reviewed By', value: bq.techProposal.reviewedBy },
                        { label: 'Approved By', value: bq.techProposal.approvedBy },
                        { label: 'Submitted Date', value: bq.techProposal.submittedDate, mono: true },
                      ].map(({ label, value, mono }) => (
                        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 1.2 }}>
                          <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.07em', mt: 0.2 }}>{label}</Typography>
                          <Typography sx={{ fontSize: '0.82rem', color: '#1a2236', fontFamily: mono ? "'JetBrains Mono'" : 'inherit', fontWeight: value ? 400 : 300 }}>
                            {value || '—'}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {bq.techProposal.remarks && (
                      <>
                        <SectionLabel>Technical Proposal Notes</SectionLabel>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafd', mb: 2.5 }}>
                          <Typography variant="body2" sx={{ color: '#5a6880', lineHeight: 1.7 }}>{bq.techProposal.remarks}</Typography>
                        </Paper>
                      </>
                    )}

                    <Button variant="outlined" startIcon={<EditOutlinedIcon />}>Edit Technical Proposal</Button>
                  </Box>
                )}

                {/* COMPETITORS */}
                {tab === 3 && <CompetitorsTab bq={bq} />}

                {/* AUDIT LOG */}
                {tab === 4 && <BQAuditLogTab bq={bq} />}

              </CardContent>
            </Card>
          </Grid>

          {/* ── SIDEBAR ── */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SectionLabel>BQ Info</SectionLabel>
                <InfoRow label="BQ Ref" value={bq.id} mono accent />
                <InfoRow label="Lead Ref" value={bq.leadRef} mono />
                <InfoRow label="Status" value={<Chip label={bq.status} size="small" sx={{ ...cs, fontFamily: "'JetBrains Mono'" }} />} />
                <InfoRow label="Stage" value={BQ_STAGES[bq.currentStage]} />
                <InfoRow label="Owner" value={bq.owner} />
                <InfoRow label="Created" value={bq.createdDate} mono />
              </CardContent>
            </Card>

            {/* Financials summary */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SectionLabel>Financials</SectionLabel>
                <Box sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block' }}>Value Inc-GST ({bq.currency})</Typography>
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '1.6rem', fontWeight: 700, color: '#7c3aed', mt: 0.3 }}>
                    {currSymbol} {bq.estimatedValueIncGST.toFixed(2)} Cr
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#97a3b5' }}>
                    Ex-GST: {currSymbol} {bq.estimatedValueExGST.toFixed(2)} Cr &nbsp;+&nbsp; {bq.gstPercent}% GST
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Deadline alert */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SectionLabel>Key Dates</SectionLabel>
                <InfoRow label="Submission Due" value={
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', fontWeight: 700, color: '#c07000' }}>
                    {bq.submissionDate}
                  </Typography>
                } />
                {bq.extendedDate && (
                  <InfoRow label="Extended To" value={
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', fontWeight: 700, color: '#c0392b' }}>
                      {bq.extendedDate}
                    </Typography>
                  } />
                )}
                <InfoRow label="Letter Date" value={bq.letterDate || '—'} mono />
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SectionLabel>Quick Actions</SectionLabel>
                <Stack spacing={1}>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(1)}>Update Stage</Button>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(3)}>View Competitors</Button>
                  <Button fullWidth variant="outlined" size="small" color="secondary"
                    onClick={() => navigate(`/leads/${bq.leadRef}`)}>
                    ← View Lead
                  </Button>
                  <Button fullWidth variant="outlined" size="small" color="secondary">
                    → Pass to Tender
                  </Button>
                  <Divider />
                  <Button fullWidth variant="text" size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate('/bq')}>
                    Back to BQs
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </Box>
    </AppShell>
  )
}
