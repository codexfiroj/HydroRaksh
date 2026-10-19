"""
Model Evaluation Suite for Groundwater Forecasting and Recommendation Systems.
Implements time-series regression metrics, prediction interval coverage (PICP),
and recommendation ranking metrics (Precision@K, NDCG@K, MRR).
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List


def evaluate_regression(
    y_true: np.ndarray,
    y_pred: np.ndarray,
    y_lower: np.ndarray = None,
    y_upper: np.ndarray = None
) -> Dict[str, float]:
    """Compute comprehensive time-series regression and interval metrics."""
    yt = np.asarray(y_true, dtype=float)
    yp = np.asarray(y_pred, dtype=float)

    mae = float(np.mean(np.abs(yt - yp)))
    rmse = float(np.sqrt(np.mean((yt - yp) ** 2)))
    med_ae = float(np.median(np.abs(yt - yp)))

    # MAPE with zero protection
    nonzero = np.abs(yt) > 0.05
    mape = float(np.mean(np.abs((yt[nonzero] - yp[nonzero]) / yt[nonzero])) * 100.0) if np.any(nonzero) else 0.0

    # R-squared
    ss_res = np.sum((yt - yp) ** 2)
    ss_tot = np.sum((yt - np.mean(yt)) ** 2)
    r2 = float(1.0 - (ss_res / ss_tot)) if ss_tot > 0 else 0.0

    metrics = {
        "mae": round(mae, 4),
        "rmse": round(rmse, 4),
        "median_ae": round(med_ae, 4),
        "mape_pct": round(mape, 2),
        "r2": round(r2, 4),
        "n_samples": len(yt)
    }

    # Prediction Interval evaluation if bounds provided
    if y_lower is not None and y_upper is not None:
        yl = np.asarray(y_lower, dtype=float)
        yu = np.asarray(y_upper, dtype=float)
        covered = (yt >= yl) & (yt <= yu)
        picp = float(np.mean(covered) * 100.0)  # Prediction Interval Coverage Probability
        mpiw = float(np.mean(yu - yl))          # Mean Prediction Interval Width
        metrics["picp_90_pct"] = round(picp, 2)
        metrics["mpiw_m"] = round(mpiw, 4)

    return metrics


def precision_at_k(recommended: List[str], ground_truth: List[str], k: int = 5) -> float:
    """Proportion of top-K recommendations that are in ground truth relevance set."""
    if k <= 0 or not ground_truth:
        return 0.0
    top_k = recommended[:k]
    hits = sum(1 for item in top_k if item in ground_truth)
    return hits / float(k)


def recall_at_k(recommended: List[str], ground_truth: List[str], k: int = 5) -> float:
    """Proportion of relevant items captured in top-K recommendations."""
    if not ground_truth:
        return 0.0
    top_k = recommended[:k]
    hits = sum(1 for item in top_k if item in ground_truth)
    return hits / float(len(ground_truth))


def ndcg_at_k(recommended: List[str], ground_truth: List[str], k: int = 5) -> float:
    """Normalized Discounted Cumulative Gain at rank K."""
    if not ground_truth or k <= 0:
        return 0.0

    dcg = 0.0
    for i, item in enumerate(recommended[:k]):
        rel = 1.0 if item in ground_truth else 0.0
        dcg += rel / np.log2(i + 2.0)

    # Ideal DCG
    idcg = sum(1.0 / np.log2(i + 2.0) for i in range(min(k, len(ground_truth))))
    return float(dcg / idcg) if idcg > 0 else 0.0


def mean_reciprocal_rank(recommended: List[str], ground_truth: List[str]) -> float:
    """Reciprocal rank of the first relevant recommendation."""
    for i, item in enumerate(recommended):
        if item in ground_truth:
            return 1.0 / (i + 1.0)
    return 0.0
