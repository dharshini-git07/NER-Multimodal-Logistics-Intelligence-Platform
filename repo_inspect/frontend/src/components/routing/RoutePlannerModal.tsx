import React, { useState } from 'react';
import {
  Navigation,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Compass,
  CheckCircle,
  MapPin,
  Mountain,
  ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { RouteCalculationResponse, RouteOption } from '../../types';

interface RoutePlannerProps {
  onSelectRouteForMap: (route: RouteOption) => void;
}

const NER_CITIES = [
  'Guwahati',
  'Shillong',
  'Silchar',
  'Imphal',
  'Kohima',
  'Dimapur',
  'Aizawl',
  'Agartala',
  'Itanagar',
  'Gangtok'
];

export const RoutePlannerModal: React.FC<RoutePlannerProps> = ({ onSelectRouteForMap }) => {
  const [origin, setOrigin] = useState('Guwahati');
  const [destination, setDestination] = useState('Silchar');
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteCalculationResponse | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const handleCalculateRoutes = async () => {
    setLoading(true);
    try {
      const res = await api.calculateRoutes(origin, destination);
      setRouteResult(res);
      // Auto select recommended route
      const rec = res.all_options.find(r => r.is_recommended) || res.primary_route;
      setSelectedRouteId(rec.route_id);
      onSelectRouteForMap(rec);
    } catch (e) {
      console.error('Routing calculation failed', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Multi-Criteria Resilient Route Optimizer
              <span className="text-[10px] bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-mono">
                Dijkstra + AI Hazard Penalty
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluates road geometry, active landslide washouts, and slope moisture to calculate safer alternate corridors.
            </p>
          </div>
        </div>
      </div>

      {/* Origin & Destination Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-950/60 p-4 rounded-xl border border-slate-800">
        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Origin Depot
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {NER_CITIES.map((city) => (
              <option key={`origin-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1 flex items-center justify-center pb-2">
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </div>

        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-400" /> Destination Hub
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {NER_CITIES.filter((c) => c !== origin).map((city) => (
              <option key={`dest-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <button
            onClick={handleCalculateRoutes}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-cyan-600/20 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Calculating Paths...' : 'Find Safe Routes'}
          </button>
        </div>
      </div>

      {/* Route Results Comparison */}
      {routeResult && (
        <div className="space-y-4">
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl text-xs text-cyan-200">
            <span className="font-bold text-cyan-400">AI Routing Decision: </span>
            {routeResult.summary}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routeResult.all_options.map((opt) => {
              const isSelected = selectedRouteId === opt.route_id;
              const isDanger = opt.risk_category === 'HIGH' || opt.risk_category === 'CRITICAL';

              return (
                <div
                  key={opt.route_id}
                  onClick={() => {
                    setSelectedRouteId(opt.route_id);
                    onSelectRouteForMap(opt);
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-xl shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100">{opt.route_name}</span>
                      {opt.is_recommended && (
                        <span className="bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> AI RECOMMENDED
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isDanger ? 'bg-red-950 text-red-400 border-red-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      }`}
                    >
                      {opt.risk_category} RISK
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 mb-3">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Distance</span>
                      <span className="font-bold text-slate-200 text-sm">{opt.total_distance_km} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" /> Travel ETA
                      </span>
                      <span className="font-bold text-cyan-400 text-sm">
                        {Math.floor(opt.estimated_time_minutes / 60)}h {opt.estimated_time_minutes % 60}m
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-purple-400" /> Altitude
                      </span>
                      <span className="font-bold text-purple-300 text-sm">+{opt.elevation_gain_m} m</span>
                    </div>
                  </div>

                  {/* Advisories */}
                  <div className="space-y-1 mb-3">
                    {opt.advisories.map((adv, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                        {isDanger ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{adv}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button to view on Map */}
                  <button
                    className={`w-full py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{isSelected ? 'Active On GIS Map' : 'Select & View On Map'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
