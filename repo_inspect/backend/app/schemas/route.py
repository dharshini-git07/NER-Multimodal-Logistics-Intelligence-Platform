from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from enum import Enum

class TransportMode(str, Enum):
    ROAD = "ROAD"
    RAIL = "RAIL"
    AIR = "AIR"
    WATERWAY = "WATERWAY"
    TRANSFER = "TRANSFER"

class CargoPriority(str, Enum):
    BALANCED = "BALANCED"
    SPEED = "SPEED"
    COST = "COST"
    SAFETY = "SAFETY"
    ECO = "ECO"

class RouteRequest(BaseModel):
    origin: str = Field(..., example="Guwahati")
    destination: str = Field(..., example="Silchar")
    vehicle_type: Optional[str] = "Heavy Axle Truck"
    cargo_type: Optional[str] = "Medicine"
    avoid_high_risk: bool = True
    allowed_modes: Optional[List[str]] = None
    cargo_priority: Optional[str] = "BALANCED"
    cargo_weight_tons: Optional[float] = 20.0
    current_stock: Optional[float] = None
    daily_consumption: Optional[float] = None

class TransshipmentPoint(BaseModel):
    hub_id: str
    hub_name: str
    hub_type: str
    coordinates: List[float]
    from_mode: str
    to_mode: str
    transfer_time_minutes: int
    handling_fee_inr: float

class RouteSegmentDetail(BaseModel):
    segment_name: str
    corridor_name: str
    distance_km: float
    risk_level: str
    risk_score: float
    slope_deg: float
    weather: str
    passable: bool
    mode: Optional[str] = "ROAD"
    operator: Optional[str] = "MoRTH / BRO"
    transit_speed_kmh: Optional[float] = 45.0
    estimated_cost_inr: Optional[float] = 0.0
    carbon_kg: Optional[float] = 0.0
    transfer_hub: Optional[str] = None

class ShortageAssessmentSchema(BaseModel):
    days_remaining: float
    eta_days: float
    shortage_risk: str
    is_breached: bool
    explanation: str

class RouteOption(BaseModel):
    route_id: str
    route_name: str
    is_recommended: bool
    total_distance_km: float
    estimated_time_minutes: int
    overall_risk_score: float # 0.0 - 1.0
    risk_category: str # LOW, MODERATE, HIGH, CRITICAL
    disruption_points_count: int
    elevation_gain_m: float
    waypoints: List[List[float]] # [lat, lng] list
    segments: List[RouteSegmentDetail]
    advisories: List[str]
    # Multimodal enhancements
    mode: Optional[str] = "ROAD"
    modes_used: Optional[List[str]] = ["ROAD"]
    transshipment_points: Optional[List[TransshipmentPoint]] = []
    carbon_emissions_kg: Optional[float] = 0.0
    estimated_cost_inr: Optional[float] = 0.0
    cargo_capacity_tons: Optional[float] = 25.0
    priority_match: Optional[str] = "BALANCED"
    capacity_constrained: Optional[bool] = False
    capacity_constraint_reason: Optional[str] = None
    why_this_route: Optional[Any] = None
    shortage_window_fit: Optional[str] = "OPTIMAL"
    shortage_assessment: Optional[ShortageAssessmentSchema] = None

class RouteCalculationResponse(BaseModel):
    origin: str
    destination: str
    primary_route: RouteOption
    safe_alternate_route: Optional[RouteOption] = None
    all_options: List[RouteOption]
    summary: str
    # Multimodal options
    rail_route: Optional[RouteOption] = None
    air_route: Optional[RouteOption] = None
    waterway_route: Optional[RouteOption] = None
    multimodal_route: Optional[RouteOption] = None

