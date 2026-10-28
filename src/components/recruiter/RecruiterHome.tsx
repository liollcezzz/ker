import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  PlusCircle,
  TrendingUp,
  Clock,
  ArrowRight,
  Award,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: string) => void;
  onOpenCandidateDetail: (appId: number) => void;
}

export const RecruiterHome: React.FC<Props> = ({ onNavigateTab, onOpenCandidateDetail }) => {
  const { jobPostings, applications, companies, currentUser } = useApp();
  const currentCompany = companies.find((c) => c.userId === currentUser.id) || companies[0];

  // Filter jobs for this company
  const companyJobs = jobPostings.filter((j) => j.companyId === currentCompany.id);
  const activeJobs = companyJobs.filter((j) => j.status === 'published');

  // Filter applications that belong to this company's jobs
  const companyJobIds = companyJobs.map((j) => j.id);
  const candidateApps = applications.filter(
    (a) => a.jobPostingId && companyJobIds.includes(a.jobPostingId)
  );

  const interviewCandidates = candidateApps.filter((a) => a.status === 'interview');
  const offeredCandidates = candidateApps.filter((a) => a.status === 'offered');
  const underReviewCandidates = candidateApps.filter(
    (a) => a.status === 'submitted' || a.status === 'under_review'
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard Rekrutmen
            </h1>
            {currentCompany.isVerified && (
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Perusahaan Terverifikasi
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola lowongan aktif dan pipeline seleksi kandidat {currentCompany.name}.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('recruiter_add_job')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Buat Lowongan Baru</span>
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Lowongan</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {companyJobs.length}
          </div>
          <div className="text-[11px] text-slate-500">{activeJobs.length} aktif tayang</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Lowongan Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {activeJobs.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">Menerima berkas masuk</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Pelamar</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {candidateApps.length}
          </div>
          <div className="text-[11px] text-blue-600 font-medium">Dalam pipeline ATS</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tahap Wawancara</span>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">
            {interviewCandidates.length}
          </div>
          <div className="text-[11px] text-purple-600 font-medium">Sesi teknis & HR aktif</div>
        </div>
      </div>

      {/* Charts & Applicant Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Applicant Inflow Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Arus Masuk Pelamar (Inbound ATS)</h3>
              <p className="text-xs text-slate-500">Statistik jumlah berkas masuk per minggu dalam 6 minggu terakhir</p>
            </div>
            <span className="text-xs font-semibold text-purple-600 font-mono-numbers">Q4 2026</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-4 pt-6 px-2">
            {[
              { week: 'W1', count: 4, height: '30%' },
              { week: 'W2', count: 7, height: '50%' },
              { week: 'W3', count: 11, height: '75%' },
              { week: 'W4', count: 14, height: '90%' },
              { week: 'W5', count: 16, height: '100%' },
              { week: 'W6', count: 12, height: '80%' },
            ].map((col) => (
              <div key={col.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold text-slate-700 font-mono-numbers">{col.count}</span>
                <div
                  className="w-full bg-purple-100 hover:bg-purple-600 transition-all rounded-t-lg group relative"
                  style={{ height: col.height }}
                />
                <span className="text-[11px] text-slate-500 font-medium">{col.week}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata waktu screening CV: 1,8 hari kerja</span>
            <span className="text-purple-600 font-medium">Lolos tahap review: 35%</span>
          </div>
        </div>

        {/* Candidate Distribution Mini Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Ringkasan Pipeline Kandidat</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-xs text-slate-700 font-medium">Review / Screening</span>
              <span className="text-xs font-bold text-amber-700 font-mono-numbers">
                {underReviewCandidates.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-100">
              <span className="text-xs text-purple-900 font-medium">Jadwal Wawancara</span>
              <span className="text-xs font-bold text-purple-700 font-mono-numbers">
                {interviewCandidates.length}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs text-emerald-900 font-medium">Penawaran (Offered)</span>
              <span className="text-xs font-bold text-emerald-700 font-mono-numbers">
                {offeredCandidates.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('recruiter_candidates')}
            className="w-full py-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-purple-200 text-center"
          >
            Buka Pipeline Kandidat Penuh
          </button>
        </div>
      </div>

      {/* Row: Recent Candidates Table + Company Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Candidates List */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pelamar Masuk Terbaru</h3>
              <p className="text-xs text-slate-500">Tinjau profil dan jadwalkan sesi interview</p>
            </div>
            <button
              onClick={() => onNavigateTab('recruiter_candidates')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              <span>Semua Kandidat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-100 font-semibold">
                <tr>
                  <th className="px-3 py-2.5">Kandidat</th>
                  <th className="px-3 py-2.5">Posisi Dilamar</th>
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {candidateApps.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-3 py-3">
                      <div className="font-bold text-slate-900">{cand.jobSeekerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{cand.jobSeekerEmail}</div>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-800">{cand.jobTitle}</td>
                    <td className="px-3 py-3 font-mono-numbers text-slate-600">{cand.appliedAt}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={cand.status} size="sm" />
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        onClick={() => onOpenCandidateDetail(cand.id)}
                        className="px-2.5 py-1 text-xs font-semibold text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
                      >
                        Evaluasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Jobs Mini List */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Lowongan Perusahaan</h3>
            <button
              onClick={() => onNavigateTab('recruiter_jobs')}
              className="text-xs text-purple-600 hover:underline"
            >
              Kelola
            </button>
          </div>

          <div className="space-y-3">
            {companyJobs.map((job) => (
              <div
                key={job.id}
                className="p-3 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-slate-50 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{job.title}</h4>
                  <StatusBadge status={job.status} size="sm" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>{job.type} · {job.location}</span>
                  <span className="font-semibold text-purple-700 font-mono-numbers">
                    {job.applicantsCount} Pelamar
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
