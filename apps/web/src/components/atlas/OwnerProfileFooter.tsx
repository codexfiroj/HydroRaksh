"use client";

import React from "react";
import { Mail, Globe, Github, Linkedin, ExternalLink } from "lucide-react";

interface OwnerProfileFooterProps {
  onOpenOwnerModal?: () => void;
}

export function OwnerProfileFooter({ onOpenOwnerModal }: OwnerProfileFooterProps) {
  return (
    <footer className="w-full bg-atlas-elevated border-t border-atlas-border px-4 py-2.5 text-xs text-atlas-muted select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Project & Owner Identity */}
        <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
          <span className="font-semibold text-atlas-text">JalSuraksha</span>
          <span className="text-atlas-border">•</span>
          <span>Pan-India Groundwater Intelligence Platform</span>
          <span className="text-atlas-border">•</span>
          <span>
            Developed by{" "}
            <button
              onClick={onOpenOwnerModal}
              className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Mohd Shami
            </button>{" "}
            (B.Tech Data Science)
          </span>
        </div>

        {/* Right: Verified Links */}
        <div className="flex items-center gap-3">
          <a
            href="mailto:codexshami@gmail.com"
            title="Email Mohd Shami"
            className="flex items-center gap-1 hover:text-atlas-text transition"
            aria-label="Email Mohd Shami"
          >
            <Mail className="w-3.5 h-3.5 text-saffron" />
            <span className="hidden sm:inline">codexshami@gmail.com</span>
          </a>

          <a
            href="https://mohdshamii.github.io"
            target="_blank"
            rel="noopener noreferrer"
            title="Portfolio"
            className="flex items-center gap-1 hover:text-atlas-text transition"
            aria-label="Mohd Shami Portfolio"
          >
            <Globe className="w-3.5 h-3.5 text-sky-500" />
            <span className="hidden sm:inline">Portfolio</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://github.com/mohdshamii"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="flex items-center gap-1 hover:text-atlas-text transition"
            aria-label="Mohd Shami GitHub"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://linkedin.com/in/modshamii"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="flex items-center gap-1 hover:text-atlas-text transition"
            aria-label="Mohd Shami LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">LinkedIn</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </div>
    </footer>
  );
}
