from sqlalchemy import Column, String, Float, Integer, ForeignKey, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String(50), primary_key=True, index=True)
    plate_number = Column(String(30), nullable=False, unique=True)
    vehicle_type = Column(String(50), nullable=False) # Heavy Axle Truck, Petroleum Tanker, FCI Grain Carrier, MedSupply Van, BRO Dozer
    cargo_type = Column(String(100), nullable=False) # e.g. "Liquid Medical Oxygen", "Rice & Wheat Grains", "Diesel Fuel"
    carrier_org = Column(String(100), nullable=False) # e.g. "Food Corporation of India", "Indian Oil Corp", "North East Express Logistics"
    driver_name = Column(String(100), nullable=False)
    driver_phone = Column(String(20))
    current_lat = Column(Float, nullable=False)
    current_lng = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0)
    heading_deg = Column(Float, default=0.0)
    status = Column(String(30), default="IN_TRANSIT") # IN_TRANSIT, DELAYED, REROUTING, EMERGENCY_HALT, DELIVERED
    assigned_corridor_id = Column(String(50), ForeignKey("corridors.id"), nullable=True)
    origin_city = Column(String(100), default="Guwahati")
    destination_city = Column(String(100), nullable=False)
    eta_minutes = Column(Integer, default=180)
    delay_minutes = Column(Integer, default=0)
    distance_remaining_km = Column(Float, default=0.0)
    rerouted = Column(Boolean, default=False)
    reroute_reason = Column(String(200), nullable=True)
    planned_route = Column(JSON, default=list) # Array of [lat, lng]
    breadcrumb_trail = Column(JSON, default=list) # Array of recent [lat, lng]
    current_route_index = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    corridor = relationship("Corridor", back_populates="vehicles")
