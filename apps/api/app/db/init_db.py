import json
from datetime import datetime, timezone, timedelta
from app.core.database import Base, engine, SessionLocal
from app.core.security import hash_password
from app.models.users import User, AuditLog
from app.models.geo import Region, Station, Reservoir
from app.models.telemetry import Observation, DataSource, IngestionRun, ReservoirObservation
from app.models.intelligence import RiskScore, Alert, AlertRule, IssueReport


def migrate_sqlite_columns(eng):
    """Gracefully ensure newly added columns exist in SQLite database if tables pre-exist."""
    try:
        with eng.connect() as conn:
            # Check regions table
            res = conn.exec_driver_sql("PRAGMA table_info(regions)").fetchall()
            existing_cols = {row[1] for row in res}
            if existing_cols:
                region_new_cols = [
                    ("state_code", "VARCHAR(10)"),
                    ("admin_term", "VARCHAR(50)"),
                    ("hydrogeology_terrain", "VARCHAR(100)"),
                    ("aquifer_type", "VARCHAR(100)"),
                    ("soil_type", "VARCHAR(100)"),
                    ("avg_rainfall_mm", "FLOAT"),
                    ("stage_extraction_pct", "FLOAT"),
                    ("cgwb_category", "VARCHAR(50)"),
                    ("aliases", "TEXT"),
                ]
                for col_name, col_type in region_new_cols:
                    if col_name not in existing_cols:
                        conn.exec_driver_sql(f"ALTER TABLE regions ADD COLUMN {col_name} {col_type}")

            # Check observations table
            obs_res = conn.exec_driver_sql("PRAGMA table_info(observations)").fetchall()
            obs_cols = {row[1] for row in obs_res}
            if obs_cols:
                obs_new_cols = [
                    ("region_id", "VARCHAR(36)"),
                    ("state_code", "VARCHAR(10)"),
                    ("district_id", "VARCHAR(100)"),
                    ("validation_status", "VARCHAR(30) DEFAULT 'validated'"),
                    ("source_dataset", "VARCHAR(100)"),
                    ("source_url", "VARCHAR(255)"),
                    ("license", "VARCHAR(100) DEFAULT 'Open Government Data / Public Domain'"),
                    ("latitude", "FLOAT"),
                    ("longitude", "FLOAT"),
                ]
                for col_name, col_type in obs_new_cols:
                    if col_name not in obs_cols:
                        conn.exec_driver_sql(f"ALTER TABLE observations ADD COLUMN {col_name} {col_type}")
            conn.commit()
    except Exception as e:
        # Tables might not exist yet, which is fine as create_all will create them
        pass


