var port = 3000;
var site = getBackEndIPAddress();
var BASE_URL = `http://${site}:${port}/api/`;

var apiKey = window.localStorage.getItem('x-auth-token');

$("#ad-create :input").keyup(enableDisableSubmitButton);
$("#ad-create :input").keydown(enableDisableSubmitButton);
$('#month').on('change', enableDisableSubmitButton);
$('input[type=radio]').change(enableDisableSubmitButton);

$("#lat").on('latChanged', function () {
    makeInputDivVisible();
});

function makeInputDivVisible() {

    $("#long").on('longChanged', function () {
        togglePreferencePanel();
    });
}

function togglePreferencePanel() {

    var x = document.getElementById("searchPreferencePanel");
    x.style.display = "block";
}

function enableDisableSubmitButton() {
    var noOfRequiredTextFields = $('input[required]:text').length;
    var noOfRequiredRadio = $('input[required]:radio').length / 2;

    var filledRadio = $('input[required]:radio:checked').length;
    var filledTextField = 0;

    var requiredTextFields = $('input[required]:text');
    var monthValue = $('#month').val().length;

    for (var i = 0, len = requiredTextFields.length; i < len; i++) {
        var item = requiredTextFields[i];
        if (item.value.length !== 0) {
            filledTextField++;
        }
    }

    if (noOfRequiredTextFields === filledTextField && noOfRequiredRadio === filledRadio && monthValue !== 0) {
        $('#createAdBtn').prop('disabled', false);
    } else {
        $('#createAdBtn').prop('disabled', true);
    }
}

function createAd(event) {

    event.preventDefault();

    if (apiKey !== undefined) {
        var createAdURL = BASE_URL + "advertisement/";

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


        var methodType = 'POST';
        var postData = {
            name: name,
            invalid_after: timeStamp,
            is_rented: false,
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

        $.ajax({
            type: methodType,
            url: createAdURL,
            data: JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'x-auth-token': apiKey
            },
        }).done(function (data, status, xhr) {
            if (xhr.status === 200) {
                changePage("profile-page.html?adCreation=successful");
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
