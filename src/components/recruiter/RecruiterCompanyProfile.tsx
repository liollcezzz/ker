import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Globe, MapPin, Users, Award, Check } from 'lucide-react';

export const RecruiterCompanyProfile: React.FC = () => {
  const { companies, currentUser, addToast } = useApp();
  const company = companies.find((c) => c.userId === currentUser.id) || companies[0];

  const [name, setName] = useState(company.name);
  const [industry, setIndustry] = useState(company.industry);
  const [website, setWebsite] = useState(company.website);
  const [location, setLocation] = useState(company.location);
  const [employeeRange, setEmployeeRange] = useState(company.employeeRange);
  const [description, setDescription] = useState(company.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profil Perusahaan Diperbarui', 'Perubahan informasi profil perusahaan berhasil disimpan.');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-contain bg-white p-1.5 border border-slate-200 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white font-bold flex items-center justify-center text-xl shadow-xs">
              {company.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{name}</h1>
              {company.isVerified && (
                <span title="Terverifikasi">
                  <Award className="w-4 h-4 text-blue-600" />
                </span>
              )}
            </div>
            <p className="text-xs text-purple-600 font-medium">{industry}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{location}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto border ${
            company.isVerified
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {company.isVerified ? 'Perusahaan Terverifikasi' : 'Menunggu Verifikasi Admin'}
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-purple-700">
          Informasi Badan Usaha & Legalitas
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nama Resmi Perusahaan *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Sektor Industri *
            </label>
            <input
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Website Resmi
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Lokasi Kantor Pusat
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Jumlah Karyawan
            </label>
            <input
              type="text"
              value={employeeRange}
              onChange={(e) => setEmployeeRange(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Deskripsi Profil Perusahaan
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none resize-none text-slate-900 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-2xs"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Informasi Perusahaan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
