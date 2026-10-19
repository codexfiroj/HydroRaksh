import sys
import os
import argparse
import logging
from typing import List, Dict, Any, Optional

# Ensure project root and apps/api are in sys.path
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("apps/api"))

from app.core.database import SessionLocal
from services.ingestion.connectors.open_meteo import OpenMeteoConnector
from services.ingestion.connectors.cgwb import CGWBConnector
from services.ingestion.connectors.cwc_reservoirs import CWCReservoirConnector
from services.ingestion.connectors.imd_rainfall import IMDRainfallConnector
from services.ingestion.connectors.data_gov_in import DataGovInConnector
from services.ingestion.connectors.soilgrids import SoilGridsConnector
from services.ingestion.connectors.agriculture_crops import AgricultureCropsConnector
from services.ingestion.connectors.census_water_demand import CensusWaterDemandConnector

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s"
)
logger = logging.getLogger("jalsuraksha.ingestion.pipeline")

CONNECTOR_REGISTRY = {
    "open_meteo": OpenMeteoConnector,
    "cgwb": CGWBConnector,
    "cwc": CWCReservoirConnector,
    "imd": IMDRainfallConnector,
    "data_gov_in": DataGovInConnector,
    "soilgrids": SoilGridsConnector,
    "icar_agri": AgricultureCropsConnector,
    "census_india": CensusWaterDemandConnector,
}


def get_all_connectors():
    return [cls() for cls in CONNECTOR_REGISTRY.values()]


def run_connector_by_code(source_code: str) -> Dict[str, Any]:
    if source_code not in CONNECTOR_REGISTRY:
        raise ValueError(f"Unknown connector source: {source_code}. Available: {list(CONNECTOR_REGISTRY.keys())}")
    db = SessionLocal()
    conn = CONNECTOR_REGISTRY[source_code]()
    try:
        res = conn.run(db)
        return res
    finally:
        db.close()


def run_all_connectors(source_codes: Optional[List[str]] = None) -> List[Dict[str, Any]]:
    logger.info("==================================================")
    logger.info("Starting JalSuraksha Pan-India Data Ingestion Pipeline")
    logger.info("==================================================")
    
    db = SessionLocal()
    selected_keys = source_codes or list(CONNECTOR_REGISTRY.keys())
    results = []

    for key in selected_keys:
        if key not in CONNECTOR_REGISTRY:
            logger.warning(f"Skipping unknown source code: {key}")
            continue
        conn = CONNECTOR_REGISTRY[key]()
        try:
            res = conn.run(db)
            results.append(res)
        except Exception as e:
            logger.error(f"Error running connector [{key}]: {e}", exc_info=True)
            results.append({"source": key, "status": "failed", "error": str(e)})

    db.close()
    logger.info(f"Ingestion pipeline completed for {len(results)} sources. Summary: {results}")
    return results


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JalSuraksha Unified Data Ingestion Runner")
    parser.add_argument("--source", type=str, help="Specific source code to run (e.g. cgwb, imd, cwc, open_meteo)")
    args = parser.parse_args()

    if args.source:
        run_connector_by_code(args.source)
    else:
        run_all_connectors()
