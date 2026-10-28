<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobCatalogController;
use App\Http\Controllers\Seeker\ApplicationTrackerController;
use App\Http\Controllers\Seeker\DocumentController;
use App\Http\Controllers\Recruiter\JobPostingController;
use App\Http\Controllers\Recruiter\CandidateController;
use App\Http\Controllers\Admin\ModerationController;

/*
|--------------------------------------------------------------------------
| Web Routes - CareerTrack Platform
|--------------------------------------------------------------------------
*/

// 1. RUTE PUBLIK
Route::get('/', [JobCatalogController::class, 'landing'])->name('landing');
Route::get('/jobs', [JobCatalogController::class, 'index'])->name('jobs.index');
Route::get('/jobs/{slug}', [JobCatalogController::class, 'show'])->name('jobs.show');

// 2. RUTE PENCARI KERJA (Role: job_seeker)
Route::middleware(['auth', 'role:job_seeker'])->prefix('seeker')->name('seeker.')->group(function () {
    Route::get('/dashboard', [ApplicationTrackerController::class, 'dashboard'])->name('dashboard');
    Route::get('/applications', [ApplicationTrackerController::class, 'index'])->name('applications.index');
    Route::get('/tracker', [ApplicationTrackerController::class, 'externalTracker'])->name('tracker');
    Route::post('/applications/external', [ApplicationTrackerController::class, 'storeExternal'])->name('applications.store_external');
    Route::post('/jobs/{id}/apply', [ApplicationTrackerController::class, 'applyInternal'])->name('jobs.apply');
    Route::patch('/applications/{id}/status', [ApplicationTrackerController::class, 'updateStatus'])->name('applications.update_status');
    Route::post('/jobs/{id}/bookmark', [ApplicationTrackerController::class, 'toggleBookmark'])->name('jobs.bookmark');
    Route::get('/saved-jobs', [ApplicationTrackerController::class, 'savedJobs'])->name('saved_jobs');
    Route::get('/interviews', [ApplicationTrackerController::class, 'interviews'])->name('interviews');
    
    // Manajemen Dokumen & CV Privat
    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::patch('/documents/{id}/primary', [DocumentController::class, 'setPrimary'])->name('documents.primary');
    Route::get('/documents/{id}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('/documents/{id}', [DocumentController::class, 'destroy'])->name('documents.destroy');
});

// 3. RUTE RECRUITER (Role: recruiter)
Route::middleware(['auth', 'role:recruiter'])->prefix('recruiter')->name('recruiter.')->group(function () {
    Route::get('/dashboard', [JobPostingController::class, 'dashboard'])->name('dashboard');
    Route::resource('jobs', JobPostingController::class);
    Route::patch('/jobs/{id}/close', [JobPostingController::class, 'closeJob'])->name('jobs.close');
    Route::get('/candidates', [CandidateController::class, 'index'])->name('candidates.index');
    Route::get('/candidates/{id}', [CandidateController::class, 'show'])->name('candidates.show');
    Route::patch('/candidates/{id}/status', [CandidateController::class, 'updateStatus'])->name('candidates.update_status');
    Route::post('/candidates/{id}/notes', [CandidateController::class, 'addNote'])->name('candidates.add_note');
    Route::post('/candidates/{id}/interview', [CandidateController::class, 'scheduleInterview'])->name('candidates.schedule_interview');
});

// 4. RUTE ADMINISTRATOR (Role: admin)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [ModerationController::class, 'dashboard'])->name('dashboard');
    Route::get('/moderation', [ModerationController::class, 'index'])->name('moderation.index');
    Route::post('/moderation/{id}/approve', [ModerationController::class, 'approve'])->name('moderation.approve');
    Route::post('/moderation/{id}/reject', [ModerationController::class, 'reject'])->name('moderation.reject');
    Route::patch('/companies/{id}/verify', [ModerationController::class, 'toggleVerify'])->name('companies.verify');
});

require __DIR__.'/auth.php';
