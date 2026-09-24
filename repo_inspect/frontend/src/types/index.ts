export interface Segment {
  id: string;
  corridor_id: string;
  segment_order: number;
  start_point_name: string;
  end_point_name: string;
  distance_km: number;
  risk_level: 'Safe' | 'Medium' | 'High' | 'Critical' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  status: 'PASSABLE' | 'SLOW' | 'BLOCKED';
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  altitude_m: number;
  slope_deg: number;
  rainfall_mm?: number;
  landslide_history?: number;
  road_condition?: string;
  color?: string;
  polyline: [number, number][];
  alternate_route_polyline?: [number, number][];
}

export interface Corridor {
  id: string;
  name: string;
  route_name: string;
  state: string;
  total_length_km: number;
  status: 'OPEN' | 'CAUTION' | 'HIGH_RISK' | 'SEVERED';
  disruption_prob: number;
  active_incidents_count: number;
  slope_angle_deg: number;
  elevation_m: number;
  drainage_score: number;
  weather_condition: string;
  rainfall_24h_mm: number;
  soil_saturation_pct: number;
  geology: string;
  coordinates: [number, number][];
  segments?: Segment[];
}

export interface Vehicle {
  id: string;
  plate_number: string;
  vehicle_type: string;
  cargo_type: string;
  carrier_org: string;
  driver_name: string;
  driver_phone?: string;
  current_lat: number;
  current_lng: number;
  speed_kmh: number;
  heading_deg: number;
  status: 'IN_TRANSIT' | 'CAUTION_SLOW' | 'REROUTING' | 'DISPATCHED_TO_HAZARD' | 'EMERGENCY_HALT' | 'DELAYED';
  assigned_corridor_id?: string;
  origin_city: string;
  destination_city: string;
  eta_minutes: number;
  delay_minutes?: number;
  distance_remaining_km?: number;
  rerouted: boolean;
  reroute_reason?: string;
  route?: [number, number][];
  breadcrumb_trail?: [number, number][];
}

export interface Incident {
  id: string;
  category: 'Landslide' | 'Mudslide' | 'Bridge Washout' | 'Road Subsidence' | 'Waterlogging' | 'Tree Fall';
  severity: 'LOW' | 'MEDIUM' | 'SEVERE' | 'CRITICAL_CUTOFF';
  corridor_id?: string;
  location_name: string;
  latitude: number;
  longitude: number;
  description?: string;
  photo_url?: string;
  reported_by: string;
  reporter_role: string;
  status: 'REPORTED' | 'VERIFIED' | 'IN_CLEARANCE' | 'RESOLVED';
  verified_by?: string;
  clearance_eta_hours: number;
  upvotes: number;
  reported_at: string;
  resolved_at?: string;
}

export interface Alert {
  id: string;
  corridor_id?: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'DANGER' | 'CRITICAL';
  alert_type: 'BLOCKED_ROAD' | 'FLOOD' | 'LANDSLIDE' | 'DELIVERY_DELAY' | 'ROAD_SEVERED' | 'HEAVY_RAINFALL' | string;
  target_audience: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  affected_vehicle_id?: string;
  delay_hours?: number;
}

export interface WeatherData {
  location: string;
  state: string;
  lat: number;
  lng: number;
  temperature_c: number;
  humidity_pct: number;
  precipitation_mm: number;
  wind_speed_kmh: number;
  soil_moisture_pct: number;
  weather_condition: string;
  warning_level: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
}

export interface RouteSegmentDetail {
  segment_name: string;
  corridor_name: string;
  distance_km: number;
  risk_level: string;
  risk_score: number;
  slope_deg: number;
  weather: string;
  passable: boolean;
}

export interface RouteOption {
  route_id: string;
  route_name: string;
  is_recommended: boolean;
  total_distance_km: number;
  estimated_time_minutes: number;
  overall_risk_score: number;
  risk_category: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  disruption_points_count: number;
  elevation_gain_m: number;
  waypoints: [number, number][];
  segments: RouteSegmentDetail[];
  advisories: string[];
}

export interface RouteCalculationResponse {
  origin: string;
  destination: string;
  primary_route: RouteOption;
  safe_alternate_route?: RouteOption;
  all_options: RouteOption[];
  summary: string;
}

export interface DisruptionPredictionRequest {
  corridor: string;
  state: string;
  slope_angle_deg: number;
  elevation_m: number;
  geology: string;
  rainfall_24h_mm: number;
  rainfall_72h_accum_mm: number;
  soil_saturation_pct: number;
  road_curvature_index: number;
  drainage_capacity_score: number;
  vegetation_loss_index: number;
  historical_landslides: number;
  heavy_truck_intensity: number;
}

export interface DisruptionPredictionResponse {
  disruption_probability: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  disruption_predicted: boolean;
  predicted_hazard_type: string;
  estimated_clearance_hours: number;
  confidence_score: number;
  top_contributing_factors: {
    factor: string;
    value: string;
    impact_weight: number;
    status: 'NORMAL' | 'WARNING' | 'DANGER';
  }[];
  recommendation: string;
}

export interface AnalyticsSummary {
  kpi_metrics: {
    active_corridors_monitored: number;
    total_monitored_km: number;
    active_fleet_trucks: number;
    freight_safely_rerouted_pct: number;
    avg_clearance_time_hours: number;
    estimated_freight_delay_prevented_hrs: number;
    fuel_wastage_prevented_litres: number;
    economic_loss_averted_cr_inr: number;
  };
  state_vulnerability: {
    state: string;
    vulnerability_index: number;
    active_hazards: number;
    risk_category: string;
    lifelines: string;
  }[];
  disruption_trends_30d: {
    day: string;
    landslides: number;
    rainfall_mm: number;
    delayed_trucks: number;
  }[];
  hazard_distribution: {
    name: string;
    percentage: number;
    count: number;
  }[];
  corridor_health: {
    corridor: string;
    status: string;
    throughput_pct: number;
    avg_delay_hrs: number;
    open_segments: string;
  }[];
}

export interface AlternateRouteBypass {
  bypass_name: string;
  distance_km: number;
  eta_minutes: number;
  risk_level: string;
  color: string;
  advisory: string;
  waypoints: [number, number][];
}

export interface RoadRiskPredictionRequest {
  segment_id?: string;
  corridor_name?: string;
  rainfall_mm: number;
  landslide_history: number;
  road_condition: string; // "Poor" | "Fair" | "Good" | "Excellent"
  slope_angle_deg?: number;
  elevation_m?: number;
}

export interface RoadRiskPredictionResponse {
  segment_id?: string;
  risk_level: 'Safe' | 'Medium' | 'High' | 'Critical';
  color: string; // "#10B981" | "#EAB308" | "#EF4444" | "#DC2626"
  risk_score: number;
  disruption_probability: number;
  confidence_score: number;
  predicted_hazard_type: string;
  estimated_clearance_hours: number;
  alternate_route_suggested: boolean;
  alternate_route?: AlternateRouteBypass;
  top_contributing_factors: {
    factor: string;
    value: string;
    status: 'NORMAL' | 'WARNING' | 'DANGER';
  }[];
  recommendation: string;
}

