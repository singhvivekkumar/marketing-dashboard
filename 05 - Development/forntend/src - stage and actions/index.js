import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Admin pages (inside your marketing portal layout)
import FormsListPage from './pages/DynamicForm/FormsListPage';

// Public customer-facing page (no layout wrapper)
import PublicFormPage from './pages/DynamicForm/PublicFormPage';
import ModulePage from './marketingComponents/pages/ModulePage';
import EnquiryApp from './pages/enquiryTrack/App';
import FormRendererTestPage from './pages/DynamicForm/FormRendererTestPage';

// Your existing layout component
// import AppLayout from './layouts/AppLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* ── Admin Routes (inside portal layout) ─────────────────────────────── */}

          <Route path="/" element={<App />} />
          {/* <Route element={<AppLayout />}> */}
          {/* </Route> */}
          <Route path="/admin/forms" element={<FormsListPage />} />

          <Route path="/dev/form-renderer-test" element={<FormRendererTestPage />} />
          {/* ── Public Customer Route (no auth, no layout) ────────────────────── */}
          <Route path="/forms/:formId" element={<PublicFormPage />} />
          <Route path="/marketing" element={<ModulePage />} />
        </Routes>
      </BrowserRouter>
      {/* Standalone Enquiry Tracking App (can be nested under /marketing if needed) */}
      {/* <EnquiryApp /> */}
    </ThemeProvider>
  </React.StrictMode>
);
