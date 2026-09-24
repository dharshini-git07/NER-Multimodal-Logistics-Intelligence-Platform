import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.models.alert import Alert
from backend.app.schemas.alert import AlertCreate, AlertSchema

router = APIRouter()

@router.get("", response_model=List[AlertSchema])
def list_active_alerts(category: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetch active early warnings, heavy rain alerts, blocked roads, floods, landslides, and delivery delays."""
    query = db.query(Alert).filter(Alert.is_active == True)
    if category and category.upper() != "ALL":
        cat = category.upper()
        if cat in ["BLOCKED_ROAD", "BLOCKED", "ROAD_SEVERED"]:
            query = query.filter(Alert.alert_type.in_(["BLOCKED_ROAD", "ROAD_SEVERED"]))
        elif cat in ["FLOOD", "FLASH_FLOOD"]:
            query = query.filter(Alert.alert_type.in_(["FLOOD", "FLASH_FLOOD", "HEAVY_RAINFALL"]))
        elif cat in ["LANDSLIDE", "LANDSLIDES"]:
            query = query.filter(Alert.alert_type.in_(["LANDSLIDE", "LANDSLIDE_IMMINENT"]))
        elif cat in ["DELIVERY_DELAY", "DELAY", "DELIVERY_DELAYS"]:
            query = query.filter(Alert.alert_type == "DELIVERY_DELAY")
        else:
            query = query.filter(Alert.alert_type == cat)
    return query.order_by(Alert.created_at.desc()).all()

@router.post("", response_model=AlertSchema)
def broadcast_alert(data: AlertCreate, db: Session = Depends(get_db)):
    """Dispatch emergency advisory to freight carriers and road authorities."""
    alt_id = f"alt-{uuid.uuid4().hex[:6]}"
    alert = Alert(
        id=alt_id,
        corridor_id=data.corridor_id,
        title=data.title,
        message=data.message,
        severity=data.severity,
        alert_type=data.alert_type,
        target_audience=data.target_audience,
        is_active=True,
        created_at=datetime.datetime.utcnow(),
        expires_at=data.expires_at or (datetime.datetime.utcnow() + datetime.timedelta(hours=24))
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

@router.delete("/{alert_id}")
def dismiss_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.is_active = False
    db.commit()
    return {"status": "dismissed", "alert_id": alert_id}
