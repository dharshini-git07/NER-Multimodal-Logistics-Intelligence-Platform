import React from 'react';
import { AlertTriangle, CheckCircle2, CircleOff, Truck, type LucideIcon } from 'lucide-react';
import { Alert, Corridor, Vehicle } from '../../types';

export const KpiCards: React.FC<{ vehicles: Vehicle[]; corridors: Corridor[]; alerts: Alert[] }> = ({ vehicles, corridors, alerts }) => {
  const safe = corridors.filter((item) => item.status === 'OPEN').length;
  const risky = corridors.filter((item) => ['CAUTION', 'HIGH_RISK'].includes(item.status)).length;
  const blocked = corridors.filter((item) => item.status === 'SEVERED').length;
  const items: { label: string; value: number; tone: string; Icon: LucideIcon }[] = [
    { label: 'Active vehicles', value: vehicles.length, tone: 'blue', Icon: Truck }, { label: 'Safe roads', value: safe, tone: 'green', Icon: CheckCircle2 },
    { label: 'High-risk roads', value: risky, tone: 'amber', Icon: AlertTriangle }, { label: 'Blocked roads', value: blocked, tone: 'red', Icon: CircleOff },
    { label: 'Active alerts', value: alerts.filter((item) => item.is_active).length, tone: 'violet', Icon: AlertTriangle },
  ];
  return <section className="kpi-grid" aria-label="Operational overview">{items.map(({ label, value, tone, Icon }) => <article className={`kpi-card kpi-${tone}`} key={label}><div><p>{label}</p><strong>{value}</strong></div><span className="kpi-icon"><Icon size={19} /></span></article>)}</section>;
};
