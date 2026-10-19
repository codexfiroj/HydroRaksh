/**
 * JalRakshak AI — 75 Uttar Pradesh Districts Hydrological & Planning Horizons Dataset
 * B.Tech CSE (Data Science + AI) Major Project Engine
 * Covers all 75 UP districts with temporal trajectories (2000 to 2035),
 * CGWB extraction stage, recharge suitability, soil, slope, and recommended structures.
 */

export interface TemporalDataPoint {
  year: number;
  depth_m: number;
  stress_score: number;
  category: "Safe" | "Semi-Critical" | "Critical" | "Over-Exploited";
  phase: string;
}

export interface RecommendedStructureItem {
  structure: string;
  capacity_m3_yr: number;
  unit_cost_inr: number;
  suitability: number;
  target: string;
}

export interface ModernWaterMetrics {
  groundwaterDepthM: number;
  groundwaterTrendAnnualCm: number;
  cgwbCategory: "Safe" | "Semi-Critical" | "Critical" | "Over-Exploited";
  cgwbStageExtractionPct: number;
  waterStressScore: number;
  majorRiverBasin: string;
  avgRainfallMm: number;
  annualDemandMcm: number;
  rainfallDeparturePct: number;
}

export interface WaterQualityMetrics {
  wqi: number;
  status: "Safe" | "Moderate" | "Poor" | "Requires Treatment";
  ph: number;
  tdsMgL: number;
  ecUsCm: number;
  fluorideMgL: number;
  arsenicMgL: number;
  nitrateMgL: number;
  observationDate: string;
  provenance: "Live" | "Delayed" | "Cached" | "Simulated" | "Unavailable";
  testingLab: string;
}

export interface BorewellFailureData {
  recordedFailures: number;
  monitoredBorewells: number;
  failureRatePct: number;
  casingFailureRiskPct: number;
  avgFailureDepthM: number;
  predominantCause: string;
  verifiedStatus: "Verified Registry" | "Pending Field Survey" | "Simulated Indicator" | "Unavailable";
  lastAuditDate: string;
}

export interface DistrictWaterEntity {
  id: string;
  name: string;
  stateCode?: string;
  stateName?: string;
  division?: string;
  region?: string;
  coordinates?: { lat: number; lng: number };
  waterStatus?: "good" | "critical" | "warning";
  centroid?: [number, number]; // [lat, lng]
  projected?: [number, number]; // [svgX, svgY]
  svgPath?: string;
  areaKm2?: number;
  soilType?: string;
  slopePct?: number;
  rechargeSuitabilityScore?: number;
  temporalTrajectory?: TemporalDataPoint[];
  modernWaterMetrics?: ModernWaterMetrics;
  waterQuality?: WaterQualityMetrics;
  borewellData?: BorewellFailureData;
  recommendedRechargeStructures?: RecommendedStructureItem[];
}

