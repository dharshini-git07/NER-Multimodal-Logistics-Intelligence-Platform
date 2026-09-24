import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, TabType } from './components/layout/Sidebar';
import { LiveMap } from './components/map/LiveMap';
import { LogisticsDashboardView } from './components/dashboard/LogisticsDashboardView';
import { DisruptionPredictorCard } from './components/dashboard/DisruptionPredictorCard';
import { RoutePlannerModal } from './components/routing/RoutePlannerModal';
import { LiveFleetTracker } from './components/dashboard/LiveFleetTracker';
import { IncidentList } from './components/incidents/IncidentList';
import { IncidentReportModal } from './components/incidents/IncidentReportModal';
import { AlertCenter } from './components/alerts/AlertCenter';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { api, getApiErrorMessage } from './services/api';
import { telemetryWS } from './services/websocket';
import {
  Corridor,
  Vehicle,
  Incident,
  Alert,
  WeatherData,
  RouteOption,
  AnalyticsSummary,
  Segment
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Modal and Interactive states
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [clickedMapCoords, setClickedMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationMessage, setSimulationMessage] = useState<string | null>(null);

  // Initial Data Fetch
  const refreshData = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [corridorsData, segmentsData, vehiclesData, incidentsData, alertsData, weatherData, analyticsData] = await Promise.all([
          api.getCorridors(),
          api.getSegments(),
          api.getVehicles(),
          api.getIncidents(),
          api.getAlerts(),
          api.getWeather(),
          api.getAnalytics()
        ]);
        setCorridors(corridorsData);
        setSegments(segmentsData);
        setVehicles(vehiclesData);
        setIncidents(incidentsData);
        setAlerts(alertsData);
        setWeather(weatherData);
        setAnalytics(analyticsData);
      } catch (e) {
        console.error('Failed to initialize platform data', e);
        setLoadError('Some live services are unavailable. Showing the latest available operational data.');
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    refreshData();

    // Subscribe to WebSocket live fleet updates & alert broadcasts
    const unsubscribeFleet = telemetryWS.subscribe((updatedFleet) => {
      setVehicles(updatedFleet);
    });
    const unsubscribeAlerts = telemetryWS.subscribeAlerts((incomingAlert) => {
      setAlerts((prev) => [incomingAlert, ...prev.filter((a) => a.id !== incomingAlert.id)]);
    });

    return () => {
      unsubscribeFleet();
      unsubscribeAlerts();
    };
  }, []);

  // Map Clicked Coordinates Listener
  const handleMapClick = (lat: number, lng: number) => {
    setClickedMapCoords({ lat, lng });
    setIsReportModalOpen(true);
  };

  // Upvote Incident
  const handleUpvoteIncident = async (id: string) => {
    try {
      const updated = await api.upvoteIncident(id);
      setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));
    } catch (e) {
      console.error(e);
    }
  };

  // Verify Incident
  const handleVerifyIncident = async (id: string) => {
    try {
      const updated = await api.verifyIncident(id);
      setIncidents((prev) => prev.map((inc) => (inc.id === id ? updated : inc)));
    } catch (e) {
      console.error(e);
    }
  };

  // Create Incident
  const handleCreateIncident = async (data: Partial<Incident>) => {
    try {
      const created = await api.createIncident(data);
      setIncidents((prev) => [created, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  // Broadcast Alert
  const handleBroadcastAlert = async (data: Partial<Alert>) => {
    try {
      const created = await api.broadcastAlert(data);
      setAlerts((prev) => [created, ...prev]);
    } catch (e) {
      console.error(e);
    }
  };

  // Dismiss Alert
  const handleDismissAlert = async (id: string) => {
    try {
      await api.dismissAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  // Trigger Live Landslide Simulation & Truck Reroute (Key SIH Showcase Demo)
  const handleTriggerLandslideSimulation = async () => {
    setIsSimulating(true);
    setSimulationMessage(null);
    try {
      // One backend event updates the truck and dispatches all linked alerts.
      const res = await api.triggerDisruption('veh-101', 'landslide');
      if (res.vehicle) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === 'veh-101' ? res.vehicle : v))
        );
      }

      if (Array.isArray(res.alerts)) {
        setAlerts((prev) => [...res.alerts, ...prev.filter((alert) => !res.alerts.some((next: Alert) => next.id === alert.id))]);
      } else if (res.alert) {
        setAlerts((prev) => [res.alert, ...prev.filter((alert) => alert.id !== res.alert.id)]);
      }

      // Add the map marker as a follow-up operation. A temporary database
      // issue must not hide a successful vehicle reroute and alert dispatch.
      try {
        const newIncident = await api.createIncident({
          category: 'Landslide',
          severity: 'CRITICAL_CUTOFF',
          corridor_id: 'cor-nh6',
          location_name: 'Sonapur Tunnel Portal, NH-6',
          latitude: 25.1328,
          longitude: 92.3582,
          description: 'Sudden high-velocity debris flow triggered by 115mm rainfall. Clearance estimated in 14.5 hours.',
          reported_by: 'NER Disaster AI Sentinel',
          reporter_role: 'BRO Officer',
          photo_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
        });
        setIncidents((prev) => [newIncident, ...prev]);
      } catch (incidentError) {
        console.error('Disruption incident could not be created', incidentError);
      }

      // Switch to map view to observe rerouting truck
      setActiveTab('map');
      setSimulationMessage('Landslide simulated: vehicle rerouted and operational alerts updated.');
    } catch (e) {
      console.error(e);
      setSimulationMessage(getApiErrorMessage(e, 'Simulation'));
    } finally {
      setIsSimulating(false);
    }
  };

  // Trigger Multi-Hazard Disruption (Landslide, Flood, Blocked Road)
  const handleTriggerDisruption = async (
    vehicleId: string,
    disruptionType: 'landslide' | 'flood' | 'blocked-road'
  ) => {
    try {
      const res = await api.triggerDisruption(vehicleId, disruptionType);
      if (res.vehicle) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === vehicleId ? res.vehicle : v))
        );
      }
      if (res.alerts && Array.isArray(res.alerts)) {
        const newAlerts = res.alerts as Alert[];
        setAlerts((prev) => [...newAlerts, ...prev.filter((a) => !newAlerts.some((na) => na.id === a.id))]);
      } else if (res.alert) {
        setAlerts((prev) => [res.alert, ...prev.filter((a) => a.id !== res.alert.id)]);
      }
    } catch (e) {
      console.error('Failed to trigger disruption', e);
      setSimulationMessage(getApiErrorMessage(e, 'Disruption simulation'));
    }
  };

  // Trigger Delivery Delay
  const handleTriggerDelay = async (vehicleId: string, minutes: number) => {
    try {
      const res = await api.triggerDelay(vehicleId, minutes);
      if (res.vehicle) {
        setVehicles((prev) =>
          prev.map((v) => (v.id === vehicleId ? res.vehicle : v))
        );
      }
      if (res.alert) {
        setAlerts((prev) => [res.alert, ...prev.filter((a) => a.id !== res.alert.id)]);
      }
    } catch (e) {
      console.error('Failed to trigger delay', e);
    }
  };

  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <Navbar
        alerts={alerts}
        onOpenReportModal={() => {
          setClickedMapCoords(null);
          setIsReportModalOpen(true);
        }}
        onTriggerLandslideSimulation={handleTriggerLandslideSimulation}
        isSimulating={isSimulating}
        onMenuToggle={() => setIsSidebarOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          incidentsCount={incidents.filter((i) => i.status !== 'RESOLVED').length}
          alertsCount={alerts.filter((a) => a.is_active).length}
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content Area */}
        <main className="app-main">
          {(loadError || simulationMessage) && <div className="service-notice">{simulationMessage || loadError}<button onClick={simulationMessage ? () => setSimulationMessage(null) : refreshData}>{simulationMessage ? 'Dismiss' : 'Retry'}</button></div>}
          {activeTab === 'dashboard' && (
            <LogisticsDashboardView
              corridors={corridors}
              segments={segments}
              vehicles={vehicles}
              incidents={incidents}
              alerts={alerts}
              weather={weather}
              analytics={analytics}
              selectedRoute={selectedRoute}
              onMapClickCoordinates={handleMapClick}
              onUpvoteIncident={handleUpvoteIncident}
              onVerifyIncident={handleVerifyIncident}
              onTriggerReroute={(vId) => {
                api.triggerReroute(vId);
                handleTriggerLandslideSimulation();
              }}
              onTriggerDisruption={handleTriggerDisruption}
              onTriggerLandslideSimulation={handleTriggerLandslideSimulation}
              onDismissAlert={handleDismissAlert}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'map' && (
            <div className="h-full">
              <LiveMap
                corridors={corridors}
                segments={segments}
                vehicles={vehicles}
                incidents={incidents}
                weather={weather}
                selectedRoute={selectedRoute}
                onMapClickCoordinates={handleMapClick}
                onUpvoteIncident={handleUpvoteIncident}
                onVerifyIncident={handleVerifyIncident}
                onTriggerDisruption={handleTriggerDisruption}
              onTriggerDelay={handleTriggerDelay}
              onRefresh={refreshData}
              />
            </div>
          )}

          {activeTab === 'predictor' && (
            <div className="p-6 max-w-7xl mx-auto">
              <DisruptionPredictorCard />
            </div>
          )}

          {activeTab === 'routing' && (
            <div className="p-6 max-w-7xl mx-auto">
              <RoutePlannerModal
                onSelectRouteForMap={(route) => {
                  setSelectedRoute(route);
                  setActiveTab('map');
                }}
              />
            </div>
          )}

          {activeTab === 'fleet' && (
            <div className="p-6 max-w-7xl mx-auto">
              <LiveFleetTracker
                vehicles={vehicles}
                onTriggerReroute={(vId) => {
                  api.triggerReroute(vId);
                  handleTriggerLandslideSimulation();
                }}
                onTriggerDisruption={handleTriggerDisruption}
                onTriggerDelay={handleTriggerDelay}
              />
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="p-6 max-w-7xl mx-auto">
              <IncidentList
                incidents={incidents}
                onUpvote={handleUpvoteIncident}
                onVerify={handleVerifyIncident}
                onOpenReportModal={() => setIsReportModalOpen(true)}
              />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="p-6 max-w-7xl mx-auto">
              <AlertCenter
                alerts={alerts}
                onBroadcastAlert={handleBroadcastAlert}
                onDismissAlert={handleDismissAlert}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6 max-w-7xl mx-auto">
              <AnalyticsDashboard />
            </div>
          )}
        </main>
      </div>

      {/* Incident Report Modal */}
      <IncidentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleCreateIncident}
        initialCoords={clickedMapCoords}
      />
    </div>
  );
};
