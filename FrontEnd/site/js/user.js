configurepage();

function changePage(pageName) {
    window.location.replace(pageName);
}

function logout(event) {
    event.preventDefault();
    window.localStorage.removeItem('x-auth-token')
    changePage("index.html");
}


function configurepage() {

    var isAdmin = true;

    if (isAdmin === false) {
        var x = document.getElementById("user-list-panel");
        x.style.display = "none";
    }
}
