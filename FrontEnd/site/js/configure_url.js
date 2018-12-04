var server_url = "SERVER_IP";

var letters = /^[_a-zA-Z]+$/;

function getBackEndIPAddress() {

    if (server_url.match(letters) === null) {
        return server_url;
    } else {
        return 'localhost';
    }
}
