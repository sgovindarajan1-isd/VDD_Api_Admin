$(document).ready(function () {
    $("#liNavigation").css("display", "none");
    var userName = sessionStorage.getItem('userName');

    if (sessionStorage.getItem('userName') == null || userName == '') {
        window.location.href = "/Home/Index";
        return;
    }

    debugger;
    $("#divClaimsResults").hide();
    $("#divVCMResults").hide();
    $("#panel_VCM").hide();
    $("#panel_Application").hide();
    
    $("#lbl_userName").text("Logged in as " + userName);  
    var userId = sessionStorage.getItem('UserId');
    GetApplicationCustomFilterList();

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
                debugger;
                applicationTypeList = data.data.applicationTypeList;
                userList = data.data.userList;
                statusList = data.data.statusList;

                var filterUserList = $('#selectUser');
                $.each(userList, function (key, value) {
                    filterUserList.append(
                         $('<option></option>').html(value.Text).val(value.IdText)
                    );
                });

                var filterApplicationTypeList = $('#selectApplicationType');

                $.each(applicationTypeList, function (key, value) {
                    filterApplicationTypeList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });

                var filterStatusList = $('#selectStatus');
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
  

    $('#btn_runReport').click(function () {
        debugger;
        var selectApplicationType = $('#selectApplicationType').find('option:selected').val();
        var selectStatus = $('#selectStatus').find('option:selected').val();
        var selectUser = $('#selectUser').find('option:selected').val();

        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        getApplicationDetails(selectApplicationType, selectStatus, selectUser, startDate, endDate); 

        $("#ApplicationCountSection").show();
        $("#ddVCMGrid").hide();
    });

    $('#selClaimsType').change(function (e) {
        var selClaimsType = $('#selClaimsType').val();
        if (parseInt(selClaimsType) == 1) {
            $('#panel_Application').show();
            $('#panel_VCM').hide();
            $("#divVCMResults").hide();
        }
        else if (parseInt(selClaimsType) == 2) {
            $('#panel_VCM').show();
            $('#panel_Application').hide();
            $("#ApplicationCountSection").hide();
            $("#divClaimsResults").hide();
        }
    });

    $('#ddGrid').on('click', 'tbody tr', function () {
        sessionStorage.setItem('selectedConfirmationNumber', $('#ddGrid').DataTable().row(this).data().ConfirmationNum);
        sessionStorage.setItem('selectedRequestType', $('#ddGrid').DataTable().row(this).data().RequestType);
    });

    function setData(data) {
        $("#divClaimsResults").show();
        $('#ddGrid').DataTable().destroy();
        $('#ddGrid').empty();
        $('#ddGrid').dataTable({
            dom: 'Bfrtip',
            
            buttons: [{
                extend: 'pdf'
                ,title: 'Application Report',
                filename: 'Application Report'
            }, {
                extend: 'excel'
                ,title: 'Application Report',
                filename: 'Application Report'
            }],
            responsive: true,
            searching: true,
            paging: true,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "ConfirmationNum",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            //data = '<a href="../applicationList/applicationSummary">' + data + ' - ' + row.RequestType + ' </a>';
                            data = '<a href="../applicationList/applicationSummary">' + row.RequestType + ' - ' + data + ' </a>';
                        }

                        return data;
                    },
                    "title": "Confirmation #", "width": '52px'
                },
                { 'data': 'VendorName', "title": "Payee Name" },
                { 'data': 'ReceivedDate', "title": "Received Date" },
                { 'data': 'AssignedDate', "title": "Assignment Date" },
                { 'data': 'ClosedDate', "title": "Closed Date" },
                { 'data': 'ApplicationAge', "title": "Application Age" },
                { 'data': 'StatusDesc', "title": "Decision" }
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

    function getApplicationDetails(appType, appStatus, userId, startDate, endDate) {
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'FilterApptype': appType, 'StatusCode': appStatus, 'UserId': userId,
                'StartDate': startDate, 'EndDate': endDate,
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },

            url: "/api/values/GetApplicationReport/",
            success: function (data) {
                //$("#span_countPendingAssignment").text(data.data.pendingAssignmentList.length); //sessionStorage.getItem("totalApplicationPendingCount"));
                //$("#span_appPendingOver60Days").text(sessionStorage.getItem("totalPendingMyApprovalCountOver60"));
                //$("#span_countPendingMyApproval").text(data.data.pendingMyApprovalList.length);//sessionStorage.getItem("totalPendingMyApprovalCount"));

                var newApp = 0;  //pending 5, 3	EFT ELIGIBLE
                var reject = 0;  //6
                var supervisorReview = 0;
                var approve = 0;  //7
                var directDeposit = 0;  //4
                var assignedtoProcessor = 0;  //2
                var vendorConfirmation = 0;

                //2	Assigned to Processor
                //3	EFT ELIGIBLE
                //4	Direct Deposit
                //5	Pending
                //6	Reject
                //7	Check
                //21	Recommend Approve
                //22	Recommend Reject
                //23	Vendor Confirmation

                //setting defaults
                $("#card_New").html(newApp);
                $("#card_ProcessorReview").html(assignedtoProcessor);
                $("#card_PendingVendorConfirmation").html(vendorConfirmation);
                $("#card_SupervisorReview").html(supervisorReview);
                $("#card_Approved").html(approve);
                $("#card_Rejected").html(reject);

                for (var item in data.data.lst_ApplicationCountList) {
                    debugger;
                    if ((data.data.lst_ApplicationCountList[item].StatusCode == 5)  ) {  
                        newApp = newApp + data.data.lst_ApplicationCountList[item].ApplicationCount;
                        $("#card_New").html(newApp);
                    }
                    if (data.data.lst_ApplicationCountList[item].StatusCode == 2) {
                        assignedtoProcessor = data.data.lst_ApplicationCountList[item].ApplicationCount;
                        $("#card_ProcessorReview").html(assignedtoProcessor);
                    }
                    if (data.data.lst_ApplicationCountList[item].StatusCode == 23) {
                        vendorConfirmation = data.data.lst_ApplicationCountList[item].ApplicationCount;
                        $("#card_PendingVendorConfirmation").html(vendorConfirmation);
                    }

                    if ((data.data.lst_ApplicationCountList[item].StatusCode == 21) || (data.data.lst_ApplicationCountList[item].StatusCode == 22) ) {
                        supervisorReview = supervisorReview + data.data.lst_ApplicationCountList[item].ApplicationCount;
                        $("#card_SupervisorReview").html(supervisorReview);
                    }
                    if (data.data.lst_ApplicationCountList[item].StatusCode == 4) {   //|| (data.data.lst_ApplicationCountList[item].StatusCode == 3) //3	EFT ELIGIBLE 4-Direct Deposit  (data.data.lst_ApplicationCountList[item].StatusCode == 7) // 7- Check, 
                        approve = approve + data.data.lst_ApplicationCountList[item].ApplicationCount;
                        $("#card_Approved").html(approve);
                    }
                    if (data.data.lst_ApplicationCountList[item].StatusCode == 6) {
                        reject = data.data.lst_ApplicationCountList[item].ApplicationCount;
                        $("#card_Rejected").html(reject);
                    }
                }
               
                setData(data.data.lst_AppSearchList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }
        
    $('#btnVCMRunReport').click(function () {
        debugger;
        var vcmStartDate = $('#vcmStartDate').val();
        var vcmEndDate = $('#vcmEndDate').val();
        getVCMDetails( vcmStartDate, vcmEndDate);

        $("#panel_VCM").show();
        $("#ddVCMGrid").show();
    });

    function getVCMDetails(startDate, endDate) {
        debugger;
        //$("#divVCMResults").show();
        //$('#ddVCMGrid').DataTable().destroy();
        //$('#ddVCMGrid').empty();
       
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'StartDate': startDate, 'EndDate': endDate,
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },

            url: "/api/values/GetVCMReport/",
            success: function (data) {
                debugger;
                if (data.data.lst_VCMList.length <= 0) {  //  jquery  >0  has issue  :)
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("No Data Found!");
                    setVCMData(data.data.lst_VCMList)
                   // return;
                }
                //else {}
                //setting defaults
                setVCMData(data.data.lst_VCMList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    $('#ddVCMGrid').on('click', 'tbody tr', function () {
        sessionStorage.setItem('selectedConfirmationNumber', $('#ddVCMGrid').DataTable().row(this).data().ConfirmationNum);
        sessionStorage.setItem('selectedRequestType', $('#ddVCMGrid').DataTable().row(this).data().RequestType);
    });

    function setVCMData(data) {
        $("#divVCMResults").show();
        $('#ddVCMGrid').DataTable().destroy();
        $('#ddVCMGrid').empty();
        $('#ddVCMGrid').dataTable({
            dom: 'Bfrtip',
            buttons: [{
                extend: 'pdf'
                , title: 'Application VCM Report',
                filename: 'Application VCM Report'
            }, {
                extend: 'excel'
                , title: 'Application VCM Report',
                filename: 'Application VCM Report'
                }],

            responsive: true,
            searching: true,
            paging: true,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "ConfirmationNum",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            //data = '<a href="applicationSummary">' + row.RequestType + ' - ' + data + ' </a>';
                            data = '<a href="../applicationList/applicationSummary">' + row.RequestType + ' - ' + data + ' </a>';
                        }

                        return data;
                    },
                    "title": "Confirmation / VCM #", "width": '52px'
                },
                { 'data': 'VendorNumber', "title": "Vendor Number" },
                { 'data': 'VendorName', "title": "Payee Name" },
                { 'data': 'ReceivedDate', "title": "Received Date" },
                
                { 'data': 'AttachmentCount', "title": "Attachment Count" },
                { 'data': 'DocumentCreateDate', "title": "Document Create Date" },
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


});