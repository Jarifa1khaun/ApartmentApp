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

            console.log(errMsg);
        });
    }
}

function configurepage(id, data) {

    var pageSize = 5;
    var pageNumber = 1;

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
                populateAdList(data, pageNumber, pageSize);
            }
        }).fail(function (errMsg) {

            console.log(errMsg);
        });
    }
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


function deleteAd(id) {
    console.log('ad delete: ' + id);
    setTimeout(function () {
        location.reload();
    }, 500);
}

$('#adDeleteModal').on('show.bs.modal', function (event) {

    var idToDelete = $(event.relatedTarget).data('id');

    $(this).find("#ad-del-confirm-btn").click(function () {

        deleteAd(idToDelete);
        $('#usrDeleteModal').remove();
    });
});

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
