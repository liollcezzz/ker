@props(['status'])

@php
    $config = match($status) {
        'submitted' => ['bg' => 'bg-blue-50', 'text' => 'text-blue-700', 'border' => 'border-blue-200', 'dot' => 'bg-blue-600', 'label' => 'Submitted'],
        'under_review' => ['bg' => 'bg-amber-50', 'text' => 'text-amber-800', 'border' => 'border-amber-200', 'dot' => 'bg-amber-500', 'label' => 'Under Review'],
        'interview' => ['bg' => 'bg-purple-50', 'text' => 'text-purple-700', 'border' => 'border-purple-200', 'dot' => 'bg-purple-600', 'label' => 'Interview'],
        'offered' => ['bg' => 'bg-emerald-50', 'text' => 'text-emerald-800', 'border' => 'border-emerald-200', 'dot' => 'bg-emerald-600', 'label' => 'Offered'],
        'rejected' => ['bg' => 'bg-rose-50', 'text' => 'text-rose-700', 'border' => 'border-rose-200', 'dot' => 'bg-rose-500', 'label' => 'Rejected'],
        'withdrawn' => ['bg' => 'bg-slate-100', 'text' => 'text-slate-700', 'border' => 'border-slate-200', 'dot' => 'bg-slate-400', 'label' => 'Withdrawn'],
        'published' => ['bg' => 'bg-emerald-50', 'text' => 'text-emerald-800', 'border' => 'border-emerald-200', 'dot' => 'bg-emerald-600', 'label' => 'Published'],
        'pending_review' => ['bg' => 'bg-amber-50', 'text' => 'text-amber-800', 'border' => 'border-amber-200', 'dot' => 'bg-amber-500', 'label' => 'Pending Review'],
        'draft' => ['bg' => 'bg-slate-100', 'text' => 'text-slate-700', 'border' => 'border-slate-200', 'dot' => 'bg-slate-400', 'label' => 'Draft'],
        'closed' => ['bg' => 'bg-slate-100', 'text' => 'text-slate-600', 'border' => 'border-slate-300', 'dot' => 'bg-slate-400', 'label' => 'Closed'],
        default => ['bg' => 'bg-slate-100', 'text' => 'text-slate-700', 'border' => 'border-slate-200', 'dot' => 'bg-slate-400', 'label' => ucfirst($status)],
    };
@endphp

<span class="inline-flex items-center gap-1.5 font-medium rounded-md border {{ $config['bg'] }} {{ $config['text'] }} {{ $config['border'] }} px-2.5 py-1 text-xs whitespace-nowrap">
    <span class="w-1.5 h-1.5 rounded-full {{ $config['dot'] }}" aria-hidden="true"></span>
    {{ $config['label'] }}
</span>
