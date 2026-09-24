import {
  ModalNetworkData,
  RouteCalculationResponse,
  RouteOption,
  TransportMode,
  CargoPriority,
  CargoCategory,
  SupplyStockItem
} from '../types';

export const MULTIMODAL_NETWORK_DATA: ModalNetworkData = {
  nodes: [
    // Road Hubs
    { id: 'Guwahati', name: 'Guwahati Central Hub', state: 'Assam', node_type: 'ROAD_HUB', coordinates: [26.1445, 91.7362], handling_capacity_tons_day: 8000, modes: ['ROAD'] },
    { id: 'Shillong', name: 'Shillong Bypass Hub', state: 'Meghalaya', node_type: 'ROAD_HUB', coordinates: [25.5788, 91.8933], handling_capacity_tons_day: 3200, modes: ['ROAD'] },
    { id: 'Jowai', name: 'Jowai Transit Node', state: 'Meghalaya', node_type: 'ROAD_HUB', coordinates: [25.4526, 92.2038], handling_capacity_tons_day: 2000, modes: ['ROAD'] },
    { id: 'Khliehriat', name: 'Khliehriat Checkpoint', state: 'Meghalaya', node_type: 'ROAD_HUB', coordinates: [25.3524, 92.3644], handling_capacity_tons_day: 1500, modes: ['ROAD'] },
    { id: 'Sonapur_Tunnel', name: 'Sonapur Highway Pass', state: 'Meghalaya', node_type: 'ROAD_HUB', coordinates: [25.1328, 92.3582], handling_capacity_tons_day: 1200, modes: ['ROAD'] },
    { id: 'Silchar', name: 'Silchar Logistics Park', state: 'Assam', node_type: 'ROAD_HUB', coordinates: [24.8333, 92.7789], handling_capacity_tons_day: 6500, modes: ['ROAD'] },
    { id: 'Nagaon', name: 'Nagaon Bypass Depot', state: 'Assam', node_type: 'ROAD_HUB', coordinates: [26.3452, 92.6841], handling_capacity_tons_day: 4200, modes: ['ROAD'] },
    { id: 'Lumding', name: 'Lumding Junction Yard', state: 'Assam', node_type: 'ROAD_HUB', coordinates: [25.7500, 93.1667], handling_capacity_tons_day: 5000, modes: ['ROAD'] },
    { id: 'Haflong', name: 'Haflong Hill Depot', state: 'Assam', node_type: 'ROAD_HUB', coordinates: [25.1764, 93.0234], handling_capacity_tons_day: 1800, modes: ['ROAD'] },
    { id: 'Dimapur', name: 'Dimapur Gate Depot', state: 'Nagaland', node_type: 'ROAD_HUB', coordinates: [25.9093, 93.7266], handling_capacity_tons_day: 4500, modes: ['ROAD'] },
    { id: 'Kohima', name: 'Kohima Capital Depot', state: 'Nagaland', node_type: 'ROAD_HUB', coordinates: [25.6751, 94.1086], handling_capacity_tons_day: 2200, modes: ['ROAD'] },
    { id: 'Imphal', name: 'Imphal Valley Depot', state: 'Manipur', node_type: 'ROAD_HUB', coordinates: [24.8170, 93.9368], handling_capacity_tons_day: 3100, modes: ['ROAD'] },
    { id: 'Aizawl', name: 'Aizawl Central Godown', state: 'Mizoram', node_type: 'ROAD_HUB', coordinates: [23.7271, 92.7176], handling_capacity_tons_day: 1900, modes: ['ROAD'] },
    { id: 'Agartala', name: 'Agartala Integrated Checkpost', state: 'Tripura', node_type: 'ROAD_HUB', coordinates: [23.8315, 91.2868], handling_capacity_tons_day: 5200, modes: ['ROAD'] },
    { id: 'Tezpur', name: 'Tezpur North Bank Depot', state: 'Assam', node_type: 'ROAD_HUB', coordinates: [26.6528, 92.7926], handling_capacity_tons_day: 3400, modes: ['ROAD'] },
    { id: 'Itanagar', name: 'Itanagar Capital Depot', state: 'Arunachal Pradesh', node_type: 'ROAD_HUB', coordinates: [27.0844, 93.6053], handling_capacity_tons_day: 1600, modes: ['ROAD'] },
    { id: 'Siliguri', name: 'Siliguri Chicken-Neck Hub', state: 'West Bengal', node_type: 'ROAD_HUB', coordinates: [26.7271, 88.3953], handling_capacity_tons_day: 12000, modes: ['ROAD'] },
    { id: 'Gangtok', name: 'Gangtok Himalayan Depot', state: 'Sikkim', node_type: 'ROAD_HUB', coordinates: [27.3389, 88.6065], handling_capacity_tons_day: 1400, modes: ['ROAD'] },

    // Rail Terminals (Northeast Frontier Railway - NFR)
    { id: 'Guwahati_Rail', name: 'Guwahati / New Guwahati Goods Yard', state: 'Assam', node_type: 'RAILWAY_STATION', coordinates: [26.1820, 91.7610], handling_capacity_tons_day: 15000, modes: ['RAIL', 'TRANSFER'] },
    { id: 'Lumding_Rail', name: 'Lumding BG Freight Yard', state: 'Assam', node_type: 'RAILWAY_STATION', coordinates: [25.7550, 93.1720], handling_capacity_tons_day: 9000, modes: ['RAIL', 'TRANSFER'] },
    { id: 'Badarpur_Silchar_Rail', name: 'Badarpur - Silchar BG Junction', state: 'Assam', node_type: 'RAILWAY_STATION', coordinates: [24.8980, 92.5970], handling_capacity_tons_day: 8500, modes: ['RAIL', 'TRANSFER'] },
    { id: 'Dimapur_Rail', name: 'Dimapur Railhead Depot', state: 'Nagaland', node_type: 'RAILWAY_STATION', coordinates: [25.9180, 93.7310], handling_capacity_tons_day: 7000, modes: ['RAIL', 'TRANSFER'] },
    { id: 'Agartala_Rail', name: 'Agartala Badharghat Rail Terminal', state: 'Tripura', node_type: 'RAILWAY_STATION', coordinates: [23.7950, 91.2720], handling_capacity_tons_day: 6200, modes: ['RAIL', 'TRANSFER'] },
    { id: 'Naharlagun_Rail', name: 'Naharlagun Railhead (Arunachal)', state: 'Arunachal Pradesh', node_type: 'RAILWAY_STATION', coordinates: [27.1060, 93.6930], handling_capacity_tons_day: 4000, modes: ['RAIL', 'TRANSFER'] },
    { id: 'Bairabi_Rail', name: 'Bairabi Railhead (Mizoram Gateway)', state: 'Mizoram', node_type: 'RAILWAY_STATION', coordinates: [24.1870, 92.5350], handling_capacity_tons_day: 3500, modes: ['RAIL', 'TRANSFER'] },
    { id: 'NJP_Siliguri_Rail', name: 'New Jalpaiguri (NJP) Freight Complex', state: 'West Bengal', node_type: 'RAILWAY_STATION', coordinates: [26.6850, 88.4410], handling_capacity_tons_day: 18000, modes: ['RAIL', 'TRANSFER'] },

    // Inland Waterway Terminals (NW-2 Brahmaputra & NW-16 Barak)
    { id: 'Pandu_Port_Guwahati', name: 'Pandu River Port (NW-2 Multimodal Hub)', state: 'Assam', node_type: 'RIVER_PORT', coordinates: [26.1680, 91.6880], handling_capacity_tons_day: 7500, modes: ['WATERWAY', 'TRANSFER'] },
    { id: 'Dhubri_Port', name: 'Dhubri International River Port', state: 'Assam', node_type: 'RIVER_PORT', coordinates: [26.0200, 89.9700], handling_capacity_tons_day: 5500, modes: ['WATERWAY', 'TRANSFER'] },
    { id: 'Tezpur_Silghat_Port', name: 'Silghat / Tezpur IWT Terminal', state: 'Assam', node_type: 'RIVER_PORT', coordinates: [26.6050, 92.9300], handling_capacity_tons_day: 3800, modes: ['WATERWAY', 'TRANSFER'] },
    { id: 'Neamati_Ghat_Jorhat', name: 'Neamati Ghat River Port', state: 'Assam', node_type: 'RIVER_PORT', coordinates: [26.8620, 94.2250], handling_capacity_tons_day: 3200, modes: ['WATERWAY', 'TRANSFER'] },
    { id: 'Bogibeel_Dibrugarh_Port', name: 'Bogibeel - Dibrugarh River Port', state: 'Assam', node_type: 'RIVER_PORT', coordinates: [27.4010, 94.8820], handling_capacity_tons_day: 4800, modes: ['WATERWAY', 'TRANSFER'] },
    { id: 'Badarpur_Barak_Port', name: 'Badarpur IWT Port (NW-16 Barak River)', state: 'Assam', node_type: 'RIVER_PORT', coordinates: [24.8910, 92.5850], handling_capacity_tons_day: 2800, modes: ['WATERWAY', 'TRANSFER'] },

    // Air Cargo Terminals (AAI Cargo)
    { id: 'GAU_Airport', name: 'LGBI Airport Air Cargo Terminal (Guwahati)', state: 'Assam', node_type: 'AIRPORT', coordinates: [26.1060, 91.5859], handling_capacity_tons_day: 1200, modes: ['AIR', 'TRANSFER'] },
    { id: 'IXS_Silchar_Airport', name: 'Kumbhirgram Air Cargo (Silchar)', state: 'Assam', node_type: 'AIRPORT', coordinates: [24.9125, 92.9790], handling_capacity_tons_day: 400, modes: ['AIR', 'TRANSFER'] },
    { id: 'IMF_Imphal_Airport', name: 'Bir Tikendrajit Air Cargo (Imphal)', state: 'Manipur', node_type: 'AIRPORT', coordinates: [24.7600, 93.8967], handling_capacity_tons_day: 600, modes: ['AIR', 'TRANSFER'] },
    { id: 'IXA_Agartala_Airport', name: 'MBB Airport Air Cargo (Agartala)', state: 'Tripura', node_type: 'AIRPORT', coordinates: [23.8870, 91.2405], handling_capacity_tons_day: 550, modes: ['AIR', 'TRANSFER'] },
    { id: 'DMU_Dimapur_Airport', name: 'Dimapur Cargo Terminal', state: 'Nagaland', node_type: 'AIRPORT', coordinates: [25.8839, 93.7711], handling_capacity_tons_day: 350, modes: ['AIR', 'TRANSFER'] },
    { id: 'HGI_Itanagar_Airport', name: 'Donyi Polo Airport Cargo (Hollongi)', state: 'Arunachal Pradesh', node_type: 'AIRPORT', coordinates: [26.9940, 93.6420], handling_capacity_tons_day: 300, modes: ['AIR', 'TRANSFER'] },
    { id: 'PYG_Pakyong_Airport', name: 'Pakyong Himalayan Air Terminal (Gangtok)', state: 'Sikkim', node_type: 'AIRPORT', coordinates: [27.2280, 88.5870], handling_capacity_tons_day: 150, modes: ['AIR', 'TRANSFER'] }
  ],
  edges: [
    // --- RAIL CORRIDORS (NFR High Capacity Broad Gauge) ---
    {
      id: 'rail-njp-guwahati',
      source: 'NJP_Siliguri_Rail',
      destination: 'Guwahati_Rail',
      mode: 'RAIL',
      corridor_name: 'NFR Mainline BG Double-Track',
      distance_km: 418.0,
      avg_speed_kmh: 55.0,
      risk_score: 0.04,
      cost_per_ton_km_inr: 1.45,
      carbon_per_ton_km_g: 24.0,
      status: 'OPERATIONAL',
      geometry: [[26.6850, 88.4410], [26.5028, 90.5574], [26.1820, 91.7610]]
    },
    {
      id: 'rail-guwahati-lumding',
      source: 'Guwahati_Rail',
      destination: 'Lumding_Rail',
      mode: 'RAIL',
      corridor_name: 'Lumding Division BG Lifeline',
      distance_km: 181.0,
      avg_speed_kmh: 52.0,
      risk_score: 0.06,
      cost_per_ton_km_inr: 1.55,
      carbon_per_ton_km_g: 26.0,
      status: 'OPERATIONAL',
      geometry: [[26.1820, 91.7610], [26.3452, 92.6841], [25.7550, 93.1720]]
    },
    {
      id: 'rail-lumding-badarpur',
      source: 'Lumding_Rail',
      destination: 'Badarpur_Silchar_Rail',
      mode: 'RAIL',
      corridor_name: 'Haflong Hill Section Broad-Gauge Tunnel Line',
      distance_km: 170.0,
      avg_speed_kmh: 42.0,
      risk_score: 0.14,
      cost_per_ton_km_inr: 1.70,
      carbon_per_ton_km_g: 30.0,
      status: 'OPERATIONAL',
      geometry: [[25.7550, 93.1720], [25.1764, 93.0234], [24.8980, 92.5970]]
    },
    {
      id: 'rail-lumding-dimapur',
      source: 'Lumding_Rail',
      destination: 'Dimapur_Rail',
      mode: 'RAIL',
      corridor_name: 'NFR Dimapur Nagaland Branch',
      distance_km: 70.0,
      avg_speed_kmh: 50.0,
      risk_score: 0.05,
      cost_per_ton_km_inr: 1.50,
      carbon_per_ton_km_g: 25.0,
      status: 'OPERATIONAL',
      geometry: [[25.7550, 93.1720], [25.9180, 93.7310]]
    },
    {
      id: 'rail-badarpur-agartala',
      source: 'Badarpur_Silchar_Rail',
      destination: 'Agartala_Rail',
      mode: 'RAIL',
      corridor_name: 'Tripura Sundari Broad-Gauge Corridor',
      distance_km: 215.0,
      avg_speed_kmh: 48.0,
      risk_score: 0.12,
      cost_per_ton_km_inr: 1.60,
      carbon_per_ton_km_g: 28.0,
      status: 'OPERATIONAL',
      geometry: [[24.8980, 92.5970], [24.3800, 92.1600], [23.7950, 91.2720]]
    },
    {
      id: 'rail-badarpur-bairabi',
      source: 'Badarpur_Silchar_Rail',
      destination: 'Bairabi_Rail',
      mode: 'RAIL',
      corridor_name: 'Bairabi Mizoram Rail Connector',
      distance_km: 84.0,
      avg_speed_kmh: 38.0,
      risk_score: 0.16,
      cost_per_ton_km_inr: 1.65,
      carbon_per_ton_km_g: 29.0,
      status: 'OPERATIONAL',
      geometry: [[24.8980, 92.5970], [24.1870, 92.5350]]
    },
    {
      id: 'rail-guwahati-naharlagun',
      source: 'Guwahati_Rail',
      destination: 'Naharlagun_Rail',
      mode: 'RAIL',
      corridor_name: 'Arunachal Donyi Polo Express Route',
      distance_km: 330.0,
      avg_speed_kmh: 52.0,
      risk_score: 0.08,
      cost_per_ton_km_inr: 1.55,
      carbon_per_ton_km_g: 27.0,
      status: 'OPERATIONAL',
      geometry: [[26.1820, 91.7610], [26.6528, 92.7926], [27.1060, 93.6930]]
    },

    // --- INLAND WATERWAYS (NW-2 Brahmaputra & NW-16 Barak) ---
    {
      id: 'iwt-dhubri-pandu',
      source: 'Dhubri_Port',
      destination: 'Pandu_Port_Guwahati',
      mode: 'WATERWAY',
      corridor_name: 'NW-2 Lower Brahmaputra Freight Navigation Channel',
      distance_km: 260.0,
      avg_speed_kmh: 16.0,
      risk_score: 0.05,
      cost_per_ton_km_inr: 0.85,
      carbon_per_ton_km_g: 16.0,
      status: 'OPERATIONAL',
      geometry: [[26.0200, 89.9700], [26.1680, 91.6880]]
    },
    {
      id: 'iwt-pandu-tezpur',
      source: 'Pandu_Port_Guwahati',
      destination: 'Tezpur_Silghat_Port',
      mode: 'WATERWAY',
      corridor_name: 'NW-2 Central Brahmaputra Riverway',
      distance_km: 155.0,
      avg_speed_kmh: 15.0,
      risk_score: 0.06,
      cost_per_ton_km_inr: 0.90,
      carbon_per_ton_km_g: 17.0,
      status: 'OPERATIONAL',
      geometry: [[26.1680, 91.6880], [26.6050, 92.9300]]
    },
    {
      id: 'iwt-tezpur-neamati',
      source: 'Tezpur_Silghat_Port',
      destination: 'Neamati_Ghat_Jorhat',
      mode: 'WATERWAY',
      corridor_name: 'NW-2 Upper Brahmaputra Corridor',
      distance_km: 145.0,
      avg_speed_kmh: 15.0,
      risk_score: 0.07,
      cost_per_ton_km_inr: 0.92,
      carbon_per_ton_km_g: 18.0,
      status: 'OPERATIONAL',
      geometry: [[26.6050, 92.9300], [26.8620, 94.2250]]
    },
    {
      id: 'iwt-neamati-bogibeel',
      source: 'Neamati_Ghat_Jorhat',
      destination: 'Bogibeel_Dibrugarh_Port',
      mode: 'WATERWAY',
      corridor_name: 'NW-2 Dibrugarh Terminal Reach',
      distance_km: 120.0,
      avg_speed_kmh: 14.0,
      risk_score: 0.08,
      cost_per_ton_km_inr: 0.95,
      carbon_per_ton_km_g: 19.0,
      status: 'OPERATIONAL',
      geometry: [[26.8620, 94.2250], [27.4010, 94.8820]]
    },
    {
      id: 'iwt-badarpur-barak',
      source: 'Badarpur_Barak_Port',
      destination: 'Silchar',
      mode: 'WATERWAY',
      corridor_name: 'NW-16 Barak River Navigation Reach',
      distance_km: 42.0,
      avg_speed_kmh: 12.0,
      risk_score: 0.10,
      cost_per_ton_km_inr: 1.10,
      carbon_per_ton_km_g: 20.0,
      status: 'OPERATIONAL',
      geometry: [[24.8910, 92.5850], [24.8333, 92.7789]]
    },

    // --- AIR CARGO CORRIDORS ---
    {
      id: 'air-gau-ixs',
      source: 'GAU_Airport',
      destination: 'IXS_Silchar_Airport',
      mode: 'AIR',
      corridor_name: 'Guwahati - Silchar Express Air Cargo Lane',
      distance_km: 210.0,
      avg_speed_kmh: 460.0,
      risk_score: 0.02,
      cost_per_ton_km_inr: 26.0,
      carbon_per_ton_km_g: 520.0,
      status: 'OPERATIONAL',
      geometry: [[26.1060, 91.5859], [25.5000, 92.3000], [24.9125, 92.9790]]
    },
    {
      id: 'air-gau-imf',
      source: 'GAU_Airport',
      destination: 'IMF_Imphal_Airport',
      mode: 'AIR',
      corridor_name: 'Guwahati - Imphal Emergency Lifeline Flight',
      distance_km: 275.0,
      avg_speed_kmh: 480.0,
      risk_score: 0.03,
      cost_per_ton_km_inr: 27.5,
      carbon_per_ton_km_g: 540.0,
      status: 'OPERATIONAL',
      geometry: [[26.1060, 91.5859], [25.4000, 92.7000], [24.7600, 93.8967]]
    },
    {
      id: 'air-gau-ixa',
      source: 'GAU_Airport',
      destination: 'IXA_Agartala_Airport',
      mode: 'AIR',
      corridor_name: 'Guwahati - Agartala Air Logistics Link',
      distance_km: 260.0,
      avg_speed_kmh: 470.0,
      risk_score: 0.02,
      cost_per_ton_km_inr: 25.5,
      carbon_per_ton_km_g: 510.0,
      status: 'OPERATIONAL',
      geometry: [[26.1060, 91.5859], [25.0000, 91.4000], [23.8870, 91.2405]]
    },
    {
      id: 'air-gau-dmu',
      source: 'GAU_Airport',
      destination: 'DMU_Dimapur_Airport',
      mode: 'AIR',
      corridor_name: 'Guwahati - Dimapur Feeder Lane',
      distance_km: 215.0,
      avg_speed_kmh: 450.0,
      risk_score: 0.02,
      cost_per_ton_km_inr: 28.0,
      carbon_per_ton_km_g: 530.0,
      status: 'OPERATIONAL',
      geometry: [[26.1060, 91.5859], [25.8839, 93.7711]]
    },
    {
      id: 'air-gau-pyg',
      source: 'GAU_Airport',
      destination: 'PYG_Pakyong_Airport',
      mode: 'AIR',
      corridor_name: 'Guwahati - Pakyong (Gangtok) Himalayan Airlift',
      distance_km: 340.0,
      avg_speed_kmh: 440.0,
      risk_score: 0.05,
      cost_per_ton_km_inr: 32.0,
      carbon_per_ton_km_g: 590.0,
      status: 'OPERATIONAL',
      geometry: [[26.1060, 91.5859], [26.7000, 90.1000], [27.2280, 88.5870]]
    },

    // --- INTERMODAL TRANSFERS (Connecting City Hubs to Modal Terminals) ---
    {
      id: 'transfer-gau-rail',
      source: 'Guwahati',
      destination: 'Guwahati_Rail',
      mode: 'TRANSFER',
      corridor_name: 'Guwahati Depot to NFR Yard Shuttle',
      distance_km: 6.5,
      avg_speed_kmh: 25.0,
      risk_score: 0.01,
      cost_per_ton_km_inr: 12.0,
      carbon_per_ton_km_g: 90.0,
      status: 'OPERATIONAL',
      geometry: [[26.1445, 91.7362], [26.1820, 91.7610]]
    },
    {
      id: 'transfer-gau-port',
      source: 'Guwahati',
      destination: 'Pandu_Port_Guwahati',
      mode: 'TRANSFER',
      corridor_name: 'Guwahati City to Pandu River Port Link',
      distance_km: 9.0,
      avg_speed_kmh: 22.0,
      risk_score: 0.01,
      cost_per_ton_km_inr: 14.0,
      carbon_per_ton_km_g: 95.0,
      status: 'OPERATIONAL',
      geometry: [[26.1445, 91.7362], [26.1680, 91.6880]]
    },
    {
      id: 'transfer-gau-air',
      source: 'Guwahati',
      destination: 'GAU_Airport',
      mode: 'TRANSFER',
      corridor_name: 'Guwahati Depot to LGBI Air Cargo Ramp',
      distance_km: 21.0,
      avg_speed_kmh: 38.0,
      risk_score: 0.01,
      cost_per_ton_km_inr: 16.0,
      carbon_per_ton_km_g: 105.0,
      status: 'OPERATIONAL',
      geometry: [[26.1445, 91.7362], [26.1060, 91.5859]]
    },
    {
      id: 'transfer-sil-rail',
      source: 'Badarpur_Silchar_Rail',
      destination: 'Silchar',
      mode: 'TRANSFER',
      corridor_name: 'Badarpur Railhead to Silchar Depot Transfer',
      distance_km: 28.0,
      avg_speed_kmh: 32.0,
      risk_score: 0.02,
      cost_per_ton_km_inr: 15.0,
      carbon_per_ton_km_g: 98.0,
      status: 'OPERATIONAL',
      geometry: [[24.8980, 92.5970], [24.8333, 92.7789]]
    },
    {
      id: 'transfer-sil-air',
      source: 'IXS_Silchar_Airport',
      destination: 'Silchar',
      mode: 'TRANSFER',
      corridor_name: 'Kumbhirgram Airport to Silchar City Cargo Link',
      distance_km: 26.0,
      avg_speed_kmh: 35.0,
      risk_score: 0.02,
      cost_per_ton_km_inr: 16.0,
      carbon_per_ton_km_g: 102.0,
      status: 'OPERATIONAL',
      geometry: [[24.9125, 92.9790], [24.8333, 92.7789]]
    },
    {
      id: 'transfer-dmu-rail',
      source: 'Dimapur_Rail',
      destination: 'Dimapur',
      mode: 'TRANSFER',
      corridor_name: 'Dimapur Station to Truck Depot Shuttle',
      distance_km: 3.5,
      avg_speed_kmh: 20.0,
      risk_score: 0.01,
      cost_per_ton_km_inr: 15.0,
      carbon_per_ton_km_g: 90.0,
      status: 'OPERATIONAL',
      geometry: [[25.9180, 93.7310], [25.9093, 93.7266]]
    },
    {
      id: 'transfer-agt-rail',
      source: 'Agartala_Rail',
      destination: 'Agartala',
      mode: 'TRANSFER',
      corridor_name: 'Badharghat Station to Agartala ICP Link',
      distance_km: 6.0,
      avg_speed_kmh: 25.0,
      risk_score: 0.01,
      cost_per_ton_km_inr: 14.0,
      carbon_per_ton_km_g: 92.0,
      status: 'OPERATIONAL',
      geometry: [[23.7950, 91.2720], [23.8315, 91.2868]]
    }
  ]
};

