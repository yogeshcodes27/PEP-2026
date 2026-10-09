'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [latestRunId, setLatestRunId] = useState<string | null>(null);

  useEffect(() => {
    // Check backend health
    api
      .checkHealth()
      .then((res) => setIsOnline(res.connected !== false))
      .catch(() => setIsOnline(false));

    // Check for recent runs
    api
      .listRuns()
      .then((runs) => {
        if (runs && runs.length > 0) {
          setLatestRunId(runs[0].runId);
        }
      })
      .catch(() => {});
  }, []);

  const resultsHref = latestRunId ? `/result/${latestRunId}` : '/results';

  const navLinks = [
    { label: 'Home', href: '/', pathMatch: (p: string) => p === '/' },
    { label: 'Analyze', href: '/analyze', pathMatch: (p: string) => p.startsWith('/analyze') },
    { label: 'Results', href: resultsHref, pathMatch: (p: string) => p.startsWith('/result') },
    { label: 'System', href: '/system', pathMatch: (p: string) => p.startsWith('/system') || p.startsWith('/about') },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
      <div className="h-16 w-full px-gutter-lg flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-lg">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[19px]">water_drop</span>
            </div>
            <span className="text-lg tracking-tight text-slate-900 font-bold">
              RobustFloat
            </span>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-full">
              Research Prototype
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = link.pathMatch(pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm transition-all rounded-lg ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/70 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1 rounded-full bg-slate-50/90 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOnline ? 'bg-primary' : 'bg-slate-400'
                  }`}
                ></span>
              </span>
              <span className="text-teal-800 font-medium">
                {isOnline ? 'AI System Online' : 'Local Fallback'}
              </span>
            </div>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-normal">
              FastAPI / Groq Ready
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/80 text-slate-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 bg-white px-gutter-lg py-space-md flex flex-col gap-1 shadow-md">
          {navLinks.map((link) => {
            const isActive = link.pathMatch(pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200/70'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
