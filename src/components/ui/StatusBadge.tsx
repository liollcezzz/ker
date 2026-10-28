import React from 'react';
import { ApplicationStatus, JobPostingStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | JobPostingStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      case 'submitted':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200',
          label: 'Submitted',
          dot: 'bg-blue-600',
        };
      case 'under_review':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          label: 'Under Review',
          dot: 'bg-amber-500',
        };
      case 'interview':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-700',
          border: 'border-purple-200',
          label: 'Interview',
          dot: 'bg-purple-600',
        };
      case 'offered':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          label: 'Offered',
          dot: 'bg-emerald-600',
        };
      case 'rejected':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-700',
          border: 'border-rose-200',
          label: 'Rejected',
          dot: 'bg-rose-500',
        };
      case 'withdrawn':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          label: 'Withdrawn',
          dot: 'bg-slate-400',
        };

      // Job Posting Statuses
      case 'published':
        return {
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          label: 'Published',
          dot: 'bg-emerald-600',
        };
      case 'pending_review':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          label: 'Pending Review',
          dot: 'bg-amber-500',
        };
      case 'draft':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          label: 'Draft',
          dot: 'bg-slate-400',
        };
      case 'closed':
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-300',
          label: 'Closed',
          dot: 'bg-slate-400',
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-700',
          border: 'border-slate-200',
          label: status,
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getStyle();
  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bg} ${config.text} ${config.border} ${paddingClass} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
      {config.label}
    </span>
  );
};
