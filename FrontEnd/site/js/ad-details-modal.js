var port = 3000;
var site = getBackEndIPAddress();
var BASE_URL = `http://${site}:${port}/api/`;

var map = null;
var markers = [];

function adDetailsClickActionListener(advertisementId) {

    //    event.preventDefault();

    var methodType = "GET";

    var singleAdvertisementURL = BASE_URL + `advertisement/${advertisementId}`;

    $.ajax({
        type: methodType,
        url: singleAdvertisementURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, status, xhr) {

        if (xhr.status === 200) {
            manageModalData(data);
        }
    }).fail(function (errMsg) {

        var msg = JSON.parse(errMsg.responseText);
        var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
        showNotification(msgToDisplay, "error");
    });
}

function manageModalData(data) {

    var mosqueDetails = null;
    var hospitalDetails = null;
    var schoolDetails = null;
    var parkDetails = null;
    var storeDetails = null;

    var bedInfo = null;
    var bathInfo = null;
    var drawingInfo = null;
    var kitchenInfo = null;
    var livingInfo = null;

    var security = null;
    var parking = null;
    var lift = null;

    var nearbyInfo = null;
    var roomInfo = null;

    if (data.rooms !== undefined) {
        bedInfo = data.rooms.bedroom;
        bathInfo = data.rooms.bathroom;
        drawingInfo = data.rooms.drawing;
        kitchenInfo = data.rooms.kitchen;
        livingInfo = data.rooms.living;
    }

    if (data.nearby !== undefined && data.nearby.length > 0) {
        if (data.nearby[0] !== undefined) {
            var item = data.nearby[0];
            mosqueDetails = {
                lat: item.lat,
                long: item.long,
                distance: item.distance,
                name: item.name,
                vicinity: item.vicinity
            };
        }
        if (data.nearby[1] !== undefined) {
            var item = data.nearby[1];
            hospitalDetails = {
                lat: item.lat,
                long: item.long,
                distance: item.distance,
                name: item.name,
                vicinity: item.vicinity
            };
        }
        if (data.nearby[2] !== undefined) {
            var item = data.nearby[2];
            schoolDetails = {
                lat: item.lat,
                long: item.long,
                distance: item.distance,
                name: item.name,
                vicinity: item.vicinity
            };
        }
        if (data.nearby[3] !== undefined) {
            var item = data.nearby[3];
            parkDetails = {
                lat: item.lat,
                long: item.long,
                distance: item.distance,
                name: item.name,
                vicinity: item.vicinity
            };
        }
        if (data.nearby[4] !== undefined) {
            var item = data.nearby[4];
            storeDetails = {
                lat: item.lat,
                long: item.long,
                distance: item.distance,
                name: item.name,
                vicinity: item.vicinity
            };
        }
    }

    var adData = {

        name: data.name,

        address: data.address,
        thana: data.thana,
        postCode: data.postCode,
        zilla: data.zilla,

        contactNumber: data.contact_number,
        alternativeContact: data.alternative_contact,

        lat: data.lat,
        long: data.long,

        rent: data.rent,
        size: data.size,
        floor: data.floor,

        monthOfAvailability: data.month_of_availability,

        sublet: data.sublet,
        security: data.security_guards,
        liftEscalator: data.lift_escalator,
        parking: data.parking,

        bed: bedInfo,
        bath: bathInfo,
        kitchen: kitchenInfo,
        drawing: drawingInfo,
        living: livingInfo,

        mosque: mosqueDetails,
        hospital: hospitalDetails,
        school: schoolDetails,
        park: parkDetails,
        department_store: storeDetails
    };


    if (adData.security === true) {
        security = 'checked';
    }
    if (adData.liftEscalator === true) {
        lift = 'checked';
    }
    if (adData.parking === true) {
        parking = 'checked';
    }


    var houseInfo = `<div id="house-info">

            <h4><b>${adData.name}</b></h4>
            <p>Address: ${adData.address}, <br />
            Thana: ${adData.thana}, PostCode: ${adData.postCode}  <br />
            Zilla: ${adData.zilla} </p>

            <div id="bodyContent">

            </div>
            </div>`;

    var contactInfo = `<div id="contact-info">
            <p> Contact Number: <b>${adData.contactNumber}</b> <br />
            Alternative Contact: <b>${adData.alternativeContact}</b> <br />
            </p>
            </div>`;

    var basicInfo = `<div id="basic-info">
            <p> Available from: <b>${adData.monthOfAvailability}</b> <br />
            Floor: <b>${adData.floor} th</b> <br />
            Rent: <b>${adData.rent} Tk</b> <br />
            Size: <b>${adData.size} sq. ft.</b> <br />
            </p>
            <p style="padding-top: 25px;">
                <input type="checkbox" ${security} disabled> Security Guards<br>
                <input type="checkbox" ${lift} disabled> Lift/Escalator <br>
                <input type="checkbox" ${parking} disabled> Parking Facility<br>
            </p>
            </div>`;


    if (bedInfo !== null && bathInfo !== null && kitchenInfo !== null && drawingInfo !== null && livingInfo !== null) {

        roomInfo = `<p><b> Room Information </b>
                <table>
                    <tr>
                        <td style="text-align: left;">Bedrooms</td>
                        <td style="text-align: right;">${adData.bed}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">Bathrooms</td>
                        <td style="text-align: right;">${adData.bath}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">Kitchens</td>
                        <td style="text-align: right;">${adData.kitchen}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">Drawings</td>
                        <td style="text-align: right;">${adData.drawing}</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">Livings</td>
                        <td style="text-align: right;">${adData.living}</td>
                    </tr>

                </table>
            </p>`;
    }

    if (mosqueDetails !== null && hospitalDetails !== null && schoolDetails !== null && parkDetails != null && storeDetails !== null) {

        nearbyInfo = `<p><b> Nearby Information </b>
                <table>
                    <tr>
                        <td style="text-align: left;">Mosque - </td>
                        <td style="text-align: right;">${adData.mosque.distance} meters away</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">Hospital - </td>
                        <td style="text-align: right;">${adData.hospital.distance} meters away</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">School - </td>
                        <td style="text-align: right;">${adData.school.distance} meters away</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">Park - </td>
                        <td style="text-align: right;">${adData.park.distance} meters away</td>
                    </tr>
                    <tr>
                        <td style="text-align: left;">Store - </td>
                        <td style="text-align: right;">${adData.department_store.distance} meters away</td>
                    </tr>

                </table>
            </p>`;
    }

    $('#ad-modal-house-info').html(houseInfo);
    $('#ad-modal-contact-info').html(contactInfo);
    $('#ad-modal-contact-info').html(contactInfo);
    $('#ad-modal-basic-info').html(basicInfo);
    if (roomInfo !== null) {
        $('#ad-modal-room-info').html(roomInfo);
    }
    if (nearbyInfo !== null) {
        $('#ad-modal-nearby-info').html(nearbyInfo);
    }

    var mosqueInfo = generateInfo('Mosque', adData.mosque);
    var hospitalInfo = generateInfo('Hospital', adData.hospital);
    var schoolInfo = generateInfo('School', adData.school);
    var parkInfo = generateInfo('Park', adData.park);
    var storeInfo = generateInfo('Departmental Store', adData.department_store);

    addMarker(adData.lat, adData.long, 'The House', null);
    addMarker(adData.mosque.lat, adData.mosque.long, 'Mosque', mosqueInfo);
    addMarker(adData.school.lat, adData.school.long, 'School', schoolInfo);
    addMarker(adData.hospital.lat, adData.hospital.long, 'Hospital', hospitalInfo);
    addMarker(adData.park.lat, adData.park.long, 'Park', parkInfo);
    addMarker(adData.department_store.lat, adData.department_store.long, 'Departmental Store', storeInfo);
    initializeGMap(adData.lat, adData.long);

    $('#adInfoModal').modal({
        show: true
    });
}

