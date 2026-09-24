import React, { useState } from 'react';
import { Alert } from '../../types';
import { BellRing, AlertOctagon, Send, Trash2, CheckCircle2, ShieldAlert, Clock, Filter } from 'lucide-react';

interface AlertCenterProps {
  alerts: Alert[];
  onBroadcastAlert: (data: Partial<Alert>) => Promise<void>;
  onDismissAlert: (id: string) => Promise<void>;
}

type AlertCategoryFilter = 'ALL' | 'BLOCKED_ROAD' | 'FLOOD' | 'LANDSLIDE' | 'DELIVERY_DELAY';

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts,
  onBroadcastAlert,
  onDismissAlert
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'INFO' | 'WARNING' | 'DANGER' | 'CRITICAL'>('CRITICAL');
  const [alertType, setAlertType] = useState('ROAD_SEVERED');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategoryFilter>('ALL');
  const [broadcasting, setBroadcasting] = useState(false);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setBroadcasting(true);
    try {
      await onBroadcastAlert({
        title,
        message,
        severity,
        alert_type: alertType,
        target_audience: 'ALL'
      });
      setTitle('');
      setMessage('');
    } catch (e) {
      console.error(e);
    } finally {
      setBroadcasting(false);
    }
  };

  const filteredAlerts = alerts.filter((alt) => {
    if (selectedCategory === 'ALL') return true;
    const type = alt.alert_type.toUpperCase();
    if (selectedCategory === 'BLOCKED_ROAD') {
      return type === 'BLOCKED_ROAD' || type === 'ROAD_SEVERED';
    }
    if (selectedCategory === 'FLOOD') {
      return type === 'FLOOD' || type === 'FLASH_FLOOD' || type === 'HEAVY_RAINFALL';
    }
    if (selectedCategory === 'LANDSLIDE') {
      return type === 'LANDSLIDE' || type === 'LANDSLIDE_IMMINENT';
    }
    if (selectedCategory === 'DELIVERY_DELAY') {
      return type === 'DELIVERY_DELAY';
    }
    return true;
  });

  const getAlertBadgeColor = (type: string, severity: string) => {
    const t = type.toUpperCase();
    if (t === 'BLOCKED_ROAD' || t === 'ROAD_SEVERED' || severity === 'CRITICAL') {
      return 'bg-red-950 text-red-400 border-red-800';
    }
    if (t === 'FLOOD' || t === 'FLASH_FLOOD') {
      return 'bg-blue-950 text-blue-400 border-blue-800';
    }
    if (t === 'LANDSLIDE' || t === 'LANDSLIDE_IMMINENT') {
      return 'bg-amber-950 text-amber-400 border-amber-800';
    }
    if (t === 'DELIVERY_DELAY') {
      return 'bg-purple-950 text-purple-300 border-purple-800';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const getAlertIcon = (type: string) => {
    const t = type.toUpperCase();
    if (t === 'BLOCKED_ROAD' || t === 'ROAD_SEVERED') return '🚧';
    if (t === 'FLOOD' || t === 'FLASH_FLOOD' || t === 'HEAVY_RAINFALL') return '🌊';
    if (t === 'LANDSLIDE' || t === 'LANDSLIDE_IMMINENT') return '🏔️';
    if (t === 'DELIVERY_DELAY') return '⏱️';
    return '⚠️';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Emergency Alerts & Corridor Advisories
              <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800 font-mono">
                {alerts.length} Active Broadcasts
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Multi-hazard broadcast channel categorizing Blocked Roads, Floods, Landslides, and Delivery Delays.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-950/60 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            Dispatch New Highway Alert
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Alert Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="CRITICAL">Critical Cut-off (Immediate Transit Halt)</option>
                <option value="DANGER">Danger (Severe Mountain Hazard)</option>
                <option value="WARNING">Warning (Caution / Slow Speeds)</option>
                <option value="INFO">Informational (Advisory)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hazard Category</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ROAD_SEVERED">🚧 Blocked Road (Total Blockade / Structural Failure)</option>
                <option value="FLOOD">🌊 Flood (River Inundation / Submerged Bridge)</option>
                <option value="LANDSLIDE_IMMINENT">🏔️ Landslide (Debris Flow / Mountain Slip)</option>
                <option value="DELIVERY_DELAY">⏱️ Delivery Delay (Detour / SLA ETA Breach)</option>
                <option value="REROUTE_ADVISORY">⚡ Alternate Route Bypass Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Headline Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NH-6 Sonapur Tunnel Blocked"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Detailed Message / Diversion Note</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Instructions for heavy freight carriers, diversion routes, estimated clearance, ETA impact..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{broadcasting ? 'Broadcasting...' : 'Transmit Alert Now'}</span>
            </button>
          </form>
        </div>

        {/* Active Alerts List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-slate-200">Active Corridor Alerts</h3>
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 flex-wrap text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-700 text-white shadow'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setSelectedCategory('BLOCKED_ROAD')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'BLOCKED_ROAD'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-slate-800 text-red-400 hover:bg-slate-700'
                }`}
              >
                <span>🚧 Blocked Roads</span>
                <span className="text-[10px] opacity-80">
                  ({alerts.filter(a => a.alert_type === 'BLOCKED_ROAD' || a.alert_type === 'ROAD_SEVERED').length})
                </span>
              </button>
              <button
                onClick={() => setSelectedCategory('FLOOD')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'FLOOD'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800 text-blue-300 hover:bg-slate-700'
                }`}
              >
                <span>🌊 Floods</span>
                <span className="text-[10px] opacity-80">
                  ({alerts.filter(a => a.alert_type === 'FLOOD' || a.alert_type === 'FLASH_FLOOD' || a.alert_type === 'HEAVY_RAINFALL').length})
                </span>
              </button>
              <button
                onClick={() => setSelectedCategory('LANDSLIDE')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'LANDSLIDE'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-slate-800 text-amber-300 hover:bg-slate-700'
                }`}
              >
                <span>🏔️ Landslides</span>
                <span className="text-[10px] opacity-80">
                  ({alerts.filter(a => a.alert_type === 'LANDSLIDE' || a.alert_type === 'LANDSLIDE_IMMINENT').length})
                </span>
              </button>
              <button
                onClick={() => setSelectedCategory('DELIVERY_DELAY')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'DELIVERY_DELAY'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
                }`}
              >
                <span>⏱️ Delivery Delays</span>
                <span className="text-[10px] opacity-80">
                  ({alerts.filter(a => a.alert_type === 'DELIVERY_DELAY').length})
                </span>
              </button>
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
              No active alerts matching this hazard category.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAlerts.map((alt) => {
                const isCrit = alt.severity === 'CRITICAL';
                return (
                  <div
                    key={alt.id}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      isCrit
                        ? 'bg-red-950/30 border-red-800/80 shadow-md shadow-red-950/20'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base">{getAlertIcon(alt.alert_type)}</span>
                        <span className="font-bold text-slate-100 text-sm">{alt.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getAlertBadgeColor(alt.alert_type, alt.severity)}`}
                        >
                          {alt.alert_type.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            isCrit
                              ? 'bg-red-950 text-red-400 border-red-800 animate-pulse'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {alt.severity}
                        </span>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed">{alt.message}</p>

                      <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                        <span>Target: <span className="text-slate-400 font-medium">{alt.target_audience}</span></span>
                        <span>Time: <span className="text-slate-400 font-mono">{new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDismissAlert(alt.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
