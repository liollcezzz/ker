@extends('layouts.app')

@section('content')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
    <div>
        <h1 class="text-2xl font-bold text-slate-900">Eksplorasi Lowongan Kerja</h1>
        <p class="text-xs text-slate-500 mt-0.5">Temukan karir impian dan kirimkan lamaran secara terpusat.</p>
    </div>

    <!-- Filter Form -->
    <form action="{{ route('jobs.index') }}" method="GET" class="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
        <input type="text" name="keyword" value="{{ request('keyword') }}" placeholder="Cari posisi atau perusahaan..." class="px-3 py-2 rounded-xl border border-slate-300">
        <input type="text" name="location" value="{{ request('location') }}" placeholder="Lokasi kerja..." class="px-3 py-2 rounded-xl border border-slate-300">
        <select name="type" class="px-3 py-2 rounded-xl border border-slate-300 bg-white">
            <option value="">Semua Tipe Pekerjaan</option>
            <option value="Full-time" {{ request('type') == 'Full-time' ? 'selected' : '' }}>Full-time</option>
            <option value="Part-time" {{ request('type') == 'Part-time' ? 'selected' : '' }}>Part-time</option>
            <option value="Internship" {{ request('type') == 'Internship' ? 'selected' : '' }}>Internship</option>
            <option value="Contract" {{ request('type') == 'Contract' ? 'selected' : '' }}>Contract</option>
            <option value="Remote" {{ request('type') == 'Remote' ? 'selected' : '' }}>Remote</option>
        </select>
        <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
            Terapkan Filter
        </button>
    </form>

    <!-- Jobs List -->
    <div class="space-y-4">
        @forelse($jobs as $job)
            <div class="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="space-y-1">
                    <h3 class="text-base font-bold text-slate-900">
                        <a href="{{ route('jobs.show', $job->slug) }}" class="hover:text-blue-600">{{ $job->title }}</a>
                    </h3>
                    <div class="text-xs font-semibold text-slate-600">{{ $job->company->name }} &middot; {{ $job->location }}</div>
                    <div class="flex items-center gap-2 text-xs text-slate-500 pt-1">
                        <span class="font-semibold text-slate-700">{{ $job->type }}</span>
                        <span>&middot;</span>
                        <span>{{ $job->category->name }}</span>
                        <span>&middot;</span>
                        <span>Batas: {{ $job->closing_date->format('d M Y') }}</span>
                    </div>
                </div>

                <div class="flex items-center gap-4 shrink-0">
                    <div class="text-right text-xs">
                        <span class="font-bold text-slate-900 font-mono block">
                            @if($job->salary_min && $job->salary_max)
                                Rp {{ number_format($job->salary_min / 1000000, 1) }} - {{ number_format($job->salary_max / 1000000, 1) }} Jt
                            @else
                                Kompetitif
                            @endif
                        </span>
                        <span class="text-slate-400 text-[11px]">per bulan</span>
                    </div>
                    <a href="{{ route('jobs.show', $job->slug) }}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition-colors">
                        Lamar Sekarang
                    </a>
                </div>
            </div>
        @empty
            <div class="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
                Tidak ada lowongan kerja yang sesuai kriteria pencarian Anda.
            </div>
        @endforelse

        <div>
            {{ $jobs->links() }}
        </div>
    </div>
</div>
@endsection
