import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Chip, Tabs, Tab,
  Divider, Paper, Stack, Button, Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import BlockIcon from '@mui/icons-material/Block'
import AppShell from '../../components/Layout/AppShell'
import TenderStageTracker from './components/TenderStageTracker'
import TenderStageActionPanel from './components/TenderStageActionPanel'
import CoreCommitteeTab from './components/CoreCommitteeTab'
import CorrigendaTab from './components/CorrigendaTab'
import TenderCompetitorsTab from './components/TenderCompetitorsTab'
import DocumentsTab from './components/DocumentsTab'
import TenderAuditLogTab from './components/TenderAuditLogTab'
import { mockTenders, TENDER_STAGES } from '../../data/mockTenders'

const STATUS_CHIP = {
  Draft:                   { bg: '#f0f3f8',  color: '#5a6880'  },
  'Scope Study':           { bg: '#e8f0fb',  color: '#1a56a0'  },
  Feasibility:             { bg: '#fef8e8',  color: '#c07000'  },
  'Tech Head Approval':    { bg: '#fef3da',  color: '#b45309'  },
  'Core Committee Review': { bg: '#f3eeff',  color: '#7c3aed'  },
  Participated:            { bg: '#d4f0e5',  color: '#1b8a5a'  },
  'Not Participated':      { bg: '#fde8e6',  color: '#c0392b'  },
  'Passed to Bidding':     { bg: '#d4f0e5',  color: '#1b8a5a'  },
}

function InfoRow({ label, value, mono, accent, warn }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 0.9, borderBottom: '1px solid #eaeff6' }}>
      <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.07em', mt: 0.2, flexShrink: 0 }}>
        {label}
      </Typography>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography sx={{
          fontSize: '0.82rem',
          color: accent ? '#0e7c7b' : warn ? '#c07000' : '#1a2236',
          fontFamily: mono ? "'JetBrains Mono'" : 'inherit',
          fontWeight: (mono || accent || warn) ? 600 : 400,
          textAlign: 'right', maxWidth: '65%',
        }}>
          {value || '—'}
        </Typography>
      ) : value}
    </Box>
  )
}

function SL({ children }) {
  return (
    <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1.2 }}>
      {children}
    </Typography>
  )
}

