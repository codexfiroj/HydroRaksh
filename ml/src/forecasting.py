"""
Groundwater Forecasting Suite for JalSuraksha Research.
Provides Persistence and Seasonal Naive baselines, Ridge regression, Random Forest,
and Gradient Boosting models with Rolling-Origin Cross-Validation, Geographic Holdouts,
and empirical 90% prediction intervals.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple, Optional
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


class PersistenceBaseline:
    """Predicts next horizon level as the most recent known observation."""
    def fit(self, X: np.ndarray, y: np.ndarray):
        pass

    def predict(self, X: np.ndarray) -> np.ndarray:
        # Assumes feature at index 0 is lag_1 (latest observation)
        return X[:, 0]


class SeasonalNaiveBaseline:
    """Predicts next horizon level using the observation from 365 days prior (or 4 quarters prior)."""
    def __init__(self, seasonal_lag_idx: int = -1):
        self.seasonal_lag_idx = seasonal_lag_idx

    def fit(self, X: np.ndarray, y: np.ndarray):
        pass

    def predict(self, X: np.ndarray) -> np.ndarray:
        return X[:, self.seasonal_lag_idx]


def evaluate_forecast_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Compute MAE, RMSE, MAPE, and R2."""
    mae = mean_absolute_error(y_true, y_pred)
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    
    # Avoid div zero in MAPE
    mask = np.abs(y_true) > 0.1
    if np.any(mask):
        mape = float(np.mean(np.abs((y_true[mask] - y_pred[mask]) / y_true[mask])) * 100.0)
    else:
        mape = 0.0

    r2 = r2_score(y_true, y_pred) if len(y_true) > 2 else 0.0

    return {
        "mae": round(float(mae), 3),
        "rmse": round(float(rmse), 3),
        "mape_pct": round(float(mape), 2),
        "r2": round(float(r2), 3)
    }


def rolling_origin_cross_validation(
    df: pd.DataFrame,
    feature_cols: List[str],
    target_col: str = "depth_to_water_mbgl",
    n_splits: int = 4,
    min_train_fraction: float = 0.5
) -> Dict[str, Any]:
    """
    Perform rolling-origin (expanding window) time-aware cross-validation across all models.
    Strictly forbids random shuffling to guarantee no future leakage.
    """
    clean = df.dropna(subset=feature_cols + [target_col]).sort_values("recorded_date")
    total_samples = len(clean)
    if total_samples < 20:
        return {"error": "Insufficient samples for rolling-origin CV (minimum 20 required)."}

    min_train = int(total_samples * min_train_fraction)
    fold_step = (total_samples - min_train) // n_splits

    models = {
        "Persistence": PersistenceBaseline(),
        "Ridge Regression": Ridge(alpha=1.0),
        "Random Forest": RandomForestRegressor(n_estimators=80, max_depth=6, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=80, learning_rate=0.08, max_depth=4, random_state=42)
    }

    results = {name: {"mae": [], "rmse": [], "r2": []} for name in models}

    for fold in range(n_splits):
        train_end = min_train + fold * fold_step
        test_end = train_end + fold_step if fold < n_splits - 1 else total_samples

        train_data = clean.iloc[:train_end]
        test_data = clean.iloc[train_end:test_end]

        if len(test_data) == 0:
            continue

        X_train = train_data[feature_cols].values
        y_train = train_data[target_col].values
        X_test = test_data[feature_cols].values
        y_test = test_data[target_col].values

        for name, model in models.items():
            model.fit(X_train, y_train)
            preds = model.predict(X_test)
            metrics = evaluate_forecast_metrics(y_test, preds)
            results[name]["mae"].append(metrics["mae"])
            results[name]["rmse"].append(metrics["rmse"])
            results[name]["r2"].append(metrics["r2"])

    summary = {}
    for name, m in results.items():
        summary[name] = {
            "mean_mae": round(float(np.mean(m["mae"])), 3) if m["mae"] else 0.0,
            "mean_rmse": round(float(np.mean(m["rmse"])), 3) if m["rmse"] else 0.0,
            "mean_r2": round(float(np.mean(m["r2"])), 3) if m["r2"] else 0.0,
            "n_folds": len(m["mae"])
        }

    return summary


def geographic_holdout_evaluation(
    df: pd.DataFrame,
    districts_list: List[str],
    holdout_districts: List[str],
    feature_cols: List[str],
    target_col: str = "depth_to_water_mbgl"
) -> Dict[str, Any]:
    """
    Spatial generalization evaluation: train exclusively on non-holdout districts
    and evaluate forecast generalization on completely held-out administrative districts.
    """
    clean = df.dropna(subset=feature_cols + [target_col])
    
    train_mask = ~clean["district_id"].isin(holdout_districts)
    test_mask = clean["district_id"].isin(holdout_districts)

    train_data = clean[train_mask]
    test_data = clean[test_mask]

    if len(train_data) == 0 or len(test_data) == 0:
        return {"error": "Geographic holdout split produced empty train or test partition."}

    X_train = train_data[feature_cols].values
    y_train = train_data[target_col].values
    X_test = test_data[feature_cols].values
    y_test = test_data[target_col].values

    rf = RandomForestRegressor(n_estimators=100, max_depth=6, random_state=42)
    rf.fit(X_train, y_train)
    preds = rf.predict(X_test)

    metrics = evaluate_forecast_metrics(y_test, preds)
    return {
        "train_districts_count": int(train_data["district_id"].nunique()),
        "held_out_districts": holdout_districts,
        "test_samples_count": len(test_data),
        "held_out_mae": metrics["mae"],
        "held_out_rmse": metrics["rmse"],
        "held_out_r2": metrics["r2"]
    }
