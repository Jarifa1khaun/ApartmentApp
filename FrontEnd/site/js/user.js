var BASE_URL = "http://localhost:3000/api/";

var apiKey = window.localStorage.getItem('x-auth-token');
getProfileInfo();

function changePage(pageName) {
    window.location.replace(pageName);
}

function logout(event) {
    event.preventDefault();
    window.localStorage.removeItem('x-auth-token')
    changePage("index.html");
}



function getProfileInfo() {

    var profileInfoURL = BASE_URL + "users/me";

    if (apiKey !== null) {

        var methodType = "GET";

        $.ajax({
            type: methodType,
            url: profileInfoURL,
            contentType: "application/json; charset=utf-8",
            headers: {
                'x-auth-token': apiKey
            },
            dataType: "json"
        }).done(function (data, status, xhr) {

            if (xhr.status === 200) {
                configurepage(data);
            }
        }).fail(function (errMsg) {

            console.log(errMsg);
        });
    }
}

function configurepage(data) {

    var isAdmin = false;

    if (data !== null) {

        isAdmin = data.isAdmin;

        if (isAdmin === false) {
            var x = document.getElementById("user-list-panel");
            x.style.display = "none";
        } else {
            getUserList();
        }

        updateNameCard(data);

        getAdvertisementList();
    }
}

function updateNameCard(data) {


    let adminStatus = 'Not Admin';
    if (data.isAdmin === true) {
        adminStatus = 'Admin';
    }

    $('#card-name').html('<h3>Name: ' + data.name + '</h3>');
    $('#card-email').html('<h4>Email: ' + data.email + '</h4>');
    $('#card-admin').html('<h4>Admin Status: ' + adminStatus + '</h4>');
}

function getUserList() {

    var userListURL = BASE_URL + 'users/?pageNumber=1&pageSize=100';

    if (apiKey !== null) {

        var methodType = "GET";

        $.ajax({
            type: methodType,
            url: userListURL,
            contentType: "application/json; charset=utf-8",
            headers: {
                'x-auth-token': apiKey
            },
            dataType: "json"
        }).done(function (data, status, xhr) {

            if (xhr.status === 200) {
                populateUserList(data);
            }
        }).fail(function (errMsg) {

            console.log(errMsg);
        });
    }
}


function getAdvertisementList() {

    var advertisementListURL = BASE_URL + 'advertisement/?pageNumber=1&pageSize=100';

    if (apiKey !== null) {

        var methodType = "GET";

        $.ajax({
            type: methodType,
            url: advertisementListURL,
            contentType: "application/json; charset=utf-8",
            headers: {
                'x-auth-token': apiKey
            },
            dataType: "json"
        }).done(function (data, status, xhr) {

            if (xhr.status === 200) {
                populateAdList(data);
            }
        }).fail(function (errMsg) {

            console.log(errMsg);
        });
    }
}

