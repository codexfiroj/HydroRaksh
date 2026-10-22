"""
JalSuraksha Primary Server Entry Point.
Launches the Flask production-ready web and API server.
"""

import os
import sys

# Ensure root directory is on sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from apps.flask_app import create_app

env = os.environ.get("FLASK_ENV", "development")
app = create_app(env)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"================================================================")
    print(f"   JalSuraksha (HydroRaksh) — AI Water Intelligence Platform    ")
    print(f"   Python-First Architecture (Flask + ML Pipelines)             ")
    print(f"   Running on http://{host}:{port}                              ")
    print(f"================================================================")
    app.run(host=host, port=port, debug=(env == "development"))
