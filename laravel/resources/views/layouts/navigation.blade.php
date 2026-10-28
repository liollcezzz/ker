<header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <!-- Logo -->
        <a href="{{ route('landing') }}" class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base tracking-wider shadow-xs">
                CT
            </div>
            <span class="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">CareerTrack</span>
        </a>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="{{ route('landing') }}" class="hover:text-slate-900 transition-colors {{ request()->routeIs('landing') ? 'text-blue-600 font-semibold' : '' }}">
                Beranda
            </a>
            <a href="{{ route('jobs.index') }}" class="hover:text-slate-900 transition-colors {{ request()->routeIs('jobs.*') ? 'text-blue-600 font-semibold' : '' }}">
                Cari Lowongan
            </a>
            @auth
                @if (auth()->user()->isJobSeeker())
                    <a href="{{ route('seeker.dashboard') }}" class="hover:text-slate-900 transition-colors {{ request()->routeIs('seeker.*') ? 'text-blue-600 font-semibold' : '' }}">
                        Dashboard Pelamar
                    </a>
                @elseif (auth()->user()->isRecruiter())
                    <a href="{{ route('recruiter.dashboard') }}" class="hover:text-slate-900 transition-colors {{ request()->routeIs('recruiter.*') ? 'text-purple-600 font-semibold' : '' }}">
                        Dashboard Recruiter
                    </a>
                @elseif (auth()->user()->isAdmin())
                    <a href="{{ route('admin.dashboard') }}" class="hover:text-slate-900 transition-colors {{ request()->routeIs('admin.*') ? 'text-emerald-600 font-semibold' : '' }}">
                        Dashboard Admin
                    </a>
                @endif
            @endauth
        </nav>

        <!-- Auth Actions -->
        <div class="flex items-center gap-3">
            @auth
                <div class="flex items-center gap-2 text-xs">
                    <span class="font-bold text-slate-900">{{ auth()->user()->name }}</span>
                    <form method="POST" action="{{ route('logout') }}" class="inline">
                        @csrf
                        <button type="submit" class="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                            Keluar
                        </button>
                    </form>
                </div>
            @else
                <a href="{{ route('login') }}" class="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2">
                    Masuk
                </a>
                <a href="{{ route('register') }}" class="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-2xs">
                    Daftar Sekarang
                </a>
            @endauth
        </div>
    </div>
</header>
