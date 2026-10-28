import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminSidebar } from './AdminSidebar';
import { AdminHome } from './AdminHome';
import { AdminModeration } from './AdminModeration';
import { AdminCompanies } from './AdminCompanies';
import { AdminUsers } from './AdminUsers';

export const AdminDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('admin_dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'admin_dashboard':
        return <AdminHome onNavigateTab={(tab) => setCurrentTab(tab)} />;
      case 'admin_moderation':
        return <AdminModeration />;
      case 'admin_companies':
        return <AdminCompanies />;
      case 'admin_users':
        return <AdminUsers />;
      default:
        return <AdminHome onNavigateTab={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-100/60">
      <AdminSidebar currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
