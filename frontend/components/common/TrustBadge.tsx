import React from 'react';
import { ImageCheckStatus } from '@/types';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

interface TrustBadgeProps {
  status?: ImageCheckStatus;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ status = 'similar' }) => {
  if (status === 'unlike') {
    return (
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
          <span>Unlike evaluation images</span>
        </span>
        <p className="text-xs text-amber-900 leading-relaxed">
          This water scene differs markedly from the benchmark datasets. Detections may be less reliable.
        </p>
      </div>
    );
  }

  if (status === 'borderline') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
        <HelpCircle className="w-3.5 h-3.5 shrink-0 text-slate-500" />
        <span>Borderline</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
      <span>Similar to evaluation images</span>
    </span>
  );
};
