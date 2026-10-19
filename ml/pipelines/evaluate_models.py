"""
Model Evaluation and Benchmark Reporting Pipeline.
Runs Rolling-Origin Cross-Validation, Geographic Holdout Validation,
and Recommendation Ranking evaluation, outputting structured reports.
"""

import sys
import os
import argparse
import logging
import json
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from pipelines.preprocess_data import run_preprocessing_pipeline
from src.data_loading import load_districts_hydrogeology
from src.forecasting import rolling_origin_cross_validation, geographic_holdout_evaluation
from src.recommendation import HGCFRecommendationService

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("evaluate_models")


def run_evaluation_pipeline(sample_mode: bool = False):
    logger.info("Starting JalSuraksha Model Evaluation Pipeline...")

    train_df, test_df = run_preprocessing_pipeline(sample_mode=sample_mode)
    full_df = pd.concat([train_df, test_df], ignore_index=True)

    feature_cols = [
        "month_sin", "month_cos",
        "depth_to_water_mbgl_lag_1",
        "depth_to_water_mbgl_roll_mean_3",
        "specific_yield_est",
        "recharge_potential_index",
        "stage_of_extraction_pct"
    ]

    mean_depth = float(full_df["depth_to_water_mbgl"].dropna().mean() or 12.0)
    for col in ["depth_to_water_mbgl_lag_1", "depth_to_water_mbgl_roll_mean_3"]:
        full_df[col] = full_df[col].fillna(mean_depth)
    for col in ["specific_yield_est", "recharge_potential_index", "stage_of_extraction_pct"]:
        full_df[col] = full_df[col].fillna(full_df[col].median() if not full_df[col].dropna().empty else 0.1)


    # 1. Rolling-origin cross-validation
    logger.info("Executing 4-fold Rolling-Origin Cross-Validation...")
    ro_results = rolling_origin_cross_validation(
        df=full_df,
        feature_cols=feature_cols,
        target_col="depth_to_water_mbgl",
        n_splits=4
    )
    logger.info("Rolling-Origin Results:")
    for model_name, metrics in ro_results.items():
        logger.info(f"  {model_name}: Mean MAE = {metrics.get('mean_mae')} mbgl | Mean RMSE = {metrics.get('mean_rmse')} mbgl")

    # 2. Geographic holdout evaluation
    all_districts = list(full_df["district_id"].dropna().unique())
    holdout_districts = all_districts[:3] if len(all_districts) >= 3 else all_districts[:1]
    logger.info(f"Executing Geographic Holdout on districts: {holdout_districts}...")
    geo_results = geographic_holdout_evaluation(
        df=full_df,
        districts_list=all_districts,
        holdout_districts=holdout_districts,
        feature_cols=feature_cols,
        target_col="depth_to_water_mbgl"
    )
    logger.info(f"Geographic Holdout MAE: {geo_results.get('held_out_mae')} mbgl | RMSE: {geo_results.get('held_out_rmse')} mbgl")

    # 3. Recommendation Evaluation
    districts_df = load_districts_hydrogeology()
    district_profiles = [
        {
            "id": row["district_id"],
            "name": row["district_name"],
            "soil_type": row["major_soil_type"] or "Alluvial",
            "slope_pct": float(row["average_slope_percent"] or 1.5),
            "rainfall_departure_pct": -5.0,
            "stage_extraction_pct": float(row["stage_of_extraction_pct"] or 75.0),
            "depth_m": 12.0
        }
        for _, row in districts_df.iterrows()
    ]
    hgcf_service = HGCFRecommendationService(n_factors=6, n_iterations=25)
    hgcf_service.fit(district_profiles)
    recs_eval = hgcf_service.evaluate_ranking(top_k=5)
    logger.info(f"HG-CF Evaluation: {recs_eval}")

    report = {
        "rolling_origin_cv": ro_results,
        "geographic_holdout": geo_results,
        "hg_cf_recommendation_evaluation": recs_eval
    }

    report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../artifacts/evaluation_report.json"))
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    logger.info(f"Evaluation report saved to {report_path}")
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JalSuraksha Model Evaluation Pipeline")
    parser.add_argument("--sample", action="store_true", help="Run in sample mode")
    args = parser.parse_args()
    run_evaluation_pipeline(sample_mode=args.sample)
