from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

try:
    import email_validator  # type: ignore
    from pydantic import EmailStr
except ImportError:
    EmailStr = str  # type: ignore


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "Citizen"
    department: Optional[str] = None
    jurisdiction_state: Optional[str] = "All"
    jurisdiction_district: Optional[str] = "All"
    phone: Optional[str] = None


class RegisterRequest(UserBase):
    password: str = Field(..., min_length=6)


class UserResponse(UserBase):
    id: str
    is_active: bool = True
    is_verified: bool = False
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class AuthStatusResponse(BaseModel):
    auth_enabled: bool
    auth_storage_mode: str
    anonymous_allowed: bool = True
    registration_open: bool = True
    active_storage: str

