import React from 'react';
import { Menu, PlusCircle, Radio, RefreshCw, Search, ShieldAlert } from 'lucide-react';
import { Alert } from '../../types';

interface NavbarProps {
  alerts: Alert[];
  onOpenReportModal: () => void;
  onTriggerLandslideSimulation: () => void;
  isSimulating: boolean;
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReportModal,
  onTriggerLandslideSimulation,
  isSimulating,
  onMenuToggle
}) => (
  <header className="app-navbar border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
    <div className="navbar-inner max-w-[1600px] mx-auto px-4 h-14 flex items-center justify-between gap-4">
      {/* Brand */}
      <div className="brand-group flex items-center gap-2.5">
        <button
          className="mobile-menu-button p-2 text-slate-600 hover:text-slate-900 rounded-lg sm:hidden"
          onClick={onMenuToggle}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>
        <div className="brand-mark w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold shadow-sm">
          <ShieldAlert size={18} />
        </div>
        <div className="min-w-0">
          <div className="brand-title text-mm font-extrabold text-slate-900 flex items-center gap-1.5">
            NER RouteGuard
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-none">Multimodal AI Platform</p>
        </div>
      </div>

      {/* Search Bar */}
      <label className="navbar-search hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 w-72 text-xs focus-within:border-teal-500 focus-within:bg-white transition-all">
        <Search size={14} />
        <input
          aria-label="Search network"
          placeholder="Search corridors, vehicles, or incidents..."
          className="bg-transparent border-none outline-none w-full text-slate-700 text-xs placeholder:text-slate-400"
        />
      </label>

      {/* Actions */}
      <div className="navbar-actions flex items-center gap-2">
        <div className="status-chip hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <Radio size={12} />
          <span>Live Ops</span>
        </div>

        <button
          onClick={onTriggerLandslideSimulation}
          disabled={isSimulating}
          className="secondary-button min-h-[36px] px-3 text-xs font-bold rounded-lg border border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={13} className={isSimulating ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">{isSimulating ? 'Simulating...' : 'Simulate Disruption'}</span>
          <span className="sm:hidden">Simulate</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="primary-button min-h-[36px] px-3.5 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
        >
          <PlusCircle size={14} />
          <span>Report Incident</span>
        </button>
      </div>
    </div>
  </header>
);

