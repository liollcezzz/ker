<?php

namespace App\Http\Controllers\Recruiter;

use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class JobPostingController extends Controller
{
    public function dashboard()
    {
        $company = Auth::user()->company;
        if (! $company) {
            abort(403, 'Profil perusahaan belum dibuat.');
        }

        $jobs = $company->jobPostings()->withCount('applications')->get();
        $totalJobs = $jobs->count();
        $activeJobsCount = $jobs->where('status', 'published')->count();

        $applications = \App\Models\Application::whereIn('job_posting_id', $jobs->pluck('id'))->get();
        $totalApplicants = $applications->count();
        $interviewCount = $applications->where('status', 'interview')->count();

        $recentApplicants = \App\Models\Application::whereIn('job_posting_id', $jobs->pluck('id'))
            ->with('jobSeeker', 'jobPosting')
            ->latest()
            ->take(5)
            ->get();

        return view('recruiter.dashboard', compact(
            'company',
            'totalJobs',
            'activeJobsCount',
            'totalApplicants',
            'interviewCount',
            'jobs',
            'recentApplicants'
        ));
    }

    public function index()
    {
        $company = Auth::user()->company;
        $jobs = $company->jobPostings()->withCount('applications')->latest()->paginate(10);

        return view('recruiter.jobs.index', compact('jobs'));
    }

    public function create()
    {
        $categories = JobCategory::all();
        return view('recruiter.jobs.create', compact('categories'));
    }

    public function store(Request $request)
    {
        $company = Auth::user()->company;

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'job_category_id' => 'required|exists:job_categories,id',
            'type' => 'required|in:Full-time,Part-time,Internship,Contract,Remote',
            'location' => 'required|string|max:255',
            'salary_min' => 'nullable|integer',
            'salary_max' => 'nullable|integer',
            'description' => 'required|string',
            'responsibilities' => 'nullable|string',
            'requirements' => 'nullable|string',
            'closing_date' => 'required|date',
            'status' => 'required|in:draft,pending_review,published',
        ]);

        $responsibilities = array_filter(array_map('trim', explode("\n", $request->responsibilities ?? '')));
        $requirements = array_filter(array_map('trim', explode("\n", $request->requirements ?? '')));

        $company->jobPostings()->create([
            'job_category_id' => $validated['job_category_id'],
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . time(),
            'type' => $validated['type'],
            'location' => $validated['location'],
            'salary_min' => $validated['salary_min'] ?? null,
            'salary_max' => $validated['salary_max'] ?? null,
            'description' => $validated['description'],
            'responsibilities' => $responsibilities,
            'requirements' => $requirements,
            'closing_date' => $validated['closing_date'],
            'status' => $validated['status'],
        ]);

        return redirect()->route('recruiter.jobs.index')->with('success', 'Lowongan pekerjaan berhasil disimpan.');
    }

    public function closeJob(int $id)
    {
        $company = Auth::user()->company;
        $job = $company->jobPostings()->findOrFail($id);

        $job->update(['status' => 'closed']);

        return redirect()->back()->with('success', 'Penerimaan lamaran untuk lowongan telah ditutup.');
    }

    public function destroy(int $id)
    {
        $company = Auth::user()->company;
        $job = $company->jobPostings()->findOrFail($id);

        $job->delete();

        return redirect()->route('recruiter.jobs.index')->with('success', 'Lowongan telah dihapus.');
    }
}
