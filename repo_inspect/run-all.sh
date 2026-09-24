#!/usr/bin/env bash
echo "=========================================================="
echo " Launching NER RouteGuard AI Platform (SIH 2026 PS 26002)  "
echo "=========================================================="

export PYTHONPATH="$(pwd)"

# Start backend
./backend/venv/bin/uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# Start frontend
cd frontend && npm run dev &
FRONTEND_PID=$!

echo "Backend running on http://127.0.0.1:8000 (PID: $BACKEND_PID)"
echo "Frontend running on http://127.0.0.1:5173 (PID: $FRONTEND_PID)"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM
wait
