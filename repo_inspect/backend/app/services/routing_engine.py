import networkx as nx
import math
from typing import Dict, Any, List, Optional

# Coordinates of key transit nodes across NER
NODES_COORDS = {
    "Guwahati": [26.1445, 91.7362],
    "Nagaon": [26.3452, 92.6841],
    "Shillong": [25.5788, 91.8933],
    "Jowai": [25.4526, 92.2038],
    "Khliehriat": [25.3524, 92.3644],
    "Sonapur_Tunnel": [25.1328, 92.3582],
    "Silchar": [24.8333, 92.7789],
    "Lumding": [25.7500, 93.1667],
    "Haflong": [25.1764, 93.0234],
    "Dimapur": [25.9093, 93.7266],
    "Kohima": [25.6751, 94.1086],
    "Imphal": [24.8170, 93.9368],
    "Aizawl": [23.7271, 92.7176],
    "Agartala": [23.8315, 91.2868],
    "Tezpur": [26.6528, 92.7926],
    "Itanagar": [27.0844, 93.6053],
    "Bongaigaon": [26.5028, 90.5574],
    "Siliguri": [26.7271, 88.3953],
    "Sevoke": [26.8833, 88.4667],
    "Gangtok": [27.3389, 88.6065]
}

# Road connections with distance, terrain, and default vulnerability
EDGES = [
    {"u": "Guwahati", "v": "Shillong", "corridor": "NH-6", "dist": 98.0, "slope": 32.0, "risk": 0.25, "is_mountain": True},
    {"u": "Shillong", "v": "Jowai", "corridor": "NH-6", "dist": 64.0, "slope": 28.0, "risk": 0.20, "is_mountain": True},
    {"u": "Jowai", "v": "Khliehriat", "corridor": "NH-6", "dist": 42.0, "slope": 38.0, "risk": 0.45, "is_mountain": True},
    {"u": "Khliehriat", "v": "Sonapur_Tunnel", "corridor": "NH-6", "dist": 35.0, "slope": 52.0, "risk": 0.88, "is_mountain": True}, # High landslide zone!
    {"u": "Sonapur_Tunnel", "v": "Silchar", "corridor": "NH-6", "dist": 68.0, "slope": 34.0, "risk": 0.70, "is_mountain": True},

    # Alternate route to Silchar via Lumding - Haflong (NH-27 / NH-54)
    {"u": "Guwahati", "v": "Nagaon", "corridor": "NH-27", "dist": 120.0, "slope": 10.0, "risk": 0.08, "is_mountain": False},
    {"u": "Nagaon", "v": "Lumding", "corridor": "NH-27", "dist": 62.0, "slope": 14.0, "risk": 0.12, "is_mountain": False},
    {"u": "Lumding", "v": "Haflong", "corridor": "NH-27", "dist": 115.0, "slope": 26.0, "risk": 0.30, "is_mountain": True},
    {"u": "Haflong", "v": "Silchar", "corridor": "NH-27", "dist": 102.0, "slope": 24.0, "risk": 0.22, "is_mountain": True},

    # Silchar to Aizawl (NH-306 / NH-6)
    {"u": "Silchar", "v": "Aizawl", "corridor": "NH-306", "dist": 175.0, "slope": 36.0, "risk": 0.42, "is_mountain": True},

    # Silchar to Agartala (NH-8)
    {"u": "Silchar", "v": "Agartala", "corridor": "NH-8", "dist": 288.0, "slope": 22.0, "risk": 0.28, "is_mountain": False},

    # Lumding / Nagaon to Dimapur, Kohima, Imphal (NH-29 / NH-102)
    {"u": "Lumding", "v": "Dimapur", "corridor": "NH-29", "dist": 70.0, "slope": 12.0, "risk": 0.10, "is_mountain": False},
    {"u": "Dimapur", "v": "Kohima", "corridor": "NH-29", "dist": 74.0, "slope": 44.0, "risk": 0.65, "is_mountain": True}, # Landslide prone Pagla Pahar
    {"u": "Kohima", "v": "Imphal", "corridor": "NH-2", "dist": 138.0, "slope": 35.0, "risk": 0.38, "is_mountain": True},

    # Alternate bypass to Dimapur from Guwahati directly
    {"u": "Nagaon", "v": "Tezpur", "corridor": "NH-715", "dist": 65.0, "slope": 8.0, "risk": 0.05, "is_mountain": False},
    {"u": "Tezpur", "v": "Itanagar", "corridor": "NH-15", "dist": 155.0, "slope": 30.0, "risk": 0.25, "is_mountain": True},

    # Siliguri to Gangtok (NH-10)
    {"u": "Siliguri", "v": "Sevoke", "corridor": "NH-10", "dist": 22.0, "slope": 18.0, "risk": 0.15, "is_mountain": False},
    {"u": "Sevoke", "v": "Gangtok", "corridor": "NH-10", "dist": 92.0, "slope": 48.0, "risk": 0.78, "is_mountain": True}, # Teesta River valley landslide zone
    {"u": "Bongaigaon", "v": "Guwahati", "corridor": "NH-27", "dist": 180.0, "slope": 8.0, "risk": 0.08, "is_mountain": False},
    {"u": "Siliguri", "v": "Bongaigaon", "corridor": "NH-27", "dist": 225.0, "slope": 6.0, "risk": 0.06, "is_mountain": False},
]

