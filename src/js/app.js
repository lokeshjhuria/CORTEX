// CORTEX Weather & Climate Intelligence Platform Master Application
import { STATIONS, MAJOR_CITIES_TICKER } from './data/stations.js';
import { SUBDIVISION_WARNINGS, WARNING_LEVELS, BREAKING_MARQUEE_ALERTS } from './data/warnings.js';
import { fetchLiveWeather, fetchLiveAQI, searchLocations } from './api.js';
import { initMap, switchBaseMap, toggleLayer, flyToLocation, addCrowdsourcePin, addSOSRescuePin, selectRegionById, setSelectedRegionMarker, refreshMapSize } from './map.js';
import { renderDailyForecast, renderHourlyChart } from './forecast.js';
import { renderCycloneCenter } from './cyclone.js';
import { renderAgrometAdvisories } from './agromet.js';
import { renderAQICard } from './aqi.js';
import { renderPilgrimageForecast } from './pilgrimage.js';
import { getCrowdsourceReports, saveCrowdsourceReport } from './crowdsource.js';
import { renderSOSModal, saveSOSCall, getActiveSOSCalls, renderActiveSOSCards } from './sos.js';
import { applyLanguage, toggleLanguage, t } from './i18n.js';

let currentStation = STATIONS[0]; // New Delhi Safdarjung
let currentWeatherData = null;
let currentAQIData = null;

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  initLiveClocks();
  initThemePalette();
  initBreakingMarquee();
  initMajorCitiesTicker();
  initSpecializedSections();

  // Initialize Leaflet Map
  initMap('weather-map', async (station) => {
    await selectStation(station);
  });

  // Setup Search Bar
  initSearch();

  // Setup Layer & Map Controls
  initMapControls();

  // Setup Modals & Crowdsource & SOS Rescue
  initCrowdsourceModal();
  initSOSRescue();

  // Setup Accessibility & Preferences
  initAccessibility();

  // Load initial station data (New Delhi)
  await selectStation(currentStation);

  // Plot existing citizen observations and SOS calls
  loadCitizenReportsOnMap();
  loadActiveSOSOnMap();
});

/**
 * Updates IST and UTC Live Clocks every second
 */
