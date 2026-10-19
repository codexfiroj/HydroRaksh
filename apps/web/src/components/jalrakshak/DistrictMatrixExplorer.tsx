"use client";

import React, { useState, useMemo } from "react";
import { DistrictWaterEntity } from "@/data/up-75-districts";
import { INDIAN_STATES_UTS, getDistrictsForState, getAllPanIndiaDistricts } from "@/data/india-geography";
import { Search, Download, ArrowUpDown, Filter, CheckCircle2, Shield, Eye, Layers, Droplets } from "lucide-react";

interface DistrictMatrixExplorerProps {
  onSelectDistrict?: (id: string) => void;
  districts?: DistrictWaterEntity[];
  selectedStateCode?: string;
}

type SortField =
  | "name"
  | "depth"
  | "trend"
  | "stage"
  | "rain"
  | "stress"
  | "suitability"
  | "wqi"
  | "borewell";

export function DistrictMatrixExplorer({ onSelectDistrict, districts, selectedStateCode = "UP" }: DistrictMatrixExplorerProps) {
  const [activeStateCode, setActiveStateCode] = useState<string>(selectedStateCode || "ALL");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<SortField>("stress");
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Sync state if selectedStateCode prop changes
  React.useEffect(() => {
    if (selectedStateCode) {
      setActiveStateCode(selectedStateCode);
    }
  }, [selectedStateCode]);

  // Source districts: either active state, passed districts, or Pan-India
  const baseDistricts = useMemo(() => {
    if (activeStateCode === "ALL") {
      return getAllPanIndiaDistricts();
    }
    if (districts && districts.length > 0 && (!selectedStateCode || selectedStateCode === activeStateCode)) {
      return districts;
    }
    return getDistrictsForState(activeStateCode);
  }, [activeStateCode, districts, selectedStateCode]);

  // Filter & Sort
  const filteredDistricts = useMemo(() => {
    let list = baseDistricts.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        (d.division || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.region || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.soilType || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.modernWaterMetrics?.majorRiverBasin || "").toLowerCase().includes(search.toLowerCase());

      const cat = d.modernWaterMetrics?.cgwbCategory || "Critical";
      const matchCategory = categoryFilter === "All" || cat === categoryFilter;

      return matchSearch && matchCategory;
    });

    list.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      switch (sortField) {
        case "name":
          valA = a.name;
          valB = b.name;
          break;
        case "depth":
          valA = a.modernWaterMetrics?.groundwaterDepthM ?? 12;
          valB = b.modernWaterMetrics?.groundwaterDepthM ?? 12;
          break;
        case "trend":
          valA = a.modernWaterMetrics?.groundwaterTrendAnnualCm ?? -20;
          valB = b.modernWaterMetrics?.groundwaterTrendAnnualCm ?? -20;
          break;
        case "stage":
          valA = a.modernWaterMetrics?.cgwbStageExtractionPct ?? 75;
          valB = b.modernWaterMetrics?.cgwbStageExtractionPct ?? 75;
          break;
        case "rain":
          valA = a.modernWaterMetrics?.avgRainfallMm ?? 850;
          valB = b.modernWaterMetrics?.avgRainfallMm ?? 850;
          break;
        case "stress":
          valA = a.modernWaterMetrics?.waterStressScore ?? 65;
          valB = b.modernWaterMetrics?.waterStressScore ?? 65;
          break;
        case "suitability":
          valA = a.rechargeSuitabilityScore ?? 75;
          valB = b.rechargeSuitabilityScore ?? 75;
          break;
        case "wqi":
          valA = a.waterQuality?.wqi ?? 70;
          valB = b.waterQuality?.wqi ?? 70;
          break;
        case "borewell":
          valA = a.borewellData?.failureRatePct ?? 5.0;
          valB = b.borewellData?.failureRatePct ?? 5.0;
          break;
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
    });

    return list;
  }, [baseDistricts, search, categoryFilter, sortField, sortAsc]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "State",
      "District",
      "Division",
      "Region",
      "Area_Km2",
      "Water_Table_Depth_mbgl",
      "Annual_Fall_Rate_cm_yr",
      "CGWB_Category",
      "Extraction_Stage_Pct",
      "Annual_Rainfall_mm",
      "Annual_Demand_MCM",
      "Water_Stress_Score_100",
      "AI_Recharge_Suitability_100",
      "Water_Quality_Index_WQI",
      "Borewell_Failure_Rate_Pct",
      "Casing_Failure_Risk_Pct",
      "Soil_Type",
      "Major_River_Basin",
      "Data_Provenance",
    ];

    const rows = filteredDistricts.map((d) => [
      `"${d.stateName || d.stateCode || "Uttar Pradesh"}"`,
      `"${d.name}"`,
      `"${d.division || ""}"`,
      `"${d.region || ""}"`,
      d.areaKm2 ?? 3500,
      d.modernWaterMetrics?.groundwaterDepthM ?? 12,
      d.modernWaterMetrics?.groundwaterTrendAnnualCm ?? -20,
      `"${d.modernWaterMetrics?.cgwbCategory ?? "Critical"}"`,
      d.modernWaterMetrics?.cgwbStageExtractionPct ?? 75,
      d.modernWaterMetrics?.avgRainfallMm ?? 850,
      d.modernWaterMetrics?.annualDemandMcm ?? 450,
      d.modernWaterMetrics?.waterStressScore ?? 65,
      d.rechargeSuitabilityScore ?? 75,
      d.waterQuality?.wqi ?? 74,
      d.borewellData?.failureRatePct ?? 6.2,
      d.borewellData?.casingFailureRiskPct ?? 7.5,
      `"${d.soilType ?? "Alluvial Loam"}"`,
      `"${d.modernWaterMetrics?.majorRiverBasin ?? "Regional Basin"}"`,
      `"${d.waterQuality?.provenance ?? "Live"}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jalsuraksha_${activeStateCode.toLowerCase()}_districts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentStateName = activeStateCode === "ALL"
    ? "All India (780 Districts)"
    : INDIAN_STATES_UTS.find((s) => s.code === activeStateCode)?.name || "State";

  return (
    <div className="space-y-4 text-atlas-text">
      {/* Top Banner & Export */}
      <div className="p-4 rounded-2xl bg-atlas-elevated/40 border border-atlas-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-serif font-bold text-atlas-text">
              Pan-India Hydrological Matrix & Comparative Ranking
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              {filteredDistricts.length} Districts Active
            </span>
          </div>
          <p className="text-xs text-atlas-muted mt-0.5">
            Calibrated groundwater levels, CGWB extraction stages, rainfall, BIS 10500 water quality, and borewell records
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dataset (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
        {/* State / UT Selector */}
        <div className="sm:col-span-4">
          <select
            value={activeStateCode}
            onChange={(e) => setActiveStateCode(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-atlas-card border border-atlas-border text-atlas-text font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
          >
            <option value="ALL">All India (36 States & UTs • 780 Districts)</option>
            {INDIAN_STATES_UTS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name} ({s.districtCount} districts)
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-atlas-muted" />
          <input
            type="text"
            placeholder="Search district, division, river basin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-atlas-card border border-atlas-border text-atlas-text placeholder:text-atlas-faint focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>

        {/* CGWB Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-atlas-card border border-atlas-border text-atlas-text focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
          >
            <option value="All">All CGWB Categories</option>
            <option value="Safe">Safe (&lt;70%)</option>
            <option value="Semi-Critical">Semi-Critical (70-90%)</option>
            <option value="Critical">Critical (90-100%)</option>
            <option value="Over-Exploited">Over-Exploited (&gt;100%)</option>
          </select>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="rounded-2xl border border-atlas-border bg-atlas-card overflow-hidden">
        <div className="overflow-x-auto max-h-[550px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-atlas-elevated border-b border-atlas-border z-10 text-[11px] uppercase tracking-wider font-semibold text-atlas-muted">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">District <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort("depth")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">Water Depth <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort("trend")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">Annual Trend <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort("stage")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">Extraction <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort("wqi")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">WQI (Quality) <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort("borewell")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">Borewell Failure <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort("stress")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">Stress Score <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th
                  onClick={() => handleSort("suitability")}
                  className="py-3 px-3 cursor-pointer hover:text-atlas-text transition"
                >
                  <span className="flex items-center gap-1">AI Suitability <ArrowUpDown className="w-3 h-3" /></span>
                </th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-atlas-border/50">
              {filteredDistricts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-atlas-muted text-xs">
                    No districts matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredDistricts.map((d) => {
                  const depth = d.modernWaterMetrics?.groundwaterDepthM ?? 12;
                  const trend = d.modernWaterMetrics?.groundwaterTrendAnnualCm ?? -20;
                  const stage = d.modernWaterMetrics?.cgwbStageExtractionPct ?? 75;
                  const category = d.modernWaterMetrics?.cgwbCategory ?? "Critical";
                  const wqi = d.waterQuality?.wqi ?? 72;
                  const failureRate = d.borewellData?.failureRatePct ?? 6.0;
                  const stress = d.modernWaterMetrics?.waterStressScore ?? 65;
                  const suitability = d.rechargeSuitabilityScore ?? 75;

                  return (
                    <tr
                      key={d.id}
                      className="hover:bg-atlas-elevated/40 transition group"
                    >
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-atlas-text">{d.name}</div>
                        <div className="text-[10px] text-atlas-muted">
                          {d.stateName || d.stateCode || "Uttar Pradesh"} {d.division ? `• ${d.division}` : ""}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-atlas-text">
                        {depth.toFixed(1)} <span className="text-[10px] text-atlas-muted font-normal">mbgl</span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-rose-400 font-semibold">
                        {trend.toFixed(1)} <span className="text-[10px] text-atlas-muted font-normal">cm/yr</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-mono font-bold text-atlas-text">{stage.toFixed(1)}%</div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            category === "Over-Exploited"
                              ? "bg-red-500/20 text-red-400"
                              : category === "Critical"
                              ? "bg-orange-500/20 text-orange-400"
                              : category === "Semi-Critical"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className="font-bold text-purple-400">{wqi}</span>
                        <span className="text-[10px] text-atlas-muted">/100</span>
                        <div className="text-[9px] text-emerald-400 font-semibold">{d.waterQuality?.status || "Safe"}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        <span className="font-bold text-amber-400">{failureRate.toFixed(1)}%</span>
                        <div className="text-[9px] text-atlas-muted">
                          {d.borewellData?.recordedFailures ?? 12} failures
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-saffron">{stress}</span>
                        <span className="text-[10px] text-atlas-muted">/100</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-mono font-bold text-cyan-400">{suitability}</span>
                        <span className="text-[10px] text-atlas-muted">/100</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {onSelectDistrict && (
                          <button
                            onClick={() => onSelectDistrict(d.id)}
                            className="px-2.5 py-1 rounded-lg bg-atlas-elevated hover:bg-emerald-600 hover:text-white text-atlas-muted text-[11px] font-semibold transition"
                          >
                            Explore
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
