var BASE_URL = "http://localhost:3000/api/";

var apiKey = window.localStorage.getItem('x-auth-token');
notificationCheck();
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
                configurePage(data);
            }
        }).fail(function (errMsg) {

            console.log(errMsg);
        });
    }
}

function configurePage(data) {

    var pageNumber = 1;
    var pageSize = 5;
    var isAdmin = false;

    if (data !== null) {

        isAdmin = data.isAdmin;

        if (isAdmin === false) {
            var x = document.getElementById("user-list-panel");
            x.style.display = "none";
        } else {
            getUserList(pageNumber, pageSize);
        }

        updateNameCard(data);
        getAdvertisementList(pageNumber, pageSize);
    } else {
        // error banner here
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

function getUserList(pageNumber, pageSize) {

    var userListURL = BASE_URL + `users/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

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
                populateUserList(data, pageNumber, pageSize);
            }
        }).fail(function (errMsg) {
            console.log(errMsg);
        });
    }
}


function getAdvertisementList(pageNumber, pageSize) {

    var advertisementListURL = BASE_URL + `advertisement/?pageNumber=${pageNumber}&pageSize=${pageSize}`;

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
                populateAdList(data, pageNumber, pageSize);
            }
        }).fail(function (errMsg) {

            console.log(errMsg);
        });
    }
}

function populateUserList(data, pageNumber, pageSize) {

    var offset = (pageNumber - 1) * pageSize;

    const userList = data.userList;
    const totalCount = data.totalCount;

    var table = document.getElementById("user-table");
    var tableBody = document.createElement('TBODY');

    for (i = 0; i < userList.length; i++) {

        var item = userList[i];

        var tr = document.createElement('TR');

        var serialTd = document.createElement('TD')
        serialTd.appendChild(document.createTextNode(offset + i + 1));
        serialTd.setAttribute('class', 'text-center');
        tr.appendChild(serialTd);

        var nameTd = document.createElement('TD')
        nameTd.appendChild(document.createTextNode(item.name));
        tr.appendChild(nameTd);

        var emailTd = document.createElement('TD')
        emailTd.appendChild(document.createTextNode(item.email));
        tr.appendChild(emailTd);


        let adminStatus = 'Not Admin';
        if (item.isAdmin === true) {
            adminStatus = 'Admin';
        }

        var adminTd = document.createElement('TD')
        adminTd.appendChild(document.createTextNode(adminStatus));
        adminTd.setAttribute('class', 'text-right');
        tr.appendChild(adminTd);


        var btnTd = document.createElement('TD')
        btnTd.setAttribute('class', 'td-actions text-right');

        var profileBtn = document.createElement("BUTTON");

        // data for modal
        profileBtn.setAttribute('data-name', item.name);
        profileBtn.setAttribute('data-email', item.email);
        profileBtn.setAttribute('data-admin', item.isAdmin);
        // end data

        profileBtn.setAttribute('data-toggle', 'modal');
        profileBtn.setAttribute('data-target', '#usrInfoModal');
        profileBtn.setAttribute('class', 'btn btn-info btn-simple btn-icon btn-sm');

        var btnIcon = document.createElement("I");
        btnIcon.setAttribute('class', 'tim-icons icon-single-02');

        profileBtn.appendChild(btnIcon);
        profileBtn.setAttribute('style', 'padding-right: 10px;');
        btnTd.appendChild(profileBtn);

        var adbtn = document.createElement("BUTTON");

        var pageName = 'user-ad.html?id=' + item._id;
        adbtn.setAttribute('onclick', `changePage('${pageName}')`);
        adbtn.setAttribute('class', 'btn btn-info btn-simple btn-icon btn-sm');

        var adBtnIcon = document.createElement("I");
        adBtnIcon.setAttribute('class', 'fab fa-adversal');

        adbtn.appendChild(adBtnIcon);
        adbtn.setAttribute('style', 'padding-right: 10px;');
        btnTd.appendChild(adbtn);

        var editBtn = document.createElement("BUTTON");

        // data for modal
        editBtn.setAttribute('data-name', item.name);
        editBtn.setAttribute('data-email', item.email);
        editBtn.setAttribute('data-admin', item.isAdmin);
        // end data

        editBtn.setAttribute('data-toggle', 'modal');
        editBtn.setAttribute('data-target', '#userEditModal');
        editBtn.setAttribute('class', 'btn btn-success btn-simple btn-icon btn-sm');

        var editIcon = document.createElement("I");
        editIcon.setAttribute('class', 'tim-icons icon-settings-gear-63');

        editBtn.appendChild(editIcon);
        btnTd.appendChild(editBtn);

        var deleteBtn = document.createElement("BUTTON");

        deleteBtn.setAttribute('data-toggle', 'modal');
        deleteBtn.setAttribute('data-target', '#usrDeleteModal');
        deleteBtn.setAttribute('class', 'btn btn-danger btn-simple btn-icon btn-sm');
        deleteBtn.setAttribute('data-id', item._id);

        var delIcon = document.createElement("I");
        delIcon.setAttribute('class', 'tim-icons icon-simple-remove');

        deleteBtn.appendChild(delIcon);
        btnTd.appendChild(deleteBtn);

        tr.appendChild(btnTd);

        tableBody.appendChild(tr);

    }

    var oldTbody = table.tBodies[0];
    if (oldTbody !== undefined) {

        oldTbody.parentNode.replaceChild(tableBody, oldTbody);
    } else {

        table.appendChild(tableBody);
    }

    adjustUserListPaginationPannel(pageNumber, totalCount);
}

function populateAdList(data, pageNumber, pageSize) {

    var offset = (pageNumber - 1) * pageSize;

    const adList = data.advertisementList;
    const totalCount = data.totalCount;

    if (adList.length === 0) {
        var noDataLabel = document.getElementById("no-data-text");
        noDataLabel.style.display = "block";
    } else {

        var adTableDiv = document.getElementById("ad-table-div");
        adTableDiv.style.display = "block";

        var table = document.getElementById("ad-table");
        var tableBody = document.createElement('TBODY');

        for (i = 0; i < adList.length; i++) {

            var item = adList[i];

            var tr = document.createElement('TR');

            var serialTd = document.createElement('TD')
            serialTd.appendChild(document.createTextNode(offset + i + 1));
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

            var pageName = 'edit-ad.html?id=' + item._id;
            editBtn.setAttribute('onclick', `changePage('${pageName}')`);

            editBtn.setAttribute('class', 'btn btn-success btn-simple btn-icon btn-sm');

            var editIcon = document.createElement("I");
            editIcon.setAttribute('class', 'tim-icons icon-settings-gear-63');

            editBtn.appendChild(editIcon);
            btnTd.appendChild(editBtn);


            var deleteBtn = document.createElement("BUTTON");

            deleteBtn.setAttribute('data-toggle', 'modal');
            deleteBtn.setAttribute('data-target', '#adDeleteModal');
            deleteBtn.setAttribute('class', 'btn btn-danger btn-simple btn-icon btn-sm');
            deleteBtn.setAttribute('data-id', item._id);

            var delIcon = document.createElement("I");
            delIcon.setAttribute('class', 'tim-icons icon-simple-remove');

            deleteBtn.appendChild(delIcon);
            btnTd.appendChild(deleteBtn);

            tr.appendChild(btnTd);

            tableBody.appendChild(tr);

        }
        var oldTbody = table.tBodies[0];
        if (oldTbody !== undefined) {

            oldTbody.parentNode.replaceChild(tableBody, oldTbody);
        } else {

            table.appendChild(tableBody);
        }
        adjustAdListPaginationPannel(pageNumber, totalCount);
    }

}


function deleteUser(id) {
    console.log('user delete: ' + id);
    setTimeout(function () {
        location.reload();
    }, 500);
}

function deleteAd(id) {
    console.log('ad delete: ' + id);
    setTimeout(function () {
        location.reload();
    }, 500);
}

$('#usrDeleteModal').on('show.bs.modal', function (event) {

    var idToDelete = $(event.relatedTarget).data('id');

    $(this).find("#usr-del-confirm-btn").click(function () {

        deleteUser(idToDelete);
        $('#usrDeleteModal').remove();
    });
});

$('#adDeleteModal').on('show.bs.modal', function (event) {

    var idToDelete = $(event.relatedTarget).data('id');

    $(this).find("#ad-del-confirm-btn").click(function () {

        deleteAd(idToDelete);
        $('#usrDeleteModal').remove();
    });
});


$('#usrInfoModal').on('show.bs.modal', function (event) {


    var name = $(event.relatedTarget).data('name');
    var email = $(event.relatedTarget).data('email');
    var admin = $(event.relatedTarget).data('admin');

    let adminStatus = 'Not Admin';
    if (admin === true) {
        adminStatus = 'Admin';
    }

    $('#click-card-name').html('<h3>Name: ' + name + '</h3>');
    $('#click-card-email').html('<h4>Email: ' + email + '</h4>');
    $('#click-card-admin').html('<h4>Status: ' + adminStatus + '</h4>');
});



$('#userEditModal').on('show.bs.modal', function (event) {


    var name = $(event.relatedTarget).data('name');
    var email = $(event.relatedTarget).data('email');
    var admin = $(event.relatedTarget).data('admin');

    console.log(email);

    let adminStatus = false;
    if (admin === true) {
        adminStatus = true;
    }

    $('#usr-edit-name').val(name);
    $('#usr-edit-email').val(email);
    $('#usr-edit-password').val('');
    $('#usr-edit-admin').prop('checked', adminStatus);
});


function clearUsrDeleteModal(event) {
    $(event.relatedTarget).data('id') = null;
}

function adjustUserListPaginationPannel(pageNumber, totalCount) {

    var pageSize = 5;
    var maxVisible = 5;
    var totalPageCount = 0;
    var fraction = totalCount / pageSize;

    if (Number.isInteger(fraction) === true) {
        totalPageCount = fraction;
    } else {
        totalPageCount = Math.floor(fraction) + 1;
    }

    $('.usr-pagination').bootpag({
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
        getUserList(num, pageSize);
    });
}


function adjustAdListPaginationPannel(pageNumber, totalCount) {

    var pageSize = 5;
    var maxVisible = 5;
    var totalPageCount = 0;
    var fraction = totalCount / pageSize;

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
        getAdvertisementList(num, pageSize);
    });
}


function notificationCheck() {

    let params = (new URL(document.location)).searchParams;
    let adCreationVal = params.get("adCreation");
    let adUpdateVal = params.get("adUpdate");

    if (adCreationVal === "successful") {
        $.notify("Advertisement created successfully.", "success");
    }

    if (adUpdateVal === "successful") {
        $.notify("Advertisement updated successfully.", "success");
    }
}
