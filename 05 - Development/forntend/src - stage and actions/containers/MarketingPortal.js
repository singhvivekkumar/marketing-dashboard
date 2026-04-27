import React, { useState } from 'react';
import { Box, ThemeProvider } from '@mui/material';
import {lightTheme, darkTheme} from '../theme/darkTheme';
import MarketingPortalSidebar from '../components/MarketingPortalSidebar';
import MarketingPortalTopBar from '../components/MarketingPortalTopBar';
import DashboardModulesView from '../views/MarketingPortalDashboard';
import LeadsModule from '../views/LeadsModule';
import TenderModule from '../views/TenderModule';
import { BQModule, BiddingModule, AcquisitionModule, OrderModule, FutureModule } from '../views/OtherModules';

export default function MarketingPortal() {
  const [activeModule, setActiveModule] = useState('dashboard');

  const handleModuleChange = (module) => {
    setActiveModule(module);
  };

  const handleNewLead = () => {
    setActiveModule('newlead');
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModulesView onModuleSelect={handleModuleChange} />;
      case 'lead':
        return <LeadsModule />;
      case 'tender':
        return <TenderModule />;
      case 'bq':
        return <BQModule />;
      case 'bidding':
        return <BiddingModule />;
      case 'acquisition':
        return <AcquisitionModule />;
      case 'order':
        return <OrderModule />;
      case 'future':
        return <FutureModule />;
      default:
        return <DashboardModulesView onModuleSelect={handleModuleChange} />;
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* Sidebar */}
        <MarketingPortalSidebar
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          onNewLead={handleNewLead}
        />

        {/* Main Content */}
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {/* Top Bar */}
          <MarketingPortalTopBar
            activeModule={activeModule}
            onNewLead={handleNewLead}
            onExport={() => console.log('Export clicked')}
          />

          {/* Content Area */}
          <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {renderModuleContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
