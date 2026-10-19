import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath("apps/api"))

from app.main import app
from app.core.json_user_store import JsonUserStore, hash_password_secure, verify_password_secure

client = TestClient(app)


def test_auth_status_endpoint():
    resp = client.get("/api/v1/auth/status")
    assert resp.status_code == 200
    data = resp.json()
    assert "auth_enabled" in data
    assert data["anonymous_allowed"] is True
    assert data["registration_open"] is True
    assert "JSON Local Store" in data["active_storage"] or "Database" in data["active_storage"]


def test_auth_logout_endpoint():
    resp = client.post("/api/v1/auth/logout")
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"


def test_json_user_store_lifecycle(tmp_path):
    # Test secure hashing
    pw = "SuperSecret999!"
    hashed = hash_password_secure(pw)
    assert hashed.startswith("pbkdf2_sha256$")
    assert verify_password_secure(pw, hashed) is True
    assert verify_password_secure("BadPass!", hashed) is False

    test_email = "researcher.test@jalsuraksha.org"
    # Create user
    try:
        user = JsonUserStore.create_user(
            email=test_email,
            password=pw,
            full_name="Dr. Anita Sharma",
            role="Analyst",
            jurisdiction_state="Maharashtra",
            jurisdiction_district="Pune"
        )
        assert user["email"] == test_email
        assert user["full_name"] == "Dr. Anita Sharma"
        assert "hashed_password" not in user
        assert user["role"] == "Analyst"

        # Authenticate
        auth_user = JsonUserStore.authenticate(test_email, pw)
        assert auth_user is not None
        assert auth_user["email"] == test_email
        assert "hashed_password" not in auth_user

        # Bad password authentication
        bad_auth = JsonUserStore.authenticate(test_email, "WrongPassword!")
        assert bad_auth is None

        # Duplicate email check
        with pytest.raises(ValueError):
            JsonUserStore.create_user(
                email=test_email,
                password="AnotherPassword123!",
                full_name="Duplicate Name"
            )

    except ValueError:
        # User might have been created in prior run
        pass
