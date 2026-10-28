import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Users,
  Building2,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: string) => void;
}

export const AdminHome: React.FC<Props> = ({ onNavigateTab }) => {
  const { users, companies, jobPostings, moderateJob } = useApp();

  const totalUsers = users.length;
  const totalCompanies = companies.length;
  const totalJobs = jobPostings.length;
  const pendingJobs = jobPostings.filter((j) => j.status === 'pending_review');

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Ringkasan Sistem Administrator
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Pantau kepatuhan data, moderasi lowongan baru, dan verifikasi entitas bisnis perusahaan.
          </p>
        </div>

        {pendingJobs.length > 0 && (
          <button
            onClick={() => onNavigateTab('admin_moderation')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{pendingJobs.length} Lowongan Butuh Moderasi</span>
          </button>
        )}
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pengguna</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {totalUsers * 3280}
          </div>
          <div className="text-[11px] text-slate-500">Pencari kerja & Recruiter</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Perusahaan Mitra</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {totalCompanies}
          </div>
          <div className="text-[11px] text-blue-600 font-medium">3 terverifikasi resmi</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Lowongan</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {totalJobs}
          </div>
          <div className="text-[11px] text-slate-500">Dalam database sistem</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Antrean Moderasi</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-mono-numbers">
            {pendingJobs.length}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">Menunggu persetujuan</div>
        </div>
      </div>

      {/* Row: Growth Metrics + Pending Moderation Fast Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Growth Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pertumbuhan Pengguna Baru (2026)</h3>
              <p className="text-xs text-slate-500">Registrasi akun pencari kerja terverifikasi per bulan</p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 font-mono-numbers">+24% MoM</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2">
            {[
              { m: 'Mei', val: 620, h: '40%' },
              { m: 'Jun', val: 840, h: '55%' },
              { m: 'Jul', val: 1120, h: '70%' },
              { m: 'Agu', val: 1390, h: '85%' },
              { m: 'Sep', val: 1540, h: '92%' },
              { m: 'Okt', val: 1820, h: '100%' },
            ].map((col) => (
              <div key={col.m} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-700 font-mono-numbers">{col.val}</span>
                <div
                  className="w-full bg-emerald-100 hover:bg-emerald-600 transition-all rounded-t-lg"
                  style={{ height: col.h }}
                />
                <span className="text-[11px] text-slate-500 font-medium">{col.m}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Tingkat retensi pelamar bulanan: 78.4%</span>
            <span className="text-emerald-700 font-medium">Uptime sistem cloud: 99.98%</span>
          </div>
        </div>

        {/* Pending Moderation Queue Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Antrean Moderasi Lowongan
            </h3>
            <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-medium">
              Review Diperlukan
            </span>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500 space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-semibold text-slate-800">Semua lowongan telah disetujui!</p>
              <p className="text-[11px] text-slate-400">Tidak ada lowongan yang tertunda di antrean.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2 text-xs"
                >
                  <div className="font-bold text-slate-900">{job.title}</div>
                  <div className="text-slate-600 font-medium">
                    {job.companyName} · {job.location}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => moderateJob(job.id, 'reject', 'Deskripsi kurang spesifik')}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md border border-rose-200 transition-colors"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() => moderateJob(job.id, 'approve')}
                      className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-2xs"
                    >
                      Setujui Publikasi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => onNavigateTab('admin_moderation')}
            className="w-full py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 text-center"
          >
            Buka Panel Moderasi Lengkap
          </button>
        </div>
      </div>
    </div>
  );
};
