<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    /**
     * Tentukan apakah user dapat melihat detail lamaran.
     */
    public function view(User $user, Application $application): bool
    {
        // Admin memiliki akses penuh
        if ($user->isAdmin()) {
            return true;
        }

        // Pencari kerja hanya melihat lamarannya sendiri
        if ($user->isJobSeeker()) {
            return $application->job_seeker_id === $user->id;
        }

        // Recruiter hanya melihat lamaran pada lowongan miliknya
        if ($user->isRecruiter() && $application->jobPosting) {
            return $application->jobPosting->company->user_id === $user->id;
        }

        return false;
    }

    /**
     * Tentukan apakah user dapat memperbarui lamaran.
     */
    public function update(User $user, Application $application): bool
    {
        // Pencari kerja dapat update catatan pada lamaran eksternalnya atau menarik lamaran
        if ($user->isJobSeeker()) {
            return $application->job_seeker_id === $user->id;
        }

        // Recruiter dapat mengubah status kandidat di perusahaannya
        if ($user->isRecruiter() && $application->jobPosting) {
            return $application->jobPosting->company->user_id === $user->id;
        }

        return $user->isAdmin();
    }
}
