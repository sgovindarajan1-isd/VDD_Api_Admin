$(document).ready(function () {
    debugger;
    $("#id_userName").text(sessionStorage.getItem('UserName'));

    var pendingAssignList = [];
    var userId = sessionStorage.getItem('UserId');
    $("#ddGrid_filter").hide();

    // Default view for Supervisor
    //getApplicationDetails(5, null);
    if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
        getApplicationDetails(userId, '5', '21,22,23');  //  supervisor will see all the pending  status
        //getApplicationDetails(userId, '21,22,23');  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23
    }


    // Default view For Processor
    if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor

        $("#sidemenu_PendingAssignment").css('visibility', 'hidden');
        $("#heading_applicationlist").text("Pending My Approval");

        $("#sidemenu_PendingMyApproval").addClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").removeClass('leftNavItemActive');

        getApplicationDetails(userId, '2', '21,22,23');  //  Processor will see only  My pending approval  ( not the application pending assignment)


    }
   

    $("#sidemenu_PendingAssignment").click(function () {
        $("#sidemenu_PendingMyApproval").removeClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").addClass('leftNavItemActive');
        debugger;
        //getApplicationDetails(5, null); //  5	Pending
        setData(pendingAssignList);
    });

    $("#sidemenu_PendingMyApproval").click(function () {
        $("#sidemenu_PendingMyApproval").addClass('leftNavItemActive');
        $("#sidemenu_PendingAssignment").removeClass('leftNavItemActive');
        debugger;
        //getApplicationDetails(2, sessionStorage.getItem('UserId')); //2 - Assigned to Processor  
        setData(pendingMyApprovalList);
    });


    function setData(data) {
        $('#ddGrid').dataTable({
            responsive: true,
            searching: false,
            paging: true,
            //"binfo": false,
            //"bFilter": false,
            data: data,//data.data.vendorlst,
            columns: [
                {
                    "data": "ConfirmationNum",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            data = '<a href="' + data + '">' + data + '</a>';
                        }

                        return data;
                    },
                    "title": "Confirmation #"
                },
                { 'data': 'VendorName', "title": "Payee Name" },
                { 'data': 'ReceivedDate', "title": "Received Dt" },
                { 'data': 'AssignedDate', "title": "Assignment Dt" },
                { 'data': 'ApplicationAge', "title": "Application Age" },
                { 'data': 'StatusDesc', "width": '140px', "title": "Status" }
            ],

            columnDefs: [
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

    function getApplicationDetails(userID, pendingAssignmentStatus, myapprovalStatus ) {
        //$('#ddGrid').dataTable().clear().draw();
        //$('#ddGrid').dataTable().fnClearTable();
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'UserId': userID, 'PendingAssignmentStatus': pendingAssignmentStatus, 'MyapprovalStatus': myapprovalStatus }),
            //data: JSON.stringify({ 'UserId': UserID, 'Status': statusCode }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetApplicationDetailsAssigned/",
            success: function (data) {
                debugger;
                //$("#span_countPendingAssignment").text(data.data.pendingAssignmentList.length);
                //$("#span_countPendingMyApproval").text(data.data.pendingMyApprovalList.length);
                //$("#span_appPendingOver60Days").text(data.data.appPendingOver60Days);

                $("#span_countPendingAssignment").text(sessionStorage.getItem("totalApplicationPendingCount"));
                $("#span_appPendingOver60Days").text(sessionStorage.getItem("totalPendingMyApprovalCountOver60"));

                $("#span_countPendingMyApproval").text(sessionStorage.getItem("totalPendingMyApprovalCount"));

                //if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
                //    $("#span_countPendingMyApproval").text(sessionStorage.getItem("totalApplicationPendingCountOver60"));
                //}
                //else {
                //    $("#span_countPendingMyApproval").text(sessionStorage.getItem("totalPendingMyApprovalCount"));
                //}

                pendingAssignList = data.data.pendingAssignmentList;
                pendingMyApprovalList = data.data.pendingMyApprovalList;
                setData(pendingAssignList);  // default
                debugger;
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
        }

});
   

  
