function togglePreferencePanel() {
    var x = document.getElementById("searchPreferencePanel");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function getAdvice() {

}


function changePage(pageName) {
    window.location.replace(pageName);
}
