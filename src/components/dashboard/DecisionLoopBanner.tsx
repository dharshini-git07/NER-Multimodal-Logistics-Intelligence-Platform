import React from 'react';
import { ShieldAlert, ArrowRight, Zap, CheckCircle2, AlertTriangle, Layers, Clock, Activity, RefreshCw, X } from 'lucide-react';
import { Vehicle, Alert, RouteOption } from '../../types';

interface DecisionLoopBannerProps {
  active: boolean;
  stage: number; // 1 to 5
  affectedVehicle?: Vehicle | null;
  onDismiss: () => void;
  onViewMap?: () => void;
}

export const DecisionLoopBanner: React.FC<DecisionLoopBannerProps> = ({
  active,
  stage,
  affectedVehicle,
  onDismiss,
  onViewMap
}) => {
  if (!active) return null;

  const steps = [
    {
      num: 1,
      name: 'Disruption Sensed',
      detail: 'NH-6 Severed · 0% Access',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      num: 2,
      name: 'Risk & ETA Evaluated',
      detail: '88% Risk · Extended 8d ETA',
      icon: Activity,
      color: 'text-amber-600'
    },
    {
      num: 3,
      name: 'Stock Runway Evaluated',
      detail: '4d Stock < 8d Road ETA',
      icon: Clock,
      color: 'text-rose-600'
    },
    {
      num: 4,
      name: 'Multimodal Reroute',
      detail: 'NFR BG Rail Selected',
      icon: Layers,
      color: 'text-purple-600'
    },
    {
      num: 5,
      name: 'Telemetry & Alerts',
      detail: 'ROAD + RAIL · 2.5d ETA',
      icon: CheckCircle2,
      color: 'text-emerald-600'
    }
  ];

  return (
    <div className="decision-loop-banner rounded-xl border border-teal-300 bg-gradient-to-r from-teal-50 to-blue-50 p-4 shadow-sm space-y-3 relative overflow-hidden select-none text-slate-900">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-teal-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-teal-100 text-teal-800 border border-teal-300 animate-pulse">
            <Zap size={18} />
          </span>
          <h3 className="text-xs font-black text-slate-900 tracking-wide uppercase flex items-center gap-2">
            Decision Loop
            <span className="text-xs bg-teal-100 text-teal-900 px-2 py-0.5 rounded-lg border border-teal-300 font-mono font-bold">
              Guwahati ➔ Imphal
            </span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {onViewMap && (
            <button
              onClick={onViewMap}
              className="px-3 py-1.5 text-xs rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold transition shadow-xs active:scale-95"
            >
              View Rerouted Map ➔
            </button>
          )}
          <button
            onClick={onDismiss}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition"
            title="Dismiss notification"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* 5-Step Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
        {steps.map((st) => {
          const isDone = stage >= st.num;
          const isCurrent = stage === st.num;
          const StepIcon = st.icon;

          return (
            <div
              key={st.num}
              className={`p-3 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-white border-teal-500 shadow-sm scale-[1.01]'
                  : isDone
                  ? 'bg-white/80 border-slate-200 opacity-90'
                  : 'bg-white/40 border-slate-200 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  STEP 0{st.num}
                </span>
                {isDone ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                )}
              </div>
              <div className="flex items-center gap-1.5 font-extrabold text-xs text-slate-900">
                <StepIcon size={16} className={st.color} />
                <span className="truncate">{st.name}</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 font-bold truncate">
                {st.detail}
              </p>
            </div>
          );
        })}
      </div>

      {/* Rerouted Shipment Summary Strip */}
      {affectedVehicle && (
        <div className="p-3 rounded-xl bg-white border border-teal-200 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase">Shipment:</span>
            <strong className="text-slate-900 font-mono text-xs font-black">{affectedVehicle.plate_number || 'MED-IMPHAL-001'}</strong>
            <span className="text-slate-300">|</span>
            <span className="text-slate-700 uppercase">{affectedVehicle.cargo_type}</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">
              Mode: <strong className="text-purple-700 uppercase font-black">{affectedVehicle.current_mode}</strong>
            </span>
            <span className="text-slate-500">
              ETA: <strong className="text-emerald-700 font-black">{Math.floor((affectedVehicle.eta_minutes || 0)/60)}h {(affectedVehicle.eta_minutes || 0)%60}m</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
