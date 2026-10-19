"use client";

import React, { useState } from "react";
import { X, Database, Activity, CheckCircle2, Globe2, Clock, ShieldCheck, Layers, RefreshCw } from "lucide-react";
import { PAN_INDIA_DATA_SOURCES, INDIAN_STATES_UTS } from "@/data/india-geography";

interface DataFreshnessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataFreshnessModal({ isOpen, onClose }: DataFreshnessModalProps) {
  const [activeTab, setActiveTab] = useState<"sources" | "coverage">("sources");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  if (!isOpen) return null;

  const categories = ["all", "Groundwater", "Meteorology", "Surface Water", "Soil", "Agriculture"];

  const filteredSources = filterCategory === "all"
    ? PAN_INDIA_DATA_SOURCES
    : PAN_INDIA_DATA_SOURCES.filter((s) => s.category.toLowerCase().includes(filterCategory.toLowerCase()));

  const totalRecords = PAN_INDIA_DATA_SOURCES.reduce((acc, s) => acc + s.recordsCount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-atlas-card border border-atlas-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-atlas-text">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-atlas-border flex items-center justify-between bg-atlas-elevated/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-serif font-bold text-atlas-text">
                  Pan-India Open Data Telemetry & Provenance
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  8 Connectors Live
                </span>
              </div>
              <p className="text-xs text-atlas-muted">
                Authoritative Government & Open Scientific Ingestion Pipelines • GODL / CC-BY-4.0 / ODbL Compliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-atlas-muted hover:text-atlas-text hover:bg-atlas-elevated transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Global Summary Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 sm:p-4 bg-atlas-elevated/20 border-b border-atlas-border text-center">
          <div className="p-2.5 rounded-xl bg-atlas-card border border-atlas-border/60">
            <div className="text-[10px] uppercase font-bold text-atlas-muted tracking-wider">States & UTs</div>
            <div className="text-lg font-mono font-bold text-emerald-400">36 / 36</div>
            <div className="text-[10px] text-atlas-faint">28 States • 8 UTs</div>
          </div>
          <div className="p-2.5 rounded-xl bg-atlas-card border border-atlas-border/60">
            <div className="text-[10px] uppercase font-bold text-atlas-muted tracking-wider">Districts Covered</div>
            <div className="text-lg font-mono font-bold text-sky-400">766</div>
            <div className="text-[10px] text-atlas-faint">All LGD Units</div>
          </div>
          <div className="p-2.5 rounded-xl bg-atlas-card border border-atlas-border/60">
            <div className="text-[10px] uppercase font-bold text-atlas-muted tracking-wider">Active Ingestions</div>
            <div className="text-lg font-mono font-bold text-amber-400">8 Sources</div>
            <div className="text-[10px] text-atlas-faint">Normalized to Schema</div>
          </div>
          <div className="p-2.5 rounded-xl bg-atlas-card border border-atlas-border/60">
            <div className="text-[10px] uppercase font-bold text-atlas-muted tracking-wider">Validated Telemetry</div>
            <div className="text-lg font-mono font-bold text-saffron">{totalRecords.toLocaleString()}</div>
            <div className="text-[10px] text-atlas-faint">BIS 10500 Verified</div>
          </div>
        </div>

        {/* Tabs & Filter Bar */}
        <div className="px-4 py-2.5 border-b border-atlas-border flex flex-wrap items-center justify-between gap-2 bg-atlas-card">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("sources")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "sources"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-atlas-muted hover:text-atlas-text hover:bg-atlas-elevated"
              }`}
            >
              Data Sources ({PAN_INDIA_DATA_SOURCES.length})
            </button>
            <button
              onClick={() => setActiveTab("coverage")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "coverage"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-atlas-muted hover:text-atlas-text hover:bg-atlas-elevated"
              }`}
            >
              State & UT Coverage Matrix (36)
            </button>
          </div>

          {activeTab === "sources" && (
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded-md text-[11px] capitalize transition ${
                    filterCategory === cat
                      ? "bg-atlas-elevated text-emerald-400 font-bold border border-emerald-500/40"
                      : "text-atlas-muted hover:text-atlas-text"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === "sources" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredSources.map((source) => (
                <div
                  key={source.id}
                  className="p-3.5 rounded-xl bg-atlas-elevated/40 border border-atlas-border hover:border-emerald-500/40 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-atlas-card border border-atlas-border text-emerald-400">
                          {source.id}
                        </span>
                        <span className="text-xs font-bold text-atlas-text line-clamp-1">
                          {source.name}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 whitespace-nowrap">
                        <Activity className="w-2.5 h-2.5 animate-pulse" />
                        {source.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-atlas-muted mt-1 font-medium">
                      {source.organization}
                    </p>

                    <div className="mt-2.5 space-y-1.5">
                      <div className="text-[11px]">
                        <span className="text-atlas-faint font-semibold">Key Parameters:</span>{" "}
                        <span className="text-atlas-text text-[10px]">
                          {source.indicators.slice(0, 3).join(" • ")}
                          {source.indicators.length > 3 && ` +${source.indicators.length - 3} more`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-atlas-muted">
                        <span>Cadence: <strong className="text-atlas-text">{source.cadence}</strong></span>
                        <span>Coverage: <strong className="text-atlas-text">{source.coverage}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-atlas-border/60 flex items-center justify-between text-[10px] text-atlas-faint">
                    <span className="truncate max-w-[200px]" title={source.license}>
                      Lic: {source.license}
                    </span>
                    <span className="font-mono font-bold text-emerald-400/90">
                      {source.recordsCount} records
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-atlas-elevated/40 border border-atlas-border text-xs text-atlas-muted">
                Official Local Government Directory (LGD) and Ministry of Jal Shakti compliance matrix across all 36 Indian States and Union Territories.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {INDIAN_STATES_UTS.map((state) => (
                  <div
                    key={state.code}
                    className="p-2.5 rounded-xl bg-atlas-card border border-atlas-border/70 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-atlas-elevated text-saffron">
                          {state.code}
                        </span>
                        <span className="text-xs font-semibold text-atlas-text">
                          {state.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-atlas-muted mt-0.5">
                        {state.adminTerm} hierarchy • {state.terrain.split("&")[0]}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        {state.districtCount}
                      </span>
                      <div className="text-[9px] text-atlas-faint">districts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-atlas-border bg-atlas-elevated/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-atlas-muted text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All ingestions validate timestamps, coordinate boundaries, null-handling & BIS 10500 standards.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow"
          >
            Close Telemetry View
          </button>
        </div>
      </div>
    </div>
  );
}
