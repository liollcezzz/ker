import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Compass,
  LayoutDashboard,
  User,
  Building2,
  Shield,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { LaravelArchitectureModal } from '../ui/LaravelArchitectureModal';

export const Navbar: React.FC = () => {
  const { currentRole, switchRole, activeView, setActiveView } = useApp();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isArchOpen, setIsArchOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const getDashboardViewForRole = (role: UserRole) => {
    if (role === 'job_seeker') return 'seeker_dashboard';
    if (role === 'recruiter') return 'recruiter_dashboard';
    return 'admin_dashboard';
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'job_seeker':
        return { label: 'Pencari Kerja', icon: User, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'recruiter':
        return { label: 'Recruiter', icon: Building2, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'admin':
        return { label: 'Admin', icon: Shield, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  };

  const currentRoleConfig = getRoleBadge(currentRole);
  const CurrentIcon = currentRoleConfig.icon;

  const isDashboardView =
    activeView.startsWith('seeker_') ||
    activeView.startsWith('recruiter_') ||
    activeView.startsWith('admin_');

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base tracking-wider shadow-xs group-hover:bg-blue-600 transition-colors">
              CT
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                CareerTrack
              </span>
            </div>
          </button>

          {/* Zone 2: 4 Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveView('landing')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                activeView === 'landing' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setActiveView('job_catalog')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                activeView === 'job_catalog' ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Cari Lowongan
            </button>
            <button
              onClick={() => setIsArchOpen(true)}
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors whitespace-nowrap text-slate-600"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Blueprint Laravel 11 + SQLite</span>
            </button>
            <button
              onClick={() => {
                setActiveView(getDashboardViewForRole(currentRole));
              }}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap ${
                isDashboardView ? 'text-blue-600 font-semibold' : ''
              }`}
            >
              Dashboard Sistem
            </button>
          </nav>

          {/* Zone 3: 1 Primary action + Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${currentRoleConfig.color} shadow-2xs hover:shadow-xs`}
                title="Ganti Role Akun Demo"
              >
                <CurrentIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-semibold">{currentRoleConfig.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Pilih Peran Demo:
                  </div>
                  <button
                    onClick={() => {
                      switchRole('job_seeker');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                      currentRole === 'job_seeker'
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <div>Pencari Kerja</div>
                      <div className="text-[10px] text-slate-500 font-normal">Dimas Pratama</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('recruiter');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                      currentRole === 'recruiter'
                        ? 'bg-purple-50 text-purple-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <div>
                      <div>Recruiter Perusahaan</div>
                      <div className="text-[10px] text-slate-500 font-normal">PT Nusantara Teknologi</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchRole('admin');
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                      currentRole === 'admin'
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div>Administrator</div>
                      <div className="text-[10px] text-slate-500 font-normal">Super Admin & Moderasi</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Launch Dashboard / Auth Button */}
            {isDashboardView ? (
              <button
                onClick={() => setActiveView('landing')}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
              >
                <Compass className="w-4 h-4" />
                <span className="hidden sm:inline">Halaman Publik</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView(getDashboardViewForRole(currentRole))}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-2xs"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Buka Dashboard</span>
              </button>
            )}

            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-medium text-slate-600 hover:text-blue-600 px-2 py-1.5 transition-colors whitespace-nowrap"
            >
              Akun
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <LaravelArchitectureModal isOpen={isArchOpen} onClose={() => setIsArchOpen(false)} />
    </>
  );
};
