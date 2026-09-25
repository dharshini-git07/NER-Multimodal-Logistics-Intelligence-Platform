"""
Dataset Generator for North Eastern Region (NER) Road Disruption Prediction
Generates realistic geo-meteorological data modeled after Geological Survey of India (GSI)
and India Meteorological Department (IMD) historical landslide patterns in NER.
"""

import numpy as np
import pandas as pd
import os

STATES = ["Assam", "Meghalaya", "Arunachal Pradesh", "Nagaland", "Manipur", "Mizoram", "Tripura", "Sikkim"]

CORRIDORS = [
    {"name": "NH-6", "route": "Guwahati-Shillong-Silchar-Aizawl", "state": "Meghalaya", "avg_slope": 38.0, "elev": 1400},
    {"name": "NH-29", "route": "Dimapur-Kohima-Imphal", "state": "Nagaland", "avg_slope": 42.0, "elev": 1500},
    {"name": "NH-10", "route": "Siliguri-Sevoke-Gangtok", "state": "Sikkim", "avg_slope": 45.0, "elev": 1200},
    {"name": "NH-27", "route": "Bongaigaon-Guwahati-Nagaon", "state": "Assam", "avg_slope": 12.0, "elev": 80},
    {"name": "NH-13", "route": "Pasighat-Itanagar-Tawang", "state": "Arunachal Pradesh", "avg_slope": 50.0, "elev": 2200},
    {"name": "NH-102", "route": "Imphal-Pallel-Moreh", "state": "Manipur", "avg_slope": 32.0, "elev": 950},
    {"name": "NH-208", "route": "Agartala-Khowai-Sabroom", "state": "Tripura", "avg_slope": 18.0, "elev": 120},
    {"name": "NH-715", "route": "Tezpur-Jorhat-Golaghat", "state": "Assam", "avg_slope": 15.0, "elev": 95}
]

GEOLOGICAL_TYPES = ["Fractured Shale", "Sandstone-Siltstone", "Gneiss-Schist", "Alluvial Silt", "Limestone Karst"]

