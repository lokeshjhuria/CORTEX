// Interactive GIS Meteorological Map Engine powered by Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { STATIONS, INDIAN_REGIONS } from './data/stations.js';
import { SUBDIVISION_WARNINGS, WARNING_LEVELS } from './data/warnings.js';
import { CYCLONE_DATA } from './data/advisories.js';

let mapInstance = null;
let activeBaseLayer = null;
let baseLayers = {};
let layerGroups = {
  stations: null,
  radar: null,
  satellite: null,
  lightning: null,
  warnings: null,
  cyclone: null,
  crowdsource: null,
  sos: null,
  selection: null
};

let onStationSelectCallback = null;
let activeSelectedMarker = null;

export function initMap(containerId, onStationSelect) {
  onStationSelectCallback = onStationSelect;

  // Initialize map centered over India
  mapInstance = L.map(containerId, {
    center: [22.5, 80.0],
    zoom: 5,
    minZoom: 4,
    maxZoom: 15,
    zoomControl: false,
    preferCanvas: true
  });

  // Custom Zoom Control top-right
  L.control.zoom({ position: 'topright' }).addTo(mapInstance);

  // Basemap Tile Providers - OpenStreetMap as highly reliable primary standard
  baseLayers.light = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CORTEX Geospatial',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  });

  baseLayers.dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; CARTO & CORTEX Radar GIS',
    subdomains: 'abcd',
    maxZoom: 19
  });

  baseLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '&copy; Esri, Maxar, Earthstar Geographics | CORTEX SATMET',
    maxZoom: 17
  });

  // Set default basemap
  activeBaseLayer = baseLayers.light;
  activeBaseLayer.addTo(mapInstance);

  // Create layer groups
  Object.keys(layerGroups).forEach(k => {
    layerGroups[k] = L.layerGroup().addTo(mapInstance);
  });

  // Populate layers
  buildStationMarkers();
  buildCycloneLayer();
  buildWarningsOverlay();
  buildLightningSim();
  initRadarSimulation();

  // Click on map anywhere to select region and update live weather
  initMapClickHandler();

  // Critical Leaflet geometry recalculation (Fixes gray/blank tiles permanently)
  refreshMapSize();
  setTimeout(refreshMapSize, 100);
  setTimeout(refreshMapSize, 400);
  setTimeout(refreshMapSize, 1000);
  setTimeout(refreshMapSize, 2500);

  window.addEventListener('resize', () => {
    refreshMapSize();
  });

  return mapInstance;
}

/**
 * Force Leaflet to recalculate container dimensions and redraw tiles
 */
export function refreshMapSize() {
  if (mapInstance) {
    mapInstance.invalidateSize(true);
  }
}

/**
 * Handle user clicks anywhere on the map to query region & fetch live weather
 */
function initMapClickHandler() {
  if (!mapInstance) return;

  mapInstance.on('click', async (e) => {
    const lat = Number(e.latlng.lat.toFixed(4));
    const lon = Number(e.latlng.lng.toFixed(4));

    const regionInfo = resolveRegionFromCoords(lat, lon);

    // Drop glowing active marker on clicked spot
    setSelectedRegionMarker(lat, lon, regionInfo.name);

    showMapToast(`📍 Selected: ${regionInfo.name} (${lat}°N, ${lon}°E) - Fetching live data...`);

    if (onStationSelectCallback) {
      await onStationSelectCallback({
        id: `map_${lat}_${lon}`,
        name: regionInfo.name,
        state: regionInfo.state,
        lat: lat,
        lon: lon,
        elevation: regionInfo.elevation || 100,
        hasRadar: false
      });
    }
  });
}

/**
 * Resolves regional state and locality based on coordinates
 */
