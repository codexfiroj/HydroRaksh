# JalSuraksha ML Research & Hydrological Modeling Workspace

Welcome to the **JalSuraksha Machine Learning & Hydrological Intelligence Research Workspace**. This directory hosts executable research notebooks, reusable scientific Python modules, data ingestion and preprocessing pipelines, configuration files, and serialized model artifacts.

---

## 📁 Research Directory Structure

```text
ml/
├── notebooks/                              # 16 Executable Research Jupyter Notebooks
│   ├── 00_research_environment.ipynb       # System dependencies & DB audit
│   ├── 01_data_source_audit.ipynb          # CGWB, WRIS, IMD, CWC, data.gov.in & Open Repos
│   ├── 02_groundwater_eda.ipynb            # Depth (mbgl) distributions & stats
│   ├── 03_data_quality_and_missingness.ipynb # BIS IS 10500 & CGWB plausibility bounds
│   ├── 04_spatiotemporal_analysis.ipynb    # Seasonal recharge fluctuation Δh
│   ├── 05_groundwater_trend_analysis.ipynb # Mann-Kendall & Sen's slope rate of decline
│   ├── 06_groundwater_forecasting.ipynb    # Time-series leakage-free problem formulation
│   ├── 07_model_baselines.ipynb            # Persistence, Seasonal Naive & Ridge
│   ├── 08_advanced_ml_models.ipynb         # Random Forest & Gradient Boosting (GBDT)
│   ├── 09_hydrogeological_features.ipynb   # Specific Yield (Sy), Infiltration & RPI
│   ├── 10_rainfall_and_drought_analysis.ipynb # Monsoon departures & hydrological lag
│   ├── 11_hg_cf_recommendations.ipynb      # HG-CF Graph Laplacian & cold-start
│   ├── 12_lda_document_mining.ipynb        # LDA topic modeling on CGWB/CWC reports
│   ├── 13_geospatial_visualization.ipynb   # Spatial maps & extraction stage clusters
│   ├── 14_model_evaluation.ipynb           # Rolling-origin & geographic holdout metrics
│   └── 15_reproducibility_and_model_export.ipynb # Artifact verification & lineage manifests
├── src/                                    # Reusable Scientific Python Modules
│   ├── data_loading.py                     # SQLite / CSV loaders with HF & Kaggle fallbacks
│   ├── data_validation.py                  # BIS/CGWB plausibility limits & continuity audits
│   ├── feature_engineering.py              # Lags, rolling transforms, cyclical & hydro indices
│   ├── groundwater_analysis.py             # Mann-Kendall test, Sen's slope, GEC-2015 logic
│   ├── forecasting.py                      # Baselines, RF, GBDT, rolling-origin CV & holdouts
│   ├── recommendation.py                   # HG-CF matrix factorization & cold-start projection
│   ├── document_mining.py                  # 6-topic LDA engine & semantic report search
│   ├── evaluation.py                       # MAE, RMSE, MAPE, R², Precision@K, NDCG@K
│   └── model_registry.py                   # Joblib serialization & reproducibility manifests
├── pipelines/                              # Automated Execution Pipelines
│   ├── ingest_data.py                      # Data ingestion & schema verification
│   ├── preprocess_data.py                  # Feature construction & chronological split
│   ├── train_models.py                     # Train RF, GBDT, HG-CF, LDA & export artifacts
│   └── evaluate_models.py                  # Cross-validation & benchmark reporting
├── configs/                                # Configuration Specs
│   ├── data_sources.yaml                   # National & open-access data registry
│   └── experiments.yaml                    # Hyperparameter & validation settings
├── tests/                                  # ML Research Unit Tests
│   └── test_ml_research.py                 # Tests for all src/ modules
├── artifacts/                              # Serialized Models & Manifests (.joblib & .json)
├── requirements-research.txt               # Research Python dependencies
├── build_notebooks.py                      # Notebook generator & validator
└── README.md                               # This documentation file
```

---

## 🚀 Quickstart & Pipeline Execution

### 1. Setup Environment
```bash
pip install -r ml/requirements-research.txt
```

### 2. Run Data Ingestion
```bash
# Full dataset mode
python ml/pipelines/ingest_data.py

# Fast sample mode
python ml/pipelines/ingest_data.py --sample
```

### 3. Train Models
```bash
python ml/pipelines/train_models.py
```

### 4. Evaluate Models & Generate Benchmark Report
```bash
python ml/pipelines/evaluate_models.py
```

### 5. Launch JupyterLab for Interactive Exploration
```bash
jupyter lab ml/notebooks/
```

---

## 🔬 Scientific Methodology & Validated Metrics

### Groundwater Forecasting
- **Validation**: 4-fold Rolling-Origin (Expanding Window) Cross-Validation without data leakage.
- **Geographic Generalization**: Evaluated on held-out test districts (e.g., Agra, Patna, Meerut).
- **Baselines**:
  - Persistence: $y_{t+h} = y_t$
  - Seasonal Naive: $y_{t+h} = y_{t+h-365}$
  - Ridge Regression ($L_2$ penalty)
- **Advanced Models**: Random Forest Regressor & Gradient Boosting Regressor (GBDT).
- **Measured Results**:
  - Ridge Regression: MAE = 3.85 mbgl | RMSE = 4.35 mbgl
  - Random Forest: MAE = 4.05 mbgl | RMSE = 4.58 mbgl
  - Gradient Boosting: MAE = 4.02 mbgl | RMSE = 4.68 mbgl
  - Geographic Holdout: MAE = 5.17 mbgl | RMSE = 7.37 mbgl

### Hydro-Geological Collaborative Filtering (HG-CF)
- **Latent Dimensions**: $d = 6$, Graph Laplacian weight $\alpha = 0.05$.
- **Similarity Kernel**: Gaussian RBF $S_{uv}^H$ over hydraulic conductivity, slope, extraction stage, and depth.
- **Evidence Tiers**:
  1. `OBSERVED_OUTCOME`: Verified pilot structures with monitored recovery.
  2. `INFERRED_SIMILARITY`: Projected via hydrogeological neighbor similarity.
  3. `EXPERT_REVIEW_REQUIRED`: Low predicted recovery or marginal hydrogeological fit.
- **Measured Metrics**: Precision@5 = 0.197, NDCG@5 = 0.437, MAE = 0.123.

### LDA Document Intelligence
- **Corpus**: Central Ground Water Board (CGWB) district aquifer reports, Central Pollution Control Board (CPCB) monographs, and Central Water Commission (CWC) reservoir bulletins.
- **Topics**: 6 latent distress themes covering Over-Exploitation, Industrial Contamination, Canal Tail-End Deficits, Urban Runoff, Geogenic Hazards (Fluoride/Arsenic), and Artificial Recharge Feasibility.
