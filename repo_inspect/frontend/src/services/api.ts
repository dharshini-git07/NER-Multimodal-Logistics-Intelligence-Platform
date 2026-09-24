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
  AnalyticsSummary
} from '../types';

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
      return res.data;
    } catch {
      return [];
    }
  },

  // Vehicles
  async getVehicles(): Promise<Vehicle[]> {
    try {
      const res = await apiClient.get<Vehicle[]>('/vehicles');
      return res.data;
    } catch {
      return [];
    }
  },

  async triggerReroute(vehicleId: string): Promise<any> {
    const res = await apiClient.post(`/vehicles/${vehicleId}/reroute`);
    return res.data;
  },

  async triggerDisruption(vehicleId: string, disruptionType: 'landslide' | 'flood' | 'blocked-road'): Promise<any> {
    const res = await apiClient.post(`/vehicles/${vehicleId}/disruption/${disruptionType}`);
    return res.data;
  },

  async triggerDelay(vehicleId: string, delayMinutes: number = 45, reason: string = 'Mountain convoy crawl'): Promise<any> {
    const res = await apiClient.post(`/vehicles/${vehicleId}/delay`, {
      delay_minutes: delayMinutes,
      reason
    });
    return res.data;
  },

  // Incidents
  async getIncidents(status?: string): Promise<Incident[]> {
    try {
      const params = status ? { status } : {};
      const res = await apiClient.get<Incident[]>('/incidents', { params });
      return res.data;
    } catch (e) {
      return [];
    }
  },

  async createIncident(data: Partial<Incident>): Promise<Incident> {
    const res = await apiClient.post<Incident>('/incidents', data);
    return res.data;
  },

  async verifyIncident(id: string): Promise<Incident> {
    const res = await apiClient.patch<Incident>(`/incidents/${id}/verify`);
    return res.data;
  },

  async upvoteIncident(id: string): Promise<Incident> {
    const res = await apiClient.post<Incident>(`/incidents/${id}/upvote`);
    return res.data;
  },

  // Alerts
  async getAlerts(category?: string): Promise<Alert[]> {
    try {
      const params = category && category !== 'ALL' ? { category } : {};
      const res = await apiClient.get<Alert[]>('/alerts', { params });
      return res.data;
    } catch (e) {
      return [];
    }
  },

  async broadcastAlert(data: Partial<Alert>): Promise<Alert> {
    const res = await apiClient.post<Alert>('/alerts', data);
    return res.data;
  },

  async dismissAlert(id: string): Promise<any> {
    const res = await apiClient.delete(`/alerts/${id}`);
    return res.data;
  },

  // Weather
  async getWeather(): Promise<WeatherData[]> {
    try {
      const res = await apiClient.get<WeatherData[]>('/weather/all');
      return res.data;
    } catch (e) {
      return [];
    }
  },

  // Routes
  async calculateRoutes(origin: string, destination: string): Promise<RouteCalculationResponse> {
    const res = await apiClient.post<RouteCalculationResponse>('/routes/calculate', {
      origin,
      destination,
      avoid_high_risk: true
    });
    return res.data;
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
      return res.data;
    } catch (e) {
      return [];
    }
  },

  async getModelMetrics(): Promise<any> {
    const res = await apiClient.get('/predict/metrics');
    return res.data;
  },

  // Analytics
  async getAnalytics(): Promise<AnalyticsSummary | null> {
    try {
      const res = await apiClient.get<AnalyticsSummary>('/analytics/summary');
      return res.data;
    } catch {
      return null;
    }
  }
};
