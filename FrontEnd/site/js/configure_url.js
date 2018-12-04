var server_url = "SERVER_IP";

function getBackEndIPAddress() {

    if (server_url === 'SERVER_IP') {
        return 'localhost';
    } else {
        return server_url;
    }
}
