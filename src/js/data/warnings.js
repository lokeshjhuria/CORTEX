// National Severe Weather Warning Registry & Meteorological Alert Levels
export const WARNING_LEVELS = {
  RED: {
    code: "red",
    label: "WARNING (TAKE ACTION)",
    color: "#dc2626",
    bgColor: "#fef2f2",
    borderColor: "#f87171",
    description: "Extremely severe weather imminent. Evacuation or disaster response mobilization advised."
  },
  ORANGE: {
    code: "orange",
    label: "ALERT (BE PREPARED)",
    color: "#ea580c",
    bgColor: "#fff7ed",
    borderColor: "#fb923c",
    description: "Severe weather likely. Prepare emergency kits, protect standing crops, avoid coastal routes."
  },
  YELLOW: {
    code: "yellow",
    label: "WATCH (BE UPDATED)",
    color: "#ca8a04",
    bgColor: "#fefce8",
    borderColor: "#facc15",
    description: "Moderate weather disruptions possible. Stay informed through local forecasts."
  },
  GREEN: {
    code: "green",
    label: "NO WARNING (NO ACTION)",
    color: "#16a34a",
    bgColor: "#f0fdf4",
    borderColor: "#4ade80",
    description: "Weather conditions normal. No adverse impact expected."
  }
};

export const SUBDIVISION_WARNINGS = [
  {
    subdivision: "Gujarat Region & Saurashtra-Kutch",
    level: "RED",
    phenomenon: "Isolated Extremely Heavy Rainfall (>204.4 mm)",
    validUntil: "14-Sep 08:30 IST",
    impact: "Severe localized flooding, waterlogging in low lying areas, disruption of rail/road traffic.",
    action: "Avoid stepping out during peak intensity. Fishermen are strictly warned not to venture into North & Central Arabian Sea."
  },
  {
    subdivision: "Konkan & Goa (including Mumbai & Thane)",
    level: "ORANGE",
    phenomenon: "Heavy to Very Heavy Rainfall (115.6 to 204.4 mm) with Squally Winds 45-55 kmph",
    validUntil: "13-Sep 23:30 IST",
    impact: "Ghat road mudslides, urban waterlogging, reduced visibility on expressways.",
    action: "Keep drainage systems clear. Commuters advised to check real-time traffic before travel."
  },
  {
    subdivision: "East Rajasthan & West Madhya Pradesh",
    level: "ORANGE",
    phenomenon: "Thunderstorm with Lightning & Heavy Downpours",
    validUntil: "13-Sep 20:00 IST",
    impact: "Minor damage to loose structures, localized flash run-offs.",
    action: "Farmers to halt pesticide sprays and secure harvested produce."
  },
  {
    subdivision: "Coastal Karnataka & Kerala-Mahe",
    level: "YELLOW",
    phenomenon: "Squally weather with wind speed reaching 40-50 kmph gusting to 60 kmph",
    validUntil: "14-Sep 12:00 IST",
    impact: "Rough to very rough sea conditions along Karnataka and North Kerala coasts.",
    action: "Fishermen cautioned. Small boats should remain near shore."
  },
  {
    subdivision: "Assam & Meghalaya, Sub-Himalayan West Bengal",
    level: "YELLOW",
    phenomenon: "Thunderstorm accompanied with lightning and moderate showers",
    validUntil: "14-Sep 18:00 IST",
    impact: "Temporary rise in localized stream levels.",
    action: "Do not take shelter under solitary trees during lightning strikes."
  },
  {
    subdivision: "Delhi NCR & Haryana",
    level: "GREEN",
    phenomenon: "Partly cloudy with mist/haze; no significant rainfall",
    validUntil: "14-Sep 23:59 IST",
    impact: "Normal seasonal weather.",
    action: "No action required."
  }
];

export const BREAKING_MARQUEE_ALERTS = [
  {
    id: "alert-1",
    tag: "RED ALERT",
    level: "RED",
    text: "Isolated Extremely Heavy Rainfall (210mm+) warned over Gujarat & Saurashtra coast on 13-14 September."
  },
  {
    id: "alert-2",
    tag: "ORANGE ALERT",
    level: "ORANGE",
    text: "Very Heavy Rainfall & squally winds (55 km/h) forecasted for Konkan, Goa & coastal Maharashtra."
  },
  {
    id: "alert-3",
    tag: "CYCLONE OUTLOOK",
    level: "YELLOW",
    text: "Depression over East-Central Bay of Bengal likely to concentrate into Deep Depression within 24 hours."
  },
  {
    id: "alert-4",
    tag: "AGROMET BULLETIN",
    level: "GREEN",
    text: "Gramin Krishi Mausam Advisory: Postpone irrigation & nitrogen top-dressing in flood-prone districts."
  }
];
