"""
Unit & Integration Tests for Pan-India Versioned API Endpoints.
Verifies all 36 States/UTs, 8 live open data sources, groundwater levels,
quality standards, rainfall, drought risk, HG-CF recommendations, and LDA document search.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.geography_registry import AdministrativeGeographyRegistry

client = TestClient(app)


def test_health_endpoint():
    """Verify healthcheck endpoint includes Pan-India and ML status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "pan_india_support" in data
    assert data["pan_india_support"]["states_and_uts"] == 36


def test_geography_states():
    """Verify all 28 States and 8 Union Territories (36 total) are returned."""
    response = client.get("/api/v1/geography/states")
    assert response.status_code == 200
    data = response.json()
    assert data["total_count"] == 36
    assert data["states_count"] == 28
    assert data["union_territories_count"] == 8
    
    # Check key states exist in data
    codes = {s["code"] for s in data["data"]}
    assert "IN-UP" in codes or "UP" in codes
    assert "IN-MH" in codes or "MH" in codes
    assert "IN-DL" in codes or "DL" in codes
    assert "IN-KA" in codes or "KA" in codes
    assert "IN-RJ" in codes or "RJ" in codes


def test_geography_districts():
    """Verify district hierarchy and administrative terminology."""
    # Test Uttar Pradesh (Tehsil)
    res_up = client.get("/api/v1/geography/districts?state_code=IN-UP")
    assert res_up.status_code == 200
    data_up = res_up.json()
    assert data_up["total_count"] >= 75
    assert data_up["data"][0]["subdistrict_term"] == "Tehsil"
    
    # Test Maharashtra (Taluka)
    res_mh = client.get("/api/v1/geography/districts?state_code=IN-MH")
    assert res_mh.status_code == 200
    data_mh = res_mh.json()
    assert data_mh["total_count"] >= 3
    assert data_mh["data"][0]["subdistrict_term"] == "Taluka"


def test_geography_alias_normalization():
    """Verify historical district reorganizations and aliases are resolved."""
    registry = AdministrativeGeographyRegistry()
    assert registry.normalize_name("Allahabad") == "Prayagraj"
    assert registry.normalize_name("Faizabad") == "Ayodhya"
    assert registry.normalize_name("Aurangabad") == "Chhatrapati Sambhajinagar"
    assert registry.normalize_name("Bangalore") == "Bengaluru Urban"
    assert registry.normalize_name("Benares") == "Varanasi"


def test_groundwater_levels():
    """Verify pre/post-monsoon groundwater observations and trajectories."""
    response = client.get("/api/v1/groundwater/levels?district_id=agra")
    assert response.status_code == 200
    data = response.json()
    assert data["district_id"] == "agra"
    assert "current_water_depth_m" in data
    assert "cgwb_assessment_category" in data
    assert "historical_levels" in data


def test_groundwater_quality():
    """Verify hydrochemical quality parameters against BIS 10500 standards."""
    response = client.get("/api/v1/groundwater/quality?district_id=agra")
    assert response.status_code == 200
    data = response.json()
    assert data["district_id"] == "agra"
    assert "parameters" in data
    assert "potability_status" in data
    
    # Check standard parameters
    param_names = [p["parameter_name"] for p in data["parameters"]]
    assert "Total Dissolved Solids (TDS)" in param_names
    assert "Fluoride (F)" in param_names
    assert "Nitrate (NO3)" in param_names


def test_rainfall_observations():
    """Verify IMD & Open-Meteo rainfall departures and drought status."""
    response = client.get("/api/v1/rainfall?district_id=agra")
    assert response.status_code == 200
    data = response.json()
    assert data["district_id"] == "agra"
    assert "annual_normal_rainfall_mm" in data
    assert "observed_actual_rainfall_mm" in data
    assert "rainfall_departure_pct" in data
    assert "imd_monsoon_category" in data


def test_drought_risk():
    """Verify multi-factor drought risk score and explainability."""
    response = client.get("/api/v1/drought/risk?district_id=agra")
    assert response.status_code == 200
    data = response.json()
    assert data["district_id"] == "agra"
    assert "composite_risk_score" in data
    assert 0 <= data["composite_risk_score"] <= 100
    assert "risk_category" in data
    assert "key_drivers" in data


def test_analytics_summary():
    """Verify national and district analytics aggregation."""
    # National overview
    res_nat = client.get("/api/v1/analytics/summary")
    assert res_nat.status_code == 200
    data_nat = res_nat.json()
    assert data_nat["scope"] == "National (Pan-India)"
    assert data_nat["total_administrative_units_assessed"] > 0
    assert "cgwb_categorization_breakdown" in data_nat

    # District overview
    res_dist = client.get("/api/v1/analytics/summary?geography_id=agra")
    assert res_dist.status_code == 200
    data_dist = res_dist.json()
    assert "District" in data_dist["scope"]
    assert data_dist["district_name"] == "Agra"


def test_recommendations_endpoint():
    """Verify HG-CF and geomorphological conservation recommendations."""
    response = client.get("/api/v1/recommendations?geography_id=agra")
    assert response.status_code == 200
    data = response.json()
    assert data["district_id"] == "agra"
    assert "recommendations" in data
    assert len(data["recommendations"]) > 0
    assert "disclaimer" in data
    
    # Check recommendation structure
    first_rec = data["recommendations"][0]
    assert "name" in first_rec
    assert "evidence_tier" in first_rec
    assert "suitability_score" in first_rec


def test_sources_and_coverage():
    """Verify data sources registry and freshness metadata."""
    res_sources = client.get("/api/v1/sources")
    assert res_sources.status_code == 200
    sources_data = res_sources.json()
    assert sources_data["total_sources"] >= 8
    source_codes = [s["code"].upper() for s in sources_data["sources"]]
    assert "CGWB" in source_codes
    assert "IMD" in source_codes
    assert "CWC" in source_codes
    assert "OPEN_METEO" in source_codes

    res_cov = client.get("/api/v1/coverage")
    assert res_cov.status_code == 200
    cov_data = res_cov.json()
    assert cov_data["pan_india_states_supported"] == 36
    assert cov_data["total_districts_modeled"] >= 75


def test_ingestion_status():
    """Verify ingestion telemetry pipeline status."""
    response = client.get("/api/v1/ingestion/status")
    assert response.status_code == 200
    data = response.json()
    assert "pipeline_health" in data
    assert "recent_runs" in data


def test_document_intelligence_topics():
    """Verify LDA topic modeling on hydrological documents."""
    response = client.get("/api/v1/documents/topics")
    assert response.status_code == 200
    data = response.json()
    assert "total_topics" in data
    assert data["total_topics"] > 0
    assert "topics" in data


def test_document_search_and_district_profile():
    """Verify semantic document search and qualitative distress profile."""
    # Search
    res_search = client.get("/api/v1/documents/search?query=fluoride contamination")
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert "query" in search_data
    assert "results" in search_data

    # District profile
    res_prof = client.get("/api/v1/documents/profile/Agra")
    assert res_prof.status_code == 200
    prof_data = res_prof.json()
    assert prof_data["district"] == "Agra"
    assert "thematic_breakdown" in prof_data
