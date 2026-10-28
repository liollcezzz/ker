import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_APPLICATIONS,
  INITIAL_COMPANIES,
  INITIAL_DOCUMENTS,
  INITIAL_JOB_POSTINGS,
  INITIAL_SAVED_JOB_IDS,
  INITIAL_USERS,
  INITIAL_CATEGORIES,
} from '../data/mockData';
import {
  Application,
  ApplicationStatus,
  Company,
  Document,
  Interview,
  JobCategory,
  JobPosting,
  JobPostingStatus,
  ToastMessage,
  User,
  UserRole,
} from '../types';

interface AppContextType {
  currentRole: UserRole;
  switchRole: (role: UserRole) => void;
  currentUser: User;
  users: User[];
  companies: Company[];
  jobPostings: JobPosting[];
  applications: Application[];
  documents: Document[];
  savedJobIds: number[];
  categories: JobCategory[];
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  resetToDefaultData: () => void;

  // Navigation
  activeView: string;
  setActiveView: (view: string) => void;
  selectedJobId: number | null;
  setSelectedJobId: (id: number | null) => void;

  // Actions
  addExternalApplication: (data: {
    companyName: string;
    jobTitle: string;
    source: Application['source'];
    externalUrl?: string;
    appliedAt: string;
    status: ApplicationStatus;
    notes?: string;
    interviewDate?: string;
  }) => void;
  updateApplicationStatus: (
    applicationId: number,
    newStatus: ApplicationStatus,
    reasonOrNote?: string
  ) => void;
  addRecruiterNote: (applicationId: number, note: string) => void;
  createJobPosting: (
    job: Omit<JobPosting, 'id' | 'companyId' | 'companyName' | 'companyLocation' | 'isCompanyVerified' | 'applicantsCount' | 'createdAt'>
  ) => void;
  updateJobPosting: (jobId: number, data: Partial<JobPosting>) => void;
  closeJobPosting: (jobId: number) => void;
  deleteJobPosting: (jobId: number) => void;
  moderateJob: (jobId: number, action: 'approve' | 'reject', reason?: string) => void;
  toggleCompanyVerification: (companyId: number) => void;
  applyToJob: (jobId: number, coverNote?: string, resumeTitle?: string) => boolean;
  toggleSaveJob: (jobId: number) => void;
  uploadDocument: (doc: {
    title: string;
    type: Document['type'];
    fileName: string;
    fileSizeKb: number;
    isPrimaryResume?: boolean;
  }) => void;
  setPrimaryResume: (docId: number) => void;
  deleteDocument: (docId: number) => void;
  scheduleInterview: (
    applicationId: number,
    interviewData: {
      scheduledAt: string;
      type: 'online' | 'offline';
      locationOrLink: string;
      instructions?: string;
    }
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'careertrack_role_v1',
  COMPANIES: 'careertrack_companies_v1',
  JOBS: 'careertrack_jobs_v1',
  APPLICATIONS: 'careertrack_applications_v1',
  DOCUMENTS: 'careertrack_documents_v1',
  SAVED_JOBS: 'careertrack_saved_jobs_v1',
  USERS: 'careertrack_users_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'job_seeker';
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [jobPostings, setJobPostings] = useState<JobPosting[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
    return saved ? JSON.parse(saved) : INITIAL_JOB_POSTINGS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [savedJobIds, setSavedJobIds] = useState<number[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED_JOBS);
    return saved ? JSON.parse(saved) : INITIAL_SAVED_JOB_IDS;
  });

