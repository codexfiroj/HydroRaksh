"""
JalSuraksha Flask Production Configuration.
Provides environment-specific settings for Development, Testing, and Production.
"""

import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))


class Config:
    PROJECT_NAME = "JalSuraksha (HydroRaksh)"
    VERSION = "2.0.0"
    SECRET_KEY = os.environ.get("SECRET_KEY", "jalsuraksha-super-secret-key-production-grade-2026")
    
    # Session & Security
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "Lax"
    JSON_SORT_KEYS = False

    # Database
    DATABASE_PATH = os.path.join(BASE_DIR, "jalsuraksha_local.db")
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", f"sqlite:///{DATABASE_PATH}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # CORS
    CORS_ORIGINS = ["*"]

    # Pan-India Data Directory
    DATA_DIR = os.path.join(BASE_DIR, "data")
    
    # Feature Simulator Flag
    FEATURE_SIMULATOR_MODE = os.environ.get("FEATURE_SIMULATOR_MODE", "true").lower() == "true"


class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False


class TestingConfig(Config):
    DEBUG = False
    TESTING = True
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = False  # Set to True if deployed behind HTTPS reverse proxy


config_by_name = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig
}