def generate_ner_disruption_dataset(n_samples: int = 12000, random_seed: int = 42) -> pd.DataFrame:
    np.random.seed(random_seed)
    
    corridor_choices = np.random.choice(len(CORRIDORS), size=n_samples)
    corridor_data = [CORRIDORS[i] for i in corridor_choices]
    
    corridor_names = [c["name"] for c in corridor_data]
    states = [c["state"] for c in corridor_data]
    base_slopes = np.array([c["avg_slope"] for c in corridor_data])
    base_elev = np.array([c["elev"] for c in corridor_data])
    
    # Geological and Terrain features
    slope_angle = np.clip(base_slopes + np.random.normal(0, 6.5, size=n_samples), 8.0, 68.0)
    elevation = np.clip(base_elev + np.random.normal(0, 300, size=n_samples), 50.0, 3800.0)
    geology = np.random.choice(GEOLOGICAL_TYPES, size=n_samples, p=[0.35, 0.25, 0.20, 0.15, 0.05])
    
    # Meteorological features (simulate seasonal monsoon vs dry months)
    is_monsoon = np.random.binomial(1, 0.45, size=n_samples)
    
    # Monsoon rainfall can exceed 250mm/day in Meghalaya / Cherrapunji / Arunachal foothills
    rainfall_24h = np.where(
        is_monsoon == 1,
        np.random.exponential(scale=55.0, size=n_samples) + np.random.uniform(10, 80, size=n_samples),
        np.random.exponential(scale=8.0, size=n_samples)
    )
    rainfall_24h = np.clip(rainfall_24h, 0.0, 320.0)
    
    # 72-hour cumulative precipitation (crucial for soil pore water saturation)
    rainfall_72h = rainfall_24h * np.random.uniform(1.8, 3.2, size=n_samples) + np.random.uniform(0, 40, size=n_samples)
    rainfall_72h = np.clip(rainfall_72h, 0.0, 650.0)
    
    soil_saturation = np.clip(
        (rainfall_72h / 450.0) * 80.0 + np.random.normal(15, 10, size=n_samples),
        5.0, 99.0
    )
    
    # Engineering & Road Vulnerability factors
    road_curvature = np.clip(np.random.normal(6.0, 2.0, size=n_samples), 1.0, 10.0)
    drainage_capacity = np.clip(np.random.normal(5.0, 2.2, size=n_samples), 1.0, 10.0)
    vegetation_loss = np.clip(np.random.beta(2, 3, size=n_samples), 0.05, 0.95)
    hist_landslides = np.random.poisson(lam=np.where(slope_angle > 35, 3.8, 0.8), size=n_samples)
    heavy_truck_intensity = np.clip(np.random.normal(1200, 400, size=n_samples), 100, 3000)

    # Geological vulnerability multiplier
    geo_multiplier = np.where(geology == "Fractured Shale", 1.45,
                     np.where(geology == "Sandstone-Siltstone", 1.20,
                     np.where(geology == "Gneiss-Schist", 1.10,
                     np.where(geology == "Alluvial Silt", 0.95, 0.80))))

    # Physics-based landslide & disruption logit calculation
    # High rainfall + steep slope + saturated soil + poor drainage = disruption
    logit = (
        -4.2
        + (rainfall_24h / 40.0) * 1.1
        + (rainfall_72h / 120.0) * 1.6
        + ((slope_angle - 25.0) / 10.0) * 1.2
        + (soil_saturation / 100.0) * 1.8
        - (drainage_capacity / 10.0) * 1.5
        + (vegetation_loss * 1.3)
        + (hist_landslides * 0.25)
    ) * geo_multiplier

    prob_disruption = 1.0 / (1.0 + np.exp(-logit))
    prob_disruption = np.clip(prob_disruption, 0.01, 0.99)
    
    # Disruption outcome
    disruption_occurred = np.random.binomial(1, prob_disruption)
    
    # Categorize Hazard Type when disruption occurs
    hazard_types = []
    clearance_hours = []
    
    for i in range(n_samples):
        if disruption_occurred[i] == 0:
            hazard_types.append("None")
            clearance_hours.append(0.0)
        else:
            slp = slope_angle[i]
            rain = rainfall_24h[i]
            if slp > 35 and rain > 60:
                htype = "Major Landslide / Rockfall"
                chours = float(np.random.gamma(shape=4.0, scale=4.5)) # ~18h avg
            elif slp > 25 and soil_saturation[i] > 75:
                htype = "Mudslide & Debris Flow"
                chours = float(np.random.gamma(shape=3.0, scale=2.5)) # ~7.5h avg
            elif slp <= 20 and rain > 100:
                htype = "Flash Flood & Highway Waterlogging"
                chours = float(np.random.gamma(shape=2.5, scale=3.0)) # ~7.5h avg
            elif hist_landslides[i] > 3:
                htype = "Road Subsidence & Edge Collapse"
                chours = float(np.random.gamma(shape=5.0, scale=4.0)) # ~20h avg
            else:
                htype = "Tree Fall & Rock Obstruction"
                chours = float(np.random.gamma(shape=1.8, scale=1.5)) # ~2.7h avg
            
            clearance_hours.append(round(min(chours, 72.0), 1))
            hazard_types.append(htype)
            
    df = pd.DataFrame({
        "corridor": corridor_names,
        "state": states,
        "slope_angle_deg": np.round(slope_angle, 2),
        "elevation_m": np.round(elevation, 1),
        "geology": geology,
        "rainfall_24h_mm": np.round(rainfall_24h, 2),
        "rainfall_72h_accum_mm": np.round(rainfall_72h, 2),
        "soil_saturation_pct": np.round(soil_saturation, 1),
        "road_curvature_index": np.round(road_curvature, 1),
        "drainage_capacity_score": np.round(drainage_capacity, 1),
        "vegetation_loss_index": np.round(vegetation_loss, 3),
        "historical_landslides": hist_landslides,
        "heavy_truck_intensity": np.round(heavy_truck_intensity, 0).astype(int),
        "disruption_prob": np.round(prob_disruption, 4),
        "disruption_occurred": disruption_occurred,
        "hazard_type": hazard_types,
        "clearance_time_hours": clearance_hours
    })
    
    return df

if __name__ == "__main__":
    out_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(out_dir, "ner_disruption_dataset.csv")
    print("Generating NER Landslide and Disruption Dataset...")
    df = generate_ner_disruption_dataset(12000)
    df.to_csv(data_path, index=False)
    print(f"Generated {len(df)} records. Saved to: {data_path}")
    print(f"Disruption rate: {df['disruption_occurred'].mean()*100:.2f}%")
    print("Hazard distribution:\n", df[df['disruption_occurred']==1]['hazard_type'].value_counts())
