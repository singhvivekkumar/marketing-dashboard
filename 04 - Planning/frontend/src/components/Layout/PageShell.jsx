// src/components/Layout/PageShell.jsx
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopBar  from './TopBar';

const DRAWER_WIDTH = 220;

export default function PageShell({ title, actions, children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f8fa' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: `${DRAWER_WIDTH}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <TopBar title={title} actions={actions} />
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3.5 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
