<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosting extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'job_category_id',
        'title',
        'slug',
        'type',
        'location',
        'salary_min',
        'salary_max',
        'description',
        'responsibilities',
        'requirements',
        'closing_date',
        'status',
        'rejection_reason',
    ];

    protected $casts = [
        'responsibilities' => 'array',
        'requirements' => 'array',
        'closing_date' => 'date',
        'salary_min' => 'integer',
        'salary_max' => 'integer',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(JobCategory::class, 'job_category_id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function savedByUsers(): HasMany
    {
        return $this->hasMany(SavedJob::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
