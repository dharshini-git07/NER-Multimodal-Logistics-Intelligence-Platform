from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class IncidentCreate(BaseModel):
    category: str = Field(..., example="Landslide") # Landslide, Mudslide, Bridge Washout, Road Subsidence, Waterlogging, Tree Fall
    severity: str = Field(..., example="SEVERE") # LOW, MEDIUM, SEVERE, CRITICAL_CUTOFF
    corridor_id: Optional[str] = None
    location_name: str = Field(..., example="Sonapur Tunnel Approach, NH-6")
    latitude: float = Field(..., example=25.1328)
    longitude: float = Field(..., example=92.3582)
    description: Optional[str] = Field(None, example="Debris flow blocking both lanes; clearing equipment deployed.")
    photo_url: Optional[str] = None
    reported_by: str = Field(..., example="BRO Patrol Unit 42")
    reporter_role: str = Field("BRO Officer", example="BRO Officer")

class IncidentUpdate(BaseModel):
    status: Optional[str] = None # REPORTED, VERIFIED, IN_CLEARANCE, RESOLVED
    verified_by: Optional[str] = None
    clearance_eta_hours: Optional[float] = None
    upvotes: Optional[int] = None

class IncidentSchema(BaseModel):
    id: str
    category: str
    severity: str
    corridor_id: Optional[str]
    location_name: str
    latitude: float
    longitude: float
    description: Optional[str]
    photo_url: Optional[str]
    reported_by: str
    reporter_role: str
    status: str
    verified_by: Optional[str]
    clearance_eta_hours: float
    upvotes: int
    reported_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True