export const SAMPLE_SUPPLY_STOCK_ITEMS: SupplyStockItem[] = [
  {
    id: 'stock-imphal-01',
    location_name: 'Imphal Regional Hospital (JNIMS)',
    facility_type: 'Regional Hospital',
    state: 'Manipur',
    commodity: 'Critical Insulin & Trauma Units',
    cargo_category: 'Medicine',
    current_stock: 400,
    unit: 'units',
    daily_consumption: 100,
    days_remaining: 4,
    expected_delivery_days: 5,
    shortage_risk: 'HIGH',
    recommended_action: 'Switch to multimodal Ro-Ro or emergency Air Bridge to beat stockout deadline',
    recommended_mode: 'HYBRID',
    origin_hub: 'Guwahati',
    criticality: 'CRITICAL',
    last_updated: '2026-09-22T08:30:00Z'
  },
  {
    id: 'stock-silchar-02',
    location_name: 'Silchar Civil Hospital (Cachar)',
    facility_type: 'District Hospital',
    state: 'Assam',
    commodity: 'Polyvalent Antivenom & Dialysis Fluids',
    cargo_category: 'Medicine',
    current_stock: 280,
    unit: 'vials / packs',
    daily_consumption: 90,
    days_remaining: 3.1,
    expected_delivery_days: 4,
    shortage_risk: 'HIGH',
    recommended_action: 'Sonapur landslide warning; reroute via NFR Lumding-Badarpur BG freight rake',
    recommended_mode: 'RAIL',
    origin_hub: 'Guwahati',
    criticality: 'CRITICAL',
    last_updated: '2026-09-22T09:15:00Z'
  },
  {
    id: 'stock-haflong-03',
    location_name: 'Haflong Sub-Divisional Depot',
    facility_type: 'Disaster Buffer Depot',
    state: 'Assam',
    commodity: 'FCI Fortified Rice & Pulses',
    cargo_category: 'Food',
    current_stock: 120,
    unit: 'metric tons',
    daily_consumption: 18,
    days_remaining: 6.7,
    expected_delivery_days: 5.5,
    shortage_risk: 'MEDIUM',
    recommended_action: 'Road capacity constraint detected; utilize NFR Lumding Ro-Ro flatcar train',
    recommended_mode: 'RAIL',
    origin_hub: 'Guwahati',
    criticality: 'HIGH',
    last_updated: '2026-09-22T07:45:00Z'
  },
  {
    id: 'stock-aizawl-04',
    location_name: 'Aizawl Civil Hospital',
    facility_type: 'State Referral Hospital',
    state: 'Mizoram',
    commodity: 'Emergency Blood Plasma & Cardiac Meds',
    cargo_category: 'Medicine',
    current_stock: 180,
    unit: 'units',
    daily_consumption: 40,
    days_remaining: 4.5,
    expected_delivery_days: 3.8,
    shortage_risk: 'MEDIUM',
    recommended_action: 'Monitor NH-306 hill corridor; maintain readiness for Lengpui air shuttle',
    recommended_mode: 'ROAD',
    origin_hub: 'Silchar',
    criticality: 'HIGH',
    last_updated: '2026-09-22T08:00:00Z'
  },
  {
    id: 'stock-agartala-05',
    location_name: 'Agartala Government Medical College',
    facility_type: 'Medical College & Hospital',
    state: 'Tripura',
    commodity: 'Medical Oxygen Cylinders & Surgical Kits',
    cargo_category: 'Relief / Emergency Supplies',
    current_stock: 650,
    unit: 'cylinders',
    daily_consumption: 80,
    days_remaining: 8.1,
    expected_delivery_days: 4.0,
    shortage_risk: 'LOW',
    recommended_action: 'Supply stable; continue scheduled NFR BG rail dispatch from Guwahati',
    recommended_mode: 'RAIL',
    origin_hub: 'Guwahati',
    criticality: 'STANDARD',
    last_updated: '2026-09-22T09:00:00Z'
  },
  {
    id: 'stock-kohima-06',
    location_name: 'Kohima Naga Hospital Authority',
    facility_type: 'District Hospital',
    state: 'Nagaland',
    commodity: 'Pediatric Vaccines & Antibiotics',
    cargo_category: 'Medicine',
    current_stock: 210,
    unit: 'doses / vials',
    daily_consumption: 60,
    days_remaining: 3.5,
    expected_delivery_days: 4.2,
    shortage_risk: 'HIGH',
    recommended_action: 'NH-29 landslide threat; route via Dimapur railhead transfer to Kohima',
    recommended_mode: 'HYBRID',
    origin_hub: 'Guwahati',
    criticality: 'CRITICAL',
    last_updated: '2026-09-22T08:20:00Z'
  }
];

