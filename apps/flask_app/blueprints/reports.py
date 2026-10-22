"""
Public Reports & Data Export Blueprint for Flask.
Generates CSV and JSON structured exports of district water indicators.
"""

from flask import Blueprint, jsonify, request, Response
import csv
import io
from datetime import datetime, timezone
from services.data_service import data_service

bp = Blueprint("reports", __name__, url_prefix="/api/v1/reports")


@bp.route("/export", methods=["GET"])
def export_water_report():
    """Exports district or state water metrics as CSV or JSON."""
    report_type = request.args.get("report_type", "District Water Report")
    fmt = request.args.get("format", "json").lower()
    state_code = request.args.get("state_code", "UP").upper()

    districts = data_service.get_districts_for_state(state_code)
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

    if fmt == "json":
        return jsonify({
            "title": f"JalSuraksha — {report_type}",
            "generated_at": now_str,
            "authority": "National Water Informatics & Ministry of Jal Shakti",
            "state_code": state_code,
            "total_records": len(districts),
            "records": [
                {
                    "id": d.get("id"),
                    "name": d.get("name"),
                    "division": d.get("division"),
                    "basin": d.get("modernWaterMetrics", {}).get("majorRiverBasin"),
                    "depth_m_bgl": d.get("modernWaterMetrics", {}).get("groundwaterDepthM"),
                    "trend_annual_cm": d.get("modernWaterMetrics", {}).get("groundwaterTrendAnnualCm"),
                    "category": d.get("modernWaterMetrics", {}).get("cgwbCategory"),
                    "stage_pct": d.get("modernWaterMetrics", {}).get("cgwbStageExtractionPct"),
                    "stress_score": d.get("modernWaterMetrics", {}).get("waterStressScore"),
                    "rainfall_departure_pct": d.get("modernWaterMetrics", {}).get("rainfallDeparturePct")
                }
                for d in districts
            ]
        })

    # CSV output
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["# JalSuraksha Official Water Intelligence Export"])
    writer.writerow(["# Report Type", report_type])
    writer.writerow(["# State Code", state_code])
    writer.writerow(["# Generated At", now_str])
    writer.writerow([])
    writer.writerow([
        "District ID", "District Name", "Division", "River Basin",
        "Depth (m bgl)", "Annual Trend (cm/yr)", "CGWB Category",
        "Extraction Stage (%)", "Water Stress Score", "Rainfall Departure (%)"
    ])

    for d in districts:
        m = d.get("modernWaterMetrics", {})
        writer.writerow([
            d.get("id"),
            d.get("name"),
            d.get("division", ""),
            m.get("majorRiverBasin", ""),
            m.get("groundwaterDepthM", ""),
            m.get("groundwaterTrendAnnualCm", ""),
            m.get("cgwbCategory", ""),
            m.get("cgwbStageExtractionPct", ""),
            m.get("waterStressScore", ""),
            m.get("rainfallDeparturePct", "")
        ])

    csv_data = output.getvalue()
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename=jalsuraksha_{state_code.lower()}_report.csv"}
    )
