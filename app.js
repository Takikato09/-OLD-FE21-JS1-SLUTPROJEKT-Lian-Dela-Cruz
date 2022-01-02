const body = document.body;
const searchInput = document.querySelector('#search-input');
const imgSrc = document.querySelector('.todays-icon'); 
const currentWeather = document.querySelector('.current-weather');
const futureWeatherMessage = document.querySelector('#future-message');
const futureWeather = document.querySelector('#future-weather');
const weatherWrapper = document.querySelector('.weather-wrapper');
const submitBtn = document.querySelector('#submit-button');
const errorMessage = document.querySelector('#error-message');
const loadingMessage = document.querySelector('.loading-message');

submitBtn.addEventListener('click', searchCity);


//Main function where everything happens: it is all connected to all the functions I created below
function searchCity(event) {
    event.preventDefault();
    const searchCity = searchInput.value;
    const currentWeatherUrl = makeCurrentWeatherUrl(searchCity);
    const fiveDayUrl = makeFiveDayUrl(searchCity);
    resetUI();
    animeMessage('Searching..');
    getCurrentWeather(currentWeatherUrl);
    getFiveDaysWeather( fiveDayUrl);
};

// Background image depends on time of day (This is the extra function for the user)
const currentHour = new Date().getHours();
if (body) {
    if (1 <= currentHour && currentHour < 8) {
        body.style.backgroundImage = " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('./img/galaxy3.jpg')";
    }
     else if (8 <= currentHour && currentHour < 16){
        body.style.backgroundImage = " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('./img/galaxy4.jpg')";
    }
    else if (16 <= currentHour && currentHour < 21) {
        body.style.backgroundImage = " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('./img/galaxy.jpg')";
    }
    else {
        body.style.backgroundImage = " linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8)), url('./img/midnight.jpg')";
        
    }
}
//Function for getting weather icons
function makeImageUrl(icon){
    return `https://www.weatherbit.io/static/img/icons/${icon}.png`;
};

//Functions for the CURRENT/TODAYS weather forecast: including API, FETCH, and to DISPLAY current forecast
function makeCurrentWeatherUrl(cityName){
    return `https://api.weatherbit.io/v2.0/current?key=20873ff18f82429eb25dc1b0153b023d&city=${cityName}&lang=sv`;
};

function getCurrentWeather(currentWeatherUrl) {
    fetch(currentWeatherUrl).then(
            function(response) {
                return response.json();
            }
        ).then(
            function(forecast) {
                displayCurrentForecast(forecast)
                loadingMessage.textContent = '';
        }).catch(
            function(error){
                console.error(error);
                displayError();
            }
        )
};

function displayCurrentForecast(forecast){
    currentWeather.style.display = 'block';
    const cityName = forecast.data[0].city_name;
    document.querySelector('#todays-city-name').textContent = cityName;

    const cityTemp = forecast.data[0].temp;
    document.querySelector('#todays-temp').textContent = 'Temperaturen just nu är '+ cityTemp + '° C';

    const icon = forecast.data[0].weather.icon;
    const imgSrc = makeImageUrl(icon)
    document.querySelector('.todays-icon').src = imgSrc;

    const cityDesc = forecast.data[0].weather.description;
    document.querySelector('#todays-description').textContent = cityDesc;

    const cityWindSpd = forecast.data[0].wind_spd;
    document.querySelector('#todays-windspeed').textContent = 'Vindhastighet: '+ cityWindSpd + 'm/s';

    const cityHumid = forecast.data[0].rh;
    document.querySelector('#todays-humidity').textContent ='Luftfuktighet: '+ cityHumid + '%';
}

//Functions for the NEXT 5 DAYS weather forecast: including API, FETCH, and to DISPLAY 5 days forecast
function makeFiveDayUrl(cityName){
    return `https://api.weatherbit.io/v2.0/forecast/daily?key=20873ff18f82429eb25dc1b0153b023d&city=${cityName}&lang=sv&days=6`;
}

function getFiveDaysWeather(fiveDayUrl){
    fetch(fiveDayUrl).then(
        function(response) {
            return response.json();
        }
    ).then(
        function(forecast) {
            display5DaysForecast(forecast)
    }).catch(
        function(error){
            console.error(error);
            displayError(error);
        }
    )
}

function display5DaysForecast(forecast) {
    futureWeatherMessage.textContent = 'Nästa 5 dagars väder';

    for (let i=1; i<forecast.data.length; i++) {
        const listItem = document.createElement('li'); 
        futureWeather.appendChild(listItem);

        const futureTemp = document.createElement('h4');
        listItem.appendChild(futureTemp)
        futureTemp.textContent = forecast.data[i].temp + '° C';

        const date = document.createElement('h3');
        listItem.appendChild(date);
        date.textContent = forecast.data[i].datetime;

        const img = document.createElement('img');
        const icon = forecast.data[i].weather.icon;
        const imgSrc = makeImageUrl(icon);
        listItem.appendChild(img);
        img.src = imgSrc;

        const futureDesc = document.createElement('h4');
        listItem.appendChild(futureDesc);
        futureDesc.textContent = forecast.data[i].weather.description; 
    }
    weatherWrapper.style.display = 'flex';
} 

//Function for RESET, to Cleare search results, ERROR, and ANIMATION Messages
function clearSearchResults(){
    weatherWrapper.style.display = 'none';
    const listItems = document.querySelectorAll('#future-weather li');
        for(let i = 0; i<listItems.length; i++){
            const el = listItems[i];
            el.remove();
        }
};

function resetUI() {
    clearSearchResults();
    currentWeather.style.display = '';
    futureWeather.style.display = '';
};

function displayError(){
    currentWeather.style.display = 'none';
    futureWeather.style.display = 'none';
    loadingMessage.textContent = '';
    errorMessage.textContent = 'Cannot find the city you are looking for. Try again!';   
};

const animationMessage = anime({
    targets: loadingMessage,
    scale: 2,
    duration: 1000,
    direction: 'alternate',
})

function animeMessage(message){
    loadingMessage.innerText = message;
    animationMessage.play();
};