import React from 'react';
import {
  AlertTriangle,
  Flame,
  Truck,
  PackageCheck,
  ShieldAlert,
  Boxes,
  type LucideIcon
} from 'lucide-react';
import { Alert, Corridor, Vehicle } from '../../types';

interface KpiProps {
  vehicles: Vehicle[];
  corridors: Corridor[];
  alerts: Alert[];
  shortageCount?: number;
}

export const KpiCards: React.FC<KpiProps> = ({
  vehicles = [],
  corridors = [],
  alerts = [],
  shortageCount = 4
}) => {
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const safeCorridors = Array.isArray(corridors) ? corridors : [];
  const safeAlerts = Array.isArray(alerts) ? alerts : [];

  const activeDeliveries = safeVehicles.filter((v) => v && v.status !== 'EMERGENCY_HALT').length;
  const criticalDeliveries = safeVehicles.filter(
    (v) =>
      v &&
      (v.priority_level === 'URGENT' ||
        v.cargo_category === 'Medicine' ||
        v.shortage_risk === 'CRITICAL' ||
        v.shortage_risk === 'HIGH')
  ).length;
  const highRiskCorridors = safeCorridors.filter((c) =>
    c && ['CAUTION', 'HIGH_RISK', 'SEVERED'].includes(c.status)
  ).length;
  const activeDisruptions = safeAlerts.filter(
    (a) =>
      a &&
      a.is_active &&
      (a.alert_type === 'DISRUPTION' ||
        a.alert_type === 'LANDSLIDE' ||
        a.alert_type === 'BLOCKED_ROAD' ||
        a.alert_type === 'FLOOD')
  ).length;
  const assetsInTransit = safeVehicles.length;

  const items: { label: string; value: number; tone: string; Icon: LucideIcon; subtitle: string }[] = [
    {
      label: 'Active Deliveries',
      value: activeDeliveries,
      tone: 'blue',
      Icon: Truck,
      subtitle: 'En-route freight convoys'
    },
    {
      label: 'Critical Deliveries',
      value: criticalDeliveries,
      tone: 'red',
      Icon: Flame,
      subtitle: 'Urgent medical / relief'
    },
    {
      label: 'High-Risk Corridors',
      value: highRiskCorridors,
      tone: 'amber',
      Icon: AlertTriangle,
      subtitle: 'Unstable slopes & washouts'
    },
    {
      label: 'Active Disruptions',
      value: activeDisruptions,
      tone: 'violet',
      Icon: ShieldAlert,
      subtitle: 'Severe blockages detected'
    },
    {
      label: 'Shortage-Risk Locations',
      value: shortageCount,
      tone: 'orange',
      Icon: PackageCheck,
      subtitle: 'Stock runway < delivery ETA'
    },
    {
      label: 'Assets in Transit',
      value: assetsInTransit,
      tone: 'green',
      Icon: Boxes,
      subtitle: 'Monitored logistics units'
    }
  ];

  return (
    <div className="kpi-container mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
          Multimodal Operational Intelligence
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-400 border border-slate-200">
          Demo / Representative Data
        </span>
      </div>
      <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3" aria-label="Operational overview">
        {items.map(({ label, value, tone, Icon, subtitle }) => (
          <article
            className={`kpi-card p-3.5 rounded-xl border border-slate-200/90 bg-white shadow-sm hover:shadow transition-all`}
            key={label}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-400 leading-snug truncate">{label}</p>
                <strong className="text-2xl font-bold text-slate-900 block mt-1 leading-none">{value}</strong>
                <span className="text-[10px] text-slate-400 block mt-1 leading-tight line-clamp-1">{subtitle}</span>
              </div>
              <span className={`p-2 rounded-lg flex-shrink-0 ${
                tone === 'blue' ? 'bg-blue-50 text-blue-600' :
                tone === 'red' ? 'bg-red-50 text-red-600' :
                tone === 'amber' ? 'bg-amber-50 text-amber-600' :
                tone === 'violet' ? 'bg-purple-50 text-purple-600' :
                tone === 'orange' ? 'bg-orange-50 text-orange-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                <Icon size={18} />
              </span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};
