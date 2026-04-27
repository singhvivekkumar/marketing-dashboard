import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Chip, Tabs, Tab,
  Divider, Paper, Stack, Button, Alert,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AppShell from '../../components/Layout/AppShell'
import StageTracker from './components/StageTracker'
import StageActionPanel from './components/StageActionPanel'
import TechAnalysisTab from './components/TechAnalysisTab'
import ApprovalsTab from './components/ApprovalsTab'
import AuditLogTab from './components/AuditLogTab'
import { mockLeads, LEAD_STAGES } from '../../data/mockLeads'

const STATUS_COLORS = {
  'Go Decision':       { bg: '#d4f0e5', color: '#1b8a5a' },
  'Passed to Tender':  { bg: '#d4f0e5', color: '#1b8a5a' },
  'Under Review':      { bg: '#fef8e8', color: '#c07000' },
  'Decision Pending':  { bg: '#fef8e8', color: '#c07000' },
  'No-Go':             { bg: '#fde8e6', color: '#c0392b' },
  'New':               { bg: '#e8f0fb', color: '#1a56a0' },
}

function InfoRow({ label, value, mono }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1, borderBottom: '1px solid #eaeff6' }}>
      <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.07em', mt: 0.2 }}>
        {label}
      </Typography>
      <Typography sx={{
        fontSize: '0.82rem', color: '#1a2236', textAlign: 'right', maxWidth: '60%',
        fontFamily: mono ? "'JetBrains Mono'" : 'inherit',
        fontWeight: mono ? 500 : 400,
      }}>
        {value || '—'}
      </Typography>
    </Box>
  )
}

