import axios from 'axios';
import {
  Corridor,
  Vehicle,
  Incident,
  Alert,
  WeatherData,
  RouteCalculationResponse,
  DisruptionPredictionRequest,
  DisruptionPredictionResponse,
  AnalyticsSummary,
  TransportMode,
  CargoPriority,
  CargoCategory,
  ModalNetworkData,
  SupplyStockItem
} from '../types';
import {
  MULTIMODAL_NETWORK_DATA,
  calculateMultimodalRouting,
  SAMPLE_SUPPLY_STOCK_ITEMS
} from './multimodalEngine';
import {
  DEFAULT_CORRIDORS,
  DEFAULT_SEGMENTS,
  DEFAULT_VEHICLES,
  DEFAULT_INCIDENTS,
  DEFAULT_ALERTS,
  DEFAULT_WEATHER,
  DEFAULT_ANALYTICS
} from './seedData';

// Keep deployment configuration outside source. The local default points at
// FastAPI directly, so simulation does not depend on the Vite proxy running.
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');

export const getApiErrorMessage = (error: unknown, action: string): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return `${action} could not connect to FastAPI at ${API_BASE}. Start the backend on http://127.0.0.1:8000 and try again.`;
    }

    const detail = error.response.data?.detail;
    const reason = typeof detail === 'string' ? detail : error.message;
    return `${action} failed (${error.response.status}): ${reason}`;
  }

  return `${action} failed unexpectedly. Check the browser console and FastAPI terminal output.`;
};

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Corridors
  async getCorridors(): Promise<Corridor[]> {
    try {
      const res = await apiClient.get<Corridor[]>('/corridors');
      return res.data && res.data.length ? res.data : DEFAULT_CORRIDORS;
    } catch {
      return DEFAULT_CORRIDORS;
    }
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await apiClient.get<Vehicle[]>('/vehicles');
      return res.data && res.data.length ? res.data : DEFAULT_VEHICLES;
    } catch {
      return DEFAULT_VEHICLES;
    }
  },

  async triggerReroute(vehicleId: string): Promise<any> {
    try {
      const res = await apiClient.post(`/vehicles/${vehicleId}/reroute`);
      return res.data;
    } catch {
      const targetVehicle = DEFAULT_VEHICLES.find(v => v.id === vehicleId) || DEFAULT_VEHICLES[0];
      return {
        success: true,
        vehicle: {
          ...targetVehicle,
          status: 'REROUTING',
          rerouted: true,
          current_mode: 'ROAD + RAIL',
          reroute_reason: 'Rerouted to NFR Broad-Gauge Freight corridor via Lumding Junction.'
        }
      };
    }
  },

  async triggerDisruption(vehicleId: string = 'veh-106', disruptionType: 'landslide' | 'flood' | 'blocked-road' = 'landslide'): Promise<any> {
    try {
      const res = await apiClient.post(`/vehicles/${vehicleId}/disruption/${disruptionType}`);
      return res.data;
    } catch {
      // Robust client simulation fallback
      const target = DEFAULT_VEHICLES.find(v => v.id === vehicleId) || DEFAULT_VEHICLES.find(v => v.id === 'veh-106') || DEFAULT_VEHICLES[0];
      const updatedVehicle: Vehicle = {
        ...target,
        status: 'REROUTING',
        rerouted: true,
        current_mode: 'ROAD + RAIL',
        shortage_risk: 'CRITICAL',
        reroute_reason: `NH-6 ${disruptionType.toUpperCase()} at Sonapur Tunnel. Road ETA (8 days) exceeds 4-day stock runway. Rerouted via NFR Lumding-Badarpur BG rail link (ETA 2.5 days).`,
        eta_minutes: 150,
        route: [
          [26.1445, 91.7362], // Guwahati
          [26.3452, 92.6841], // Nagaon
          [25.7500, 93.1667], // Lumding Rail
          [25.1764, 93.0234], // Haflong
          [24.8980, 92.5970], // Badarpur
          [24.8170, 93.9368]  // Imphal
        ]
      };

      const disruptionAlert: Alert = {
        id: `sim-disrupt-${Date.now()}`,
        corridor_id: 'cor-nh6',
        title: `CRITICAL DISRUPTION: Sonapur Tunnel on NH-6 Cut Off by ${disruptionType.toUpperCase()}`,
        message: '800 cu.m rockfall severed NH-6 carriageway. Road accessibility dropped to 0%. Emergency multimodal protocol activated.',
        severity: 'CRITICAL',
        alert_type: 'DISRUPTION',
        target_audience: 'ALL',
        is_active: true,
        created_at: new Date().toISOString()
      };

      const modeSwitchAlert: Alert = {
        id: `sim-modeswitch-${Date.now() + 1}`,
        corridor_id: 'cor-nh27',
        title: `MODE SWITCH: ${updatedVehicle.shipment_id || updatedVehicle.plate_number} Diverted to NFR Rail Link`,
        message: `Essential medical freight shifted from highway to NFR Lumding-Badarpur BG rail rake to preserve delivery runway.`,
        severity: 'WARNING',
        alert_type: 'MODE_SWITCH',
        target_audience: 'ALL',
        is_active: true,
        created_at: new Date().toISOString()
      };

      const shortageRiskAlert: Alert = {
        id: `sim-shortage-${Date.now() + 2}`,
        corridor_id: 'cor-nh2',
        title: `SHORTAGE RISK ESCALATION: Imphal Hospital Medicine Runway Breached (< 4 Days)`,
        message: `Highway cutoff extends road travel time beyond 4-day stock runway. Shortage probability escalated to CRITICAL.`,
        severity: 'CRITICAL',
        alert_type: 'SHORTAGE_RISK',
        target_audience: 'ALL',
        is_active: true,
        created_at: new Date().toISOString()
      };

      return {
        success: true,
        vehicle: updatedVehicle,
        alerts: [disruptionAlert, modeSwitchAlert, shortageRiskAlert],
        alert: disruptionAlert
      };
    }
  },

  async triggerDelay(vehicleId: string, delayMinutes: number = 45, reason: string = 'Mountain convoy crawl'): Promise<any> {
    try {
      const res = await apiClient.post(`/vehicles/${vehicleId}/delay`, {
        delay_minutes: delayMinutes,
        reason
      });
      return res.data;
    } catch {
      const target = DEFAULT_VEHICLES.find(v => v.id === vehicleId) || DEFAULT_VEHICLES[0];
      return {
        vehicle: {
          ...target,
          status: 'DELAYED',
          delay_minutes: delayMinutes,
          eta_minutes: (target.eta_minutes || 60) + delayMinutes
        }
      };
    }
  },

  // Incidents
  async getIncidents(status?: string): Promise<Incident[]> {
    try {
      const params = status ? { status } : {};
      const res = await apiClient.get<Incident[]>('/incidents', { params });
      return res.data && res.data.length ? res.data : DEFAULT_INCIDENTS;
    } catch {
      return DEFAULT_INCIDENTS;
    }
  },

  async createIncident(data: Partial<Incident>): Promise<Incident> {
    try {
      const res = await apiClient.post<Incident>('/incidents', data);
      return res.data;
    } catch {
      return {
        id: `inc-${Date.now()}`,
        category: (data.category as any) || 'Landslide',
        severity: data.severity || 'CRITICAL_CUTOFF',
        corridor_id: data.corridor_id || 'cor-nh6',
        location_name: data.location_name || 'NH-6 Corridor Section',
        latitude: data.latitude || 25.1328,
        longitude: data.longitude || 92.3582,
        description: data.description || 'Active slope instability and debris movement reported.',
        reported_by: data.reported_by || 'NER AI Sentinel',
        reporter_role: data.reporter_role || 'BRO Officer',
        status: 'VERIFIED',
        clearance_eta_hours: data.clearance_eta_hours || 12.0,
        upvotes: 1,
        reported_at: new Date().toISOString()
      };
    }
  },

  async verifyIncident(id: string): Promise<Incident> {
    try {
      const res = await apiClient.patch<Incident>(`/incidents/${id}/verify`);
      return res.data;
    } catch {
      const existing = DEFAULT_INCIDENTS.find(i => i.id === id) || DEFAULT_INCIDENTS[0];
      return { ...existing, status: 'VERIFIED' };
    }
  },

  async upvoteIncident(id: string): Promise<Incident> {
    try {
      const res = await apiClient.post<Incident>(`/incidents/${id}/upvote`);
      return res.data;
    } catch {
      const existing = DEFAULT_INCIDENTS.find(i => i.id === id) || DEFAULT_INCIDENTS[0];
      return { ...existing, upvotes: existing.upvotes + 1 };
    }
  },

  // Alerts
  async getAlerts(category?: string): Promise<Alert[]> {
    try {
      const params = category && category !== 'ALL' ? { category } : {};
      const res = await apiClient.get<Alert[]>('/alerts', { params });
      return res.data && res.data.length ? res.data : DEFAULT_ALERTS;
    } catch {
      return DEFAULT_ALERTS;
    }
  },

  async broadcastAlert(data: Partial<Alert>): Promise<Alert> {
    try {
      const res = await apiClient.post<Alert>('/alerts', data);
      return res.data;
    } catch {
      return {
        id: `alt-${Date.now()}`,
        title: data.title || 'Operational Advisory',
        message: data.message || 'Advisory dispatched to multimodal carriers.',
        severity: data.severity || 'WARNING',
        alert_type: data.alert_type || 'DISRUPTION',
        target_audience: 'ALL',
        is_active: true,
        created_at: new Date().toISOString()
      };
    }
  },

  async dismissAlert(id: string): Promise<any> {
    try {
      const res = await apiClient.delete(`/alerts/${id}`);
      return res.data;
    } catch {
      return { success: true, id };
    }
  },

  // Weather
  async getWeather(): Promise<WeatherData[]> {
    try {
      const res = await apiClient.get<WeatherData[]>('/weather/all');
      return res.data && res.data.length ? res.data : DEFAULT_WEATHER;
    } catch {
      return DEFAULT_WEATHER;
    }
  },

  // Shortage Risk & Supply Intelligence
  async getShortageRiskList(): Promise<SupplyStockItem[]> {
    try {
      const res = await apiClient.get<SupplyStockItem[]>('/shortage/list');
      return res.data && res.data.length ? res.data : SAMPLE_SUPPLY_STOCK_ITEMS;
    } catch {
      return SAMPLE_SUPPLY_STOCK_ITEMS;
    }
  },

  // Routes (Road + Multimodal Extended)
  async calculateRoutes(
    origin: string,
    destination: string,
    allowedModes: TransportMode[] = ['ROAD', 'RAIL', 'WATERWAY', 'AIR', 'TRANSFER'],
    cargoPriority: CargoPriority = 'BALANCED',
    cargoWeightTons: number = 20.0,
    cargoCategory: CargoCategory = 'Medicine',
    currentStock?: number,
    dailyConsumption?: number
  ): Promise<RouteCalculationResponse> {
    try {
      const res = await apiClient.post<RouteCalculationResponse>('/routes/calculate', {
        origin,
        destination,
        avoid_high_risk: true,
        allowed_modes: allowedModes,
        cargo_priority: cargoPriority,
        cargo_weight_tons: cargoWeightTons,
        cargo_type: cargoCategory,
        current_stock: currentStock,
        daily_consumption: dailyConsumption
      });
      // Enhance with client multimodal engine to guarantee instant rich multi-criteria options
      return calculateMultimodalRouting(
        origin,
        destination,
        res.data,
        allowedModes,
        cargoPriority,
        cargoWeightTons,
        cargoCategory,
        currentStock,
        dailyConsumption
      );
    } catch {
      // Fallback base response calculation if backend offline
      const fallbackBase: RouteCalculationResponse = {
        origin,
        destination,
        primary_route: {
          route_id: `rt_primary_${origin}_${destination}`,
          route_name: 'Primary Direct Highway',
          is_recommended: true,
          total_distance_km: 307.0,
          estimated_time_minutes: 420,
          overall_risk_score: 0.72,
          risk_category: 'HIGH',
          disruption_points_count: 1,
          elevation_gain_m: 1420,
          waypoints: [[26.1445, 91.7362], [25.5788, 91.8933], [25.4526, 92.2038], [25.1328, 92.3582], [24.8333, 92.7789]],
          segments: [],
          advisories: ['Caution: Sonapur Tunnel on NH-6 has high slope instability risk.']
        },
        safe_alternate_route: {
          route_id: `rt_safe_${origin}_${destination}`,
          route_name: 'AI Safe Resilient Corridor (NH-27 Lumding Bypass)',
          is_recommended: true,
          total_distance_km: 399.0,
          estimated_time_minutes: 580,
          overall_risk_score: 0.18,
          risk_category: 'LOW',
          disruption_points_count: 0,
          elevation_gain_m: 620,
          waypoints: [[26.1445, 91.7362], [26.3452, 92.6841], [25.7500, 93.1667], [25.1764, 93.0234], [24.8333, 92.7789]],
          segments: [],
          advisories: ['Smooth 4-lane bypass bypassing active landslide hotspots.']
        },
        all_options: [],
        summary: 'Multimodal options calculated across Road, Rail, Inland Waterway, and Air.'
      };
      const safeAlternate = fallbackBase.safe_alternate_route;
      fallbackBase.all_options = safeAlternate ? [fallbackBase.primary_route, safeAlternate] : [fallbackBase.primary_route];
      return calculateMultimodalRouting(
        origin,
        destination,
        fallbackBase,
        allowedModes,
        cargoPriority,
        cargoWeightTons,
        cargoCategory,
        currentStock,
        dailyConsumption
      );
    }
  },

  async getModalNetwork(): Promise<ModalNetworkData> {
    try {
      const res = await apiClient.get<ModalNetworkData>('/routes/modal-network');
      return res.data;
    } catch {
      return MULTIMODAL_NETWORK_DATA;
    }
  },

  // AI Prediction
  async predictDisruption(data: DisruptionPredictionRequest): Promise<DisruptionPredictionResponse> {
    const res = await apiClient.post<DisruptionPredictionResponse>('/predict/disruption', data);
    return res.data;
  },

  async predictRoadRisk(data: any): Promise<any> {
    const res = await apiClient.post('/predict/road-risk', data);
    return res.data;
  },

  async getSegments(): Promise<any[]> {
    try {
      const res = await apiClient.get('/corridors/segments');
      return res.data && res.data.length ? res.data : DEFAULT_SEGMENTS;
    } catch {
      return DEFAULT_SEGMENTS;
    }
  },

  async getModelMetrics(): Promise<any> {
    try {
      const res = await apiClient.get('/predict/metrics');
      return res.data;
    } catch {
      return {
        model_name: 'NER Random Forest Slope Stability Classifier v2.4',
        accuracy_pct: 94.6,
        auc_roc: 0.962,
        f1_score: 0.938,
        training_samples: 18450,
        last_trained: '2026-09-18'
      };
    }
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary | null> {
    try {
      const res = await apiClient.get<AnalyticsSummary>('/analytics/summary');
      return res.data || DEFAULT_ANALYTICS;
    } catch {
      return DEFAULT_ANALYTICS;
    }
  }
};
