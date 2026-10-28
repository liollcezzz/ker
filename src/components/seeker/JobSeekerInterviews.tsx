import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const JobSeekerInterviews: React.FC = () => {
  const { applications } = useApp();

  // Extract all interviews from applications
  const scheduledInterviews = applications
    .filter((a) => a.interview)
    .map((a) => ({
      ...a.interview!,
      applicationCompanyName: a.companyName,
      applicationJobTitle: a.jobTitle,
      source: a.source,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Jadwal Wawancara ({scheduledInterviews.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Daftar sesi wawancara online dan offline terkonfirmasi dari berbagai lamaran kerja.
          </p>
        </div>
      </div>

      {scheduledInterviews.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Belum ada agenda wawancara</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Saat recruiter mengundang Anda untuk wawancara teknis atau HR, jadwal dan tautan meeting akan otomatis tercatat di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scheduledInterviews.map((iv) => (
            <div
              key={iv.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:border-purple-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                      {iv.type === 'online' ? 'Online Video Meeting' : 'Offline Tatap Muka'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Sumber: {iv.source}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 pt-1">{iv.jobTitle}</h3>
                  <div className="text-xs font-semibold text-slate-600">{iv.companyName}</div>
                </div>

                <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-100 text-right shrink-0">
                  <div className="text-[11px] text-purple-700 font-medium uppercase tracking-wider">Waktu Wawancara</div>
                  <div className="text-sm font-bold text-purple-900 font-mono-numbers">{iv.scheduledAt} WIB</div>
                </div>
              </div>

              {/* Location or Link */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium flex items-center gap-1.5">
                    {iv.type === 'online' ? (
                      <Video className="w-4 h-4 text-purple-600" />
                    ) : (
                      <MapPin className="w-4 h-4 text-purple-600" />
                    )}
                    {iv.type === 'online' ? 'Tautan Meeting Online:' : 'Alamat Lokasi Seleksi:'}
                  </span>
                  {iv.type === 'online' && (
                    <a
                      href={iv.locationOrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <span>Buka Google Meet / Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="text-slate-800 font-mono bg-white p-2.5 rounded-lg border border-slate-200 break-all select-all">
                  {iv.locationOrLink}
                </div>
              </div>

              {/* Instructions & Prep Notes */}
              {iv.instructions && (
                <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-700 space-y-1">
                  <span className="font-semibold text-blue-900 block flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    Instruksi Persiapan dari Recruiter:
                  </span>
                  <p className="leading-relaxed text-slate-700">{iv.instructions}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Status: Terjadwal Aktif
                </span>
                <span className="italic">Mohon hadir 10 menit sebelum sesi dimulai</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
