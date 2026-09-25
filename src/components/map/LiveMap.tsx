import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  AlertTriangle,
  BrainCircuit,
  CloudRain,
  RefreshCw,
  Route,
  Truck,
  Train,
  Ship,
  Plane,
  Layers,
  MapPin
} from 'lucide-react';
import { api } from '../../services/api';
import {
  Corridor,
  Incident,
  RoadRiskPredictionResponse,
  RouteOption,
  Segment,
  Vehicle,
  WeatherData,
  ModalNetworkData,
  ModalNetworkNode,
  ModalNetworkEdge
} from '../../types';
import { MULTIMODAL_NETWORK_DATA } from '../../services/multimodalEngine';

interface LiveMapProps {
  corridors: Corridor[];
  vehicles: Vehicle[];
  incidents: Incident[];
  weather: WeatherData[];
  selectedRoute: RouteOption | null;
  segments?: Segment[];
  onMapClickCoordinates?: (lat: number, lng: number) => void;
  onUpvoteIncident?: (id: string) => void;
  onVerifyIncident?: (id: string) => void;
  onTriggerDisruption?: (id: string, type: 'landslide' | 'flood' | 'blocked-road') => void;
  onTriggerDelay?: (id: string, minutes: number) => void;
  compact?: boolean;
  onRefresh?: () => void;
}

const center: [number, number] = [25.82, 92.38];

const color = (risk?: string, supplied?: string) =>
  supplied?.startsWith('#')
    ? supplied
    : ['SAFE', 'LOW'].includes((risk || '').toUpperCase())
    ? '#16a34a'
    : ['MEDIUM', 'MODERATE', 'CAUTION'].includes((risk || '').toUpperCase())
    ? '#d97706'
    : '#dc2626';

const vehicleIcon = (v: Vehicle) =>
  L.divIcon({
    className: 'map-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div class="marker-dot marker-vehicle" title="${v.plate_number || 'Convoy'}">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="transform:rotate(${v.heading_deg || 0}deg); transition: transform 0.3s ease;">
        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
      </svg>
    </div>`
  });

const incidentIcon = (i: Incident) =>
  L.divIcon({
    className: 'map-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div class="marker-dot ${i.severity === 'CRITICAL_CUTOFF' ? 'marker-critical' : 'marker-incident'}" title="${i.category}">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    </div>`
  });

// Multimodal Hub Icons (Compact Half Size)
const railHubIcon = () =>
  L.divIcon({
    className: 'map-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div class="marker-dot marker-rail-hub" title="NFR Broad-Gauge Rail Terminal">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="3" width="16" height="13" rx="2"/>
        <path d="M4 11h16"/>
        <path d="M12 3v8"/>
        <path d="M8 19l-3 3"/>
        <path d="M16 19l3 3"/>
        <circle cx="8" cy="15" r="1.5" fill="currentColor"/>
        <circle cx="16" cy="15" r="1.5" fill="currentColor"/>
      </svg>
    </div>`
  });

const portHubIcon = () =>
  L.divIcon({
    className: 'map-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div class="marker-dot marker-port-hub" title="IWAI River Port Terminal">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="5" r="2.5"/>
        <line x1="12" y1="7.5" x2="12" y2="20"/>
        <line x1="5" y1="11" x2="19" y2="11"/>
        <path d="M5 11a7 7 0 0 0 14 0"/>
      </svg>
    </div>`
  });

const airportHubIcon = () =>
  L.divIcon({
    className: 'map-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div class="marker-dot marker-air-hub" title="AAI Air Cargo Hub">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
      </svg>
    </div>`
  });

const weatherHubIcon = () =>
  L.divIcon({
    className: 'map-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div class="marker-dot marker-weather-hub" title="Weather Alert Station">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
        <path d="M16 14v6"/>
        <path d="M8 14v6"/>
        <path d="M12 16v6"/>
      </svg>
    </div>`
  });

