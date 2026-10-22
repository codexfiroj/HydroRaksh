"""
Super Intelligence Lab Blueprint for JalSuraksha.
Serves the advanced workspace for Data Science, Machine Learning, AI experimentation,
automated EDA, explainable AI, pipeline execution, anomaly detection, and state comparison.
"""

from flask import Blueprint, render_template, request, jsonify
from services.data_service import data_service
from services.ml.lab_service import lab_service
import json

bp = Blueprint("lab", __name__, template_folder="../templates", static_folder="../static")


@bp.route("/lab", methods=["GET"])
def lab_workspace():
    """Main Super Intelligence Lab interactive studio interface."""
    states = data_service.get_states()
    eda_data = lab_service.run_automated_eda()
    experiments = lab_service.get_experiments()
    models = lab_service.get_model_registry()
    anomalies = lab_service.detect_anomalies()
    pipeline_health = lab_service.get_data_engineering_health()

    default_compare = lab_service.compare_states(["UP", "MH", "PB", "RJ", "TN"])

    return render_template(
        "lab.html",
        states=states,
        eda=eda_data,
        experiments=experiments,
        models=models,
        anomalies=anomalies,
        pipeline_health=pipeline_health,
        default_compare=default_compare,
        eda_json=json.dumps(eda_data),
        experiments_json=json.dumps(experiments),
        models_json=json.dumps(models),
        anomalies_json=json.dumps(anomalies),
        compare_json=json.dumps(default_compare)
    )


# =============================================================================
# REST APIs for Super Intelligence Lab
# =============================================================================

@bp.route("/api/v1/lab/overview", methods=["GET"])
def get_lab_overview():
    """High-level summary of lab pipelines, models, and anomaly detectors."""
    return jsonify({
        "status": "success",
        "service": "JalSuraksha Super Intelligence Lab",
        "capabilities": [
            "Automated Exploratory Data Analysis & ANOVA Hypothesis Testing",
            "End-to-End 6-Stage ML Pipeline Runner (Ingest -> Validate -> Preprocess -> Feature Eng -> Train -> Evaluate)",
            "Model Registry & Hyperparameter Experiment Tracking",
            "Explainable AI (XAI) & SHAP Waterfall Feature Drivers",
            "Real-Time Telemetry Anomaly Sentinel (Isolation Forest v2)",
            "State-Wise Comparative Intelligence Matrix",
            "Authoritative Open Data ETL Health Monitor"
        ],
        "active_production_model": lab_service._active_production_model_id,
        "total_experiments_tracked": len(lab_service.get_experiments()),
        "registered_models_count": len(lab_service.get_model_registry())
    })


@bp.route("/api/v1/lab/eda", methods=["GET"])
def get_automated_eda():
    """Returns comprehensive automated EDA metrics and correlation matrices."""
    result = lab_service.run_automated_eda()
    return jsonify(result)


@bp.route("/api/v1/lab/pipelines/run", methods=["POST"])
def run_ml_pipeline():
    """Triggers an end-to-end ML pipeline run."""
    payload = request.get_json(silent=True) or {}
    target = payload.get("target_variable", "groundwater_depth_m")
    algorithm = payload.get("algorithm", "RandomForest")

    result = lab_service.execute_ml_pipeline(target_variable=target, algorithm=algorithm)
    return jsonify(result)


@bp.route("/api/v1/lab/experiments", methods=["GET"])
def get_experiments():
    """Returns all tracked experiment runs."""
    return jsonify({
        "status": "success",
        "total_experiments": len(lab_service.get_experiments()),
        "experiments": lab_service.get_experiments()
    })


@bp.route("/api/v1/lab/models", methods=["GET"])
def get_models():
    """Returns all registered models in the registry."""
    return jsonify({
        "status": "success",
        "total_models": len(lab_service.get_model_registry()),
        "models": lab_service.get_model_registry()
    })


@bp.route("/api/v1/lab/models/promote", methods=["POST"])
def promote_model():
    """Promotes a model version to Production status."""
    payload = request.get_json(silent=True) or {}
    model_id = payload.get("model_id")
    if not model_id:
        return jsonify({"status": "error", "message": "model_id required"}), 400

    result = lab_service.promote_model(model_id)
    return jsonify(result)


@bp.route("/api/v1/lab/xai/<district_id>", methods=["GET"])
def get_xai_explanation(district_id: str):
    """Returns SHAP-style explainable AI breakdown for a district."""
    result = lab_service.get_district_xai_explanation(district_id)
    return jsonify(result)


@bp.route("/api/v1/lab/anomalies", methods=["GET"])
def get_anomalies():
    """Runs Isolation Forest anomaly detection across all telemetry stations."""
    result = lab_service.detect_anomalies()
    return jsonify(result)


@bp.route("/api/v1/lab/compare-states", methods=["GET", "POST"])
def compare_states():
    """Compares multiple states across hydrogeological metrics."""
    if request.method == "POST" and request.is_json:
        payload = request.json or {}
        codes = payload.get("state_codes", ["UP", "MH", "PB"])
    else:
        codes_str = request.args.get("states", "UP,MH,PB,RJ,TN")
        codes = [c.strip() for c in codes_str.split(",") if c.strip()]

    result = lab_service.compare_states(codes)
    return jsonify(result)


@bp.route("/api/v1/lab/data-quality", methods=["GET"])
def get_data_quality():
    """Returns data engineering health and freshness monitors for all 8 open data sources."""
    result = lab_service.get_data_engineering_health()
    return jsonify(result)
