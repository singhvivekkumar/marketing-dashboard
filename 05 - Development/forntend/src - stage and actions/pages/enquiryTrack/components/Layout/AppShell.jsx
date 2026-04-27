import React from 'react'
import { Box } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppShell({ children, topbarProps }) {
  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar {...topbarProps} />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: '#f0f3f8',
            '&::-webkit-scrollbar': { width: 5 },
            '&::-webkit-scrollbar-thumb': { background: '#c3ccd9', borderRadius: 4 },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
