function getWeatherByCity(lang, fnOK, fnError, cityName) {
	$.getJSON(
		'https://api.openweathermap.org/data/2.5/forecast/daily?q='
		+ cityName + '&APPID=c795fd41bd4be40c42b0bc86ac7aa33c&cnt=16&units=metric' + '&lang=' + lang + '&callback=?',
		function (data) {
			fnOK.call(this, data);
		}
	);
}
