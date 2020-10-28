$(document).ready(function () {
    $("#lbl_userName").text(sessionStorage.getItem('userName'));  //id_userName
    debugger;
    var userId = sessionStorage.getItem('UserId');
    $("#ddGrid_filter").hide();

    getApplicationDetails('', '', '', '', '', 0, '', 0); 

    //if (window.location.href.indexOf('?') > 0) {
    //    $("#pnl_advanceSearch").show();
    //    $("#pnl_applicationInfo").hide();
    //    $("#pnl_applicationAgeInfo").hide();
    //    $("#pnl_ManageUserInfo").hide();
    //}

    $("#btn_Advsearch").click(function () {
        var confNumber = $("#search_confirmationNumber").val();     
        var venNumber = $("#search_VendorNumber").val();
        var payeeName = $("#search_PayeeName").val();
        var receivedDate = $("#search_ReceivedDate").val();
        var statusDate = $("#search_StatusDate").val();
        var appStatus = $("#advanceSearch_StatusList  option:selected").val();
        var appType = $("#advanceSearch_ApplicationTypeList  option:selected").val();
        var filterAge = 0;

        getApplicationDetails(confNumber, venNumber, payeeName, receivedDate, statusDate, appStatus, appType, filterAge);       
    });


    GetApplicationCustomFilterList();


    //// Default view for Supervisor
    //if (sessionStorage.getItem('RoleId') == "12" || sessionStorage.getItem('RoleId') == "4") { //        12	- Supervisor
    //    getApplicationDetails(12, userId, '5', '21,22,23');  //  supervisor will see all the pending  status
    //}

    //// Default view For Processor
    //if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor
    //    getApplicationDetails(11, userId, '2', '');  //  Processor will see only  My pending approval  ( not the application pending assignment)
    //}

    function getApplicationListFilteredByAge(age) {
        var confNumber = $("#search_confirmationNumber").val();
        var venNumber = $("#search_VendorNumber").val();
        var payeeName = $("#search_PayeeName").val();
        var receivedDate = $("#search_ReceivedDate").val();
        var statusDate = $("#search_StatusDate").val();
        var appStatus = $("#advanceSearch_StatusList  option:selected").val();
        var appType = $("#advanceSearch_ApplicationTypeList  option:selected").val();
        var filterAge = age;

        getApplicationDetails(confNumber, venNumber, payeeName, receivedDate, statusDate, appStatus, appType, filterAge);
    };

    $('#ddGrid').on('click', 'tbody tr', function () {
        sessionStorage.setItem('selectedConfirmationNumber', $('#ddGrid').DataTable().row(this).data().ConfirmationNum);
        sessionStorage.setItem('selectedRequestType', $('#ddGrid').DataTable().row(this).data().RequestType);
    });

    function setData(data) {
        $('#ddGrid').DataTable().destroy();
        ////table.DataTable().destroy();
        $('#ddGrid').empty();
        //table = $('#ddGrid').dataTable({
        ////table.empty();
        //////table.dataTable({
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
                            data = '<a href="applicationSummary">' + data + ' - ' + row.RequestType + ' </a>';
                        }

                        return data;
                    },
                    "title": "Confirmation #", "width": '52px'
                },
                { 'data': 'VendorName', "title": "Payee Name" },
                { 'data': 'ReceivedDate', "title": "Received Dt" },
                { 'data': 'AssignedDate', "title": "Assignment Dt" },
                { 'data': 'ApplicationAge', "title": "Application Age" },
                { 'data': 'StatusDesc', "title": "Status" }
            ],

            columnDefs: [
                { "width": "30%", "targets": [0, 1] },
                { "width": "10%", "targets": [2, 3, 4] },
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

    function getApplicationDetails(confNumber, venNumber, payeeName, receivedDate, statusDate, appStatus, appType, filterAge) {
        debugger;
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'ConfirmationNum': confNumber, 'VendorNumber': venNumber, 'PayeeName': payeeName,
                'ReceivedDate': receivedDate, 'AssignedDate': statusDate, 'StatusCode': appStatus,
                'FilterApptype': appType, 'FilterAge': filterAge
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
    };


        //    $.ajax({
    //        contentType: 'application/json; charset=utf-8',
    //        type: "POST",
    //        dataType: 'json',
    //        data: JSON.stringify({
    //            'RoleId': roleId, 'UserId': userID, 'PendingAssignmentStatus': pendingAssignmentStatus, 'MyapprovalStatus': myapprovalStatus, 'FilterAge': filterAge, 'FilterApptype': filterApptype, 'FilterUser': filterUser, 'FilterStatus': filterStatus
    //        }),
    //        headers: {
    //            'Authorization': 'Basic ' + btoa('admin')
    //        },
    //        url: "/api/values/GetApplicationListAssigned/",
    //        success: function (data) {
    //            pendingAssignList = data.data.pendingAssignmentList;
    //            pendingMyApprovalList = data.data.pendingMyApprovalList;
    //            if (roleId == 12) {  //  supervisor view
    //                if ($("#sidemenu_PendingMyApproval").hasClass("leftNavItemActive")) {
    //                    setData(pendingMyApprovalList);
    //                }
    //                else {
    //                    setData(pendingAssignList);  // default
    //                }
    //            }
    //            else { // processor list
    //                setData(pendingMyApprovalList);
    //            }
    //        },
    //        error: function (_XMLHttpRequest, textStatus, errorThrown) {
    //            if (_XMLHttpRequest.status == '401') {
    //                window.location.href = "/Home/UnAuthorized";
    //            }
    //        }
    //    });
    //}

    function GetApplicationCustomFilterList() {
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
                statusList = data.data.statusList; 

                var advanceSearch_ApplicationTypeList = $('#advanceSearch_ApplicationTypeList');

                $.each(applicationTypeList, function (key, value) {
                    advanceSearch_ApplicationTypeList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });

                var advanceSearch_StatusList = $('#advanceSearch_StatusList');
                $.each(statusList, function (key, value) {
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


    $("#btn_0_15_days").click(function () {
        getApplicationListFilteredByAge(15);
    });

    $("#btn_16_30_days").click(function () {
        getApplicationListFilteredByAge(30);
    });

    $("#btn_31_60_days").click(function () {
        getApplicationListFilteredByAge(60);
    });

    $("#btn_60_plus_days").click(function () {
        getApplicationListFilteredByAge(61);
    });
});