export function resolveRegionFromCoords(lat, lon) {
  let closestStation = null;
  let minStationDist = Infinity;
  STATIONS.forEach(s => {
    const dist = Math.hypot(s.lat - lat, s.lon - lon);
    if (dist < minStationDist) {
      minStationDist = dist;
      closestStation = s;
    }
  });

  let closestRegion = null;
  let minRegionDist = Infinity;
  INDIAN_REGIONS.forEach(r => {
    const dist = Math.hypot(r.lat - lat, r.lon - lon);
    if (dist < minRegionDist) {
      minRegionDist = dist;
      closestRegion = r;
    }
  });

  if (minStationDist < 0.5 && closestStation) {
    return {
      name: closestStation.name,
      state: closestStation.state,
      elevation: closestStation.elevation
    };
  }

  if (minStationDist < 1.2 && closestStation) {
    return {
      name: `${closestStation.state} (${closestStation.name} Area)`,
      state: closestStation.state,
      elevation: closestStation.elevation
    };
  }

  if (closestRegion && minRegionDist < 4.0) {
    return {
      name: `${closestRegion.state} (${closestRegion.name})`,
      state: closestRegion.state,
      elevation: closestRegion.elevation || 150
    };
  }

  if (lat >= 8.0 && lat <= 36.0 && lon >= 68.0 && lon <= 97.0) {
    return {
      name: `Indian Region (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
      state: "India Subcontinent",
      elevation: 120
    };
  }

  return {
    name: `Maritime / Regional Point (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
    state: "South Asia / Indian Ocean",
    elevation: 0
  };
}

/**
 * Set and animate the selected region marker
 */
export function setSelectedRegionMarker(lat, lon, label) {
  if (!mapInstance) return;
  if (!layerGroups.selection) {
    layerGroups.selection = L.layerGroup().addTo(mapInstance);
  }
  layerGroups.selection.clearLayers();

  const iconHtml = `
    <div class="active-region-pin-container">
      <div class="active-region-pulse-wave"></div>
      <div class="active-region-core-dot">📍</div>
      <div class="active-region-bubble-label">${label}</div>
    </div>
  `;

  const icon = L.divIcon({
    html: iconHtml,
    className: 'active-region-leaflet-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  activeSelectedMarker = L.marker([lat, lon], { icon, zIndexOffset: 5000 });
  layerGroups.selection.addLayer(activeSelectedMarker);
}

/**
 * Display a visual notification toast over the map
 */
export function showMapToast(message) {
  const toast = document.getElementById('map-selection-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}

/**
 * Select a predefined region or state by its identifier
 */
export function selectRegionById(regionId) {
  const region = INDIAN_REGIONS.find(r => r.id === regionId);
  if (!region || !mapInstance) return null;

  setSelectedRegionMarker(region.lat, region.lon, region.name);
  mapInstance.flyTo([region.lat, region.lon], region.zoom || 8, { duration: 1.2 });
  showMapToast(`🗺️ Navigated to: ${region.name}`);

  return region;
}

export function switchBaseMap(type) {
  if (!mapInstance || !baseLayers[type]) return;
  mapInstance.removeLayer(activeBaseLayer);
  activeBaseLayer = baseLayers[type];
  activeBaseLayer.addTo(mapInstance);
  refreshMapSize();
}

export function toggleLayer(layerName, visible) {
  if (!layerGroups[layerName] || !mapInstance) return;
  if (visible) {
    if (!mapInstance.hasLayer(layerGroups[layerName])) {
      mapInstance.addLayer(layerGroups[layerName]);
    }
  } else {
    if (mapInstance.hasLayer(layerGroups[layerName])) {
      mapInstance.removeLayer(layerGroups[layerName]);
    }
  }
}

/**
 * Builds meteorological station markers across India
 */
function buildStationMarkers() {
  layerGroups.stations.clearLayers();

  STATIONS.forEach(station => {
    const radarBadge = station.hasRadar
      ? `<span class="radar-dot" title="${station.radarType}"></span>`
      : '';

    const iconHtml = `
      <div class="cortex-station-marker ${station.hasRadar ? 'has-radar' : ''}">
        <div class="marker-pulse"></div>
        <div class="marker-core">
          <i class="station-icon"></i>
          ${radarBadge}
        </div>
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: 'station-div-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([station.lat, station.lon], { icon });

    marker.bindTooltip(`
      <div class="station-tooltip">
        <strong>${station.name}</strong><br/>
        <small>${station.state} &bull; ${station.category}</small>
        ${station.hasRadar ? `<div class="tooltip-radar">📡 ${station.radarType}</div>` : ''}
        <div style="margin-top: 4px; color: #10b981; font-weight: 600; font-size: 11px;">👉 Click to view weather</div>
      </div>
    `, { direction: 'top', offset: [0, -10] });

    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      setSelectedRegionMarker(station.lat, station.lon, station.name);
      mapInstance.flyTo([station.lat, station.lon], 9, { duration: 1.2 });
      showMapToast(`📍 Selected: ${station.name} (${station.state})`);
      if (onStationSelectCallback) {
        onStationSelectCallback(station);
      }
    });

    layerGroups.stations.addLayer(marker);
  });
}

/**
 * Builds interactive Cyclone BOB-04 track and forecast cone
 */
function buildCycloneLayer() {
  layerGroups.cyclone.clearLayers();

  const points = CYCLONE_DATA.conePoints;
  const latlngs = points.map(p => [p.lat, p.lon]);

  // Track polyline (dashed animated line)
  const trackLine = L.polyline(latlngs, {
    color: '#dc2626',
    weight: 3.5,
    dashArray: '6, 8',
    opacity: 0.9
  });
  layerGroups.cyclone.addLayer(trackLine);

  // Uncertainty cone polygon
  const conePolygon = L.polygon([
    [16.4, 88.2],
    [17.6, 88.0],
    [19.8, 85.8],
    [19.1, 84.3],
    [17.5, 84.5],
    [16.4, 88.2]
  ], {
    color: '#ea580c',
    fillColor: '#fdba74',
    fillOpacity: 0.25,
    weight: 1.5,
    dashArray: '4, 4'
  }).bindTooltip("Estimated Cyclone Cone of Uncertainty (72h)", { sticky: true });
  layerGroups.cyclone.addLayer(conePolygon);

  // Storm Eye Marker
  const stormIcon = L.divIcon({
    html: `<div class="cyclone-eye-marker"><div class="cyclone-spinner">🌀</div></div>`,
    className: 'cyclone-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const stormMarker = L.marker([CYCLONE_DATA.currentLat, CYCLONE_DATA.currentLon], { icon: stormIcon });
  stormMarker.bindPopup(`
    <div class="cyclone-popup">
      <h4 class="text-danger font-bold">⚠️ ${CYCLONE_DATA.name}</h4>
      <p class="text-sm mb-1"><strong>Status:</strong> ${CYCLONE_DATA.status}</p>
      <p class="text-sm mb-1"><strong>Location:</strong> ${CYCLONE_DATA.basin}</p>
      <p class="text-sm mb-1"><strong>Pressure:</strong> ${CYCLONE_DATA.estimatedCentralPressure}</p>
      <p class="text-sm mb-1"><strong>Winds:</strong> ${CYCLONE_DATA.maxSustainedWindSpeed}</p>
      <p class="text-xs text-amber-700 mt-2 font-medium">${CYCLONE_DATA.landfallForecast}</p>
    </div>
  `);
  layerGroups.cyclone.addLayer(stormMarker);

  // Plot forecast waypoint markers
  points.forEach((pt, i) => {
    const circle = L.circleMarker([pt.lat, pt.lon], {
      radius: i === 0 ? 6 : 5,
      color: i === 0 ? '#991b1b' : '#c2410c',
      fillColor: '#ffffff',
      fillOpacity: 1,
      weight: 2
    }).bindTooltip(`<strong>${pt.time}</strong><br/>${pt.intensity}`, { direction: 'right' });
    layerGroups.cyclone.addLayer(circle);
  });
}

/**
 * Builds regional warning hazard highlights with interactive region selection
 */
function buildWarningsOverlay() {
  layerGroups.warnings.clearLayers();

  // Highlight Gujarat Red Alert Area
  const gujaratPolygon = L.circle([22.5, 71.0], {
    radius: 175000,
    color: '#dc2626',
    fillColor: '#ef4444',
    fillOpacity: 0.35,
    weight: 2
  }).bindTooltip(`
    <div class="warning-tooltip red-alert">
      <strong>⚠️ RED ALERT: Gujarat & Saurashtra Coast</strong><br/>
      <small>Extremely Heavy Rainfall (>204mm). Click to view regional weather.</small>
    </div>
  `);

  gujaratPolygon.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    const target = {
      name: "Gujarat & Saurashtra (Red Alert Area)",
      state: "Gujarat",
      lat: 22.5000,
      lon: 71.0000,
      elevation: 45
    };
    setSelectedRegionMarker(target.lat, target.lon, target.name);
    mapInstance.flyTo([target.lat, target.lon], 8, { duration: 1.2 });
    showMapToast(`⚠️ Selected Red Alert Zone: ${target.name}`);
    if (onStationSelectCallback) {
      onStationSelectCallback(target);
    }
  });

  layerGroups.warnings.addLayer(gujaratPolygon);

  // Highlight Konkan-Goa Orange Alert Area
  const konkanPolygon = L.circle([17.5, 73.5], {
    radius: 150000,
    color: '#ea580c',
    fillColor: '#f97316',
    fillOpacity: 0.3,
    weight: 2
  }).bindTooltip(`
    <div class="warning-tooltip orange-alert">
      <strong>⚠️ ORANGE ALERT: Konkan & Goa Coast</strong><br/>
      <small>Heavy to Very Heavy Rain (115-204mm). Click to view regional weather.</small>
    </div>
  `);

  konkanPolygon.on('click', (e) => {
    L.DomEvent.stopPropagation(e);
    const target = {
      name: "Konkan & Goa (Orange Alert Area)",
      state: "Maharashtra / Goa",
      lat: 18.9000,
      lon: 72.8500,
      elevation: 14
    };
    setSelectedRegionMarker(target.lat, target.lon, target.name);
    mapInstance.flyTo([target.lat, target.lon], 8, { duration: 1.2 });
    showMapToast(`⚠️ Selected Orange Alert Zone: ${target.name}`);
    if (onStationSelectCallback) {
      onStationSelectCallback(target);
    }
  });

  layerGroups.warnings.addLayer(konkanPolygon);
}

/**
 * Builds simulated live lightning strike points
 */
function buildLightningSim() {
  layerGroups.lightning.clearLayers();

  const strikeLocations = [
    [23.2, 85.5], [24.1, 86.2], [22.8, 84.9], [25.4, 88.1],
    [21.8, 70.8], [22.4, 71.3], [19.2, 73.1], [18.7, 73.6],
    [26.2, 92.1], [25.9, 91.8], [11.2, 76.5], [10.8, 76.2]
  ];

  strikeLocations.forEach((loc, index) => {
    const flashIcon = L.divIcon({
      html: `<div class="lightning-flash-marker" style="animation-delay: ${(index * 0.4).toFixed(1)}s">⚡</div>`,
      className: 'lightning-div-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    const marker = L.marker(loc, { icon: flashIcon });
    marker.bindTooltip("Live Thunderstorm Discharge Detected", { direction: 'top' });
    layerGroups.lightning.addLayer(marker);
  });
}

/**
 * Doppler Weather Radar (DWR) animated reflectivity simulation
 */
function initRadarSimulation() {
  // Generate multi-cell simulated radar reflectivity circles over active monsoon belts
  const radarCenters = [
    { name: "Veravali Radar (Mumbai)", lat: 19.13, lon: 72.87, baseRadius: 180000, color: "#10b981" },
    { name: "Bhuj DWR", lat: 23.25, lon: 69.80, baseRadius: 220000, color: "#ef4444" },
    { name: "Kolkata DWR", lat: 22.53, lon: 88.33, baseRadius: 160000, color: "#eab308" },
    { name: "Chennai DWR", lat: 13.08, lon: 80.28, baseRadius: 140000, color: "#10b981" }
  ];

  layerGroups.radar.clearLayers();

  radarCenters.forEach(rc => {
    // Draw radar sweep coverage zone
    const rangeCircle = L.circle([rc.lat, rc.lon], {
      radius: rc.baseRadius,
      color: '#10b981',
      weight: 1,
      dashArray: '5, 5',
      fillColor: '#059669',
      fillOpacity: 0.1
    }).bindTooltip(`📡 ${rc.name} (Coverage Range 250km)`);
    layerGroups.radar.addLayer(rangeCircle);

    // Dynamic inner reflectivity echoes
    const echo1 = L.circle([rc.lat + 0.3, rc.lon + 0.2], {
      radius: rc.baseRadius * 0.45,
      color: '#eab308',
      fillColor: '#f59e0b',
      fillOpacity: 0.45,
      weight: 0
    });
    layerGroups.radar.addLayer(echo1);

    const echoCore = L.circle([rc.lat + 0.35, rc.lon + 0.22], {
      radius: rc.baseRadius * 0.22,
      color: '#dc2626',
      fillColor: '#ef4444',
      fillOpacity: 0.65,
      weight: 0
    });
    layerGroups.radar.addLayer(echoCore);
  });
}

/**
 * Fly map to selected coordinates
 */
export function flyToLocation(lat, lon, zoom = 9) {
  if (!mapInstance) return;
  mapInstance.flyTo([lat, lon], zoom, { duration: 1.5 });
}

/**
 * Add a crowdsourced public observation pin to the map
 */
export function addCrowdsourcePin(report) {
  if (!layerGroups.crowdsource) return;

  const icon = L.divIcon({
    html: `<div class="crowdsource-pin"><span class="crowd-emoji">${getWeatherEmoji(report.condition)}</span></div>`,
    className: 'crowdsource-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

  const marker = L.marker([report.lat, report.lon], { icon });
  marker.bindPopup(`
    <div class="crowd-report-popup">
      <span class="badge bg-primary text-white">CITIZEN OBSERVATION</span>
      <h6 class="font-bold mt-1 mb-0">${report.location}</h6>
      <p class="text-sm mb-1"><strong>Reported:</strong> ${report.condition}</p>
      <p class="text-xs text-muted mb-1">${report.notes || "No additional notes."}</p>
      <small class="text-xs text-gray-500">Timestamp: ${new Date(report.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
    </div>
  `).openPopup();

  layerGroups.crowdsource.addLayer(marker);
  mapInstance.flyTo([report.lat, report.lon], 10);
}

function getWeatherEmoji(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("heavy") || c.includes("storm")) return "⛈️";
  if (c.includes("rain") || c.includes("drizzle")) return "🌧️";
  if (c.includes("hail")) return "🧊";
  if (c.includes("fog") || c.includes("mist")) return "🌫️";
  return "🌤️";
}

/**
 * Add an active SOS Emergency Rescue Beacon to the map
 */
export function addSOSRescuePin(sosData) {
  if (!layerGroups.sos || !mapInstance) return;

  const sosIcon = L.divIcon({
    html: `
      <div class="sos-beacon-marker">
        <div class="sos-beacon-pulse"></div>
        <div class="sos-beacon-core">🆘</div>
      </div>
    `,
    className: 'sos-div-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });

  const marker = L.marker([sosData.lat, sosData.lon], { icon: sosIcon, zIndexOffset: 2000 });
  marker.bindPopup(`
    <div class="sos-map-popup">
      <div class="sos-popup-head">
        <span class="badge-critical">🚨 SOS RESCUE BEACON</span>
        <span class="font-mono text-xs">${sosData.id}</span>
      </div>
      <h5 class="font-bold text-red-700 mt-1 mb-1">${sosData.name}</h5>
      <p class="text-xs mb-1"><strong>Emergency:</strong> ${sosData.type}</p>
      <p class="text-xs mb-1"><strong>Trapped:</strong> ${sosData.trappedCount} People</p>
      <p class="text-xs mb-1"><strong>Location:</strong> ${sosData.location}</p>
      <p class="text-xs text-muted mb-2">"${sosData.notes || 'Emergency rescue assistance required.'}"</p>
      <a href="tel:${sosData.phone}" class="btn-sos-call">📞 CALL CALLER: ${sosData.phone}</a>
    </div>
  `).openPopup();

  layerGroups.sos.addLayer(marker);
  mapInstance.flyTo([sosData.lat, sosData.lon], 11, { duration: 1.5 });
}

