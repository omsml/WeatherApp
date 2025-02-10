const url = {ApiURL};
const apiKey = {ApiKey};
// const url = 'https://api.openweathermap.org/data/2.5/weather';
// const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

let lastWeatherCondition = 'clear'; // Store last weather condition

// Default city on load
$(document).ready(function () {
    weatherFn('Bhubaneswar');
    updateDateTime();
    setInterval(updateDateTime, 1000); // Update time every second
    setInterval(() => weatherFn($('#city-name').text()), 600000); // Refresh weather every 10 mins
});

// Fetch weather data
async function weatherFn(cName) {
    const tempUrl = `${url}?q=${cName}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(tempUrl);
        const data = await res.json();

        if (res.ok) {
            weatherShowFn(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Display weather data
function weatherShowFn(data) {
    $('#city-name').text(data.name);
    $('#temperature').html(`${data.main.temp}°C`);
    $('#description').text(capitalizeFirstLetter(data.weather[0].description));
    $('#wind-speed').html(`🌬 Wind Speed: ${data.wind.speed} m/s`);

    // Weather icon
    const iconCode = data.weather[0].icon;
    const iconBaseUrl = "https://openweathermap.org/img/wn/";
    $('#weather-icon').attr('src', `${iconBaseUrl}${iconCode}@2x.png`);
    $('#weather-icon').attr('alt', data.weather[0].description);

    // Store last weather condition and update background
    lastWeatherCondition = data.weather[0].main.toLowerCase();
    changeBackground();

    $('#weather-info').fadeIn();
}

// Function to update date & time
function updateDateTime() {
    $('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
}

// Change background dynamically based on weather and theme
function changeBackground() {
    let lightModeColors = {
        clear: 'linear-gradient(to right, #ffcc00, #ff8800)', // Sunny
        clouds: 'linear-gradient(to right, #bdc3c7, #2c3e50)', // Cloudy
        rain: 'linear-gradient(to right, #1e3c72, #2a5298)', // Rainy
        snow: 'linear-gradient(to right, #83a4d4, #b6fbff)', // Snowy
        thunderstorm: 'linear-gradient(to right, #141e30, #243b55)', // Thunderstorm
        drizzle: 'linear-gradient(to right, #a8c0ff, #3f2b96)', // Drizzle
        default: 'linear-gradient(to right, #4CAF50, #2196F3)' // Default
    };

    let darkModeColors = {
        clear: 'linear-gradient(to right,rgb(174, 173, 171), #ffcc00)', // Dark sunny
        clouds: 'linear-gradient(to right, #2c3e50, #4b6cb7)', // Dark cloudy
        rain: 'linear-gradient(to right, #0f2027, #203a43)', // Dark rainy
        snow: 'linear-gradient(to right, #37474f, #78909c)', // Dark snowy
        thunderstorm: 'linear-gradient(to right, #000000, #434343)', // Dark thunderstorm
        drizzle: 'linear-gradient(to right, #232526, #414345)', // Dark drizzle
        default: 'linear-gradient(to right, #1d2671, #c33764)' // Dark default
    };

    let isDarkMode = $('body').hasClass('dark-mode');
    let bgColor = isDarkMode ? darkModeColors[lastWeatherCondition] || darkModeColors.default
                             : lightModeColors[lastWeatherCondition] || lightModeColors.default;

    $('body').css('background', bgColor);
}

// Dark Mode Toggle with Background Fix
$('#theme-toggle').on('click', function () {
    $('body').toggleClass('dark-mode');

    // Update button icon
    if ($('body').hasClass('dark-mode')) {
        $(this).html('<i class="fas fa-sun"></i>'); // Light mode icon
    } else {
        $(this).html('<i class="fas fa-moon"></i>'); // Dark mode icon
    }

    // Ensure background updates correctly
    changeBackground();
});

// Capitalize first letter of weather description
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
