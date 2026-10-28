export type UserRole = 'job_seeker' | 'recruiter' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  headline?: string;
  skills?: string[];
  bio?: string;
  location?: string;
  university?: string;
  graduationYear?: number;
}

export interface Company {
  id: number;
  userId: number;
  name: string;
  slug: string;
  logoUrl?: string;
  industry: string;
  website: string;
  location: string;
  description: string;
  isVerified: boolean;
  employeeRange: string;
}

export interface JobCategory {
  id: number;
  name: string;
  slug: string;
  iconName: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';

export type JobPostingStatus = 'draft' | 'pending_review' | 'published' | 'closed' | 'rejected';

export interface JobPosting {
  id: number;
  companyId: number;
  companyName: string;
  companyLogo?: string;
  companyLocation: string;
  isCompanyVerified: boolean;
  jobCategoryId: number;
  categoryName: string;
  title: string;
  slug: string;
  type: JobType;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  closingDate: string;
  status: JobPostingStatus;
  applicantsCount: number;
  createdAt: string;
  rejectionReason?: string;
}

export type ApplicationSource =
  | 'CareerTrack'
  | 'Website Perusahaan'
  | 'LinkedIn'
  | 'Job Portal Lain'
  | 'Email'
  | 'Referensi'
  | 'Lainnya';

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'interview'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export interface ApplicationStatusHistory {
  id: number;
  applicationId: number;
  changedBy: string;
  statusFrom: string;
  statusTo: ApplicationStatus;
  reasonOrNote?: string;
  createdAt: string;
}

export interface Interview {
  id: number;
  applicationId: number;
  companyName: string;
  jobTitle: string;
  scheduledAt: string;
  type: 'online' | 'offline';
  locationOrLink: string;
  instructions?: string;
  status: 'scheduled' | 'rescheduled' | 'completed' | 'cancelled';
}

export interface RecruiterNote {
  id: number;
  applicationId: number;
  recruiterId: number;
  recruiterName: string;
  note: string;
  createdAt: string;
}

export interface Application {
  id: number;
  jobSeekerId: number;
  jobSeekerName: string;
  jobSeekerEmail: string;
  jobSeekerPhone?: string;
  jobPostingId: number | null; // null if external
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  source: ApplicationSource;
  externalUrl?: string;
  status: ApplicationStatus;
  appliedAt: string;
  notes?: string;
  statusHistories: ApplicationStatusHistory[];
  interview?: Interview | null;
  recruiterNotes?: RecruiterNote[];
  resumeTitle?: string;
}

export interface Document {
  id: number;
  userId: number;
  title: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate';
  fileName: string;
  fileSizeKb: number;
  uploadedAt: string;
  isPrimaryResume: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'info';
}
