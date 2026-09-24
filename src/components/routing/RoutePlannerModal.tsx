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
  ChevronRight,
  Train,
  Plane,
  Ship,
  Truck,
  Layers,
  Leaf,
  IndianRupee,
  Weight,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { RouteCalculationResponse, RouteOption, TransportMode, CargoPriority, CargoCategory } from '../../types';

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
  'Gangtok',
  'Tezpur'
];

const CARGO_CATEGORIES: { key: CargoCategory; label: string; desc: string }[] = [
  { key: 'Medicine', label: 'Medicine', desc: 'Critical shelf-life, priority airlift/rail' },
  { key: 'Food', label: 'Food', desc: 'High bulk, rail flatcar or inland waterway' },
  { key: 'Construction', label: 'Construction', desc: 'Oversize / heavy axle road/rail' },
  { key: 'Agriculture', label: 'Agriculture', desc: 'Perishable crops & agricultural inputs' },
  { key: 'Relief', label: 'Relief', desc: 'Urgent disaster response convoy' }
];

const CARGO_PRIORITIES: { key: CargoPriority; label: string; icon: any; desc: string }[] = [
  { key: 'BALANCED', label: 'Balanced', icon: Sparkles, desc: 'Optimizes safety, cost & transit time' },
  { key: 'SAFETY', label: 'Disaster Safe', icon: ShieldCheck, desc: 'Bypasses vulnerable mountain choke-points' },
  { key: 'SPEED', label: 'Fastest ETA', icon: Clock, desc: 'Prioritizes airway and express links' },
  { key: 'COST', label: 'Lowest Cost', icon: IndianRupee, desc: 'Favors rail freight & inland waterways' },
  { key: 'ECO', label: 'Green / Low Carbon', icon: Leaf, desc: 'Minimizes CO2 emissions via river & rail' }
];

