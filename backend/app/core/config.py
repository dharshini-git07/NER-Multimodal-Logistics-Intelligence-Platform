import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NER RouteGuard AI - Smart Logistics & Accessibility Platform"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings (Dual-mode: uses SQLite by default, or POSTGRESQL_URL if configured)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/ner_logistics.db" if os.getenv("VERCEL") else "sqlite:///./ner_logistics.db")
    
    # Model Artifacts Path
    MODEL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml_engine", "model_store")
    
    # Open-Meteo Weather API Base URL
    OPEN_METEO_BASE_URL: str = "https://api.open-meteo.com/v1/forecast"
    
    # CORS Origins (Allow all for Vercel deployment)
    CORS_ORIGINS: list[str] = ["*"]
    
    class Config:
        case_sensitive = True

settings = Settings()
