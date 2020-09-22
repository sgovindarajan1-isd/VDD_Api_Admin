$(document).ready(function () {
    $("#lbl_userName").text(sessionStorage.getItem('UserName'));  //id_userName

    var pendingAssignList = [];
    var pendingMyApprovalList = [];
    var userId = sessionStorage.getItem('UserId');
    $("#ddGrid_filter").hide();
    GetApplicationCustomFilterList();

    //var table = $('#ddGrid').DataTable();

    // Default view for Supervisor
    if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
        getApplicationDetails(12, userId, '5', '21,22,23');  //  supervisor will see all the pending  status
    }

    // Default view For Processor
    if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor
        //$("#sidemenu_PendingAssignment").css('visibility', 'hidden');
        $("#sidemenu_PendingAssignment").addClass('isDisabledApplicationListLink');
        $("#heading_applicationlist").text("Pending My Approval");

        $("#sidemenu_PendingMyApproval").addClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").removeClass('leftNavItemActive');

        getApplicationDetails(11, userId, '2', '');  //  Processor will see only  My pending approval  ( not the application pending assignment)
    }


    $("#sidemenu_PendingAssignment").click(function () {
        $("#sidemenu_PendingMyApproval").removeClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").addClass('leftNavItemActive');
        setData(pendingAssignList);
    });

    $("#sidemenu_PendingMyApproval").click(function () {
        $("#sidemenu_PendingMyApproval").addClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").removeClass('leftNavItemActive');
        setData(pendingMyApprovalList);
    });    

    $("#btn_customizeFilter").click(function () {
        var filterApptype = $("#filterApplicationType  option:selected").text();
        var filterUser = $("#filterUser  option:selected").text();3
        var filterStatus = $("#filterStatus  option:selected").text();
        var age = $("#filerAge  option:selected").text();
        
       // Default view for Supervisor
       if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
            getApplicationDetails(12, userId, '5', '21,22,23', age, filterApptype, filterUser, filterStatus);  //  supervisor will see all the pending  status
       }

       // Default view For Processor
       if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor
            getApplicationDetails(11, userId, '2', '', age, filterApptype, filterUser, filterStatus);  //  Processor will see only  My pending approval  ( not the application pending assignment)
        }

        $("#customizeFilterModal").modal('hide');

    });
   
    $("#btn_0_15_days").click(function () {
        //table.columns([column_no]).search( $( '#txtSearch' ).val() ).draw();
        //https://jsfiddle.net/07rnpgs1/
       // table.columns([4]).search(15).draw();
        getApplicationListFilteredByAge(15);
    });

    $("#btn_31_60_days").click(function () {
        getApplicationListFilteredByAge(30);
    });

    $("#btn_31_60_days").click(function () {
        getApplicationListFilteredByAge(60);
    });
    
    $("#btn_60_plus_days").click(function () {
        debugger;
        getApplicationListFilteredByAge(61);
    });
    
    function getApplicationListFilteredByAge(age) {
        // Default view for Supervisor
        if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
            getApplicationDetails(12, userId, '5', '21,22,23', age,'','','');  //  supervisor will see all the pending  status
        }

        // Default view For Processor
        if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor
            getApplicationDetails(11, userId, '2', '', age,'','','');  //  Processor will see only  My pending approval  ( not the application pending assignment)
        }
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
            ,data: data,
            columns: [
                {
                    "data": "ConfirmationNum",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            //sessionStorage.setItem('selectedConfirmationNumber', data);
                            //sessionStorage.setItem('selectedRequestType', row.RequestType);
                            data = '<a href="applicationSummary">' + data + ' - ' + row.RequestType+' </a>';
                        }

                        return data;
                    },
                    "title": "Confirmation #", "width": '52px' 
                },
                { 'data': 'VendorName', "title": "Payee Name" },
                { 'data': 'ReceivedDate', "title": "Received Dt"},
                { 'data': 'AssignedDate', "title": "Assignment Dt"},
                { 'data': 'ApplicationAge', "title": "Application Age"},
                { 'data': 'StatusDesc', "title": "Status"}
            ],

            columnDefs: [
                { "width": "30%", "targets": [0,1] },
                { "width": "10%", "targets": [2,3,4] },
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
                userList = data.data.userList;  
                statusList = data.data.statusList;

                var filterUserList = $('#filterUser');
                $.each(userList, function (key, value) {
                    filterUserList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });

                var filterApplicationTypeList = $('#filterApplicationType');
                $.each(applicationTypeList, function (key, value) {
                    filterApplicationTypeList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });

                var filterStatusList = $('#filterStatus');
                $.each(statusList, function (key, value) {
                    filterStatusList.append(
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
});