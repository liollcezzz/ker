<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Company;
use App\Models\JobCategory;
use App\Models\JobPosting;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use App\Models\Document;
use App\Models\Interview;
use App\Models\RecruiterNote;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with realistic Indonesian test data.
     */
    public function run(): void
    {
        // 1. Users
        $seeker = User::create([
            'name' => 'Dimas Pratama',
            'email' => 'dimas.pratama@student.ac.id',
            'password' => Hash::make('password123'),
            'role' => 'job_seeker',
            'phone' => '+62 812-3456-7890',
            'headline' => 'Fresh Graduate Teknik Informatika | Junior Backend Developer (Laravel & MySQL)',
            'bio' => 'Lulusan S1 Teknik Informatika yang antusias mengembangkan aplikasi backend berbasis Laravel dan MySQL/SQLite.',
            'location' => 'Jakarta Selatan, DKI Jakarta',
            'university' => 'Universitas Indonesia',
            'graduation_year' => 2026,
        ]);

        $recruiter = User::create([
            'name' => 'Siti Rahmawati, S.Psi.',
            'email' => 'hr@nusantaratech.id',
            'password' => Hash::make('password123'),
            'role' => 'recruiter',
            'phone' => '+62 821-9876-5432',
            'headline' => 'Senior Talent Acquisition Lead at PT Nusantara Teknologi Mandiri',
            'location' => 'Jakarta Selatan, DKI Jakarta',
        ]);

        $admin = User::create([
            'name' => 'Budi Santoso',
            'email' => 'admin@careertrack.id',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '+62 811-2233-4455',
            'headline' => 'Super Administrator & Compliance Officer',
            'location' => 'Jakarta Pusat, DKI Jakarta',
        ]);

        // 2. Company
        $company = Company::create([
            'user_id' => $recruiter->id,
            'name' => 'PT Nusantara Teknologi Mandiri',
            'slug' => 'pt-nusantara-teknologi-mandiri',
            'industry' => 'Software & Cloud Solutions',
            'website' => 'https://nusantaratech.id',
            'location' => 'Mega Kuningan, Jakarta Selatan',
            'description' => 'Perusahaan konsultan teknologi berstandar enterprise yang berfokus pada solusi cloud modern dan arsitektur backend skala besar.',
            'is_verified' => true,
            'employee_range' => '50 - 150 Karyawan',
        ]);

        // 3. Job Categories
        $catBackend = JobCategory::create(['name' => 'Software Engineering', 'slug' => 'software-engineering', 'icon_name' => 'Code2']);
        $catDesign = JobCategory::create(['name' => 'Product & Design', 'slug' => 'product-design', 'icon_name' => 'Layout']);
        $catData = JobCategory::create(['name' => 'Data & Analytics', 'slug' => 'data-analytics', 'icon_name' => 'BarChart3']);

        // 4. Job Postings
        $job1 = JobPosting::create([
            'company_id' => $company->id,
            'job_category_id' => $catBackend->id,
            'title' => 'Junior Backend Developer (Laravel)',
            'slug' => 'junior-backend-developer-laravel',
            'type' => 'Full-time',
            'location' => 'Jakarta Selatan (Hybrid)',
            'salary_min' => 7000000,
            'salary_max' => 10500000,
            'description' => 'Kami mencari Junior Backend Developer yang memiliki antusiasme tinggi terhadap ekosistem Laravel dan database relasional untuk membangun REST API berskala tinggi.',
            'responsibilities' => [
                'Merancang dan mengimplementasikan RESTful API menggunakan Laravel 11.',
                'Menulis migration, model Eloquent, dan mengoptimalkan query database.',
                'Melakukan unit testing (PHPUnit) bersama Senior Backend Engineer.',
            ],
            'requirements' => [
                'Lulusan baru (Fresh Graduate) atau pengalaman 0-2 tahun.',
                'Pemahaman baik mengenai OOP, MVC, dan framework Laravel.',
                'Mampu merancang skema relasi database relasional (3NF).',
            ],
            'closing_date' => '2026-11-30',
            'status' => 'published',
        ]);

        // 5. Applications (Internal & External)
        $app1 = Application::create([
            'job_seeker_id' => $seeker->id,
            'job_posting_id' => $job1->id,
            'source' => 'CareerTrack',
            'status' => 'interview',
            'applied_at' => '2026-10-15',
            'notes' => 'Melamar via CareerTrack dengan CV utama.',
            'resume_title' => 'CV_Dimas_Pratama_Backend_2026.pdf',
        ]);

        ApplicationStatusHistory::create([
            'application_id' => $app1->id,
            'changed_by' => $seeker->id,
            'status_from' => '-',
            'status_to' => 'submitted',
            'reason_or_note' => 'Mengirim lamaran kerja baru.',
        ]);

        ApplicationStatusHistory::create([
            'application_id' => $app1->id,
            'changed_by' => $recruiter->id,
            'status_from' => 'submitted',
            'status_to' => 'interview',
            'reason_or_note' => 'Lolos screening CV, diundang sesi wawancara teknis.',
        ]);

        Interview::create([
            'application_id' => $app1->id,
            'scheduled_at' => '2026-11-04 10:30:00',
            'type' => 'online',
            'location_or_link' => 'https://meet.google.com/qwe-careertrack-demo',
            'instructions' => 'Mohon siapkan laptop dan code editor untuk sesi live coding 45 menit.',
            'status' => 'scheduled',
        ]);

        RecruiterNote::create([
            'application_id' => $app1->id,
            'recruiter_id' => $recruiter->id,
            'note' => 'Pemahaman arsitektur MVC dan query database sangat baik.',
        ]);

        // External Application (LinkedIn)
        $app2 = Application::create([
            'job_seeker_id' => $seeker->id,
            'job_posting_id' => null, // Eksternal
            'source' => 'LinkedIn',
            'external_company_name' => 'Tokopedia',
            'external_job_title' => 'Software Engineer Intern',
            'external_url' => 'https://linkedin.com/jobs/view/123456',
            'status' => 'submitted',
            'applied_at' => '2026-10-20',
            'notes' => 'Melamar mandiri melalui LinkedIn Easy Apply.',
            'resume_title' => 'CV_Dimas_Pratama_Backend_2026.pdf',
        ]);

        // 6. Documents
        Document::create([
            'user_id' => $seeker->id,
            'title' => 'CV Utama (ATS Friendly)',
            'type' => 'resume',
            'file_name' => 'CV_Dimas_Pratama_Backend_2026.pdf',
            'file_path' => 'documents/cv_dimas_2026.pdf',
            'file_size_kb' => 342,
            'is_primary_resume' => true,
        ]);
    }
}
