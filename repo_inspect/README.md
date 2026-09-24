# NER RouteGuard AI — Smart Logistics & Accessibility Intelligence Platform
### Smart India Hackathon 2026 | Problem Statement 26002

> **AI-Based Smart Logistics & Accessibility Intelligence Platform for the North Eastern Region (NER)**  
> Developed for Border Roads Organisation (BRO), Ministry of Development of North Eastern Region (MDoNER), State Disaster Management Authorities (SDMAs), and Freight Transport Unions.

---

## 🏔️ The Problem: North Eastern Region (NER) Vulnerability
The 8 North Eastern states of India (**Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, and Sikkim**) depend on serpentine mountain highways passing through fragile Himalayan geology (Seismic Zone V, fractured shale, steep slopes >45°). 

During the annual monsoon season:
- **Catastrophic Highway Cut-offs**: Corridors like **NH-6** (Sonapur Tunnel, Meghalaya), **NH-29** (Dimapur-Kohima Pagla Pahar, Nagaland), and **NH-10** (Teesta Valley, Sikkim) suffer severe landslides, cloudbursts, and bridge washouts.
- **Stranded Supply Chains**: Trucks carrying essential grains (FCI), liquid medical oxygen, petroleum, and defence cargo are halted for days, triggering severe inflation and shortages in isolated valleys.
- **Lack of Early Warning & Predictive Intelligence**: Dispatchers route trucks into high-risk hazard zones unaware of imminent slope failures.

---

## 🚀 The Solution: NER RouteGuard AI
**NER RouteGuard AI** is a real-time accessibility intelligence platform combining **Ensemble Machine Learning**, **GIS Spatial Routing**, and **Live Telemetry** to predict mountain road disruptions before they occur and automatically divert logistics convoys along safe, resilient alternate bypasses.

---

## 🛠️ Complete Tech Stack
| Tier | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | **React 18 + TypeScript + Tailwind CSS** | High-performance mission control dashboard |
| **GIS Mapping** | **Leaflet + OpenStreetMap + React-Leaflet** | Interactive GIS layers for highways, hazards & radar |
| **Backend API** | **Python FastAPI + Pydantic v2** | Async REST APIs, WebSockets & graph routing |
| **AI / ML Engine**| **Scikit-Learn + RandomForest / XGBoost** | Physics-informed landslide risk & clearance model |
| **Database** | **PostgreSQL + PostGIS** | Spatial geometry (`GEOMETRY(LineString, 4326)`) & SQLite dual-mode |
| **Mobile Prototype**| **Flutter (Dart)** | Field companion for commercial drivers & BRO patrols |
| **Data Providers**| **Open-Meteo & IMD Telemetry** | Live precipitation, soil moisture, and storm forecasts |

---

## 🌟 Core Features

### 1. 🧠 AI Road Disruption Prediction Engine
- Trained on **15,000+ geo-meteorological samples** across all 8 NER states.
- **Inputs**: 24h immediate rainfall, 72h cumulative precipitation, mountain slope angle, soil moisture saturation, culvert drainage quality, vegetation loss, and bedrock geology.
- **Outputs**:
  - **Disruption Probability** (0–100%)
  - **Risk Classification**: `LOW`, `MODERATE`, `HIGH`, `CRITICAL`
  - **Hazard Type**: Landslide, Rockfall, Mudslide, Flash Flood, Road Subsidence
  - **Estimated Clearance Time Window** (hours)
  - **Explainable AI**: Feature importance breakdown of top risk drivers.
- **Trained Model Metrics**:
  - **ROC-AUC Score**: `0.9487`
  - **Classification Accuracy**: `87.17%`
  - **F1-Score**: `0.8760`
  - **Clearance Time MAE**: `4.09 hours`

### 2. 🗺️ Live Road Accessibility GIS Map
- High-contrast GIS map centered on North East India.
- Dynamic color-coded highway lifelines:
  - 🟢 **Green (Open)**: Normal commercial operations.
  - 🟡 **Yellow (Caution)**: Rain slowdowns, reduced speed advised.
  - 🟠 **Orange (High Risk)**: High landslide vulnerability.
  - 🔴 **Red (Severed)**: Highway blocked, traffic halted.
- Layer toggles: Highway Corridors, Live Fleet, Active Hazards, and Weather Precipitation Radar.
- Interactive map click to pin new incident coordinates.

### 3. 🚛 GPS Fleet Tracking & Telemetry
- Real-time simulated and live vehicle tracking over WebSockets (`/ws/telemetry`).
- Live telemetry: GPS latitude/longitude, speed (km/h), heading angle, driver contact, carrier agency, and cargo type.
- **Autonomous Rerouting**: When a sudden landslide strikes, the system automatically redirects vulnerable freight trucks (e.g., FCI Rice Carrier on NH-6) to safe alternate corridors (e.g., NH-27 Lumding-Haflong).

### 4. 🛣️ Resilient Alternate Route Suggestion with Dynamic ETA
- Graph-based routing engine utilizing **Dijkstra / A* with AI Risk Penalization**:
  $$\text{Weight} = \text{Distance} \times (1.0 + 8.5 \times \text{Risk\_Score}^{2.2})$$
- Side-by-side comparison between **Direct Primary Route** vs. **AI-Safe Alternate Bypass**.
- Compares difference in mileage, travel time (accounting for mountain vs. plains speeds), altitude climb, and hazard zones.
- One-click projection of selected route directly onto the GIS map.

