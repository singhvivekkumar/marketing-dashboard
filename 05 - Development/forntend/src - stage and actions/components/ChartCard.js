import React from 'react';
import { Card, CardContent, Box, Typography, Stack } from '@mui/material';

export default function ChartCard({ title, subtitle, chip, children, legend }) {
  return (
    <Card
      sx={{
        border: '1px solid #e4e8ef',
        borderRadius: '14px',
        padding: '18px 20px',
        backgroundColor: '#ffffff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#0f1117',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              sx={{
                fontSize: '11px',
                color: '#8892a4',
                marginTop: '2px',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {chip && (
          <Box
            sx={{
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '5px',
              fontWeight: 500,
              fontFamily: '"DM Mono", monospace',
              backgroundColor:
                chip.type === 'blue'
                  ? '#eff4ff'
                  : chip.type === 'green'
                    ? '#f0fdf4'
                    : chip.type === 'amber'
                      ? '#fffbeb'
                      : '#eff4ff',
              color:
                chip.type === 'blue'
                  ? '#2563eb'
                  : chip.type === 'green'
                    ? '#16a34a'
                    : chip.type === 'amber'
                      ? '#d97706'
                      : '#2563eb',
            }}
          >
            {chip.label}
          </Box>
        )}
      </Box>

      {/* Legend */}
      {legend && (
        <Stack
          direction="row"
          spacing={3}
          sx={{
            marginBottom: '10px',
            flexWrap: 'wrap',
          }}
        >
          {legend.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                color: '#525868',
              }}
            >
              <Box
                sx={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '2px',
                  backgroundColor: item.color,
                }}
              />
              {item.label}
            </Box>
          ))}
        </Stack>
      )}

      {/* Chart Content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
        {children}
      </Box>
    </Card>
  );
}
