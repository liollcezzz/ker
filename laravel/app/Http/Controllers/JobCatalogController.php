<?php

namespace App\Http\Controllers;

use App\Models\JobPosting;
use App\Models\JobCategory;
use Illuminate\Http\Request;

class JobCatalogController extends Controller
{
    /**
     * Tampilkan Landing Page publik.
     */
    public function landing()
    {
        $featuredJobs = JobPosting::with('company', 'category')
            ->published()
            ->latest()
            ->take(4)
            ->get();

        $stats = [
            'total_seekers' => 9840,
            'total_companies' => 420,
            'total_jobs' => JobPosting::published()->count(),
            'interview_rate' => 94,
        ];

        return view('landing', compact('featuredJobs', 'stats'));
    }

    /**
     * Tampilkan katalog lowongan kerja dengan filter pencarian.
     */
    public function index(Request $request)
    {
        $query = JobPosting::with('company', 'category')->published();

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', "%{$keyword}%")
                  ->orWhere('description', 'like', "%{$keyword}%")
                  ->orWhereHas('company', function ($c) use ($keyword) {
                      $c->where('name', 'like', "%{$keyword}%");
                  });
            });
        }

        if ($request->filled('location')) {
            $query->where('location', 'like', "%{$request->location}%");
        }

        if ($request->filled('category_id')) {
            $query->where('job_category_id', $request->category_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->sortBy === 'salary_high') {
            $query->orderByDesc('salary_max');
        } elseif ($request->sortBy === 'salary_low') {
            $query->orderBy('salary_min');
        } else {
            $query->latest();
        }

        $jobs = $query->paginate(10)->withQueryString();
        $categories = JobCategory::all();

        return view('jobs.index', compact('jobs', 'categories'));
    }

    /**
     * Tampilkan rincian detail satu lowongan kerja.
     */
    public function show(string $slug)
    {
        $job = JobPosting::with('company', 'category')
            ->where('slug', $slug)
            ->firstOrFail();

        $similarJobs = JobPosting::with('company')
            ->published()
            ->where('id', '!=', $job->id)
            ->where('job_category_id', $job->job_category_id)
            ->take(3)
            ->get();

        return view('jobs.show', compact('job', 'similarJobs'));
    }
}
