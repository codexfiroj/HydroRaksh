"""
Unit & Integration Test Suite for JalSuraksha Flask Production Architecture.
Verifies:
- Flask application factory initialization and error handlers
- Pan-India geography registry (36 States/UTs, 700+ Districts)
- Hydrogeological observations, BIS 10500 quality standards, IMD rainfall
- Prescriptive AI decision-support algorithms (Knapsack, What-If, RWH, Water Balance, Crop Shift, Borewell Diagnostics)
- Conversational Hydrogeological AI Assistant with citations
- Citizen field telemetry reporting and error submissions
- Public reports and data export (JSON / CSV)
- Web UI index template rendering
"""

import pytest
from apps.flask_app import create_app

@pytest.fixture(scope="module")
def flask_client():
    app = create_app("testing")
    with app.test_client() as client:
        yield client


def test_flask_health(flask_client):
    """Verify Flask healthcheck status and ML modules."""
    res = flask_client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json
    assert data["status"] == "healthy"
    assert data["pan_india_support"]["states_and_uts"] == 36
    assert data["ml_services"]["knapsack_optimizer"] == "active"


def test_flask_geography_states(flask_client):
    """Verify all 36 States and UTs are returned."""
    res = flask_client.get("/api/v1/geography/states")
    assert res.status_code == 200
    data = res.json
    assert data["total_count"] == 36
    assert data["states_count"] == 28
    assert data["union_territories_count"] == 8


def test_flask_geography_districts(flask_client):
    """Verify district list for Uttar Pradesh and Maharashtra."""
    res_up = flask_client.get("/api/v1/geography/districts?state_code=IN-UP")
    assert res_up.status_code == 200
    assert res_up.json["total_count"] >= 75

    res_mh = flask_client.get("/api/v1/geography/districts?state_code=IN-MH")
    assert res_mh.status_code == 200
    assert res_mh.json["total_count"] >= 3


def test_flask_geography_normalization(flask_client):
    """Verify alias and spelling normalization."""
    res = flask_client.get("/api/v1/geography/normalize?query=Allahabad")
    assert res.status_code == 200
    assert "Prayagraj" in res.json["standardized_record"] or "Allahabad" in res.json["standardized_record"]


def test_flask_telemetry_sources(flask_client):
    """Verify 8 open data ingestion sources."""
    res = flask_client.get("/api/v1/telemetry/sources")
    assert res.status_code == 200
    assert res.json["total_sources"] == 8


def test_flask_water_levels(flask_client):
    """Verify water levels and longitudinal trajectory for Agra."""
    res = flask_client.get("/api/v1/water-levels?district_id=agra")
    assert res.status_code == 200
    data = res.json
    assert data["district_id"] == "agra"
    assert len(data["trajectory"]) > 0


def test_flask_water_quality(flask_client):
    """Verify BIS 10500 water quality screening."""
    res = flask_client.get("/api/v1/water-quality?district_id=saharanpur")
    assert res.status_code == 200
    data = res.json
    assert "ph" in data["metrics"]
    assert "standards" in data


def test_flask_drought_risk(flask_client):
    """Verify composite drought vulnerability index and SHAP weights."""
    res = flask_client.get("/api/v1/drought-risk?district_id=agra")
    assert res.status_code == 200
    data = res.json
    assert "drought_vulnerability_index" in data
    assert len(data["shap_contributions"]) >= 3


def test_flask_jalrakshak_forecast(flask_client):
    """Verify predictive forecasting horizons."""
    res = flask_client.get("/api/v1/jalrakshak/forecast/agra")
    assert res.status_code == 200
    data = res.json
    assert len(data["forecasts"]) >= 4
    assert data["r2_score"] > 0.80


def test_flask_recharge_recommend(flask_client):
    """Verify site-specific recharge structure suitability ranking."""
    payload = {
        "district_id": "meerut",
        "area_type": "urban",
        "slope_pct": 1.2
    }
    res = flask_client.post("/api/v1/jalrakshak/recharge-recommend", json=payload)
    assert res.status_code == 200
    data = res.json
    assert len(data["recommended_interventions"]) >= 4
    assert data["recommended_interventions"][0]["annual_recharge_m3"] > 0


def test_flask_knapsack_budget_optimizer(flask_client):
    """Verify knapsack capital budget allocation within budget bound."""
    payload = {
        "total_budget_inr": 350000.0,
        "district_id": "ghaziabad"
    }
    res = flask_client.post("/api/v1/jalrakshak/optimize-budget", json=payload)
    assert res.status_code == 200
    data = res.json
    assert data["allocated_budget_inr"] <= 350000.0
    assert data["total_annual_recharge_m3"] > 0
    assert len(data["portfolio"]) > 0


def test_flask_what_if_simulator(flask_client):
    """Verify What-If simulation calculates delta depth and stress."""
    payload = {
        "district_id": "varanasi",
        "rainfall_change_pct": 15.0,
        "recharge_structures_added": 4
    }
    res = flask_client.post("/api/v1/jalrakshak/what-if", json=payload)
    assert res.status_code == 200
    data = res.json
    assert "baseline" in data
    assert "simulated" in data
    assert "delta_depth_m" in data["simulated"]


