import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Clock,
  Fuel,
  IndianRupee,
  CheckCircle,
  Download,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { api } from '../../services/api';
import { AnalyticsSummary } from '../../types';

export const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics();
        setData(res);
      } catch (e) {
        console.error('Error fetching analytics', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportReport = () => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NER_Accessibility_Intelligence_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  if (loading || !data) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-500" />
        <p>Synthesizing regional vulnerability and corridor analytics...</p>
      </div>
    );
  }

  const { kpi_metrics, state_vulnerability, disruption_trends_30d, hazard_distribution, corridor_health } = data;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              NER Supply Chain & Corridor Vulnerability Analytics
            </h2>

          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Dossier (JSON/CSV)</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Safe Reroute Success
          </span>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {kpi_metrics.freight_safely_rerouted_pct}%
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" /> Transit Delays Averted
          </span>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">
            {kpi_metrics.estimated_freight_delay_prevented_hrs.toLocaleString()} hrs
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
            <Fuel className="w-4 h-4 text-purple-400" /> Fuel Wastage Prevented
          </span>
          <div className="text-2xl font-extrabold text-purple-300 font-mono">
            {kpi_metrics.fuel_wastage_prevented_litres.toLocaleString()} L
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <span className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
            <IndianRupee className="w-4 h-4 text-amber-400" /> Economic Loss Averted
          </span>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">
            ₹{kpi_metrics.economic_loss_averted_cr_inr} Cr
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 30-Day Disruption Trendline Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
              30-Day Disruption Spikes vs. Monsoon Rainfall
            </h3>
            <span className="text-[10px] text-cyan-400 font-medium">Daily Correlation</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={disruption_trends_30d}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLandslides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="rainfall_mm" stroke="#06B6D4" fillOpacity={1} fill="url(#colorRain)" name="Monsoon Rain (mm)" />
                <Area type="monotone" dataKey="landslides" stroke="#EF4444" fillOpacity={1} fill="url(#colorLandslides)" name="Reported Landslides" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Distribution Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
              Disruption Category Breakdown
            </h3>
            <span className="text-[10px] text-purple-400 font-medium">Frequency %</span>
          </div>

          <div className="space-y-3 pt-2">
            {hazard_distribution.map((h, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>{h.name}</span>
                  <span className="font-mono font-bold text-cyan-400">{h.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    style={{ width: `${h.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* State Vulnerability & Corridor Health Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State Vulnerability Index */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
            NER 8-State Geological Vulnerability Ranking
          </h3>
          <div className="divide-y divide-slate-800 text-xs">
            {state_vulnerability.map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-slate-500 font-mono">{idx + 1}.</span>
                  <span className="font-semibold text-slate-200">{s.state}</span>
                  <span className="text-[10px] text-slate-500">({s.lifelines})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{s.active_hazards} Hazards</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      s.risk_category === 'CRITICAL'
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : s.risk_category === 'HIGH'
                        ? 'bg-orange-950 text-orange-400 border-orange-800'
                        : 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    }`}
                  >
                    Index: {s.vulnerability_index}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Corridor Health Status Table */}
        <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">
            Critical Highway Corridors Health Matrix
          </h3>
          <div className="divide-y divide-slate-800 text-xs">
            {corridor_health.map((c, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">{c.corridor}</div>
                  <div className="text-[10px] text-slate-500">Passable Segments: {c.open_segments}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-cyan-400 font-bold">{c.throughput_pct}% Throughput</div>
                  <div className="text-[10px] text-slate-400">Avg Delay: +{c.avg_delay_hrs}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
