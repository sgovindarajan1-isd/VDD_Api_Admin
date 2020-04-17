$(document).ready(function () {
    GetVendorNumber()  //   have two  different method  works no issues,  for now  post is not working
    loginUser();
     Post_GetVendorNamebyNameFromURI();


    $("#btn_login").click(function () {
        window.location.href = "https://localhost:44373/Transaction/Index";
    }
    );

    $("#btn_login_trans").click(function () {
        window.location.href = "https://localhost:44373/Transaction/TransView";
    }
    );

    $("#btn_login_transSummary").click(function () {
        window.location.href = "https://localhost:44373/Transaction/SummaryView";
    }
);
});
function GetVendorNumber() {
    $.ajax({
        contentType: "application/json; charset=utf-8",
        type: "get",
        dataType: 'json',

        url: "api/values/GetVendorNumber/10",
        success: function (data) {
        }
        , error: function (jqXHR, textStatus, errorThrown) {
        }
    });

    $.ajax({
        contentType: "application/json; charset=utf-8",
        type: "get",
        dataType: 'json',

        url: "api/values/Different_get_2/20",
        success: function (data) {
        }
        , error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}

function Post_GetVendorNamebyNameFromURI() {
     $.ajax({
        url: 'api/values/GetVendorNamebyNameFromURI?Name=TestSrini',
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
        },
        error: function (xhr, textStatus, errorThrown) {
        }
    });
}

function loginUser() {
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ 'Id': '123',  'Text': 'srih' }),
        url: "/api/values/loginUser/",
        success: function (data) {
        }
        , error: function (jqXHR, textStatus, errorThrown) {
        }
    });
};

var dataJSON = { name: "test" };
function GeneralPost() {
    $.ajax({
        type: 'POST',
        url: 'api/values/GetAndPostBlogComments',
        data: JSON.stringify(dataJSON),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (data) {
        }
        , error: function (jqXHR, textStatus, errorThrown) {
        }
    });
}
