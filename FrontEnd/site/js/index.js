var BASE_URL = "http://localhost:3000/api/";


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
    document.getElementById('signin').style.display = 'none';
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
        console.log(status);
        // code here

    }).fail(function (errMsg) {

        var msgToDisplay = errMsg.status + " " + errMsg.statusText;

        $('.log-status').addClass('wrong-entry');
        $('.alert-msg').text(msgToDisplay).fadeIn(500);
        setTimeout("$('.alert-msg').fadeOut(500);", 1000);

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
        email: email,
        password: password
    };

    $.ajax({
        type: methodType,
        url: signupURL,
        data: JSON.stringify(postData),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
    }).done(function (data, status, xhr) {
        console.log(status);
        // code here

    }).fail(function (errMsg) {

        var msgToDisplay = errMsg.status + " " + errMsg.statusText;

        $('.log-status').addClass('wrong-entry');
        $('.alert-msg').text(msgToDisplay).fadeIn(500);
        setTimeout("$('.alert-msg').fadeOut(500);", 1000);

        $(this).addClass("shake").delay(500).queue(function () {

            $(this).removeClass("shake");
            $(this).dequeue();
        });

    });
}


function getAdvice() {

}