export default function TenderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const tender = mockTenders.find((t) => t.id === id)

  if (!tender) return (
    <AppShell>
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Tender not found: {id}</Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate('/tender')}>Back</Button>
      </Box>
    </AppShell>
  )

  const cs   = STATUS_CHIP[tender.status] || STATUS_CHIP['Draft']
  const curr = tender.currency === 'INR' ? '₹' : tender.currency === 'GBP' ? '£' : '$'
  const teal = '#0e7c7b'
  const crumbs = [
    { label: 'Tender Management', onClick: () => navigate('/tender') },
    { label: `${tender.id} — ${tender.projectName}` },
  ]

  return (
    <AppShell topbarProps={{ crumbs }}>
      <Box sx={{ p: 3 }}>

        {/* Not Participating banner */}
        {!tender.participated && (
          <Paper variant="outlined" sx={{ p: 2, mb: 2.5, borderColor: '#f5c6c3', backgroundColor: '#fffbfb', borderRadius: 2, display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <BlockIcon sx={{ color: '#c0392b', fontSize: 20, mt: 0.2 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#c0392b', fontWeight: 700 }}>Not Participating in this Tender</Typography>
              <Typography variant="body2" sx={{ color: '#5a6880', mt: 0.4, lineHeight: 1.6 }}>{tender.notParticipationReason}</Typography>
            </Box>
          </Paper>
        )}

        <Grid container spacing={2.5}>

          {/* ── MAIN ── */}
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1.5} flexWrap="wrap">
                  <Chip label="TENDER" size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#e6f6f6', color: teal }} />
                  <Chip label={tender.tenderType} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#f0f3f8', color: '#5a6880' }} />
                  <Chip label={tender.customerType} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: tender.customerType === 'Internal' ? '#e6f6f1' : '#fef8e8', color: tender.customerType === 'Internal' ? '#0e7c61' : '#c07000' }} />
                  <Chip label={tender.sector} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: tender.sector === 'Defence' ? '#fef3da' : '#f0f3f8', color: tender.sector === 'Defence' ? '#b45309' : '#5a6880' }} />
                  <Chip label={tender.status} size="small" sx={{ ...cs, fontFamily: "'JetBrains Mono'" }} />
                  <Chip label={tender.participated ? 'Participating' : 'Not Participating'} size="small"
                    sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: tender.participated ? '#d4f0e5' : '#fde8e6', color: tender.participated ? '#1b8a5a' : '#c0392b' }} />
                  <Box sx={{ ml: 'auto' }}>
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#97a3b5' }}>{tender.id}</Typography>
                  </Box>
                </Stack>

                <Typography variant="h5" sx={{ color: '#1a2236', mb: 0.4 }}>{tender.projectName}</Typography>
                <Typography variant="body2" sx={{ color: '#5a6880', mb: 0.5 }}>
                  {tender.customer} &nbsp;·&nbsp; {tender.domain} &nbsp;·&nbsp; {tender.market}
                </Typography>

                <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mt: 1 }}>
                  {[
                    { label: 'Lead', ref: tender.leadRef, color: '#1a56a0', path: `/leads/${tender.leadRef}` },
                    { label: 'BQ',   ref: tender.bqRef,   color: '#7c3aed', path: `/bq/${tender.bqRef}`     },
                  ].map(({ label, ref, color, path }) => (
                    <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, cursor: 'pointer' }} onClick={() => navigate(path)}>
                      <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#97a3b5' }}>{label}:</Typography>
                      <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color, fontWeight: 600, textDecoration: 'underline dotted' }}>{ref}</Typography>
                      <OpenInNewIcon sx={{ fontSize: 11, color: '#97a3b5' }} />
                    </Box>
                  ))}
                </Stack>

                <Box sx={{ mt: 3, mb: 1 }}>
                  <SL>Stage Progress</SL>
                  <TenderStageTracker currentStage={tender.currentStage} participated={tender.participated} />
                </Box>
              </CardContent>
            </Card>

            <Card>
              <Tabs value={tab} onChange={(_, v) => setTab(v)}
                sx={{ px: 2, borderBottom: '1px solid #dde3ed', '& .MuiTabs-flexContainer': { gap: 0.5 } }}
                variant="scrollable" scrollButtons="auto">
                <Tab label="Overview" />
                <Tab label="Stage & Actions" />
                <Tab label="Core Committee" />
                <Tab label="Corrigenda" />
                <Tab label="Competitors" />
                <Tab label="Documents" />
                <Tab label="Audit Log" />
              </Tabs>

              <CardContent sx={{ p: 2.5 }}>

                {/* OVERVIEW */}
                {tab === 0 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <SL>Linked References</SL>
                        <InfoRow label="Lead Ref"    value={tender.leadRef}    mono accent />
                        <InfoRow label="BQ Ref"      value={tender.bqRef}      mono />
                        <InfoRow label="Tender Ref"  value={tender.id}         mono />
                        <InfoRow label="RFP Ref"     value={tender.tenderRefNo} mono />
                        <InfoRow label="Tender Type" value={tender.tenderType} />
                        <InfoRow label="Cust. Type"  value={tender.customerType} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <SL>Customer Details</SL>
                        <InfoRow label="Customer" value={tender.customer} />
                        <InfoRow label="Contact"  value={tender.contactPerson} />
                        <InfoRow label="Email"    value={tender.contactEmail} mono />
                        <InfoRow label="Sector"   value={tender.sector} />
                        <InfoRow label="Market"   value={tender.market} />
                        <InfoRow label="Domain"   value={tender.domain} />
                      </Grid>

                      <Grid item xs={12}><Divider /></Grid>

                      <Grid item xs={12}>
                        <SL>Financial Details</SL>
                        <Grid container spacing={1.5}>
                          {[
                            { label: 'EMD Value',    value: tender.emdValue ? `₹ ${tender.emdValue} Cr` : 'N/A' },
                            { label: 'EMD Mode',     value: tender.emdMode },
                            { label: 'Value Ex-GST', value: `${curr} ${tender.estimatedValueExGST.toFixed(2)} Cr` },
                            { label: 'GST',          value: `${tender.gstPercent}%` },
                            { label: 'Value Inc-GST',value: `${curr} ${tender.estimatedValueIncGST.toFixed(2)} Cr` },
                            { label: 'Currency',     value: tender.currency },
                          ].map(({ label, value }) => (
                            <Grid item xs={6} sm={4} key={label}>
                              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block', mb: 0.3 }}>{label}</Typography>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a2236', fontFamily: "'JetBrains Mono'" }}>{value}</Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>

                      <Grid item xs={12}><Divider /></Grid>

                      <Grid item xs={12}>
                        <SL>Key Dates</SL>
                        <Grid container spacing={1.5}>
                          {[
                            { label: 'RFP Received',      value: tender.rfpReceivedDate,      warn: false },
                            { label: 'Pre-Bid Meeting',    value: tender.preBidMeetingDate,    warn: false },
                            { label: 'Query Deadline',     value: tender.queryDeadlineDate,    warn: false },
                            { label: 'Submission Due',     value: tender.submissionDate,       warn: true  },
                            { label: 'Extended Date',      value: tender.extendedDate || '—',  warn: !!tender.extendedDate },
                            { label: 'Technical Opening',  value: tender.technicalOpeningDate, warn: false },
                            { label: 'Commercial Opening', value: tender.commercialOpeningDate,warn: false },
                          ].map(({ label, value, warn }) => (
                            <Grid item xs={6} sm={4} key={label}>
                              <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block', mb: 0.3 }}>{label}</Typography>
                                <Typography sx={{ fontSize: '0.8rem', fontWeight: warn && value && value !== '—' ? 700 : 400, fontFamily: "'JetBrains Mono'", color: warn && value && value !== '—' ? '#c07000' : '#1a2236' }}>
                                  {value || '—'}
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>

                      {tender.scopeSummary && (
                        <Grid item xs={12}>
                          <Divider sx={{ mb: 2 }} />
                          <SL>Scope of Work</SL>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafd' }}>
                            <Typography variant="body2" sx={{ color: '#5a6880', lineHeight: 1.7 }}>{tender.scopeSummary}</Typography>
                          </Paper>
                        </Grid>
                      )}

                      {tender.tenderSummary && (
                        <Grid item xs={12}>
                          <SL>Tender Summary (Core Committee)</SL>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#faf5ff' }}>
                            <Typography variant="body2" sx={{ color: '#5a6880', lineHeight: 1.7 }}>{tender.tenderSummary}</Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                      <Button variant="outlined" startIcon={<EditOutlinedIcon />}>Edit Tender</Button>
                      <Button variant="contained" onClick={() => setTab(1)} sx={{ backgroundColor: teal, '&:hover': { backgroundColor: '#0b6665' } }}>
                        Update Stage →
                      </Button>
                    </Box>
                  </Box>
                )}

                {tab === 1 && <TenderStageActionPanel tender={tender} />}
                {tab === 2 && <CoreCommitteeTab tender={tender} />}
                {tab === 3 && <CorrigendaTab tender={tender} />}
                {tab === 4 && <TenderCompetitorsTab tender={tender} />}
                {tab === 5 && <DocumentsTab tender={tender} />}
                {tab === 6 && <TenderAuditLogTab tender={tender} />}

              </CardContent>
            </Card>
          </Grid>

          {/* ── SIDEBAR ── */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SL>Tender Info</SL>
                <InfoRow label="Tender Ref" value={tender.id} mono accent />
                <InfoRow label="Lead Ref"   value={tender.leadRef} mono />
                <InfoRow label="BQ Ref"     value={tender.bqRef} mono />
                <InfoRow label="Status"     value={<Chip label={tender.status} size="small" sx={{ ...cs, fontFamily: "'JetBrains Mono'" }} />} />
                <InfoRow label="Stage"      value={TENDER_STAGES[tender.currentStage]} />
                <InfoRow label="Owner"      value={tender.owner} />
                <InfoRow label="Created"    value={tender.createdDate} mono />
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SL>Financials</SL>
                <Box sx={{ textAlign: 'center', py: 1.5 }}>
                  <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block' }}>Value Inc-GST ({tender.currency})</Typography>
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '1.55rem', fontWeight: 700, color: teal, mt: 0.3 }}>
                    {curr} {tender.estimatedValueIncGST.toFixed(2)} Cr
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#97a3b5' }}>
                    Ex-GST: {curr} {tender.estimatedValueExGST.toFixed(2)} Cr + {tender.gstPercent}% GST
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <InfoRow label="EMD"      value={tender.emdValue ? `₹ ${tender.emdValue} Cr` : 'N/A'} mono />
                <InfoRow label="EMD Mode" value={tender.emdMode} />
              </CardContent>
            </Card>

            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SL>Submission Dates</SL>
                <InfoRow label="Due Date" value={
                  <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', fontWeight: 700, color: '#c07000' }}>
                    {tender.submissionDate}
                  </Typography>
                } />
                {tender.extendedDate && (
                  <InfoRow label="Extended To" value={
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', fontWeight: 700, color: '#c0392b' }}>
                      {tender.extendedDate}
                    </Typography>
                  } />
                )}
                <InfoRow label="Tech Opening" value={tender.technicalOpeningDate || '—'} mono />
                <InfoRow label="Comm. Opening" value={tender.commercialOpeningDate || '—'} mono />
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <SL>Quick Actions</SL>
                <Stack spacing={1}>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(1)}>Update Stage</Button>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(2)}>Core Committee</Button>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(3)}>Corrigenda ({tender.corrigenda.length})</Button>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(5)}>Documents ({tender.documents.length})</Button>
                  <Button fullWidth variant="outlined" size="small" sx={{ borderColor: teal, color: teal }} onClick={() => navigate(`/leads/${tender.leadRef}`)}>← View Lead</Button>
                  <Button fullWidth variant="outlined" size="small" sx={{ borderColor: teal, color: teal }} onClick={() => navigate(`/bq/${tender.bqRef}`)}>← View BQ</Button>
                  {tender.participated && tender.currentStage >= 3 && tender.status !== 'Passed to Bidding' && (
                    <Button fullWidth variant="contained" size="small" sx={{ backgroundColor: teal, '&:hover': { backgroundColor: '#0b6665' } }}>
                      → Pass to Bidding
                    </Button>
                  )}
                  <Divider />
                  <Button fullWidth variant="text" size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate('/tender')}>
                    Back to Tenders
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
