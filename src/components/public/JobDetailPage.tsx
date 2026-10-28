import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Bookmark,
  Award,
  Globe,
  Users,
  CheckCircle2,
  Building2,
  Share2,
} from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';
import { JobPosting } from '../../types';

export const JobDetailPage: React.FC = () => {
  const {
    selectedJobId,
    jobPostings,
    savedJobIds,
    toggleSaveJob,
    setActiveView,
    setSelectedJobId,
    companies,
    addToast,
  } = useApp();

  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const job = jobPostings.find((j) => j.id === selectedJobId) || jobPostings[0];
  const company = companies.find((c) => c.id === job?.companyId);
  const isSaved = job ? savedJobIds.includes(job.id) : false;

  const similarJobs = jobPostings
    .filter((j) => j.id !== job?.id && j.status === 'published' && j.jobCategoryId === job?.jobCategoryId)
    .slice(0, 2);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Gaji Kompetitif (Negosiasi)';
    const fMin = min ? `Rp ${(min / 1000000).toLocaleString('id-ID')} Juta` : '';
    const fMax = max ? `Rp ${(max / 1000000).toLocaleString('id-ID')} Juta` : '';
    if (min && max) return `${fMin} - ${fMax} per bulan`;
    return `${fMin || fMax} per bulan`;
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Tautan Disalin', 'Tautan lowongan telah disalin ke clipboard.');
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-slate-600 mb-4">Lowongan tidak ditemukan.</p>
          <button
            onClick={() => setActiveView('job_catalog')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Back */}
        <button
          onClick={() => setActiveView('job_catalog')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Lowongan</span>
        </button>

        {/* Job Header Hero Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.companyName}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-2xl object-contain border border-slate-100 p-1.5 bg-white shrink-0 shadow-2xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-lg shrink-0">
                  {job.companyName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {job.title}
                </h1>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <span>{job.companyName}</span>
                  {job.isCompanyVerified && (
                    <span title="Perusahaan Terverifikasi">
                      <Award className="w-4 h-4 text-blue-600" />
                    </span>
                  )}
                </div>

                {/* Unboxed Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-medium text-slate-700">{job.type}</span>
                  <span aria-hidden="true">·</span>
                  <span>{job.categoryName}</span>
                  <span aria-hidden="true">·</span>
                  <span>Dipublikasikan {job.createdAt}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:self-start shrink-0">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                title="Bagikan lowongan"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Simpan lowongan"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
              >
                Lamar Sekarang
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Estimasi Kompensasi</span>
              <span className="font-bold text-slate-900 font-mono-numbers">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Batas Pengiriman Lamaran</span>
              <span className="font-semibold text-slate-900">{job.closingDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Pelamar Terdaftar</span>
              <span className="font-semibold text-slate-900 font-mono-numbers">{job.applicantsCount} Orang</span>
            </div>
          </div>
        </div>

        {/* Content Split: Job Body vs Company Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Description */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-8">
            {/* Description */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs text-blue-600">
                Deskripsi Pekerjaan
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </section>

            {/* Responsibilities */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs text-blue-600">
                Tanggung Jawab Utama
              </h2>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Requirements */}
            <section className="space-y-3">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs text-blue-600">
                Persyaratan & Kualifikasi
              </h2>
              <ul className="space-y-2">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Bottom Apply CTA */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Tertarik dengan posisi ini?</p>
                <p className="text-xs font-semibold text-slate-800">Kirimkan CV terbaru Anda hari ini.</p>
              </div>
              <button
                onClick={() => setIsApplyOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
              >
                Lamar Sekarang
              </button>
            </div>
          </div>

          {/* Company Profile Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Tentang Perusahaan
              </h3>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>{job.companyName}</span>
                  {job.isCompanyVerified && (
                    <span title="Terverifikasi">
                      <Award className="w-4 h-4 text-blue-600" />
                    </span>
                  )}
                </div>

                <p className="leading-relaxed">
                  {company?.description ||
                    'Perusahaan terkemuka yang beroperasi di sektor teknologi dan berkomitmen pada inovasi berkelanjutan.'}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>Industri: {company?.industry || 'Teknologi Informasi'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Ukuran: {company?.employeeRange || '50 - 150 Karyawan'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <a
                      href={company?.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {company?.website || 'https://perusahaan.co.id'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Jobs Recommendation */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Rekomendasi Serupa
                </h3>
                <div className="space-y-3">
                  {similarJobs.map((simJob) => (
                    <div
                      key={simJob.id}
                      onClick={() => {
                        setSelectedJobId(simJob.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600">
                        {simJob.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {simJob.companyName} · {simJob.location}
                      </p>
                      <p className="text-[11px] font-semibold text-slate-700 mt-1 font-mono-numbers">
                        {formatSalary(simJob.salaryMin, simJob.salaryMax)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyJobModal
        job={job}
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
      />
    </div>
  );
};
