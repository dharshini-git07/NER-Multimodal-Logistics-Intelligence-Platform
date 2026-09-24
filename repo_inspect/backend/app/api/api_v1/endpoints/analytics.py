from fastapi import APIRouter
from typing import Dict, Any, List

router = APIRouter()

@router.get("/summary")
def get_analytics_summary() -> Dict[str, Any]:
    """
    Returns analytics KPIs, regional vulnerability index across 8 NER states,
    30-day disruption trendlines, and freight delay economics.
    """
    state_vulnerability = [
        {"state": "Sikkim", "vulnerability_index": 88, "active_hazards": 6, "risk_category": "CRITICAL", "lifelines": "NH-10 Severed"},
        {"state": "Meghalaya", "vulnerability_index": 82, "active_hazards": 8, "risk_category": "CRITICAL", "lifelines": "NH-6 High Disruption"},
        {"state": "Arunachal Pradesh", "vulnerability_index": 76, "active_hazards": 5, "risk_category": "HIGH", "lifelines": "NH-13 Sela Slopes"},
        {"state": "Nagaland", "vulnerability_index": 68, "active_hazards": 4, "risk_category": "HIGH", "lifelines": "NH-29 Mudslides"},
        {"state": "Manipur", "vulnerability_index": 59, "active_hazards": 3, "risk_category": "MODERATE", "lifelines": "NH-2 / NH-37"},
        {"state": "Mizoram", "vulnerability_index": 54, "active_hazards": 2, "risk_category": "MODERATE", "lifelines": "NH-306 Slower Transit"},
        {"state": "Assam", "vulnerability_index": 38, "active_hazards": 3, "risk_category": "LOW_MODERATE", "lifelines": "NH-27 Passable Bypass"},
        {"state": "Tripura", "vulnerability_index": 32, "active_hazards": 1, "risk_category": "LOW", "lifelines": "NH-8 Normal Operations"}
    ]

    disruption_trends_30d = [
        {"day": "Day 1", "landslides": 2, "rainfall_mm": 25, "delayed_trucks": 45},
        {"day": "Day 5", "landslides": 4, "rainfall_mm": 55, "delayed_trucks": 80},
        {"day": "Day 10", "landslides": 9, "rainfall_mm": 120, "delayed_trucks": 190},
        {"day": "Day 15", "landslides": 14, "rainfall_mm": 185, "delayed_trucks": 340}, # Peak monsoon spell
        {"day": "Day 20", "landslides": 11, "rainfall_mm": 140, "delayed_trucks": 260},
        {"day": "Day 25", "landslides": 6, "rainfall_mm": 70, "delayed_trucks": 130},
        {"day": "Day 30", "landslides": 8, "rainfall_mm": 95, "delayed_trucks": 175}
    ]

    hazard_distribution = [
        {"name": "Mountain Landslide / Rockfall", "percentage": 46, "count": 68},
        {"name": "Mudslide & Debris Flow", "percentage": 24, "count": 35},
        {"name": "Highway Waterlogging / Flood", "percentage": 16, "count": 24},
        {"name": "Bridge / Culvert Subsidence", "percentage": 9, "count": 13},
        {"name": "Tree Fall / Road Cavity", "percentage": 5, "count": 8}
    ]

    corridor_health = [
        {"corridor": "NH-6 (Guwahati-Silchar)", "status": "HIGH_RISK", "throughput_pct": 35, "avg_delay_hrs": 12.5, "open_segments": "3/5"},
        {"corridor": "NH-29 (Dimapur-Kohima)", "status": "CAUTION", "throughput_pct": 68, "avg_delay_hrs": 3.8, "open_segments": "3/4"},
        {"corridor": "NH-10 (Siliguri-Gangtok)", "status": "SEVERED", "throughput_pct": 5, "avg_delay_hrs": 34.0, "open_segments": "0/2"},
        {"corridor": "NH-27 (East-West Bypass)", "status": "OPEN", "throughput_pct": 94, "avg_delay_hrs": 0.8, "open_segments": "2/2"},
        {"corridor": "NH-13 (Trans-Arunachal)", "status": "CAUTION", "throughput_pct": 62, "avg_delay_hrs": 5.2, "open_segments": "3/4"}
    ]

    kpi_metrics = {
        "active_corridors_monitored": 8,
        "total_monitored_km": 1750,
        "active_fleet_trucks": 542,
        "freight_safely_rerouted_pct": 91.4,
        "avg_clearance_time_hours": 11.2,
        "estimated_freight_delay_prevented_hrs": 4250,
        "fuel_wastage_prevented_litres": 18400,
        "economic_loss_averted_cr_inr": 8.65
    }

    return {
        "kpi_metrics": kpi_metrics,
        "state_vulnerability": state_vulnerability,
        "disruption_trends_30d": disruption_trends_30d,
        "hazard_distribution": hazard_distribution,
        "corridor_health": corridor_health
    }
