// Foursquare API Info
const clientId = '3D3ASU05HNKBOFM2QNX4OI4Q0MPTEAKMHXWWKSYJH5DKCFZG';
const clientSecret = 'MLKLQ54FOXWFGF3Z32O0JGMXAPV1ZWKBNS3VUOBHRSSLEPUQ';
const url = 'https://api.foursquare.com/v2/venues/explore?near=';

// OpenWeather Info
const openWeatherKey = '1dd3fab34e3b93536f22c5e087ee7849';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Page Elements
const $input = $('#city');
const $submit = $('#button');
const $destination = $('#destination');
const $container = $('.container');
const $venueDivs = [$("#venue1"), $("#venue2"), $("#venue3"), $("#venue4")];
const $weatherDiv = $("#weather1");
const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const convertKToF = k => ((k - 273.15) * 9 / 5 + 32).toFixed(0);

// Add AJAX functions here:
const getVenues = async () => {
  const city = $input.val()
  const urlToFetch = `${url}${city}&limit=10&client_id=${clientId}&client_secret=${clientSecret}&v=20210907`
  try {
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json()
      console.log(jsonResponse)
      const venues = jsonResponse.response.groups[0].items.map(item => item.venue)
      console.log(venues)
      return venues
    }
  } catch(error) {
    console.log(error)
  }
}

const getForecast = async () => {
  const urlToFetch = `${weatherUrl}?q=${$input.val()}&APPID=${openWeatherKey}`
  try {
    const response = await fetch(urlToFetch)
    if (response.ok) {
      const jsonResponse = await response.json()
      console.log('Weather response:')
      console.log(jsonResponse)
      return jsonResponse
    }
  } catch(error) {
    console.log(error)
  }
}


// Render functions
const renderVenues = (venues) => {
  $venueDivs.forEach(($venue, index) => {
    const venue = venues[index]
    const venueIcon = venue.categories[0].icon
    const venueImgSrc = `${venueIcon.prefix}bg_64${venueIcon.suffix}`
    let venueContent = `
      <h2>${venue.name}</h2>
      <img class="venueimage" src="${venueImgSrc}"/>
      <h3>Address:</h3>
      <p>${venue.location.address}</p>
      <p>${venue.location.city}</p>
      <p>${venue.location.country}</p>`;
    $venue.append(venueContent);
  });
  $destination.append(`<h2>${venues[0].location.city}</h2>`);
}

const renderForecast = (day) => {
	let weatherContent = `
  <h2> Temperature: ${convertKToF(day.main.temp)}&deg;F</h2>
	<h2> Condition: ${day.weather[0].description}</h2>
  <h2> High: ${convertKToF(day.main.temp_max)}&deg;F Low: ${convertKToF(day.main.temp_min)}&deg;F</h2>
  <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="weathericon" />
  <h2>${weekDays[(new Date()).getDay()]}</h2>`;
  $weatherDiv.append(weatherContent);
}

const executeSearch = () => {
  $venueDivs.forEach(venue => venue.empty());
  $weatherDiv.empty();
  $destination.empty();
  $container.css("visibility", "visible");
  getVenues().then(venues => renderVenues(venues))
  getForecast().then(forecast => renderForecast(forecast))
  return false;
}

$submit.click(executeSearch)