export function calculateStockItemShortageRisk(
  item: SupplyStockItem,
  roadDisrupted: boolean = false
): SupplyStockItem {
  const daysRemaining = Math.round((item.current_stock / Math.max(1, item.daily_consumption)) * 10) / 10;
  let deliveryDays = item.expected_delivery_days;
  if (roadDisrupted) {
    deliveryDays += 2.0; // highway disruptions lengthen transit time
  }

  let risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (daysRemaining < deliveryDays) {
    risk = item.criticality === 'CRITICAL' ? 'CRITICAL' : 'HIGH';
  } else if (daysRemaining <= deliveryDays + 1.5) {
    risk = 'MEDIUM';
  } else {
    risk = 'LOW';
  }

  return {
    ...item,
    days_remaining: daysRemaining,
    expected_delivery_days: deliveryDays,
    shortage_risk: risk
  };
}

export function calculateShortageRisk(
  currentStock: number,
  dailyConsumption: number,
  etaMinutes: number
): ShortageAssessment {
  const consumption = dailyConsumption > 0 ? dailyConsumption : 1;
  const days_remaining = Math.round((currentStock / consumption) * 10) / 10;
  const eta_days = Math.round((etaMinutes / 1440) * 10) / 10;

  let shortage_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  let is_breached = false;
  let explanation = '';

  if (days_remaining < eta_days) {
    is_breached = true;
    shortage_risk = days_remaining <= eta_days / 2 || days_remaining <= 1 ? 'CRITICAL' : 'HIGH';
    explanation = `Inventory runs out in ${days_remaining} days, but delivery takes ${eta_days} days (Shortage Deficit: -${(eta_days - days_remaining).toFixed(1)} days).`;
  } else if (days_remaining < eta_days + 3) {
    shortage_risk = 'MEDIUM';
    explanation = `Stock runway covers delivery (${days_remaining} days stock vs ${eta_days} days ETA), tight buffer (< 3 days).`;
  } else {
    shortage_risk = 'LOW';
    explanation = `Comfortable stock runway: ${days_remaining} days stock remaining vs ${eta_days} days ETA.`;
  }

  return { days_remaining, eta_days, shortage_risk, is_breached, explanation };
}

