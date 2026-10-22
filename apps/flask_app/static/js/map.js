/**
  JalSuraksha SVG Interactive Map & Pan-India District Grid Engine
  Uses official design tokens:
  --primary: #18B6C9;
  --accent: #E9B44C;
  --danger: #FF6B5E;
  --safe: #2FBF8F;
**/

window.JalMap = (function() {
  let tooltipEl = null;
  let activeGridFilter = "ALL";
  let activeGridSort = "stress_desc";
  let gridSearchQuery = "";

  function render() {
    tooltipEl = document.getElementById("mapHoverTooltip");
    updateDistrictColors();
    highlightDistrict(window.JalSuraksha.state.selectedDistrictId);
  }

  function getDistrictFill(d) {
    const s = window.JalSuraksha.state;
    const year = s.currentYear;
    const isCb = s.isColorBlindMode;

    // Recharge Mode
    if (s.viewMode === "recharge") {
      const suit = d.rechargeSuitabilityScore || 75;
      if (suit >= 88) return isCb ? "#009e73" : "#18B6C9"; // High Suitability / Primary Cyan
      if (suit >= 75) return isCb ? "#56b4e9" : "#2FBF8F"; // Good / Safe Mint
      if (suit >= 60) return isCb ? "#f0e442" : "#E9B44C"; // Moderate / Accent Amber
      return isCb ? "#708090" : "#59778c"; // Low / Slate
    }

    // Water Stress Mode
    let stress = 65;
    if (d.temporalTrajectory && d.temporalTrajectory.length > 0) {
      const pt = d.temporalTrajectory.find(t => t.year === year) || d.temporalTrajectory[d.temporalTrajectory.length - 1];
      stress = pt.stress_score;
    } else if (d.modernWaterMetrics) {
      stress = d.modernWaterMetrics.waterStressScore || 65;
    }

    if (stress >= 75) return isCb ? "#d55e00" : "#FF6B5E"; // Over-Exploited / Coral Danger
    if (stress >= 55) return isCb ? "#e69f00" : "#fa8c16"; // Critical / Deep Orange
    if (stress >= 35) return isCb ? "#f0e442" : "#E9B44C"; // Semi-Critical / Warm Accent
    return isCb ? "#009e73" : "#2FBF8F"; // Safe / Mint Emerald
  }

  function updateDistrictColors() {
    const s = window.JalSuraksha.state;
    if (!s || !s.districts) return;
    s.districts.forEach(d => {
      const el = document.getElementById("svg-dist-" + d.id);
      if (el) {
        el.setAttribute("fill", getDistrictFill(d));
      }
    });

    // Also update dynamic grid cards
    renderGridCards();
  }

  function highlightDistrict(districtId) {
    document.querySelectorAll(".district-shape").forEach(el => {
      el.classList.remove("selected");
    });
    const target = document.getElementById("svg-dist-" + districtId);
    if (target) {
      target.classList.add("selected");
    }
  }

  function onDistrictHover(e, distId) {
    const d = window.JalSuraksha.state.districts.find(item => item.id === distId);
    if (!d || !tooltipEl) return;

    const s = window.JalSuraksha.state;
    let pt = d.temporalTrajectory ? d.temporalTrajectory.find(t => t.year === s.currentYear) : null;
    if (!pt && d.modernWaterMetrics) {
      pt = {
        depth_m: d.modernWaterMetrics.groundwaterDepthM,
        stress_score: d.modernWaterMetrics.waterStressScore,
        category: d.modernWaterMetrics.cgwbCategory
      };
    }
    const depth = pt ? pt.depth_m : 14.5;
    const stress = pt ? pt.stress_score : 65;
    const cat = pt ? pt.category : "Semi-Critical";

    document.getElementById("ttDistrictName").textContent = d.name;
    document.getElementById("ttDivision").textContent = (d.division || d.region || "Central") + " • " + (d.modernWaterMetrics ? d.modernWaterMetrics.majorRiverBasin : "Basin");
    document.getElementById("ttDepth").textContent = depth + " m bgl";
    document.getElementById("ttStress").textContent = stress + "/100 (" + cat + ")";
    document.getElementById("ttRecharge").textContent = (d.rechargeSuitabilityScore || 75) + "/100";

    tooltipEl.style.left = (e.clientX + 14) + "px";
    tooltipEl.style.top = (e.clientY + 14) + "px";
    tooltipEl.classList.remove("hidden");
  }

  function onDistrictLeave() {
    if (tooltipEl) tooltipEl.classList.add("hidden");
  }

  function onDistrictClick(distId) {
    window.JalSuraksha.setSelectedDistrict(distId);
  }

  function setGridFilter(filterVal) {
    activeGridFilter = filterVal;
    renderGridCards();
  }

  function setGridSort(sortVal) {
    activeGridSort = sortVal;
    renderGridCards();
  }

  function filterGridSearch(query) {
    gridSearchQuery = (query || "").toLowerCase().trim();
    renderGridCards();
  }

  // Rich Grid cards for all districts
  function renderGridCards() {
    const gridHost = document.getElementById("panIndiaGridHost");
    if (!gridHost) return;

    const s = window.JalSuraksha.state;
    if (!s || !s.districts || s.districts.length === 0) return;

    // Filter districts
    let filtered = s.districts.filter(d => {
      const metrics = d.modernWaterMetrics || {};
      const cat = (metrics.cgwbCategory || "Semi-Critical").toUpperCase();
      
      if (activeGridFilter !== "ALL") {
        if (activeGridFilter === "OVER-EXPLOITED" && !cat.includes("OVER")) return false;
        if (activeGridFilter === "CRITICAL" && (!cat.includes("CRITICAL") || cat.includes("SEMI"))) return false;
        if (activeGridFilter === "SEMI-CRITICAL" && !cat.includes("SEMI")) return false;
        if (activeGridFilter === "SAFE" && !cat.includes("SAFE")) return false;
      }

      if (gridSearchQuery) {
        const name = (d.name || "").toLowerCase();
        const div = (d.division || "").toLowerCase();
        const basin = (metrics.majorRiverBasin || "").toLowerCase();
        if (!name.includes(gridSearchQuery) && !div.includes(gridSearchQuery) && !basin.includes(gridSearchQuery)) {
          return false;
        }
      }
      return true;
    });

    // Sort districts
    filtered.sort((a, b) => {
      const mA = a.modernWaterMetrics || {};
      const mB = b.modernWaterMetrics || {};
      if (activeGridSort === "stress_desc") {
        return (mB.waterStressScore || 0) - (mA.waterStressScore || 0);
      }
      if (activeGridSort === "stress_asc") {
        return (mA.waterStressScore || 0) - (mB.waterStressScore || 0);
      }
      if (activeGridSort === "depth_desc") {
        return (mB.groundwaterDepthM || 0) - (mA.groundwaterDepthM || 0);
      }
      if (activeGridSort === "recharge_desc") {
        return (b.rechargeSuitabilityScore || 0) - (a.rechargeSuitabilityScore || 0);
      }
      if (activeGridSort === "name_asc") {
        return (a.name || "").localeCompare(b.name || "");
      }
      return 0;
    });

    // Header controls for Grid if container exists
    const gridContainer = document.getElementById("mapGridContainer");
    let headerEl = document.getElementById("gridHeaderControls");
    if (!headerEl && gridContainer) {
      headerEl = document.createElement("div");
      headerEl.id = "gridHeaderControls";
      headerEl.className = "mb-4 flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-atlas-card/90 border border-atlas-border backdrop-blur-md shadow-sm";
      headerEl.innerHTML = `
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-xs font-serif font-bold text-atlas-text">Filter:</span>
          <button onclick="window.JalMap.setGridFilter('ALL')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${activeGridFilter === 'ALL' ? 'bg-primary text-white shadow-sm' : 'bg-atlas-elevated text-atlas-muted hover:text-atlas-text'}">All (${s.districts.length})</button>
          <button onclick="window.JalMap.setGridFilter('OVER-EXPLOITED')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${activeGridFilter === 'OVER-EXPLOITED' ? 'bg-danger text-white shadow-sm' : 'bg-atlas-elevated text-atlas-muted hover:text-atlas-text'}">Over-Exploited</button>
          <button onclick="window.JalMap.setGridFilter('CRITICAL')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${activeGridFilter === 'CRITICAL' ? 'bg-accent text-navy shadow-sm' : 'bg-atlas-elevated text-atlas-muted hover:text-atlas-text'}">Critical</button>
          <button onclick="window.JalMap.setGridFilter('SEMI-CRITICAL')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${activeGridFilter === 'SEMI-CRITICAL' ? 'bg-amber-500/20 text-amber-500' : 'bg-atlas-elevated text-atlas-muted hover:text-atlas-text'}">Semi-Critical</button>
          <button onclick="window.JalMap.setGridFilter('SAFE')" class="px-2.5 py-1 rounded-lg text-xs font-bold transition ${activeGridFilter === 'SAFE' ? 'bg-safe text-white shadow-sm' : 'bg-atlas-elevated text-atlas-muted hover:text-atlas-text'}">Safe</button>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search districts..."
            oninput="window.JalMap.filterGridSearch(this.value)"
            class="px-2.5 py-1 rounded-lg bg-atlas-elevated border border-atlas-border text-xs text-atlas-text placeholder:text-atlas-faint focus:outline-none focus:ring-1 focus:ring-primary w-40 sm:w-48"
          />
          <select onchange="window.JalMap.setGridSort(this.value)" class="px-2.5 py-1 rounded-lg bg-atlas-elevated border border-atlas-border text-xs text-atlas-text font-medium focus:outline-none cursor-pointer">
            <option value="stress_desc">Sort: Highest Stress</option>
            <option value="stress_asc">Sort: Lowest Stress</option>
            <option value="depth_desc">Sort: Deepest Water</option>
            <option value="recharge_desc">Sort: Recharge Potential</option>
            <option value="name_asc">Sort: Name (A-Z)</option>
          </select>
        </div>
      `;
      gridContainer.insertBefore(headerEl, gridHost);
    }

    if (filtered.length === 0) {
      gridHost.innerHTML = `
        <div class="col-span-full p-8 text-center bg-atlas-card/50 rounded-2xl border border-atlas-border">
          <div class="text-sm font-serif font-bold text-atlas-text">No districts match the filter criteria</div>
          <div class="text-xs text-atlas-muted mt-1">Try resetting the status filter or clearing your search term.</div>
        </div>
      `;
      return;
    }

    gridHost.innerHTML = filtered.map(d => {
      const isSelected = d.id === s.selectedDistrictId;
      const fill = getDistrictFill(d);
      const metrics = d.modernWaterMetrics || {};
      const depth = metrics.groundwaterDepthM || 12.0;
      const stress = metrics.waterStressScore || 60;
      const cat = metrics.cgwbCategory || "Semi-Critical";

      return `
        <div onclick="window.JalSuraksha.setSelectedDistrict('${d.id}')"
          class="p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            isSelected
              ? 'bg-atlas-elevated border-accent shadow-md scale-[1.02]'
              : 'bg-atlas-card hover:bg-atlas-elevated border-atlas-border'
          }">
          <div class="flex items-start justify-between">
            <div>
              <div class="font-serif font-bold text-sm text-atlas-text flex items-center gap-1.5">
                <span>${d.name}</span>
                <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${fill};"></span>
              </div>
              <div class="text-[11px] text-atlas-muted mt-0.5">${d.division || d.region || "Central Division"}</div>
            </div>
            <span class="text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
              stress >= 75 ? 'bg-danger/15 text-danger border border-danger/30' :
              stress >= 55 ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30' :
              stress >= 35 ? 'bg-accent/15 text-accent border border-accent/30' :
              'bg-safe/15 text-safe border border-safe/30'
            }">${cat}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-atlas-border/50 text-center">
            <div>
              <div class="text-[9px] text-atlas-muted uppercase">Depth</div>
              <div class="text-xs font-mono font-bold text-atlas-text mt-0.5">${depth}m</div>
            </div>
            <div>
              <div class="text-[9px] text-atlas-muted uppercase">Stress</div>
              <div class="text-xs font-mono font-bold text-accent mt-0.5">${stress}/100</div>
            </div>
            <div>
              <div class="text-[9px] text-atlas-muted uppercase">Recharge</div>
              <div class="text-xs font-mono font-bold text-safe mt-0.5">${d.rechargeSuitabilityScore || 75}/100</div>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  return {
    render,
    updateDistrictColors,
    highlightDistrict,
    onDistrictHover,
    onDistrictLeave,
    onDistrictClick,
    renderGridCards,
    setGridFilter,
    setGridSort,
    filterGridSearch
  };
})();
