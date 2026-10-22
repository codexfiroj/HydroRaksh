"""
JalSuraksha Production Flask Application Factory.
Provides a unified, Python-first, modular architecture for:
- Web presentation layer (Jinja2, interactive vector maps, India.gov.in tokens)
- RESTful versioned APIs (/api/v1/...)
- Prescriptive AI decision-support algorithms
- ML pipelines & inference models
- Error handling and logging
"""

import os
import sys
import logging
from flask import Flask, jsonify, render_template

# Ensure workspace root and apps/api are in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
api_dir = os.path.join(BASE_DIR, "apps", "api")
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)
if api_dir not in sys.path:
    sys.path.insert(0, api_dir)

from apps.flask_app.config import config_by_name

# Configure root logger
logging.basicConfig(
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s in %(name)s: %(message)s"
)
logger = logging.getLogger("jalsuraksha.flask")


def create_app(config_name: str = None) -> Flask:
    """Application factory for JalSuraksha Flask server."""
    if not config_name:
        config_name = os.environ.get("FLASK_ENV", "development").lower()

    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static"
    )

    # Load configuration
    cfg = config_by_name.get(config_name, config_by_name["default"])
    app.config.from_object(cfg)

    logger.info(f"Initializing JalSuraksha Flask application in '{config_name}' environment.")

    # Register Blueprints
    from apps.flask_app.blueprints.web import bp as web_bp
    from apps.flask_app.blueprints.pan_india import bp as pan_india_bp
    from apps.flask_app.blueprints.dashboard import bp as dashboard_bp
    from apps.flask_app.blueprints.jalrakshak import bp as jalrakshak_bp
    from apps.flask_app.blueprints.ai_assistant import bp as ai_bp
    from apps.flask_app.blueprints.citizen import bp as citizen_bp
    from apps.flask_app.blueprints.reports import bp as reports_bp
    from apps.flask_app.blueprints.auth import bp as auth_bp
    from apps.flask_app.blueprints.lab import bp as lab_bp

    app.register_blueprint(web_bp)
    app.register_blueprint(pan_india_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(jalrakshak_bp)
    app.register_blueprint(ai_bp)
    app.register_blueprint(citizen_bp)
    app.register_blueprint(reports_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(lab_bp)

    # Robust Error Handlers
    @app.errorhandler(400)
    def bad_request(error):
        if "/api/" in (error.description if hasattr(error, "description") else "") or True:
            return jsonify({
                "status": "error",
                "error_code": 400,
                "message": "Bad request",
                "details": str(error)
            }), 400
        return render_template("errors/400.html", error=error), 400

    @app.errorhandler(404)
    def not_found(error):
        from flask import request
        if request.path.startswith("/api/"):
            return jsonify({
                "status": "not_found",
                "error_code": 404,
                "message": f"Resource not found: {request.path}"
            }), 404
        return render_template("errors/404.html", path=request.path), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        from flask import request
        logger.error(f"Internal server error on {request.path}: {error}")
        if request.path.startswith("/api/"):
            return jsonify({
                "status": "internal_error",
                "error_code": 500,
                "message": "An internal error occurred in JalSuraksha processing."
            }), 500
        return render_template("errors/500.html", error=error), 500

    # Global CORS and security headers
    @app.after_request
    def set_security_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        return response

    logger.info("JalSuraksha Flask application ready.")
    return app
