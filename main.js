// API Key voor WeatherAPI
const APIKEY = '0007546a14d54c8596e84614242405';

// Array voor opslaan en bijhouden locaties
let locations = [];

// Functie voor het checken of de locatie valide is
function isValidLocation(location) {
    return location && !locations.includes(location) && locations.length < 3;
}

// Functie voor het ophalen van de data
function getWeather(location) {
    fetch(`http://api.weatherapi.com/v1/current.json?key=${APIKEY}&q=${location}&lang=nl`)
        .then(response => response.json())
        .then(data => {
            if (!locations.includes(location)) {
                locations.push(location);
                addWeatherCard(data);
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Functie voor het toevoegen van een weer kaart
function addWeatherCard(weatherData) {
    const weatherCard = createWeatherCard(weatherData);
    weatherContainer.appendChild(weatherCard);
}

// Functie voor het creëeren van een weerkaart
function createWeatherCard(weatherData) {
    const weatherCard = document.createElement('div');
    weatherCard.className = 'col';

    const weatherIcon = getWeatherIcon(weatherData.current.condition.icon, weatherData.current.is_day);
    const localTime = formatLocalTime(weatherData.location.localtime);

    weatherCard.innerHTML = `
        <div class="card">
            <img src="${weatherIcon}" class="card-img-top weather-icon" alt="weather icon">
            <div class="card-body">
                <h5 class="card-title">${weatherData.location.name}</h5>
                <p class="card-text">
                    Temperatuur: ${weatherData.current.temp_c}°C<br>
                    Neerslag: ${weatherData.current.precip_mm} mm<br>
                    Lokale tijd: ${localTime}<br>
                    <small>${weatherData.current.condition.text}</small>
                </p>
                <button class="btn remove-button">Verwijder</button>
            </div>
        </div>
    `;

    // Event listener voor de verwijder knop
    const removeButton = weatherCard.querySelector('.remove-button');
    removeButton.addEventListener('click', function() {
        removeWeatherCard(weatherData.location.name);
        weatherCard.remove();
    });

    return weatherCard;
}

// Functie voor het verwijderen van een weer kaart
function removeWeatherCard(location) {
    // Verwijderen van de locatie van de array
    locations = locations.filter(loc => loc !== location);

    // Verwijderen van de kaart van DOM
    const cardToRemove = Array.from(weatherContainer.children).find(card => {
        const title = card.querySelector('.card-title').textContent;
        return title === location;
    });

    if (cardToRemove) {
        cardToRemove.remove();
    }

    // Updaten van input status
    updateInputState();
}

// Functie voor het updaten van input status van locatie input
function updateInputState() {
    if (locations.length < 3) {
        locationInput.disabled = false;
    } else {
        locationInput.disabled = true;
    }
}

// Functie voor het formatteren van de lokale tijd
function formatLocalTime(localtime) {
    const date = new Date(localtime);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Functie om het weer icoon op te halen
function getWeatherIcon(conditionIconUrl, isDay) {
    const timeOfDay = isDay ? 'day' : 'night';
    const conditionCode = conditionIconUrl.split('/').pop().split('.')[0];
    return `weather/64x64/${timeOfDay}/${conditionCode}.png`;
}

// Event listener voor het toevoegen van een locatie
weatherForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const location = locationInput.value.trim();
    if (isValidLocation(location)) {
        getWeather(location);
    }
});