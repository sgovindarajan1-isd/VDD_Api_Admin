$(document).ready(function () {
    $("#menu_TopPanel").show();
    $("#menu_div_TopPanel").show();
    $("#lbl_userName").text(sessionStorage.getItem('userName')); //id_userName

    debugger;
   
    var userId = sessionStorage.getItem('UserId');
    var days_pendingAssignmentList = [];
    var days_pendingMyApprovalList = [];
    if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {
        getApplicationAge_AppPending_chartContainer(GlobalRoles.SupervisorRole,userId, '5');  //  supervisor will see all the pending  status

        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.SupervisorRole, userId, '21,22,23');  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23
    }

    if (GlobalUserHasRoles.ProcessorRole) {
        $("#div_application_PendingAssignment").remove();
        getApplicationAge_AppPendingMyApproval_chartContainer(GlobalRoles.ProcessorRole, userId, '2');  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23
    }
    
    function getApplicationAge_AppPending_chartContainer(roleId, userID, status) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'RoleId': roleId, 'UserId': userID, 'Status': status , 'Age1': '15', 'Age2': '30', 'Age3': '60'  }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetAppliationAgeAssigned/",
            success: function (data) {
                debugger;
                $.each(data.data.appliationAgeAssignedList, function (index, value) {
                    days_pendingAssignmentList.push(value.AgeCount)
                });

                sessionStorage.setItem("totalApplicationPendingCount", data.data.totalApplicationCount);
                sessionStorage.setItem("totalApplicationPendingCountOver60", data.data.totalApplicationCountOver60);
                //-----
                var chartDiv = $("#AppPending_chartContainer");

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
                            text: 'Application Pending Assignment'
                        },
                        responsive: true,
                        legend: {
                            position: 'bottom',
                        },
                        maintainAspectRatio: false,

                             onClick: (evt, item) => {
                                debugger;
                                 if (item[0]._model.label.indexOf('15') >= 0) {
                                     sessionStorage.setItem("fromPendingAssignmentChartClick", 15);
                                 }
                                 if (item[0]._model.label.indexOf('30') >= 0) {
                                     sessionStorage.setItem("fromPendingAssignmentChartClick", 30);
                                 }
                                 if (item[0]._model.label.indexOf('60') >= 0) {
                                     sessionStorage.setItem("fromPendingAssignmentChartClick", 60);
                                 }
                                 if (item[0]._model.label.indexOf('61') >= 0) {
                                     sessionStorage.setItem("fromPendingAssignmentChartClick", 61);
                                 }
                                 window.location.href = '/applicationList/applicationList';
                        }

                    }
                });
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    function getApplicationAge_AppPendingMyApproval_chartContainer(roleId, userID, status) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'RoleId': roleId, 'UserId': userID, 'Status': status, 'Age1': '15', 'Age2': '30', 'Age3': '60' }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetAppliationAgeAssigned/",
            success: function (data) {
                debugger;
                $.each(data.data.appliationAgeAssignedList, function (index, value) {
                    days_pendingMyApprovalList.push(value.AgeCount)
                });
                sessionStorage.setItem("totalPendingMyApprovalCount", data.data.totalApplicationCount);
                sessionStorage.setItem("totalPendingMyApprovalCountOver60", data.data.totalApplicationCountOver60);
                //-----
                var chartDiv = $("#MyPending_chartContainer");
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
                            text: 'Application Pending My Approval'
                        },
                        responsive: true,
                        legend: {
                            position: 'bottom',
                        },
                        maintainAspectRatio: false,
                        onClick: (evt, item) => {
                            debugger;
                            if (item[0]._model.label.indexOf('15') >= 0) {
                                sessionStorage.setItem("fromPendingMyApprovalChartClick", 15);
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
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

});
   
