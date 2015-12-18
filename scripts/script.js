$(document).ready(function(){
    $('#btnGetWeather').click(function () {
        $.getJSON(
        'http://api.openweathermap.org/data/2.5/forecast/daily?q=' 
        + $('#inputCityName',val()) + '&APPID=c795fd41bd4be40c42b0bc86ac7aa33c&cnt=16&units=metric' + '&lang=ua' +  '&callback=?',
        function(data) {
            $('#tempToday').html(data.list[0].temp.day);
            $('#tempTomorrow').html(data.list[1].temp.day);
            $('#tempAfterTomorrow').html(data.list[2].temp.day);
            $('#pressureToday').html(data.list[0].pressure);
            $('#pressureTomorrow').html(data.list[1].pressure);
            $('#pressureAfterTomorrow').html(data.list[2].pressure);
            $('#iconToday').html('<img src="images/'+ data.list[0].weather[0].icon + '.png" alt="Weather icon">');
            $('#iconTomorrow').html('<img src="images/'+ data.list[1].weather[0].icon + '.png" alt="Weather icon">');
            $('#iconAfterTomorrow').html('<img src="images/'+ data.list[2].weather[0].icon + '.png" alt="Weather icon">');
        });
    });
});


       