function initLiveClocks() {
  const clockIST = document.getElementById('clock-ist');
  const clockUTC = document.getElementById('clock-utc');

  function update() {
    const now = new Date();

    // IST time calculation (UTC+5:30)
    const istOptions = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    if (clockIST) {
      clockIST.textContent = now.toLocaleDateString('en-GB', istOptions);
    }

    // UTC time
    const utcOptions = {
      timeZone: 'UTC',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    if (clockUTC) {
      clockUTC.textContent = `${now.toLocaleTimeString('en-GB', utcOptions)} UTC`;
    }
  }

  update();
  setInterval(update, 1000);
}

/**
 * Initializes breaking alerts scrolling ticker
 */
function initBreakingMarquee() {
  const container = document.getElementById('breaking-alerts-list');
  if (!container) return;

  container.innerHTML = BREAKING_MARQUEE_ALERTS.map(alert => {
    const lvl = WARNING_LEVELS[alert.level];
    return `
      <span class="marquee-alert-item" style="--badge-color: ${lvl.color}; --badge-bg: ${lvl.bgColor}">
        <span class="marquee-tag">${alert.tag}</span>
        <span class="marquee-text">${alert.text}</span>
      </span>
    `;
  }).join('<span class="marquee-divider">&bull;</span>');
}

/**
 * Select a station and fetch its live observations + 7-day forecast
 */
async function selectStation(station) {
  currentStation = station;

  // Update Station Title and Subtitle
  const nameEl = document.getElementById('current-station-name');
  const metaEl = document.getElementById('current-station-meta');
  if (nameEl) {
    nameEl.textContent = station.name;
    nameEl.style.opacity = '0.7';
  }
  if (metaEl) {
    metaEl.textContent = `${station.state} • Lat: ${Number(station.lat).toFixed(2)}°N, Lon: ${Number(station.lon).toFixed(2)}°E • Elev: ${station.elevation || 15}m • ${station.hasRadar ? '📡 DWR Radar Station' : 'Meteorological Observation'}`;
  }

  // Ensure marker is synced on map
  setSelectedRegionMarker(station.lat, station.lon, station.name);

  // Sync region dropdown if matched
  const regionDropdown = document.getElementById('map-region-select');
  if (regionDropdown) {
    if (station.stateCode && regionDropdown.querySelector(`option[value="${station.stateCode}"]`)) {
      regionDropdown.value = station.stateCode;
    } else if (station.id && regionDropdown.querySelector(`option[value="${station.id}"]`)) {
      regionDropdown.value = station.id;
    }
  }

  // Fetch Live Weather & AQI
  try {
    const [weather, aqi] = await Promise.all([
      fetchLiveWeather(station.lat, station.lon),
      fetchLiveAQI(station.lat, station.lon)
    ]);

    currentWeatherData = weather;
    currentAQIData = aqi;

    updateObservationPanel(weather.current);
    renderDailyForecast('seven-day-forecast-cards', weather.daily);
    renderHourlyChart('hourly-trend-chart', weather.hourly);
    renderAQICard('aqi-overview-container', aqi);

    if (nameEl) nameEl.style.opacity = '1';
    refreshMapSize();
  } catch (err) {
    console.error("Error updating station weather:", err);
    if (nameEl) nameEl.style.opacity = '1';
  }
}

/**
 * Updates current weather details on the main observation card
 */
function updateObservationPanel(current) {
  const tempVal = document.getElementById('obs-temperature');
  const condText = document.getElementById('obs-condition');
  const condIcon = document.getElementById('obs-icon');
  const feelsLike = document.getElementById('obs-feels-like');
  const humidity = document.getElementById('obs-humidity');
  const wind = document.getElementById('obs-wind');
  const pressure = document.getElementById('obs-pressure');
  const sunrise = document.getElementById('obs-sunrise');
  const sunset = document.getElementById('obs-sunset');
  const uvIndex = document.getElementById('obs-uv');
  const windArrow = document.getElementById('obs-wind-arrow');

  if (tempVal) tempVal.innerHTML = `${current.temp}<sup>°C</sup>`;
  if (condText) condText.textContent = current.condition;
  if (feelsLike) feelsLike.textContent = `${current.feelsLike}°C`;
  if (humidity) humidity.textContent = `${current.humidity}%`;
  if (wind) wind.textContent = `${current.windDir} ${current.windSpeed} km/h`;
  if (pressure) pressure.textContent = `${current.pressure} hPa`;
  if (sunrise) sunrise.textContent = `${current.sunrise} IST`;
  if (sunset) sunset.textContent = `${current.sunset} IST`;
  if (uvIndex) uvIndex.textContent = current.uvIndex;

  if (windArrow) {
    windArrow.style.transform = `rotate(${current.windDeg}deg)`;
  }

  // Update weather icon container
  if (condIcon) {
    condIcon.className = `obs-weather-symbol icon-${current.icon}`;
  }
}

/**
 * Initializes location search input with live autocomplete dropdown
 */
function initSearch() {
  const searchInput = document.getElementById('location-search-input');
  const resultsDropdown = document.getElementById('search-results-dropdown');
  let debounceTimeout = null;

  if (!searchInput || !resultsDropdown) return;

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    clearTimeout(debounceTimeout);

    if (val.length < 2) {
      resultsDropdown.classList.add('hidden');
      resultsDropdown.innerHTML = '';
      return;
    }

    debounceTimeout = setTimeout(async () => {
      // Check local stations first
      const matchedStations = STATIONS.filter(st =>
        st.name.toLowerCase().includes(val.toLowerCase()) ||
        st.state.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 4);

      // Fetch geocoding API results
      const apiLocations = await searchLocations(val);

      resultsDropdown.innerHTML = '';

      if (matchedStations.length === 0 && apiLocations.length === 0) {
        resultsDropdown.innerHTML = `<div class="search-item text-muted">No meteorological centers found</div>`;
      } else {
        // Render Station Matches
        matchedStations.forEach(st => {
          const item = document.createElement('div');
          item.className = 'search-item station-match';
          item.innerHTML = `
            <div class="search-title">📍 <strong>${st.name}</strong></div>
            <div class="search-subtitle">${st.state} &bull; CORTEX Station</div>
          `;
          item.addEventListener('click', () => {
            selectStation(st);
            flyToLocation(st.lat, st.lon, 10);
            searchInput.value = '';
            resultsDropdown.classList.add('hidden');
          });
          resultsDropdown.appendChild(item);
        });

        // Render Global / Indian Geocoded Matches
        apiLocations.forEach(loc => {
          const item = document.createElement('div');
          item.className = 'search-item';
          item.innerHTML = `
            <div class="search-title">🌐 <strong>${loc.name}</strong>, ${loc.admin1 || ''}</div>
            <div class="search-subtitle">${loc.country}</div>
          `;
          item.addEventListener('click', () => {
            const customStation = {
              name: loc.name,
              state: loc.admin1 || loc.country,
              lat: loc.lat,
              lon: loc.lon,
              elevation: 50,
              hasRadar: false
            };
            selectStation(customStation);
            flyToLocation(loc.lat, loc.lon, 10);
            searchInput.value = '';
            resultsDropdown.classList.add('hidden');
          });
          resultsDropdown.appendChild(item);
        });
      }

      resultsDropdown.classList.remove('hidden');
    }, 300);
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
      resultsDropdown.classList.add('hidden');
    }
  });
}

