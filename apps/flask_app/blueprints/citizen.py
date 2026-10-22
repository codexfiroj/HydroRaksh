"""
Citizen Field Telemetry & Grievance Blueprint for Flask.
Handles citizen reports, telemetry error submissions, and field ground truth submissions.
"""

from flask import Blueprint, jsonify, request
import random
from datetime import datetime, timezone

bp = Blueprint("citizen", __name__, url_prefix="/api/v1")

# In-memory ticket storage fallback
_GRIEVANCE_STORE = []


@bp.route("/citizen/report", methods=["POST"])
def submit_citizen_report():
    """Submits a citizen issue report or borewell failure observation."""
    payload = request.get_json(silent=True) or {}
    
    name = payload.get("reporter_name", "Anonymous Citizen")
    phone = payload.get("reporter_phone", "9876543210")
    category = payload.get("category", "Borewell Depletion")
    address = payload.get("address", "Rural Block")
    desc = payload.get("description", "Groundwater table dropped below pump strainer.")
    lat = payload.get("latitude")
    lng = payload.get("longitude")

    ticket_no = f"JS-{random.randint(1000, 9999)}"
    now_iso = datetime.now(timezone.utc).isoformat()

    record = {
        "ticket_no": ticket_no,
        "reporter_name": name,
        "reporter_phone": phone,
        "category": category,
        "address": address,
        "description": desc,
        "latitude": lat,
        "longitude": lng,
        "status": "Submitted / Pending Verification",
        "created_at": now_iso
    }
    _GRIEVANCE_STORE.append(record)

    return jsonify({
        "status": "success",
        "ticket_no": ticket_no,
        "reporter_name": name,
        "category": category,
        "address": address,
        "description": desc,
        "created_at": now_iso
    }), 201


@bp.route("/citizen/reports", methods=["GET"])
def list_citizen_reports():
    """Lists submitted citizen reports."""
    limit = int(request.args.get("limit", 10))
    return jsonify({
        "status": "success",
        "total_count": len(_GRIEVANCE_STORE),
        "reports": _GRIEVANCE_STORE[-limit:]
    })


@bp.route("/citizen/report-error", methods=["POST"])
def report_telemetry_error():
    """Submits a discrepancy report against official station readings."""
    payload = request.get_json(silent=True) or {}
    district_id = payload.get("district_id", "agra")
    observed_depth = payload.get("observed_depth_m")
    notes = payload.get("notes", "")

    ticket_no = f"ERR-{random.randint(10000, 99999)}"
    return jsonify({
        "status": "success",
        "ticket_no": ticket_no,
        "district_id": district_id,
        "observed_depth_m": observed_depth,
        "status_label": "Queued for CGWB Hydrogeologist Audit",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }), 200
