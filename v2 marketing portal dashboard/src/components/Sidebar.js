import React from 'react';
import { Box, Button, Stack, Typography, Drawer } from '@mui/material';
import {
  Dashboard,
  Description,
  Assessment,
  Settings,
  Assignment,
  People,
  ShoppingCart,
  Science,
} from '@mui/icons-material';
import Monitoring from '@mui/icons-material/MonitorOutlined';

const navItems = [
  {
    section: 'Modules',
    items: [
      { id: 'bq', label: 'BQ Management', icon: Assignment },
      { id: 'leads', label: 'Lead Management', icon: People, badge: 42 },
      { id: 'orders', label: 'Orders Received', icon: ShoppingCart },
      { id: 'rd', label: 'In-House R&D', icon: Science },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
      { id: 'monitoring', label: 'Monitoring', icon: Monitoring },
      { id: 'reports', label: 'Monthly Reports', icon: Description },
      { id: 'yearly', label: 'Yearly Analysis', icon: Assessment },
    ],
  },
  {
    section: 'Admin',
    items: [{ id: 'settings', label: 'Settings', icon: Settings }],
  },
];

export default function Sidebar({ activeSection, onSectionChange, mobileOpen, onMobileClose }) {
  const drawerContent = (
    <Box sx={{ width: 220, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ padding: '20px', borderBottom: '1px solid #e4e8ef', marginBottom: '12px' }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, color: '#0f1117', letterSpacing: '-0.3px' }}>
          Marketing Portal
        </Typography>
        <Typography sx={{ fontSize: '11px', color: '#8892a4', fontFamily: '"DM Mono", monospace', marginTop: '4px' }}>
          v2.0 — Analytics Suite
        </Typography>
      </Box>

      {/* Navigation */}
      <Stack sx={{ flex: 1, overflowY: 'auto', paddingBottom: 2 }}>
        {navItems.map((group, idx) => (
          <Box key={idx}>
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 500,
                color: '#8892a4',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '8px 12px 4px',
                marginTop: idx > 0 ? '8px' : 0,
              }}
            >
              {group.section}
            </Typography>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  startIcon={<Icon sx={{ fontSize: '16px' }} />}
                  onClick={() => {
                    onSectionChange(item.id);
                    onMobileClose();
                  }}
                  sx={{
                    width: 'calc(100% - 16px)',
                    margin: '1px 8px',
                    padding: '7px 12px',
                    borderRadius: '7px',
                    fontSize: '13px',
                    fontWeight: 400,
                    textTransform: 'none',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    color: activeSection === item.id ? '#2563eb' : '#525868',
                    backgroundColor: activeSection === item.id ? '#eff4ff' : 'transparent',
                    fontWeight: activeSection === item.id ? 500 : 400,
                    transition: 'all 0.15s',
                    '&:hover': {
                      backgroundColor: '#f1f3f7',
                      color: '#0f1117',
                    },
                    display: 'flex',
                    gap: '8px',
                    position: 'relative',
                  }}
                >
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <Box
                      sx={{
                        marginLeft: 'auto',
                        background: '#2563eb',
                        color: '#fff',
                        fontSize: '10px',
                        fontWeight: 500,
                        padding: '1px 6px',
                        borderRadius: '10px',
                        fontFamily: '"DM Mono", monospace',
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </Button>
              );
            })}
          </Box>
        ))}
      </Stack>
    </Box>
  );

  return (
    <>
      {/* Desktop Drawer */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 220,
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e4e8ef',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {drawerContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