/**
 * Initializes Map layer toggle buttons and basemap switches
 */
function initMapControls() {
  // Layer Toggles
  const toggles = [
    { id: 'layer-toggle-radar', layer: 'radar' },
    { id: 'layer-toggle-satellite', layer: 'satellite' },
    { id: 'layer-toggle-lightning', layer: 'lightning' },
    { id: 'layer-toggle-warnings', layer: 'warnings' },
    { id: 'layer-toggle-stations', layer: 'stations' },
    { id: 'layer-toggle-cyclone', layer: 'cyclone' },
    { id: 'layer-toggle-sos', layer: 'sos' }
  ];

  toggles.forEach(t => {
    const btn = document.getElementById(t.id);
    if (btn) {
      btn.addEventListener('click', () => {
        const isActive = btn.classList.toggle('active');
        toggleLayer(t.layer, isActive);
      });
    }
  });

  // Basemap Selector
  const basemapButtons = document.querySelectorAll('[data-basemap]');
  basemapButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      basemapButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const baseType = btn.getAttribute('data-basemap');
      switchBaseMap(baseType);
    });
  });

  // Region Quick Select Dropdown
  const regionSelect = document.getElementById('map-region-select');
  if (regionSelect) {
    regionSelect.addEventListener('change', async (e) => {
      const regionId = e.target.value;
      if (!regionId) return;
      const region = selectRegionById(regionId);
      if (region) {
        await selectStation(region);
      }
    });
  }
}

/**
 * Renders Major Cities Weather Carousel
 */
function initMajorCitiesTicker() {
  const container = document.getElementById('major-cities-carousel');
  if (!container) return;

  container.innerHTML = MAJOR_CITIES_TICKER.map(city => {
    return `
      <div class="city-summary-card" data-city-code="${city.code}">
        <div class="csc-header">
          <span class="csc-name">${city.name}</span>
          <div class="weather-symbol icon-${city.icon}"></div>
        </div>
        <div class="csc-temp">${city.temp}</div>
        <div class="csc-condition">${city.cond}</div>
        <div class="csc-meta">
          <span>💨 ${city.wind}</span>
          <span>💧 ${city.humidity}</span>
        </div>
      </div>
    `;
  }).join('');

  // Click handler to load city
  container.querySelectorAll('.city-summary-card').forEach(card => {
    card.addEventListener('click', () => {
      const code = card.getAttribute('data-city-code');
      const station = STATIONS.find(s => s.id === code);
      if (station) {
        selectStation(station);
        flyToLocation(station.lat, station.lon, 9);
      }
    });
  });
}

