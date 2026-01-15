import React, { useState } from 'react';
import ButtonCard from './ButtonCard';
import ViewData from './ViewData.js';
import CreateForm from './CreateForm';
import BulkUpload from './BulkUpload';

function TabPanel({ value, tabsData }) {
  const [selectedAction, setSelectedAction] = useState(null);
  const currentTabLabel = tabsData[value];

  const handleButtonAction = (action) => {
    setSelectedAction(action);
  };

  let renderContent = <ButtonCard onAction={handleButtonAction} />;

  switch (selectedAction) {
    case 'view':
      renderContent = <ViewData tabName={currentTabLabel} />;
      break;
    case 'create':
      renderContent = <CreateForm tabName={currentTabLabel} />;
      break;
    case 'upload':
      renderContent = <BulkUpload tabName={currentTabLabel} />;
      break;
    default:
      renderContent = <ButtonCard onAction={handleButtonAction} />;
  }

  return (
    <div>
      {renderContent}
    </div>
  );
}

export default TabPanel;