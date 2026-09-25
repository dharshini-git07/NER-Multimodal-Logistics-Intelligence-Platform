from sqlalchemy import Column, String, Float, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(50), primary_key=True, index=True)
    category = Column(String(50), nullable=False) # Landslide, Mudslide, Bridge Washout, Road Subsidence, Waterlogging, Tree Fall
    severity = Column(String(20), nullable=False) # LOW, MEDIUM, SEVERE, CRITICAL_CUTOFF
    corridor_id = Column(String(50), ForeignKey("corridors.id"), nullable=True)
    location_name = Column(String(150), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    photo_url = Column(String(500), nullable=True)
    reported_by = Column(String(100), nullable=False)
    reporter_role = Column(String(50), default="Citizen") # Citizen, Truck Driver, BRO Officer, Traffic Police
    status = Column(String(30), default="VERIFIED") # REPORTED, VERIFIED, IN_CLEARANCE, RESOLVED
    verified_by = Column(String(100), nullable=True)
    clearance_eta_hours = Column(Float, default=0.0)
    upvotes = Column(Integer, default=1)
    reported_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    corridor = relationship("Corridor", back_populates="incidents")
