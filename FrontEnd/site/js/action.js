const address = "http://localhost:3000/api/advertisement/?pageNumber=1&pageSize=5";
// const address = "https://jsonplaceholder.typicode.com/posts/2";

$('#clickMe').click(getData);

function getData() {    
    $.get(address, output);
}

function output(data) {
    console.log(data);
    const item = data[0];
    $('#output').html('<h2>' + 'House name: ' + item.name + ', contact number: ' + item.contact_number + '</h2><p>');
    // $('#output').html('<h2>' + data.title + ': ' + data.body + '</h2><p>');
}