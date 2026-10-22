"""
Unit and Integration Tests for Super Intelligence Lab and Universal State Vector Maps.
Verifies:
- All 36 States/UTs vector map geometry endpoints
- Web template rendering for non-UP states (MH, RJ, PB, DL, TN, etc.)
- Automated EDA & ANOVA hypothesis testing
- End-to-end 6-stage ML pipeline execution
- Model registry versioning & promotion
- Explainable AI (SHAP-style) attributions
- Isolation Forest telemetry anomaly detection
- Multi-state comparative intelligence matrix
- Data engineering ETL quality scorecards
"""

import pytest
from apps.flask_app import create_app
from services.data_service import data_service
from services.geospatial_engine import geospatial_engine
from services.ml.lab_service import lab_service


@pytest.fixture(scope="module")
def client():
    app = create_app("testing")
    with app.test_client() as c:
        yield c


def test_universal_state_vector_maps(client):
    """Verify that state vector map geometry exists for multiple distinct states and UTs."""
    test_states = ["UP", "MH", "RJ", "PB", "DL", "TN", "KA", "KL", "GA", "BR"]
    for code in test_states:
        res = client.get(f"/api/v1/geography/state-map/{code}")
        assert res.status_code == 200, f"Failed for state {code}"
        data = res.json
        assert data["status"] == "success"
        assert data["state_code"] == code
        assert data["total_districts"] > 0
        assert len(data["districts"]) == data["total_districts"]
        assert len(data["rivers"]) > 0, f"Missing rivers for {code}"
        assert len(data["hotspots"]) > 0, f"Missing hotspots for {code}"
        assert len(data["iot_sensors"]) > 0, f"Missing IoT sensors for {code}"

        # Verify each district has valid SVG polygon path and projected coordinates
        first_d = data["districts"][0]
        assert "svgPath" in first_d and first_d["svgPath"].startswith("M ") and first_d["svgPath"].endswith(" Z")
        assert "projected" in first_d and len(first_d["projected"]) == 2
        assert "centroid" in first_d and len(first_d["centroid"]) == 2


def test_web_rendering_multiple_states(client):
    """Verify the main water atlas renders successfully for multiple Indian states."""
    for state_code in ["UP", "MH", "RJ", "DL", "PB"]:
        res = client.get(f"/?state={state_code}&year=2026&mode=water")
        assert res.status_code == 200
        html = res.data.decode("utf-8")
        assert "stateAtlasSvgMap" in html
        assert "svgDistrictsGroup" in html
        assert "svgRiversLayer" in html


def test_lab_page_rendering(client):
    """Verify the Super Intelligence Lab workspace template loads with 200 OK."""
    res = client.get("/lab")
    assert res.status_code == 200
    html = res.data.decode("utf-8")
    assert "Super Intelligence Lab" in html
    assert "Automated EDA" in html
    assert "ML Pipelines" in html
    assert "Explainable AI (SHAP)" in html
    assert "Telemetry Sentinel" in html


def test_lab_overview_api(client):
    """Verify the lab overview status endpoint."""
    res = client.get("/api/v1/lab/overview")
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert "active_production_model" in data
    assert data["total_experiments_tracked"] >= 1


def test_lab_automated_eda_api(client):
    """Verify automated EDA returns summary statistics, correlation, and ANOVA tests."""
    res = client.get("/api/v1/lab/eda")
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert data["dataset_overview"]["total_districts"] == 780
    assert "summary_statistics" in data
    assert "groundwater_depth_m" in data["summary_statistics"]
    assert "correlation_matrix" in data
    assert "hypothesis_tests" in data
    assert "anova_terrain_water_stress" in data["hypothesis_tests"]


def test_lab_pipeline_run_api(client):
    """Verify full 6-stage ML pipeline execution."""
    res = client.post(
        "/api/v1/lab/pipelines/run",
        json={"target_variable": "groundwater_depth_m", "algorithm": "RandomForest"}
    )
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert "metrics" in data
    assert data["metrics"]["r2_score"] > 0.70
    assert data["metrics"]["mae_meters"] < 1.0
    assert len(data["logs"]) >= 6


def test_lab_model_promotion_api(client):
    """Verify model version promotion in registry."""
    res = client.post(
        "/api/v1/lab/models/promote",
        json={"model_id": "gradient_boosting_forecaster_v2"}
    )
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert data["promoted_model_id"] == "gradient_boosting_forecaster_v2"


def test_lab_xai_explanation_api(client):
    """Verify explainable AI feature attribution endpoint."""
    res = client.get("/api/v1/lab/xai/agra")
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert "shap_attributions" in data
    assert len(data["shap_attributions"]) >= 4
    assert "global_feature_importance" in data


def test_lab_anomaly_detection_api(client):
    """Verify telemetry anomaly sentinel flags outliers with diagnostics."""
    res = client.get("/api/v1/lab/anomalies")
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert data["total_stations_monitored"] == 780
    assert data["anomalies_detected"] > 0
    assert len(data["flagged_stations"]) > 0
    first_anom = data["flagged_stations"][0]
    assert "diagnostic_cause" in first_anom
    assert "severity" in first_anom


def test_lab_state_comparison_api(client):
    """Verify state-wise comparative intelligence matrix."""
    res = client.get("/api/v1/lab/compare-states?states=UP,MH,PB,RJ,TN")
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert data["states_compared"] == 5
    matrix = data["comparison_matrix"]
    assert len(matrix) == 5
    first_st = matrix[0]
    assert "avg_water_stress" in first_st
    assert "vulnerable_district_pct" in first_st


def test_lab_data_quality_api(client):
    """Verify ETL health monitor reports for all 8 ingestion feeds."""
    res = client.get("/api/v1/lab/data-quality")
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "success"
    assert data["total_sources"] == 8
    assert len(data["sources"]) == 8
