<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Companies Table
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

        // 2. Job Categories
        Schema::create('job_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->string('icon_name')->default('Briefcase');
            $table->timestamps();
        });

        // 3. Job Postings
        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_category_id')->constrained()->restrictOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->enum('type', ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'])->default('Full-time');
            $table->string('location');
            $table->unsignedInteger('salary_min')->nullable();
            $table->unsignedInteger('salary_max')->nullable();
            $table->longText('description');
            $table->json('responsibilities')->nullable();
            $table->json('requirements')->nullable();
            $table->date('closing_date');
            $table->enum('status', ['draft', 'pending_review', 'published', 'closed', 'rejected'])->default('draft');
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
        });

        // 4. Applications (Mendukung Lamaran Internal & Eksternal)
        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_seeker_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('job_posting_id')->nullable()->constrained()->nullOnDelete(); // Nullable jika eksternal
            $table->enum('source', [
                'CareerTrack',
                'Website Perusahaan',
                'LinkedIn',
                'Job Portal Lain',
                'Email',
                'Referensi',
                'Lainnya'
            ])->default('CareerTrack');
            $table->string('external_company_name')->nullable();
            $table->string('external_job_title')->nullable();
            $table->string('external_url')->nullable();
            $table->enum('status', [
                'submitted',
                'under_review',
                'interview',
                'offered',
                'rejected',
                'withdrawn'
            ])->default('submitted');
            $table->date('applied_at');
            $table->text('notes')->nullable();
            $table->string('resume_title')->nullable();
            $table->timestamps();

            // Indeks untuk SQLite
            $table->index(['job_seeker_id', 'status']);
        });

        // 5. Application Status Histories (Audit Trail)
        Schema::create('application_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('changed_by')->constrained('users');
            $table->string('status_from');
            $table->string('status_to');
            $table->text('reason_or_note')->nullable();
            $table->timestamps();
        });

        // 6. Documents (Penyimpanan Berkas CV Privat)
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->enum('type', ['resume', 'cover_letter', 'portfolio', 'certificate'])->default('resume');
            $table->string('file_name');
            $table->string('file_path');
            $table->unsignedInteger('file_size_kb');
            $table->boolean('is_primary_resume')->default(false);
            $table->timestamps();
        });

        // 7. Interviews
        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->dateTime('scheduled_at');
            $table->enum('type', ['online', 'offline'])->default('online');
            $table->string('location_or_link');
            $table->text('instructions')->nullable();
            $table->enum('status', ['scheduled', 'rescheduled', 'completed', 'cancelled'])->default('scheduled');
            $table->timestamps();
        });

        // 8. Recruiter Notes (Catatan Evaluasi Privat)
        Schema::create('recruiter_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('recruiter_id')->constrained('users');
            $table->text('note');
            $table->timestamps();
        });

        // 9. Saved Jobs (Bookmark)
        Schema::create('saved_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_posting_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'job_posting_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saved_jobs');
        Schema::dropIfExists('recruiter_notes');
        Schema::dropIfExists('interviews');
        Schema::dropIfExists('documents');
        Schema::dropIfExists('application_status_histories');
        Schema::dropIfExists('applications');
        Schema::dropIfExists('job_postings');
        Schema::dropIfExists('job_categories');
        Schema::dropIfExists('companies');
    }
};
