# JalSuraksha Application Dockerfile (FastAPI Backend API)
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    AUTH_ENABLED=false \
    AUTH_STORAGE_MODE=json

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    sqlite3 \
    && rm -rf /var/lib/apt/lists/*

# Install API dependencies
COPY apps/api/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application and local database
COPY apps/api /app/apps/api
COPY services /app/services
COPY data /app/data
COPY jalsuraksha_local.db /app/jalsuraksha_local.db

WORKDIR /app/apps/api

# Create non-root user
RUN addgroup --system appgroup && adduser --system --group appuser && \
    chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health || exit 1

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
