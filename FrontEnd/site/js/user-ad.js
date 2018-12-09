var port = 3000;
var site = getBackEndIPAddress();
var BASE_URL = `http://${site}:${port}/api/`;

var apiKey = window.localStorage.getItem('x-auth-token');

var initialPageNumber = 1;
var initialPageSize = 5;

getProfileInfo();

function getProfileInfo() {

    let params = (new URL(document.location)).searchParams;
    let id = params.get("id");

    var profileInfoURL = BASE_URL + "users/" + id;

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
                configurepage(id, data);
            }
        }).fail(function (errMsg) {

            var msg = JSON.parse(errMsg.responseText);
            var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
            showNotification(msgToDisplay, "error");
        });
    }
}

function configurepage(id, data) {

    var pageSize = initialPageSize;
    var pageNumber = initialPageNumber;

    if (data !== null) {

        updateNameCard(data);
        getAdvertisementList(id, pageNumber, pageSize);
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

function getAdvertisementList(id, pageNumber, pageSize) {


    var advertisementListURL = BASE_URL + `advertisement/getAdvertisementByUserId/${id}?pageSize=${pageSize}&pageNumber=${pageNumber}`;

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
                populateAdList(data, pageNumber, pageSize, id);
            }
        }).fail(function (errMsg) {

            var msg = JSON.parse(errMsg.responseText);
            var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
            showNotification(msgToDisplay, "error");
        });
    }
}

function populateAdList(data, pageNumber, pageSize, id) {

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
            nameTd.setAttribute('class', 'text-left');
            nameTd.appendChild(document.createTextNode(item.name));
            tr.appendChild(nameTd);

            var validity = moment(item.invalid_after).startOf('day');
            var validityTd = document.createElement('TD')
            validityTd.setAttribute('class', 'text-right');
            validityTd.appendChild(document.createTextNode(validity.format('Do MMM, YYYY')));
            tr.appendChild(validityTd);

            var btnTd = document.createElement('TD')
            btnTd.setAttribute('class', 'td-actions text-right');

            var profileBtn = document.createElement("BUTTON");
            profileBtn.setAttribute('onclick', `adDetailsClickActionListener('${item._id}')`);
            profileBtn.setAttribute('class', 'btn btn-info btn-simple btn-icon btn-sm');

            var btnIcon = document.createElement("I");
            btnIcon.setAttribute('class', 'fas fa-info-circle');

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

        adjustAdListPaginationPannel(pageNumber, pageSize, totalCount, id);
    }

}

function adjustAdListPaginationPannel(pageNumber, pageSize, totalCount, id) {

    var maxVisible = 5;
    var totalPageCount = 0;
    var fraction = totalCount / pageSize;

    var paginationDiv = document.getElementById('ad-paging-div');

    if (paginationDiv.childElementCount === 1) {
        paginationDiv.removeChild(paginationDiv.children[0]);
        var newP = document.createElement('P');
        newP.classList.add('ad-pagination');
        paginationDiv.appendChild(newP);
    }

    if (Number.isInteger(fraction) === true) {
        totalPageCount = fraction;
    } else {
        totalPageCount = Math.floor(fraction) + 1;
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
        getAdvertisementList(id, num, pageSize);
    });
}

$('#adDeleteModal').on('show.bs.modal', function (event) {

    var idToDelete = $(event.relatedTarget).data('id');

    $(this).find("#ad-del-confirm-btn").click(function () {

        deleteAd(idToDelete);
        $('#usrDeleteModal').remove();
    });
});

function deleteAd(id) {

    const deleteUserURL = BASE_URL + `advertisement/${id}`;
    const methodType = 'DELETE';

    $.ajax({
        type: methodType,
        url: deleteUserURL,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'x-auth-token': apiKey
        },
    }).done(function (data, status, xhr) {

        if (xhr.status === 200) {
            changePage("profile-page.html?adDelete=successful");
        }
    }).fail(function (errMsg) {

        var msg = JSON.parse(errMsg.responseText);
        var msgToDisplay = errMsg.status + " " + errMsg.statusText + ", " + msg.message;
        $.notify(msgToDisplay, "error");
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

function showNotification(message, type) {

    $.notify(message, type, {
        autoHideDelay: 8000
    });
}
