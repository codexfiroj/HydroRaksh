"""
Data Ingestion Pipeline for JalSuraksha.
Audits database connectivity, ingests groundwater observations, rainfall,
and district profiles, and performs initial schema and plausibility checks.
"""

import sys
import os
import argparse
import logging
from datetime import datetime, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.data_loading import (
    load_groundwater_observations,
    load_districts_hydrogeology,
    load_rainfall_series,
    load_water_quality_records
)
from src.data_validation import audit_missingness, validate_plausibility

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ingest_data")


def run_ingestion_pipeline(sample_mode: bool = False):
    logger.info("Starting JalSuraksha Data Ingestion Pipeline...")
    logger.info(f"Execution Mode: {'SAMPLE (Fast dev/test)' if sample_mode else 'FULL (Complete repository)'}")

    # 1. Ingest groundwater observations
    gw_df = load_groundwater_observations(sample_mode=sample_mode)
    logger.info(f"Loaded {len(gw_df)} groundwater observation records across {gw_df['district_id'].nunique()} districts.")

    # 2. Ingest district hydrogeology
    districts_df = load_districts_hydrogeology()
    logger.info(f"Loaded {len(districts_df)} Pan-India district hydrogeological profiles across {districts_df['state'].nunique()} states.")

    # 3. Ingest rainfall series
    rainfall_df = load_rainfall_series(sample_mode=sample_mode)
    logger.info(f"Loaded {len(rainfall_df)} precipitation records.")

    # 4. Ingest water quality
    wq_df = load_water_quality_records()
    logger.info(f"Loaded {len(wq_df)} physicochemical water quality sample records.")

    # 5. Run validation checks
    gw_audit = audit_missingness(gw_df)
    plausibility = validate_plausibility(gw_df, "depth_to_water_mbgl")
    logger.info(f"Groundwater depth plausibility check: {plausibility['status']} (violations: {plausibility['violations_count']})")

    logger.info("Data Ingestion Pipeline completed successfully.")
    return {
        "groundwater_records": len(gw_df),
        "districts_count": len(districts_df),
        "rainfall_records": len(rainfall_df),
        "water_quality_samples": len(wq_df),
        "timestamp_utc": datetime.now(timezone.utc).isoformat()
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JalSuraksha Ingestion Pipeline")
    parser.add_argument("--sample", action="store_true", help="Run in sample mode for rapid testing")
    args = parser.parse_args()
    run_ingestion_pipeline(sample_mode=args.sample)
