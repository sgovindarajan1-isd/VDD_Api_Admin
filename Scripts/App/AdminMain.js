$(document).ready(function () {
    debugger;
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

    //$("#btn_logout").on('click', function () {
    //    //$('#logoutModal').modal('hide');
    //    sessionStorage.clear();
    //    window.location.href = "/Home/Index";
    //});

    $("#btn_logout").click(function () {
        debugger;
        //$('#logoutModal').modal('hide');
        sessionStorage.clear();
        window.location.href = "/Home/Index";
    });
   
});