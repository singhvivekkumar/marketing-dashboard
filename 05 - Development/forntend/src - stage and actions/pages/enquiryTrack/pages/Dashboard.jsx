import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, Typography, Chip,
  LinearProgress, Divider,
} from '@mui/material'
import AppShell from '../components/Layout/AppShell'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined'

const MODULES = [
  {
    num: '01', label: 'Lead Creation', path: '/leads', color: '#1a56a0', bg: '#e8f0fb',
    icon: <ArticleOutlinedIcon />,
    desc: 'Capture EOI, RFI, customer enquiries. Manage go/no-go and internal approvals.',
    stats: [{ val: 24, label: 'Total' }, { val: 8, label: 'Reviewing' }, { val: 11, label: 'Go Decision' }],
    progress: 46,
  },
  {
    num: '02', label: 'Budgetary Quotation', path: '/bq', color: '#7c3aed', bg: '#f3eeff',
    icon: <RequestQuoteOutlinedIcon />,
    desc: 'Prepare indicative cost estimates. Fetch lead data by reference ID.',
    stats: [{ val: 9, label: 'Active BQs' }, { val: 3, label: 'Pending' }, { val: 6, label: 'Submitted' }],
    progress: 67,
  },
  {
    num: '03', label: 'Tender Management', path: '/tender', color: '#0e7c7b', bg: '#e6f6f6',
    icon: <DescriptionOutlinedIcon />,
    desc: 'Track RFP lifecycle through submission. Manage corrigenda and deadlines.',
    stats: [{ val: 7, label: 'Active' }, { val: 2, label: 'Due Soon' }, { val: 4, label: 'Submitted' }],
    progress: 57,
  },
  {
    num: '04', label: 'Bidding', path: '/bidding', color: '#b45309', bg: '#fef8e8',
    icon: <GavelOutlinedIcon />,
    desc: 'Manage bid pricing, L1 analysis and commercial negotiation tracking.',
    stats: [{ val: 5, label: 'Active Bids' }, { val: 2, label: 'Negotiating' }, { val: 3, label: 'L1 Position' }],
    progress: 60,
  },
  {
    num: '05', label: 'Order Acquisition', path: '/acquisition', color: '#0e7c61', bg: '#e6f6f1',
    icon: <EmojiEventsOutlinedIcon />,
    desc: 'Track LOI, LOA and PO receipt. Manage pre-order milestones and contracts.',
    stats: [{ val: 4, label: 'LOI Received' }, { val: 2, label: 'Negotiation' }, { val: 2, label: 'PO Received' }],
    progress: 50,
  },
  {
    num: '06', label: 'Order Received', path: '/order', color: '#c2410c', bg: '#fff0eb',
    icon: <Inventory2OutlinedIcon />,
    desc: 'Post-award delivery tracking. Manage milestones, inspections and invoicing.',
    stats: [{ val: 6, label: 'Active' }, { val: 1, label: 'Delayed' }, { val: 5, label: 'On Track' }],
    progress: 83,
  },
  {
    num: '07', label: 'Future Initiatives', path: '/future', color: '#be185d', bg: '#fce7f4',
    icon: <TravelExploreOutlinedIcon />,
    desc: 'Track strategic opportunities and long-horizon defence technology programmes.',
    stats: [{ val: 12, label: 'Tracked' }, { val: 4, label: 'Early Engage' }, { val: 5, label: 'Watch List' }],
    progress: 33,
  },
]

const SUMMARY = [
  { label: 'Pipeline Value', value: '₹ 802 Cr', sub: 'Active leads + BQs', color: '#1a56a0' },
  { label: 'Tenders Due (7d)', value: '3', sub: 'Urgent submissions', color: '#c2410c' },
  { label: 'Win Rate FY26', value: '42%', sub: 'vs 38% last FY', color: '#0e7c61' },
  { label: 'Orders YTD', value: '₹ 178 Cr', sub: '2 purchase orders', color: '#7c3aed' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <AppShell topbarProps={{}}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a2236', mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: '#5a6880' }}>
            Defence &amp; Civil Procurement · FY 2025–26 Overview
          </Typography>
        </Box>

        {/* Summary KPIs */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {SUMMARY.map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s.label}>
              <Card>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Typography variant="caption" sx={{ color: '#97a3b5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {s.label}
                  </Typography>
                  <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, mt: 0.5, fontFamily: "'JetBrains Mono'" }}>
                    {s.value}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <TrendingUpIcon sx={{ fontSize: 13, color: '#0e7c61' }} />
                    <Typography variant="caption" sx={{ color: '#5a6880' }}>{s.sub}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Module cards */}
        <Typography variant="overline" sx={{ color: '#97a3b5', fontSize: '0.7rem', letterSpacing: '0.1em', mb: 1.5, display: 'block' }}>
          All Modules
        </Typography>
        <Grid container spacing={2}>
          {MODULES.map((m) => (
            <Grid item xs={12} sm={6} lg={4} key={m.num}>
              <Card
                onClick={() => navigate(m.path)}
                sx={{
                  cursor: 'pointer', transition: 'all 0.18s ease',
                  borderTop: `3px solid ${m.color}`,
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
                }}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{
                      width: 38, height: 38, borderRadius: 2,
                      backgroundColor: m.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: m.color,
                    }}>
                      {m.icon}
                    </Box>
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', color: '#c3ccd9', fontWeight: 600 }}>
                      MOD {m.num}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontSize: '0.88rem', mb: 0.5, color: '#1a2236' }}>
                    {m.label}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#97a3b5', fontSize: '0.75rem', mb: 2, lineHeight: 1.5 }}>
                    {m.desc}
                  </Typography>

                  <Divider sx={{ mb: 1.5 }} />

                  <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
                    {m.stats.map((s) => (
                      <Box key={s.label}>
                        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '1.1rem', fontWeight: 700, color: m.color }}>
                          {s.val}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#97a3b5', display: 'block', fontSize: '0.67rem' }}>
                          {s.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#97a3b5' }}>Pipeline progress</Typography>
                      <Typography variant="caption" sx={{ color: m.color, fontWeight: 600, fontFamily: "'JetBrains Mono'" }}>
                        {m.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={m.progress}
                      sx={{
                        height: 4, borderRadius: 2,
                        backgroundColor: m.bg,
                        '& .MuiLinearProgress-bar': { backgroundColor: m.color, borderRadius: 2 },
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AppShell>
  )
}
