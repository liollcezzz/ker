import React, { useState } from 'react';
import { X, Database, Layers, ShieldCheck, Cloud, Code, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'migrations' | 'models' | 'policies' | 'blade' | 'cloud'>('migrations');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const migrationCode = `// database/migrations/2026_10_28_000001_create_career_track_tables.php
use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration {
    public function up(): void {
        // 1. Users table (3 roles: job_seeker, recruiter, admin)
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['job_seeker', 'recruiter', 'admin'])->default('job_seeker');
            $table->string('phone', 25)->nullable();
            $table->string('avatar_url')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Companies table
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_url')->nullable();
            $table->string('industry', 100);
            $table->string('website')->nullable();
            $table->string('location');
            $table->text('description');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });

        // 3. Applications (Dua Fungsi: Lamaran Internal & Eksternal)
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_seeker_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('job_posting_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('source', [
                'CareerTrack', 'Website Perusahaan', 'LinkedIn', 
                'Job Portal Lain', 'Email', 'Referensi', 'Lainnya'
            ]);
            $table->string('external_company_name')->nullable();
            $table->string('external_job_title')->nullable();
            $table->string('external_url')->nullable();
            $table->enum('status', [
                'submitted', 'under_review', 'interview', 
                'offered', 'rejected', 'withdrawn'
            ])->default('submitted');
            $table->timestamp('applied_at');
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indexing untuk pencarian cepat
            $table->index(['job_seeker_id', 'status']);
        });

        // 4. Status Histories (Audit trail)
        Schema::create('application_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('changed_by')->constrained('users');
            $table->string('status_from');
            $table->string('status_to');
            $table->text('reason_or_note')->nullable();
            $table->timestamps();
        });
    }
};`;

  const modelCode = `// app/Models/Application.php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Application extends Model
{
    protected $fillable = [
        'job_seeker_id', 'job_posting_id', 'source',
        'external_company_name', 'external_job_title', 'external_url',
        'status', 'applied_at', 'notes'
    ];

    protected $casts = [
        'applied_at' => 'datetime',
    ];

    // Helper untuk menampilkan nama perusahaan internal / eksternal
    public function getEffectiveCompanyNameAttribute(): string
    {
        return $this->jobPosting ? $this->jobPosting->company->name : ($this->external_company_name ?? 'N/A');
    }

    public function jobSeeker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'job_seeker_id');
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class)->latest();
    }

    public function recruiterNotes(): HasMany
    {
        return $this->hasMany(RecruiterNote::class)->latest();
    }
}`;

  const policyCode = `// app/Policies/ApplicationPolicy.php
namespace App\\Policies;

use App\\Models\\User;
use App\\Models\\Application;

class ApplicationPolicy
{
    /**
     * Pencari kerja hanya melihat lamarannya sendiri.
     * Recruiter hanya melihat lamaran yang masuk ke lowongan perusahaannya.
     */
    public function view(User $user, Application $application): bool
    {
        if ($user->role === 'admin') return true;

        if ($user->role === 'job_seeker') {
            return $application->job_seeker_id === $user->id;
        }

        if ($user->role === 'recruiter' && $application->jobPosting) {
            return $application->jobPosting->company->user_id === $user->id;
        }

        return false;
    }

    public function update(User $user, Application $application): bool
    {
        // Hanya pencari kerja terkait yang dapat update catatan lamaran eksternalnya
        if ($user->role === 'job_seeker') {
            return $application->job_seeker_id === $user->id;
        }

        // Recruiter dapat update status lamaran kandidat di lowongan miliknya
        if ($user->role === 'recruiter' && $application->jobPosting) {
            return $application->jobPosting->company->user_id === $user->id;
        }

        return $user->role === 'admin';
    }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CT
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Arsitektur Laravel 11 & MySQL (Blueprint Proyek)</h3>
              <p className="text-xs text-slate-500">Panduan implementasi dari prototype Lovable / React ke backend produksi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('migrations')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'migrations'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            1. Skema Migrasi (MySQL)
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'models'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            2. Eloquent Model & Relasi
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'policies'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            3. Autentikasi & Policy
          </button>
          <button
            onClick={() => setActiveTab('blade')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'blade'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            4. Blade Templates
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'cloud'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            5. Deployment Cloud Computing
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40 text-sm">
          {activeTab === 'migrations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Skema 10 Tabel Relasional (3NF)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tabel <code className="text-blue-600 font-mono">applications</code> mendukung lamaran internal (terhubung ke <code className="text-blue-600 font-mono">job_posting_id</code>) maupun lamaran mandiri eksternal.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(migrationCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin' : 'Salin Migration'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {migrationCode}
              </pre>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Eloquent Relationship & Accessor</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Model Application memiliki relasi ke User, JobPosting, StatusHistories, dan RecruiterNotes.</p>
                </div>
                <button
                  onClick={() => handleCopy(modelCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin' : 'Salin Model'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {modelCode}
              </pre>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Keamanan Akses Tingkat Rekening & Data</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Mencegah akses silang: Recruiter hanya boleh melihat pelamar di lowongan miliknya.</p>
                </div>
                <button
                  onClick={() => handleCopy(policyCode)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Tersalin' : 'Salin Policy'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {policyCode}
              </pre>
            </div>
          )}

          {activeTab === 'blade' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Pemetaan Komponen React ke Laravel Blade Templates</h4>
              <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Komponen React Prototype</th>
                      <th className="px-4 py-3">Padanan di Laravel (Blade)</th>
                      <th className="px-4 py-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">src/components/Navbar.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/layouts/navigation.blade.php</td>
                      <td className="px-4 py-3">Navigasi publik dan auth user session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">src/components/Sidebar.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/components/sidebar.blade.php</td>
                      <td className="px-4 py-3">Menu sidebar yang otomatis menyesuaikan role</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">src/components/ui/StatusBadge.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/components/status-badge.blade.php</td>
                      <td className="px-4 py-3">Badge status dengan warna konsisten</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">JobSeekerExternalTracker.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/seeker/tracker/index.blade.php</td>
                      <td className="px-4 py-3">Form modal tambah lamaran mandiri eksternal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">RecruiterCandidates.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/recruiter/candidates/index.blade.php</td>
                      <td className="px-4 py-3">Papan pipeline pelamar & evaluasi privat</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Arsitektur Deployment Cloud Computing</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <h5 className="font-semibold text-slate-800 text-xs uppercase tracking-wider text-blue-600 mb-2">
                    Opsi 1: Cloud VPS (DigitalOcean / IDCloudHost / AWS Lightsail)
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    <li>Ubuntu 24.04 LTS Server</li>
                    <li>Nginx Reverse Proxy dengan SSL Let's Encrypt Certbot</li>
                    <li>PHP 8.3-FPM dengan ekstensi pdo_mysql, mbstring, gd</li>
                    <li>MySQL 8.0 Server dengan automated daily backup</li>
                    <li>Supervisor untuk queue worker (email notifikasi lamaran)</li>
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200">
                  <h5 className="font-semibold text-slate-800 text-xs uppercase tracking-wider text-blue-600 mb-2">
                    Opsi 2: Containerized Cloud Run / App Platform
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
                    <li>Dockerfile multi-stage (PHP 8.3 Alpine + Composer)</li>
                    <li>Managed Cloud SQL / RDS MySQL untuk database terkelola</li>
                    <li>Object Storage (S3 / Cloud Storage / MinIO) untuk dokumen CV privat</li>
                    <li>Cloud Build / GitHub Actions untuk pipeline CI/CD otomatis</li>
                  </ul>
                </div>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Catatan Penyimpanan CV & Dokumen Privat:</strong> Jangan simpan file resume di folder <code className="font-mono">public/</code>. Gunakan disk terisolasi <code className="font-mono">Storage::disk('private')</code> dan sajikan file melalui Route terproteksi dengan Middleware Autentikasi dan Policy Authorization.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            CareerTrack Prototype dirancang siap migrasi ke Laravel 11 Blade + Tailwind v4.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Tutup Cetak Biru
          </button>
        </div>
      </div>
    </div>
  );
};
