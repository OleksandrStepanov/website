/* JSON request*/
function defPos(pos) {
    var weatherAPI = 'http://api.openweathermap.org/data/2.5/forecast/daily?'+pos+'&APPID=c795fd41bd4be40c42b0bc86ac7aa33c&units=metric&cnt=8';
    $.getJSON(weatherAPI, function (response) {
            localStorage.defaultWeather = JSON.stringify({
                timestamp: (new Date()).getTime(),	
                data: response
            });
        console.log(localStorage);
        loadData();
        });
}

/*Function that parsing JSON response and filling out data on the index page*/
function loadData(flag){
    var cache = JSON.parse(localStorage.defaultWeather);
    if (flag==='madeNew'){
        defPos('q='+cache.data.city.name)
    }
    var tableToday=['todayDate','cityTitle','todayPic','todayTemp','todayCond','todayMin','todayMax','todayPrecip','todayHumidity','todayWind','todayPressure'];
    var nextDT=['dummy',['t1Date','t1Temp','t1Pic','t1Cond'],['t2Date','t2Temp','t2Pic','t2Cond'],['t3Date','t3Temp','t3Pic','t3Cond'],['t4Date','t4Temp','t4Pic','t4Cond']];
    for(var i= 0, ii=0; i<tableToday.length;i++){
        switch (tableToday[i]){
            case 'cityTitle':
                document.getElementById('cityTitle').innerHTML=cache.data.city.name+', '+ cache.data.city.country;
                break;
            case 'todayDate':
                var tmpDate=dateHand(cache.data.list[ii].dt);
                if (tmpDate==='1'){ 
                    ii=1;
                }
                var monthDate=dateHand(cache.data.list[ii].dt);
                document.getElementById('todayDate').innerHTML=monthDate;
                break;
            case 'todayPic':
                document.getElementById('todayPic').innerHTML='<img src="img/'+cache.data.list[ii].weather[0].icon+'.png" alt="'+cache.data.list[ii].weather[0].description+'">';
                break;
            case 'todayTemp':
                document.getElementById('todayTemp').innerHTML= cache.data.list[ii].temp.day.toFixed(0)+'&deg;C';
                break;
            case 'todayCond':
                document.getElementById('todayCond').innerHTML= cache.data.list[ii].weather[0].description;
                break
            case 'todayMin':
                document.getElementById('todayMin').innerHTML= cache.data.list[ii].temp.min.toFixed(0)+'&deg;C';
                break;
            case  'todayMax':
                document.getElementById('todayMax').innerHTML= cache.data.list[ii].temp.max.toFixed(0)+'&deg;C';
                break;
            case 'todayPrecip':
                if (!(cache.data.list[ii].rain)){
                    document.getElementById('todayPrecip').innerHTML=  '0 mm';
                    break;
                }else{document.getElementById('todayPrecip').innerHTML= cache.data.list[ii].rain +' mm';
                break;}

            case 'todayWind':
                var direction=windDirection(cache.data.list[ii].deg);
                document.getElementById('todayWind').innerHTML= direction+', '+cache.data.list[ii].speed+' m/s';
                break;
            case 'todayHumidity':
                document.getElementById('todayHumidity').innerHTML= cache.data.list[ii].humidity+' %';
                break;
            case 'todayPressure':
                document.getElementById('todayPressure').innerHTML= cache.data.list[ii].pressure+' hpa';
                break;
        }
    }
    for(var y= 1, zz=1+ii; y<5, zz<5+ii;y++,zz++){//zz -index for iterating data in json for 4 next days; y-index for iterating in nextDT array which holds object id's ; x-index for iterating inside array elements in nextDT
        for(var x=0;x<4;x++) {
            /*filling out data for 4 next days*/
            switch (nextDT[y][x]) {
                case nextDT[y][0]:
                    var mDate = dateSmall(cache.data.list[zz].dt);
                    document.getElementById(nextDT[y][0]).innerHTML = mDate;
                    break;
                case  nextDT[y][1]:
                    document.getElementById(nextDT[y][1]).innerHTML = cache.data.list[zz].temp.day.toFixed(0) + '&deg;C';
                    break;
                case nextDT[y][2]:
                    document.getElementById(nextDT[y][2]).innerHTML='<img src="img/'+cache.data.list[zz].weather[0].icon+'.png" alt="'+cache.data.list[zz].weather[0].description+'">';
                    break;
                case nextDT[y][3]:
                    document.getElementById(nextDT[y][3]).innerHTML=cache.data.list[zz].weather[0].description;
                    break;
            }
        }
    }

}


/* Date handler for Today forecast with shifting feature in case if in JSON response first date stamp mismatch with local date */
function dateHand(dUnix){
    var lTime= new Date(),lDay=lTime.getDate();//getting our local time for verifying date stamp
    var dTime= new Date(dUnix*1000),
        month=dTime.getMonth(),
        day=dTime.getDate();
    if ((lDay%day)!=0){   // in case if first time date refer to yesterday, making request for shift  note what will happen at 1st day of month
        return '1';
    }
    var monthArary=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
    return monthArary[month]+' '+day;
}

/* Date handler for next 4 day forecast*/
function dateSmall(dUnix){
    var dTime= new Date(dUnix*1000),
        month=dTime.getMonth(),
        day=dTime.getDate();
    var monthArary=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
    return monthArary[month]+' '+day;
}


/* Function that helps to calculate wind direction */
function windDirection(degree){
    var val=parseInt(degree/22.5 +0.5);//adding 0,5 for proper truncation
    var dirArray=["N","NNE","NE","ENE","E","ESE", "SE", "SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
    return dirArray[(val%16)];//angle changes at every 22.5 degrees, 360/22.5=16, there is 16 directions
}

/* Checking if weather forecast has been launched on this browser */
if(typeof localStorage.defaultWeather==='undefined'){
    defPos('q=Lviv'); 
}else{
    loadData('madeNew'); 
}