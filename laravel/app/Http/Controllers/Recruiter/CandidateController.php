<?php

namespace App\Http\Controllers\Recruiter;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Interview;
use App\Models\RecruiterNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $company = Auth::user()->company;
        $jobIds = $company->jobPostings()->pluck('id');

        $query = Application::whereIn('job_posting_id', $jobIds)
            ->with('jobSeeker', 'jobPosting', 'interview');

        if ($request->filled('job_id')) {
            $query->where('job_posting_id', $request->job_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $candidates = $query->latest()->paginate(15)->withQueryString();
        $jobs = $company->jobPostings;

        return view('recruiter.candidates.index', compact('candidates', 'jobs'));
    }

    public function show(int $id)
    {
        $company = Auth::user()->company;
        $jobIds = $company->jobPostings()->pluck('id');

        $candidate = Application::whereIn('job_posting_id', $jobIds)
            ->with(['jobSeeker.documents', 'jobPosting', 'statusHistories.user', 'recruiterNotes.recruiter', 'interview'])
            ->findOrFail($id);

        return view('recruiter.candidates.show', compact('candidate'));
    }

    public function updateStatus(Request $request, int $id)
    {
        $company = Auth::user()->company;
        $jobIds = $company->jobPostings()->pluck('id');
        $application = Application::whereIn('job_posting_id', $jobIds)->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:submitted,under_review,interview,offered,rejected',
            'reason_or_note' => 'nullable|string|max:255',
        ]);

        $oldStatus = $application->status;
        $application->update(['status' => $validated['status']]);

        $application->statusHistories()->create([
            'changed_by' => Auth::id(),
            'status_from' => $oldStatus,
            'status_to' => $validated['status'],
            'reason_or_note' => $validated['reason_or_note'] ?? 'Status diubah oleh Recruiter.',
        ]);

        return redirect()->back()->with('success', 'Status kandidat berhasil diperbarui.');
    }

    public function addNote(Request $request, int $id)
    {
        $company = Auth::user()->company;
        $jobIds = $company->jobPostings()->pluck('id');
        $application = Application::whereIn('job_posting_id', $jobIds)->findOrFail($id);

        $validated = $request->validate([
            'note' => 'required|string|max:1000',
        ]);

        $application->recruiterNotes()->create([
            'recruiter_id' => Auth::id(),
            'note' => $validated['note'],
        ]);

        return redirect()->back()->with('success', 'Catatan evaluasi privat berhasil disimpan.');
    }

    public function scheduleInterview(Request $request, int $id)
    {
        $company = Auth::user()->company;
        $jobIds = $company->jobPostings()->pluck('id');
        $application = Application::whereIn('job_posting_id', $jobIds)->findOrFail($id);

        $validated = $request->validate([
            'scheduled_at' => 'required|date|after:now',
            'type' => 'required|in:online,offline',
            'location_or_link' => 'required|string|max:500',
            'instructions' => 'nullable|string|max:1000',
        ]);

        Interview::updateOrCreate(
            ['application_id' => $application->id],
            [
                'scheduled_at' => $validated['scheduled_at'],
                'type' => $validated['type'],
                'location_or_link' => $validated['location_or_link'],
                'instructions' => $validated['instructions'] ?? null,
                'status' => 'scheduled',
            ]
        );

        $oldStatus = $application->status;
        $application->update(['status' => 'interview']);

        $application->statusHistories()->create([
            'changed_by' => Auth::id(),
            'status_from' => $oldStatus,
            'status_to' => 'interview',
            'reason_or_note' => 'Undangan wawancara dijadwalkan pada ' . $validated['scheduled_at'] . ' (' . $validated['type'] . ').',
        ]);

        return redirect()->back()->with('success', 'Jadwal wawancara berhasil diatur.');
    }
}
