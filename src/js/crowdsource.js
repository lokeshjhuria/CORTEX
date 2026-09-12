// Citizen Crowdsource Weather Reporting (IMD Mausam Public Observation Equivalent)

const STORAGE_KEY = 'cortex_crowdsource_reports';

export function getCrowdsourceReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultReports();
    return JSON.parse(raw);
  } catch {
    return getDefaultReports();
  }
}

export function saveCrowdsourceReport(report) {
  const existing = getCrowdsourceReports();
  existing.unshift(report);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 25)));
  } catch (e) {
    console.warn("Could not save to localStorage", e);
  }
  return report;
}

function getDefaultReports() {
  return [
    {
      id: "cr-1",
      location: "Surat (Adajan), Gujarat",
      lat: 21.195,
      lon: 72.819,
      condition: "Torrential Heavy Rain",
      waterlogging: true,
      notes: "Severe water accumulation near low underpass. Visibility under 200m.",
      timestamp: Date.now() - 1000 * 60 * 35
    },
    {
      id: "cr-2",
      location: "Thane (Ghodbunder Rd), Maharashtra",
      lat: 19.260,
      lon: 72.970,
      condition: "Squally Winds & Thunderstorm",
      waterlogging: false,
      notes: "High wind gusts, tree branches fallen on service road.",
      timestamp: Date.now() - 1000 * 60 * 85
    },
    {
      id: "cr-3",
      location: "Ranchi (Kanke), Jharkhand",
      lat: 23.410,
      lon: 85.320,
      condition: "Moderate Rain & Lightning",
      waterlogging: false,
      notes: "Frequent cloud to ground strikes observed.",
      timestamp: Date.now() - 1000 * 60 * 140
    }
  ];
}
