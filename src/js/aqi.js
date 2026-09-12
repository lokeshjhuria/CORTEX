// Air Quality Index (AQI) Dashboard & Health Guidance
import { AIR_QUALITY_THRESHOLDS } from './data/advisories.js';

export function getAQICategory(value) {
  if (value <= 50) return AIR_QUALITY_THRESHOLDS[0];
  if (value <= 100) return AIR_QUALITY_THRESHOLDS[1];
  if (value <= 200) return AIR_QUALITY_THRESHOLDS[2];
  if (value <= 300) return AIR_QUALITY_THRESHOLDS[3];
  if (value <= 400) return AIR_QUALITY_THRESHOLDS[4];
  return AIR_QUALITY_THRESHOLDS[5];
}

export function renderAQICard(containerId, aqiData) {
  const container = document.getElementById(containerId);
  if (!container || !aqiData) return;

  const aqiVal = aqiData.us_aqi || 112;
  const category = getAQICategory(aqiVal);

  container.innerHTML = `
    <div class="aqi-card-wrapper">
      <div class="aqi-card-header">
        <h5 class="m-0 font-bold">🍃 Air Quality Index (AQI)</h5>
        <span class="aqi-badge-live">SAFAR / CORTEX Clean Air</span>
      </div>

      <div class="aqi-main-display">
        <div class="aqi-dial" style="--aqi-color: ${category.color}">
          <div class="aqi-val">${aqiVal}</div>
          <div class="aqi-scale">AQI-US</div>
        </div>
        <div class="aqi-status-info">
          <span class="aqi-category-title" style="color: ${category.color}">${category.status}</span>
          <p class="aqi-advice-text">${category.advice}</p>
        </div>
      </div>

      <div class="aqi-pollutants-grid">
        <div class="pollutant-box">
          <span class="p-name">PM2.5</span>
          <span class="p-val font-semibold">${aqiData.pm2_5} µg/m³</span>
          <div class="p-bar"><div class="p-fill" style="width: ${Math.min(100, (aqiData.pm2_5 / 150) * 100)}%"></div></div>
        </div>
        <div class="pollutant-box">
          <span class="p-name">PM10</span>
          <span class="p-val font-semibold">${aqiData.pm10} µg/m³</span>
          <div class="p-bar"><div class="p-fill" style="width: ${Math.min(100, (aqiData.pm10 / 250) * 100)}%"></div></div>
        </div>
        <div class="pollutant-box">
          <span class="p-name">NO₂</span>
          <span class="p-val font-semibold">${aqiData.no2} µg/m³</span>
          <div class="p-bar"><div class="p-fill" style="width: ${Math.min(100, (aqiData.no2 / 100) * 100)}%"></div></div>
        </div>
        <div class="pollutant-box">
          <span class="p-name">Ozone (O₃)</span>
          <span class="p-val font-semibold">${aqiData.o3} µg/m³</span>
          <div class="p-bar"><div class="p-fill" style="width: ${Math.min(100, (aqiData.o3 / 100) * 100)}%"></div></div>
        </div>
      </div>
    </div>
  `;
}