function populateUserList(data) {

    const userList = data.userList;
    const totalCount = data.totalCount;

    var table = document.getElementById("user-table");
    var tableBody = document.createElement('TBODY');

    for (i = 0; i < userList.length; i++) {

        var item = userList[i];

        var tr = document.createElement('TR');

        var serialTd = document.createElement('TD')
        serialTd.appendChild(document.createTextNode(i + 1));
        serialTd.setAttribute('class', 'text-center');
        tr.appendChild(serialTd);

        var nameTd = document.createElement('TD')
        nameTd.appendChild(document.createTextNode(item.name));
        tr.appendChild(nameTd);

        var emailTd = document.createElement('TD')
        emailTd.appendChild(document.createTextNode(item.email));
        tr.appendChild(emailTd);


        var adminTd = document.createElement('TD')
        adminTd.appendChild(document.createTextNode(item.isAdmin));
        adminTd.setAttribute('class', 'text-right');
        tr.appendChild(adminTd);


        var btnTd = document.createElement('TD')
        btnTd.setAttribute('class', 'td-actions text-right');

        var profileBtn = document.createElement("BUTTON");
        profileBtn.setAttribute('data-toggle', 'modal');

        profileBtn.setAttribute('data-target', '#usrInfoModal');
        profileBtn.setAttribute('class', 'btn btn-info btn-simple btn-icon btn-sm');

        var btnIcon = document.createElement("I");
        btnIcon.setAttribute('class', 'tim-icons icon-single-02');

        profileBtn.appendChild(btnIcon);
        profileBtn.setAttribute('style', 'padding-right: 10px;');
        btnTd.appendChild(profileBtn);


        var editBtn = document.createElement("BUTTON");
        editBtn.setAttribute('data-toggle', 'modal');

        editBtn.setAttribute('data-target', '#userEditModal');
        editBtn.setAttribute('class', 'btn btn-success btn-simple btn-icon btn-sm');

        var editIcon = document.createElement("I");
        editIcon.setAttribute('class', 'tim-icons icon-settings-gear-63');

        editBtn.appendChild(editIcon);
        btnTd.appendChild(editBtn);


        var deleteBtn = document.createElement("BUTTON");
        deleteBtn.setAttribute('data-toggle', 'modal');

        deleteBtn.setAttribute('data-target', '#deleteModal');
        deleteBtn.setAttribute('class', 'btn btn-danger btn-simple btn-icon btn-sm');

        var delIcon = document.createElement("I");
        delIcon.setAttribute('class', 'tim-icons icon-simple-remove');

        deleteBtn.appendChild(delIcon);
        btnTd.appendChild(deleteBtn);

        tr.appendChild(btnTd);

        tableBody.appendChild(tr);

    }
    table.appendChild(tableBody);

}

function populateAdList(data) {

    const adList = data.advertisementList;
    const totalCount = data.totalCount;


    var table = document.getElementById("ad-table");
    var tableBody = document.createElement('TBODY');

    for (i = 0; i < adList.length; i++) {

        var item = adList[i];

        var tr = document.createElement('TR');

        var serialTd = document.createElement('TD')
        serialTd.appendChild(document.createTextNode(i + 1));
        serialTd.setAttribute('class', 'text-center');
        tr.appendChild(serialTd);

        var nameTd = document.createElement('TD')
        nameTd.appendChild(document.createTextNode(item.name));
        tr.appendChild(nameTd);


        var validityTd = document.createElement('TD')
        validityTd.appendChild(document.createTextNode(item.invalid_after));
        tr.appendChild(validityTd);


        var btnTd = document.createElement('TD')
        btnTd.setAttribute('class', 'td-actions text-right');

        var profileBtn = document.createElement("BUTTON");
        profileBtn.setAttribute('data-toggle', 'modal');

        profileBtn.setAttribute('data-target', '#usrInfoModal');
        profileBtn.setAttribute('class', 'btn btn-info btn-simple btn-icon btn-sm');

        var btnIcon = document.createElement("I");
        btnIcon.setAttribute('class', 'tim-icons icon-single-02');

        profileBtn.appendChild(btnIcon);
        profileBtn.setAttribute('style', 'padding-right: 10px;');
        btnTd.appendChild(profileBtn);


        var editBtn = document.createElement("BUTTON");
        editBtn.setAttribute('data-toggle', 'modal');

        editBtn.setAttribute('data-target', '#userEditModal');
        editBtn.setAttribute('class', 'btn btn-success btn-simple btn-icon btn-sm');

        var editIcon = document.createElement("I");
        editIcon.setAttribute('class', 'tim-icons icon-settings-gear-63');

        editBtn.appendChild(editIcon);
        btnTd.appendChild(editBtn);


        var deleteBtn = document.createElement("BUTTON");
        deleteBtn.setAttribute('data-toggle', 'modal');

        deleteBtn.setAttribute('data-target', '#deleteModal');
        deleteBtn.setAttribute('class', 'btn btn-danger btn-simple btn-icon btn-sm');

        var delIcon = document.createElement("I");
        delIcon.setAttribute('class', 'tim-icons icon-simple-remove');

        deleteBtn.appendChild(delIcon);
        btnTd.appendChild(deleteBtn);

        tr.appendChild(btnTd);

        tableBody.appendChild(tr);

    }
    table.appendChild(tableBody);
}
