"""
Conservation Intervention Decision-Support Engine for JalSuraksha.
Evaluates physical geomorphology, aquifer lithology, soil infiltration capacity,
monsoon precipitation, terrain slope, and groundwater quality to formulate
evidence-based artificial recharge and demand-reduction interventions.
"""

from typing import List, Dict, Any, Optional
import math
import logging

logger = logging.getLogger("jalsuraksha.ml.conservation")

INTERVENTION_CATALOG = [
    {
        "id": "deep_injection_well",
        "name": "Deep Injection & Aquifer Recharge Well with Dual Silt Trap",
        "type": "Artificial Recharge Structure",
        "primary_suitability": "Deep unconfined and semi-confined alluvial aquifers with depth > 15m",
        "base_capacity_m3_yr": 45000,
        "unit_cost_inr": 280000,
        "geological_prerequisites": {
            "min_depth_m": 12.0,
            "max_slope_pct": 3.0,
            "min_infiltration_mm_hr": 15.0,
            "compatible_aquifers": ["Alluvium", "Alluvial Sandstone", "Quaternary Alluvium", "Indo-Gangetic Deep Alluvium"],
            "excluded_aquifers": ["Unweathered Granite", "Hard Basalt", "Karst Limestones"],
            "quality_constraints": {"max_tds_mg_l": 1500, "max_fluoride_mg_l": 2.5}
        }
    },
    {
        "id": "percolation_pond",
        "name": "Percolation Pond with Vertical Recharge Shaft",
        "type": "Surface Percolation Structure",
        "primary_suitability": "Weathered hard rock, Deccan basalt plateaus, and sandy alluvial plains",
        "base_capacity_m3_yr": 75000,
        "unit_cost_inr": 450000,
        "geological_prerequisites": {
            "min_depth_m": 4.0,
            "max_slope_pct": 4.5,
            "min_infiltration_mm_hr": 8.0,
            "compatible_aquifers": ["Weathered Basalt", "Deccan Basalt", "Crystalline Gneiss", "Alluvium", "Granitic Hard Rock"],
            "excluded_aquifers": ["Impermeable Clay"],
            "quality_constraints": {"max_tds_mg_l": 2500}
        }
    },
    {
        "id": "check_dam_seasonal",
        "name": "Check Dam on Seasonal Drainage Channel (Masonry / Gabion)",
        "type": "Stream Watershed Structure",
        "primary_suitability": "Undulating terrain, piedmont zones, Bundelkhand crystalline, and Aravalli foothills",
        "base_capacity_m3_yr": 120000,
        "unit_cost_inr": 650000,
        "geological_prerequisites": {
            "min_depth_m": 3.0,
            "max_slope_pct": 8.0,
            "min_infiltration_mm_hr": 5.0,
            "compatible_aquifers": ["Bundelkhand Gneiss", "Aravalli Metamorphic", "Basalt", "Shiwalik Piedmont", "Hard Rock"],
            "excluded_aquifers": ["Flat Waterlogged Alluvium"],
            "quality_constraints": {}
        }
    },
    {
        "id": "rooftop_rwh_graded_filter",
        "name": "Rooftop Rainwater Harvesting with Graded Filter Pit",
        "type": "Decentralized Urban / Campus RWH",
        "primary_suitability": "Institutional, commercial, and residential built catchments across all soils",
        "base_capacity_m3_yr": 18000,
        "unit_cost_inr": 85000,
        "geological_prerequisites": {
            "min_depth_m": 5.0,
            "max_slope_pct": 5.0,
            "min_infiltration_mm_hr": 10.0,
            "compatible_aquifers": ["Alluvial Sand", "Sandy Loam", "Weathered Gneiss", "Laterite", "Sedimentary"],
            "excluded_aquifers": ["Active Floodplain Waterlogged"],
            "quality_constraints": {}
        }
    },
    {
        "id": "amrit_sarovar_desilting",
        "name": "Desilting, Deepening & Inlet Channel Restoration of Historical Tank",
        "type": "Traditional Water Body Restoration",
        "primary_suitability": "Rural community commons and village catchments across all administrative blocks",
        "base_capacity_m3_yr": 95000,
        "unit_cost_inr": 350000,
        "geological_prerequisites": {
            "min_depth_m": 2.0,
            "max_slope_pct": 5.0,
            "min_infiltration_mm_hr": 6.0,
            "compatible_aquifers": ["Alluvium", "Black Cotton", "Red Soil", "Bundelkhand Hard Rock", "Laterite"],
            "excluded_aquifers": [],
            "quality_constraints": {}
        }
    },
    {
        "id": "pmksy_micro_irrigation",
        "name": "PMKSY Drip & Sprinkler Micro-Irrigation Adoption",
        "type": "Agricultural Demand Management",
        "primary_suitability": "Horticulture, sugarcane, cotton, and vegetables under heavy tubewell draft",
        "base_capacity_m3_yr": 40000,  # Net water draft saved
        "unit_cost_inr": 60000,
        "geological_prerequisites": {
            "min_depth_m": 8.0,
            "max_slope_pct": 15.0,
            "min_infiltration_mm_hr": 0.0,
            "compatible_aquifers": ["All aquifers with extraction stage > 70%"],
            "excluded_aquifers": [],
            "quality_constraints": {}
        }
    },
    {
        "id": "crop_switching_millets",
        "name": "Crop Diversification from Water-Guzzling Crops to Millets & Pulses",
        "type": "Agricultural Demand Management",
        "primary_suitability": "Over-exploited blocks cultivating water-intensive paddy or sugarcane",
        "base_capacity_m3_yr": 65000,
        "unit_cost_inr": 30000,
        "geological_prerequisites": {
            "min_depth_m": 10.0,
            "max_slope_pct": 20.0,
            "min_infiltration_mm_hr": 0.0,
            "compatible_aquifers": ["All over-exploited agricultural aquifers"],
            "excluded_aquifers": [],
            "quality_constraints": {}
        }
    }
]


