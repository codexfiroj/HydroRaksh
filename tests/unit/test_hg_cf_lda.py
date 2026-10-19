"""
Unit Tests for Hydro-Geological Collaborative Filtering (HG-CF),
LDA Document Intelligence, and Conservation Decision Engine.
"""

import pytest
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from services.ml.models.hg_cf import HydroGeologicalCollaborativeFiltering
from services.ml.models.topic_model import HydrologicalTopicModel
from services.ml.models.conservation import ConservationInterventionEngine
from services.ml.models.forecaster import GroundwaterForecaster


@pytest.fixture
def sample_districts():
    return [
        {"id": "agra", "name": "Agra", "soil_type": "Sandy Loam", "slope_pct": 1.2, "rainfall_departure_pct": -12.0, "stage_extraction_pct": 110.0, "depth_m": 16.5},
        {"id": "mathura", "name": "Mathura", "soil_type": "Alluvial", "slope_pct": 1.0, "rainfall_departure_pct": -15.0, "stage_extraction_pct": 105.0, "depth_m": 18.0},
        {"id": "varanasi", "name": "Varanasi", "soil_type": "Deep Alluvium", "slope_pct": 0.8, "rainfall_departure_pct": 5.0, "stage_extraction_pct": 68.0, "depth_m": 9.2},
        {"id": "jhansi", "name": "Jhansi", "soil_type": "Bundelkhand Hard Rock", "slope_pct": 3.5, "rainfall_departure_pct": -8.0, "stage_extraction_pct": 74.0, "depth_m": 12.0},
        {"id": "pune", "name": "Pune", "soil_type": "Medium Black Basaltic Soil", "slope_pct": 2.5, "rainfall_departure_pct": -10.0, "stage_extraction_pct": 82.0, "depth_m": 14.0},
    ]


def test_hg_cf_model_training_and_similarity(sample_districts):
    """Verify HG-CF fits hydrogeological features and computes valid similarity kernel."""
    model = HydroGeologicalCollaborativeFiltering(n_factors=4, n_iterations=15)
    model.fit(sample_districts)
    
    assert model.is_fitted
    assert len(model.district_ids) == len(sample_districts)
    assert len(model.intervention_ids) > 0
    assert model.S_H is not None
    
    # Verify similarity matrix properties: non-negative, symmetric, unit diagonal
    n = len(sample_districts)
    assert model.S_H.shape == (n, n)
    assert np.allclose(model.S_H, model.S_H.T, atol=1e-5)
    assert np.allclose(np.diag(model.S_H), 1.0, atol=1e-5)
    assert np.all(model.S_H >= 0)


def test_hg_cf_recommendations_and_evidence_tiers(sample_districts):
    """Verify HG-CF outputs ranked recommendations with 3-tier evidence classification."""
    model = HydroGeologicalCollaborativeFiltering(n_factors=4, n_iterations=15)
    model.fit(sample_districts)
    
    recs = model.recommend_interventions("agra", top_k=4)
    assert len(recs) <= 4
    assert len(recs) > 0
    
    for r in recs:
        assert "name" in r
        assert "suitability_score" in r
        assert "evidence_tier" in r
        assert r["evidence_tier"] in [
            "OBSERVED_OUTCOME",
            "INFERRED_SIMILARITY",
            "EXPERT_REVIEW_REQUIRED"
        ]
        assert "annual_capacity_m3" in r
        assert 0 <= r["suitability_score"] <= 100


def test_hg_cf_cold_start(sample_districts):
    """Verify HG-CF handles cold-start districts with zero historical outcomes using content projection."""
    model = HydroGeologicalCollaborativeFiltering(n_factors=4, n_iterations=15)
    model.fit(sample_districts)
    
    cold_features = {
        "soil_type": "Basaltic Hard Rock",
        "slope_pct": 3.8,
        "rainfall_departure_pct": -22.0,
        "stage_extraction_pct": 125.0,
        "depth_m": 22.0,
    }
    
    cold_recs = model.recommend_interventions("cold_district_xyz", district_meta=cold_features, top_k=3)
    assert len(cold_recs) == 3
    for r in cold_recs:
        assert "evidence_tier" in r
        assert r["evidence_tier"] in ["INFERRED_SIMILARITY", "EXPERT_REVIEW_REQUIRED"]


