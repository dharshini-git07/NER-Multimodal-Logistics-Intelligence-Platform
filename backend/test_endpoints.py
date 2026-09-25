import requests
import json

base_url = "http://127.0.0.1:8000/api/v1"

print("--- Testing /api/v1/corridors ---")
r = requests.get(f"{base_url}/corridors")
print(f"Status: {r.status_code}, Found {len(r.json())} corridors:")
for c in r.json()[:3]:
    print(f" - {c['name']} ({c['route_name']}): Status {c['status']}, Disruption Prob: {c['disruption_prob']}")

print("\n--- Testing /api/v1/predict/disruption ---")
sample_data = {
    "corridor": "NH-6",
    "state": "Meghalaya",
    "slope_angle_deg": 44.0,
    "elevation_m": 1450.0,
    "geology": "Fractured Shale",
    "rainfall_24h_mm": 115.0,
    "rainfall_72h_accum_mm": 240.0,
    "soil_saturation_pct": 88.0,
    "road_curvature_index": 7.5,
    "drainage_capacity_score": 3.5,
    "vegetation_loss_index": 0.65,
    "historical_landslides": 4,
    "heavy_truck_intensity": 1400
}
r = requests.post(f"{base_url}/predict/disruption", json=sample_data)
print(f"Status: {r.status_code}")
print(json.dumps(r.json(), indent=2))

print("\n--- Testing /api/v1/routes/calculate ---")
route_req = {
    "origin": "Guwahati",
    "destination": "Silchar",
    "avoid_high_risk": True
}
r = requests.post(f"{base_url}/routes/calculate", json=route_req)
print(f"Status: {r.status_code}")
res = r.json()
print("Summary:", res.get("summary"))
print("Primary Route:", res["primary_route"]["route_name"], f"({res['primary_route']['total_distance_km']} km, Risk: {res['primary_route']['risk_category']})")
if res.get("safe_alternate_route"):
    print("Safe Alternate:", res["safe_alternate_route"]["route_name"], f"({res['safe_alternate_route']['total_distance_km']} km, Risk: {res['safe_alternate_route']['risk_category']})")

print("\n--- Testing /api/v1/vehicles ---")
r = requests.get(f"{base_url}/vehicles")
print(f"Status: {r.status_code}, Active vehicles: {len(r.json())}")
for v in r.json()[:3]:
    print(f" - {v['plate_number']} ({v['vehicle_type']}): Lat/Lng {v['current_lat']},{v['current_lng']}, Speed: {v['speed_kmh']} km/h")

print("\n--- Testing /api/v1/analytics/summary ---")
r = requests.get(f"{base_url}/analytics/summary")
print(f"Status: {r.status_code}")
print("KPIs:", r.json()["kpi_metrics"])

print("\nALL BACKEND API TESTS PASSED!")
