import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { ShieldCheck, CheckCircle2, XCircle, Search, Eye, AlertTriangle } from 'lucide-react';

export const AdminModeration: React.FC = () => {
  const { jobPostings, moderateJob } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending_review' | 'published' | 'rejected'>('pending_review');
  const [rejectingJob, setRejectingJob] = useState<JobPosting | null>(null);
  const [rejectReason, setRejectReason] = useState('Persyaratan kualifikasi dan kompensasi belum memenuhi standar komunitas.');

  const filtered = jobPostings.filter((job) => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  const handleConfirmReject = () => {
    if (rejectingJob) {
      moderateJob(rejectingJob.id, 'reject', rejectReason);
      setRejectingJob(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Moderasi & Kepatuhan Lowongan Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tinjau lowongan baru dari recruiter sebelum dipublikasikan kepada pencari kerja.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setFilter('pending_review')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            filter === 'pending_review'
              ? 'bg-amber-500 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Menunggu Review ({jobPostings.filter((j) => j.status === 'pending_review').length})
        </button>
        <button
          onClick={() => setFilter('published')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            filter === 'published'
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Disetujui ({jobPostings.filter((j) => j.status === 'published').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            filter === 'rejected'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Ditolak ({jobPostings.filter((j) => j.status === 'rejected').length})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-2 rounded-xl transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Semua Lowongan ({jobPostings.length})
        </button>
      </div>

      {/* Moderation Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Tidak ada lowongan pada status ini</h3>
          <p className="text-xs text-slate-500">Semua lowongan telah diproses atau belum ada kiriman baru.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} size="sm" />
                    <span className="text-xs text-slate-500 font-mono-numbers">ID #{job.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 pt-1">{job.title}</h3>
                  <div className="text-xs font-semibold text-slate-700">
                    {job.companyName} · {job.location} · {job.type}
                  </div>
                </div>

                <div className="text-xs text-slate-500 sm:text-right">
                  <div>Diajukan pada: {job.createdAt}</div>
                  <div>Batas: {job.closingDate}</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-700 space-y-2">
                <div className="font-semibold text-slate-900">Deskripsi yang Diajukan:</div>
                <p className="leading-relaxed">{job.description}</p>
                {job.rejectionReason && (
                  <div className="p-2.5 bg-rose-50 rounded-lg border border-rose-200 text-rose-800 text-[11px]">
                    <strong>Alasan Penolakan:</strong> {job.rejectionReason}
                  </div>
                )}
              </div>

              {/* Action Buttons for Admin */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                {job.status !== 'published' && (
                  <button
                    onClick={() => moderateJob(job.id, 'approve')}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui & Publikasikan</span>
                  </button>
                )}

                {job.status !== 'rejected' && (
                  <button
                    onClick={() => setRejectingJob(job)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak Lowongan</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {rejectingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Tolak Publikasi Lowongan
            </h3>
            <p className="text-xs text-slate-600">
              Berikan alasan penolakan agar recruiter dapat memperbaiki informasi lowongan "{rejectingJob.title}".
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-900 resize-none"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingJob(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-2xs"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
