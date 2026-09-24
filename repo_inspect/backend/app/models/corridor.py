from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Corridor(Base):
    __tablename__ = "corridors"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=False) # e.g. "NH-6", "NH-29"
    route_name = Column(String(200), nullable=False) # e.g. "Guwahati - Shillong - Silchar"
    state = Column(String(50), nullable=False) # e.g. "Meghalaya"
    total_length_km = Column(Float, nullable=False)
    status = Column(String(30), default="OPEN") # OPEN, CAUTION, HIGH_RISK, SEVERED
    disruption_prob = Column(Float, default=0.0) # 0.0 - 1.0
    active_incidents_count = Column(Integer, default=0)
    slope_angle_deg = Column(Float, default=25.0)
    elevation_m = Column(Float, default=800.0)
    drainage_score = Column(Float, default=6.0)
    weather_condition = Column(String(50), default="Clear")
    rainfall_24h_mm = Column(Float, default=0.0)
    soil_saturation_pct = Column(Float, default=30.0)
    geology = Column(String(50), default="Fractured Shale")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Coordinates path (GeoJSON format array of [lat, lng])
    coordinates = Column(JSON, default=list)

    # Relationships
    segments = relationship("Segment", back_populates="corridor", cascade="all, delete-orphan")
    vehicles = relationship("Vehicle", back_populates="corridor")
    incidents = relationship("Incident", back_populates="corridor")
    alerts = relationship("Alert", back_populates="corridor")


class Segment(Base):
    __tablename__ = "segments"

    id = Column(String(50), primary_key=True, index=True)
    corridor_id = Column(String(50), ForeignKey("corridors.id"), nullable=False)
    segment_order = Column(Integer, nullable=False)
    start_point_name = Column(String(100), nullable=False)
    end_point_name = Column(String(100), nullable=False)
    distance_km = Column(Float, nullable=False)
    risk_level = Column(String(20), default="LOW") # LOW, MODERATE, HIGH, CRITICAL
    risk_score = Column(Float, default=0.05)
    status = Column(String(20), default="PASSABLE") # PASSABLE, SLOW, BLOCKED
    start_lat = Column(Float, nullable=False)
    start_lng = Column(Float, nullable=False)
    end_lat = Column(Float, nullable=False)
    end_lng = Column(Float, nullable=False)
    altitude_m = Column(Float, default=600.0)
    slope_deg = Column(Float, default=20.0)
    rainfall_mm = Column(Float, default=35.0)
    landslide_history = Column(Integer, default=2)
    road_condition = Column(String(50), default="Fair") # Poor, Fair, Good, Excellent
    polyline = Column(JSON, default=list) # Array of [lat, lng] coordinates
    alternate_route_polyline = Column(JSON, default=list) # Array of [lat, lng] alternate bypass
    created_at = Column(DateTime, default=datetime.utcnow)

    corridor = relationship("Corridor", back_populates="segments")
