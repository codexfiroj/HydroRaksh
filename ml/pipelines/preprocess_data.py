"""
Data Preprocessing and Feature Assembly Pipeline.
Merges groundwater time series with district hydrogeological features,
constructs non-leaking lags and rolling statistics, and partitions into train/test sets.
"""

import sys
import os
import argparse
import logging
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.data_loading import load_groundwater_observations, load_districts_hydrogeology
from src.feature_engineering import (
    build_temporal_features,
    create_lag_features,
    create_rolling_features,
    engineer_hydrogeological_features
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("preprocess_data")


def run_preprocessing_pipeline(sample_mode: bool = False, test_size_fraction: float = 0.2):
    logger.info("Starting JalSuraksha Data Preprocessing Pipeline...")

    # Load data
    gw_df = load_groundwater_observations(sample_mode=sample_mode)
    districts_df = load_districts_hydrogeology()

    # Engineer hydrogeological indices on district metadata
    districts_fe = engineer_hydrogeological_features(districts_df)

    # Filter valid observation depths
    clean_gw = gw_df.dropna(subset=["depth_to_water_mbgl"]).copy()
    clean_gw = clean_gw[(clean_gw["depth_to_water_mbgl"] >= 0.1) & (clean_gw["depth_to_water_mbgl"] <= 200.0)]

    # Temporal feature enrichment
    timed_gw = build_temporal_features(clean_gw, date_col="recorded_date")

    # Lag and rolling feature generation
    lagged_gw = create_lag_features(timed_gw, target_col="depth_to_water_mbgl", lags=[1, 2, 3])
    rolled_gw = create_rolling_features(lagged_gw, target_col="depth_to_water_mbgl", windows=[3, 6])

    # Merge with district hydrogeological features
    merged = pd.merge(
        rolled_gw,
        districts_fe[[
            "district_id",
            "specific_yield_est",
            "soil_infiltration_mm_hr",
            "recharge_potential_index",
            "stress_intensity",
            "draft_density_mcm_per_sqkm",
            "stage_of_extraction_pct"
        ]],
        on="district_id",
        how="left"
    )

    # Impute missing hydrogeology for unmapped stations with medians
    merged["stage_of_extraction_pct"] = merged["stage_of_extraction_pct"].fillna(75.0)
    merged["recharge_potential_index"] = merged["recharge_potential_index"].fillna(12.0)
    merged["specific_yield_est"] = merged["specific_yield_est"].fillna(0.10)

    # Chronological time-series split (strictly no shuffling)
    merged = merged.sort_values("recorded_date").reset_index(drop=True)
    n_total = len(merged)
    n_test = int(n_total * test_size_fraction)
    n_train = n_total - n_test

    train_df = merged.iloc[:n_train].copy()
    test_df = merged.iloc[n_train:].copy()

    logger.info(f"Processed {n_total} records. Train split: {n_train} records | Test split: {n_test} records.")
    return train_df, test_df


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JalSuraksha Preprocessing Pipeline")
    parser.add_argument("--sample", action="store_true", help="Run in sample mode")
    args = parser.parse_args()
    run_preprocessing_pipeline(sample_mode=args.sample)
