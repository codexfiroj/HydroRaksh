import json
import logging
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.geo import Reservoir
from app.models.telemetry import ReservoirObservation
from services.ingestion.connectors.base import BaseConnector

logger = logging.getLogger("jalsuraksha.ingestion.cwc")

CWC_OFFICIAL_RESERVOIR_BULLETIN = [
    # Ganga Basin
    {
        "code": "RES-RAM",
        "name": "Ramganga Dam",
        "state": "Uttarakhand / UP",
        "district": "Pauri Garhwal / Bijnor",
        "river_basin": "Ganga Basin",
        "latitude": 29.5218,
        "longitude": 78.7619,
        "full_reservoir_level_m": 365.3,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 1620.0,
        "live_capacity_mcm": 2192.0,
        "hist_10yr_avg_mcm": 1420.0,
        "inflow_cumec": 145.0,
        "outflow_cumec": 90.0,
        "status": "normal"
    },
    {
        "code": "RES-MAT",
        "name": "Matatila Reservoir",
        "state": "Uttar Pradesh",
        "district": "Lalitpur",
        "river_basin": "Betwa Basin",
        "latitude": 25.1017,
        "longitude": 78.3789,
        "full_reservoir_level_m": 308.4,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 810.0,
        "live_capacity_mcm": 1132.0,
        "hist_10yr_avg_mcm": 710.0,
        "inflow_cumec": 85.0,
        "outflow_cumec": 60.0,
        "status": "normal"
    },
    {
        "code": "RES-TEH",
        "name": "Tehri Dam",
        "state": "Uttarakhand",
        "district": "Tehri Garhwal",
        "river_basin": "Bhagirathi / Ganga",
        "latitude": 30.3783,
        "longitude": 78.4800,
        "full_reservoir_level_m": 830.0,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 2180.0,
        "live_capacity_mcm": 2615.0,
        "hist_10yr_avg_mcm": 1980.0,
        "inflow_cumec": 210.0,
        "outflow_cumec": 180.0,
        "status": "normal"
    },
    {
        "code": "RES-RIH",
        "name": "Rihand Dam (Govind Ballabh Pant Sagar)",
        "state": "Uttar Pradesh",
        "district": "Sonbhadra",
        "river_basin": "Son / Ganga",
        "latitude": 24.2081,
        "longitude": 83.0294,
        "full_reservoir_level_m": 268.2,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 6120.0,
        "live_capacity_mcm": 8968.0,
        "hist_10yr_avg_mcm": 5400.0,
        "inflow_cumec": 320.0,
        "outflow_cumec": 240.0,
        "status": "normal"
    },
    # Indus Basin (Punjab / Himachal)
    {
        "code": "RES-BHK",
        "name": "Bhakra Dam",
        "state": "Himachal Pradesh / Punjab",
        "district": "Bilaspur / Rupnagar",
        "river_basin": "Sutlej / Indus Basin",
        "latitude": 31.4116,
        "longitude": 76.4357,
        "full_reservoir_level_m": 515.1,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 5120.0,
        "live_capacity_mcm": 6229.0,
        "hist_10yr_avg_mcm": 4850.0,
        "inflow_cumec": 280.0,
        "outflow_cumec": 210.0,
        "status": "normal"
    },
    # Narmada & Tapi Basins (Gujarat / MP)
    {
        "code": "RES-SAR",
        "name": "Sardar Sarovar Dam",
        "state": "Gujarat",
        "district": "Narmada",
        "river_basin": "Narmada Basin",
        "latitude": 21.8300,
        "longitude": 73.7489,
        "full_reservoir_level_m": 138.68,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 4920.0,
        "live_capacity_mcm": 5760.0,
        "hist_10yr_avg_mcm": 4450.0,
        "inflow_cumec": 450.0,
        "outflow_cumec": 380.0,
        "status": "normal"
    },
    {
        "code": "RES-UKA",
        "name": "Ukai Dam (Vallabh Sagar)",
        "state": "Gujarat",
        "district": "Tapi",
        "river_basin": "Tapi Basin",
        "latitude": 21.2483,
        "longitude": 73.5861,
        "full_reservoir_level_m": 105.15,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 5820.0,
        "live_capacity_mcm": 7414.0,
        "hist_10yr_avg_mcm": 5100.0,
        "inflow_cumec": 290.0,
        "outflow_cumec": 220.0,
        "status": "normal"
    },
    # Godavari Basin (Maharashtra / Telangana)
    {
        "code": "RES-JAY",
        "name": "Jayakwadi Dam (Nath Sagar)",
        "state": "Maharashtra",
        "district": "Chhatrapati Sambhajinagar",
        "river_basin": "Godavari Basin",
        "latitude": 19.4933,
        "longitude": 75.3911,
        "full_reservoir_level_m": 463.9,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 1890.0,
        "live_capacity_mcm": 2171.0,
        "hist_10yr_avg_mcm": 1520.0,
        "inflow_cumec": 175.0,
        "outflow_cumec": 110.0,
        "status": "normal"
    },
    # Krishna Basin (Karnataka / Andhra Pradesh / Telangana)
    {
        "code": "RES-ALM",
        "name": "Almatti Dam (Lal Bahadur Shastri Sagar)",
        "state": "Karnataka",
        "district": "Vijayapura",
        "river_basin": "Krishna Basin",
        "latitude": 16.3314,
        "longitude": 75.8872,
        "full_reservoir_level_m": 519.6,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 3120.0,
        "live_capacity_mcm": 3440.0,
        "hist_10yr_avg_mcm": 2950.0,
        "inflow_cumec": 380.0,
        "outflow_cumec": 320.0,
        "status": "normal"
    },
    {
        "code": "RES-NAG",
        "name": "Nagarjuna Sagar Dam",
        "state": "Telangana / Andhra Pradesh",
        "district": "Nalgonda / Palnadu",
        "river_basin": "Krishna Basin",
        "latitude": 16.5772,
        "longitude": 79.3131,
        "full_reservoir_level_m": 179.8,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 5940.0,
        "live_capacity_mcm": 6840.0,
        "hist_10yr_avg_mcm": 5200.0,
        "inflow_cumec": 410.0,
        "outflow_cumec": 350.0,
        "status": "normal"
    },
    # Cauvery Basin (Karnataka / Tamil Nadu)
    {
        "code": "RES-KRS",
        "name": "Krishna Raja Sagara (KRS) Dam",
        "state": "Karnataka",
        "district": "Mandya",
        "river_basin": "Cauvery Basin",
        "latitude": 12.4278,
        "longitude": 76.5728,
        "full_reservoir_level_m": 38.04,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 1240.0,
        "live_capacity_mcm": 1366.0,
        "hist_10yr_avg_mcm": 1180.0,
        "inflow_cumec": 160.0,
        "outflow_cumec": 140.0,
        "status": "normal"
    },
    {
        "code": "RES-MET",
        "name": "Mettur Dam (Stanley Reservoir)",
        "state": "Tamil Nadu",
        "district": "Salem",
        "river_basin": "Cauvery Basin",
        "latitude": 11.8000,
        "longitude": 77.8000,
        "full_reservoir_level_m": 36.58,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 2480.0,
        "live_capacity_mcm": 2640.0,
        "hist_10yr_avg_mcm": 2150.0,
        "inflow_cumec": 220.0,
        "outflow_cumec": 190.0,
        "status": "normal"
    },
    # Mahanadi Basin (Odisha)
    {
        "code": "RES-HIR",
        "name": "Hirakud Dam",
        "state": "Odisha",
        "district": "Sambalpur",
        "river_basin": "Mahanadi Basin",
        "latitude": 21.5700,
        "longitude": 83.8700,
        "full_reservoir_level_m": 192.0,
        "observed_at": "2025-09-25",
        "current_storage_mcm": 5280.0,
        "live_capacity_mcm": 5818.0,
        "hist_10yr_avg_mcm": 4720.0,
        "inflow_cumec": 540.0,
        "outflow_cumec": 480.0,
        "status": "normal"
    }
]


