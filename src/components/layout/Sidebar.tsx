import React from 'react';
import {
  BarChart3,
  BellRing,
  BrainCircuit,
  LayoutDashboard,
  Map,
  Navigation,
  Settings,
  Truck,
  AlertOctagon,
  X
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'map'
  | 'predictor'
  | 'routing'
  | 'fleet'
  | 'incidents'
  | 'alerts'
  | 'analytics';

interface Props {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  incidentsCount: number;
  alertsCount: number;
  open: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  incidentsCount,
  alertsCount,
  open,
  onClose
}) => {
  const items = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map' as TabType, label: 'Live Map', icon: Map },
    { id: 'fleet' as TabType, label: 'Fleet Tracker', icon: Truck },
    { id: 'incidents' as TabType, label: 'Incidents', icon: AlertOctagon, count: incidentsCount },
    { id: 'routing' as TabType, label: 'Route Planner', icon: Navigation },
    { id: 'analytics' as TabType, label: 'Analytics', icon: BarChart3 },
    { id: 'predictor' as TabType, label: 'Risk Predictor', icon: BrainCircuit },
    { id: 'alerts' as TabType, label: 'Alerts', icon: BellRing, count: alertsCount }
  ];

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`app-sidebar ${open ? 'open' : ''} border-r border-slate-200 bg-white flex flex-col justify-between p-3 select-none`}>
        <div>
          <div className="sidebar-top flex items-center justify-between px-2.5 py-1.5 mb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Navigation</span>
            <button className="sidebar-close p-1 text-slate-500 hover:text-slate-800" onClick={onClose} aria-label="Close navigation">
              <X size={16} />
            </button>
          </div>
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full h-10 px-3 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-50 text-teal-800 font-bold border border-teal-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} className={`shrink-0 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.count ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 shrink-0 ml-1">
                      {item.count}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 mt-auto">
          <Settings size={16} className="text-teal-700 shrink-0" />
          <div className="min-w-0">
            <b className="block text-[11px] font-bold text-slate-800 leading-tight truncate">System Operational</b>
            <span className="text-[10px] text-slate-400 block truncate">NER Sentinel Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

