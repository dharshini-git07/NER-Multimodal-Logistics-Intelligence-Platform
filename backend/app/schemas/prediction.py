from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class DisruptionPredictionRequest(BaseModel):
    corridor: str = Field(..., example="NH-6")
    state: str = Field(..., example="Meghalaya")
    slope_angle_deg: float = Field(..., ge=0, le=90, example=42.0)
    elevation_m: float = Field(..., ge=0, le=6000, example=1400.0)
    geology: str = Field("Fractured Shale", example="Fractured Shale")
    rainfall_24h_mm: float = Field(..., ge=0, le=1000, example=85.0)
    rainfall_72h_accum_mm: float = Field(..., ge=0, le=2000, example=210.0)
    soil_saturation_pct: float = Field(..., ge=0, le=100, example=82.0)
    road_curvature_index: float = Field(6.5, ge=1, le=10, example=7.0)
    drainage_capacity_score: float = Field(4.0, ge=1, le=10, example=3.5)
    vegetation_loss_index: float = Field(0.45, ge=0, le=1, example=0.55)
    historical_landslides: int = Field(3, ge=0, example=4)
    heavy_truck_intensity: int = Field(1200, ge=0, example=1500)

class DisruptionPredictionResponse(BaseModel):
    disruption_probability: float
    risk_level: str # Safe, Medium, High, Critical (or LOW, MODERATE, HIGH, CRITICAL)
    disruption_predicted: bool
    predicted_hazard_type: str
    estimated_clearance_hours: float
    confidence_score: float
    top_contributing_factors: List[Dict[str, Any]]
    recommendation: str

class RoadRiskPredictionRequest(BaseModel):
    segment_id: Optional[str] = Field(None, example="seg-nh6-3")
    corridor_name: Optional[str] = Field("NH-6", example="NH-6")
    rainfall_mm: float = Field(..., ge=0, le=1000, description="Rainfall intensity in mm", example=115.0)
    landslide_history: int = Field(..., ge=0, le=50, description="Past landslide count in segment", example=4)
    road_condition: str = Field(..., description="Poor, Fair, Good, or Excellent", example="Poor")
    slope_angle_deg: Optional[float] = Field(38.0, ge=0, le=90, example=44.0)
    elevation_m: Optional[float] = Field(1200.0, ge=0, le=6000, example=1450.0)

class AlternateRouteBypass(BaseModel):
    bypass_name: str
    distance_km: float
    eta_minutes: int
    risk_level: str
    color: str = "#10B981"
    advisory: str
    waypoints: List[List[float]]

class RoadRiskPredictionResponse(BaseModel):
    segment_id: Optional[str] = None
    risk_level: str # "Safe", "Medium", "High", "Critical"
    color: str # "#10B981" (Safe), "#EAB308" (Medium), "#EF4444" (High/Critical)
    risk_score: float # 0.0 to 1.0
    disruption_probability: float
    confidence_score: float
    predicted_hazard_type: str
    estimated_clearance_hours: float
    alternate_route_suggested: bool
    alternate_route: Optional[AlternateRouteBypass] = None
    top_contributing_factors: List[Dict[str, Any]]
    recommendation: str

