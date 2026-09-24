import React from 'react';
import { Menu, PlusCircle, Radio, RefreshCw, Search, ShieldAlert } from 'lucide-react';
import { Alert } from '../../types';

interface NavbarProps { alerts: Alert[]; onOpenReportModal: () => void; onTriggerLandslideSimulation: () => void; isSimulating: boolean; onMenuToggle: () => void; }
export const Navbar: React.FC<NavbarProps> = ({ onOpenReportModal, onTriggerLandslideSimulation, isSimulating, onMenuToggle }) => <header className="app-navbar"><div className="navbar-inner">
  <div className="brand-group"><button className="mobile-menu-button" onClick={onMenuToggle} aria-label="Open navigation"><Menu size={20} /></button><div className="brand-mark"><ShieldAlert size={21} /></div><div className="min-w-0"><div className="brand-title">NER RouteGuard AI <span className="project-tag">SIH 2026</span></div><p>Logistics & accessibility intelligence</p></div></div>
  <label className="navbar-search"><Search size={15} /><input aria-label="Search the platform" placeholder="Search corridor, vehicle or incident" /></label>
  <div className="navbar-actions"><div className="status-chip"><i /><Radio size={13} /><span>Live</span></div><button onClick={onTriggerLandslideSimulation} disabled={isSimulating} className="secondary-button"><RefreshCw size={14} className={isSimulating ? 'animate-spin' : ''} /><span>{isSimulating ? 'Simulating' : 'Simulate disruption'}</span></button><button onClick={onOpenReportModal} className="primary-button"><PlusCircle size={15} /><span>Report incident</span></button></div>
</div></header>;
