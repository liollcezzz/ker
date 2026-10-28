import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { AddExternalAppModal } from './AddExternalAppModal';
import { AppDetailModal } from './AppDetailModal';
import {
  PlusCircle,
  ExternalLink,
  Calendar,
  Edit2,
  FileText,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const JobSeekerExternalTracker: React.FC = () => {
  const { applications, updateApplicationStatus, currentUser } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Filter only external applications (jobPostingId === null)
  const externalApps = applications.filter((a) => a.jobPostingId === null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Pelacak Pribadi (Lamaran Eksternal)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Kelola dan perbarui status lamaran kerja yang Anda kirimkan dari luar platform CareerTrack.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Lamaran Eksternal</span>
        </button>
      </div>

      {/* Transparent Disclaimer Box */}
      <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Perhatian Mengenai Pembaruan Status:</strong> Status lamaran dari situs eksternal (LinkedIn, JobStreet, Website Perusahaan) <strong>diperbarui secara manual</strong> oleh Anda saat menerima kabar/email dari recruiter terkait. Sistem tidak melakukan sinkronisasi otomatis dari database pihak ketiga.
        </div>
      </div>

      {/* Grid of External Applications */}
      {externalApps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum ada lamaran eksternal</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Pernah melamar lewat LinkedIn, job fair, atau situs karir perusahaan? Catat sekarang agar Anda selalu siap menghadapi jadwal wawancara.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
          >
            Catat Lamaran Pertama
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {externalApps.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{app.jobTitle}</h3>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">{app.companyName}</div>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-1">
                  <span className="font-medium text-slate-700">{app.source}</span>
                  <span aria-hidden="true">·</span>
                  <span>Melamar: {app.appliedAt}</span>
                  {app.externalUrl && (
                    <>
                      <span aria-hidden="true">·</span>
                      <a
                        href={app.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Tautan</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>

                {app.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2">
                    {app.notes}
                  </p>
                )}

                {app.interview && (
                  <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 text-[11px] text-purple-900 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-purple-600" />
                      Wawancara: {app.interview.scheduledAt}
                    </span>
                    <span className="capitalize text-purple-700 font-semibold">{app.interview.type}</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  {app.statusHistories.length} riwayat status
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                  >
                    Detail & Perbarui
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddExternalAppModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <AppDetailModal
        application={selectedApp}
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
      />
    </div>
  );
};
