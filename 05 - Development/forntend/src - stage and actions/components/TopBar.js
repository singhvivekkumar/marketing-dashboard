import React from 'react';
import { Box, AppBar, Toolbar, Typography, Button, Select, MenuItem, Stack, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function TopBar({ title, tabs, onTabChange, activeTab, fy, onFYChange, onMenuClick }) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e4e8ef',
        color: '#0f1117',
      }}
    >
      <Toolbar
        sx={{
          padding: '0 28px',
          height: '56px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Mobile Menu Button */}
        <IconButton
          sx={{ display: { xs: 'flex', md: 'none' }, marginRight: 2 }}
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 500,
            color: '#0f1117',
            flex: 1,
          }}
        >
          {title}
        </Typography>

        {/* Right Section */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Tabs */}
          {tabs && tabs.length > 0 && (
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                gap: '2px',
                backgroundColor: '#f1f3f7',
                padding: '3px',
                borderRadius: '8px',
              }}
            >
              {tabs.map((tab, idx) => (
                <Button
                  key={idx}
                  variant={activeTab === tab.toLowerCase().replace(/\s/g, '-') ? 'contained' : 'text'}
                  onClick={() => onTabChange(tab.toLowerCase().replace(/\s/g, '-'))}
                  sx={{
                    padding: '5px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: activeTab === tab.toLowerCase().replace(/\s/g, '-') ? 500 : 400,
                    textTransform: 'none',
                    color: activeTab === tab.toLowerCase().replace(/\s/g, '-') ? '#0f1117' : '#525868',
                    backgroundColor: activeTab === tab.toLowerCase().replace(/\s/g, '-') ? '#ffffff' : 'transparent',
                    boxShadow: activeTab === tab.toLowerCase().replace(/\s/g, '-') ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    '&:hover': {
                      backgroundColor: activeTab === tab.toLowerCase().replace(/\s/g, '-') ? '#ffffff' : 'transparent',
                    },
                  }}
                >
                  {tab}
                </Button>
              ))}
            </Box>
          )}

          {/* FY Selector */}
          {fy && (
            <Select
              value={fy}
              onChange={(e) => onFYChange(e.target.value)}
              sx={{
                fontSize: '13px',
                padding: '5px 10px',
                border: '1px solid #e4e8ef',
                borderRadius: '7px',
                backgroundColor: '#ffffff',
                color: '#0f1117',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e4e8ef',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d0d5e0',
                },
              }}
            >
              <MenuItem value="2026">FY 2025–26</MenuItem>
              <MenuItem value="2025">FY 2024–25</MenuItem>
              <MenuItem value="2024">FY 2023–24</MenuItem>
              <MenuItem value="2023">FY 2022–23</MenuItem>
              <MenuItem value="2022">FY 2021–22</MenuItem>
            </Select>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
