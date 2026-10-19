"""
Model Training Pipeline for JalSuraksha.
Trains forecasting models (Random Forest, Gradient Boosting),
HG-CF recommendation engine, and LDA hydrological topic model,
persisting serialized artifacts and manifests into ml/artifacts/.
"""

import sys
import os
import argparse
import logging
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from pipelines.preprocess_data import run_preprocessing_pipeline
from src.data_loading import load_districts_hydrogeology
from src.recommendation import HGCFRecommendationService
from src.document_mining import DocumentIntelligenceService
from src.model_registry import save_model_artifact
from src.evaluation import evaluate_regression

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_models")


def run_training_pipeline(sample_mode: bool = False):
    logger.info("Starting JalSuraksha Model Training Pipeline...")

    # 1. Prepare data
    train_df, test_df = run_preprocessing_pipeline(sample_mode=sample_mode)

    feature_cols = [
        "month_sin", "month_cos", "doy_sin", "doy_cos",
        "depth_to_water_mbgl_lag_1",
        "depth_to_water_mbgl_roll_mean_3",
        "specific_yield_est",
        "recharge_potential_index",
        "stage_of_extraction_pct"
    ]

    # Gracefully impute initial lag/rolling values using target mean
    mean_depth = float(train_df["depth_to_water_mbgl"].dropna().mean() or 12.0)
    for col in ["depth_to_water_mbgl_lag_1", "depth_to_water_mbgl_roll_mean_3"]:
        train_df[col] = train_df[col].fillna(mean_depth)
        test_df[col] = test_df[col].fillna(mean_depth)

    for col in ["specific_yield_est", "recharge_potential_index", "stage_of_extraction_pct"]:
        train_df[col] = train_df[col].fillna(train_df[col].median() if not train_df[col].dropna().empty else 0.1)
        test_df[col] = test_df[col].fillna(train_df[col].median() if not train_df[col].dropna().empty else 0.1)

    train_clean = train_df.dropna(subset=["depth_to_water_mbgl"])
    test_clean = test_df.dropna(subset=["depth_to_water_mbgl"])

    X_train = train_clean[feature_cols].values
    y_train = train_clean["depth_to_water_mbgl"].values
    X_test = test_clean[feature_cols].values
    y_test = test_clean["depth_to_water_mbgl"].values

    # 2. Train Random Forest Forecaster
    logger.info(f"Training Random Forest Regressor on {len(X_train)} observations...")
    rf_model = RandomForestRegressor(n_estimators=100, max_depth=7, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)
    rf_metrics = evaluate_regression(y_test, rf_preds)
    logger.info(f"Random Forest Test MAE: {rf_metrics['mae']} mbgl | RMSE: {rf_metrics['rmse']} mbgl")

    save_model_artifact(
        model=rf_model,
        model_name="random_forest_forecaster",
        metrics=rf_metrics,
        parameters={"n_estimators": 100, "max_depth": 7, "features": feature_cols},
        dataset_info={"train_samples": len(X_train), "test_samples": len(X_test)}
    )

    # 3. Train Gradient Boosting Forecaster
    logger.info(f"Training Gradient Boosting Regressor...")
    gb_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.06, max_depth=5, random_state=42)
    gb_model.fit(X_train, y_train)
    gb_preds = gb_model.predict(X_test)
    gb_metrics = evaluate_regression(y_test, gb_preds)
    logger.info(f"Gradient Boosting Test MAE: {gb_metrics['mae']} mbgl | RMSE: {gb_metrics['rmse']} mbgl")

    save_model_artifact(
        model=gb_model,
        model_name="gradient_boosting_forecaster",
        metrics=gb_metrics,
        parameters={"n_estimators": 100, "learning_rate": 0.06, "max_depth": 5, "features": feature_cols},
        dataset_info={"train_samples": len(X_train), "test_samples": len(X_test)}
    )

    # 4. Train HG-CF Recommendation Engine
    logger.info("Training Hydro-Geological Collaborative Filtering (HG-CF) model...")
    districts_df = load_districts_hydrogeology()
    district_profiles = []
    for _, row in districts_df.iterrows():
        district_profiles.append({
            "id": row["district_id"],
            "name": row["district_name"],
            "soil_type": row["major_soil_type"] or "Alluvial",
            "slope_pct": float(row["average_slope_percent"] or 1.5),
            "rainfall_departure_pct": -5.0,
            "stage_extraction_pct": float(row["stage_of_extraction_pct"] or 75.0),
            "depth_m": 12.0
        })

    hgcf_service = HGCFRecommendationService(n_factors=6, n_iterations=25)
    hgcf_service.fit(district_profiles)
    hgcf_eval = hgcf_service.evaluate_ranking(top_k=5)
    logger.info(f"HG-CF Evaluation: {hgcf_eval}")

    save_model_artifact(
        model=hgcf_service.model,
        model_name="hg_cf_recommendation_engine",
        metrics=hgcf_eval,
        parameters={"n_factors": 6, "n_iterations": 25, "reg_laplacian": 0.05},
        dataset_info={"districts_count": len(district_profiles)}
    )

    # 5. Fit LDA Topic Model
    logger.info("Fitting Hydrological LDA Topic Model...")
    doc_service = DocumentIntelligenceService(num_topics=6)
    doc_service.fit()
    topics = doc_service.get_topics(top_n_words=5)
    logger.info(f"Extracted {len(topics)} Hydrological Topics.")

    save_model_artifact(
        model=doc_service.model,
        model_name="lda_hydrological_topic_model",
        metrics={"num_topics": 6, "vocab_size": len(doc_service.model.feature_names) if hasattr(doc_service.model, "feature_names") else 0},
        parameters={"num_topics": 6, "random_state": 42},
        dataset_info={"corpus_type": "CGWB_CWC_reports"}
    )

    logger.info("All model artifacts and manifests successfully persisted to ml/artifacts/.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="JalSuraksha Model Training Pipeline")
    parser.add_argument("--sample", action="store_true", help="Run in sample mode")
    args = parser.parse_args()
    run_training_pipeline(sample_mode=args.sample)
