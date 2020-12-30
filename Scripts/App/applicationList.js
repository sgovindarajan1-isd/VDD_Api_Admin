$(document).ready(function () {
    $("#lbl_userName").text(sessionStorage.getItem('userName'));  //id_userName
    var pendingAssignList = [];
    var pendingMyApprovalList = [];
    var userId = sessionStorage.getItem('UserId');
    $("#ddGrid_filter").hide();
    $("#div_ageFilter").show();
    $("#div_customizeFilter").show();
    $("#btn_customizeFilter").show();

    if (window.location.href.indexOf('?') > 0) {
        $("#pnl_advanceSearch").show();
        $("#pnl_applicationInfo").hide();
        $("#pnl_applicationAgeInfo").hide();
        $("#pnl_ManageUserInfo").hide();
    }

    $("#btn_Advsearch").click(function () {
        var confNumber = $("#search_confirmationNumber").val();
        var venNumber = $("#search_VendorNumber").val();
        var payeeName = $("#search_PayeeName").val();
        var receivedDate = $("#search_ReceivedDate").val();
        var statusDate = $("#search_StatusDate").val();
        var appStatus = $("#advanceSearch_StatusList  option:selected").val();
        var appType = $("#advanceSearch_ApplicationTypeList  option:selected").val();

        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'ConfirmationNum': confNumber, 'VendorNumber': venNumber, 'PayeeName': payeeName,
                'ReceivedDate': receivedDate, 'AssignedDate': statusDate, 'StatusCode': appStatus,
                'FilterApptype': appType, 'FilterAge': 0
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetApplicationAdvancedSearch/",
            success: function (data) {
                setData(data.data.lst_AppSearchList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    });
    debugger;
    getApplicationCustomFilterList();

    //building Side Manage user menu
    getManageUserMenuList();

    debugger;
    // first priority given to click from chart
    if ((sessionStorage.getItem("fromPendingAssignmentChartClick") != null) && (sessionStorage.getItem("fromPendingAssignmentChartClick") != 'null')) {
        var ag = sessionStorage.getItem("fromPendingAssignmentChartClick");
        getApplicationListFilteredByAge(ag);        
    }

    else if ((sessionStorage.getItem("fromPendingMyApprovalChartClick") != null)  && (sessionStorage.getItem("fromPendingMyApprovalChartClick") != 'null')) {
        var ageMyapprove =  sessionStorage.getItem("fromPendingMyApprovalChartClick")
        getApplicationListFilteredByAge(ageMyapprove);

        $(".leftNavItem").removeClass('leftNavItemActive');
        $("#sidemenu_PendingMyApproval").addClass('leftNavItemActive');

        $("#heading_applicationlist").text("Pending My Approval");
        $("#div_ageFilter").show();
        $("#div_customizeFilter").show();
        $("#btn_customizeFilter").show();
    }
    else if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {
        getApplicationDetails(GlobalRoles.SupervisorRole, userId, '5', '21,22,23');  //  supervisor and adminwill see all the pending  status
    }
    else if (GlobalUserHasRoles.ProcessorRole) {
        $("#sidemenu_PendingAssignment").hide();
        $("#sidemenu_PendingAssignment").addClass('isDisabledApplicationListLink');
        $("#heading_applicationlist").text("Pending My Approval");
        $("#sidemenu_PendingMyApproval").addClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").removeClass('leftNavItemActive');

        getApplicationDetails(GlobalRoles.ProcessorRole, userId, '2', '');  //  Processor will see only  My pending approval  ( not the application pending assignment)
    }

    $("#sidemenu_PendingAssignment").click(function () {
        //$("#sidemenu_PendingMyApproval").removeClass('leftNavItemActive');
        //$("#sidemenu_PendingAssignment").addClass('leftNavItemActive');
        $(".leftNavItem").removeClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").addClass('leftNavItemActive');
        $("#heading_applicationlist").text("Application Pending Assignment");
        $("#div_ageFilter").show();
        $("#div_customizeFilter").show();
        $("#btn_customizeFilter").show();
        setData(pendingAssignList);
    });

    $("#sidemenu_PendingMyApproval").click(function () {
        $(".leftNavItem").removeClass('leftNavItemActive');
        $("#sidemenu_PendingMyApproval").addClass('leftNavItemActive');
       // $("#sidemenu_PendingAssignment").removeClass('leftNavItemActive');

        $("#heading_applicationlist").text("Pending My Approval");
        $("#div_ageFilter").show();
        $("#div_customizeFilter").show();
        $("#btn_customizeFilter").show();

        setData(pendingMyApprovalList);
    });

    $("#sidemenu_ManageUserInfo").click(function () {
        window.location.href = '/applicationList/ManageUserList';
    });

    $("#btn_customizeFilter").click(function () {
        debugger;
        var filterApptype = $("#filterApplicationType  option:selected").text();
        var filterUser = $("#filterUser  option:selected").val();
        var filterStatus = $("#filterStatus  option:selected").text();
        var age = $("#filerAge  option:selected").val();

        // Default view for Supervisor
        //if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
        //     getApplicationDetails(12, userId, '5', '21,22,23', age, filterApptype, filterUser, filterStatus);  //  supervisor will see all the pending  status
        //}

        //// Default view For Processor
        //if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor
        //     getApplicationDetails(11, userId, '2', '', age, filterApptype, filterUser, filterStatus);  //  Processor will see only  My pending approval  ( not the application pending assignment)
        // }

        if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {    //12 - Supervisor
            getApplicationDetails(GlobalRoles.SupervisorRole, userId, '5', '21,22,23', age, filterApptype, filterUser, filterStatus);  //  supervisor will see all the pending  status
        }
        if (GlobalUserHasRoles.ProcessorRole) {
            getApplicationDetails(GlobalRoles.ProcessorRole, userId, '2', '', age, filterApptype, filterUser, filterStatus);  //  Processor will see only  My pending approval  ( not the application pending assignment)
        }

        $("#customizeFilterModal").modal('hide');
    });

   
    $("#btn_0_15_days").click(function () {
        debugger;
        getApplicationListFilteredByAge(15);
    });

    $("#btn_16_30_days").click(function () {
        debugger;
        getApplicationListFilteredByAge(30);
    });

    $("#btn_31_60_days").click(function () {
        getApplicationListFilteredByAge(60);
    });

    $("#btn_60_plus_days").click(function () {
        getApplicationListFilteredByAge(61);
    });

    function getApplicationListFilteredByAge(age) {
        // Default view for Supervisor
        //if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
        //    getApplicationDetails(12, userId, '5', '21,22,23', age,'','','');  //  supervisor will see all the pending  status
        //}

        //// Default view For Processor
        //if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor
        //    getApplicationDetails(11, userId, '2', '', age,'','','');  //  Processor will see only  My pending approval  ( not the application pending assignment)
        //}
        debugger;
        sessionStorage.setItem("fromPendingAssignmentChartClick", null);
        sessionStorage.setItem("fromPendingMyApprovalChartClick", null);

        if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {    //12 - Supervisor
            getApplicationDetails(GlobalRoles.SupervisorRole, userId, '5', '21,22,23', age, '', '', '');
        }
        if (GlobalUserHasRoles.ProcessorRole) {
            $("#div_application_PendingAssignment").remove();
            getApplicationDetails(GlobalRoles.ProcessorRole, userId, '2', '', age, '', '', '');
        }
    };

    $('#ddGrid').on('click', 'tbody tr', function () {
        sessionStorage.setItem('selectedConfirmationNumber', $('#ddGrid').DataTable().row(this).data().ConfirmationNum);
        sessionStorage.setItem('selectedRequestType', $('#ddGrid').DataTable().row(this).data().RequestType);
    });

    $("#div_ManagerUserApplist").on("click", "a.manageUserAppLink", function () {
        $(".leftNavItem").removeClass('leftNavItemActive');
        $($(this)[0]).addClass('leftNavItemActive');

        debugger;
        // $("#heading_applicationlist").text($(this)[0].innerHTML);
        $("#heading_applicationlist").text($(this).contents().get(0).nodeValue);
        $("#div_ageFilter").hide();
        $("#div_customizeFilter").hide();
        $("#btn_customizeFilter").hide();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'ManageUserMenuId': $($(this)[0]).attr('value')
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/getApplicationListByManageUserMenuId/",
            success: function (data) {
                setData(data.data.manageUserApplicationList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    });

    function setData(data) {
        $('#ddGrid').DataTable().destroy();
        $('#ddGrid').empty();
        $('#ddGrid').dataTable({
            responsive: true,
            searching: false,
            paging: true,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "ConfirmationNum",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            data = '<a href="applicationSummary">' + row.RequestType + ' - ' + data + ' </a>';
                        }

                        return data;
                    },
                    "title": "Confirmation #", "width": '52px'
                },
                { 'data': 'VendorName', "title": "Payee Name" },
                { 'data': 'ReceivedDate', "title": "Received Dt" },
                { 'data': 'AssignedDate', "title": "Assignment Dt" },
                {
                    'data': 'ApplicationAge',
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {

                            if (data <= 15 ) {
                                data = '<span class="fa fa-fw fa-circle text-green" aria-hidden="true"> </span>' + data + ' days';
                            }
                            else if (data >= 16 && data <= 30) {
                                data = '<span class="fa fa-fw fa-circle text-blue" aria-hidden="true"> </span>' + data + ' days';
                            } else if (data >= 31  &&  data < 60 ) {
                                data = '<span class="fa fa-fw fa-circle text-orange" aria-hidden="true"> </span>' + data + ' days';
                            } else {
                                data = '<span class="fa fa-fw fa-circle text-red" aria-hidden="true"> </span>' + data + ' days';
                            }

                        }

                        return data;
                    },

                    "title": "Application Age"
                },
                { 'data': 'StatusDesc', "title": "Status" }
            ],

            columnDefs: [
                { "width": "30%", "targets": [0, 1] },
                { "width": "10%", "targets": [2, 3] },
                { "width": "20%", "targets": [4] },
                { "width": "5%", "targets": [5] },
                {
                    searching: false,
                    data: null,
                    defaultContent: '',
                    orderable: false,
                },
            ],
            select: {
                selector: 'td:first-child'
            }
        });
    };

    function getApplicationDetails(roleId, userID, pendingAssignmentStatus, myapprovalStatus, filterAge, filterApptype, filterUser, filterStatus) {
        $(".ageFilterBtn").css("background-color", "transparent").css("color", "#4a4a4a");

        if (filterAge == 15)
            $(".btnAge15").css("background-color", "#9435e6").css("color", "#fff");
        else if (filterAge == 30)
            $(".btnAge30").css("background-color", "#9435e6").css("color", "#fff");
        else if (filterAge == 60)
            $(".btnAge60").css("background-color", "#9435e6").css("color", "#fff");
        else if (filterAge == 61)
            $(".btnAge61").css("background-color", "#9435e6").css("color", "#fff");

        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'RoleId': roleId, 'UserId': userID, 'PendingAssignmentStatus': pendingAssignmentStatus, 'MyapprovalStatus': myapprovalStatus, 'FilterAge': filterAge, 'FilterApptype': filterApptype, 'FilterUser': filterUser, 'FilterStatus': filterStatus
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetApplicationListAssigned/",
            success: function (data) {
                $("#span_countPendingAssignment").text(data.data.pendingAssignmentList.length); //sessionStorage.getItem("totalApplicationPendingCount"));
                $("#span_appPendingOver60Days").text(sessionStorage.getItem("totalPendingMyApprovalCountOver60"));
                $("#span_countPendingMyApproval").text(data.data.pendingMyApprovalList.length);//sessionStorage.getItem("totalPendingMyApprovalCount"));

                pendingAssignList = data.data.pendingAssignmentList;
                pendingMyApprovalList = data.data.pendingMyApprovalList;
                if (roleId == 12) {  //  supervisor view
                    if ($("#sidemenu_PendingMyApproval").hasClass("leftNavItemActive")) {
                        setData(pendingMyApprovalList);
                    }
                    else {
                        setData(pendingAssignList);  // default
                    }
                }
                else { // processor list
                    setData(pendingMyApprovalList);
                }
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    function getApplicationCustomFilterList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetApplicationCustomFilterList/",
            dataType: 'json',

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                applicationTypeList = data.data.applicationTypeList;
                userList = data.data.userList;
                statusList = data.data.statusList;

                var filterUserList = $('#filterUser');
                $.each(userList, function (key, value) {
                    filterUserList.append(
                        $('<option></option>').html(value.Text).val(value.IdText)
                    );
                });

                var filterApplicationTypeList = $('#filterApplicationType');
                var advanceSearch_ApplicationTypeList = $('#advanceSearch_ApplicationTypeList');

                $.each(applicationTypeList, function (key, value) {
                    filterApplicationTypeList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                    advanceSearch_ApplicationTypeList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });

                var filterStatusList = $('#filterStatus');
                var advanceSearch_StatusList = $('#advanceSearch_StatusList');
                $.each(statusList, function (key, value) {
                    filterStatusList.append(
                        $('<option></option>').val(value.Id).html(value.Text)
                    );

                    advanceSearch_StatusList.append(
                        $('<option></option>').val(value.Id).html(value.Text)
                    );
                });
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in Getting Application Type List , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }


    function buildManageUserApplicationList(data) {
        debugger;
        var str = ""
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                var str = '<a class="leftNavItem manageUserAppLink" value=' + data[i].ManageUserMenuId + '>' +
                    data[i].ManageUserMenuName +
                    '<span class="badge pull-right" style="margin-right:3px;">' + data[i].ApplicationCount +'</span>'  +

                    '</a>'
                //ApplicationCount
                $("#div_ManagerUserApplist").append(str);
            }
        }
    }

    function getManageUserMenuList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'ManageUserMenuId': 0, 'UserId': userId }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/getManageUserMenuList/",
            success: function (data) {
                buildManageUserApplicationList(data.data.manageUserMenuList); 
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

});