import { useState } from 'react';
import { Box } from '@mui/material';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardOverview from './views/DashboardOverview';
import DashboardAnalysis from './views/DashboardAnalysis';
import DashboardPipeline from './views/DashboardPipeline';
import Monitoring from './views/Monitoring';
import MonthlyReports from './views/MonthlyReports';
import YearlyAnalysis from './views/YearlyAnalysis';
import TenderLifecycleOverview from './views/TenderLifecycleOverview';
import TenderLifecycleDetail from './views/TenderLifecycleDetail';
import { LeadDashboard } from './pages/LeadManagement';
import MarketingPortal from './containers/MarketingPortal';

const viewConfig = {
  dashboard: {
    title: 'Analytics Dashboard',
    tabs: ['Overview', 'Analysis', 'Pipeline'],
    showFY: true,
  },
  monitoring: {
    title: 'System Monitoring',
    tabs: [],
    showFY: false,
  },
  reports: {
    title: 'Monthly Reports',
    tabs: [],
    showFY: false,
  },
  yearly: {
    title: 'Yearly Analysis',
    tabs: [],
    showFY: false,
  },
  tenders: {
    title: 'Tender Lifecycle',
    tabs: ['Overview'],
    showFY: false,
  },
  leads: {
    title: 'Lead Management',
    tabs: [],
    showFY: false,
  },
};

export default function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  const [fy, setFY] = useState('2026');
  const [mobileOpen, setMobileOpen] = useState(false);

  const config = viewConfig[activeSection] || viewConfig.dashboard;

  // If Marketing Portal is selected, render it directly without sidebar/topbar wrapper
  if (activeSection === 'marketing-portal') {
    return <MarketingPortal />;
  }

  // Placeholder content
  const renderOtherSection = () => (
    <Box
      sx={{
        padding: '60px',
        textAlign: 'center',
        color: '#8892a4',
      }}
    >
      <Box sx={{ fontSize: '32px', marginBottom: '12px' }}>&#9685;</Box>
      <Box sx={{ fontSize: '15px', fontWeight: 500, color: '#525868', marginBottom: '6px' }}>
        Module coming soon
      </Box>
      <Box sx={{ fontSize: '13px' }}>
        Navigate to Dashboard, Monitoring, Monthly Reports, or Yearly Analysis using the sidebar.
      </Box>
    </Box>
  );

  const renderContent = () => {
    if (activeSection === 'dashboard') {
      if (activeTab === 'overview') return <DashboardOverview />;
      if (activeTab === 'analysis') return <DashboardAnalysis />;
      if (activeTab === 'pipeline') return <DashboardPipeline />;
    }
    if (activeSection === 'tenders') {
      // Tender lifecycle view will manage its own detail state
      return <TenderLifecycleOverview />;
    }
    if (activeSection === 'monitoring') return <Monitoring />;
    if (activeSection === 'reports') return <MonthlyReports />;
    if (activeSection === 'yearly') return <YearlyAnalysis />;
    if (activeSection === 'leads') return <LeadDashboard />;
    return <LeadDashboard/>;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f7f8fa' }}>
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={(section) => {
          setActiveSection(section);
          setActiveTab('overview');
        }}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <TopBar
          title={config.title}
          tabs={config.tabs}
          onTabChange={setActiveTab}
          activeTab={activeTab}
          fy={config.showFY ? fy : null}
          onFYChange={setFY}
          onMenuClick={() => setMobileOpen(true)}
        />

        {/* Content Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
}
