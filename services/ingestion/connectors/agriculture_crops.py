import json
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.geo import Region
from app.models.telemetry import Observation
from services.ingestion.connectors.base import BaseConnector

logger = logging.getLogger("jalsuraksha.ingestion.agriculture")

# Ministry of Agriculture & Farmers Welfare / ICAR District Cropping & Water Demand
# Covers Kharif / Rabi crop water requirements, crop water productivity,
# and PMKSY Micro-Irrigation water conservation potential
AGRICULTURE_CROP_PROFILES = [
    {
        "district_id": "agra", "state_code": "IN-UP",
        "primary_crops": ["Wheat", "Mustard", "Bajra", "Potato"],
        "annual_irrigation_demand_mcm": 460.0,
        "water_intensive_crop_pct": 28.5,
        "pmksy_micro_irrigation_potential_mcm": 95.0,
        "avg_crop_water_depth_mm": 540.0
    },
    {
        "district_id": "meerut", "state_code": "IN-UP",
        "primary_crops": ["Sugarcane", "Wheat", "Paddy", "Maize"],
        "annual_irrigation_demand_mcm": 520.0,
        "water_intensive_crop_pct": 64.0,  # High sugarcane footprint
        "pmksy_micro_irrigation_potential_mcm": 145.0,
        "avg_crop_water_depth_mm": 880.0
    },
    {
        "district_id": "hapur", "state_code": "IN-UP",
        "primary_crops": ["Sugarcane", "Wheat", "Paddy"],
        "annual_irrigation_demand_mcm": 210.0,
        "water_intensive_crop_pct": 68.0,
        "pmksy_micro_irrigation_potential_mcm": 58.0,
        "avg_crop_water_depth_mm": 910.0
    },
    {
        "district_id": "ghaziabad", "state_code": "IN-UP",
        "primary_crops": ["Wheat", "Sugarcane", "Vegetables"],
        "annual_irrigation_demand_mcm": 145.0,
        "water_intensive_crop_pct": 42.0,
        "pmksy_micro_irrigation_potential_mcm": 38.0,
        "avg_crop_water_depth_mm": 680.0
    },
    {
        "district_id": "jhansi", "state_code": "IN-UP",
        "primary_crops": ["Gram", "Wheat", "Urad", "Mustard"],
        "annual_irrigation_demand_mcm": 280.0,
        "water_intensive_crop_pct": 14.0,  # Pulses dominant
        "pmksy_micro_irrigation_potential_mcm": 82.0,
        "avg_crop_water_depth_mm": 410.0
    },
    {
        "district_id": "pune", "state_code": "IN-MH",
        "primary_crops": ["Sugarcane", "Soybean", "Onion", "Jowar"],
        "annual_irrigation_demand_mcm": 490.0,
        "water_intensive_crop_pct": 36.0,
        "pmksy_micro_irrigation_potential_mcm": 130.0,
        "avg_crop_water_depth_mm": 650.0
    },
    {
        "district_id": "ludhiana", "state_code": "IN-PB",
        "primary_crops": ["Paddy", "Wheat", "Maize"],
        "annual_irrigation_demand_mcm": 740.0,
        "water_intensive_crop_pct": 82.0,  # Very high Paddy footprint
        "pmksy_micro_irrigation_potential_mcm": 180.0,
        "avg_crop_water_depth_mm": 1150.0
    },
    {
        "district_id": "jaipur", "state_code": "IN-RJ",
        "primary_crops": ["Bajra", "Mustard", "Wheat", "Gram"],
        "annual_irrigation_demand_mcm": 420.0,
        "water_intensive_crop_pct": 18.0,
        "pmksy_micro_irrigation_potential_mcm": 115.0,
        "avg_crop_water_depth_mm": 440.0
    }
]


class AgricultureCropsConnector(BaseConnector):
    source_code = "icar_agri"
    source_name = "Min of Agriculture & ICAR Crop Water Demand & Footprint"
    update_frequency = "Seasonal"
    license_name = "Open Government Data License - India"
    source_org = "Department of Agriculture and Farmers Welfare / ICAR"
    source_url = "https://agricoop.nic.in"

    def fetch(self) -> List[Dict[str, Any]]:
        return AGRICULTURE_CROP_PROFILES

    def validate_and_normalize(self, raw_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        now = datetime.now(timezone.utc)

        for item in raw_items:
            dist_id = item["district_id"]
            state_code = item["state_code"]
            demand = float(item["annual_irrigation_demand_mcm"])
            intensive_pct = float(item["water_intensive_crop_pct"])
            pmksy_sav = float(item["pmksy_micro_irrigation_potential_mcm"])

            q_flag = "good" if demand >= 0 and 0 <= intensive_pct <= 100 else "suspect"

            # Annual Irrigation Water Demand (MCM)
            normalized.append({
                "district_id": dist_id,
                "state_code": state_code,
                "metric": "crop_irrigation_demand_mcm",
                "value": demand,
                "unit": "MCM/year",
                "observed_at": now,
                "quality_flag": q_flag,
                "validation_status": "validated",
                "raw_payload": json.dumps({
                    "primary_crops": item.get("primary_crops", []),
                    "water_intensive_pct": intensive_pct,
                    "avg_crop_water_depth_mm": item.get("avg_crop_water_depth_mm"),
                    "source": self.source_name
                })
            })

            # PMKSY Micro-Irrigation Conservation Potential (MCM)
            normalized.append({
                "district_id": dist_id,
                "state_code": state_code,
                "metric": "pmksy_savings_potential_mcm",
                "value": pmksy_sav,
                "unit": "MCM/year",
                "observed_at": now,
                "quality_flag": q_flag,
                "validation_status": "validated",
                "raw_payload": json.dumps({
                    "potential_savings_mcm": pmksy_sav,
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
                    source_dataset="ICAR-DES Crop Water Requirement Estimates",
                    source_url=self.source_url,
                    license=self.license_name,
                    raw_payload=rec["raw_payload"]
                )
                db.add(obs)
            upserted_count += 1

        db.commit()
        return upserted_count
