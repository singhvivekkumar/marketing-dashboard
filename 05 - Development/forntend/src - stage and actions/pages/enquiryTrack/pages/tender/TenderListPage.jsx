import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Chip, TextField, MenuItem, InputAdornment, Button, Stack, Tooltip,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import AppShell from '../../components/Layout/AppShell'
import { mockTenders } from '../../data/mockTenders'

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

function daysLeft(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000)
}

export default function TenderListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [sector, setSector] = useState('All')
  const [market, setMarket] = useState('All')
  const [type,   setType]   = useState('All')

  const filtered = mockTenders.filter((t) => {
    const q = search.toLowerCase()
    const matchQ      = !q || t.projectName.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.leadRef.toLowerCase().includes(q)
    const matchStatus = status === 'All' || t.status === status
    const matchSector = sector === 'All' || t.sector === sector
    const matchMarket = market === 'All' || t.market === market
    const matchType   = type   === 'All' || t.tenderType === type
    return matchQ && matchStatus && matchSector && matchMarket && matchType
  })

  return (
    <AppShell topbarProps={{ title: 'Tender Management' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236' }}>Tenders</Typography>
            <Typography variant="body2" sx={{ color: '#5a6880', mt: 0.3 }}>{filtered.length} of {mockTenders.length} tenders</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/tender/new')}
              sx={{ backgroundColor: '#0e7c7b', '&:hover': { backgroundColor: '#0b6665' } }}>
              New Tender
            </Button>
          </Box>
        </Box>

        <Card sx={{ mb: 2, p: 2 }}>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <TextField size="small" placeholder="Search tender, project, lead ref…"
              value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 240 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#97a3b5' }} /></InputAdornment> }}
            />
            <TextField select size="small" label="Status" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ minWidth: 180 }}>
              {['All', 'Draft', 'Scope Study', 'Feasibility', 'Tech Head Approval', 'Core Committee Review', 'Participated', 'Not Participated', 'Passed to Bidding'].map((o) => (
                <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>
              ))}
            </TextField>
            <TextField select size="small" label="Sector" value={sector} onChange={(e) => setSector(e.target.value)} sx={{ minWidth: 130 }}>
              {['All', 'Defence', 'Non-Defence'].map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Market" value={market} onChange={(e) => setMarket(e.target.value)} sx={{ minWidth: 130 }}>
              {['All', 'Domestic', 'Export'].map((o) => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="Tender Type" value={type} onChange={(e) => setType(e.target.value)} sx={{ minWidth: 170 }}>
              {['All', 'Open', 'Closed / Limited', 'Single', 'Nomination', 'Two-Stage'].map((o) => (
                <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>
              ))}
            </TextField>
          </Stack>
        </Card>

        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tender Ref</TableCell>
                  <TableCell>Lead Ref</TableCell>
                  <TableCell>BQ Ref</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>EMD (₹ Cr)</TableCell>
                  <TableCell>Value Ex-GST</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Days Left</TableCell>
                  <TableCell>Participated</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((t) => {
                  const cs   = STATUS_CHIP[t.status] || STATUS_CHIP['Draft']
                  const days = daysLeft(t.extendedDate || t.submissionDate)
                  const isUrgent = days !== null && days <= 7 && days >= 0 && !['Passed to Bidding', 'Not Participated'].includes(t.status)
                  const isPast   = days !== null && days < 0  && !['Passed to Bidding', 'Not Participated'].includes(t.status)
                  const curr = t.currency === 'INR' ? '₹' : t.currency === 'GBP' ? '£' : '$'

                  return (
                    <TableRow key={t.id} onClick={() => navigate(`/tender/${t.id}`)}>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: '#0e7c7b', fontWeight: 600 }}>{t.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Lead">
                          <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#1a56a0', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline dotted' }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/leads/${t.leadRef}`) }}>{t.leadRef}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View BQ">
                          <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#7c3aed', fontWeight: 500, cursor: 'pointer', textDecoration: 'underline dotted' }}
                            onClick={(e) => { e.stopPropagation(); navigate(`/bq/${t.bqRef}`) }}>{t.bqRef}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell><Typography sx={{ fontWeight: 600, color: '#1a2236', fontSize: '0.82rem' }}>{t.projectName}</Typography></TableCell>
                      <TableCell>
                        <Tooltip title={t.customer}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#5a6880' }}>{t.customerShort}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip label={t.tenderType} size="small" sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: '#e6f6f6', color: '#0e7c7b', fontSize: '0.65rem' }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.78rem', color: '#1a2236', fontWeight: 500 }}>
                          {t.emdValue ? `₹ ${t.emdValue} Cr` : 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.82rem', fontWeight: 600, color: '#1a2236' }}>
                          {curr} {t.estimatedValueExGST.toFixed(2)} Cr
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: isUrgent ? '#c07000' : isPast ? '#c0392b' : '#5a6880', fontWeight: (isUrgent || isPast) ? 700 : 400 }}>
                          {t.extendedDate || t.submissionDate || '—'}
                          {t.extendedDate && (
                            <Chip label="Ext." size="small" sx={{ ml: 0.5, height: 14, fontSize: '0.58rem', backgroundColor: '#fef8e8', color: '#c07000' }} />
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {days !== null && !['Passed to Bidding', 'Not Participated'].includes(t.status) ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {isUrgent && <WarningAmberIcon sx={{ fontSize: 13, color: '#c07000' }} />}
                            <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: isUrgent ? '#c07000' : isPast ? '#c0392b' : '#5a6880', fontWeight: isUrgent ? 700 : 400 }}>
                              {isPast ? 'Overdue' : `${days}d`}
                            </Typography>
                          </Box>
                        ) : <Typography sx={{ fontSize: '0.72rem', color: '#c3ccd9' }}>—</Typography>}
                      </TableCell>
                      <TableCell>
                        <Chip label={t.participated ? 'Yes' : 'No'} size="small"
                          sx={{ fontFamily: "'JetBrains Mono'", backgroundColor: t.participated ? '#d4f0e5' : '#fde8e6', color: t.participated ? '#1b8a5a' : '#c0392b' }} />
                      </TableCell>
                      <TableCell><Chip label={t.status} size="small" sx={{ ...cs, fontFamily: "'JetBrains Mono'" }} /></TableCell>
                      <TableCell><Typography sx={{ fontSize: '0.78rem', color: '#1a2236' }}>{t.owner}</Typography></TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={13} sx={{ textAlign: 'center', py: 5, color: '#97a3b5' }}>No tenders match your filters.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </AppShell>
  )
}
