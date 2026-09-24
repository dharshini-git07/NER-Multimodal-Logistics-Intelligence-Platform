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
  Activity
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
  vehicles,
  onTriggerReroute,
  onTriggerDisruption,
  onTriggerDelay
}) => {
  const [filterTab, setFilterTab] = useState<FleetFilterTab>('ALL');

  const onScheduleCount = vehicles.filter(
    (v) => (!v.delay_minutes || v.delay_minutes === 0) && v.status !== 'REROUTING' && v.status !== 'EMERGENCY_HALT'
  ).length;
  const delayedCount = vehicles.filter(
    (v) => (v.delay_minutes && v.delay_minutes > 0) || v.status === 'DELAYED'
  ).length;
  const reroutingCount = vehicles.filter(
    (v) => v.rerouted || v.status === 'REROUTING'
  ).length;
  const haltedCount = vehicles.filter(
    (v) => v.status === 'EMERGENCY_HALT' || v.status === 'CAUTION_SLOW'
  ).length;

  const filteredVehicles = vehicles.filter((v) => {
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
      return 'bg-purple-950 text-purple-300 border-purple-700 animate-pulse';
    }
    if (v.status === 'EMERGENCY_HALT') {
      return 'bg-red-950 text-red-400 border-red-800 animate-pulse';
    }
    if (v.status === 'CAUTION_SLOW') {
      return 'bg-amber-950 text-amber-300 border-amber-800';
    }
    if (v.status === 'DELAYED' || (v.delay_minutes && v.delay_minutes > 0)) {
      return 'bg-orange-950 text-orange-300 border-orange-800';
    }
    return 'bg-emerald-950 text-emerald-400 border-emerald-800';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              GPS Freight & Relief Fleet Telemetry
              <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                {vehicles.length} Active Convoys
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live continuous GPS telemetry, dynamic ETA countdown with Haversine distance, and automated hazard rerouting.
            </p>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'ALL'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>All Convoys</span>
            <span className="text-[10px] opacity-80 font-mono">({vehicles.length})</span>
          </button>

          <button
            onClick={() => setFilterTab('ON_SCHEDULE')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'ON_SCHEDULE'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
            }`}
          >
            <span>On Schedule</span>
            <span className="text-[10px] opacity-80 font-mono">({onScheduleCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('DELAYED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'DELAYED'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-slate-800 text-orange-400 hover:bg-slate-700'
            }`}
          >
            <span>Delayed</span>
            <span className="text-[10px] opacity-80 font-mono">({delayedCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('REROUTING')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'REROUTING'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-800 text-purple-400 hover:bg-slate-700'
            }`}
          >
            <span>Rerouting</span>
            <span className="text-[10px] opacity-80 font-mono">({reroutingCount})</span>
          </button>

          <button
            onClick={() => setFilterTab('HALTED')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              filterTab === 'HALTED'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-slate-800 text-red-400 hover:bg-slate-700'
            }`}
          >
            <span>Halted / Caution</span>
            <span className="text-[10px] opacity-80 font-mono">({haltedCount})</span>
          </button>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((v) => {
          const isRerouting = v.status === 'REROUTING';
          const isHalted = v.status === 'EMERGENCY_HALT';
          const hasDelay = Boolean(v.delay_minutes && v.delay_minutes > 0);

          return (
            <div
              key={v.id}
              className={`rounded-2xl p-5 border transition-all space-y-3 flex flex-col justify-between ${
                isRerouting
                  ? 'bg-purple-950/30 border-purple-600/70 shadow-lg shadow-purple-600/10'
                  : isHalted
                  ? 'bg-red-950/30 border-red-600/70 shadow-lg shadow-red-600/10'
                  : hasDelay
                  ? 'bg-orange-950/20 border-orange-700/60'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Top Bar: Plate, GPS Ping, Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-base">{v.plate_number}</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(v)}`}>
                    {v.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Live GPS Coordinates & Breadcrumb Trail Count */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-800 mb-2.5">
                  <span className="flex items-center gap-1 text-slate-300">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {v.current_lat.toFixed(4)}°N, {v.current_lng.toFixed(4)}°E
                  </span>
                  <span className="text-slate-500">
                    {v.breadcrumb_trail ? `${v.breadcrumb_trail.length} waypoints` : 'GPS Tracking Active'}
                  </span>
                </div>

                <div className="font-semibold text-slate-200 text-xs mb-0.5">{v.vehicle_type}</div>
                <div className="text-[11px] text-slate-400 mb-2">
                  Cargo: <span className="text-slate-200 font-medium">{v.cargo_type}</span>
                </div>

                {/* Telemetry Stats Grid */}
                <div className="grid grid-cols-4 gap-1.5 bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] mb-3">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Speed</span>
                    <span className="font-mono font-bold text-slate-200">{v.speed_kmh} km/h</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Heading</span>
                    <span className="font-mono font-bold text-slate-200">{v.heading_deg}°</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Distance</span>
                    <span className="font-mono font-bold text-cyan-400">{v.distance_remaining_km ?? '--'} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Dynamic ETA</span>
                    <span className="font-mono font-bold text-emerald-400">{v.eta_minutes ?? 0}m</span>
                  </div>
                </div>

                {/* Delay Impact Tag if delayed */}
                {hasDelay && (
                  <div className="p-2 bg-red-950/80 border border-red-800/80 rounded-xl text-[11px] text-red-300 flex items-center justify-between mb-3">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-red-400" />
                      Delay Impact:
                    </span>
                    <span className="font-mono font-bold text-red-200">
                      +{v.delay_minutes} mins delay
                    </span>
                  </div>
                )}

                {/* Destination & Driver info */}
                <div className="space-y-1 text-[11px] text-slate-400 mb-3">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="text-slate-200 font-semibold">{v.origin_city} ➔ {v.destination_city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Carrier:</span>
                    <span className="text-slate-300">{v.carrier_org}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Driver:</span>
                    <span className="text-slate-200 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-cyan-400" /> {v.driver_name}
                    </span>
                  </div>
                </div>

                {/* Reroute Warning Banner if Rerouted */}
                {v.rerouted && (
                  <div className="p-2 bg-purple-950/80 border border-purple-800 rounded-xl text-[10px] text-purple-200 leading-tight mb-3">
                    <span className="font-bold text-purple-300 block mb-0.5">⚡ AUTONOMOUS REROUTE:</span>
                    {v.reroute_reason}
                  </div>
                )}
              </div>

              {/* Action Buttons: Multi-Hazard Disruption Simulators */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Simulate Road Hazard:</span>
                  {onTriggerDelay && (
                    <button
                      onClick={() => onTriggerDelay(v.id, 30)}
                      className="text-cyan-400 hover:text-cyan-300 hover:underline"
                    >
                      +30m Delay
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => {
                      if (onTriggerDisruption) {
                        onTriggerDisruption(v.id, 'landslide');
                      } else if (onTriggerReroute) {
                        onTriggerReroute(v.id);
                      }
                    }}
                    className="py-1.5 px-2 bg-amber-950/70 hover:bg-amber-900 border border-amber-800 text-amber-300 rounded-xl text-[10px] font-semibold transition active:scale-95 text-center"
                    title="Simulate Landslide (+95m ETA)"
                  >
                    🏔️ Landslide
                  </button>

                  <button
                    onClick={() => onTriggerDisruption && onTriggerDisruption(v.id, 'flood')}
                    className="py-1.5 px-2 bg-blue-950/70 hover:bg-blue-900 border border-blue-800 text-blue-300 rounded-xl text-[10px] font-semibold transition active:scale-95 text-center"
                    title="Simulate Flash Flood (+60m ETA)"
                  >
                    🌊 Flood
                  </button>

                  <button
                    onClick={() => onTriggerDisruption && onTriggerDisruption(v.id, 'blocked-road')}
                    className="py-1.5 px-2 bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-300 rounded-xl text-[10px] font-semibold transition active:scale-95 text-center"
                    title="Simulate Blocked Pass (+180m ETA)"
                  >
                    🚧 Blocked
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
