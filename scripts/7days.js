/*Function that makes JSON request*/
function defPosLong(pos) {
    var weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast/daily?'+pos+'&APPID=c795fd41bd4be40c42b0bc86ac7aa33c&units=metric&cnt=8';
    $.getJSON(weatherAPI, function (response) {
        localStorage.defaultWeather = JSON.stringify({
            timestamp: (new Date()).getTime(),	// getTime() returns milliseconds
            data: response
        });
        console.log(localStorage);
        loadDataLong();
    });
}

/*Function that parsing JSON response and filling out data on the index page*/
function loadDataLong(flag) {
    var cache = JSON.parse(localStorage.defaultWeather);
    console.log(cache);
    console.log(cache.data.city.name);
    rollUP();
    if (flag === 'madeNew') {
        defPosLong('q=' + cache.data.city.name)
    }
    document.getElementById('cityTitle').innerHTML = cache.data.city.name + ', ' + cache.data.city.country;

    $.each(cache.data.list.slice(0,7), function(){
        rollDown(
            dateHandL(this.dt,'date'),
            dateHandL(this.dt,'day'),
            this.weather[0].icon,
            Math.round(this.temp.day) + '&deg;C',
            this.rain,
            this.humidity,
            this.pressure,
            windDirection(this.deg),
            this.speed,
            this.weather[0].description
        );
    });
}

function rollDown(dateD,day, icon, temp ,precip,hmd,prs,wind,speed,alt){
    var prc;
    if(typeof precip==='undefined'){
        prc='0 mm';
    } else{
        prc=precip+' mm';
    }

    var markup = '<tr>'+
        '<td class="sevenD">' + dateD + '</td>' + '<td class="sevenD">' + day + '</td>'+ '<td class="sevenOth">' + '<img width="73px" height="54px" src="../img/'+ icon +'.png" alt='+alt+'/>'+'<td class="sevenOth">' + temp + '</td>' +
        '<td class="sevenOth">' + prc + '</td>'+'<td class="sevenOth">' + hmd +' &#37;'+ '</td>'+'<td class="sevenOth">' + prs + ' hpa'+'</td>'+'<td class="sevenOth">' + wind + ', '+speed+' m/s'+'</td>'
        + '</tr>';
    sevenDays.insertRow(-1).innerHTML = markup; // Add rows
}


function rollUP(){
    sevenDays.innerHTML ='';
    var tmp='<caption>Forecast for seven days</caption>'+
    '<tr id="tableHeader">'+
    '<th>Date</th>'+
    '<th>Day</th>'+
    '<th>Conditions</th>'+
    '<th>Temperature</th>'+
    '<th>Precipitation</th>'+
    '<th>Humidity</th>'+
    '<th>Pressure</th>'+
    '<th>Wind</th>'+
    '</tr>';
    sevenDays.innerHTML=tmp;
}


/* Checking if weather forecast has been launched on this browser */
if(typeof localStorage.defaultWeather==='undefined'){
    defPosLong('q=Kiev'); //in case of first launch default location is Kiev
}else{
    loadDataLong('madeNew'); //in other case will pick last location and make request by that location
}


/*BUTTONS AND OTHER stuff*/

/*input form handler*/
$('#locationForm').submit(sLoc);

function sLoc(e) {
    e.preventDefault();
    var pos='q='+($("input:first").val());
    defPosLong(pos);
}

/*navigation button*/
function currentPosition(){
    if (navigator.geolocation) {
        console.log('succes');
        navigator.geolocation.getCurrentPosition(locFinded);
    } else {
        document.getElementById('cityTitle').innerHTML="Geolocation API not supported by your browser.";
        console.log("fail");
    }
}

/*Function that preparing position data for transfer into json request function*/
function locFinded(position){
    console.log(position.coords.latitude, position.coords.longitude);
    var pstn='lat='+position.coords.latitude+'&lon='+position.coords.longitude;
    console.log(pstn);
    defPosLong(pstn);
}


/* Date handler for Today forecast with shifting feature in case if in JSON response first date stamp mismatch with local date */
function dateHandL(dUnix,paramRq){
    var dTime= new Date(dUnix*1000),
        month=dTime.getMonth(),
        dDate=dTime.getDate(),
        day=dTime.getDay();
    var monthArray=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
    var dayArray=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    switch (paramRq){
        case 'date':
            return monthArray[month]+' '+dDate;
        case 'day':
            return dayArray[day];
    }

}

function windDirection(degree){
    var val=parseInt(degree/22.5 +0.5);//adding 0,5 for proper truncation
    var dirArray=["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirArray[(val%16)];//angle changes at every 22.5 degrees, 360/22.5=16, there is 16 directions
}