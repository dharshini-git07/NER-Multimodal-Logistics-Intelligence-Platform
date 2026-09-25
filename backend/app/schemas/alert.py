from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AlertCreate(BaseModel):
    corridor_id: Optional[str] = None
    title: str = Field(..., example="Emergency NH-6 Lifeline Advisory")
    message: str = Field(..., example="Flash mudslide near Ratacherra. Heavy transport diverted via Badarpur.")
    severity: str = Field("DANGER", example="DANGER") # INFO, WARNING, DANGER, CRITICAL
    alert_type: str = Field("LANDSLIDE_IMMINENT", example="LANDSLIDE_IMMINENT")
    target_audience: str = Field("ALL", example="ALL")
    expires_at: Optional[datetime] = None

class AlertSchema(BaseModel):
    id: str
    corridor_id: Optional[str]
    title: str
    message: str
    severity: str
    alert_type: str
    target_audience: str
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime]

    class Config:
        from_attributes = True
