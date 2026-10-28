import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting, JobPostingStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { ModalConfirm } from '../ui/ModalConfirm';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Users,
  XCircle,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  Clock,
} from 'lucide-react';

interface Props {
  onNavigateTab: (tab: string) => void;
  onEditJob: (job: JobPosting) => void;
  onViewApplicants: (jobId: number) => void;
}

export const RecruiterJobs: React.FC<Props> = ({ onNavigateTab, onEditJob, onViewApplicants }) => {
  const { jobPostings, closeJobPosting, deleteJobPosting, companies, currentUser } = useApp();
  const currentCompany = companies.find((c) => c.userId === currentUser.id) || companies[0];

  const [jobToDelete, setJobToDelete] = useState<JobPosting | null>(null);
  const [jobToClose, setJobToClose] = useState<JobPosting | null>(null);

  const companyJobs = jobPostings.filter((j) => j.companyId === currentCompany.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Lowongan Kerja ({companyJobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar seluruh lowongan yang diterbitkan oleh {currentCompany.name}.
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

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {companyJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Belum ada lowongan dibuat</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Mulai rekrut talenta terbaik dengan menerbitkan lowongan pekerjaan baru.
            </p>
            <button
              onClick={() => onNavigateTab('recruiter_add_job')}
              className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 rounded-lg"
            >
              Buat Lowongan Sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-4 py-3.5">Judul Lowongan</th>
                  <th className="px-4 py-3.5">Lokasi & Tipe</th>
                  <th className="px-4 py-3.5">Tanggal Tayang</th>
                  <th className="px-4 py-3.5">Batas Lamaran</th>
                  <th className="px-4 py-3.5">Pelamar</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {companyJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{job.categoryName}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-slate-800">{job.location}</div>
                      <div className="text-[11px] text-slate-500">{job.type}</div>
                    </td>
                    <td className="px-4 py-3.5 font-mono-numbers text-slate-600">
                      {job.createdAt}
                    </td>
                    <td className="px-4 py-3.5 font-mono-numbers text-slate-600">
                      {job.closingDate}
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => onViewApplicants(job.id)}
                        className="px-2.5 py-1 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors font-mono-numbers"
                      >
                        {job.applicantsCount} Orang
                      </button>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={job.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewApplicants(job.id)}
                          className="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Lihat Pelamar"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditJob(job)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Lowongan"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {job.status === 'published' && (
                          <button
                            onClick={() => setJobToClose(job)}
                            className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Tutup Penerimaan"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setJobToDelete(job)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Hapus Lowongan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Close Job Modal */}
      <ModalConfirm
        isOpen={!!jobToClose}
        title="Tutup Lowongan Pekerjaan?"
        message={`Apakah Anda yakin ingin menutup lowongan "${jobToClose?.title}"? Pelamar tidak akan dapat lagi mengirimkan lamaran untuk posisi ini.`}
        confirmLabel="Tutup Lowongan"
        isDestructive={false}
        onConfirm={() => {
          if (jobToClose) closeJobPosting(jobToClose.id);
        }}
        onClose={() => setJobToClose(null)}
      />

      {/* Delete Job Modal */}
      <ModalConfirm
        isOpen={!!jobToDelete}
        title="Hapus Lowongan Pekerjaan?"
        message={`Apakah Anda yakin ingin menghapus "${jobToDelete?.title}" secara permanen? Data lamaran terkait mungkin terpengaruh.`}
        confirmLabel="Hapus Permanen"
        isDestructive={true}
        onConfirm={() => {
          if (jobToDelete) deleteJobPosting(jobToDelete.id);
        }}
        onClose={() => setJobToDelete(null)}
      />
    </div>
  );
};