  const [categories] = useState<JobCategory[]>(INITIAL_CATEGORIES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeView, setActiveView] = useState<string>('landing');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobPostings));
  }, [jobPostings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  const currentUser = users.find((u) => u.role === currentRole) || users[0];

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'job_seeker') {
      setActiveView('seeker_dashboard');
    } else if (newRole === 'recruiter') {
      setActiveView('recruiter_dashboard');
    } else if (newRole === 'admin') {
      setActiveView('admin_dashboard');
    }
    const roleNames: Record<UserRole, string> = {
      job_seeker: 'Pencari Kerja (Dimas Pratama)',
      recruiter: 'Recruiter (Siti Rahmawati - PT Nusantara Tech)',
      admin: 'Administrator (Budi Santoso)',
    };
    addToast('Role Berubah', `Mode aktif beralih ke ${roleNames[newRole]}`, 'info');
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCompanies(INITIAL_COMPANIES);
    setJobPostings(INITIAL_JOB_POSTINGS);
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setSavedJobIds(INITIAL_SAVED_JOB_IDS);
    setCurrentRole('job_seeker');
    setActiveView('landing');
    addToast('Reset Berhasil', 'Data contoh telah dikembalikan ke kondisi awal bawaan.', 'info');
  };

  // Actions implementation
  const addExternalApplication = (data: {
    companyName: string;
    jobTitle: string;
    source: Application['source'];
    externalUrl?: string;
    appliedAt: string;
    status: ApplicationStatus;
    notes?: string;
    interviewDate?: string;
  }) => {
    const newId = Date.now();
    const primaryDoc = documents.find((d) => d.isPrimaryResume);

    let interviewObj: Interview | null = null;
    if (data.interviewDate) {
      interviewObj = {
        id: Date.now() + 1,
        applicationId: newId,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        scheduledAt: data.interviewDate,
        type: 'online',
        locationOrLink: 'Tautan wawancara eksternal',
        instructions: 'Persiapan mandiri sesuai instruksi recruiter eksternal.',
        status: 'scheduled',
      };
    }

    const newApp: Application = {
      id: newId,
      jobSeekerId: currentUser.id,
      jobSeekerName: currentUser.name,
      jobSeekerEmail: currentUser.email,
      jobSeekerPhone: currentUser.phone,
      jobPostingId: null,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      source: data.source,
      externalUrl: data.externalUrl,
      status: data.status,
      appliedAt: data.appliedAt || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      resumeTitle: primaryDoc ? primaryDoc.fileName : 'CV_Pribadi.pdf',
      statusHistories: [
        {
          id: Date.now(),
          applicationId: newId,
          changedBy: `${currentUser.name} (Pencari Kerja)`,
          statusFrom: '-',
          statusTo: data.status,
          reasonOrNote: `Mencatat lamaran eksternal dari sumber ${data.source}.`,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
      interview: interviewObj,
      recruiterNotes: [],
    };

    setApplications((prev) => [newApp, ...prev]);
    addToast('Lamaran Eksternal Tersimpan', `Lamaran untuk posisi ${data.jobTitle} di ${data.companyName} berhasil dicatat.`);
  };

  const updateApplicationStatus = (
    applicationId: number,
    newStatus: ApplicationStatus,
    reasonOrNote?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        const newHistory = {
          id: Date.now(),
          applicationId,
          changedBy: currentUser.name,
          statusFrom: app.status,
          statusTo: newStatus,
          reasonOrNote: reasonOrNote || `Pembaruan status dari ${app.status} menjadi ${newStatus}.`,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        return {
          ...app,
          status: newStatus,
          statusHistories: [newHistory, ...app.statusHistories],
        };
      })
    );

    const labels: Record<ApplicationStatus, string> = {
      submitted: 'Submitted',
      under_review: 'Under Review',
      interview: 'Interview',
      offered: 'Offered',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
    };

    addToast('Status Diperbarui', `Status lamaran berhasil diubah menjadi "${labels[newStatus]}"`);
  };

  const addRecruiterNote = (applicationId: number, note: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;
        const newNote = {
          id: Date.now(),
          applicationId,
          recruiterId: currentUser.id,
          recruiterName: currentUser.name,
          note,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };
        return {
          ...app,
          recruiterNotes: [newNote, ...(app.recruiterNotes || [])],
        };
      })
    );
    addToast('Catatan Ditambahkan', 'Catatan evaluasi privat berhasil disimpan.');
  };

  const createJobPosting = (
    job: Omit<JobPosting, 'id' | 'companyId' | 'companyName' | 'companyLocation' | 'isCompanyVerified' | 'applicantsCount' | 'createdAt'>
  ) => {
    const currentCompany = companies.find((c) => c.userId === currentUser.id) || companies[0];
    const newId = Date.now();
    const newJob: JobPosting = {
      ...job,
      id: newId,
      companyId: currentCompany.id,
      companyName: currentCompany.name,
      companyLogo: currentCompany.logoUrl,
      companyLocation: currentCompany.location,
      isCompanyVerified: currentCompany.isVerified,
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setJobPostings((prev) => [newJob, ...prev]);

    if (newJob.status === 'pending_review') {
      addToast('Lowongan Diajukan', 'Lowongan menunggu verifikasi & persetujuan moderasi dari Administrator.', 'info');
    } else if (newJob.status === 'draft') {
      addToast('Draft Tersimpan', 'Lowongan disimpan sebagai draft dan belum tampil untuk publik.');
    } else {
      addToast('Lowongan Dipublikasikan', 'Lowongan kini telah aktif dan dapat dilamar oleh pencari kerja.');
    }
  };

  const updateJobPosting = (jobId: number, data: Partial<JobPosting>) => {
    setJobPostings((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, ...data } : job))
    );
    addToast('Lowongan Diperbarui', 'Perubahan informasi lowongan berhasil disimpan.');
  };

  const closeJobPosting = (jobId: number) => {
    setJobPostings((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: 'closed' as JobPostingStatus } : job))
    );
    addToast('Lowongan Ditutup', 'Penerimaan kandidat untuk lowongan ini telah dinonaktifkan.', 'info');
  };

  const deleteJobPosting = (jobId: number) => {
    setJobPostings((prev) => prev.filter((job) => job.id !== jobId));
    addToast('Lowongan Dihapus', 'Data lowongan kerja telah dihapus dari sistem.');
  };

  const moderateJob = (jobId: number, action: 'approve' | 'reject', reason?: string) => {
    setJobPostings((prev) =>
      prev.map((job) => {
        if (job.id !== jobId) return job;
        return {
          ...job,
          status: action === 'approve' ? 'published' : 'rejected',
          rejectionReason: action === 'reject' ? reason || 'Tidak memenuhi panduan komunitas' : undefined,
        };
      })
    );
    if (action === 'approve') {
      addToast('Lowongan Disetujui', 'Lowongan telah lolos moderasi dan berstatus Published.');
    } else {
      addToast('Lowongan Ditolak', 'Lowongan ditolak dan tidak akan ditampilkan ke pencari kerja.', 'error');
    }
  };

  const toggleCompanyVerification = (companyId: number) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== companyId) return c;
        const newStatus = !c.isVerified;
        return { ...c, isVerified: newStatus };
      })
    );
    // Also update jobs that belong to this company
    setJobPostings((prev) =>
      prev.map((j) => {
        if (j.companyId === companyId) {
          const comp = companies.find((c) => c.id === companyId);
          return { ...j, isCompanyVerified: !comp?.isVerified };
        }
        return j;
      })
    );
    addToast('Status Perusahaan Diperbarui', 'Perubahan verifikasi perusahaan berhasil disimpan.');
  };

  const applyToJob = (jobId: number, coverNote?: string, resumeTitle?: string): boolean => {
    const job = jobPostings.find((j) => j.id === jobId);
    if (!job) return false;

    // Check if already applied
    const alreadyApplied = applications.some(
      (a) => a.jobSeekerId === currentUser.id && a.jobPostingId === jobId
    );
    if (alreadyApplied) {
      addToast('Sudah Melamar', 'Anda sudah pernah mengirimkan lamaran untuk posisi ini.', 'info');
      return false;
    }

    const primaryDoc = documents.find((d) => d.isPrimaryResume);
    const chosenResume = resumeTitle || (primaryDoc ? primaryDoc.fileName : 'CV_Pribadi.pdf');
    const newId = Date.now();

    const newApp: Application = {
      id: newId,
      jobSeekerId: currentUser.id,
      jobSeekerName: currentUser.name,
      jobSeekerEmail: currentUser.email,
      jobSeekerPhone: currentUser.phone,
      jobPostingId: job.id,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      jobTitle: job.title,
      source: 'CareerTrack',
      status: 'submitted',
      appliedAt: new Date().toISOString().split('T')[0],
      notes: coverNote || 'Lamaran dikirim via sistem CareerTrack.',
      resumeTitle: chosenResume,
      statusHistories: [
        {
          id: Date.now(),
          applicationId: newId,
          changedBy: currentUser.name,
          statusFrom: '-',
          statusTo: 'submitted',
          reasonOrNote: 'Mengirimkan berkas lamaran kerja melalui CareerTrack.',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
      recruiterNotes: [],
    };

    setApplications((prev) => [newApp, ...prev]);

    // Increase applicant count on job
    setJobPostings((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    addToast('Lamaran Terkirim!', `Lamaran untuk posisi ${job.title} di ${job.companyName} berhasil dikirim.`);
    return true;
  };

  const toggleSaveJob = (jobId: number) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
      addToast('Dihapus dari Tersimpan', 'Lowongan dihapus dari daftar lowongan favorit Anda.');
    } else {
      setSavedJobIds((prev) => [...prev, jobId]);
      addToast('Disimpan ke Favorit', 'Lowongan berhasil ditambahkan ke daftar tersimpan.');
    }
  };

  const uploadDocument = (doc: {
    title: string;
    type: Document['type'];
    fileName: string;
    fileSizeKb: number;
    isPrimaryResume?: boolean;
  }) => {
    const newId = Date.now();
    const newDoc: Document = {
      id: newId,
      userId: currentUser.id,
      title: doc.title,
      type: doc.type,
      fileName: doc.fileName,
      fileSizeKb: doc.fileSizeKb,
      uploadedAt: new Date().toISOString().split('T')[0],
      isPrimaryResume: doc.isPrimaryResume ?? false,
    };

    setDocuments((prev) => {
      let updated = prev;
      if (newDoc.isPrimaryResume) {
        updated = updated.map((d) => ({ ...d, isPrimaryResume: false }));
      }
      return [newDoc, ...updated];
    });

    addToast('Dokumen Diunggah', `Berkas ${doc.fileName} berhasil disimpan secara aman.`);
  };

  const setPrimaryResume = (docId: number) => {
    setDocuments((prev) =>
      prev.map((d) => ({
        ...d,
        isPrimaryResume: d.id === docId,
      }))
    );
    addToast('CV Utama Diperbarui', 'CV ini sekarang menjadi berkas utama untuk melamar pekerjaan.');
  };

  const deleteDocument = (docId: number) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    addToast('Dokumen Dihapus', 'Berkas telah dihapus dari daftar dokumen.');
  };

  const scheduleInterview = (
    applicationId: number,
    interviewData: {
      scheduledAt: string;
      type: 'online' | 'offline';
      locationOrLink: string;
      instructions?: string;
    }
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== applicationId) return app;

        const interviewObj: Interview = {
          id: Date.now(),
          applicationId,
          companyName: app.companyName,
          jobTitle: app.jobTitle,
          scheduledAt: interviewData.scheduledAt,
          type: interviewData.type,
          locationOrLink: interviewData.locationOrLink,
          instructions: interviewData.instructions,
          status: 'scheduled',
        };

        const newHistory = {
          id: Date.now(),
          applicationId,
          changedBy: currentUser.name,
          statusFrom: app.status,
          statusTo: 'interview' as ApplicationStatus,
          reasonOrNote: `Jadwal wawancara diatur pada ${interviewData.scheduledAt} (${interviewData.type}).`,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        return {
          ...app,
          status: 'interview',
          interview: interviewObj,
          statusHistories: [newHistory, ...app.statusHistories],
        };
      })
    );

    addToast('Wawancara Dijadwalkan', `Undangan wawancara berhasil dikirimkan kepada kandidat.`);
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        switchRole,
        currentUser,
        users,
        companies,
        jobPostings,
        applications,
        documents,
        savedJobIds,
        categories,
        toasts,
        addToast,
        removeToast,
        resetToDefaultData,
        activeView,
        setActiveView,
        selectedJobId,
        setSelectedJobId,
        addExternalApplication,
        updateApplicationStatus,
        addRecruiterNote,
        createJobPosting,
        updateJobPosting,
        closeJobPosting,
        deleteJobPosting,
        moderateJob,
        toggleCompanyVerification,
        applyToJob,
        toggleSaveJob,
        uploadDocument,
        setPrimaryResume,
        deleteDocument,
        scheduleInterview,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