def test_hg_cf_evaluation(sample_districts):
    """Verify HG-CF evaluation on held-out samples without fabricated numbers."""
    model = HydroGeologicalCollaborativeFiltering(n_factors=4, n_iterations=20)
    model.fit(sample_districts)
    
    eval_res = model.evaluate_model(test_ratio=0.3, k=3)
    assert "precision_at_k" in eval_res
    assert "ndcg_at_k" in eval_res
    assert 0.0 <= eval_res["precision_at_k"] <= 1.0
    assert 0.0 <= eval_res["ndcg_at_k"] <= 1.0


def test_lda_topic_model_fit_and_inference():
    """Verify LDA discovers coherent hydrological topics and produces valid distress vectors."""
    lda = HydrologicalTopicModel(n_topics=6)
    lda.fit()
    
    assert lda.is_fitted
    topics = lda.get_topic_keywords(top_n=5)
    assert len(topics) == 6
    
    for topic_id, t_info in topics.items():
        assert "label" in t_info
        assert "top_keywords" in t_info
        assert len(t_info["top_keywords"]) > 0
    
    # Test document transform
    sample_text = "Severe groundwater depletion and declining water table due to excessive tubewell irrigation in alluvial aquifers."
    inferred = lda.infer_topics(sample_text)
    assert "dominant_topic_id" in inferred
    assert "topic_distribution" in inferred
    assert len(inferred["topic_distribution"]) == 6


def test_lda_semantic_search_and_district_profile():
    """Verify document semantic search and qualitative district distress vector."""
    lda = HydrologicalTopicModel(n_topics=6)
    lda.fit()
    
    # Search
    results = lda.search_documents("arsenic contamination and heavy metals", limit=3)
    assert len(results) > 0
    for res in results:
        assert "id" in res
        assert "similarity_score" in res
        assert 0.0 <= res["similarity_score"] <= 1.0
    
    # District distress profile
    profile = lda.get_district_thematic_profile("Agra")
    assert profile["district"] == "Agra"
    assert "thematic_breakdown" in profile
    assert len(profile["thematic_vector"]) == 6


def test_conservation_decision_engine():
    """Verify geomorphological rules engine applies depth, slope, and water quality constraints."""
    district_profile = {
        "district_id": "agra",
        "name": "Agra",
        "soil_type": "Sandy Loam",
        "slope_pct": 1.2,
        "depth_m": 16.5,
        "stage_extraction_pct": 115.0,
        "major_river_basin": "Yamuna",
        "rainfall_mm": 650.0,
        "cgwb_category": "Over-Exploited"
    }
    
    interventions = ConservationInterventionEngine.evaluate_interventions(district_profile)
    assert len(interventions) > 0
    
    first = interventions[0]
    assert "name" in first
    assert "suitability_score" in first
    assert "evidence_tier" in first
    assert "statutory_disclaimer" in first
    assert "decision-support" in first["statutory_disclaimer"].lower()


def test_forecaster_rolling_origin_and_holdouts():
    """Verify groundwater forecaster supports rolling-origin and geographic holdout evaluation."""
    # Synthesize realistic time series DataFrame
    dates = pd.date_range("2020-01-01", "2024-12-01", freq="MS")
    records = []
    for st_id in ["ST-001", "ST-002", "ST-003", "ST-004"]:
        for d in dates:
            records.append({
                "station_id": st_id,
                "date": d,
                "water_depth_m": 15.0 + np.sin(d.month / 12 * 2 * np.pi) * 2.0 + np.random.normal(0, 0.2),
                "rainfall_monthly_mm": max(0.0, np.sin(d.month / 12 * 2 * np.pi - 1.5) * 120.0),
                "soil_moisture_m3_m3": 0.22,
                "lag_depth_1m": 15.0,
                "lag_depth_3m": 14.8,
                "rainfall_3m_sum": 150.0
            })
    df = pd.DataFrame(records)

    forecaster = GroundwaterForecaster()
    
    # Rolling origin evaluation
    ro_metrics = forecaster.rolling_origin_evaluate(df, test_years=[2023, 2024])
    assert "average_mae_m" in ro_metrics
    assert "windows_evaluated" in ro_metrics
    assert ro_metrics["average_mae_m"] > 0
    
    # Geographic holdout evaluation
    geo_metrics = forecaster.geographic_holdout_evaluate(df, holdout_station_ids=["ST-003", "ST-004"])
    assert "spatial_generalization_mae_m" in geo_metrics
    assert "spatial_generalization_rmse_m" in geo_metrics
    assert geo_metrics["holdout_districts_count"] == 2
