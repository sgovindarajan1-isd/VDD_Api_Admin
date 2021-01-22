$(document).ready(function () {
    if (sessionStorage.getItem('userName') == null || sessionStorage.getItem('userName') == '') {
        window.location.href = "/Home/Index";
        return;
    }

    $("#menu_TopPanel").show();
    $("#menu_div_TopPanel").show();
    $("#lbl_userName").text("Logged in as " + sessionStorage.getItem('userName')); 
   
    var userId = sessionStorage.getItem('UserId');
    if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {
        getApplicationAge_ALL_Pending_chartContainer(GlobalRoles.SupervisorRole, userId, '5', 'DDOL', "ALL_DDOL_Pending_chartContainer");  //  supervisor will see all the pending  status
        getApplicationAge_ALL_Pending_chartContainer(GlobalRoles.SupervisorRole, userId, '5', 'ACSS', "ALL_ACSS_Pending_chartContainer");  //  supervisor will see all the pending  status
        getApplicationAge_ALL_Pending_chartContainer(GlobalRoles.SupervisorRole, userId, '5', 'ACCH', "ALL_ACCH_Pending_chartContainer");  //  supervisor will see all the pending  status
        getApplicationAge_ALL_Pending_chartContainer(GlobalRoles.SupervisorRole, userId, '5', 'ACWC', "ALL_ACWC_Pending_chartContainer");  //  supervisor will see all the pending  status
        getApplicationAge_ALL_Pending_chartContainer(GlobalRoles.SupervisorRole, userId, '5', 'ACOT', "ALL_ACOT_Pending_chartContainer");  //  supervisor will see all the pending  status

        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.SupervisorRole, userId, '21,22,23', 'DDOL', "ALL_DDOL_myapproval_chartContainer");  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.SupervisorRole, userId, '21,22,23', 'ACSS', "ALL_ACSS_myapproval_chartContainer");
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.SupervisorRole, userId, '21,22,23', 'ACCH', "ALL_ACCH_myapproval_chartContainer");
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.SupervisorRole, userId, '21,22,23', 'ACWC', "ALL_ACWC_myapproval_chartContainer");
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.SupervisorRole, userId, '21,22,23', 'ACOT', "ALL_ACOT_myapproval_chartContainer");
        //     getApplicationAge_UserProfileChart(GlobalRoles.SupervisorRole, userId, '5', 'DDOL');
    }
    else { //if (GlobalUserHasRoles.ProcessorRole)
        $("#div_application_PendingAssignment").remove();
        $(".div_application_PendingAssignment").remove();
        $("#title_application_PendingAssignment").text('');
        $("#title_application_MyApproval").text('Application Pending My Review');

      //  getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.ProcessorRole, userId, '2', 'DDOL');  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23

        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.ProcessorRole, userId, '2', 'DDOL', "ALL_DDOL_myapproval_chartContainer");  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.ProcessorRole, userId, '2', 'ACSS', "ALL_ACSS_myapproval_chartContainer");
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.ProcessorRole, userId, '2', 'ACCH', "ALL_ACCH_myapproval_chartContainer");
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.ProcessorRole, userId, '2', 'ACWC', "ALL_ACWC_myapproval_chartContainer");
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.ProcessorRole, userId, '2', 'ACOT', "ALL_ACOT_myapproval_chartContainer");


    }
    
    function getApplicationAge_ALL_Pending_chartContainer(roleId, userID, status, requestType, chartType) {
        debugger;
        var days_pendingAssignmentList = [];
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'RoleId': roleId, 'UserId': userID, 'Status': status, 'Age1': '15', 'Age2': '30', 'Age3': '60', "FilterApptype": requestType }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            //url: "/api/values/GetAppliationAgeAssigned/",
            url: "/api/values/GetAppliationAgeAssignedByRequestType/",
            success: function (data) {
                $.each(data.data.appliationAgeAssignedList, function (index, value) {
                    days_pendingAssignmentList.push(value.AgeCount)
                });

                sessionStorage.setItem("totalApplicationPendingCount", data.data.totalApplicationCount);
                sessionStorage.setItem("totalApplicationPendingCountOver60", data.data.totalApplicationCountOver60);
                //-----
                //var chartDiv = $("#AppPending_chartContainer");

                var chartDiv = $("#" + chartType);

                //var"16 - 31 Days Old", "32 - 60 Days Old", "61 + Days Old
                var myChart = new Chart(chartDiv, {
                    type: 'pie',
                    data: {
                        labels: ["0-15 Days Old", "16-30 Days Old", "31-60 Days Old", "61+ Days Old"],
                        datasets: [
                            {
                                data: days_pendingAssignmentList,
                                backgroundColor: [
                                    "#00D974", "#36A2EB", "#FFCE56", "#D90000"
                                ]
                            }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: requestType// 'Application Pending Assignment'
                        },
                        responsive: true,
                        legend: {
                            position: 'bottom',
                        },
                        maintainAspectRatio: false,

                        onClick: (evt, item) => {
                            sessionStorage.setItem("sessionfilterReqType", requestType);
                            if (item[0]._model.label.indexOf('15') >= 0) {
                               // sessionStorage.setItem("fromPendingAssignmentChartClick", 15);
                                sessionStorage.setItem("sessionfilterAge", 15);
                            }
                            if (item[0]._model.label.indexOf('30') >= 0) {
                               // sessionStorage.setItem("fromPendingAssignmentChartClick", 30);
                                sessionStorage.setItem("sessionfilterAge", 30);
                            }
                            if (item[0]._model.label.indexOf('60') >= 0) {
                               // sessionStorage.setItem("fromPendingAssignmentChartClick", 60);
                                sessionStorage.setItem("sessionfilterAge", 60);
                            }
                            if (item[0]._model.label.indexOf('61') >= 0) {
                               // sessionStorage.setItem("fromPendingAssignmentChartClick", 61);
                                sessionStorage.setItem("sessionfilterAge", 61);
                            }
                            window.location.href = '/applicationList/applicationList';
                        }

                    }
                });

            },
            complete: function (data) {
             //   days_pendingAssignmentList.length = 0;
            },

            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    function getApplicationAge_AppPendingMyApproval_chartContainer(roleId, userID, status, requestType, chartType) {
        var days_pendingMyApprovalList = [];
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'RoleId': roleId, 'UserId': userID, 'Status': status, 'Age1': '15', 'Age2': '30', 'Age3': '60', "FilterApptype": requestType }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            //url: "/api/values/GetAppliationAgeAssigned/",
            url: "/api/values/GetAppliationAgeAssignedByRequestType/",
            success: function (data) {
                $.each(data.data.appliationAgeAssignedList, function (index, value) {
                    days_pendingMyApprovalList.push(value.AgeCount)
                });
                sessionStorage.setItem("totalPendingMyApprovalCount", data.data.totalApplicationCount);
                sessionStorage.setItem("totalPendingMyApprovalCountOver60", data.data.totalApplicationCountOver60);
                //-----
                //var chartDiv = $("#MyPending_chartContainer");
                var chartDiv = $("#" + chartType);
                var myChart = new Chart(chartDiv, {
                    type: 'pie',
                    data: {
                        labels: ["0-15 Days Old", "16-30 Days Old", "31-60 Days Old", "61+ Days Old"],
                        //labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
                        datasets: [
                            {
                                data: days_pendingMyApprovalList, // daysOld, //[Days015, 39, 10,  1],
                                backgroundColor: [                                
                                    "#00D974", "#36A2EB", "#FFCE56", "#D90000"
                                ]
                            }]
                    },
                    options: {
                        title: {
                            display: true,
                            text: requestType, //'Application Pending My Approval'
                        },
                        responsive: true,
                        legend: {
                            position: 'bottom',
                        },
                        maintainAspectRatio: false,
                        onClick: (evt, item) => {
                            if (item[0]._model.label.indexOf('15') >= 0) {
                                sessionStorage.setItem("fromPendingMyApprovalChartClick", 15);
                                sessionStorage.setItem("requestType_fromPendingAssignmentChartClick", requestType);

                            }
                            if (item[0]._model.label.indexOf('30') >= 0) {
                                sessionStorage.setItem("fromPendingMyApprovalChartClick", 30);
                            }
                            if (item[0]._model.label.indexOf('60') >= 0) {
                                sessionStorage.setItem("fromPendingMyApprovalChartClick", 60);
                            }
                            if (item[0]._model.label.indexOf('61') >= 0) {
                                sessionStorage.setItem("fromPendingMyApprovalChartClick", 61);
                            }
                            window.location.href = '/applicationList/applicationList';
                        }
                    }
                });
            },
            complete: function (data) {
            //    days_pendingMyApprovalList.length = 0;
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }
});
   
