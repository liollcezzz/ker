import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import {
  Users,
  Search,
  Filter,
  FileText,
  Calendar,
  MessageSquare,
  Video,
  Check,
  X,
  ExternalLink,
  Plus,
  Send,
  AlertCircle,
} from 'lucide-react';

interface Props {
  initialAppId?: number | null;
  onCloseDetail?: () => void;
}

export const RecruiterCandidates: React.FC<Props> = ({ initialAppId, onCloseDetail }) => {
  const {
    applications,
    jobPostings,
    companies,
    currentUser,
    updateApplicationStatus,
    addRecruiterNote,
    scheduleInterview,
  } = useApp();

  const currentCompany = companies.find((c) => c.userId === currentUser.id) || companies[0];
  const companyJobs = jobPostings.filter((j) => j.companyId === currentCompany.id);
  const companyJobIds = companyJobs.map((j) => j.id);

  // Candidates for this company only
  const candidates = applications.filter(
    (a) => a.jobPostingId && companyJobIds.includes(a.jobPostingId)
  );

  const [search, setSearch] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState<number | 'all'>('all');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(
    () => candidates.find((c) => c.id === initialAppId) || null
  );

  // Candidate review modal states
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('under_review');
  const [statusNote, setStatusNote] = useState('');
  const [evalNote, setEvalNote] = useState('');

  // Interview schedule states
  const [isSchedulingInterview, setIsSchedulingInterview] = useState(false);
  const [ivDate, setIvDate] = useState('2026-11-05T10:00');
  const [ivType, setIvType] = useState<'online' | 'offline'>('online');
  const [ivLink, setIvLink] = useState('https://meet.google.com/qwe-careertrack-demo');
  const [ivInstructions, setIvInstructions] = useState('Live technical interview 45 menit via Google Meet.');

  const filteredCandidates = useMemo(() => {
    return candidates.filter((cand) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = cand.jobSeekerName.toLowerCase().includes(q);
        const matchEmail = cand.jobSeekerEmail.toLowerCase().includes(q);
        const matchTitle = cand.jobTitle.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchTitle) return false;
      }

      if (selectedJobFilter !== 'all') {
        if (cand.jobPostingId !== selectedJobFilter) return false;
      }

      if (selectedStatusTab !== 'all') {
        if (cand.status !== selectedStatusTab) return false;
      }

      return true;
    });
  }, [candidates, search, selectedJobFilter, selectedStatusTab]);

  const handleUpdateStatus = (appId: number) => {
    updateApplicationStatus(
      appId,
      newStatus,
      statusNote || `Status diubah oleh Recruiter ${currentUser.name}.`
    );
    setStatusNote('');
    // refresh selectedCandidate from applications
    const updated = applications.find((a) => a.id === appId);
    if (updated) setSelectedCandidate({ ...updated, status: newStatus });
  };

  const handleAddNote = (appId: number) => {
    if (!evalNote.trim()) return;
    addRecruiterNote(appId, evalNote.trim());
    setEvalNote('');
    const updated = applications.find((a) => a.id === appId);
    if (updated) setSelectedCandidate(updated);
  };

  const handleScheduleInterview = (appId: number) => {
    scheduleInterview(appId, {
      scheduledAt: ivDate.replace('T', ' '),
      type: ivType,
      locationOrLink: ivLink,
      instructions: ivInstructions,
    });
    setIsSchedulingInterview(false);
    const updated = applications.find((a) => a.id === appId);
    if (updated) setSelectedCandidate(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Manajemen Kandidat & Pipeline ATS ({candidates.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Evaluasi berkas pelamar, berikan catatan penilaian privat, dan atur jadwal wawancara.
          </p>
        </div>
      </div>

      {/* Filter by Job & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-7 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari kandidat berdasarkan nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-slate-800"
            />
          </div>

          <div className="sm:col-span-5">
            <select
              value={selectedJobFilter}
              onChange={(e) =>
                setSelectedJobFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none text-slate-700"
            >
              <option value="all">Semua Lowongan ({companyJobs.length})</option>
              {companyJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Tabs per Pipeline */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-slate-100 pt-3 text-xs font-medium">
          {[
            { id: 'all', label: 'Semua Tahap' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'under_review', label: 'Under Review' },
            { id: 'interview', label: 'Interview' },
            { id: 'offered', label: 'Offered' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatusTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedStatusTab === tab.id
                  ? 'bg-purple-600 text-white font-semibold shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Belum ada kandidat di tahap ini</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Pelamar baru yang mendaftar ke lowongan Anda akan langsung tampil di tabel ini.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="px-4 py-3.5">Nama Kandidat</th>
                  <th className="px-4 py-3.5">Posisi Dilamar</th>
                  <th className="px-4 py-3.5">Tanggal Melamar</th>
                  <th className="px-4 py-3.5">CV / Resume</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900">{cand.jobSeekerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{cand.jobSeekerEmail}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{cand.jobTitle}</td>
                    <td className="px-4 py-3.5 font-mono-numbers text-slate-600">{cand.appliedAt}</td>
                    <td className="px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-purple-700 font-medium font-mono text-[11px]">
                        <FileText className="w-3.5 h-3.5" />
                        {cand.resumeTitle || 'CV_Kandidat.pdf'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={cand.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedCandidate(cand)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 shadow-2xs"
                      >
                        Buka Evaluasi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Review & Evaluation Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedCandidate.jobSeekerName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedCandidate.jobSeekerName}</h3>
                  <p className="text-xs text-slate-500">
                    Posisi: <span className="font-semibold text-slate-800">{selectedCandidate.jobTitle}</span> · Melamar {selectedCandidate.appliedAt}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 font-medium">Status Kandidat:</span>
                  <StatusBadge status={selectedCandidate.status} />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSchedulingInterview(!isSchedulingInterview)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Jadwalkan Wawancara</span>
                  </button>
                </div>
              </div>

              {/* Interview Form Accordion */}
              {isSchedulingInterview && (
                <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3">
                  <div className="font-bold text-purple-900">Atur Jadwal Wawancara Kandidat</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Tanggal & Waktu Wawancara
                      </label>
                      <input
                        type="datetime-local"
                        value={ivDate}
                        onChange={(e) => setIvDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Format Wawancara
                      </label>
                      <select
                        value={ivType}
                        onChange={(e: any) => setIvType(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                      >
                        <option value="online">Online (Google Meet / Zoom)</option>
                        <option value="offline">Offline (Tatap Muka di Kantor)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Tautan Pertemuan / Alamat Kantor
                    </label>
                    <input
                      type="text"
                      value={ivLink}
                      onChange={(e) => setIvLink(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Instruksi Persiapan untuk Pelamar
                    </label>
                    <input
                      type="text"
                      value={ivInstructions}
                      onChange={(e) => setIvInstructions(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsSchedulingInterview(false)}
                      className="px-3 py-1 text-slate-600 hover:bg-white rounded-md"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScheduleInterview(selectedCandidate.id)}
                      className="px-4 py-1.5 bg-purple-600 text-white rounded-lg font-semibold shadow-2xs"
                    >
                      Kirim Undangan Wawancara
                    </button>
                  </div>
                </div>
              )}

              {/* Candidate Info Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Email Kandidat</span>
                  <span className="font-semibold text-slate-900 font-mono">{selectedCandidate.jobSeekerEmail}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">Nomor WhatsApp</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {selectedCandidate.jobSeekerPhone || '+62 812-3456-7890'}
                  </span>
                </div>
              </div>

              {/* Cover Note from candidate */}
              {selectedCandidate.notes && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    Catatan Pengantar dari Pelamar:
                  </span>
                  <p className="text-slate-600 leading-relaxed italic">
                    "{selectedCandidate.notes}"
                  </p>
                </div>
              )}

              {/* Change Status Control with reason and history recording */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Ubah Status Tahap Seleksi
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Status Baru:</label>
                    <select
                      value={newStatus}
                      onChange={(e: any) => setNewStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="under_review">Under Review (Sedang Direview)</option>
                      <option value="interview">Interview (Wawancara)</option>
                      <option value="offered">Offered (Diberikan Penawaran)</option>
                      <option value="rejected">Rejected (Belum Memenuhi Syarat)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">
                      Catatan Perubahan (Tercatat di Riwayat):
                    </label>
                    <input
                      type="text"
                      placeholder="cth: Lolos assessment coding PHP..."
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleUpdateStatus(selectedCandidate.id)}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-2xs"
                  >
                    Simpan Perubahan Status
                  </button>
                </div>
              </div>

              {/* Private Recruiter Notes (recruiter_notes table) */}
              <div className="space-y-3 p-4 bg-purple-50/40 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                    Catatan Evaluasi Privat (Hanya Terlihat Oleh Tim Recruiter)
                  </h4>
                  <span className="text-[10px] text-purple-700 font-semibold bg-purple-100/70 px-2 py-0.5 rounded">
                    Privat & Rahasia
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Tuliskan catatan teknis atau penilaian attitude kandidat..."
                      value={evalNote}
                      onChange={(e) => setEvalNote(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddNote(selectedCandidate.id)}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Simpan</span>
                    </button>
                  </div>

                  {selectedCandidate.recruiterNotes && selectedCandidate.recruiterNotes.length > 0 ? (
                    <div className="space-y-2 pt-2">
                      {selectedCandidate.recruiterNotes.map((note) => (
                        <div key={note.id} className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="font-semibold text-slate-800">{note.recruiterName}</span>
                            <span className="font-mono-numbers">{note.createdAt}</span>
                          </div>
                          <p className="text-slate-700">{note.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 italic pt-1">
                      Belum ada catatan evaluasi untuk kandidat ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Status Audit Trail */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Riwayat Tahapan Kandidat (Audit Trail)
                </h4>
                <div className="space-y-3 border-l-2 border-slate-200 pl-4 ml-2">
                  {selectedCandidate.statusHistories.map((hist) => (
                    <div key={hist.id} className="relative space-y-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-600 absolute -left-[21px] top-1 border-2 border-white" />
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
            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Pembaruan tersimpan otomatis ke database aplikasi.
              </span>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                Tutup Evaluasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