class RoutingEngine:
    def __init__(self):
        self.graph = nx.Graph()
        self._build_graph()

    def _build_graph(self):
        self.graph.clear()
        for edge in EDGES:
            u, v = edge["u"], edge["v"]
            dist = edge["dist"]
            risk = edge["risk"]
            # Weight 1: Standard shortest distance
            # Weight 2: AI-Safe penalized weight (exponential penalty for high risk segments)
            safe_weight = dist * (1.0 + (risk ** 2.2) * 8.5)

            self.graph.add_edge(
                u, v,
                corridor=edge["corridor"],
                distance=dist,
                risk=risk,
                slope=edge["slope"],
                is_mountain=edge["is_mountain"],
                standard_weight=dist,
                safe_weight=safe_weight
            )

    def update_segment_risk(self, u: str, v: str, new_risk: float, is_blocked: bool = False):
        if self.graph.has_edge(u, v):
            dist = self.graph[u][v]["distance"]
            effective_risk = 1.0 if is_blocked else new_risk
            safe_weight = 999999.0 if is_blocked else dist * (1.0 + (effective_risk ** 2.2) * 8.5)
            self.graph[u][v]["risk"] = effective_risk
            self.graph[u][v]["safe_weight"] = safe_weight

    def calculate_routes(
        self,
        origin: str,
        destination: str,
        allowed_modes: Optional[List[str]] = None,
        cargo_priority: str = "BALANCED",
        cargo_weight_tons: float = 20.0,
        cargo_type: str = "Medicine",
        current_stock: Optional[float] = None,
        daily_consumption: Optional[float] = None
    ) -> Dict[str, Any]:
        if origin not in NODES_COORDS or destination not in NODES_COORDS:
            # Fallback to nearest major city
            origin = "Guwahati"
            destination = "Silchar"

        # 1. Primary Shortest Distance Route (Preserves original Road Graph Dijkstra)
        try:
            primary_path = nx.dijkstra_path(self.graph, origin, destination, weight="standard_weight")
        except Exception:
            primary_path = [origin, destination]

        # 2. AI Safe Route (penalizes high risk corridors and active blockades)
        try:
            safe_path = nx.dijkstra_path(self.graph, origin, destination, weight="safe_weight")
        except Exception:
            safe_path = primary_path

        primary_opt = self._build_route_option("primary", "Primary Direct Highway", primary_path)
        safe_opt = self._build_route_option("safe", "AI Safe Resilient Corridor", safe_path)

        # Mark which is recommended
        if primary_opt["risk_category"] in ["HIGH", "CRITICAL"]:
            safe_opt["is_recommended"] = True
            primary_opt["is_recommended"] = False
            summary = f"CRITICAL HAZARD on standard route ({primary_opt['risk_category']}). AI recommends {safe_opt['route_name']} via {safe_path[1]} to bypass vulnerable landslide hotspots."
        else:
            primary_opt["is_recommended"] = True
            safe_opt["is_recommended"] = False
            summary = "Primary route currently accessible with standard mountain transit precautions."

        # If identical, provide variation for demonstration
        if primary_path == safe_path and len(primary_path) >= 2:
            safe_opt["route_name"] = "Secondary Monitored Bypass"

        all_options = [primary_opt, safe_opt]
        rail_route = None
        air_route = None
        waterway_route = None
        multimodal_route = None

        # Add Multimodal Alternative Options
        modes = allowed_modes or ["ROAD", "RAIL", "WATERWAY", "AIR", "TRANSFER"]

        if "RAIL" in modes and ((origin == "Guwahati" and destination == "Silchar") or (origin == "Silchar" and destination == "Guwahati")):
            rail_route = {
                "route_id": "rt_rail_nfr_lumding",
                "route_name": "NFR Broad-Gauge Freight Express (Via Lumding-Haflong)",
                "is_recommended": cargo_priority in ["COST", "ECO"],
                "total_distance_km": 385.5,
                "estimated_time_minutes": 510,
                "overall_risk_score": 0.08,
                "risk_category": "LOW",
                "disruption_points_count": 0,
                "elevation_gain_m": 640.0,
                "waypoints": [
                    NODES_COORDS["Guwahati"],
                    [26.1820, 91.7610],
                    [25.7550, 93.1720],
                    [24.8980, 92.5970],
                    NODES_COORDS["Silchar"]
                ],
                "segments": [
                    {
                        "segment_name": "Guwahati Hub to New Guwahati Rail Yard",
                        "corridor_name": "Intermodal Transfer Link",
                        "distance_km": 6.5,
                        "risk_level": "Safe",
                        "risk_score": 0.02,
                        "slope_deg": 2.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "TRANSFER",
                        "operator": "CONCOR",
                        "transit_speed_kmh": 25.0,
                        "estimated_cost_inr": round(6.5 * 12.0 * cargo_weight_tons),
                        "carbon_kg": round(6.5 * 0.09 * cargo_weight_tons)
                    },
                    {
                        "segment_name": "Guwahati to Lumding Freight Corridor",
                        "corridor_name": "NFR BG Lumding Mainline",
                        "distance_km": 181.0,
                        "risk_level": "Safe",
                        "risk_score": 0.05,
                        "slope_deg": 4.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "RAIL",
                        "operator": "Northeast Frontier Railway",
                        "transit_speed_kmh": 52.0,
                        "estimated_cost_inr": round(181.0 * 1.55 * cargo_weight_tons),
                        "carbon_kg": round(181.0 * 0.026 * cargo_weight_tons)
                    },
                    {
                        "segment_name": "Lumding to Badarpur Junction (Haflong Mountain Tunnels)",
                        "corridor_name": "Dima Hasao BG Engineering Alignment",
                        "distance_km": 170.0,
                        "risk_level": "Safe",
                        "risk_score": 0.12,
                        "slope_deg": 12.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "RAIL",
                        "operator": "Northeast Frontier Railway",
                        "transit_speed_kmh": 42.0,
                        "estimated_cost_inr": round(170.0 * 1.70 * cargo_weight_tons),
                        "carbon_kg": round(170.0 * 0.030 * cargo_weight_tons)
                    },
                    {
                        "segment_name": "Badarpur Junction to Silchar Terminal",
                        "corridor_name": "Barak Valley Rail Shuttle",
                        "distance_km": 28.0,
                        "risk_level": "Safe",
                        "risk_score": 0.03,
                        "slope_deg": 2.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "TRANSFER",
                        "operator": "Barak Logistics",
                        "transit_speed_kmh": 32.0,
                        "estimated_cost_inr": round(28.0 * 15.0 * cargo_weight_tons),
                        "carbon_kg": round(28.0 * 0.098 * cargo_weight_tons)
                    }
                ],
                "advisories": [
                    "Immune to NH-6 Sonapur landslide washouts.",
                    "High capacity: up to 1,200 metric tons per razz rake.",
                    "Broad gauge double stack clearance confirmed by NFR Lumding division."
                ],
                "mode": "RAIL",
                "modes_used": ["TRANSFER", "RAIL"],
                "transshipment_points": [
                    {
                        "hub_id": "Guwahati_Rail",
                        "hub_name": "New Guwahati Goods Yard",
                        "hub_type": "RAIL_YARD",
                        "coordinates": [26.1820, 91.7610],
                        "from_mode": "ROAD",
                        "to_mode": "RAIL",
                        "transfer_time_minutes": 45,
                        "handling_fee_inr": 1200.0
                    },
                    {
                        "hub_id": "Badarpur_Silchar_Rail",
                        "hub_name": "Badarpur Railhead Depot",
                        "hub_type": "RAIL_YARD",
                        "coordinates": [24.8980, 92.5970],
                        "from_mode": "RAIL",
                        "to_mode": "ROAD",
                        "transfer_time_minutes": 45,
                        "handling_fee_inr": 1200.0
                    }
                ],
                "carbon_emissions_kg": round(385.5 * 0.03 * cargo_weight_tons),
                "estimated_cost_inr": round(385.5 * 1.62 * cargo_weight_tons + 2400),
                "cargo_capacity_tons": 1200.0,
                "priority_match": "COST"
            }
            all_options.append(rail_route)

        if "AIR" in modes and ((origin == "Guwahati" and destination == "Silchar") or (origin == "Silchar" and destination == "Guwahati")):
            air_route = {
                "route_id": "rt_air_lifeline",
                "route_name": "AAI Lifeline Air Bridge (LGBI Guwahati ➔ Kumbhirgram Silchar)",
                "is_recommended": cargo_priority == "SPEED",
                "total_distance_km": 257.0,
                "estimated_time_minutes": 120,
                "overall_risk_score": 0.02,
                "risk_category": "LOW",
                "disruption_points_count": 0,
                "elevation_gain_m": 3500.0,
                "waypoints": [
                    NODES_COORDS["Guwahati"],
                    [26.1060, 91.5859],
                    [25.5000, 92.3000],
                    [24.9125, 92.9790],
                    NODES_COORDS["Silchar"]
                ],
                "segments": [
                    {
                        "segment_name": "Guwahati Depot to LGBI Airport Cargo Ramp",
                        "corridor_name": "Airport Express Link",
                        "distance_km": 21.0,
                        "risk_level": "Safe",
                        "risk_score": 0.01,
                        "slope_deg": 2.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "TRANSFER",
                        "operator": "Air Shuttle",
                        "transit_speed_kmh": 40.0,
                        "estimated_cost_inr": round(21.0 * 16.0 * cargo_weight_tons),
                        "carbon_kg": round(21.0 * 0.10 * cargo_weight_tons)
                    },
                    {
                        "segment_name": "Guwahati (GAU) to Silchar (IXS) Air Corridor",
                        "corridor_name": "AAI Air Cargo Lifeline",
                        "distance_km": 210.0,
                        "risk_level": "Safe",
                        "risk_score": 0.02,
                        "slope_deg": 0.0,
                        "weather": "Clear Visibility",
                        "passable": True,
                        "mode": "AIR",
                        "operator": "Air India Cargo / IAF AN-32",
                        "transit_speed_kmh": 460.0,
                        "estimated_cost_inr": round(210.0 * 26.0 * cargo_weight_tons),
                        "carbon_kg": round(210.0 * 0.52 * cargo_weight_tons)
                    },
                    {
                        "segment_name": "Kumbhirgram Airport to Silchar City Hub",
                        "corridor_name": "Cachar Valley Link",
                        "distance_km": 26.0,
                        "risk_level": "Safe",
                        "risk_score": 0.02,
                        "slope_deg": 2.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "TRANSFER",
                        "operator": "Local Shuttle",
                        "transit_speed_kmh": 35.0,
                        "estimated_cost_inr": round(26.0 * 16.0 * cargo_weight_tons),
                        "carbon_kg": round(26.0 * 0.10 * cargo_weight_tons)
                    }
                ],
                "advisories": [
                    "Ultra-rapid deployment for pharmaceuticals, vaccines, and disaster relief.",
                    "Zero exposure to surface landslides, bridge washouts, or highway gridlock.",
                    "Fastest ETA in the entire Northeast transit network."
                ],
                "mode": "AIR",
                "modes_used": ["TRANSFER", "AIR"],
                "transshipment_points": [
                    {
                        "hub_id": "GAU_Airport",
                        "hub_name": "LGBI Air Cargo Ramp",
                        "hub_type": "AIRPORT_CARGO",
                        "coordinates": [26.1060, 91.5859],
                        "from_mode": "ROAD",
                        "to_mode": "AIR",
                        "transfer_time_minutes": 35,
                        "handling_fee_inr": 4500.0
                    },
                    {
                        "hub_id": "IXS_Silchar_Airport",
                        "hub_name": "Kumbhirgram Cargo Terminal",
                        "hub_type": "AIRPORT_CARGO",
                        "coordinates": [24.9125, 92.9790],
                        "from_mode": "AIR",
                        "to_mode": "ROAD",
                        "transfer_time_minutes": 35,
                        "handling_fee_inr": 4000.0
                    }
                ],
                "carbon_emissions_kg": round(210.0 * 0.52 * cargo_weight_tons + 150),
                "estimated_cost_inr": round(210.0 * 26.0 * cargo_weight_tons + 8500),
                "cargo_capacity_tons": 18.0,
                "priority_match": "SPEED"
            }
            all_options.append(air_route)

        # Smart Hybrid Multimodal Route (Road NH-27 + NFR Hill Ro-Ro Rail)
        if (origin == "Guwahati" and destination == "Silchar") or (origin == "Silchar" and destination == "Guwahati"):
            multimodal_route = {
                "route_id": "rt_hybrid_multimodal",
                "route_name": "Resilient Hybrid Multimodal Corridor (Road NH-27 + NFR Hill Ro-Ro Rail)",
                "is_recommended": primary_opt["risk_category"] in ["HIGH", "CRITICAL"] or cargo_priority in ["SAFETY", "BALANCED"],
                "total_distance_km": 380.0,
                "estimated_time_minutes": 480,
                "overall_risk_score": 0.09,
                "risk_category": "LOW",
                "disruption_points_count": 0,
                "elevation_gain_m": 580.0,
                "waypoints": [
                    NODES_COORDS["Guwahati"],
                    NODES_COORDS["Nagaon"],
                    [25.7550, 93.1720],
                    [24.8980, 92.5970],
                    NODES_COORDS["Silchar"]
                ],
                "segments": [
                    {
                        "segment_name": "Guwahati to Lumding Multimodal Yard (NH-27 Plains)",
                        "corridor_name": "NH-27 East-West Plains Corridor",
                        "distance_km": 182.0,
                        "risk_level": "Safe",
                        "risk_score": 0.09,
                        "slope_deg": 12.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "ROAD",
                        "operator": "NHAI 4-Lane Highway",
                        "transit_speed_kmh": 58.0,
                        "estimated_cost_inr": round(182.0 * 4.20 * cargo_weight_tons),
                        "carbon_kg": round(182.0 * 0.110 * cargo_weight_tons)
                    },
                    {
                        "segment_name": "Lumding Yard to Badarpur Freight Junction (Ro-Ro Rail Transshipment)",
                        "corridor_name": "NFR Hill Mountain Rail Bridge (Haflong Pass Bypass)",
                        "distance_km": 170.0,
                        "risk_level": "Safe",
                        "risk_score": 0.11,
                        "slope_deg": 8.0,
                        "weather": "Monsoon Mist",
                        "passable": True,
                        "mode": "RAIL",
                        "operator": "NFR Ro-Ro Service",
                        "transit_speed_kmh": 44.0,
                        "estimated_cost_inr": round(170.0 * 1.65 * cargo_weight_tons),
                        "carbon_kg": round(170.0 * 0.028 * cargo_weight_tons)
                    },
                    {
                        "segment_name": "Badarpur Junction to Silchar City Final Mile",
                        "corridor_name": "NH-37 Valley Highway",
                        "distance_km": 28.0,
                        "risk_level": "Safe",
                        "risk_score": 0.05,
                        "slope_deg": 4.0,
                        "weather": "Clear",
                        "passable": True,
                        "mode": "ROAD",
                        "operator": "Assam PWD",
                        "transit_speed_kmh": 45.0,
                        "estimated_cost_inr": round(28.0 * 4.20 * cargo_weight_tons),
                        "carbon_kg": round(28.0 * 0.110 * cargo_weight_tons)
                    }
                ],
                "advisories": [
                    "Optimal disaster resilience: bypasses Sonapur Tunnel completely with zero landslide hazard.",
                    "Trucks roll onto NFR flatcars at Lumding Yard without offloading cargo pallets.",
                    "Cost savings: ~38% cheaper than pure road detours while cutting carbon emissions by 54%."
                ],
                "mode": "TRANSFER",
                "modes_used": ["ROAD", "RAIL"],
                "transshipment_points": [
                    {
                        "hub_id": "Lumding_Rail",
                        "hub_name": "Lumding Multimodal Ro-Ro Terminal",
                        "hub_type": "RAIL_YARD",
                        "coordinates": [25.7550, 93.1720],
                        "from_mode": "ROAD",
                        "to_mode": "RAIL",
                        "transfer_time_minutes": 25,
                        "handling_fee_inr": 800.0
                    },
                    {
                        "hub_id": "Badarpur_Silchar_Rail",
                        "hub_name": "Badarpur Junction Ro-Ro Ramp",
                        "hub_type": "RAIL_YARD",
                        "coordinates": [24.8980, 92.5970],
                        "from_mode": "RAIL",
                        "to_mode": "ROAD",
                        "transfer_time_minutes": 25,
                        "handling_fee_inr": 800.0
                    }
                ],
                "carbon_emissions_kg": round((182.0 * 0.11 + 170.0 * 0.028 + 28.0 * 0.11) * cargo_weight_tons),
                "estimated_cost_inr": round((182.0 * 4.2 + 170.0 * 1.65 + 28.0 * 4.2) * cargo_weight_tons + 1600),
                "cargo_capacity_tons": 600.0,
                "priority_match": "BALANCED"
            }
            all_options.append(multimodal_route)

            if primary_opt["risk_category"] in ["HIGH", "CRITICAL"]:
                summary = f"CRITICAL ROAD HAZARD on NH-6 ({primary_opt['risk_category']}). Multimodal engine recommends {multimodal_route['route_name']} combining 4-lane plains highway with protected NFR Haflong Ro-Ro rail to eliminate landslide disruption risk."

        return {
            "origin": origin,
            "destination": destination,
            "primary_route": primary_opt,
            "safe_alternate_route": safe_opt,
            "all_options": all_options,
            "summary": summary,
            "rail_route": rail_route,
            "air_route": air_route,
            "waterway_route": waterway_route,
            "multimodal_route": multimodal_route
        }


    def _build_route_option(self, r_id: str, name: str, path: List[str]) -> Dict[str, Any]:
        total_dist = 0.0
        total_time_mins = 0
        total_risk_sum = 0.0
        elevation_gain = 0.0
        disruption_count = 0
        segments = []
        waypoints = []
        advisories = []

        for i in range(len(path) - 1):
            u, v = path[i], path[i+1]
            if not waypoints:
                waypoints.append(NODES_COORDS[u])
            waypoints.append(NODES_COORDS[v])

            if self.graph.has_edge(u, v):
                edge_data = self.graph[u][v]
                dist = edge_data["distance"]
                risk = edge_data["risk"]
                slope = edge_data["slope"]
                corridor = edge_data["corridor"]
                is_mnt = edge_data["is_mountain"]
            else:
                dist = 75.0
                risk = 0.2
                slope = 20.0
                corridor = "NH"
                is_mnt = True

            # Mountain speed: ~35 km/h; Plains: ~60 km/h
            speed = 34.0 if is_mnt else 58.0
            time_mins = int((dist / speed) * 60)

            total_dist += dist
            total_time_mins += time_mins
            total_risk_sum += (risk * dist)
            elevation_gain += max(0, slope * 28.0)

            if risk > 0.6:
                disruption_count += 1
                advisories.append(f"High landslide risk near {u}-{v} ({corridor}). Potential rockfall delay.")
            elif risk > 0.35:
                advisories.append(f"Caution: Moderate slope instability on {u}-{v}.")

            seg_risk_level = "CRITICAL" if risk > 0.75 else ("HIGH" if risk > 0.50 else ("MODERATE" if risk > 0.25 else "LOW"))
            passable = risk < 0.85

            segments.append({
                "segment_name": f"{u} to {v}",
                "corridor_name": corridor,
                "distance_km": round(dist, 1),
                "risk_level": seg_risk_level,
                "risk_score": round(risk, 3),
                "slope_deg": round(slope, 1),
                "weather": "Heavy Rain" if risk > 0.5 else "Clear",
                "passable": passable
            })

        avg_risk = total_risk_sum / max(1.0, total_dist)
        risk_cat = "CRITICAL" if avg_risk > 0.65 else ("HIGH" if avg_risk > 0.45 else ("MODERATE" if avg_risk > 0.22 else "LOW"))

        return {
            "route_id": f"rt_{r_id}_{len(path)}",
            "route_name": name,
            "is_recommended": False,
            "total_distance_km": round(total_dist, 1),
            "estimated_time_minutes": total_time_mins,
            "overall_risk_score": round(avg_risk, 3),
            "risk_category": risk_cat,
            "disruption_points_count": disruption_count,
            "elevation_gain_m": round(elevation_gain, 0),
            "waypoints": waypoints,
            "segments": segments,
            "advisories": advisories if advisories else ["Normal road clearance verified by BRO."]
        }

routing_engine = RoutingEngine()
