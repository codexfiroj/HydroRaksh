from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import verify_password, hash_password, create_access_token
from app.core.rbac import get_current_user, log_audit
from app.core.json_user_store import JsonUserStore
from app.models.users import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
    AuthStatusResponse,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/status", response_model=AuthStatusResponse)
def get_auth_status():
    """Check system authentication settings and anonymous access availability."""
    return AuthStatusResponse(
        auth_enabled=settings.AUTH_ENABLED,
        auth_storage_mode=settings.AUTH_STORAGE_MODE,
        anonymous_allowed=True,
        registration_open=True,
        active_storage=(
            "JSON Local Store (data/private/users.json)"
            if settings.AUTH_STORAGE_MODE == "json"
            else "Relational Database (SQLAlchemy)"
        ),
    )


@router.post("/login", response_model=TokenResponse)
def login(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "127.0.0.1"

    # 1. Check JSON user store if enabled
    if settings.AUTH_STORAGE_MODE == "json":
        try:
            user_dict = JsonUserStore.authenticate(payload.email, payload.password, client_ip=client_ip)
            if user_dict:
                token = create_access_token(
                    subject=user_dict["id"],
                    role=user_dict.get("role", "Citizen"),
                    jurisdiction=user_dict.get("jurisdiction_district") or user_dict.get("jurisdiction_state"),
                )
                return TokenResponse(
                    access_token=token,
                    token_type="bearer",
                    user=UserResponse(**user_dict),
                )
        except PermissionError as pe:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(pe))

    # 2. Database storage or fallback to seeded DB users
    user = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive",
        )

    token = create_access_token(
        subject=user.id,
        role=user.role,
        jurisdiction=user.jurisdiction_district or user.jurisdiction_state,
    )

    log_audit(db, user, "LOGIN", "AUTH", f"User logged in from {client_ip}", client_ip)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post("/register", response_model=UserResponse)
def register(request: Request, payload: RegisterRequest, db: Session = Depends(get_db)):
    client_ip = request.client.host if request.client else "127.0.0.1"

    # 1. JSON storage mode
    if settings.AUTH_STORAGE_MODE == "json":
        try:
            created_user = JsonUserStore.create_user(
                email=payload.email,
                password=payload.password,
                full_name=payload.full_name,
                role=payload.role if payload.role in ["Citizen", "Analyst"] else "Citizen",
                department=payload.department,
                jurisdiction_state=payload.jurisdiction_state,
                jurisdiction_district=payload.jurisdiction_district,
            )
            return UserResponse(**created_user)
        except ValueError as ve:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))

    # 2. Database storage mode
    existing = db.query(User).filter(User.email == payload.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists",
        )

    user = User(
        email=payload.email.lower().strip(),
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        role=payload.role if payload.role in ["Citizen", "Analyst"] else "Citizen",
        department=payload.department,
        jurisdiction_state=payload.jurisdiction_state,
        jurisdiction_district=payload.jurisdiction_district,
        phone=payload.phone,
        is_active=True,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_audit(db, user, "REGISTER", "AUTH", f"New user registered: {user.email}", client_ip)

    return UserResponse.model_validate(user)


@router.post("/logout")
def logout():
    """Invalidate client session token."""
    return {"status": "success", "message": "Session terminated successfully"}



@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.get("/roles")
def get_roles():
    return [
        {"role": "Super Admin", "description": "National full read/write, user & connector management"},
        {"role": "State Admin", "description": "State-level water management & district coordination"},
        {"role": "District Officer", "description": "District-level monitoring, alerts, and issue assignment"},
        {"role": "Field Officer", "description": "Ground station manual entry, verification, and sensor maintenance"},
        {"role": "Analyst", "description": "Data exploration, model evaluation, and report export"},
        {"role": "Citizen", "description": "Public water status lookup and grievance reporting"},
    ]