export const RoutePlannerModal: React.FC<RoutePlannerProps> = ({ onSelectRouteForMap }) => {
  const [origin, setOrigin] = useState('Guwahati');
  const [destination, setDestination] = useState('Imphal');
  const [loading, setLoading] = useState(false);
  const [routeResult, setRouteResult] = useState<RouteCalculationResponse | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Multimodal filtering & Cargo Shortage Intelligence controls
  const [activeTab, setActiveTab] = useState<'ALL' | TransportMode>('ALL');
  const [cargoCategory, setCargoCategory] = useState<CargoCategory>('Medicine');
  const [cargoPriority, setCargoPriority] = useState<CargoPriority>('BALANCED');
  const [cargoWeightTons, setCargoWeightTons] = useState<number>(15.0);

  // Inventory Shortage Runway State (days_remaining = current_stock / daily_consumption)
  const [currentStock, setCurrentStock] = useState<number>(400);
  const [dailyConsumption, setDailyConsumption] = useState<number>(100);

  const [enabledModes, setEnabledModes] = useState<Record<TransportMode, boolean>>({
    ROAD: true,
    RAIL: true,
    WATERWAY: true,
    AIR: true,
    TRANSFER: true
  });

  const toggleMode = (mode: TransportMode) => {
    setEnabledModes((prev) => ({
      ...prev,
      [mode]: !prev[mode]
    }));
  };

  const handleCalculateRoutes = async () => {
    setLoading(true);
    try {
      const allowed = (Object.keys(enabledModes) as TransportMode[]).filter((m) => enabledModes[m]);
      const res = await api.calculateRoutes(
        origin,
        destination,
        allowed,
        cargoPriority,
        cargoWeightTons,
        cargoCategory,
        currentStock,
        dailyConsumption
      );
      setRouteResult(res);

      // Select recommended or primary route
      const rec = res.all_options.find((r) => r.is_recommended) || res.primary_route;
      setSelectedRouteId(rec.route_id);
      onSelectRouteForMap(rec);
    } catch (e) {
      console.error('Routing calculation failed', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter routes based on selected tab
  const displayedRoutes = routeResult
    ? routeResult.all_options.filter((opt) => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'ROAD') return opt.mode === 'ROAD' || !opt.mode;
        if (activeTab === 'RAIL') return opt.mode === 'RAIL' || opt.modes_used?.includes('RAIL');
        if (activeTab === 'AIR') return opt.mode === 'AIR' || opt.modes_used?.includes('AIR');
        if (activeTab === 'WATERWAY') return opt.mode === 'WATERWAY' || opt.modes_used?.includes('WATERWAY');
        if (activeTab === 'TRANSFER') return opt.mode === 'TRANSFER' || (opt.modes_used && opt.modes_used.length > 1);
        return true;
      })
    : [];

  const getModeBadge = (mode?: string, modesUsed?: string[]) => {
    if (modesUsed && modesUsed.length > 1) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800">
          <Layers className="w-3 h-3 text-purple-400" />
          MULTIMODAL ({modesUsed.join(' + ')})
        </span>
      );
    }
    switch (mode) {
      case 'RAIL':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800">
            <Train className="w-3 h-3 text-blue-400" /> RAIL FREIGHT
          </span>
        );
      case 'AIR':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
            <Plane className="w-3 h-3 text-amber-400" /> AIR CARGO
          </span>
        );
      case 'WATERWAY':
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800">
            <Ship className="w-3 h-3 text-teal-400" /> NW-2 WATERWAY
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            <Truck className="w-3 h-3 text-slate-400" /> HIGHWAY ROAD
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Multimodal Resilient Route Intelligence
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-mono font-bold">
                Road + Rail + NW-2 Waterway + Air
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Multimodal route optimization across Road, Rail, NW-2 Waterways, and Air.
            </p>
          </div>
        </div>

        {/* Mode Toggles */}
        <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-xl border border-slate-200 self-start sm:self-center">
          <button
            onClick={() => toggleMode('ROAD')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition ${
              enabledModes.ROAD ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Road
          </button>
          <button
            onClick={() => toggleMode('RAIL')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition ${
              enabledModes.RAIL ? 'bg-blue-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Train className="w-3.5 h-3.5" /> Rail
          </button>
          <button
            onClick={() => toggleMode('WATERWAY')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition ${
              enabledModes.WATERWAY ? 'bg-teal-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Ship className="w-3.5 h-3.5" /> Waterway
          </button>
          <button
            onClick={() => toggleMode('AIR')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition ${
              enabledModes.AIR ? 'bg-amber-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plane className="w-3.5 h-3.5" /> Air
          </button>
        </div>
      </div>

      {/* Origin & Destination Selector Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-blue-600" /> Origin Hub / Terminal
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
          >
            {NER_CITIES.map((city) => (
              <option key={`origin-${city}`} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-1 flex items-center justify-center pb-2">
          <ArrowRight className="w-4 h-4 text-slate-400" />
        </div>

        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-600" /> Destination Hub / Terminal
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
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
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Solving Multimodal Paths...
              </>
            ) : (
              <>
                <Navigation className="w-3.5 h-3.5" /> Optimize Multimodal Routes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Priority & Consignment Parameters */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
        {/* Cargo Category Selector */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mr-1">
            Cargo Type:
          </span>
          {CARGO_CATEGORIES.map((c) => {
            const isSelected = cargoCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setCargoCategory(c.key)}
                title={c.desc}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mr-1">
              Transit Priority:
            </span>
            {CARGO_PRIORITIES.map((p) => {
              const Icon = p.icon;
              const isSelected = cargoPriority === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setCargoPriority(p.key)}
                  title={p.desc}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-4 flex items-center justify-end gap-2 text-xs text-slate-700">
            <Weight className="w-4 h-4 text-blue-600" />
            <span className="text-slate-600 font-medium">Consignment:</span>
            <select
              value={cargoWeightTons}
              onChange={(e) => setCargoWeightTons(Number(e.target.value))}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-medium"
            >
              <option value={5}>5 MT (Van / Small Truck)</option>
              <option value={15}>15 MT (Urgent Medical / Refrigerator)</option>
              <option value={20}>20 MT (Standard Freight)</option>
              <option value={50}>50 MT (Heavy Convoy)</option>
              <option value={250}>250 MT (Bulk / Rake Level)</option>
            </select>
          </div>
        </div>

        {/* Shortage Risk Runway Intelligence Sub-Panel */}
        <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">Inventory Shortage Calculator</span>
                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                  Demo / Representative Data
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block">
                Calculated Stock Runway: <strong className="text-amber-700 font-mono">{(currentStock / (dailyConsumption > 0 ? dailyConsumption : 1)).toFixed(1)} days</strong>
                {' '}({currentStock} units / {dailyConsumption} per day)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div>
              <label className="text-[10px] text-slate-500 block font-medium">Current Stock</label>
              <input
                type="number"
                min={1}
                value={currentStock}
                onChange={(e) => setCurrentStock(Math.max(1, Number(e.target.value)))}
                className="w-20 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono font-semibold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 block font-medium">Daily Usage</label>
              <input
                type="number"
                min={1}
                value={dailyConsumption}
                onChange={(e) => setDailyConsumption(Math.max(1, Number(e.target.value)))}
                className="w-20 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 font-mono font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Route Results Comparison */}
      {routeResult && (
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-blue-800">Multimodal Intelligence Assessment: </span>
              {routeResult.summary}
            </div>
          </div>

          {/* Mode Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                activeTab === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All Options ({routeResult.all_options.length})
            </button>
            <button
              onClick={() => setActiveTab('TRANSFER')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'TRANSFER' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Hybrid Multimodal
            </button>
            <button
              onClick={() => setActiveTab('ROAD')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'ROAD' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" /> Road Corridors
            </button>
            <button
              onClick={() => setActiveTab('RAIL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'RAIL' ? 'bg-blue-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Train className="w-3.5 h-3.5" /> Rail Freight
            </button>
            <button
              onClick={() => setActiveTab('WATERWAY')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'WATERWAY' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ship className="w-3.5 h-3.5" /> NW-2 Waterways
            </button>
            <button
              onClick={() => setActiveTab('AIR')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                activeTab === 'AIR' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Plane className="w-3.5 h-3.5" /> Air Express
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedRoutes.map((opt) => {
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
                      ? 'bg-white border-blue-600 shadow-lg ring-1 ring-blue-600/20'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{opt.route_name}</span>
                      {getModeBadge(opt.mode, opt.modes_used)}
                      {opt.is_recommended && (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> BEST MATCH
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isDanger ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {opt.risk_category} RISK
                    </span>
                  </div>

                  {/* Primary Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-200 mb-3 shadow-xs">
                    <div>
                      <span className="text-slate-500 text-[11px] block font-medium">Distance</span>
                      <span className="font-bold text-slate-900 text-sm">{opt.total_distance_km} km</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" /> Transit ETA
                      </span>
                      <span className="font-bold text-blue-600 text-sm">
                        {Math.floor(opt.estimated_time_minutes / 60)}h {opt.estimated_time_minutes % 60}m
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block font-medium flex items-center gap-1">
                        <Mountain className="w-3 h-3 text-purple-600" /> Terrain Climb
                      </span>
                      <span className="font-bold text-purple-700 text-sm">+{opt.elevation_gain_m} m</span>
                    </div>
                  </div>

                  {/* Multimodal Metrics: Cost, Carbon, Transshipment */}
                  <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3">
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Est. Cost</span>
                        <span className="font-semibold text-emerald-700 text-xs">
                          {opt.estimated_cost_inr ? `₹${opt.estimated_cost_inr.toLocaleString('en-IN')}` : 'Standard Tolls'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-teal-600" />
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Carbon Footprint</span>
                        <span className="font-semibold text-teal-700 text-xs">
                          {opt.carbon_emissions_kg ? `${opt.carbon_emissions_kg} kg CO₂` : 'Standard Diesel'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      <div>
                        <span className="text-[10px] text-slate-500 block font-medium">Transshipment</span>
                        <span className="font-semibold text-slate-800 text-xs">
                          {opt.transshipment_points && opt.transshipment_points.length > 0
                            ? `${opt.transshipment_points.length} Intermodal Hubs`
                            : 'Direct Transit'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transshipment Points Details if available */}
                  {opt.transshipment_points && opt.transshipment_points.length > 0 && (
                    <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded-lg text-[11px] text-purple-900 space-y-1">
                      <span className="font-bold text-purple-800 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-purple-600" /> Intermodal Transfer Junctions:
                      </span>
                      {opt.transshipment_points.map((tp, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[10px] text-slate-700 pl-2">
                          <span>• {tp.hub_name} ({tp.from_mode} ➔ {tp.to_mode})</span>
                          <span className="text-purple-700 font-mono font-semibold">+{tp.transfer_time_minutes}m transfer</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Segment-by-segment Breakdown */}
                  {opt.segments && opt.segments.length > 0 && (
                    <div className="mb-3 p-2.5 bg-white border border-slate-200 rounded-lg space-y-1.5 shadow-xs">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                        <span>Segment-by-Segment Modes ({opt.segments.length} legs)</span>
                        <span className="text-blue-600 font-mono text-[9px]">Operator & Speed</span>
                      </div>
                      <div className="space-y-1 divide-y divide-slate-200">
                        {opt.segments.map((seg, sIdx) => (
                          <div key={sIdx} className="pt-1 first:pt-0 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 overflow-hidden pr-2">
                              <span
                                className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded border ${
                                  seg.mode === 'RAIL'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : seg.mode === 'AIR'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : seg.mode === 'WATERWAY'
                                    ? 'bg-teal-50 text-teal-700 border-teal-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {seg.mode}
                              </span>
                              <span className="text-slate-800 truncate font-semibold">{seg.segment_name}</span>
                            </div>
                            <div className="text-right text-[10px] text-slate-500 flex-shrink-0">
                              <span className="font-semibold text-slate-700">{seg.distance_km} km</span>
                              <span className="text-slate-500 ml-1">· {seg.transit_speed_kmh || 45} km/h</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Why this route? Explanation */}
                  {opt.why_this_route && (
                    <div className="mb-3 p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-200">
                      <div className="flex items-center gap-1.5 font-bold text-cyan-300 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Why this route?</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-200">
                        {Array.isArray(opt.why_this_route) ? opt.why_this_route.join(' ') : opt.why_this_route}
                      </p>
                    </div>
                  )}

                  {/* Shortage Risk Assessment Warning */}
                  {opt.shortage_assessment && opt.shortage_assessment.is_breached && (
                    <div className="mb-3 p-2.5 bg-red-950/40 border border-red-600/70 rounded-xl text-xs text-red-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <strong className="text-red-300 block font-semibold">Inventory Shortage Risk: BREACHED</strong>
                        <span className="text-[11px] text-red-200">
                          {opt.shortage_assessment.explanation}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Capacity Constraint Warning */}
                  {opt.capacity_constrained && (
                    <div className="mb-3 p-2.5 bg-amber-950/40 border border-amber-600/70 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-amber-300 block font-semibold">Capacity Constraint Alert:</strong>
                        <span className="text-[11px] text-amber-200">
                          Payload ({cargoWeightTons} MT) exceeds route mode capacity limit ({opt.cargo_capacity_tons || 20} MT). Modal split or rail freight recommended.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Explainability Breakdown Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      Cargo: {cargoCategory}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded border font-medium ${
                        opt.overall_risk_score < 0.35
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : opt.overall_risk_score < 0.65
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-red-950 text-red-300 border-red-800'
                      }`}
                    >
                      Risk Avoidance: {Math.round((1 - opt.overall_risk_score) * 100)}% Safe
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                      Payload: {cargoWeightTons} MT
                    </span>
                    {opt.estimated_time_minutes <= 48 * 60 && (
                      <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-medium">
                        Fits Shortage Runway (&lt; 4 days)
                      </span>
                    )}
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
                    <span>{isSelected ? 'Active On Multimodal Map' : 'Select & View Route'}</span>
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