def test_flask_rwh_calculator(flask_client):
    """Verify rooftop rainwater harvesting calculations."""
    payload = {
        "roof_area_m2": 200.0,
        "roof_type": "concrete",
        "rainfall_mm": 900.0
    }
    res = flask_client.post("/api/v1/jalrakshak/rwh-calc", json=payload)
    assert res.status_code == 200
    data = res.json
    assert data["annual_yield_m3"] > 0
    assert data["annual_savings_inr"] > 0
    assert data["payback_years"] > 0


def test_flask_water_balance_audit(flask_client):
    """Verify CGWB GEC-2015 Dynamic Water Balance Audit."""
    res = flask_client.get("/api/v1/jalrakshak/water-balance/agra")
    assert res.status_code == 200
    data = res.json
    assert "inflow_components_mcm" in data
    assert "draft_components_mcm" in data
    assert "audit_summary" in data


def test_flask_borewell_diagnostics(flask_client):
    """Verify borewell failure risk assessment."""
    res = flask_client.get("/api/v1/jalrakshak/borewell-diagnostics/agra")
    assert res.status_code == 200
    data = res.json
    assert "casing_collapse_risk_pct" in data
    assert "recommended_drilling_depth_m" in data


def test_flask_crop_diversification(flask_client):
    """Verify crop-shift transition interventions."""
    res = flask_client.get("/api/v1/jalrakshak/crop-advisory/agra")
    assert res.status_code == 200
    data = res.json
    assert data["total_potential_water_saving_mcm"] > 0
    assert len(data["crop_transition_interventions"]) >= 2


def test_flask_nrw_leakage(flask_client):
    """Verify municipal Non-Revenue Water analysis."""
    res = flask_client.get("/api/v1/jalrakshak/nrw-leakage/agra")
    assert res.status_code == 200
    data = res.json
    assert "overall_nrw_loss_pct" in data
    assert len(data["zones"]) >= 3


def test_flask_ai_assistant_chat(flask_client):
    """Verify grounded conversational AI query answering."""
    # Test Hapur specific query
    res_hapur = flask_client.post("/api/v1/ai/chat", json={"query": "Why is Hapur over-exploited?"})
    assert res_hapur.status_code == 200
    assert "Hapur" in res_hapur.json["answer"]
    assert res_hapur.json["confidence_pct"] >= 90
    assert len(res_hapur.json["sources_cited"]) >= 1

    # Test crop recommendation query
    res_crop = flask_client.post("/api/v1/ai/chat", json={"query": "Which crops should farmers plant?"})
    assert res_crop.status_code == 200
    assert "Pearl Millet" in res_crop.json["answer"] or "millet" in res_crop.json["answer"].lower()


def test_flask_citizen_reporting(flask_client):
    """Verify citizen report submission and ticket generation."""
    payload = {
        "reporter_name": "Ramesh Kumar",
        "reporter_phone": "9812345678",
        "category": "Borewell Depletion",
        "address": "Village Kithore, Meerut",
        "description": "Borewell dried up at 25m depth."
    }
    res = flask_client.post("/api/v1/citizen/report", json=payload)
    assert res.status_code == 201
    assert "ticket_no" in res.json
    assert res.json["ticket_no"].startswith("JS-")


def test_flask_reports_export(flask_client):
    """Verify JSON and CSV public reports export."""
    # JSON export
    res_json = flask_client.get("/api/v1/reports/export?format=json&state_code=UP")
    assert res_json.status_code == 200
    assert res_json.json["total_records"] >= 75

    # CSV export
    res_csv = flask_client.get("/api/v1/reports/export?format=csv&state_code=UP")
    assert res_csv.status_code == 200
    assert res_csv.mimetype == "text/csv"
    assert "District ID" in res_csv.text


def test_flask_error_handlers(flask_client):
    """Verify 404 error handler returns standard JSON response for API routes."""
    res = flask_client.get("/api/v1/non-existent-endpoint")
    assert res.status_code == 404
    assert res.json["status"] == "not_found"
    assert res.json["error_code"] == 404


def test_flask_web_index_page(flask_client):
    """Verify the main UI index page renders valid HTML with all components."""
    res = flask_client.get("/")
    assert res.status_code == 200
    html = res.text
    assert "JalSuraksha" in html
    assert "Mohd Shami" in html
    assert "Pan-India Open Data Telemetry" in html
    assert "JalAI Copilot" in html
    assert "id=\"upAtlasSvgMap\"" in html
    assert "id=\"timeSliderInput\"" in html
    assert "id=\"freshnessModal\"" in html
    assert "id=\"ownerProfileModal\"" in html


def test_flask_web_state_selection(flask_client):
    """Verify state selector renders another state gracefully."""
    res = flask_client.get("/?state=MH")
    assert res.status_code == 200
    assert "Maharashtra" in res.text


def test_flask_web_dossier_and_poster(flask_client):
    """Verify dossier component and printable poster view render."""
    res_dossier = flask_client.get("/dossier/agra")
    assert res_dossier.status_code == 200
    assert "Agra" in res_dossier.text

    res_poster = flask_client.get("/poster/agra")
    assert res_poster.status_code == 200
    assert "Agra" in res_poster.text
    assert "Mohd Shami" in res_poster.text


def test_flask_web_404_page(flask_client):
    """Verify non-API HTML 404 page renders the custom 404.html template."""
    res = flask_client.get("/missing-page-route-test")
    assert res.status_code == 404
    assert "Resource Not Found" in res.text
    assert "HTTP 404" in res.text

