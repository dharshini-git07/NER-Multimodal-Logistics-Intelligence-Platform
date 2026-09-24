import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.incident import Incident
from backend.app.schemas.incident import IncidentCreate, IncidentUpdate, IncidentSchema
from backend.app.services.routing_engine import routing_engine

router = APIRouter()

@router.get("", response_model=List[IncidentSchema])
def list_incidents(
    status: Optional[str] = Query(None, description="Filter by status: REPORTED, VERIFIED, IN_CLEARANCE, RESOLVED"),
    db: Session = Depends(get_db)
):
    query = db.query(Incident)
    if status:
        query = query.filter(Incident.status == status)
    return query.order_by(Incident.reported_at.desc()).all()

@router.post("", response_model=IncidentSchema)
def report_incident(data: IncidentCreate, db: Session = Depends(get_db)):
    """
    Crowdsourced or BRO field report for road disruptions, landslides, or bridge damage.
    """
    inc_id = f"inc-{uuid.uuid4().hex[:6]}"
    
    # Estimate clearance hours based on severity
    clearance_map = {
        "LOW": 2.0,
        "MEDIUM": 6.0,
        "SEVERE": 14.0,
        "CRITICAL_CUTOFF": 36.0
    }
    est_hours = clearance_map.get(data.severity, 8.0)

    # Initial status
    initial_status = "VERIFIED" if "BRO" in data.reporter_role or "Police" in data.reporter_role else "REPORTED"

    incident = Incident(
        id=inc_id,
        category=data.category,
        severity=data.severity,
        corridor_id=data.corridor_id,
        location_name=data.location_name,
        latitude=data.latitude,
        longitude=data.longitude,
        description=data.description,
        photo_url=data.photo_url or "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
        reported_by=data.reported_by,
        reporter_role=data.reporter_role,
        status=initial_status,
        verified_by=data.reported_by if initial_status == "VERIFIED" else None,
        clearance_eta_hours=est_hours,
        upvotes=1,
        reported_at=datetime.datetime.utcnow()
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # If critical cutoff, update routing engine risk
    if data.severity == "CRITICAL_CUTOFF":
        # Check nearest node and apply blockade
        pass

    return incident

@router.patch("/{incident_id}/verify", response_model=IncidentSchema)
def verify_incident(incident_id: str, verified_by: str = Query("BRO Control Room"), db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident.status = "VERIFIED"
    incident.verified_by = verified_by
    db.commit()
    db.refresh(incident)
    return incident

@router.post("/{incident_id}/upvote", response_model=IncidentSchema)
def upvote_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    incident.upvotes += 1
    db.commit()
    db.refresh(incident)
    return incident
