# CORTEX — National Meteorological & Climate Early Warning Intelligence Platform

CORTEX is a high-performance, real-time meteorological intelligence and disaster surveillance web platform inspired by the India Meteorological Department (IMD) Mausam infrastructure.

Built with modern web technologies, CORTEX combines geospatial intelligence, live satellite and radar observations, numerical weather predictions, and emergency disaster response into a sleek, professional obsidian-black command console.

---

## 🌟 Key Features

1. **Interactive Geospatial Meteorological GIS (Leaflet Engine)**
   - Click anywhere across India or neighboring maritime zones to instantly query coordinates and stream real-time meteorological data.
   - Quick Region / State selector covering 20+ major Indian states and territories.
   - Live Doppler Weather Radar (DWR) multi-station coverage rings and simulated reflectivity sweeps.
   - Active lightning discharge telemetry and real-time subdivision warning highlights (Red & Orange alert zones).

2. **Real-Time Weather Telemetry & NWP Forecasts**
   - High-resolution live weather observation (Temperature, Feels Like, Humidity, Wind Direction/Speed, Surface Pressure, UV Index, Astronomy sunrise/sunset).
   - 7-Day Numerical Weather Prediction (NWP) daily forecast cards with minimum and maximum temperatures.
   - 24-Hour hourly temperature spline curve and precipitation probability trend chart (Chart.js).
   - Integrated real-time Air Quality Index (AQI) with PM2.5, PM10, NO2, and SO2 breakdown.

3. **Active Cyclone Tracking & Surveillance Center**
   - Live tracking for deep depressions and cyclonic systems (Bay of Bengal BOB-04).
   - High-contrast telemetry table with observed and 72-hour forecast waypoints.
   - Plain-language Public Safety Advisory for coastal districts, travelers, and fishermen.
   - Hoisted Port Cautionary Signals (Paradip, Visakhapatnam, Gopalpur, Dhamra).

4. **24/7 Emergency SOS Disaster Rescue Hub**
   - Direct national emergency helplines: **112**, **1078 (NDMA)**, **1070 (SDMA)**, **1554 (Coast Guard)**, **108 (Medical)**.
   - Regional NDRF and SDRF battalion command contacts.
   - Interactive SOS Distress Beacon Transmitter with automated GPS coordinate detection and live pulsing beacon mapping.

5. **Citizen Crowdsource Ground-Truth Weather**
   - Public reporting tool for localized torrential rain, lightning, waterlogging, or hailstorms.

6. **Specialized Services**
   - Gramin Krishi Mausam Sewa (Agromet) crop advisories for paddy, cotton, soybean, sugarcane, and groundnut.
   - Char Dham & Himalayan pilgrimage weather guidance.
   - Coastal, marine, and aviation aerodrome meteorological guidance (METAR/TAF).

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Modern Obsidian Black Design System), Vanilla ES6+ JavaScript
- **Mapping**: Leaflet.js with OpenStreetMap standard raster tiles
- **Data Visualizations**: Chart.js for 24-hour meteorological trends
- **Data APIs**: Open-Meteo Weather Forecast API & Air Quality API
- **Build Tool**: Vite

---

## 🚀 Quick Start (Local Development)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Install Dependencies
`ash
npm install
`

### 2. Start Development Server
`ash
npm run dev
`
Open your browser at http://localhost:5173/.

### 3. Build for Production
`ash
npm run build
`
The production bundle will be generated in the dist/ directory.

### 4. Preview Production Build
`ash
npm run preview
`

---

## 🌐 Deploying to GitHub & GitHub Pages

### Step 1: Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., cortex-weather or cortex).
3. Set visibility to **Public**.
4. Leave \"Add a README\" unchecked.
5. Click **Create repository**.

### Step 2: Push Your Code from this Folder
Open your terminal in this directory (C:\Users\lokes\Downloads\PCCOE) and run:
`ash
git init
git add .
git commit -m \"Initial commit: CORTEX Weather Platform\"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
`
*(Replace YOUR_USERNAME and YOUR_REPOSITORY_NAME with your actual GitHub username and repository name).*

### Step 3: Enable Automatic GitHub Pages Deployment
1. In your GitHub repository, navigate to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. The included workflow (.github/workflows/deploy.yml) will automatically trigger, build the project, and publish your live website!
4. Your site will be live at:
   https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/

---

## ☁️ Deploying to Vercel or Netlify (Alternative)

### Deploy to Vercel (1-Click)
1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Framework Preset will auto-detect as **Vite**.
5. Click **Deploy**.

### Deploy to Netlify
1. Push this repository to GitHub.
2. Go to [netlify.com](https://netlify.com) and click **Add new site** > **Import an existing project**.
3. Select GitHub and choose your repository.
4. Build command: 
pm run build
5. Publish directory: dist
6. Click **Deploy**.

---

## 📄 License
MIT License. Developed for Meteorological Intelligence & Climate Resilience.
