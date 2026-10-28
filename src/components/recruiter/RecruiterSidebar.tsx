import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  PlusCircle,
  Users,
  Calendar,
  BarChart3,
  LogOut,
  Compass,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const RecruiterSidebar: React.FC<Props> = ({ currentTab, onSelectTab }) => {
  const { currentUser, companies, setActiveView } = useApp();
  const company = companies.find((c) => c.userId === currentUser.id) || companies[0];

  const menuItems = [
    { id: 'recruiter_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recruiter_company', label: 'Profil Perusahaan', icon: Building2 },
    { id: 'recruiter_jobs', label: 'Lowongan Saya', icon: Briefcase },
    { id: 'recruiter_add_job', label: 'Tambah Lowongan', icon: PlusCircle },
    { id: 'recruiter_candidates', label: 'Kandidat Pelamar', icon: Users },
    { id: 'recruiter_interviews', label: 'Jadwal Wawancara', icon: Calendar },
    { id: 'recruiter_reports', label: 'Laporan & Metrik', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Company Lockup Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-slate-700 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
              {company.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{company.name}</h4>
            <p className="text-[11px] text-purple-400 font-medium truncate">
              {currentUser.name}
            </p>
          </div>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Rekrutmen
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-purple-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-3 border-t border-slate-800 space-y-1 text-xs">
        <button
          onClick={() => setActiveView('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Lihat Beranda Publik</span>
        </button>
        <button
          onClick={() => setActiveView('landing')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Sesi</span>
        </button>
      </div>
    </aside>
  );
};
