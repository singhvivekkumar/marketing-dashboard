import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { LEAD_STAGES } from '../../../data/mockLeads'

export default function StageTracker({ currentStage, status }) {
  const getStepState = (idx) => {
    if (status === 'No-Go' && idx === 2) return 'blocked'
    if (idx < currentStage) return 'done'
    if (idx === currentStage) return 'current'
    return 'pending'
  }

  return (
    <Box sx={{ overflowX: 'auto', pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 700, position: 'relative' }}>
        {LEAD_STAGES.map((label, idx) => {
          const state = getStepState(idx)
          const isLast = idx === LEAD_STAGES.length - 1

          const circleColor = {
            done:    { bg: '#1a56a0', border: '#1a56a0', text: '#fff' },
            current: { bg: '#fff',    border: '#1a56a0', text: '#1a56a0' },
            blocked: { bg: '#fde8e6', border: '#c0392b', text: '#c0392b' },
            pending: { bg: '#f0f3f8', border: '#c3ccd9', text: '#97a3b5' },
          }[state]

          const lineColor = state === 'done' ? '#1a56a0' : '#dde3ed'

          return (
            <Box
              key={idx}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}
            >
              {/* Connector line */}
              {!isLast && (
                <Box sx={{
                  position: 'absolute',
                  top: 14, left: '50%', width: '100%', height: 2,
                  backgroundColor: lineColor,
                  zIndex: 0,
                }} />
              )}

              {/* Circle */}
              <Tooltip title={label} arrow>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: circleColor.bg,
                  border: `2px solid ${circleColor.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1, flexShrink: 0, position: 'relative',
                  boxShadow: state === 'current' ? `0 0 0 4px #1a56a015` : 'none',
                  transition: 'all 0.2s',
                }}>
                  {state === 'done' ? (
                    <CheckIcon sx={{ fontSize: 13, color: '#fff' }} />
                  ) : (
                    <Typography sx={{
                      fontFamily: "'JetBrains Mono'", fontSize: '0.62rem',
                      fontWeight: 700, color: circleColor.text,
                    }}>
                      {idx + 1}
                    </Typography>
                  )}
                </Box>
              </Tooltip>

              {/* Label */}
              <Typography sx={{
                fontSize: '0.65rem', textAlign: 'center', mt: 0.8,
                color: state === 'done' ? '#1a56a0' : state === 'current' ? '#1a2236' : '#97a3b5',
                fontWeight: state === 'current' ? 700 : state === 'done' ? 500 : 400,
                lineHeight: 1.3, maxWidth: 72, px: 0.5,
              }}>
                {label}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
