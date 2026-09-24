import React, { useState } from 'react';
import { CloudRain, Droplets, Wind, Thermometer, AlertTriangle, ShieldCheck, ChevronRight, Search } from 'lucide-react';
import { WeatherData } from '../../types';

interface WeatherPanelProps {
  weather: WeatherData[];
  onSelectLocation?: (lat: number, lng: number) => void;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather = [], onSelectLocation }) => {
  const safeWeather = Array.isArray(weather) ? weather : [];
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = safeWeather.filter(w =>
    w &&
    (((w as any).location || (w as any).location_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    ((w as any).state || '').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col h-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              NER Weather Telemetry
              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-bold">
                Open-Meteo Live
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter city (e.g. Cherrapunji, Shillong)..."
          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[380px]">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-slate-400 text-xs">No weather stations matched.</div>
        ) : (
          filtered.map((w: any, idx) => {
            const warningLvl = w.warning_level || w.alert_level || 'NORMAL';
            const isSevere = warningLvl === 'ORANGE' || warningLvl === 'RED' || warningLvl === 'CLOUDBURST_WARNING';
            const isCaution = warningLvl === 'YELLOW' || warningLvl === 'HEAVY_RAIN';

            return (
              <div
                key={`weather-card-${idx}`}
                onClick={() => onSelectLocation && onSelectLocation(w.lat, w.lng)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSevere
                    ? 'bg-red-50/60 border-red-200 hover:border-red-300'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{w.location || w.location_name}</span>
                    <span className="text-[10px] text-slate-500">({w.state})</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      isSevere
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : isCaution
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    {warningLvl}
                  </span>
                </div>

                <div className="text-[11px] text-slate-700 font-semibold mb-1.5 truncate">
                  {w.weather_condition || w.condition || 'Clear'}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-4 gap-1 text-[10px] bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs">
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <CloudRain className="w-2.5 h-2.5 text-blue-600" /> Rain
                    </span>
                    <span className="font-bold font-mono text-blue-700">{w.precipitation_mm ?? w.rainfall_mm_24h ?? 0}mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5 text-amber-600" /> Soil
                    </span>
                    <span className="font-bold font-mono text-amber-700">{w.soil_moisture_pct ?? 45}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <Thermometer className="w-2.5 h-2.5 text-purple-600" /> Temp
                    </span>
                    <span className="font-bold font-mono text-slate-800">{w.temperature_c ?? w.temp_c ?? 22}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <Wind className="w-2.5 h-2.5 text-blue-600" /> Wind
                    </span>
                    <span className="font-bold font-mono text-slate-800">{w.wind_speed_kmh ?? w.wind_kmh ?? 12}k</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
