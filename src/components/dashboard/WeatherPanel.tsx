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
          <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <CloudRain className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900">
            Weather Telemetry
          </h3>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter city..."
          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-semibold"
        />
      </div>

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 max-h-[380px]">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-xs font-bold">No Stations Found</div>
        ) : (
          filtered.map((w: any, idx) => {
            const warningLvl = w.warning_level || w.alert_level || 'NORMAL';
            const isSevere = warningLvl === 'ORANGE' || warningLvl === 'RED' || warningLvl === 'CLOUDBURST_WARNING';
            const isCaution = warningLvl === 'YELLOW' || warningLvl === 'HEAVY_RAIN';

            return (
              <div
                key={`weather-card-${idx}`}
                onClick={() => onSelectLocation && onSelectLocation(w.lat, w.lng)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSevere
                    ? 'bg-red-50/60 border-red-200 hover:border-red-300'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xs text-slate-900">{w.location || w.location_name}</span>
                    <span className="text-xs text-slate-500 font-bold">({w.state})</span>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-lg border ${
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

                <div className="text-xs text-slate-800 font-bold mb-2 truncate">
                  {w.weather_condition || w.condition || 'Clear'}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-4 gap-1.5 text-xs bg-white p-2 rounded-xl border border-slate-200 shadow-xs font-bold">
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5 uppercase text-[11px]">
                      <CloudRain className="w-3 h-3 text-blue-600" /> Rain
                    </span>
                    <span className="font-extrabold font-mono text-blue-700">{w.precipitation_mm ?? w.rainfall_mm_24h ?? 0}mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5 uppercase text-[11px]">
                      <Droplets className="w-3 h-3 text-amber-600" /> Soil
                    </span>
                    <span className="font-extrabold font-mono text-amber-700">{w.soil_moisture_pct ?? 45}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5 uppercase text-[11px]">
                      <Thermometer className="w-3 h-3 text-purple-600" /> Temp
                    </span>
                    <span className="font-extrabold font-mono text-slate-900">{w.temperature_c ?? w.temp_c ?? 22}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5 uppercase text-[11px]">
                      <Wind className="w-3 h-3 text-blue-600" /> Wind
                    </span>
                    <span className="font-extrabold font-mono text-slate-900">{w.wind_speed_kmh ?? w.wind_kmh ?? 12}k</span>
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
