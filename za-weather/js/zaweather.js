const lat = -32.35871980906897;
const lon = 20.62026635302537;

function fetchWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,cloudcover&daily=weathercode,temperature_2m_max,temperature_2m_min,cloudcover_mean&timezone=auto`;
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      const current = data.current_weather;
      document.getElementById('temperature').textContent = current.temperature;
      document.getElementById('wind').textContent = current.windspeed;
      document.getElementById('current-icon').textContent = weatherIcon(current.weathercode);

      let idx = data.hourly.time.indexOf(current.time);
      if (idx === -1) {
        const hour = current.time.slice(0, 13) + ':00';
        idx = data.hourly.time.indexOf(hour);
      }
      if (idx >= 0) {
        document.getElementById('humidity').textContent = data.hourly.relative_humidity_2m[idx];
        document.getElementById('cloud').textContent = data.hourly.cloudcover[idx];
      }

      const fc = document.getElementById('forecast');
      fc.innerHTML = '';
      for (let i = 0; i < data.daily.time.length; i++) {
        const day = new Date(data.daily.time[i]);
        const div = document.createElement('div');
        div.className = 'forecast-day';
        div.innerHTML = `<span>${day.toLocaleDateString(undefined,{weekday:'short'})}</span><span class="icon">${weatherIcon(data.daily.weathercode[i])}</span><span>${Math.round(data.daily.temperature_2m_max[i])}°</span>`;
        fc.appendChild(div);
      }

      const cloudFc = document.getElementById('cloud-forecast');
      cloudFc.innerHTML = '';
      for (let i = 0; i < data.daily.time.length; i++) {
        const div = document.createElement('div');
        div.className = 'forecast-day';
        div.textContent = `☁️ ${Math.round(data.daily.cloudcover_mean[i])}%`;
        cloudFc.appendChild(div);
      }

      const now = new Date(current.time);
      const sunTimes = SunCalc.getTimes(now, lat, lon);
      const moonTimes = SunCalc.getMoonTimes(now, lat, lon);
      const moonIllum = SunCalc.getMoonIllumination(now);

      function fmt(t) {
        return t ? t.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : 'N/A';
      }

      document.getElementById('sunrise').textContent = fmt(sunTimes.sunrise);
      document.getElementById('sunset').textContent = fmt(sunTimes.sunset);
      document.getElementById('moonrise').textContent = fmt(moonTimes.rise);
      document.getElementById('moonset').textContent = fmt(moonTimes.set);
      document.getElementById('moonphase').textContent = moonPhaseName(moonIllum.phase);
      document.getElementById('moonillum').textContent = Math.round(moonIllum.fraction * 100);
      document.getElementById('moonphase-icon').textContent = moonPhaseIcon(moonIllum.phase);
    })
    .catch(err => console.error('Weather fetch error:', err));
}

function moonPhaseName(phase) {
  const p = phase * 8;
  const phases = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'];
  return phases[Math.round(p) % 8];
}

function moonPhaseIcon(phase) {
  const icons = ['🌑','🌒','🌓','🌔','🌕','🌖','🌗','🌘'];
  return icons[Math.round(phase*8) % 8];
}

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code === 1) return '🌤️';
  if (code === 2) return '⛅';
  if (code === 3) return '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 86) return '❄️';
  if (code >= 95) return '⛈️';
  return '🌡️';
}

document.addEventListener('DOMContentLoaded', fetchWeather);
