var BASE_URL = "http://localhost:3000/api/";
var initialPageSize = 5;
var initialPageNumber = 1;

configureNavBar();

$('.modalText').keypress(removeWrongEntryClass);
$("#signin :input").keyup(enableDisableLoginButton);
$("#signin :input").keydown(enableDisableLoginButton);
$("#signup :input").keyup(enableDisableSignupButton);
$("#signup :input").keydown(enableDisableSignupButton);
$("#radius").keyup(enableDisableDivTogglerButton);
$("#radius").keydown(enableDisableDivTogglerButton);

function enableDisableLoginButton() {

    var numberOfInputs = 0;
    var nonEmptyInputs = 0;
    $("#signin :input").each(function () {
        var $element = $(this);
        if ($element.is('input')) {
            numberOfInputs++;
            if ($element.val().length !== 0) {
                nonEmptyInputs++;
            }
        }
    });

    if (numberOfInputs === nonEmptyInputs) {
        $('#login-button').prop('disabled', false);
    } else {
        $('#login-button').prop('disabled', true);
    }
}

function enableDisableSignupButton() {

    var numberOfInputs = 0;
    var nonEmptyInputs = 0;
    $("#signup :input").each(function () {
        var $element = $(this);
        if ($element.is('input')) {
            numberOfInputs++;
            if ($element.val().length !== 0) {
                nonEmptyInputs++;
            }
        }
    });

    if (numberOfInputs === nonEmptyInputs) {
        $('#signup-button').prop('disabled', false);
    } else {
        $('#signup-button').prop('disabled', true);
    }
}

$("#lat").on('latChanged', function () {
    makeInputDivVisible();
});

function makeInputDivVisible() {

    $("#long").on('longChanged', function () {
        $("#radius").prop('disabled', false);
    });
}

function enableDisableDivTogglerButton() {

    var radiusVal = $('#radius').val();
    var x = document.getElementById("searchPreferencePanel");

    if (radiusVal.length !== 0) {

        $('#divToggler').prop('disabled', false);
    } else {
        $('#divToggler').prop('disabled', true);
        x.style.display = "none";
    }
}

