import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, UserCheck, Briefcase, Shield, ArrowRight, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { switchRole, addToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>('job_seeker');
  const [email, setEmail] = useState('dimas.pratama@student.ac.id');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Dimas Pratama');

  if (!isOpen) return null;

  const handleRoleQuickSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'job_seeker') {
      setEmail('dimas.pratama@student.ac.id');
      setName('Dimas Pratama');
    } else if (role === 'recruiter') {
      setEmail('hr@nusantaratech.id');
      setName('Siti Rahmawati');
    } else {
      setEmail('admin@careertrack.id');
      setName('Budi Santoso');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switchRole(selectedRole);
    onClose();
    addToast(
      mode === 'login' ? 'Login Berhasil' : 'Registrasi Berhasil',
      `Selamat datang kembali, ${name}! Masuk sebagai ${selectedRole.replace('_', ' ')}.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {mode === 'login' ? 'Masuk ke CareerTrack' : 'Buat Akun Baru'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Akses instan ke dashboard menggunakan akun demo
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Quick Demo Role Selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Role Akun Demo:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickSelect('job_seeker')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'job_seeker'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600'
                }`}
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-center leading-tight">Pencari Kerja</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('recruiter')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'recruiter'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600'
                }`}
              >
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-center leading-tight">Recruiter</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickSelect('admin')}
                className={`p-2.5 rounded-xl border text-left flex flex-col items-center justify-center gap-1.5 transition-all ${
                  selectedRole === 'admin'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-2xs font-semibold'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 text-slate-600'
                }`}
              >
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-center leading-tight">Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-700">Kata Sandi</label>
                {mode === 'login' && (
                  <span className="text-xs text-blue-600 hover:underline cursor-pointer">Lupa kata sandi?</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-xs"
            >
              <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle login/register */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-slate-600 hover:text-blue-600 transition-colors"
            >
              {mode === 'login'
                ? 'Belum punya akun? Daftar sebagai Pelamar atau Perusahaan'
                : 'Sudah punya akun? Masuk di sini'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
