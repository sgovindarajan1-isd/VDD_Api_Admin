$(document).ready(function () {
    //$("#top-menu11").show();
    $("#menu_applicatoinList").click(function () {
        debugger;
        window.location.href = '/applicationList/applicationList';
    });

    $("#lnkHome").click(function () {
        window.location.href = '/home/dashboard';
    });

    function ChangeApplicationStatus(statuscode) {
        alert("from main  js  -->"+ statuscode);
    }
    
});