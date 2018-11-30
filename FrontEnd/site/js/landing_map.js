// In the following example, markers appear when the user clicks on the map.
// The markers are stored in an array.
// The user can then click an option to hide, show or delete the markers.
var map;
var markers = [];
var circle;
var lastClickedOnMap;

function initMap() {
    map = new google.maps.Map(document.getElementById('landing_map'), {
        zoom: 14,
        center: {
            lat: 23.7507085,
            lng: 90.4137663
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
    map.addListener('click', function (event) {
        deleteMarkers();
        clearCirle();
        addMarker(event.latLng);
        lastClickedOnMap = event.latLng;
        $('#lat').text(event.latLng.lat()).trigger('latChanged');
        $('#long').text(event.latLng.lng()).trigger('longChanged');
        map.setCenter(event.latLng);
    });
}

function drawCircle(location, radius) {
    circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: location,
        radius: radius
    });
}

function updateCirle() {
    clearCirle();
    var radius = parseInt(document.getElementById("search-radius").value);
    if (typeof lastClickedOnMap !== 'undefined') {
        drawCircle(lastClickedOnMap, radius);
    } else alert("Click on map first");

    // update search-radius value
    document.getElementById("search-radius").step = "25";
    document.getElementById("search-radius-value").innerHTML = radius + " meter"
}
// Adds a marker to the map and push to the array.
function addMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}


// Shows any markers currently in the array.
function showMarkers() {
    setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    clearMarkers();
    markers = [];
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
    setMapOnAll(null);

}

function clearCirle() {
    if (typeof circle !== 'undefined') {
        circle.setMap(null);
    }
}
