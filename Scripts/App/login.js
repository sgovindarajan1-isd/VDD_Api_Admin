$(document).ready(function () {
    $("#menu_TopPanel").hide();
    $("#menu_div_TopPanel").hide();
    $("#liNavigation").hide();

    if (sessionStorage.getItem('userName') == null) {
        $("#lbl_userName").hide();
    }

    if ($(location).attr('href').indexOf("_partialDraftLanding") > -1) {
        $('#lbl_userName').text(sessionStorage.getItem('userName'));
        $("#pnl_login_footer").show();
    }
    else {
        $("#pnl_login_footer").hide();
    }       

    $("#btn_login").click(function () {
        var txt_userName = $('#txt_userName').val();
        var txt_Password = $('#txt_Password').val();
        loginUser(txt_userName, txt_Password)
    });

    $('#chk_wetSign').change(function () {
        if ($(this).is(':checked') && $('#chk_accountno').is(':checked'))
            $("#text1").show();
        else
            $("#text1").hide();
    });

    $('#chk_accountno').change(function () {
        if ($(this).is(':checked') && $('#chk_wetSign').is(':checked')) {
            $("#text1").show();
        }
        else
            $("#text1").hide();
    });

    //function UserHasonlyDataEntryRole(rolesList, role) {
    //    foreach()
    //    debugger;
    //}

    function loginUser(userId, password) {
        debugger;
        //testing values
        if ($(location).attr('href').indexOf("local") > -1) {
            ////  To do :  test values for easy access,  remove later
            var userId = 'e622505';   // data entry -- old supervisor
            //  var userId = 'e631971';//'c197831';   //  processor
            //var password = '';
        }
        //testing values

        sessionStorage.clear();
        var SecuredToken = '';
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "post",
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
                if (data.data.List_userRoles.length > 0) {
                    if (data.data.List_userRoles[0].Department == "Auditor-Controller #050") {
                        // Dispersement user
                        sessionStorage.setItem('deptUser', false);  //  from active directory, if the user dept code is "Audit controller" then disbursement user otherwise dept user.
                    }
                    else {
                        // Department user
                        sessionStorage.setItem('deptUser', true);
                    }
                }
                sessionStorage.setItem('UserId', userId);
                sessionStorage.setItem('userName', data.data.userProfile_2.displayNameField);
                sessionStorage.setItem('UserRoles', data.data.List_userRoles);  // example  data.data.List_userRoles[0].UserID UserName UserStatus RoleId RoleName PermissionName
                $("#lbl_userName").text(data.data.userProfile_2.displayNameField); //id_userName

                var userRoles = [];
                debugger;
                for (var i = 0; i < data.data.List_userRoles.length; i++) {
                    var RoleId = data.data.List_userRoles[i].RoleId;
                    userRoles.push({ RoleId });
                }
                sessionStorage.setItem('UserRolesListJson', JSON.stringify(userRoles));
                debugger;

                // testing ip
                sessionStorage.setItem('SourceIP', data.data.SourceIP);
                sessionStorage.setItem('ipInfo', data.data.IPInfo);
                
                //testing ip end

                if (data.data.IsValidUser == true) {

                    //Users in Active directory - Department code like “Audi controller” are identified as “disbursement” user otherwise  “Dept” users.

                    //var UserName = data.data.userId;
                    // Setting global variable to authendicate the user

                    // if DeptUser go
                    //deptuser landing page and dataentry role
                    //else if  //Dispersement user and dataentry role
                    //vendor code entry page
                    debugger;
                    
                   // if (sessionStorage.getItem('RoleId') == GlobalRoles.DataEntryRole) {
                    if (GlobalUserHasRoles.DataEntryRole) {
                        window.location.href = '/draft/_partialDraftLanding';//'/draft/_partialVendor';
                    }
                    else {
                        window.location.href = '/home/dashboard';
                    }
                    //else if ((sessionStorage.getItem('RoleId') == GlobalRoles.ProcessorRole) || (sessionStorage.getItem('RoleId') == GlobalRoles.SupervisorRole)) {
                    //    window.location.href = '/home/dashboard';
                    //}
                    
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
                $("#fileError_or_Info").html(jqXHR.responseJSON.data);
                $("#loaderDiv").hide();
            }
        });
    };
});