function togglePreferencePanel() {
    var x = document.getElementById("searchPreferencePanel");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function removeWrongEntryClass() {
    if ($('.log-status').hasClass('wrong-entry')) {
        $('.log-status').removeClass('wrong-entry');
    }
}

function clearLogInInputs(event) {
    removeWrongEntryClass();
    document.getElementById('login-form').reset();
    document.getElementById('login-button').disabled = true;
}

function clearSignUpInputs(event) {
    removeWrongEntryClass();
    document.getElementById('signup-form').reset();
    document.getElementById('signup-button').disabled = true;
}

function changePage(pageName) {
    window.location.replace(pageName);
}

function login(event) {

    event.preventDefault();

    var loginURL = BASE_URL + "auth/login";

    var email = $("#uname").val();
    var password = $("#psw").val();

    var method = "POST";
    var postData = {
        email: email,
        password: password
    };

    $.ajax({
        type: method,
        url: loginURL,
        data: JSON.stringify(postData),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, status, xhr) {

        if (xhr.status === 200) {
            const authToken = xhr.getResponseHeader('x-auth-token');
            if (authToken !== undefined) {
                window.localStorage.setItem('x-auth-token', authToken);
            }
            changePage("profile-page.html");
        }

    }).fail(function (errMsg) {

        var msg = JSON.parse(errMsg.responseText);
        var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;

        $('.log-status').addClass('wrong-entry');

        $('.alert-msg').text(msgToDisplay).fadeIn(500);
        setTimeout("$('.alert-msg').fadeOut(500);", 3000);
        setTimeout(removeWrongEntryClass, 1000);
        $(this).addClass("shake").delay(500).queue(function () {

            $(this).removeClass("shake");
            $(this).dequeue();
        });

    });
}

function signup(event) {
    event.preventDefault();

    const signupURL = BASE_URL + "users/";

    const name = $("#name").val();
    const email = $("#username").val();
    const password = $("#password").val();

    const methodType = 'POST';
    const postData = {
        name: name,
        email: email,
        password: password,
        isAdmin: false
    };

    $.ajax({
        type: methodType,
        url: signupURL,
        data: JSON.stringify(postData),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, status, xhr) {
        if (xhr.status === 200) {
            const authToken = xhr.getResponseHeader('x-auth-token');
            if (authToken !== undefined) {
                window.localStorage.setItem('x-auth-token', authToken);
            }
            changePage("profile-page.html");
        }
    }).fail(function (errMsg) {

        var msg = JSON.parse(errMsg.responseText);
        var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;

        $('.log-status').addClass('wrong-entry');
        $('.alert-msg').text(msgToDisplay).fadeIn(500);
        setTimeout("$('.alert-msg').fadeOut(500);", 3000);
        setTimeout(removeWrongEntryClass, 1000);
        $(this).addClass("shake").delay(500).queue(function () {

            $(this).removeClass("shake");
            $(this).dequeue();
        });
    });
}

function getAdvice() {

    var pageSize = initialPageSize;
    var pageNumber = initialPageNumber;

    var rentItem = null;
    var sizeItem = null;
    var floorItem = null;
    var securityItem = null;
    var liftItem = null;
    var parkingItem = null;
    var monthItem = null;

    var bedroomItem = null;
    var bathroomItem = null;
    var kitchenItem = null;
    var drawingItem = null;
    var livingItem = null;

    var mosqueItem = null;
    var hospitalItem = null;
    var schoolItem = null;
    var parkItem = null;
    var departmentStoreItem = null;

    var rooms = null;
    var nearby = null;

    var createAdURL = BASE_URL + "advertisement/";

    var lat = document.getElementById('lat').textContent;
    var long = document.getElementById('long').textContent;
    var radius = $('#radius').val();
    var sublet = $('input[name=house_type]:checked').val();

    var rent = $('#rent').val();
    var rentPreference = $('#rent_preference').val();

    var size = $('#size').val();
    var sizePreference = $('#size_preference').val();

    var floor = $('#floor').val();
    var floorPreference = $('#floor_preference').val();

    var securityGuards = $('input[name=security_guards]:checked').val();
    var guardPreference = $('#guards_preference').val();

    var liftEscalator = $('input[name=lift_escalator]:checked').val();
    var liftPreference = $('#lift_escalator_preference').val();

    var parking = $('input[name=parking]:checked').val();
    var parkingPreference = $('#parking_preference').val();

    var month = $('#month_of_availability').val();
    var monthPreference = $('#availability_preference').val();

    var bedroom = $('#bedroom').val();
    var bedroomPreference = $('#bedroom_preference').val();

    var bathroom = $('#bathroom').val();
    var bathroomPreference = $('#bathroom_preference').val();

    var kitchen = $('#kitchen').val();
    var kitchenPreference = $('#kitchen_preference').val();

    var drawing = $('#drawing').val();
    var drawingPreference = $('#drawing_preference').val();

    var living = $('#living').val();
    var livingPreference = $('#living_preference').val();

    var mosque = $('#mosque').val();
    var mosquePreference = $('#mosque_preference').val();

    var hospital = $('#hospital').val();
    var hospitalPreference = $('#hospital_preference').val();

    var school = $('#school').val();
    var schoolPreference = $('#school_preference').val();

    var park = $('#park').val();
    var parkPreference = $('#park_preference').val();

    var departmentStore = $('#department_store').val();
    var departmentStorePreference = $('#department_store_preference').val();

    if (rent.length !== 0) {
        rentItem = {
            value: rent,
            priority: rentPreference
        }
    }

    if (size.length !== 0) {
        sizeItem = {
            value: size,
            priority: sizePreference
        }
    }

    if (floor.length !== 0) {

        floorItem = {
            value: floor,
            priority: floorPreference
        }
    }

    if (securityGuards !== undefined) {
        securityItem = {
            value: securityGuards,
            priority: guardPreference
        }
    }

    if (liftEscalator !== undefined) {
        liftItem = {
            value: liftEscalator,
            priority: liftPreference
        }
    }

    if (parking !== undefined) {
        parkingItem = {
            value: parking,
            priority: parkingPreference
        }
    }

    if (month.length !== 0) {
        monthItem = {
            value: month,
            priority: monthPreference
        };
    }

    if (bedroom.length !== 0) {
        bedroomItem = {
            value: bedroom,
            priority: bedroomPreference
        };
    }

    if (bathroom.length !== 0) {
        bathroomItem = {
            value: bathroom,
            priority: bathroomPreference
        };
    }

    if (kitchen.length !== 0) {
        kitchenItem = {
            value: kitchen,
            priority: kitchenPreference
        };
    }

    if (drawing.length !== 0) {
        drawingItem = {
            value: drawing,
            priority: drawingPreference
        };
    }

    if (living.length !== 0) {
        livingItem = {
            value: living,
            priority: livingItem
        };
    }

    if (mosque.length !== 0) {
        mosqueItem = {
            value: mosque,
            priority: mosquePreference
        };
    }

    if (hospital.length !== 0) {
        hospitalItem = {
            value: hospital,
            priority: hospitalPreference
        };
    }

    if (school.length !== 0) {
        schoolItem = {
            value: school,
            priority: schoolPreference
        };
    }

    if (park.length !== 0) {
        parkingItem = {
            value: park,
            priority: parkingPreference
        };
    }

    if (departmentStore.length !== 0) {
        departmentStoreItem = {
            value: departmentStore,
            priority: departmentStorePreference
        };
    }

    if (typeof sublet === 'string' && sublet === 'sublet') {
        sublet = true;
    } else {
        sublet = false;
    }


    if (bedroom.length !== 0 ||
        bathroom.length !== 0 ||
        kitchen.length !== 0 ||
        drawing.length !== 0 ||
        living.length !== 0) {

        rooms = {
            bedroom: bedroomItem,
            bathroom: bathroomItem,
            kitchen: kitchenItem,
            drawing: drawingItem,
            living: livingItem
        };
    }

    if (mosque.length !== 0 ||
        hospital.length !== 0 ||
        school.length !== 0 ||
        park.length !== 0 ||
        departmentStore.length !== 0) {
        nearby = {
            mosque: mosqueItem,
            hospital: hospitalItem,
            school: schoolItem,
            park: parkingItem,
            department_store: departmentStoreItem
        }
    }

    rooms = removeEmptyPropsFromObject(rooms);
    nearby = removeEmptyPropsFromObject(nearby);

    var uncleanedPostData = {

        center_lat: lat,
        center_long: long,
        radius: radius,
        sublet: sublet,
        rent: rentItem,
        size: sizeItem,
        floor: floorItem,
        security_guards: securityItem,
        lift_escalator: liftItem,
        parking: parkingItem,
        month_of_availability: monthItem,
        rooms: rooms,
        nearby: nearby
    };

    const postData = removeEmptyPropsFromObject(uncleanedPostData)

    getAdviseList(postData, pageNumber, pageSize);
}

function getAdviseList(postData, pageNumber, pageSize) {

    var adviseListURL = BASE_URL + `advertisement/getAdvice?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    var methodType = "POST";

//    console.log(JSON.stringify(postData));

    $.ajax({
        type: methodType,
        url: adviseListURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(postData)
    }).done(function (data, status, xhr) {

        if (xhr.status === 200) {
            populateAdList(data, pageNumber, pageSize, postData);
        }
    }).fail(function (errMsg) {

        var msg = JSON.parse(errMsg.responseText);
        var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
        showNotification(msgToDisplay, "error");
    });
}

function populateAdList(data, pageNumber, pageSize, postData) {

    var offset = (pageNumber - 1) * pageSize;

    const adList = data.adList;
    const rankList = data.ranks;
    const totalCount = data.totalCount;

    if (adList.length === 0) {
        var noDataLabel = document.getElementById("no-data-section");
        noDataLabel.style.display = "block";
    } else {

        var adTableDiv = document.getElementById("ad-list-section");
        adTableDiv.style.display = "block";

        var table = document.getElementById("ad-table");
        var tableBody = document.createElement('TBODY');

        for (i = 0; i < adList.length; i++) {

            var item = adList[i];
            var rank = rankList[i];

            var tr = document.createElement('TR');

            var serialTd = document.createElement('TD')
            serialTd.appendChild(document.createTextNode(offset + i + 1));
            serialTd.setAttribute('class', 'text-center');
            tr.appendChild(serialTd);

            var nameTd = document.createElement('TD')
            nameTd.appendChild(document.createTextNode(item.name));
            nameTd.setAttribute('class', 'text-left');
            tr.appendChild(nameTd);

            var rankTd = document.createElement('TD')
            rankTd.appendChild(document.createTextNode(rank));
            rankTd.setAttribute('class', 'text-center');
            tr.appendChild(rankTd);

            var userName = '';
            if (item.user !== undefined) {
                var userName = item.user.name;
            }

            var userTd = document.createElement('TD')
            userTd.appendChild(document.createTextNode(userName));
            userTd.setAttribute('class', 'text-center');
            tr.appendChild(userTd);

            var validityTd = document.createElement('TD')
            var validity = moment(item.invalid_after);
            validityTd.appendChild(document.createTextNode(validity.format('Do MMM, YYYY')));
            validityTd.setAttribute('class', 'text-right');
            tr.appendChild(validityTd);

            var btnTd = document.createElement('TD')
            btnTd.setAttribute('class', 'td-actions text-center');

            var profileBtn = document.createElement("BUTTON");
            profileBtn.setAttribute('data-toggle', 'modal');

            profileBtn.setAttribute('data-target', '#adInfoModal');
            profileBtn.setAttribute('class', 'btn btn-info btn-simple btn-icon btn-sm');

            var btnIcon = document.createElement("I");
            btnIcon.setAttribute('class', 'fas fa-info-circle');

            profileBtn.appendChild(btnIcon);
            profileBtn.setAttribute('style', 'padding-right: 10px;');
            btnTd.appendChild(profileBtn);

            tr.appendChild(btnTd);

            tableBody.appendChild(tr);

        }
        var oldTbody = table.tBodies[0];
        if (oldTbody !== undefined) {

            oldTbody.parentNode.replaceChild(tableBody, oldTbody);
        } else {

            table.appendChild(tableBody);
        }
        adjustAdListPaginationPannel(pageSize, pageNumber, totalCount, postData);
    }

}

function adjustAdListPaginationPannel(pageSize, pageNumber, totalCount, postData) {

    var maxVisible = 5;
    var totalPageCount = 0;
    var fraction = totalCount / pageSize;

    var paginationDiv = document.getElementById('pagination-div');

    if (paginationDiv.childElementCount === 1) {
        paginationDiv.removeChild(paginationDiv.children[0]);
        var newP = document.createElement('P');
        newP.classList.add('ad-pagination');
        paginationDiv.appendChild(newP);
    }

    if (Number.isInteger(fraction) === true) {
        totalPageCount = fraction;
    } else {
        totalPageCount = Math.floor(fraction) + 1;
    }

    if (totalPageCount < maxVisible) {
        maxVisible = totalPageCount;
    }

    $('.ad-pagination').bootpag({
        total: totalPageCount,
        page: pageNumber,
        maxVisible: maxVisible,
        leaps: true,
        firstLastUse: true,
        first: '←',
        last: '→',
        wrapClass: 'pagination',
        activeClass: 'active',
        disabledClass: 'disabled',
        nextClass: 'next',
        prevClass: 'prev',
        lastClass: 'last',
        firstClass: 'first'
    }).on("page", function (event, num) {
        getAdviseList(postData, num, pageSize);
    });
}

function changePage(pageName) {
    window.location.replace(pageName);
}

function logout(event) {
    event.preventDefault();
    window.localStorage.removeItem('x-auth-token')
    changePage("index.html");
}

function configureNavBar() {

    var apiKey = window.localStorage.getItem('x-auth-token');

    if (apiKey !== null) {

        var outButton = document.getElementById("out-btn");
        var profileButton = document.getElementById("profile-btn");
        var adButton = document.getElementById("ad-btn");
        outButton.style.display = "block";
        profileButton.style.display = "block";
        adButton.style.display = "none";
    }
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

function showNotification(message, type) {

    $.notify(message, type, {
        autoHideDelay: 8000
    });
}
