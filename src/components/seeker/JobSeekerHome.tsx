import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import { AddExternalAppModal } from './AddExternalAppModal';
import { AppDetailModal } from './AppDetailModal';
import { Application } from '../../types';
import {
  FileText,
  Clock,
  Calendar,
  Award,
  PlusCircle,
  Search,
  ArrowRight,
  TrendingUp,
  Video,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: string) => void;
}

export const JobSeekerHome: React.FC<Props> = ({ onNavigateTab }) => {
  const { applications, jobPostings, setSelectedJobId, setActiveView } = useApp();
  const [isAddExternalOpen, setIsAddExternalOpen] = useState(false);
  const [selectedAppDetail, setSelectedAppDetail] = useState<Application | null>(null);

  // Statistics
  const totalApps = applications.length;
  const underReviewCount = applications.filter(
    (a) => a.status === 'under_review' || a.status === 'submitted'
  ).length;
  const interviewCount = applications.filter((a) => a.status === 'interview').length;
  const offeredCount = applications.filter((a) => a.status === 'offered').length;

  // Upcoming interview
  const upcomingInterviewApp = applications.find(
    (a) => a.interview && a.interview.status === 'scheduled'
  );

  // Recommended jobs
  const recommendedJobs = jobPostings
    .filter((j) => j.status === 'published')
    .slice(0, 3);

  // Recent applications
  const recentApplications = [...applications].slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Pencari Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Selamat datang kembali! Pantau seluruh proses rekrutmen dan tindak lanjuti tahapan wawancara.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddExternalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Tambah Lamaran Eksternal</span>
          </button>
          <button
            onClick={() => onNavigateTab('job_catalog')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Cari Lowongan</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Lamaran</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {totalApps}
          </div>
          <div className="text-[11px] text-slate-500">Internal & Eksternal</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Sedang Ditinjau</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {underReviewCount}
          </div>
          <div className="text-[11px] text-amber-600 font-medium">Dalam seleksi recruiter</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Wawancara</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {interviewCount}
          </div>
          <div className="text-[11px] text-purple-600 font-medium">Jadwal aktif disiapkan</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Penawaran (Offer)</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {offeredCount}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Tahap offering letter</div>
        </div>
      </div>

      {/* Row: Charts + Upcoming Interview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Application Volume Bar Chart */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Aktivitas Melamar Bulanan</h3>
              <p className="text-xs text-slate-500">Jumlah pengiriman berkas per bulan dalam semester berjalan</p>
            </div>
            <span className="text-xs font-semibold text-blue-600 font-mono-numbers">Tahun 2026</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2">
            {[
              { month: 'Mei', count: 2, height: '25%' },
              { month: 'Jun', count: 3, height: '35%' },
              { month: 'Jul', count: 4, height: '45%' },
              { month: 'Agu', count: 6, height: '60%' },
              { month: 'Sep', count: 8, height: '80%' },
              { month: 'Okt', count: 12, height: '100%' },
            ].map((col) => (
              <div key={col.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold text-slate-700 font-mono-numbers">{col.count}</span>
                <div
                  className="w-full bg-blue-100 hover:bg-blue-600 transition-all rounded-t-lg group relative"
                  style={{ height: col.height }}
                />
                <span className="text-[11px] text-slate-500 font-medium">{col.month}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata 5,8 lamaran per bulan</span>
            <span className="text-emerald-600 font-medium">Konversi panggilan wawancara 28%</span>
          </div>
        </div>

        {/* Upcoming Interview Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-600" />
              Wawancara Terdekat
            </h3>
            <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-medium">
              Terkonfirmasi
            </span>
          </div>

          {upcomingInterviewApp && upcomingInterviewApp.interview ? (
            <div className="space-y-3">
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                <div className="text-xs font-bold text-slate-900">
                  {upcomingInterviewApp.jobTitle}
                </div>
                <div className="text-xs text-purple-800 font-medium">
                  {upcomingInterviewApp.companyName}
                </div>
                <div className="text-xs text-slate-600 flex items-center gap-1.5 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-semibold text-slate-900 font-mono-numbers">
                    {upcomingInterviewApp.interview.scheduledAt} WIB
                  </span>
                </div>
                <div className="pt-2">
                  <a
                    href={upcomingInterviewApp.interview.locationOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:text-purple-900 underline"
                  >
                    <span>Masuk ke Google Meet / Ruang Wawancara</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {upcomingInterviewApp.interview.instructions && (
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  Catatan: "{upcomingInterviewApp.interview.instructions}"
                </p>
              )}

              <button
                onClick={() => onNavigateTab('seeker_interviews')}
                className="w-full py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200 text-center"
              >
                Lihat Semua Jadwal Wawancara
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              Belum ada jadwal wawancara baru. Lamaran yang lolos review akan dijadwalkan oleh recruiter di sini.
            </div>
          )}
        </div>
      </div>

      {/* Row: Recent Applications Table + Recommended Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Applications */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lamaran Terbaru</h3>
              <p className="text-xs text-slate-500">Pantau perkembangan status lamaran kerja Anda</p>
            </div>
            <button
              onClick={() => onNavigateTab('seeker_applications')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-100 font-semibold">
                <tr>
                  <th className="px-3 py-2.5">Posisi & Perusahaan</th>
                  <th className="px-3 py-2.5">Sumber</th>
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-3 py-3">
                      <div className="font-semibold text-slate-900">{app.jobTitle}</div>
                      <div className="text-[11px] text-slate-500">{app.companyName}</div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-slate-600 font-medium">{app.source}</span>
                    </td>
                    <td className="px-3 py-3 font-mono-numbers text-slate-600">
                      {app.appliedAt}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => setSelectedAppDetail(app)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Rekomendasi Lowongan</h3>
            <button
              onClick={() => onNavigateTab('job_catalog')}
              className="text-xs text-blue-600 hover:underline"
            >
              Cari Lainnya
            </button>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => {
                  setSelectedJobId(job.id);
                  setActiveView('job_detail');
                }}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50/60 transition-all cursor-pointer space-y-1"
              >
                <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 truncate">
                  {job.title}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {job.companyName} · {job.location}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-semibold text-slate-700 font-mono-numbers">
                    {job.salaryMin
                      ? `Rp ${(job.salaryMin / 1000000).toLocaleString('id-ID')} Jt`
                      : 'Kompetitif'}
                  </span>
                  <span className="text-[10px] text-blue-600 font-medium">Lamar Sekarang &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExternalAppModal
        isOpen={isAddExternalOpen}
        onClose={() => setIsAddExternalOpen(false)}
      />
      <AppDetailModal
        application={selectedAppDetail}
        isOpen={!!selectedAppDetail}
        onClose={() => setSelectedAppDetail(null)}
      />
    </div>
  );
};
