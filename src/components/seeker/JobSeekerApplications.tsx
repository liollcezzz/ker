import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationSource, ApplicationStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { AddExternalAppModal } from './AddExternalAppModal';
import { AppDetailModal } from './AppDetailModal';
import {
  Search,
  Filter,
  PlusCircle,
  Calendar,
  ExternalLink,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

export const JobSeekerApplications: React.FC = () => {
  const { applications } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isAddExternalOpen, setIsAddExternalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const sources: ApplicationSource[] = [
    'CareerTrack',
    'Website Perusahaan',
    'LinkedIn',
    'Job Portal Lain',
    'Email',
    'Referensi',
    'Lainnya',
  ];

  const statuses: ApplicationStatus[] = [
    'submitted',
    'under_review',
    'interview',
    'offered',
    'rejected',
    'withdrawn',
  ];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = app.jobTitle.toLowerCase().includes(query);
        const matchCompany = app.companyName.toLowerCase().includes(query);
        if (!matchTitle && !matchCompany) return false;
      }

      if (statusFilter !== 'all') {
        if (app.status !== statusFilter) return false;
      }

      if (sourceFilter !== 'all') {
        if (app.source !== sourceFilter) return false;
      }

      return true;
    });
  }, [applications, search, statusFilter, sourceFilter]);

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setSourceFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Lamaran Saya</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar lengkap seluruh lamaran kerja internal maupun eksternal yang sedang aktif dipantau.
          </p>
        </div>

        <button
          onClick={() => setIsAddExternalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Lamaran Eksternal</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari berdasarkan posisi atau nama perusahaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-700"
            >
              <option value="all">Semua Status</option>
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-700"
            >
              <option value="all">Semua Sumber</option>
              {sources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(search || statusFilter !== 'all' || sourceFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
            <span>Ditemukan {filteredApplications.length} lamaran</span>
            <button
              onClick={resetFilters}
              className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredApplications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Belum ada lamaran yang sesuai</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tidak ada lamaran yang cocok dengan kriteria filter saat ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-4 py-3.5">Posisi & Perusahaan</th>
                  <th className="px-4 py-3.5">Sumber Lamaran</th>
                  <th className="px-4 py-3.5">Tanggal Melamar</th>
                  <th className="px-4 py-3.5">Status Lamaran</th>
                  <th className="px-4 py-3.5">Jadwal Wawancara</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{app.jobTitle}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{app.companyName}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-medium text-slate-700">{app.source}</span>
                    </td>
                    <td className="px-4 py-3.5 font-mono-numbers text-slate-600">
                      {app.appliedAt}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5">
                      {app.interview ? (
                        <div className="space-y-0.5">
                          <span className="text-[11px] font-semibold text-purple-700 flex items-center gap-1 font-mono-numbers">
                            <Calendar className="w-3.5 h-3.5" />
                            {app.interview.scheduledAt}
                          </span>
                          <span className="text-[10px] text-slate-500 capitalize">
                            {app.interview.type}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                      >
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddExternalAppModal
        isOpen={isAddExternalOpen}
        onClose={() => setIsAddExternalOpen(false)}
      />
      <AppDetailModal
        application={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};
