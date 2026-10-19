"use client";

import React, { useState, useMemo } from "react";
import { UP_75_WATER_DISTRICTS, DistrictWaterEntity } from "@/data/up-75-districts";
import {
  Search,
  Filter,
  ArrowUpDown,
  Droplets,
  Layers,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Drill,
  MapPin,
  Maximize2,
} from "lucide-react";

interface AtlasMapProps {
  currentYear: number;
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
  viewMode: "water" | "recharge";
  showRivers: boolean;
  showHotspots: boolean;
  showIoTSensors: boolean;
  isColorBlindMode: boolean;
  selectedStateCode?: string;
  districts?: DistrictWaterEntity[];
  stateName?: string;
}

export function AtlasMap({
  currentYear,
  selectedDistrictId,
  onSelectDistrict,
  viewMode,
  showRivers,
  showHotspots,
  showIoTSensors,
  isColorBlindMode,
  selectedStateCode = "UP",
  districts,
  stateName,
}: AtlasMapProps) {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictWaterEntity | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [upDisplayMode, setUpDisplayMode] = useState<"map" | "grid">("map");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"stress" | "depth" | "recharge" | "name" | "borewell">("stress");
  const [searchQuery, setSearchQuery] = useState("");

  const displayDistricts = districts && districts.length > 0 ? districts : UP_75_WATER_DISTRICTS;

  // Get temporal metrics for a district at currentYear
  const getTemporalMetrics = (d: DistrictWaterEntity) => {
    if (!d.temporalTrajectory || d.temporalTrajectory.length === 0) {
      return {
        year: currentYear,
        depth_m: d.modernWaterMetrics?.groundwaterDepthM ?? 12.0,
        stress_score: d.modernWaterMetrics?.waterStressScore ?? 65,
        category: (d.modernWaterMetrics?.cgwbCategory ?? "Critical") as any,
        phase: "Observation",
      };
    }
    const pt = d.temporalTrajectory.find((t) => t.year === currentYear);
    if (pt) return pt;
    return d.temporalTrajectory.slice().reverse().find((t) => currentYear >= t.year) || d.temporalTrajectory[0];
  };

  // Compute fill color based on view mode and current year
  const getDistrictFill = (d: DistrictWaterEntity): string => {
    if (viewMode === "recharge") {
      const suit = d.rechargeSuitabilityScore ?? 75;
      if (suit >= 88) return isColorBlindMode ? "#009e73" : "#06b6d4"; // High / Cyan
      if (suit >= 75) return isColorBlindMode ? "#56b4e9" : "#3b82f6"; // Good / Blue
      if (suit >= 60) return isColorBlindMode ? "#f0e442" : "#f59e0b"; // Moderate / Amber
      return isColorBlindMode ? "#708090" : "#64748b"; // Low / Slate
    }

    // Water Stress Mode
    const t = getTemporalMetrics(d);
    const stress = t.stress_score;
    if (stress >= 75) return isColorBlindMode ? "#d55e00" : "#ef4444"; // Over-Exploited / Red
    if (stress >= 55) return isColorBlindMode ? "#e69f00" : "#f97316"; // Critical / Orange
    if (stress >= 35) return isColorBlindMode ? "#f0e442" : "#f59e0b"; // Semi-Critical / Amber
    return isColorBlindMode ? "#009e73" : "#10b981"; // Safe / Emerald
  };

  // Known IoT active monitoring districts for UP
  const iotDistricts = ["agra", "ghaziabad", "meerut", "jhansi", "lucknow"];

  // Filtered and sorted districts for grid view
  const processedDistricts = useMemo(() => {
    return displayDistricts
      .filter((d) => {
        if (filterCategory !== "all") {
          const cat = (d.modernWaterMetrics?.cgwbCategory || "").toLowerCase();
          if (filterCategory === "over-exploited" && !cat.includes("over")) return false;
          if (filterCategory === "critical" && (!cat.includes("critical") || cat.includes("semi"))) return false;
          if (filterCategory === "semi-critical" && !cat.includes("semi")) return false;
          if (filterCategory === "safe" && !cat.includes("safe")) return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            d.name.toLowerCase().includes(q) ||
            (d.division && d.division.toLowerCase().includes(q)) ||
            (d.region && d.region.toLowerCase().includes(q))
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "stress") {
          return (b.modernWaterMetrics?.waterStressScore ?? 0) - (a.modernWaterMetrics?.waterStressScore ?? 0);
        }
        if (sortBy === "depth") {
          return (b.modernWaterMetrics?.groundwaterDepthM ?? 0) - (a.modernWaterMetrics?.groundwaterDepthM ?? 0);
        }
        if (sortBy === "recharge") {
          return (b.rechargeSuitabilityScore ?? 0) - (a.rechargeSuitabilityScore ?? 0);
        }
        if (sortBy === "borewell") {
          return (b.borewellData?.failureRatePct ?? 0) - (a.borewellData?.failureRatePct ?? 0);
        }
        return a.name.localeCompare(b.name);
      });
  }, [displayDistricts, filterCategory, searchQuery, sortBy]);

  // Aggregate stats for current state
  const stateStats = useMemo(() => {
    if (!displayDistricts.length) return { avgDepth: 0, avgExtraction: 0, criticalCount: 0 };
    const totalDepth = displayDistricts.reduce((acc, d) => acc + (d.modernWaterMetrics?.groundwaterDepthM ?? 12), 0);
    const totalExtr = displayDistricts.reduce((acc, d) => acc + (d.modernWaterMetrics?.cgwbStageExtractionPct ?? 70), 0);
    const criticalCount = displayDistricts.filter((d) =>
      ["Critical", "Over-Exploited"].includes(d.modernWaterMetrics?.cgwbCategory ?? "")
    ).length;
    return {
      avgDepth: (totalDepth / displayDistricts.length).toFixed(1),
      avgExtraction: Math.round(totalExtr / displayDistricts.length),
      criticalCount,
    };
  }, [displayDistricts]);

  const isUPMap = selectedStateCode === "UP" && upDisplayMode === "map";

  return (
    <div
      className="relative w-full h-full min-h-[540px] flex flex-col bg-atlas-canvas overflow-hidden select-none"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Background Spatial Grid Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Top Map Context & Mode Header */}
      <div className="z-20 px-3 sm:px-4 py-2 border-b border-atlas-border bg-atlas-card/90 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs text-atlas-text">
            {stateName || (selectedStateCode === "UP" ? "Uttar Pradesh" : selectedStateCode)}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-atlas-elevated text-atlas-muted border border-atlas-border font-mono">
            {displayDistricts.length} Districts
          </span>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-atlas-muted ml-2">
            <span>Avg Depth: <strong className="text-sky-400">{stateStats.avgDepth} mbgl</strong></span>
            <span>•</span>
            <span>Avg Extraction: <strong className="text-amber-400">{stateStats.avgExtraction}%</strong></span>
            <span>•</span>
            <span>Critical/OE: <strong className="text-rose-400">{stateStats.criticalCount}</strong></span>
          </div>
        </div>

        {/* View Controls: For UP allow switching Map vs Grid */}
        <div className="flex items-center gap-2 text-xs">
          {selectedStateCode === "UP" ? (
            <div className="flex items-center p-0.5 rounded-lg bg-atlas-elevated border border-atlas-border">
              <button
                onClick={() => setUpDisplayMode("map")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  upDisplayMode === "map" ? "bg-emerald-600 text-white shadow font-semibold" : "text-atlas-muted hover:text-atlas-text"
                }`}
              >
                Vector Map
              </button>
              <button
                onClick={() => setUpDisplayMode("grid")}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  upDisplayMode === "grid" ? "bg-emerald-600 text-white shadow font-semibold" : "text-atlas-muted hover:text-atlas-text"
                }`}
              >
                District Grid
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-atlas-muted font-mono">
              Pan-India Live District Intelligence
            </span>
          )}
        </div>
      </div>

      {/* Main View Area: Either UP SVG Map OR Pan-India District Intelligence Grid */}
      {isUPMap ? (
        <div className="relative flex-1 flex items-center justify-center p-2 overflow-hidden">
          <svg
            viewBox="0 0 940 760"
            className="w-full h-full max-h-[78vh] drop-shadow-xl z-10 transition-all duration-300"
          >
            <defs>
              <filter id="districtGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#f59e0b" floodOpacity="0.8" />
              </filter>
              <filter id="hoverGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ffffff" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Major River Basins for UP */}
            {showRivers && (
              <g className="rivers-overlay opacity-75 pointer-events-none">
                <path d="M 120 70 Q 150 250 170 370 T 300 480 T 560 590" fill="none" stroke="#38bdf8" strokeWidth="3.2" strokeLinecap="round" />
                <path d="M 190 90 Q 280 230 380 390 T 570 590 T 730 580 T 890 530" fill="none" stroke="#0284c7" strokeWidth="4" strokeLinecap="round" />
                <path d="M 370 170 Q 420 300 490 420 T 690 550" fill="none" stroke="#0ea5e9" strokeWidth="2.2" strokeDasharray="4 2" />
                <path d="M 550 190 Q 640 320 750 430 T 880 520" fill="none" stroke="#0369a1" strokeWidth="3.5" />
                <path d="M 230 670 Q 250 580 330 530 T 430 510" fill="none" stroke="#38bdf8" strokeWidth="2.4" />
                <path d="M 450 630 Q 460 580 470 550" fill="none" stroke="#38bdf8" strokeWidth="2" />
                <path d="M 680 670 Q 750 660 840 680" fill="none" stroke="#0284c7" strokeWidth="2.8" />
              </g>
            )}

            {/* 75 Districts Polygons for UP */}
            <g className="districts-layer">
              {UP_75_WATER_DISTRICTS.map((d) => {
                const isSelected = d.id === selectedDistrictId;
                const isHovered = hoveredDistrict?.id === d.id;
                const fillColor = getDistrictFill(d);

                return (
                  <g key={d.id} className="transition-all duration-200">
                    <path
                      d={d.svgPath}
                      fill={fillColor}
                      className={`district-shape ${isSelected ? "selected" : ""}`}
                      filter={isSelected ? "url(#districtGlow)" : isHovered ? "url(#hoverGlow)" : undefined}
                      onClick={() => onSelectDistrict(d.id)}
                      onMouseEnter={() => setHoveredDistrict(d)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                    />
                    <text
                      x={d.projected[0]}
                      y={d.projected[1] + 3}
                      textAnchor="middle"
                      className={`pointer-events-none text-[8.5px] font-sans font-semibold tracking-tight transition-opacity ${
                        isSelected
                          ? "fill-slate-900 font-extrabold text-[10px]"
                          : "fill-white/85"
                      }`}
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Critical Over-Extraction Hotspot Markers */}
            {showHotspots &&
              UP_75_WATER_DISTRICTS.filter((d) => d.modernWaterMetrics.cgwbStageExtractionPct > 100).map(
                (d) => (
                  <g
                    key={`hotspot-${d.id}`}
                    className="cursor-pointer"
                    onClick={() => onSelectDistrict(d.id)}
                  >
                    <circle
                      cx={d.projected[0]}
                      cy={d.projected[1] - 13}
                      r="7.5"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      className="animate-pulse"
                    />
                    <text
                      x={d.projected[0]}
                      y={d.projected[1] - 10}
                      textAnchor="middle"
                      fontSize="8"
                      fill="#ffffff"
                      fontWeight="bold"
                    >
                      !
                    </text>
                  </g>
                )
              )}

            {/* IoT Active Edge Node Markers */}
            {showIoTSensors &&
              UP_75_WATER_DISTRICTS.filter((d) => iotDistricts.includes(d.id)).map((d) => (
                <g
                  key={`iot-${d.id}`}
                  className="cursor-pointer"
                  onClick={() => onSelectDistrict(d.id)}
                >
                  <circle
                    cx={d.projected[0] + 12}
                    cy={d.projected[1] - 12}
                    r="6"
                    fill="#10b981"
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                  <circle
                    cx={d.projected[0] + 10}
                    cy={d.projected[1] - 8}
                    r="2.5"
                    fill="#38bdf8"
                  />
                </g>
              ))}
          </svg>
        </div>
      ) : (
        /* Pan-India District Intelligence Grid (Handles 2 to 75+ Districts dynamically without clipping) */
        <div className="flex-1 flex flex-col overflow-hidden p-3 sm:p-4">
          {/* Controls Bar: Search, Category Filters, Sort */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-atlas-border">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {[
                { id: "all", label: `All (${displayDistricts.length})` },
                { id: "over-exploited", label: "Over-Exploited" },
                { id: "critical", label: "Critical" },
                { id: "semi-critical", label: "Semi-Critical" },
                { id: "safe", label: "Safe" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilterCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    filterCategory === c.id
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-atlas-card hover:bg-atlas-elevated text-atlas-muted border border-atlas-border"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-atlas-muted" />
                <input
                  type="text"
                  placeholder="Filter district..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1 text-xs rounded-lg bg-atlas-card border border-atlas-border text-atlas-text placeholder:text-atlas-faint focus:outline-none focus:ring-1 focus:ring-emerald-400 w-36 sm:w-44"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1 px-2.5 text-xs rounded-lg bg-atlas-card border border-atlas-border text-atlas-text font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="stress">Sort: Stress Score</option>
                <option value="depth">Sort: Water Depth</option>
                <option value="recharge">Sort: Recharge</option>
                <option value="borewell">Sort: Borewell Risk</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* District Grid Container with Smooth Scroll */}
          <div className="flex-1 overflow-y-auto mt-3 pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {processedDistricts.map((d) => {
                const isSelected = d.id === selectedDistrictId;
                const fillColor = getDistrictFill(d);
                const stress = d.modernWaterMetrics?.waterStressScore ?? 65;
                const depth = d.modernWaterMetrics?.groundwaterDepthM ?? 14.5;
                const stage = d.modernWaterMetrics?.cgwbStageExtractionPct ?? 75;
                const wqi = d.waterQuality?.wqi ?? 72;
                const failureRate = d.borewellData?.failureRatePct ?? 8.5;
                const alertContaminant =
                  (d.waterQuality?.arsenicMgL ?? 0) > 0.01
                    ? `Arsenic (${d.waterQuality?.arsenicMgL} mg/L)`
                    : (d.waterQuality?.fluorideMgL ?? 0) > 1.5
                    ? `Fluoride (${d.waterQuality?.fluorideMgL} mg/L)`
                    : (d.waterQuality?.nitrateMgL ?? 0) > 45
                    ? `Nitrate (${d.waterQuality?.nitrateMgL} mg/L)`
                    : null;

                return (
                  <div
                    key={d.id}
                    onClick={() => onSelectDistrict(d.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between relative group ${
                      isSelected
                        ? "bg-atlas-elevated border-emerald-500 shadow-glow"
                        : "bg-atlas-card hover:bg-atlas-elevated/70 border-atlas-border hover:border-atlas-muted/50"
                    }`}
                  >
                    {/* Left Accent Bar */}
                    <div
                      className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r"
                      style={{ backgroundColor: fillColor }}
                    />

                    <div>
                      {/* Card Header: District Name & CGWB Category */}
                      <div className="flex items-start justify-between gap-1.5 mb-1 pl-1.5">
                        <div>
                          <h4 className="font-serif font-bold text-sm text-atlas-text group-hover:text-emerald-400 transition-colors">
                            {d.name}
                          </h4>
                          <span className="text-[10px] text-atlas-muted">
                            {d.division || d.region || "District"}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            stress >= 75
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              : stress >= 55
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                              : stress >= 35
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          }`}
                        >
                          {d.modernWaterMetrics?.cgwbCategory || "Assessed"}
                        </span>
                      </div>

                      {/* Stress Score Bar */}
                      <div className="pl-1.5 mt-2 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-atlas-muted">Water Stress ({currentYear}):</span>
                          <span className="font-mono font-bold text-saffron">{stress}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-700/60 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${stress}%`,
                              backgroundColor: fillColor,
                            }}
                          />
                        </div>
                      </div>

                      {/* Depth & Stage */}
                      <div className="pl-1.5 grid grid-cols-2 gap-2 mt-2.5 text-[11px]">
                        <div>
                          <span className="text-atlas-muted block text-[10px]">Water Table</span>
                          <span className="font-mono font-bold text-sky-400">{depth} mbgl</span>
                        </div>
                        <div>
                          <span className="text-atlas-muted block text-[10px]">Extraction</span>
                          <span className="font-mono font-bold text-amber-400">{stage}%</span>
                        </div>
                      </div>

                      {/* Dual Water Metrics: Water Quality & Borewell */}
                      <div className="pl-1.5 pt-2 mt-2 border-t border-atlas-border/60 flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-sky-400" />
                          <span>WQI: <strong className="text-atlas-text">{wqi}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Drill className="w-3 h-3 text-amber-400" />
                          <span>Borewell Fail: <strong className="text-amber-400">{failureRate}%</strong></span>
                        </div>
                      </div>

                      {/* Contaminant Warning if present */}
                      {alertContaminant && (
                        <div className="pl-1.5 mt-1.5">
                          <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold">
                            Alert: {alertContaminant}
                          </span>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <div className="mt-2 text-center text-[10px] font-bold text-emerald-400 border-t border-emerald-500/30 pt-1">
                        ACTIVE IN DOSSIER & ANALYTICS
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hover Floating Tooltip for UP Map */}
      {isUPMap && hoveredDistrict && (
        <div
          className="absolute z-50 pointer-events-none p-3 rounded-xl bg-atlas-card/95 border border-atlas-border shadow-2xl backdrop-blur-md max-w-xs animate-fade-in text-atlas-text"
          style={{
            left: Math.min(mousePos.x + 16, 700),
            top: Math.max(mousePos.y - 80, 20),
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-atlas-border pb-1 mb-1.5">
            <span className="font-serif font-bold text-sm text-emerald-400">
              {hoveredDistrict.name}
            </span>
            <span className="text-[10px] text-atlas-muted px-1.5 py-0.5 rounded bg-atlas-elevated">
              {hoveredDistrict.division}
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-atlas-muted">Water Stress ({currentYear}):</span>
              <span className="font-mono font-bold text-saffron">
                {getTemporalMetrics(hoveredDistrict).stress_score} / 100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-atlas-muted">Water Table Depth:</span>
              <span className="font-mono text-atlas-text font-bold">
                {getTemporalMetrics(hoveredDistrict).depth_m} m bgl
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-atlas-muted">Recharge Suitability:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {hoveredDistrict.rechargeSuitabilityScore} / 100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-atlas-muted">CGWB Stage:</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  (hoveredDistrict.modernWaterMetrics?.cgwbStageExtractionPct ?? 75) > 100
                    ? "bg-red-500/20 text-red-400"
                    : (hoveredDistrict.modernWaterMetrics?.cgwbStageExtractionPct ?? 75) > 70
                    ? "bg-amber-500/20 text-amber-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {hoveredDistrict.modernWaterMetrics?.cgwbStageExtractionPct ?? 75}% (
                {hoveredDistrict.modernWaterMetrics?.cgwbCategory ?? "Critical"})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
