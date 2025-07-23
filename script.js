// Weather App JS - OpenWeatherMap API, UI Logic, Animations

const API_KEY = '58503c7b0851b98dfc51e03dc8c986f4'; // <-- Replace with your OpenWeatherMap API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

const searchForm = document.getElementById('search-form');
const locationInput = document.getElementById('location-input');
const resultContainer = document.getElementById('result-container');
const searchCard = document.getElementById('search-card');
const searchContainer = document.getElementById('search-container');

// Helper: Get weather icon URL from OpenWeatherMap
function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
}

// Helper: SVG icons for humidity, wind, error
const humiditySVG = `<img src="assets/icons/water.png" alt="Humidity" style="width:32px;height:32px;vertical-align:middle;">`;
const windSVG = `<img src="assets/icons/wind.png" alt="Wind" style="width:32px;height:32px;vertical-align:middle;">`;
const errorSVG = `<svg width="64" height="64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="32" fill="#23243a"/><path d="M20 44L44 20" stroke="#6dd5ed" stroke-width="3"/><path d="M44 44L20 20" stroke="#6dd5ed" stroke-width="3"/></svg>`;

// Show weather card
function showWeather(data) {
  const { name, weather, main, wind } = data;
  const iconUrl = getWeatherIcon(weather[0].icon);
  const temp = Math.round(main.temp);
  const condition = weather[0].main;
  const humidity = main.humidity;
  const windSpeed = wind.speed;

  resultContainer.innerHTML = `
    <div class="weather-card">
      <img src="${iconUrl}" alt="${condition}" class="weather-icon" />
      <div class="temp">${temp}&deg;C</div>
      <div class="condition">${weather[0].description}</div>
      <div class="weather-details">
        <div class="detail"><span class="icon">${humiditySVG}</span> Humidity: ${humidity}%</div>
        <div class="detail"><span class="icon">${windSVG}</span> Wind: ${Math.round(windSpeed * 3.6)} km/h</div>
      </div>
    </div>
  `;
}

// Show error card
function showError() {
  resultContainer.innerHTML = `
    <div class="weather-card">
      <div class="error-card">
        <div class="error-illustration">${errorSVG}</div>
        <div class="error-message">Oops! Location not found!</div>
      </div>
    </div>
  `;
}

// Handle search
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = locationInput.value.trim();
  if (!city) return;

  // Hide autocomplete dropdown
  if (typeof suggestionBox !== 'undefined') suggestionBox.innerHTML = '';

  resultContainer.innerHTML = '';
  // Move search box up
  if (searchContainer.classList.contains('search-center')) {
    searchContainer.classList.remove('search-center');
    searchContainer.classList.add('search-up');
  }
  // Fetch weather
  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    showWeather(data);
  } catch (err) {
    showError();
  }
});

// Allow new search after error/weather
resultContainer.addEventListener('click', () => {
  resultContainer.innerHTML = '';
  locationInput.value = '';
  locationInput.focus();
});

// Focus input on load
window.onload = () => {
  locationInput.focus();
};

const input = document.getElementById('location-input');
const suggestionBox = document.createElement('div');
suggestionBox.className = 'autocomplete-suggestions';
input.parentNode.appendChild(suggestionBox);

input.addEventListener('input', async function() {
  const query = input.value.trim();
  if (query.length < 2) {
    suggestionBox.innerHTML = '';
    return;
  }
  const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`);
  const cities = await res.json();
  suggestionBox.innerHTML = cities.map(city =>
    `<div class="suggestion-item">${city.name}, ${city.country}</div>`
  ).join('');
});

suggestionBox.addEventListener('click', function(e) {
  if (e.target.classList.contains('suggestion-item')) {
    input.value = e.target.textContent;
    suggestionBox.innerHTML = '';
  }
});
