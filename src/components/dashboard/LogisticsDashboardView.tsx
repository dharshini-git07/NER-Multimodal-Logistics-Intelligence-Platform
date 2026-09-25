import React, { useState } from 'react';
import {
  BellRing,
  Clock3,
  MapPin,
  RefreshCw,
  Truck,
  AlertTriangle,
  Flame,
  ShieldAlert,
  ArrowRight,
  Zap,
  CheckCircle2,
  Navigation,
  Train,
  Plane,
  Layers,
  ChevronRight
} from 'lucide-react';
import {
  Alert,
  AnalyticsSummary,
  Corridor,
  Incident,
  RouteOption,
  Segment,
  Vehicle,
  WeatherData,
  SupplyStockItem
} from '../../types';
import { KpiCards } from './KpiCards';
import { LiveMap } from '../map/LiveMap';
import { ShortageIntelligenceView } from './ShortageIntelligenceView';

interface Props {
  corridors: Corridor[];
  segments?: Segment[];
  vehicles: Vehicle[];
  incidents: Incident[];
  alerts: Alert[];
  weather: WeatherData[];
  analytics?: AnalyticsSummary | null;
  selectedRoute: RouteOption | null;
  onMapClickCoordinates: (lat: number, lng: number) => void;
  onUpvoteIncident: (id: string) => void;
  onVerifyIncident: (id: string) => void;
  onTriggerReroute?: (id: string) => void;
  onTriggerDisruption?: (id: string, type: 'landslide' | 'flood' | 'blocked-road') => void;
  onTriggerLandslideSimulation?: () => void;
  isSimulating?: boolean;
  onDismissAlert?: (id: string) => void;
  onRefresh?: () => void;
}

const when = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Now'
    : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const alertTone = (value: string) => {
  switch (value) {
    case 'CRITICAL':
      return 'badge-critical';
    case 'DANGER':
      return 'badge-danger';
    case 'WARNING':
      return 'badge-warning';
    default:
      return 'badge-info';
  }
};

const fleetTone = (value: string) => {
  switch (value) {
    case 'EMERGENCY_HALT':
      return 'badge-critical';
    case 'REROUTING':
    case 'CAUTION_SLOW':
    case 'DELAYED':
      return 'badge-warning';
    default:
      return 'badge-safe';
  }
};

