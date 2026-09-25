"""
Machine Learning Training Pipeline for NER Road Disruption & Clearance Time Prediction
Trains an Ensemble Model on Geological, Meteorological, and Road Engineering indicators.
Saves model bundle and feature importance artifacts.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    roc_auc_score,
    f1_score,
    accuracy_score,
    precision_score,
    recall_score,
    mean_absolute_error
)

from dataset_generator import generate_ner_disruption_dataset

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_STORE_DIR = os.path.join(BASE_DIR, "model_store")
os.makedirs(MODEL_STORE_DIR, exist_ok=True)

CATEGORICAL_FEATURES = ["corridor", "state", "geology"]
NUMERICAL_FEATURES = [
    "slope_angle_deg",
    "elevation_m",
    "rainfall_24h_mm",
    "rainfall_72h_accum_mm",
    "soil_saturation_pct",
    "road_curvature_index",
    "drainage_capacity_score",
    "vegetation_loss_index",
    "historical_landslides",
    "heavy_truck_intensity"
]

ALL_FEATURES = CATEGORICAL_FEATURES + NUMERICAL_FEATURES

def train_and_export():
    print("Step 1: Generating and preparing synthetic-realistic NER dataset...")
    df = generate_ner_disruption_dataset(n_samples=15000, random_seed=42)
    csv_path = os.path.join(MODEL_STORE_DIR, "ner_training_data.csv")
    df.to_csv(csv_path, index=False)

    X = df[ALL_FEATURES]
    y_class = df["disruption_occurred"]
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y_class, test_size=0.2, random_state=42, stratify=y_class
    )
    
    print(f"Dataset split: Train={len(X_train)} samples, Test={len(X_test)} samples")
    
    # Preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )

    # Classification Pipeline (Disruption Probability)
    clf = RandomForestClassifier(
        n_estimators=120,
        max_depth=12,
        min_samples_split=4,
        random_state=42,
        n_jobs=-1
    )
    
    clf_pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("classifier", clf)
    ])

    print("Step 2: Training Disruption Classifier...")
    clf_pipeline.fit(X_train, y_train)

    # Evaluate Classifier
    y_pred = clf_pipeline.predict(X_test)
    y_prob = clf_pipeline.predict_proba(X_test)[:, 1]

    metrics = {
        "accuracy": round(float(accuracy_score(y_test, y_pred)), 4),
        "roc_auc": round(float(roc_auc_score(y_test, y_prob)), 4),
        "f1_score": round(float(f1_score(y_test, y_pred)), 4),
        "precision": round(float(precision_score(y_test, y_pred)), 4),
        "recall": round(float(recall_score(y_test, y_pred)), 4)
    }
    print("Classification Metrics:", json.dumps(metrics, indent=2))

    # Feature Importances
    cat_encoder = clf_pipeline.named_steps["preprocessor"].named_transformers_["cat"]
    cat_feature_names = list(cat_encoder.get_feature_names_out(CATEGORICAL_FEATURES))
    all_transformed_features = NUMERICAL_FEATURES + cat_feature_names
    rf_importances = clf_pipeline.named_steps["classifier"].feature_importances_

    # Aggregate by base feature
    feature_imp_dict = {}
    for feat_name, imp in zip(all_transformed_features, rf_importances):
        base_name = feat_name.split("_")[0] if feat_name in cat_feature_names else feat_name
        feature_imp_dict[base_name] = feature_imp_dict.get(base_name, 0.0) + float(imp)

    sorted_features = sorted(feature_imp_dict.items(), key=lambda x: x[1], reverse=True)
    top_features = [{"feature": k, "importance": round(v, 4)} for k, v in sorted_features]
    metrics["top_feature_importance"] = top_features
    print("Top Feature Importances:\n", top_features[:6])

    # Step 3: Train Regression Model for Clearance Time (conditional on disruption)
    print("Step 3: Training Clearance Time Regressor...")
    df_disrupted = df[df["disruption_occurred"] == 1].copy()
    X_reg = df_disrupted[ALL_FEATURES]
    y_reg = df_disrupted["clearance_time_hours"]

    reg_preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERICAL_FEATURES),
            ("cat", OneHotEncoder(handle_unknown="ignore", sparse_output=False), CATEGORICAL_FEATURES)
        ]
    )

    reg_model = GradientBoostingRegressor(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.08,
        random_state=42
    )

    reg_pipeline = Pipeline([
        ("preprocessor", reg_preprocessor),
        ("regressor", reg_model)
    ])

    reg_pipeline.fit(X_reg, y_reg)
    y_reg_pred = reg_pipeline.predict(X_reg)
    reg_mae = float(mean_absolute_error(y_reg, y_reg_pred))
    metrics["clearance_time_mae_hours"] = round(reg_mae, 2)
    print(f"Clearance Time Regressor MAE: {reg_mae:.2f} hours")

    # Step 4: Export artifacts
    clf_model_path = os.path.join(MODEL_STORE_DIR, "ner_disruption_classifier.joblib")
    reg_model_path = os.path.join(MODEL_STORE_DIR, "ner_clearance_regressor.joblib")
    metrics_path = os.path.join(MODEL_STORE_DIR, "model_metrics.json")

    joblib.dump(clf_pipeline, clf_model_path)
    joblib.dump(reg_pipeline, reg_model_path)
    
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"Models successfully trained and exported to: {MODEL_STORE_DIR}")
    return metrics

if __name__ == "__main__":
    train_and_export()
