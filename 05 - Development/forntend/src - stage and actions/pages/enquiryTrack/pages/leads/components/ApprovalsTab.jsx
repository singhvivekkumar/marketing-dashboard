import React from 'react'
import {
  Box, Typography, Chip, Button, Divider,
  List, ListItem, Avatar, Paper,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

const STATUS_CHIP = {
  Approved:    { bg: '#d4f0e5', color: '#1b8a5a' },
  Pending:     { bg: '#fef8e8', color: '#c07000' },
  'Not Started': { bg: '#f0f3f8', color: '#97a3b5' },
}

export default function ApprovalsTab({ lead }) {
  const { approvals } = lead

  return (
    <Box>
      <List disablePadding>
        {approvals.map((a, i) => {
          const chip = STATUS_CHIP[a.status] || STATUS_CHIP['Not Started']
          return (
            <React.Fragment key={i}>
              <ListItem
                disablePadding
                sx={{ py: 1.5, display: 'flex', gap: 2, alignItems: 'flex-start' }}
              >
                <Avatar
                  sx={{
                    width: 34, height: 34, fontSize: '0.7rem', fontWeight: 700,
                    backgroundColor: a.status === 'Approved' ? '#d4f0e5' : '#f0f3f8',
                    color: a.status === 'Approved' ? '#1b8a5a' : '#97a3b5',
                    fontFamily: "'JetBrains Mono'",
                    mt: 0.3, flexShrink: 0,
                  }}
                >
                  {a.level}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" sx={{ color: '#1a2236', fontWeight: 600 }}>
                    {a.role}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5a6880', mt: 0.2 }}>
                    {a.name}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Chip
                    label={a.status}
                    size="small"
                    sx={{ backgroundColor: chip.bg, color: chip.color, fontFamily: "'JetBrains Mono'" }}
                  />
                  {a.date && (
                    <Typography variant="caption" sx={{ display: 'block', color: '#97a3b5', mt: 0.5, fontFamily: "'JetBrains Mono'" }}>
                      {a.date}
                    </Typography>
                  )}
                  {a.status === 'Pending' && (
                    <Button
                      size="small" variant="outlined" endIcon={<SendIcon sx={{ fontSize: 12 }} />}
                      sx={{ mt: 0.5, fontSize: '0.7rem', py: 0.3 }}
                    >
                      Remind
                    </Button>
                  )}
                </Box>
              </ListItem>
              {i < approvals.length - 1 && <Divider />}
            </React.Fragment>
          )
        })}
      </List>

      {lead.status === 'No-Go' && lead.crmNote && (
        <Paper
          variant="outlined"
          sx={{ mt: 2.5, p: 2, borderColor: '#f5c6c3', backgroundColor: '#fffbfb', borderRadius: 2 }}
        >
          <Typography variant="caption" sx={{ color: '#c0392b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            CRM Notification Sent
          </Typography>
          <Typography variant="body2" sx={{ color: '#5a6880', mt: 0.5, lineHeight: 1.6 }}>
            {lead.crmNote}
          </Typography>
        </Paper>
      )}
    </Box>
  )
}
