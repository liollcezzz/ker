import React, { useState } from 'react';
import { X, Database, Layers, ShieldCheck, Cloud, Code, Copy, Check, Terminal, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LaravelArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sqlite' | 'migrations' | 'models' | 'policies' | 'blade' | 'routes'>('sqlite');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sqliteConfigCode = `# .env (Konfigurasi Bawaan Laravel 11 untuk SQLite)
APP_NAME=CareerTrack
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_TIMEZONE=Asia/Jakarta
APP_URL=http://localhost:8000

# KONEKSI DATABASE SQLITE (Zero-Config)
DB_CONNECTION=sqlite
# Laravel 11 secara otomatis mengarahkan ke database/database.sqlite
# jika DB_DATABASE dikosongkan atau diarahkan ke path file:
# DB_DATABASE=/path/to/database/database.sqlite

# PENYIMPANAN DOKUMEN CV PRIVAT
FILESYSTEM_DISK=local

# SESSION & CACHE
SESSION_DRIVER=database
QUEUE_CONNECTION=database`;

  const quickStartCommands = `# 1. Buat proyek Laravel 11 baru
composer create-project laravel/laravel careertrack-app
cd careertrack-app

# 2. Siapkan file database SQLite
touch database/database.sqlite

# 3. Instal Laravel Breeze untuk sistem Autentikasi (Blade + Tailwind)
composer require laravel/breeze --dev
php artisan breeze:install blade

# 4. Buat file migration & model
php artisan make:model Company -m
php artisan make:model JobCategory -m
php artisan make:model JobPosting -m
php artisan make:model Application -m
php artisan make:model ApplicationStatusHistory -m
php artisan make:model Document -m
php artisan make:model Interview -m
php artisan make:model RecruiterNote -m

# 5. Jalankan migrasi ke SQLite
php artisan migrate

# 6. Jalankan dev server & Vite
npm install && npm run dev
php artisan serve`;

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
            $table->string('role')->default('job_seeker'); // 'job_seeker', 'recruiter', 'admin'
            $table->string('phone')->nullable();
            $table->string('avatar_url')->nullable();
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        // 2. Companies table (Recruiter ownership)
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo_url')->nullable();
            $table->string('industry');
            $table->string('website')->nullable();
            $table->string('location');
            $table->text('description')->nullable();
            $table->boolean('is_verified')->default(false);
            $table->string('employee_range')->default('10 - 50 Karyawan');
            $table->timestamps();
        });

        // 3. Job Categories
        Schema::create('job_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('icon_name')->default('Briefcase');
            $table->timestamps();
        });

        // 4. Job Postings
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_category_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('type')->default('Full-time'); // Full-time, Internship, Remote, etc.
            $table->string('location');
            $table->integer('salary_min')->nullable();
            $table->integer('salary_max')->nullable();
            $table->text('description');
            $table->text('responsibilities')->nullable(); // JSON / Text list
            $table->text('requirements')->nullable();    // JSON / Text list
            $table->date('closing_date');
            $table->string('status')->default('draft');   // draft, pending_review, published, closed, rejected
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        // 5. Applications (Mendukung Lamaran Internal CareerTrack & Eksternal LinkedIn/Web)
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_seeker_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('job_posting_id')->nullable()->constrained()->nullOnDelete();
            $table->string('source')->default('CareerTrack'); // CareerTrack, LinkedIn, Website, etc.
            $table->string('external_company_name')->nullable();
            $table->string('external_job_title')->nullable();
            $table->string('external_url')->nullable();
            $table->string('status')->default('submitted');   // submitted, under_review, interview, offered, rejected, withdrawn
            $table->date('applied_at');
            $table->text('notes')->nullable();
            $table->string('resume_title')->nullable();
            $table->timestamps();
            
            // Index SQLite untuk pencarian cepat
            $table->index(['job_seeker_id', 'status']);
        });

        // 6. Application Status Histories (Audit Trail)
        Schema::create('application_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('changed_by')->constrained('users');
            $table->string('status_from');
            $table->string('status_to');
            $table->text('reason_or_note')->nullable();
            $table->timestamps();
        });

        // 7. Documents (Penyimpanan CV Privat)
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('type')->default('resume'); // resume, cover_letter, portfolio, certificate
            $table->string('file_name');
            $table->string('file_path');
            $table->integer('file_size_kb');
            $table->boolean('is_primary_resume')->default(false);
            $table->timestamps();
        });

        // 8. Interviews
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->dateTime('scheduled_at');
            $table->string('type')->default('online'); // online, offline
            $table->string('location_or_link');
            $table->text('instructions')->nullable();
            $table->string('status')->default('scheduled');
            $table->timestamps();
        });

        // 9. Recruiter Notes (Catatan Evaluasi Privat)
        Schema::create('recruiter_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('recruiter_id')->constrained('users');
            $table->text('note');
            $table->timestamps();
        });

        // 10. Saved Jobs (Bookmark)
        Schema::create('saved_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'job_posting_id']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('saved_jobs');
        Schema::dropIfExists('recruiter_notes');
        Schema::dropIfExists('interviews');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('application_status_histories');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('job_postings');
        Schema::dropIfExists('job_categories');
        Schema::dropIfExists('companies');
        Schema::dropIfExists('users');
    }
};`;

  const modelCode = `// app/Models/Application.php
namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Database\\Eloquent\\Relations\\HasOne;

class Application extends Model
{
    protected $fillable = [
        'job_seeker_id', 'job_posting_id', 'source',
        'external_company_name', 'external_job_title', 'external_url',
        'status', 'applied_at', 'notes', 'resume_title'
    ];

    protected $casts = [
        'applied_at' => 'date',
    ];

    // Helper accessor: Mendukung lamaran internal CareerTrack maupun eksternal
    public function getCompanyNameAttribute(): string
    {
        return $this->jobPosting ? $this->jobPosting->company->name : ($this->external_company_name ?? 'N/A');
    }

    public function getTitleAttribute(): string
    {
        return $this->jobPosting ? $this->jobPosting->title : ($this->external_job_title ?? 'N/A');
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

    public function interview(): HasOne
    {
        return $this->hasOne(Interview::class);
    }
}`;

  const routesCode = `// routes/web.php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\JobCatalogController;
use App\\Http\\Controllers\\Seeker\\ApplicationTrackerController;
use App\\Http\\Controllers\\Seeker\\DocumentController;
use App\\Http\\Controllers\\Recruiter\\JobPostingController;
use App\\Http\\Controllers\\Recruiter\\CandidateController;
use App\\Http\\Controllers\\Admin\\ModerationController;

// 1. Rute Publik
Route::get('/', [JobCatalogController::class, 'landing'])->name('landing');
Route::get('/jobs', [JobCatalogController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{slug}', [JobCatalogController::class, 'show'])->name('jobs.show');

// 2. Rute Pencari Kerja (Role: job_seeker)
Route::middleware(['auth', 'role:job_seeker'])->prefix('seeker')->name('seeker.')->group(function () {
    Route::get('/dashboard', [ApplicationTrackerController::class, 'dashboard'])->name('dashboard');
    Route::get('/applications', [ApplicationTrackerController::class, 'index'])->name('applications.index');
    Route::post('/applications/external', [ApplicationTrackerController::class, 'storeExternal'])->name('applications.external');
    Route::post('/jobs/{id}/apply', [ApplicationTrackerController::class, 'applyInternal'])->name('jobs.apply');
    Route::patch('/applications/{id}/status', [ApplicationTrackerController::class, 'updateStatus'])->name('applications.status');
    
    // Manajemen Dokumen & CV Privat
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::patch('/documents/{id}/primary', [DocumentController::class, 'setPrimary'])->name('documents.primary');
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy'])->name('documents.destroy');
});

// 3. Rute Recruiter (Role: recruiter)
Route::middleware(['auth', 'role:recruiter'])->prefix('recruiter')->name('recruiter.')->group(function () {
    Route::get('/dashboard', [JobPostingController::class, 'dashboard'])->name('dashboard');
    Route::resource('jobs', JobPostingController::class);
    Route::get('/candidates', [CandidateController::class, 'index'])->name('candidates.index');
    Route::get('/candidates/{id}', [CandidateController::class, 'show'])->name('candidates.show');
    Route::patch('/candidates/{id}/status', [CandidateController::class, 'updateStatus'])->name('candidates.status');
    Route::post('/candidates/{id}/notes', [CandidateController::class, 'addNote'])->name('candidates.notes');
    Route::post('/candidates/{id}/interview', [CandidateController::class, 'scheduleInterview'])->name('candidates.interview');
});

// 4. Rute Admin (Role: admin)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [ModerationController::class, 'dashboard'])->name('dashboard');
    Route::get('/moderation', [ModerationController::class, 'index'])->name('moderation.index');
    Route::post('/moderation/{id}/approve', [ModerationController::class, 'approve'])->name('moderation.approve');
    Route::post('/moderation/{id}/reject', [ModerationController::class, 'reject'])->name('moderation.reject');
    Route::patch('/companies/{id}/verify', [ModerationController::class, 'toggleVerify'])->name('companies.verify');
});

require __DIR__.'/auth.php';`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CT
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Blueprint Laravel 11 + SQLite (Buku Panduan Mahasiswa)</h3>
              <p className="text-xs text-slate-500">Panduan implementasi dari prototype ini ke backend produksi Laravel 11 dengan SQLite</p>
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
            onClick={() => setActiveTab('sqlite')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'sqlite'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            1. Setup SQLite & Quickstart
          </button>
          <button
            onClick={() => setActiveTab('migrations')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'migrations'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            2. Migrasi SQLite (10 Tabel)
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
            3. Eloquent Model
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'routes'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4" />
            4. Routes & Middleware
          </button>
          <button
            onClick={() => setActiveTab('blade')}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'blade'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            5. Pemetaan Blade Templates
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
            6. Policy & Keamanan Data
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/40 text-sm">
          {activeTab === 'sqlite' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 leading-relaxed space-y-1">
                <strong>Mengapa SQLite di Laravel 11 Sangat Tepat untuk Mahasiswa?</strong>
                <p>
                  Mulai Laravel 11, <strong>SQLite telah menjadi database bawaan resmi (default)</strong> tanpa perlu instalasi server MySQL terpisah! File database tersimpan rapi di <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">database/database.sqlite</code>, sangat ringan, bebas konfigurasi port/password, dan mudah dipindahkan antar komputer serta langsung siap dideploy.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                    Langkah Perintah Terminal (Terminal Quickstart)
                  </h4>
                  <button
                    onClick={() => handleCopy(quickStartCommands, 'quickstart')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                  >
                    {copied === 'quickstart' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'quickstart' ? 'Tersalin' : 'Salin Perintah'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  {quickStartCommands}
                </pre>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
                    File Konfigurasi (.env)
                  </h4>
                  <button
                    onClick={() => handleCopy(sqliteConfigCode, 'dotenv')}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                  >
                    {copied === 'dotenv' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'dotenv' ? 'Tersalin' : 'Salin .env'}
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  {sqliteConfigCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'migrations' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Skema 10 Tabel Relasional (Kompatibel Penuh dengan SQLite)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mendukung foreign key cascade, indexing, dan relasi nullable pada <code className="text-blue-600 font-mono">job_posting_id</code> untuk menangani lamaran internal & eksternal.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(migrationCode, 'migrasi')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                >
                  {copied === 'migrasi' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'migrasi' ? 'Tersalin' : 'Salin Migration'}
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
                  <h4 className="font-semibold text-slate-900">Eloquent Relationship & Accessor Helper</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Model Application memiliki relasi ke User, JobPosting, StatusHistories, RecruiterNotes, dan Interview.</p>
                </div>
                <button
                  onClick={() => handleCopy(modelCode, 'model')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                >
                  {copied === 'model' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'model' ? 'Tersalin' : 'Salin Model'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {modelCode}
              </pre>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Pemetaan Rute & Role-Based Middleware</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Memisahkan rute publik, pelamar, recruiter, dan admin menggunakan middleware proteksi peran.</p>
                </div>
                <button
                  onClick={() => handleCopy(routesCode, 'routes')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-2xs"
                >
                  {copied === 'routes' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'routes' ? 'Tersalin' : 'Salin Routes'}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {routesCode}
              </pre>
            </div>
          )}

          {activeTab === 'blade' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Pemetaan Struktur Komponen ke File Blade</h4>
              <p className="text-xs text-slate-500">
                Semua kelas Tailwind CSS yang ada pada prototipe ini dirancang dapat langsung disalin ke file <code className="font-mono">.blade.php</code> Anda:
              </p>
              <div className="overflow-hidden border border-slate-200 rounded-xl bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Komponen Prototype (React)</th>
                      <th className="px-4 py-3">Lokasi File di Laravel (Blade)</th>
                      <th className="px-4 py-3">Fungsi Utama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">src/components/layout/Navbar.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/layouts/navigation.blade.php</td>
                      <td className="px-4 py-3">Top bar & autentikasi session</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">src/components/seeker/SeekerSidebar.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/components/seeker-sidebar.blade.php</td>
                      <td className="px-4 py-3">Sidebar dashboard pelamar</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">src/components/ui/StatusBadge.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/components/status-badge.blade.php</td>
                      <td className="px-4 py-3">Lencana status berkode warna</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">JobSeekerExternalTracker.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/seeker/tracker/index.blade.php</td>
                      <td className="px-4 py-3">Pelacak lamaran mandiri eksternal</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">RecruiterCandidates.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/recruiter/candidates/index.blade.php</td>
                      <td className="px-4 py-3">Papan review pelamar & catatan privat</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono text-blue-600">AdminModeration.tsx</td>
                      <td className="px-4 py-3 font-mono">resources/views/admin/moderation/index.blade.php</td>
                      <td className="px-4 py-3">Panel moderasi lowongan baru</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-900">Keamanan Akses (Policy & Multi-Role Authorization)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Backend Laravel memvalidasi seluruh akses:
              </p>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside bg-white p-4 rounded-xl border border-slate-200">
                <li><strong>Job Seeker Policy:</strong> Pengguna hanya bisa melihat dan memodifikasi data lamaran yang memiliki <code className="font-mono">{"job_seeker_id === auth()->id()"}</code>.</li>
                <li><strong>Recruiter Policy:</strong> Recruiter hanya dapat melihat dan mengevaluasi kandidat yang melamar ke lowongan milik perusahaannya sendiri (<code className="font-mono">{"jobPosting->company->user_id === auth()->id()"}</code>).</li>
                <li><strong>Dokumen Privat:</strong> Berkas CV disimpan di disk privat (<code className="font-mono">Storage::disk('local')</code>) dan diunduh melalui controller terproteksi middleware auth.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Arsitektur di atas siap dijalankan di Laravel 11 dengan database SQLite bawaan.
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
