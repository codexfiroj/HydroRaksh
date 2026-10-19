"""
Hydro-Geological Context-Aware Collaborative Filtering (HG-CF) Module.
Wraps the core HG-CF matrix factorization engine with hydrogeological similarity kernels,
Graph Laplacian regularization, cold-start projection, and 3-tier evidence classification.
"""

import sys
import os
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional

# Ensure services/ml is in python path to reuse core implementations
services_ml_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../services/ml"))
if services_ml_path not in sys.path:
    sys.path.insert(0, services_ml_path)

from models.hg_cf import HydroGeologicalCollaborativeFiltering
from models.conservation import ConservationInterventionEngine


class HGCFRecommendationService:
    """High-level research interface for HG-CF conservation structure recommendations."""

    def __init__(self, n_factors: int = 6, n_iterations: int = 30, alpha_laplacian: float = 0.05):
        self.model = HydroGeologicalCollaborativeFiltering(
            n_factors=n_factors,
            n_iterations=n_iterations,
            alpha_laplacian=alpha_laplacian
        )
        self.rule_engine = ConservationInterventionEngine()
        self.is_fitted = False

    def fit(self, districts: List[Dict[str, Any]]):
        """Fit HG-CF model on district hydrogeological profiles."""
        self.model.fit(districts)
        self.is_fitted = True
        return self

    def recommend(self, district_id: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Generate ranked conservation interventions with evidence tiers."""
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before generating recommendations.")
        return self.model.recommend_interventions(district_id, top_k=top_k)

    def cold_start_recommend(self, new_district_profile: Dict[str, Any], top_k: int = 5) -> List[Dict[str, Any]]:
        """Project a completely new district into latent space using hydrogeological neighborhood."""
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted before generating recommendations.")
        return self.model.recommend_interventions(
            district_id="unseen_cold_start_district",
            district_meta=new_district_profile,
            top_k=top_k
        )

    def get_similarity_matrix(self) -> Dict[str, Any]:
        """Return computed pairwise hydrogeological similarity kernel S_H."""
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted first.")
        return {
            "districts": self.model.district_ids,
            "similarity_matrix": self.model.S_H
        }

    def evaluate_ranking(self, top_k: int = 5) -> Dict[str, float]:
        """Compute evaluation metrics across known interventions."""
        if not self.is_fitted:
            raise RuntimeError("Model must be fitted first.")
        return self.model.evaluate_model(k=top_k)

