import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Document } from '../../types';
import { ModalConfirm } from '../ui/ModalConfirm';
import {
  FolderOpen,
  FileText,
  Upload,
  CheckCircle2,
  Trash2,
  Eye,
  Star,
  Shield,
  X,
  FileCheck,
} from 'lucide-react';

export const JobSeekerDocuments: React.FC = () => {
  const { documents, uploadDocument, setPrimaryResume, deleteDocument } = useApp();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  const [docToPreview, setDocToPreview] = useState<Document | null>(null);

  // Upload Form states
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<Document['type']>('resume');
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSimulatedFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalFileName = simulatedFileName || `${title.replace(/\s+/g, '_')}.pdf`;

    uploadDocument({
      title: title || 'Dokumen Tanpa Judul',
      type: docType,
      fileName: finalFileName,
      fileSizeKb: Math.floor(Math.random() * 800) + 200,
      isPrimaryResume: isPrimary,
    });

    // Reset
    setTitle('');
    setSimulatedFileName('');
    setIsPrimary(false);
    setIsUploadOpen(false);
  };

  const getDocTypeLabel = (type: Document['type']) => {
    switch (type) {
      case 'resume':
        return 'Curriculum Vitae (CV)';
      case 'cover_letter':
        return 'Surat Lamaran (Cover Letter)';
      case 'portfolio':
        return 'Portofolio Kerja';
      case 'certificate':
        return 'Sertifikat / Transkrip';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Dokumen Saya</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Simpan CV, portofolio, dan sertifikat dalam penyimpanan aman terproteksi role-based access.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>+ Unggah Dokumen Baru</span>
        </button>
      </div>

      {/* Security Storage Callout */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Perlindungan Privasi Dokumen:</strong> Berkas CV Anda tersimpan secara privat dan tidak diindeks di tautan publik web. Dokumen hanya dapat diunduh dan ditinjau oleh recruiter terverifikasi pada lowongan yang Anda lamar.
        </div>
      </div>

      {/* Upload Form Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-base font-bold text-slate-900">Unggah Dokumen Baru</h3>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Judul Dokumen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="cth: CV Backend Developer ATS 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Kategori Dokumen *
                </label>
                <select
                  value={docType}
                  onChange={(e: any) => setDocType(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none text-slate-800"
                >
                  <option value="resume">Curriculum Vitae (CV)</option>
                  <option value="cover_letter">Surat Lamaran (Cover Letter)</option>
                  <option value="portfolio">Portofolio Kerja</option>
                  <option value="certificate">Sertifikat / Transkrip</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pilih Berkas (PDF / DOCX max 5MB) *
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                    id="docFileInput"
                  />
                  <label htmlFor="docFileInput" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-blue-600 hover:underline block">
                      Klik untuk memilih file dari komputer
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      {simulatedFileName ? (
                        <span className="text-slate-800 font-semibold">{simulatedFileName}</span>
                      ) : (
                        'Mendukung format PDF, DOCX (Maksimal 5MB)'
                      )}
                    </span>
                  </label>
                </div>
              </div>

              {docType === 'resume' && (
                <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span className="font-medium">Jadikan CV ini sebagai CV Utama untuk melamar</span>
                </label>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs"
                >
                  Simpan & Unggah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-4 ${
              doc.isPrimaryResume
                ? 'border-blue-400 ring-2 ring-blue-50 shadow-xs'
                : 'border-slate-200 shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{doc.title}</h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.fileName}</div>
                  </div>
                </div>

                {doc.isPrimaryResume && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 shrink-0">
                    <Star className="w-3 h-3 fill-current" />
                    CV Utama
                  </span>
                )}
              </div>

              {/* Unboxed Metadata */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">{getDocTypeLabel(doc.type)}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-numbers">{(doc.fileSizeKb / 1024).toFixed(2)} MB</span>
                <span aria-hidden="true">·</span>
                <span>Diunggah: {doc.uploadedAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDocToPreview(doc)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Preview</span>
                </button>

                {doc.type === 'resume' && !doc.isPrimaryResume && (
                  <button
                    onClick={() => setPrimaryResume(doc.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 text-blue-600 font-medium transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>Jadikan Utama</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setDocToDelete(doc)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="Hapus berkas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Document Preview Modal */}
      {docToPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{docToPreview.title}</h3>
                <p className="text-xs text-slate-500 font-mono">{docToPreview.fileName}</p>
              </div>
              <button
                onClick={() => setDocToPreview(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 bg-slate-100/50 flex-1 text-xs">
              <div className="p-8 bg-white rounded-xl shadow-xs border border-slate-200 space-y-4 max-w-lg mx-auto">
                <div className="border-b border-slate-200 pb-4 text-center space-y-1">
                  <h2 className="text-base font-bold text-slate-900">DIMAS PRATAMA</h2>
                  <p className="text-slate-600">Jakarta Selatan | dimas.pratama@student.ac.id | +62 812-3456-7890</p>
                  <p className="text-blue-600 font-medium">github.com/dimaspratama-dev | linkedin.com/in/dimaspratama</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-700">RINGKASAN PROFIL</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Lulusan S1 Teknik Informatika Universitas Indonesia dengan fokus backend engineering. Berpengalaman membangun RESTful API performa tinggi menggunakan framework Laravel 11, database MySQL, dan caching Redis.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-700">KEAHLIAN TEKNIS</h4>
                  <p className="text-slate-600 leading-relaxed">
                    PHP 8.3, Laravel 11, MySQL, REST API, Tailwind CSS, Docker Basics, Git, Postman, Linux VPS.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-blue-700">PENGALAMAN PROYEK AKHIR</h4>
                  <div className="text-slate-700">
                    <strong>CareerTrack Platform</strong> - Laravel 11 & MySQL Multi-Role ATS
                  </div>
                  <p className="text-slate-500">
                    Mengembangkan sistem pelacakan lamaran kerja mandiri dan manajemen kandidat dengan otentikasi role-based middleware dan audit trail status history.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs">
              <span className="text-slate-500">Pratinjau Dokumen Terproteksi (Simulasi Reader)</span>
              <button
                onClick={() => setDocToPreview(null)}
                className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200/60 rounded-lg"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ModalConfirm
        isOpen={!!docToDelete}
        title="Hapus Dokumen?"
        message={`Apakah Anda yakin ingin menghapus berkas "${docToDelete?.fileName}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus Berkas"
        isDestructive={true}
        onConfirm={() => {
          if (docToDelete) deleteDocument(docToDelete.id);
        }}
        onClose={() => setDocToDelete(null)}
      />
    </div>
  );
};
