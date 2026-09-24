from pydantic import BaseModel
from typing import List, Optional, Any

class SegmentSchema(BaseModel):
    id: str
    corridor_id: str
    segment_order: int
    start_point_name: str
    end_point_name: str
    distance_km: float
    risk_level: str
    risk_score: float
    status: str
    start_lat: float
    start_lng: float
    end_lat: float
    end_lng: float
    altitude_m: float
    slope_deg: float
    rainfall_mm: float = 35.0
    landslide_history: int = 2
    road_condition: str = "Fair"
    color: Optional[str] = "#10B981"
    polyline: List[List[float]]
    alternate_route_polyline: Optional[List[List[float]]] = []

    class Config:
        from_attributes = True

class CorridorSchema(BaseModel):
    id: str
    name: str
    route_name: str
    state: str
    total_length_km: float
    status: str
    disruption_prob: float
    active_incidents_count: int
    slope_angle_deg: float
    elevation_m: float
    drainage_score: float
    weather_condition: str
    rainfall_24h_mm: float
    soil_saturation_pct: float
    geology: str
    coordinates: List[List[float]]
    segments: Optional[List[SegmentSchema]] = []

    class Config:
        from_attributes = True
