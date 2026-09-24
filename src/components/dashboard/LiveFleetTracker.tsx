import React, { useState } from 'react';
import {
  Truck,
  ShieldAlert,
  Navigation,
  Phone,
  Gauge,
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Route,
  Zap,
  Activity,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Vehicle } from '../../types';

interface LiveFleetTrackerProps {
  vehicles: Vehicle[];
  onTriggerReroute?: (vehicleId: string) => void;
  onTriggerDisruption?: (vehicleId: string, disruptionType: 'landslide' | 'flood' | 'blocked-road') => void;
  onTriggerDelay?: (vehicleId: string, minutes: number) => void;
}

type FleetFilterTab = 'ALL' | 'ON_SCHEDULE' | 'DELAYED' | 'REROUTING' | 'HALTED';

export const LiveFleetTracker: React.FC<LiveFleetTrackerProps> = ({
  vehicles = [],
  onTriggerReroute,
  onTriggerDisruption,
  onTriggerDelay
}) => {
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const [filterTab, setFilterTab] = useState<FleetFilterTab>('ALL');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const onScheduleCount = safeVehicles.filter(
    (v) => v && (!v.delay_minutes || v.delay_minutes === 0) && v.status !== 'REROUTING' && v.status !== 'EMERGENCY_HALT'
  ).length;
  const delayedCount = safeVehicles.filter(
    (v) => v && ((v.delay_minutes && v.delay_minutes > 0) || v.status === 'DELAYED')
  ).length;
  const reroutingCount = safeVehicles.filter(
    (v) => v && (v.rerouted || v.status === 'REROUTING')
  ).length;
  const haltedCount = safeVehicles.filter(
    (v) => v && (v.status === 'EMERGENCY_HALT' || v.status === 'CAUTION_SLOW')
  ).length;

  const filteredVehicles = safeVehicles.filter((v) => {
    if (!v) return false;
    if (filterTab === 'ALL') return true;
    if (filterTab === 'ON_SCHEDULE') {
      return (!v.delay_minutes || v.delay_minutes === 0) && v.status !== 'REROUTING' && v.status !== 'EMERGENCY_HALT';
    }
    if (filterTab === 'DELAYED') {
      return (v.delay_minutes && v.delay_minutes > 0) || v.status === 'DELAYED';
    }
    if (filterTab === 'REROUTING') {
      return v.rerouted || v.status === 'REROUTING';
    }
    if (filterTab === 'HALTED') {
      return v.status === 'EMERGENCY_HALT' || v.status === 'CAUTION_SLOW';
    }
    return true;
  });

  const getStatusBadge = (v: Vehicle) => {
    if (v.status === 'REROUTING') {
      return 'bg-purple-100 text-purple-800 border-purple-300 animate-pulse';
    }
    if (v.status === 'EMERGENCY_HALT') {
      return 'bg-red-100 text-red-800 border-red-300 animate-pulse';
    }
    if (v.status === 'CAUTION_SLOW') {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (v.status === 'DELAYED' || (v.delay_minutes && v.delay_minutes > 0)) {
      return 'bg-orange-100 text-orange-800 border-orange-300';
    }
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              GPS Freight & Relief Fleet Telemetry
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200 font-mono font-bold">
                {vehicles.length} Active Convoys
              </span>
            </h2>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'ALL'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>All Convoys</span>
            <span className="text-xs opacity-80 font-mono">({vehicles.length})</span>
          </button>

          <button
            onClick={() => setFilterTab('ON_SCHEDULE')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'ON_SCHEDULE'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>On Schedule</span>
            <span className="text-xs opacity-80 font-mono">({onScheduleCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('DELAYED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'DELAYED'
                ? 'bg-orange-600 text-white shadow'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200'
            }`}
          >
            <span>Delayed</span>
            <span className="text-xs opacity-80 font-mono">({delayedCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('REROUTING')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'REROUTING'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <span>Rerouting</span>
            <span className="text-xs opacity-80 font-mono">({reroutingCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('HALTED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'HALTED'
                ? 'bg-red-600 text-white shadow'
                : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
            }`}
          >
            <span>Halted / Caution</span>
            <span className="text-xs opacity-80 font-mono">({haltedCount})</span>
          </button>
        </div>
      </div>

      {/* Vehicles Cards Masonry Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
        {filteredVehicles.map((v) => {
          const isRerouting = v.status === 'REROUTING';
          const isHalted = v.status === 'EMERGENCY_HALT';
          const hasDelay = Boolean(v.delay_minutes && v.delay_minutes > 0);
          const isExpanded = Boolean(expandedIds[v.id]);

          return (
            <div key={v.id} className="break-inside-avoid mb-4">
              <div
                className={`rounded-xl p-3.5 border transition-all ${
                  isRerouting
                    ? 'bg-purple-50/60 border-purple-200 shadow-sm'
                    : isHalted
                    ? 'bg-red-50/60 border-red-200 shadow-sm'
                    : hasDelay
                    ? 'bg-orange-50/40 border-orange-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
              <div>
                {/* Collapsed Bar: Plate Number + Risk Status Button + Dropdown Chevron */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-extrabold text-blue-700 text-sm sm:text-base shrink-0">{v.plate_number}</span>
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Status / Risk Badge Button */}
                    <button
                      onClick={() => toggleExpand(v.id)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border uppercase transition truncate max-w-[140px] ${getStatusBadge(v)}`}
                      title={v.status.replace(/_/g, ' ')}
                    >
                      {v.status.replace(/_/g, ' ')}
                    </button>

                    {/* Dropdown Chevron Toggle Button */}
                    <button
                      onClick={() => toggleExpand(v.id)}
                      className="p-1 rounded-lg bg-slate-50 border border-slate-300 text-slate-700 hover:bg-slate-100 transition shrink-0"
                      title={isExpanded ? 'Hide vehicle details' : 'Show vehicle details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Dropdown Details Panel (only visible when expanded) */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 animate-in fade-in duration-200">
                    {/* Live GPS Coordinates */}
                    <div className="flex items-center justify-between text-xs text-slate-600 font-mono bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                      <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        {v.current_lat.toFixed(4)}°N, {v.current_lng.toFixed(4)}°E
                      </span>
                      <span className="text-slate-500 font-medium">
                        {v.breadcrumb_trail ? `${v.breadcrumb_trail.length} waypoints` : 'GPS Active'}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800 text-xs">{v.vehicle_type}</div>

                    {/* Cargo & Mode Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-500 font-medium">Cargo:</span>{' '}
                        <span className="text-slate-900 font-bold">{v.cargo_type}</span>
                        {v.cargo_weight_tons && <span className="text-blue-700 font-mono font-bold ml-1">({v.cargo_weight_tons} MT)</span>}
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                        {v.current_mode || 'ROAD'}
                      </span>
                    </div>

                    {/* Telemetry Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-500 block text-xs font-medium">Speed</span>
                        <span className="font-mono font-bold text-slate-900">{v.speed_kmh} km/h</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs font-medium">Mode</span>
                        <span className="font-mono font-bold text-purple-700">{v.current_mode || 'ROAD'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs font-medium">Distance</span>
                        <span className="font-mono font-bold text-blue-700">{v.distance_remaining_km ?? '--'} km</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-xs font-medium">ETA</span>
                        <span className="font-mono font-bold text-emerald-700">{Math.floor((v.eta_minutes || 0) / 60)}h {(v.eta_minutes || 0) % 60}m</span>
                      </div>
                    </div>

                    {/* Delay Impact Tag if delayed */}
                    {hasDelay && (
                      <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-red-600" />
                          Delay Impact:
                        </span>
                        <span className="font-mono font-bold text-red-700">
                          +{v.delay_minutes} mins delay
                        </span>
                      </div>
                    )}

                    {/* Destination & Driver info */}
                    <div className="space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Route Corridor:</span>
                        <span className="text-slate-900 font-semibold">{v.origin_city} ➔ {v.destination_city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Carrier:</span>
                        <span className="text-slate-800 font-semibold">{v.carrier_org}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Driver:</span>
                        <span className="text-slate-900 flex items-center gap-1 font-mono font-bold">
                          <Phone className="w-3.5 h-3.5 text-blue-600" /> {v.driver_name}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Multi-Hazard Disruption Simulators */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                        <span>Simulate Hazard:</span>
                        {onTriggerDelay && (
                          <button
                            onClick={() => onTriggerDelay(v.id, 30)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-bold"
                          >
                            +30m Delay
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => {
                            if (onTriggerDisruption) {
                              onTriggerDisruption(v.id, 'landslide');
                            } else if (onTriggerReroute) {
                              onTriggerReroute(v.id);
                            }
                          }}
                          className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 rounded-xl text-xs font-bold transition active:scale-95 text-center shadow-xs"
                          title="Simulate Landslide (+95m ETA)"
                        >
                          🏔️ Landslide
                        </button>

                        <button
                          onClick={() => onTriggerDisruption && onTriggerDisruption(v.id, 'flood')}
                          className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-900 rounded-xl text-xs font-bold transition active:scale-95 text-center shadow-xs"
                          title="Simulate Flash Flood (+60m ETA)"
                        >
                          🌊 Flood
                        </button>

                        <button
                          onClick={() => onTriggerDisruption && onTriggerDisruption(v.id, 'blocked-road')}
                          className="py-1.5 px-2 bg-red-50 hover:bg-red-100 border border-red-300 text-red-900 rounded-xl text-xs font-bold transition active:scale-95 text-center shadow-xs"
                          title="Simulate Blocked Pass (+180m ETA)"
                        >
                          🚧 Blocked
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
};
