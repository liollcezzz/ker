import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RecruiterSidebar } from './RecruiterSidebar';
import { RecruiterHome } from './RecruiterHome';
import { RecruiterCompanyProfile } from './RecruiterCompanyProfile';
import { RecruiterJobs } from './RecruiterJobs';
import { RecruiterJobForm } from './RecruiterJobForm';
import { RecruiterCandidates } from './RecruiterCandidates';
import { JobPosting } from '../../types';
import { BarChart3, TrendingUp, Users, Calendar, CheckCircle2 } from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { applications, jobPostings, companies, currentUser } = useApp();
  const currentCompany = companies.find((c) => c.userId === currentUser.id) || companies[0];
  const companyJobs = jobPostings.filter((j) => j.companyId === currentCompany.id);
  const companyJobIds = companyJobs.map((j) => j.id);
  const companyApps = applications.filter((a) => a.jobPostingId && companyJobIds.includes(a.jobPostingId));

  const [currentTab, setCurrentTab] = useState<string>('recruiter_dashboard');
  const [jobToEdit, setJobToEdit] = useState<JobPosting | null>(null);
  const [selectedCandidateAppId, setSelectedCandidateAppId] = useState<number | null>(null);

  const handleEditJob = (job: JobPosting) => {
    setJobToEdit(job);
    setCurrentTab('recruiter_add_job');
  };

  const handleOpenCandidateDetail = (appId: number) => {
    setSelectedCandidateAppId(appId);
    setCurrentTab('recruiter_candidates');
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'recruiter_dashboard':
        return (
          <RecruiterHome
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenCandidateDetail={handleOpenCandidateDetail}
          />
        );
      case 'recruiter_company':
        return <RecruiterCompanyProfile />;
      case 'recruiter_jobs':
        return (
          <RecruiterJobs
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onEditJob={handleEditJob}
            onViewApplicants={(jobId) => {
              setCurrentTab('recruiter_candidates');
            }}
          />
        );
      case 'recruiter_add_job':
        return (
          <RecruiterJobForm
            jobToEdit={jobToEdit}
            onSuccess={() => {
              setJobToEdit(null);
              setCurrentTab('recruiter_jobs');
            }}
            onCancel={() => {
              setJobToEdit(null);
              setCurrentTab('recruiter_jobs');
            }}
          />
        );
      case 'recruiter_candidates':
        return (
          <RecruiterCandidates
            initialAppId={selectedCandidateAppId}
            onCloseDetail={() => setSelectedCandidateAppId(null)}
          />
        );
      case 'recruiter_interviews':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h1 className="text-xl font-bold text-slate-900">Agenda Wawancara Kandidat</h1>
              <p className="text-xs text-slate-500 mt-0.5">Daftar sesi wawancara yang telah dijadwalkan oleh tim rekrutmen Anda.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              {companyApps.filter((a) => a.interview).map((a) => (
                <div key={a.id} className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{a.jobSeekerName}</div>
                    <div className="text-purple-700 font-medium">{a.jobTitle}</div>
                    <div className="text-slate-500 mt-1 font-mono-numbers">{a.interview?.scheduledAt} WIB ({a.interview?.type})</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={a.interview?.locationOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Buka Ruang Meeting
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'recruiter_reports':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
              <h1 className="text-xl font-bold text-slate-900">Laporan & Metrik Rekrutmen</h1>
              <p className="text-xs text-slate-500 mt-0.5">Analisis efektivitas publikasi lowongan dan konversi tahapan seleksi.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">Total Pelamar Masuk</span>
                <div className="text-3xl font-extrabold text-slate-900 font-mono-numbers">{companyApps.length}</div>
                <p className="text-slate-500">Dari seluruh lowongan aktif</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">Tingkat Screening Lolos</span>
                <div className="text-3xl font-extrabold text-purple-700 font-mono-numbers">50.0%</div>
                <p className="text-slate-500">Maju ke tahap wawancara / review</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-slate-500 uppercase tracking-wider text-[11px] font-bold">Rata-rata Waktu Proses</span>
                <div className="text-3xl font-extrabold text-emerald-700 font-mono-numbers">4.2 Hari</div>
                <p className="text-slate-500">Dari submit hingga wawancara</p>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <RecruiterHome
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenCandidateDetail={handleOpenCandidateDetail}
          />
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-slate-100/60">
      <RecruiterSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setJobToEdit(null);
          setCurrentTab(tab);
        }}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};
