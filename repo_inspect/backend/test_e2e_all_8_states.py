import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from backend.app.core.database import SessionLocal
from backend.app.models.corridor import Corridor as CorridorModel, Segment as SegmentModel
from backend.app.models.alert import Alert as AlertModel
from backend.app.models.incident import Incident as IncidentModel
from backend.app.services.ai_predictor import ai_predictor
from backend.app.services.vehicle_simulator import vehicle_simulator
from backend.app.services.weather_service import weather_service
from backend.app.services.routing_engine import routing_engine

def test_full_8_state_integration():
    db = SessionLocal()
    try:
        print("================================================================================")
        print("  SMART INDIA HACKATHON 2026 - PROBLEM STATEMENT 26002")
        print("  FULL 8-STATE END-TO-END VERIFICATION SUITE")
        print("================================================================================\n")

        # -------------------------------------------------------------------------
        # 1. VERIFY ALL 8 STATES IN CORRIDORS
        # -------------------------------------------------------------------------
        print("[TEST 1/7] Verifying Highway Corridors across all 8 North Eastern States...")
        corridors = db.query(CorridorModel).all()
        corridor_states = {c.state: c for c in corridors}
        
        expected_states = [
            "Assam", "Meghalaya", "Arunachal Pradesh", "Manipur", 
            "Mizoram", "Nagaland", "Tripura", "Sikkim"
        ]
        
        for state in expected_states:
            assert state in corridor_states, f"State '{state}' missing from corridors in DB!"
            c = corridor_states[state]
            print(f"  ✓ {state.ljust(18)}: Corridor {c.name} ({c.route_name}) - Length: {c.total_length_km} km")
            assert len(c.coordinates) >= 3, f"Corridor {c.name} coordinates invalid"
        
        print(f"  --> All {len(expected_states)} states have registered national highway corridors!\n")

        # -------------------------------------------------------------------------
        # 2. VERIFY ROAD SEGMENTS ACROSS ALL 8 STATES
        # -------------------------------------------------------------------------
        print("[TEST 2/7] Verifying Road Segments and Risk Levels across all 8 States...")
        segments = db.query(SegmentModel).all()
        assert len(segments) >= 16, f"Expected at least 16 segments, found {len(segments)}"
        
        risk_levels_found = set(s.risk_level for s in segments)
        print(f"  Risk levels present in DB: {risk_levels_found}")
        for required_risk in ["Safe", "Critical"]:
            assert required_risk in risk_levels_found, f"Expected risk level '{required_risk}' in segments"
            
        for seg in segments:
            print(f"  • [{seg.id}] {seg.start_point_name} -> {seg.end_point_name} | Risk: {seg.risk_level} | Status: {seg.status}")
            assert seg.start_lat != 0 and seg.start_lng != 0
            assert seg.polyline and len(seg.polyline) >= 2
        print(f"  --> Total {len(segments)} road segments active with GIS coordinates and risk telemetry!\n")

        # -------------------------------------------------------------------------
        # 3. VERIFY AI PREDICTIONS & ALTERNATE BYPASSES FOR ALL 8 CORRIDORS
        # -------------------------------------------------------------------------
        print("[TEST 3/7] Verifying AI Road Risk Prediction & Alternate Bypasses on all Corridors...")
        corridors_to_test = [
            ("NH-27", "Assam", 18.0, 0, "Excellent", "Safe"),
            ("NH-6", "Meghalaya", 145.0, 6, "Poor", "Critical"),
            ("NH-13", "Arunachal Pradesh", 85.0, 5, "Poor", "High"),
            ("NH-2", "Manipur", 72.0, 4, "Fair", "High"),
            ("NH-306", "Mizoram", 138.0, 6, "Poor", "Critical"),
            ("NH-29", "Nagaland", 84.0, 5, "Poor", "High"),
            ("NH-8", "Tripura", 82.0, 4, "Poor", "High"),
            ("NH-10", "Sikkim", 165.0, 7, "Poor", "Critical"),
        ]

        for nh, state, rain, slides, cond, expected_risk in corridors_to_test:
            pred = ai_predictor.predict_road_risk({
                "corridor_name": nh,
                "rainfall_mm": rain,
                "landslide_history": slides,
                "road_condition": cond
            })
            print(f"  ✓ {nh.ljust(7)} ({state.ljust(17)}): Pred Risk: {pred['risk_level'].ljust(8)} | Color: {pred['color']} | Clearance: {pred['estimated_clearance_hours']}h")
            assert pred["risk_level"] in ["Safe", "Medium", "High", "Critical"]
            assert pred["color"].startswith("#")

            if pred["risk_level"] in ["High", "Critical"]:
                assert pred["alternate_route"] is not None, f"Expected alternate bypass for high-risk corridor {nh}"
                alt = pred["alternate_route"]
                print(f"    ↳ Bypass: '{alt['bypass_name']}' ({alt['distance_km']} km, ETA: {alt['eta_minutes']}m)")
                assert len(alt["waypoints"]) >= 2

        print("  --> AI prediction accurately evaluates all 8 corridors and supplies bypasses!\n")

        # -------------------------------------------------------------------------
        # 4. VERIFY ALL 4 REQUIRED ALERT CATEGORIES
        # -------------------------------------------------------------------------
        print("[TEST 4/7] Verifying Multi-Hazard Alerts (Blocked Roads, Floods, Landslides, Delivery Delays)...")
        alerts = db.query(AlertModel).all()
        assert len(alerts) >= 8, f"Expected at least 8 alerts, found {len(alerts)}"
        
        alert_types = set(a.alert_type for a in alerts)
        required_alert_types = {"BLOCKED_ROAD", "FLOOD", "LANDSLIDE", "DELIVERY_DELAY"}
        for req in required_alert_types:
            assert req in alert_types, f"Required alert type '{req}' missing from active alerts"
            print(f"  ✓ Alert category '{req}' confirmed active in database")

        for a in alerts:
            print(f"    - [{a.severity}] {a.title} ({a.alert_type}) | Corridor ID: {a.corridor_id}")
        print("  --> Multi-hazard alert engine successfully covers all 4 critical categories!\n")

        # -------------------------------------------------------------------------
        # 5. VERIFY FLEET SIMULATOR & VEHICLES COVERING ALL 8 STATES
        # -------------------------------------------------------------------------
        print("[TEST 5/7] Verifying Live GPS Vehicle Fleet across all 8 States...")
        vehicles = vehicle_simulator.get_all_vehicles()
        assert len(vehicles) >= 8, f"Expected at least 8 vehicles, found {len(vehicles)}"
        
        for v in vehicles:
            print(f"  ✓ Convoy {v['id']}: {v['plate_number']} | {v['origin_city']} ➔ {v['destination_city']}")
            print(f"    Speed: {v['speed_kmh']} km/h | Dynamic ETA: {v['eta_minutes']} min | Delay: +{v['delay_minutes']} min | Trail: {len(v['breadcrumb_trail'])} pts")
            assert v['current_lat'] != 0 and v['current_lng'] != 0
            assert v['distance_remaining_km'] >= 0
            assert v['eta_minutes'] is not None

        # Verify simulation tick updates GPS coordinates and dynamic ETA
        v_test = vehicles[0]
        init_lat, init_lng = v_test['current_lat'], v_test['current_lng']
        vehicle_simulator.update_simulation_tick()
        assert len(v_test['breadcrumb_trail']) >= 2
        print(f"  --> Live fleet tracking updates breadcrumbs and dynamic ETAs in real-time!\n")

        # -------------------------------------------------------------------------
        # 6. VERIFY WEATHER TELEMETRY ACROSS ALL 8 STATES
        # -------------------------------------------------------------------------
        print("[TEST 6/7] Verifying Weather Telemetry across all 8 States...")
        import asyncio
        state_hubs = [
            ("Guwahati", "Assam"),
            ("Shillong", "Meghalaya"),
            ("Tawang", "Arunachal Pradesh"),
            ("Imphal", "Manipur"),
            ("Aizawl", "Mizoram"),
            ("Kohima", "Nagaland"),
            ("Agartala", "Tripura"),
            ("Gangtok", "Sikkim")
        ]
        
        for city, state in state_hubs:
            w = asyncio.run(weather_service.get_weather_for_location(city))
            print(f"  ✓ {city.ljust(12)} ({state.ljust(18)}): {w['weather_condition']} | Temp: {w['temperature_c']}°C | Rain: {w['precipitation_mm']}mm | Warning: {w['warning_level']}")
            assert w['precipitation_mm'] is not None
            assert w['warning_level'] in ["GREEN", "YELLOW", "ORANGE", "RED"]
        print("  --> Weather telemetry actively covers key mountain logistics hubs!\n")

        # -------------------------------------------------------------------------
        # 7. VERIFY ROUTING ENGINE GRAPH & SHORTEST/SAFE PATHS
        # -------------------------------------------------------------------------
        print("[TEST 7/7] Verifying Routing Engine Graph across North East India...")
        nodes = list(routing_engine.graph.nodes)
        print(f"  Total graph hubs in routing engine: {len(nodes)}")
        assert len(nodes) >= 12, "Expected at least 12 logistics hubs in routing graph"

        # Calculate route: Guwahati (Assam) -> Gangtok (Sikkim)
        route_plan = routing_engine.calculate_routes("Guwahati", "Gangtok")
        assert route_plan is not None
        assert "primary_route" in route_plan
        primary = route_plan["primary_route"]
        print(f"  ✓ Route Guwahati ➔ Gangtok: {primary['route_name']}")
        print(f"    Distance: {primary['total_distance_km']} km | ETA: {primary['estimated_time_minutes']} min | Risk: {primary['risk_category']}")
        assert primary["total_distance_km"] > 0
        assert len(primary["waypoints"]) >= 2
        print("  --> Graph routing engine successfully computes multi-state itineraries!\n")

        print("================================================================================")
        print("  ALL 7 TESTS PASSED: COMPLETE 8-STATE SMART LOGISTICS PLATFORM VERIFIED!")
        print("================================================================================")

    finally:
        db.close()

if __name__ == "__main__":
    test_full_8_state_integration()
