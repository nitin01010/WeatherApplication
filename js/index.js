const cityName = document.querySelector("#cityName");
const searchBtn = document.querySelector("#Search");
const stateName = document.querySelector("#StateName");
const weatherName = document.querySelector("#wethername");
const tempCount = document.querySelector("#tem");
const weatherIcon = document.querySelector("#WeatherImageIcon");
const timeAndDate = document.querySelector("#timeandDate");
const country = document.querySelector("#Country");
const wind = document.querySelector("#Wind");
const windDir = document.querySelector("#wind_dir");
const humidity = document.querySelector("#humidity");
const feelsLike = document.querySelector("#feelslike_c");
const uv = document.querySelector("#Uv");
const pressure = document.querySelector("#pressure");
const chanceOfRain = document.querySelector("#chanceOfRain");
const GetLocation = document.querySelector("#Location");
const apiKey = "7795fb6b275c42419e853717242801";
let listSearc = document.querySelector("#listSearc");

const fetchWeatherData = async (location, apiKey) => {
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
    const data = await res.json();

    if (data?.error) {
      alert(`${data.error.message}`);
      return;
    }

    const { current, location: loc } = data;

    // Update UI
    weatherIcon.src = current.condition.icon;
    weatherName.textContent = current.condition.text;
    stateName.textContent = loc.name;

    const [date, time] = loc.localtime.split(" ");
    const [year, month, day] = date.split("-");

    const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    const fullDateObj = new Date(`${year}-${month}-${day}`);
    const weekday = weekdayNames[fullDateObj.getDay()];

    let [hour, minute] = time.split(":");
    hour = +hour;
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;

    timeAndDate.innerHTML = `${weekday}, ${+day} ${monthNames[+month - 1]} ${year} - ${hour}:${minute} ${ampm}`;

    tempCount.textContent = `${current.temp_c}°C`;
    country.innerHTML = `Region: ${loc.region}<br>${loc.tz_id}`;
    wind.textContent = `${current.wind_kph} Km/h`;
    windDir.textContent = current.wind_dir;
    humidity.textContent = `${current.humidity}%`;
    feelsLike.textContent = `${current.feelslike_c}°C`;
    pressure.textContent = `${current.pressure_mb} in`;
    chanceOfRain.textContent = `${current.precip_mm} mm`;

    const uvValue = current.uv;
    const uvLevel = uvValue <= 2 ? "Low" :
      uvValue <= 5 ? "Moderate" :
        uvValue <= 7 ? "High" :
          uvValue <= 10 ? "Very High" : "Extreme";
    uv.textContent = `${uvValue} (${uvLevel})`;

  } catch (err) {
    console.error("Fetch Error:", err);
    alert("Failed to fetch weather data. Please check your internet connection or try again later.");
  }
};

searchBtn.addEventListener("click", () => {
  const city = cityName.value.trim();

  if (!city) {
    alert("Please enter a city name.");
    return;
  }
  fetchWeatherData(city, apiKey);
  saveCity(city);
  cityName.value = "";
});

GetLocation.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const location = `${lat},${lon}`;
      fetchWeatherData(location, apiKey);
    },
    (error) => {
      alert("Failed to get location. Please allow location access.");
      console.error(error);
    }
  );
});

window.onload = () => {
  let cityList = JSON.parse(localStorage.getItem("cityList"));

  if (Array.isArray(cityList) && cityList.length > 0) {
    cityList.forEach(city => {
      let CityEle = document.createElement("p");
      CityEle.innerHTML = city;
      listSearc.append(CityEle);
      CityEle.addEventListener("click", () => {
        fetchWeatherData(CityEle.innerHTML,apiKey);
      })
      CityEle.classList.add("List")

    });

  }

};

function saveCity(city) {
  if (!city.trim()) return;
  let cityList = JSON.parse(localStorage.getItem('cityList')) || [];
  const cityLower = city.toLowerCase();
  if (!cityList.some(c => c.toLowerCase() === cityLower)) {
    cityList.push(city);
  }
  localStorage.setItem('cityList', JSON.stringify(cityList));
}