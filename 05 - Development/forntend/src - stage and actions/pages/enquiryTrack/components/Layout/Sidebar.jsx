import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Chip, Tooltip,
} from '@mui/material'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'

const SIDEBAR_WIDTH = 228

const MODULES = [
  { label: 'Lead Creation',        path: '/leads',       icon: <ArticleOutlinedIcon fontSize="small" />,        color: '#1a56a0', num: '01', badge: 24 },
  { label: 'Budgetary Quotation',  path: '/bq',          icon: <RequestQuoteOutlinedIcon fontSize="small" />,   color: '#7c3aed', num: '02', badge: 9 },
  { label: 'Tender Management',    path: '/tender',      icon: <DescriptionOutlinedIcon fontSize="small" />,    color: '#0e7c7b', num: '03', badge: 7 },
  { label: 'Bidding',              path: '/bidding',     icon: <GavelOutlinedIcon fontSize="small" />,          color: '#b45309', num: '04', badge: 5 },
  { label: 'Order Acquisition',    path: '/acquisition', icon: <EmojiEventsOutlinedIcon fontSize="small" />,    color: '#0e7c61', num: '05', badge: 4 },
  { label: 'Order Received',       path: '/order',       icon: <Inventory2OutlinedIcon fontSize="small" />,     color: '#c2410c', num: '06', badge: 6 },
  { label: 'Future Initiatives',   path: '/future',      icon: <TravelExploreOutlinedIcon fontSize="small" />,  color: '#be185d', num: '07', badge: 12 },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path) => pathname.startsWith(path)

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: SIDEBAR_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#fff',
          borderRight: '1px solid #dde3ed',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #dde3ed' }}>
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.8,
          mb: 0.8,
        }}>
          <Box sx={{
            width: 28, height: 28, borderRadius: 1.5,
            background: 'linear-gradient(135deg, #1a56a0 0%, #0e7c61 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ color: '#fff', fontFamily: "'JetBrains Mono'", fontWeight: 700, fontSize: '0.7rem' }}>
              BMS
            </Typography>
          </Box>
        </Box>
        <Typography variant="subtitle1" sx={{ fontSize: '0.85rem', fontWeight: 700, color: '#1a2236', lineHeight: 1.2 }}>
          Marketing Portal
        </Typography>
        <Typography variant="caption" sx={{ color: '#97a3b5', fontSize: '0.68rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Bidding Mgmt System
        </Typography>
      </Box>

      {/* Dashboard */}
      <List dense sx={{ px: 1, pt: 1.5, pb: 0 }}>
        <ListItemButton
          selected={pathname === '/'}
          onClick={() => navigate('/')}
          sx={{ py: 0.9, px: 1.5, mb: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 32, color: pathname === '/' ? '#1a56a0' : '#97a3b5' }}>
            <DashboardOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: pathname === '/' ? 600 : 400 }}
          />
        </ListItemButton>
      </List>

      <Divider sx={{ mx: 2, my: 1 }} />

      {/* Section Label */}
      <Typography variant="overline" sx={{ px: 2.5, color: '#97a3b5', fontSize: '0.62rem', letterSpacing: '0.1em' }}>
        Modules
      </Typography>

      <List dense sx={{ px: 1, pt: 0.5 }}>
        {MODULES.map((m) => {
          const active = isActive(m.path)
          return (
            <Tooltip key={m.path} title={m.label} placement="right" disableHoverListener>
              <ListItemButton
                selected={active}
                onClick={() => navigate(m.path)}
                sx={{
                  py: 0.85, px: 1.5, mb: 0.5,
                  borderLeft: active ? `3px solid ${m.color}` : '3px solid transparent',
                  '&.Mui-selected': {
                    backgroundColor: `${m.color}12`,
                    '& .MuiListItemText-primary': { color: m.color },
                    '& .MuiListItemIcon-root': { color: m.color },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 30, color: active ? m.color : '#97a3b5' }}>
                  {m.icon}
                </ListItemIcon>
                <ListItemText
                  primary={m.label}
                  primaryTypographyProps={{
                    fontSize: '0.8rem',
                    fontWeight: active ? 600 : 400,
                    lineHeight: 1.3,
                    noWrap: true,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: "'JetBrains Mono'", fontSize: '0.62rem',
                    color: active ? m.color : '#c3ccd9', fontWeight: 600, ml: 0.5,
                  }}
                >
                  {m.num}
                </Typography>
              </ListItemButton>
            </Tooltip>
          )
        })}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', px: 2.5, py: 2, borderTop: '1px solid #dde3ed' }}>
        <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', color: '#c3ccd9' }}>
          BDG-TEAM · FY 2025–26
        </Typography>
      </Box>
    </Drawer>
  )
}
