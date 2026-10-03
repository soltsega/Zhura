import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/admin/DashboardPage';
import ElectionsPage from '@/pages/admin/ElectionsPage';
import VotersPage from '@/pages/admin/VotersPage';
import CandidatesPage from '@/pages/admin/CandidatesPage';
import GovernancePage from '@/pages/admin/GovernancePage';
import ExpensesPage from '@/pages/admin/ExpensesPage';
import AuditPage from '@/pages/admin/AuditPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import SettingsPage from '@/pages/admin/SettingsPage';
import VotingPage from '@/pages/voting/VotingPage';
import ValidatorDashboard from '@/pages/validator/ValidatorDashboard';
import PublicPortal from '@/pages/public/PortalPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/portal" element={<PublicPortal />} />

        {/* Voter Routes */}
        <Route path="/voting" element={<VotingPage />} />

        {/* Validator Routes */}
        <Route path="/validator" element={<ValidatorDashboard />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="elections" element={<ElectionsPage />} />
          <Route path="voters" element={<VotersPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="governance" element={<GovernancePage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
