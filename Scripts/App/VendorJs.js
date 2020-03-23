//Test 1 at branch dev
$(document).ready(function () {
    //alert("ready!!!!!!!!!!!!!");
    //GeneralPost()
    debugger;
    GetVendorNumber()  //   have two  different method  works no issues,  for now  post is not working

    loginUser();
     Post_GetVendorNamebyNameFromURI();


    $("#btn_login").click(function () {
        debugger;
        //var url = "/Transaction/";
        //window.location.href = url;
        //window.location.href = '@Url.Action("Index", "Transaction")';  //  not working
        //document.location = '@Url.Action("Index", "Transaction")';
        window.location.href = "https://localhost:44373/Transaction/Index";
    }
    );

    $("#btn_login_trans").click(function () {
        debugger;
        alert('Transaction');
        window.location.href = "https://localhost:44373/Transaction/TransView";
    }
    );

    $("#btn_login_transSummary").click(function () {
    debugger;
    alert('Transaction Summary');
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
            alert('success GetVendorNumber');
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            alert('error GetVendorNumber');
        }
    });

    $.ajax({
        contentType: "application/json; charset=utf-8",
        type: "get",
        dataType: 'json',

        url: "api/values/Different_get_2/20",
        success: function (data) {
            //        alert('success Different_get_2');
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            //       alert('error Different_get_2');
        }
    });
}


function Post_GetVendorNamebyNameFromURI() {
     $.ajax({
        url: 'api/values/GetVendorNamebyNameFromURI?Name=TestSrini',
        type: 'POST',
        dataType: 'json',
        success: function (data, textStatus, xhr) {
  //          alert('success GetVendorNamebyNameFromURI');
        },
        error: function (xhr, textStatus, errorThrown) {
   //         alert('Error in GetVendorNamebyNameFromURI');
        }
    });
}

//var userToken = "SriniToken";
//$.ajax({
// //   contentType: "application/json; charset=utf-8",
//    contentType: "application/json",
//    type: "POST",
//    dataType: 'json',
//    //data: { 'loc': 'cerritos' },
//    data: { 'userToken': userToken},
//    url: "api/values/GetVendorNamebyName_get/",
//    success: function (data) {
// //       alert('success GetVendorNamebyName_get   post');
//    }
//    , error: function (jqXHR, textStatus, errorThrown) {
//  //      alert('error GetVendorNamebyName_get post');
//    }
//});


//$.ajax({
//  //  contentType: "application/json; charset=utf-8",
//    type: "POST",
//    dataType: 'json',
//    //data: {'loc' :'cerritos'},
//    data: { "": "Sourav Kayal" },
//    url: "api/values/GetVendorNamebyName",
//    success: function (data) {
//        alert('success parambyname');
//    }
//    , error: function (jqXHR, textStatus, errorThrown) {
//        alert('error parambyname');
//    }
//});




//$.ajax({


//    url: "/api/values/GetVendorNumber/10",
//    contentType: "application/json",
//    dataType: 'json',
//    success: function (result) {
//        alert('success  2334');
//    },
//    error: function (jqXHR, textStatus, errorThrown) {
//        alert('error1111');
//    }
//})

function loginUser() {
    debugger;
    alert('entering login user');
    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ 'Id': '123',  'Text': 'srih' }),
        url: "/api/values/loginUser/",
        success: function (data) {
            debugger;
            //       alert('success GetVendorNamebyName_get   post');
        }
        , error: function (jqXHR, textStatus, errorThrown) {
            //      alert('error GetVendorNamebyName_get post');
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
        //    alert('success GeneralPost');
        }
        , error: function (jqXHR, textStatus, errorThrown) {
    //        alert('error GeneralPost');
        }
    });
}
