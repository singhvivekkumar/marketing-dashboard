// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import theme from './theme';

// Pages
import Login          from './pages/Login/Login';
import Dashboard      from './pages/Dashboard/Dashboard';
import Monitoring     from './pages/Monitoring/Monitoring';
import MonthlyReports from './pages/Reports/MonthlyReports';
import YearlyAnalysis from './pages/Yearly/YearlyAnalysis';
import BQList         from './pages/BQ/BQList';
import LeadList       from './pages/Leads/LeadList';
import OrderList      from './pages/Orders/OrderList';
import RnDList        from './pages/RnD/RnDList';
import Settings       from './pages/Settings/Settings';

// ── Protected route wrapper ───────────────────────────────────────────────
function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return null; // or a full-page spinner
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

// ── Public route: redirect logged-in users away from /login ───────────────
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user)    return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Protected — all roles */}
      <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
      <Route path="/reports"    element={<ProtectedRoute><MonthlyReports /></ProtectedRoute>} />
      <Route path="/yearly"     element={<ProtectedRoute><YearlyAnalysis /></ProtectedRoute>} />
      <Route path="/bq"         element={<ProtectedRoute><BQList /></ProtectedRoute>} />
      <Route path="/leads"      element={<ProtectedRoute><LeadList /></ProtectedRoute>} />
      <Route path="/orders"     element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
      <Route path="/rnd"        element={<ProtectedRoute><RnDList /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/settings" element={
        <ProtectedRoute roles={['admin','head']}>
          <Settings />
        </ProtectedRoute>
      } />

      {/* Default redirects */}
      <Route path="/"  element={<Navigate to="/dashboard" replace />} />
      <Route path="*"  element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
