<?php

namespace App\Http\Controllers\Seeker;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\ApplicationStatusHistory;
use App\Models\JobPosting;
use App\Models\SavedJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ApplicationTrackerController extends Controller
{
    /**
     * Dashboard ringkasan pencari kerja.
     */
    public function dashboard()
    {
        $user = Auth::user();

        $applications = $user->applications()->with('jobPosting.company', 'interview')->latest()->get();

        $totalApplications = $applications->count();
        $underReviewCount = $applications->whereIn('status', ['submitted', 'under_review'])->count();
        $interviewCount = $applications->where('status', 'interview')->count();
        $offeredCount = $applications->where('status', 'offered')->count();

        $recentApplications = $applications->take(5);
        $upcomingInterview = $applications->firstWhere('status', 'interview');

        return view('seeker.dashboard', compact(
            'totalApplications',
            'underReviewCount',
            'interviewCount',
            'offeredCount',
            'recentApplications',
            'upcomingInterview'
        ));
    }

    /**
     * Tampilkan tabel seluruh lamaran (Internal & Eksternal).
     */
    public function index(Request $request)
    {
        $query = Auth::user()->applications()->with('jobPosting.company', 'interview');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        $applications = $query->latest()->paginate(10)->withQueryString();

        return view('seeker.applications.index', compact('applications'));
    }

    /**
     * Simpan lamaran mandiri dari sumber eksternal (LinkedIn, Job Portal, dll).
     */
    public function storeExternal(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'job_title' => 'required|string|max:255',
            'source' => 'required|in:Website Perusahaan,LinkedIn,Job Portal Lain,Email,Referensi,Lainnya',
            'external_url' => 'nullable|url|max:500',
            'applied_at' => 'required|date',
            'status' => 'required|in:submitted,under_review,interview,offered,rejected,withdrawn',
            'notes' => 'nullable|string',
        ]);

        $application = Auth::user()->applications()->create([
            'job_posting_id' => null, // Null menandakan lamaran eksternal
            'source' => $validated['source'],
            'external_company_name' => $validated['company_name'],
            'external_job_title' => $validated['job_title'],
            'external_url' => $validated['external_url'] ?? null,
            'status' => $validated['status'],
            'applied_at' => $validated['applied_at'],
            'notes' => $validated['notes'] ?? null,
        ]);

        // Catat riwayat awal
        $application->statusHistories()->create([
            'changed_by' => Auth::id(),
            'status_from' => '-',
            'status_to' => $validated['status'],
            'reason_or_note' => 'Mencatat lamaran mandiri dari sumber ' . $validated['source'],
        ]);

        return redirect()->back()->with('success', 'Lamaran eksternal berhasil dicatat.');
    }

    /**
     * Kirim lamaran untuk lowongan internal CareerTrack.
     */
    public function applyInternal(Request $request, int $id)
    {
        $job = JobPosting::published()->findOrFail($id);
        $user = Auth::user();

        // Cek apakah sudah pernah melamar
        $existing = $user->applications()->where('job_posting_id', $job->id)->exists();
        if ($existing) {
            return redirect()->back()->with('error', 'Anda sudah pernah melamar untuk posisi ini.');
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
            'resume_title' => 'nullable|string|max:255',
        ]);

        $application = $user->applications()->create([
            'job_posting_id' => $job->id,
            'source' => 'CareerTrack',
            'status' => 'submitted',
            'applied_at' => now(),
            'notes' => $validated['notes'] ?? null,
            'resume_title' => $validated['resume_title'] ?? 'CV_Utama.pdf',
        ]);

        $application->statusHistories()->create([
            'changed_by' => $user->id,
            'status_from' => '-',
            'status_to' => 'submitted',
            'reason_or_note' => 'Melamar lowongan kerja melalui sistem CareerTrack.',
        ]);

        return redirect()->route('seeker.applications.index')->with('success', 'Lamaran berhasil dikirim ke ' . $job->company->name);
    }

    /**
     * Perbarui status lamaran (Pelamar memperbarui status eksternal atau membatalkan).
     */
    public function updateStatus(Request $request, int $id)
    {
        $application = Auth::user()->applications()->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:submitted,under_review,interview,offered,rejected,withdrawn',
            'reason' => 'nullable|string|max:255',
        ]);

        $oldStatus = $application->status;
        $application->update(['status' => $validated['status']]);

        $application->statusHistories()->create([
            'changed_by' => Auth::id(),
            'status_from' => $oldStatus,
            'status_to' => $validated['status'],
            'reason_or_note' => $validated['reason'] ?? 'Pembaruan status mandiri oleh pelamar.',
        ]);

        return redirect()->back()->with('success', 'Status lamaran berhasil diperbarui.');
    }
}
