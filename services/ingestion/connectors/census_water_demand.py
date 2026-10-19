import json
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.geo import Region
from app.models.telemetry import Observation
from services.ingestion.connectors.base import BaseConnector

logger = logging.getLogger("jalsuraksha.ingestion.census")

# Census of India & Jal Jeevan Mission (JJM) Domestic Water Demand Benchmarks
# Standards:
#   Rural JJM Benchmark: 55 Litres Per Capita per Day (LPCD)
#   Urban CPHEEO Benchmark: 135 Litres Per Capita per Day (LPCD)
CENSUS_DEMOGRAPHIC_WATER_DATA = [
    {
        "district_id": "agra", "state_code": "IN-UP",
        "total_population": 4418797, "urban_pct": 45.8, "rural_pct": 54.2,
        "jjm_tap_water_coverage_pct": 78.4,
        "annual_domestic_demand_mcm": 147.2
    },
    {
        "district_id": "aligarh", "state_code": "IN-UP",
        "total_population": 3673889, "urban_pct": 33.1, "rural_pct": 66.9,
        "jjm_tap_water_coverage_pct": 82.1,
        "annual_domestic_demand_mcm": 109.5
    },
    {
        "district_id": "ghaziabad", "state_code": "IN-UP",
        "total_population": 4681645, "urban_pct": 67.5, "rural_pct": 32.5,
        "jjm_tap_water_coverage_pct": 91.5,
        "annual_domestic_demand_mcm": 186.4
    },
    {
        "district_id": "hapur", "state_code": "IN-UP",
        "total_population": 1338311, "urban_pct": 39.9, "rural_pct": 60.1,
        "jjm_tap_water_coverage_pct": 84.6,
        "annual_domestic_demand_mcm": 42.5
    },
    {
        "district_id": "meerut", "state_code": "IN-UP",
        "total_population": 3443689, "urban_pct": 51.1, "rural_pct": 48.9,
        "jjm_tap_water_coverage_pct": 86.2,
        "annual_domestic_demand_mcm": 120.6
    },
    {
        "district_id": "lucknow", "state_code": "IN-UP",
        "total_population": 4589838, "urban_pct": 66.2, "rural_pct": 33.8,
        "jjm_tap_water_coverage_pct": 93.0,
        "annual_domestic_demand_mcm": 181.2
    },
    {
        "district_id": "pune", "state_code": "IN-MH",
        "total_population": 9429408, "urban_pct": 61.0, "rural_pct": 39.0,
        "jjm_tap_water_coverage_pct": 94.5,
        "annual_domestic_demand_mcm": 357.0
    },
    {
        "district_id": "bengaluru_urban", "state_code": "IN-KA",
        "total_population": 9621551, "urban_pct": 90.9, "rural_pct": 9.1,
        "jjm_tap_water_coverage_pct": 92.4,
        "annual_domestic_demand_mcm": 448.5
    },
    {
        "district_id": "jaipur", "state_code": "IN-RJ",
        "total_population": 6626178, "urban_pct": 52.4, "rural_pct": 47.6,
        "jjm_tap_water_coverage_pct": 79.2,
        "annual_domestic_demand_mcm": 234.0
    }
]


class CensusWaterDemandConnector(BaseConnector):
    source_code = "census_india"
    source_name = "Census of India & Jal Jeevan Mission Domestic Water Demands"
    update_frequency = "Annual"
    license_name = "Open Government Data License - India"
    source_org = "Office of the Registrar General & Census Commissioner / Dept of Drinking Water & Sanitation"
    source_url = "https://censusindia.gov.in"

    def fetch(self) -> List[Dict[str, Any]]:
        return CENSUS_DEMOGRAPHIC_WATER_DATA

    def validate_and_normalize(self, raw_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        now = datetime.now(timezone.utc)

        for item in raw_items:
            dist_id = item["district_id"]
            state_code = item["state_code"]
            pop = int(item["total_population"])
            dom_demand = float(item["annual_domestic_demand_mcm"])
            jjm_cov = float(item["jjm_tap_water_coverage_pct"])

            q_flag = "good" if pop > 0 and dom_demand > 0 else "suspect"

            # Annual Domestic Demand (MCM)
            normalized.append({
                "district_id": dist_id,
                "state_code": state_code,
                "metric": "domestic_water_demand_mcm",
                "value": dom_demand,
                "unit": "MCM/year",
                "observed_at": now,
                "quality_flag": q_flag,
                "validation_status": "validated",
                "raw_payload": json.dumps({
                    "total_population": pop,
                    "urban_pct": item.get("urban_pct"),
                    "rural_pct": item.get("rural_pct"),
                    "jjm_coverage_pct": jjm_cov,
                    "source": self.source_name
                })
            })

            # JJM Tap Water Coverage (%)
            normalized.append({
                "district_id": dist_id,
                "state_code": state_code,
                "metric": "jjm_tap_water_coverage_pct",
                "value": jjm_cov,
                "unit": "%",
                "observed_at": now,
                "quality_flag": q_flag,
                "validation_status": "validated",
                "raw_payload": json.dumps({
                    "coverage_pct": jjm_cov,
                    "source": self.source_name
                })
            })

        return normalized

    def upsert(self, db: Session, records: List[Dict[str, Any]]) -> int:
        region_cache = {r.name.lower(): r for r in db.query(Region).all()}
        upserted_count = 0

        from services.ingestion.connectors.base import get_or_create_district_station
        for rec in records:
            dist_id = rec.get("district_id", "").lower()
            reg = region_cache.get(dist_id)
            st_id = get_or_create_district_station(
                db,
                district_id=dist_id,
                state_code=rec.get("state_code"),
                lat=reg.latitude if reg else 25.0,
                lon=reg.longitude if reg else 78.0
            )

            existing = db.query(Observation).filter(
                Observation.district_id == dist_id,
                Observation.metric == rec["metric"],
                Observation.observed_at == rec["observed_at"]
            ).first()

            if existing:
                existing.value = rec["value"]
                existing.quality_flag = rec["quality_flag"]
                existing.raw_payload = rec["raw_payload"]
            else:
                obs = Observation(
                    station_id=st_id,
                    region_id=reg.id if reg else None,
                    state_code=rec.get("state_code"),
                    district_id=dist_id,
                    observed_at=rec["observed_at"],
                    metric=rec["metric"],
                    value=rec["value"],
                    unit=rec["unit"],
                    quality_flag=rec["quality_flag"],
                    validation_status=rec["validation_status"],
                    source_id=self.source_code,
                    source_dataset="Census of India & Jal Jeevan Mission Dashboards",
                    source_url=self.source_url,
                    license=self.license_name,
                    raw_payload=rec["raw_payload"]
                )
                db.add(obs)
            upserted_count += 1

        db.commit()
        return upserted_count
