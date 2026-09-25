import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  Clock,
  Activity,
  HelpCircle,
  RefreshCw,
  Zap,
  CloudRain,
  Route,
  Navigation,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import {
  DisruptionPredictionRequest,
  DisruptionPredictionResponse,
  RoadRiskPredictionResponse
} from '../../types';

interface DisruptionPredictorCardProps {
  onNavigateToMap?: () => void;
}

export const DisruptionPredictorCard: React.FC<DisruptionPredictorCardProps> = ({
  onNavigateToMap
}) => {
  const [activeMode, setActiveMode] = useState<'road_risk' | 'multi_factor'>('road_risk');

  // 1. Road Risk AI Predictor State (Rainfall, Landslide History, Road Condition -> Safe, Medium, High, Critical)
  const [roadRiskCorridor, setRoadRiskCorridor] = useState('NH-6');
  const [roadRiskRainfall, setRoadRiskRainfall] = useState(125.0);
  const [roadRiskLandslides, setRoadRiskLandslides] = useState(5);
  const [roadRiskCondition, setRoadRiskCondition] = useState('Poor');
  const [roadRiskResult, setRoadRiskResult] = useState<RoadRiskPredictionResponse | null>(null);
  const [roadRiskLoading, setRoadRiskLoading] = useState(false);

  // 2. Multi-factor Geological Engine State (13 Parameters)
  const [params, setParams] = useState<DisruptionPredictionRequest>({
    corridor: 'NH-6',
    state: 'Meghalaya',
    slope_angle_deg: 44.0,
    elevation_m: 1450.0,
    geology: 'Fractured Shale',
    rainfall_24h_mm: 115.0,
    rainfall_72h_accum_mm: 240.0,
    soil_saturation_pct: 88.0,
    road_curvature_index: 7.5,
    drainage_capacity_score: 3.5,
    vegetation_loss_index: 0.65,
    historical_landslides: 4,
    heavy_truck_intensity: 1400
  });

  const [multiFactorPrediction, setMultiFactorPrediction] = useState<DisruptionPredictionResponse | null>(null);
  const [multiFactorLoading, setMultiFactorLoading] = useState(false);

  // Fetch Road Risk AI Prediction
  const fetchRoadRiskPrediction = async () => {
    setRoadRiskLoading(true);
    try {
      const res = await api.predictRoadRisk({
        corridor_name: roadRiskCorridor,
        rainfall_mm: roadRiskRainfall,
        landslide_history: roadRiskLandslides,
        road_condition: roadRiskCondition
      });
      setRoadRiskResult(res);
    } catch (e) {
      console.error('Failed to fetch road risk prediction', e);
    } finally {
      setRoadRiskLoading(false);
    }
  };

  // Fetch Multi-factor Prediction
  const fetchMultiFactorPrediction = async () => {
    setMultiFactorLoading(true);
    try {
      const res = await api.predictDisruption(params);
      setMultiFactorPrediction(res);
    } catch (e) {
      console.error('Failed to run AI prediction', e);
    } finally {
      setMultiFactorLoading(false);
    }
  };

  // Run predictions on changes
  useEffect(() => {
    fetchRoadRiskPrediction();
  }, [roadRiskCorridor, roadRiskRainfall, roadRiskLandslides, roadRiskCondition]);

  useEffect(() => {
    fetchMultiFactorPrediction();
  }, [params.rainfall_24h_mm, params.rainfall_72h_accum_mm, params.slope_angle_deg, params.soil_saturation_pct, params.drainage_capacity_score]);

  // Quick Presets for Road Risk Module (All 8 North Eastern States)
  const applyRoadRiskPreset = (type: string) => {
    if (type === 'meghalaya_critical') {
      setRoadRiskCorridor('NH-6');
      setRoadRiskRainfall(160.0);
      setRoadRiskLandslides(7);
      setRoadRiskCondition('Poor');
    } else if (type === 'sikkim_critical') {
      setRoadRiskCorridor('NH-10');
      setRoadRiskRainfall(165.0);
      setRoadRiskLandslides(7);
      setRoadRiskCondition('Poor');
    } else if (type === 'mizoram_critical') {
      setRoadRiskCorridor('NH-306');
      setRoadRiskRainfall(138.0);
      setRoadRiskLandslides(6);
      setRoadRiskCondition('Poor');
    } else if (type === 'arunachal_high') {
      setRoadRiskCorridor('NH-13');
      setRoadRiskRainfall(85.0);
      setRoadRiskLandslides(5);
      setRoadRiskCondition('Poor');
    } else if (type === 'nagaland_caution') {
      setRoadRiskCorridor('NH-29');
      setRoadRiskRainfall(55.0);
      setRoadRiskLandslides(2);
      setRoadRiskCondition('Fair');
    } else if (type === 'manipur_caution') {
      setRoadRiskCorridor('NH-2');
      setRoadRiskRainfall(68.0);
      setRoadRiskLandslides(4);
      setRoadRiskCondition('Fair');
    } else if (type === 'tripura_moderate') {
      setRoadRiskCorridor('NH-8');
      setRoadRiskRainfall(54.0);
      setRoadRiskLandslides(1);
      setRoadRiskCondition('Fair');
    } else {
      setRoadRiskCorridor('NH-27');
      setRoadRiskRainfall(18.0);
      setRoadRiskLandslides(0);
      setRoadRiskCondition('Excellent');
    }
  };

  // Quick Presets for Multi-factor Engine
  const applyMultiFactorPreset = (presetName: string) => {
    if (presetName === 'cherrapunji') {
      setParams({
        ...params,
        corridor: 'NH-6',
        state: 'Meghalaya',
        slope_angle_deg: 48.0,
        elevation_m: 1430.0,
        rainfall_24h_mm: 195.0,
        rainfall_72h_accum_mm: 420.0,
        soil_saturation_pct: 95.0,
        drainage_capacity_score: 2.0,
        historical_landslides: 6
      });
    } else if (presetName === 'sikkim') {
      setParams({
        ...params,
        corridor: 'NH-10',
        state: 'Sikkim',
        slope_angle_deg: 54.0,
        elevation_m: 1650.0,
        rainfall_24h_mm: 140.0,
        rainfall_72h_accum_mm: 310.0,
        soil_saturation_pct: 92.0,
        drainage_capacity_score: 2.5,
        historical_landslides: 5
      });
    } else if (presetName === 'mizoram') {
      setParams({
        ...params,
        corridor: 'NH-306',
        state: 'Mizoram',
        slope_angle_deg: 46.0,
        elevation_m: 1132.0,
        rainfall_24h_mm: 132.0,
        rainfall_72h_accum_mm: 290.0,
        soil_saturation_pct: 94.0,
        drainage_capacity_score: 3.2,
        historical_landslides: 6
      });
    } else if (presetName === 'arunachal') {
      setParams({
        ...params,
        corridor: 'NH-13',
        state: 'Arunachal Pradesh',
        slope_angle_deg: 52.0,
        elevation_m: 3048.0,
        rainfall_24h_mm: 88.0,
        rainfall_72h_accum_mm: 210.0,
        soil_saturation_pct: 82.0,
        drainage_capacity_score: 3.8,
        historical_landslides: 5
      });
    } else if (presetName === 'normal') {
      setParams({
        ...params,
        corridor: 'NH-27',
        state: 'Assam',
        slope_angle_deg: 12.0,
        elevation_m: 120.0,
        rainfall_24h_mm: 15.0,
        rainfall_72h_accum_mm: 35.0,
        soil_saturation_pct: 38.0,
        drainage_capacity_score: 8.0,
        historical_landslides: 0
      });
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-red-950/80 text-red-400 border-red-800 animate-pulse';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-400 border-orange-800';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-400 border-amber-800';
      default:
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-800';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              AI Road Disruption & Risk Intelligence Engine
            </h2>
          </div>
        </div>

        {onNavigateToMap && (
          <button
            onClick={onNavigateToMap}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>View on OpenStreetMap</span>
          </button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveMode('road_risk')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeMode === 'road_risk'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>Road Risk AI</span>
        </button>

        <button
          onClick={() => setActiveMode('multi_factor')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeMode === 'multi_factor'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Geological Engine</span>
        </button>
      </div>

      {/* TAB 1: ROAD RISK AI PREDICTOR (Rainfall, Landslide History, Road Condition) */}
      {activeMode === 'road_risk' && (
        <div className="space-y-6">
          {/* Quick Presets Bar (All 8 North Eastern States) */}
          <div className="flex items-center justify-between flex-wrap gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-600 font-semibold">8-State Scenario Presets:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => applyRoadRiskPreset('meghalaya_critical')}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-800 px-2.5 py-1 rounded-lg border border-red-200 font-semibold transition"
              >
                ⛈️ Meghalaya NH-6 (Critical)
              </button>
              <button
                onClick={() => applyRoadRiskPreset('sikkim_critical')}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-800 px-2.5 py-1 rounded-lg border border-red-200 font-semibold transition"
              >
                🌊 Sikkim NH-10 (Critical)
              </button>
              <button
                onClick={() => applyRoadRiskPreset('mizoram_critical')}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-800 px-2.5 py-1 rounded-lg border border-red-200 font-semibold transition"
              >
                🏔️ Mizoram NH-306 (Critical)
              </button>
              <button
                onClick={() => applyRoadRiskPreset('arunachal_high')}
                className="text-xs bg-orange-50 hover:bg-orange-100 text-orange-800 px-2.5 py-1 rounded-lg border border-orange-200 font-semibold transition"
              >
                ❄️ Arunachal NH-13 (High)
              </button>
              <button
                onClick={() => applyRoadRiskPreset('manipur_caution')}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold transition"
              >
                🌦️ Manipur NH-2 (High)
              </button>
              <button
                onClick={() => applyRoadRiskPreset('nagaland_caution')}
                className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold transition"
              >
                ⚠️ Nagaland NH-29 (Caution)
              </button>
              <button
                onClick={() => applyRoadRiskPreset('tripura_moderate')}
                className="text-xs bg-yellow-50 hover:bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-lg border border-yellow-200 font-semibold transition"
              >
                🌫️ Tripura NH-8 (Medium)
              </button>
              <button
                onClick={() => applyRoadRiskPreset('safe')}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold transition"
              >
                ☀️ Assam NH-27 (Safe)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Inputs (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-5">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-600" />
                  Prediction Feature Inputs
                </h3>
              </div>

              {/* Highway Corridor */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Highway Corridor (8 NER States)
                </label>
                <select
                  value={roadRiskCorridor}
                  onChange={(e) => setRoadRiskCorridor(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value="NH-27">NH-27: Assam (Guwahati - Nagaon - Lumding - Haflong)</option>
                  <option value="NH-6">NH-6: Meghalaya (Guwahati - Shillong - Khliehriat - Silchar)</option>
                  <option value="NH-13">NH-13: Arunachal Pradesh (Tezpur - Bhalukpong - Bomdila - Tawang)</option>
                  <option value="NH-2">NH-2: Manipur (Kohima - Mao Gate - Senapati - Imphal)</option>
                  <option value="NH-306">NH-306: Mizoram (Silchar - Vairengte - Kolasib - Aizawl)</option>
                  <option value="NH-29">NH-29: Nagaland (Dimapur - Medziphema - Pagla Pahar - Kohima)</option>
                  <option value="NH-8">NH-8: Tripura (Churaibari - Ambassa - Baramura - Agartala)</option>
                  <option value="NH-10">NH-10: Sikkim (Sevoke - Teesta Bazaar - Singtam - Gangtok)</option>
                </select>
              </div>

              {/* Input 1: Rainfall (mm) */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-blue-600" />
                    Rainfall Intensity:
                  </span>
                  <span className={`font-mono font-bold px-2.5 py-0.5 rounded text-xs ${
                    roadRiskRainfall > 100 ? 'bg-red-100 text-red-800 border border-red-300' :
                    roadRiskRainfall > 50 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {roadRiskRainfall} mm
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  step="5"
                  value={roadRiskRainfall}
                  onChange={(e) => setRoadRiskRainfall(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>0 mm (Clear)</span>
                  <span>50 mm (Heavy Drizzle)</span>
                  <span>120 mm (Monsoon Downpour)</span>
                  <span>250 mm (Extreme Cloudburst)</span>
                </div>
              </div>

              {/* Input 2: Landslide History */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Landslide History (Past Events Count):
                  </span>
                  <span className={`font-mono font-bold px-2.5 py-0.5 rounded text-xs ${
                    roadRiskLandslides >= 5 ? 'bg-red-100 text-red-800 border border-red-300' :
                    roadRiskLandslides >= 2 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {roadRiskLandslides} prior landslides
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={roadRiskLandslides}
                  onChange={(e) => setRoadRiskLandslides(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span>0 (No prior slides)</span>
                  <span>3 (Moderate historical activity)</span>
                  <span>10 (Chronic debris-flow zone)</span>
                </div>
              </div>

              {/* Input 3: Road Condition */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Road Condition:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Poor', 'Fair', 'Good', 'Excellent'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setRoadRiskCondition(cond)}
                      className={`py-2.5 rounded-xl font-bold text-xs transition ${
                        roadRiskCondition === cond
                          ? 'bg-purple-600 text-white shadow-md border border-purple-400'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={fetchRoadRiskPrediction}
                disabled={roadRiskLoading}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {roadRiskLoading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Evaluating Road Risk...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run AI Road Risk Prediction</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Results & Alternate Routes (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              {roadRiskResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-semibold text-slate-600">Predicted Risk Assessment:</span>
                    <span
                      className="px-3.5 py-1 rounded-full text-xs font-extrabold shadow-xs flex items-center gap-1.5"
                      style={{
                        backgroundColor: `${roadRiskResult.color}20`,
                        color: roadRiskResult.color,
                        border: `1px solid ${roadRiskResult.color}`
                      }}
                    >
                      <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: roadRiskResult.color }}></span>
                      {roadRiskResult.risk_level.toUpperCase()}
                    </span>
                  </div>

                  {/* Disruption Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-[11px] text-slate-500 font-semibold">Disruption Probability</div>
                      <div className="text-xl font-bold text-slate-900 mt-0.5">
                        {(roadRiskResult.disruption_probability * 100).toFixed(0)}%
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${roadRiskResult.disruption_probability * 100}%`,
                            backgroundColor: roadRiskResult.color
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-[11px] text-slate-500 font-semibold">Clearance ETA</div>
                      <div className="text-xl font-bold text-amber-700 mt-0.5">
                        {roadRiskResult.estimated_clearance_hours} hrs
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2 font-medium">
                        Confidence: {(roadRiskResult.confidence_score * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  {/* Hazard Details */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs">
                    <div className="text-[11px] font-semibold text-slate-500">Hazard Profile:</div>
                    <div className="text-slate-900 font-bold text-xs">{roadRiskResult.predicted_hazard_type}</div>
                  </div>

                  {/* Alternate Route Suggestion */}
                  {roadRiskResult.alternate_route ? (
                    <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                      <div className="flex items-center justify-between text-xs text-blue-900 font-bold">
                        <span className="flex items-center gap-1.5">
                          <Route className="w-4 h-4 text-blue-700" />
                          Alternate Bypass
                        </span>
                        <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded text-blue-800 font-bold border border-blue-200 font-mono">
                          {roadRiskResult.alternate_route.distance_km} km • {Math.floor(roadRiskResult.alternate_route.eta_minutes / 60)}h {roadRiskResult.alternate_route.eta_minutes % 60}m
                        </span>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {roadRiskResult.alternate_route.bypass_name}
                      </div>
                      {onNavigateToMap && (
                        <button
                          onClick={onNavigateToMap}
                          className="w-full py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>View Bypass on Map</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Road Safe · Rerouting Clear</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-500 text-xs">
                  Running prediction...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-FACTOR GEOLOGICAL ENGINE (13 Parameters) */}
      {activeMode === 'multi_factor' && (
        <div className="space-y-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">Presets:</span>
            <button
              onClick={() => applyMultiFactorPreset('cherrapunji')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-300 transition"
            >
              ⛈️ Meghalaya (NH-6)
            </button>
            <button
              onClick={() => applyMultiFactorPreset('sikkim')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-300 transition"
            >
              🏔️ Sikkim (NH-10)
            </button>
            <button
              onClick={() => applyMultiFactorPreset('mizoram')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-300 transition"
            >
              🌿 Mizoram (NH-306)
            </button>
            <button
              onClick={() => applyMultiFactorPreset('arunachal')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-300 transition"
            >
              ❄️ Arunachal (NH-13)
            </button>
            <button
              onClick={() => applyMultiFactorPreset('normal')}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1 rounded-lg border border-slate-300 transition"
            >
              ☀️ Assam (NH-27)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Inputs Panel (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Corridor Selector */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Corridor</label>
                  <select
                    value={params.corridor}
                    onChange={(e) => setParams({ ...params, corridor: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    <option value="NH-27">NH-27: Assam (Guwahati - Nagaon - Silchar)</option>
                    <option value="NH-6">NH-6: Meghalaya (Guwahati - Shillong - Silchar)</option>
                    <option value="NH-13">NH-13: Arunachal Pradesh (Tezpur - Tawang)</option>
                    <option value="NH-2">NH-2: Manipur (Kohima - Imphal Valley)</option>
                    <option value="NH-306">NH-306: Mizoram (Silchar - Aizawl)</option>
                    <option value="NH-29">NH-29: Nagaland (Dimapur - Kohima)</option>
                    <option value="NH-8">NH-8: Tripura (Churaibari - Agartala)</option>
                    <option value="NH-10">NH-10: Sikkim (Siliguri - Gangtok)</option>
                  </select>
                </div>

                {/* Geological Formation */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Geological Bedrock</label>
                  <select
                    value={params.geology}
                    onChange={(e) => setParams({ ...params, geology: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Fractured Shale">Fractured Shale (Highly Unstable)</option>
                    <option value="Sandstone-Siltstone">Sandstone-Siltstone</option>
                    <option value="Gneiss-Schist">Gneiss-Schist</option>
                    <option value="Alluvial Silt">Alluvial Silt (Plains)</option>
                  </select>
                </div>
              </div>

              {/* Sliders Grid */}
              <div className="space-y-3 pt-2">
                {/* 24h Rainfall */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">24h Immediate Rainfall</span>
                    <span className="text-blue-700 font-mono font-bold">{params.rainfall_24h_mm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="250"
                    step="5"
                    value={params.rainfall_24h_mm}
                    onChange={(e) => setParams({ ...params, rainfall_24h_mm: Number(e.target.value) })}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* 72h Cumulative Rainfall */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">72h Cumulative Precipitation (Pore Pressure)</span>
                    <span className="text-blue-700 font-mono font-bold">{params.rainfall_72h_accum_mm} mm</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={params.rainfall_72h_accum_mm}
                    onChange={(e) => setParams({ ...params, rainfall_72h_accum_mm: Number(e.target.value) })}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Slope Angle */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Mountain Slope Angle</span>
                    <span className="text-purple-700 font-mono font-bold">{params.slope_angle_deg}°</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="65"
                    step="1"
                    value={params.slope_angle_deg}
                    onChange={(e) => setParams({ ...params, slope_angle_deg: Number(e.target.value) })}
                    className="w-full accent-purple-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Soil Pore Saturation */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Soil Moisture Saturation Index</span>
                    <span className="text-amber-700 font-mono font-bold">{params.soil_saturation_pct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="2"
                    value={params.soil_saturation_pct}
                    onChange={(e) => setParams({ ...params, soil_saturation_pct: Number(e.target.value) })}
                    className="w-full accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Drainage Capacity */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-700 font-semibold">Roadside Culvert & Drainage Score (1-10)</span>
                    <span className="text-emerald-700 font-mono font-bold">{params.drainage_capacity_score}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={params.drainage_capacity_score}
                    onChange={(e) => setParams({ ...params, drainage_capacity_score: Number(e.target.value) })}
                    className="w-full accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Output Panel (5 Cols) */}
            <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 flex flex-col justify-between">
              {multiFactorPrediction ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-xs font-semibold text-slate-600">Risk Assessment:</span>
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${getRiskBadge(multiFactorPrediction.risk_level)}`}>
                        {multiFactorPrediction.risk_level} RISK
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[11px] text-slate-500 font-semibold">Disruption Probability</div>
                        <div className="text-2xl font-bold text-slate-900 mt-1">
                          {(multiFactorPrediction.disruption_probability * 100).toFixed(1)}%
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                        <div className="text-[11px] text-slate-500 font-semibold">Clearance ETA</div>
                        <div className="text-2xl font-bold text-amber-700 mt-1">
                          {multiFactorPrediction.estimated_clearance_hours} hrs
                        </div>
                      </div>
                    </div>

                    {/* Top Contributing Feature Factors */}
                    <div>
                      <div className="text-xs font-semibold text-slate-600 mb-2">Primary Contributing Risk Factors:</div>
                      <div className="space-y-1.5">
                        {multiFactorPrediction.top_contributing_factors.slice(0, 3).map((f, i) => (
                          <div key={i} className="flex items-center justify-between text-xs bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                            <span className="text-slate-700 font-semibold">{f.factor}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-slate-900 font-bold">{f.value}</span>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                                f.status === 'DANGER' ? 'bg-red-100 text-red-800' : f.status === 'WARNING' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {f.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1 shadow-xs">
                      <div className="font-semibold text-slate-700">Predicted Hazard:</div>
                      <div className="text-red-700 font-bold">{multiFactorPrediction.predicted_hazard_type}</div>
                      <div className="text-[11px] text-slate-600 mt-1 leading-relaxed font-medium">{multiFactorPrediction.recommendation}</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={fetchMultiFactorPrediction}
                      disabled={multiFactorLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                    >
                      {multiFactorLoading ? (
                        <>
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>Computing Random Forest Simulation...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          <span>Re-Run Physics & Geospatial Inference</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-48 text-slate-500 text-xs">
                  Loading model predictions...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