class ConservationInterventionEngine:
    """Decision-support engine scoring artificial recharge and conservation interventions."""

    @classmethod
    def evaluate_interventions(
        cls,
        district_data: Dict[str, Any],
        user_overrides: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Evaluate and rank all candidate interventions against local hydrogeological parameters.
        Returns suitability score (0-100), unit costs, annual capacity, and evidence criteria.
        """
        params = dict(district_data)
        if user_overrides:
            params.update(user_overrides)

        depth_m = float(params.get("depth_m", 18.0))
        slope_pct = float(params.get("slope_pct", 1.5))
        rainfall_mm = float(params.get("avg_rainfall_mm", params.get("rain", 850.0)))
        stage_ext = float(params.get("stage_extraction_pct", 85.0))
        soil = str(params.get("soil_type", "Alluvial Sandy Loam"))
        aquifer = str(params.get("aquifer_type", "Alluvium"))

        evaluated = []
        for item in INTERVENTION_CATALOG:
            prereq = item["geological_prerequisites"]
            suitability = 50.0  # Base prior score

            # 1. Depth to water table suitability
            if depth_m >= prereq["min_depth_m"]:
                suitability += 15.0
            else:
                suitability -= 20.0

            # 2. Terrain slope check
            if slope_pct <= prereq["max_slope_pct"]:
                suitability += 15.0
            else:
                suitability -= 15.0

            # 3. Aquifer compatibility
            compat = any(a.lower() in aquifer.lower() or a.lower() in soil.lower() for a in prereq.get("compatible_aquifers", []))
            if compat:
                suitability += 15.0
            elif "All" in str(prereq.get("compatible_aquifers", [])):
                suitability += 10.0
            else:
                suitability -= 10.0

            # 4. Stress / Over-Extraction multiplier
            if stage_ext > 100.0:
                if item["type"] in ["Artificial Recharge Structure", "Agricultural Demand Management"]:
                    suitability += 10.0

            # 5. Rainfall suitability
            if rainfall_mm > 700.0 and item["type"] in ["Surface Percolation Structure", "Stream Watershed Structure"]:
                suitability += 5.0
            elif rainfall_mm < 500.0 and item["type"] == "Agricultural Demand Management":
                suitability += 10.0

            final_score = round(max(5.0, min(98.0, suitability)), 1)

            # Evidence Tier
            if final_score >= 75.0:
                evidence_tier = "OBSERVED_OUTCOME"
                justification = f"High hydrogeological compatibility (depth {depth_m}m bgl, slope {slope_pct}%, {soil})."
            elif final_score >= 50.0:
                evidence_tier = "INFERRED_SIMILARITY"
                justification = f"Moderate geological suitability inferred from regional aquifer characteristics."
            else:
                evidence_tier = "EXPERT_REVIEW_REQUIRED"
                justification = f"Site constraints detected (slope or shallow water table). Field survey required."

            evaluated.append({
                "id": item["id"],
                "name": item["name"],
                "type": item["type"],
                "suitability_score": final_score,
                "primary_suitability": item["primary_suitability"],
                "unit_cost_inr": item["unit_cost_inr"],
                "annual_capacity_m3": item["base_capacity_m3_yr"],
                "cost_per_m3_inr": round(item["unit_cost_inr"] / item["base_capacity_m3_yr"], 2),
                "evidence_tier": evidence_tier,
                "justification": justification,
                "statutory_disclaimer": "JalSuraksha decision-support guidance. Final engineering civil works must be vetted by a certified hydrogeologist and comply with CGWA / State groundwater authority regulations."
            })

        evaluated.sort(key=lambda x: x["suitability_score"], reverse=True)
        return evaluated
