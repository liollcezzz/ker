@extends('layouts.app')

@section('content')
<div class="space-y-16 pb-16">
    <!-- Hero Section -->
    <section class="bg-slate-900 text-white py-16 lg:py-24 border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="max-w-3xl space-y-6">
                <div class="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-blue-400">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    Platform Pelacakan Karir & Rekrutmen Laravel 11 + SQLite
                </div>

                <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                    Kelola Lamaran Kerja, Bangun Kariermu.
                </h1>

                <p class="text-base sm:text-lg text-slate-300 leading-relaxed">
                    Pantau setiap lamaran kerja pribadi—baik dari LinkedIn, portal karir lain, maupun internal CareerTrack—serta kelola kandidat perusahaan dalam satu sistem berbasis Laravel dan SQLite.
                </p>

                <!-- Search Form -->
                <form action="{{ route('jobs.index') }}" method="GET" class="bg-white p-3 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2 text-slate-900">
                    <div class="flex-1 px-3 py-2 bg-slate-50 rounded-xl">
                        <input type="text" name="keyword" placeholder="Posisi, keahlian, perusahaan..." class="w-full bg-transparent text-xs sm:text-sm focus:outline-none">
                    </div>
                    <div class="flex-1 px-3 py-2 bg-slate-50 rounded-xl">
                        <input type="text" name="location" placeholder="Lokasi (Jakarta, Remote)..." class="w-full bg-transparent text-xs sm:text-sm focus:outline-none">
                    </div>
                    <button type="submit" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0">
                        Cari Lowongan
                    </button>
                </form>
            </div>
        </div>
    </section>

    <!-- Stat Strip -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{{ number_format($stats['total_seekers']) }}+</div>
                <div class="text-xs text-slate-500">Pelamar Aktif</div>
            </div>
            <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{{ $stats['total_companies'] }}+</div>
                <div class="text-xs text-slate-500">Perusahaan Mitra</div>
            </div>
            <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{{ $stats['total_jobs'] }}+</div>
                <div class="text-xs text-slate-500">Lowongan Aktif</div>
            </div>
            <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{{ $stats['interview_rate'] }}%</div>
                <div class="text-xs text-slate-500">Ketepatan Wawancara</div>
            </div>
        </div>
    </section>

    <!-- Latest Jobs -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-6">
            <div>
                <h2 class="text-2xl font-bold text-slate-900">Lowongan Pekerjaan Terbaru</h2>
                <p class="text-xs text-slate-500 mt-0.5">Peluang karir terverifikasi yang baru dipublikasikan</p>
            </div>
            <a href="{{ route('jobs.index') }}" class="text-xs font-semibold text-blue-600 hover:underline">
                Lihat Semua Lowongan &rarr;
            </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @foreach($featuredJobs as $job)
                <div class="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
                    <div class="space-y-2">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 class="text-base font-bold text-slate-900 hover:text-blue-600">
                                    <a href="{{ route('jobs.show', $job->slug) }}">{{ $job->title }}</a>
                                </h3>
                                <div class="text-xs text-slate-600 font-medium">{{ $job->company->name }}</div>
                            </div>
                            <x-status-badge :status="$job->status" />
                        </div>
                        <div class="flex items-center gap-2 text-xs text-slate-500">
                            <span>{{ $job->location }}</span>
                            <span>&middot;</span>
                            <span class="font-semibold text-slate-700">{{ $job->type }}</span>
                            <span>&middot;</span>
                            <span>{{ $job->category->name }}</span>
                        </div>
                        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                            {{ $job->description }}
                        </p>
                    </div>

                    <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span class="text-xs font-bold text-slate-900 font-mono">
                            @if($job->salary_min && $job->salary_max)
                                Rp {{ number_format($job->salary_min / 1000000, 1) }} - {{ number_format($job->salary_max / 1000000, 1) }} Juta
                            @else
                                Gaji Kompetitif
                            @endif
                        </span>
                        <a href="{{ route('jobs.show', $job->slug) }}" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors">
                            Lihat Rincian
                        </a>
                    </div>
                </div>
            @endforeach
        </div>
    </section>
</div>
@endsection
