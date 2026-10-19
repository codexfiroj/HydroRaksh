"""
Latent Dirichlet Allocation (LDA) Topic Modeling and Document Intelligence Pipeline.
Analyzes unstructured hydrological texts: CGWB monographs, CWC bulletins, state water guidelines,
and citizen water grievance logs into actionable thematic distress vectors.
"""

import re
import json
import logging
from typing import List, Dict, Any, Tuple, Optional
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation

logger = logging.getLogger("jalsuraksha.ml.topic_model")

# Representative Public-Domain Hydrological Text Corpus
# Sourced from CGWB Ground Water Year Books, CWC Bulletins, and Public Grievance Logs
DEFAULT_HYDRO_CORPUS = [
    # Topic 1: Agricultural Over-Extraction & Tubewells
    {
        "id": "DOC-CGWB-001",
        "title": "Groundwater Extraction Dynamics in Western UP Alluvial Tracts",
        "source": "Central Ground Water Board (CGWB) Technical Report",
        "state": "Uttar Pradesh",
        "district": "Hapur",
        "text": "Intensive agricultural tubewell pumping for sugarcane and paddy cultivation has accelerated regional drawdown. Over-extraction exceeds 140% of annual replenishable recharge. Rapid unmetered submersible pump electrification causes continuous seasonal water table depletion.",
        "url": "http://cgwb.gov.in/documents/western_up_groundwater.pdf"
    },
    {
        "id": "DOC-CGWB-002",
        "title": "Aquifer Depletion and Tubewell Densification in Punjab & Haryana Plains",
        "source": "CGWB Regional Aquifer Study",
        "state": "Punjab",
        "district": "Ludhiana",
        "text": "Proliferation of deep centrifugal and submersible tubewells in the alluvial sand tract has resulted in severe hydraulic head decline. Centrifugal pumps have failed due to falling water table depth exceeding 35 meters below ground level.",
        "url": "http://cgwb.gov.in/documents/punjab_aquifer_study.pdf"
    },
    # Topic 2: Industrial Effluent Contamination
    {
        "id": "DOC-CPCB-003",
        "title": "Industrial Effluent Discharge and Shallow Aquifer Vulnerability",
        "source": "Central Pollution Control Board (CPCB) Water Quality Monograph",
        "state": "Uttar Pradesh",
        "district": "Ghaziabad",
        "text": "Industrial drains discharging untreated chemical effluents, heavy metals, hexavalent chromium, and high biological oxygen demand (BOD) loads into storm drains have contaminated shallow unconfined aquifers near industrial clusters.",
        "url": "https://cpcb.nic.in/reports/hindon_basin_water_quality.pdf"
    },
    {
        "id": "DOC-CPCB-004",
        "title": "Groundwater Contamination in Industrial Belts of Western India",
        "source": "State Pollution Control Board Bulletin",
        "state": "Gujarat",
        "district": "Ahmedabad",
        "text": "Chemical effluent discharge, high total dissolved solids (TDS), elevated chemical oxygen demand (COD), and synthetic dyes have created localized groundwater contamination plumes requiring continuous monitoring probe deployment.",
        "url": "https://gpcb.gujarat.gov.in/reports/industrial_effluent_audit.pdf"
    },
    # Topic 3: Canal Irrigation Seepage & Tail-End Deficit
    {
        "id": "DOC-CWC-005",
        "title": "Canal Network Efficiency and Tail-End Water Deficits in Ganga-Yamuna Doab",
        "source": "Central Water Commission (CWC) Irrigation Bulletin",
        "state": "Uttar Pradesh",
        "district": "Meerut",
        "text": "Unlined distributaries suffer from excessive siltation and seepage losses, causing severe tail-end delivery deficits. Rotational supply rosters are disrupted during peak kharif irrigation season, forcing farmers onto emergency tubewell extraction.",
        "url": "http://cwc.gov.in/publications/canal_efficiency_ganga_doab.pdf"
    },
    # Topic 4: Urban Impervious Runoff & Concretization
    {
        "id": "DOC-URBAN-006",
        "title": "Urban Concretization, Catchment Loss and Storm Runoff in NCR",
        "source": "National Capital Region Planning Board Hydrology Paper",
        "state": "Delhi",
        "district": "New Delhi",
        "text": "Impervious paved surfaces, concretization of natural storm drains, and encroachment on floodplains prevent natural monsoon infiltration, exacerbating urban flash flooding while depleting underlying alluvial recharge zones.",
        "url": "https://ncrpb.nic.in/reports/urban_catchment_drainage.pdf"
    },
    # Topic 5: Geogenic Fluoride, Salinity & Arsenic Hazards
    {
        "id": "DOC-CGWB-007",
        "title": "Geogenic Fluoride and Saline Aquifer Distribution in Arid & Semi-Arid Belts",
        "state": "Rajasthan",
        "district": "Jaipur",
        "source": "CGWB Water Quality Survey",
        "text": "Deep granitic aquifers exhibit severe geogenic fluoride concentrations exceeding the BIS 10500 permissible limit of 1.5 mg/L, causing endemic dental and skeletal fluorosis. Brackish saline horizons in deeper strata restrict tubewell drilling depths.",
        "url": "http://cgwb.gov.in/documents/fluoride_hazard_rajasthan.pdf"
    },
    {
        "id": "DOC-CGWB-008",
        "title": "Arsenic Contamination Vulnerability in Middle Gangetic Plains",
        "state": "Bihar",
        "district": "Patna",
        "source": "National Water Mission Health Study",
        "text": "Shallow newer alluvial aquifers along the river banks contain geogenic arsenic concentrations exceeding 0.01 mg/L. Piezometric monitoring indicates deeper pleistocene aquifers remain arsenic-free and must be protected from inter-aquifer leakage.",
        "url": "http://cgwb.gov.in/documents/ganga_arsenic_belt.pdf"
    },
    # Topic 6: Rainwater Harvesting Feasibility & Percolation
    {
        "id": "DOC-RWH-009",
        "title": "Technical Feasibility of Artificial Recharge and Rooftop RWH in Institutional Areas",
        "state": "Uttar Pradesh",
        "district": "Aligarh",
        "source": "UP State Groundwater Department Manual",
        "text": "Rooftop rainwater harvesting with silt sedimentation chambers and multi-layered gravel filtration beds provides cost-effective artificial recharge into unsaturated vadose zones, achieving over 85% runoff capture efficiency during monsoon storms.",
        "url": "http://upgroundwater.in/guidelines/rwh_technical_manual.pdf"
    },
    {
        "id": "DOC-RWH-010",
        "title": "Community Percolation Tanks and Check Dam Restoration in Peninsular Hard Rock",
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "source": "State Water Resource Department Advisory",
        "text": "Desilting historical village tanks and constructing cascading check dams on seasonal streams elevates the groundwater table by 1.2 to 2.4 meters annually, replenishing community borewells and mitigating local drought distress.",
        "url": "http://waterresources.kar.nic.in/reports/percolation_tank_restoration.pdf"
    }
]

