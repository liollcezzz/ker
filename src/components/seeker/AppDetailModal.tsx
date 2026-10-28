import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import {
  X,
  Building2,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  Video,
  AlertTriangle,
  Edit2,
  Check,
} from 'lucide-react';

interface Props {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppDetailModal: React.FC<Props> = ({ application, isOpen, onClose }) => {
  const { updateApplicationStatus, currentUser } = useApp();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('submitted');
  const [statusReason, setStatusReason] = useState('');

  if (!isOpen || !application) return null;

  const isExternal = application.jobPostingId === null;

  const handleUpdateStatus = () => {
    updateApplicationStatus(
      application.id,
      newStatus,
      statusReason || `Status diperbarui manual oleh ${currentUser.name}.`
    );
    setIsEditingStatus(false);
    setStatusReason('');
  };

  const handleWithdraw = () => {
    if (confirm('Apakah Anda yakin ingin membatalkan/menarik lamaran ini?')) {
      updateApplicationStatus(
        application.id,
        'withdrawn',
        'Lamaran dibatalkan/ditarik mandiri oleh pelamar.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-100">
              {application.companyName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{application.jobTitle}</h3>
              <p className="text-xs text-slate-500 font-medium">
                {application.companyName} · Sumber: <span className="text-slate-800">{application.source}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Status & Quick Info Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center gap-3">
              <span className="text-slate-500 font-medium">Status Saat Ini:</span>
              <StatusBadge status={application.status} />
            </div>

            <div className="flex items-center gap-2">
              {isExternal ? (
                <button
                  onClick={() => {
                    setNewStatus(application.status);
                    setIsEditingStatus(!isEditingStatus);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ubah Status Manual</span>
                </button>
              ) : (
                application.status !== 'withdrawn' &&
                application.status !== 'rejected' && (
                  <button
                    onClick={handleWithdraw}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Tarik Lamaran</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Edit status form if open */}
          {isEditingStatus && (
            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-3">
              <div className="font-semibold text-slate-900 text-xs">Perbarui Status Lamaran Eksternal</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Pilih Status Baru:</label>
                  <select
                    value={newStatus}
                    onChange={(e: any) => setNewStatus(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="interview">Interview</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Alasan / Catatan Perubahan:</label>
                  <input
                    type="text"
                    placeholder="cth: Mendapat panggilan via WhatsApp..."
                    value={statusReason}
                    onChange={(e) => setStatusReason(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingStatus(false)}
                  className="px-3 py-1 text-slate-600 hover:bg-white rounded-md"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md font-semibold"
                >
                  Simpan Status
                </button>
              </div>
            </div>
          )}

          {/* Interview Details if Scheduled */}
          {application.interview && (
            <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-purple-600" />
                  Jadwal Wawancara Terkonfirmasi
                </span>
                <span className="text-[11px] font-semibold text-purple-700 uppercase tracking-wider">
                  {application.interview.type}
                </span>
              </div>
              <div className="text-slate-800 space-y-1">
                <div>
                  <strong className="text-slate-600">Waktu:</strong> {application.interview.scheduledAt} WIB
                </div>
                <div>
                  <strong className="text-slate-600">Lokasi / Tautan:</strong>{' '}
                  <a
                    href={application.interview.locationOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {application.interview.locationOrLink}
                  </a>
                </div>
                {application.interview.instructions && (
                  <div className="pt-1 text-slate-600 italic">
                    "{application.interview.instructions}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Tanggal Melamar</span>
              <span className="font-semibold text-slate-900 font-mono-numbers">{application.appliedAt}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Dokumen CV yang Dilampirkan</span>
              <span className="font-semibold text-slate-900 truncate block">
                {application.resumeTitle || 'CV_Utama.pdf'}
              </span>
            </div>
          </div>

          {/* External URL if any */}
          {application.externalUrl && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Tautan Lamaran Asal:</span>
              <a
                href={application.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1 truncate max-w-xs font-medium"
              >
                <span>Buka Halaman Asli</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </a>
            </div>
          )}

          {/* Notes */}
          {application.notes && (
            <div className="space-y-1.5">
              <span className="font-semibold text-slate-700 block">Catatan Pelamar:</span>
              <p className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed">
                {application.notes}
              </p>
            </div>
          )}

          {/* Status History Timeline */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Riwayat Perubahan Status (Audit Trail)
            </h4>
            <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-2">
              {application.statusHistories.map((hist) => (
                <div key={hist.id} className="relative space-y-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 absolute -left-[21px] top-1 border-2 border-white" />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{hist.changedBy}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[11px] text-slate-400 font-mono-numbers">{hist.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <StatusBadge status={hist.statusTo} size="sm" />
                    {hist.reasonOrNote && (
                      <span className="text-slate-600 text-[11px]">{hist.reasonOrNote}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 bg-slate-50 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
