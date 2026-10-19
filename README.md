# JalSuraksha: Collaborative Filtering and Latent Topic Analysis for AI-Driven Groundwater Intelligence and Water Resource Decision Support

[![CI Status](https://img.shields.io/badge/CI-Passing%20(69%2F69%20Tests)-248653.svg)](file:///d:/projects/JalSuraksha/tests/unit)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.7-12345A.svg)](file:///d:/projects/JalSuraksha/apps/web)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109.2-245B8F.svg)](file:///d:/projects/JalSuraksha/apps/api)
[![ML Research](https://img.shields.io/badge/Jupyter-16%20Notebooks-E88B2A.svg)](file:///d:/projects/JalSuraksha/ml/notebooks)
[![Docker](https://img.shields.io/badge/Docker-Ready-80B8F0.svg)](file:///d:/projects/JalSuraksha/docker-compose.yml)
[![Theme](https://img.shields.io/badge/Theme-India.gov.in%20Tokens-12345A.svg)](file:///d:/projects/JalSuraksha/apps/web/src/app/globals.css)

---

## Project Ownership and Attribution

| Field | Details |
| :--- | :--- |
| **Project Owner & Lead** | **Mohd Shami** |
| **Academic Program** | **B.Tech Data Science** |
| **Official Email** | [codexshami@gmail.com](mailto:codexshami@gmail.com) |
| **Personal Portfolio** | [https://mohdshamii.github.io](https://mohdshamii.github.io) |
| **GitHub Profile** | [https://github.com/mohdshamii](https://github.com/mohdshamii) |
| **LinkedIn Profile** | [https://linkedin.com/in/modshamii](https://linkedin.com/in/modshamii) |

> **Independent Project Notice:**  
> JalSuraksha is an independent geospatial artificial intelligence, data engineering, and hydrological decision-support platform engineered by Mohd Shami. Inspired by the clean, accessible, and trustworthy aesthetic of open public-information portals (such as India.gov.in), JalSuraksha is an independent research platform and is **not** an official Government of India or state department website. All hydrological telemetry and meteorological observations are compiled from publicly accessible records published by the Central Ground Water Board (CGWB), India Meteorological Department (IMD), India-WRIS, and Central Water Commission (CWC).

---

## Abstract

Groundwater depletion represents an existential challenge to agricultural sustainability, urban water security, and socio-economic resilience across India, where over 63% of irrigated cropland and 85% of rural drinking supplies depend on unconfined and semi-confined aquifers. Conventional monitoring systems rely predominantly on centralized numerical simulations (e.g., MODFLOW) and quarterly manual piezometer measurements that exhibit significant latency, sparse observation frequency, and an inability to provide localized, cost-optimized engineering prescriptions.

This repository implements **JalSuraksha**, an enterprise-grade geospatial artificial intelligence and decision-support platform designed to transform groundwater governance from retrospective manual reporting to real-time, prescriptive intelligence. The platform delivers:
- **Pan-India Dynamic Geography:** Seamless dynamic navigation across all **36 States and Union Territories and 700+ administrative districts**, with **Uttar Pradesh** serving as the reference implementation. Selecting any state updates district boundaries, maps, water table observations, rainfall, and predictive analytics.
- **Hydro-Geological Context-Aware Collaborative Filtering (HG-CF):** Solves the cold-start recommendation problem for newly instrumented or data-sparse blocks by embedding physical aquifer attributes (hydraulic conductivity, slope, monsoon rainfall departure, extraction stage) into a graph Laplacian regularization kernel.
- **Hydrological Document Topic Modeling (LDA):** Synthesizes unstructured hydrogeological brochures, ground water reports, and citizen grievance reports into qualitative distress signals.
- **Dual Water Metrics & Integrity Architecture:** Simultaneously displays groundwater depth (m bgl) and multi-parameter water quality (pH, electrical conductivity, TDS, fluoride, arsenic, nitrate) with explicit timestamped provenance labels (`Live`, `Delayed`, `Cached`, `Simulated`, `Unavailable`).
- **India.gov.in-Inspired Interface:** Clean, high-contrast, accessible public data portal aesthetic featuring Navy (`#12345A`), Secondary Blue (`#245B8F`), Saffron (`#E88B2A`), and Green (`#248653`) tokens, with a functional persistent Light/Dark theme toggle and zero emojis.
- **Reproducible Machine Learning Workspace:** 16 self-contained Jupyter notebooks (`00_` to `15_`), serialized production models, unified data pipelines, and a dedicated research Docker container.

---

## Table of Contents

1. [Executive Summary and Platform Overview](#1-executive-summary-and-platform-overview)
2. [Verified Application Screenshots](#2-verified-application-screenshots)
3. [Visual Design and Theme System](#3-visual-design-and-theme-system)
4. [System Architecture and Monorepo Structure](#4-system-architecture-and-monorepo-structure)
5. [Pan-India Dynamic Geography](#5-pan-india-dynamic-geography)
6. [Machine Learning and Research Infrastructure](#6-machine-learning-and-research-infrastructure)
   - 6.1 [16 Jupyter Research Notebooks Catalogue](#61-16-jupyter-research-notebooks-catalogue)
   - 6.2 [Empirical Evaluation Benchmarks](#62-empirical-evaluation-benchmarks)
   - 6.3 [Mathematical Formulations](#63-mathematical-formulations)
7. [Platform Modules and Operational Capabilities](#7-platform-modules-and-operational-capabilities)
   - 7.1 [Dynamic Water Balance Audit](#71-dynamic-water-balance-audit)
   - 7.2 [AI Recharge Suitability & Sizing](#72-ai-recharge-suitability--sizing)
   - 7.3 [Non-Revenue Water (NRW) Leakage Engine](#73-non-revenue-water-nrw-leakage-engine)
   - 7.4 [Borewell Failure Portal](#74-borewell-failure-portal)
   - 7.5 [District Comparison Matrix & Duel Arena](#75-district-comparison-matrix--duel-arena)
   - 7.6 [Historical Continuous Playback (2000–2035)](#76-historical-continuous-playback-20002035)
8. [Data Sources, Provenance and Integrity](#8-data-sources-provenance-and-integrity)
9. [Installation and Local Execution](#9-installation-and-local-execution)
10. [Docker Containerization](#10-docker-containerization)
11. [Testing and Verification](#11-testing-and-verification)
12. [API Reference and Data Contracts](#12-api-reference-and-data-contracts)
13. [Academic References and Citation](#13-academic-references-and-citation)

---

## 1. Executive Summary and Platform Overview

India withdraws approximately 245 billion cubic meters (BCM) of groundwater annually, surpassing the combined withdrawals of the United States and China. Over 17% of administrative assessment units are classified as **Over-Exploited**, with extraction surpassing replenishable recharge.

JalSuraksha bridges the gap between raw hydrological observations and administrative policy interventions:
- **36 States and Union Territories Covered:** Fully dynamic geography allows instant exploration of any state/UT and district across India.
- **Uttar Pradesh Reference Baseline:** Features all 75 districts across 18 administrative divisions with calibrated vector maps, 35-year temporal trajectories (2000–2035), telemetry endpoints, and dual water quality metrics.
- **Prescriptive Decision Suite:** Knapsack capital budget optimization, crop-shift diversification recommendations, rooftop rainwater harvesting (RWH) financial payback calculations, and What-If aquifer stress-testing.
- **Enterprise-Grade Stack:** Next.js 15 App Router frontend with Tailwind CSS tokens; FastAPI asynchronous backend with SQLAlchemy ORM, TimescaleDB telemetry tables, and JSON user authentication fallback.

---

## 2. Verified Application Screenshots

All screenshots below were captured from the running application (`http://localhost:3000`) using automated headless Chromium browser automation.

### Figure 1: Pan-India Dynamic Geography & Groundwater Intelligence Dashboard
![Pan-India Dynamic Geography & Groundwater Intelligence Dashboard](docs/screenshots/dashboard-pan-india.png)
*Figure 1: JalSuraksha desktop interface in dark theme showing Pan-India state switcher, 75-district reference baseline, water stress categorization, continuous timeline controls, and district water dossier.*

### Figure 2: India.gov.in-Inspired Light Theme
![India.gov.in-Inspired Light Theme](docs/screenshots/dashboard-light.png)
*Figure 2: Light theme mode featuring India.gov.in-inspired colors (#12345A Navy, #245B8F Blue, #E88B2A Saffron, #248653 Green on #F5F7FA canvas), accessible typography, and zero emojis.*

### Figure 3: India.gov.in-Inspired Dark Theme
![India.gov.in-Inspired Dark Theme](docs/screenshots/dashboard-dark.png)
*Figure 3: Dark theme mode featuring #111820 background canvas, #1B2632 elevated card surfaces, and color-blind compliant categorical overlays.*

### Figure 4: AI Recharge Suitability Layer & State Navigation
![AI Recharge Suitability Layer & State Navigation](docs/screenshots/groundwater-map.png)
*Figure 4: Dynamic geospatial map displaying artificial recharge suitability ratings across assessment units.*

### Figure 5: Pan-India Open Data Telemetry & Ingestion Sources
![Pan-India Open Data Telemetry & Ingestion Sources](docs/screenshots/data-source-coverage.png)
*Figure 5: Live telemetry and ingestion status modal showing CGWB, IMD, India-WRIS, CWC, and edge IoT monitoring stations.*

### Figure 6: JalRakshak AI Decision-Support Platform
![JalRakshak AI Decision-Support Platform](docs/screenshots/recommendation-engine.png)
*Figure 6: Prescriptive decision suite with 14 specialized tabs including Artificial Recharge Planner, Water Balance Audit, Budget Optimizer, and What-If Simulator.*

### Figure 7: District Hydrological Duel Arena & Comparison Matrix
![District Hydrological Duel Arena & Comparison Matrix](docs/screenshots/groundwater-analytics.png)
*Figure 7: Head-to-head multi-metric comparison between administrative districts evaluating depth to water table, rainfall departure, extraction stage, and quality parameters.*

### Figure 8: Responsive Mobile Viewport
![Responsive Mobile Viewport](docs/screenshots/mobile-dashboard.png)
*Figure 8: Mobile-optimized interface (390×844) with compact drawer navigation, sticky telemetry status, and quick action bar.*

### Original System Visual Assets (Preserved)

The original 16 architectural and analytical visualizations are preserved in `img/`:
- `img/dashboard.png` — *Executive Core Dashboard*
- `img/Atlas.png` — *Spatio-Temporal Interactive Atlas*
- `img/Borewell_Failure_Portal.png` — *Borewell Failure Records and Diagnostics*
- `img/Budget_Optimiser.png` — *Knapsack Capital Budget Allocation*
- `img/District_Hydrological_Duel_Arena.png` — *Comparative District Duel Arena*
- `img/GroundWater_Intelligence.png` — *Groundwater Analytics and Piezometer Telemetry*
- `img/JalRakshakAi.png` — *JalRakshak AI Decision Suite Interface*
- `img/ML_Forcasting.png` — *Multi-Horizon Machine Learning Groundwater Forecaster*
- `img/Matrix.png` — *75-District Hydrological Matrix and CSV Export*
- `img/NRW_Leakage.png` — *Non-Revenue Water Acoustic Leakage Analytics*
- `img/RWH_Calculator.png` — *Rooftop Rainwater Harvesting Engineering Sizing*
- `img/Recharge_Sustainiblity.png` — *Geomorphological Artificial Recharge Suitability*
- `img/Water_Balance.png` — *GEC-2015 Dynamic Aquifer Water Balance Audit*
- `img/Water_Quality.png` — *BIS 10500 Drinking Water Quality Screening*
- `img/WhatIf_Simulator.png` — *Aquifer Stress-Testing and Scenario Simulator*
- `img/Agriculture_Advisory.png` — *Crop Water Footprint and Diversification Advisory*

---

## 3. Visual Design and Theme System

JalSuraksha implements a design system inspired by the public-interest information architecture of India.gov.in.

### Color Tokens

| Token | Light Theme | Dark Theme | Purpose |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#12345A` | `#80B8F0` | Primary brand navy, key headers, focus outlines |
| `--color-secondary` | `#245B8F` | `#9CCBFA` | Interactive controls, secondary actions, badges |
| `--color-accent-saffron` | `#E88B2A` | `#F2A65A` | Highlights, active timeline horizon, warning indicators |
| `--color-accent-green` | `#248653` | `#69C58A` | Safe recharge zones, verified telemetry, success states |
| `--color-background` | `#F5F7FA` | `#111820` | Root application canvas |
| `--color-surface` | `#FFFFFF` | `#1B2632` | Standard card surfaces, modals, dropdowns |
| `--color-surface-elevated`| `#F0F4F8` | `#243342` | Elevated toolbars, headers, hover overlays |
| `--color-text` | `#202B38` | `#F0F4F8` | High-contrast body and title typography |
| `--color-text-muted` | `#586779` | `#B2C0CE` | Secondary labels, captions, measurement units |
| `--color-border` | `#DCE3EA` | `#344353` | Component dividers, table borders, panel outlines |

### Zero Emoji Policy
- Emojis are strictly prohibited throughout the interface, code, and documentation.
- All interface actions utilize minimal, clean SVG icons from `lucide-react` with `currentColor` styling.
- Interactive controls include visible keyboard focus outlines, ARIA attributes, and accessible labels.

### Functional Theme Toggle
- The theme toggle in the navigation bar dynamically alternates between light and dark modes without reloading.
- User preference is automatically saved to `localStorage` under the key `jalsuraksha_theme` and synchronized to `<html data-theme="...">` and `<html class="...">`.
- System preference (`prefers-color-scheme`) is respected on first launch.

---

## 4. System Architecture and Monorepo Structure

```mermaid
graph TD
    A[Public Hydrological Sources<br>CGWB, IMD, India-WRIS, CWC] --> B[Data Ingestion Pipelines<br>ml/pipelines/ingest_data.py]
    B --> C[Feature Engineering & Validation<br>ml/src/feature_engineering.py]
    C --> D[ML Research & Training<br>ml/pipelines/train_models.py]
    D --> E[Serialized Artifacts<br>ml/artifacts/]
    E --> F[FastAPI Backend Services<br>apps/api/app/main.py]
    F --> G[Next.js 15 Presentation Layer<br>apps/web/src/app/page.tsx]
    H[Edge IoT Telemetry<br>ESP32 Ultrasonic Sensors] --> F
    I[User Authentication<br>data/private/users.json] --> F
```

### Directory Organization

```
JalSuraksha/
├── apps/
│   ├── api/                    # FastAPI asynchronous backend application
│   │   ├── app/
│   │   │   ├── api/v1/         # Endpoints: auth, telemetry, analytics, pan_india
│   │   │   ├── core/           # Security, config, json_user_store.py
│   │   │   ├── db/             # Database connection and session management
│   │   │   ├── models/         # SQLAlchemy ORM models (regions, stations, observations)
│   │   │   └── services/       # Business logic (forecasting, recharge, balance)
│   │   └── requirements.txt
│   └── web/                    # Next.js 15 React application
│       ├── src/
│       │   ├── app/            # App router, globals.css (India.gov.in tokens), page.tsx
│       │   ├── components/
│       │   │   ├── atlas/      # Navbar, map, context panel, time slider, modals
│       │   │   └── jalrakshak/ # Decision suite: recharge, balance, leakage, whatif
│       │   └── data/           # india-geography.ts, up-75-districts.ts
│       └── package.json
├── data/
│   ├── raw/                    # Raw telemetry and brochure records
│   ├── processed/              # Aggregated hydrological time-series
│   └── private/                # JSON user store (atomic writes, PBKDF2 hashing)
├── docs/
│   └── screenshots/            # Real verified application screenshots
├── img/                        # Original 16 visual figures (preserved)
├── ml/                         # Machine learning research workspace
│   ├── artifacts/              # Trained models and evaluation_report.json
│   ├── configs/                # experiments.yaml, data_sources.yaml
│   ├── notebooks/              # 16 executable Jupyter research notebooks (00 to 15)
│   ├── pipelines/              # End-to-end ingestion, preprocessing, training, eval
│   ├── src/                    # Reusable research modules
│   ├── tests/                  # Unit tests for ML modules
│   └── README.md
├── scripts/                    # Automation scripts (screenshots, validation)
├── tests/
│   └── unit/                   # 62 backend unit tests
├── Dockerfile                  # Production API container
├── Dockerfile.research         # JupyterLab research container
├── docker-compose.yml          # Multi-service deployment definition
└── README.md                   # Authoritative platform documentation
```

---

## 5. Pan-India Dynamic Geography

JalSuraksha transitions from a single-state prototype to a full Pan-India intelligence platform:
- **36 States and Union Territories:** Complete coverage including Andhra Pradesh, Assam, Bihar, Gujarat, Karnataka, Maharashtra, Punjab, Rajasthan, Tamil Nadu, Uttar Pradesh, West Bengal, and all Union Territories.
- **Hierarchical Dynamic State/District Selection:** Selecting any state dynamically updates:
  1. The district dropdown and search index.
  2. Geographic boundary visualization on the map.
  3. Ground water level observations and depth trends.
  4. IMD rainfall departure figures and monsoon status.
  5. Water stress index and recharge suitability scores.
  6. Dependent analytical panels and decision-support tools.
- **Uttar Pradesh Reference Standard:** All 75 districts of UP feature full vector boundaries, 35-year temporal trajectories (2000–2035), groundwater quality assays, and borewell failure registries.
- **Graceful Fallback:** If live telemetry is unavailable for a remote district, the platform displays an explicit `Simulated` or `Unavailable` provenance badge.

---

## 6. Machine Learning and Research Infrastructure

JalSuraksha includes a research-grade machine learning workspace under `ml/` with end-to-end pipelines, reproducible benchmarks, and 16 documented Jupyter notebooks.

### 6.1 16 Jupyter Research Notebooks Catalogue

All notebooks in `ml/notebooks/` are validated and executable:

| Notebook | Title | Core Purpose | Artifact Generated |
| :--- | :--- | :--- | :--- |
| `00_environment_setup.ipynb` | Environment Setup & Verification | Verifies dependencies, hardware, seeds, and paths | `env_check.json` |
| `01_data_ingestion.ipynb` | Data Ingestion Pipeline | Ingests CGWB, IMD, WRIS, and telemetry records | `ingested_metadata.json` |
| `02_exploratory_data_analysis.ipynb` | Exploratory Data Analysis | Analyzes water table distributions, rainfall trends, and correlation matrices | `eda_summary.json` |
| `03_data_validation_quality.ipynb` | Data Validation & Quality Checks | Schema compliance, null rates, and outlier detection | `validation_report.json` |
| `04_feature_engineering.ipynb` | Feature Engineering & Temporal Lags | Lag features, rolling statistics, monsoon departures | `feature_manifest.json` |
| `05_groundwater_depletion_clustering.ipynb`| Aquifer Depletion Clustering | K-Means & Hierarchical clustering by depletion rate | `cluster_metrics.json` |
| `06_rainfall_groundwater_correlation.ipynb`| Rainfall-Recharge Dynamics | Cross-correlation, lag response times, recharge coefficients | `recharge_dynamics.json` |
| `07_water_quality_analysis.ipynb` | Water Quality Index (WQI) Screening | BIS 10500 compliance, heavy metals, fluoride, arsenic | `water_quality_index.json` |
| `08_forecasting_baselines.ipynb` | Forecasting Baseline Benchmarks | Persistence and linear regression benchmark models | `baseline_metrics.json` |
| `09_tree_based_forecasting.ipynb` | Random Forest & Gradient Boosting | Multi-horizon water table depth forecasting models | `tree_models.json` |
| `10_deep_learning_forecasting.ipynb` | Sequence Modeling Architecture | LSTM/GRU temporal sequence architecture specifications | `deep_learning_spec.json` |
| `11_hg_cf_recommendation_engine.ipynb` | HG-CF Recommender Engine | Graph Laplacian regularized collaborative filtering | `hg_cf_recommender.json` |
| `12_document_topic_modeling.ipynb` | Hydrological Literature Mining | LDA topic modeling on CGWB monographs & grievances | `lda_topic_model.json` |
| `13_model_evaluation_benchmarks.ipynb` | Cross-Validation & Benchmark Suite | Rolling-origin CV and held-out geographic testing | `evaluation_report.json` |
| `14_model_explainability_shap.ipynb` | Model Interpretability & SHAP | Feature importance and partial dependence analysis | `shap_explainability.json` |
| `15_production_model_registry.ipynb` | Production Model Registry | Artifact serialization, versioning, and deployment manifests | `model_registry.json` |

### 6.2 Empirical Evaluation Benchmarks

All metrics below are drawn from reproducible experiments logged in `ml/artifacts/evaluation_report.json`:

#### Multi-Horizon Time-Series Forecasters (Rolling-Origin Cross-Validation)

| Model Architecture | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | Folds Evaluated |
| :--- | :---: | :---: | :---: |
| **Naive Persistence Baseline** | 29.851 m | 30.999 m | 4 |
| **Ridge Regression** | 3.851 m | 4.352 m | 4 |
| **Gradient Boosting Regressor** | **4.015 m** | **4.678 m** | 4 |
| **Random Forest Regressor** | **4.054 m** | **4.575 m** | 4 |

#### Held-Out Geographic Unit Validation
- **Held-Out Test Districts:** Agra, Patna, Meerut
- **Held-Out Test Samples:** 9
- **Held-Out MAE:** 5.169 meters
- **Held-Out RMSE:** 7.365 meters
- **Held-Out $R^2$:** 0.127

#### Hydro-Geological Collaborative Filtering (HG-CF Recommender)
- **Validation Scheme:** Held-Out Geographic Unit Validation
- **Evaluation Samples:** 118 unit-intervention pairs
- **Precision@5:** 0.197
- **NDCG@5:** 0.437
- **Mean Absolute Error:** 0.123

### 6.3 Mathematical Formulations

#### Hydro-Geological Regularized Collaborative Filtering (HG-CF)
Let assessment units be $U = \{u_1, \dots, u_M\}$ and candidate interventions be $I = \{i_1, \dots, i_N\}$. Predicted performance $\hat{r}_{ui}$ is modeled as:

$$\hat{r}_{ui} = \mu + b_u + b_i + \mathbf{p}_u^T \mathbf{q}_i$$

The objective incorporates a graph Laplacian penalty regularized by physical hydro-geological similarity $S_{uv}^H$:

$$\min_{\mathbf{P}, \mathbf{Q}, \mathbf{b}} \frac{1}{2} \sum_{u, i} I_{ui} (r_{ui} - \hat{r}_{ui})^2 + \frac{\lambda_P}{2} \sum_u \|\mathbf{p}_u\|_2^2 + \frac{\lambda_Q}{2} \sum_i \|\mathbf{q}_i\|_2^2 + \frac{\alpha}{2} \sum_{u, v} S_{uv}^H \|\mathbf{p}_u - \mathbf{p}_v\|_2^2$$

where physical attribute vector $\mathbf{x}_u = [k_u, s_u, \Delta R_u, E_u, D_u]^T$ defines the Gaussian RBF kernel:

$$S_{uv}^H = \exp\left(-\frac{\|\mathbf{x}_u - \mathbf{x}_v\|_2^2}{2\sigma_h^2}\right)$$

#### Latent Dirichlet Allocation (LDA) Topic Formulation
Unstructured hydrological literature is parsed across vocabulary $V$ and $K$ latent topics:

$$p(\mathbf{w}, \mathbf{z}, \boldsymbol{\theta}, \boldsymbol{\Phi} \mid \boldsymbol{\alpha}_{\text{dir}}, \boldsymbol{\beta}) = \prod_{k=1}^K p(\boldsymbol{\phi}_k \mid \boldsymbol{\beta}) \prod_{d=1}^W p(\boldsymbol{\theta}_d \mid \boldsymbol{\alpha}_{\text{dir}}) \prod_{n=1}^{N_d} p(z_{dn} \mid \boldsymbol{\theta}_d) p(w_{dn} \mid \boldsymbol{\phi}_{z_{dn}})$$

---

## 7. Platform Modules and Operational Capabilities

| Module | Operational Capability | Implementation Status |
| :--- | :--- | :---: |
| **Dynamic Atlas** | 36 States/UTs, 700+ districts, UP vector boundaries, continuous time playback | **Fully Implemented** |
| **Dual Water Metrics** | Water depth (m bgl) and BIS 10500 quality parameters with timestamps | **Fully Implemented** |
| **ML Forecaster** | Multi-horizon water table forecasting with Random Forest and Gradient Boosting | **Fully Implemented** |
| **HG-CF Recommender** | Graph Laplacian hydro-geological intervention recommendations | **Fully Implemented** |
| **LDA Literature Miner** | Topic extraction from CGWB brochures and citizen grievance reports | **Fully Implemented** |
| **Water Balance Audit** | GEC-2015 annual recharge, extraction, and net deficit calculations | **Fully Implemented** |
| **Recharge Sizing** | Check dams, percolation ponds, injection wells, and recharge shafts sizing | **Fully Implemented** |
| **NRW Leakage Engine** | Acoustic leak detection simulation, non-revenue water financial loss audit | **Fully Implemented** |
| **Budget Optimizer** | Dynamic Knapsack allocation under capital expenditure ceilings | **Fully Implemented** |
| **What-If Simulator** | Interactive slider-driven extraction, precipitation, and recharge stress-testing | **Fully Implemented** |
| **RWH Sizing Engine** | Catchment area yield and payback calculator | **Fully Implemented** |
| **Crop Shift Advisory** | Water-saving crop substitutions (e.g., Mustard vs. Sugarcane) | **Fully Implemented** |
| **Borewell Failure Portal** | Verified failure records, depth profiles, and casing collapse diagnostics | **Fully Implemented** |
| **District Comparison Matrix** | Head-to-head duel arena and 75-district tabular matrix with CSV export | **Fully Implemented** |
| **Authentication System** | Default anonymous access; optional JSON store with PBKDF2-HMAC-SHA256 | **Fully Implemented** |
| **Theme Toggle** | India.gov.in light/dark theme tokens, persistent state, zero emojis | **Fully Implemented** |
| **Physical Sensor Ingestion** | ESP32 hardware bridge via `/api/v1/jalrakshak/iot/telemetry` | **Partially Implemented (Endpoint active, edge simulated)** |
| **MODFLOW Integration** | Distributed numerical 3D finite-difference physics coupling | **Planned** |

---

## 8. Data Sources, Provenance and Integrity

JalSuraksha enforces an unambiguous data integrity policy:
- **No Fabricated Records:** The platform never fabricates piezometer readings, borewell failure rates, or model metrics.
- **Missing Data Distinction:** Missing data is explicitly displayed as `Unavailable` or `—` rather than zero.
- **Data Provenance Badges:**
  - `Live`: Telemetry ingested within the past 24 hours.
  - `Delayed`: Observations from scheduled quarterly monitoring rounds (e.g., pre/post monsoon).
  - `Cached`: Archived historical database records.
  - `Simulated`: What-If scenario projections and algorithmic forecasts.
  - `Unavailable`: Districts or parameters where verified ground data has not yet been collected.

### Primary Data Sources

1. **Central Ground Water Board (CGWB):** Pre-monsoon and post-monsoon water table depths from the National Ground Water Monitoring Network (NGWMN).
2. **India Meteorological Department (IMD):** District gridded rainfall observations and normal departure indices.
3. **India Water Resources Information System (India-WRIS):** River basin telemetry, surface reservoirs, and hydrological discharge figures.
4. **Central Water Commission (CWC):** Gauge-discharge station data across the Ganga and Yamuna basins.
5. **Bureau of Indian Standards (BIS 10500:2012):** Acceptable and permissible drinking water chemical limits.

---

## 9. Installation and Local Execution

### Prerequisites
- Node.js 18+ and npm 9+
- Python 3.10+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/mohdshamii/JalSuraksha.git
cd JalSuraksha
```

### 2. Backend Setup (FastAPI)
```bash
cd apps/api
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API interactive documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup (Next.js)
In a separate terminal:
```bash
cd apps/web
npm install
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 10. Docker Containerization

JalSuraksha provides production and research Docker configurations.

### Standard Production Stack (API + Frontend)
```bash
docker compose up -d --build
```
- Web Application: `http://localhost:3000`
- FastAPI Gateway: `http://localhost:8000`

### ML Research Environment (JupyterLab + ML Workspace)
```bash
docker compose --profile research up -d research
```
- JupyterLab Interface: `http://localhost:8888`
- Access all 16 research notebooks with pre-installed scientific dependencies (`scikit-learn`, `gensim`, `shap`, `pandas`, `numpy`).

---

## 11. Testing and Verification

The test suite validates backend APIs, authentication, Pan-India endpoints, and ML modules:

```bash
# Run all unit tests (69 passing)
python -m pytest tests/unit ml/tests -v

# Run production web build
cd apps/web
npm run build
```

---

## 12. API Reference and Data Contracts

### Core Endpoints

- `GET /health` — Liveness and readiness probe.
- `GET /api/v1/auth/status` — Current authentication state and session status.
- `POST /api/v1/auth/register` — Register a user in the atomic JSON user store.
- `POST /api/v1/auth/login` — Authenticate and receive a session token.
- `GET /api/v1/pan-india/states` — List all 36 States and UTs with district counts.
- `GET /api/v1/pan-india/districts/{state_code}` — Retrieve district geometries and telemetry for a specific state.
- `GET /api/v1/pan-india/water-metrics/{district_id}` — Fetch dual water depth and water quality metrics.
- `GET /api/v1/pan-india/compare?district_a={id}&district_b={id}` — Multi-metric comparison between two districts.
- `GET /api/v1/pan-india/sources` — Open data telemetry sources and ingestion fresh rates.
- `POST /api/v1/jalrakshak/recharge/recommend` — Generate ranked artificial recharge interventions.
- `POST /api/v1/jalrakshak/simulate/whatif` — Simulate aquifer stress under extraction and rainfall shifts.
- `POST /api/v1/jalrakshak/budget/optimize` — Dynamic Knapsack capital budget optimization.

---

## 13. Academic References and Citation

If you utilize JalSuraksha in your academic research, hydrological planning, or software systems, please cite the project:

```bibtex
@article{shami2026jalsuraksha,
  title={JalSuraksha: Collaborative Filtering and Latent Topic Analysis for AI-Driven Groundwater Intelligence and Water Resource Decision Support},
  author={Shami, Mohd},
  journal={Department of Computer Science & Engineering (Data Science + AI), JalSuraksha Research Initiative},
  year={2026},
  url={https://github.com/mohdshamii/JalSuraksha}
}
```

### Key References
1. Central Ground Water Board (CGWB), *Dynamic Ground Water Resources of India - 2023*, Ministry of Jal Shakti, Government of India, New Delhi, 2023.
2. V. M. Tiwari, B. Wahr, and S. Swenson, "Dwindling groundwater resources in northern India, from satellite gravity observations," *Geophysical Research Letters*, vol. 36, no. 18, 2009.
3. M. Rodell, I. Velicogna, and J. S. Famiglietti, "Satellite-based estimates of groundwater depletion in India," *Nature*, vol. 460, no. 7258, pp. 999-1002, 2009.
4. Y. Koren, R. Bell, and C. Volinsky, "Matrix factorization techniques for recommender systems," *Computer*, vol. 42, no. 8, pp. 30-37, Aug. 2009.
5. D. M. Blei, A. Y. Ng, and M. I. Jordan, "Latent Dirichlet Allocation," *Journal of Machine Learning Research*, vol. 3, pp. 993-1022, Jan. 2003.
6. Bureau of Indian Standards (BIS), *Indian Standard Drinking Water - Specification (IS 10500:2012)*, New Delhi, 2012.

---

*JalSuraksha is an independent engineering and research project designed and maintained by **Mohd Shami** (B.Tech Data Science).*
