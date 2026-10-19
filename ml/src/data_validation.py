"""
Data Validation and Quality Assurance for Hydrological Observations.
Implements CGWB and Bureau of Indian Standards (BIS IS 10500:2012) physical plausibility bounds,
missingness profiling, temporal continuity audits, and outlier detection.
"""

import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple


PLAUSIBILITY_LIMITS = {
    "depth_to_water_mbgl": {"min": 0.0, "max": 250.0, "unit": "mbgl", "desc": "Groundwater depth below ground level"},
    "rainfall_mm": {"min": 0.0, "max": 1200.0, "unit": "mm", "desc": "Single-day precipitation"},
    "stage_of_extraction_pct": {"min": 0.0, "max": 500.0, "unit": "%", "desc": "Groundwater extraction to recharge ratio"},
    "ph": {"min": 4.5, "max": 10.5, "unit": "pH scale", "desc": "Physicochemical pH (BIS desirable: 6.5 - 8.5)"},
    "electrical_conductivity_us_cm": {"min": 50.0, "max": 30000.0, "unit": "µS/cm", "desc": "Salinity & ionic conductivity"},
    "fluoride_mg_l": {"min": 0.0, "max": 30.0, "unit": "mg/L", "desc": "Fluoride concentration (BIS limit: 1.5 mg/L)"},
    "nitrate_mg_l": {"min": 0.0, "max": 600.0, "unit": "mg/L", "desc": "Nitrate concentration (BIS limit: 45 mg/L)"},
    "arsenic_mg_l": {"min": 0.0, "max": 5.0, "unit": "mg/L", "desc": "Arsenic concentration (BIS limit: 0.01 mg/L)"},
}


def audit_missingness(df: pd.DataFrame) -> pd.DataFrame:
    """Generate detailed missingness audit across columns."""
    total_rows = len(df)
    records = []
    for col in df.columns:
        n_missing = df[col].isnull().sum()
        pct_missing = (n_missing / total_rows * 100.0) if total_rows > 0 else 0.0
        records.append({
            "column": col,
            "dtype": str(df[col].dtype),
            "total_rows": total_rows,
            "missing_count": int(n_missing),
            "missing_pct": round(pct_missing, 2),
            "valid_count": int(total_rows - n_missing)
        })
    return pd.DataFrame(records)


def validate_plausibility(df: pd.DataFrame, col_name: str) -> Dict[str, Any]:
    """Validate a numeric column against hydrogeological plausibility bounds."""
    if col_name not in df.columns:
        return {"error": f"Column {col_name} not found in dataframe."}
    if col_name not in PLAUSIBILITY_LIMITS:
        return {"error": f"No plausibility limits configured for {col_name}."}

    limits = PLAUSIBILITY_LIMITS[col_name]
    series = pd.to_numeric(df[col_name], errors="coerce").dropna()
    total_valid = len(series)

    if total_valid == 0:
        return {
            "column": col_name,
            "valid_numeric_count": 0,
            "violations_count": 0,
            "violation_rate_pct": 0.0,
            "status": "EMPTY"
        }

    lower_violations = series < limits["min"]
    upper_violations = series > limits["max"]
    total_violations = (lower_violations | upper_violations).sum()
    violation_rate = (total_violations / total_valid) * 100.0

    return {
        "column": col_name,
        "description": limits["desc"],
        "unit": limits["unit"],
        "expected_bounds": [limits["min"], limits["max"]],
        "observed_min": round(float(series.min()), 3),
        "observed_max": round(float(series.max()), 3),
        "observed_mean": round(float(series.mean()), 3),
        "observed_median": round(float(series.median()), 3),
        "valid_numeric_count": int(total_valid),
        "violations_count": int(total_violations),
        "violation_rate_pct": round(violation_rate, 2),
        "status": "PASS" if total_violations == 0 else ("WARNING" if violation_rate < 5.0 else "FAIL")
    }


def audit_temporal_continuity(
    df: pd.DataFrame,
    date_col: str = "recorded_date",
    group_col: str = "district_id"
) -> pd.DataFrame:
    """Audit observation intervals, gap lengths, and timestamp duplicates per district."""
    results = []
    for group_val, grp in df.groupby(group_col):
        dates = pd.to_datetime(grp[date_col]).dropna().sort_values()
        n_obs = len(dates)
        if n_obs < 2:
            results.append({
                "group": group_val,
                "n_observations": n_obs,
                "min_date": str(dates.iloc[0]) if n_obs == 1 else None,
                "max_date": str(dates.iloc[0]) if n_obs == 1 else None,
                "max_gap_days": 0,
                "mean_gap_days": 0.0,
                "duplicate_dates": 0
            })
            continue

        diffs = (dates.diff().dt.total_seconds() / 86400.0).dropna()
        duplicates = (diffs == 0).sum()
        results.append({
            "group": group_val,
            "n_observations": n_obs,
            "min_date": str(dates.min().date()),
            "max_date": str(dates.max().date()),
            "max_gap_days": round(float(diffs.max()), 1),
            "mean_gap_days": round(float(diffs.mean()), 1),
            "duplicate_dates": int(duplicates)
        })
    return pd.DataFrame(results)
