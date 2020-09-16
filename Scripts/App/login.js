$(document).ready(function () {
    //$("#top-menu11").hide();
    $("#menu_TopPanel").hide();
    $("#menu_div_TopPanel").hide();
    $("#liNavigation").hide();
    $("#pnl_login_footer").hide();

    //GetVendorNumber()  //   have two  different method  works no issues,  for now  post is not working
    //loginUser1();
    //loginUser();
    // Post_GetVendorNamebyNameFromURI();

    //$.getJSON("https://api.ipify.org/?format=json", function (e) {
    //    debugger;
    //});

    //$.get("https://ipinfo.io", function (response) {
    //}, "json");


    //$.getJSON("http://smart-ip.net/geoip-json?callback=?", function (data) {
    //    debugger;
    //});

    //function myIP() {
    //    debugger;
    //    if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
    //    else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

    //    xmlhttp.open("GET", "http://api.hostip.info/get_html.php ", false);
    //    xmlhttp.send();

    //    hostipInfo = xmlhttp.responseText.split("n");

    //    for (i = 0; hostipInfo.length >= i; i++) {
    //        ipAddress = hostipInfo[i].split(":");
    //        if (ipAddress[0] == "IP") {
    //            ipAddress[1];
    //        }
    //    }

    //    return false;
    //}

    //myIP();


    $("#btn_login").click(function () {
        var txt_userName = $('#txt_userName').val();
        var txt_Password = $('#txt_Password').val();
        loginUser(txt_userName, txt_Password)
    });

    $("#btn_login_trans").click(function () {
        window.location.href = "https://localhost:44373/Transaction/TransView";
    }
    );

    $("#btn_login_transSummary").click(function () {
        window.location.href = "https://localhost:44373/Transaction/SummaryView";
    });

 //function loginUser() {
//    debugger;
//    $.ajax({
//        contentType: 'application/json; charset=utf-8',
//        type: "GET",
//        dataType: 'json',
//        headers: {
//            'Authorization': 'Basic ' + btoa('admin')  // This method can be called before login,  so there wont be any security token created,  hense this by pass
//        },

//        data: JSON.stringify({ 'Id': '123',  'Text': 'srih' }),
//        url: "/api/values/LoginAdminUser/",  //loginUser
//        success: function (data) {
//        }
//        , error: function (jqXHR, textStatus, errorThrown) {
//        }
//    });
//    };

    function loginUser(userId, password) {

        //testing values
        if ($(location).attr('href').indexOf("local") > -1) {
            ////  To do :  test values for easy access,  remove later
            //var userId = 'e622505';   // data entry -- old supervisor

            var userId = 'c197831';   //  processor
            var password = '';
        }
        //testing values

        sessionStorage.clear();

        var SecuredToken = '';

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "post",
            //url:  "api/values/LoginAdminUser/",
            dataType: 'json',
            data: JSON.stringify({ 'UserId': userId, 'Password': password }),
            url: "/api/values/LoginAdminUser/",  

            beforeSend: function () {
                $("#loaderDiv").show();
            },
            headers: {
                'Authorization': 'Basic ' + btoa('admin')  // This method can be called before login,  so there wont be any security token created,  hense this by pass
            },

            success: function (data) {
                debugger;

                if (data.data.List_userRoles.length > 0) {
                    sessionStorage.setItem('RoleId', data.data.List_userRoles[0].RoleId);
                }

                sessionStorage.setItem('UserId', userId);
                sessionStorage.setItem('UserName', data.data.userProfile_2.displayNameField);
                sessionStorage.setItem('UserRoles', data.data.List_userRoles);  // example  data.data.List_userRoles[0].UserID UserName UserStatus RoleId RoleName PermissionName
                $("#id_userName").text(data.data.userProfile_2.displayNameField);

                sessionStorage.setItem('deptUser', false);  //  from active directory, if the user dept code is "Audit controller" then disbursement user otherwise dept user.



                if (data.data.IsValidUser == true) {
                    //var UserName = data.data.userId;
                    // Setting global variable to authendicate the user

                    // if DeptUser go
                      //deptuser landing page and dataentry role
                    //else if  //Dispersement user and dataentry role
                       //vendor code entry page
                    if (sessionStorage.getItem('RoleId') == GlobalRoles.DataEntryRole) {
                        window.location.href = '/draft/_partialVendor';
                    }
                    else if ((sessionStorage.getItem('RoleId') == GlobalRoles.ProcessorRole)  || (sessionStorage.getItem('RoleId') == GlobalRoles.SupervisorRole)) {
                        window.location.href = '/home/dashboard';
                    }
                    //vdd.GlobalVariables.UserName = data.data.UserId;
                    $("#loaderDiv").hide();
                }
                else {
                    //$("#lbl_invaliduserentry").text("Invalid Username and Password!")
                    $("#fileError_or_Info").html('Your login attempt was not successful or you don’t have the right credentials. Please try again or contact Los Angeles County.');
                    $("#loaderDiv").hide();
                }
            }
            , complete: function (jqXHR) {

                if (jqXHR.status == '404') {
                    //$("#lbl_invaliduserentry").text("Invalid Username and Password!")
                    $("#fileError_or_Info").html('Your login attempt was not successful or you don’t have the right credentials. Please try again or contact Los Angeles County.');
                }
                $("#loaderDiv").hide();
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
                $("#fileError_or_Info").html(jqXHR.responseJSON.data);
                $("#loaderDiv").hide();
            }
        });
    };
    //function loginUser() {
    //        debugger;
    //        $.ajax({
    //            contentType: 'application/json; charset=utf-8',
    //            type: "GET",
    //            dataType: 'json',
    //            //data: JSON.stringify({ 'Id': '123', 'Text': 'srih' }),
    //            data: JSON.stringify({ 'UserId': 'userid', 'Tin': 'tin' }),
    //            url: "/api/values/LoginAdminUser/",  //loginUser
    //            success: function (data) {
    //            }
    //            , error: function (jqXHR, textStatus, errorThrown) {
    //            }
    //        });
    //    };

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

//function loginUser() {
//    debugger;
//    $.ajax({
//        contentType: 'application/json; charset=utf-8',
//        type: "GET",
//        dataType: 'json',
//        headers: {
//            'Authorization': 'Basic ' + btoa('admin')  // This method can be called before login,  so there wont be any security token created,  hense this by pass
//        },

//        data: JSON.stringify({ 'Id': '123',  'Text': 'srih' }),
//        url: "/api/values/LoginAdminUser/",  //loginUser
//        success: function (data) {
//        }
//        , error: function (jqXHR, textStatus, errorThrown) {
//        }
//    });
//};

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
