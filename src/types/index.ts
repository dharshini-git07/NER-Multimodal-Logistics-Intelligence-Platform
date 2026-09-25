export type TransportMode = 'ROAD' | 'RAIL' | 'WATERWAY' | 'AIR' | 'TRANSFER';

export type CargoPriority = 'BALANCED' | 'SAFETY' | 'SPEED' | 'COST' | 'ECO';

export interface Vehicle {
  id: string;
  plate_number: string;
  shipment_id?: string;
  vehicle_type: string;
  cargo_type: string;
  cargo_weight_tons?: number;
  carrier_org: string;
  driver_name: string;
  driver_phone: string;
  current_lat: number;
  current_lng: number;
  speed_kmh: number;
  heading_deg: number;
  status: 'ON_SCHEDULE' | 'DELAYED' | 'REROUTING' | 'EMERGENCY_HALT' | 'CAUTION_SLOW' | string;
  assigned_corridor_id?: string;
  origin_city: string;
  destination_city: string;
  eta_minutes: number;
  delay_minutes?: number;
  distance_remaining_km?: number;
  rerouted?: boolean;
  reroute_reason?: string;
  route?: [number, number][];
  breadcrumb_trail?: [number, number][];
  route_idx?: number;
  progress?: number;
  current_mode?: string;
  shortage_risk?: string;
  priority_level?: string;
  cargo_category?: string;
}

export interface Incident {
  id: string;
  title?: string;
  description: string;
  location_name: string;
  corridor_id?: string;
  segment_id?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  severity: 'MODERATE' | 'SEVERE' | 'CRITICAL_CUTOFF' | string;
  incident_type?: 'LANDSLIDE' | 'FLOOD' | 'BRIDGE_WASHOUT' | 'ROAD_BLOCK' | string;
  category?: string;
  status: 'REPORTED' | 'IN_CLEARANCE' | 'RESOLVED' | 'VERIFIED' | string;
  upvotes_count?: number;
  upvotes?: number;
  clearance_eta_hours?: number;
  reported_by?: string;
  reporter_role?: string;
  verified_by?: string;
  photo_url?: string;
  created_at?: string;
  reported_at?: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'DANGER' | 'CRITICAL';
  alert_type: string;
  corridor_id?: string;
  target_audience?: string;
  is_active?: boolean;
  created_at: string;
}

export interface WeatherData {
  id?: string;
  location_name?: string;
  location?: string;
  state: string;
  lat: number;
  lng: number;
  rainfall_mm_24h?: number;
  precipitation_mm?: number;
  temp_c?: number;
  temperature_c?: number;
  humidity_pct?: number;
  wind_kmh?: number;
  wind_speed_kmh?: number;
  soil_moisture_pct?: number;
  condition?: string;
  weather_condition?: string;
  warning_level?: string;
  alert_level?: 'NORMAL' | 'HEAVY_RAIN' | 'CLOUDBURST_WARNING' | string;
  updated_at?: string;
}

export interface TransshipmentPoint {
  hub_id?: string;
  hub_name: string;
  hub_type?: string;
  coordinates?: [number, number];
  from_mode: TransportMode;
  to_mode: TransportMode;
  transfer_time_minutes: number;
  handling_cost_inr?: number;
  handling_fee_inr?: number;
}

export interface RouteSegmentDetail {
  segment_id?: string;
  segment_name?: string;
  corridor_name?: string;
  start_name?: string;
  end_name?: string;
  distance_km: number;
  mode: TransportMode;
  risk_level: string;
  risk_score?: number;
  slope_deg?: number;
  weather?: string;
  passable?: boolean;
  operator?: string;
  operator_name?: string;
  transit_speed_kmh?: number;
  estimated_cost_inr?: number;
  carbon_kg?: number;
  travel_time_minutes?: number;
}

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

export type CargoCategory =
  | 'Medicine'
  | 'Food'
  | 'Construction'
  | 'Agriculture'
  | 'Relief'
  | 'Construction Material'
  | 'Agricultural Produce'
  | 'Relief / Emergency Supplies'
  | 'General Cargo';

