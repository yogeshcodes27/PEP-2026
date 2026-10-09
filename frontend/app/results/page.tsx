'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ResultsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    api
      .listRuns()
      .then((runs) => {
        if (runs && runs.length > 0) {
          router.replace(`/result/${runs[0].runId}`);
        } else {
          router.replace('/analyze');
        }
      })
      .catch(() => {
        router.replace('/analyze');
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center font-body-md text-on-surface">
      <div className="flex items-center gap-space-sm p-space-md rounded-xl bg-surface-container-low shadow-sm">
        <span className="material-symbols-outlined text-primary text-[24px] animate-spin">sync</span>
        <span className="font-label-mono-sm text-label-mono-sm">Resolving latest inference run...</span>
      </div>
    </div>
  );
}
