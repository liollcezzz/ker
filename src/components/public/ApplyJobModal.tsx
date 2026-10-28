import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting } from '../../types';
import { X, Send, FileText, CheckCircle2 } from 'lucide-react';

interface ApplyJobModalProps {
  job: JobPosting | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ApplyJobModal: React.FC<ApplyJobModalProps> = ({ job, isOpen, onClose }) => {
  const { documents, applyToJob, currentRole, switchRole } = useApp();
  const [coverNote, setCoverNote] = useState('');
  const primaryDoc = documents.find((d) => d.isPrimaryResume) || documents[0];
  const [selectedResumeTitle, setSelectedResumeTitle] = useState(
    primaryDoc ? primaryDoc.fileName : 'CV_Pribadi.pdf'
  );

  if (!isOpen || !job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If currently not job seeker, switch role automatically
    if (currentRole !== 'job_seeker') {
      switchRole('job_seeker');
    }

    const success = applyToJob(job.id, coverNote, selectedResumeTitle);
    if (success) {
      onClose();
      setCoverNote('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Kirim Lamaran Pekerjaan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {job.title} · <span className="font-medium text-slate-700">{job.companyName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Document selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Pilih Dokumen CV / Resume:
            </label>
            <div className="space-y-2">
              {documents
                .filter((d) => d.type === 'resume')
                .map((doc) => (
                  <label
                    key={doc.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedResumeTitle === doc.fileName
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold">{doc.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {doc.fileName} · {(doc.fileSizeKb / 1024).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="resumeSelect"
                      checked={selectedResumeTitle === doc.fileName}
                      onChange={() => setSelectedResumeTitle(doc.fileName)}
                      className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                  </label>
                ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Dokumen tersimpan aman dan hanya dapat diakses oleh recruiter lowongan ini.
            </p>
          </div>

          {/* Cover note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Catatan Pengantar / Cover Note Singkat (Opsional):
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Ceritakan secara singkat motivasi Anda dan kesesuaian pengalaman dengan kualifikasi lowongan..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none text-slate-800"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              Status lamaran Anda akan otomatis tercatat di menu <strong>Lamaran Saya</strong> dan dapat dipantau riwayat perkembangannya secara real-time.
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Lamaran Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