/**
 * Initializes specialized service tabs and sub-sections
 */
function initSpecializedSections() {
  renderCycloneCenter('cyclone-tracking-section');
  renderAgrometAdvisories('agromet-section');
  renderPilgrimageForecast('pilgrimage-section');

  // Tab switcher for specialized services
  const tabBtns = document.querySelectorAll('.service-nav-btn');
  const tabPanes = document.querySelectorAll('.service-tab-pane');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

/**
 * Crowdsource Modal & Reporting Logic
 */
function initCrowdsourceModal() {
  const openBtn = document.getElementById('btn-open-crowdsource');
  const modal = document.getElementById('crowdsource-modal');
  const closeBtn = document.getElementById('btn-close-crowdsource');
  const form = document.getElementById('crowdsource-form');

  if (!modal) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.add('hidden');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const locName = document.getElementById('cs-location').value || 'Reported Location';
      const cond = document.getElementById('cs-condition').value;
      const waterlogging = document.getElementById('cs-waterlogging').checked;
      const notes = document.getElementById('cs-notes').value;

      // Use current station coords with slight offset or user geoloc
      const report = {
        id: `cr-${Date.now()}`,
        location: locName,
        lat: currentStation.lat + (Math.random() - 0.5) * 0.08,
        lon: currentStation.lon + (Math.random() - 0.5) * 0.08,
        condition: cond,
        waterlogging: waterlogging,
        notes: notes,
        timestamp: Date.now()
      };

      saveCrowdsourceReport(report);
      addCrowdsourcePin(report);

      modal.classList.add('hidden');
      form.reset();

      // Show toast notification
      showToast("Thank you! Your weather observation has been logged on CORTEX.");
    });
  }
}

function loadCitizenReportsOnMap() {
  const reports = getCrowdsourceReports();
  reports.slice(0, 10).forEach(r => addCrowdsourcePin(r));
}

/**
 * Accessibility Text Resizing & Bilingual Toggling
 */
function initAccessibility() {
  const langBtn = document.getElementById('btn-lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      toggleLanguage();
    });
  }

  // Theme Toggle (Dark / Light)
  const themeBtn = document.getElementById('btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      themeBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
      switchBaseMap(isDark ? 'dark' : 'light');
    });
  }

  // Font resizers
  let fontScale = 1;
  const decFont = document.getElementById('btn-font-decrease');
  const resetFont = document.getElementById('btn-font-reset');
  const incFont = document.getElementById('btn-font-increase');

  if (decFont) {
    decFont.addEventListener('click', () => {
      fontScale = Math.max(0.85, fontScale - 0.05);
      document.documentElement.style.fontSize = `${fontScale * 100}%`;
    });
  }
  if (resetFont) {
    resetFont.addEventListener('click', () => {
      fontScale = 1;
      document.documentElement.style.fontSize = '100%';
    });
  }
  if (incFont) {
    incFont.addEventListener('click', () => {
      fontScale = Math.min(1.25, fontScale + 0.05);
      document.documentElement.style.fontSize = `${fontScale * 100}%`;
    });
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'cortex-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/**
 * Initializes the Multi-Color Theme Palette selector
 */
function initThemePalette() {
  const defaultPalette = 'slate';
  let savedPalette = localStorage.getItem('cortex_theme_palette') || defaultPalette;
  const validPalettes = ['slate', 'oceanic', 'emerald', 'obsidian'];
  if (!validPalettes.includes(savedPalette)) {
    savedPalette = defaultPalette;
  }

  function applyPalette(palette) {
    document.body.setAttribute('data-palette', palette);
    localStorage.setItem('cortex_theme_palette', palette);

    document.querySelectorAll('.palette-dot[data-set-palette]').forEach(dot => {
      if (dot.getAttribute('data-set-palette') === palette) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  applyPalette(savedPalette);

  const dots = document.querySelectorAll('.palette-dot[data-set-palette]');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const palette = dot.getAttribute('data-set-palette');
      applyPalette(palette);
      const names = {
        slate: 'Aerospace Slate (High-Contrast)',
        oceanic: 'Deep Oceanic Navy',
        emerald: 'Meteorological Emerald',
        obsidian: 'Obsidian Black'
      };
      showToast(`🎨 Theme active: ${names[palette] || palette}`);
    });
  });
}

