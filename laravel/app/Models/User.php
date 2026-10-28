<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'avatar_url',
        'headline',
        'bio',
        'location',
        'university',
        'graduation_year',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isJobSeeker(): bool
    {
        return $this->role === 'job_seeker';
    }

    public function isRecruiter(): bool
    {
        return $this->role === 'recruiter';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    // Relasi untuk Recruiter
    public function company(): HasOne
    {
        return $this->hasOne(Company::class);
    }

    // Relasi untuk Job Seeker
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'job_seeker_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function savedJobs(): HasMany
    {
        return $this->hasMany(SavedJob::class);
    }
}
