from fastapi import APIRouter
from typing import List, Dict, Any
from backend.app.services.weather_service import weather_service

router = APIRouter()

@router.get("/all", response_model=List[Dict[str, Any]])
async def get_all_ner_weather():
    """Returns real-time weather, precipitation, and soil moisture across 12 NER transport hubs."""
    return await weather_service.get_all_ner_weather()

@router.get("/{location}")
async def get_location_weather(location: str):
    return await weather_service.get_weather_for_location(location)