/**
 * Initializes the SOS Disaster Emergency Rescue feature
 */
function initSOSRescue() {
  renderSOSModal('sos-rescue-modal');

  const modal = document.getElementById('sos-rescue-modal');
  const btnHeaderSOS = document.getElementById('btn-header-sos');
  const btnNavSOS = document.getElementById('btn-nav-sos');

  const openSOS = () => {
    if (modal) {
      modal.classList.remove('hidden');
      renderActiveSOSCards();
    }
  };

  if (btnHeaderSOS) btnHeaderSOS.addEventListener('click', openSOS);
  if (btnNavSOS) btnNavSOS.addEventListener('click', openSOS);

  // Close handlers
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'btn-close-sos' || e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }

  // GPS Auto-detect button in SOS form
  const gpsBtn = document.getElementById('btn-gps-autofill');
  const locInput = document.getElementById('sos-location');
  let detectedCoords = null;

  if (gpsBtn && locInput) {
    gpsBtn.addEventListener('click', () => {
      if ("geolocation" in navigator) {
        gpsBtn.textContent = "⌛ Locating...";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            detectedCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            locInput.value = `GPS: ${pos.coords.latitude.toFixed(4)}°N, ${pos.coords.longitude.toFixed(4)}°E (Near ${currentStation.name})`;
            gpsBtn.textContent = "✅ Located";
            setTimeout(() => { gpsBtn.textContent = "📍 GPS"; }, 3000);
          },
          (err) => {
            console.warn("Geolocation denied, using station fallback", err);
            detectedCoords = { lat: currentStation.lat, lon: currentStation.lon };
            locInput.value = `${currentStation.name}, ${currentStation.state}`;
            gpsBtn.textContent = "📍 GPS";
          },
          { timeout: 6000 }
        );
      } else {
        detectedCoords = { lat: currentStation.lat, lon: currentStation.lon };
        locInput.value = `${currentStation.name}, ${currentStation.state}`;
      }
    });
  }

  // SOS Distress Form Submission
  const sosForm = document.getElementById('sos-distress-form');
  if (sosForm) {
    sosForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sos-name').value;
      const phone = document.getElementById('sos-phone').value;
      const type = document.getElementById('sos-type').value;
      const urgency = document.getElementById('sos-urgency').value;
      const location = document.getElementById('sos-location').value;
      const count = document.getElementById('sos-count').value || 1;
      const medical = document.getElementById('sos-medical').value;
      const notes = document.getElementById('sos-notes').value;

      const lat = detectedCoords ? detectedCoords.lat : (currentStation.lat + (Math.random() - 0.5) * 0.04);
      const lon = detectedCoords ? detectedCoords.lon : (currentStation.lon + (Math.random() - 0.5) * 0.04);

      const sosRecord = {
        id: `SOS-NDRF-${Math.floor(10000 + Math.random() * 90000)}`,
        name: `${name} (${count} Trapped)`,
        phone: phone,
        type: type,
        location: location,
        lat: lat,
        lon: lon,
        trappedCount: parseInt(count) || 1,
        urgency: urgency,
        notes: `${medical ? `[Medical: ${medical}] ` : ''}${notes || 'Disaster rescue assistance requested.'}`,
        timestamp: Date.now(),
        status: "Assigned to NDRF Rapid Response Team"
      };

      saveSOSCall(sosRecord);
      addSOSRescuePin(sosRecord);
      renderActiveSOSCards();

      if (modal) modal.classList.add('hidden');
      sosForm.reset();

      showToast(`🚨 SOS RESCUE BEACON BROADCAST! Ref: #${sosRecord.id}. Direct dispatch logged with NDRF & SDRF command.`);
    });
  }
}

/**
 * Loads pre-existing active disaster distress calls on the map
 */
function loadActiveSOSOnMap() {
  const calls = getActiveSOSCalls();
  calls.forEach(c => addSOSRescuePin(c));
}

