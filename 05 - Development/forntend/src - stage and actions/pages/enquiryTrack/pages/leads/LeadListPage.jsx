import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Card, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, TextField, MenuItem,
  InputAdornment, Button, Tooltip, Stack,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import AppShell from '../../components/Layout/AppShell'
import { mockLeads } from '../../data/mockLeads'

const STATUS_CHIP = {
  'Go Decision':        { sx: { bg: '#d4f0e5', color: '#1b8a5a' } },
  'Passed to Tender':   { sx: { bg: '#d4f0e5', color: '#1b8a5a' } },
  'Passed to BQ':       { sx: { bg: '#d4f0e5', color: '#1b8a5a' } },
  'Under Review':       { sx: { bg: '#fef8e8', color: '#c07000' } },
  'Decision Pending':   { sx: { bg: '#fef8e8', color: '#c07000' } },
  'No-Go':              { sx: { bg: '#fde8e6', color: '#c0392b' } },
  'New':                { sx: { bg: '#e8f0fb', color: '#1a56a0' } },
}

const TYPE_CHIP = {
  'EOI':           { bg: '#e8f0fb', color: '#1a56a0' },
  'RFI':           { bg: '#f3eeff', color: '#7c3aed' },
  'Customer Input':{ bg: '#e6f6f6', color: '#0e7c7b' },
}

export default function LeadListPage() {
  const navigate = useNavigate()
  const [search, setSearch]     = useState('')
  const [sector, setSector]     = useState('All')
  const [type, setType]         = useState('All')
  const [market, setMarket]     = useState('All')
  const [status, setStatus]     = useState('All')
  const [owner, setOwner]       = useState('All')

  const filtered = mockLeads.filter((l) => {
    const q = search.toLowerCase()
    const matchQ = !q || l.projectName.toLowerCase().includes(q) || l.customerShort.toLowerCase().includes(q) || l.id.toLowerCase().includes(q)
    const matchSector = sector === 'All' || l.sector === sector
    const matchType   = type === 'All'   || l.leadType === type
    const matchMarket = market === 'All' || l.market === market
    const matchStatus = status === 'All' || l.status === status
    const matchOwner  = owner === 'All'  || l.owner === owner
    return matchQ && matchSector && matchType && matchMarket && matchStatus && matchOwner
  })

  return (
    <AppShell topbarProps={{ title: 'Lead Creation' }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236' }}>Leads</Typography>
            <Typography variant="body2" sx={{ color: '#5a6880', mt: 0.3 }}>
              {filtered.length} of {mockLeads.length} leads
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/leads/new')}
            >
              New Lead
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <TextField
              size="small" placeholder="Search project, customer, ref…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#97a3b5' }} /></InputAdornment>,
              }}
            />
            <TextField select size="small" value={sector} onChange={(e) => setSector(e.target.value)} label="Sector" sx={{ minWidth: 130 }}>
              {['All', 'Defence', 'Non-Defence'].map(o => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
            <TextField select size="small" value={type} onChange={(e) => setType(e.target.value)} label="Lead Type" sx={{ minWidth: 140 }}>
              {['All', 'EOI', 'RFI', 'Customer Input'].map(o => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
            <TextField select size="small" value={market} onChange={(e) => setMarket(e.target.value)} label="Market" sx={{ minWidth: 120 }}>
              {['All', 'Domestic', 'Export'].map(o => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
            <TextField select size="small" value={status} onChange={(e) => setStatus(e.target.value)} label="Status" sx={{ minWidth: 160 }}>
              {['All', 'New', 'Under Review', 'Decision Pending', 'Go Decision', 'No-Go', 'Passed to BQ', 'Passed to Tender'].map(o => (
                <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>
              ))}
            </TextField>
            <TextField select size="small" value={owner} onChange={(e) => setOwner(e.target.value)} label="Owner" sx={{ minWidth: 140 }}>
              {['All', 'Ravi Kumar', 'Sunita Menon', 'Amit Shah', 'Priya Nair'].map(o => <MenuItem key={o} value={o} sx={{ fontSize: '0.82rem' }}>{o}</MenuItem>)}
            </TextField>
          </Stack>
        </Card>

        {/* Table */}
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ref #</TableCell>
                  <TableCell>Project Name</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Sector</TableCell>
                  <TableCell>Market</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Value (₹ Cr)</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((lead) => {
                  const statusStyle = (STATUS_CHIP[lead.status] || STATUS_CHIP['New']).sx
                  const typeStyle = TYPE_CHIP[lead.leadType] || TYPE_CHIP['EOI']
                  return (
                    <TableRow key={lead.id} onClick={() => navigate(`/leads/${lead.id}`)}>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.75rem', color: '#1a56a0', fontWeight: 600 }}>
                          {lead.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 600, color: '#1a2236', fontSize: '0.82rem' }}>
                          {lead.projectName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={lead.customer}>
                          <Typography sx={{ fontSize: '0.82rem', color: '#5a6880' }}>{lead.customerShort}</Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip label={lead.leadType} size="small" sx={{ ...typeStyle, fontFamily: "'JetBrains Mono'" }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={lead.sector} size="small"
                          sx={{
                            fontFamily: "'JetBrains Mono'",
                            backgroundColor: lead.sector === 'Defence' ? '#fef8e8' : '#f0f3f8',
                            color: lead.sector === 'Defence' ? '#c07000' : '#5a6880',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#5a6880' }}>{lead.market}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#5a6880' }}>{lead.domain}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={lead.status} size="small" sx={{ ...statusStyle, fontFamily: "'JetBrains Mono'" }} />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.78rem', color: '#1a2236' }}>{lead.owner}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.78rem', color: '#1a2236', fontWeight: 600 }}>
                          {lead.estimatedValue}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.72rem', color: '#97a3b5' }}>
                          {lead.createdAt}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} sx={{ textAlign: 'center', py: 5, color: '#97a3b5' }}>
                      No leads match your filters.
                    </TableCell>
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
