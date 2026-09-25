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

  const items: { label: string; value: number; tone: string; Icon: LucideIcon }[] = [
    {
      label: 'Active Deliveries',
      value: activeDeliveries,
      tone: 'blue',
      Icon: Truck
    },
    {
      label: 'Critical Deliveries',
      value: criticalDeliveries,
      tone: 'red',
      Icon: Flame
    },
    {
      label: 'High-Risk Corridors',
      value: highRiskCorridors,
      tone: 'amber',
      Icon: AlertTriangle
    },
    {
      label: 'Active Disruptions',
      value: activeDisruptions,
      tone: 'violet',
      Icon: ShieldAlert
    },
    {
      label: 'Shortage Locations',
      value: shortageCount,
      tone: 'orange',
      Icon: PackageCheck
    },
    {
      label: 'Assets in Transit',
      value: assetsInTransit,
      tone: 'green',
      Icon: Boxes
    }
  ];

  return (
    <div className="kpi-container mb-4">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs uppercase tracking-wider text-slate-700 font-extrabold">
          Operational Metrics
        </span>
      </div>
      <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4" aria-label="Operational overview">
        {items.map(({ label, value, tone, Icon }) => (
          <article
            className="kpi-card p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-2"
            key={label}
          >
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-600 truncate uppercase">{label}</p>
              <strong className="text-2xl sm:text-3xl font-black text-slate-900 block mt-1 leading-none font-mono">{value}</strong>
            </div>
            <span className={`p-2.5 rounded-xl flex-shrink-0 ${
              tone === 'blue' ? 'bg-blue-50 text-blue-600 border border-blue-200' :
              tone === 'red' ? 'bg-red-50 text-red-600 border border-red-200' :
              tone === 'amber' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
              tone === 'violet' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
              tone === 'orange' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
              'bg-emerald-50 text-emerald-600 border border-emerald-200'
            }`}>
              <Icon size={20} />
            </span>
          </article>
        ))}
      </section>
    </div>
  );
};
