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
  incidents = [],
  onUpvote,
  onVerify,
  onOpenReportModal
}) => {
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filtered = filterSeverity === 'ALL'
    ? safeIncidents
    : safeIncidents.filter(i => i && i.severity === filterSeverity);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Geo-Tagged Incident Feed
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-200 font-mono font-bold">
                {incidents.length} Active Records
              </span>
            </h2>
          </div>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {['ALL', 'CRITICAL_CUTOFF', 'SEVERE', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2.5 py-1 rounded-lg border font-semibold transition ${
                filterSeverity === sev
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {sev === 'ALL' ? 'All Incidents' : sev.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents Grid: 4 Columns in Lap View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((inc: any) => {
          const isCritical = inc.severity === 'CRITICAL_CUTOFF';
          return (
            <div
              key={inc.id}
              className={`rounded-2xl p-4 border flex flex-col justify-between transition-all ${
                isCritical
                  ? 'bg-red-50/60 border-red-200 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>⚠️</span> {inc.category || inc.incident_type || 'Disruption'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isCritical
                        ? 'bg-red-100 text-red-800 border-red-300 font-bold'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {inc.severity ? inc.severity.replace('_', ' ') : 'ALERT'}
                  </span>
                </div>

                <div className="text-slate-900 font-bold text-xs mb-2 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{inc.location_name}</span>
                </div>

                {inc.photo_url && (
                  <img
                    src={inc.photo_url}
                    alt="Road obstruction"
                    className="w-full h-28 object-cover rounded-xl border border-slate-200 mb-3 shadow-xs"
                  />
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Reported by:</span>
                  <span className="text-slate-800 font-semibold">{inc.reported_by || 'BRO Patrol'}</span>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> Clearance ETA:
                  </span>
                  <span className="font-mono font-bold text-amber-700">{inc.clearance_eta_hours || inc.clearance_eta_hrs || 12} hrs</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {inc.status}
                  </span>

                  <button
                    onClick={() => onUpvote(inc.id)}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-lg text-slate-800 font-bold text-xs transition shadow-xs"
                  >
                    <ThumbsUp className="w-3 h-3 text-blue-600" />
                    <span>Confirm ({inc.upvotes || inc.upvotes_count || 0})</span>
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