export const LogisticsDashboardView: React.FC<Props> = ({
  corridors = [],
  segments = [],
  vehicles = [],
  incidents = [],
  alerts = [],
  weather = [],
  selectedRoute,
  onMapClickCoordinates,
  onUpvoteIncident,
  onVerifyIncident,
  onTriggerReroute,
  onTriggerLandslideSimulation,
  isSimulating,
  onDismissAlert,
  onRefresh
}) => {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const safeCorridors = Array.isArray(corridors) ? corridors : [];
  const safeSegments = Array.isArray(segments) ? segments : [];
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const safeWeather = Array.isArray(weather) ? weather : [];
  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'shortage'>('overview');

  // Key logistics intelligence cards (Glanceable multi-criteria metrics)
  const intelligenceCards = [
    {
      cargoTitle: 'Medicine → Imphal Hospital',
      shipmentId: 'MED-IMPHAL-001',
      category: 'Medicine',
      stockRemainingDays: 4,
      expectedDeliveryDays: 5,
      shortageRisk: 'HIGH',
      currentRoadRisk: '84% Landslide Risk (NH-6)',
      recommendedMode: 'ROAD + RAIL',
      reason: 'NH-6 cut off; NFR rail bypass prevents inventory depletion.',
      priority: 'URGENT',
      vehicleId: 'veh-106'
    },
    {
      cargoTitle: 'Oxygen → Gangtok STNM Hospital',
      shipmentId: 'MED-GANGTOK-103',
      category: 'Medicine',
      stockRemainingDays: 3,
      expectedDeliveryDays: 4,
      shortageRisk: 'CRITICAL',
      currentRoadRisk: 'NH-10 Severed at 29th Mile',
      recommendedMode: 'NH-717A Lava Bypass',
      reason: 'Teesta washout; Eastern Lava bypass preserves cryogenic oxygen.',
      priority: 'URGENT',
      vehicleId: 'veh-103'
    },
    {
      cargoTitle: 'Food Grain → Silchar Central Hub',
      shipmentId: 'FOD-SILCHAR-101',
      category: 'Food',
      stockRemainingDays: 7,
      expectedDeliveryDays: 3,
      shortageRisk: 'MEDIUM',
      currentRoadRisk: 'Moderate Slope Instability',
      recommendedMode: 'ROAD + RAIL',
      reason: 'Heavy 24 MT cargo shifted to NFR flatcar rail link.',
      priority: 'HIGH',
      vehicleId: 'veh-101'
    }
  ];

  return (
    <div className="dashboard-page space-y-4 max-w-[1600px] mx-auto p-3 sm:p-6">
      {/* Top Heading */}
      <div className="page-heading flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <p className="eyebrow text-xs uppercase tracking-wider text-teal-700 font-extrabold">
            North Eastern Region · Multimodal Operations
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
            Logistics Command Center
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {onTriggerLandslideSimulation && (
            <button
              onClick={onTriggerLandslideSimulation}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-extrabold rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-95 transition-all shadow-xs border border-red-500/50 disabled:opacity-50"
            >
              <AlertTriangle size={16} className={isSimulating ? 'animate-spin' : ''} />
              {isSimulating ? 'Simulating Landslide...' : 'Simulate NH-6 Landslide'}
            </button>
          )}
          <button className="outline-button text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 transition-colors" onClick={onRefresh}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards vehicles={vehicles} corridors={corridors} alerts={alerts} shortageCount={4} />

      {/* Main Command Grid */}
      <div className="command-grid">
        {/* Left: Map + Logistics Intelligence + Shortage Intelligence */}
        <section className="map-card space-y-4">
          <LiveMap
            compact
            corridors={corridors}
            segments={segments}
            vehicles={vehicles}
            incidents={incidents}
            weather={weather}
            selectedRoute={selectedRoute}
            onMapClickCoordinates={onMapClickCoordinates}
            onUpvoteIncident={onUpvoteIncident}
            onVerifyIncident={onVerifyIncident}
            onRefresh={onRefresh}
          />

          {/* Logistics Intelligence Section */}
          <div className="logistics-intelligence-section rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Layers size={20} />
                </span>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Logistics Intelligence
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {intelligenceCards.map((card) => (
                <div
                  key={card.shipmentId}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900 tracking-wide">
                        {card.cargoTitle}
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                        {card.shipmentId}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg border uppercase ${
                        card.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {card.priority} PRIORITY
                    </span>
                  </div>

                  {/* 4 Multi-criteria dimensions */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5 text-xs bg-white p-3 rounded-xl border border-slate-200 font-bold">
                    <div>
                      <span className="text-slate-500 block uppercase text-[11px]">Stock</span>
                      <strong className={`text-xs font-mono ${card.stockRemainingDays <= 4 ? 'text-rose-700 font-black' : 'text-slate-900'}`}>
                        {card.stockRemainingDays}d remaining
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[11px]">Shortage</span>
                      <strong className={`text-xs ${card.shortageRisk === 'CRITICAL' ? 'text-rose-700 font-black' : 'text-amber-700'}`}>
                        {card.shortageRisk} ({card.expectedDeliveryDays}d ETA)
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[11px]">Road Risk</span>
                      <strong className="text-xs text-rose-700 font-bold truncate block">
                        {card.currentRoadRisk}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block uppercase text-[11px]">Recommended</span>
                      <strong className="text-xs text-blue-700 font-black flex items-center gap-1">
                        <Zap size={14} className="text-amber-500" />
                        {card.recommendedMode}
                      </strong>
                    </div>
                  </div>

                  {/* Why this route / Explanation */}
                  <div className="flex items-start gap-2 text-xs text-slate-700 bg-blue-50/70 border border-blue-200 p-2 rounded">
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider shrink-0 mt-0.5">
                      Recommendation:
                    </span>
                    <p className="text-[11px] leading-relaxed text-slate-700">
                      {card.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shortage Intelligence Module */}
          <ShortageIntelligenceView
            onSelectAction={(item) => {
              if (onTriggerLandslideSimulation) {
                onTriggerLandslideSimulation();
              }
            }}
          />
        </section>

        {/* Right Operations Panel */}
        <aside className="operations-panel space-y-4">
          {/* Live Alerts (Categorized) */}
          <section className="info-section bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="info-header flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <BellRing size={17} className="text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">Live Disruption &amp; Mode Alerts</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {safeAlerts.length}
              </span>
            </div>
            <div className="compact-list space-y-2">
              {safeAlerts.length ? (
                safeAlerts.slice(0, 5).map((item) => (
                  <article className="alert-row p-2.5 rounded-lg border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-2" key={item.id}>
                    <div className="space-y-1 overflow-hidden pr-1">
                      <div className="flex items-center gap-2">
                        <span className={`status-badge text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${alertTone(item.severity)}`}>
                          {item.severity}
                        </span>
                        <b className="text-xs text-slate-900 font-bold truncate">{item.title}</b>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 font-mono">
                          <MapPin size={10} /> {(item.alert_type || '').replace(/_/g, ' ')}
                        </span>
                        <span>·</span>
                        <span>{when(item.created_at)}</span>
                      </div>
                    </div>
                    {onDismissAlert && (
                      <button
                        className="text-[11px] font-bold text-slate-400 hover:text-rose-600 px-1.5 py-0.5 rounded transition shrink-0"
                        aria-label="Dismiss alert"
                        onClick={() => onDismissAlert(item.id)}
                      >
                        ×
                      </button>
                    )}
                  </article>
                ))
              ) : (
                <div className="empty-state text-xs text-slate-500 p-4 text-center">
                  No active alerts. Monitored network clear.
                </div>
              )}
            </div>
          </section>

          {/* Active Multimodal Vehicles & Shipments */}
          <section className="info-section vehicle-section bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <div className="info-header flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Truck size={17} className="text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Monitored Convoys &amp; Shipments</h2>
              </div>
              <span className="px-2 py-0.5 rounded text-xs bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {safeVehicles.length}
              </span>
            </div>
            <div className="compact-list space-y-2">
              {safeVehicles.length ? (
                safeVehicles.slice(0, 6).map((item) => (
                  <article className="vehicle-row p-2.5 rounded-lg border border-slate-200 bg-slate-50/80" key={item.id}>
                    <div>
                      <div className="row-title flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <b className="text-xs text-slate-900 font-mono font-bold">{item.plate_number}</b>
                          {item.shipment_id && (
                            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-semibold">
                              {item.shipment_id}
                            </span>
                          )}
                        </div>
                        <span className={`status-badge text-[10px] font-bold px-1.5 py-0.5 rounded ${fleetTone(item.status)}`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {item.cargo_type} · {item.destination_city}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock3 size={10} /> ETA {item.eta_minutes ?? '—'} min
                        </span>
                        <span className="font-semibold text-slate-700">
                          Mode: {item.current_mode || 'ROAD'}
                        </span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state text-xs text-slate-500 p-4 text-center">
                  No vehicle telemetry available.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};
