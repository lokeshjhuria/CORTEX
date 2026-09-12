// Mountain & Pilgrimage Weather Forecasts (Char Dham, Amarnath, Vaishno Devi)
import { PILGRIMAGE_TOURISM_FORECAST } from './data/advisories.js';

export function renderPilgrimageForecast(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="pilgrimage-header mb-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 class="m-0 font-bold">🏔️ Pilgrimage & Mountain Weather Guidance</h4>
          <p class="text-sm text-muted m-0">Specialized High-Altitude Bulletins for Char Dham, Amarnath & Himalayan Routes</p>
        </div>
        <span class="badge-route-status">🟢 Major Yatra Corridors Monitored</span>
      </div>
    </div>

    <div class="pilgrimage-grid">
      ${PILGRIMAGE_TOURISM_FORECAST.map(item => `
        <div class="pilgrimage-card">
          <div class="pilgrimage-card-top">
            <div>
              <h5 class="p-name">${item.location}</h5>
              <span class="p-alt">Altitude: ${item.altitude} &bull; ${item.state}</span>
            </div>
            <span class="p-temp-tag">${item.temp}</span>
          </div>
          <div class="p-cond-badge">
            <span>⛅ ${item.condition}</span>
          </div>
          <div class="p-road">
            <strong>Route / Highway Status:</strong> ${item.roadStatus}
          </div>
          <p class="p-advisory">${item.advisory}</p>
        </div>
      `).join('')}
    </div>
  `;
}
