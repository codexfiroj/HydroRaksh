"""
Feature Engineering Module for Groundwater Forecasting and Decision Support.
Constructs time-aware lags, rolling statistics, hydrogeological ratios,
and meteorological departure indices without target data leakage.
"""

import pandas as pd
import numpy as np
from typing import List, Optional, Dict, Any


AQUIFER_SPECIFIC_YIELD = {
    "Alluvium (Indo-Gangetic)": 0.16,
    "Older Alluvium": 0.12,
    "Newer Alluvium": 0.18,
    "Bundelkhand Granite & Gneiss": 0.03,
    "Basalt / Deccan Traps": 0.04,
    "Sandstone & Shale (Vindhyan)": 0.05,
    "Coastal Sand": 0.20,
    "Limestone / Karst": 0.08,
    "Fissured Metamorphic Hard Rock": 0.025,
}

SOIL_INFILTRATION_CAPACITY_MM_HR = {
    "Sandy Loam": 25.0,
    "Deep Alluvium": 15.0,
    "Silt Loam": 12.0,
    "Clay Loam": 8.0,
    "Black Cotton Clay": 2.5,
    "Bundelkhand Red Gravelly": 18.0,
    "Laterite": 14.0,
    "Coastal Sand": 40.0,
}


def build_temporal_features(df: pd.DataFrame, date_col: str = "recorded_date") -> pd.DataFrame:
    """Extract cyclical seasonal components and day-of-year embeddings."""
    out = df.copy()
    dates = pd.to_datetime(out[date_col])
    
    out["month"] = dates.dt.month
    out["day_of_year"] = dates.dt.dayofyear
    out["quarter"] = dates.dt.quarter
    
    # Cyclical trigonometric transforms
    out["month_sin"] = np.sin(2 * np.pi * out["month"] / 12.0)
    out["month_cos"] = np.cos(2 * np.pi * out["month"] / 12.0)
    out["doy_sin"] = np.sin(2 * np.pi * out["day_of_year"] / 365.25)
    out["doy_cos"] = np.cos(2 * np.pi * out["day_of_year"] / 365.25)
    
    return out


def create_lag_features(
    df: pd.DataFrame,
    target_col: str = "depth_to_water_mbgl",
    group_col: str = "district_id",
    date_col: str = "recorded_date",
    lags: List[int] = [1, 2, 3, 4]
) -> pd.DataFrame:
    """
    Generate sequential lags grouped by administrative entity to strictly prevent cross-unit leakage.
    Assumes observations are pre-sorted chronologically.
    """
    out = df.sort_values([group_col, date_col]).copy()
    
    for lag in lags:
        out[f"{target_col}_lag_{lag}"] = out.groupby(group_col)[target_col].shift(lag)
        
    return out


def create_rolling_features(
    df: pd.DataFrame,
    target_col: str = "depth_to_water_mbgl",
    group_col: str = "district_id",
    date_col: str = "recorded_date",
    windows: List[int] = [3, 6]
) -> pd.DataFrame:
    """
    Generate rolling statistics with closed='left' logic to avoid current-observation leakage.
    """
    out = df.sort_values([group_col, date_col]).copy()
    
    for w in windows:
        # Shift 1 first within each group so rolling excludes the current timestamp target value
        out[f"{target_col}_roll_mean_{w}"] = out.groupby(group_col)[target_col].transform(
            lambda s: s.shift(1).rolling(window=w, min_periods=1).mean()
        )
        out[f"{target_col}_roll_std_{w}"] = out.groupby(group_col)[target_col].transform(
            lambda s: s.shift(1).rolling(window=w, min_periods=1).std().fillna(0)
        )
        out[f"{target_col}_roll_min_{w}"] = out.groupby(group_col)[target_col].transform(
            lambda s: s.shift(1).rolling(window=w, min_periods=1).min()
        )
        out[f"{target_col}_roll_max_{w}"] = out.groupby(group_col)[target_col].transform(
            lambda s: s.shift(1).rolling(window=w, min_periods=1).max()
        )

    return out


def engineer_hydrogeological_features(districts_df: pd.DataFrame) -> pd.DataFrame:
    r"""
    Construct scientific hydrogeological indices:
    - Specific Yield estimate ($S_y$)
    - Infiltration Capacity ($I_c$)
    - Recharge Potential Index ($RPI = (I_c / (1 + slope)) \times (Rainfall / 1000)$)
    - Stress Intensity ($SI = \max(0, Stage - 100)$)
    """
    df = districts_df.copy()
    
    # Map specific yield
    df["specific_yield_est"] = df["primary_aquifer"].map(
        lambda x: AQUIFER_SPECIFIC_YIELD.get(str(x), 0.08)
    )
    
    # Map infiltration capacity
    df["soil_infiltration_mm_hr"] = df["major_soil_type"].map(
        lambda x: SOIL_INFILTRATION_CAPACITY_MM_HR.get(str(x), 10.0)
    )
    
    # Slope factor (attenuates recharge as slope increases runoff)
    slope = df["average_slope_percent"].fillna(1.5).clip(lower=0.1)
    rainfall_m = df["normal_annual_rainfall_mm"].fillna(850.0) / 1000.0
    
    df["recharge_potential_index"] = (df["soil_infiltration_mm_hr"] / (1.0 + slope)) * rainfall_m
    df["recharge_potential_index"] = df["recharge_potential_index"].round(2)
    
    # Stress intensity
    stage = df["stage_of_extraction_pct"].fillna(70.0)
    df["stress_intensity"] = np.maximum(0.0, stage - 100.0).round(1)
    
    # Draft density per sq km
    area = df["area_sq_km"].fillna(3000.0).clip(lower=100.0)
    extraction = df["current_annual_extraction_mcm"].fillna(500.0)
    df["draft_density_mcm_per_sqkm"] = (extraction / area).round(4)
    
    return df