export const UP_75_WATER_DISTRICTS: DistrictWaterEntity[] = [
  {
    "id": "saharanpur",
    "name": "Saharanpur",
    "division": "Saharanpur",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 29.96,
      "lng": 77.55
    },
    "waterStatus": "warning",
    "centroid": [
      29.96,
      77.55
    ],
    "projected": [
      119.5,
      111.6
    ],
    "svgPath": "M 141.2,111.6 L 137.9,127.2 L 119.5,130.9 L 100.4,127.9 L 95.8,111.6 L 99.7,94.7 L 119.5,90.6 L 140.1,94.1 Z",
    "areaKm2": 3689,
    "soilType": "Alluvial Sandy Loam",
    "slopePct": 1.4,
    "rechargeSuitabilityScore": 91.8,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.48,
        "stress_score": 36.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 9.58,
        "stress_score": 39.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 10.68,
        "stress_score": 42.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 11.78,
        "stress_score": 44.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 12.88,
        "stress_score": 47.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 13.76,
        "stress_score": 49.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 14.2,
        "stress_score": 50.9,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 14.64,
        "stress_score": 52.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 15.08,
        "stress_score": 53.1,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 16.18,
        "stress_score": 55.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 14.2,
      "groundwaterTrendAnnualCm": -22,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 86.4,
      "waterStressScore": 38.0,
      "majorRiverBasin": "Yamuna & Hindon",
      "avgRainfallMm": 980,
      "annualDemandMcm": 412,
      "rainfallDeparturePct": 3.2
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "shamli",
    "name": "Shamli",
    "division": "Saharanpur",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 29.45,
      "lng": 77.31
    },
    "waterStatus": "critical",
    "centroid": [
      29.45,
      77.31
    ],
    "projected": [
      93.5,
      160.3
    ],
    "svgPath": "M 107.3,160.3 L 105.0,170.0 L 93.5,172.5 L 84.7,167.8 L 78.6,160.3 L 84.3,152.5 L 93.5,147.1 L 103.1,152.1 Z",
    "areaKm2": 1167,
    "soilType": "Deep Sandy Alluvium",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 80.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 14.92,
        "stress_score": 63.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 16.82,
        "stress_score": 68.6,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 18.72,
        "stress_score": 73.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 20.62,
        "stress_score": 78.2,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 22.52,
        "stress_score": 82.9,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 24.04,
        "stress_score": 86.7,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 24.8,
        "stress_score": 88.6,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 25.56,
        "stress_score": 90.5,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 26.32,
        "stress_score": 92.4,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 28.22,
        "stress_score": 97.1,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 24.8,
      "groundwaterTrendAnnualCm": -38,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 138.2,
      "waterStressScore": 80.4,
      "majorRiverBasin": "Yamuna Basin",
      "avgRainfallMm": 760,
      "annualDemandMcm": 380,
      "rainfallDeparturePct": -20.0
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "muzaffarnagar",
    "name": "Muzaffarnagar",
    "division": "Saharanpur",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 29.47,
      "lng": 77.7
    },
    "waterStatus": "critical",
    "centroid": [
      29.47,
      77.7
    ],
    "projected": [
      135.7,
      158.4
    ],
    "svgPath": "M 161.7,158.4 L 152.0,172.2 L 135.7,175.4 L 118.8,172.8 L 114.7,158.4 L 118.1,143.5 L 135.7,139.8 L 153.9,142.9 Z",
    "areaKm2": 2945,
    "soilType": "Alluvial Silt Loam",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 93.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 13.0,
        "stress_score": 57.0,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 14.75,
        "stress_score": 61.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 16.5,
        "stress_score": 65.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 18.25,
        "stress_score": 70.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 20.0,
        "stress_score": 74.5,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 21.4,
        "stress_score": 78.0,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 22.1,
        "stress_score": 79.8,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 22.8,
        "stress_score": 81.5,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 23.5,
        "stress_score": 83.2,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 25.25,
        "stress_score": 87.6,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 22.1,
      "groundwaterTrendAnnualCm": -35,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 124.5,
      "waterStressScore": 70.3,
      "majorRiverBasin": "Ganga & Kali",
      "avgRainfallMm": 820,
      "annualDemandMcm": 590,
      "rainfallDeparturePct": -13.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "baghpat",
    "name": "Baghpat",
    "division": "Meerut",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 28.94,
      "lng": 77.22
    },
    "waterStatus": "critical",
    "centroid": [
      28.94,
      77.22
    ],
    "projected": [
      83.8,
      209.0
    ],
    "svgPath": "M 99.4,209.0 L 93.4,217.2 L 83.8,222.8 L 73.8,217.5 L 67.0,209.0 L 73.3,200.1 L 83.8,194.2 L 94.7,199.7 Z",
    "areaKm2": 1321,
    "soilType": "Sandy Loam Alluvium",
    "slopePct": 0.9,
    "rechargeSuitabilityScore": 81.3,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 15.58,
        "stress_score": 68.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 17.68,
        "stress_score": 73.6,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 19.78,
        "stress_score": 78.8,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 21.88,
        "stress_score": 84.1,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 23.98,
        "stress_score": 89.3,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 25.66,
        "stress_score": 93.6,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 26.5,
        "stress_score": 95.7,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 27.34,
        "stress_score": 97.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 28.18,
        "stress_score": 99.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 30.28,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 26.5,
      "groundwaterTrendAnnualCm": -42,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 145.8,
      "waterStressScore": 89.3,
      "majorRiverBasin": "Yamuna Basin",
      "avgRainfallMm": 690,
      "annualDemandMcm": 340,
      "rainfallDeparturePct": -27.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "meerut",
    "name": "Meerut",
    "division": "Meerut",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 28.98,
      "lng": 77.7
    },
    "waterStatus": "warning",
    "centroid": [
      28.98,
      77.7
    ],
    "projected": [
      135.7,
      205.2
    ],
    "svgPath": "M 156.9,205.2 L 148.8,216.3 L 135.7,224.0 L 122.0,216.8 L 112.8,205.2 L 121.4,193.1 L 135.7,185.0 L 150.6,192.6 Z",
    "areaKm2": 2559,
    "soilType": "Fine Alluvial Silt",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 92.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 13.34,
        "stress_score": 55.0,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 14.89,
        "stress_score": 58.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 16.44,
        "stress_score": 62.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 17.99,
        "stress_score": 66.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 19.54,
        "stress_score": 70.5,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 20.78,
        "stress_score": 73.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 21.4,
        "stress_score": 75.2,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 22.02,
        "stress_score": 76.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 22.64,
        "stress_score": 78.3,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 24.19,
        "stress_score": 82.2,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 21.4,
      "groundwaterTrendAnnualCm": -31,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 98.4,
      "waterStressScore": 65.0,
      "majorRiverBasin": "Hindon & Kali",
      "avgRainfallMm": 840,
      "annualDemandMcm": 620,
      "rainfallDeparturePct": -11.6
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "ghaziabad",
    "name": "Ghaziabad",
    "division": "Meerut",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 28.67,
      "lng": 77.45
    },
    "waterStatus": "critical",
    "centroid": [
      28.67,
      77.45
    ],
    "projected": [
      108.6,
      234.8
    ],
    "svgPath": "M 121.7,234.8 L 116.8,241.8 L 108.6,243.4 L 100.1,242.0 L 98.1,234.8 L 99.7,227.3 L 108.6,225.4 L 117.8,227.0 Z",
    "areaKm2": 777,
    "soilType": "Deep Sandy Alluvium",
    "slopePct": 0.8,
    "rechargeSuitabilityScore": 81.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 16.72,
        "stress_score": 75.4,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 19.12,
        "stress_score": 81.4,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 21.52,
        "stress_score": 87.4,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 23.92,
        "stress_score": 93.4,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 26.32,
        "stress_score": 99.4,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 28.24,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 29.2,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 30.16,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 31.12,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 33.52,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 29.2,
      "groundwaterTrendAnnualCm": -48,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 154.2,
      "waterStressScore": 98,
      "majorRiverBasin": "Hindon Basin",
      "avgRainfallMm": 710,
      "annualDemandMcm": 480,
      "rainfallDeparturePct": -25.3
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "hapur",
    "name": "Hapur",
    "division": "Meerut",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 28.73,
      "lng": 77.78
    },
    "waterStatus": "warning",
    "centroid": [
      28.73,
      77.78
    ],
    "projected": [
      144.3,
      229.1
    ],
    "svgPath": "M 157.8,229.1 L 155.6,238.7 L 144.3,241.1 L 135.6,236.5 L 129.7,229.1 L 135.2,221.4 L 144.3,216.2 L 153.8,221.1 Z",
    "areaKm2": 1124,
    "soilType": "Alluvial Loam",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.52,
        "stress_score": 50.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.92,
        "stress_score": 54.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 15.32,
        "stress_score": 57.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 16.72,
        "stress_score": 61.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 18.12,
        "stress_score": 64.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 19.24,
        "stress_score": 67.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 19.8,
        "stress_score": 69.1,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 20.36,
        "stress_score": 70.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 20.92,
        "stress_score": 71.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 22.32,
        "stress_score": 75.4,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 19.8,
      "groundwaterTrendAnnualCm": -28,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 94.6,
      "waterStressScore": 60.5,
      "majorRiverBasin": "Ganga Basin",
      "avgRainfallMm": 790,
      "annualDemandMcm": 310,
      "rainfallDeparturePct": -16.8
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "gautam-buddha-nagar",
    "name": "Gautam Buddha Nagar",
    "division": "Meerut",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 28.35,
      "lng": 77.55
    },
    "waterStatus": "critical",
    "centroid": [
      28.35,
      77.55
    ],
    "projected": [
      119.5,
      265.4
    ],
    "svgPath": "M 135.6,265.4 L 129.4,273.8 L 119.5,279.6 L 109.1,274.2 L 102.1,265.4 L 108.7,256.2 L 119.5,250.1 L 130.8,255.8 Z",
    "areaKm2": 1442,
    "soilType": "Sandy Alluvium",
    "slopePct": 0.7,
    "rechargeSuitabilityScore": 81.9,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 16.9,
        "stress_score": 73.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 19.15,
        "stress_score": 79.4,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 21.4,
        "stress_score": 85.0,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 23.65,
        "stress_score": 90.6,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 25.9,
        "stress_score": 96.2,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 27.7,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 28.6,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 29.5,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 30.4,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 32.65,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 28.6,
      "groundwaterTrendAnnualCm": -45,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 142.1,
      "waterStressScore": 96.6,
      "majorRiverBasin": "Yamuna Basin",
      "avgRainfallMm": 680,
      "annualDemandMcm": 510,
      "rainfallDeparturePct": -28.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "bulandshahr",
    "name": "Bulandshahr",
    "division": "Meerut",
    "region": "Upper Doab",
    "coordinates": {
      "lat": 28.4,
      "lng": 77.85
    },
    "waterStatus": "warning",
    "centroid": [
      28.4,
      77.85
    ],
    "projected": [
      151.9,
      260.6
    ],
    "svgPath": "M 177.6,260.6 L 173.4,278.9 L 151.9,283.4 L 129.6,279.6 L 124.0,260.6 L 134.7,246.0 L 151.9,235.9 L 169.9,245.3 Z",
    "areaKm2": 4512,
    "soilType": "Alluvial Loam",
    "slopePct": 1.3,
    "rechargeSuitabilityScore": 92.1,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.7,
        "stress_score": 46.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.95,
        "stress_score": 49.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.2,
        "stress_score": 53.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 15.45,
        "stress_score": 56.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 16.7,
        "stress_score": 59.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 17.7,
        "stress_score": 61.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 18.2,
        "stress_score": 63.0,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 18.7,
        "stress_score": 64.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 19.2,
        "stress_score": 65.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 20.45,
        "stress_score": 68.6,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 18.2,
      "groundwaterTrendAnnualCm": -25,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 88.5,
      "waterStressScore": 55.8,
      "majorRiverBasin": "Ganga Basin",
      "avgRainfallMm": 750,
      "annualDemandMcm": 640,
      "rainfallDeparturePct": -21.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "amroha",
    "name": "Amroha",
    "division": "Moradabad",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 28.9,
      "lng": 78.47
    },
    "waterStatus": "warning",
    "centroid": [
      28.9,
      78.47
    ],
    "projected": [
      218.9,
      212.8
    ],
    "svgPath": "M 240.4,212.8 L 232.3,224.2 L 218.9,231.8 L 205.0,224.7 L 201.8,212.8 L 204.4,200.5 L 218.9,197.6 L 234.0,200.0 Z",
    "areaKm2": 2249,
    "soilType": "Silt Loam",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 80.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.4,
        "stress_score": 40.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 11.4,
        "stress_score": 42.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 12.4,
        "stress_score": 45.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 13.4,
        "stress_score": 47.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 14.4,
        "stress_score": 50.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 15.2,
        "stress_score": 52.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 15.6,
        "stress_score": 53.0,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 16.0,
        "stress_score": 54.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 16.4,
        "stress_score": 55.0,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 17.4,
        "stress_score": 57.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 15.6,
      "groundwaterTrendAnnualCm": -20,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 82.4,
      "waterStressScore": 42.0,
      "majorRiverBasin": "Ganga & Ban",
      "avgRainfallMm": 890,
      "annualDemandMcm": 390,
      "rainfallDeparturePct": -6.3
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "bijnor",
    "name": "Bijnor",
    "division": "Moradabad",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 29.37,
      "lng": 78.13
    },
    "waterStatus": "good",
    "centroid": [
      29.37,
      78.13
    ],
    "projected": [
      182.2,
      167.9
    ],
    "svgPath": "M 208.0,167.9 L 203.9,186.3 L 182.2,190.8 L 159.7,187.0 L 154.1,167.9 L 165.0,153.2 L 182.2,143.1 L 200.3,152.6 Z",
    "areaKm2": 4561,
    "soilType": "Coarse Alluvial Sand",
    "slopePct": 1.6,
    "rechargeSuitabilityScore": 91.2,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.08,
        "stress_score": 28.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.68,
        "stress_score": 30.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 9.28,
        "stress_score": 31.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 9.88,
        "stress_score": 33.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 10.48,
        "stress_score": 34.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 10.96,
        "stress_score": 35.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 11.2,
        "stress_score": 36.4,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 11.44,
        "stress_score": 37.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 11.68,
        "stress_score": 37.6,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 12.28,
        "stress_score": 39.1,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 11.2,
      "groundwaterTrendAnnualCm": -12,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 64.2,
      "waterStressScore": 21.4,
      "majorRiverBasin": "Ganga & Malin",
      "avgRainfallMm": 1050,
      "annualDemandMcm": 580,
      "rainfallDeparturePct": 10.5
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "moradabad",
    "name": "Moradabad",
    "division": "Moradabad",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 28.83,
      "lng": 78.78
    },
    "waterStatus": "warning",
    "centroid": [
      28.83,
      78.78
    ],
    "projected": [
      252.4,
      219.5
    ],
    "svgPath": "M 277.0,219.5 L 272.9,236.9 L 252.4,241.3 L 236.6,232.9 L 225.8,219.5 L 235.9,205.5 L 252.4,196.0 L 269.6,204.9 Z",
    "areaKm2": 3718,
    "soilType": "Ramganga Alluvium",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 80.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.16,
        "stress_score": 42.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 11.36,
        "stress_score": 45.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 12.56,
        "stress_score": 48.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 13.76,
        "stress_score": 51.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 14.96,
        "stress_score": 54.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 15.92,
        "stress_score": 56.6,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 16.4,
        "stress_score": 57.8,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 16.88,
        "stress_score": 59.0,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 17.36,
        "stress_score": 60.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 18.56,
        "stress_score": 63.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 16.4,
      "groundwaterTrendAnnualCm": -24,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 86.8,
      "waterStressScore": 46.1,
      "majorRiverBasin": "Ramganga Basin",
      "avgRainfallMm": 920,
      "annualDemandMcm": 540,
      "rainfallDeparturePct": -3.2
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "rampur",
    "name": "Rampur",
    "division": "Moradabad",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 28.81,
      "lng": 79.02
    },
    "waterStatus": "good",
    "centroid": [
      28.81,
      79.02
    ],
    "projected": [
      278.4,
      221.4
    ],
    "svgPath": "M 297.8,221.4 L 294.6,235.2 L 278.4,238.6 L 266.0,232.0 L 257.4,221.4 L 265.4,210.3 L 278.4,202.8 L 292.0,209.9 Z",
    "areaKm2": 2367,
    "soilType": "Fine Silt",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 81.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.9,
        "stress_score": 32.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 9.65,
        "stress_score": 34.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 10.4,
        "stress_score": 36.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 11.15,
        "stress_score": 38.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 11.9,
        "stress_score": 40.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 12.5,
        "stress_score": 41.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 12.8,
        "stress_score": 42.5,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 13.1,
        "stress_score": 43.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 13.4,
        "stress_score": 44.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 14.15,
        "stress_score": 45.9,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 12.8,
      "groundwaterTrendAnnualCm": -15,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 68.5,
      "waterStressScore": 29.9,
      "majorRiverBasin": "Kosi & Ramganga",
      "avgRainfallMm": 960,
      "annualDemandMcm": 380,
      "rainfallDeparturePct": 1.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "sambhal",
    "name": "Sambhal",
    "division": "Moradabad",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 28.58,
      "lng": 78.57
    },
    "waterStatus": "warning",
    "centroid": [
      28.58,
      78.57
    ],
    "projected": [
      229.7,
      243.4
    ],
    "svgPath": "M 251.3,243.4 L 243.1,254.8 L 229.7,262.5 L 215.7,255.3 L 206.4,243.4 L 215.1,231.0 L 229.7,228.2 L 244.9,230.5 Z",
    "areaKm2": 2453,
    "soilType": "Sandy Loam",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 80.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.78,
        "stress_score": 51.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.38,
        "stress_score": 55.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.98,
        "stress_score": 59.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 16.58,
        "stress_score": 63.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 18.18,
        "stress_score": 67.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 19.46,
        "stress_score": 71.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 20.1,
        "stress_score": 72.7,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 20.74,
        "stress_score": 74.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 21.38,
        "stress_score": 75.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 22.98,
        "stress_score": 79.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 20.1,
      "groundwaterTrendAnnualCm": -32,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 96.2,
      "waterStressScore": 63.8,
      "majorRiverBasin": "Sot & Ganga",
      "avgRainfallMm": 810,
      "annualDemandMcm": 410,
      "rainfallDeparturePct": -14.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "bareilly",
    "name": "Bareilly",
    "division": "Bareilly",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 28.36,
      "lng": 79.41
    },
    "waterStatus": "good",
    "centroid": [
      28.36,
      79.41
    ],
    "projected": [
      320.5,
      264.4
    ],
    "svgPath": "M 350.7,264.4 L 339.4,280.4 L 320.5,284.1 L 300.9,281.1 L 296.2,264.4 L 300.1,247.1 L 320.5,242.9 L 341.7,246.4 Z",
    "areaKm2": 4120,
    "soilType": "Fine Alluvial Silt",
    "slopePct": 1.3,
    "rechargeSuitabilityScore": 92.1,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 9.22,
        "stress_score": 35.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 10.12,
        "stress_score": 37.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 11.02,
        "stress_score": 40.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 11.92,
        "stress_score": 42.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 12.82,
        "stress_score": 44.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 13.54,
        "stress_score": 46.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 13.9,
        "stress_score": 47.4,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 14.26,
        "stress_score": 48.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 14.62,
        "stress_score": 49.1,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 15.52,
        "stress_score": 51.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 13.9,
      "groundwaterTrendAnnualCm": -18,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 69.4,
      "waterStressScore": 33.0,
      "majorRiverBasin": "Ramganga Basin",
      "avgRainfallMm": 1020,
      "annualDemandMcm": 620,
      "rainfallDeparturePct": 7.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "budaun",
    "name": "Budaun",
    "division": "Bareilly",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 28.03,
      "lng": 79.12
    },
    "waterStatus": "warning",
    "centroid": [
      28.03,
      79.12
    ],
    "projected": [
      289.2,
      295.9
    ],
    "svgPath": "M 320.0,295.9 L 308.2,312.1 L 289.2,323.1 L 269.3,312.8 L 256.0,295.9 L 268.5,278.3 L 289.2,266.6 L 310.8,277.6 Z",
    "areaKm2": 5168,
    "soilType": "Loamy Sand",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 80.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.74,
        "stress_score": 45.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.04,
        "stress_score": 48.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 13.34,
        "stress_score": 51.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 14.64,
        "stress_score": 54.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 15.94,
        "stress_score": 58.0,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 16.98,
        "stress_score": 60.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 17.5,
        "stress_score": 62.0,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 18.02,
        "stress_score": 63.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 18.54,
        "stress_score": 64.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 19.84,
        "stress_score": 67.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 17.5,
      "groundwaterTrendAnnualCm": -26,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 87.1,
      "waterStressScore": 52.7,
      "majorRiverBasin": "Sot & Ganga",
      "avgRainfallMm": 830,
      "annualDemandMcm": 590,
      "rainfallDeparturePct": -12.6
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "pilibhit",
    "name": "Pilibhit",
    "division": "Bareilly",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 28.63,
      "lng": 79.8
    },
    "waterStatus": "good",
    "centroid": [
      28.63,
      79.8
    ],
    "projected": [
      362.7,
      238.6
    ],
    "svgPath": "M 391.3,238.6 L 380.6,253.8 L 362.7,257.2 L 344.1,254.4 L 339.8,238.6 L 343.4,222.2 L 362.7,218.2 L 382.7,221.6 Z",
    "areaKm2": 3686,
    "soilType": "Terai Alluvium",
    "slopePct": 0.8,
    "rechargeSuitabilityScore": 81.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 6.1,
        "stress_score": 18.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 6.35,
        "stress_score": 19.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 6.6,
        "stress_score": 20.0,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 6.85,
        "stress_score": 20.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 7.1,
        "stress_score": 21.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 7.3,
        "stress_score": 21.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 7.4,
        "stress_score": 22.0,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 7.5,
        "stress_score": 22.2,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 7.6,
        "stress_score": 22.5,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 7.85,
        "stress_score": 23.1,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 7.4,
      "groundwaterTrendAnnualCm": -5,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 48.6,
      "waterStressScore": 12,
      "majorRiverBasin": "Gomti & Sharda",
      "avgRainfallMm": 1250,
      "annualDemandMcm": 460,
      "rainfallDeparturePct": 31.6
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "shahjahanpur",
    "name": "Shahjahanpur",
    "division": "Bareilly",
    "region": "Rohilkhand",
    "coordinates": {
      "lat": 27.88,
      "lng": 79.91
    },
    "waterStatus": "good",
    "centroid": [
      27.88,
      79.91
    ],
    "projected": [
      374.6,
      310.3
    ],
    "svgPath": "M 405.2,310.3 L 393.7,326.5 L 374.6,337.3 L 354.7,327.2 L 350.1,310.3 L 353.9,292.7 L 374.6,288.5 L 396.0,292.1 Z",
    "areaKm2": 4388,
    "soilType": "Clayey Silt",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 81.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.46,
        "stress_score": 31.0,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 9.16,
        "stress_score": 32.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 9.86,
        "stress_score": 34.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 10.56,
        "stress_score": 36.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 11.26,
        "stress_score": 37.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 11.82,
        "stress_score": 39.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 12.1,
        "stress_score": 40.0,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 12.38,
        "stress_score": 40.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 12.66,
        "stress_score": 41.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 13.36,
        "stress_score": 43.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 12.1,
      "groundwaterTrendAnnualCm": -14,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 65.3,
      "waterStressScore": 27.0,
      "majorRiverBasin": "Garra & Ramganga",
      "avgRainfallMm": 980,
      "annualDemandMcm": 510,
      "rainfallDeparturePct": 3.2
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "aligarh",
    "name": "Aligarh",
    "division": "Aligarh",
    "region": "Braj",
    "coordinates": {
      "lat": 27.89,
      "lng": 78.08
    },
    "waterStatus": "critical",
    "centroid": [
      27.89,
      78.08
    ],
    "projected": [
      176.8,
      309.3
    ],
    "svgPath": "M 198.5,309.3 L 195.2,325.0 L 176.8,328.6 L 157.7,325.6 L 153.0,309.3 L 156.9,292.4 L 176.8,288.2 L 197.4,291.8 Z",
    "areaKm2": 3700,
    "soilType": "Saline / Silt Loam",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 80.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 14.04,
        "stress_score": 60.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 15.84,
        "stress_score": 64.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 17.64,
        "stress_score": 69.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 19.44,
        "stress_score": 73.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 21.24,
        "stress_score": 78.3,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 22.68,
        "stress_score": 81.9,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 23.4,
        "stress_score": 83.7,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 24.12,
        "stress_score": 85.5,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 24.84,
        "stress_score": 87.3,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 26.64,
        "stress_score": 91.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 23.4,
      "groundwaterTrendAnnualCm": -36,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 118.4,
      "waterStressScore": 76.9,
      "majorRiverBasin": "Yamuna & Karwan",
      "avgRainfallMm": 720,
      "annualDemandMcm": 560,
      "rainfallDeparturePct": -24.2
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "etah",
    "name": "Etah",
    "division": "Aligarh",
    "region": "Braj / Doab",
    "coordinates": {
      "lat": 27.56,
      "lng": 78.66
    },
    "waterStatus": "warning",
    "centroid": [
      27.56,
      78.66
    ],
    "projected": [
      239.5,
      340.8
    ],
    "svgPath": "M 257.6,340.8 L 254.8,353.8 L 239.5,356.9 L 223.6,354.3 L 219.7,340.8 L 223.0,326.8 L 239.5,323.3 L 252.2,330.0 Z",
    "areaKm2": 2456,
    "soilType": "Alluvial Loam",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.18,
        "stress_score": 43.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.28,
        "stress_score": 46.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 13.38,
        "stress_score": 48.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 14.48,
        "stress_score": 51.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 15.58,
        "stress_score": 54.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 16.46,
        "stress_score": 56.6,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 16.9,
        "stress_score": 57.6,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 17.34,
        "stress_score": 58.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 17.78,
        "stress_score": 59.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 18.88,
        "stress_score": 62.6,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 16.9,
      "groundwaterTrendAnnualCm": -22,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 84.2,
      "waterStressScore": 50.8,
      "majorRiverBasin": "Isan & Kali",
      "avgRainfallMm": 740,
      "annualDemandMcm": 380,
      "rainfallDeparturePct": -22.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "hathras",
    "name": "Hathras",
    "division": "Aligarh",
    "region": "Braj",
    "coordinates": {
      "lat": 27.6,
      "lng": 78.05
    },
    "waterStatus": "critical",
    "centroid": [
      27.6,
      78.05
    ],
    "projected": [
      173.5,
      337.0
    ],
    "svgPath": "M 189.0,337.0 L 186.6,348.2 L 173.5,350.8 L 159.9,348.6 L 156.6,337.0 L 159.4,325.0 L 173.5,322.0 L 184.3,327.8 Z",
    "areaKm2": 1840,
    "soilType": "Sandy Alluvium",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 81.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 14.48,
        "stress_score": 62.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 16.33,
        "stress_score": 66.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 18.18,
        "stress_score": 71.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 20.03,
        "stress_score": 76.0,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 21.88,
        "stress_score": 80.6,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 23.36,
        "stress_score": 84.3,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 24.1,
        "stress_score": 86.2,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 24.84,
        "stress_score": 88.0,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 25.58,
        "stress_score": 89.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 27.43,
        "stress_score": 94.5,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 24.1,
      "groundwaterTrendAnnualCm": -37,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 128.6,
      "waterStressScore": 80.0,
      "majorRiverBasin": "Karwan Basin",
      "avgRainfallMm": 690,
      "annualDemandMcm": 350,
      "rainfallDeparturePct": -27.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "kasganj",
    "name": "Kasganj",
    "division": "Aligarh",
    "region": "Braj / Doab",
    "coordinates": {
      "lat": 27.8,
      "lng": 78.64
    },
    "waterStatus": "good",
    "centroid": [
      27.8,
      78.64
    ],
    "projected": [
      237.3,
      317.9
    ],
    "svgPath": "M 254.6,317.9 L 251.7,330.2 L 237.3,333.2 L 222.3,330.6 L 218.5,317.9 L 225.7,308.1 L 237.3,301.3 L 249.4,307.6 Z",
    "areaKm2": 1955,
    "soilType": "Alluvial Silt",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.36,
        "stress_score": 39.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 11.31,
        "stress_score": 41.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 12.26,
        "stress_score": 43.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 13.21,
        "stress_score": 46.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 14.16,
        "stress_score": 48.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 14.92,
        "stress_score": 50.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 15.3,
        "stress_score": 51.5,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 15.68,
        "stress_score": 52.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 16.06,
        "stress_score": 53.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 17.01,
        "stress_score": 55.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 15.3,
      "groundwaterTrendAnnualCm": -19,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 69.8,
      "waterStressScore": 43.7,
      "majorRiverBasin": "Ganga & Kali",
      "avgRainfallMm": 780,
      "annualDemandMcm": 310,
      "rainfallDeparturePct": -17.9
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "agra",
    "name": "Agra",
    "division": "Agra",
    "region": "Braj",
    "coordinates": {
      "lat": 27.18,
      "lng": 78.0
    },
    "waterStatus": "critical",
    "centroid": [
      27.18,
      78.0
    ],
    "projected": [
      168.1,
      377.1
    ],
    "svgPath": "M 191.3,377.1 L 187.7,393.8 L 168.1,397.8 L 147.7,394.4 L 142.7,377.1 L 147.0,359.1 L 168.1,354.6 L 184.3,363.3 Z",
    "areaKm2": 4041,
    "soilType": "Alluvial Sandy Loam",
    "slopePct": 1.8,
    "rechargeSuitabilityScore": 90.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 16.36,
        "stress_score": 71.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 18.56,
        "stress_score": 77.2,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 20.76,
        "stress_score": 82.7,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 22.96,
        "stress_score": 88.2,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 25.16,
        "stress_score": 93.7,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 26.92,
        "stress_score": 98.1,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 27.8,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 28.68,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 29.56,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 31.76,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 27.8,
      "groundwaterTrendAnnualCm": -44,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 134.5,
      "waterStressScore": 94.4,
      "majorRiverBasin": "Yamuna & Utangan",
      "avgRainfallMm": 670,
      "annualDemandMcm": 680,
      "rainfallDeparturePct": -29.5
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "firozabad",
    "name": "Firozabad",
    "division": "Agra",
    "region": "Braj",
    "coordinates": {
      "lat": 27.15,
      "lng": 78.39
    },
    "waterStatus": "critical",
    "centroid": [
      27.15,
      78.39
    ],
    "projected": [
      210.3,
      380.0
    ],
    "svgPath": "M 230.1,380.0 L 226.8,394.0 L 210.3,397.5 L 197.6,390.8 L 188.9,380.0 L 197.0,368.7 L 210.3,361.1 L 224.1,368.2 Z",
    "areaKm2": 2407,
    "soilType": "Sandy Silt",
    "slopePct": 1.5,
    "rechargeSuitabilityScore": 79.5,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 15.2,
        "stress_score": 66.0,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 17.2,
        "stress_score": 71.0,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 19.2,
        "stress_score": 76.0,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 21.2,
        "stress_score": 81.0,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 23.2,
        "stress_score": 86.0,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 24.8,
        "stress_score": 90.0,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 25.6,
        "stress_score": 92.0,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 26.4,
        "stress_score": 94.0,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 27.2,
        "stress_score": 96.0,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 29.2,
        "stress_score": 100,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 25.6,
      "groundwaterTrendAnnualCm": -40,
      "cgwbCategory": "Over-Exploited",
      "cgwbStageExtractionPct": 126.8,
      "waterStressScore": 85.7,
      "majorRiverBasin": "Yamuna & Sirsa",
      "avgRainfallMm": 690,
      "annualDemandMcm": 420,
      "rainfallDeparturePct": -27.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "mainpuri",
    "name": "Mainpuri",
    "division": "Agra",
    "region": "Braj / Doab",
    "coordinates": {
      "lat": 27.23,
      "lng": 79.02
    },
    "waterStatus": "warning",
    "centroid": [
      27.23,
      79.02
    ],
    "projected": [
      278.4,
      372.4
    ],
    "svgPath": "M 297.4,372.4 L 294.5,386.1 L 278.4,389.3 L 261.7,386.6 L 257.7,372.4 L 261.1,357.7 L 278.4,354.0 L 291.7,361.1 Z",
    "areaKm2": 2760,
    "soilType": "Alluvial Loam",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 92.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.74,
        "stress_score": 44.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.79,
        "stress_score": 46.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 13.84,
        "stress_score": 49.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 14.89,
        "stress_score": 51.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 15.94,
        "stress_score": 54.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 16.78,
        "stress_score": 56.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 17.2,
        "stress_score": 57.7,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 17.62,
        "stress_score": 58.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 18.04,
        "stress_score": 59.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 19.09,
        "stress_score": 62.4,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 17.2,
      "groundwaterTrendAnnualCm": -21,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 86.4,
      "waterStressScore": 50.1,
      "majorRiverBasin": "Isan & Arind",
      "avgRainfallMm": 760,
      "annualDemandMcm": 390,
      "rainfallDeparturePct": -20.0
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "mathura",
    "name": "Mathura",
    "division": "Agra",
    "region": "Braj",
    "coordinates": {
      "lat": 27.49,
      "lng": 77.67
    },
    "waterStatus": "warning",
    "centroid": [
      27.49,
      77.67
    ],
    "projected": [
      132.4,
      347.5
    ],
    "svgPath": "M 154.0,347.5 L 150.6,362.9 L 132.4,366.7 L 113.6,363.5 L 108.9,347.5 L 112.9,330.9 L 132.4,326.7 L 147.5,334.7 Z",
    "areaKm2": 3329,
    "soilType": "Saline Sandy Loam",
    "slopePct": 1.4,
    "rechargeSuitabilityScore": 79.8,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 14.06,
        "stress_score": 58.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 15.76,
        "stress_score": 63.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 17.46,
        "stress_score": 67.5,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 19.16,
        "stress_score": 71.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 20.86,
        "stress_score": 75.9,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 22.22,
        "stress_score": 79.3,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 22.9,
        "stress_score": 81.0,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 23.58,
        "stress_score": 82.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 24.26,
        "stress_score": 84.5,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 25.96,
        "stress_score": 88.7,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 22.9,
      "groundwaterTrendAnnualCm": -34,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 98.7,
      "waterStressScore": 77.3,
      "majorRiverBasin": "Yamuna Basin",
      "avgRainfallMm": 610,
      "annualDemandMcm": 540,
      "rainfallDeparturePct": -35.8
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "auraiya",
    "name": "Auraiya",
    "division": "Kanpur",
    "region": "Doab",
    "coordinates": {
      "lat": 26.46,
      "lng": 79.51
    },
    "waterStatus": "warning",
    "centroid": [
      26.46,
      79.51
    ],
    "projected": [
      331.4,
      445.9
    ],
    "svgPath": "M 352.9,445.9 L 344.9,457.3 L 331.4,460.0 L 317.4,457.8 L 314.1,445.9 L 316.9,433.5 L 331.4,430.5 L 346.5,433.1 Z",
    "areaKm2": 2016,
    "soilType": "Ravine Silt Alluvium",
    "slopePct": 2.2,
    "rechargeSuitabilityScore": 77.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.3,
        "stress_score": 42.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.3,
        "stress_score": 44.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 13.3,
        "stress_score": 47.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 14.3,
        "stress_score": 49.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 15.3,
        "stress_score": 52.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 16.1,
        "stress_score": 54.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 16.5,
        "stress_score": 55.2,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 16.9,
        "stress_score": 56.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 17.3,
        "stress_score": 57.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 18.3,
        "stress_score": 59.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 16.5,
      "groundwaterTrendAnnualCm": -20,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 81.5,
      "waterStressScore": 47.2,
      "majorRiverBasin": "Yamuna & Sengar",
      "avgRainfallMm": 780,
      "annualDemandMcm": 320,
      "rainfallDeparturePct": -17.9
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "etawah",
    "name": "Etawah",
    "division": "Kanpur",
    "region": "Doab",
    "coordinates": {
      "lat": 26.78,
      "lng": 79.03
    },
    "waterStatus": "warning",
    "centroid": [
      26.78,
      79.03
    ],
    "projected": [
      279.5,
      415.3
    ],
    "svgPath": "M 297.5,415.3 L 294.6,428.2 L 279.5,431.3 L 263.8,428.6 L 259.9,415.3 L 263.2,401.5 L 279.5,398.0 L 292.1,404.6 Z",
    "areaKm2": 2311,
    "soilType": "Chambal Ravine Silt",
    "slopePct": 2.5,
    "rechargeSuitabilityScore": 76.5,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.16,
        "stress_score": 47.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.36,
        "stress_score": 50.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.56,
        "stress_score": 53.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 15.76,
        "stress_score": 56.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 16.96,
        "stress_score": 59.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 17.92,
        "stress_score": 61.6,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 18.4,
        "stress_score": 62.8,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 18.88,
        "stress_score": 64.0,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 19.36,
        "stress_score": 65.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 20.56,
        "stress_score": 68.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 18.4,
      "groundwaterTrendAnnualCm": -24,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 84.8,
      "waterStressScore": 55.4,
      "majorRiverBasin": "Chambal & Yamuna",
      "avgRainfallMm": 750,
      "annualDemandMcm": 360,
      "rainfallDeparturePct": -21.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "farrukhabad",
    "name": "Farrukhabad",
    "division": "Kanpur",
    "region": "Doab",
    "coordinates": {
      "lat": 27.38,
      "lng": 79.58
    },
    "waterStatus": "good",
    "centroid": [
      27.38,
      79.58
    ],
    "projected": [
      338.9,
      358.0
    ],
    "svgPath": "M 360.7,358.0 L 352.5,369.6 L 338.9,372.2 L 324.7,370.0 L 321.4,358.0 L 324.2,345.5 L 338.9,342.5 L 354.2,345.0 Z",
    "areaKm2": 2183,
    "soilType": "Alluvial Fine Sand",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 9.34,
        "stress_score": 34.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 10.14,
        "stress_score": 36.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 10.94,
        "stress_score": 38.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 11.74,
        "stress_score": 40.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 12.54,
        "stress_score": 42.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 13.18,
        "stress_score": 44.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 13.5,
        "stress_score": 45.0,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 13.82,
        "stress_score": 45.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 14.14,
        "stress_score": 46.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 14.94,
        "stress_score": 48.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 13.5,
      "groundwaterTrendAnnualCm": -16,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 67.2,
      "waterStressScore": 36.2,
      "majorRiverBasin": "Ganga & Ramganga",
      "avgRainfallMm": 820,
      "annualDemandMcm": 370,
      "rainfallDeparturePct": -13.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "kannauj",
    "name": "Kannauj",
    "division": "Kanpur",
    "region": "Doab",
    "coordinates": {
      "lat": 27.05,
      "lng": 79.91
    },
    "waterStatus": "good",
    "centroid": [
      27.05,
      79.91
    ],
    "projected": [
      374.6,
      389.6
    ],
    "svgPath": "M 395.2,389.6 L 387.4,400.5 L 374.6,407.7 L 361.3,400.9 L 358.3,389.6 L 360.7,377.8 L 374.6,375.1 L 389.0,377.4 Z",
    "areaKm2": 2093,
    "soilType": "Alluvial Loam",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 92.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.12,
        "stress_score": 37.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 11.02,
        "stress_score": 40.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 11.92,
        "stress_score": 42.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 12.82,
        "stress_score": 44.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 13.72,
        "stress_score": 46.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 14.44,
        "stress_score": 48.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 14.8,
        "stress_score": 49.6,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 15.16,
        "stress_score": 50.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 15.52,
        "stress_score": 51.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 16.42,
        "stress_score": 53.7,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 14.8,
      "groundwaterTrendAnnualCm": -18,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 69.5,
      "waterStressScore": 40.1,
      "majorRiverBasin": "Ganga & Kali",
      "avgRainfallMm": 840,
      "annualDemandMcm": 350,
      "rainfallDeparturePct": -11.6
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "kanpur-dehat",
    "name": "Kanpur Dehat",
    "division": "Kanpur",
    "region": "Doab",
    "coordinates": {
      "lat": 26.44,
      "lng": 79.95
    },
    "waterStatus": "warning",
    "centroid": [
      26.44,
      79.95
    ],
    "projected": [
      378.9,
      447.8
    ],
    "svgPath": "M 399.7,447.8 L 396.4,462.6 L 378.9,466.2 L 360.8,463.2 L 356.3,447.8 L 365.0,436.0 L 378.9,427.8 L 393.4,435.5 Z",
    "areaKm2": 3021,
    "soilType": "Indo-Gangetic Alluvium",
    "slopePct": 1.3,
    "rechargeSuitabilityScore": 80.1,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.82,
        "stress_score": 45.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.97,
        "stress_score": 48.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.12,
        "stress_score": 51.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 15.27,
        "stress_score": 54.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 16.42,
        "stress_score": 57.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 17.34,
        "stress_score": 59.5,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 17.8,
        "stress_score": 60.6,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 18.26,
        "stress_score": 61.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 18.72,
        "stress_score": 62.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 19.87,
        "stress_score": 65.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 17.8,
      "groundwaterTrendAnnualCm": -23,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 86.0,
      "waterStressScore": 51.6,
      "majorRiverBasin": "Yamuna & Rind",
      "avgRainfallMm": 810,
      "annualDemandMcm": 410,
      "rainfallDeparturePct": -14.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "kanpur-nagar",
    "name": "Kanpur Nagar",
    "division": "Kanpur",
    "region": "Doab",
    "coordinates": {
      "lat": 26.45,
      "lng": 80.33
    },
    "waterStatus": "warning",
    "centroid": [
      26.45,
      80.33
    ],
    "projected": [
      420.0,
      446.9
    ],
    "svgPath": "M 440.8,446.9 L 437.5,461.8 L 420.0,465.3 L 401.8,462.4 L 397.4,446.9 L 401.1,430.9 L 420.0,426.8 L 434.5,434.6 Z",
    "areaKm2": 3155,
    "soilType": "Alluvial Heavy Clay",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 14.16,
        "stress_score": 62.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 16.11,
        "stress_score": 67.6,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 18.06,
        "stress_score": 72.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 20.01,
        "stress_score": 77.3,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 21.96,
        "stress_score": 82.2,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 23.52,
        "stress_score": 86.1,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 24.3,
        "stress_score": 88.0,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 25.08,
        "stress_score": 90.0,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 25.86,
        "stress_score": 92.0,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 27.81,
        "stress_score": 96.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 24.3,
      "groundwaterTrendAnnualCm": -39,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 98.2,
      "waterStressScore": 78.4,
      "majorRiverBasin": "Ganga & Pandu",
      "avgRainfallMm": 820,
      "annualDemandMcm": 780,
      "rainfallDeparturePct": -13.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "hardoi",
    "name": "Hardoi",
    "division": "Lucknow",
    "region": "Awadh",
    "coordinates": {
      "lat": 27.39,
      "lng": 80.13
    },
    "waterStatus": "good",
    "centroid": [
      27.39,
      80.13
    ],
    "projected": [
      398.4,
      357.1
    ],
    "svgPath": "M 434.8,357.1 L 421.1,376.4 L 398.4,380.9 L 374.7,377.2 L 369.2,357.1 L 373.8,336.2 L 398.4,331.1 L 423.9,335.4 Z",
    "areaKm2": 5986,
    "soilType": "Alluvial Loam",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 93.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.26,
        "stress_score": 30.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.96,
        "stress_score": 32.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 9.66,
        "stress_score": 33.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 10.36,
        "stress_score": 35.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 11.06,
        "stress_score": 37.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 11.62,
        "stress_score": 38.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 11.9,
        "stress_score": 39.5,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 12.18,
        "stress_score": 40.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 12.46,
        "stress_score": 41.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 13.16,
        "stress_score": 42.7,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 11.9,
      "groundwaterTrendAnnualCm": -14,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 62.4,
      "waterStressScore": 28.5,
      "majorRiverBasin": "Gomti & Sai",
      "avgRainfallMm": 910,
      "annualDemandMcm": 620,
      "rainfallDeparturePct": -4.2
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "kheri",
    "name": "Lakhimpur Kheri",
    "division": "Lucknow",
    "region": "Terai / Awadh",
    "coordinates": {
      "lat": 27.94,
      "lng": 80.77
    },
    "waterStatus": "good",
    "centroid": [
      27.94,
      80.77
    ],
    "projected": [
      467.6,
      304.5
    ],
    "svgPath": "M 507.7,304.5 L 492.6,325.7 L 467.6,339.9 L 441.6,326.6 L 435.6,304.5 L 440.5,281.5 L 467.6,276.0 L 495.7,280.6 Z",
    "areaKm2": 7680,
    "soilType": "Terai Clayey Loam",
    "slopePct": 0.6,
    "rechargeSuitabilityScore": 82.2,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 5.76,
        "stress_score": 17.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 5.96,
        "stress_score": 17.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 6.16,
        "stress_score": 18.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 6.36,
        "stress_score": 18.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 6.56,
        "stress_score": 19.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 6.72,
        "stress_score": 19.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 6.8,
        "stress_score": 19.8,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 6.88,
        "stress_score": 20.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 6.96,
        "stress_score": 20.2,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 7.16,
        "stress_score": 20.7,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 6.8,
      "groundwaterTrendAnnualCm": -4,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 38.5,
      "waterStressScore": 12,
      "majorRiverBasin": "Sharda & Ghaghara",
      "avgRainfallMm": 1280,
      "annualDemandMcm": 590,
      "rainfallDeparturePct": 34.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "lucknow",
    "name": "Lucknow",
    "division": "Lucknow",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.84,
      "lng": 80.94
    },
    "waterStatus": "warning",
    "centroid": [
      26.84,
      80.94
    ],
    "projected": [
      485.9,
      409.6
    ],
    "svgPath": "M 510.0,409.6 L 501.0,422.4 L 485.9,425.4 L 470.2,422.9 L 466.5,409.6 L 469.6,395.8 L 485.9,392.4 L 502.8,395.3 Z",
    "areaKm2": 2528,
    "soilType": "Gomti Alluvial Silt",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.24,
        "stress_score": 55.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 14.04,
        "stress_score": 60.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 15.84,
        "stress_score": 64.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 17.64,
        "stress_score": 69.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 19.44,
        "stress_score": 73.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 20.88,
        "stress_score": 77.4,
        "category": "Over-Exploited",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 21.6,
        "stress_score": 79.2,
        "category": "Over-Exploited",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 22.32,
        "stress_score": 81.0,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 23.04,
        "stress_score": 82.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 24.84,
        "stress_score": 87.3,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 21.6,
      "groundwaterTrendAnnualCm": -36,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 97.4,
      "waterStressScore": 68.0,
      "majorRiverBasin": "Gomti Basin",
      "avgRainfallMm": 890,
      "annualDemandMcm": 690,
      "rainfallDeparturePct": -6.3
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "raebareli",
    "name": "Raebareli",
    "division": "Lucknow",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.22,
      "lng": 81.24
    },
    "waterStatus": "warning",
    "centroid": [
      26.22,
      81.24
    ],
    "projected": [
      518.4,
      468.8
    ],
    "svgPath": "M 543.8,468.8 L 539.8,487.0 L 518.4,491.3 L 496.2,487.7 L 490.7,468.8 L 495.4,449.3 L 518.4,444.3 L 536.1,453.7 Z",
    "areaKm2": 4609,
    "soilType": "Alluvial Clay Loam",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 92.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.16,
        "stress_score": 38.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 11.11,
        "stress_score": 41.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 12.06,
        "stress_score": 43.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 13.01,
        "stress_score": 45.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 13.96,
        "stress_score": 48.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 14.72,
        "stress_score": 50.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 15.1,
        "stress_score": 51.0,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 15.48,
        "stress_score": 52.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 15.86,
        "stress_score": 52.9,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 16.81,
        "stress_score": 55.3,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 15.1,
      "groundwaterTrendAnnualCm": -19,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 79.2,
      "waterStressScore": 40.7,
      "majorRiverBasin": "Ganga & Sai",
      "avgRainfallMm": 870,
      "annualDemandMcm": 480,
      "rainfallDeparturePct": -8.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "sitapur",
    "name": "Sitapur",
    "division": "Lucknow",
    "region": "Awadh",
    "coordinates": {
      "lat": 27.56,
      "lng": 80.68
    },
    "waterStatus": "good",
    "centroid": [
      27.56,
      80.68
    ],
    "projected": [
      457.8,
      340.8
    ],
    "svgPath": "M 489.0,340.8 L 476.9,357.1 L 457.8,368.4 L 437.8,357.8 L 424.1,340.8 L 436.9,323.0 L 457.8,311.0 L 479.6,322.2 Z",
    "areaKm2": 5743,
    "soilType": "Alluvial Silt",
    "slopePct": 0.9,
    "rechargeSuitabilityScore": 93.3,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 7.12,
        "stress_score": 23.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 7.52,
        "stress_score": 24.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 7.92,
        "stress_score": 25.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 8.32,
        "stress_score": 26.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 8.72,
        "stress_score": 27.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 9.04,
        "stress_score": 28.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 9.2,
        "stress_score": 28.6,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 9.36,
        "stress_score": 29.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 9.52,
        "stress_score": 29.4,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 9.92,
        "stress_score": 30.4,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 9.2,
      "groundwaterTrendAnnualCm": -8,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 54.1,
      "waterStressScore": 13.8,
      "majorRiverBasin": "Gomti & Sarayan",
      "avgRainfallMm": 1050,
      "annualDemandMcm": 560,
      "rainfallDeparturePct": 10.5
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "unnao",
    "name": "Unnao",
    "division": "Lucknow",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.54,
      "lng": 80.49
    },
    "waterStatus": "warning",
    "centroid": [
      26.54,
      80.49
    ],
    "projected": [
      437.3,
      438.3
    ],
    "svgPath": "M 467.4,438.3 L 455.9,454.1 L 437.3,464.8 L 417.9,454.8 L 405.0,438.3 L 417.0,421.1 L 437.3,417.1 L 458.4,420.4 Z",
    "areaKm2": 4558,
    "soilType": "Alluvial Silt Loam",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.74,
        "stress_score": 41.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 11.79,
        "stress_score": 44.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 12.84,
        "stress_score": 46.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 13.89,
        "stress_score": 49.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 14.94,
        "stress_score": 52.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 15.78,
        "stress_score": 54.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 16.2,
        "stress_score": 55.2,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 16.62,
        "stress_score": 56.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 17.04,
        "stress_score": 57.3,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 18.09,
        "stress_score": 59.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 16.2,
      "groundwaterTrendAnnualCm": -21,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 83.5,
      "waterStressScore": 45.3,
      "majorRiverBasin": "Ganga & Sai",
      "avgRainfallMm": 850,
      "annualDemandMcm": 510,
      "rainfallDeparturePct": -10.5
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "amethi",
    "name": "Amethi",
    "division": "Ayodhya",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.15,
      "lng": 81.81
    },
    "waterStatus": "good",
    "centroid": [
      26.15,
      81.81
    ],
    "projected": [
      580.0,
      475.5
    ],
    "svgPath": "M 597.2,475.5 L 594.6,487.9 L 580.0,490.8 L 564.8,488.4 L 561.1,475.5 L 564.2,462.1 L 580.0,458.8 L 596.3,461.6 Z",
    "areaKm2": 2329,
    "soilType": "Alluvial Loam",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 9.78,
        "stress_score": 36.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 10.63,
        "stress_score": 38.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 11.48,
        "stress_score": 40.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 12.33,
        "stress_score": 42.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 13.18,
        "stress_score": 44.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 13.86,
        "stress_score": 46.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 14.2,
        "stress_score": 47.4,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 14.54,
        "stress_score": 48.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 14.88,
        "stress_score": 49.1,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 15.73,
        "stress_score": 51.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 14.2,
      "groundwaterTrendAnnualCm": -17,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 68.2,
      "waterStressScore": 35.4,
      "majorRiverBasin": "Gomti & Sai",
      "avgRainfallMm": 930,
      "annualDemandMcm": 340,
      "rainfallDeparturePct": -2.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "ayodhya",
    "name": "Ayodhya",
    "division": "Ayodhya",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.79,
      "lng": 82.19
    },
    "waterStatus": "good",
    "centroid": [
      26.79,
      82.19
    ],
    "projected": [
      621.1,
      414.4
    ],
    "svgPath": "M 639.6,414.4 L 636.6,427.6 L 621.1,430.8 L 605.0,428.1 L 601.0,414.4 L 608.7,403.9 L 621.1,396.6 L 634.0,403.4 Z",
    "areaKm2": 2341,
    "soilType": "Saryu Alluvium",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 81.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 7.8,
        "stress_score": 26.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.3,
        "stress_score": 27.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 8.8,
        "stress_score": 29.0,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 9.3,
        "stress_score": 30.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 9.8,
        "stress_score": 31.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 10.2,
        "stress_score": 32.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 10.4,
        "stress_score": 33.0,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 10.6,
        "stress_score": 33.5,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 10.8,
        "stress_score": 34.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 11.3,
        "stress_score": 35.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 10.4,
      "groundwaterTrendAnnualCm": -10,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 58.4,
      "waterStressScore": 18.3,
      "majorRiverBasin": "Saryu (Ghaghara)",
      "avgRainfallMm": 1040,
      "annualDemandMcm": 410,
      "rainfallDeparturePct": 9.5
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "barabanki",
    "name": "Barabanki",
    "division": "Ayodhya",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.92,
      "lng": 81.18
    },
    "waterStatus": "good",
    "centroid": [
      26.92,
      81.18
    ],
    "projected": [
      511.9,
      402.0
    ],
    "svgPath": "M 542.0,402.0 L 530.6,417.9 L 511.9,428.5 L 492.4,418.6 L 487.9,402.0 L 491.6,384.7 L 511.9,380.7 L 533.0,384.1 Z",
    "areaKm2": 4402,
    "soilType": "Alluvial Loam",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 93.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.5,
        "stress_score": 31.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 9.25,
        "stress_score": 33.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 10.0,
        "stress_score": 35.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 10.75,
        "stress_score": 37.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 11.5,
        "stress_score": 39.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 12.1,
        "stress_score": 40.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 12.4,
        "stress_score": 41.5,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 12.7,
        "stress_score": 42.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 13.0,
        "stress_score": 43.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 13.75,
        "stress_score": 44.9,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 12.4,
      "groundwaterTrendAnnualCm": -15,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 64.8,
      "waterStressScore": 28.7,
      "majorRiverBasin": "Ghaghara & Gomti",
      "avgRainfallMm": 970,
      "annualDemandMcm": 490,
      "rainfallDeparturePct": 2.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "sultanpur",
    "name": "Sultanpur",
    "division": "Ayodhya",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.26,
      "lng": 82.07
    },
    "waterStatus": "good",
    "centroid": [
      26.26,
      82.07
    ],
    "projected": [
      608.1,
      465.0
    ],
    "svgPath": "M 630.2,465.0 L 621.8,476.6 L 608.1,484.6 L 593.8,477.1 L 584.2,465.0 L 593.2,452.3 L 608.1,444.0 L 623.6,451.8 Z",
    "areaKm2": 2673,
    "soilType": "Gomti Alluvium",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 80.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 9.64,
        "stress_score": 35.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 10.44,
        "stress_score": 37.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 11.24,
        "stress_score": 39.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 12.04,
        "stress_score": 41.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 12.84,
        "stress_score": 43.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 13.48,
        "stress_score": 44.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 13.8,
        "stress_score": 45.7,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 14.12,
        "stress_score": 46.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 14.44,
        "stress_score": 47.3,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 15.24,
        "stress_score": 49.3,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 13.8,
      "groundwaterTrendAnnualCm": -16,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 67.5,
      "waterStressScore": 33.2,
      "majorRiverBasin": "Gomti Basin",
      "avgRainfallMm": 950,
      "annualDemandMcm": 390,
      "rainfallDeparturePct": 0.0
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "ambedkar-nagar",
    "name": "Ambedkar Nagar",
    "division": "Ayodhya",
    "region": "Awadh",
    "coordinates": {
      "lat": 26.44,
      "lng": 82.69
    },
    "waterStatus": "good",
    "centroid": [
      26.44,
      82.69
    ],
    "projected": [
      675.1,
      447.8
    ],
    "svgPath": "M 696.1,447.8 L 688.1,458.8 L 675.1,466.3 L 661.6,459.3 L 652.5,447.8 L 661.0,435.8 L 675.1,433.1 L 689.8,435.3 Z",
    "areaKm2": 2350,
    "soilType": "Alluvial Silt",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 93.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.38,
        "stress_score": 29.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.98,
        "stress_score": 30.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 9.58,
        "stress_score": 32.3,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 10.18,
        "stress_score": 33.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 10.78,
        "stress_score": 35.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 11.26,
        "stress_score": 36.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 11.5,
        "stress_score": 37.1,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 11.74,
        "stress_score": 37.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 11.98,
        "stress_score": 38.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 12.58,
        "stress_score": 39.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 11.5,
      "groundwaterTrendAnnualCm": -12,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 61.2,
      "waterStressScore": 23.8,
      "majorRiverBasin": "Ghaghara & Majhoi",
      "avgRainfallMm": 990,
      "annualDemandMcm": 360,
      "rainfallDeparturePct": 4.2
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "bahraich",
    "name": "Bahraich",
    "division": "Devipatan",
    "region": "Terai",
    "coordinates": {
      "lat": 27.57,
      "lng": 81.59
    },
    "waterStatus": "good",
    "centroid": [
      27.57,
      81.59
    ],
    "projected": [
      556.2,
      339.9
    ],
    "svgPath": "M 585.3,339.9 L 574.1,355.1 L 556.2,365.6 L 537.5,355.8 L 524.8,339.9 L 536.7,323.3 L 556.2,312.3 L 576.6,322.6 Z",
    "areaKm2": 4697,
    "soilType": "Terai Silt",
    "slopePct": 0.7,
    "rechargeSuitabilityScore": 81.9,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 6.34,
        "stress_score": 20.0,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 6.64,
        "stress_score": 20.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 6.94,
        "stress_score": 21.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 7.24,
        "stress_score": 22.3,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 7.54,
        "stress_score": 23.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 7.78,
        "stress_score": 23.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 7.9,
        "stress_score": 23.9,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 8.02,
        "stress_score": 24.2,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 8.14,
        "stress_score": 24.6,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 8.44,
        "stress_score": 25.3,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 7.9,
      "groundwaterTrendAnnualCm": -6,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 44.8,
      "waterStressScore": 12,
      "majorRiverBasin": "Ghaghara & Saryu",
      "avgRainfallMm": 1210,
      "annualDemandMcm": 470,
      "rainfallDeparturePct": 27.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "balrampur",
    "name": "Balrampur",
    "division": "Devipatan",
    "region": "Terai",
    "coordinates": {
      "lat": 27.43,
      "lng": 82.18
    },
    "waterStatus": "good",
    "centroid": [
      27.43,
      82.18
    ],
    "projected": [
      620.0,
      353.3
    ],
    "svgPath": "M 646.5,353.3 L 636.5,367.3 L 620.0,376.6 L 602.8,367.9 L 598.9,353.3 L 602.1,338.1 L 620.0,334.5 L 638.6,337.5 Z",
    "areaKm2": 3349,
    "soilType": "Terai Clay",
    "slopePct": 0.8,
    "rechargeSuitabilityScore": 81.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 5.46,
        "stress_score": 16.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 5.66,
        "stress_score": 16.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 5.86,
        "stress_score": 17.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 6.06,
        "stress_score": 17.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 6.26,
        "stress_score": 18.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 6.42,
        "stress_score": 18.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 6.5,
        "stress_score": 19.1,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 6.58,
        "stress_score": 19.2,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 6.66,
        "stress_score": 19.4,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 6.86,
        "stress_score": 20.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 6.5,
      "groundwaterTrendAnnualCm": -4,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 36.2,
      "waterStressScore": 12,
      "majorRiverBasin": "Rapti Basin",
      "avgRainfallMm": 1320,
      "annualDemandMcm": 380,
      "rainfallDeparturePct": 38.9
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "gonda",
    "name": "Gonda",
    "division": "Devipatan",
    "region": "Terai",
    "coordinates": {
      "lat": 27.13,
      "lng": 81.96
    },
    "waterStatus": "good",
    "centroid": [
      27.13,
      81.96
    ],
    "projected": [
      596.2,
      381.9
    ],
    "svgPath": "M 624.1,381.9 L 613.7,396.8 L 596.2,400.2 L 578.0,397.4 L 573.7,381.9 L 577.3,365.8 L 596.2,361.9 L 615.8,365.3 Z",
    "areaKm2": 3404,
    "soilType": "Alluvial Loam",
    "slopePct": 0.9,
    "rechargeSuitabilityScore": 93.3,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 7.46,
        "stress_score": 24.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 7.91,
        "stress_score": 26.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 8.36,
        "stress_score": 27.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 8.81,
        "stress_score": 28.3,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 9.26,
        "stress_score": 29.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 9.62,
        "stress_score": 30.3,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 9.8,
        "stress_score": 30.8,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 9.98,
        "stress_score": 31.3,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 10.16,
        "stress_score": 31.7,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 10.61,
        "stress_score": 32.8,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 9.8,
      "groundwaterTrendAnnualCm": -9,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 52.6,
      "waterStressScore": 14.5,
      "majorRiverBasin": "Ghaghara & Kuwana",
      "avgRainfallMm": 1100,
      "annualDemandMcm": 440,
      "rainfallDeparturePct": 15.8
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "shravasti",
    "name": "Shravasti",
    "division": "Devipatan",
    "region": "Terai",
    "coordinates": {
      "lat": 27.5,
      "lng": 82.03
    },
    "waterStatus": "good",
    "centroid": [
      27.5,
      82.03
    ],
    "projected": [
      603.8,
      346.6
    ],
    "svgPath": "M 622.8,346.6 L 615.7,356.7 L 603.8,359.0 L 591.4,357.1 L 588.5,346.6 L 590.9,335.7 L 603.8,333.0 L 617.1,335.3 Z",
    "areaKm2": 1640,
    "soilType": "Terai Alluvium",
    "slopePct": 0.8,
    "rechargeSuitabilityScore": 81.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 5.6,
        "stress_score": 17.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 5.85,
        "stress_score": 18.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 6.1,
        "stress_score": 18.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 6.35,
        "stress_score": 19.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 6.6,
        "stress_score": 20.0,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 6.8,
        "stress_score": 20.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 6.9,
        "stress_score": 20.8,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 7.0,
        "stress_score": 21.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 7.1,
        "stress_score": 21.2,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 7.35,
        "stress_score": 21.9,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 6.9,
      "groundwaterTrendAnnualCm": -5,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 39.4,
      "waterStressScore": 12,
      "majorRiverBasin": "Rapti Basin",
      "avgRainfallMm": 1290,
      "annualDemandMcm": 240,
      "rainfallDeparturePct": 35.8
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "basti",
    "name": "Basti",
    "division": "Basti",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 26.8,
      "lng": 82.76
    },
    "waterStatus": "good",
    "centroid": [
      26.8,
      82.76
    ],
    "projected": [
      682.7,
      413.4
    ],
    "svgPath": "M 707.5,413.4 L 698.3,426.6 L 682.7,429.7 L 666.5,427.1 L 662.7,413.4 L 665.9,399.1 L 682.7,395.6 L 700.1,398.6 Z",
    "areaKm2": 2688,
    "soilType": "Alluvial Silt",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 93.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 7.74,
        "stress_score": 27.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.29,
        "stress_score": 28.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 8.84,
        "stress_score": 29.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 9.39,
        "stress_score": 31.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 9.94,
        "stress_score": 32.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 10.38,
        "stress_score": 33.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 10.6,
        "stress_score": 34.2,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 10.82,
        "stress_score": 34.8,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 11.04,
        "stress_score": 35.3,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 11.59,
        "stress_score": 36.7,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 10.6,
      "groundwaterTrendAnnualCm": -11,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 56.8,
      "waterStressScore": 19.0,
      "majorRiverBasin": "Kuwano & Manorama",
      "avgRainfallMm": 1060,
      "annualDemandMcm": 420,
      "rainfallDeparturePct": 11.6
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "sant-kabir-nagar",
    "name": "Sant Kabir Nagar",
    "division": "Basti",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 26.77,
      "lng": 83.03
    },
    "waterStatus": "good",
    "centroid": [
      26.77,
      83.03
    ],
    "projected": [
      711.9,
      416.3
    ],
    "svgPath": "M 728.8,416.3 L 722.3,425.1 L 711.9,431.2 L 701.1,425.5 L 693.7,416.3 L 700.6,406.7 L 711.9,400.2 L 723.7,406.3 Z",
    "areaKm2": 1646,
    "soilType": "Alluvial Loam",
    "slopePct": 0.9,
    "rechargeSuitabilityScore": 93.3,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 7.76,
        "stress_score": 25.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.21,
        "stress_score": 26.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 8.66,
        "stress_score": 27.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 9.11,
        "stress_score": 29.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 9.56,
        "stress_score": 30.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 9.92,
        "stress_score": 31.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 10.1,
        "stress_score": 31.6,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 10.28,
        "stress_score": 32.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 10.46,
        "stress_score": 32.5,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 10.91,
        "stress_score": 33.6,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 10.1,
      "groundwaterTrendAnnualCm": -9,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 53.4,
      "waterStressScore": 15.4,
      "majorRiverBasin": "Ami & Kuwano",
      "avgRainfallMm": 1090,
      "annualDemandMcm": 280,
      "rainfallDeparturePct": 14.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "siddharthnagar",
    "name": "Siddharthnagar",
    "division": "Basti",
    "region": "Terai",
    "coordinates": {
      "lat": 27.29,
      "lng": 82.81
    },
    "waterStatus": "good",
    "centroid": [
      27.29,
      82.81
    ],
    "projected": [
      688.1,
      366.6
    ],
    "svgPath": "M 710.7,366.6 L 702.0,378.4 L 688.1,386.6 L 673.6,379.0 L 663.7,366.6 L 672.9,353.7 L 688.1,345.1 L 703.9,353.2 Z",
    "areaKm2": 2895,
    "soilType": "Terai Clay",
    "slopePct": 0.7,
    "rechargeSuitabilityScore": 81.9,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 5.12,
        "stress_score": 14.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 5.27,
        "stress_score": 15.3,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 5.42,
        "stress_score": 15.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 5.57,
        "stress_score": 16.0,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 5.72,
        "stress_score": 16.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 5.84,
        "stress_score": 16.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 5.9,
        "stress_score": 16.9,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 5.96,
        "stress_score": 17.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 6.02,
        "stress_score": 17.1,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 6.17,
        "stress_score": 17.5,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 5.9,
      "groundwaterTrendAnnualCm": -3,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 32.5,
      "waterStressScore": 12,
      "majorRiverBasin": "Rapti & Banganga",
      "avgRainfallMm": 1340,
      "annualDemandMcm": 360,
      "rainfallDeparturePct": 41.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "deoria",
    "name": "Deoria",
    "division": "Gorakhpur",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 26.5,
      "lng": 83.78
    },
    "waterStatus": "good",
    "centroid": [
      26.5,
      83.78
    ],
    "projected": [
      793.0,
      442.1
    ],
    "svgPath": "M 814.0,442.1 L 805.9,453.0 L 793.0,460.6 L 779.5,453.6 L 770.4,442.1 L 778.9,430.1 L 793.0,422.1 L 807.7,429.6 Z",
    "areaKm2": 2540,
    "soilType": "Gandak Alluvium",
    "slopePct": 0.9,
    "rechargeSuitabilityScore": 81.3,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 6.62,
        "stress_score": 22.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 7.02,
        "stress_score": 23.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 7.42,
        "stress_score": 24.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 7.82,
        "stress_score": 25.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 8.22,
        "stress_score": 26.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 8.54,
        "stress_score": 26.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 8.7,
        "stress_score": 27.4,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 8.86,
        "stress_score": 27.8,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 9.02,
        "stress_score": 28.1,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 9.42,
        "stress_score": 29.1,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 8.7,
      "groundwaterTrendAnnualCm": -8,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 49.2,
      "waterStressScore": 12,
      "majorRiverBasin": "Ghaghara & Little Gandak",
      "avgRainfallMm": 1140,
      "annualDemandMcm": 440,
      "rainfallDeparturePct": 20.0
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "gorakhpur",
    "name": "Gorakhpur",
    "division": "Gorakhpur",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 26.76,
      "lng": 83.37
    },
    "waterStatus": "good",
    "centroid": [
      26.76,
      83.37
    ],
    "projected": [
      748.6,
      417.3
    ],
    "svgPath": "M 775.7,417.3 L 765.5,431.7 L 748.6,435.0 L 731.0,432.3 L 726.8,417.3 L 730.3,401.7 L 748.6,398.0 L 767.6,401.2 Z",
    "areaKm2": 3321,
    "soilType": "Rapti Silt Loam",
    "slopePct": 0.8,
    "rechargeSuitabilityScore": 81.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 6.28,
        "stress_score": 20.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 6.63,
        "stress_score": 21.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 6.98,
        "stress_score": 22.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 7.33,
        "stress_score": 23.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 7.68,
        "stress_score": 24.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 7.96,
        "stress_score": 24.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 8.1,
        "stress_score": 25.1,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 8.24,
        "stress_score": 25.5,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 8.38,
        "stress_score": 25.9,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 8.73,
        "stress_score": 26.7,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 8.1,
      "groundwaterTrendAnnualCm": -7,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 46.5,
      "waterStressScore": 12,
      "majorRiverBasin": "Rapti & Rohini",
      "avgRainfallMm": 1210,
      "annualDemandMcm": 580,
      "rainfallDeparturePct": 27.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "kushinagar",
    "name": "Kushinagar",
    "division": "Gorakhpur",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 26.74,
      "lng": 83.89
    },
    "waterStatus": "good",
    "centroid": [
      26.74,
      83.89
    ],
    "projected": [
      804.9,
      419.2
    ],
    "svgPath": "M 830.0,419.2 L 820.6,432.5 L 804.9,435.6 L 788.6,433.1 L 784.8,419.2 L 787.9,404.8 L 804.9,401.3 L 822.5,404.2 Z",
    "areaKm2": 2905,
    "soilType": "Gandak Alluvium",
    "slopePct": 0.8,
    "rechargeSuitabilityScore": 81.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 5.9,
        "stress_score": 18.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 6.15,
        "stress_score": 18.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 6.4,
        "stress_score": 19.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 6.65,
        "stress_score": 20.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 6.9,
        "stress_score": 20.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 7.1,
        "stress_score": 21.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 7.2,
        "stress_score": 21.5,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 7.3,
        "stress_score": 21.8,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 7.4,
        "stress_score": 22.0,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 7.65,
        "stress_score": 22.6,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 7.2,
      "groundwaterTrendAnnualCm": -5,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 42.1,
      "waterStressScore": 12,
      "majorRiverBasin": "Great Gandak & Little Gandak",
      "avgRainfallMm": 1220,
      "annualDemandMcm": 460,
      "rainfallDeparturePct": 28.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "maharajganj",
    "name": "Maharajganj",
    "division": "Gorakhpur",
    "region": "Terai",
    "coordinates": {
      "lat": 27.14,
      "lng": 83.56
    },
    "waterStatus": "good",
    "centroid": [
      27.14,
      83.56
    ],
    "projected": [
      769.2,
      381.0
    ],
    "svgPath": "M 792.0,381.0 L 783.2,392.9 L 769.2,401.2 L 754.5,393.5 L 744.6,381.0 L 753.9,368.0 L 769.2,359.3 L 785.2,367.4 Z",
    "areaKm2": 2952,
    "soilType": "Terai Alluvium",
    "slopePct": 0.7,
    "rechargeSuitabilityScore": 81.9,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 5.06,
        "stress_score": 15.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 5.26,
        "stress_score": 15.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 5.46,
        "stress_score": 16.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 5.66,
        "stress_score": 16.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 5.86,
        "stress_score": 17.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 6.02,
        "stress_score": 17.8,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 6.1,
        "stress_score": 18.1,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 6.18,
        "stress_score": 18.2,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 6.26,
        "stress_score": 18.4,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 6.46,
        "stress_score": 18.9,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 6.1,
      "groundwaterTrendAnnualCm": -4,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 34.0,
      "waterStressScore": 12,
      "majorRiverBasin": "Rohini & Gandak",
      "avgRainfallMm": 1390,
      "annualDemandMcm": 390,
      "rainfallDeparturePct": 46.3
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "azamgarh",
    "name": "Azamgarh",
    "division": "Azamgarh",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 26.06,
      "lng": 83.18
    },
    "waterStatus": "good",
    "centroid": [
      26.06,
      83.18
    ],
    "projected": [
      728.1,
      484.1
    ],
    "svgPath": "M 755.6,484.1 L 745.1,498.6 L 728.1,508.4 L 710.3,499.2 L 698.4,484.1 L 709.6,468.3 L 728.1,464.8 L 747.4,467.7 Z",
    "areaKm2": 4054,
    "soilType": "Alluvial Clay Loam",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 93.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.8,
        "stress_score": 32.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 9.55,
        "stress_score": 34.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 10.3,
        "stress_score": 36.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 11.05,
        "stress_score": 38.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 11.8,
        "stress_score": 40.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 12.4,
        "stress_score": 41.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 12.7,
        "stress_score": 42.2,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 13.0,
        "stress_score": 43.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 13.3,
        "stress_score": 43.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 14.05,
        "stress_score": 45.6,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 12.7,
      "groundwaterTrendAnnualCm": -15,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 66.8,
      "waterStressScore": 28.2,
      "majorRiverBasin": "Tons & Ghaghara",
      "avgRainfallMm": 1010,
      "annualDemandMcm": 590,
      "rainfallDeparturePct": 6.3
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "ballia",
    "name": "Ballia",
    "division": "Azamgarh",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 25.76,
      "lng": 84.15
    },
    "waterStatus": "good",
    "centroid": [
      25.76,
      84.15
    ],
    "projected": [
      833.0,
      512.8
    ],
    "svgPath": "M 856.8,512.8 L 847.8,525.3 L 833.0,533.9 L 817.6,525.9 L 807.3,512.8 L 816.9,499.2 L 833.0,496.0 L 849.7,498.6 Z",
    "areaKm2": 2981,
    "soilType": "Floodplain Silt",
    "slopePct": 0.8,
    "rechargeSuitabilityScore": 81.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 7.06,
        "stress_score": 23.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 7.51,
        "stress_score": 25.1,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 7.96,
        "stress_score": 26.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 8.41,
        "stress_score": 27.3,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 8.86,
        "stress_score": 28.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 9.22,
        "stress_score": 29.4,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 9.4,
        "stress_score": 29.8,
        "category": "Safe",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 9.58,
        "stress_score": 30.2,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 9.76,
        "stress_score": 30.7,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 10.21,
        "stress_score": 31.8,
        "category": "Safe",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 9.4,
      "groundwaterTrendAnnualCm": -9,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 52.4,
      "waterStressScore": 15.0,
      "majorRiverBasin": "Ganga & Ghaghara Confluence",
      "avgRainfallMm": 1050,
      "annualDemandMcm": 470,
      "rainfallDeparturePct": 10.5
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "mau",
    "name": "Mau",
    "division": "Azamgarh",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 26.0,
      "lng": 83.56
    },
    "waterStatus": "good",
    "centroid": [
      26.0,
      83.56
    ],
    "projected": [
      769.2,
      489.9
    ],
    "svgPath": "M 784.1,489.9 L 781.9,500.7 L 769.2,503.2 L 756.0,501.1 L 752.9,489.9 L 755.6,478.3 L 769.2,475.4 L 779.6,481.0 Z",
    "areaKm2": 1713,
    "soilType": "Alluvial Loam",
    "slopePct": 1.0,
    "rechargeSuitabilityScore": 93.0,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 7.82,
        "stress_score": 28.6,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.47,
        "stress_score": 30.3,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 9.12,
        "stress_score": 31.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 9.77,
        "stress_score": 33.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 10.42,
        "stress_score": 35.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 10.94,
        "stress_score": 36.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 11.2,
        "stress_score": 37.1,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 11.46,
        "stress_score": 37.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 11.72,
        "stress_score": 38.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 12.37,
        "stress_score": 40.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 11.2,
      "groundwaterTrendAnnualCm": -13,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 59.8,
      "waterStressScore": 22.8,
      "majorRiverBasin": "Tons Basin",
      "avgRainfallMm": 1030,
      "annualDemandMcm": 310,
      "rainfallDeparturePct": 8.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "chandauli",
    "name": "Chandauli",
    "division": "Varanasi",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 25.26,
      "lng": 83.27
    },
    "waterStatus": "good",
    "centroid": [
      25.26,
      83.27
    ],
    "projected": [
      737.8,
      560.5
    ],
    "svgPath": "M 757.7,560.5 L 754.4,574.6 L 737.8,578.1 L 725.1,571.3 L 716.2,560.5 L 724.5,549.2 L 737.8,541.4 L 751.7,548.7 Z",
    "areaKm2": 2541,
    "soilType": "Rice Bowl Heavy Clay",
    "slopePct": 1.3,
    "rechargeSuitabilityScore": 80.1,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.94,
        "stress_score": 33.5,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 9.74,
        "stress_score": 35.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 10.54,
        "stress_score": 37.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 11.34,
        "stress_score": 39.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 12.14,
        "stress_score": 41.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 12.78,
        "stress_score": 43.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 13.1,
        "stress_score": 44.0,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 13.42,
        "stress_score": 44.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 13.74,
        "stress_score": 45.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 14.54,
        "stress_score": 47.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 13.1,
      "groundwaterTrendAnnualCm": -16,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 65.4,
      "waterStressScore": 27.9,
      "majorRiverBasin": "Ganga & Karamnasa",
      "avgRainfallMm": 1080,
      "annualDemandMcm": 410,
      "rainfallDeparturePct": 13.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "ghazipur",
    "name": "Ghazipur",
    "division": "Varanasi",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 25.58,
      "lng": 83.57
    },
    "waterStatus": "good",
    "centroid": [
      25.58,
      83.57
    ],
    "projected": [
      770.3,
      530.0
    ],
    "svgPath": "M 795.4,530.0 L 785.8,543.2 L 770.3,552.2 L 754.1,543.8 L 743.2,530.0 L 753.4,515.6 L 770.3,512.4 L 787.9,515.0 Z",
    "areaKm2": 3377,
    "soilType": "Ganga Alluvial Silt",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.16,
        "stress_score": 30.2,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 8.86,
        "stress_score": 31.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 9.56,
        "stress_score": 33.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 10.26,
        "stress_score": 35.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 10.96,
        "stress_score": 37.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 11.52,
        "stress_score": 38.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 11.8,
        "stress_score": 39.3,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 12.08,
        "stress_score": 40.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 12.36,
        "stress_score": 40.7,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 13.06,
        "stress_score": 42.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 11.8,
      "groundwaterTrendAnnualCm": -14,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 62.0,
      "waterStressScore": 24.9,
      "majorRiverBasin": "Ganga & Gomti",
      "avgRainfallMm": 1030,
      "annualDemandMcm": 480,
      "rainfallDeparturePct": 8.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "jaunpur",
    "name": "Jaunpur",
    "division": "Varanasi",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 25.75,
      "lng": 82.68
    },
    "waterStatus": "good",
    "centroid": [
      25.75,
      82.68
    ],
    "projected": [
      674.1,
      513.7
    ],
    "svgPath": "M 699.5,513.7 L 695.2,531.7 L 674.1,536.2 L 657.9,527.5 L 646.6,513.7 L 657.1,499.3 L 674.1,489.4 L 691.8,498.6 Z",
    "areaKm2": 4038,
    "soilType": "Alluvial Silt",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 9.82,
        "stress_score": 37.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 10.72,
        "stress_score": 39.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 11.62,
        "stress_score": 41.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 12.52,
        "stress_score": 43.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 13.42,
        "stress_score": 46.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 14.14,
        "stress_score": 48.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 14.5,
        "stress_score": 48.9,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 14.86,
        "stress_score": 49.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 15.22,
        "stress_score": 50.7,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 16.12,
        "stress_score": 52.9,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 14.5,
      "groundwaterTrendAnnualCm": -18,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 71.5,
      "waterStressScore": 35.4,
      "majorRiverBasin": "Gomti & Sai",
      "avgRainfallMm": 980,
      "annualDemandMcm": 560,
      "rainfallDeparturePct": 3.2
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "varanasi",
    "name": "Varanasi",
    "division": "Varanasi",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 25.32,
      "lng": 82.97
    },
    "waterStatus": "warning",
    "centroid": [
      25.32,
      82.97
    ],
    "projected": [
      705.4,
      554.8
    ],
    "svgPath": "M 720.5,554.8 L 718.1,565.6 L 705.4,568.2 L 692.3,566.0 L 688.9,554.8 L 695.3,546.2 L 705.4,540.3 L 716.0,545.8 Z",
    "areaKm2": 1535,
    "soilType": "Ganga Silt Loam",
    "slopePct": 1.4,
    "rechargeSuitabilityScore": 79.8,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.88,
        "stress_score": 48.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.23,
        "stress_score": 52.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.58,
        "stress_score": 55.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 15.93,
        "stress_score": 58.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 17.28,
        "stress_score": 62.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 18.36,
        "stress_score": 64.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 18.9,
        "stress_score": 66.2,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 19.44,
        "stress_score": 67.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 19.98,
        "stress_score": 68.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 21.33,
        "stress_score": 72.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 18.9,
      "groundwaterTrendAnnualCm": -27,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 92.4,
      "waterStressScore": 51.5,
      "majorRiverBasin": "Ganga, Varuna & Assi",
      "avgRainfallMm": 1010,
      "annualDemandMcm": 540,
      "rainfallDeparturePct": 6.3
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "mirzapur",
    "name": "Mirzapur",
    "division": "Mirzapur",
    "region": "Vindhya",
    "coordinates": {
      "lat": 25.15,
      "lng": 82.57
    },
    "waterStatus": "warning",
    "centroid": [
      25.15,
      82.57
    ],
    "projected": [
      662.2,
      571.0
    ],
    "svgPath": "M 689.5,571.0 L 679.0,585.2 L 662.2,595.2 L 644.7,585.9 L 632.7,571.0 L 643.9,555.4 L 662.2,544.9 L 681.3,554.7 Z",
    "areaKm2": 4405,
    "soilType": "Vindhyan Red Clay & Rock",
    "slopePct": 3.4,
    "rechargeSuitabilityScore": 73.8,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.74,
        "stress_score": 44.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.79,
        "stress_score": 46.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 13.84,
        "stress_score": 49.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 14.89,
        "stress_score": 51.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 15.94,
        "stress_score": 54.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 16.78,
        "stress_score": 56.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 17.2,
        "stress_score": 57.7,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 17.62,
        "stress_score": 58.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 18.04,
        "stress_score": 59.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 19.09,
        "stress_score": 62.4,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 17.2,
      "groundwaterTrendAnnualCm": -21,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 81.2,
      "waterStressScore": 44.9,
      "majorRiverBasin": "Ganga & Belan",
      "avgRainfallMm": 940,
      "annualDemandMcm": 460,
      "rainfallDeparturePct": -1.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "bhadohi",
    "name": "Sant Ravidas Nagar (Bhadohi)",
    "division": "Mirzapur",
    "region": "Purvanchal",
    "coordinates": {
      "lat": 25.39,
      "lng": 82.57
    },
    "waterStatus": "good",
    "centroid": [
      25.39,
      82.57
    ],
    "projected": [
      662.2,
      548.1
    ],
    "svgPath": "M 676.5,548.1 L 671.1,555.7 L 662.2,560.7 L 652.9,556.0 L 650.8,548.1 L 652.5,539.9 L 662.2,538.0 L 672.2,539.6 Z",
    "areaKm2": 1015,
    "soilType": "Alluvial Silt",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 92.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 9.68,
        "stress_score": 36.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 10.53,
        "stress_score": 38.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 11.38,
        "stress_score": 40.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 12.23,
        "stress_score": 42.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 13.08,
        "stress_score": 44.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 13.76,
        "stress_score": 46.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 14.1,
        "stress_score": 47.1,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 14.44,
        "stress_score": 48.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 14.78,
        "stress_score": 48.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 15.63,
        "stress_score": 51.0,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 14.1,
      "groundwaterTrendAnnualCm": -17,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 69.8,
      "waterStressScore": 34.0,
      "majorRiverBasin": "Ganga & Varuna",
      "avgRainfallMm": 970,
      "annualDemandMcm": 260,
      "rainfallDeparturePct": 2.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "sonbhadra",
    "name": "Sonbhadra",
    "division": "Mirzapur",
    "region": "Vindhya",
    "coordinates": {
      "lat": 24.68,
      "lng": 83.06
    },
    "waterStatus": "good",
    "centroid": [
      24.68,
      83.06
    ],
    "projected": [
      715.1,
      615.9
    ],
    "svgPath": "M 754.5,615.9 L 739.8,636.9 L 715.1,641.8 L 689.4,637.7 L 683.3,615.9 L 688.4,593.2 L 715.1,587.7 L 742.7,592.4 Z",
    "areaKm2": 6788,
    "soilType": "Hard Rock Sandstone",
    "slopePct": 4.8,
    "rechargeSuitabilityScore": 69.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 8.86,
        "stress_score": 31.9,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 9.56,
        "stress_score": 33.7,
        "category": "Safe",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 10.26,
        "stress_score": 35.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 10.96,
        "stress_score": 37.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 11.66,
        "stress_score": 38.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 12.22,
        "stress_score": 40.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 12.5,
        "stress_score": 41.0,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 12.78,
        "stress_score": 41.8,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 13.06,
        "stress_score": 42.4,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 13.76,
        "stress_score": 44.2,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 12.5,
      "groundwaterTrendAnnualCm": -14,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 58.2,
      "waterStressScore": 24.7,
      "majorRiverBasin": "Son & Rihand",
      "avgRainfallMm": 1090,
      "annualDemandMcm": 510,
      "rainfallDeparturePct": 14.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "fatehpur",
    "name": "Fatehpur",
    "division": "Prayagraj",
    "region": "Doab",
    "coordinates": {
      "lat": 25.93,
      "lng": 80.81
    },
    "waterStatus": "warning",
    "centroid": [
      25.93,
      80.81
    ],
    "projected": [
      471.9,
      496.5
    ],
    "svgPath": "M 495.2,496.5 L 491.6,513.3 L 471.9,517.2 L 451.4,513.9 L 446.5,496.5 L 450.7,478.4 L 471.9,474.0 L 488.2,482.7 Z",
    "areaKm2": 4152,
    "soilType": "Doab Alluvium",
    "slopePct": 1.2,
    "rechargeSuitabilityScore": 80.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.08,
        "stress_score": 43.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.18,
        "stress_score": 45.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 13.28,
        "stress_score": 48.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 14.38,
        "stress_score": 51.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 15.48,
        "stress_score": 54.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 16.36,
        "stress_score": 56.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 16.8,
        "stress_score": 57.4,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 17.24,
        "stress_score": 58.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 17.68,
        "stress_score": 59.6,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 18.78,
        "stress_score": 62.4,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 16.8,
      "groundwaterTrendAnnualCm": -22,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 83.1,
      "waterStressScore": 47.1,
      "majorRiverBasin": "Ganga & Yamuna",
      "avgRainfallMm": 860,
      "annualDemandMcm": 470,
      "rainfallDeparturePct": -9.5
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "kaushambi",
    "name": "Kaushambi",
    "division": "Prayagraj",
    "region": "Doab",
    "coordinates": {
      "lat": 25.53,
      "lng": 81.38
    },
    "waterStatus": "warning",
    "centroid": [
      25.53,
      81.38
    ],
    "projected": [
      533.5,
      534.7
    ],
    "svgPath": "M 554.8,534.7 L 546.8,546.0 L 533.5,548.6 L 519.6,546.5 L 516.4,534.7 L 519.1,522.5 L 533.5,519.5 L 548.4,522.0 Z",
    "areaKm2": 2012,
    "soilType": "Sandy Alluvium",
    "slopePct": 1.3,
    "rechargeSuitabilityScore": 80.1,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.42,
        "stress_score": 44.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 12.57,
        "stress_score": 47.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 13.72,
        "stress_score": 50.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 14.87,
        "stress_score": 53.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 16.02,
        "stress_score": 56.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 16.94,
        "stress_score": 58.5,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 17.4,
        "stress_score": 59.6,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 17.86,
        "stress_score": 60.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 18.32,
        "stress_score": 61.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 19.47,
        "stress_score": 64.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 17.4,
      "groundwaterTrendAnnualCm": -23,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 85.6,
      "waterStressScore": 48.4,
      "majorRiverBasin": "Yamuna & Sasur Khaderi",
      "avgRainfallMm": 890,
      "annualDemandMcm": 330,
      "rainfallDeparturePct": -6.3
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "pratapgarh",
    "name": "Pratapgarh",
    "division": "Prayagraj",
    "region": "Awadh / Purvanchal",
    "coordinates": {
      "lat": 25.9,
      "lng": 81.99
    },
    "waterStatus": "good",
    "centroid": [
      25.9,
      81.99
    ],
    "projected": [
      599.5,
      499.4
    ],
    "svgPath": "M 624.9,499.4 L 615.1,512.6 L 599.5,521.8 L 583.2,513.3 L 572.1,499.4 L 582.5,484.9 L 599.5,475.2 L 617.2,484.3 Z",
    "areaKm2": 3717,
    "soilType": "Alluvial Loam",
    "slopePct": 1.1,
    "rechargeSuitabilityScore": 92.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 9.64,
        "stress_score": 35.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 10.44,
        "stress_score": 37.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 11.24,
        "stress_score": 39.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 12.04,
        "stress_score": 41.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 12.84,
        "stress_score": 43.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 13.48,
        "stress_score": 44.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 13.8,
        "stress_score": 45.7,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 14.12,
        "stress_score": 46.5,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 14.44,
        "stress_score": 47.3,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 15.24,
        "stress_score": 49.3,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 13.8,
      "groundwaterTrendAnnualCm": -16,
      "cgwbCategory": "Safe",
      "cgwbStageExtractionPct": 68.4,
      "waterStressScore": 33.4,
      "majorRiverBasin": "Sai & Bakulahi",
      "avgRainfallMm": 940,
      "annualDemandMcm": 460,
      "rainfallDeparturePct": -1.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "prayagraj",
    "name": "Prayagraj",
    "division": "Prayagraj",
    "region": "Doab / Sangam",
    "coordinates": {
      "lat": 25.43,
      "lng": 81.84
    },
    "waterStatus": "warning",
    "centroid": [
      25.43,
      81.84
    ],
    "projected": [
      583.2,
      544.3
    ],
    "svgPath": "M 613.7,544.3 L 601.9,560.2 L 583.2,571.3 L 563.6,560.9 L 550.2,544.3 L 562.8,526.9 L 583.2,515.2 L 604.5,526.2 Z",
    "areaKm2": 5482,
    "soilType": "Sangam Silt Alluvium",
    "slopePct": 1.3,
    "rechargeSuitabilityScore": 80.1,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 11.76,
        "stress_score": 49.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.21,
        "stress_score": 53.3,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.66,
        "stress_score": 56.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 16.11,
        "stress_score": 60.6,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 17.56,
        "stress_score": 64.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 18.72,
        "stress_score": 67.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 19.3,
        "stress_score": 68.5,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 19.88,
        "stress_score": 70.0,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 20.46,
        "stress_score": 71.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 21.91,
        "stress_score": 75.1,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 19.3,
      "groundwaterTrendAnnualCm": -29,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 94.2,
      "waterStressScore": 55.4,
      "majorRiverBasin": "Ganga & Yamuna Confluence",
      "avgRainfallMm": 960,
      "annualDemandMcm": 740,
      "rainfallDeparturePct": 1.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 94,
        "target": "Replenishes deep unconfined aquifer zone."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 50,
        "target": "Impounds seasonal storm discharge along stream beds."
      }
    ]
  },
  {
    "id": "banda",
    "name": "Banda",
    "division": "Chitrakoot",
    "region": "Bundelkhand",
    "coordinates": {
      "lat": 25.48,
      "lng": 80.33
    },
    "waterStatus": "warning",
    "centroid": [
      25.48,
      80.33
    ],
    "projected": [
      420.0,
      539.5
    ],
    "svgPath": "M 449.0,539.5 L 437.9,554.8 L 420.0,565.1 L 401.3,555.4 L 388.8,539.5 L 400.5,522.9 L 420.0,519.1 L 440.3,522.2 Z",
    "areaKm2": 4408,
    "soilType": "Mixed Red & Black Soil",
    "slopePct": 3.2,
    "rechargeSuitabilityScore": 74.4,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.36,
        "stress_score": 47.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.56,
        "stress_score": 50.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.76,
        "stress_score": 53.7,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 15.96,
        "stress_score": 56.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 17.16,
        "stress_score": 59.7,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 18.12,
        "stress_score": 62.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 18.6,
        "stress_score": 63.3,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 19.08,
        "stress_score": 64.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 19.56,
        "stress_score": 65.7,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 20.76,
        "stress_score": 68.7,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 18.6,
      "groundwaterTrendAnnualCm": -24,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 91.5,
      "waterStressScore": 52.4,
      "majorRiverBasin": "Ken & Baghein",
      "avgRainfallMm": 870,
      "annualDemandMcm": 450,
      "rainfallDeparturePct": -8.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "chitrakoot",
    "name": "Chitrakoot",
    "division": "Chitrakoot",
    "region": "Bundelkhand",
    "coordinates": {
      "lat": 25.2,
      "lng": 80.92
    },
    "waterStatus": "warning",
    "centroid": [
      25.2,
      80.92
    ],
    "projected": [
      483.8,
      566.3
    ],
    "svgPath": "M 506.9,566.3 L 503.0,582.6 L 483.8,586.7 L 469.0,578.9 L 458.8,566.3 L 468.3,553.1 L 483.8,544.2 L 500.0,552.6 Z",
    "areaKm2": 3216,
    "soilType": "Bundelkhand Gneiss / Granite",
    "slopePct": 3.6,
    "rechargeSuitabilityScore": 73.2,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 10.46,
        "stress_score": 39.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 11.41,
        "stress_score": 41.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 12.36,
        "stress_score": 44.2,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 13.31,
        "stress_score": 46.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 14.26,
        "stress_score": 48.9,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 15.02,
        "stress_score": 50.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 15.4,
        "stress_score": 51.8,
        "category": "Semi-Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 15.78,
        "stress_score": 52.7,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 16.16,
        "stress_score": 53.7,
        "category": "Semi-Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 17.11,
        "stress_score": 56.1,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 15.4,
      "groundwaterTrendAnnualCm": -19,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 78.4,
      "waterStressScore": 39.7,
      "majorRiverBasin": "Mandakini & Paisuni",
      "avgRainfallMm": 930,
      "annualDemandMcm": 340,
      "rainfallDeparturePct": -2.1
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "hamirpur",
    "name": "Hamirpur",
    "division": "Chitrakoot",
    "region": "Bundelkhand",
    "coordinates": {
      "lat": 25.95,
      "lng": 80.15
    },
    "waterStatus": "warning",
    "centroid": [
      25.95,
      80.15
    ],
    "projected": [
      400.5,
      494.6
    ],
    "svgPath": "M 423.7,494.6 L 420.1,511.3 L 400.5,515.2 L 380.1,511.9 L 375.2,494.6 L 379.3,476.6 L 400.5,472.1 L 416.7,480.8 Z",
    "areaKm2": 4121,
    "soilType": "Black Cotton Soil",
    "slopePct": 2.8,
    "rechargeSuitabilityScore": 75.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.6,
        "stress_score": 49.0,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.85,
        "stress_score": 52.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 15.1,
        "stress_score": 55.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 16.35,
        "stress_score": 58.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 17.6,
        "stress_score": 61.5,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 18.6,
        "stress_score": 64.0,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 19.1,
        "stress_score": 65.2,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 19.6,
        "stress_score": 66.5,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 20.1,
        "stress_score": 67.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 21.35,
        "stress_score": 70.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 19.1,
      "groundwaterTrendAnnualCm": -25,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 92.8,
      "waterStressScore": 55.7,
      "majorRiverBasin": "Yamuna & Betwa Confluence",
      "avgRainfallMm": 820,
      "annualDemandMcm": 410,
      "rainfallDeparturePct": -13.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "mahoba",
    "name": "Mahoba",
    "division": "Chitrakoot",
    "region": "Bundelkhand",
    "coordinates": {
      "lat": 25.29,
      "lng": 79.87
    },
    "waterStatus": "warning",
    "centroid": [
      25.29,
      79.87
    ],
    "projected": [
      370.3,
      557.7
    ],
    "svgPath": "M 394.1,557.7 L 385.0,570.2 L 370.3,578.7 L 355.0,570.7 L 344.6,557.7 L 354.3,544.1 L 370.3,535.1 L 387.0,543.5 Z",
    "areaKm2": 3144,
    "soilType": "Granitic Hard Rock",
    "slopePct": 3.8,
    "rechargeSuitabilityScore": 72.6,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.74,
        "stress_score": 53.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 14.29,
        "stress_score": 57.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 15.84,
        "stress_score": 61.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 17.39,
        "stress_score": 65.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 18.94,
        "stress_score": 69.0,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 20.18,
        "stress_score": 72.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 20.8,
        "stress_score": 73.7,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 21.42,
        "stress_score": 75.2,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 22.04,
        "stress_score": 76.8,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 23.59,
        "stress_score": 80.7,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 20.8,
      "groundwaterTrendAnnualCm": -31,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 96.0,
      "waterStressScore": 64.6,
      "majorRiverBasin": "Dhasan & Chandela Lakes",
      "avgRainfallMm": 810,
      "annualDemandMcm": 350,
      "rainfallDeparturePct": -14.7
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "jalaun",
    "name": "Jalaun",
    "division": "Jhansi",
    "region": "Bundelkhand",
    "coordinates": {
      "lat": 26.15,
      "lng": 79.35
    },
    "waterStatus": "warning",
    "centroid": [
      26.15,
      79.35
    ],
    "projected": [
      314.1,
      475.5
    ],
    "svgPath": "M 343.9,475.5 L 332.6,491.2 L 314.1,501.8 L 294.8,491.9 L 282.0,475.5 L 294.0,458.4 L 314.1,454.5 L 335.0,457.8 Z",
    "areaKm2": 4565,
    "soilType": "Mixed Red Soil",
    "slopePct": 2.6,
    "rechargeSuitabilityScore": 76.2,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.22,
        "stress_score": 46.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.37,
        "stress_score": 49.5,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.52,
        "stress_score": 52.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 15.67,
        "stress_score": 55.3,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 16.82,
        "stress_score": 58.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 17.74,
        "stress_score": 60.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 18.2,
        "stress_score": 61.6,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 18.66,
        "stress_score": 62.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 19.12,
        "stress_score": 63.9,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 20.27,
        "stress_score": 66.8,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 18.2,
      "groundwaterTrendAnnualCm": -23,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 86.4,
      "waterStressScore": 53.6,
      "majorRiverBasin": "Yamuna & Betwa",
      "avgRainfallMm": 770,
      "annualDemandMcm": 430,
      "rainfallDeparturePct": -18.9
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "jhansi",
    "name": "Jhansi",
    "division": "Jhansi",
    "region": "Bundelkhand",
    "coordinates": {
      "lat": 25.44,
      "lng": 78.56
    },
    "waterStatus": "warning",
    "centroid": [
      25.44,
      78.56
    ],
    "projected": [
      228.6,
      543.3
    ],
    "svgPath": "M 256.9,543.3 L 252.2,563.3 L 228.6,568.4 L 210.5,558.7 L 197.9,543.3 L 209.7,527.2 L 228.6,516.2 L 248.4,526.5 Z",
    "areaKm2": 5024,
    "soilType": "Bundelkhand Granitic Complex",
    "slopePct": 4.5,
    "rechargeSuitabilityScore": 70.5,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 13.92,
        "stress_score": 54.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 15.32,
        "stress_score": 57.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 16.72,
        "stress_score": 61.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 18.12,
        "stress_score": 64.9,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 19.52,
        "stress_score": 68.4,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 20.64,
        "stress_score": 71.2,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 21.2,
        "stress_score": 72.6,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 21.76,
        "stress_score": 74.0,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 22.32,
        "stress_score": 75.4,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 23.72,
        "stress_score": 78.9,
        "category": "Over-Exploited",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 21.2,
      "groundwaterTrendAnnualCm": -28,
      "cgwbCategory": "Critical",
      "cgwbStageExtractionPct": 95.8,
      "waterStressScore": 62.2,
      "majorRiverBasin": "Betwa & Pahuj",
      "avgRainfallMm": 840,
      "annualDemandMcm": 560,
      "rainfallDeparturePct": -11.6
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  },
  {
    "id": "lalitpur",
    "name": "Lalitpur",
    "division": "Jhansi",
    "region": "Bundelkhand",
    "coordinates": {
      "lat": 24.69,
      "lng": 78.41
    },
    "waterStatus": "warning",
    "centroid": [
      24.69,
      78.41
    ],
    "projected": [
      212.4,
      615.0
    ],
    "svgPath": "M 244.3,615.0 L 232.2,631.8 L 212.4,643.1 L 191.7,632.6 L 187.1,615.0 L 190.9,596.7 L 212.4,592.4 L 234.7,596.0 Z",
    "areaKm2": 5039,
    "soilType": "Hard Rock / Basalt",
    "slopePct": 4.1,
    "rechargeSuitabilityScore": 71.7,
    "temporalTrajectory": [
      {
        "year": 2000,
        "depth_m": 12.18,
        "stress_score": 45.8,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2005,
        "depth_m": 13.28,
        "stress_score": 48.6,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2010,
        "depth_m": 14.38,
        "stress_score": 51.4,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2015,
        "depth_m": 15.48,
        "stress_score": 54.1,
        "category": "Semi-Critical",
        "phase": "Historical"
      },
      {
        "year": 2020,
        "depth_m": 16.58,
        "stress_score": 56.8,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2024,
        "depth_m": 17.46,
        "stress_score": 59.1,
        "category": "Critical",
        "phase": "Historical"
      },
      {
        "year": 2026,
        "depth_m": 17.9,
        "stress_score": 60.1,
        "category": "Critical",
        "phase": "Current Baseline"
      },
      {
        "year": 2028,
        "depth_m": 18.34,
        "stress_score": 61.2,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2030,
        "depth_m": 18.78,
        "stress_score": 62.4,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      },
      {
        "year": 2035,
        "depth_m": 19.88,
        "stress_score": 65.1,
        "category": "Critical",
        "phase": "AI Projected Horizon"
      }
    ],
    "modernWaterMetrics": {
      "groundwaterDepthM": 17.9,
      "groundwaterTrendAnnualCm": -22,
      "cgwbCategory": "Semi-Critical",
      "cgwbStageExtractionPct": 84.5,
      "waterStressScore": 49.0,
      "majorRiverBasin": "Betwa & Jamni",
      "avgRainfallMm": 880,
      "annualDemandMcm": 480,
      "rainfallDeparturePct": -7.4
    },
    "recommendedRechargeStructures": [
      {
        "structure": "Check Dam / Gully Plug",
        "capacity_m3_yr": 9200,
        "unit_cost_inr": 380000,
        "suitability": 95,
        "target": "Impounds seasonal storm discharge along stream beds."
      },
      {
        "structure": "Multi-Layered Filter Recharge Pit",
        "capacity_m3_yr": 550,
        "unit_cost_inr": 35000,
        "suitability": 90,
        "target": "Captures urban & institutional rooftop runoff."
      },
      {
        "structure": "Amrit Sarovar / Percolation Pond Renovation",
        "capacity_m3_yr": 5400,
        "unit_cost_inr": 240000,
        "suitability": 86,
        "target": "Village community depression revival and silt removal."
      },
      {
        "structure": "Deep Injection Well with Desilting Chamber",
        "capacity_m3_yr": 1250,
        "unit_cost_inr": 85000,
        "suitability": 68,
        "target": "Replenishes deep unconfined aquifer zone."
      }
    ]
  }
];

