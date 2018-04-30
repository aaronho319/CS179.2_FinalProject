// weather API 
var api = 'http://api.openweathermap.org/data/2.5/weather?';
var city = 'Manila';
var apiKey = '&APPID=4adce4b14ebeac2d4995f830b4393165';
var units = '&units=metric';
var callback = '&callback=jsonCallback'
var weather;

var map;
var markers = [];
var searchSubmit;
var errorData;
var data;
var script;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 51.51, lng: -0.13}
  });

  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
    weatherAsk();
    update();
  });

  map.addListener('center_changed', function() {
    // 3 seconds after the center of the map has changed, pan back to the
    // marker.
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  });

  map.addListener('click', function(e) {
    placeMarkerAndPanTo(e.latLng, map);
    // place code to remove previous markers
    deleteMarkers();
    addMarker(e.latLng);
    setMapOnAll(map);
  });

  marker = new google.maps.Marker({
    position: uluru,
    map: map
  });

  marker.addListener('click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
}

function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

// places marker on the map and then goes to it
function placeMarkerAndPanTo(latLng, map) {
  addMarker(latLng);
  map.panTo(latLng);
  setMapOnAll(map);
}

// add marker and then push to array
function addMarker(location) {
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  markers.push(marker);
}

// sets the map on all markers in the array
function setMapOnAll(map) {
  for(var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// removes markers from the map, but keeps in the array
function clearMarkers() {
  setMapOnAll(null);
}

// show current markers in the array
function showMarkers() {
  setMapOnAll(map);
}

// delete all markers in the array
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

let getData = function(url) {
  return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest()
      xhr.open('GET', url)
      xhr.send()
      xhr.onload = function() {
          if(xhr.status == 200) {
              resolve(JSON.parse(xhr.response))
          } else {
              reject(xhr.responseText)
          }
      }
      xhr.onerror = function() {
          reject(Error('Network Error'))
      }
  })
}

function weatherAsk() {
  searchSubmit = document.getElementById("address").value;
  var url = api + searchSubmit + apiKey + units + callback;
  getData(url)
  .then(res => {
    for (const object of res) {
      document.getElementById("name").innerHTML=object["name"];
      document.getElementById("temp").innerHTML=object["temp"];
      document.getElementById("pressure").innerHTML=object["pressure"];
      document.getElementById("humidity").innerHTML=object["humidity"];
      document.getElementById("minTemp").innerHTML=object["temp_min"];
      document.getElementById("maxTemp").innerHTML=object["temp_max"];
      document.getElementById("wind").innerHTML=object["wind"];
    }
  })
}

function gotData(data) {
  weather = data;
}

function update() {
    var name = weather.name;
    var temp = weather.main.temp;
    var pressure = weather.main.pressure;
    var humidity = weather.main.humidity;
    var minTemp = weather.main.temp_min;
    var maxTemp = weather.main.temp_max;
    var wind = weather.wind.speed + 'kph';

    alert('end of update');
  
    document.getElementById("name").value=name;
    document.getElementById("temp").value=temp;
    document.getElementById("pressure").value=pressure;
    document.getElementById("humidity").value=humidity;
    document.getElementById("minTemp").value=minTemp;
    document.getElementById("maxTemp").value=maxTemp;
    document.getElementById("wind").value=wind;
    
}


