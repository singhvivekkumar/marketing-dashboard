// src/components/Layout/TopBar.jsx
import { AppBar, Toolbar, Typography, Box, Avatar, Menu,
         MenuItem, Divider, IconButton, Tooltip } from '@mui/material';
import { LogoutOutlined, PersonOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title, actions }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState(null);

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
    : 'U';

  const roleColor = {
    admin:     '#2563eb',
    head:      '#7c3aed',
    manager:   '#0d9488',
    executive: '#d97706',
  }[user?.role] || '#8892a4';

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 1100 }}>
      <Toolbar sx={{ minHeight: '56px !important', px: 3.5, gap: 2 }}>
        {/* Page title */}
        <Typography sx={{ fontSize: 16, fontWeight: 500, color: '#0f1117', flexShrink: 0 }}>
          {title}
        </Typography>

        {/* Injected actions (tabs, FY selector, etc.) */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {actions}
        </Box>

        {/* User avatar */}
        <Tooltip title={`${user?.full_name} (${user?.role})`}>
          <IconButton onClick={e => setAnchor(e.currentTarget)} size="small">
            <Avatar
              sx={{
                width: 30, height: 30,
                fontSize: 11, fontWeight: 600,
                backgroundColor: roleColor + '22',
                color: roleColor,
              }}
            >
              {initials}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2 } }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>{user?.full_name}</Typography>
            <Typography sx={{ fontSize: 11, color: '#8892a4', textTransform: 'capitalize' }}>{user?.role}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchor(null); navigate('/settings'); }} sx={{ fontSize: 13, gap: 1 }}>
            <PersonOutlined sx={{ fontSize: 16, color: '#8892a4' }} /> My Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchor(null); logout(); }} sx={{ fontSize: 13, gap: 1, color: '#dc2626' }}>
            <LogoutOutlined sx={{ fontSize: 16 }} /> Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
