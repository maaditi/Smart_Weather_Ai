const apiKey = "f73fb3f451e228c5c6745abc45c8f9a2";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

function getWeather(city) {
  const cityName = city || document.getElementById("cityInput").value;
  fetch(apiUrl + cityName + `&appid=${apiKey}`)
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => {
      const temp = Math.round(data.main.temp);
      const condition = data.weather[0].main.toLowerCase();
      const city = data.name;
      const mood = getMood(temp);
      const food = getFoodSuggestion(condition);
      const flights = getFlightStatus(condition);

      document.getElementById("weatherResult").innerHTML = `
        <h3>${city}</h3>
        <p>🌡️ Temp: ${temp}°C</p>
        <p>☁️ Condition: ${condition}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind: ${data.wind.speed} km/h</p>
      `;

      document.getElementById("moodFoodSuggestion").innerHTML = `
        <p>🧠 Mood: ${mood}</p>
        <p>🍛 Suggested Food: ${food}</p>
      `;

      document.getElementById("flightStatus").innerHTML = `
        <p>📡 Flight Update: ${flights}</p>
      `;

      document.getElementById(
        "cityMap"
      ).src = `https://maps.google.com/maps?q=${city}&output=embed`;
    })
    .catch(() => {
      document.getElementById("weatherResult").innerHTML = "❌ City not found!";
    });
}

function getMood(temp) {
  if (temp < 10) return "Cozy and reflective 🧣";
  if (temp < 20) return "Relaxed and calm 🍂";
  if (temp < 30) return "Energetic and happy 😄";
  return "Sweaty but cheerful 🥵";
}

function getFoodSuggestion(condition) {
  if (condition.includes("rain")) return "Hot soup or pakoras 🌧️";
  if (condition.includes("clear")) return "Cold drinks and salad 🥗";
  if (condition.includes("cloud")) return "Coffee and sandwiches ☁️";
  return "Comfort food 🍝";
}

function getFlightStatus(condition) {
  if (["storm", "rain", "fog"].some((word) => condition.includes(word)))
    return "⚠️ Some flights might be delayed or canceled.";
  return "✅ Flights are operating normally.";
}

// Voice Recognition
function startVoice() {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = function (event) {
    const command = event.results[0][0].transcript.toLowerCase();
    if (command.includes("weather in")) {
      const city = command.split("weather in")[1].trim();
      document.getElementById("cityInput").value = city;
      getWeather(city);
    } else if (command.includes("about")) {
      window.location.hash = "#about";
    } else if (command.includes("flight")) {
      window.location.hash = "#flights";
    } else if (command.includes("map")) {
      window.location.hash = "#map";
    } else {
      alert("Try saying 'weather in Mumbai' or 'show map'");
    }
  };

  recognition.onerror = function (event) {
    alert("Voice recognition error: " + event.error);
  };
}
function updateWeatherBackground(condition) {
  document.body.classList.remove("sunny", "rainy", "cloudy");

  if (condition.includes("Clear")) {
    document.body.classList.add("sunny");
  } else if (condition.includes("Rain") || condition.includes("Thunderstorm") || condition.includes("Drizzle")) {
    document.body.classList.add("rainy");
  } else if (condition.includes("Cloud")) {
    document.body.classList.add("cloudy");
  }
}

// Example: Call this after getting weather data
fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY`)
  .then(res => res.json())
  .then(data => {
    const weather = data.weather[0].main; // e.g., "Clear", "Rain", "Clouds"
    updateWeatherBackground(weather);
  });
/* ---- Background swap based on temperature ---- */
function updateTempBackground(temp) {
  document.body.classList.remove("cold", "cool", "warm", "hot");

  if (temp < 10) {
    document.body.classList.add("cold");
  } else if (temp < 20) {
    document.body.classList.add("cool");
  } else if (temp < 30) {
    document.body.classList.add("warm");
  } else {
    document.body.classList.add("hot");
  }
}

/* ---- MAIN weather fetch ---- */
function getWeather(city) {
  const cityName = city || document.getElementById("cityInput").value;
  fetch(apiUrl + cityName + `&appid=${apiKey}`)
    .then((response) => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then((data) => {
      const temp      = Math.round(data.main.temp);         // °C
      const condition = data.weather[0].main.toLowerCase(); // clouds, rain, …
      const city      = data.name;

      /* 1️⃣  update animated background */
      updateTempBackground(temp);

      /* 2️⃣  rest of your UI logic stays the same */
      const mood  = getMood(temp);
      const food  = getFoodSuggestion(condition);
      const flights = getFlightStatus(condition);

      document.getElementById("weatherResult").innerHTML = `
        <h3>${city}</h3>
        <p>🌡️ Temp: ${temp}°C</p>
        <p>☁️ Condition: ${condition}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind: ${data.wind.speed} km/h</p>
      `;

      document.getElementById("moodFoodSuggestion").innerHTML = `
        <p>🧠 Mood: ${mood}</p>
        <p>🍛 Suggested Food: ${food}</p>
      `;

      document.getElementById("flightStatus").innerHTML = `
        <p>📡 Flight Update: ${flights}</p>
      `;

      document.getElementById("cityMap").src =
        `https://maps.google.com/maps?q=${city}&output=embed`;
    })
    .catch(() => {
      document.getElementById("weatherResult").innerHTML = "❌ City not found!";
    });
}

/* Optional: call getWeather once with a default city */
getWeather("London");
function updateLiveWeatherEffects(condition) {
  const sun = document.querySelector(".sun");
  const clouds = document.querySelector(".clouds");
  const rain = document.querySelector(".rain");

  sun.style.display = "none";
  clouds.style.display = "none";
  rain.style.display = "none";

  if (condition.includes("clear")) {
    sun.style.display = "block";
  } else if (condition.includes("cloud")) {
    clouds.style.display = "block";
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    rain.style.display = "block";
    clouds.style.display = "block";
  }
}
