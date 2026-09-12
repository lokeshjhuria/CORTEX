// 7-Day Forecast Cards & 24-Hour Hourly Chart.js Visualizer
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

let hourlyChartInstance = null;

/**
 * Render 7-day forecast cards into target container
 */
export function renderDailyForecast(containerId, dailyData) {
  const container = document.getElementById(containerId);
  if (!container || !dailyData || dailyData.length === 0) return;

  container.innerHTML = dailyData.slice(0, 7).map((day, idx) => {
    const isToday = idx === 0;
    const popClass = day.pop > 50 ? 'pop-high' : day.pop > 25 ? 'pop-med' : 'pop-low';

    return `
      <div class="forecast-day-card ${isToday ? 'is-today' : ''}">
        <div class="card-day-header">
          <span class="day-title">${isToday ? 'Today' : day.dayName}</span>
          <span class="day-date">${day.formattedDate}</span>
        </div>
        <div class="card-icon-wrap">
          <div class="weather-symbol icon-${day.icon}"></div>
          <span class="condition-name">${day.condition}</span>
        </div>
        <div class="card-temp-range">
          <span class="temp-max">${day.maxTemp}°</span>
          <div class="temp-bar-wrap">
            <div class="temp-bar-fill" style="width: ${Math.min(100, (day.maxTemp / 45) * 100)}%"></div>
          </div>
          <span class="temp-min">${day.minTemp}°</span>
        </div>
        <div class="card-pop-wrap">
          <span class="pop-pill ${popClass}">💧 ${day.pop}%</span>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render or update 24-hour hourly trend line chart with Chart.js
 */
export function renderHourlyChart(canvasId, hourlyData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !hourlyData) return;

  const ctx = canvas.getContext('2d');

  // Gradient for temperature line (Emerald Theme)
  const tempGradient = ctx.createLinearGradient(0, 0, 0, 200);
  tempGradient.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
  tempGradient.addColorStop(1, 'rgba(16, 185, 129, 0.02)');

  // If chart already exists, destroy before re-render
  if (hourlyChartInstance) {
    hourlyChartInstance.destroy();
  }

  hourlyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: hourlyData.labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: hourlyData.temps,
          borderColor: '#10b981',
          backgroundColor: tempGradient,
          borderWidth: 2.5,
          tension: 0.38,
          fill: true,
          pointBackgroundColor: '#10b981',
          pointHoverRadius: 6,
          pointRadius: 3,
          yAxisID: 'y'
        },
        {
          label: 'Rain Probability (%)',
          data: hourlyData.precipitationProb,
          type: 'bar',
          backgroundColor: 'rgba(52, 211, 153, 0.5)',
          borderRadius: 4,
          barThickness: 12,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: 'Inter, system-ui, sans-serif', size: 12 },
            usePointStyle: true,
            boxWidth: 8
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.9)',
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 6
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temp (°C)',
            font: { size: 11 }
          },
          grid: { color: 'rgba(203, 213, 225, 0.3)' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'Rain (%)',
            font: { size: 11 }
          },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}
