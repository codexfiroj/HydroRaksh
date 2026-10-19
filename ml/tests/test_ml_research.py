"""
Unit Tests for ml/src/ Research and ML Pipeline Modules.
"""

import sys
import os
import pytest
import numpy as np
import pandas as pd

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.data_loading import load_groundwater_observations, load_districts_hydrogeology
from src.data_validation import audit_missingness, validate_plausibility
from src.feature_engineering import create_lag_features, engineer_hydrogeological_features
from src.groundwater_analysis import mann_kendall_trend_test, sens_slope_estimator, classify_gec_2015
from src.forecasting import evaluate_forecast_metrics, rolling_origin_cross_validation
from src.recommendation import HGCFRecommendationService
from src.document_mining import DocumentIntelligenceService
from src.model_registry import save_model_artifact, load_model_artifact


def test_data_loading_and_plausibility():
    df = load_groundwater_observations(sample_mode=True)
    assert not df.empty
    assert "depth_to_water_mbgl" in df.columns
    
    audit = audit_missingness(df)
    assert not audit.empty
    
    plaus = validate_plausibility(df, "depth_to_water_mbgl")
    assert plaus["status"] in ["PASS", "WARNING"]
    assert plaus["observed_min"] >= 0.0


def test_feature_engineering_lags():
    test_df = pd.DataFrame({
        "district_id": ["d1", "d1", "d1", "d1"],
        "recorded_date": pd.date_range("2024-01-01", periods=4, freq="30D"),
        "depth_to_water_mbgl": [10.0, 11.0, 12.0, 13.0]
    })
    lagged = create_lag_features(test_df, target_col="depth_to_water_mbgl", lags=[1, 2])
    assert "depth_to_water_mbgl_lag_1" in lagged.columns
    assert np.isnan(lagged["depth_to_water_mbgl_lag_1"].iloc[0])
    assert lagged["depth_to_water_mbgl_lag_1"].iloc[1] == 10.0


def test_mann_kendall_trend_detection():
    # Downward water table trend (increasing depth = depleting)
    depleting_series = np.array([5.0, 6.0, 7.2, 8.5, 9.8, 11.0, 12.5, 14.0])
    res = mann_kendall_trend_test(depleting_series)
    assert res["s_stat"] > 0
    assert res["is_significant"] is True
    assert "DEPLETING" in res["trend"]

    # Recharging trend (decreasing depth = recovery)
    recharging_series = np.array([15.0, 13.8, 12.0, 10.5, 9.0, 7.5, 6.0])
    res_rech = mann_kendall_trend_test(recharging_series)
    assert res_rech["s_stat"] < 0
    assert res_rech["is_significant"] is True
    assert "RECHARGING" in res_rech["trend"]


def test_gec_2015_classification():
    safe = classify_gec_2015(55.0, 0.4, 0.02, 0.5, 0.01)
    assert safe["gec_category"] == "Safe"

    over_exploited = classify_gec_2015(120.0, 0.01, 0.25, 0.02, 0.3)
    assert over_exploited["gec_category"] == "Over-Exploited"


def test_recommendation_and_cold_start():
    sample_districts = [
        {"id": "d_agra", "name": "Agra", "soil_type": "Sandy Loam", "slope_pct": 1.2, "rainfall_departure_pct": -12.0, "stage_extraction_pct": 110.0, "depth_m": 16.5},
        {"id": "d_mathura", "name": "Mathura", "soil_type": "Alluvial", "slope_pct": 1.0, "rainfall_departure_pct": -15.0, "stage_extraction_pct": 105.0, "depth_m": 18.0},
        {"id": "d_varanasi", "name": "Varanasi", "soil_type": "Deep Alluvium", "slope_pct": 0.8, "rainfall_departure_pct": 5.0, "stage_extraction_pct": 68.0, "depth_m": 9.2},
    ]
    service = HGCFRecommendationService(n_factors=4, n_iterations=15)
    service.fit(sample_districts)
    
    recs = service.recommend("d_agra", top_k=3)
    assert len(recs) <= 3
    assert len(recs) > 0
    assert "evidence_tier" in recs[0]

    # Cold start on new unseen district
    cold_recs = service.cold_start_recommend({
        "soil_type": "Sandy Loam",
        "slope_pct": 1.1,
        "rainfall_departure_pct": -10.0,
        "stage_extraction_pct": 108.0,
        "depth_m": 17.0
    }, top_k=2)
    assert len(cold_recs) <= 2
    assert len(cold_recs) > 0


def test_document_intelligence_topics():
    doc_service = DocumentIntelligenceService(num_topics=6)
    doc_service.fit()
    topics = doc_service.get_topics(top_n_words=5)
    assert len(topics) == 6
    for t in topics:
        assert "topic_id" in t
        assert len(t["top_words"]) > 0


class DummyModel:
    def predict(self, x):
        return x * 2


def test_model_registry_save_load(tmp_path):
    artifact_path = save_model_artifact(
        model=DummyModel(),
        model_name="dummy_test_model",
        metrics={"mae": 0.5},
        parameters={"factor": 2},
        dataset_info={"n": 10}
    )
    assert os.path.exists(artifact_path)
    loaded_model, meta = load_model_artifact(os.path.basename(artifact_path))
    assert loaded_model.predict(3) == 6
    assert meta["metrics"]["mae"] == 0.5

