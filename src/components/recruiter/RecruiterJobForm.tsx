import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { JobPosting, JobType } from '../../types';
import { ArrowLeft, Save, Send, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface Props {
  jobToEdit?: JobPosting | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RecruiterJobForm: React.FC<Props> = ({ jobToEdit, onSuccess, onCancel }) => {
  const { categories, createJobPosting, updateJobPosting } = useApp();

  const [title, setTitle] = useState(jobToEdit?.title || '');
  const [categoryId, setCategoryId] = useState<number>(
    jobToEdit?.jobCategoryId || categories[0]?.id || 1
  );
  const [type, setType] = useState<JobType>(jobToEdit?.type || 'Full-time');
  const [location, setLocation] = useState(jobToEdit?.location || 'Jakarta Selatan (Hybrid)');
  const [salaryMin, setSalaryMin] = useState<string>(jobToEdit?.salaryMin ? String(jobToEdit.salaryMin) : '');
  const [salaryMax, setSalaryMax] = useState<string>(jobToEdit?.salaryMax ? String(jobToEdit.salaryMax) : '');
  const [closingDate, setClosingDate] = useState(jobToEdit?.closingDate || '2026-12-31');
  const [description, setDescription] = useState(jobToEdit?.description || '');

  // Responsibilities & Requirements arrays
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    jobToEdit?.responsibilities ? jobToEdit.responsibilities.join('\n') : ''
  );
  const [requirementsText, setRequirementsText] = useState(
    jobToEdit?.requirements ? jobToEdit.requirements.join('\n') : ''
  );

  const handleSubmit = (status: 'draft' | 'pending_review' | 'published') => {
    if (!title.trim() || !description.trim()) {
      alert('Mohon lengkapi judul dan deskripsi pekerjaan.');
      return;
    }

    const selectedCat = categories.find((c) => c.id === categoryId);
    const responsibilities = responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const requirements = requirementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`,
      jobCategoryId: categoryId,
      categoryName: selectedCat ? selectedCat.name : 'Engineering',
      type,
      location,
      salaryMin: salaryMin ? Number(salaryMin) : undefined,
      salaryMax: salaryMax ? Number(salaryMax) : undefined,
      description,
      responsibilities: responsibilities.length > 0 ? responsibilities : ['Melaksanakan tugas operasional sesuai arahan lead.'],
      requirements: requirements.length > 0 ? requirements : ['Pendidikan minimal D3/S1 bidang terkait.'],
      closingDate,
      status,
    };

    if (jobToEdit) {
      updateJobPosting(jobToEdit.id, payload);
    } else {
      createJobPosting(payload);
    }

    onSuccess();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {jobToEdit ? 'Edit Lowongan Kerja' : 'Buat Lowongan Kerja Baru'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Isi parameter kualifikasi dan kompensasi untuk mempublikasikan posisi terbuka
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit('pending_review');
        }}
        className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6"
      >
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-purple-700">
            Informasi Dasar Pekerjaan
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Judul Posisi Lowongan *
            </label>
            <input
              type="text"
              required
              placeholder="cth: Senior Fullstack Laravel & React Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Kategori Bidang *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none text-slate-800"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tipe Pekerjaan *
              </label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white focus:outline-none text-slate-800"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship (Magang)</option>
                <option value="Contract">Contract (Kontrak)</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Lokasi Kerja *
              </label>
              <input
                type="text"
                required
                placeholder="cth: Jakarta Selatan (Hybrid)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Gaji Minimum (Rp/bulan)
              </label>
              <input
                type="number"
                placeholder="cth: 7000000"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none text-slate-900 font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Gaji Maksimum (Rp/bulan)
              </label>
              <input
                type="number"
                placeholder="cth: 11000000"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none text-slate-900 font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Batas Pengiriman Lamaran *
              </label>
              <input
                type="date"
                required
                value={closingDate}
                onChange={(e) => setClosingDate(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-4">
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-purple-700">
            Deskripsi & Rincian Tugas
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Singkat Pekerjaan *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Jelaskan peran pekerjaan ini dalam tim dan dampak produk yang akan dikembangkan..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none resize-none text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tanggung Jawab Utama (Satu baris per poin)
            </label>
            <textarea
              rows={4}
              placeholder="Merancang arsitektur API backend Laravel 11.&#10;Melakukan query optimization pada tabel MySQL.&#10;Melakukan code review dan unit testing."
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none resize-none text-slate-900 font-mono text-xs leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Persyaratan & Kualifikasi (Satu baris per poin)
            </label>
            <textarea
              rows={4}
              placeholder="Pengalaman minimal 1 tahun di Laravel atau framework MVC sejenis.&#10;Pemahaman database relasional MySQL dan indexing.&#10;Mampu berkomunikasi dengan baik secara tim."
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none resize-none text-slate-900 font-mono text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Batal
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Simpan Draft</span>
            </button>

            <button
              type="button"
              onClick={() => handleSubmit('published')}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-2xs"
            >
              <Send className="w-4 h-4" />
              <span>Publikasikan Lowongan</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
