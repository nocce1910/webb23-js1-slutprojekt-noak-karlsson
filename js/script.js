// Lyssna på formulärets submit-händelse och kör funktionen när det sker
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Förhindra att formuläret skickas automatiskt

    var city = document.getElementById('city-input').value; // Hämta staden från textinputen
    var hours = parseInt(document.getElementById('hours-input').value); // Hämta antalet timmar från select-elementet
    var apiKey = '47847de3fc979301dc3f9f38970b35d8'; // API-nyckeln för OpenWeatherMap

    var currentWeatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey + '&lang=sv'; // URL för att hämta aktuellt väder
    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&lang=sv'; // URL för att hämta väderprognos

    // Hämta och visa det nuvarande vädret
    fetch(currentWeatherUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Kunde inte hitta staden. Vänligen försök igen.');
            }
            return response.json();
        })
        .then(function (data) {
            displayCurrentWeather(data); // Visa det nuvarande vädret på sidan
        })
        .catch(function (error) {
            displayError(error.message); // Visa felmeddelande om något går fel
        });

    // Hämta och visa väderprognosen
    fetch(forecastUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Kunde inte hämta väderprognosen. Försök igen senare.');
            }
            return response.json();
        })
        .then(function (data) {
            displayForecast(data, hours); // Visa väderprognosen på sidan
        })
        .catch(function (error) {
            displayError(error.message); // Visa felmeddelande om något går fel
        });
});

// Funktion för att visa det nuvarande vädret på sidan
function displayCurrentWeather(data) {
    var description = data.weather[0].description; // Beskrivning av vädret
    var temperature = Math.round(data.main.temp - 273.15); // Temperatur i Celsius
    var windSpeed = data.wind.speed; // Vindhastighet
    var iconCode = data.weather[0].icon; // Ikonkod för vädret
    var iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png'; // URL för vädretikon

    document.getElementById('current-description').textContent = description; // Visa beskrivningen på sidan
    document.getElementById('current-temperature').textContent = temperature + '°C'; // Visa temperaturen på sidan
    document.getElementById('current-wind-speed').textContent = windSpeed + ' m/s'; // Visa vindhastigheten på sidan
    document.getElementById('current-icon').src = iconUrl; // Visa vädretikonen på sidan

    // Uppdatera sidans utseende baserat på det nuvarande vädret
    var body = document.body;
    body.style.backgroundImage = 'url(' + iconUrl + ')'; // Sätt bakgrundsbild till vädretikonen
    body.style.backgroundSize = 'cover'; // Anpassa bakgrundsbilden till skärmstorleken
    body.style.color = '#fff'; // Sätt textfärg till vit
    body.style.padding = '20px'; // Lägg till lite padding runt innehållet

    // Lägg till ytterligare visuella anpassningar baserat på temperatur och väderförhållanden
    if (temperature > 25) {
        body.style.backgroundColor = 'rgb(255, 100, 100)'; // Röd bakgrundsfärg för hög temperatur
    } else if (temperature < 10) {
        body.style.backgroundColor = 'rgb(100, 100, 255)'; // Blå bakgrundsfärg för låg temperatur
    }
}

// Funktion för att visa väderprognosen på sidan
function displayForecast(data, hours) {
    var forecastList = data.list; // Lista med väderprognoser
    var forecastCount = Math.floor(hours / 3); // Antalet prognoser baserat på antalet timmar
    var forecastData = forecastList.slice(0, forecastCount); // Hämta de första prognoserna

    var forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; // Töm container för väderprognos

    forecastData.forEach(function (forecast, index) {
        var forecastTime = forecast.dt_txt.split(' ')[1].slice(0, 5); // Tiden från datumsträngen
        var temperature = Math.round(forecast.main.temp - 273.15); // Temperatur i Celsius
        var windSpeed = forecast.wind.speed; // Vindhastighet
        var iconCode = forecast.weather[0].icon; // Ikonkod för vädret
        var iconUrl = 'http://openweathermap.org/img/w/' + iconCode + '.png'; // URL för vädretikon

        var forecastElement = document.createElement('div');
        forecastElement.classList.add('forecast'); // Lägg till CSS-klassen för prognos

        var timeElement = document.createElement('p');
        timeElement.textContent = forecastTime;
        forecastElement.appendChild(timeElement);

        var iconElement = document.createElement('img');
        iconElement.src = iconUrl;
        iconElement.alt = forecast.weather[0].description;
        forecastElement.appendChild(iconElement);

        var temperatureElement = document.createElement('p');
        temperatureElement.textContent = temperature + '°C';
        forecastElement.appendChild(temperatureElement);

        var windSpeedElement = document.createElement('p');
        windSpeedElement.textContent = 'Wind Speed: ' + windSpeed + ' m/s';
        forecastElement.appendChild(windSpeedElement);

        forecastContainer.appendChild(forecastElement); // Lägg till prognoselementet i container
    });
}

// Funktion för att visa felmeddelande på sidan
function displayError(message) {
    var errorContainer = document.getElementById('error-message');
    errorContainer.textContent = message; // Visa felmeddelandetexten
    errorContainer.style.display = 'block'; // Visa felmeddelandekontainern
}
