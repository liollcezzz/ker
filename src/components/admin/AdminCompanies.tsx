import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Award, Globe, MapPin, Users, Check, X, ShieldAlert } from 'lucide-react';

export const AdminCompanies: React.FC = () => {
  const { companies, toggleCompanyVerification, jobPostings } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kelola Perusahaan & Status Verifikasi ({companies.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verifikasi entitas bisnis dan badan hukum perusahaan untuk mencegah lowongan penipuan (scam).
          </p>
        </div>
      </div>

      {/* Companies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {companies.map((company) => {
          const activeJobsCount = jobPostings.filter(
            (j) => j.companyId === company.id && j.status === 'published'
          ).length;

          return (
            <div
              key={company.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt={company.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base shrink-0">
                        {company.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-slate-900">{company.name}</h3>
                        {company.isVerified && (
                          <span title="Terverifikasi">
                            <Award className="w-4 h-4 text-blue-600" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{company.industry}</p>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border shrink-0 ${
                      company.isVerified
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {company.isVerified ? 'Terverifikasi' : 'Belum Diverifikasi'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 font-mono-numbers">
                  {activeJobsCount} Lowongan Aktif
                </span>
                <button
                  onClick={() => toggleCompanyVerification(company.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                    company.isVerified
                      ? 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100'
                      : 'border-blue-200 text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {company.isVerified ? 'Cabut Verifikasi' : 'Verifikasi Resmi'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
