﻿$(document).ready(function () {
    $("#menu_TopPanel").show();
    $("#menu_div_TopPanel").show();
    $("#id_userName").text(sessionStorage.getItem('UserName'));

    debugger;
    var userId = sessionStorage.getItem('UserId');
    var days_pendingAssignmentList = [];
    var days_pendingMyApprovalList = [];
    if (sessionStorage.getItem('RoleId') == "12") { //        12	- Supervisor
        getApplicationAge_AppPending_chartContainer(12,userId, '5');  //  supervisor will see all the pending  status

        getApplicationAge_AppPendingMyApproval_chartContainer(12, userId, '21,22,23');  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23
    }

    if (sessionStorage.getItem('RoleId') == "11") { //        11	- Processor
        $("#div_application_PendingAssignment").remove();
        getApplicationAge_AppPendingMyApproval_chartContainer(11, userId, '2');  // supervisor will see Rec_app 21,  rec_rej 22, ven confirm 23
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
                        labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
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

 
   
    //-----------------------------------------------------------  Example begins---------------
    var data1 = {
        datasets: [{
            data: [10, 20, 30]
        }],

        labels: [
            'Red',
            'Yellow',
            'Blue'
        ]
    };
    var chartDiv = $("#ACCSchartContainer");
    var Days015 = 21;

    var daysOld = [];
    daysOld.push(21);
    daysOld.push(50);
    daysOld.push(10);
    daysOld.push(1);

    //var"16 - 31 Days Old", "32 - 60 Days Old", "61 + Days Old
    var myChart = new Chart(chartDiv, {
        type: 'pie',
        data: {
            labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
            datasets: [
                {
                    data: daysOld, //[Days015, 39, 10,  1],
                    backgroundColor: [
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED"
                    ]
                }]
        },
        options: {
            title: {
                display: true,
                text: 'DDOL'
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            maintainAspectRatio: false,
        }
    });
    
    var chartDiv = $("#DDOLchartContainer");
    var Days015 = 21;
    var daysOld = [];
    daysOld.push(10);
    daysOld.push(20);
    daysOld.push(30);
    daysOld.push(50);

    //var"16 - 31 Days Old", "32 - 60 Days Old", "61 + Days Old
    var myChart = new Chart(chartDiv, {
        type: 'pie',
        data: {
            labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
            datasets: [
                {
                    data: daysOld, //[Days015, 39, 10,  1],
                    backgroundColor: [
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED"
                    ]
                }]
        },
        options: {
            title: {
                display: true,
                text: 'ACCS'
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            maintainAspectRatio: false,
        }
    });


    var ACCHchartDiv = $("#ACCHchartContainer");
    var Days015 = 21;
    var daysOld = [];
    daysOld.push(50);
    daysOld.push(30);
    daysOld.push(20);
    daysOld.push(10);
    //var"16 - 31 Days Old", "32 - 60 Days Old", "61 + Days Old
    var ACCHChart = new Chart(ACCHchartDiv, {
        type: 'pie',
        data: {
            labels: ["0-15 Days Old", "16-31 Days Old", "32-60 Days Old", "61+ Days Old"],
            datasets: [
                {
                    data: daysOld, //[Days015, 39, 10,  1],
                    backgroundColor: [
                        "#FF6384",
                        "#4BC0C0",
                        "#FFCE56",
                        "#E7E9ED"
                    ]
                }]
        },
        options: {
            title: {
                display: true,
                text: 'ACCH'
            },
            responsive: true,
            legend: {
                position: 'bottom',
            },
            maintainAspectRatio: false,
        }
    });


});