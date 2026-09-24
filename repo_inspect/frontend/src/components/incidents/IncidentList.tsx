import React, { useState } from 'react';
import { Incident } from '../../types';
import { AlertTriangle, ShieldCheck, Clock, ThumbsUp, MapPin, CheckCircle2, Filter } from 'lucide-react';

interface IncidentListProps {
  incidents: Incident[];
  onUpvote: (id: string) => void;
  onVerify: (id: string) => void;
  onOpenReportModal: () => void;
}

export const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  onUpvote,
  onVerify,
  onOpenReportModal
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = filterSeverity === 'ALL'
    ? incidents
    : incidents.filter(i => i.severity === filterSeverity);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Geo-Tagged Incident & Disruption Feed
              <span className="text-[10px] bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-800 font-mono">
                {incidents.length} Active Records
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Crowdsourced reports from freight drivers & verified Border Roads Organisation field patrols.
            </p>
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          {['ALL', 'CRITICAL_CUTOFF', 'SEVERE', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                filterSeverity === sev
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {sev === 'ALL' ? 'All Incidents' : sev.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((inc) => {
          const isCritical = inc.severity === 'CRITICAL_CUTOFF';
          return (
            <div
              key={inc.id}
              className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                isCritical
                  ? 'bg-red-950/20 border-red-800/80'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                    <span className="text-red-400">⚠️</span> {inc.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-red-950 text-red-400 border-red-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    {inc.severity.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-slate-200 font-semibold text-xs mb-1 flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{inc.location_name}</span>
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
                  {inc.description}
                </p>

                {inc.photo_url && (
                  <img
                    src={inc.photo_url}
                    alt="Road obstruction"
                    className="w-full h-28 object-cover rounded-xl border border-slate-800 mb-3"
                  />
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Reported by:</span>
                  <span className="text-slate-300 font-medium">{inc.reported_by}</span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> Clearance ETA:
                  </span>
                  <span className="font-mono font-bold text-amber-400">{inc.clearance_eta_hours} hrs</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    {inc.status}
                  </span>

                  <button
                    onClick={() => onUpvote(inc.id)}
                    className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-slate-200 text-xs transition"
                  >
                    <ThumbsUp className="w-3 h-3 text-cyan-400" />
                    <span>Confirm ({inc.upvotes})</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
