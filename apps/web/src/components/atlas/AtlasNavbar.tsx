"use client";

import React, { useState } from "react";
import {
  Search,
  Moon,
  Sun,
  Layers,
  Trophy,
  Sparkles,
  Share2,
  Shield,
  Droplets,
  Bot,
  Table,
  ShieldAlert,
  Database,
  UserCheck,
  History,
} from "lucide-react";
import { INDIAN_STATES_UTS, getDistrictsForState } from "@/data/india-geography";

interface AtlasNavbarProps {
  currentYear: number;
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  onSelectYear: (year: number) => void;
  viewMode: "water" | "recharge";
  onToggleViewMode: (mode: "water" | "recharge") => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
  onOpenTrumpCards: () => void;
  onOpenStatCards: () => void;
  onOpenPoster: () => void;
  onOpenJalRakshak: (tab?: string) => void;
  selectedStateCode?: string;
  onSelectState?: (stateCode: string) => void;
  onOpenFreshness?: () => void;
  onOpenOwnerModal?: () => void;
  onOpenTimeline?: () => void;
}

export function AtlasNavbar({
  currentYear,
  selectedDistrictId,
  onSelectDistrict,
  onSelectYear,
  viewMode,
  onToggleViewMode,
  theme,
  onToggleTheme,
  onOpenTrumpCards,
  onOpenStatCards,
  onOpenPoster,
  onOpenJalRakshak,
  selectedStateCode = "UP",
  onSelectState,
  onOpenFreshness,
  onOpenOwnerModal,
  onOpenTimeline,
}: AtlasNavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const activeDistricts = getDistrictsForState(selectedStateCode);
  const currentState = INDIAN_STATES_UTS.find((s) => s.code === selectedStateCode) || INDIAN_STATES_UTS[0];

  const filteredDistricts = searchQuery.trim()
    ? activeDistricts
        .filter(
          (d) =>
            d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.division && d.division.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (d.modernWaterMetrics?.majorRiverBasin &&
              d.modernWaterMetrics.majorRiverBasin.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 8)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-atlas-border bg-atlas-canvas/95 backdrop-blur-md flex flex-col select-none">
      {/* Primary Top Bar */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-blue-700 to-navy text-white shadow-sm flex-shrink-0">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 text-sky-200" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-sm sm:text-base font-serif font-black tracking-wide text-atlas-text">
                JalSuraksha
              </h1>
              <span className="text-[10px] font-sans px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 line-clamp-1 max-w-[130px] sm:max-w-none">
                {selectedStateCode === "UP" ? "UP (75)" : `${currentState.name} (${currentState.districtCount})`}
              </span>
            </div>
            <p className="text-[11px] text-atlas-muted hidden lg:block">
              Intelligent Pan-India Groundwater & Water Resource Decision System
            </p>
          </div>
        </div>

        {/* Desktop State/UT Selector & Autocomplete Search Bar */}
        <div className="relative flex-1 max-w-lg hidden md:flex items-center gap-2">
          <select
            value={selectedStateCode}
            onChange={(e) => onSelectState?.(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-atlas-card border border-atlas-border text-xs text-atlas-text font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer shadow-sm max-w-[190px]"
            title="Select State or Union Territory (36 States & UTs)"
          >
            {INDIAN_STATES_UTS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.districtCount})
              </option>
            ))}
          </select>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-atlas-muted" />
            <input
              type="text"
              placeholder={`Search ${currentState.name} districts...`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpenDropdown(true);
              }}
              onFocus={() => setIsOpenDropdown(true)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-atlas-card border border-atlas-border text-xs text-atlas-text placeholder:text-atlas-faint focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          {isOpenDropdown && filteredDistricts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-atlas-card border border-atlas-border rounded-lg shadow-cardDark overflow-hidden z-50">
              {filteredDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onSelectDistrict(d.id);
                    setSearchQuery("");
                    setIsOpenDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-atlas-elevated text-atlas-text border-b border-atlas-border/50 last:border-0"
                >
                  <div>
                    <span className="font-semibold text-emerald-400">{d.name}</span>
                    <span className="text-atlas-muted ml-2 text-[11px]">
                      ({d.division || d.region || currentState.name})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-saffron">
                    Stress: {d.modernWaterMetrics?.waterStressScore ?? 65}/100
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Controls & Quick Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Mode Toggle: Water Stress Heatmap vs Recharge Suitability */}
          <div className="hidden sm:flex items-center p-0.5 rounded-lg bg-atlas-card border border-atlas-border text-xs">
            <button
              onClick={() => onToggleViewMode("water")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "water"
                  ? "bg-rose-600 text-white shadow font-semibold"
                  : "text-atlas-muted hover:text-atlas-text"
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Stress Heatmap</span>
            </button>
            <button
              onClick={() => onToggleViewMode("recharge")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                viewMode === "recharge"
                  ? "bg-emerald-600 text-white shadow font-semibold"
                  : "text-atlas-muted hover:text-atlas-text"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Recharge Suitability</span>
            </button>
          </div>

          {/* Unified Timeline & AI Forecast Single Icon Button */}
          <button
            onClick={onOpenTimeline}
            title={`Timeline & AI Forecast (${currentYear}): Historical (2000-2024), Live (2026), AI Forecast (2028-2035)`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-semibold text-atlas-text transition shadow-sm group"
          >
            <History className="h-3.5 w-3.5 text-saffron group-hover:rotate-[-45deg] transition-transform duration-300" />
            <span className="font-mono text-saffron font-bold text-xs">{currentYear}</span>
            <span
              className={`text-[9px] px-1 py-0.2 rounded uppercase font-bold border ${
                currentYear < 2026
                  ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                  : currentYear === 2026
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : "bg-purple-500/15 text-purple-400 border-purple-500/30"
              }`}
            >
              {currentYear < 2026 ? "Hist" : currentYear === 2026 ? "Live" : "AI"}
            </span>
          </button>

          {/* JalRakshak Suite Action Button */}
          <button
            onClick={() => onOpenJalRakshak("recharge")}
            title="Open Complete JalRakshak AI Decision-Support Suite"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow transition"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Decision Suite</span>
          </button>

          {/* Pan-India Open Data Telemetry Quick Launcher */}
          <button
            onClick={onOpenFreshness}
            title="Pan-India Open Data Telemetry & 8 Live Ingestion Sources"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-semibold text-atlas-text transition"
          >
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Sources (8)</span>
          </button>

          {/* AI Copilot Quick Launcher */}
          <button
            onClick={() => onOpenJalRakshak("copilot")}
            title="Ask JalRakshak AI Copilot"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-semibold text-atlas-text transition"
          >
            <Bot className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="hidden xl:inline">AI Copilot</span>
          </button>

          {/* 780-District Matrix Quick Launcher */}
          <button
            onClick={() => onOpenJalRakshak("matrix")}
            title="Open Pan-India 780-District Hydrological Matrix & CSV Export"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-semibold text-atlas-text transition"
          >
            <Table className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            <span className="hidden xl:inline">District Matrix</span>
          </button>

          {/* Citizen Grievance Quick Launcher */}
          <button
            onClick={() => onOpenJalRakshak("grievance")}
            title="Citizen Water Grievance & Borewell Failure Portal"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-semibold text-atlas-text transition"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
            <span className="hidden xl:inline">Grievances</span>
          </button>

          {/* Pan-India District Duel Arena */}
          <button
            onClick={onOpenTrumpCards}
            title="Compare 2 Districts on Water & Borewell Metrics"
            className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-medium text-atlas-text transition"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
            <span className="hidden 2xl:inline">Duel</span>
          </button>

          <button
            onClick={onOpenStatCards}
            title="30-50 Auto-Computed Groundwater Facts"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-medium text-atlas-text transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            <span className="hidden 2xl:inline">Facts</span>
          </button>

          <button
            onClick={onOpenPoster}
            title="Export Water Resource Dossier Poster (PNG)"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-saffron/15 hover:bg-saffron/25 border border-saffron/40 text-xs font-medium text-saffron transition"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Project Owner Attribution */}
          {onOpenOwnerModal && (
            <button
              onClick={onOpenOwnerModal}
              title="Project Owner Attribution & Research Profile (Mohd Shami)"
              aria-label="View Project Owner details"
              className="flex items-center gap-1.5 px-2 py-1.5 sm:px-2.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-xs font-semibold text-atlas-text transition"
            >
              <UserCheck className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
              <span className="hidden xl:inline">Mohd Shami</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="p-1.5 rounded-lg bg-atlas-card hover:bg-atlas-elevated border border-atlas-border text-atlas-muted hover:text-atlas-text transition"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile State and District Quick Bar (< md) */}
      <div className="flex md:hidden items-center gap-2 px-3 py-1.5 bg-atlas-elevated/70 border-t border-atlas-border w-full">
        <select
          value={selectedStateCode}
          onChange={(e) => onSelectState?.(e.target.value)}
          className="flex-1 py-1 px-2 rounded-lg bg-atlas-card border border-atlas-border text-xs text-atlas-text font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400"
          title="Select State or Union Territory"
        >
          {INDIAN_STATES_UTS.map((s) => (
            <option key={s.code} value={s.code}>
              {s.name} ({s.districtCount})
            </option>
          ))}
        </select>

        <select
          value={selectedDistrictId}
          onChange={(e) => onSelectDistrict(e.target.value)}
          className="flex-1 py-1 px-2 rounded-lg bg-atlas-card border border-atlas-border text-xs text-atlas-text font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400"
          title="Select District"
        >
          {activeDistricts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}
