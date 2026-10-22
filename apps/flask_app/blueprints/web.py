"""
Web UI Blueprint for Flask.
Serves the responsive, high-contrast, India.gov.in-tokenized JalSuraksha Atlas interface:
- Interactive Vector Choropleth SVG Map (75 UP Districts & Pan-India)
- Continuous Timeline Dock (2000 - 2035) with Historical Playback
- Dynamic District Water Context Dossier Panel
- All 9 Prescriptive Modals and Decision Suites
"""

from flask import Blueprint, render_template, request, jsonify, abort
from services.data_service import data_service
import json

bp = Blueprint("web", __name__, template_folder="../templates", static_folder="../static")


@bp.route("/", methods=["GET"])
def index():
    """Main Application Entry Point."""
    # Query parameters
    state_code = request.args.get("state", "UP").upper().replace("IN-", "")
    district_id = request.args.get("region", "agra").lower()
    year = int(request.args.get("year", 2026))
    view_mode = request.args.get("mode", "water")

    states = data_service.get_states()
    current_state = data_service.get_state(state_code) or states[0]
    districts = data_service.get_districts_for_state(state_code)
    
    selected_district = data_service.get_district(district_id)
    if districts:
        if not selected_district or selected_district.get("stateCode", "").upper().replace("IN-", "") != state_code:
            selected_district = districts[0]
    elif not selected_district:
        selected_district = data_service.get_district("agra")

    data_sources = data_service.get_data_sources()
    rivers = data_service.get_rivers_for_state(state_code)
    hotspots = data_service.get_hotspots_for_state(state_code, districts)
    iot_sensors = data_service.get_iot_sensors_for_state(state_code, districts)

    # Pass serialized datasets so client-side vanilla JS can operate instantly
    # with zero latency, zero TypeScript runtime, and complete offline responsiveness
    return render_template(
        "index.html",
        states=states,
        current_state=current_state,
        current_year=year,
        view_mode=view_mode,
        selected_district=selected_district,
        districts=districts,
        rivers=rivers,
        hotspots=hotspots,
        iot_sensors=iot_sensors,
        data_sources=data_sources,
        districts_json=json.dumps(districts),
        states_json=json.dumps(states),
        sources_json=json.dumps(data_sources)
    )


@bp.route("/dossier/<district_id>", methods=["GET"])
def district_dossier(district_id: str):
    """HTML snippet / view for district dossier."""
    district = data_service.get_district(district_id)
    if not district:
        abort(404)
    year = int(request.args.get("year", 2026))
    state_code = district.get("stateCode", "UP").replace("IN-", "")
    current_state = data_service.get_state(state_code) or {"name": "Uttar Pradesh", "code": "UP"}
    return render_template(
        "components/context_panel.html",
        district=district,
        selected_district=district,
        current_state=current_state,
        current_year=year
    )


@bp.route("/poster/<district_id>", methods=["GET"])
def share_poster_view(district_id: str):
    """Clean printable poster view for a district."""
    district = data_service.get_district(district_id)
    if not district:
        abort(404)
    year = int(request.args.get("year", 2026))
    state_code = district.get("stateCode", "UP").replace("IN-", "")
    current_state = data_service.get_state(state_code) or {"name": "Uttar Pradesh", "code": "UP"}
    return render_template(
        "components/modal_poster.html",
        district=district,
        selected_district=district,
        current_state=current_state,
        current_year=year
    )
