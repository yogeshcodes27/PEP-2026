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
    <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-gutter-lg flex items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-lg">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-space-sm group">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center font-display font-bold text-lg shadow-sm">
              <span className="material-symbols-outlined text-[20px]">water_drop</span>
            </div>
            <span className="font-headline-md text-headline-md tracking-tight text-on-surface font-semibold">
              RobustFloat
            </span>
            <span className="font-label-mono-sm text-label-mono-sm px-space-xs py-0.5 rounded-lg bg-surface-container-high text-on-secondary-container uppercase tracking-wider">
              Research Prototype
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-space-xs">
            {navLinks.map((link) => {
              const isActive = link.pathMatch(pathname);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-space-md py-space-xs font-body-md transition-colors rounded-lg ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Status & Controls */}
        <div className="flex items-center gap-space-md">
          <div className="hidden sm:flex items-center gap-space-md px-space-md py-space-xs rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-space-xs">
              <span className="relative flex h-2 w-2">
                {isOnline && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isOnline ? 'bg-primary' : 'bg-secondary'
                  }`}
                ></span>
              </span>
              <span className="font-label-mono-sm text-label-mono-sm text-primary font-medium">
                {isOnline ? 'AI System Online' : 'Local Fallback'}
              </span>
            </div>
            <span className="font-label-mono-sm text-label-mono-sm text-outline-variant">|</span>
            <span className="font-label-mono-sm text-label-mono-sm text-secondary font-medium">
              FastAPI / Groq Ready
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container lg:hidden"
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
        <div className="lg:hidden border-t border-outline-variant/30 bg-surface px-gutter-lg py-space-md flex flex-col gap-space-xs shadow-lg">
          {navLinks.map((link) => {
            const isActive = link.pathMatch(pathname);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-space-md py-space-sm font-body-md rounded-lg ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
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
