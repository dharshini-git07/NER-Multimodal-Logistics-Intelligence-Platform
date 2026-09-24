from fastapi import APIRouter
from backend.app.api.api_v1.endpoints import (
    prediction,
    corridors,
    routes,
    vehicles,
    incidents,
    alerts,
    weather,
    analytics
)

api_router = APIRouter()

api_router.include_router(prediction.router, prefix="/predict", tags=["AI Disruption Prediction"])
api_router.include_router(corridors.router, prefix="/corridors", tags=["Highways & Road Segments"])
api_router.include_router(corridors.router, prefix="/roads", tags=["Roads"])
api_router.include_router(routes.router, prefix="/routes", tags=["Routing & Rerouting Engine"])
api_router.include_router(vehicles.router, prefix="/vehicles", tags=["GPS Vehicle Fleet Tracking"])
api_router.include_router(incidents.router, prefix="/incidents", tags=["Geo-Tagged Incident Reporting"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Emergency Alerts & Advisories"])
api_router.include_router(weather.router, prefix="/weather", tags=["Live Weather Telemetry"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & KPIs"])
