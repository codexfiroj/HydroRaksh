"use client";

import React, { useState, useMemo } from "react";
import { DistrictWaterEntity } from "@/data/up-75-districts";
import { INDIAN_STATES_UTS, getDistrictsForState, getDistrictById, getAllPanIndiaDistricts } from "@/data/india-geography";
import { X, Trophy, Droplets, CheckCircle2, Shield, Activity, Layers, AlertCircle } from "lucide-react";

interface TrumpCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDistrictId?: string;
  selectedStateCode?: string;
}

export function TrumpCardModal({ isOpen, onClose, initialDistrictId, selectedStateCode = "UP" }: TrumpCardModalProps) {
  // Determine initial state & district for side A
  const initialDistA = useMemo(() => {
    return (initialDistrictId && getDistrictById(initialDistrictId)) || undefined;
  }, [initialDistrictId]);

  const [stateCodeA, setStateCodeA] = useState<string>(initialDistA?.stateCode || selectedStateCode || "UP");
  const [districtAId, setDistrictAId] = useState<string>(initialDistrictId || "agra");

  const [stateCodeB, setStateCodeB] = useState<string>("UP");
  const [districtBId, setDistrictBId] = useState<string>(
    initialDistrictId === "ghaziabad" ? "varanasi" : "ghaziabad"
  );

  // Sync when initialDistrictId changes
  React.useEffect(() => {
    if (initialDistrictId) {
      const found = getDistrictById(initialDistrictId);
      if (found) {
        if (found.stateCode) setStateCodeA(found.stateCode);
        setDistrictAId(found.id);
      } else {
        setDistrictAId(initialDistrictId);
      }
    }
  }, [initialDistrictId]);

  const districtsOfStateA = useMemo(() => getDistrictsForState(stateCodeA), [stateCodeA]);
  const districtsOfStateB = useMemo(() => getDistrictsForState(stateCodeB), [stateCodeB]);

  const districtA: DistrictWaterEntity =
    districtsOfStateA.find((d) => d.id === districtAId) ||
    getDistrictById(districtAId) ||
    districtsOfStateA[0] ||
    getAllPanIndiaDistricts()[0];

  const districtB: DistrictWaterEntity =
    districtsOfStateB.find((d) => d.id === districtBId) ||
    getDistrictById(districtBId) ||
    districtsOfStateB[1] ||
    districtsOfStateB[0] ||
    getAllPanIndiaDistricts()[1];

  if (!isOpen) return null;

  const depthA = districtA.modernWaterMetrics?.groundwaterDepthM ?? 12.0;
  const depthB = districtB.modernWaterMetrics?.groundwaterDepthM ?? 12.0;

  const trendA = Math.abs(districtA.modernWaterMetrics?.groundwaterTrendAnnualCm ?? 20);
  const trendB = Math.abs(districtB.modernWaterMetrics?.groundwaterTrendAnnualCm ?? 20);

  const stageA = districtA.modernWaterMetrics?.cgwbStageExtractionPct ?? 75;
  const stageB = districtB.modernWaterMetrics?.cgwbStageExtractionPct ?? 75;

  const rainA = districtA.modernWaterMetrics?.avgRainfallMm ?? 850;
  const rainB = districtB.modernWaterMetrics?.avgRainfallMm ?? 850;

  const stressA = districtA.modernWaterMetrics?.waterStressScore ?? 65;
  const stressB = districtB.modernWaterMetrics?.waterStressScore ?? 65;

  const suitA = districtA.rechargeSuitabilityScore ?? 75;
  const suitB = districtB.rechargeSuitabilityScore ?? 75;

  const slopeA = districtA.slopePct ?? 1.5;
  const slopeB = districtB.slopePct ?? 1.5;

  const demandA = districtA.modernWaterMetrics?.annualDemandMcm ?? 450;
  const demandB = districtB.modernWaterMetrics?.annualDemandMcm ?? 450;

  const wqiA = districtA.waterQuality?.wqi ?? 72;
  const wqiB = districtB.waterQuality?.wqi ?? 72;

  const failureRateA = districtA.borewellData?.failureRatePct ?? 6.0;
  const failureRateB = districtB.borewellData?.failureRatePct ?? 6.0;

  const casingRiskA = districtA.borewellData?.casingFailureRiskPct ?? 8.0;
  const casingRiskB = districtB.borewellData?.casingFailureRiskPct ?? 8.0;

  const attributes = [
    {
      label: "Water Table Depth (Shallower = Better)",
      valA: depthA,
      valB: depthB,
      format: (v: number) => `${v.toFixed(1)} mbgl`,
      higherIsBetter: false,
    },
    {
      label: "Annual Fall Rate (Lower = Better)",
      valA: trendA,
      valB: trendB,
      format: (v: number) => `${v.toFixed(1)} cm/yr`,
      higherIsBetter: false,
    },
    {
      label: "CGWB Extraction Stage (Lower = Safer)",
      valA: stageA,
      valB: stageB,
      format: (v: number) => `${v.toFixed(1)}%`,
      higherIsBetter: false,
    },
    {
      label: "Annual Normal Rainfall",
      valA: rainA,
      valB: rainB,
      format: (v: number) => `${Math.round(v)} mm`,
      higherIsBetter: true,
    },
    {
      label: "Water Stress Score (Lower = Safer)",
      valA: stressA,
      valB: stressB,
      format: (v: number) => `${Math.round(v)} / 100`,
      higherIsBetter: false,
    },
    {
      label: "AI Recharge Suitability",
      valA: suitA,
      valB: suitB,
      format: (v: number) => `${Math.round(v)} / 100`,
      higherIsBetter: true,
    },
    {
      label: "Terrain Slope (Flatter = Better Recharge)",
      valA: slopeA,
      valB: slopeB,
      format: (v: number) => `${v.toFixed(1)}%`,
      higherIsBetter: false,
    },
    {
      label: "Annual Demand Burden (Lower = Better)",
      valA: demandA,
      valB: demandB,
      format: (v: number) => `${Math.round(v)} MCM`,
      higherIsBetter: false,
    },
    {
      label: "Water Quality Index (BIS 10500)",
      valA: wqiA,
      valB: wqiB,
      format: (v: number) => `${Math.round(v)} / 100`,
      higherIsBetter: true,
    },
    {
      label: "Borewell Failure Rate (Lower = Safer)",
      valA: failureRateA,
      valB: failureRateB,
      format: (v: number) => `${v.toFixed(1)}%`,
      higherIsBetter: false,
    },
    {
      label: "Casing Collapse Risk (Lower = Safer)",
      valA: casingRiskA,
      valB: casingRiskB,
      format: (v: number) => `${v.toFixed(1)}%`,
      higherIsBetter: false,
    },
  ];

  let scoreA = 0;
  let scoreB = 0;
  attributes.forEach((attr) => {
    if (attr.valA !== attr.valB) {
      const aWins = attr.higherIsBetter ? attr.valA > attr.valB : attr.valA < attr.valB;
      if (aWins) scoreA++;
      else scoreB++;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-atlas-card border border-atlas-border rounded-2xl shadow-2xl flex flex-col overflow-hidden text-atlas-text">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-atlas-border flex items-center justify-between bg-atlas-elevated/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-glow">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-black tracking-wide text-atlas-text">
                Pan-India District Duel Arena
              </h2>
              <p className="text-xs text-atlas-muted">
                Compare any two districts across India on calibrated groundwater, rainfall, dual water quality, and borewell metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-atlas-muted hover:text-atlas-text hover:bg-atlas-elevated transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* District 1 Selector */}
            <div className="p-4 rounded-xl bg-atlas-elevated/50 border border-atlas-border space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  District 1
                </span>
                <span className="text-sm font-mono font-black text-amber-400">
                  {scoreA} Wins
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <select
                  value={stateCodeA}
                  onChange={(e) => {
                    const newSc = e.target.value;
                    setStateCodeA(newSc);
                    const newDists = getDistrictsForState(newSc);
                    if (newDists.length > 0) setDistrictAId(newDists[0].id);
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-atlas-card border border-atlas-border text-xs font-semibold text-atlas-text focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                >
                  {INDIAN_STATES_UTS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.districtCount})
                    </option>
                  ))}
                </select>
                <select
                  value={districtAId}
                  onChange={(e) => setDistrictAId(e.target.value)}
                  className="w-full py-1.5 px-2 rounded-lg bg-atlas-card border border-atlas-border text-sm font-serif font-bold text-atlas-text focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                >
                  {districtsOfStateA.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.division ? `(${d.division})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-atlas-muted flex justify-between items-center pt-1">
                <span>CGWB: <strong className="text-atlas-text">{districtA.modernWaterMetrics?.cgwbCategory || "Critical"}</strong></span>
                <span className="truncate max-w-[150px]">{districtA.soilType || "Alluvial Soil"}</span>
              </div>
            </div>

            {/* District 2 Selector */}
            <div className="p-4 rounded-xl bg-atlas-elevated/50 border border-atlas-border space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                  District 2
                </span>
                <span className="text-sm font-mono font-black text-sky-400">
                  {scoreB} Wins
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <select
                  value={stateCodeB}
                  onChange={(e) => {
                    const newSc = e.target.value;
                    setStateCodeB(newSc);
                    const newDists = getDistrictsForState(newSc);
                    if (newDists.length > 0) setDistrictBId(newDists[0].id);
                  }}
                  className="w-full py-1.5 px-2 rounded-lg bg-atlas-card border border-atlas-border text-xs font-semibold text-atlas-text focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
                >
                  {INDIAN_STATES_UTS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name} ({s.districtCount})
                    </option>
                  ))}
                </select>
                <select
                  value={districtBId}
                  onChange={(e) => setDistrictBId(e.target.value)}
                  className="w-full py-1.5 px-2 rounded-lg bg-atlas-card border border-atlas-border text-sm font-serif font-bold text-atlas-text focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
                >
                  {districtsOfStateB.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} {d.division ? `(${d.division})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-xs text-atlas-muted flex justify-between items-center pt-1">
                <span>CGWB: <strong className="text-atlas-text">{districtB.modernWaterMetrics?.cgwbCategory || "Critical"}</strong></span>
                <span className="truncate max-w-[150px]">{districtB.soilType || "Alluvial Soil"}</span>
              </div>
            </div>
          </div>

          {/* Metrics Duel Table */}
          <div className="space-y-2">
            {attributes.map((attr, idx) => {
              const aWins =
                attr.valA !== attr.valB &&
                (attr.higherIsBetter ? attr.valA > attr.valB : attr.valA < attr.valB);
              const bWins =
                attr.valA !== attr.valB &&
                (attr.higherIsBetter ? attr.valB > attr.valA : attr.valB < attr.valA);

              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-atlas-elevated/30 border border-atlas-border/70 flex items-center justify-between text-xs"
                >
                  <div
                    className={`flex-1 text-left font-mono font-bold flex items-center gap-1.5 ${
                      aWins ? "text-amber-500 dark:text-amber-400 text-sm" : "text-atlas-muted"
                    }`}
                  >
                    <span>{attr.format(attr.valA)}</span>
                    {aWins && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-sans font-semibold">
                        LEAD
                      </span>
                    )}
                  </div>

                  <div className="flex-1 text-center font-medium text-atlas-text px-2">
                    {attr.label}
                  </div>

                  <div
                    className={`flex-1 text-right font-mono font-bold flex items-center justify-end gap-1.5 ${
                      bWins ? "text-sky-500 dark:text-sky-400 text-sm" : "text-atlas-muted"
                    }`}
                  >
                    {bWins && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-sky-500/20 text-sky-600 dark:text-sky-400 font-sans font-semibold">
                        LEAD
                      </span>
                    )}
                    <span>{attr.format(attr.valB)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Result Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/15 via-transparent to-sky-500/15 border border-atlas-border text-center">
            <div className="text-xs text-atlas-muted uppercase tracking-wider font-semibold">
              Water Security Comparison Verdict
            </div>
            <div className="text-base font-serif font-bold text-atlas-text mt-1">
              {scoreA > scoreB
                ? `${districtA.name} demonstrates superior water resilience (${scoreA} winning metrics)`
                : scoreB > scoreA
                ? `${districtB.name} demonstrates superior water resilience (${scoreB} winning metrics)`
                : "Balanced groundwater indicators between both districts"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