export const PLANNING_HORIZONS = [
  { id: "h_2000", label: "2000 Baseline", year: 2000, desc: "Pre-Tubewell Boom Baseline: Shallow water table, stable unconfined aquifers." },
  { id: "h_2010", label: "2010 Tubewell Surge", year: 2010, desc: "Rapid agricultural electrification; initial overdraft in Upper Doab & Braj." },
  { id: "h_2020", label: "2020 Stress Surge", year: 2020, desc: "Emergence of over-exploited blocks across NCR, Western UP & Bundelkhand." },
  { id: "h_2026", label: "2026 Live Telemetry", year: 2026, desc: "Current real-time observation horizon with CGWB & IoT monitoring nodes." },
  { id: "h_2028", label: "2028 +2Y ML Forecast", year: 2028, desc: "XGBoost + LSTM multi-horizon prediction under existing extraction rates." },
  { id: "h_2030", label: "2030 +4Y Decadal Target", year: 2030, desc: "Critical planning threshold for Atal Bhujal Yojana & Amrit Sarovar impact." },
  { id: "h_2035", label: "2035 Climate Horizon", year: 2035, desc: "Long-term climate change projection without intervention mitigation." }
];

export const UP_75_DISTRICTS = UP_75_WATER_DISTRICTS;
export type DistrictAtlasEntity = DistrictWaterEntity;
export const ERA_PRESETS = PLANNING_HORIZONS;
