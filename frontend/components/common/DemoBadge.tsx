import React from 'react';

export const DemoBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-surface-strong text-text-secondary border border-border select-none ${className}`}
      title="This data is loaded from the mock demonstration adapter"
    >
      Demo data
    </span>
  );
};
