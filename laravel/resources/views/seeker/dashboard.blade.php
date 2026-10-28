@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-900">Dashboard Pencari Kerja</h1>
            <p class="text-xs text-slate-500 mt-0.5">Kelola pelacakan lamaran internal dan eksternal Anda.</p>
        </div>
        <div class="flex items-center gap-2">
            <a href="{{ route('seeker.tracker') }}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-2xs">
                + Tambah Lamaran Eksternal
            </a>
            <a href="{{ route('jobs.index') }}" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl">
                Cari Lowongan
            </a>
        </div>
    </div>

    <!-- 4 KPI Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Lamaran</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{{ $totalApplications }}</div>
            <span class="text-[11px] text-slate-400">Internal & Eksternal</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sedang Ditinjau</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">{{ $underReviewCount }}</div>
            <span class="text-[11px] text-amber-600">Dalam proses seleksi</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Wawancara</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-purple-600 font-mono">{{ $interviewCount }}</div>
            <span class="text-[11px] text-purple-600">Jadwal interview aktif</span>
        </div>
        <div class="p-5 bg-white rounded-2xl border border-slate-200 space-y-1">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Penawaran (Offer)</span>
            <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{{ $offeredCount }}</div>
            <span class="text-[11px] text-emerald-600">Tahap offering letter</span>
        </div>
    </div>

    <!-- Recent Applications Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Lamaran Terbaru</h2>
            <a href="{{ route('seeker.applications.index') }}" class="text-xs font-semibold text-blue-600 hover:underline">
                Lihat Seluruh Lamaran &rarr;
            </a>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                    <tr>
                        <th class="px-3 py-2.5">Posisi & Perusahaan</th>
                        <th class="px-3 py-2.5">Sumber</th>
                        <th class="px-3 py-2.5">Tanggal</th>
                        <th class="px-3 py-2.5">Status</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 text-slate-700">
                    @forelse($recentApplications as $app)
                        <tr>
                            <td class="px-3 py-3">
                                <div class="font-bold text-slate-900">{{ $app->effective_job_title }}</div>
                                <div class="text-[11px] text-slate-500">{{ $app->effective_company_name }}</div>
                            </td>
                            <td class="px-3 py-3">{{ $app->source }}</td>
                            <td class="px-3 py-3 font-mono">{{ $app->applied_at->format('d/m/Y') }}</td>
                            <td class="px-3 py-3">
                                <x-status-badge :status="$app->status" />
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" class="px-3 py-6 text-center text-slate-400">Belum ada lamaran yang dikirimkan.</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
