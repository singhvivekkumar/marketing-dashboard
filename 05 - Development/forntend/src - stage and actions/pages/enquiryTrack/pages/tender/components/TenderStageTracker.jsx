import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import BlockIcon from '@mui/icons-material/Block'
import { TENDER_STAGES } from '../../../data/mockTenders'

const STAGE_COLORS = ['#1a56a0', '#0e7c7b', '#b45309', '#7c3aed', '#1b8a5a']

export default function TenderStageTracker({ currentStage, participated }) {
  const getState = (idx) => {
    if (!participated && idx >= 1) return 'blocked'
    if (idx < currentStage) return 'done'
    if (idx === currentStage) return 'current'
    return 'pending'
  }

  return (
    <Box sx={{ overflowX: 'auto', pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 560, position: 'relative' }}>
        {TENDER_STAGES.map((label, idx) => {
          const state = getState(idx)
          const color = STAGE_COLORS[idx]
          const isLast = idx === TENDER_STAGES.length - 1

          const circleStyle = {
            done:    { bg: color,      border: color,      text: '#fff'    },
            current: { bg: '#fff',     border: color,      text: color     },
            blocked: { bg: '#fde8e6',  border: '#e0a0a0',  text: '#c0392b' },
            pending: { bg: '#f0f3f8',  border: '#c3ccd9',  text: '#97a3b5' },
          }[state]

          const lineColor = state === 'done' ? color : '#dde3ed'

          return (
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', flex: 1 }}>
              {!isLast && (
                <Box sx={{ position: 'absolute', top: 14, left: '50%', width: '100%', height: 2, backgroundColor: lineColor, zIndex: 0 }} />
              )}
              <Tooltip title={state === 'blocked' ? `${label} — Not Participating` : label} arrow>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%',
                  backgroundColor: circleStyle.bg,
                  border: `2px solid ${circleStyle.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 1, position: 'relative', flexShrink: 0,
                  boxShadow: state === 'current' ? `0 0 0 4px ${color}18` : 'none',
                  transition: 'all 0.2s',
                }}>
                  {state === 'done'    && <CheckIcon sx={{ fontSize: 13, color: '#fff' }} />}
                  {state === 'blocked' && <BlockIcon sx={{ fontSize: 12, color: '#c0392b' }} />}
                  {(state === 'current' || state === 'pending') && (
                    <Typography sx={{ fontFamily: "'JetBrains Mono'", fontSize: '0.62rem', fontWeight: 700, color: circleStyle.text }}>
                      {idx + 1}
                    </Typography>
                  )}
                </Box>
              </Tooltip>
              <Typography sx={{
                fontSize: '0.62rem', textAlign: 'center', mt: 0.8,
                color: state === 'done' ? color : state === 'current' ? '#1a2236' : state === 'blocked' ? '#c0392b' : '#97a3b5',
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
