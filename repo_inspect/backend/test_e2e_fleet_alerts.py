import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import json
from backend.app.core.database import SessionLocal
from backend.app.models.alert import Alert as AlertModel
from backend.app.services.vehicle_simulator import vehicle_simulator

def test_fleet_and_alerts():
    db = SessionLocal()
    try:
        print("==================================================")
        print("  NER LOGISTICS PLATFORM - FLEET & ALERTS E2E TEST ")
        print("==================================================")
        
        # 1. Verify fleet count & fields from VehicleSimulator
        vehicles = vehicle_simulator.get_all_vehicles()
        print(f"\n[1] Total Vehicles in Simulator: {len(vehicles)}")
        assert len(vehicles) >= 6, "Expected at least 6 vehicles in simulator"
        
        for v in vehicles:
            print(f"  - Convoy {v['id']}: {v['plate_number']} ({v['origin_city']} -> {v['destination_city']})")
            print(f"    Status: {v['status']} | Speed: {v['speed_kmh']} km/h | ETA: {v['eta_minutes']}m | Delay: {v['delay_minutes']}m")
            assert v.get('eta_minutes') is not None, f"Vehicle {v['id']} missing eta_minutes"
            assert v.get('delay_minutes') is not None, f"Vehicle {v['id']} missing delay_minutes"
            assert v.get('distance_remaining_km') is not None, f"Vehicle {v['id']} missing distance_remaining_km"
            assert v.get('breadcrumb_trail') is not None, f"Vehicle {v['id']} missing breadcrumb_trail"

        # 2. Test Step Simulation (GPS coordinates, breadcrumbs and Dynamic ETA update)
        print("\n[2] Testing GPS telemetry update step via update_simulation_tick()...")
        v1 = vehicle_simulator.get_vehicle_by_id("veh-101")
        initial_lat, initial_lng = v1["current_lat"], v1["current_lng"]
        initial_eta = v1["eta_minutes"]
        print(f"  Before step: lat={initial_lat:.4f}, lng={initial_lng:.4f}, ETA={initial_eta}m")

        # Run 3 simulation ticks
        for i in range(3):
            vehicle_simulator.update_simulation_tick()
        
        print(f"  After 3 ticks: lat={v1['current_lat']:.4f}, lng={v1['current_lng']:.4f}, ETA={v1['eta_minutes']}m, dist_rem={v1['distance_remaining_km']:.1f}km")
        trail = v1["breadcrumb_trail"]
        print(f"  Breadcrumbs count: {len(trail)} points")
        assert len(trail) >= 2, "Expected breadcrumbs to be tracked"

        # 3. Test Disruption Triggers
        print("\n[3] Testing Landslide Disruption on veh-101...")
        res_landslide = vehicle_simulator.trigger_landslide_disruption("veh-101")
        veh_landslide = res_landslide["vehicle"]
        alerts_landslide = res_landslide["alerts"]
        print(f"  Landslide trigger response:")
        print(f"    Status: {veh_landslide['status']}")
        print(f"    Rerouted: {veh_landslide['rerouted']}")
        print(f"    Delay: +{veh_landslide['delay_minutes']}m")
        print(f"    Dynamic ETA: {veh_landslide['eta_minutes']}m")
        for a in alerts_landslide:
            print(f"    Alert dispatched: {a['title']} ({a['alert_type']})")
        assert veh_landslide["status"] == "REROUTING"
        assert veh_landslide["delay_minutes"] >= 95
        assert any(a["alert_type"] == "LANDSLIDE" for a in alerts_landslide)
        assert any(a["alert_type"] == "DELIVERY_DELAY" for a in alerts_landslide)

        print("\n[4] Testing Flood Disruption on veh-102...")
        res_flood = vehicle_simulator.trigger_flood_disruption("veh-102")
        veh_flood = res_flood["vehicle"]
        alerts_flood = res_flood["alerts"]
        print(f"  Flood trigger response:")
        print(f"    Status: {veh_flood['status']}")
        print(f"    Delay: +{veh_flood['delay_minutes']}m")
        print(f"    Dynamic ETA: {veh_flood['eta_minutes']}m")
        for a in alerts_flood:
            print(f"    Alert dispatched: {a['title']} ({a['alert_type']})")
        assert veh_flood["status"] == "CAUTION_SLOW"
        assert veh_flood["delay_minutes"] >= 60
        assert any(a["alert_type"] == "FLOOD" for a in alerts_flood)
        assert any(a["alert_type"] == "DELIVERY_DELAY" for a in alerts_flood)

        print("\n[5] Testing Blocked Pass Disruption on veh-103...")
        res_blocked = vehicle_simulator.trigger_blocked_road_disruption("veh-103")
        veh_blocked = res_blocked["vehicle"]
        alerts_blocked = res_blocked["alerts"]
        print(f"  Blocked road trigger response:")
        print(f"    Status: {veh_blocked['status']}")
        print(f"    Delay: +{veh_blocked['delay_minutes']}m")
        print(f"    Dynamic ETA: {veh_blocked['eta_minutes']}m")
        for a in alerts_blocked:
            print(f"    Alert dispatched: {a['title']} ({a['alert_type']})")
        assert veh_blocked["status"] == "EMERGENCY_HALT"
        assert veh_blocked["delay_minutes"] >= 180
        assert any(a["alert_type"] == "BLOCKED_ROAD" for a in alerts_blocked)
        assert any(a["alert_type"] == "DELIVERY_DELAY" for a in alerts_blocked)

        print("\n[6] Testing Delivery Delay on veh-104...")
        res_delay = vehicle_simulator.trigger_delivery_delay("veh-104", 45, "Severe Monsoonal Fog")
        veh_delay = res_delay["vehicle"]
        alt_delay = res_delay["alert"]
        print(f"  Delay trigger response:")
        print(f"    Status: {veh_delay['status']}")
        print(f"    Delay: +{veh_delay['delay_minutes']}m")
        print(f"    Dynamic ETA: {veh_delay['eta_minutes']}m")
        print(f"    Alert dispatched: {alt_delay['title']} ({alt_delay['alert_type']})")
        assert veh_delay["delay_minutes"] >= 45
        assert alt_delay["alert_type"] == "DELIVERY_DELAY"

        # 7. Test Alert Categories in DB
        print("\n[7] Verifying all 4 Alert Categories exist in DB...")
        all_alerts = db.query(AlertModel).all()
        categories_found = set(a.alert_type for a in all_alerts)
        print(f"  Alert types in DB ({len(all_alerts)} alerts): {categories_found}")
        assert any(t in ["BLOCKED_ROAD", "ROAD_SEVERED"] for t in categories_found), "Missing BLOCKED_ROAD alert category"
        assert any(t in ["FLOOD", "FLASH_FLOOD", "HEAVY_RAINFALL"] for t in categories_found), "Missing FLOOD alert category"
        assert any(t in ["LANDSLIDE", "LANDSLIDE_IMMINENT"] for t in categories_found), "Missing LANDSLIDE alert category"
        assert any(t in ["DELIVERY_DELAY"] for t in categories_found), "Missing DELIVERY_DELAY alert category"

        print("\n=======================================================")
        print(">>> ALL 7 FLEET & ALERT VERIFICATION TESTS PASSED! <<<")
        print("=======================================================\n")
    finally:
        db.close()

if __name__ == "__main__":
    test_fleet_and_alerts()
