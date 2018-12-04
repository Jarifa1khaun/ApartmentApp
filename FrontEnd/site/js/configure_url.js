var server_url = "SERVER_IP";

var letters = /^[.0-9]+$/;

function getBackEndIPAddress() {

    if (server_url.match(letters) === null) {
        return 'localhost';
    } else {
        return server_url;
    }
}
