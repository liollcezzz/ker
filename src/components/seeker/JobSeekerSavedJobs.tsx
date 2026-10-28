import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';
import { Bookmark, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { ApplyJobModal } from '../public/ApplyJobModal';

export const JobSeekerSavedJobs: React.FC = () => {
  const { savedJobIds, jobPostings, toggleSaveJob, setSelectedJobId, setActiveView } = useApp();
  const [selectedApplyJob, setSelectedApplyJob] = useState<JobPosting | null>(null);

  const savedJobs = jobPostings.filter((job) => savedJobIds.includes(job.id));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Lowongan Tersimpan ({savedJobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar posisi favorit yang Anda tandai untuk persiapan lamaran.
          </p>
        </div>

        <button
          onClick={() => setActiveView('job_catalog')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors shrink-0"
        >
          <span>Eksplorasi Lowongan Baru</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum ada lowongan tersimpan</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Jelajahi halaman lowongan kerja dan klik ikon penanda (bookmark) untuk menyimpan lowongan yang Anda minati.
          </p>
          <button
            onClick={() => setActiveView('job_catalog')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            Lihat Lowongan Kerja
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3
                      onClick={() => {
                        setSelectedJobId(job.id);
                        setActiveView('job_detail');
                      }}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {job.title}
                    </h3>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">{job.companyName}</div>
                  </div>
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 border border-rose-100 transition-colors"
                    title="Hapus dari tersimpan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-slate-700">{job.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>Batas: {job.closingDate}</span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 font-mono-numbers">
                  {job.salaryMin
                    ? `Rp ${(job.salaryMin / 1000000).toLocaleString('id-ID')} - ${(
                        (job.salaryMax || 0) / 1000000
                      ).toLocaleString('id-ID')} Jt`
                    : 'Kompetitif'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveView('job_detail');
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => setSelectedApplyJob(job)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                  >
                    Lamar Sekarang
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ApplyJobModal
        job={selectedApplyJob}
        isOpen={!!selectedApplyJob}
        onClose={() => setSelectedApplyJob(null)}
      />
    </div>
  );
};