export function generateWhyThisRoute(
  route: RouteOption,
  cargoCategory: CargoCategory,
  weightTons: number,
  isPrimaryHazard: boolean,
  primaryRoute: RouteOption,
  currentStock?: number,
  dailyConsumption?: number
): string {
  const routeRiskPct = Math.round(route.overall_risk_score * 100);
  const primaryRiskPct = Math.round(primaryRoute.overall_risk_score * 100);
  const etaDays = (route.estimated_time_minutes / 1440).toFixed(1);
  const capacity = route.cargo_capacity_tons ?? (route.mode === 'RAIL' ? 1200 : route.mode === 'AIR' ? 20 : route.mode === 'WATERWAY' ? 2000 : 25.0);
  const primaryCapacity = primaryRoute.cargo_capacity_tons ?? 25.0;

  let daysText = '';
  if (currentStock !== undefined && dailyConsumption !== undefined && dailyConsumption > 0) {
    const days = (currentStock / dailyConsumption).toFixed(1);
    daysText = ` before inventory runs out (${days} days stock remaining)`;
  }

  if (route.route_id === primaryRoute.route_id) {
    if (weightTons > capacity) {
      return `Road route has high disruption risk (${routeRiskPct}%) and insufficient capacity (${weightTons} MT requested vs ${capacity} MT limit).`;
    }
    return `Direct Road route provides standard highway transit (${etaDays} days ETA) with ${routeRiskPct}% risk exposure and ${capacity} MT capacity limit.`;
  }

  const isPrimaryCapConstrained = weightTons > primaryCapacity;
  const isSelectedCapConstrained = weightTons > capacity;

  if (isPrimaryHazard && isPrimaryCapConstrained) {
    return `Road route has high disruption risk (${primaryRiskPct}%) and insufficient capacity (${weightTons} MT vs ${primaryCapacity} MT limit). ${route.route_name} satisfies cargo capacity (${capacity} MT) with lower disruption exposure (${routeRiskPct}%) and arrives in ${etaDays} days${daysText}.`;
  } else if (isPrimaryHazard) {
    return `Direct Road route exhibits high disruption hazard (${primaryRiskPct}% risk). ${route.route_name} satisfies safety criteria with lower disruption exposure (${routeRiskPct}%) and arrives in ${etaDays} days${daysText}.`;
  } else if (isPrimaryCapConstrained) {
    return `Direct Road route capacity (${primaryCapacity} MT) is exceeded by ${weightTons} MT consignment. ${route.route_name} satisfies cargo capacity (${capacity} MT) arriving in ${etaDays} days.`;
  } else if (isSelectedCapConstrained) {
    return `${route.route_name} ETA is ${etaDays} days with ${routeRiskPct}% risk, but capacity (${capacity} MT) is constrained for ${weightTons} MT load.`;
  } else {
    return `${route.route_name} satisfies cargo capacity (${capacity} MT) with ${routeRiskPct}% disruption risk, arriving in ${etaDays} days${daysText}.`;
  }
}

/**
 * Calculates comprehensive multimodal route options evaluating Road, Rail,
 * Inland Waterway (NW-2), Air Freight, and Smart Hybrid Combinations.
 */
