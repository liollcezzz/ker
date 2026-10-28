@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900">Dashboard Rekrutmen — {{ $company->name }}</h1>
            <p class="text-xs text-slate-500 mt-0.5">Kelola lowongan aktif dan evaluasi berkas kandidat pelamar.</p>
        </div>
        <div class="flex items-center gap-2">
            <a href="{{ route('recruiter.jobs.create') }}" class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-xl shadow-2xs">
                + Buat Lowongan Baru
            </a>
            <a href="{{ route('recruiter.candidates.index') }}" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">
                Daftar Kandidat
            </a>
        </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Lowongan</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{{ $totalJobs }}</div>
            <span class="text-[11px] text-slate-400">Tergabung di profil</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lowongan Aktif</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{{ $activeJobsCount }}</div>
            <span class="text-[11px] text-emerald-600">Sedang tayang publik</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pelamar</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">{{ $totalApplicants }}</div>
            <span class="text-[11px] text-blue-600">Dalam pipeline ATS</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tahap Wawancara</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono">{{ $interviewCount }}</div>
            <span class="text-[11px] text-purple-600">Sesi interview aktif</span>
        </div>
    </div>

    <!-- Recent Candidates -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Pelamar Masuk Terbaru</h2>
            <a href="{{ route('recruiter.candidates.index') }}" class="text-xs font-semibold text-purple-600 hover:underline">
                Kelola Semua Kandidat &rarr;
            </a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                    <tr>
                        <th class="px-3 py-2.5">Nama Pelamar</th>
                        <th class="px-3 py-2.5">Posisi Dilamar</th>
                        <th class="px-3 py-2.5">Tanggal</th>
                        <th class="px-3 py-2.5">Status</th>
                        <th class="px-3 py-2.5 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                    @forelse($recentApplicants as $cand)
                        <tr>
                            <td class="px-3 py-3">
                                <div class="font-bold text-slate-900">{{ $cand->jobSeeker->name }}</div>
                                <div class="text-[11px] text-slate-500">{{ $cand->jobSeeker->email }}</div>
                            </td>
                            <td class="px-3 py-3 font-semibold">{{ $cand->jobPosting->title }}</td>
                            <td class="px-3 py-3 font-mono">{{ $cand->applied_at->format('d/m/Y') }}</td>
                            <td class="px-3 py-3">
                                <x-status-badge :status="$cand->status" />
                            </td>
                            <td class="px-3 py-3 text-right">
                                <a href="{{ route('recruiter.candidates.show', $cand->id) }}" class="px-3 py-1 bg-purple-50 text-purple-700 font-semibold rounded-lg hover:bg-purple-100 border border-purple-200">
                                    Evaluasi
                                </a>
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-3 py-6 text-center text-slate-400">Belum ada pelamar yang mendaftar.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