export interface ShortageAssessment {
  days_remaining: number; // calculated: current_stock / daily_consumption
  eta_days: number;
  shortage_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  is_breached: boolean;
  explanation: string;
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
  // Multimodal extensions
  mode?: TransportMode;
  modes_used?: TransportMode[];
  transshipment_points?: TransshipmentPoint[];
  carbon_emissions_kg?: number;
  estimated_cost_inr?: number;
  cargo_capacity_tons?: number;
  priority_match?: CargoPriority;
  capacity_constrained?: boolean;
  capacity_constraint_reason?: string;
  why_this_route?: string | string[];
  shortage_window_fit?: 'OPTIMAL' | 'ACCEPTABLE' | 'BREACHED';
  shortage_assessment?: ShortageAssessment;
}

export interface SupplyStockItem {
  id: string;
  location_name: string;
  facility_type: string;
  state: string;
  commodity: string;
  cargo_category: CargoCategory;
  current_stock: number;
  unit: string;
  daily_consumption: number;
  days_remaining: number; // calculated: current_stock / daily_consumption
  days_remaining_stock?: number;
  expected_delivery_days: number;
  shortage_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  shortage_risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommended_action: string;
  recommended_mode: TransportMode | 'HYBRID' | string;
  origin_hub: string;
  criticality: 'CRITICAL' | 'HIGH' | 'STANDARD';
  last_updated: string;
  item_name?: string;
  destination_facility?: string;
  city_destination?: string;
}

export interface RouteCalculationResponse {
  origin: string;
  destination: string;
  primary_route: RouteOption;
  safe_alternate_route?: RouteOption;
  all_options: RouteOption[];
  summary: string;
  // Dedicated modal alternatives
  rail_route?: RouteOption;
  air_route?: RouteOption;
  waterway_route?: RouteOption;
  multimodal_route?: RouteOption;
}

export interface ModalNetworkNode {
  id: string;
  name: string;
  state: string;
  node_type: 'ROAD_HUB' | 'RAILWAY_STATION' | 'AIRPORT' | 'RIVER_PORT' | 'LOGISTICS_HUB';
  coordinates: [number, number];
  handling_capacity_tons_day: number;
  modes: TransportMode[];
}

export interface ModalNetworkEdge {
  id: string;
  source: string;
  destination: string;
  mode: TransportMode;
  corridor_name: string;
  distance_km: number;
  avg_speed_kmh: number;
  risk_score: number;
  cost_per_ton_km_inr: number;
  carbon_per_ton_km_g: number;
  status: 'OPERATIONAL' | 'CONGESTED' | 'DISRUPTED' | 'SEASONAL_RESTRICTION';
  geometry: [number, number][];
}

export interface ModalNetworkData {
  nodes: ModalNetworkNode[];
  edges: ModalNetworkEdge[];
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
  total_corridors_monitored?: number;
  active_convoys_count?: number;
  disruptions_active?: number;
  rerouted_convoys_today?: number;
  high_risk_percentage?: number;
  avg_delay_minutes?: number;
  disaster_avoidance_rate_pct?: number;
  estimated_economic_loss_prevented_cr?: number;
  kpi_metrics?: {
    active_corridors_monitored?: number;
    total_corridors_monitored?: number;
    total_monitored_km?: number;
    active_fleet_trucks?: number;
    freight_safely_rerouted_pct?: number;
    avg_clearance_time_hours?: number;
    estimated_freight_delay_prevented_hrs?: number;
    fuel_wastage_prevented_litres?: number;
    economic_loss_averted_cr_inr?: number;
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
  road_condition: string;
  slope_angle_deg?: number;
  elevation_m?: number;
}

export interface RoadRiskPredictionResponse {
  segment_id?: string;
  risk_level: 'Safe' | 'Medium' | 'High' | 'Critical';
  color: string;
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
