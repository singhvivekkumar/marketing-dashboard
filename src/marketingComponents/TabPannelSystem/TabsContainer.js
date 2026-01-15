import React, { useState } from 'react';
import { Tab, Box, Tabs } from '@mui/material';
import TabPanel from './TabsPannel';

const tabsData = [
  'budgetary quotation',
  'lead submitted',
  'domestic leads',
  'export leads',
  'crm leads',
  'order received',
  'lost',
];

function TabsContainer() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' } }>
      <Tabs value={value} onChange={handleChange}>
        <Tab>
          {tabsData.map((tab, index) => (
            <Tab key={index} label={tab} />
          ))}
        </Tab>
        <TabPanel value={value} tabsData={tabsData} />
      </Tabs>
    </Box>
  );
}

export default TabsContainer;