import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  Layers,
  LogOut,
  Compass,
  RotateCcw,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<Props> = ({ currentTab, onSelectTab }) => {
  const { currentUser, setActiveView, resetToDefaultData } = useApp();

  const menuItems = [
    { id: 'admin_dashboard', label: 'Ringkasan Sistem', icon: LayoutDashboard },
    { id: 'admin_moderation', label: 'Moderasi Lowongan', icon: ShieldCheck },
    { id: 'admin_companies', label: 'Kelola Perusahaan', icon: Building2 },
    { id: 'admin_users', label: 'Kelola Pengguna', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Admin Lockup Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
            ADM
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">{currentUser.name}</h4>
            <p className="text-[11px] text-emerald-400 font-medium truncate">
              Super Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Nav list */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Panel Administrator
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
                  ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Demo Reset & Footer Actions */}
      <div className="p-3 border-t border-slate-800 space-y-1 text-xs">
        <button
          onClick={resetToDefaultData}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-amber-950/20 transition-colors"
          title="Kembalikan semua data ke kondisi bawaan"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Data Demo</span>
        </button>
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
