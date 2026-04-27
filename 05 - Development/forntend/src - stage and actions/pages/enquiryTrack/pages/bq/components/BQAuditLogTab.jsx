import React from 'react'
import { Box, Typography, Avatar, Divider } from '@mui/material'

export default function BQAuditLogTab({ bq }) {
  return (
    <Box>
      {bq.auditLog.map((entry, i) => (
        <React.Fragment key={i}>
          <Box sx={{ display: 'flex', gap: 2, py: 1.5, alignItems: 'flex-start' }}>
            <Avatar sx={{
              width: 28, height: 28, fontSize: '0.65rem', fontWeight: 700,
              backgroundColor: '#e8f0fb', color: '#1a56a0', flexShrink: 0, mt: 0.3,
            }}>
              {entry.user.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.3 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#1a2236' }}>{entry.user}</Typography>
                <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.65rem', color: '#97a3b5' }}>{entry.timestamp}</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#5a6880', lineHeight: 1.6 }}>{entry.action}</Typography>
            </Box>
          </Box>
          {i < bq.auditLog.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Box>
  )
}
