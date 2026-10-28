/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui/ToastContainer';
import { LandingPage } from './components/public/LandingPage';
import { JobCatalogPage } from './components/public/JobCatalogPage';
import { JobDetailPage } from './components/public/JobDetailPage';
import { JobSeekerDashboard } from './components/seeker/JobSeekerDashboard';
import { RecruiterDashboard } from './components/recruiter/RecruiterDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { activeView } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingPage />;
      case 'job_catalog':
        return <JobCatalogPage />;
      case 'job_detail':
        return <JobDetailPage />;
      case 'seeker_dashboard':
        return <JobSeekerDashboard />;
      case 'recruiter_dashboard':
        return <RecruiterDashboard />;
      case 'admin_dashboard':
        return <AdminDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />
      <div className="flex-1">
        {renderCurrentView()}
      </div>
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
