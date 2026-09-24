import { Vehicle, Alert } from '../types';

type TelemetryCallback = (vehicles: Vehicle[]) => void;
type AlertCallback = (alert: Alert) => void;

export class TelemetryWebSocket {
  private ws: WebSocket | null = null;
  private vehicleListeners: Set<TelemetryCallback> = new Set();
  private alertListeners: Set<AlertCallback> = new Set();
  private reconnectInterval: number = 3000;
  private isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  private connect() {
    const configuredUrl = import.meta.env.VITE_WS_URL;
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const apiUrl = apiBase && /^https?:\/\//.test(apiBase) ? new URL(apiBase) : null;
    const protocol = apiUrl ? (apiUrl.protocol === 'https:' ? 'wss:' : 'ws:') : (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
    const host = apiUrl ? apiUrl.host : window.location.host;
    const wsUrl = configuredUrl || `${protocol}//${host}/ws/telemetry`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('Connected to Vehicle Telemetry & Alert WebSocket');
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'INIT_FLEET' || payload.type === 'FLEET_TELEMETRY_UPDATE') {
            this.notifyVehicleListeners(payload.data);
          } else if (payload.type === 'ALERT_DISPATCHED') {
            this.notifyAlertListeners(payload.data);
          }
        } catch (e) {
          console.error('Error parsing WebSocket payload', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = () => {
        if (this.ws) this.ws.close();
      };
    } catch (e) {
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  public subscribe(cb: TelemetryCallback): () => void {
    this.vehicleListeners.add(cb);
    return () => this.vehicleListeners.delete(cb);
  }

  public subscribeAlerts(cb: AlertCallback): () => void {
    this.alertListeners.add(cb);
    return () => this.alertListeners.delete(cb);
  }

  private notifyVehicleListeners(vehicles: Vehicle[]) {
    this.vehicleListeners.forEach((cb) => cb(vehicles));
  }

  private notifyAlertListeners(alert: Alert) {
    this.alertListeners.forEach((cb) => cb(alert));
  }
}

export const telemetryWS = new TelemetryWebSocket();
