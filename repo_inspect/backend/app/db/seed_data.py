import datetime
from sqlalchemy.orm import Session
from backend.app.core.database import SessionLocal, Base, engine
from backend.app.models.corridor import Corridor, Segment
from backend.app.models.vehicle import Vehicle
from backend.app.models.incident import Incident
from backend.app.models.alert import Alert

def seed_database(force: bool = True):
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        if force:
            print("Refreshing database tables with full 8-State NER Dataset...")
            db.query(Alert).delete()
            db.query(Incident).delete()
            db.query(Segment).delete()
            db.query(Corridor).delete()
            db.commit()
        elif db.query(Corridor).count() >= 8:
            print("Database already seeded with all 8 NER states.")
            return

        print("Seeding NER Logistics Intelligence Platform with All 8 North Eastern States...")

        # -------------------------------------------------------------------------
        # 1. CORRIDORS (All 8 North Eastern States)
        # -------------------------------------------------------------------------
        corridors_data = [
            # 1. Assam
            {
                "id": "cor-nh27",
                "name": "NH-27",
                "route_name": "Guwahati - Nagaon - Lumding - Haflong - Silchar (East-West Bypass)",
                "state": "Assam",
                "total_length_km": 399.0,
                "status": "OPEN",
                "disruption_prob": 0.18,
                "active_incidents_count": 1,
                "slope_angle_deg": 18.0,
                "elevation_m": 450.0,
                "drainage_score": 7.5,
                "weather_condition": "Light Overcast & Warm",
                "rainfall_24h_mm": 24.0,
                "soil_saturation_pct": 45.0,
                "geology": "Alluvial Silt",
                "coordinates": [
                    [26.1445, 91.7362],
                    [26.3452, 92.6841],
                    [25.7500, 93.1667],
                    [25.1764, 93.0234],
                    [24.8333, 92.7789]
                ]
            },
            # 2. Meghalaya
            {
                "id": "cor-nh6",
                "name": "NH-6",
                "route_name": "Guwahati - Shillong - Khliehriat - Sonapur - Silchar",
                "state": "Meghalaya",
                "total_length_km": 307.0,
                "status": "HIGH_RISK",
                "disruption_prob": 0.84,
                "active_incidents_count": 1,
                "slope_angle_deg": 44.5,
                "elevation_m": 1520.0,
                "drainage_score": 3.8,
                "weather_condition": "Heavy Monsoon Downpour",
                "rainfall_24h_mm": 118.0,
                "soil_saturation_pct": 91.0,
                "geology": "Fractured Shale",
                "coordinates": [
                    [26.1445, 91.7362],
                    [25.5788, 91.8933],
                    [25.4526, 92.2038],
                    [25.3524, 92.3644],
                    [25.1328, 92.3582],
                    [24.8333, 92.7789]
                ]
            },
            # 3. Arunachal Pradesh
            {
                "id": "cor-nh13",
                "name": "NH-13",
                "route_name": "Tezpur - Bhalukpong - Bomdila - Sela Pass - Tawang",
                "state": "Arunachal Pradesh",
                "total_length_km": 320.0,
                "status": "CAUTION",
                "disruption_prob": 0.52,
                "active_incidents_count": 1,
                "slope_angle_deg": 48.0,
                "elevation_m": 3048.0,
                "drainage_score": 4.8,
                "weather_condition": "Mountain Mist & Freezing Drizzle",
                "rainfall_24h_mm": 54.0,
                "soil_saturation_pct": 71.0,
                "geology": "Gneiss-Quartzite",
                "coordinates": [
                    [26.6528, 92.7926],
                    [27.0100, 92.9500],
                    [27.2644, 92.4200],
                    [27.5861, 91.8656]
                ]
            },
            # 4. Manipur
            {
                "id": "cor-nh2",
                "name": "NH-2",
                "route_name": "Kohima - Mao Gate - Senapati - Kangpokpi - Imphal",
                "state": "Manipur",
                "total_length_km": 138.0,
                "status": "CAUTION",
                "disruption_prob": 0.48,
                "active_incidents_count": 1,
                "slope_angle_deg": 38.0,
                "elevation_m": 1200.0,
                "drainage_score": 5.2,
                "weather_condition": "Continuous Rain & Valley Silt",
                "rainfall_24h_mm": 62.0,
                "soil_saturation_pct": 74.0,
                "geology": "Disang Shale",
                "coordinates": [
                    [25.6751, 94.1086],
                    [25.5100, 94.1500],
                    [25.2600, 94.0200],
                    [25.0100, 93.9700],
                    [24.8170, 93.9368]
                ]
            },
            # 5. Mizoram
            {
                "id": "cor-nh306",
                "name": "NH-306",
                "route_name": "Silchar - Vairengte - Bilkhawthlir - Kolasib - Aizawl",
                "state": "Mizoram",
                "total_length_km": 175.0,
                "status": "SEVERED",
                "disruption_prob": 0.91,
                "active_incidents_count": 1,
                "slope_angle_deg": 46.0,
                "elevation_m": 1132.0,
                "drainage_score": 3.2,
                "weather_condition": "Torrential Ridge Rainfall",
                "rainfall_24h_mm": 132.0,
                "soil_saturation_pct": 94.0,
                "geology": "Surma Sandstone-Shale",
                "coordinates": [
                    [24.8333, 92.7789],
                    [24.5100, 92.7600],
                    [24.2200, 92.6800],
                    [23.9800, 92.7000],
                    [23.7271, 92.7176]
                ]
            },
            # 6. Nagaland
            {
                "id": "cor-nh29",
                "name": "NH-29",
                "route_name": "Dimapur - Medziphema - Pagla Pahar - Kohima",
                "state": "Nagaland",
                "total_length_km": 74.0,
                "status": "HIGH_RISK",
                "disruption_prob": 0.72,
                "active_incidents_count": 1,
                "slope_angle_deg": 42.0,
                "elevation_m": 1444.0,
                "drainage_score": 4.1,
                "weather_condition": "Dense Fog & Slurry Runoff",
                "rainfall_24h_mm": 72.0,
                "soil_saturation_pct": 84.0,
                "geology": "Barail Sandstone",
                "coordinates": [
                    [25.9093, 93.7266],
                    [25.8150, 93.8420],
                    [25.7420, 93.9850],
                    [25.6751, 94.1086]
                ]
            },
            # 7. Tripura
            {
                "id": "cor-nh8",
                "name": "NH-8",
                "route_name": "Churaibari - Dharmanagar - Ambassa - Teliamura - Agartala",
                "state": "Tripura",
                "total_length_km": 196.0,
                "status": "CAUTION",
                "disruption_prob": 0.38,
                "active_incidents_count": 1,
                "slope_angle_deg": 24.0,
                "elevation_m": 85.0,
                "drainage_score": 5.5,
                "weather_condition": "Tropical Downpour & High Humidity",
                "rainfall_24h_mm": 58.0,
                "soil_saturation_pct": 69.0,
                "geology": "Tipam Sandstone",
                "coordinates": [
                    [24.5300, 92.2400],
                    [24.3800, 92.1600],
                    [23.9200, 91.8500],
                    [23.8300, 91.6300],
                    [23.8315, 91.2868]
                ]
            },
            # 8. Sikkim
            {
                "id": "cor-nh10",
                "name": "NH-10",
                "route_name": "Siliguri - Sevoke - Teesta Bazaar - Singtam - Gangtok",
                "state": "Sikkim",
                "total_length_km": 114.0,
                "status": "SEVERED",
                "disruption_prob": 0.96,
                "active_incidents_count": 1,
                "slope_angle_deg": 56.0,
                "elevation_m": 1650.0,
                "drainage_score": 2.2,
                "weather_condition": "Teesta River Flood Inundation",
                "rainfall_24h_mm": 172.0,
                "soil_saturation_pct": 98.0,
                "geology": "Darjeeling Gneiss",
                "coordinates": [
                    [26.7271, 88.3953],
                    [26.8833, 88.4667],
                    [27.0500, 88.4800],
                    [27.2100, 88.5400],
                    [27.3389, 88.6065]
                ]
            }
        ]

        for c_dict in corridors_data:
            c = Corridor(**c_dict)
            db.add(c)
        db.commit()

        # -------------------------------------------------------------------------
        # 2. ROAD SEGMENTS (Color Coded: Safe, Medium, High, Critical across 8 States)
        # -------------------------------------------------------------------------
        segments_data = [
            # 1. Assam (NH-27)
            {
                "id": "seg-nh27-1",
                "corridor_id": "cor-nh27",
                "segment_order": 1,
                "start_point_name": "Guwahati (Jorabat)",
                "end_point_name": "Nagaon Bypass",
                "distance_km": 115.0,
                "risk_level": "Safe",
                "risk_score": 0.12,
                "status": "PASSABLE",
                "start_lat": 26.1445, "start_lng": 91.7362,
                "end_lat": 26.3452, "end_lng": 92.6841,
                "altitude_m": 75.0, "slope_deg": 12.0,
                "rainfall_mm": 18.0, "landslide_history": 0, "road_condition": "Excellent",
                "polyline": [[26.1445, 91.7362], [26.2100, 92.2000], [26.3452, 92.6841]],
                "alternate_route_polyline": []
            },
            {
                "id": "seg-nh27-2",
                "corridor_id": "cor-nh27",
                "segment_order": 2,
                "start_point_name": "Lumding",
                "end_point_name": "Haflong - Silchar",
                "distance_km": 217.0,
                "risk_level": "Safe",
                "risk_score": 0.22,
                "status": "PASSABLE",
                "start_lat": 25.7500, "start_lng": 93.1667,
                "end_lat": 24.8333, "end_lng": 92.7789,
                "altitude_m": 580.0, "slope_deg": 24.0,
                "rainfall_mm": 32.0, "landslide_history": 1, "road_condition": "Good",
                "polyline": [[25.7500, 93.1667], [25.1764, 93.0234], [24.8333, 92.7789]],
                "alternate_route_polyline": []
            },

            # 2. Meghalaya (NH-6)
            {
                "id": "seg-nh6-1",
                "corridor_id": "cor-nh6",
                "segment_order": 1,
                "start_point_name": "Guwahati (Khanapara)",
                "end_point_name": "Shillong",
                "distance_km": 98.0,
                "risk_level": "Safe",
                "risk_score": 0.20,
                "status": "PASSABLE",
                "start_lat": 26.1445, "start_lng": 91.7362,
                "end_lat": 25.5788, "end_lng": 91.8933,
                "altitude_m": 1525.0, "slope_deg": 28.0,
                "rainfall_mm": 28.0, "landslide_history": 0, "road_condition": "Good",
                "polyline": [[26.1445, 91.7362], [25.8600, 91.8200], [25.5788, 91.8933]],
                "alternate_route_polyline": []
            },
            {
                "id": "seg-nh6-3",
                "corridor_id": "cor-nh6",
                "segment_order": 2,
                "start_point_name": "Khliehriat",
                "end_point_name": "Sonapur Tunnel",
                "distance_km": 35.0,
                "risk_level": "Critical",
                "risk_score": 0.94,
                "status": "BLOCKED",
                "start_lat": 25.3524, "start_lng": 92.3644,
                "end_lat": 25.1328, "end_lng": 92.3582,
                "altitude_m": 890.0, "slope_deg": 54.0,
                "rainfall_mm": 125.0, "landslide_history": 6, "road_condition": "Poor",
                "polyline": [[25.3524, 92.3644], [25.2400, 92.3600], [25.1328, 92.3582]],
                "alternate_route_polyline": [
                    [26.1445, 91.7362], [26.3452, 92.6841], [25.7500, 93.1667], [25.1764, 93.0234], [24.8333, 92.7789]
                ]
            },

            # 3. Arunachal Pradesh (NH-13)
            {
                "id": "seg-nh13-1",
                "corridor_id": "cor-nh13",
                "segment_order": 1,
                "start_point_name": "Tezpur",
                "end_point_name": "Bhalukpong Gate",
                "distance_km": 58.0,
                "risk_level": "Safe",
                "risk_score": 0.22,
                "status": "PASSABLE",
                "start_lat": 26.6528, "start_lng": 92.7926,
                "end_lat": 27.0100, "end_lng": 92.9500,
                "altitude_m": 213.0, "slope_deg": 22.0,
                "rainfall_mm": 35.0, "landslide_history": 1, "road_condition": "Good",
                "polyline": [[26.6528, 92.7926], [26.8500, 92.8600], [27.0100, 92.9500]],
                "alternate_route_polyline": []
            },
            {
                "id": "seg-nh13-2",
                "corridor_id": "cor-nh13",
                "segment_order": 2,
                "start_point_name": "Bhalukpong",
                "end_point_name": "Bomdila - Tawang Pass",
                "distance_km": 182.0,
                "risk_level": "High",
                "risk_score": 0.78,
                "status": "SLOW",
                "start_lat": 27.0100, "start_lng": 92.9500,
                "end_lat": 27.5861, "end_lng": 91.8656,
                "altitude_m": 3048.0, "slope_deg": 52.0,
                "rainfall_mm": 78.0, "landslide_history": 5, "road_condition": "Poor",
                "polyline": [[27.0100, 92.9500], [27.2644, 92.4200], [27.5861, 91.8656]],
                "alternate_route_polyline": [
                    [26.6528, 92.7926], [26.8900, 92.3500], [27.1800, 92.2000], [27.5861, 91.8656]
                ]
            },

            # 4. Manipur (NH-2)
            {
                "id": "seg-nh2-1",
                "corridor_id": "cor-nh2",
                "segment_order": 1,
                "start_point_name": "Kohima - Mao Gate",
                "end_point_name": "Senapati",
                "distance_km": 54.0,
                "risk_level": "Medium",
                "risk_score": 0.46,
                "status": "PASSABLE",
                "start_lat": 25.6751, "start_lng": 94.1086,
                "end_lat": 25.2600, "end_lng": 94.0200,
                "altitude_m": 1350.0, "slope_deg": 34.0,
                "rainfall_mm": 52.0, "landslide_history": 2, "road_condition": "Fair",
                "polyline": [[25.6751, 94.1086], [25.5100, 94.1500], [25.2600, 94.0200]],
                "alternate_route_polyline": []
            },
            {
                "id": "seg-nh2-2",
                "corridor_id": "cor-nh2",
                "segment_order": 2,
                "start_point_name": "Senapati - Kangpokpi",
                "end_point_name": "Imphal Valley",
                "distance_km": 84.0,
                "risk_level": "High",
                "risk_score": 0.74,
                "status": "SLOW",
                "start_lat": 25.2600, "start_lng": 94.0200,
                "end_lat": 24.8170, "end_lng": 93.9368,
                "altitude_m": 786.0, "slope_deg": 38.0,
                "rainfall_mm": 68.0, "landslide_history": 4, "road_condition": "Fair",
                "polyline": [[25.2600, 94.0200], [25.0100, 93.9700], [24.8170, 93.9368]],
                "alternate_route_polyline": [
                    [25.2600, 94.0200], [25.1000, 93.6500], [24.8170, 93.9368]
                ]
            },

            # 5. Mizoram (NH-306)
            {
                "id": "seg-nh306-1",
                "corridor_id": "cor-nh306",
                "segment_order": 1,
                "start_point_name": "Silchar (Dholai)",
                "end_point_name": "Vairengte Gate",
                "distance_km": 48.0,
                "risk_level": "Safe",
                "risk_score": 0.25,
                "status": "PASSABLE",
                "start_lat": 24.8333, "start_lng": 92.7789,
                "end_lat": 24.5100, "end_lng": 92.7600,
                "altitude_m": 180.0, "slope_deg": 24.0,
                "rainfall_mm": 42.0, "landslide_history": 1, "road_condition": "Good",
                "polyline": [[24.8333, 92.7789], [24.6800, 92.7700], [24.5100, 92.7600]],
                "alternate_route_polyline": []
            },
            {
                "id": "seg-nh306-2",
                "corridor_id": "cor-nh306",
                "segment_order": 2,
                "start_point_name": "Vairengte",
                "end_point_name": "Kolasib - Aizawl Citadel",
                "distance_km": 127.0,
                "risk_level": "Critical",
                "risk_score": 0.92,
                "status": "BLOCKED",
                "start_lat": 24.5100, "start_lng": 92.7600,
                "end_lat": 23.7271, "end_lng": 92.7176,
                "altitude_m": 1132.0, "slope_deg": 52.0,
                "rainfall_mm": 138.0, "landslide_history": 6, "road_condition": "Poor",
                "polyline": [[24.5100, 92.7600], [24.2200, 92.6800], [23.9800, 92.7000], [23.7271, 92.7176]],
                "alternate_route_polyline": [
                    [24.5100, 92.7600], [24.2000, 92.4800], [23.8500, 92.5400], [23.7271, 92.7176]
                ]
            },

            # 6. Nagaland (NH-29)
            {
                "id": "seg-nh29-1",
                "corridor_id": "cor-nh29",
                "segment_order": 1,
                "start_point_name": "Dimapur Bypass",
                "end_point_name": "Medziphema",
                "distance_km": 32.0,
                "risk_level": "Medium",
                "risk_score": 0.44,
                "status": "PASSABLE",
                "start_lat": 25.9093, "start_lng": 93.7266,
                "end_lat": 25.8150, "end_lng": 93.8420,
                "altitude_m": 420.0, "slope_deg": 24.0,
                "rainfall_mm": 45.0, "landslide_history": 1, "road_condition": "Fair",
                "polyline": [[25.9093, 93.7266], [25.8600, 93.7800], [25.8150, 93.8420]],
                "alternate_route_polyline": []
            },
            {
                "id": "seg-nh29-2",
                "corridor_id": "cor-nh29",
                "segment_order": 2,
                "start_point_name": "Medziphema - Pagla Pahar",
                "end_point_name": "Kohima Citadel",
                "distance_km": 42.0,
                "risk_level": "High",
                "risk_score": 0.76,
                "status": "SLOW",
                "start_lat": 25.8150, "start_lng": 93.8420,
                "end_lat": 25.6751, "end_lng": 94.1086,
                "altitude_m": 1444.0, "slope_deg": 48.0,
                "rainfall_mm": 84.0, "landslide_history": 5, "road_condition": "Poor",
                "polyline": [[25.8150, 93.8420], [25.7420, 93.9850], [25.6751, 94.1086]],
                "alternate_route_polyline": [
                    [25.9093, 93.7266], [25.9800, 93.8500], [25.8900, 94.0200], [25.6751, 94.1086]
                ]
            },

            # 7. Tripura (NH-8)
            {
                "id": "seg-nh8-1",
                "corridor_id": "cor-nh8",
                "segment_order": 1,
                "start_point_name": "Churaibari Gate",
                "end_point_name": "Ambassa",
                "distance_km": 92.0,
                "risk_level": "Medium",
                "risk_score": 0.42,
                "status": "PASSABLE",
                "start_lat": 24.5300, "start_lng": 92.2400,
                "end_lat": 23.9200, "end_lng": 91.8500,
                "altitude_m": 120.0, "slope_deg": 24.0,
                "rainfall_mm": 54.0, "landslide_history": 1, "road_condition": "Fair",
                "polyline": [[24.5300, 92.2400], [24.2000, 92.0500], [23.9200, 91.8500]],
                "alternate_route_polyline": []
            },
            {
                "id": "seg-nh8-2",
                "corridor_id": "cor-nh8",
                "segment_order": 2,
                "start_point_name": "Ambassa - Baramura",
                "end_point_name": "Agartala Capital",
                "distance_km": 104.0,
                "risk_level": "Safe",
                "risk_score": 0.28,
                "status": "PASSABLE",
                "start_lat": 23.9200, "start_lng": 91.8500,
                "end_lat": 23.8315, "end_lng": 91.2868,
                "altitude_m": 45.0, "slope_deg": 18.0,
                "rainfall_mm": 38.0, "landslide_history": 0, "road_condition": "Good",
                "polyline": [[23.9200, 91.8500], [23.8300, 91.6300], [23.8315, 91.2868]],
                "alternate_route_polyline": []
            },

            # 8. Sikkim (NH-10)
            {
                "id": "seg-nh10-1",
                "corridor_id": "cor-nh10",
                "segment_order": 1,
                "start_point_name": "Sevoke Coronation Bridge",
                "end_point_name": "Teesta Bazaar",
                "distance_km": 42.0,
                "risk_level": "Critical",
                "risk_score": 0.96,
                "status": "BLOCKED",
                "start_lat": 26.8833, "start_lng": 88.4667,
                "end_lat": 27.0500, "end_lng": 88.4800,
                "altitude_m": 720.0, "slope_deg": 58.0,
                "rainfall_mm": 165.0, "landslide_history": 7, "road_condition": "Poor",
                "polyline": [[26.8833, 88.4667], [26.9600, 88.4700], [27.0500, 88.4800]],
                "alternate_route_polyline": [
                    [26.7271, 88.3953], [26.9000, 88.6500], [27.0800, 88.6600], [27.2000, 88.6200], [27.3389, 88.6065]
                ]
            },
            {
                "id": "seg-nh10-2",
                "corridor_id": "cor-nh10",
                "segment_order": 2,
                "start_point_name": "Teesta Bazaar",
                "end_point_name": "Gangtok",
                "distance_km": 50.0,
                "risk_level": "High",
                "risk_score": 0.72,
                "status": "SLOW",
                "start_lat": 27.0500, "start_lng": 88.4800,
                "end_lat": 27.3389, "end_lng": 88.6065,
                "altitude_m": 1650.0, "slope_deg": 46.0,
                "rainfall_mm": 85.0, "landslide_history": 3, "road_condition": "Fair",
                "polyline": [[27.0500, 88.4800], [27.2100, 88.5400], [27.3389, 88.6065]],
                "alternate_route_polyline": []
            }
        ]

        for s_dict in segments_data:
            s = Segment(**s_dict)
            db.add(s)
        db.commit()

        # -------------------------------------------------------------------------
        # 3. INCIDENTS (Spanning all 8 North Eastern States)
        # -------------------------------------------------------------------------
        incidents_data = [
            # 1. Meghalaya
            {
                "id": "inc-01",
                "category": "Landslide",
                "severity": "CRITICAL_CUTOFF",
                "corridor_id": "cor-nh6",
                "location_name": "Sonapur Tunnel North Portal, NH-6",
                "latitude": 25.1328,
                "longitude": 92.3582,
                "description": "Massive hill cut failure depositing ~800 cubic meters of mud and fractured shale boulders. Both lanes obstructed.",
                "photo_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
                "reported_by": "Capt. M. Deka (BRO Project Pushpak)",
                "reporter_role": "BRO Officer",
                "status": "IN_CLEARANCE",
                "verified_by": "Meghalaya Police & BRO HQ",
                "clearance_eta_hours": 14.5,
                "upvotes": 48,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(hours=3)
            },
            # 2. Sikkim
            {
                "id": "inc-02",
                "category": "Bridge Washout",
                "severity": "CRITICAL_CUTOFF",
                "corridor_id": "cor-nh10",
                "location_name": "29th Mile, Teesta River Bank, NH-10",
                "latitude": 27.0250,
                "longitude": 88.4750,
                "description": "Swollen Teesta river swept away 40 meters of embankment and protective gabion walls. Traffic to Gangtok halted.",
                "photo_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
                "reported_by": "Sikkim State Disaster Management Authority",
                "reporter_role": "Traffic Police",
                "status": "VERIFIED",
                "verified_by": "SDMA Sikkim",
                "clearance_eta_hours": 36.0,
                "upvotes": 72,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(hours=5)
            },
            # 3. Nagaland
            {
                "id": "inc-03",
                "category": "Mudslide",
                "severity": "MEDIUM",
                "corridor_id": "cor-nh29",
                "location_name": "Pagla Pahar Chasm, NH-29",
                "latitude": 25.7420,
                "longitude": 93.9850,
                "description": "Debris and slurry creeping onto outer lane following mountain downpour. Single-lane one-way traffic regulated.",
                "photo_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                "reported_by": "Truck Driver Union Kohima",
                "reporter_role": "Truck Driver",
                "status": "VERIFIED",
                "verified_by": "Kohima Traffic Police",
                "clearance_eta_hours": 4.5,
                "upvotes": 29,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(hours=1)
            },
            # 4. Assam
            {
                "id": "inc-04",
                "category": "Flash Flood",
                "severity": "CRITICAL_CUTOFF",
                "corridor_id": "cor-nh27",
                "location_name": "Kaziranga Buffer Corridor, NH-27",
                "latitude": 26.5800,
                "longitude": 93.1700,
                "description": "Brahmaputra backflow inundated highway stretch with 0.8m water. Heavy transit restricted to protect wildlife & vehicles.",
                "photo_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
                "reported_by": "Assam State Disaster Management",
                "reporter_role": "Disaster Response",
                "status": "VERIFIED",
                "verified_by": "ASDMA Guwahati",
                "clearance_eta_hours": 18.0,
                "upvotes": 55,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            },
            # 5. Mizoram
            {
                "id": "inc-05",
                "category": "Landslide",
                "severity": "CRITICAL_CUTOFF",
                "corridor_id": "cor-nh306",
                "location_name": "Kolasib Mountain Ridge, NH-306",
                "latitude": 24.2200,
                "longitude": 92.6800,
                "description": "Hill cut slope failure collapsed entire roadway apron over 60 meters. Mizoram lifeline completely severed.",
                "photo_url": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
                "reported_by": "Mizoram PWD Highway Wing",
                "reporter_role": "Highway Engineer",
                "status": "IN_CLEARANCE",
                "verified_by": "Disaster Management Aizawl",
                "clearance_eta_hours": 24.0,
                "upvotes": 61,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(hours=4)
            },
            # 6. Arunachal Pradesh
            {
                "id": "inc-06",
                "category": "Rockfall",
                "severity": "SEVERE",
                "corridor_id": "cor-nh13",
                "location_name": "Sela Pass South Approach, NH-13",
                "latitude": 27.5000,
                "longitude": 92.1000,
                "description": "Sub-zero ice wedge fracturing triggered rockfall covering outer lane. BRO dozers deployed on site.",
                "photo_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                "reported_by": "BRO Project Vartak",
                "reporter_role": "BRO Officer",
                "status": "IN_CLEARANCE",
                "verified_by": "Tawang Police",
                "clearance_eta_hours": 8.0,
                "upvotes": 37,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(hours=6)
            },
            # 7. Manipur
            {
                "id": "inc-07",
                "category": "Mudslide",
                "severity": "MEDIUM",
                "corridor_id": "cor-nh2",
                "location_name": "Kangpokpi Mountain Pass, NH-2",
                "latitude": 25.1500,
                "longitude": 93.9700,
                "description": "Continuous drizzle resulting in mud slurry creep. Commercial trucks crawling at 15 km/h.",
                "photo_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
                "reported_by": "Manipur Transport Union",
                "reporter_role": "Truck Driver",
                "status": "VERIFIED",
                "verified_by": "Kangpokpi District Police",
                "clearance_eta_hours": 6.0,
                "upvotes": 22,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            },
            # 8. Tripura
            {
                "id": "inc-08",
                "category": "Flash Flood",
                "severity": "MEDIUM",
                "corridor_id": "cor-nh8",
                "location_name": "Baramura Hill Section, NH-8",
                "latitude": 23.8800,
                "longitude": 91.5500,
                "description": "Culvert overflow waterlogging both carriageways. Traffic moving under caution.",
                "photo_url": "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
                "reported_by": "Tripura Traffic Control",
                "reporter_role": "Traffic Police",
                "status": "VERIFIED",
                "verified_by": "Agartala Police HQ",
                "clearance_eta_hours": 3.0,
                "upvotes": 19,
                "reported_at": datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
            }
        ]

        for i_dict in incidents_data:
            inc = Incident(**i_dict)
            db.add(inc)
        db.commit()

        # -------------------------------------------------------------------------
        # 4. ALERTS (All 4 Categories across All 8 States)
        # -------------------------------------------------------------------------
        alerts_data = [
            # 1. Meghalaya: LANDSLIDE
            {
                "id": "alt-01",
                "corridor_id": "cor-nh6",
                "title": "CRITICAL LANDSLIDE: Sonapur Tunnel on NH-6 Severed",
                "message": "Major high-velocity mudflow with fractured shale boulders has severed both lanes at km 142. All heavy freight diverted via NH-27 Lumding-Haflong expressway bypass.",
                "severity": "CRITICAL",
                "alert_type": "LANDSLIDE",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            },
            # 2. Sikkim: BLOCKED_ROAD
            {
                "id": "alt-02",
                "corridor_id": "cor-nh10",
                "title": "ROAD BLOCKED: Sikkim NH-10 Teesta Valley Pass Impassable",
                "message": "Embankment breach at 29th Mile. Roadway collapsed into river chasm. Total blockade between Siliguri and Gangtok. Reroute via NH-717A Lava-Reshi mountain bypass.",
                "severity": "CRITICAL",
                "alert_type": "BLOCKED_ROAD",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=4)
            },
            # 3. Assam: FLOOD
            {
                "id": "alt-03",
                "corridor_id": "cor-nh27",
                "title": "FLASH FLOOD ALERT: NH-27 Kaziranga Highway Inundated",
                "message": "Brahmaputra river overflow spilling onto 4.2 km highway stretch. Water level at 0.7m. Commercial truck speed restricted to 15 km/h convoy crawl.",
                "severity": "DANGER",
                "alert_type": "FLOOD",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=1)
            },
            # 4. Manipur: DELIVERY_DELAY
            {
                "id": "alt-04",
                "corridor_id": "cor-nh2",
                "title": "DELIVERY DELAY: Manipur Produce Convoy MN-01-T-5509 (+85 min)",
                "message": "Essential Vegetable & Relief Convoy MN-01-T-5509 delayed by +1.4 hours due to Kangpokpi mountain pass slurry crawl. Updated ETA: 175 mins.",
                "severity": "WARNING",
                "alert_type": "DELIVERY_DELAY",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(minutes=30)
            },
            # 5. Nagaland: DELIVERY_DELAY
            {
                "id": "alt-05",
                "corridor_id": "cor-nh29",
                "title": "DELIVERY DELAY: Petroleum Tanker NL-07-A-8912 (+75 min)",
                "message": "IOCL Fuel Tanker NL-07-A-8912 delayed by +1.2 hours due to mud slurry and single-lane regulation near Pagla Pahar, Nagaland.",
                "severity": "WARNING",
                "alert_type": "DELIVERY_DELAY",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
            },
            # 6. Mizoram: BLOCKED_ROAD
            {
                "id": "alt-06",
                "corridor_id": "cor-nh306",
                "title": "ROAD SEVERED: Mizoram Lifeline NH-306 Kolasib Cut-Off",
                "message": "Total road subsidence at Kolasib mountain ridge. Silchar to Aizawl transit severed. Heavy food convoys rerouted via Mamit-Lengpui ridge.",
                "severity": "CRITICAL",
                "alert_type": "BLOCKED_ROAD",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=3)
            },
            # 7. Arunachal Pradesh: LANDSLIDE
            {
                "id": "alt-07",
                "corridor_id": "cor-nh13",
                "title": "LANDSLIDE WARNING: NH-13 Bhalukpong-Bomdila Debris Flow",
                "message": "Active debris flow and rock dislodgement above chainage km 82. Transit permitted under military convoy regulation only.",
                "severity": "DANGER",
                "alert_type": "LANDSLIDE",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(hours=5)
            },
            # 8. Tripura: FLOOD
            {
                "id": "alt-08",
                "corridor_id": "cor-nh8",
                "title": "FLOOD CAUTION: NH-8 Baramura Hill Chasm Torrent",
                "message": "Flash runoff culvert overflow in Khowai district. Commercial drivers advised to reduce speed to 25 km/h.",
                "severity": "WARNING",
                "alert_type": "FLOOD",
                "target_audience": "ALL",
                "is_active": True,
                "created_at": datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
            }
        ]

        for a_dict in alerts_data:
            alt = Alert(**a_dict)
            db.add(alt)
        db.commit()

        print("Successfully seeded all 8 North Eastern states into the platform database!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database(force=True)