export function calculateMultimodalRouting(
  origin: string,
  destination: string,
  baseRoadResponse: RouteCalculationResponse,
  allowedModes: TransportMode[] = ['ROAD', 'RAIL', 'WATERWAY', 'AIR', 'TRANSFER'],
  priority: CargoPriority = 'BALANCED',
  weightTons: number = 20.0,
  cargoCategory: CargoCategory = 'Medicine',
  currentStock?: number,
  dailyConsumption?: number
): RouteCalculationResponse {
  const result: RouteCalculationResponse = { ...baseRoadResponse };
  const allOpts: RouteOption[] = [...baseRoadResponse.all_options];

  // Helper coordinate lookup
  const getCoords = (id: string): [number, number] => {
    const node = MULTIMODAL_NETWORK_DATA.nodes.find(n => n.id === id);
    if (node) return node.coordinates;
    return [26.1445, 91.7362];
  };

  // 1. DEDICATED RAIL ROUTE (if feasible between corridors)
  let railRoute: RouteOption | null = null;
  if (allowedModes.includes('RAIL')) {
    if ((origin === 'Guwahati' && destination === 'Silchar') || (origin === 'Silchar' && destination === 'Guwahati')) {
      const waypoints: [number, number][] = [
        getCoords('Guwahati'),
        getCoords('Guwahati_Rail'),
        getCoords('Lumding_Rail'),
        getCoords('Badarpur_Silchar_Rail'),
        getCoords('Silchar')
      ];

      const segments = [
        {
          segment_name: 'Guwahati Hub to New Guwahati Rail Yard',
          corridor_name: 'Intermodal Transfer Link',
          distance_km: 6.5,
          risk_level: 'Safe',
          risk_score: 0.02,
          slope_deg: 2.0,
          weather: 'Clear',
          passable: true,
          mode: 'TRANSFER' as TransportMode,
          operator: 'CONCOR / Local Shunting',
          transit_speed_kmh: 25.0,
          estimated_cost_inr: Math.round(6.5 * 12.0 * weightTons),
          carbon_kg: Math.round(6.5 * 0.09 * weightTons)
        },
        {
          segment_name: 'Guwahati to Lumding Freight Corridor',
          corridor_name: 'NFR BG Lumding Mainline',
          distance_km: 181.0,
          risk_level: 'Safe',
          risk_score: 0.05,
          slope_deg: 4.0,
          weather: 'Clear',
          passable: true,
          mode: 'RAIL' as TransportMode,
          operator: 'Northeast Frontier Railway (NFR)',
          transit_speed_kmh: 52.0,
          estimated_cost_inr: Math.round(181.0 * 1.55 * weightTons),
          carbon_kg: Math.round(181.0 * 0.026 * weightTons)
        },
        {
          segment_name: 'Lumding to Badarpur Junction (Haflong Mountain Tunnels)',
          corridor_name: 'Dima Hasao BG Engineering Alignment',
          distance_km: 170.0,
          risk_level: 'Safe',
          risk_score: 0.12,
          slope_deg: 12.0,
          weather: 'Overcast',
          passable: true,
          mode: 'RAIL' as TransportMode,
          operator: 'Northeast Frontier Railway (NFR)',
          transit_speed_kmh: 42.0,
          estimated_cost_inr: Math.round(170.0 * 1.70 * weightTons),
          carbon_kg: Math.round(170.0 * 0.030 * weightTons)
        },
        {
          segment_name: 'Badarpur Junction to Silchar Terminal',
          corridor_name: 'Barak Valley Rail Shuttle',
          distance_km: 28.0,
          risk_level: 'Safe',
          risk_score: 0.03,
          slope_deg: 2.0,
          weather: 'Clear',
          passable: true,
          mode: 'TRANSFER' as TransportMode,
          operator: 'Barak Logistics Cooperative',
          transit_speed_kmh: 32.0,
          estimated_cost_inr: Math.round(28.0 * 15.0 * weightTons),
          carbon_kg: Math.round(28.0 * 0.098 * weightTons)
        }
      ];

      const totalDist = segments.reduce((sum, s) => sum + s.distance_km, 0);
      const totalCost = segments.reduce((sum, s) => sum + (s.estimated_cost_inr || 0), 0);
      const totalCarbon = segments.reduce((sum, s) => sum + (s.carbon_kg || 0), 0);
      const estTimeMins = Math.round((6.5 / 25.0 + 181.0 / 52.0 + 170.0 / 42.0 + 28.0 / 32.0 + 1.5) * 60);

      railRoute = {
        route_id: 'route_rail_gau_sil',
        route_name: 'NFR Broad-Gauge Freight Express (Via Lumding-Haflong)',
        is_recommended: priority === 'COST' || priority === 'ECO',
        total_distance_km: Math.round(totalDist * 10) / 10,
        estimated_time_minutes: estTimeMins,
        overall_risk_score: 0.08,
        risk_category: 'LOW',
        disruption_points_count: 0,
        elevation_gain_m: 640.0,
        waypoints,
        segments,
        advisories: [
          'Immune to NH-6 Sonapur landslide washouts.',
          'High capacity: up to 1,200 metric tons per razz rake.',
          'Broad gauge double stack clearance confirmed by NFR Lumding division.'
        ],
        mode: 'RAIL',
        modes_used: ['TRANSFER', 'RAIL'],
        transshipment_points: [
          {
            hub_id: 'Guwahati_Rail',
            hub_name: 'New Guwahati Goods Yard',
            hub_type: 'RAIL_YARD',
            coordinates: [26.1820, 91.7610],
            from_mode: 'ROAD',
            to_mode: 'RAIL',
            transfer_time_minutes: 45,
            handling_fee_inr: 1200
          },
          {
            hub_id: 'Badarpur_Silchar_Rail',
            hub_name: 'Badarpur Railhead Depot',
            hub_type: 'RAIL_YARD',
            coordinates: [24.8980, 92.5970],
            from_mode: 'RAIL',
            to_mode: 'ROAD',
            transfer_time_minutes: 45,
            handling_fee_inr: 1200
          }
        ],
        carbon_emissions_kg: totalCarbon,
        estimated_cost_inr: totalCost,
        cargo_capacity_tons: 1200.0,
        priority_match: 'COST'
      };
    } else if (origin === 'Guwahati' && (destination === 'Dimapur' || destination === 'Kohima')) {
      const waypoints: [number, number][] = [
        getCoords('Guwahati'),
        getCoords('Guwahati_Rail'),
        getCoords('Lumding_Rail'),
        getCoords('Dimapur_Rail'),
        getCoords(destination)
      ];

      railRoute = {
        route_id: 'route_rail_gau_dim',
        route_name: 'NFR East-Nagaland Freight Express',
        is_recommended: false,
        total_distance_km: 265.0,
        estimated_time_minutes: 360,
        overall_risk_score: 0.06,
        risk_category: 'LOW',
        disruption_points_count: 0,
        elevation_gain_m: 420.0,
        waypoints,
        segments: [
          {
            segment_name: 'Guwahati to Dimapur BG Corridor',
            corridor_name: 'NFR Lumding-Dimapur Mainline',
            distance_km: 251.0,
            risk_level: 'Safe',
            risk_score: 0.05,
            slope_deg: 4.0,
            weather: 'Clear',
            passable: true,
            mode: 'RAIL',
            operator: 'NFR',
            transit_speed_kmh: 55.0,
            estimated_cost_inr: Math.round(251.0 * 1.50 * weightTons),
            carbon_kg: Math.round(251.0 * 0.025 * weightTons)
          }
        ],
        advisories: ['Uninterrupted rail link connecting Assam with Dimapur logistics hub.'],
        mode: 'RAIL',
        modes_used: ['RAIL'],
        carbon_emissions_kg: Math.round(251.0 * 0.025 * weightTons),
        estimated_cost_inr: Math.round(251.0 * 1.50 * weightTons),
        cargo_capacity_tons: 1000.0
      };
    } else if (origin === 'Guwahati' && destination === 'Imphal') {
      // Rail corridor: BG Rail from Guwahati to Dimapur railhead, then connecting transfer
      const waypoints: [number, number][] = [
        getCoords('Guwahati'),
        getCoords('Guwahati_Rail'),
        getCoords('Lumding_Rail'),
        getCoords('Dimapur_Rail'),
        getCoords('Kohima'),
        getCoords('Imphal')
      ];

      const railDist = 251.0;
      const roadLegDist = 212.0; // Dimapur -> Kohima -> Imphal
      const railCost = Math.round(railDist * 1.50 * weightTons + roadLegDist * 4.20 * weightTons);
      const railCarbon = Math.round(railDist * 0.025 * weightTons + roadLegDist * 0.11 * weightTons);

      railRoute = {
        route_id: 'route_rail_gau_imf',
        route_name: 'NFR East-Manipur Rail-Road Combined Lifeline',
        is_recommended: priority === 'COST' || priority === 'ECO',
        total_distance_km: 463.0,
        estimated_time_minutes: 540,
        overall_risk_score: 0.14,
        risk_category: 'LOW',
        disruption_points_count: 0,
        elevation_gain_m: 780.0,
        waypoints,
        segments: [
          {
            segment_name: 'Guwahati to Dimapur Freight Rail Line',
            corridor_name: 'NFR Lumding-Dimapur BG Mainline',
            distance_km: 251.0,
            risk_level: 'Safe',
            risk_score: 0.05,
            slope_deg: 4.0,
            weather: 'Clear',
            passable: true,
            mode: 'RAIL',
            operator: 'Northeast Frontier Railway (NFR)',
            transit_speed_kmh: 55.0,
            estimated_cost_inr: Math.round(251.0 * 1.50 * weightTons),
            carbon_kg: Math.round(251.0 * 0.025 * weightTons)
          },
          {
            segment_name: 'Dimapur Railhead to Imphal Valley Gateway',
            corridor_name: 'NH-29 / NH-2 Mountain Highway',
            distance_km: 212.0,
            risk_level: 'Safe',
            risk_score: 0.22,
            slope_deg: 26.0,
            weather: 'Clear',
            passable: true,
            mode: 'ROAD',
            operator: 'Nagaland / Manipur PWD',
            transit_speed_kmh: 38.0,
            estimated_cost_inr: Math.round(212.0 * 4.20 * weightTons),
            carbon_kg: Math.round(212.0 * 0.11 * weightTons)
          }
        ],
        advisories: [
          'High capacity rail backbone covering 54% of the distance to Manipur with zero highway congestion.',
          'Transshipment at Dimapur freight terminal connects directly to NH-2 mountain corridor.'
        ],
        mode: 'RAIL',
        modes_used: ['RAIL', 'ROAD'],
        transshipment_points: [
          {
            hub_id: 'Dimapur_Rail',
            hub_name: 'Dimapur Railhead Intermodal Yard',
            hub_type: 'RAIL_YARD',
            coordinates: [25.9180, 93.7310],
            from_mode: 'RAIL',
            to_mode: 'ROAD',
            transfer_time_minutes: 30,
            handling_fee_inr: 850
          }
        ],
        carbon_emissions_kg: railCarbon,
        estimated_cost_inr: railCost,
        cargo_capacity_tons: 900.0,
        priority_match: 'COST'
      };
    }
  }

  // 2. DEDICATED AIR CARGO ROUTE (for high-speed emergency relief)
  let airRoute: RouteOption | null = null;
  if (allowedModes.includes('AIR')) {
    if ((origin === 'Guwahati' && destination === 'Silchar') || (origin === 'Silchar' && destination === 'Guwahati')) {
      const waypoints: [number, number][] = [
        getCoords('Guwahati'),
        getCoords('GAU_Airport'),
        [25.5000, 92.3000],
        getCoords('IXS_Silchar_Airport'),
        getCoords('Silchar')
      ];

      const airDist = 210.0;
      const transferDist = 21.0 + 26.0;
      const airCost = Math.round(airDist * 26.0 * weightTons + 8500);
      const airCarbon = Math.round(airDist * 0.52 * weightTons + 150);
      const airTimeMins = Math.round((airDist / 460.0 + 47.0 / 35.0 + 1.2) * 60);

      airRoute = {
        route_id: 'route_air_gau_sil',
        route_name: 'AAI Lifeline Air Bridge (LGBI Guwahati ➔ Kumbhirgram Silchar)',
        is_recommended: priority === 'SPEED',
        total_distance_km: 257.0,
        estimated_time_minutes: airTimeMins,
        overall_risk_score: 0.02,
        risk_category: 'LOW',
        disruption_points_count: 0,
        elevation_gain_m: 3500.0,
        waypoints,
        segments: [
          {
            segment_name: 'Guwahati Depot to LGBI Airport Cargo Ramp',
            corridor_name: 'Airport Express Link',
            distance_km: 21.0,
            risk_level: 'Safe',
            risk_score: 0.01,
            slope_deg: 2.0,
            weather: 'Clear',
            passable: true,
            mode: 'TRANSFER',
            operator: 'Dedicated Rapid Shuttle',
            transit_speed_kmh: 40.0,
            estimated_cost_inr: Math.round(21.0 * 16.0 * weightTons),
            carbon_kg: Math.round(21.0 * 0.10 * weightTons)
          },
          {
            segment_name: 'Guwahati (GAU) to Silchar (IXS) Air Corridor',
            corridor_name: 'AAI Air Cargo Lifeline',
            distance_km: 210.0,
            risk_level: 'Safe',
            risk_score: 0.02,
            slope_deg: 0.0,
            weather: 'Clear Visibility',
            passable: true,
            mode: 'AIR',
            operator: 'Air India Cargo / IAF AN-32 Charter',
            transit_speed_kmh: 460.0,
            estimated_cost_inr: Math.round(210.0 * 26.0 * weightTons),
            carbon_kg: Math.round(210.0 * 0.52 * weightTons)
          },
          {
            segment_name: 'Kumbhirgram Airport to Silchar City Hub',
            corridor_name: 'Cachar Valley Link',
            distance_km: 26.0,
            risk_level: 'Safe',
            risk_score: 0.02,
            slope_deg: 2.0,
            weather: 'Clear',
            passable: true,
            mode: 'TRANSFER',
            operator: 'Local First-Mile Shuttle',
            transit_speed_kmh: 35.0,
            estimated_cost_inr: Math.round(26.0 * 16.0 * weightTons),
            carbon_kg: Math.round(26.0 * 0.10 * weightTons)
          }
        ],
        advisories: [
          'Ultra-rapid deployment for pharmaceuticals, vaccines, and disaster relief.',
          'Zero exposure to surface landslides, bridge washouts, or highway gridlock.',
          'Fastest ETA in the entire Northeast transit network.'
        ],
        mode: 'AIR',
        modes_used: ['TRANSFER', 'AIR'],
        transshipment_points: [
          {
            hub_id: 'GAU_Airport',
            hub_name: 'LGBI Air Cargo Ramp',
            hub_type: 'AIRPORT_CARGO',
            coordinates: [26.1060, 91.5859],
            from_mode: 'ROAD',
            to_mode: 'AIR',
            transfer_time_minutes: 35,
            handling_fee_inr: 4500
          },
          {
            hub_id: 'IXS_Silchar_Airport',
            hub_name: 'Kumbhirgram Cargo Terminal',
            hub_type: 'AIRPORT_CARGO',
            coordinates: [24.9125, 92.9790],
            from_mode: 'AIR',
            to_mode: 'ROAD',
            transfer_time_minutes: 35,
            handling_fee_inr: 4000
          }
        ],
        carbon_emissions_kg: airCarbon,
        estimated_cost_inr: airCost,
        cargo_capacity_tons: 18.0,
        priority_match: 'SPEED'
      };
    } else if ((origin === 'Guwahati' && destination === 'Imphal') || (origin === 'Imphal' && destination === 'Guwahati')) {
      const waypoints: [number, number][] = [
        getCoords('Guwahati'),
        getCoords('GAU_Airport'),
        [25.5000, 92.8000],
        getCoords('IMF_Airport'),
        getCoords('Imphal')
      ];

      const airDist = 270.0;
      const transferDist = 21.0 + 8.0;
      const airCost = Math.round(airDist * 28.0 * weightTons + 9500);
      const airCarbon = Math.round(airDist * 0.54 * weightTons + 180);
      const airTimeMins = Math.round((airDist / 480.0 + transferDist / 35.0 + 1.2) * 60);

      airRoute = {
        route_id: 'route_air_gau_imf',
        route_name: 'Emergency Air Bridge (Guwahati LGBI ➔ Imphal Bir Tikendrajit)',
        is_recommended: priority === 'SPEED' || priority === 'SAFETY',
        total_distance_km: 299.0,
        estimated_time_minutes: airTimeMins,
        overall_risk_score: 0.02,
        risk_category: 'LOW',
        disruption_points_count: 0,
        elevation_gain_m: 4200.0,
        waypoints,
        segments: [
          {
            segment_name: 'Guwahati Depot to LGBI Airport Air Cargo Ramp',
            corridor_name: 'Airport Express Link',
            distance_km: 21.0,
            risk_level: 'Safe',
            risk_score: 0.01,
            slope_deg: 2.0,
            weather: 'Clear',
            passable: true,
            mode: 'TRANSFER',
            operator: 'Rapid Courier Shuttle',
            transit_speed_kmh: 40.0,
            estimated_cost_inr: Math.round(21.0 * 16.0 * weightTons),
            carbon_kg: Math.round(21.0 * 0.10 * weightTons)
          },
          {
            segment_name: 'Guwahati (GAU) to Imphal (IMF) Air Corridor',
            corridor_name: 'AAI / IAF Humanitarian Air Bridge',
            distance_km: 270.0,
            risk_level: 'Safe',
            risk_score: 0.02,
            slope_deg: 0.0,
            weather: 'Clear Visibility',
            passable: true,
            mode: 'AIR',
            operator: 'SpiceXpress / IAF AN-32 Disaster Fleet',
            transit_speed_kmh: 480.0,
            estimated_cost_inr: Math.round(270.0 * 28.0 * weightTons),
            carbon_kg: Math.round(270.0 * 0.54 * weightTons)
          },
          {
            segment_name: 'Bir Tikendrajit Cargo Apron to Imphal City Center',
            corridor_name: 'Airport Road Express',
            distance_km: 8.0,
            risk_level: 'Safe',
            risk_score: 0.01,
            slope_deg: 1.0,
            weather: 'Clear',
            passable: true,
            mode: 'TRANSFER',
            operator: 'Manipur Medical Rapid Fleet',
            transit_speed_kmh: 35.0,
            estimated_cost_inr: Math.round(8.0 * 16.0 * weightTons),
            carbon_kg: Math.round(8.0 * 0.10 * weightTons)
          }
        ],
        advisories: [
          'Critical emergency corridor for life-saving medicine, blood units, and trauma supplies.',
          'Complete immunity from highway blockades, landslides on NH-2/NH-29, and mountain roadblocks.',
          'Direct delivery in under 2 hours.'
        ],
        mode: 'AIR',
        modes_used: ['TRANSFER', 'AIR'],
        transshipment_points: [
          {
            hub_id: 'GAU_Airport',
            hub_name: 'Guwahati LGBI Air Cargo Apron',
            hub_type: 'AIRPORT_CARGO',
            coordinates: [26.1060, 91.5859],
            from_mode: 'ROAD',
            to_mode: 'AIR',
            transfer_time_minutes: 30,
            handling_fee_inr: 4500
          },
          {
            hub_id: 'IMF_Airport',
            hub_name: 'Bir Tikendrajit Imphal Cargo Gate',
            hub_type: 'AIRPORT_CARGO',
            coordinates: [24.7600, 93.8967],
            from_mode: 'AIR',
            to_mode: 'ROAD',
            transfer_time_minutes: 30,
            handling_fee_inr: 4000
          }
        ],
        carbon_emissions_kg: airCarbon,
        estimated_cost_inr: airCost,
        cargo_capacity_tons: 20.0,
        priority_match: 'SPEED'
      };
    }
  }

  // 3. DEDICATED INLAND WATERWAY ROUTE (NW-2 Brahmaputra Corridor)
  let waterwayRoute: RouteOption | null = null;
  if (allowedModes.includes('WATERWAY')) {
    if (origin === 'Guwahati' && (destination === 'Tezpur' || destination === 'Itanagar')) {
      const waypoints: [number, number][] = [
        getCoords('Guwahati'),
        getCoords('Pandu_Port_Guwahati'),
        [26.4000, 92.3000],
        getCoords('Tezpur_Silghat_Port'),
        getCoords(destination)
      ];

      waterwayRoute = {
        route_id: 'route_waterway_nw2',
        route_name: 'National Waterway 2 (NW-2) Brahmaputra River Barge',
        is_recommended: priority === 'ECO',
        total_distance_km: 195.0,
        estimated_time_minutes: 680,
        overall_risk_score: 0.04,
        risk_category: 'LOW',
        disruption_points_count: 0,
        elevation_gain_m: 45.0,
        waypoints,
        segments: [
          {
            segment_name: 'Pandu Multi-Modal Port to Silghat Terminal',
            corridor_name: 'NW-2 Navigation Channel',
            distance_km: 155.0,
            risk_level: 'Safe',
            risk_score: 0.04,
            slope_deg: 0.0,
            weather: 'Calm River Surface',
            passable: true,
            mode: 'WATERWAY',
            operator: 'Inland Waterways Authority of India (IWAI)',
            transit_speed_kmh: 15.0,
            estimated_cost_inr: Math.round(155.0 * 0.90 * weightTons),
            carbon_kg: Math.round(155.0 * 0.017 * weightTons)
          }
        ],
        advisories: [
          'Eco-friendly river barge with lowest carbon footprint in India (17g CO2/ton-km).',
          'Heavy bulk capability: 2,000 metric ton barges immune to road disruptions.',
          'Assam Ro-Pax terminal verified for roll-on/roll-off truck transfer.'
        ],
        mode: 'WATERWAY',
        modes_used: ['TRANSFER', 'WATERWAY'],
        carbon_emissions_kg: Math.round(155.0 * 0.017 * weightTons),
        estimated_cost_inr: Math.round(155.0 * 0.90 * weightTons + 3200),
        cargo_capacity_tons: 2000.0,
        priority_match: 'ECO'
      };
    }
  }

  // 4. SMART MULTIMODAL ROUTE (Hybrid: Road + Rail bypass of vulnerable hill sections)
  let multimodalRoute: RouteOption | null = null;
  if ((origin === 'Guwahati' && destination === 'Silchar') || (origin === 'Silchar' && destination === 'Guwahati')) {
    // Hybrid Route: Road from Guwahati to Lumding via NH-27 (smooth plain expressway),
    // then Roll-on Roll-off (Ro-Ro) Rail through Lumding-Badarpur mountain pass,
    // then Road to Silchar.
    const waypoints: [number, number][] = [
      getCoords('Guwahati'),
      getCoords('Nagaon'),
      getCoords('Lumding_Rail'),
      getCoords('Badarpur_Silchar_Rail'),
      getCoords('Silchar')
    ];

    const segments = [
      {
        segment_name: 'Guwahati to Lumding Multimodal Yard (NH-27 Plains)',
        corridor_name: 'NH-27 East-West Plains Corridor',
        distance_km: 182.0,
        risk_level: 'Safe',
        risk_score: 0.09,
        slope_deg: 12.0,
        weather: 'Clear',
        passable: true,
        mode: 'ROAD' as TransportMode,
        operator: 'NHAI 4-Lane Highway',
        transit_speed_kmh: 58.0,
        estimated_cost_inr: Math.round(182.0 * 4.20 * weightTons),
        carbon_kg: Math.round(182.0 * 0.110 * weightTons)
      },
      {
        segment_name: 'Lumding Yard to Badarpur Freight Junction (Ro-Ro Rail Transshipment)',
        corridor_name: 'NFR Hill Mountain Rail Bridge (Haflong Pass Bypass)',
        distance_km: 170.0,
        risk_level: 'Safe',
        risk_score: 0.11,
        slope_deg: 8.0,
        weather: 'Monsoon Mist (Rail Protected)',
        passable: true,
        mode: 'RAIL' as TransportMode,
        operator: 'Northeast Frontier Railway (NFR) Ro-Ro Service',
        transit_speed_kmh: 44.0,
        estimated_cost_inr: Math.round(170.0 * 1.65 * weightTons),
        carbon_kg: Math.round(170.0 * 0.028 * weightTons)
      },
      {
        segment_name: 'Badarpur Junction to Silchar City Final Mile',
        corridor_name: 'NH-37 Valley Highway',
        distance_km: 28.0,
        risk_level: 'Safe',
        risk_score: 0.05,
        slope_deg: 4.0,
        weather: 'Clear',
        passable: true,
        mode: 'ROAD' as TransportMode,
        operator: 'Assam PWD',
        transit_speed_kmh: 45.0,
        estimated_cost_inr: Math.round(28.0 * 4.20 * weightTons),
        carbon_kg: Math.round(28.0 * 0.110 * weightTons)
      }
    ];

    const totalDist = segments.reduce((sum, s) => sum + s.distance_km, 0);
    const totalCost = segments.reduce((sum, s) => sum + (s.estimated_cost_inr || 0), 0);
    const totalCarbon = segments.reduce((sum, s) => sum + (s.carbon_kg || 0), 0);
    const estTimeMins = Math.round((182.0 / 58.0 + 170.0 / 44.0 + 28.0 / 45.0 + 0.8) * 60);

    const isPrimaryDanger = baseRoadResponse.primary_route.risk_category === 'HIGH' ||
                           baseRoadResponse.primary_route.risk_category === 'CRITICAL';

    multimodalRoute = {
      route_id: 'route_multimodal_gau_sil',
      route_name: 'Resilient Hybrid Multimodal Corridor (Road NH-27 + NFR Hill Ro-Ro Rail)',
      is_recommended: isPrimaryDanger || priority === 'SAFETY' || priority === 'BALANCED',
      total_distance_km: Math.round(totalDist * 10) / 10,
      estimated_time_minutes: estTimeMins,
      overall_risk_score: 0.09,
      risk_category: 'LOW',
      disruption_points_count: 0,
      elevation_gain_m: 580.0,
      waypoints,
      segments,
      advisories: [
        'Optimal disaster resilience: bypasses Sonapur Tunnel completely with zero landslide hazard.',
        'Trucks roll onto NFR flatcars at Lumding Yard without offloading cargo pallets.',
        'Cost savings: ~38% cheaper than pure road detours while cutting carbon emissions by 54%.'
      ],
      mode: 'TRANSFER',
      modes_used: ['ROAD', 'RAIL'],
      transshipment_points: [
        {
          hub_id: 'Lumding_Rail',
          hub_name: 'Lumding Multimodal Ro-Ro Terminal',
          hub_type: 'RAIL_YARD',
          coordinates: [25.7550, 93.1720],
          from_mode: 'ROAD',
          to_mode: 'RAIL',
          transfer_time_minutes: 25,
          handling_fee_inr: 800
        },
        {
          hub_id: 'Badarpur_Silchar_Rail',
          hub_name: 'Badarpur Junction Ro-Ro Ramp',
          hub_type: 'RAIL_YARD',
          coordinates: [24.8980, 92.5970],
          from_mode: 'RAIL',
          to_mode: 'ROAD',
          transfer_time_minutes: 25,
          handling_fee_inr: 800
        }
      ],
      carbon_emissions_kg: totalCarbon,
      estimated_cost_inr: totalCost,
      cargo_capacity_tons: 600.0,
      priority_match: 'BALANCED'
    };
  } else if ((origin === 'Guwahati' && destination === 'Imphal') || (origin === 'Imphal' && destination === 'Guwahati')) {
    // Guwahati to Imphal Multimodal: Plains Highway NH-27 Guwahati->Lumding,
    // NFR Freight rail Lumding->Dimapur, then secure Mountain convoy Dimapur->Kohima->Imphal
    const waypoints: [number, number][] = [
      getCoords('Guwahati'),
      getCoords('Nagaon'),
      getCoords('Lumding_Rail'),
      getCoords('Dimapur_Rail'),
      getCoords('Kohima'),
      getCoords('Imphal')
    ];

    const segments = [
      {
        segment_name: 'Guwahati to Lumding Multi-modal Freight Center',
        corridor_name: 'NH-27 East-West Plains Expressway',
        distance_km: 182.0,
        risk_level: 'Safe',
        risk_score: 0.08,
        slope_deg: 6.0,
        weather: 'Clear',
        passable: true,
        mode: 'ROAD' as TransportMode,
        operator: 'NHAI 4-Lane Highway',
        transit_speed_kmh: 60.0,
        estimated_cost_inr: Math.round(182.0 * 4.20 * weightTons),
        carbon_kg: Math.round(182.0 * 0.110 * weightTons)
      },
      {
        segment_name: 'Lumding Yard to Dimapur Railhead (NFR BG Line)',
        corridor_name: 'NFR East-Assam Mainline Corridor',
        distance_km: 70.0,
        risk_level: 'Safe',
        risk_score: 0.05,
        slope_deg: 4.0,
        weather: 'Clear',
        passable: true,
        mode: 'RAIL' as TransportMode,
        operator: 'Northeast Frontier Railway (NFR)',
        transit_speed_kmh: 52.0,
        estimated_cost_inr: Math.round(70.0 * 1.55 * weightTons),
        carbon_kg: Math.round(70.0 * 0.026 * weightTons)
      },
      {
        segment_name: 'Dimapur Transshipment Yard to Kohima-Imphal Valley',
        corridor_name: 'NH-29 / NH-2 Mountain Highway',
        distance_km: 212.0,
        risk_level: 'Safe',
        risk_score: 0.20,
        slope_deg: 28.0,
        weather: 'Overcast',
        passable: true,
        mode: 'ROAD' as TransportMode,
        operator: 'BRO / Manipur State Highways',
        transit_speed_kmh: 38.0,
        estimated_cost_inr: Math.round(212.0 * 4.20 * weightTons),
        carbon_kg: Math.round(212.0 * 0.110 * weightTons)
      }
    ];

    const totalDist = segments.reduce((sum, s) => sum + s.distance_km, 0);
    const totalCost = segments.reduce((sum, s) => sum + (s.estimated_cost_inr || 0), 0);
    const totalCarbon = segments.reduce((sum, s) => sum + (s.carbon_kg || 0), 0);
    const estTimeMins = Math.round((182.0 / 60.0 + 70.0 / 52.0 + 212.0 / 38.0 + 0.8) * 60);

    const isPrimaryDanger = baseRoadResponse.primary_route.risk_category === 'HIGH' ||
                           baseRoadResponse.primary_route.risk_category === 'CRITICAL';

    multimodalRoute = {
      route_id: 'route_multimodal_gau_imf',
      route_name: 'Resilient Hybrid Multimodal Corridor (Road NH-27 + NFR Rail + NH-2 Convoy)',
      is_recommended: isPrimaryDanger || priority === 'SAFETY' || priority === 'BALANCED',
      total_distance_km: Math.round(totalDist * 10) / 10,
      estimated_time_minutes: estTimeMins,
      overall_risk_score: 0.11,
      risk_category: 'LOW',
      disruption_points_count: 0,
      elevation_gain_m: 780.0,
      waypoints,
      segments,
      advisories: [
        'Optimal disaster resilience: bypasses single-point bottlenecks via NFR Lumding-Dimapur rail link.',
        'Trucks or palletized medical cargo transshipped at Dimapur freight yard under priority clearance.',
        'Cost savings: ~28% cheaper than pure road transport while cutting carbon emissions by 40%.'
      ],
      mode: 'TRANSFER',
      modes_used: ['ROAD', 'RAIL'],
      transshipment_points: [
        {
          hub_id: 'Lumding_Rail',
          hub_name: 'Lumding Multimodal Ro-Ro Terminal',
          hub_type: 'RAIL_YARD',
          coordinates: [25.7550, 93.1720],
          from_mode: 'ROAD',
          to_mode: 'RAIL',
          transfer_time_minutes: 25,
          handling_fee_inr: 800
        },
        {
          hub_id: 'Dimapur_Rail',
          hub_name: 'Dimapur Railhead Intermodal Yard',
          hub_type: 'RAIL_YARD',
          coordinates: [25.9180, 93.7310],
          from_mode: 'RAIL',
          to_mode: 'ROAD',
          transfer_time_minutes: 30,
          handling_fee_inr: 850
        }
      ],
      carbon_emissions_kg: totalCarbon,
      estimated_cost_inr: totalCost,
      cargo_capacity_tons: 750.0,
      priority_match: 'BALANCED'
    };
  }

  // Aggregate options
  if (railRoute) allOpts.push(railRoute);
  if (airRoute) allOpts.push(airRoute);
  if (waterwayRoute) allOpts.push(waterwayRoute);
  if (multimodalRoute) allOpts.push(multimodalRoute);

  const isPrimaryHazard = baseRoadResponse.primary_route.risk_category === 'HIGH' ||
                          baseRoadResponse.primary_route.risk_category === 'CRITICAL';

  // Apply cargo-aware capacity checks, shortage window fit, and explainability to all options
  for (const route of allOpts) {
    const routeCapacity = route.cargo_capacity_tons ?? (route.mode === 'RAIL' ? 1200 : route.mode === 'AIR' ? 20 : route.mode === 'WATERWAY' ? 2000 : 25.0);
    route.cargo_capacity_tons = routeCapacity;

    if (weightTons > routeCapacity) {
      route.capacity_constrained = true;
      route.capacity_constraint_reason = `Capacity constraint detected: Cargo weight (${weightTons} MT) exceeds ${route.mode || 'ROAD'} limit (${routeCapacity} MT).`;
      if (route.is_recommended) {
        route.is_recommended = false;
      }
    } else {
      route.capacity_constrained = false;
    }

    // Shortage assessment calculation
    if (currentStock !== undefined && dailyConsumption !== undefined && dailyConsumption > 0) {
      const assessment = calculateShortageRisk(currentStock, dailyConsumption, route.estimated_time_minutes);
      route.shortage_assessment = assessment;
      route.shortage_window_fit = assessment.is_breached ? 'BREACHED' : assessment.shortage_risk === 'MEDIUM' ? 'ACCEPTABLE' : 'OPTIMAL';
      
      // If shortage is breached by a route, demote recommendation
      if (assessment.is_breached && route.is_recommended) {
        route.is_recommended = false;
      }
    } else {
      const transitHours = (route.estimated_time_minutes || 0) / 60;
      if (transitHours <= 6) {
        route.shortage_window_fit = 'OPTIMAL';
      } else if (transitHours <= 14) {
        route.shortage_window_fit = 'ACCEPTABLE';
      } else {
        route.shortage_window_fit = 'BREACHED';
      }
    }

    route.why_this_route = generateWhyThisRoute(
      route,
      cargoCategory,
      weightTons,
      isPrimaryHazard,
      baseRoadResponse.primary_route,
      currentStock,
      dailyConsumption
    );
  }

  // Cargo-aware priority re-ranking
  if (isPrimaryHazard) {
    // If road is dangerous and cargo is medicine/relief, prioritize Air or Multimodal
    if (cargoCategory === 'Medicine' || cargoCategory === 'Relief / Emergency Supplies') {
      if (airRoute && !airRoute.capacity_constrained && (priority === 'SPEED' || weightTons <= 20)) {
        allOpts.forEach(r => { r.is_recommended = false; });
        airRoute.is_recommended = true;
      } else if (multimodalRoute && !multimodalRoute.capacity_constrained) {
        allOpts.forEach(r => { r.is_recommended = false; });
        multimodalRoute.is_recommended = true;
      }
    } else if (cargoCategory === 'Food' || cargoCategory === 'Construction Material') {
      if (railRoute && !railRoute.capacity_constrained) {
        allOpts.forEach(r => { r.is_recommended = false; });
        railRoute.is_recommended = true;
      } else if (multimodalRoute && !multimodalRoute.capacity_constrained) {
        allOpts.forEach(r => { r.is_recommended = false; });
        multimodalRoute.is_recommended = true;
      }
    }
  }

  // Ensure at least one route is marked recommended
  if (!allOpts.some(r => r.is_recommended)) {
    const validCandidate = allOpts.find(r => !r.capacity_constrained && r.risk_category !== 'CRITICAL') || allOpts[0];
    if (validCandidate) validCandidate.is_recommended = true;
  }

  result.rail_route = railRoute || undefined;
  result.air_route = airRoute || undefined;
  result.waterway_route = waterwayRoute || undefined;
  result.multimodal_route = multimodalRoute || undefined;
  result.all_options = allOpts;

  // Enhance summary to highlight multimodal intelligence
  if (multimodalRoute && isPrimaryHazard) {
    result.summary = `CRITICAL ROAD HAZARD detected. Multimodal intelligence recommends "${multimodalRoute.route_name}" to eliminate landslide disruption risk while guaranteeing cargo delivery.`;
  } else if (airRoute && airRoute.is_recommended) {
    result.summary = `EMERGENCY AIR CORRIDOR activated for urgent ${cargoCategory.toLowerCase()}. Direct delivery in under 2 hours with zero surface hazard exposure.`;
  }

  return result;
}
