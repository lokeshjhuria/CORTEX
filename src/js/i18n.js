// Bilingual Dictionary (English / Hindi) for CORTEX Meteorological Portal

export const TRANSLATIONS = {
  en: {
    portal_title: "CORTEX Meteorological Department",
    sub_title: "Ministry of Earth & Atmospheric Sciences",
    govt_tag: "National Climate & Early Warning Intelligence Agency",
    search_placeholder: "Search Indian City, District or Global Location...",
    quick_warnings: "Warnings",
    quick_nowcast: "Nowcast (3h)",
    quick_crowdsource: "Public Observation",
    quick_specialized: "Specialized Forecast",
    live_ist: "IST",
    live_utc: "UTC",
    current_wx_title: "Current Weather Observation",
    satellite_tab: "INSAT-3D Satellite",
    radar_tab: "Doppler Radar",
    lightning_tab: "Lightning Strikes",
    warnings_tab: "Hazard Warnings",
    stations_tab: "Station Network",
    temp_label: "Temperature",
    feels_like: "Feels Like",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    visibility: "Visibility",
    dew_point: "Dew Point",
    sunrise: "Sunrise",
    sunset: "Sunset",
    moonrise: "Moonrise",
    moonset: "Moonset",
    forecast_7day: "7-Day Meteorological Forecast",
    hourly_24h: "24-Hour Hourly Trend",
    cyclone_center: "Cyclone Tracking Center",
    agromet_title: "Agromet Advisory (Gramin Krishi Mausam)",
    aqi_title: "Air Quality Index (AQI)",
    aviation_marine: "Aviation & Marine Forecast",
    pilgrimage_tourism: "Pilgrimage & Mountain Weather",
    crowdsource_title: "Submit Public Weather Report",
    report_desc: "Help meteorological scientists by sharing real-time ground truth weather observations in your neighborhood.",
    btn_submit_report: "Submit Observation",
    btn_close: "Close",
    footer_rights: "© 2026 CORTEX Meteorological Services. Designed for National Disaster Preparedness & Climate Resilience.",
    lang_toggle_btn: "हिन्दी वेबसाईट",
    major_cities: "Current Conditions Across Major Hubs",
    sos_nav_btn: "🚨 SOS DISASTER RESCUE",
    sos_banner_text: "EMERGENCY RESCUE: DIAL 112 / 1078 (NDMA) FOR IMMEDIATE DISASTER EVACUATION"
  },
  hi: {
    portal_title: "कोर्टेक्स मौसम विज्ञान विभाग",
    sub_title: "पृथ्वी एवं वायुमंडलीय विज्ञान मंत्रालय",
    govt_tag: "राष्ट्रीय जलवायु एवं पूर्व चेतावनी सूचना एजेंसी",
    search_placeholder: "भारतीय शहर, ज़िला या वैश्विक स्थान खोजें...",
    quick_warnings: "मौसम चेतावनियाँ",
    quick_nowcast: "तात्कालिक मौसम (नाउकास्ट)",
    quick_crowdsource: "जन अवलोकन दर्ज करें",
    quick_specialized: "विशिष्ट मौसम पूर्वानुमान",
    live_ist: "भारतीय मानक समय (IST)",
    live_utc: "यूटीसी (UTC)",
    current_wx_title: "वर्तमान मौसम प्रेक्षण",
    satellite_tab: "इनसैट-3डी उपग्रह",
    radar_tab: "डॉपलर मौसम रडार",
    lightning_tab: "वज्रपात एवं तड़ित",
    warnings_tab: "आपदा चेतावनियाँ",
    stations_tab: "मौसम वेधशाला नेटवर्क",
    temp_label: "तापमान",
    feels_like: "अनुभूत तापमान",
    humidity: "आर्द्रता",
    wind: "हवा",
    pressure: "वायुमंडलीय दबाव",
    visibility: "दृश्यता",
    dew_point: "ओसांक",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    moonrise: "चंद्रोदय",
    moonset: "चंद्रास्त",
    forecast_7day: "७-दिवसीय मौसम पूर्वानुमान",
    hourly_24h: "२४-घंटे प्रति घंटा रुझान",
    cyclone_center: "चक्रवात निगरानी एवं चेतावनी केंद्र",
    agromet_title: "कृषि मौसम परामर्श (ग्रामीण कृषि मौसम सेवा)",
    aqi_title: "वायु गुणवत्ता सूचकांक (AQI)",
    aviation_marine: "विमानन एवं समुद्री मौसम",
    pilgrimage_tourism: "तीर्थयात्रा एवं पर्वतीय मौसम",
    crowdsource_title: "मौसम रिपोर्ट दर्ज करें",
    report_desc: "अपने क्षेत्र के स्थानीय मौसम की जानकारी साझा करके मौसम वैज्ञानिकों की सहायता करें।",
    btn_submit_report: "रिपोर्ट प्रेषित करें",
    btn_close: "बंद करें",
    footer_rights: "© २०२६ कोर्टेक्स मौसम विज्ञान सेवा। राष्ट्रीय आपदा प्रबंधन एवं जलवायु सुरक्षा हेतु समर्पित।",
    lang_toggle_btn: "English Website",
    major_cities: "प्रमुख महानगरों का वर्तमान मौसम",
    sos_nav_btn: "🚨 आपातकालीन आपदा बचाव (SOS)",
    sos_banner_text: "आपातकालीन बचाव: बाढ़ व चक्रवात सहायता हेतु तत्काल 112 या 1078 (NDMA) डायल करें"
  }
};

let currentLanguage = "en";

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  if (TRANSLATIONS[lang]) {
    currentLanguage = lang;
    applyLanguage();
  }
}

export function toggleLanguage() {
  const nextLang = currentLanguage === "en" ? "hi" : "en";
  setLanguage(nextLang);
  return nextLang;
}

export function t(key) {
  return TRANSLATIONS[currentLanguage][key] || key;
}

export function applyLanguage() {
  const dict = TRANSLATIONS[currentLanguage];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  const langBtn = document.getElementById("btn-lang-toggle");
  if (langBtn) {
    langBtn.textContent = dict.lang_toggle_btn;
  }
}
