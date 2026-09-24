import React, { useState } from 'react';
import { Alert } from '../../types';
import { BellRing, AlertOctagon, Send, Trash2, CheckCircle2, ShieldAlert, Clock, Filter } from 'lucide-react';

interface AlertCenterProps {
  alerts: Alert[];
  onBroadcastAlert: (data: Partial<Alert>) => Promise<void>;
  onDismissAlert: (id: string) => Promise<void>;
}

type AlertCategoryFilter =
  | 'ALL'
  | 'BLOCKED_ROAD'
  | 'FLOOD'
  | 'LANDSLIDE'
  | 'SHORTAGE_RISK'
  | 'CAPACITY_CONSTRAINT'
  | 'ROUTE_CHANGE'
  | 'MODE_SWITCH';

export const AlertCenter: React.FC<AlertCenterProps> = ({
  alerts = [],
  onBroadcastAlert,
  onDismissAlert
}) => {
  const safeAlerts = Array.isArray(alerts) ? alerts : [];
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

  const filteredAlerts = safeAlerts.filter((alt) => {
    if (!alt) return false;
    if (selectedCategory === 'ALL') return true;
    const type = (alt.alert_type || '').toUpperCase();
    if (selectedCategory === 'BLOCKED_ROAD') {
      return type === 'BLOCKED_ROAD' || type === 'ROAD_SEVERED' || type === 'DISRUPTION';
    }
    if (selectedCategory === 'FLOOD') {
      return type === 'FLOOD' || type === 'FLASH_FLOOD' || type === 'HEAVY_RAINFALL';
    }
    if (selectedCategory === 'LANDSLIDE') {
      return type === 'LANDSLIDE' || type === 'LANDSLIDE_IMMINENT';
    }
    if (selectedCategory === 'SHORTAGE_RISK') {
      return type === 'SHORTAGE_RISK';
    }
    if (selectedCategory === 'CAPACITY_CONSTRAINT') {
      return type === 'CAPACITY_CONSTRAINT';
    }
    if (selectedCategory === 'ROUTE_CHANGE') {
      return type === 'ROUTE_CHANGE' || type === 'REROUTE_ADVISORY' || type === 'HIGH_DELIVERY_RISK';
    }
    if (selectedCategory === 'MODE_SWITCH') {
      return type === 'MODE_SWITCH';
    }
    return true;
  });

  const getAlertBadgeColor = (type: string = '', severity: string = '') => {
    const t = type.toUpperCase();
    if (t === 'SHORTAGE_RISK') {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (t === 'CAPACITY_CONSTRAINT') {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    if (t === 'ROUTE_CHANGE' || t === 'REROUTE_ADVISORY' || t === 'HIGH_DELIVERY_RISK') {
      return 'bg-purple-100 text-purple-800 border-purple-300';
    }
    if (t === 'MODE_SWITCH') {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (t === 'BLOCKED_ROAD' || t === 'ROAD_SEVERED' || severity === 'CRITICAL') {
      return 'bg-red-100 text-red-800 border-red-300';
    }
    if (t === 'FLOOD' || t === 'FLASH_FLOOD') {
      return 'bg-blue-100 text-blue-800 border-blue-300';
    }
    if (t === 'LANDSLIDE' || t === 'LANDSLIDE_IMMINENT') {
      return 'bg-amber-100 text-amber-800 border-amber-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getAlertIcon = (type: string = '') => {
    const t = type.toUpperCase();
    if (t === 'SHORTAGE_RISK') return '📦';
    if (t === 'CAPACITY_CONSTRAINT') return '⚖️';
    if (t === 'ROUTE_CHANGE' || t === 'REROUTE_ADVISORY' || t === 'HIGH_DELIVERY_RISK') return '⚡';
    if (t === 'MODE_SWITCH') return '🚂';
    if (t === 'BLOCKED_ROAD' || t === 'ROAD_SEVERED') return '🚧';
    if (t === 'FLOOD' || t === 'FLASH_FLOOD' || t === 'HEAVY_RAINFALL') return '🌊';
    if (t === 'LANDSLIDE' || t === 'LANDSLIDE_IMMINENT') return '🏔️';
    return '⚠️';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Emergency Alerts & Multimodal Advisories
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-mono font-bold">
                {safeAlerts.length} Active Broadcasts
              </span>
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Broadcast Form (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            Dispatch New Highway Alert
          </h3>

          <form onSubmit={handleBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Alert Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="CRITICAL">Critical Cut-off (Immediate Transit Halt)</option>
                <option value="DANGER">Danger (Severe Mountain Hazard)</option>
                <option value="WARNING">Warning (Caution / Slow Speeds)</option>
                <option value="INFO">Informational (Advisory)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Hazard / Intelligence Category</label>
              <select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="SHORTAGE_RISK">📦 Shortage Risk (Inventory Runway Depletion)</option>
                <option value="CAPACITY_CONSTRAINT">⚖️ Capacity Constraint (Route / Axle Overload)</option>
                <option value="ROUTE_CHANGE">⚡ Route Change (Landslide Bypass Detour)</option>
                <option value="MODE_SWITCH">🚂 Mode Switch (Highway Road to NFR Rail / Air / Barge)</option>
                <option value="ROAD_SEVERED">🚧 Blocked Road (Total Blockade / Structural Failure)</option>
                <option value="FLOOD">🌊 Flood (River Inundation / Submerged Bridge)</option>
                <option value="LANDSLIDE_IMMINENT">🏔️ Landslide (Debris Flow / Mountain Slip)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Headline Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Imphal Hospital Shortage Risk / NH-6 Mode Switch"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Detailed Message / Diversion Note</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Instructions for heavy freight carriers, diversion routes, estimated clearance, ETA impact..."
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={broadcasting}
              className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-xl shadow transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{broadcasting ? 'Broadcasting...' : 'Transmit Alert Now'}</span>
            </button>
          </form>
        </div>

        {/* Active Alerts List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="font-bold text-sm text-slate-900">Active Multimodal Alerts</h3>
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 flex-wrap text-xs">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  selectedCategory === 'ALL'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All ({safeAlerts.length})
              </button>

              <button
                onClick={() => setSelectedCategory('SHORTAGE_RISK')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'SHORTAGE_RISK'
                    ? 'bg-red-600 text-white shadow'
                    : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
                }`}
              >
                <span>📦 Shortage Risk</span>
                <span className="text-[10px] opacity-80">
                  ({safeAlerts.filter(a => a.alert_type === 'SHORTAGE_RISK').length})
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory('CAPACITY_CONSTRAINT')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'CAPACITY_CONSTRAINT'
                    ? 'bg-amber-600 text-white shadow'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <span>⚖️ Capacity</span>
                <span className="text-[10px] opacity-80">
                  ({safeAlerts.filter(a => a.alert_type === 'CAPACITY_CONSTRAINT').length})
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory('ROUTE_CHANGE')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'ROUTE_CHANGE'
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                <span>⚡ Route Change</span>
                <span className="text-[10px] opacity-80">
                  ({safeAlerts.filter(a => a.alert_type === 'ROUTE_CHANGE' || a.alert_type === 'REROUTE_ADVISORY' || a.alert_type === 'HIGH_DELIVERY_RISK').length})
                </span>
              </button>

              <button
                onClick={() => setSelectedCategory('MODE_SWITCH')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  selectedCategory === 'MODE_SWITCH'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <span>🚂 Mode Switch</span>
                <span className="text-[10px] opacity-80">
                  ({safeAlerts.filter(a => a.alert_type === 'MODE_SWITCH').length})
                </span>
              </button>
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
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
                        ? 'bg-red-50/60 border-red-300 shadow-sm'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base">{getAlertIcon(alt.alert_type)}</span>
                        <span className="font-bold text-slate-900 text-sm">{alt.title}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getAlertBadgeColor(alt.alert_type, alt.severity)}`}
                        >
                          {alt.alert_type.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                            isCrit
                              ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                              : 'bg-slate-100 text-slate-700 border-slate-300'
                          }`}
                        >
                          {alt.severity}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-0.5 font-medium">
                        <span>Target: <span className="text-slate-700 font-semibold">{alt.target_audience}</span></span>
                        <span>·</span>
                        <span>Time: <span className="text-slate-700 font-mono font-semibold">{new Date(alt.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDismissAlert(alt.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
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
