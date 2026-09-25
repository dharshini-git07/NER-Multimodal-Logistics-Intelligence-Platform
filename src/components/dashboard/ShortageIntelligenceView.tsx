import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Filter
} from 'lucide-react';
import { SupplyStockItem, CargoCategory } from '../../types';
import { SAMPLE_SUPPLY_STOCK_ITEMS } from '../../services/multimodalEngine';

interface ShortageIntelligenceViewProps {
  items?: SupplyStockItem[];
  onSelectAction?: (item: SupplyStockItem) => void;
  compact?: boolean;
}

export const ShortageIntelligenceView: React.FC<ShortageIntelligenceViewProps> = ({
  items = SAMPLE_SUPPLY_STOCK_ITEMS,
  onSelectAction,
  compact = false
}) => {
  const safeItems = Array.isArray(items) ? items : SAMPLE_SUPPLY_STOCK_ITEMS;
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredItems = safeItems.filter((item) => {
    if (!item) return false;
    if (filterCategory === 'ALL') return true;
    return item.cargo_category === filterCategory;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="shortage-intelligence-card bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-slate-900">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200">
              <Activity size={18} />
            </span>
            <h3 className="text-base font-semibold text-slate-900 tracking-tight">
              Supply & Shortage Risk Intelligence
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            Demo / Representative Data
          </span>
          {!compact && (
            <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded border border-slate-200 text-xs">
              <Filter size={12} className="text-slate-500 ml-1" />
              {['ALL', 'Medicine', 'Food', 'Relief / Emergency Supplies'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat === 'Relief / Emergency Supplies' ? 'Relief' : cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid of Shortage Items */}
      <div className={`grid ${compact ? 'grid-cols-1 gap-2.5' : 'grid-cols-1 md:grid-cols-2 gap-3'}`}>
        {filteredItems.map((item) => {
          const daysStock = item.days_remaining_stock ?? item.days_remaining ?? 0;
          const riskLevel = item.shortage_risk_level || item.shortage_risk || 'LOW';
          const isCriticalBreach = item.expected_delivery_days > daysStock;
          const deficitDays = Math.max(0, +(item.expected_delivery_days - daysStock).toFixed(1));
          const locationDisplay = item.city_destination ? `${item.destination_facility} · ${item.city_destination}` : (item.destination_facility || item.location_name);
          const recMode = item.recommended_mode ? item.recommended_mode : (isCriticalBreach ? 'HYBRID' : 'ROAD');

          return (
            <div
              key={item.id}
              className={`rounded-xl p-3.5 border transition-all ${
                isCriticalBreach
                  ? 'bg-red-50/60 border-red-200'
                  : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 tracking-tight uppercase">
                      {item.cargo_category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getRiskBadge(riskLevel)}`}>
                      {riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-0.5">
                    {locationDisplay}
                  </p>
                </div>
                {isCriticalBreach && (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 shrink-0">
                    Deficit: -{deficitDays}d
                  </span>
                )}
              </div>

              {/* 2-Column Metric Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs py-1.5 font-medium text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Stock Runway</span>
                  <strong className={`font-mono ${daysStock <= 4 ? 'text-red-700 font-bold' : 'text-slate-900'}`}>
                    {daysStock} days
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Delivery ETA</span>
                  <strong className={`font-mono ${isCriticalBreach ? 'text-red-700 font-bold' : 'text-slate-900'}`}>
                    {item.expected_delivery_days} days
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Recommended</span>
                  <strong className="text-teal-700 uppercase font-bold text-[11px]">
                    {recMode}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[11px]">Risk Level</span>
                  <strong className={`uppercase text-[11px] ${item.shortage_risk_level === 'CRITICAL' ? 'text-red-700 font-bold' : 'text-amber-700'}`}>
                    {item.shortage_risk_level}
                  </strong>
                </div>
              </div>

              {/* Action Button Footer */}
              {onSelectAction && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-end">
                  <button
                    onClick={() => onSelectAction(item)}
                    className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-sm"
                  >
                    <span>ACTION</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