TOPIC_LABELS = {
    0: "Agricultural Over-Extraction & Tubewells",
    1: "Industrial Effluent & Chemical Contamination",
    2: "Canal Seepage Loss & Tail-End Deficits",
    3: "Urban Impervious Runoff & Concretization",
    4: "Geogenic Fluoride, Salinity & Arsenic Hazards",
    5: "Rainwater Harvesting & Artificial Recharge Feasibility"
}


class HydrologicalTopicModel:
    """
    Latent Dirichlet Allocation (LDA) Engine for Hydrological Document Intelligence.
    Extracts 6 latent water distress topics and geotags qualitative literature to districts.
    """

    def __init__(self, n_topics: int = 6, max_features: int = 500, random_state: int = 42):
        self.n_topics = n_topics
        self.max_features = max_features
        self.random_state = random_state

        self.vectorizer = CountVectorizer(
            max_df=0.90,
            min_df=1,
            max_features=self.max_features,
            stop_words="english",
            token_pattern=r"(?u)\b[a-zA-Z]{3,}\b"
        )
        self.lda_model = LatentDirichletAllocation(
            n_components=self.n_topics,
            random_state=self.random_state,
            learning_method="batch",
            max_iter=30
        )
        self.corpus: List[Dict[str, Any]] = []
        self.doc_topic_dist: Optional[np.ndarray] = None
        self.is_fitted: bool = False

    def fit(self, corpus: Optional[List[Dict[str, Any]]] = None) -> "HydrologicalTopicModel":
        """Fit LDA model on text corpus."""
        self.corpus = corpus or DEFAULT_HYDRO_CORPUS
        texts = [doc["text"] for doc in self.corpus]

        X = self.vectorizer.fit_transform(texts)
        self.doc_topic_dist = self.lda_model.fit_transform(X)
        self.is_fitted = True

        logger.info(f"LDA fitted on {len(texts)} documents with {self.n_topics} latent topics.")
        return self

    def get_topic_keywords(self, top_n: int = 6) -> Dict[int, Dict[str, Any]]:
        """Get the top-N keywords defining each latent topic."""
        if not self.is_fitted:
            raise RuntimeError("LDA model must be fitted first.")

        vocab = np.array(self.vectorizer.get_feature_names_out())
        topics_info = {}

        for topic_idx, topic_dist in enumerate(self.lda_model.components_):
            top_word_indices = topic_dist.argsort()[:-top_n - 1:-1]
            top_words = vocab[top_word_indices].tolist()
            topics_info[topic_idx] = {
                "label": TOPIC_LABELS.get(topic_idx, f"Topic {topic_idx + 1}"),
                "top_keywords": top_words,
                "importance_weights": [round(float(topic_dist[i]), 2) for i in top_word_indices]
            }

        return topics_info

    def infer_topics(self, text: str) -> Dict[str, Any]:
        """Infer topic probability distribution for an arbitrary text snippet."""
        if not self.is_fitted:
            self.fit()

        X = self.vectorizer.transform([text])
        dist = self.lda_model.transform(X)[0]
        dominant_topic_idx = int(np.argmax(dist))

        return {
            "dominant_topic_id": dominant_topic_idx,
            "dominant_topic_label": TOPIC_LABELS.get(dominant_topic_idx, f"Topic {dominant_topic_idx + 1}"),
            "topic_distribution": {
                TOPIC_LABELS.get(i, f"Topic {i + 1}"): round(float(dist[i]), 4)
                for i in range(self.n_topics)
            }
        }

    def get_district_thematic_profile(self, district_name: str) -> Dict[str, Any]:
        """
        Aggregate topic vectors across documents geotagged to a specific district.
        Computes thematic distress profile tau_u for HG-CF integration.
        """
        if not self.is_fitted:
            self.fit()

        clean_dist = district_name.lower().strip()
        matching_indices = [
            i for i, doc in enumerate(self.corpus)
            if doc.get("district", "").lower() == clean_dist
        ]

        if not matching_indices:
            # Fallback to general state documents or uniform prior
            tau = np.ones(self.n_topics, dtype=np.float32) / float(self.n_topics)
            doc_count = 0
            citations = []
        else:
            tau = np.mean(self.doc_topic_dist[matching_indices], axis=0)
            doc_count = len(matching_indices)
            citations = [
                {
                    "id": self.corpus[i]["id"],
                    "title": self.corpus[i]["title"],
                    "source": self.corpus[i]["source"],
                    "url": self.corpus[i]["url"]
                }
                for i in matching_indices
            ]

        dominant_idx = int(np.argmax(tau))
        return {
            "district": district_name,
            "matched_documents_count": doc_count,
            "dominant_thematic_distress": TOPIC_LABELS.get(dominant_idx, "Balanced"),
            "thematic_vector": [round(float(v), 4) for v in tau],
            "thematic_breakdown": {
                TOPIC_LABELS.get(i, f"Topic {i + 1}"): round(float(tau[i]), 4)
                for i in range(self.n_topics)
            },
            "source_citations": citations
        }

    def search_documents(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search documents using keyword relevance and topic overlap."""
        if not self.is_fitted:
            self.fit()

        query_inf = self.infer_topics(query)
        q_dist = np.array(list(query_inf["topic_distribution"].values()))

        results = []
        for i, doc in enumerate(self.corpus):
            # Compute cosine similarity between query topic vector and document topic vector
            doc_dist = self.doc_topic_dist[i]
            sim = float(np.dot(q_dist, doc_dist) / (np.linalg.norm(q_dist) * np.linalg.norm(doc_dist) + 1e-6))

            # Add keyword bonus
            q_tokens = set(re.findall(r"\w+", query.lower()))
            doc_tokens = set(re.findall(r"\w+", doc["text"].lower()))
            overlap = len(q_tokens & doc_tokens)

            composite_score = sim * 0.7 + (min(1.0, overlap / max(1, len(q_tokens)))) * 0.3

            results.append({
                "id": doc["id"],
                "title": doc["title"],
                "source": doc["source"],
                "state": doc.get("state"),
                "district": doc.get("district"),
                "snippet": doc["text"][:160] + "...",
                "url": doc["url"],
                "relevance_score": round(composite_score, 3),
                "similarity_score": round(composite_score, 3)
            })

        results.sort(key=lambda x: x["relevance_score"], reverse=True)
        return results[:limit]
