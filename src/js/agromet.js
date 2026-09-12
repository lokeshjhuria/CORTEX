// Agromet Advisory Service (Gramin Krishi Mausam Sewa - GKMS)
import { AGROMET_ADVISORIES } from './data/advisories.js';

export function renderAgrometAdvisories(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="agromet-header mb-3">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 class="m-0 font-bold">🌾 Gramin Krishi Mausam Advisory (GKMS)</h4>
          <p class="text-sm text-muted m-0">National Crop-Weather Intelligence Bulletin for Indian Farmers</p>
        </div>
        <div class="agromet-status-badge">
          <span class="badge-dot pulse-green"></span> Kharif Season Crop Cycle
        </div>
      </div>
    </div>

    <div class="agromet-cards-grid">
      ${AGROMET_ADVISORIES.map(adv => `
        <div class="agromet-card">
          <div class="agromet-card-top">
            <div class="crop-info">
              <span class="crop-name">${adv.crop}</span>
              <span class="crop-stage">${adv.stage}</span>
            </div>
            <span class="agromet-status-chip ${adv.status.includes('Alert') ? 'chip-alert' : adv.status.includes('Drainage') ? 'chip-warning' : 'chip-ok'}">
              ${adv.status}
            </span>
          </div>
          <div class="agromet-region">
            <strong>Target Belts:</strong> ${adv.region}
          </div>
          <div class="agromet-body">
            <p>${adv.advisory}</p>
          </div>
          <div class="agromet-footer">
            <span class="text-xs text-muted">Issued by: CORTEX Agrometeorology Advisory Division</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