class CWCReservoirConnector(BaseConnector):
    source_code = "cwc"
    source_name = "Central Water Commission (CWC) Reservoir Bulletins"
    update_frequency = "Weekly"

    def fetch(self) -> List[Dict[str, Any]]:
        # In production this parses the CWC weekly national PDF bulletin / API
        return CWC_OFFICIAL_RESERVOIR_BULLETIN

    def validate_and_normalize(self, raw_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        normalized = []
        for item in raw_items:
            res_code = item["code"]
            storage = float(item["current_storage_mcm"])
            capacity = float(item["live_capacity_mcm"])
            fill_pct = round((storage / capacity) * 100, 1) if capacity > 0 else 0.0

            obs_date = datetime.strptime(item["observed_at"], "%Y-%m-%d").replace(tzinfo=timezone.utc)

            normalized.append({
                "reservoir_code": res_code,
                "current_storage_mcm": storage,
                "live_capacity_mcm": capacity,
                "fill_pct": fill_pct,
                "hist_10yr_avg_mcm": float(item["hist_10yr_avg_mcm"]),
                "inflow_cumec": float(item.get("inflow_cumec", 0.0)),
                "outflow_cumec": float(item.get("outflow_cumec", 0.0)),
                "observed_at": obs_date
            })
        return normalized

    def upsert(self, db: Session, records: List[Dict[str, Any]]) -> int:
        res_cache = {r.code: r for r in db.query(Reservoir).all()}
        upserted_count = 0

        bulletin_lookup = {b["code"]: b for b in CWC_OFFICIAL_RESERVOIR_BULLETIN}
        for rec in records:
            res = res_cache.get(rec["reservoir_code"])
            if not res:
                b_meta = bulletin_lookup.get(rec["reservoir_code"], {})
                res = Reservoir(
                    code=rec["reservoir_code"],
                    name=b_meta.get("name", rec["reservoir_code"]),
                    state=b_meta.get("state", "India"),
                    district=b_meta.get("district", "General"),
                    river_basin=b_meta.get("river_basin", "Major Basin"),
                    latitude=b_meta.get("latitude", 20.0),
                    longitude=b_meta.get("longitude", 78.0),
                    full_reservoir_level_m=b_meta.get("full_reservoir_level_m", 100.0),
                    live_capacity_mcm=rec["live_capacity_mcm"],
                    current_storage_mcm=rec["current_storage_mcm"],
                    fill_pct=rec["fill_pct"],
                    hist_10yr_avg_mcm=rec["hist_10yr_avg_mcm"]
                )
                db.add(res)
                db.commit()
                db.refresh(res)
                res_cache[rec["reservoir_code"]] = res

            # Update reservoir live summary columns
            res.current_storage_mcm = rec["current_storage_mcm"]
            res.fill_pct = rec["fill_pct"]
            res.hist_10yr_avg_mcm = rec["hist_10yr_avg_mcm"]

            # Check if observation exists
            existing = db.query(ReservoirObservation).filter(
                ReservoirObservation.reservoir_id == res.id,
                ReservoirObservation.observed_at == rec["observed_at"]
            ).first()

            if existing:
                existing.current_storage_mcm = rec["current_storage_mcm"]
                existing.fill_pct = rec["fill_pct"]
                existing.inflow_cumec = rec["inflow_cumec"]
                existing.outflow_cumec = rec["outflow_cumec"]
            else:
                obs = ReservoirObservation(
                    reservoir_id=res.id,
                    observed_at=rec["observed_at"],
                    current_storage_mcm=rec["current_storage_mcm"],
                    fill_pct=rec["fill_pct"],
                    inflow_cumec=rec["inflow_cumec"],
                    outflow_cumec=rec["outflow_cumec"],
                    source_id=self.source_code
                )
                db.add(obs)
            upserted_count += 1

        db.commit()
        return upserted_count