const roadHubIcon = () =>
  L.divIcon({
    className: 'map-marker',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<div class="marker-dot marker-road-hub" title="National Highway Logistics Hub">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    </div>`
  });

function MapHelper({
  focus,
  onClick
}: {
  focus: [number, number] | null;
  onClick?: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  useEffect(() => {
    const id = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(id);
  }, [map]);
  useEffect(() => {
    if (focus) map.flyTo(focus, 9, { duration: 0.7 });
  }, [focus, map]);
  useEffect(() => {
    if (!onClick) return;
    const fn = (e: L.LeafletMouseEvent) => onClick(+e.latlng.lat.toFixed(4), +e.latlng.lng.toFixed(4));
    map.on('click', fn);
    return () => {
      map.off('click', fn);
    };
  }, [map, onClick]);
  return null;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  corridors = [],
  vehicles = [],
  incidents = [],
  weather = [],
  selectedRoute,
  segments: passed = [],
  onMapClickCoordinates,
  onUpvoteIncident,
  onVerifyIncident,
  compact,
  onRefresh
}) => {
  const safeCorridors = Array.isArray(corridors) ? corridors : [];
  const safeVehicles = Array.isArray(vehicles) ? vehicles : [];
  const safeIncidents = Array.isArray(incidents) ? incidents : [];
  const safeWeather = Array.isArray(weather) ? weather : [];
  const safePassedSegments = Array.isArray(passed) ? passed : [];

  const [segments, setSegments] = useState<Segment[]>(safePassedSegments);
  const [vehiclesVisible, setVehiclesVisible] = useState(true);
  const [incidentsVisible, setIncidentsVisible] = useState(true);
  const [weatherVisible, setWeatherVisible] = useState(false);

  // Multimodal Layers State
  const [roadVisible, setRoadVisible] = useState(true);
  const [railVisible, setRailVisible] = useState(true);
  const [waterwayVisible, setWaterwayVisible] = useState(true);
  const [airVisible, setAirVisible] = useState(true);
  const [modalNetwork, setModalNetwork] = useState<ModalNetworkData>(MULTIMODAL_NETWORK_DATA);

  const [selectedId, setSelectedId] = useState('');
  const [prediction, setPrediction] = useState<RoadRiskPredictionResponse | null>(null);
  const [error, setError] = useState('');
  const [predicting, setPredicting] = useState(false);
  const [focus, setFocus] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (passed?.length) setSegments(passed);
  }, [passed]);

  useEffect(() => {
    if (!passed?.length) {
      api.getSegments().then(setSegments).catch(() => setSegments([]));
    }
  }, [passed]);

  useEffect(() => {
    api.getModalNetwork().then(setModalNetwork).catch(() => setModalNetwork(MULTIMODAL_NETWORK_DATA));
  }, []);

  const active = useMemo(() => segments.find((segment) => segment.id === selectedId), [segments, selectedId]);

  const predict = async () => {
    if (!active) return;
    setPredicting(true);
    setError('');
    try {
      const result = await api.predictRoadRisk({
        segment_id: active.id,
        rainfall_mm: active.rainfall_mm ?? 50,
        landslide_history: active.landslide_history ?? 0,
        road_condition: active.road_condition ?? 'Fair'
      });
      setPrediction(result);
      setSegments((items) =>
        items.map((item) =>
          item.id === active.id
            ? {
                ...item,
                risk_level: result.risk_level,
                risk_score: result.risk_score,
                color: result.color,
                alternate_route_polyline: result.alternate_route?.waypoints || item.alternate_route_polyline
              }
            : item
        )
      );
    } catch {
      setError('Risk prediction is currently unavailable.');
    } finally {
      setPredicting(false);
    }
  };

  const modalEdges = Array.isArray(modalNetwork?.edges) && modalNetwork.edges.length > 0
    ? modalNetwork.edges
    : MULTIMODAL_NETWORK_DATA.edges;
  const modalNodes = Array.isArray(modalNetwork?.nodes) && modalNetwork.nodes.length > 0
    ? modalNetwork.nodes
    : MULTIMODAL_NETWORK_DATA.nodes;

  // Filter modal edges based on layer visibility
  const railEdges = modalEdges.filter((e) => e && e.mode === 'RAIL');
  const waterwayEdges = modalEdges.filter((e) => e && e.mode === 'WATERWAY');
  const airEdges = modalEdges.filter((e) => e && e.mode === 'AIR');

  // Categorize modal hubs
  const roadHubs = modalNodes.filter((n) => n && n.node_type === 'ROAD_HUB');
  const railHubs = modalNodes.filter((n) => n && n.node_type === 'RAILWAY_STATION');
  const portHubs = modalNodes.filter((n) => n && n.node_type === 'RIVER_PORT');
  const airHubs = modalNodes.filter((n) => n && n.node_type === 'AIRPORT');

  return (
    <div className={`map-shell ${compact ? 'map-shell-compact' : ''}`}>
      {/* Top Map Toolbar */}
      <div className="map-toolbar">
        <button
          className={`map-control ${vehiclesVisible ? 'active' : ''}`}
          onClick={() => setVehiclesVisible(!vehiclesVisible)}
        >
          <Truck size={14} /> Vehicles {safeVehicles.length}
        </button>

        <button
          className={`map-control ${incidentsVisible ? 'active-danger' : ''}`}
          onClick={() => setIncidentsVisible(!incidentsVisible)}
        >
          <AlertTriangle size={14} /> Incidents {safeIncidents.length}
        </button>

        {/* Multimodal Layer Controls */}
        <button
          className={`map-control ${roadVisible ? 'active-road' : ''}`}
          onClick={() => setRoadVisible(!roadVisible)}
          title="Toggle National Highway Road Network & Risk Segments"
        >
          <Route size={14} /> Roads ({safeCorridors.length})
        </button>

        {/* Multimodal Layer Controls */}
        <button
          className={`map-control ${railVisible ? 'active-rail' : ''}`}
          onClick={() => setRailVisible(!railVisible)}
          title="Toggle NFR Broad-Gauge Freight Rails"
        >
          <Train size={14} /> Rail ({railEdges.length})
        </button>

        <button
          className={`map-control ${waterwayVisible ? 'active-waterway' : ''}`}
          onClick={() => setWaterwayVisible(!waterwayVisible)}
          title="Toggle NW-2 Brahmaputra River Waterways"
        >
          <Ship size={14} /> Waterway ({waterwayEdges.length})
        </button>

        <button
          className={`map-control ${airVisible ? 'active-air' : ''}`}
          onClick={() => setAirVisible(!airVisible)}
          title="Toggle AAI Air Cargo Lifeline Lanes"
        >
          <Plane size={14} /> Air Cargo ({airEdges.length})
        </button>

        <button
          className={`map-control ${weatherVisible ? 'active' : ''}`}
          onClick={() => setWeatherVisible(!weatherVisible)}
        >
          <CloudRain size={14} /> Weather
        </button>

        {!compact && (
          <select
            value={selectedId}
            aria-label="Select road segment"
            onChange={(event) => {
              setSelectedId(event.target.value);
              const segment = segments.find((item) => item.id === event.target.value);
              if (segment) setFocus([segment.start_lat, segment.start_lng]);
            }}
          >
            <option value="">Select road segment</option>
            {segments.map((segment) => (
              <option key={segment.id} value={segment.id}>
                {segment.start_point_name} - {segment.end_point_name}
              </option>
            ))}
          </select>
        )}

        {onRefresh && (
          <button className="map-control" aria-label="Refresh data" onClick={onRefresh}>
            <RefreshCw size={14} />
          </button>
        )}
      </div>

      {/* Floating AI Road Risk Panel */}
      {!compact && active && (
        <aside className="risk-panel">
          <div className="panel-kicker">
            <BrainCircuit size={14} /> AI road intelligence
          </div>
          <strong>
            {active.start_point_name} - {active.end_point_name}
          </strong>
          <p>
            Risk score: {Math.round(active.risk_score || 0)} · {active.status}
          </p>
          <button className="primary-button" onClick={predict} disabled={predicting}>
            {predicting ? 'Analysing...' : 'Run risk analysis'}
          </button>
          {prediction && (
            <div className="prediction-result">
              <b style={{ color: color(prediction.risk_level, prediction.color) }}>
                {prediction.risk_level} risk
              </b>
              <span>{prediction.recommendation}</span>
              {prediction.alternate_route && (
                <span>
                  <Route size={13} /> {prediction.alternate_route.bypass_name} available
                </span>
              )}
            </div>
          )}
          {error && <p className="inline-error">{error}</p>}
        </aside>
      )}

      {/* Map Legend */}
      <div className="map-legend">
        <span>
          <i className="legend-safe" /> Safe Road
        </span>
        <span>
          <i className="legend-risk" /> High Risk
        </span>
        <span>
          <i className="legend-blocked" /> Blocked
        </span>
        <span>
          <i style={{ background: '#2563eb' }} /> Rail BG
        </span>
        <span>
          <i style={{ background: '#0d9488' }} /> NW-2 River
        </span>
        <span>
          <i style={{ background: '#d97706' }} /> Air Cargo
        </span>
        <span>
          <i className="legend-vehicle" /> Vehicle
        </span>
        <span>
          <i className="legend-incident" /> Incident
        </span>
      </div>

      {/* Main Leaflet Map */}
      <MapContainer center={center} zoom={7} minZoom={5} className="leaflet-map" scrollWheelZoom>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution={'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
        />
        <MapHelper focus={focus} onClick={onMapClickCoordinates} />

        {/* ROAD NETWORK (National Highways & Vulnerability Risk Segments) */}
        {roadVisible &&
          safeCorridors
            .filter((item) => item && Array.isArray(item.coordinates) && item.coordinates.length > 0)
            .map((item) => (
              <Polyline
                key={`corridor-${item.id}`}
                positions={item.coordinates}
                pathOptions={{
                  color: item.status === 'SEVERED' ? '#dc2626' : item.status === 'HIGH_RISK' ? '#d97706' : '#2563eb',
                  weight: 5,
                  opacity: 0.9,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                <Tooltip sticky>
                  🛣️ [NATIONAL HIGHWAY] {item.name}: {item.route_name} ({item.total_length_km} km) · Status: {item.status}
                </Tooltip>
              </Polyline>
            ))}

        {roadVisible &&
          segments
            .filter((item) => item && Array.isArray(item.polyline) && item.polyline.length > 0)
            .map((item) => (
              <Polyline
                key={`segment-${item.id}`}
                positions={item.polyline}
                pathOptions={{
                  color: color(item.risk_level, item.color),
                  weight: 7,
                  opacity: 0.95,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                <Tooltip sticky>
                  📍 [HIGHWAY RISK SEGMENT] {item.start_point_name} - {item.end_point_name} · Risk: {item.risk_level} ({Math.round((item.risk_score || 0) * 100)}%)
                </Tooltip>
              </Polyline>
            ))}

        {/* RAIL NETWORK (NFR Broad-Gauge Lifelines) */}
        {railVisible &&
          railEdges
            .filter((edge) => edge && Array.isArray(edge.geometry) && edge.geometry.length > 0)
            .map((edge) => (
              <Polyline
                key={edge.id}
                positions={edge.geometry}
                pathOptions={{ color: '#2563eb', weight: 5, dashArray: '10, 6', opacity: 0.95 }}
              >
                <Tooltip sticky>
                  🚆 [NFR RAIL FREIGHT] {edge.corridor_name} ({edge.distance_km} km)
                </Tooltip>
              </Polyline>
            ))}

        {/* WATERWAY CORRIDORS (NW-2 Brahmaputra & NW-16 Barak) */}
        {waterwayVisible &&
          waterwayEdges
            .filter((edge) => edge && Array.isArray(edge.geometry) && edge.geometry.length > 0)
            .map((edge) => (
              <Polyline
                key={edge.id}
                positions={edge.geometry}
                pathOptions={{ color: '#0d9488', weight: 6, opacity: 0.95 }}
              >
                <Tooltip sticky>
                  ⚓ [NW-2 WATERWAY BARGE] {edge.corridor_name} ({edge.distance_km} km)
                </Tooltip>
              </Polyline>
            ))}

        {/* AIR CARGO LANES */}
        {airVisible &&
          airEdges
            .filter((edge) => edge && Array.isArray(edge.geometry) && edge.geometry.length > 0)
            .map((edge) => (
              <Polyline
                key={edge.id}
                positions={edge.geometry}
                pathOptions={{ color: '#d97706', weight: 3.5, dashArray: '12, 8', opacity: 0.9 }}
              >
                <Tooltip sticky>
                  ✈ [AAI AIR CARGO LIFELINE] {edge.corridor_name} ({edge.distance_km} km)
                </Tooltip>
              </Polyline>
            ))}

        {/* MULTIMODAL HUBS / TERMINALS */}
        {roadVisible &&
          roadHubs
            .filter((hub) => hub && Array.isArray(hub.coordinates) && hub.coordinates.length === 2 && !isNaN(hub.coordinates[0]) && !isNaN(hub.coordinates[1]))
            .map((hub) => (
              <Marker key={hub.id} position={hub.coordinates} icon={roadHubIcon()}>
                <Popup>
                  <b>🛣️ {hub.name}</b>
                  <br />
                  {hub.state} · Handling Capacity: {hub.handling_capacity_tons_day} MT/day
                  <br />
                  <small>National Highway Freight Junction & Logistics Park</small>
                </Popup>
              </Marker>
            ))}
        {railVisible &&
          railHubs
            .filter((hub) => hub && Array.isArray(hub.coordinates) && hub.coordinates.length === 2 && !isNaN(hub.coordinates[0]) && !isNaN(hub.coordinates[1]))
            .map((hub) => (
              <Marker key={hub.id} position={hub.coordinates} icon={railHubIcon()}>
                <Popup>
                  <b>🚆 {hub.name}</b>
                  <br />
                  {hub.state} · Handling Capacity: {hub.handling_capacity_tons_day} MT/day
                  <br />
                  <small>Intermodal Rail Yard & Ro-Ro Facility</small>
                </Popup>
              </Marker>
            ))}

        {waterwayVisible &&
          portHubs
            .filter((hub) => hub && Array.isArray(hub.coordinates) && hub.coordinates.length === 2 && !isNaN(hub.coordinates[0]) && !isNaN(hub.coordinates[1]))
            .map((hub) => (
              <Marker key={hub.id} position={hub.coordinates} icon={portHubIcon()}>
                <Popup>
                  <b>⚓ {hub.name}</b>
                  <br />
                  {hub.state} · Capacity: {hub.handling_capacity_tons_day} MT/day
                  <br />
                  <small>IWAI Inland Port Terminal</small>
                </Popup>
              </Marker>
            ))}

        {airVisible &&
          airHubs
            .filter((hub) => hub && Array.isArray(hub.coordinates) && hub.coordinates.length === 2 && !isNaN(hub.coordinates[0]) && !isNaN(hub.coordinates[1]))
            .map((hub) => (
              <Marker key={hub.id} position={hub.coordinates} icon={airportHubIcon()}>
                <Popup>
                  <b>✈ {hub.name}</b>
                  <br />
                  {hub.state} · Cargo Capacity: {hub.handling_capacity_tons_day} MT/day
                  <br />
                  <small>AAI Dedicated Air Cargo Facility</small>
                </Popup>
              </Marker>
            ))}

        {/* Selected Route Polyline (High Visibility Neon Overlay) */}
        {selectedRoute && Array.isArray(selectedRoute.waypoints) && selectedRoute.waypoints.length > 0 && (
          <Polyline
            positions={selectedRoute.waypoints.filter((pt) => Array.isArray(pt) && pt.length === 2 && !isNaN(pt[0]) && !isNaN(pt[1]))}
            pathOptions={{
              color:
                selectedRoute.modes_used && selectedRoute.modes_used.length > 1
                  ? '#a855f7' // Purple for Multimodal hybrid combinations
                  : selectedRoute.mode === 'RAIL'
                  ? '#3b82f6'
                  : selectedRoute.mode === 'WATERWAY'
                  ? '#14b8a6'
                  : selectedRoute.mode === 'AIR'
                  ? '#f59e0b'
                  : '#06b6d4',
              weight: 6,
              dashArray: selectedRoute.mode === 'AIR' ? '12 8' : '8 6',
              opacity: 0.95
            }}
          >
            <Tooltip permanent>
              Active: {selectedRoute.route_name} ({selectedRoute.total_distance_km} km)
            </Tooltip>
          </Polyline>
        )}

        {/* Alternate routes from segment predictions (Highlighted as Resilient Green Line) */}
        {segments
          .filter((item) => item && Array.isArray(item.alternate_route_polyline) && item.alternate_route_polyline.length > 0)
          .map((item) => (
            <Polyline
              key={`${item.id}-alternate`}
              positions={item.alternate_route_polyline!}
              pathOptions={{ color: '#16a34a', weight: 6, opacity: 0.95, lineCap: 'round', lineJoin: 'round' }}
            >
              <Tooltip sticky>
                🌱 [AI RESILIENT ALTERNATE ROUTE] Safe Resilient Bypass Line
              </Tooltip>
            </Polyline>
          ))}

        {/* Vehicles / Fleet Markers */}
        {vehiclesVisible &&
          safeVehicles
            .filter((item) => item && typeof item.current_lat === 'number' && typeof item.current_lng === 'number' && !isNaN(item.current_lat) && !isNaN(item.current_lng))
            .map((item) => (
              <Marker key={item.id} position={[item.current_lat, item.current_lng]} icon={vehicleIcon(item)}>
                <Popup>
                  <b>{item.plate_number}</b>
                  <br />
                  {item.cargo_type}
                  <br />
                  {item.origin_city} → {item.destination_city}
                  <br />
                  <b>
                    {(item.status || '').replace(/_/g, ' ')} · ETA {item.eta_minutes} min
                  </b>
                </Popup>
              </Marker>
            ))}

        {/* Incidents / Hazard Markers */}
        {incidentsVisible &&
          safeIncidents
            .filter((item) => item && (typeof item.latitude === 'number' || typeof item.lat === 'number'))
            .map((item) => {
              const latVal = item.latitude ?? item.lat ?? 0;
              const lngVal = item.longitude ?? item.lng ?? 0;
              return (
                <Marker key={item.id} position={[latVal, lngVal]} icon={incidentIcon(item)}>
                  <Popup>
                    <b>{item.category || item.incident_type || 'Incident'}</b>
                    <br />
                    {item.location_name}
                    <br />
                    {item.description || 'Field report received.'}
                    <br />
                    <small>
                      {item.status} · clearance {item.clearance_eta_hours || 0}h
                    </small>
                    <div className="popup-actions">
                      {onUpvoteIncident && (
                        <button onClick={() => onUpvoteIncident(item.id)}>Confirm ({item.upvotes ?? item.upvotes_count ?? 0})</button>
                      )}
                      {onVerifyIncident && item.status === 'REPORTED' && (
                        <button onClick={() => onVerifyIncident(item.id)}>Verify</button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

        {/* Weather Alerts Markers */}
        {weatherVisible &&
          safeWeather
            .filter((item) => item && typeof item.lat === 'number' && typeof item.lng === 'number' && !isNaN(item.lat) && !isNaN(item.lng))
            .map((item) => (
              <Marker key={item.location || item.location_name || item.id} position={[item.lat, item.lng]} icon={weatherHubIcon()}>
                <Popup>
                  <b>{item.location || item.location_name}</b>
                  <br />
                  {item.weather_condition || item.condition}
                  <br />
                  Rainfall: {item.precipitation_mm ?? item.rainfall_mm_24h} mm
                </Popup>
              </Marker>
            ))}
      </MapContainer>
    </div>
  );
};
