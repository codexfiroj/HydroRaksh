/**
 * JalRakshak AI Prescriptive Decision-Support Suite Controller
 * Powers 14 interactive decision tabs, knapsack optimization, and What-If simulator.
 */

window.JalRakshak = (function() {
  let activeTab = "recharge";

  function setTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll(".jalrakshak-tab-btn").forEach(btn => {
      const id = btn.getAttribute("data-tab");
      if (id === tabId) {
        btn.className = "jalrakshak-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg font-bold shadow-sm bg-emerald-600 text-white transition";
      } else {
        btn.className = "jalrakshak-tab-btn whitespace-nowrap px-3 py-1.5 rounded-lg font-medium text-atlas-muted hover:bg-atlas-elevated hover:text-atlas-text transition";
      }
    });

    document.querySelectorAll(".jalrakshak-tab-pane").forEach(pane => {
      pane.classList.add("hidden");
    });
    const activePane = document.getElementById("tab-pane-" + tabId);
    if (activePane) {
      activePane.classList.remove("hidden");
    }

    if (window.lucide) window.lucide.createIcons();

    // Trigger tab-specific initialization
    if (tabId === "budget") updateBudgetOptimizer();
    if (tabId === "whatif") updateWhatIfSimulation();
    if (tabId === "rwh") updateRWH();
    if (tabId === "matrix") renderDistrictMatrixTable();
  }

  // 1. Budget Optimizer (Knapsack Solver)
  function updateBudgetOptimizer() {
    const slider = document.getElementById("budgetSliderInput");
    if (!slider) return;
    const budgetVal = parseFloat(slider.value);
    document.getElementById("budgetDisplayVal").textContent = "₹ " + budgetVal.toLocaleString() + " Lakhs";

    fetch("/api/v1/jalrakshak/optimize-budget", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        total_budget_inr: budgetVal * 100000.0,
        district_id: window.JalSuraksha.state.selectedDistrictId
      })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("budgetAllocatedVal").textContent = "₹ " + Math.round(data.allocated_budget_inr / 100000.0).toFixed(1) + " L";
      document.getElementById("budgetRechargeM3Val").textContent = data.total_annual_recharge_m3.toLocaleString() + " m³/yr";
      document.getElementById("budgetPaybackVal").textContent = data.estimated_payback_years + " Years";

      const listEl = document.getElementById("budgetPortfolioList");
      if (listEl) {
        listEl.innerHTML = data.portfolio.map(item => `
          <div class="p-3 rounded-xl bg-atlas-elevated/40 border border-atlas-border flex items-center justify-between">
            <div>
              <div class="text-xs font-serif font-bold text-atlas-text">${item.structure_name}</div>
              <div class="text-[11px] text-atlas-muted mt-0.5">Unit Cost: ₹${item.unit_cost_inr.toLocaleString()} • Efficiency: ₹${item.cost_per_m3_inr}/m³</div>
            </div>
            <div class="text-right">
              <span class="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-xs">${item.units} Units</span>
              <div class="text-[10px] text-saffron font-bold mt-1">+${item.annual_recharge_m3.toLocaleString()} m³/yr</div>
            </div>
          </div>
        `).join("");
      }
    })
    .catch(err => console.error("Budget optimization failed:", err));
  }

  // 2. What-If Simulator
  function updateWhatIfSimulation() {
    const rainDelta = parseFloat(document.getElementById("whatifRainInput")?.value || 0);
    const extDelta = parseFloat(document.getElementById("whatifExtInput")?.value || 0);
    const demandDelta = parseFloat(document.getElementById("whatifDemandInput")?.value || 0);
    const structDelta = parseInt(document.getElementById("whatifStructInput")?.value || 0);

    const rainSpan = document.getElementById("whatifRainDisplay");
    const extSpan = document.getElementById("whatifExtDisplay");
    const demandSpan = document.getElementById("whatifDemandDisplay");
    const structSpan = document.getElementById("whatifStructDisplay");

    if (rainSpan) rainSpan.textContent = (rainDelta >= 0 ? "+" : "") + rainDelta + "%";
    if (extSpan) extSpan.textContent = (extDelta >= 0 ? "+" : "") + extDelta + "%";
    if (demandSpan) demandSpan.textContent = (demandDelta >= 0 ? "+" : "") + demandDelta + "%";
    if (structSpan) structSpan.textContent = "+" + structDelta + " Structures";

    fetch("/api/v1/jalrakshak/what-if", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        district_id: window.JalSuraksha.state.selectedDistrictId,
        rainfall_change_pct: rainDelta,
        extraction_change_pct: extDelta,
        demand_change_pct: demandDelta,
        recharge_structures_added: structDelta
      })
    })
    .then(res => res.json())
    .then(data => {
      const sim = data.simulated;
      document.getElementById("whatifSimDepth").textContent = sim.depth_m + " m bgl";
      document.getElementById("whatifSimDeltaDepth").textContent = (sim.delta_depth_m >= 0 ? "+" : "") + sim.delta_depth_m + " m";
      document.getElementById("whatifSimStress").textContent = sim.stress_score + "/100";
      
      const catBadge = document.getElementById("whatifSimCategory");
      if (catBadge) {
        catBadge.textContent = sim.category;
        catBadge.className = "text-xs font-bold px-2 py-0.5 rounded-md uppercase " + 
          (sim.stress_score >= 75 ? "bg-red-500/15 text-red-400 border border-red-500/30" :
           sim.stress_score >= 55 ? "bg-orange-500/15 text-orange-400 border border-orange-500/30" :
           sim.stress_score >= 35 ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" :
           "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30");
      }
    })
    .catch(err => console.error("What-If simulation failed:", err));
  }

  // 3. Rooftop Rainwater Harvesting Calculator
  function updateRWH() {
    const area = parseFloat(document.getElementById("rwhAreaInput")?.value || 150);
    const roofType = document.getElementById("rwhTypeSelect")?.value || "concrete";

    document.getElementById("rwhAreaDisplay").textContent = area + " m²";

    fetch("/api/v1/jalrakshak/rwh-calc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roof_area_m2: area,
        roof_type: roofType
      })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("rwhYieldM3").textContent = data.annual_yield_m3.toLocaleString() + " m³/yr";
      document.getElementById("rwhYieldLitres").textContent = data.annual_yield_litres.toLocaleString() + " Litres";
      document.getElementById("rwhSavingsINR").textContent = "₹ " + data.annual_savings_inr.toLocaleString() + "/yr";
      document.getElementById("rwhCostINR").textContent = "₹ " + data.estimated_capital_cost_inr.toLocaleString();
      document.getElementById("rwhPaybackYrs").textContent = data.payback_years + " Years";
      document.getElementById("rwhTankM3").textContent = data.recommended_tank_capacity_m3 + " m³";
    })
    .catch(err => console.error("RWH calculation failed:", err));
  }

  // 4. District Matrix Table
  function renderDistrictMatrixTable() {
    const host = document.getElementById("matrixTableBody");
    if (!host) return;

    const districts = window.JalSuraksha.state.districts;
    host.innerHTML = districts.map((d, idx) => {
      const m = d.modernWaterMetrics || {};
      const depth = m.groundwaterDepthM || 14.0;
      const trend = m.groundwaterTrendAnnualCm || -22;
      const cat = m.cgwbCategory || "Semi-Critical";
      const stress = m.waterStressScore || 65;
      const recharge = d.rechargeSuitabilityScore || 75;

      return `
        <tr class="hover:bg-atlas-elevated/40 border-b border-atlas-border text-xs cursor-pointer"
          onclick="window.JalSuraksha.setSelectedDistrict('${d.id}'); window.JalSuraksha.closeModal('jalrakshakModal');">
          <td class="px-3 py-2 font-mono text-atlas-muted">${idx + 1}</td>
          <td class="px-3 py-2 font-bold font-serif text-emerald-400">${d.name}</td>
          <td class="px-3 py-2 text-atlas-muted">${d.division || d.region || "Central"}</td>
          <td class="px-3 py-2 font-mono">${depth} m</td>
          <td class="px-3 py-2 font-mono ${trend < -25 ? 'text-red-400' : 'text-amber-400'}">${trend} cm/yr</td>
          <td class="px-3 py-2">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              stress >= 75 ? 'bg-red-500/15 text-red-500' :
              stress >= 55 ? 'bg-orange-500/15 text-orange-400' :
              stress >= 35 ? 'bg-amber-500/15 text-amber-400' :
              'bg-emerald-500/15 text-emerald-400'
            }">${cat}</span>
          </td>
          <td class="px-3 py-2 font-mono font-bold text-saffron">${stress}/100</td>
          <td class="px-3 py-2 font-mono text-emerald-400">${recharge}/100</td>
        </tr>
      `;
    }).join("");
  }

  return {
    setTab,
    updateBudgetOptimizer,
    updateWhatIfSimulation,
    updateRWH,
    renderDistrictMatrixTable
  };
})();
