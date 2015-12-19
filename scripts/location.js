/*Function  navigator*/
function currentPosition(){
    if (navigator.geolocation) {
        console.log('succes');
        navigator.geolocation.getCurrentPosition(locFinded);
    } else {
        document.getElementById('cityTitle').innerHTML="Geolocation API not supported by your browser.";
        console.log("fail");
    }
}

function locFinded(position){
    console.log(position.coords.latitude, position.coords.longitude);
    var pstn='lat='+position.coords.latitude+'&lon='+position.coords.longitude;
    console.log(pstn);
    defPos(pstn);
}