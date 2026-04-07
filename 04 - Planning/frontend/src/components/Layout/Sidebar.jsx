// src/components/Layout/Sidebar.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer, Box, Typography, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, Chip,
} from '@mui/material';
import {
  DescriptionOutlined, PeopleAltOutlined, ShoppingCartOutlined,
  ScienceOutlined, DashboardOutlined, MonitorHeartOutlined,
  CalendarMonthOutlined, BarChartOutlined, SettingsOutlined,
} from '@mui/icons-material';

const DRAWER_WIDTH = 220;

const NAV = [
  {
    section: 'Modules',
    items: [
      { label: 'BQ Management',   icon: <DescriptionOutlined sx={{ fontSize:16 }} />, path: '/bq' },
      { label: 'Lead Management', icon: <PeopleAltOutlined   sx={{ fontSize:16 }} />, path: '/leads', badge: 42 },
      { label: 'Orders Received', icon: <ShoppingCartOutlined sx={{ fontSize:16 }} />, path: '/orders' },
      { label: 'In-House R&D',    icon: <ScienceOutlined     sx={{ fontSize:16 }} />, path: '/rnd' },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { label: 'Dashboard',       icon: <DashboardOutlined   sx={{ fontSize:16 }} />, path: '/dashboard' },
      { label: 'Monitoring',      icon: <MonitorHeartOutlined sx={{ fontSize:16 }} />, path: '/monitoring' },
      { label: 'Monthly Reports', icon: <CalendarMonthOutlined sx={{ fontSize:16 }} />, path: '/reports' },
      { label: 'Yearly Analysis', icon: <BarChartOutlined    sx={{ fontSize:16 }} />, path: '/yearly' },
    ],
  },
  {
    section: 'Admin',
    items: [
      { label: 'Settings', icon: <SettingsOutlined sx={{ fontSize:16 }} />, path: '/settings' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate  = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e4e8ef',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid #e4e8ef' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', color: '#0f1117' }}>
          Marketing Portal
        </Typography>
        <Typography sx={{ fontSize: 11, color: '#8892a4', fontFamily: '"DM Mono", monospace', mt: 0.3 }}>
          v2.0 — Analytics Suite
        </Typography>
      </Box>

      {/* Navigation */}
      {NAV.map((group) => (
        <Box key={group.section}>
          <Typography
            sx={{
              px: 1.5, pt: 1.5, pb: 0.5,
              fontSize: 10, fontWeight: 500,
              color: '#8892a4', letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {group.section}
          </Typography>

          <List dense disablePadding>
            {group.items.map((item) => {
              const active = location.pathname === item.path ||
                (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <ListItemButton
                  key={item.path}
                  selected={active}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1, mb: 0.25,
                    borderRadius: 1.5,
                    width: 'auto',
                    px: 1.5, py: 0.875,
                    color: active ? '#2563eb' : '#525868',
                    backgroundColor: active ? '#eff4ff !important' : 'transparent',
                    '&:hover': { backgroundColor: active ? '#eff4ff' : '#f1f3f7' },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 28,
                      color: active ? '#2563eb' : '#8892a4',
                      opacity: active ? 1 : 0.85,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: active ? 500 : 400,
                      noWrap: true,
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: 10,
                        fontFamily: '"DM Mono", monospace',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        '& .MuiChip-label': { px: 0.75 },
                      }}
                    />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      ))}
    </Drawer>
  );
}
