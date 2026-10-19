"""
Model Registry and Artifact Management for JalSuraksha Research.
Handles artifact serialization, experiment lineage, metric tracking,
and export to ml/artifacts/.
"""

import os
import json
import joblib
from datetime import datetime, timezone
from typing import Dict, Any, Optional, Tuple, List

ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../artifacts"))


def save_model_artifact(
    model: Any,
    model_name: str,
    metrics: Dict[str, Any],
    parameters: Dict[str, Any],
    dataset_info: Dict[str, Any],
    version: str = "v1"
) -> str:
    """Save model artifact alongside json metadata with reproducibility manifest."""
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    base_filename = f"{model_name}_{version}_{timestamp}"
    model_filepath = os.path.join(ARTIFACTS_DIR, f"{base_filename}.joblib")
    meta_filepath = os.path.join(ARTIFACTS_DIR, f"{base_filename}_metadata.json")

    # Serialize model
    joblib.dump(model, model_filepath)

    # Serialize metadata
    metadata = {
        "model_name": model_name,
        "version": version,
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "metrics": metrics,
        "parameters": parameters,
        "dataset_info": dataset_info,
        "model_file": os.path.basename(model_filepath)
    }

    with open(meta_filepath, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    return model_filepath


def load_model_artifact(model_filename: str) -> Tuple[Any, Dict[str, Any]]:
    """Load model artifact and associated metadata manifest."""
    model_path = os.path.join(ARTIFACTS_DIR, model_filename)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model artifact not found at: {model_path}")

    model = joblib.load(model_path)
    meta_filename = model_filename.replace(".joblib", "_metadata.json")
    meta_path = os.path.join(ARTIFACTS_DIR, meta_filename)
    metadata = {}
    if os.path.exists(meta_path):
        with open(meta_path, "r", encoding="utf-8") as f:
            metadata = json.load(f)

    return model, metadata


def list_registered_models() -> List[Dict[str, Any]]:
    """List all registered models and experiment runs."""
    if not os.path.exists(ARTIFACTS_DIR):
        return []
    
    registry = []
    for fname in os.listdir(ARTIFACTS_DIR):
        if fname.endswith("_metadata.json"):
            try:
                with open(os.path.join(ARTIFACTS_DIR, fname), "r", encoding="utf-8") as f:
                    registry.append(json.load(f))
            except Exception:
                pass
    return sorted(registry, key=lambda x: x.get("timestamp_utc", ""), reverse=True)
