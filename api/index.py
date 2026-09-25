import sys
import os

# Ensure project root directory is on Python path so 'backend.app...' imports work
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Default SQLite database to /tmp when running on Vercel read-only filesystem
if os.getenv("VERCEL"):
    os.environ.setdefault("DATABASE_URL", "sqlite:////tmp/ner_logistics.db")

from backend.app.main import app
from backend.app.core.database import Base, engine
from backend.app.db.seed_data import seed_database

# Initialize SQLite database schema and seed initial corridors on cold start
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print(f"[Vercel Python Serverless DB Init Log]: {e}")

# ASGI app handler exported for Vercel serverless runtime
app = app
