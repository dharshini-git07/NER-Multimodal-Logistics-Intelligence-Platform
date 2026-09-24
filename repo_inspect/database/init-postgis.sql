-- PostgreSQL + PostGIS Schema for NER Smart Logistics Platform
-- Problem Statement 26002 - Smart India Hackathon 2026

CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Highway Corridors Table
CREATE TABLE IF NOT EXISTS corridors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    state VARCHAR(50) NOT NULL,
    total_length_km FLOAT NOT NULL,
    status VARCHAR(30) DEFAULT 'OPEN', -- OPEN, CAUTION, HIGH_RISK, SEVERED
    disruption_prob FLOAT DEFAULT 0.0,
    active_incidents_count INT DEFAULT 0,
    slope_angle_deg FLOAT DEFAULT 25.0,
    elevation_m FLOAT DEFAULT 800.0,
    drainage_score FLOAT DEFAULT 6.0,
    weather_condition VARCHAR(50) DEFAULT 'Clear',
    rainfall_24h_mm FLOAT DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Road Segments Table with Spatial Geometry
CREATE TABLE IF NOT EXISTS segments (
    id VARCHAR(50) PRIMARY KEY,
    corridor_id VARCHAR(50) REFERENCES corridors(id) ON DELETE CASCADE,
    segment_order INT NOT NULL,
    start_point_name VARCHAR(100) NOT NULL,
    end_point_name VARCHAR(100) NOT NULL,
    distance_km FLOAT NOT NULL,
    risk_level VARCHAR(20) DEFAULT 'LOW', -- LOW, MODERATE, HIGH, CRITICAL
    risk_score FLOAT DEFAULT 0.05,
    status VARCHAR(20) DEFAULT 'PASSABLE', -- PASSABLE, SLOW, BLOCKED
    geom GEOMETRY(LineString, 4326),
    altitude_profile JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_segments_geom ON segments USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_segments_corridor ON segments(corridor_id);

-- 3. GPS Tracked Freight & Relief Vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(50) PRIMARY KEY,
    plate_number VARCHAR(30) NOT NULL UNIQUE,
    vehicle_type VARCHAR(40) NOT NULL, -- Heavy Axle Truck, Petroleum Tanker, FCI Grain Carrier, MedSupply Van, BRO Dozer
    cargo_type VARCHAR(100) NOT NULL,
    carrier_org VARCHAR(100) NOT NULL,
    driver_name VARCHAR(100) NOT NULL,
    driver_phone VARCHAR(20),
    current_lat FLOAT NOT NULL,
    current_lng FLOAT NOT NULL,
    speed_kmh FLOAT DEFAULT 0.0,
    heading_deg FLOAT DEFAULT 0.0,
    status VARCHAR(30) DEFAULT 'IN_TRANSIT', -- IN_TRANSIT, DELAYED, REROUTING, EMERGENCY_HALT, DELIVERED
    assigned_corridor_id VARCHAR(50) REFERENCES corridors(id),
    destination_city VARCHAR(100) NOT NULL,
    eta_minutes INT DEFAULT 180,
    rerouted BOOLEAN DEFAULT FALSE,
    geom GEOMETRY(Point, 4326),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_geom ON vehicles USING GIST (geom);

-- 4. Crowdsourced & BRO Geo-Tagged Incidents
CREATE TABLE IF NOT EXISTS incidents (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- Landslide, Mudslide, Bridge Washout, Road Subsidence, Waterlogging, Tree Fall
    severity VARCHAR(20) NOT NULL, -- LOW, MEDIUM, SEVERE, CRITICAL_CUTOFF
    corridor_id VARCHAR(50) REFERENCES corridors(id),
    location_name VARCHAR(150) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    description TEXT,
    photo_url VARCHAR(500),
    reported_by VARCHAR(100) NOT NULL,
    reporter_role VARCHAR(50) DEFAULT 'Citizen', -- Citizen, Truck Driver, BRO Officer, Traffic Police
    status VARCHAR(30) DEFAULT 'VERIFIED', -- REPORTED, VERIFIED, IN_CLEARANCE, RESOLVED
    verified_by VARCHAR(100),
    clearance_eta_hours FLOAT DEFAULT 0.0,
    upvotes INT DEFAULT 1,
    geom GEOMETRY(Point, 4326),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_incidents_geom ON incidents USING GIST (geom);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);

-- 5. Early Warning Alerts & Highway Advisories
CREATE TABLE IF NOT EXISTS alerts (
    id VARCHAR(50) PRIMARY KEY,
    corridor_id VARCHAR(50) REFERENCES corridors(id),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL, -- INFO, WARNING, DANGER, CRITICAL
    alert_type VARCHAR(50) NOT NULL, -- LANDSLIDE_IMMINENT, ROAD_SEVERED, HEAVY_RAINFALL, REROUTE_ADVISORY
    target_audience VARCHAR(50) DEFAULT 'ALL', -- ALL, DRIVERS, AUTHORITIES
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_alerts_active ON alerts(is_active);
