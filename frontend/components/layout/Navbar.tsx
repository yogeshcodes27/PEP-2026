'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplets, Menu, X, Upload } from 'lucide-react';
import { api } from '@/lib/api';

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  useEffect(() => {
    api
      .checkHealth()
      .then((res) => {
        setBackendConnected(res.connected);
      })
      .catch(() => {
        setBackendConnected(false);
      });
  }, []);

  const navLinks = [
    { label: 'Analyze', href: '/analyze' },
    { label: 'History', href: '/history' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-content mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Research Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-opacity"
          >
            <div className="w-8 h-8 rounded-control bg-teal-800 text-white flex items-center justify-center shadow-xs">
              <Droplets className="w-4 h-4 text-teal-200" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight text-slate-900 group-hover:text-teal-800 transition-colors">
                  RobustFloat
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  CV Research
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-normal leading-tight">
                Cross-Domain Floating-Waste Detection
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`transition-colors py-1 relative ${
                    isActive
                      ? 'text-teal-800 font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-[-16px] left-0 right-0 h-0.5 bg-teal-700 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Primary Action Button & Status */}
          <div className="hidden sm:flex items-center gap-3">
            {backendConnected !== null && (
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono font-medium border ${
                  backendConnected
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
                title={backendConnected ? 'Connected to FastAPI backend' : 'Backend service is offline'}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    backendConnected ? 'bg-emerald-600' : 'bg-amber-500'
                  }`}
                />
                <span>{backendConnected ? 'Backend connected' : 'Backend unavailable'}</span>
              </div>
            )}

            <Link
              href="/analyze#upload"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-control bg-teal-800 text-white text-xs font-semibold hover:bg-teal-900 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Analyze image</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-control text-text-secondary hover:text-text-primary hover:bg-surface-strong"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-control text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-3">
              <Link
                href="/analyze#upload"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-control bg-charcoal text-white text-xs font-semibold"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload image</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
