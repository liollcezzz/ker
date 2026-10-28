import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';
import { Users, Search, Shield, UserCheck, Briefcase } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const { users, currentRole, switchRole } = useApp();
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'job_seeker':
        return { label: 'Pencari Kerja', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'recruiter':
        return { label: 'Recruiter', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'admin':
        return { label: 'Administrator', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Pengguna Sistem ({users.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar seluruh akun pencari kerja, recruiter perusahaan, dan staf administrator.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama atau email akun..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={roleFilter}
              onChange={(e: any) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-700"
            >
              <option value="all">Semua Role Pengguna</option>
              <option value="job_seeker">Pencari Kerja</option>
              <option value="recruiter">Recruiter Perusahaan</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
              <tr>
                <th className="px-4 py-3.5">Nama & Profil</th>
                <th className="px-4 py-3.5">Email Akun</th>
                <th className="px-4 py-3.5">Peran / Role</th>
                <th className="px-4 py-3.5">Lokasi</th>
                <th className="px-4 py-3.5">Status Akun</th>
                <th className="px-4 py-3.5 text-right">Switch Sesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => {
                const config = getRoleLabel(user.role);
                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500">{user.headline || '-'}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-600">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${config.color}`}
                      >
                        {config.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{user.location || 'Indonesia'}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aktif
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => switchRole(user.role)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                      >
                        Masuk Sebagai Ini
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
