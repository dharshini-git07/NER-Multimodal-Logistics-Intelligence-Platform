import asyncio
import random
import math
import uuid
import datetime
from typing import List, Dict, Any, Set, Optional
from fastapi import WebSocket

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def calculate_remaining_distance(route: List[List[float]], current_idx: int, current_lat: float, current_lng: float) -> float:
    if not route or current_idx >= len(route) - 1:
        return 0.0
    dist = haversine_km(current_lat, current_lng, route[current_idx + 1][0], route[current_idx + 1][1])
    for i in range(current_idx + 1, len(route) - 1):
        dist += haversine_km(route[i][0], route[i][1], route[i + 1][0], route[i + 1][1])
    return round(dist, 1)

class VehicleSimulator:
    def __init__(self):
        self.active_websockets: Set[WebSocket] = set()
        self.recent_alerts: List[Dict[str, Any]] = []

        # 6 Monitored Commercial & Relief Convoys across Northeast India
        self.vehicles: List[Dict[str, Any]] = [
            {
                "id": "veh-101",
                "plate_number": "AS-01-GC-4482",
                "vehicle_type": "FCI Grain Carrier",
                "cargo_type": "24 MT Essential Rice & Wheat",
                "carrier_org": "Food Corporation of India",
                "driver_name": "Ramen Boro",
                "driver_phone": "+91 94351 22819",
                "current_lat": 25.4526,
                "current_lng": 92.2038,
                "speed_kmh": 42.0,
                "heading_deg": 135.0,
                "status": "IN_TRANSIT",
                "assigned_corridor_id": "cor-nh6",
                "origin_city": "Guwahati",
                "destination_city": "Silchar Central Depot",
                "eta_minutes": 145,
                "delay_minutes": 0,
                "distance_remaining_km": 158.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [26.1445, 91.7362], # Guwahati
                    [25.5788, 91.8933], # Shillong
                    [25.4526, 92.2038], # Jowai
                    [25.3524, 92.3644], # Khliehriat
                    [25.1328, 92.3582], # Sonapur Tunnel
                    [24.8333, 92.7789]  # Silchar
                ],
                "breadcrumb_trail": [
                    [26.1445, 91.7362],
                    [25.8600, 91.8200],
                    [25.5788, 91.8933],
                    [25.4526, 92.2038]
                ],
                "route_idx": 2,
                "progress": 0.25
            },
            {
                "id": "veh-102",
                "plate_number": "NL-07-A-8912",
                "vehicle_type": "Petroleum Tanker",
                "cargo_type": "High Octane Fuel / Diesel (20 KL)",
                "carrier_org": "Indian Oil Corporation Ltd",
                "driver_name": "Temsu Ao",
                "driver_phone": "+91 98622 41105",
                "current_lat": 25.8150,
                "current_lng": 93.8420,
                "speed_kmh": 32.0,
                "heading_deg": 140.0,
                "status": "IN_TRANSIT",
                "assigned_corridor_id": "cor-nh29",
                "origin_city": "Dimapur Terminal",
                "destination_city": "Kohima IOCL Depot",
                "eta_minutes": 68,
                "delay_minutes": 0,
                "distance_remaining_km": 42.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [25.9093, 93.7266], # Dimapur
                    [25.8150, 93.8420], # Medziphema
                    [25.7420, 93.9850], # Zubza
                    [25.6751, 94.1086]  # Kohima
                ],
                "breadcrumb_trail": [
                    [25.9093, 93.7266],
                    [25.8600, 93.7800],
                    [25.8150, 93.8420]
                ],
                "route_idx": 1,
                "progress": 0.35
            },
            {
                "id": "veh-103",
                "plate_number": "SK-02-P-3310",
                "vehicle_type": "MedSupply Van",
                "cargo_type": "Cryogenic Oxygen & Emergency Antibiotics",
                "carrier_org": "NER Disaster Relief Cell",
                "driver_name": "Pemba Bhutia",
                "driver_phone": "+91 97330 88214",
                "current_lat": 26.9450,
                "current_lng": 88.5120,
                "speed_kmh": 35.0,
                "heading_deg": 25.0,
                "status": "IN_TRANSIT",
                "assigned_corridor_id": "cor-nh10",
                "origin_city": "Siliguri Medical Store",
                "destination_city": "STNM Hospital Gangtok",
                "eta_minutes": 95,
                "delay_minutes": 0,
                "distance_remaining_km": 68.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [26.7271, 88.3953], # Siliguri
                    [26.8833, 88.4667], # Sevoke
                    [27.0500, 88.4800], # Teesta Bazaar
                    [27.2100, 88.5400], # Singtam
                    [27.3389, 88.6065]  # Gangtok
                ],
                "breadcrumb_trail": [
                    [26.7271, 88.3953],
                    [26.8833, 88.4667],
                    [26.9450, 88.5120]
                ],
                "route_idx": 1,
                "progress": 0.40
            },
            {
                "id": "veh-104",
                "plate_number": "MN-01-T-5509",
                "vehicle_type": "Heavy Axle Truck",
                "cargo_type": "Structural Steel & Bridge Girders",
                "carrier_org": "NHIDCL Project Cargo",
                "driver_name": "Laishram Singh",
                "driver_phone": "+91 96120 77341",
                "current_lat": 25.4200,
                "current_lng": 94.0200,
                "speed_kmh": 38.0,
                "heading_deg": 175.0,
                "status": "IN_TRANSIT",
                "assigned_corridor_id": "cor-nh2",
                "origin_city": "Kohima",
                "destination_city": "Imphal Industrial Estate",
                "eta_minutes": 115,
                "delay_minutes": 0,
                "distance_remaining_km": 92.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [25.6751, 94.1086], # Kohima
                    [25.5100, 94.0500], # Mao
                    [25.2500, 93.9800], # Kangpokpi
                    [24.8170, 93.9368]  # Imphal
                ],
                "breadcrumb_trail": [
                    [25.6751, 94.1086],
                    [25.5100, 94.0500],
                    [25.4200, 94.0200]
                ],
                "route_idx": 1,
                "progress": 0.50
            },
            {
                "id": "veh-105",
                "plate_number": "AR-01-X-1120",
                "vehicle_type": "BRO Heavy Dozer / Excavator",
                "cargo_type": "Emergency Debris Clearance Plant",
                "carrier_org": "Border Roads Organisation (BRO)",
                "driver_name": "Subedar K. Sharma",
                "driver_phone": "+91 94022 19932",
                "current_lat": 27.2000,
                "current_lng": 93.1000,
                "speed_kmh": 24.0,
                "heading_deg": 65.0,
                "status": "DISPATCHED_TO_HAZARD",
                "assigned_corridor_id": "cor-nh13",
                "origin_city": "Tezpur Military Base",
                "destination_city": "Bhalukpong Slide Chasm",
                "eta_minutes": 40,
                "delay_minutes": 0,
                "distance_remaining_km": 28.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [26.6528, 92.7926], # Tezpur
                    [27.0100, 92.9500], # Bhalukpong
                    [27.2644, 92.4200], # Bomdila
                    [27.5861, 91.8656]  # Tawang
                ],
                "breadcrumb_trail": [
                    [26.6528, 92.7926],
                    [27.0100, 92.9500],
                    [27.2000, 93.1000]
                ],
                "route_idx": 1,
                "progress": 0.65
            },
            {
                "id": "veh-106",
                "plate_number": "TR-01-E-9021",
                "vehicle_type": "Perishable Container Truck",
                "cargo_type": "Fresh Dairy & Pharmaceutical Supplies",
                "carrier_org": "Tripura State Cooperative",
                "driver_name": "Biplab Debbarma",
                "driver_phone": "+91 98633 55109",
                "current_lat": 23.9500,
                "current_lng": 91.6800,
                "speed_kmh": 46.0,
                "heading_deg": 40.0,
                "status": "IN_TRANSIT",
                "assigned_corridor_id": "cor-nh8",
                "origin_city": "Agartala",
                "destination_city": "Dharmanagar Sub-depot",
                "eta_minutes": 130,
                "delay_minutes": 0,
                "distance_remaining_km": 140.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [23.8315, 91.2868], # Agartala
                    [23.9500, 91.6800], # Teliamura
                    [24.1800, 91.9800], # Ambassa
                    [24.3800, 92.1600]  # Dharmanagar
                ],
                "breadcrumb_trail": [
                    [23.8315, 91.2868],
                    [23.9500, 91.6800]
                ],
                "route_idx": 1,
                "progress": 0.30
            },
            {
                "id": "veh-107",
                "plate_number": "MZ-01-K-7714",
                "vehicle_type": "Mizoram State PDS Carrier",
                "cargo_type": "Essential Foodgrains & Medical Oxygen",
                "carrier_org": "FCS&CA Department Mizoram",
                "driver_name": "Lalthanmawia",
                "driver_phone": "+91 98623 88120",
                "current_lat": 24.3500,
                "current_lng": 92.7100,
                "speed_kmh": 36.0,
                "heading_deg": 190.0,
                "status": "IN_TRANSIT",
                "assigned_corridor_id": "cor-nh306",
                "origin_city": "Silchar Depot",
                "destination_city": "Aizawl Central Godown",
                "eta_minutes": 165,
                "delay_minutes": 0,
                "distance_remaining_km": 115.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [24.8333, 92.7789], # Silchar
                    [24.5100, 92.7600], # Vairengte
                    [24.2200, 92.6800], # Kolasib
                    [23.9800, 92.7000], # Selesih
                    [23.7271, 92.7176]  # Aizawl
                ],
                "breadcrumb_trail": [
                    [24.8333, 92.7789],
                    [24.5100, 92.7600],
                    [24.3500, 92.7100]
                ],
                "route_idx": 1,
                "progress": 0.45
            },
            {
                "id": "veh-108",
                "plate_number": "AS-03-BC-1920",
                "vehicle_type": "Disaster Relief Ambulance",
                "cargo_type": "Mobile Trauma Hospital Unit & Plasma",
                "carrier_org": "Red Cross Disaster Health Mission",
                "driver_name": "Bipul Saikia",
                "driver_phone": "+91 94350 44912",
                "current_lat": 26.6200,
                "current_lng": 93.3500,
                "speed_kmh": 58.0,
                "heading_deg": 75.0,
                "status": "IN_TRANSIT",
                "assigned_corridor_id": "cor-nh27",
                "origin_city": "Guwahati Medical College",
                "destination_city": "Dibrugarh Emergency Hub",
                "eta_minutes": 195,
                "delay_minutes": 0,
                "distance_remaining_km": 210.0,
                "rerouted": False,
                "reroute_reason": None,
                "route": [
                    [26.1445, 91.7362], # Guwahati
                    [26.3452, 92.6841], # Nagaon
                    [26.5800, 93.1700], # Kaziranga
                    [26.7500, 94.2200], # Jorhat
                    [27.4728, 94.9120]  # Dibrugarh
                ],
                "breadcrumb_trail": [
                    [26.1445, 91.7362],
                    [26.3452, 92.6841],
                    [26.6200, 93.3500]
                ],
                "route_idx": 2,
                "progress": 0.35
            }
        ]

    async def register_socket(self, ws: WebSocket):
        await ws.accept()
        self.active_websockets.add(ws)
        # Send initial fleet telemetry
        await ws.send_json({
            "type": "INIT_FLEET",
            "data": self.vehicles
        })

    def unregister_socket(self, ws: WebSocket):
        self.active_websockets.discard(ws)

    def get_all_vehicles(self) -> List[Dict[str, Any]]:
        return self.vehicles

    def get_vehicle_by_id(self, v_id: str) -> Optional[Dict[str, Any]]:
        for v in self.vehicles:
            if v["id"] == v_id:
                return v
        return None

    def _persist_and_broadcast_alert(self, title: str, message: str, severity: str, alert_type: str, corridor_id: Optional[str] = None, affected_vehicle_id: Optional[str] = None, delay_hours: Optional[float] = None) -> Dict[str, Any]:
        """Creates an alert, commits to SQLite DB, and stages it for WebSocket broadcast."""
        alt_id = f"alt-{uuid.uuid4().hex[:6]}"
        now = datetime.datetime.utcnow()
        alert_dict = {
            "id": alt_id,
            "corridor_id": corridor_id,
            "title": title,
            "message": message,
            "severity": severity,
            "alert_type": alert_type,
            "target_audience": "ALL",
            "is_active": True,
            "created_at": now.isoformat() + "Z"
        }

        # Persist to database if available
        try:
            from backend.app.core.database import SessionLocal
            from backend.app.models.alert import Alert
            db = SessionLocal()
            db_alert = Alert(
                id=alt_id,
                corridor_id=corridor_id,
                title=title,
                message=message,
                severity=severity,
                alert_type=alert_type,
                target_audience="ALL",
                is_active=True,
                created_at=now,
                expires_at=now + datetime.timedelta(hours=24)
            )
            db.add(db_alert)
            db.commit()
            db.close()
        except Exception as e:
            print(f"Alert persistence error: {e}")

        self.recent_alerts.append(alert_dict)
        return alert_dict

    # 1. TRIGGER LANDSLIDE DISRUPTION (Sonapur / Meghalaya / NH-6)
    def trigger_landslide_disruption(self, v_id: str = "veh-106") -> Dict[str, Any]:
        v = self.get_vehicle_by_id(v_id)
        if not v:
            v = self.get_vehicle_by_id("veh-101") or self.vehicles[0]

        v["rerouted"] = True
        v["status"] = "REROUTING"
        v["current_mode"] = "ROAD + RAIL"
        v["shortage_risk"] = "CRITICAL"
        v["delay_minutes"] += 95
        v["reroute_reason"] = "NH-6 Sonapur Tunnel severed by landslide. Road ETA (8 days) exceeds 4-day medical stock runway. Rerouted via NFR Lumding-Badarpur BG rail link (ETA 2.5 days)."
        # Update route to alternate multimodal rail bypass
        v["route"] = [
            [26.1445, 91.7362], # Guwahati
            [26.3452, 92.6841], # Nagaon
            [25.7500, 93.1667], # Lumding Rail
            [25.1764, 93.0234], # Haflong
            [24.8980, 92.5970], # Badarpur
            [24.8170, 93.9368]  # Imphal
        ]
        v["route_idx"] = 0
        v["progress"] = 0.05
        v["distance_remaining_km"] = calculate_remaining_distance(v["route"], 0, v["current_lat"], v["current_lng"])
        v["eta_minutes"] = 150

        # 1. DISRUPTION Alert
        alert_ls = self._persist_and_broadcast_alert(
            title="CRITICAL DISRUPTION: NH-6 Sonapur Tunnel Severed by Landslide",
            message="800 cu.m rockfall severed NH-6 carriageway. Road accessibility dropped to 0%. Emergency multimodal protocol activated.",
            severity="CRITICAL",
            alert_type="DISRUPTION",
            corridor_id="cor-nh6",
            affected_vehicle_id=v["id"]
        )

        # 2. SHORTAGE RISK Alert
        alert_shortage = self._persist_and_broadcast_alert(
            title="SHORTAGE RISK ESCALATION: Imphal Hospital Medicine Runway Breached (< 4 Days)",
            message="Highway cutoff extends road travel time beyond 4-day stock runway. Shortage risk escalated to CRITICAL.",
            severity="CRITICAL",
            alert_type="SHORTAGE_RISK",
            corridor_id="cor-nh2",
            affected_vehicle_id=v["id"]
        )

        # 3. MODE SWITCH Alert
        alert_modeswitch = self._persist_and_broadcast_alert(
            title=f"MODE SWITCH: {v.get('shipment_id', v['plate_number'])} Diverted to NFR Rail Freight Link",
            message="Emergency medicine freight transferred from highway to NFR Lumding-Badarpur broad-gauge rail rake to bypass landslide.",
            severity="WARNING",
            alert_type="MODE_SWITCH",
            corridor_id="cor-nh27",
            affected_vehicle_id=v["id"]
        )

        return {
            "status": "LANDSLIDE_DISRUPTED",
            "vehicle": v,
            "alerts": [alert_ls, alert_shortage, alert_modeswitch]
        }

    # 2. TRIGGER FLOOD DISRUPTION (Kaziranga / Assam / NH-27)
    def trigger_flood_disruption(self, v_id: str = "veh-102") -> Dict[str, Any]:
        v = self.get_vehicle_by_id(v_id)
        if not v:
            return {"error": "Vehicle not found"}

        v["status"] = "CAUTION_SLOW"
        v["speed_kmh"] = 14.5
        v["delay_minutes"] += 60
        v["reroute_reason"] = "FLASH FLOOD: River spillover inundating road with 0.6m water. Speed capped to 15 km/h convoy crawl."
        v["distance_remaining_km"] = calculate_remaining_distance(v["route"], v.get("route_idx", 0), v["current_lat"], v["current_lng"])
        v["eta_minutes"] = int(round((v["distance_remaining_km"] / max(v["speed_kmh"], 15.0)) * 60)) + v["delay_minutes"]

        # 1. FLOOD Alert
        alert_flood = self._persist_and_broadcast_alert(
            title="FLASH FLOOD ALERT: NH-27 Corridor Waterlogged",
            message="River swelling caused highway breach. Water depth exceeding 0.6 meters over 3.2 km stretch. Slow heavy crawl enforced.",
            severity="DANGER",
            alert_type="FLOOD",
            corridor_id="cor-nh27",
            affected_vehicle_id=v["id"]
        )

        # 2. DELIVERY DELAY Alert
        alert_delay = self._persist_and_broadcast_alert(
            title=f"DELIVERY DELAY: Tanker {v['plate_number']} Delayed by {v['delay_minutes']} min",
            message=f"Petroleum Tanker {v['plate_number']} (20 KL High Octane Fuel) delayed by +1.0 hr due to waterlogging crawl speed.",
            severity="WARNING",
            alert_type="DELIVERY_DELAY",
            corridor_id="cor-nh27",
            affected_vehicle_id=v["id"],
            delay_hours=1.0
        )

        return {
            "status": "FLOOD_DISRUPTED",
            "vehicle": v,
            "alerts": [alert_flood, alert_delay]
        }

    # 3. TRIGGER BLOCKED ROAD DISRUPTION (Sikkim / Teesta / NH-10)
    def trigger_blocked_road_disruption(self, v_id: str = "veh-103") -> Dict[str, Any]:
        v = self.get_vehicle_by_id(v_id)
        if not v:
            return {"error": "Vehicle not found"}

        v["status"] = "EMERGENCY_HALT"
        v["speed_kmh"] = 0.0
        v["delay_minutes"] += 180
        v["reroute_reason"] = "ROAD BLOCKED: Embankment collapse at 29th Mile, NH-10. Vehicle halted. Awaiting clearance or Lava-Reshi airlift."
        v["distance_remaining_km"] = calculate_remaining_distance(v["route"], v.get("route_idx", 0), v["current_lat"], v["current_lng"])
        v["eta_minutes"] = int(round((v["distance_remaining_km"] / 15.0) * 60)) + v["delay_minutes"]

        # 1. BLOCKED_ROAD Alert
        alert_block = self._persist_and_broadcast_alert(
            title="ROAD BLOCKED: NH-10 Teesta Valley Pass Impassable",
            message="Complete roadway subsidence. Teesta River erosion has washed away 40 meters of blacktop. Transit fully suspended.",
            severity="CRITICAL",
            alert_type="BLOCKED_ROAD",
            corridor_id="cor-nh10",
            affected_vehicle_id=v["id"]
        )

        # 2. DELIVERY DELAY Alert
        alert_delay = self._persist_and_broadcast_alert(
            title=f"CRITICAL DELIVERY DELAY: Relief Van {v['plate_number']} Stranded (+3.0 hrs)",
            message=f"MedSupply Van {v['plate_number']} carrying Cryogenic Oxygen halted at roadblock. Emergency medical ETA pushed back by 180 min.",
            severity="CRITICAL",
            alert_type="DELIVERY_DELAY",
            corridor_id="cor-nh10",
            affected_vehicle_id=v["id"],
            delay_hours=3.0
        )

        return {
            "status": "ROAD_BLOCKED",
            "vehicle": v,
            "alerts": [alert_block, alert_delay]
        }

    # 4. TRIGGER MANUAL DELIVERY DELAY
    def trigger_delivery_delay(self, v_id: str, delay_mins: int = 45, reason: str = "Heavy mountain pass crawl and checkpost clearance") -> Dict[str, Any]:
        v = self.get_vehicle_by_id(v_id)
        if not v:
            return {"error": "Vehicle not found"}

        v["delay_minutes"] += delay_mins
        v["eta_minutes"] += delay_mins
        if v["status"] == "IN_TRANSIT":
            v["status"] = "CAUTION_SLOW"

        alert_delay = self._persist_and_broadcast_alert(
            title=f"DELIVERY DELAY: {v['plate_number']} Delayed by {delay_mins} min",
            message=f"Vehicle {v['plate_number']} ({v['vehicle_type']}) heading to {v['destination_city']} delayed: {reason}.",
            severity="WARNING",
            alert_type="DELIVERY_DELAY",
            corridor_id=v.get("assigned_corridor_id"),
            affected_vehicle_id=v["id"],
            delay_hours=round(delay_mins / 60.0, 1)
        )

        return {
            "status": "DELAY_APPLIED",
            "vehicle": v,
            "alert": alert_delay
        }

    # Legacy trigger compatibility
    def trigger_emergency_reroute(self, v_id: str = "veh-101") -> Dict[str, Any]:
        return self.trigger_landslide_disruption(v_id).get("vehicle")

    def update_simulation_tick(self):
        """Advances vehicle GPS positions along routes, updates heading, speed, distance remaining, and ETA."""
        for v in self.vehicles:
            if v["status"] == "EMERGENCY_HALT":
                continue # Halted vehicles do not move

            route = v["route"]
            idx = v.get("route_idx", 0)
            if idx < len(route) - 1:
                p1 = route[idx]
                p2 = route[idx + 1]

                # Advance progress along current segment
                step = 0.04 if v["status"] != "CAUTION_SLOW" else 0.015
                v["progress"] = v.get("progress", 0.0) + step
                if v["progress"] >= 1.0:
                    v["progress"] = 0.0
                    v["route_idx"] = min(idx + 1, len(route) - 2)
                    idx = v["route_idx"]
                    p1 = route[idx]
                    p2 = route[idx + 1]

                # Interpolate lat, lng
                prog = v["progress"]
                new_lat = p1[0] + (p2[0] - p1[0]) * prog
                new_lng = p1[1] + (p2[1] - p1[1]) * prog

                # Exact path line coordinates (follows route polyline forward smoothly)
                v["current_lat"] = round(new_lat, 5)
                v["current_lng"] = round(new_lng, 5)

                # Store breadcrumb trail (last 15 GPS points)
                trail = v.get("breadcrumb_trail", [])
                trail.append([v["current_lat"], v["current_lng"]])
                if len(trail) > 15:
                    trail = trail[-15:]
                v["breadcrumb_trail"] = trail

                # Speed variation
                if v["status"] == "CAUTION_SLOW":
                    v["speed_kmh"] = round(16.0 + random.uniform(-2.0, 3.0), 1)
                elif "BRO" in v["vehicle_type"]:
                    v["speed_kmh"] = round(22.0 + random.uniform(-2.0, 4.0), 1)
                else:
                    v["speed_kmh"] = round(38.0 + random.uniform(-4.0, 5.0), 1)

                # Heading calculation
                d_lat = p2[0] - p1[0]
                d_lng = p2[1] - p1[1]
                v["heading_deg"] = round((math.degrees(math.atan2(d_lng, d_lat)) + 360) % 360, 1)

                # Update remaining distance & dynamic ETA
                v["distance_remaining_km"] = calculate_remaining_distance(route, idx, v["current_lat"], v["current_lng"])
                calc_eta = int(round((v["distance_remaining_km"] / max(v["speed_kmh"], 15.0)) * 60)) + v.get("delay_minutes", 0)
                v["eta_minutes"] = max(5, calc_eta)

    async def broadcast_tick(self):
        self.update_simulation_tick()
        if self.active_websockets:
            payload = {
                "type": "FLEET_TELEMETRY_UPDATE",
                "data": self.vehicles
            }
            dead_sockets = set()
            for ws in list(self.active_websockets):
                try:
                    await ws.send_json(payload)
                except Exception:
                    dead_sockets.add(ws)

            # Broadcast any newly generated alerts
            if self.recent_alerts:
                for alert in self.recent_alerts:
                    alert_payload = {
                        "type": "ALERT_DISPATCHED",
                        "data": alert
                    }
                    for ws in list(self.active_websockets):
                        try:
                            await ws.send_json(alert_payload)
                        except Exception:
                            dead_sockets.add(ws)
                self.recent_alerts.clear()

            for ds in dead_sockets:
                self.active_websockets.discard(ds)

vehicle_simulator = VehicleSimulator()
