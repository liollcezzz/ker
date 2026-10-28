<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_seeker_id',
        'job_posting_id',
        'source',
        'external_company_name',
        'external_job_title',
        'external_url',
        'status',
        'applied_at',
        'notes',
        'resume_title',
    ];

    protected $casts = [
        'applied_at' => 'date',
    ];

    // Accessor: Mengembalikan nama perusahaan baik internal maupun eksternal
    public function getEffectiveCompanyNameAttribute(): string
    {
        return $this->jobPosting ? $this->jobPosting->company->name : ($this->external_company_name ?? 'N/A');
    }

    // Accessor: Mengembalikan judul posisi baik internal maupun eksternal
    public function getEffectiveJobTitleAttribute(): string
    {
        return $this->jobPosting ? $this->jobPosting->title : ($this->external_job_title ?? 'N/A');
    }

    public function isExternal(): bool
    {
        return $this->job_posting_id === null;
    }

    public function jobSeeker(): BelongsTo
    {
        return $this->belongsTo(User::class, 'job_seeker_id');
    }

    public function jobPosting(): BelongsTo
    {
        return $this->belongsTo(JobPosting::class);
    }

    public function statusHistories(): HasMany
    {
        return $this->hasMany(ApplicationStatusHistory::class)->latest();
    }

    public function recruiterNotes(): HasMany
    {
        return $this->hasMany(RecruiterNote::class)->latest();
    }

    public function interview(): HasOne
    {
        return $this->hasOne(Interview::class);
    }
}
