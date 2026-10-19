"use client";

import React from "react";
import { X, ExternalLink, Mail, Github, Linkedin, Globe, ShieldCheck } from "lucide-react";

interface OwnerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OwnerProfileModal({ isOpen, onClose }: OwnerProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="owner-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-atlas-card border border-atlas-border shadow-2xl overflow-hidden transition-all text-atlas-text"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner Accent */}
        <div className="h-2 bg-gradient-to-r from-saffron via-white to-green-600 opacity-90" />

        {/* Header */}
        <div className="p-5 border-b border-atlas-border flex items-center justify-between bg-atlas-elevated/40">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#12345A] to-[#245B8F] text-white font-bold text-lg tracking-wider border border-[#80B8F0]/30 shadow-sm">
              MS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="owner-profile-title" className="text-lg font-bold text-atlas-text">
                  Mohd Shami
                </h3>
                <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                  Project Owner &amp; Lead
                </span>
              </div>
              <p className="text-xs text-atlas-muted mt-0.5">
                B.Tech Data Science
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close owner profile"
            className="p-1.5 rounded-lg text-atlas-muted hover:text-atlas-text hover:bg-atlas-elevated transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Platform Attribution Statement */}
          <div className="p-3.5 rounded-xl bg-atlas-elevated/50 border border-atlas-border space-y-2">
            <div className="flex items-center gap-2 font-semibold text-atlas-text">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Independent Hydro-Informatics Research Project</span>
            </div>
            <p className="text-atlas-muted leading-relaxed">
              JalSuraksha is an independent Pan-India groundwater intelligence and hydrological decision-support platform designed and implemented by Mohd Shami. Inspired by public-interest data portals, it integrates groundwater level telemetry, IMD rainfall observations, hydro-geological collaborative filtering, and hydrological document mining.
            </p>
            <p className="text-[11px] text-atlas-muted/90 italic">
              Notice: JalSuraksha is an independent academic and engineering project and is not an official Government of India portal.
            </p>
          </div>

          {/* Verified Contact & Profile Links */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-atlas-muted">
              Verified Profiles &amp; Contact Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="mailto:codexshami@gmail.com"
                className="flex items-center justify-between p-3 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-atlas-text transition group"
                aria-label="Email Mohd Shami at codexshami@gmail.com"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-saffron" />
                  <div>
                    <span className="block font-medium">Email</span>
                    <span className="block text-[10px] text-atlas-muted truncate max-w-[140px]">
                      codexshami@gmail.com
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-atlas-muted group-hover:text-atlas-text transition" />
              </a>

              <a
                href="https://mohdshamii.github.io"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-atlas-text transition group"
                aria-label="Open Mohd Shami's Portfolio"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-sky-500" />
                  <div>
                    <span className="block font-medium">Portfolio</span>
                    <span className="block text-[10px] text-atlas-muted truncate max-w-[140px]">
                      mohdshamii.github.io
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-atlas-muted group-hover:text-atlas-text transition" />
              </a>

              <a
                href="https://github.com/mohdshamii"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-atlas-text transition group"
                aria-label="Open Mohd Shami's GitHub profile"
              >
                <div className="flex items-center gap-2.5">
                  <Github className="w-4 h-4 text-atlas-text" />
                  <div>
                    <span className="block font-medium">GitHub</span>
                    <span className="block text-[10px] text-atlas-muted truncate max-w-[140px]">
                      github.com/mohdshamii
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-atlas-muted group-hover:text-atlas-text transition" />
              </a>

              <a
                href="https://linkedin.com/in/modshamii"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-atlas-text transition group"
                aria-label="Open Mohd Shami's LinkedIn profile"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-4 h-4 text-blue-500" />
                  <div>
                    <span className="block font-medium">LinkedIn</span>
                    <span className="block text-[10px] text-atlas-muted truncate max-w-[140px]">
                      linkedin.com/in/modshamii
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-atlas-muted group-hover:text-atlas-text transition" />
              </a>
            </div>
          </div>

          {/* Academic & Engineering Specialization */}
          <div className="p-3 rounded-lg bg-atlas-elevated/30 border border-atlas-border/80 flex items-center justify-between text-[11px]">
            <div>
              <span className="font-semibold text-atlas-text">Specialization:</span>
              <span className="text-atlas-muted ml-1.5">Machine Learning, Geospatial Data Science &amp; Full-Stack Systems</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-atlas-border bg-atlas-elevated/40 flex items-center justify-between">
          <span className="text-[10px] text-atlas-muted">
            JalSuraksha Platform • B.Tech Data Science Project
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-atlas-elevated hover:bg-atlas-border text-atlas-text text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
