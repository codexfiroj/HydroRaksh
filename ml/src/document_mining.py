"""
Hydrological Document Mining and Latent Dirichlet Allocation (LDA) Module.
Processes CGWB district reports, CWC bulletins, and groundwater surveys
into topic distributions, district distress vectors, and semantic query matching.
"""

import sys
import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional

services_ml_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../services/ml"))
if services_ml_path not in sys.path:
    sys.path.insert(0, services_ml_path)

from models.topic_model import HydrologicalTopicModel


class DocumentIntelligenceService:
    """Research interface for hydrological text mining and topic modeling."""

    def __init__(self, num_topics: int = 6, random_state: int = 42):
        self.model = HydrologicalTopicModel(n_topics=num_topics, random_state=random_state)
        self.is_fitted = False

    def fit(self, corpus: Optional[List[Dict[str, Any]]] = None):
        """Fit LDA model on domain corpus or built-in CGWB/CWC report extracts."""
        self.model.fit(corpus)
        self.is_fitted = True
        return self

    def get_topics(self, top_n_words: int = 8) -> List[Dict[str, Any]]:
        """Return the extracted hydrological topics with top indicative keywords."""
        if not self.is_fitted:
            self.fit()
        keywords_dict = self.model.get_topic_keywords(top_n=top_n_words)
        return [
            {
                "topic_id": topic_id,
                "label": info["label"],
                "top_words": info["top_keywords"],
                "importance_weights": info.get("importance_weights", [])
            }
            for topic_id, info in keywords_dict.items()
        ]

    def extract_document_topics(self, text: str) -> Dict[str, Any]:
        """Infer topic mixture proportions theta_d for arbitrary hydrological text."""
        if not self.is_fitted:
            self.fit()
        return self.model.infer_topics(text)

    def get_district_distress_profile(self, district_id: str) -> Dict[str, Any]:
        """Retrieve aggregated qualitative distress topic vector for a given district."""
        if not self.is_fitted:
            self.fit()
        return self.model.get_district_thematic_profile(district_id)

    def search_documents(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Perform semantic search across indexed hydrological reports."""
        if not self.is_fitted:
            self.fit()
        return self.model.semantic_search(query, top_k=top_k)

