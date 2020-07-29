$(document).ready(function () {
    //$("#top-menu11").show();
    $("#menu_applicatoinList").click(function () {
        debugger;
        window.location.href = '/applicationList/_partialApplication';
    });

    $("#lnkHome").click(function () {
        window.location.href = '/home/_partialDashboard';
    });
    
});