"""
Authentication & Role-Based Access Control Blueprint for Flask.
Supports JSON user store and database authentication fallback.
"""

from flask import Blueprint, jsonify, request
from app.core.json_user_store import JsonUserStore
from app.core.security import create_access_token, verify_password
from app.core.config import settings

bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@bp.route("/status", methods=["GET"])
def get_auth_status():
    """Returns authentication configuration and active storage mode."""
    return jsonify({
        "auth_enabled": settings.AUTH_ENABLED,
        "auth_storage_mode": settings.AUTH_STORAGE_MODE,
        "anonymous_allowed": True,
        "registration_open": True,
        "active_storage": (
            "JSON Local Store (data/private/users.json)"
            if settings.AUTH_STORAGE_MODE == "json"
            else "Relational Database (SQLAlchemy)"
        )
    })


@bp.route("/login", methods=["POST"])
def login():
    """Authenticates credentials against JSON user store or database."""
    payload = request.get_json(silent=True) or {}
    email = payload.get("email", "").lower().strip()
    password = payload.get("password", "")
    client_ip = request.remote_addr or "127.0.0.1"

    if not email or not password:
        return jsonify({"status": "error", "message": "email and password required"}), 400

    user_dict = None
    try:
        user_dict = JsonUserStore.authenticate(email, password, client_ip=client_ip)
    except PermissionError as pe:
        return jsonify({"status": "error", "message": str(pe)}), 429
    except Exception:
        pass

    if user_dict:
        token = create_access_token(
            subject=user_dict["id"],
            role=user_dict.get("role", "Citizen"),
            jurisdiction=user_dict.get("jurisdiction_district") or user_dict.get("jurisdiction_state")
        )
        return jsonify({
            "access_token": token,
            "token_type": "bearer",
            "user": user_dict
        })

    return jsonify({"status": "error", "message": "Invalid email or password"}), 401
