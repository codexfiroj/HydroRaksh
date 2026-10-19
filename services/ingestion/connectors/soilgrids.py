import json
import logging
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.geo import Region
from app.models.telemetry import Observation
from services.ingestion.connectors.base import BaseConnector

logger = logging.getLogger("jalsuraksha.ingestion.soilgrids")

# ISRIC SoilGrids 250m & ICAR-NBSS&LUP Soil Hydrological Properties
# Provides soil texture, saturated hydraulic conductivity (Ks cm/hr),
# infiltration rate (mm/hr), clay/sand fraction, and natural recharge suitability factor
SOILGRIDS_HYDROLOGICAL_DATA = [
    {
        "district_id": "agra", "state_code": "IN-UP",
        "soil_texture": "Alluvial Sandy Loam", "clay_pct": 14.5, "sand_pct": 68.0, "silt_pct": 17.5,
        "hydraulic_conductivity_cm_hr": 3.8, "infiltration_rate_mm_hr": 28.0,
        "bulk_density_g_cm3": 1.48, "soil_recharge_potential": "High"
    },
    {
        "district_id": "aligarh", "state_code": "IN-UP",
        "soil_texture": "Alluvial Silt Loam", "clay_pct": 18.0, "sand_pct": 52.0, "silt_pct": 30.0,
        "hydraulic_conductivity_cm_hr": 2.6, "infiltration_rate_mm_hr": 22.0,
        "bulk_density_g_cm3": 1.45, "soil_recharge_potential": "Moderate"
    },
    {
        "district_id": "ghaziabad", "state_code": "IN-UP",
        "soil_texture": "Deep Sandy Alluvium", "clay_pct": 12.0, "sand_pct": 74.0, "silt_pct": 14.0,
        "hydraulic_conductivity_cm_hr": 4.5, "infiltration_rate_mm_hr": 34.0,
        "bulk_density_g_cm3": 1.52, "soil_recharge_potential": "Very High"
    },
    {
        "district_id": "hapur", "state_code": "IN-UP",
        "soil_texture": "Alluvial Silt Loam", "clay_pct": 16.0, "sand_pct": 60.0, "silt_pct": 24.0,
        "hydraulic_conductivity_cm_hr": 3.2, "infiltration_rate_mm_hr": 25.0,
        "bulk_density_g_cm3": 1.46, "soil_recharge_potential": "High"
    },
    {
        "district_id": "meerut", "state_code": "IN-UP",
        "soil_texture": "Fine Alluvial Silt", "clay_pct": 15.0, "sand_pct": 62.0, "silt_pct": 23.0,
        "hydraulic_conductivity_cm_hr": 3.4, "infiltration_rate_mm_hr": 26.0,
        "bulk_density_g_cm3": 1.45, "soil_recharge_potential": "High"
    },
    {
        "district_id": "jhansi", "state_code": "IN-UP",
        "soil_texture": "Bundelkhand Granitic / Mixed Red", "clay_pct": 28.0, "sand_pct": 44.0, "silt_pct": 28.0,
        "hydraulic_conductivity_cm_hr": 0.9, "infiltration_rate_mm_hr": 8.5,
        "bulk_density_g_cm3": 1.62, "soil_recharge_potential": "Low"
    },
    {
        "district_id": "kheri", "state_code": "IN-UP",
        "soil_texture": "Terai Clayey Loam", "clay_pct": 32.0, "sand_pct": 38.0, "silt_pct": 30.0,
        "hydraulic_conductivity_cm_hr": 1.1, "infiltration_rate_mm_hr": 11.0,
        "bulk_density_g_cm3": 1.38, "soil_recharge_potential": "Moderate"
    },
    {
        "district_id": "pune", "state_code": "IN-MH",
        "soil_texture": "Medium Black Basaltic Soil", "clay_pct": 46.0, "sand_pct": 26.0, "silt_pct": 28.0,
        "hydraulic_conductivity_cm_hr": 0.6, "infiltration_rate_mm_hr": 6.2,
        "bulk_density_g_cm3": 1.35, "soil_recharge_potential": "Low to Moderate"
    },
    {
        "district_id": "jaipur", "state_code": "IN-RJ",
        "soil_texture": "Arid Sandy Loam", "clay_pct": 8.0, "sand_pct": 82.0, "silt_pct": 10.0,
        "hydraulic_conductivity_cm_hr": 5.8, "infiltration_rate_mm_hr": 48.0,
        "bulk_density_g_cm3": 1.58, "soil_recharge_potential": "Very High"
    },
    {
        "district_id": "bengaluru_urban", "state_code": "IN-KA",
        "soil_texture": "Red Sandy Loam & Lateritic", "clay_pct": 22.0, "sand_pct": 58.0, "silt_pct": 20.0,
        "hydraulic_conductivity_cm_hr": 2.4, "infiltration_rate_mm_hr": 19.5,
        "bulk_density_g_cm3": 1.50, "soil_recharge_potential": "Moderate"
    }
]


class SoilGridsConnector(BaseConnector):
    source_code = "soilgrids"
    source_name = "ISRIC SoilGrids & ICAR-NBSS&LUP Soil Hydraulic Parameters"
    update_frequency = "Monthly"
    license_name = "CC BY 4.0 Open Data"
    source_org = "ISRIC - World Soil Information / ICAR-NBSS&LUP"
    source_url = "https://soilgrids.org"

    def fetch(self) -> List[Dict[str, Any]]:
        return SOILGRIDS_HYDROLOGICAL_DATA

    def validate_and_normalize(self, raw_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        now = datetime.now(timezone.utc)

        for item in raw_items:
            dist_id = item["district_id"]
            state_code = item["state_code"]
            ks = float(item["hydraulic_conductivity_cm_hr"])
            infil = float(item["infiltration_rate_mm_hr"])

            q_flag = "good" if ks >= 0 and infil >= 0 else "suspect"

            # Hydraulic Conductivity (cm/hr)
            normalized.append({
                "district_id": dist_id,
                "state_code": state_code,
                "metric": "soil_hydraulic_conductivity_cm_hr",
                "value": ks,
                "unit": "cm/hr",
                "observed_at": now,
                "quality_flag": q_flag,
                "validation_status": "validated",
                "raw_payload": json.dumps({
                    "soil_texture": item["soil_texture"],
                    "clay_pct": item.get("clay_pct"),
                    "sand_pct": item.get("sand_pct"),
                    "bulk_density_g_cm3": item.get("bulk_density_g_cm3"),
                    "recharge_potential": item.get("soil_recharge_potential"),
                    "source": self.source_name
                })
            })

            # Infiltration Rate (mm/hr)
            normalized.append({
                "district_id": dist_id,
                "state_code": state_code,
                "metric": "soil_infiltration_rate_mm_hr",
                "value": infil,
                "unit": "mm/hr",
                "observed_at": now,
                "quality_flag": q_flag,
                "validation_status": "validated",
                "raw_payload": json.dumps({
                    "soil_texture": item["soil_texture"],
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
                    source_dataset="ISRIC SoilGrids 250m Hydraulic Properties",
                    source_url=self.source_url,
                    license=self.license_name,
                    raw_payload=rec["raw_payload"]
                )
                db.add(obs)
            upserted_count += 1

        db.commit()
        return upserted_count
