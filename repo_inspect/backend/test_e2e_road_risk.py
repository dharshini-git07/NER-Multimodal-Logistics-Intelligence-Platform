import sys
import os
sys.path.insert(0, os.path.abspath('.'))

from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_all():
    # 1. Test GET /api/v1/corridors/segments
    res = client.get('/api/v1/corridors/segments')
    assert res.status_code == 200, f"Status: {res.status_code}"
    segments = res.json()
    print(f"Retrieved {len(segments)} road segments.")
    colors = set(s['color'] for s in segments)
    print("Segment colors present in DB:", colors)
    alt_count = sum(1 for s in segments if s.get('alternate_route_polyline'))
    print(f"Segments with alternate routes: {alt_count}")

    # 2. Test Safe Prediction
    safe_req = {
        'rainfall_mm': 15.0,
        'landslide_history': 0,
        'road_condition': 'Excellent',
        'corridor_name': 'NH-27'
    }
    r_safe = client.post('/api/v1/predict/road-risk', json=safe_req).json()
    print(f"Safe Case Result: risk_level={r_safe['risk_level']}, color={r_safe['color']}")
    assert r_safe['risk_level'] == 'Safe'
    assert r_safe['color'] == '#10B981'

    # 3. Test Medium Prediction
    med_req = {
        'rainfall_mm': 45.0,
        'landslide_history': 1,
        'road_condition': 'Fair',
        'corridor_name': 'NH-29'
    }
    r_med = client.post('/api/v1/predict/road-risk', json=med_req).json()
    print(f"Medium Case Result: risk_level={r_med['risk_level']}, color={r_med['color']}")
    assert r_med['risk_level'] == 'Medium'
    assert r_med['color'] == '#EAB308'

    # 4. Test High / Critical with Alternate Route
    crit_req = {
        'rainfall_mm': 140.0,
        'landslide_history': 6,
        'road_condition': 'Poor',
        'corridor_name': 'NH-6'
    }
    r_crit = client.post('/api/v1/predict/road-risk', json=crit_req).json()
    print(f"Critical Case Result: risk_level={r_crit['risk_level']}, color={r_crit['color']}")
    assert r_crit['risk_level'] in ['High', 'Critical']
    assert r_crit['color'] in ['#EF4444', '#DC2626']
    assert r_crit['alternate_route'] is not None
    print(f"Alternate bypass suggested: {r_crit['alternate_route']['bypass_name']} ({r_crit['alternate_route']['distance_km']} km)")

    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == '__main__':
    test_all()