export default function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(0)

  const lead = mockLeads.find((l) => l.id === id)

  if (!lead) {
    return (
      <AppShell>
        <Box sx={{ p: 4 }}>
          <Alert severity="error">Lead not found: {id}</Alert>
          <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => navigate('/leads')}>
            Back to Leads
          </Button>
        </Box>
      </AppShell>
    )
  }

  const statusStyle = STATUS_COLORS[lead.status] || STATUS_COLORS['New']
  const crumbs = [
    { label: 'Leads', onClick: () => navigate('/leads') },
    { label: `${lead.id} — ${lead.projectName}` },
  ]

  return (
    <AppShell topbarProps={{ crumbs }}>
      <Box sx={{ p: 3 }}>
        <Grid container spacing={2.5}>

          {/* ── MAIN COLUMN ── */}
          <Grid item xs={12} lg={8}>

            {/* Header card */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Stack direction="row" spacing={1} alignItems="center" mb={1.5} flexWrap="wrap">
                  <Chip
                    label={lead.leadType} size="small"
                    sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#e8f0fb', color: '#1a56a0' }}
                  />
                  <Chip
                    label={lead.sector} size="small"
                    sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: lead.sector === 'Defence' ? '#fef8e8' : '#f0f3f8', color: lead.sector === 'Defence' ? '#c07000' : '#5a6880' }}
                  />
                  <Chip
                    label={lead.market} size="small"
                    sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#f3eeff', color: '#7c3aed' }}
                  />
                  <Chip
                    label={lead.status} size="small"
                    sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: statusStyle.bg, color: statusStyle.color }}
                  />
                  <Box sx={{ ml: 'auto' }}>
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#97a3b5' }}>
                      {lead.id}
                    </Typography>
                  </Box>
                </Stack>

                <Typography variant="h5" sx={{ color: '#1a2236', mb: 0.5 }}>
                  {lead.projectName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5a6880' }}>
                  {lead.customer} &nbsp;·&nbsp; {lead.domain} &nbsp;·&nbsp; {lead.tenderType} Tender
                </Typography>

                {/* Stage tracker */}
                <Box sx={{ mt: 3, mb: 1 }}>
                  <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
                    Stage Progress
                  </Typography>
                  <StageTracker currentStage={lead.currentStage} status={lead.status} />
                </Box>
              </CardContent>
            </Card>

            {/* Tabbed card */}
            <Card>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{
                  px: 2, borderBottom: '1px solid #dde3ed',
                  '& .MuiTabs-flexContainer': { gap: 0.5 },
                }}
              >
                <Tab label="Overview" />
                <Tab label="Stage & Actions" />
                <Tab label="Tech Analysis" />
                <Tab label="Approvals" />
                <Tab label="Audit Log" />
              </Tabs>

              <CardContent sx={{ p: 2.5 }}>
                {/* OVERVIEW */}
                {tab === 0 && (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
                          Basic Information
                        </Typography>
                        <InfoRow label="Project Name" value={lead.projectName} />
                        <InfoRow label="Reference #" value={lead.id} mono />
                        <InfoRow label="Enquiry Ref" value={lead.enquiryRef} mono />
                        <InfoRow label="Enquiry Date" value={lead.enquiryDate} mono />
                        <InfoRow label="Lead Type" value={lead.leadType} />
                        <InfoRow label="Lead Owner" value={lead.owner} />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
                          Customer Details
                        </Typography>
                        <InfoRow label="Customer" value={lead.customer} />
                        <InfoRow label="Contact Person" value={lead.contactPerson} />
                        <InfoRow label="Email" value={lead.contactEmail} mono />
                        <InfoRow label="Phone" value={lead.contactPhone} mono />
                      </Grid>
                      <Grid item xs={12}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
                          Classification
                        </Typography>
                        <Grid container spacing={1}>
                          {[
                            ['Sector', lead.sector], ['Market', lead.market],
                            ['Tender Type', lead.tenderType], ['Domain', lead.domain],
                          ].map(([k, v]) => (
                            <Grid item xs={6} sm={3} key={k}>
                              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', borderRadius: 2 }}>
                                <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block', mb: 0.3 }}>{k}</Typography>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a2236' }}>{v}</Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1 }}>
                          Remarks
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, backgroundColor: '#f8fafd' }}>
                          <Typography variant="body2" sx={{ color: '#5a6880', lineHeight: 1.7 }}>
                            {lead.remarks}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', gap: 1.5, mt: 3 }}>
                      <Button variant="outlined" startIcon={<EditOutlinedIcon />}>Edit Details</Button>
                      <Button variant="contained" onClick={() => setTab(1)}>Update Stage →</Button>
                    </Box>
                  </Box>
                )}

                {/* STAGE & ACTIONS */}
                {tab === 1 && <StageActionPanel lead={lead} />}

                {/* TECH ANALYSIS */}
                {tab === 2 && <TechAnalysisTab lead={lead} />}

                {/* APPROVALS */}
                {tab === 3 && <ApprovalsTab lead={lead} />}

                {/* AUDIT LOG */}
                {tab === 4 && <AuditLogTab lead={lead} />}
              </CardContent>
            </Card>
          </Grid>

          {/* ── SIDEBAR COLUMN ── */}
          <Grid item xs={12} lg={4}>
            {/* Lead info card */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
                  Lead Info
                </Typography>
                <InfoRow label="Status" value={
                  <Chip label={lead.status} size="small" sx={{ fontFamily: "'JetBrains Mono'", ...statusStyle }} />
                } />
                <InfoRow label="Stage" value={LEAD_STAGES[lead.currentStage]} />
                <InfoRow label="Owner" value={lead.owner} />
                <InfoRow label="Created" value={lead.createdAt} mono />
                <InfoRow label="Updated" value={lead.updatedAt} mono />
                {lead.passedTo && (
                  <InfoRow label="Passed To" value={lead.passedTo + ' Module'} />
                )}
              </CardContent>
            </Card>

            {/* Key dates */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
                  Key Dates
                </Typography>
                <InfoRow label="Enquiry Date" value={lead.enquiryDate} mono />
                <InfoRow
                  label="Response Deadline"
                  value={
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', color: '#c07000', fontWeight: 600 }}>
                      {lead.responseDeadline}
                    </Typography>
                  }
                />
                <InfoRow
                  label="Est. Value"
                  value={
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.85rem', color: '#1a56a0', fontWeight: 700 }}>
                      ₹ {lead.estimatedValue} Cr
                    </Typography>
                  }
                />
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.65rem', letterSpacing: '0.1em', display: 'block', mb: 1.5 }}>
                  Quick Actions
                </Typography>
                <Stack spacing={1}>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(1)}>
                    Update Stage
                  </Button>
                  <Button fullWidth variant="outlined" size="small" onClick={() => setTab(3)}>
                    View Approvals
                  </Button>
                  <Button fullWidth variant="outlined" size="small" color="secondary" onClick={() => setTab(1)}>
                    → Pass to Tender
                  </Button>
                  <Button fullWidth variant="outlined" size="small" color="error" onClick={() => setTab(1)}>
                    Mark No-Go
                  </Button>
                  <Divider />
                  <Button fullWidth variant="text" size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate('/leads')}>
                    Back to Leads
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
