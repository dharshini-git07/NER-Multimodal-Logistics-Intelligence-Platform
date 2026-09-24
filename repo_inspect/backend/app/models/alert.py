from sqlalchemy import Column, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)
    corridor_id = Column(String(50), ForeignKey("corridors.id"), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), nullable=False) # INFO, WARNING, DANGER, CRITICAL
    alert_type = Column(String(50), nullable=False) # LANDSLIDE_IMMINENT, ROAD_SEVERED, HEAVY_RAINFALL, REROUTE_ADVISORY
    target_audience = Column(String(50), default="ALL") # ALL, DRIVERS, AUTHORITIES
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    corridor = relationship("Corridor", back_populates="alerts")