function initializeGMap(lat, lng) {

    centerLatlng = new google.maps.LatLng(lat, lng);

    map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 15,
        center: centerLatlng,
        mapTypeId: 'terrain',
        draggableCursor: 'default',
        gestureHandling: 'greedy',
        streetViewControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: true,
    });

    showMarkers();
}

function addMarker(lat, long, labelText, infoText) {

    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, long),
        map: map,
        animation: google.maps.Animation.DROP,
        title: labelText
    });

    if (infoText !== null && infoText !== undefined) {
        marker.addListener('click', function () {
            new google.maps.InfoWindow({
                content: infoText
            }).open(map, marker);
        });
    }

    markers.push(marker);
}

function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function showMarkers() {
    setMapOnAll(map);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}

function clearMarkers() {
    setMapOnAll(null);
}

function generateInfo(type, data) {

    var cName = data.name;
    var cVicinity = data.vicinity;
    var cDistance = data.distance;

    var contentString = `<div id="content">

            <h4 style="color:black;" id="firstHeading">Name: ${cName}</h4>
            <h5 style="color:black;" id="typ">Type: ${type}</h5>
            <h5 style="color:black;" id="vicinity">Vicinity: ${cVicinity}</h5>
            <div id="bodyContent">
            <p style="color:black;">distance from House: ${cDistance} meters
            </div>
            </div>`;

    return contentString;

}

function showNotification(message, type) {

    $.notify(message, type, {
        autoHideDelay: 8000
    });
}

$("#adInfoModal").on('hidden.bs.modal', function () {
    deleteMarkers();
    $(this).data('bs.modal', null);
});
