// Cyclone Warning & Tracking Center Controller
import { CYCLONE_DATA } from './data/advisories.js';

export function renderCycloneCenter(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;

  const points = CYCLONE_DATA.conePoints;

  el.innerHTML = `
    <div class="cyclone-dashboard-card">
      <div class="cyclone-header-banner">
        <div class="banner-title-wrap">
          <div class="cyclone-badge-row">
            <span class="cyclone-live-badge">
              <span class="cyclone-pulse-dot"></span> ACTIVE CYCLONE TRACKER
            </span>
            <span class="cyclone-bulletin-no">IMD Bulletin No. 14 / BOB-04</span>
          </div>
          <h3 class="cyclone-title">${CYCLONE_DATA.name} &bull; ${CYCLONE_DATA.basin}</h3>
          <p class="cyclone-lead">${CYCLONE_DATA.landfallForecast}</p>
        </div>

        <!-- Quick takeaway card for immediate understanding -->
        <div class="cyclone-quick-strip">
          <div class="c-stat-box">
            <span class="c-stat-label">Current Intensity</span>
            <span class="c-stat-value text-amber font-bold">${CYCLONE_DATA.status}</span>
          </div>
          <div class="c-stat-box">
            <span class="c-stat-label">Central Pressure</span>
            <span class="c-stat-value">${CYCLONE_DATA.estimatedCentralPressure}</span>
          </div>
          <div class="c-stat-box">
            <span class="c-stat-label">Wind Speed</span>
            <span class="c-stat-value">${CYCLONE_DATA.maxSustainedWindSpeed}</span>
          </div>
          <div class="c-stat-box">
            <span class="c-stat-label">Speed & Direction</span>
            <span class="c-stat-value">${CYCLONE_DATA.movement}</span>
          </div>
        </div>
      </div>

      <!-- Key citizen takeaways box -->
      <div class="cyclone-citizen-advisory">
        <div class="advisory-callout">
          <span class="advisory-icon">📢</span>
          <div>
            <strong>Essential Public Safety Advisory:</strong>
            <p class="m-0 text-sm">Total suspension of fishing operations in deep sea areas of Bay of Bengal until 15th September. Coastal residents in Ganjam, Puri, and Srikakulam districts should remain alert to localized waterlogging and squally winds up to 65 km/h.</p>
          </div>
        </div>
      </div>

      <div class="cyclone-body-grid">
        <div class="cyclone-track-table-wrap">
          <h5 class="panel-subtitle">📍 72-Hour Track Telemetry & Forecast Path</h5>
          <table class="cyclone-table">
            <thead>
              <tr>
                <th>Date & Time (IST)</th>
                <th>Coordinates</th>
                <th>Intensity Stage</th>
              </tr>
            </thead>
            <tbody>
              ${points.map((p, i) => `
                <tr class="${i === 0 ? 'row-current' : i === points.length - 1 ? 'row-landfall' : ''}">
                  <td><strong>${p.time}</strong> ${i === 0 ? '<span class="tag-current">PRESENT</span>' : ''}</td>
                  <td>${p.lat.toFixed(1)}°N, ${p.lon.toFixed(1)}°E</td>
                  <td><span class="intensity-chip">${p.intensity}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="cyclone-bulletins-wrap">
          <h5 class="panel-subtitle">⚠️ District Warnings & Port Signals</h5>
          <ul class="cyclone-bulletin-list">
            ${CYCLONE_DATA.warnings.map(w => `
              <li><span class="bulletin-bullet">⚠️</span> <span>${w}</span></li>
            `).join('')}
          </ul>
          <div class="port-signals-box mt-3">
            <span class="port-signals-title">Port Cautionary Signals (Local Cautionary LC-3):</span>
            <div class="signals-pills">
              <span class="pill-signal">Paradip Port (LC-3)</span>
              <span class="pill-signal">Visakhapatnam (LC-3)</span>
              <span class="pill-signal">Gopalpur Port (LC-3)</span>
              <span class="pill-signal">Dhamra Port (LC-3)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
