import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SeekerSidebar } from './SeekerSidebar';
import { JobSeekerHome } from './JobSeekerHome';
import { JobSeekerApplications } from './JobSeekerApplications';
import { JobSeekerExternalTracker } from './JobSeekerExternalTracker';
import { JobSeekerSavedJobs } from './JobSeekerSavedJobs';
import { JobSeekerInterviews } from './JobSeekerInterviews';
import { JobSeekerDocuments } from './JobSeekerDocuments';
import { JobSeekerProfile } from './JobSeekerProfile';
import { JobCatalogPage } from '../public/JobCatalogPage';

export const JobSeekerDashboard: React.FC = () => {
  const { activeView, setActiveView } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('seeker_dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'seeker_dashboard':
        return <JobSeekerHome onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'job_catalog':
        return <JobCatalogPage />;
      case 'seeker_applications':
        return <JobSeekerApplications />;
      case 'seeker_tracker':
        return <JobSeekerExternalTracker />;
      case 'seeker_saved':
        return <JobSeekerSavedJobs />;
      case 'seeker_interviews':
        return <JobSeekerInterviews />;
      case 'seeker_documents':
        return <JobSeekerDocuments />;
      case 'seeker_profile':
        return <JobSeekerProfile />;
      default:
        return <JobSeekerHome onNavigateTab={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-100/60">
      <SeekerSidebar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
