"""
JSON-Backed Local User Store for JalSuraksha Prototype / Offline Environments.
Provides thread-safe, atomic file write operations, password hashing (PBKDF2-SHA256),
duplicate-email prevention, session rate-limiting, and sanitized user serialization.
"""

import os
import json
import uuid
import hashlib
import hmac
import tempfile
import threading
import time
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

# Default path for prototype private storage
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../data/private"))
USERS_JSON_PATH = os.path.join(DATA_DIR, "users.json")

_lock = threading.Lock()
_login_attempts: Dict[str, List[float]] = {}  # ip/email -> list of timestamp attempts
MAX_ATTEMPTS_PER_MINUTE = 5


def _ensure_storage_dir():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(USERS_JSON_PATH):
        with open(USERS_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump({"version": "1.0", "updated_at": datetime.now(timezone.utc).isoformat(), "users": []}, f, indent=2)


def hash_password_secure(password: str, salt: Optional[str] = None) -> str:
    """Generate salted PBKDF2-HMAC-SHA256 hash."""
    if salt is None:
        salt = os.urandom(16).hex()
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"pbkdf2_sha256$100000${salt}${key.hex()}"


def verify_password_secure(password: str, stored_hash: str) -> bool:
    """Verify password against stored PBKDF2 hash using constant-time comparison."""
    try:
        parts = stored_hash.split("$")
        if len(parts) != 4 or parts[0] != "pbkdf2_sha256":
            # Fallback to bcrypt/passlib if legacy hash
            from app.core.security import verify_password
            return verify_password(password, stored_hash)
        iterations = int(parts[1])
        salt = parts[2]
        expected_hex = parts[3]
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), iterations)
        return hmac.compare_digest(key.hex(), expected_hex)
    except Exception:
        return False


class JsonUserStore:
    """Thread-safe, atomic JSON-backed user repository."""

    @classmethod
    def _read_data(cls) -> Dict[str, Any]:
        _ensure_storage_dir()
        try:
            with open(USERS_JSON_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, FileNotFoundError):
            return {"version": "1.0", "updated_at": datetime.now(timezone.utc).isoformat(), "users": []}

    @classmethod
    def _write_data_atomic(cls, data: Dict[str, Any]) -> None:
        _ensure_storage_dir()
        data["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        # Write to temporary file in same directory then atomically replace
        temp_file = tempfile.NamedTemporaryFile("w", dir=DATA_DIR, delete=False, encoding="utf-8")
        try:
            json.dump(data, temp_file, indent=2)
            temp_file.flush()
            os.fsync(temp_file.fileno())
            temp_file.close()
            os.replace(temp_file.name, USERS_JSON_PATH)
        except Exception:
            if os.path.exists(temp_file.name):
                os.remove(temp_file.name)
            raise

    @classmethod
    def check_rate_limit(cls, identifier: str) -> bool:
        """Check if an IP or email has exceeded max login attempts per minute."""
        now = time.time()
        with _lock:
            attempts = _login_attempts.get(identifier, [])
            # Filter attempts within last 60 seconds
            attempts = [t for t in attempts if now - t < 60.0]
            _login_attempts[identifier] = attempts
            if len(attempts) >= MAX_ATTEMPTS_PER_MINUTE:
                return False
            attempts.append(now)
            _login_attempts[identifier] = attempts
            return True

    @classmethod
    def find_by_email(cls, email: str) -> Optional[Dict[str, Any]]:
        norm_email = email.lower().strip()
        data = cls._read_data()
        for u in data.get("users", []):
            if u["email"].lower() == norm_email:
                return u
        return None

    @classmethod
    def find_by_id(cls, user_id: str) -> Optional[Dict[str, Any]]:
        data = cls._read_data()
        for u in data.get("users", []):
            if u["id"] == user_id:
                return u
        return None

    @classmethod
    def create_user(
        cls,
        email: str,
        password: str,
        full_name: str,
        role: str = "Citizen",
        department: Optional[str] = None,
        jurisdiction_state: Optional[str] = None,
        jurisdiction_district: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create new user with unique email constraint and salted password hash."""
        with _lock:
            data = cls._read_data()
            norm_email = email.lower().strip()
            
            # Check duplicate
            if any(u["email"].lower() == norm_email for u in data.get("users", [])):
                raise ValueError("User with this email already exists.")

            user_id = f"usr_{uuid.uuid4().hex[:12]}"
            hashed_pw = hash_password_secure(password)

            new_user = {
                "id": user_id,
                "email": norm_email,
                "full_name": full_name.strip(),
                "role": role if role in ["Super Admin", "State Admin", "District Officer", "Field Officer", "Analyst", "Citizen"] else "Citizen",
                "department": department or "Public Citizenry",
                "jurisdiction_state": jurisdiction_state or "All India",
                "jurisdiction_district": jurisdiction_district,
                "hashed_password": hashed_pw,
                "is_active": True,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "last_login": None
            }

            data.setdefault("users", []).append(new_user)
            cls._write_data_atomic(data)

            # Return sanitized user representation (no hash)
            return cls.sanitize_user(new_user)

    @classmethod
    def authenticate(cls, email: str, password: str, client_ip: str = "127.0.0.1") -> Optional[Dict[str, Any]]:
        """Authenticate user against password hash with rate limiting."""
        rate_key = f"{client_ip}:{email.lower().strip()}"
        if not cls.check_rate_limit(rate_key):
            raise PermissionError("Too many login attempts. Please wait 60 seconds before trying again.")

        with _lock:
            user = cls.find_by_email(email)
            if not user:
                return None
            if not user.get("is_active", True):
                raise PermissionError("Account is currently disabled.")

            if verify_password_secure(password, user["hashed_password"]):
                # Update last login
                data = cls._read_data()
                for u in data.get("users", []):
                    if u["id"] == user["id"]:
                        u["last_login"] = datetime.now(timezone.utc).isoformat()
                        break
                cls._write_data_atomic(data)
                return cls.sanitize_user(user)
            return None

    @classmethod
    def sanitize_user(cls, user: Dict[str, Any]) -> Dict[str, Any]:
        """Strip password hashes and internal security attributes."""
        sanitized = dict(user)
        sanitized.pop("hashed_password", None)
        return sanitized

    @classmethod
    def list_users(cls) -> List[Dict[str, Any]]:
        data = cls._read_data()
        return [cls.sanitize_user(u) for u in data.get("users", [])]
