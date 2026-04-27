import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import { BQ_STAGES } from '../../../data/mockBQ'

export default function BQStageTracker({ currentStage }) {
  const getState = (idx) => {
    if (idx < currentStage) return 'done'
    if (idx === currentStage) return 'current'
    return 'pending'
  }

  const STAGE_COLORS = {
    0: '#1a56a0',   // Scope
    1: '#0e7c7b',   // Feasibility
    2: '#7c3aed',   // Tech Proposal
    3: '#b45309',   // Tech Head
    4: '#0e7c61',   // Finance
    5: '#1b8a5a',   // Submitted
  }

  return (
    <Box sx={{ overflowX: 'auto', pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 600, position: 'relative' }}>
        {BQ_STAGES.map((label, idx) => {
          const state = getState(idx)
          const stageColor = STAGE_COLORS[idx]
          const isLast = idx === BQ_STAGES.length - 1

          const circleStyle = {
            done:    { bg: stageColor, border: stageColor, text: '#fff' },
            current: { bg: '#fff', border: stageColor, text: stageColor },
            pending: { bg: '#f0f3f8', border: '#c3ccd9', text: '#97a3b5' },
          }[state]

          return (
            <Box
              key={idx}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}
            >
              {/* Connector */}
              {!isLast && (
                <Box sx={{
                  position: 'absolute', top: 14, left: '50%', width: '100%', height: 2,
                  backgroundColor: state === 'done' ? stageColor : '#dde3ed',
                  zIndex: 0,
                }} />
              )}

              {/* Circle */}
              <Tooltip title={label} arrow>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: circleStyle.bg,
                  border: `2px solid ${circleStyle.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1, position: 'relative', flexShrink: 0,
                  boxShadow: state === 'current' ? `0 0 0 4px ${stageColor}18` : 'none',
                  transition: 'all 0.2s',
                }}>
                  {state === 'done'
                    ? <CheckIcon sx={{ fontSize: 13, color: '#fff' }} />
                    : <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.62rem', fontWeight: 700, color: circleStyle.text }}>{idx + 1}</Typography>
                  }
                </Box>
              </Tooltip>

              {/* Label */}
              <Typography sx={{
                fontSize: '0.62rem', textAlign: 'center', mt: 0.8,
                color: state === 'done' ? stageColor : state === 'current' ? '#1a2236' : '#97a3b5',
                fontWeight: state === 'current' ? 700 : state === 'done' ? 500 : 400,
                lineHeight: 1.3, maxWidth: 76, px: 0.5,
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
