import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Typography, Box, Chip, Breadcrumbs, Link,
  IconButton, Avatar, Badge,
} from '@mui/material'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'

const ROUTE_META = {
  '/':            { label: 'Dashboard',             tag: 'PORTAL',  tagColor: '#1a56a0' },
  '/leads':       { label: 'Lead Creation',          tag: 'MOD 01', tagColor: '#1a56a0' },
  '/leads/new':   { label: 'New Lead',               tag: 'MOD 01', tagColor: '#1a56a0' },
  '/bq':          { label: 'Budgetary Quotation',    tag: 'MOD 02', tagColor: '#7c3aed' },
  '/tender':      { label: 'Tender Management',      tag: 'MOD 03', tagColor: '#0e7c7b' },
  '/bidding':     { label: 'Bidding',                tag: 'MOD 04', tagColor: '#b45309' },
  '/acquisition': { label: 'Order Acquisition',      tag: 'MOD 05', tagColor: '#0e7c61' },
  '/order':       { label: 'Order Received',         tag: 'MOD 06', tagColor: '#c2410c' },
  '/future':      { label: 'Future Initiatives',     tag: 'MOD 07', tagColor: '#be185d' },
}

export default function Topbar({ title, crumbs }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const baseRoute = '/' + pathname.split('/')[1]
  const meta = ROUTE_META[pathname] || ROUTE_META[baseRoute] || { label: 'Portal', tag: 'BMS', tagColor: '#1a56a0' }
  const displayTitle = title || meta.label

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#fff',
        borderBottom: '1px solid #dde3ed',
        color: '#1a2236',
        zIndex: 1100,
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 56, px: 3, gap: 2 }}>
        {/* Module tag + title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Chip
            label={meta.tag}
            size="small"
            sx={{
              fontFamily: "'JetBrains Mono'",
              fontSize: '0.62rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              height: 22,
              borderRadius: '4px',
              backgroundColor: `${meta.tagColor}15`,
              color: meta.tagColor,
              border: `1px solid ${meta.tagColor}40`,
            }}
          />
          {crumbs ? (
            <Breadcrumbs separator={<NavigateNextIcon fontSize="inherit" sx={{ color: '#c3ccd9' }} />} sx={{ '& .MuiBreadcrumbs-ol': { flexWrap: 'nowrap' } }}>
              {crumbs.map((c, i) =>
                i < crumbs.length - 1 ? (
                  <Link key={i} underline="hover" sx={{ fontSize: '0.82rem', color: '#5a6880', cursor: 'pointer' }} onClick={c.onClick}>
                    {c.label}
                  </Link>
                ) : (
                  <Typography key={i} sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1a2236' }}>
                    {c.label}
                  </Typography>
                )
              )}
            </Breadcrumbs>
          ) : (
            <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#1a2236' }}>
              {displayTitle}
            </Typography>
          )}
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          {baseRoute === '/leads' && pathname !== '/leads/new' && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate('/leads/new')}
              sx={{ mr: 1 }}
            >
              New Lead
            </Button>
          )}
          <IconButton size="small" sx={{ color: '#5a6880' }}>
            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 14, minWidth: 14 } }}>
              <NotificationsNoneIcon fontSize="small" />
            </Badge>
          </IconButton>
          <Avatar
            sx={{ width: 30, height: 30, fontSize: '0.72rem', fontWeight: 700, backgroundColor: '#1a56a0', cursor: 'pointer' }}
          >
            RK
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
