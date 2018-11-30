var BASE_URL = "http://localhost:3000/api/";

configureNavBar();

$('.modalText').keypress(removeWrongEntryClass);
$("#signin :input").keyup(enableDisableLoginButton);
$("#signin :input").keydown(enableDisableLoginButton);
$("#signup :input").keyup(enableDisableSignupButton);
$("#signup :input").keydown(enableDisableSignupButton);


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

// following segment contains code to communicate with the server

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
        type: "POST",
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

function getAdvice() {

}
