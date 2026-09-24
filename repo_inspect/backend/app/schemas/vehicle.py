from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class VehicleSchema(BaseModel):
    id: str
    plate_number: str
    vehicle_type: str
    cargo_type: str
    carrier_org: str
    driver_name: str
    driver_phone: Optional[str] = None
    current_lat: float
    current_lng: float
    speed_kmh: float
    heading_deg: float
    status: str
    assigned_corridor_id: Optional[str] = None
    origin_city: str
    destination_city: str
    eta_minutes: int
    delay_minutes: Optional[int] = 0
    distance_remaining_km: Optional[float] = 0.0
    rerouted: bool
    reroute_reason: Optional[str] = None
    planned_route: Optional[List[List[float]]] = []
    route: Optional[List[List[float]]] = []
    breadcrumb_trail: Optional[List[List[float]]] = []
    current_route_index: int = 0
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class VehicleTelemetryUpdate(BaseModel):
    current_lat: float
    current_lng: float
    speed_kmh: float
    heading_deg: float
    status: Optional[str] = None
    eta_minutes: Optional[int] = None
    rerouted: Optional[bool] = None
    reroute_reason: Optional[str] = None
