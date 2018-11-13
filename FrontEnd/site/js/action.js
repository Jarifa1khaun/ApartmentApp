const address = "http://localhost:3000/api/users/";
// const address = "https://jsonplaceholder.typicode.com/posts/2";

$('#clickMe').click(getData);

function getData() {    
    $.get(address, output);
}

function output(data) {
    console.log(data);
    $('#output').html('<h2>' + data.id + ': ' + data.name + '</h2><p>');
    // $('#output').html('<h2>' + data.title + ': ' + data.body + '</h2><p>');
}