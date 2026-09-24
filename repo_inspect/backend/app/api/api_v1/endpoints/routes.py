from fastapi import APIRouter, HTTPException
from backend.app.schemas.route import RouteRequest, RouteCalculationResponse
from backend.app.services.routing_engine import routing_engine, NODES_COORDS

router = APIRouter()

@router.post("/calculate", response_model=RouteCalculationResponse)
@router.post("/optimize", response_model=RouteCalculationResponse)
def calculate_optimal_routes(req: RouteRequest):
    """
    Calculate Primary shortest route vs AI Resilient Safe Alternate route
    evaluating slope, road curvature, weather risk, and active disruptions,
    extended with Multimodal Rail, Waterway, and Air alternatives.
    """
    try:
        result = routing_engine.calculate_routes(
            origin=req.origin,
            destination=req.destination,
            allowed_modes=req.allowed_modes,
            cargo_priority=req.cargo_priority or "BALANCED",
            cargo_weight_tons=req.cargo_weight_tons or 20.0,
            cargo_type=req.cargo_type or "Medicine",
            current_stock=req.current_stock,
            daily_consumption=req.daily_consumption
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Routing calculation failed: {str(e)}")

@router.get("/modal-network")
def get_modal_network():
    """
    Returns the multimodal infrastructure network graph (Rail, Waterways, Air Cargo, Intermodal Hubs).
    """
    return {
        "nodes_count": len(NODES_COORDS),
        "status": "OPERATIONAL",
        "supported_modes": ["ROAD", "RAIL", "WATERWAY", "AIR", "TRANSFER"]
    }

