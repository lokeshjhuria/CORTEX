// SOS Emergency Rescue & Disaster Response Controller
import { EMERGENCY_HOTLINES, REGIONAL_RESCUE_BATTALIONS, DISASTER_SURVIVAL_GUIDELINES } from './data/sos-data.js';

const SOS_STORAGE_KEY = 'cortex_active_sos_distress_calls';

export function getActiveSOSCalls() {
  try {
    const raw = localStorage.getItem(SOS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultActiveSOS();
  } catch {
    return getDefaultActiveSOS();
  }
}

export function saveSOSCall(sosRecord) {
  const existing = getActiveSOSCalls();
  existing.unshift(sosRecord);
  try {
    localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch (e) {
    console.warn("Error saving SOS record", e);
  }
  return sosRecord;
}

function getDefaultActiveSOS() {
  return [
    {
      id: "SOS-NDRF-9102",
      name: "Ramesh Patel (14 Villagers)",
      phone: "+91 98250 XXXXX",
      type: "Severe Flood Inundation / Trapped on Rooftop",
      location: "Near Dhandhuka, Ahmedabad District, Gujarat",
      lat: 22.37,
      lon: 71.98,
      trappedCount: 14,
      urgency: "CRITICAL",
      notes: "Water level rising rapidly (approx 5 ft). 3 infants and 2 elderly require immediate rescue boat.",
      timestamp: Date.now() - 1000 * 60 * 25,
      status: "NDRF Team En Route (Boat #4)"
    },
    {
      id: "SOS-NDRF-8841",
      name: "Coast Guard Maritime Fishermen Alert",
      phone: "+91 22 2431 XXXX",
      type: "Vessel Engine Failure / Rough High Seas",
      location: "32 NM West of Veraval Harbor, Arabian Sea",
      lat: 20.85,
      lon: 69.80,
      trappedCount: 6,
      urgency: "HIGH",
      notes: "Mechanized trawler adrift amidst 4.2m swells. ICG Fast Patrol Vessel dispatched.",
      timestamp: Date.now() - 1000 * 60 * 75,
      status: "ICG Ship 'Samarth' Diverted"
    }
  ];
}

export function renderSOSModal(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="sos-modal-content">
      <!-- Top Emergency Header -->
      <div class="sos-top-header">
        <div class="d-flex align-items-center gap-2">
          <span class="sos-pulsing-badge">🚨 EMERGENCY DISASTER RESCUE</span>
          <h3 class="sos-title m-0">National Disaster Rescue & Response Network</h3>
        </div>
        <button id="btn-close-sos" class="sos-close-btn">&times;</button>
      </div>

      <div class="sos-modal-body">
        <!-- 24/7 Primary Hotlines Grid -->
        <div class="sos-section mb-4">
          <h5 class="sos-section-title">📞 24/7 National Emergency Helplines (Direct Click-to-Call)</h5>
          <div class="sos-hotlines-grid">
            ${EMERGENCY_HOTLINES.map(h => `
              <a href="tel:${h.code.replace(/[^0-9]/g, '')}" class="sos-hotline-card ${h.primary ? 'hotline-primary' : ''}">
                <div class="hotline-number" style="color: ${h.color}">
                  <span class="phone-icon">📞</span> ${h.code}
                </div>
                <div class="hotline-info">
                  <strong>${h.title}</strong>
                  <span class="hotline-agency">${h.agency}</span>
                  <span class="hotline-type">${h.type}</span>
                </div>
                <div class="hotline-call-btn" style="background: ${h.color}">DIAL NOW</div>
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Two Column: SOS Distress Dispatcher & Regional Battalions -->
        <div class="sos-two-col-grid">
          
          <!-- Left: Citizen SOS Distress Beacon Form -->
          <div class="sos-beacon-card">
            <div class="beacon-card-header">
              <h5 class="m-0 font-bold">🆘 Broadcast Emergency Rescue Distress Call</h5>
              <p class="text-xs text-muted m-0">Transmits real-time GPS coordinates directly to NDRF, SDRF & Coast Guard Operations</p>
            </div>

            <form id="sos-distress-form" class="sos-form mt-3">
              <div class="form-row-2">
                <div class="form-group">
                  <label for="sos-name">Contact Person / Caller Name *</label>
                  <input type="text" id="sos-name" class="form-control" placeholder="e.g. Anand Sharma" required>
                </div>
                <div class="form-group">
                  <label for="sos-phone">Active Contact Mobile / Satellite Phone *</label>
                  <input type="tel" id="sos-phone" class="form-control" placeholder="+91 98765 43210" required>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label for="sos-type">Nature of Disaster Emergency *</label>
                  <select id="sos-type" class="form-control" required>
                    <option value="Severe Flash Flood / Submerged House">🌊 Flash Flood / Submerged House</option>
                    <option value="Cyclone Landfall Wind / Structural Collapse">🌀 Cyclone Landfall / Roof Blown Off</option>
                    <option value="Ghat Landslide / Debris Trapped Road">⛰️ Landslide / Trapped on Highway</option>
                    <option value="Stranded Boat / High Seas Distress">⚓ Maritime / Boat Engine Failure</option>
                    <option value="Severe Lightning Strike / Medical Triage">⚡ Lightning Injury / Critical Medical</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="sos-urgency">Urgency Priority *</label>
                  <select id="sos-urgency" class="form-control text-red-600 font-bold">
                    <option value="CRITICAL">🔴 CRITICAL (Life-Threatening / Water Rising)</option>
                    <option value="HIGH">🟠 HIGH (Cut-off from Food/Water, Medical Needed)</option>
                    <option value="MODERATE">🟡 MODERATE (Safe for Now, Evacuation Required)</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label for="sos-location">Exact Location / Landmarks *</label>
                <div class="d-flex gap-2">
                  <input type="text" id="sos-location" class="form-control" placeholder="Village / Street / Tehsil / Landmark" required>
                  <button type="button" id="btn-gps-autofill" class="btn-gps-locate" title="Detect Current GPS Coordinates">
                    📍 GPS
                  </button>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label for="sos-count">No. of Persons Trapped *</label>
                  <input type="number" id="sos-count" class="form-control" min="1" max="500" value="4" required>
                </div>
                <div class="form-group">
                  <label for="sos-medical">Infants / Elderly / Critical Illness?</label>
                  <input type="text" id="sos-medical" class="form-control" placeholder="e.g. 1 infant, 2 elderly, 1 oxygen patient">
                </div>
              </div>

              <div class="form-group">
                <label for="sos-notes">Emergency Remarks for Rescue Boats / Helicopters</label>
                <textarea id="sos-notes" class="form-control" rows="2" placeholder="Describe roof color, visible cell tower, or water current speed..."></textarea>
              </div>

              <button type="submit" class="btn-sos-submit">
                🚨 TRANSMIT SOS BEACON TO RESCUE COMMAND
              </button>
            </form>
          </div>

          <!-- Right: Regional NDRF Battalions Directory -->
          <div class="sos-battalions-card">
            <h5 class="sos-section-title">🛡️ NDRF & SDRF Regional Response Battalions</h5>
            <div class="battalions-list">
              ${REGIONAL_RESCUE_BATTALIONS.map(b => `
                <div class="battalion-item">
                  <div class="b-header">
                    <strong class="b-name">${b.battalion}</strong>
                    <span class="b-status">${b.status}</span>
                  </div>
                  <div class="b-region">${b.region}</div>
                  <div class="b-spec text-xs">${b.specialty}</div>
                  <div class="b-call-wrap">
                    <span class="text-xs text-muted">24x7 Control Room:</span>
                    <a href="tel:${b.dutyOfficer.split('/')[0].trim()}" class="b-phone">${b.dutyOfficer}</a>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Guidelines snippet -->
            <div class="disaster-guidelines-box mt-3">
              <h6 class="font-bold text-red-700 mb-1">⚠️ Critical Flood & Cyclone Survival Rule:</h6>
              <p class="text-xs text-muted m-0">
                Never cross moving water on foot or in vehicles. Keep cellphones in waterproof plastic bags. Signal rescue helicopters by displaying bright-colored cloth or flashing torchlight.
              </p>
            </div>
          </div>

        </div>

        <!-- Active Distress Calls Telemetry -->
        <div class="sos-active-telemetry mt-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h5 class="m-0 font-bold">📡 Active Disaster Distress Calls Logged in Operations Control</h5>
            <span class="badge-active-sos"><span class="badge-dot pulse-red"></span> LIVE DISASTER TELEMETRY</span>
          </div>
          <div id="sos-active-calls-container" class="sos-calls-grid">
            <!-- Dynamically populated -->
          </div>
        </div>

      </div>
    </div>
  `;

  renderActiveSOSCards();
}

export function renderActiveSOSCards() {
  const container = document.getElementById('sos-active-calls-container');
  if (!container) return;

  const calls = getActiveSOSCalls();
  if (calls.length === 0) {
    container.innerHTML = `<div class="text-sm text-muted p-2">No active disaster distress signals recorded in your zone.</div>`;
    return;
  }

  container.innerHTML = calls.map(c => `
    <div class="sos-call-item ${c.urgency === 'CRITICAL' ? 'border-critical' : ''}">
      <div class="sci-head">
        <span class="sci-badge ${c.urgency === 'CRITICAL' ? 'bg-danger text-white' : 'bg-warning text-dark'}">${c.urgency}</span>
        <span class="sci-id font-mono">${c.id}</span>
      </div>
      <div class="sci-title"><strong>${c.name}</strong> &bull; <a href="tel:${c.phone}">${c.phone}</a></div>
      <div class="sci-type text-xs text-danger font-semibold">${c.type}</div>
      <div class="sci-loc text-xs text-muted">📍 ${c.location} (${c.trappedCount} Trapped)</div>
      <div class="sci-notes text-xs mt-1">"${c.notes}"</div>
      <div class="sci-status mt-2">
        <span class="badge-status-dot"></span> <strong>Status:</strong> ${c.status || "Assigned to Rescue Battalion"}
      </div>
    </div>
  `).join('');
}