def init_db():
    migrate_sqlite_columns(engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Default Users if none exist
    if db.query(User).count() == 0:
        users_seed = [
            User(
                email="aman.malik@jalsuraksha.gov.in",
                hashed_password=hash_password("AdminSecure123!"),
                full_name="Aman Malik",
                role="Super Admin",
                department="National Water Mission",
                jurisdiction_state="All",
                jurisdiction_district="All",
                phone="+919876543210",
                is_active=True,
                is_verified=True
            ),
            User(
                email="priya.sharma@up.gov.in",
                hashed_password=hash_password("StateAdmin123!"),
                full_name="Dr. Priya Sharma",
                role="State Admin",
                department="State Groundwater Authority",
                jurisdiction_state="Uttar Pradesh",
                jurisdiction_district="All",
                phone="+919876543211",
                is_active=True,
                is_verified=True
            ),
            User(
                email="rajesh.hapur@up.gov.in",
                hashed_password=hash_password("DistrictOfficer123!"),
                full_name="Rajesh Kumar",
                role="District Officer",
                department="District Disaster & Water Office",
                jurisdiction_state="Uttar Pradesh",
                jurisdiction_district="Hapur",
                phone="+919876543212",
                is_active=True,
                is_verified=True
            ),
            User(
                email="sunil.verma@up.gov.in",
                hashed_password=hash_password("FieldOfficer123!"),
                full_name="Sunil Verma",
                role="Field Officer",
                department="Groundwater Field Survey Unit",
                jurisdiction_state="Uttar Pradesh",
                jurisdiction_district="Hapur",
                phone="+919876543213",
                is_active=True,
                is_verified=True
            ),
            User(
                email="ananya.roy@jalsuraksha.gov.in",
                hashed_password=hash_password("Analyst123!"),
                full_name="Ananya Roy",
                role="Analyst",
                department="Hydrogeology & Data Science",
                jurisdiction_state="All",
                jurisdiction_district="All",
                phone="+919876543214",
                is_active=True,
                is_verified=True
            ),
            User(
                email="citizen.ramesh@gmail.com",
                hashed_password=hash_password("Citizen123!"),
                full_name="Ramesh Patel",
                role="Citizen",
                department="Resident / Public",
                jurisdiction_state="Uttar Pradesh",
                jurisdiction_district="Hapur",
                phone="+919876543215",
                is_active=True,
                is_verified=True
            ),
        ]
        db.add_all(users_seed)
        db.commit()
        print("Seeded default users successfully.")

    # 2. Seed Data Sources
    expected_sources = [
        {"code": "open_meteo", "name": "Open-Meteo Weather & Rainfall API", "url": "https://api.open-meteo.com/v1/forecast", "update_frequency": "Hourly", "status": "healthy", "record_count": 1420},
        {"code": "india_wris", "name": "India-WRIS National Water Informatics Centre", "url": "https://indiawris.gov.in/wris", "update_frequency": "Daily", "status": "healthy", "record_count": 3840},
        {"code": "cgwb", "name": "Central Ground Water Board (CGWB)", "url": "http://cgwb.gov.in", "update_frequency": "Weekly", "status": "healthy", "record_count": 5120},
        {"code": "cwc", "name": "Central Water Commission Reservoir Bulletins", "url": "http://cwc.gov.in", "update_frequency": "Weekly", "status": "healthy", "record_count": 150},
        {"code": "cpcb", "name": "CPCB National Water Quality Network", "url": "https://cpcb.nic.in", "update_frequency": "Daily", "status": "healthy", "record_count": 890},
        {"code": "data_gov_in", "name": "Open Government Data Platform India", "url": "https://data.gov.in", "update_frequency": "Weekly", "status": "healthy", "record_count": 2100},
        {"code": "imd", "name": "India Meteorological Department (IMD) Rainfall", "url": "https://mausam.imd.gov.in", "update_frequency": "Daily", "status": "healthy", "record_count": 780},
        {"code": "soilgrids", "name": "ISRIC SoilGrids & Agro-Ecological Profiles", "url": "https://soilgrids.org", "update_frequency": "Monthly", "status": "healthy", "record_count": 650},
        {"code": "icar_agri", "name": "Min of Agriculture & ICAR Crop Water Demand", "url": "https://agricoop.nic.in", "update_frequency": "Seasonal", "status": "healthy", "record_count": 1200},
        {"code": "census_india", "name": "Census of India Water Demand & Demographics", "url": "https://censusindia.gov.in", "update_frequency": "Annual", "status": "healthy", "record_count": 850},
    ]
    for s_info in expected_sources:
        if not db.query(DataSource).filter(DataSource.code == s_info["code"]).first():
            db.add(DataSource(**s_info))
    db.commit()

    # 3. Seed Regions (Original UP prototype districts + Pan-India States and Districts)
    from app.core.geography_registry import INDIAN_STATES_AND_UTS, PAN_INDIA_DISTRICTS

    # Ensure baseline UP districts exist
    baseline_up_districts = [
        {"code": "UP-MRT", "name": "Meerut", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Meerut", "latitude": 28.9845, "longitude": 77.7064, "area_km2": 2522, "population": 3443689, "admin_term": "Tehsil", "aquifer_type": "Indo-Gangetic Alluvium", "soil_type": "Fine Alluvial Silt", "stage_extraction_pct": 94.5, "cgwb_category": "Critical"},
        {"code": "UP-GZB", "name": "Ghaziabad", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Ghaziabad", "latitude": 28.6692, "longitude": 77.4538, "area_km2": 1179, "population": 4681645, "admin_term": "Tehsil", "aquifer_type": "Indo-Gangetic Alluvium", "soil_type": "Deep Sandy Alluvium", "stage_extraction_pct": 126.5, "cgwb_category": "Over-Exploited"},
        {"code": "UP-HPR", "name": "Hapur", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Hapur", "latitude": 28.7306, "longitude": 77.7759, "area_km2": 1124, "population": 1338311, "admin_term": "Tehsil", "aquifer_type": "Indo-Gangetic Alluvium", "soil_type": "Alluvial Silt Loam", "stage_extraction_pct": 142.1, "cgwb_category": "Over-Exploited"},
        {"code": "UP-NOI", "name": "Noida", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Gautam Buddha Nagar", "latitude": 28.5355, "longitude": 77.3910, "area_km2": 680, "population": 1648115, "admin_term": "Tehsil", "aquifer_type": "Indo-Gangetic Alluvium", "soil_type": "Alluvial Sandy Silt", "stage_extraction_pct": 110.0, "cgwb_category": "Over-Exploited"},
        {"code": "UP-GNO", "name": "Greater Noida", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Gautam Buddha Nagar", "latitude": 28.4744, "longitude": 77.5040, "area_km2": 580, "population": 750000, "admin_term": "Tehsil", "aquifer_type": "Indo-Gangetic Alluvium", "soil_type": "Sandy Loam", "stage_extraction_pct": 105.0, "cgwb_category": "Over-Exploited"},
        {"code": "UP-BLS", "name": "Bulandshahr", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Bulandshahr", "latitude": 28.4070, "longitude": 77.8498, "area_km2": 4352, "population": 3499171, "admin_term": "Tehsil", "aquifer_type": "Older Alluvium", "soil_type": "Alluvial Loam", "stage_extraction_pct": 88.0, "cgwb_category": "Semi-Critical"},
        {"code": "UP-MTR", "name": "Mathura", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Mathura", "latitude": 27.4924, "longitude": 77.6737, "area_km2": 3340, "population": 2547184, "admin_term": "Tehsil", "aquifer_type": "Alluvium", "soil_type": "Sandy Alluvial", "stage_extraction_pct": 68.0, "cgwb_category": "Safe"},
        {"code": "UP-ALG", "name": "Aligarh", "type": "District", "state": "Uttar Pradesh", "state_code": "IN-UP", "district": "Aligarh", "latitude": 27.8974, "longitude": 78.0880, "area_km2": 3650, "population": 3673889, "admin_term": "Tehsil", "aquifer_type": "Alluvial Sandstone", "soil_type": "Alluvial Loam", "stage_extraction_pct": 98.2, "cgwb_category": "Critical"},
    ]
    for d_seed in baseline_up_districts:
        if not db.query(Region).filter(Region.code == d_seed["code"]).first():
            db.add(Region(**d_seed))
    db.commit()

    # Seed All 36 States/UTs as Region entities (type="State" or "Union Territory")
    for s_info in INDIAN_STATES_AND_UTS:
        if not db.query(Region).filter(Region.code == s_info["code"]).first():
            db.add(Region(
                code=s_info["code"],
                name=s_info["name"],
                type=s_info["type"],
                state=s_info["name"],
                state_code=s_info["code"],
                latitude=s_info["center_lat"],
                longitude=s_info["center_lon"],
                admin_term=s_info["subdistrict_term"],
                hydrogeology_terrain=s_info["primary_terrain"]
            ))
    db.commit()

    # Seed Pan-India Districts
    for p_dist in PAN_INDIA_DISTRICTS:
        if not db.query(Region).filter(Region.code == p_dist["code"]).first():
            db.add(Region(
                code=p_dist["code"],
                name=p_dist["name"],
                type="District",
                state=p_dist["state_name"],
                state_code=p_dist["state_code"],
                district=p_dist["name"],
                latitude=p_dist["lat"],
                longitude=p_dist["lon"],
                area_km2=p_dist.get("area_km2"),
                population=p_dist.get("population"),
                admin_term=p_dist.get("subdistrict_term", "Tehsil"),
                soil_type=p_dist.get("soil_type"),
                aquifer_type=p_dist.get("aquifer_type"),
                avg_rainfall_mm=p_dist.get("avg_rainfall_mm"),
                stage_extraction_pct=p_dist.get("stage_extraction_pct"),
                cgwb_category=p_dist.get("cgwb_category")
            ))
    db.commit()
    print("Seeded Pan-India states, districts, and data sources successfully.")

    # 4. Seed Stations and Telemetry
    if db.query(Station).count() == 0:
        hapur_reg = db.query(Region).filter(Region.code == "UP-HPR").first()
        gzb_reg = db.query(Region).filter(Region.code == "UP-GZB").first()
        mrt_reg = db.query(Region).filter(Region.code == "UP-MRT").first()
        alg_reg = db.query(Region).filter(Region.code == "UP-ALG").first()
        bls_reg = db.query(Region).filter(Region.code == "UP-BLS").first()
        noi_reg = db.query(Region).filter(Region.code == "UP-NOI").first()
        gno_reg = db.query(Region).filter(Region.code == "UP-GNO").first()
        mtr_reg = db.query(Region).filter(Region.code == "UP-MTR").first()

        stations_seed = [
            Station(code="GW-014", name="Hapur Block A Telemetry Well", type="Piezometer", state="Uttar Pradesh", district="Hapur", block="Hapur", latitude=28.7306, longitude=77.7759, depth_m=32.4, aquifer_type="Alluvial Sandstone", status="online", battery_pct=78, region_id=hapur_reg.id if hapur_reg else None),
            Station(code="FM-102", name="Ghaziabad Pumping Stn 3 Flow", type="Telemetry Flow Meter", state="Uttar Pradesh", district="Ghaziabad", block="City", latitude=28.6692, longitude=77.4538, depth_m=0.0, status="online", battery_pct=91, region_id=gzb_reg.id if gzb_reg else None),
            Station(code="RG-041", name="Meerut Sector 7 Rain Gauge", type="Rain Gauge", state="Uttar Pradesh", district="Meerut", block="Meerut", latitude=28.9845, longitude=77.7064, depth_m=0.0, status="online", battery_pct=64, region_id=mrt_reg.id if mrt_reg else None),
            Station(code="WQ-009", name="Aligarh Ward 12 Quality Probe", type="Water Quality Probe", state="Uttar Pradesh", district="Aligarh", block="Aligarh", latitude=27.8974, longitude=78.0880, depth_m=12.0, status="warning", battery_pct=22, region_id=alg_reg.id if alg_reg else None),
            Station(code="GW-027", name="Bulandshahr Block C Well", type="Piezometer", state="Uttar Pradesh", district="Bulandshahr", block="Bulandshahr", latitude=28.4070, longitude=77.8498, depth_m=20.3, aquifer_type="Older Alluvium", status="online", battery_pct=55, region_id=bls_reg.id if bls_reg else None),
            Station(code="FM-058", name="Noida Sector 62 Urban Drain Meter", type="Telemetry Flow Meter", state="Uttar Pradesh", district="Gautam Buddha Nagar", block="Noida", latitude=28.5355, longitude=77.3910, depth_m=0.0, status="offline", battery_pct=0, region_id=noi_reg.id if noi_reg else None),
            Station(code="RG-019", name="Greater Noida Phase 2 Rain Gauge", type="Rain Gauge", state="Uttar Pradesh", district="Gautam Buddha Nagar", block="Greater Noida", latitude=28.4744, longitude=77.5040, depth_m=0.0, status="online", battery_pct=88, region_id=gno_reg.id if gno_reg else None),
            Station(code="GW-033", name="Mathura Block B Monitoring Well", type="Piezometer", state="Uttar Pradesh", district="Mathura", block="Mathura", latitude=27.4924, longitude=77.6737, depth_m=16.5, aquifer_type="Alluvium", status="online", battery_pct=45, region_id=mtr_reg.id if mtr_reg else None),
        ]
        db.add_all(stations_seed)
        db.commit()
        print("Seeded stations successfully.")

    # 5. Seed Reservoirs
    if db.query(Reservoir).count() == 0:
        reservoirs_seed = [
            Reservoir(code="RES-RAM", name="Ramganga Dam", state="Uttarakhand / UP", district="Pauri Garhwal / Bijnor", river_basin="Ganga Basin", latitude=29.5218, longitude=78.7619, full_reservoir_level_m=365.3, live_capacity_mcm=2192.0, current_storage_mcm=1580.0, fill_pct=72.1, hist_10yr_avg_mcm=1420.0, status="normal"),
            Reservoir(code="RES-MAT", name="Matatila Reservoir", state="Uttar Pradesh", district="Lalitpur", river_basin="Betwa Basin", latitude=25.1017, longitude=78.3789, full_reservoir_level_m=308.4, live_capacity_mcm=1132.0, current_storage_mcm=780.0, fill_pct=68.9, hist_10yr_avg_mcm=710.0, status="normal"),
            Reservoir(code="RES-TEH", name="Tehri Dam", state="Uttarakhand", district="Tehri Garhwal", river_basin="Bhagirathi / Ganga", latitude=30.3783, longitude=78.4800, full_reservoir_level_m=830.0, live_capacity_mcm=2615.0, current_storage_mcm=2100.0, fill_pct=80.3, hist_10yr_avg_mcm=1980.0, status="normal"),
            Reservoir(code="RES-RIH", name="Rihand Dam (Govind Ballabh Pant Sagar)", state="Uttar Pradesh", district="Sonbhadra", river_basin="Son / Ganga", latitude=24.2081, longitude=83.0294, full_reservoir_level_m=268.2, live_capacity_mcm=8968.0, current_storage_mcm=5820.0, fill_pct=64.9, hist_10yr_avg_mcm=5400.0, status="normal"),
        ]
        db.add_all(reservoirs_seed)
        db.commit()
        print("Seeded reservoirs successfully.")

    # 6. Seed Alerts
    if db.query(Alert).count() == 0:
        now = datetime.now(timezone.utc)
        alerts_seed = [
            Alert(severity="critical", title="Critical groundwater decline detected in Hapur", description="Water table dropped by 0.8m this season. Extraction exceeds 142% of annual recharge.", triggered_at=now - timedelta(hours=2), status="open"),
            Alert(severity="warning", title="Possible over-extraction in Bulandshahr", description="Agricultural pumping discharge spiked by 24% over monthly moving baseline.", triggered_at=now - timedelta(hours=5), status="open"),
            Alert(severity="warning", title="Water quality risk (High TDS) in Aligarh", description="Continuous sensor reading TDS 890 mg/L exceeds BIS 10500 standard limit (500 mg/L).", triggered_at=now - timedelta(hours=7), status="open"),
            Alert(severity="info", title="Heavy rainfall expected in next 3 days", description="IMD weather advisory: 45-70mm rainfall forecasted across Western UP districts.", triggered_at=now - timedelta(days=1), status="open"),
            Alert(severity="critical", title="Recharge structure failure reported near Noida sector 62", description="Silt sedimentation blocking percolation shaft inlet after flash storm.", triggered_at=now - timedelta(days=1), status="open"),
            Alert(severity="info", title="New IoT sensor cluster activated in Meerut", description="Piezometer cluster telemetry online reporting at 15-minute intervals.", triggered_at=now - timedelta(days=2), status="resolved", resolved_by="Aman Malik"),
        ]
        db.add_all(alerts_seed)
        db.commit()
        print("Seeded alerts successfully.")

    db.close()


if __name__ == "__main__":
    init_db()
