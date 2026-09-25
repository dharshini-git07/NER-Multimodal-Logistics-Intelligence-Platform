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
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
            <Activity size={20} />
          </span>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
            Supply Risk Intelligence
          </h3>
        </div>
        {!compact && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs overflow-x-auto w-full sm:w-auto">
            <Filter size={14} className="text-slate-500 ml-1 shrink-0" />
            {['ALL', 'Medicine', 'Food', 'Relief / Emergency Supplies'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  filterCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'Relief / Emergency Supplies' ? 'Relief' : cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid of Shortage Items */}
      <div className={`grid ${compact ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'}`}>
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
              className={`rounded-xl p-4 border transition-all ${
                isCriticalBreach
                  ? 'bg-red-50/60 border-red-200 shadow-xs'
                  : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2 pb-2 border-b border-slate-200/80">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 tracking-tight uppercase">
                      {item.cargo_category}
                    </span>
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg border uppercase ${getRiskBadge(riskLevel)}`}>
                      {riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold mt-1">
                    {locationDisplay}
                  </p>
                </div>
                {isCriticalBreach && (
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-red-100 text-red-700 border border-red-200 shrink-0">
                    -{deficitDays}d
                  </span>
                )}
              </div>

              {/* 2-Column Metric Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs py-2 font-bold text-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Stock</span>
                  <strong className={`font-mono text-sm ${daysStock <= 4 ? 'text-red-700 font-black' : 'text-slate-900'}`}>
                    {daysStock}d
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">ETA</span>
                  <strong className={`font-mono text-sm ${isCriticalBreach ? 'text-red-700 font-black' : 'text-slate-900'}`}>
                    {item.expected_delivery_days}d
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Mode</span>
                  <strong className="text-teal-700 uppercase font-black">
                    {recMode}
                  </strong>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-500 uppercase">Risk</span>
                  <strong className={`uppercase font-black ${item.shortage_risk_level === 'CRITICAL' ? 'text-red-700' : 'text-amber-700'}`}>
                    {item.shortage_risk_level || 'LOW'}
                  </strong>
                </div>
              </div>

              {/* Action Button Footer */}
              {onSelectAction && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-end">
                  <button
                    onClick={() => onSelectAction(item)}
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1.5 rounded-xl bg-teal-700 text-white hover:bg-teal-800 transition-colors shadow-xs active:scale-95"
                  >
                    <span>ACTION</span>
                    <ArrowRight size={14} />
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
