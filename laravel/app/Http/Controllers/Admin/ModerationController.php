<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Http\Request;

class ModerationController extends Controller
{
    public function dashboard()
    {
        $totalUsers = User::count();
        $totalCompanies = Company::count();
        $totalJobs = JobPosting::count();
        $pendingJobs = JobPosting::where('status', 'pending_review')->count();

        $recentPending = JobPosting::with('company', 'category')
            ->where('status', 'pending_review')
            ->latest()
            ->take(5)
            ->get();

        return view('admin.dashboard', compact(
            'totalUsers',
            'totalCompanies',
            'totalJobs',
            'pendingJobs',
            'recentPending'
        ));
    }

    public function index(Request $request)
    {
        $status = $request->get('status', 'pending_review');

        $query = JobPosting::with('company', 'category');

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $jobs = $query->latest()->paginate(10)->withQueryString();

        return view('admin.moderation.index', compact('jobs', 'status'));
    }

    public function approve(int $id)
    {
        $job = JobPosting::findOrFail($id);
        $job->update([
            'status' => 'published',
            'rejection_reason' => null,
        ]);

        return redirect()->back()->with('success', 'Lowongan pekerjaan telah disetujui untuk dipublikasikan.');
    }

    public function reject(Request $request, int $id)
    {
        $job = JobPosting::findOrFail($id);

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $job->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        return redirect()->back()->with('success', 'Lowongan telah ditolak.');
    }

    public function toggleVerify(int $id)
    {
        $company = Company::findOrFail($id);
        $company->update([
            'is_verified' => ! $company->is_verified,
        ]);

        return redirect()->back()->with('success', 'Status verifikasi perusahaan berhasil diperbarui.');
    }
}
