// Specialized Bulletins, Agromet Advisories, Cyclone Center, and Marine Metadata

export const AGROMET_ADVISORIES = [
  {
    crop: "Paddy (Rice)",
    stage: "Tillering to Panicle Initiation",
    region: "Punjab, Haryana & Western UP",
    advisory: "Maintain 3-5 cm water level in fields. With humid conditions, monitor for Stem Borer and Bacterial Leaf Blight. Avoid chemical spraying if rain is forecasted in next 24 hours.",
    status: "Normal Operations"
  },
  {
    crop: "Cotton",
    stage: "Boll Formation / Flowering",
    region: "Gujarat, Vidarbha & Telangana",
    advisory: "Ensure adequate surface drainage to prevent waterlogging. Excessive moisture favors root rot and parawilt. Install yellow sticky traps for whitefly management.",
    status: "High Alert (Rainfall)"
  },
  {
    crop: "Soybean & Groundnut",
    stage: "Pod Development",
    region: "Madhya Pradesh & Saurashtra",
    advisory: "Drain excess standing water immediately from low-lying fields. Postpone top-dressing of urea until heavy rain spells recede.",
    status: "Urgent Drainage Needed"
  },
  {
    crop: "Horticulture (Mango / Citrus)",
    stage: "Vegetative Flush",
    region: "Andhra Pradesh & Maharashtra",
    advisory: "Prune diseased shoots and apply Bordeaux paste (1%) to cut ends. Stake young fruit saplings against gusty convective winds.",
    status: "Protective Measures"
  }
];

export const CYCLONE_DATA = {
  name: "Depression 'BOB-04'",
  basin: "East-Central Bay of Bengal",
  status: "Deep Depression (WMO Category 2)",
  currentLat: 16.4,
  currentLon: 88.2,
  estimatedCentralPressure: "994 hPa",
  maxSustainedWindSpeed: "55-65 kmph gusting to 75 kmph",
  movement: "West-Northwestwards at 14 km/h",
  landfallForecast: "Likely to cross North Andhra Pradesh - South Odisha coast near Gopalpur by 15th Sep evening.",
  conePoints: [
    { time: "Observed (12-Sep 17:30 IST)", lat: 16.4, lon: 88.2, intensity: "Depression (45 kmph)" },
    { time: "Forecast (13-Sep 05:30 IST)", lat: 17.1, lon: 86.8, intensity: "Deep Depression (55 kmph)" },
    { time: "Forecast (13-Sep 17:30 IST)", lat: 17.8, lon: 85.5, intensity: "Cyclonic Storm (70 kmph)" },
    { time: "Forecast (14-Sep 05:30 IST)", lat: 18.5, lon: 84.8, intensity: "Severe Cyclonic Storm (85 kmph)" },
    { time: "Landfall (14-Sep 17:30 IST)", lat: 19.1, lon: 84.3, intensity: "Cyclonic Storm at Landfall (80 kmph)" }
  ],
  warnings: [
    "Fishermen are advised NOT to venture into Central & Northwest Bay of Bengal till 15th September.",
    "Ports of Paradip, Gopalpur, and Visakhapatnam advised to hoist Local Cautionary Signal No. 3 (LC-3).",
    "Damage to thatched huts, minor damage to power and communication lines expected in coastal districts."
  ]
};

export const AIR_QUALITY_THRESHOLDS = [
  { range: "0 - 50", status: "Good", color: "#16a34a", icon: "smile", advice: "Air quality is satisfactory, and air pollution poses little or no risk." },
  { range: "51 - 100", status: "Satisfactory", color: "#65a30d", icon: "smile", advice: "Minor breathing discomfort to sensitive people." },
  { range: "101 - 200", status: "Moderate", color: "#ca8a04", icon: "meh", advice: "Breathing discomfort to people with lungs, asthma and heart diseases." },
  { range: "201 - 300", status: "Poor", color: "#ea580c", icon: "frown", advice: "Breathing discomfort to most people on prolonged exposure." },
  { range: "301 - 400", status: "Very Poor", color: "#dc2626", icon: "alert-triangle", advice: "Respiratory illness on prolonged exposure. Avoid strenuous outdoor activities." },
  { range: "401 - 500+", status: "Severe", color: "#7f1d1d", icon: "skull", advice: "Affects healthy people and seriously impacts those with existing diseases." }
];

export const PILGRIMAGE_TOURISM_FORECAST = [
  {
    location: "Kedarnath Dham",
    altitude: "3,583 m",
    state: "Uttarakhand",
    temp: "4°C / 12°C",
    condition: "Light Showers & Evening Fog",
    roadStatus: "Open (Caution near Sonprayag)",
    advisory: "Carry heavy woolens and waterproof gear. Afternoon visibility may drop below 100m."
  },
  {
    location: "Badrinath Dham",
    altitude: "3,300 m",
    state: "Uttarakhand",
    temp: "6°C / 14°C",
    condition: "Partly Cloudy with Chilly Breeze",
    roadStatus: "Open",
    advisory: "Night temperatures hover near freezing. High UV index at midday."
  },
  {
    location: "Amarnath Cave Sanctuary",
    altitude: "3,888 m",
    state: "Jammu & Kashmir",
    temp: "2°C / 9°C",
    condition: "Clear morning, gusty evening wind",
    roadStatus: "Regulated",
    advisory: "Helicopter sorties subject to sudden cloud ceilings."
  },
  {
    location: "Vaishno Devi (Katra)",
    altitude: "1,584 m",
    state: "Jammu & Kashmir",
    temp: "21°C / 29°C",
    condition: "Passing clouds, pleasant night",
    roadStatus: "Open / Battery car operational",
    advisory: "Ideal track conditions. Keep umbrella for intermittent drizzle."
  }
];
