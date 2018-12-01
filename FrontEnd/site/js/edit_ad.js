var BASE_URL = "http://localhost:3000/api/";

var apiKey = window.localStorage.getItem('x-auth-token');
getAdInfo();

function createAd(event) {

    console.log('here');
    event.preventDefault();

    const createAdURL = BASE_URL + "advertisement/";

    var name = $('#house_name').val();
    var invalid_after = $('#invalid_after').val();
    var contact_number = $('#contact_number').val();
    var alternative_contact = $('#alternative_contact_number').val();
    var lat = $('#lat').val();
    var long = $('#long').val();
    var address = $('#address').val();
    var thana = $('#thana').val();
    var postCode = $('#postcode').val();
    var zilla = $('#zilla').val();
    var rent = $('#rent').val();
    var size = $('#size').val();
    var floor = $('#floor').val();
    var month_of_availability = $('#month_of_availability').val();

    var sublet = $('input[name=sublet]:checked').val();
    var parking = $('input[name=parking]:checked').val();
    var is_rented = $('input[name=is_rented]:checked').val();
    var security_guards = $('input[name=security_guards]:checked').val();
    var lift_escalator = $('input[name=lift_escalator]:checked').val();

    var bedroom = $('#bedroom').val();
    var bathroom = $('#bathroom').val();
    var kitchen = $('#kitchen').val();
    var drawing = $('#drawing').val();
    var living = $('#living').val();




    const methodType = 'POST';
    const postData = {
        name: name,
        invalid_after: invalid_after,
        is_rented: is_rented,
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
        month_of_availability: month_of_availability,
        rooms: {
            bedroom: bedroom,
            bathroom: bathroom,
            kitchen: kitchen,
            drawing: drawing,
            living: living,
        }
    };

    console.log(JSON.stringify(postData));

    //    $.ajax({
    //        type: methodType,
    //        url: signupURL,
    //        data: JSON.stringify(postData),
    //        contentType: "application/json; charset=utf-8",
    //        dataType: "json"
    //    }).done(function (data, status, xhr) {
    //        if (xhr.status === 200) {
    //            const authToken = xhr.getResponseHeader('x-auth-token');
    //            if (authToken !== undefined) {
    //                window.localStorage.setItem('x-auth-token', authToken);
    //            }
    //            changePage("user.html");
    //        }
    //    }).fail(function (errMsg) {
    //
    //        var msg = JSON.parse(errMsg.responseText);
    //        var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
    //
    //        $('.log-status').addClass('wrong-entry');
    //        $('.alert-msg').text(msgToDisplay).fadeIn(500);
    //        setTimeout("$('.alert-msg').fadeOut(500);", 2000);
    //
    //        $(this).addClass("shake").delay(500).queue(function () {
    //
    //            $(this).removeClass("shake");
    //            $(this).dequeue();
    //        });
    //    });
}

function changePage(pageName) {
    window.location.replace(pageName);
}

function logout(event) {
    event.preventDefault();
    window.localStorage.removeItem('x-auth-token')
    changePage("index.html");
}


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

            console.log(errMsg);
        });
    }
}


function configurepage(data) {

    var security = false;
    var lift = false;
    var parking = false;

    var inputMonth = data.month_of_availability;

    if (data.security_guards === true) {
        security = true;
    }
    if (data.lift_escalator === true) {
        lift = true;
    }
    if (data.parking === true) {
        parking = true;
    }

    $('#lat').text(data.lat);
    $('#long').text(data.long);
    $('#rent').val(data.rent);
    $('#size').val(data.size);
    $('#floor').val(data.floor);

    $('#security').prop('checked', security);
    $('#life').prop('checked', lift);
    $('#parking').prop('checked', parking);
    $('#month').val(inputMonth);

    var rooms = data.rooms;

    if (rooms !== undefined) {
        $('#bedroom').val(rooms.bedroom);
        $('#bathroom').val(rooms.bathroom);
        $('#kitchen').val(rooms.kitchen);
        $('#drawing').val(rooms.drawing);
        $('#living').val(rooms.living);
    }
}
