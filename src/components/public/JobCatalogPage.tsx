import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting, JobType } from '../../types';
import {
  Search,
  MapPin,
  Filter,
  Bookmark,
  Award,
  Calendar,
  DollarSign,
  ArrowRight,
  RotateCcw,
  Briefcase,
} from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';

export const JobCatalogPage: React.FC = () => {
  const { jobPostings, categories, savedJobIds, toggleSaveJob, setSelectedJobId, setActiveView } = useApp();
  const [keyword, setKeyword] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedJobTypes, setSelectedJobTypes] = useState<JobType[]>([]);
  const [sortBy, setSortBy] = useState<'latest' | 'salary_high' | 'salary_low'>('latest');
  const [selectedApplyJob, setSelectedApplyJob] = useState<JobPosting | null>(null);

  const jobTypeOptions: JobType[] = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  const toggleJobType = (type: JobType) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const resetFilters = () => {
    setKeyword('');
    setLocationFilter('');
    setSelectedCategory('all');
    setSelectedJobTypes([]);
    setSortBy('latest');
  };

  const filteredJobs = useMemo(() => {
    return jobPostings
      .filter((job) => job.status === 'published')
      .filter((job) => {
        if (keyword.trim()) {
          const matchTitle = job.title.toLowerCase().includes(keyword.toLowerCase());
          const matchCompany = job.companyName.toLowerCase().includes(keyword.toLowerCase());
          const matchDesc = job.description.toLowerCase().includes(keyword.toLowerCase());
          if (!matchTitle && !matchCompany && !matchDesc) return false;
        }

        if (locationFilter.trim()) {
          if (!job.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
        }

        if (selectedCategory !== 'all') {
          if (job.jobCategoryId !== selectedCategory) return false;
        }

        if (selectedJobTypes.length > 0) {
          if (!selectedJobTypes.includes(job.type)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'salary_high') {
          return (b.salaryMax || 0) - (a.salaryMax || 0);
        }
        if (sortBy === 'salary_low') {
          return (a.salaryMin || 0) - (b.salaryMin || 0);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [jobPostings, keyword, locationFilter, selectedCategory, selectedJobTypes, sortBy]);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Gaji Kompetitif';
    const fMin = min ? `Rp ${(min / 1000000).toLocaleString('id-ID')} Juta` : '';
    const fMax = max ? `Rp ${(max / 1000000).toLocaleString('id-ID')} Juta` : '';
    if (min && max) return `${fMin} - ${fMax}`;
    return fMin || fMax;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Eksplorasi Lowongan Kerja
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Temukan kesempatan karir terbaik dan lamar langsung secara online melalui CareerTrack.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-5 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Cari berdasarkan jabatan, perusahaan..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
              />
            </div>

            <div className="md:col-span-4 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Kota atau Remote..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
              />
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-700"
              >
                <option value="latest">Terbaru Dipublikasikan</option>
                <option value="salary_high">Gaji Tertinggi</option>
                <option value="salary_low">Gaji Terendah</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content Layout (Sidebar Filters + Results Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                Filter Lowongan
              </span>
              <button
                onClick={resetFilters}
                className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">Kategori Bidang</label>
              <select
                value={selectedCategory}
                onChange={(e) =>
                  setSelectedCategory(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-700"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-2">Tipe Pekerjaan</label>
              <div className="space-y-2">
                {jobTypeOptions.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900 select-none"
                  >
                    <input
                      type="checkbox"
                      checked={selectedJobTypes.includes(type)}
                      onChange={() => toggleJobType(type)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
              <strong>Tips Pelamar:</strong> Simpan lowongan menarik ke daftar favorit untuk mempersiapkan CV dan portofolio terbaik sebelum melamar.
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-9 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Menampilkan <strong className="text-slate-900 font-mono-numbers">{filteredJobs.length}</strong> lowongan kerja aktif</span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Tidak ada lowongan yang cocok</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian, sesuaikan filter lokasi, atau reset filter untuk melihat seluruh peluang.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredJobs.map((job) => {
                  const isSaved = savedJobIds.includes(job.id);
                  return (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3.5">
                            {job.companyLogo ? (
                              <img
                                src={job.companyLogo}
                                alt={job.companyName}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-xl object-contain border border-slate-100 shrink-0 bg-white p-1"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                                {job.companyName.substring(0, 2).toUpperCase()}
                              </div>
                            )}

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
                              <div className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1.5">
                                <span>{job.companyName}</span>
                                {job.isCompanyVerified && (
                                  <span title="Perusahaan Terverifikasi">
                                    <Award className="w-3.5 h-3.5 text-blue-600" />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleSaveJob(job.id)}
                            className={`p-2 rounded-lg border transition-colors ${
                              isSaved
                                ? 'bg-amber-50 border-amber-200 text-amber-600'
                                : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                            }`}
                            aria-label="Simpan lowongan"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>
                        </div>

                        {/* Unboxed Metadata per Anti-Slop Discipline */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span>{job.location}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-semibold text-slate-700">{job.type}</span>
                          <span aria-hidden="true">·</span>
                          <span>{job.categoryName}</span>
                          <span aria-hidden="true">·</span>
                          <span>Batas: {job.closingDate}</span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <div className="text-xs sm:text-sm font-semibold text-slate-900 font-mono-numbers">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setActiveView('job_detail');
                            }}
                            className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            Lihat Rincian
                          </button>
                          <button
                            onClick={() => setSelectedApplyJob(job)}
                            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
                          >
                            Lamar Sekarang
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <ApplyJobModal
        job={selectedApplyJob}
        isOpen={!!selectedApplyJob}
        onClose={() => setSelectedApplyJob(null)}
      />
    </div>
  );
};
