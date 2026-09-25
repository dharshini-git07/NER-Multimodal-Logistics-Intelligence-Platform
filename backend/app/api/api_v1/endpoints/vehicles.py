from fastapi import APIRouter, HTTPException, Body
from typing import List, Dict, Any, Optional
from backend.app.services.vehicle_simulator import vehicle_simulator

router = APIRouter()

@router.get("", response_model=List[Dict[str, Any]])
def list_live_vehicles():
    """Returns all active freight, tanker, and relief vehicles with real-time GPS telemetry, breadcrumbs, and dynamic ETA."""
    return vehicle_simulator.get_all_vehicles()

@router.get("/{vehicle_id}")
def get_vehicle(vehicle_id: str):
    v = vehicle_simulator.get_vehicle_by_id(vehicle_id)
    if not v:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return v

@router.post("/{vehicle_id}/reroute")
def trigger_vehicle_reroute(vehicle_id: str):
    """Triggers live rerouting event for the vehicle due to sudden landslide."""
    res = vehicle_simulator.trigger_landslide_disruption(vehicle_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.post("/{vehicle_id}/disruption/{disruption_type}")
def trigger_vehicle_disruption(vehicle_id: str, disruption_type: str):
    """
    Triggers simulated disruption on vehicle route:
    - landslide: blocks road, applies reroute, adds +95m delay, dispatches LANDSLIDE & DELIVERY_DELAY alerts.
    - flood: waterlogs highway, caps speed at 14 km/h, adds +60m delay, dispatches FLOOD & DELIVERY_DELAY alerts.
    - blocked-road: embankment failure / rocks, halts truck at 0 km/h, adds +180m delay, dispatches BLOCKED_ROAD & DELIVERY_DELAY alerts.
    """
    dtype = disruption_type.lower().replace("_", "-")
    if dtype == "landslide":
        res = vehicle_simulator.trigger_landslide_disruption(vehicle_id)
    elif dtype == "flood":
        res = vehicle_simulator.trigger_flood_disruption(vehicle_id)
    elif dtype in ["blocked-road", "road-severed", "blockade"]:
        res = vehicle_simulator.trigger_blocked_road_disruption(vehicle_id)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported disruption type: {disruption_type}. Use 'landslide', 'flood', or 'blocked-road'")

    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res

@router.post("/{vehicle_id}/delay")
def trigger_vehicle_delay(
    vehicle_id: str,
    payload: Dict[str, Any] = Body(..., example={"delay_minutes": 45, "reason": "Severe border checkpost crawl"})
):
    """Directly injects transit delay and auto-dispatches a DELIVERY_DELAY alert."""
    delay_mins = int(payload.get("delay_minutes", 45))
    reason = str(payload.get("reason", "Severe mountain pass crawl and security checking"))
    res = vehicle_simulator.trigger_delivery_delay(vehicle_id, delay_mins, reason)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res
