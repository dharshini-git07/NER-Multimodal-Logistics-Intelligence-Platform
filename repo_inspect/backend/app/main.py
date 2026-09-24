import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import Base, engine
from backend.app.api.api_v1.api import api_router
from backend.app.db.seed_data import seed_database
from backend.app.services.vehicle_simulator import vehicle_simulator

# Background simulation runner
async def simulation_background_loop():
    while True:
        try:
            await vehicle_simulator.broadcast_tick()
        except Exception as e:
            print(f"Simulation loop error: {e}")
        await asyncio.sleep(2.5) # Update fleet position every 2.5 seconds

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed realistic NER corridors
    print("Starting NER RouteGuard AI Platform...")
    Base.metadata.create_all(bind=engine)
    seed_database()
    # Launch continuous simulation task
    sim_task = asyncio.create_task(simulation_background_loop())
    yield
    # Shutdown
    sim_task.cancel()
    print("NER RouteGuard AI Platform shutdown.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="AI-Based Smart Logistics & Accessibility Intelligence Platform for North Eastern Region (NER) - SIH 2026 Problem Statement 26002",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount REST API
app.include_router(api_router, prefix=settings.API_V1_STR)

# WebSocket endpoint for real-time fleet GPS telemetry updates
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    try:
        await vehicle_simulator.register_socket(websocket)
        while True:
            # Keep alive / receive client messages
            msg = await websocket.receive_text()
            if msg == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        vehicle_simulator.unregister_socket(websocket)
    except Exception:
        vehicle_simulator.unregister_socket(websocket)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "region": "North Eastern Region (NER) India",
        "problem_statement": "SIH 2026 - PS 26002",
        "status": "OPERATIONAL",
        "api_docs": "/docs",
        "supported_states": ["Assam", "Meghalaya", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"]
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ner-logistics-backend"}