### 5. 🌧️ Real-Time Weather Integration
- Asynchronous integration with **Open-Meteo API** across 12 NER hubs (Guwahati, Shillong, Cherrapunji, Silchar, Imphal, Kohima, Aizawl, Agartala, Itanagar, Tawang, Gangtok).
- Real-time rainfall (mm), humidity, wind speed, and soil moisture saturation index.

### 6. ⚠️ Geo-Tagged Incident Reporting & Verification
- Field reporting portal for citizens, truck drivers, and Border Roads Organisation (BRO).
- Captures GPS coordinates, photos, severity (`CRITICAL_CUTOFF`, `SEVERE`, `MEDIUM`, `LOW`), and category.
- Official BRO / Police verification workflow and driver community upvotes.

### 7. 🚨 Alerts & Highway Advisories Center
- High-priority alert ticker and siren broadcast for critical lifelines.
- Dispatch form for state disaster authorities to broadcast notifications to transport unions.

### 8. 📊 Regional Vulnerability & Decision Support Analytics
- **8-State Geological Vulnerability Ranking** (Sikkim, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Assam, Tripura).
- **30-Day Disruption Trendline** vs. Monsoon Precipitation (Recharts).
- **Supply Chain Resilience KPIs**:
  - Freight Safely Rerouted: `91.4%`
  - Transit Delays Averted: `4,250 hours`
  - Fuel Wastage Prevented: `18,400 Litres`
  - Economic Perishable Loss Averted: `₹8.65 Crores`
- One-click export of complete disaster analytics dossier (JSON/CSV).

### 9. 📱 Flutter Mobile Prototype (`mobile/`)
- Mobile interface designed for truck drivers and BRO patrol officers.
- Real-time route safety status, one-touch incident reporting with camera and GPS, and turn-by-turn resilient bypass guidance.

---

## ⚡ Quick Start & Run Commands

### Option A: One-Click PowerShell (Windows)
```powershell
.\run-all.ps1
```
This automatically starts:
- **FastAPI Backend**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **React Frontend**: `http://127.0.0.1:5173`

---

### Option B: Step-by-Step Manual Execution

#### 1. Backend Setup (Python 3.10+)
```powershell
# Navigate to workspace
cd c:\Users\sasik\OneDrive\Documents\sih

# Activate existing virtual environment
.\backend\venv\Scripts\Activate.ps1

# (Optional: Re-train the AI models if needed)
python backend/ml_engine/train_model.py

# Run FastAPI Server
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Setup (Node.js 18+)
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at `http://127.0.0.1:5173`.

---

### Option C: Docker Compose (Full Stack + PostGIS)
```bash
docker-compose up --build
```
This spins up:
- Container `ner_postgis_db`: PostgreSQL 15 + PostGIS with spatial extensions.
- Container `ner_fastapi_backend`: FastAPI backend and ML engine.
- Container `ner_react_frontend`: Production Nginx serving React application.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/predict/disruption` | Run AI inference on road parameters to predict disruption |
| `GET` | `/api/v1/predict/metrics` | Fetch model accuracy, ROC-AUC, and feature importances |
| `GET` | `/api/v1/corridors` | List all monitored NER highway corridors and segments |
| `POST` | `/api/v1/routes/calculate` | Calculate Primary vs AI Resilient Safe Alternate route |
| `GET` | `/api/v1/vehicles` | List real-time freight and relief vehicle GPS telemetry |
| `POST` | `/api/v1/vehicles/{id}/reroute` | Trigger live dynamic rerouting for a vehicle |
| `GET` | `/api/v1/incidents` | List crowdsourced and verified road incidents |
| `POST` | `/api/v1/incidents` | Submit a new geo-tagged incident report |
| `PATCH`| `/api/v1/incidents/{id}/verify` | Verify incident report by BRO / Police |
| `GET` | `/api/v1/alerts` | Get active emergency cut-off advisories |
| `POST` | `/api/v1/alerts` | Broadcast emergency alert |
| `GET` | `/api/v1/weather/all` | Fetch live telemetry for 12 NER transport hubs |
| `GET` | `/api/v1/analytics/summary` | Fetch 8-state vulnerability ranking, KPIs and trends |
| `WS` | `/ws/telemetry` | WebSocket stream for live fleet GPS updates |

---

## 💡 How to Demonstrate During Hackathon Pitch
1. **Interactive GIS Map**: Open the live map to observe color-coded highways (NH-6, NH-29, NH-10, NH-27), active moving freight trucks, and severe landslide pins.
2. **AI Simulator**: Open the **AI Disruption Predictor** tab. Move the **24h Rainfall** slider from 20mm to 180mm. Notice how the AI instantly recalculates disruption probability to >90%, shifts the risk to **CRITICAL**, and forecasts a clearance time of 16 hours.
3. **Safe Alternate Routing**: Open the **Safe Route Optimizer** tab. Select **Guwahati** to **Silchar**. Show how the engine flags the direct NH-6 route as HIGH RISK and recommends the **NH-27 Lumding-Haflong bypass**. Click **Active on GIS Map** to project the route!
4. **Live Hackathon Landslide Demo**: Click the orange **"Simulate NH-6 Slide"** button in the top navigation bar. Watch the platform:
   - Generate a critical cut-off alert.
   - Drop a red landslide marker at the Sonapur Tunnel.
   - Automatically reroute the FCI Grain Truck in real time!

---

## 👥 Contributors & Acknowledgements
- **Smart India Hackathon 2026** — Problem Statement 26002
- Data parameters modeled in accordance with **Geological Survey of India (GSI)** landslide inventory guidelines and **India Meteorological Department (IMD)** rainfall classifications.
