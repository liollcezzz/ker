import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Search,
  FileSpreadsheet,
  PlusCircle,
  Bookmark,
  Calendar,
  FolderOpen,
  User,
  LogOut,
  Compass,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const SeekerSidebar: React.FC<Props> = ({ currentTab, onSelectTab }) => {
  const { currentUser, setActiveView } = useApp();

  const menuItems = [
    { id: 'seeker_dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'job_catalog', label: 'Cari Lowongan', icon: Search },
    { id: 'seeker_applications', label: 'Lamaran Saya', icon: FileSpreadsheet },
    { id: 'seeker_tracker', label: 'Pelacak Pribadi', icon: PlusCircle },
    { id: 'seeker_saved', label: 'Lowongan Tersimpan', icon: Bookmark },
    { id: 'seeker_interviews', label: 'Jadwal Wawancara', icon: Calendar },
    { id: 'seeker_documents', label: 'Dokumen Saya', icon: FolderOpen },
    { id: 'seeker_profile', label: 'Profil Saya', icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* User Mini Profile Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          {currentUser.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-blue-500/40"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
              DP
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
            <p className="text-[11px] text-blue-400 font-medium truncate">Pencari Kerja</p>
          </div>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Pelamar
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
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
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
