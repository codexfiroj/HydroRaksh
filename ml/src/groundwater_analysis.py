"""
Groundwater Hydrological Analysis Module.
Implements Mann-Kendall non-parametric trend tests, Sen's slope rate-of-decline estimators,
GEC-2015 resource assessment classification, and seasonal water table fluctuation metrics.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple, Optional


def mann_kendall_trend_test(series: np.ndarray, alpha: float = 0.05) -> Dict[str, Any]:
    """
    Compute Mann-Kendall non-parametric monotonic trend test.
    Positive S / tau indicates declining water table (increasing depth mbgl).
    Negative S / tau indicates rising water table (recovery).
    """
    x = np.asarray(series, dtype=float)
    x = x[~np.isnan(x)]
    n = len(x)
    if n < 4:
        return {
            "n": n,
            "trend": "INSUFFICIENT_DATA",
            "p_value": 1.0,
            "tau": 0.0,
            "z_score": 0.0,
            "is_significant": False
        }

    # Compute S statistic
    s = 0
    for k in range(n - 1):
        s += np.sum(np.sign(x[k + 1:] - x[k]))

    # Compute variance of S with tie adjustment
    unique, counts = np.unique(x, return_counts=True)
    ties = counts[counts > 1]
    tie_sum = np.sum(ties * (ties - 1) * (2 * ties + 5))
    var_s = (n * (n - 1) * (2 * n + 5) - tie_sum) / 18.0

    # Z score with continuity correction
    if s > 0:
        z = (s - 1) / np.sqrt(var_s)
    elif s < 0:
        z = (s + 1) / np.sqrt(var_s)
    else:
        z = 0.0

    # Standard normal two-tailed p-value approximation
    from scipy.stats import norm
    p_val = 2.0 * (1.0 - norm.cdf(abs(z)))

    # Kendall's Tau rank correlation
    tau = s / (0.5 * n * (n - 1))

    is_significant = bool(p_val < alpha)
    if is_significant:
        trend = "DEPLETING (WATER TABLE FALLING)" if s > 0 else "RECHARGING (WATER TABLE RISING)"
    else:
        trend = "NO_SIGNIFICANT_TREND"

    return {
        "n": int(n),
        "s_stat": int(s),
        "tau": round(float(tau), 4),
        "z_score": round(float(z), 3),
        "p_value": round(float(p_val), 5),
        "is_significant": is_significant,
        "trend": trend
    }


def sens_slope_estimator(dates: pd.Series, values: pd.Series) -> Dict[str, Any]:
    """
    Compute Sen's non-parametric slope estimator (meters per year).
    """
    df = pd.DataFrame({"date": pd.to_datetime(dates), "val": pd.to_numeric(values, errors="coerce")}).dropna()
    df = df.sort_values("date")
    n = len(df)
    if n < 3:
        return {"slope_m_per_year": 0.0, "status": "INSUFFICIENT_DATA"}

    t_years = (df["date"] - df["date"].iloc[0]).dt.total_seconds() / (365.25 * 86400.0)
    y = df["val"].values

    slopes = []
    for i in range(n - 1):
        dt = t_years.iloc[i + 1:] - t_years.iloc[i]
        valid = dt > 0.05  # minimum 18 days difference
        if np.any(valid):
            dy = y[i + 1:][valid] - y[i]
            slopes.extend(dy / dt[valid])

    if not slopes:
        return {"slope_m_per_year": 0.0, "status": "INSUFFICIENT_INTERVALS"}

    median_slope = float(np.median(slopes))
    return {
        "slope_m_per_year": round(median_slope, 4),
        "annual_rate_desc": f"{abs(median_slope):.2f} m/yr {'decline' if median_slope > 0 else 'recovery'}",
        "n_pairs": len(slopes)
    }


def classify_gec_2015(
    stage_pct: float,
    pre_monsoon_trend_p: float,
    pre_monsoon_slope: float,
    post_monsoon_trend_p: float,
    post_monsoon_slope: float
) -> Dict[str, Any]:
    """
    CGWB GEC-2015 (Groundwater Resource Estimation Committee) Methodology Classification:
    - Safe: Stage <= 70% (no long term fall in both pre and post)
    - Semi-Critical: Stage > 70% and <= 90%, or Stage <= 70% with long-term fall
    - Critical: Stage > 90% and <= 100%, or Stage > 70% & <= 90% with fall in either pre or post
    - Over-Exploited: Stage > 100% and fall in pre or post, or Stage > 100%
    """
    falling_pre = (pre_monsoon_trend_p < 0.05) and (pre_monsoon_slope > 0.1)
    falling_post = (post_monsoon_trend_p < 0.05) and (post_monsoon_slope > 0.1)
    falling_both = falling_pre and falling_post
    falling_either = falling_pre or falling_post

    if stage_pct <= 70.0:
        if falling_both:
            category = "Semi-Critical"
        else:
            category = "Safe"
    elif 70.0 < stage_pct <= 90.0:
        if falling_either:
            category = "Critical"
        else:
            category = "Semi-Critical"
    elif 90.0 < stage_pct <= 100.0:
        category = "Critical"
    else:  # stage > 100%
        category = "Over-Exploited"

    return {
        "stage_of_extraction_pct": stage_pct,
        "gec_category": category,
        "falling_pre_monsoon": falling_pre,
        "falling_post_monsoon": falling_post,
        "recommendation_priority": "CRITICAL_ACTION" if category in ["Over-Exploited", "Critical"] else "MONITORING"
    }


def calculate_seasonal_fluctuation(pre_depth_mbgl: float, post_depth_mbgl: float) -> Dict[str, Any]:
    """
    Water table seasonal recharge fluctuation:
    Delta h = h_pre - h_post.
    Positive Delta h indicates post-monsoon water table rise (natural seasonal recharge).
    """
    rise_m = pre_depth_mbgl - post_depth_mbgl
    return {
        "pre_monsoon_depth_mbgl": pre_depth_mbgl,
        "post_monsoon_depth_mbgl": post_depth_mbgl,
        "water_table_rise_m": round(rise_m, 2),
        "status": "NORMAL_SEASONAL_RECHARGE" if rise_m > 0 else "DEFICIT_RECHARGE"
    }
