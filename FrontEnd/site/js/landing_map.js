var landingMap;
var landingMarkers = [];
var landingCircle;
var lastClickedOnLandingMap;

function initMap() {

    var center_lat = 23.737431;
    var center_long = 90.395547;

    landingMap = new google.maps.Map(document.getElementById('landing_map'), {
        zoom: 14,
        center: {
            lat: center_lat,
            lng: center_long
        },
        mapTypeId: 'terrain',
        draggableCursor: 'default',
        gestureHandling: 'greedy',
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
    });

    // This event listener will call addMarker() when the map is clicked.
    landingMap.addListener('click', function (event) {
        deleteLandingMarkers();
        clearLandingCirle();
        addLandingMarker(event.latLng);
        lastClickedOnLandingMap = event.latLng;
        $('#lat').text(event.latLng.lat()).trigger('latChanged');
        $('#long').text(event.latLng.lng()).trigger('longChanged');
        landingMap.setCenter(event.latLng);
    });
}

function mapInitializationForEdit() {

    var center_lat = 23.737431;
    var center_long = 90.395547;

    var lat = document.getElementById('lat').textContent;
    var long = document.getElementById('long').textContent;

    var parsed_lat = Number.parseFloat(lat);
    var parsed_long = Number.parseFloat(long);

    if (parsed_lat !== undefined && parsed_long !== undefined && typeof parsed_lat === 'number' && typeof parsed_long === 'number') {
        center_lat = parsed_lat;
        center_long = parsed_long;
    }


    landingMap = new google.maps.Map(document.getElementById('landing_map'), {
        zoom: 14,
        center: {
            lat: center_lat,
            lng: center_long
        },
        mapTypeId: 'terrain',
        draggableCursor: 'default',
        gestureHandling: 'greedy',
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
    });

    addLandingMarker(new google.maps.LatLng(center_lat, center_long));
    showLandingMarkers();

    // This event listener will call addMarker() when the map is clicked.
    landingMap.addListener('click', function (event) {
        deleteLandingMarkers();
        clearLandingCirle();
        addLandingMarker(event.latLng);
        lastClickedOLandingnMap = event.latLng;
        $('#lat').text(event.latLng.lat()).trigger('latChanged');
        $('#long').text(event.latLng.lng()).trigger('longChanged');
        landingMap.setCenter(event.latLng);
    });
}

function drawLandingCircle(location, radius) {

    landingCircle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: landingMap,
        center: location,
        radius: radius
    });
}

function updateLandingCirle() {
    clearLandingCirle();
    var radius = parseInt(document.getElementById("search-radius").value);
    if (typeof lastClickedOnLandingMap !== 'undefined') {
        drawLandingCircle(lastClickedOnLandingMap, radius);
    } else alert("Click on map first");

    // update search-radius value
    document.getElementById("search-radius").step = "25";
    document.getElementById("search-radius-value").innerHTML = radius + " meter"
}

function addLandingMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: landingMap
    });
    landingMarkers.push(marker);
}

function setLandingMapOnAll(landingMap) {
    for (var i = 0; i < landingMarkers.length; i++) {
        landingMarkers[i].setMap(landingMap);
    }
}

function showLandingMarkers() {
    setLandingMapOnAll(landingMap);
}

function deleteLandingMarkers() {
    clearLandingMarkers();
    landingMarkers = [];
}

function clearLandingMarkers() {
    setLandingMapOnAll(null);
}

function clearLandingCirle() {
    if (typeof landingCircle !== 'undefined') {
        landingCircle.setMap(null);
    }
}
