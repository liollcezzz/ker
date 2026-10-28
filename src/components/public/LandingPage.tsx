import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  MapPin,
  Briefcase,
  CheckCircle2,
  Bookmark,
  ArrowRight,
  TrendingUp,
  FileText,
  Calendar,
  Building2,
  Users,
  Award,
  Sparkles,
} from 'lucide-react';
import { ApplyJobModal } from './ApplyJobModal';
import { JobPosting } from '../../types';

export const LandingPage: React.FC = () => {
  const { jobPostings, savedJobIds, toggleSaveJob, setActiveView, setSelectedJobId, switchRole } = useApp();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedApplyJob, setSelectedApplyJob] = useState<JobPosting | null>(null);

  const activeJobs = jobPostings.filter((j) => j.status === 'published').slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveView('job_catalog');
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Gaji Kompetitif';
    const fMin = min ? `Rp ${(min / 1000000).toLocaleString('id-ID')} Juta` : '';
    const fMax = max ? `Rp ${(max / 1000000).toLocaleString('id-ID')} Juta` : '';
    if (min && max) return `${fMin} - ${fMax}`;
    return fMin || fMax;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src="/src/assets/images/careertrack_hero_office_1793221552261.jpg"
            alt="Office workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Platform Pelacakan Karir & Rekrutmen Modern
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                Kelola Lamaran Kerja, Bangun Kariermu.
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Pantau setiap lamaran kerja pribadi—baik dari LinkedIn, portal karir, maupun internal—serta bantu recruiter mengelola kandidat dalam satu sistem terintegrasi.
              </p>

              {/* Search Box Card */}
              <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-xl border border-slate-200 text-slate-900">
                <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl">
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Posisi, keahlian, atau perusahaan..."
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 text-slate-900"
                    />
                  </div>

                  <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Lokasi (Jakarta, Remote, Bandung)..."
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm focus:outline-none placeholder:text-slate-400 text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shrink-0 shadow-xs"
                  >
                    <span>Cari Lowongan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Quick Actions & Demo Switcher */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
                <span>Akses Cepat Demo:</span>
                <button
                  onClick={() => switchRole('job_seeker')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Mode Pencari Kerja
                </button>
                <button
                  onClick={() => switchRole('recruiter')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Mode Recruiter
                </button>
                <button
                  onClick={() => switchRole('admin')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Mode Administrator
                </button>
              </div>
            </div>

            {/* Visual Hero Feature Box */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700 text-xs">
                  <span className="font-semibold text-slate-200">Aktivitas Pelacakan Real-time</span>
                  <span className="text-emerald-400 font-medium">Demo Aktif</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs">
                        PT
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Junior Backend Developer</div>
                        <div className="text-[11px] text-slate-400">PT Nusantara Tech · CareerTrack</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                      Interview
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        TK
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Software Engineer Intern</div>
                        <div className="text-[11px] text-slate-400">Tokopedia · LinkedIn (Eksternal)</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                      Submitted
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                        KN
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Fullstack Developer Intern</div>
                        <div className="text-[11px] text-slate-400">Karya Edukasi · CareerTrack</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                      Offered
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Mendukung pelacakan internal & eksternal</span>
                  <span className="text-slate-300 font-mono-numbers">100% Fleksibel</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quantitative Rigor Strip */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">9.840+</div>
              <div className="text-xs text-slate-500">Pelamar Aktif Terdaftar</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">420+</div>
              <div className="text-xs text-slate-500">Perusahaan Mitra</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">1.850+</div>
              <div className="text-xs text-slate-500">Lowongan Pekerjaan</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono-numbers">94%</div>
              <div className="text-xs text-slate-500">Tingkat Ketepatan Jadwal Wawancara</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Value Proposition Section (Pencari Kerja vs Recruiter) */}
      <section className="py-16 bg-slate-50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Satu Platform untuk Dua Kebutuhan Utama
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              CareerTrack menjembatani kebutuhan pelacakan mandiri pencari kerja dan efisiensi manajemen rekrutmen perusahaan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Value 1: Job Seeker */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Untuk Pencari Kerja & Fresh Graduate</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Tidak ada lagi spreadsheet rumit yang berantakan. Catat lamaran dari CareerTrack, LinkedIn, portal kerja lain, maupun email langsung di satu tempat.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pelacak Mandiri Eksternal:</strong> Catat lamaran dari LinkedIn atau situs perusahaan dengan status manual.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Manajemen Berkas CV:</strong> Atur CV utama, portofolio, dan surat lamaran dalam ruang privat.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Jadwal & Catatan Wawancara:</strong> Tautan Google Meet / lokasi tes tersusun rapi dengan catatan persiapan.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => switchRole('job_seeker')}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-colors text-center"
                >
                  Buka Dashboard Pencari Kerja Demo
                </button>
              </div>
            </div>

            {/* Value 2: Recruiter */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Untuk Recruiter & Tim HR Perusahaan</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Publikasikan lowongan kerja, kumpulkan pelamar secara terpusat, lakukan evaluasi privat, dan jadwalkan sesi wawancara tanpa repot.
                </p>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pipeline ATS Ringkas:</strong> Pantau tahapan kandidat mulai dari Submitted hingga Offered.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Catatan Evaluasi Privat:</strong> Kolaborasi internal recruiter yang tersembunyi dari kandidat.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Manajemen Lowongan:</strong> Draft, publikasi, dan tutup lowongan dengan kendali penuh.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  onClick={() => switchRole('recruiter')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm transition-colors text-center"
                >
                  Buka Dashboard Recruiter Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Featured Jobs Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Lowongan Pekerjaan Terbaru</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Pilihan karir terverifikasi dari perusahaan teknologi terkemuka.
              </p>
            </div>
            <button
              onClick={() => setActiveView('job_catalog')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              <span>Lihat Semua Lowongan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeJobs.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-xl object-contain border border-slate-100 shrink-0 bg-white p-1"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                            {job.companyName.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setActiveView('job_detail');
                            }}
                            className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
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

                    {/* Unboxed Metadata per Anti-Slop Guide */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{job.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">{job.type}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.categoryName}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-xs font-semibold text-slate-900 font-mono-numbers">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </div>
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Realistic Dummy Testimonials */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kisah Sukses Pengguna</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Testimoni contoh dari fresh graduate dan praktisi HR pengguna CareerTrack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "Fitur pelacak eksternal sangat menolong saya saat melamar 25+ posisi di berbagai platform. Saya tidak pernah lagi melewatkan jadwal technical interview."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  RA
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Rizky Aditya</div>
                  <div className="text-[11px] text-slate-500">Junior Frontend Dev di Fintech</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "Sebagai recruiter software house, pipeline kandidat di CareerTrack membuat review CV dan catatan teknis tersusun rapi tanpa repot spreadsheet."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                  DW
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Dewi Wulandari</div>
                  <div className="text-[11px] text-slate-500">HR Talent Lead PT Megantara</div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "Arsitektur database yang rapi memungkinkan integrasi mudah antara pelamar internal dan lamaran manual. Sangat cocok dijadikan referensi proyek Laravel."
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  AS
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Ahmad Syahrir, M.Kom.</div>
                  <div className="text-[11px] text-slate-500">Dosen Rekayasa Web & Cloud</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-extrabold">
                  CT
                </div>
                <span>CareerTrack</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platform pelacakan lamaran kerja pribadi dan rekrutmen perusahaan berbasis web yang dirancang untuk dikembangkan dengan Laravel 11 & MySQL.
              </p>
            </div>

            <div>
              <div className="text-slate-200 font-semibold mb-3">Navigasi Utama</div>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveView('landing')} className="hover:text-white">Beranda</button></li>
                <li><button onClick={() => setActiveView('job_catalog')} className="hover:text-white">Cari Lowongan</button></li>
                <li><button onClick={() => switchRole('job_seeker')} className="hover:text-white">Dashboard Pelamar</button></li>
                <li><button onClick={() => switchRole('recruiter')} className="hover:text-white">Dashboard Recruiter</button></li>
              </ul>
            </div>

            <div>
              <div className="text-slate-200 font-semibold mb-3">Teknologi & Spek</div>
              <ul className="space-y-2">
                <li><span>Backend: Laravel 11 (PHP 8.3)</span></li>
                <li><span>Frontend: Blade + Tailwind CSS</span></li>
                <li><span>Database: MySQL 8.0 (3NF)</span></li>
                <li><span>Cloud: VPS / Cloud Container</span></li>
              </ul>
            </div>

            <div>
              <div className="text-slate-200 font-semibold mb-3">Kontak & Bantuan</div>
              <p className="text-xs text-slate-400 leading-relaxed mb-2">
                Pusat Bantuan Pelamar & Dukungan Teknis Kampus:
              </p>
              <div className="font-mono text-slate-300">support@careertrack.id</div>
              <div className="text-slate-400 mt-1">+62 21 555-0199</div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 CareerTrack. Dirancang untuk Pengembangan Berbasis Laravel & Cloud Computing.
            </div>
            <div className="flex items-center gap-4">
              <span>Keamanan Data</span>
              <span>Kebijakan Privasi</span>
              <span>Dokumentasi API</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Apply Modal */}
      <ApplyJobModal
        job={selectedApplyJob}
        isOpen={!!selectedApplyJob}
        onClose={() => setSelectedApplyJob(null)}
      />
    </div>
  );
};
