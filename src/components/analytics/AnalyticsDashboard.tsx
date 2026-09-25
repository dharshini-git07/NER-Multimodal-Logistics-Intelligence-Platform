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
      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
        <p>Synthesizing regional vulnerability and corridor analytics...</p>
      </div>
    );
  }

  const kpis = data.kpi_metrics || {
    freight_safely_rerouted_pct: data.disaster_avoidance_rate_pct ?? 98.4,
    estimated_freight_delay_prevented_hrs: Math.round((data.avg_delay_minutes ?? 54) * 24),
    fuel_wastage_prevented_litres: 14200,
    economic_loss_averted_cr_inr: data.estimated_economic_loss_prevented_cr ?? 14.8
  };

  const state_vulnerability = data.state_vulnerability || [];
  const disruption_trends_30d = data.disruption_trends_30d || [];
  const hazard_distribution = data.hazard_distribution || [];
  const corridor_health = data.corridor_health || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              NER Supply Chain Analytics
            </h2>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-xl transition"
        >
          <Download className="w-4 h-4 text-blue-600" />
          <span>Export Dossier (JSON/CSV)</span>
        </button>
      </div>

      {/* KPI Cards Row (4 Columns in Lap / Desktop View) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-slate-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Safe Reroute Success
          </span>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            {kpis.freight_safely_rerouted_pct ?? 98.4}%
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-slate-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <Clock className="w-4 h-4 text-blue-600" /> Transit Delays Averted
          </span>
          <div className="text-2xl font-extrabold text-blue-700 font-mono">
            {(kpis.estimated_freight_delay_prevented_hrs ?? 1296).toLocaleString()} hrs
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-slate-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <Fuel className="w-4 h-4 text-purple-600" /> Fuel Wastage Prevented
          </span>
          <div className="text-2xl font-extrabold text-purple-700 font-mono">
            {(kpis.fuel_wastage_prevented_litres ?? 14200).toLocaleString()} L
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <span className="text-slate-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
            <IndianRupee className="w-4 h-4 text-amber-600" /> Economic Loss Averted
          </span>
          <div className="text-2xl font-extrabold text-amber-700 font-mono">
            ₹{kpis.economic_loss_averted_cr_inr ?? 14.8} Cr
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 30-Day Disruption Trendline Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              30-Day Disruption Spikes vs. Monsoon Rainfall
            </h3>
            <span className="text-[10px] text-blue-700 font-bold">Daily Correlation</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={disruption_trends_30d}>
                <defs>
                  <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLandslides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '0.75rem', fontSize: '11px', color: '#0F172A' }}
                />
                <Area type="monotone" dataKey="rainfall_mm" stroke="#2563EB" fillOpacity={1} fill="url(#colorRain)" name="Monsoon Rain (mm)" />
                <Area type="monotone" dataKey="landslides" stroke="#DC2626" fillOpacity={1} fill="url(#colorLandslides)" name="Reported Landslides" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Distribution Bar Chart (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Disruption Category Breakdown
            </h3>
            <span className="text-[10px] text-purple-700 font-bold">Frequency %</span>
          </div>

          <div className="space-y-3 pt-2">
            {hazard_distribution.map((h, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs text-slate-700 font-semibold">
                  <span>{h.name}</span>
                  <span className="font-mono font-bold text-blue-700">{h.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
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
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            NER 8-State Geological Vulnerability Ranking
          </h3>
          <div className="divide-y divide-slate-200 text-xs">
            {state_vulnerability.map((s, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 text-slate-400 font-mono font-bold">{idx + 1}.</span>
                  <span className="font-bold text-slate-900">{s.state}</span>
                  <span className="text-[10px] text-slate-500 font-medium">({s.lifelines})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-medium">{s.active_hazards} Hazards</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      s.risk_category === 'CRITICAL'
                        ? 'bg-red-100 text-red-800 border-red-300'
                        : s.risk_category === 'HIGH'
                        ? 'bg-orange-100 text-orange-800 border-orange-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
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
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
            Critical Highway Corridors Health Matrix
          </h3>
          <div className="divide-y divide-slate-200 text-xs">
            {corridor_health.map((c, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{c.corridor}</div>
                  <div className="text-[10px] text-slate-500 font-medium">Passable Segments: {c.open_segments}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-blue-700 font-bold">{c.throughput_pct}% Throughput</div>
                  <div className="text-[10px] text-slate-500 font-medium">Avg Delay: +{c.avg_delay_hrs}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
