//variables and html elements
const apiKey = "846c0a7df3713ff7d77b431193803253";
const unsplashKey = "4zNP-jjz2VrzEqLRAHCgSUMbqXklKOw1AkGzehbYuZc";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const htmlCity = document.querySelector("#city");
const htmlTemperature = document.querySelector("#temperature span");
const htmlFeelsLike = document.querySelector("#feels span");
const htmlDescription = document.querySelector("#description");
const htmlWeatherIcon = document.querySelector("#weather-icon");
const htmlCountryFlag = document.querySelector("#countryFlag");
const htmlHumidty = document.querySelector("#humidity span");
const htmlWind = document.querySelector("#wind span");
const htmlWeatherContainer = document.querySelector("#weather-data");
const htmlBackground = document.querySelector("#wallpaper");
const htmlErrorText = document.querySelector("#error-text");

//functions
const renderWeatherData = async (city) => {
	try {
		const [data, dayOrNight] = await getWeatherData(city);
		const wallpaperData = await getWallpaperData(city, dayOrNight);
		const wallpaperURL = wallpaperData.urls.full;
		htmlCity.innerText = data.name;
		htmlTemperature.innerText = parseInt(data.main.temp);
		htmlFeelsLike.innerText = parseInt(data.main.feels_like);
		htmlDescription.innerText = data.weather[0].description;
		htmlWeatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
		htmlCountryFlag.src = `https://flagsapi.com/${data.sys.country}/flat/64.png`;
		htmlHumidty.innerText = data.main.humidity + "%";
		htmlWind.innerText = data.wind.speed + "km/h";
		htmlBackground.src = wallpaperURL;
		htmlWeatherContainer.classList.remove("hide");
		htmlErrorText.classList.add("hide");
	} catch (error) {
		htmlWeatherContainer.classList.add("hide");
		htmlErrorText.classList.remove("hide");
		htmlErrorText.innerText =
			"Cidade não encontrada. Verifique o nome e tente novamente.";
	}
};

const getWeatherData = async (city) => {
	const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
		city
	)}&units=metric&appid=${apiKey}&lang=pt_br`;

	const res = await fetch(apiWeatherURL);

	if (!res.ok) {
		throw new Error(`${res.status} - ${res.statusText}`);
	}

	const data = await res.json();
	const dayOrNight = isNightOrDay(data.timezone);

	return [data, dayOrNight];
};

const getWallpaperData = async (imgName, dayOrNight) => {
	const deviceOrientation = window.matchMedia(
		"(orientation: portrait)"
	).matches;
	const currentOrientation = deviceOrientation ? "portrait" : "landscape";
	const apiUnsplashURL = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(
		`${imgName} city ${dayOrNight}`
	)}&client_id=${unsplashKey}&orientation=${currentOrientation}`;

	const response = await fetch(apiUnsplashURL);
	const data = await response.json();
	return data.results[0];
};

const isNightOrDay = (timezone) => {
	const nowUTC = new Date();
	const localDate = new Date(nowUTC.getTime() + timezone * 1000);

	const localHour = localDate.getUTCHours().toString();
	if (localHour > 5 && localHour < 17) {
		return "during the day";
	} else {
		return "at night";
	}
};

//events
searchBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const city = cityInput.value;
	if (city.trim() === "") return;
	renderWeatherData(city);
	cityInput.value = "";
});

cityInput.addEventListener("keyup", (e) => {
	if (e.code === "Enter") {
		const city = e.target.value;
		if (city.trim() === "") return;
		renderWeatherData(city);
		cityInput.value = "";
	}
});
