from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.app.core.database import get_db
from backend.app.models.corridor import Corridor, Segment
from backend.app.schemas.corridor import CorridorSchema, SegmentSchema

router = APIRouter()

def get_segment_color(risk_level: str) -> str:
    lvl = (risk_level or "").upper()
    if lvl in ["SAFE", "LOW"]:
        return "#10B981" # Green
    elif lvl in ["MEDIUM", "MODERATE", "CAUTION"]:
        return "#EAB308" # Yellow
    elif lvl in ["HIGH"]:
        return "#EF4444" # Red
    elif lvl in ["CRITICAL", "BLOCKED", "SEVERED"]:
        return "#DC2626" # Deep Red
    return "#10B981"

@router.get("/segments", response_model=List[SegmentSchema])
def list_all_segments(db: Session = Depends(get_db)):
    """Returns all road segments across Northeast India with color coding (Green, Yellow, Red) and alternate routes."""
    segments = db.query(Segment).all()
    res = []
    for s in segments:
        s_dict = SegmentSchema.model_validate(s).model_dump()
        s_dict["color"] = get_segment_color(s.risk_level)
        # Normalize risk level to Safe, Medium, High, Critical
        lvl = (s.risk_level or "").upper()
        if lvl in ["LOW", "SAFE"]:
            s_dict["risk_level"] = "Safe"
        elif lvl in ["MODERATE", "MEDIUM"]:
            s_dict["risk_level"] = "Medium"
        elif lvl in ["HIGH"]:
            s_dict["risk_level"] = "High"
        else:
            s_dict["risk_level"] = "Critical"
        res.append(SegmentSchema(**s_dict))
    return res

@router.get("", response_model=List[CorridorSchema])
def list_corridors(db: Session = Depends(get_db)):
    corridors = db.query(Corridor).all()
    # Ensure segment colors are assigned
    for c in corridors:
        for s in c.segments:
            s.color = get_segment_color(s.risk_level)
    return corridors

@router.get("/{corridor_id}", response_model=CorridorSchema)
def get_corridor(corridor_id: str, db: Session = Depends(get_db)):
    corridor = db.query(Corridor).filter(Corridor.id == corridor_id).first()
    if not corridor:
        raise HTTPException(status_code=404, detail="Corridor not found")
    for s in corridor.segments:
        s.color = get_segment_color(s.risk_level)
    return corridor

@router.put("/{corridor_id}/status")
def update_corridor_status(corridor_id: str, status: str, db: Session = Depends(get_db)):
    corridor = db.query(Corridor).filter(Corridor.id == corridor_id).first()
    if not corridor:
        raise HTTPException(status_code=404, detail="Corridor not found")
    corridor.status = status
    db.commit()
    return {"status": "success", "corridor_id": corridor_id, "new_status": status}
