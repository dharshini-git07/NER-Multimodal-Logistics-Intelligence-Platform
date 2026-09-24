import React, { useState } from 'react';
import { CloudRain, Droplets, Wind, Thermometer, AlertTriangle, ShieldCheck, ChevronRight, Search } from 'lucide-react';
import { WeatherData } from '../../types';

interface WeatherPanelProps {
  weather: WeatherData[];
  onSelectLocation?: (lat: number, lng: number) => void;
}

export const WeatherPanel: React.FC<WeatherPanelProps> = ({ weather, onSelectLocation }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = weather.filter(w =>
    w.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col h-full space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              NER Weather Telemetry
              <span className="text-[10px] bg-blue-950 text-blue-400 px-1.5 py-0.5 rounded border border-blue-800">
                Open-Meteo Live
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">12 Transport Hubs & Mountain Passes</p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter city (e.g. Cherrapunji, Shillong)..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[380px]">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-xs">No weather stations matched.</div>
        ) : (
          filtered.map((w, idx) => {
            const isSevere = w.warning_level === 'ORANGE' || w.warning_level === 'RED';
            const isCaution = w.warning_level === 'YELLOW';

            return (
              <div
                key={`weather-card-${idx}`}
                onClick={() => onSelectLocation && onSelectLocation(w.lat, w.lng)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isSevere
                    ? 'bg-amber-950/20 border-amber-800/60 hover:border-amber-700'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-100">{w.location}</span>
                    <span className="text-[10px] text-slate-400">({w.state})</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      isSevere
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : isCaution
                        ? 'bg-amber-950 text-amber-400 border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}
                  >
                    {w.warning_level}
                  </span>
                </div>

                <div className="text-[11px] text-slate-300 font-medium mb-1.5 truncate">
                  {w.weather_condition}
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-4 gap-1 text-[10px] bg-slate-900/80 p-1.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <CloudRain className="w-2.5 h-2.5 text-cyan-400" /> Rain
                    </span>
                    <span className="font-bold font-mono text-cyan-400">{w.precipitation_mm}mm</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <Droplets className="w-2.5 h-2.5 text-amber-400" /> Soil
                    </span>
                    <span className="font-bold font-mono text-amber-400">{w.soil_moisture_pct}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <Thermometer className="w-2.5 h-2.5 text-purple-400" /> Temp
                    </span>
                    <span className="font-bold font-mono text-slate-200">{w.temperature_c}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block flex items-center gap-0.5">
                      <Wind className="w-2.5 h-2.5 text-blue-400" /> Wind
                    </span>
                    <span className="font-bold font-mono text-slate-200">{w.wind_speed_kmh}k</span>
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
