var BASE_URL = "http://localhost:3000/api/";

var apiKey = window.localStorage.getItem('x-auth-token');

getAdInfo();

function getAdInfo() {

    let params = (new URL(document.location)).searchParams;
    let id = params.get("id");

    var adInfoURL = BASE_URL + "advertisement/" + id;

    if (apiKey !== null) {

        var methodType = "GET";

        $.ajax({
            type: methodType,
            url: adInfoURL,
            contentType: "application/json; charset=utf-8",
            headers: {
                'x-auth-token': apiKey
            },
            dataType: "json"
        }).done(function (data, status, xhr) {

            if (xhr.status === 200) {
                configurepage(data);
            }
        }).fail(function (errMsg) {

            var msg = JSON.parse(errMsg.responseText);
            var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
            showNotification(msgToDisplay, "error");
        });
    }
}

function configurepage(data) {

    var security = false;
    var lift = false;
    var parking = false;
    var sublet = false;

    if (data.security_guards === true) {
        security = true;
    }
    if (data.lift_escalator === true) {
        lift = true;
    }
    if (data.parking === true) {
        parking = true;
    }
    if (data.sublet === true) {
        sublet = true;
    }

    $('#id').val(data._id);
    $('#house_name').val(data.name);
    $('#invalid_after').val(moment(data.invalid_after).format('LL'));

    $('#contact_number').val(data.contact_number);
    $('#alternative_contact').val(data.alternative_contact);
    $('#lat').text(data.lat);
    $('#long').text(data.long);

    $('#address').val(data.address);
    $('#thana').val(data.thana);
    $('#post-code').val(data.postCode);
    $('#zilla').val(data.zilla);


    $('#isrented').val(data.is_rented);
    $('#rent').val(data.rent);
    $('#size').val(data.size);
    $('#floor').val(data.floor);
    $('#month').val(data.month_of_availability);

    $('#sublet').prop('checked', sublet);
    $('#parking').prop('checked', parking);
    $('#security').prop('checked', security);
    $('#lift').prop('checked', lift);

    var rooms = data.rooms;

    if (rooms !== undefined) {
        $('#bedroom').val(rooms.bedroom);
        $('#bathroom').val(rooms.bathroom);
        $('#kitchen').val(rooms.kitchen);
        $('#drawing').val(rooms.drawing);
        $('#living').val(rooms.living);
    }
}

function updateAd(event) {

    event.preventDefault();

    if (apiKey !== undefined) {

        var updateAdURL = BASE_URL + "advertisement/";

        var id = $('#id').val();
        var name = $('#house_name').val();
        var invalid_after = $('#invalid_after').val();
        var contact_number = $('#contact_number').val();
        var alternative_contact = $('#alternative_contact').val();
        var lat = document.getElementById('lat').textContent;
        var long = document.getElementById('long').textContent;

        var address = $('#address').val();
        var thana = $('#thana').val();
        var postCode = $('#post-code').val();
        var zilla = $('#zilla').val();

        var isrented = $('#isrented').val();
        var rent = $('#rent').val();
        var size = $('#size').val();
        var floor = $('#floor').val();
        var month_of_availability = $('#month').val();

        var sublet = $('input[id=sublet]:checked').val();
        var parking = $('input[id=parking]:checked').val();
        var security_guards = $('input[id=security]:checked').val();
        var lift_escalator = $('input[id=lift]:checked').val();

        var bedroom = $('#bedroom').val();
        var bathroom = $('#bathroom').val();
        var kitchen = $('#kitchen').val();
        var drawing = $('#drawing').val();
        var living = $('#living').val();


        var timeStamp = moment(invalid_after).endOf('day').valueOf();


        if (security_guards === undefined) {
            security_guards = false;
        } else {
            security_guards = true;
        }

        if (sublet === undefined) {
            sublet = false;
        } else {
            sublet = true;
        }

        if (parking === undefined) {
            parking = false;
        } else {
            parking = true;
        }

        if (lift_escalator === undefined) {
            lift_escalator = false;
        } else {
            lift_escalator = true;
        }

        if (isrented === undefined) {
            isrented = false;
        } else {
            isrented = true;
        }

        var methodType = 'PUT';
        var uncleanedPostData = {
            _id: id,
            name: name,
            invalid_after: timeStamp,
            is_rented: isrented,
            sublet: sublet,
            contact_number: contact_number,
            alternative_contact: alternative_contact,
            lat: lat,
            long: long,
            address: address,
            thana: thana,
            postCode: postCode,
            zilla: zilla,
            rent: rent,
            size: size,
            floor: floor,
            security_guards: security_guards,
            lift_escalator: lift_escalator,
            parking: parking,
            sublet: sublet,
            month_of_availability: month_of_availability,
            rooms: {
                bedroom: bedroom,
                bathroom: bathroom,
                kitchen: kitchen,
                drawing: drawing,
                living: living,
            }
        };

        const postData = removeEmptyPropsFromObject(uncleanedPostData);

        $.ajax({
            type: methodType,
            url: updateAdURL,
            data: JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'x-auth-token': apiKey
            },
        }).done(function (data, status, xhr) {
            if (xhr.status === 200) {
                changePage("profile-page.html?adUpdate=successful");
            }
        }).fail(function (errMsg) {

            var msg = JSON.parse(errMsg.responseText);
            var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
            showNotification(msgToDisplay, "error");
        });
    } else {
        showNotification("You need to login first.", "error");
    }
}

function showNotification(message, type) {

    $.notify(message, type, {
        autoHideDelay: 8000
    });
}

function removeEmptyPropsFromObject(obj) {

    for (var propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined ||
            (typeof obj[propName] === 'string' && obj[propName].length === 0)) {

            delete obj[propName];
        }
    }

    return obj;
}

function changePage(pageName) {
    window.location.replace(pageName);
}

function logout(event) {
    event.preventDefault();
    window.localStorage.removeItem('x-auth-token')
    changePage("index.html");
}

$(function () {
    $('#invalid_after').datetimepicker({
        format: 'LL',
        icons: {
            time: "fa fa-clock-o",
            date: "fa fa-calendar",
            up: "fa fa-chevron-up",
            down: "fa fa-chevron-down",
            previous: 'fa fa-chevron-left',
            next: 'fa fa-chevron-right',
            today: 'fa fa-screenshot',
            clear: 'fa fa-trash',
            close: 'fa fa-remove'
        }
    });
});

function showNotification(message, type) {

    $.notify(message, type, {
        autoHideDelay: 8000
    });
}
