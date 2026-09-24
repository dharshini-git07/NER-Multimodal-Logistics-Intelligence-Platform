# PROJECT AUDIT: NER-SETU (RouteGuard AI)

## 1. Current Architecture
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS (`src/`)
- **GIS Mapping**: Leaflet + React-Leaflet with custom map overlays, popups, and layer toggles (`src/components/map/LiveMap.tsx`)
- **Backend API**: Python FastAPI (`repo_inspect/backend/app/main.py`) with async REST endpoints (`/api/v1/`) and WebSocket streaming (`/ws/telemetry`)
- **Routing Engine**: Python NetworkX graph algorithm with exponential AI landslide risk weight penalization (`repo_inspect/backend/app/services/routing_engine.py`)
- **Multimodal Engine**: Client-side TypeScript multimodal graph engine covering Road, Broad-Gauge Rail (NFR), Inland Waterways (NW-2 Brahmaputra, NW-16 Barak), and Air Cargo terminals (`src/services/multimodalEngine.ts`)
- **AI Prediction Engine**: Scikit-Learn (RandomForest/XGBoost) classifier & regressor for road disruption risk and clearance time prediction with physics-heuristic fallback (`repo_inspect/backend/app/services/ai_predictor.py`)
- **Database**: Dual-mode SQLite (`repo_inspect/ner_logistics.db`) / PostgreSQL PostGIS via SQLAlchemy models (`repo_inspect/backend/app/models/`) and initial seeder (`repo_inspect/backend/app/db/seed_data.py`)

---

## 2. Important Existing Files
- `src/App.tsx`: Main application shell managing tab navigation, live API polling, WebSocket subscriptions, and simulation modal triggers.
- `src/services/multimodalEngine.ts`: Full multimodal network data (18 road hubs, 8 rail stations, 6 river ports, 7 airports) and multi-objective routing solver (cost, time, carbon, risk, cargo priority).
- `src/services/api.ts`: Frontend HTTP client for FastAPI backend REST endpoints.
- `src/services/websocket.ts`: Real-time WebSocket connection manager for live vehicle tracking and emergency alerts.
- `src/components/map/LiveMap.tsx`: Main GIS Leaflet interactive map component.
- `src/components/routing/RoutePlannerModal.tsx`: Multimodal route planner & side-by-side bypass comparator.
- `src/components/dashboard/DisruptionPredictorCard.tsx`: AI disruption prediction UI with interactive feature sliders and XAI breakdown.
- `repo_inspect/backend/app/main.py`: FastAPI server setup, lifecycle management, CORS middleware, and WebSocket server.
- `repo_inspect/backend/app/services/routing_engine.py`: NetworkX graph routing engine for road network.
- `repo_inspect/backend/app/services/ai_predictor.py`: Machine Learning risk classifier & clearance time estimator.
- `repo_inspect/backend/app/services/vehicle_simulator.py`: Telemetry simulator broadcasting GPS movement over WebSockets and handling autonomous vehicle rerouting.

---

## 3. Existing Working Features
1. **Interactive GIS Accessibility Map**: Color-coded lifelines (NH-6, NH-29, NH-10, NH-27), vehicle markers, active hazard pins, weather radar layer toggles, and click-to-report incident coordinates.
2. **AI Road Disruption Risk Predictor**: Probability score (0-100%), hazard classification (Landslide, Mudslide, Rockfall, Flash Flood, Road Subsidence), clearance time estimate (hours), and explainable feature contributions.
3. **Resilient Safe Alternate Routing**: Side-by-side comparison of Direct Primary Route vs. AI-Safe Alternate Bypass, calculating distance, time, mountain climb, risk penalization, and one-click projection onto GIS map.
4. **Live GPS Fleet Tracking & WebSocket Streaming**: Real-time position updates for 6 commercial/relief convoys (FCI Grain, IOCL Petroleum, LMO Tanker, BRO Machinery, Defense, Food Relief) every 2.5 seconds.
5. **One-Click Disruption & Rerouting Simulator**: Top-bar simulation button ("Simulate NH-6 Slide") that drops a critical landslide marker, dispatches emergency alerts, and automatically reroutes affected vehicles in real time.
6. **Crowdsourced & Verified Incident Portal**: Geo-tagged hazard reporting with photos, community upvoting, and BRO/Police verification workflow.
7. **Emergency Alerts & Advisories Center**: High-priority alert ticker and SDMA dispatch system.
8. **Regional Vulnerability & Decision Support Analytics**: 8-state geological risk ranking, 30-day disruption trends (Recharts), and economic KPI cards.

---

## 4. Multimodal Features Already Implemented
- **4 Transport Modes**: `ROAD`, `RAIL` (Northeast Frontier Railway), `WATERWAY` (NW-2 Brahmaputra & NW-16 Barak rivers), `AIR` (AAI Air Cargo).
- **Cargo Priority Awareness**: Specialized weightings for `ESSENTIAL_FOOD`, `MEDICAL_OXYGEN`, `DEFENSE`, `PETROLEUM_FUEL`, and `GENERAL_CARGO`.
- **Comprehensive Terminal Node Coverage**:
  - 18 Road Hubs across all 8 NER states
  - 8 Major Rail Freight Terminals (Guwahati, Lumding, Badarpur, Dimapur, Agartala, Naharlagun, Bairabi, NJP Siliguri)
  - 6 River Ports (Pandu, Dhubri, Tezpur, Neamati Ghat, Bogibeel, Badarpur)
  - 7 Air Cargo Terminals (Guwahati LGBI, Silchar, Imphal, Agartala, Dimapur, Itanagar, Gangtok)
- **Multi-Modal Route Options**:
  - Road Direct Route
  - Rail-Road Intermodal Route
  - Inland Waterway-Road Multimodal Route
  - Air-Express Hybrid Route
- **Multi-Objective Logistics Metrics**: Monetary cost (INR/ton-km), Carbon emissions (g CO2/ton-km), Risk index, Transshipment transfer times/costs, and local Hub Supply Stock tracking.

---

## 5. Safest Files to Modify Next
- `src/components/routing/RoutePlannerModal.tsx`: Enhancing or tweaking multimodal route selection UI & option cards.
- `src/services/multimodalEngine.ts`: Expanding multimodal constraints, node data, or custom mode weightings.
- `src/components/dashboard/LogisticsDashboardView.tsx`: Adding additional dashboard widgets or refined operational stats.
- `src/components/alerts/AlertCenter.tsx`: Adding enhanced alert filters or union dispatch actions.
- `repo_inspect/backend/app/api/api_v1/endpoints/`: Adding specific REST endpoints if required for extended features.

---

## 6. Features That Must NOT Be Replaced
- **Existing GIS Map Framework**: Leaflet / React-Leaflet setup in `LiveMap.tsx` (Do NOT replace with Google Maps or Mapbox).
- **Existing NetworkX Graph Engine**: `repo_inspect/backend/app/services/routing_engine.py` (Do NOT replace with external routing engines like OSRM or Valhalla).
- **Existing AI ML Models & Feature Schemas**: `ai_predictor.py` and `ml_engine/` trained artifacts.
- **Existing Multimodal Network Schema & Engine**: `src/services/multimodalEngine.ts` network nodes, edges, and modal types.
- **Existing Database Schema & Seeder**: SQLite / PostGIS models in `repo_inspect/backend/app/models/` and `seed_data.py`.
- **Existing WebSocket Telemetry Loop**: `/ws/telemetry` & `vehicle_simulator.py`.
