﻿$(document).ready(function () {
    var userName = sessionStorage.getItem('userName');
    var userId = sessionStorage.getItem('UserId');
    var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
    var role = sessionStorage.getItem('RoleId');

    // default
    $("#btn_Reject").hide();
    // to do later

    // admin role
    if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {
        $("#btn_vendorDetails").show();
    }
    else {
        $("#btn_vendorDetails").hide();
    }

    $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");  //.addClass("show")
    });

    $("#div_notes_tab").click(function (e) {
        //  $("#div_notes_tab").addClass("show");
    });

    $("#timeline-tab").click(function (e) {
        $("#timeline").removeClass("fade");
        $("#timeline").addClass("show").addClass("in");

        $("#notes").removeClass("show").removeClass("in");
        $("#notes").addClass("fade");
    });

    $("#nts-tab").click(function (e) {
        $("#timeline").removeClass("show").removeClass("in");
        $("#timeline").addClass("fade");

        $("#notes").addClass("show").addClass("in");
        $("#notes").removeClass("fade");
    });

    $(function () {
        $('#btn_proce_approve').click(function () {
            $('#approveApplicationModal').addClass("processorApprove");

        });

        $('#btn_proce_reject').click(function () {
            $('#approveApplicationModal').addClass('processorReject')
        });
    });

    $("#menu_Documents").click(function () {
        GetAttachmentDocuments(confirmationNum);
    });

    getApplicationSummary(confirmationNum);
    GetProcessorsList();
    GetTimeLineByConfirmationNumber(confirmationNum);
    GetNotesByConfirmationNumber(confirmationNum);
    GetAttachmentDocuments(confirmationNum);
    GetDocumentCheckList(confirmationNum);
    GetAlreadyLinkedApplicationByConfirmationNum(confirmationNum);  // for count display

    function RetrieveDenialReasonList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/RetrieveDenialReasonList/",
            dataType: 'json',
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                rrList = data.data.denialReasonList;

                var rejectReasonList = $('#select_rejectReason');
                rejectReasonList.empty();
                $.each(rrList, function (key, value) {
                    rejectReasonList.append(
                        $('<option class="dropdown-item1"></option>').val(value.DenialReasonId).html(value.DenialReasonText)
                    );
                });
            }
        });
    };

    $('#rejectApplicationModal').on('shown.bs.modal', function (e) {
        debugger;
        $("#txt_Notes_comment").val('');

        if (e.relatedTarget.id == "btn_reviewReject") {  // reject
            RetrieveDenialReasonList();
            $("#rejectModalTitle").html("Application Reject");
            $("#rejctreason").show();
        }
        else {  // return
            $("#rejectModalTitle").html("Application Return");
            $("#rejctreason").hide();
        }
    });

    $('#approveApplicationModal').on('shown.bs.modal', function (e) {
        $("#txt_Notes_comment").val('');
    });

    function getReviewPanelInformation(summaryData) {
        var status = summaryData.Status;
        var statusDesc = summaryData.StatusDesc;

        if (GlobalUserHasRoles.ProcessorRole)  {
        //if (role == 11) {   //11	Processor View
            $("#div_processor_review").show();
            $("#div_supervisor_review").hide();
            $("#div_supervisor_proce_review").hide();

            if (status == 2) {  //'pending'   2	Assigned to Processor
                statusDesc = "(Pending Approval)";
            }
            $("#span_processoreview_status").text(statusDesc);
        }
        else {          //12	Supervisor View
            $("#div_supervisor_review").show();
            $("#div_processor_review").hide();


            if (status == 5 || status == 21 || status == 22) {  //'pending'    // If Pending  no needed to show "Return" button
                statusDesc = "(Application Pending)";
                $("#btn_reviewReturn").hide();
                //$("#btn_reviewReject").hide();
            }

            if (status == 21 || status == 22) {
                $("#div_supervisor_proce_review").show();
                var msg = summaryData.StatusDesc + " by " + summaryData.AssignedByName + " on " + summaryData.AssignmentDate;
                $("#span_review_processor_Approval_msg").text(msg);
                $("#span_review_processor_notes").text(summaryData.Comment);
            }
            else {
                $("#div_supervisor_proce_review").hide();
            }
            $("#span_suervisorreview_status").text(statusDesc);
        }
    }

    function assignDetailsFromDatabase(data) {
        if ((data == null) || (data == 'undefined')) {
            return;
        }
        if (data.Status == 5) {  // Pending =5
            // for new  display the reject button at top too
            $("#btn_Reject").show();
            $("#div_assignApplication").show();
            $("#div_processor_review").hide(); //

            if (GlobalUserHasRoles.SupervisorRole) {  //   hide print btn for supervisor
                //(application is New or Pending  donot show the Approve or Print button)
                    //$("#btn_reviewPrint").hide();
                    $("#btn_reviewApprove").hide();
            }
        }
        else if (data.Status == 21 || data.Status == 22) {  // recommend approve =21 recomment reject 22
            $("#div_assignApplication").show();
            $("#btn_Assign").text("Re-Assign");
            $("#div_processor_review").hide();
        }
        else {
            $("#div_assignApplication").hide();
            $("#div_processor_review").show();
        }

        getReviewPanelInformation(data);  //   This section show the and hide the History information.

        $("#lbl_userName").text(userName); //id_userName

        $("#head_confirmationNum").text(data.RequestType + " - " + confirmationNum);
        $("#header_status").text(data.StatusDesc);

        //side panel

        $("#ApplicationType").text(data.RequestType);
        $("#DateReceived").text(data.RequestDate);
        $("#VendorCode").text(data.VendorNumber);
        $("#PayeeName").text(data.Vendorname);
        //
        $("#ReceivedDate").text(data.RequestDate);
        $("#AssignDate").text(data.AssignmentDate);
        $("#AssignedProcessor").text(data.ProcessorID);
        $("#AssignedBy").text(data.AssignedBy);

        $("#AssignedProcessorName").text(data.ProcessorName);
        $("#AssignedByName").text(data.AssignedByName);

        //$("#ClosedDate").text();
        //$("#EnteredBy").text();
        //$("#IPAddress").text();
        //$("#IPDevice").text();
        //$("#IPLocation").text();

        // vendor Information
        $("#VI_VendorCode").text(data.VendorNumber);
        sessionStorage.setItem('selectedVendorNumber', data.VendorNumber);  // vendorcode
        sessionStorage.setItem('selectedBankAccountNumber', data.BankAccountNumber);
        $("#Alias_DBA").text(data.AliasDBAName);
        $("#FirstName").text(data.FirstName);
        $("#MiddleName").text(data.MiddleName);
        $("#LastName").text(data.LastName);
        $("#PhoneNumber").text(data.PhoneNumber);
        $("#VI_PayeeName").text(data.Vendorname);
        $("#CompanyName").text(data.CompanyName);
        $("#TaxpayerID").text(data.SSN); // //TaxpayerIDNumber
        $("#DirectDepositNotificationEmail").text(data.DDNotifyEmail);

        $("#ClosedDate").text(data.ClosedDate);
        $("#IPAddress").text(data.Source_IP);
        $("#IPDevice").text(data.Source_Device);
        $("#IPLocation").text(data.Source_Location);
        $("#EnteredBy").text(data.User_agent);

        //Banking Information

        $("#TypeofAccount").text(data.AccountTypeDesc);
        $("#BankAccountNumber").text(data.BankAccountNumber);
        $("#BankRoutingNumber").text(data.BankRoutingNo);
        $("#FinancialInstitutionName").text(data.FinancialIns);
        $("#AttachmentType").text(data.AttachmentType);

        //Certification Information
        $("#AuthorizedSignerName").text(data.Signername);
        $("#AuthorizedSignerTitle").text(data.Signertitle);
        $("#AuthorizedSignerPhone").text(data.Signerphone);
        $("#AuthorizedSignerEmail").text(data.Signeremail);
        $("#CI_ConfirmationNumber").text(confirmationNum);

        //Department Information
        $("#DeptName").text(data.DepartmentName);
        $("#DeptContactPersonName").text(data.DepartmentContactName);
        $("#DeptEmailAddress").text(data.DepartmentEmail);
        $("#DeptContactNumber").text(data.DepartmentContactNo);
        var j = 1;

        debugger;
        $.each(data.LocationAddressList, function (index, value) {

            var _address = value.Street;  //"16000 south street";
            var _city = value.City;
            var _state = value.State;
            var _zip = value.ZipCode;

            var str = '<li class="list-group-item list-group-item-sm">' +
                ' <div class="flex">' +
                ' <ul class="noTopMargin flex-column-2">' +
                ' <li>' +
                ' <span class="smallRightMargin"><b>' + j + '.</b></span><b>ADDRESS:</b> ' + _address  +
                '</li>' +
                ' <li>' +
                '<span"><b>CITY:</b></span> ' + _city +
                '<span style= "padding-Right: 100px" class="smallRightMargin"></span><b>STATE:</b> ' + _state + '<span style= "padding-left: 100px">  <b>ZIP CODE:</b> ' + _zip +
                '</li>' +
                '</ul>' +
                ' </div>' +
                ' </li>';

            $("#ul_ddoptionList").append(str);
            j = j + 1;
        });
    };

    function GetTimeLineByConfirmationNumber(confirmationNum) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetTimeLineByConfirmationNumber/",
            dataType: 'json',
            data: JSON.stringify({ 'Text': confirmationNum }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                for (var item in data.data.returnValue) {

                    var a = '<div> <span style="font-weight:bold; padding-right:10px" >' + '</span >' + data.data.returnValue[item].TimeLineMessage + '</div>';
                    $("#timeline").append(a);
                }
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in getting Application Time Line , Please check the entry!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        })
    };

    function GetNotesByConfirmationNumber(confirmationNum) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetNotesByConfirmationNumber/",
            dataType: 'json',
            data: JSON.stringify({ 'Text': confirmationNum }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                $("#noteList").empty();
                for (var item in data.data.returnValue) {

                    var a = '<li class="list-group-item list-group-item-warning emptyResultMessage">  <span>' + data.data.returnValue[item].LastUpdatedUser + ' : ' + data.data.returnValue[item].LastUpdatedDateTime + '</span> <br/> <span style="font-weight:bold; padding-right:10px" >' + '</span >' + data.data.returnValue[item].Notes + '</li> <br>';
                    $("#noteList").append(a);
                }
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in getting Process Notes, Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        })
    };

    function getApplicationSummary(confirmationNum) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetApplicationSummary/",
            dataType: 'json',
            data: JSON.stringify({ 'Text': confirmationNum }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                assignDetailsFromDatabase(data.data.applicationSummary);
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in getting Application Summary , Please check the entry!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    $("#btn_SubmitApprove").click(function () {
        debugger;
        var comment = $("#txt_approve_comment").val();
        var assignedFrom = $("#AssignedProcessor").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedTo = $("#AssignedBy").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"

        var assignedFromName = $("#AssignedProcessorName").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedToName = $("#AssignedByName").text(); 

        var status = 21;

        if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {
            if ($("#VI_VendorCode").text() == '') {
                $('#approveApplicationModal').modal('hide');
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Vendor Code Missing, Please check the entry!");
                return;
            }
            status = 4;
            assignedTo = assignedFrom;  //$("#AssignedProcessor").text(); //  final approval  assigned to supervisor him self
            assignedToName = assignedFromName;
        }
        else { //(GlobalUserHasRoles.ProcessorRole) 
            status = 21;	//  Recommend Approve  if processor approve  it will be 21 if the Supervisor approve it will be 4
        }
      

        UpdateApplicationStatus(status, '', "Approved.", comment, assignedFrom, assignedTo, assignedFromName, assignedToName);//  Approve  : 4	Direct Deposit,  sending reason_type is empty as no reason for approval
    });

    $("#btn_SubmitReject").click(function () {
        debugger;
        var reason_type = $("#select_rejectReason option:selected").text();
        var comment = $("#txt_reject_comment").val();
        var assignedFrom = $("#AssignedProcessor").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedTo = $("#AssignedBy").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"

        var assignedFromName = $("#AssignedProcessorName").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedToName = $("#AssignedByName").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"
        var status = 22;

        if ((reason_type.indexOf('Other') >= 0) && ($("#txt_reject_comment").val().length <= 0 )) {
            $("#spanReasonType").html('Reason required.');
            return;
        }
        else {
            $("#spanReasonType").html('');
        }

        if (reason_type.length <= 0) {
            $("#spanReasonType").html('Reason Type is required.');
            return;
        } else {
            $("#spanReasonType").html('');
        }

        // if (role == 11)  // processor
        if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {
            status = 6
            //assignedTo = userName;  //  final reject  assigned to supervisor him self
            assignedTo = userId;  //  final reject  assigned to supervisor him self
            assignedToName = userName;
        }
        else {  //(GlobalUserHasRoles.ProcessorRole)
                status = 22;	//  Recommend reject  if processor approve  it will be 22 if the Supervisor approve it will be 6
        }

        UpdateApplicationStatus(status, reason_type, "Rejected.", comment, assignedFrom, assignedTo, assignedFromName, assignedToName);//   reject  status = 6;
    });

    $("#btn_SubmitReturn").click(function () {
        var reason_type = $("#select_rejectReason option:selected").text();
        var comment = $("#txt_comment").val();
        var assignedFrom = $("#AssignedProcessor").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedTo = $("#AssignedBy").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"

        var assignedFromName = $("#AssignedProcessorName").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedToName = $("#AssignedByName").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"

        UpdateApplicationStatus(6, reason_type, "Rejected.", comment, assignedFrom, assignedTo, assignedFromName, assignedToName);//   reject  status = 6;
    });

    // Assign  the proccessors
    $("#btn_SubmitAssign").click(function () {
        var comment = '';
        var supervisorName = userName;
        var supervisorID = userId;  //  always get from login user id // $("#AssignedProcessor").text();                       //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 

        var processorID = $("#selectProcessorsList option:selected").val();    //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"
        var processorName = $("#selectProcessorsList option:selected").text();
       // UpdateApplicationStatus(2, '', "Assigned to Processor " + processorID, comment, supervisorID, processorID, supervisorName, processorName);//  Status  2	Assigned to Processor
        UpdateApplicationStatus(2, '', "Assigned to Processor " + processorName, comment, supervisorID, processorID, supervisorName, processorName);//  Status  2	Assigned to Processor
    });

    //$("#btn_reviewPrint").click(function () {  // supervisor view
    //    printBttonClick();
    //});

    //$("#btn_reviewPrint").click(function () {  // supervisor view
    //    printButtonClick();
    //});
    $("#btn_proce_print").click(function () {  // processor view
        printButtonClick();
    });    

    function printButtonClick() {
        debugger;
        var comment = '';
        var assignedFrom = $("#AssignedProcessor").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedTo = $("#AssignedBy").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"

        var assignedFromName = $("#AssignedProcessorName").text();   
        var assignedToName = $("#AssignedByName").text();

        var status = 23; //	Pending Vendor Confirmation

        if (GlobalUserHasRoles.SupervisorRole || GlobalUserHasRoles.AdminRole) {
            assignedTo = assignedFrom;  //If supervisor "print" then  assigned to supervisor himself else if Processor Print then send to to supervisor
            assignedToName = assignedFromName;  
        }

        UpdateApplicationStatus(status, '', "send to vendor confirmation.", comment, assignedFrom, assignedTo, assignedFromName, assignedToName);
    };


    function getActualFullDate() {
        var date = new Date(),
            yr = date.getFullYear(),
            month = date.getMonth() + 1,
            day = date.getDate();

        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return month + '/' + day + '/' + yr + ' (' + strTime + ')';
    }

    function UpdateApplicationStatus(status, reason_type, message, comment, assignedFrom, assignedTo, assignedFromName, assignedToName) {
        debugger;
        var confirmNum = confirmationNum;

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateApplicationStatus/",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'status': status, 'Comment': comment, 'ReasonType': reason_type, 'ProcessorID': assignedTo, 'AssignedBy': assignedFrom
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {

                $("#AssignedProcessor").text(assignedTo);
                $("#AssignedBy").text(assignedFrom);

                $("#AssignedProcessorName").text(assignedToName);
                $("#AssignedByName").text(assignedFromName);

                $("#ClosedDate").text(getActualFullDate());

                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Application " + message);

                if (status == 22 || status == 6) {   //reject  status = 6;  	Recommend Reject  = 22
                    $('#rejectApplicationModal').modal('hide');
                    if (status == 22) {
                        $("#header_status").text("Recommend Reject");
                    }
                    else if (status == 6) {
                        $("#header_status").text("Rejected");
                    }
                }
                else if (status == 2) {  // assign = 2  
                    $('#assignApplicationModal').modal('hide');
                    $("#header_status").text("Assigned to Processor");  //StatusCode	StatusDesc
                }
                else if (status == 21 || status == 4) {
                    $('#approveApplicationModal').modal('hide');

                    if (status == 21) {
                        $("#header_status").text("Recommend Approve");
                    }
                    else if (status == 4) {
                        $("#header_status").text("Approved");
                    }
                }

                //  Make invisible the tool bar and button after status changes
                $("#btn_Reject").hide();
                $("#btn_Assign").hide();
                $("#div_supervisor_review_panel").hide();
                //

            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating application status , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    };

    $("#txt_pop_VendorCode").focusout(function () {
        if ($("#txt_pop_VendorCode").val().trim().length > 0) {
            GetVendorNameByVendorCode($("#txt_pop_VendorCode").val());
        }
    }).click(function (e) {
        e.stopPropagation();
        return true;
    });

    function GetVendorNameByVendorCode(vname) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "post",
            dataType: 'json',
            data: JSON.stringify({ 'UserId': vname }),
            url: "/api/values/GetVendorNameByVendorCode/",
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                $("#txt_pop_PayeeName").val(data.data.VendorName);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#txt_pop_PayeeName").val("");
            }
        });
    };

    $("#btn_SubmitVendorDetails").click(function (confirmationNum) {
        debugger;
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');

        var vendorNumber = $("#txt_pop_VendorCode").val();
        var firstName = $("#txt_pop_FirstName").val();
        var lastName = $("#txt_pop_LastName").val();
        var middleName = $("#txt_pop_MiddleName").val();
        var phoneNumber = $("#txt_pop_PhoneNumber").val();
        var cellPhone = $("#txt_pop_CellPhone").val();
         var payeeName = $("#txt_pop_PayeeName").val();
        var aliasDBA = $("#txt_pop_AliasDBA").val();
        var companyName = $("#txt_pop_CompanyName").val();
        var tin = $("#txt_pop_Tin").val();
        var ddNotify = $("#txt_pop_DDNotify").val();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateVendorDetails/",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'vendorNumber': vendorNumber, 'firstName': firstName, 'lastName': lastName, 'middleName': middleName, 'phoneNumber': phoneNumber, 'cellPhone': cellPhone
                , 'payeeName': payeeName  
                , 'aliasDBA': aliasDBA, 'companyName': companyName, 'TaxpayerID': tin, 'DDnotifyEmail': ddNotify
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully Vendor Details updated");

                $('#vendorDetailsModal').modal('hide');

                //$("#VI_VendorCode").text(vendorNumber);
                //$("#Alias_DBA").text(aliasDBA);
                //$("#FirstName").text(firstName);
                //$("#MiddleName").text(middleName);
                //$("#LastName").text(lastName);

                //$("#PhoneNumber").text(phoneNumber);
                ////$("#VI_PayeeName").text(payeeName);
                //$("#CompanyName").text(companyName);
                //$("#TaxpayerID").text(tin);
                //$("#DirectDepositNotificationEmail").text(ddNotify);

                $('#ul_ddoptionList').empty()
                getApplicationSummary(confirmationNum);
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating  Vendor Details , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });

    $("#btn_SubmitBankDetails").click(function (confirmationNum) {
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var accountType = $("#txt_pop_AccountType").val();
        var bankAccountNumber = $("#txt_pop_BankAcNo").val();
        var bankRoutingNo = $("#txt_pop_RoutingNo").val();
        var financialIns = $("#txt_pop_FinancialIns").val();
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateVendorBankDetails/",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'AccountType': accountType, 'BankAccountNumber': bankAccountNumber, 'BankRoutingNo': bankRoutingNo, 'FinancialIns': financialIns
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Bank information updated successfully.");

                $('#bankDetailsModal').modal('hide');

                var acType = "Saving";
                if ($("#txt_pop_AccountType").val == 1)
                    acType = "Checking";

                $("#TypeofAccount").text(acType);
                $("#BankAccountNumber").text(bankAccountNumber);
                $("#BankRoutingNumber").text(bankRoutingNo);
                $("#FinancialInstitutionName").text(financialIns);
                // $("#AttachmentType").text(SignerName);
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating  Bank Details , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });

    $("#btn_SubmitCertificationDetails").click(function (confirmationNum) {
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var SignerName = $("#txt_pop_SignerName").val();
        var SignerTitle = $("#txt_pop_SignerTitle").val();
        var SignerPhone = $("#txt_pop_SignerPhone").val();
        var SignerEmail = $("#txt_pop_SignerEmail").val();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateVendorAuthorizationDetails/",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'SignerName': SignerName, 'SignerTitle': SignerTitle, 'SignerPhone': SignerPhone, 'SignerEmail': SignerEmail
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Certification information updated successfully.");
                $('#certificationDetailsModal').modal('hide');

                //$("#txt_pop_SignerName").val(SignerName);
                //$("#txt_pop_SignerTitle").val(SignerTitle);
                //$("#txt_pop_SignerPhone").text(SignerPhone);
                //$("#txt_pop_SignerEmail").text(SignerEmail);

                $("#AuthorizedSignerName").text(SignerName);
                $("#AuthorizedSignerTitle").text(SignerTitle);
                $("#AuthorizedSignerPhone").text(SignerPhone);
                $("#AuthorizedSignerEmail").text(SignerEmail);

                //populate back from popup screen
                //
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating  Certification Details , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });

    $("#btn_SubmitDepartmentDetails").click(function (confirmationNum) {
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var deptName = $("#txt_pop_DeptName").val();
        var deptcontactName = $("#txt_pop_DeptcontactName").val();
        var deptEmailAddress = $("#txt_pop_DeptEmailAddress").val();
        var deptContact = $("#txt_pop_DeptContact").val();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateDepartmentDetails/",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'DepartmentName': deptName, 'DepartmentContactName': deptcontactName, 'DepartmentEmail': deptEmailAddress, 'DepartmentContactNo': deptContact
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Department information updated successfully.");

                $('#departmentDetailsModal').modal('hide');
                //populate from popup
                $("#DeptName").text(deptName);
                $("#DeptContactPersonName").text(deptcontactName);
                $("#DeptEmailAddress").text(deptEmailAddress);
                $("#DeptContactNumber").text(deptContact);
                //
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating  Department Details , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });

    $("#btn_SubmitNotes").click(function (confirmationNum) {
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var notesType = "General"; // to do needed  place holder to pull from 
        var notes = $("#txt_Notes_comment").val();
        InsertUpdateNotes(confirmationNum, notesType, notes);
    });

    function InsertUpdateNotes(confirmationNum, notesType, notes) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/InsertUpdateNotes/",
            dataType: 'json',
            data: JSON.stringify({
                'ConfirmationNumber': confirmationNum, 'NotesType': notesType, 'Notes': notes, 'LastUpdatedUser': userId
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully added notes.");

                //var date = new Date();
                //var datenow = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

                var today = new Date();
                var tdate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
                var ttime = (today.getHours() > 12) ? (today.getHours() - 12 + ':' + today.getMinutes() + ' PM') : (today.getHours() + ':' + today.getMinutes() + ' AM');
                var dateTime = tdate + ' ' + ttime;

                
                var a = '<li class="list-group-item list-group-item-warning emptyResultMessage">  <span>' + userName + ' : ' + dateTime + '</span> <br/>  <span style="font-weight:bold; padding-right:10px" >' + '</span >' + notes + '</li> <br>';
                $("#noteList").prepend(a);

                $('#addNotesModal').modal('hide');
                $("#txt_Notes_comment").val('');
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in Insert/ Update Notes , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    function GetProcessorsList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetProcessorsList/",
            dataType: 'json',

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                var selectProcessorsList = $('#selectProcessorsList');
                $.each(data.data.returnValue, function (key, value) {
                    selectProcessorsList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in Getting Processors List , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    }

    $('#bankDetailsModal').on('shown.bs.modal', function (e) {
        $("#txt_pop_BankAcNo").val($("#BankAccountNumber").text());
        $("#txt_pop_RoutingNo").val($("#BankRoutingNumber").text());
        $("#txt_pop_FinancialIns").val($("#FinancialInstitutionName").text());

        if ($("#TypeofAccount").text().toLowerCase().indexOf("checking") >= 0) {
            $("#txt_pop_AccountType").prop('selectedIndex', 1);
        }
        else {
            $("#txt_pop_AccountType").prop('selectedIndex', 2);
        }
    });

    $('#certificationDetailsModal').on('shown.bs.modal', function (e) {
        $("#txt_pop_SignerName").val($("#AuthorizedSignerName").text());
        $("#txt_pop_SignerTitle").val($("#AuthorizedSignerTitle").text());
        $("#txt_pop_SignerPhone").val($("#AuthorizedSignerPhone").text());
        $("#txt_pop_SignerEmail").val($("#AuthorizedSignerEmail").text());
        $("#txt_pop_Certification").val($("#CI_ConfirmationNumber").text());
    })

    $('#vendorDetailsModal').on('shown.bs.modal', function (e) {
        $("#txt_pop_VendorCode").val($("#VI_VendorCode").text());

        if ($("#txt_pop_VendorCode").val().length > 0) {
            $("#txt_pop_VendorCode").prop("readonly", true);
            $("#txt_pop_VendorCode").attr("disabled", "disabled");
        }

        $("#txt_pop_FirstName").val($("#FirstName").text());
        $("#txt_pop_LastName").val($("#LastName").text());
        $("#txt_pop_MiddleName").val($("#MiddleName").text());
        $("#txt_pop_PhoneNumber").val($("#PhoneNumber").text());
        // $("#txt_pop_CellPhone").val();
        $("#txt_pop_PayeeName").val($("#VI_PayeeName").text());
        $("#txt_pop_AliasDBA").val($("#Alias_DBA").text());
        $("#txt_pop_CompanyName").val($("#CompanyName").text());
        $("#txt_pop_Tin").val($("#TaxpayerID").text());
        $("#txt_pop_DDNotify").val($("#DirectDepositNotificationEmail").text());
    })

    $('#departmentDetailsModal').on('shown.bs.modal', function (e) {
        $("#txt_pop_DeptName").val($("#DeptName").text());
        $("#txt_pop_DeptcontactName").val($("#DeptContactPersonName").text());
        $("#txt_pop_DeptEmailAddress").val($("#DeptEmailAddress").text());
        $("#txt_pop_DeptContact").val($("#DeptContactNumber").text());
    })

    //  Attachment Document Related functions


    /* Srini: 8/30/2020 Helper function:  Download file used in application summary page,   */
    function download_file(fileURL, fileName) {
        // for non-IE
        if (!window.ActiveXObject) {
            var save = document.createElement('a');
            save.href = fileURL;
            save.target = '_blank';
            var filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
            save.download = fileName || filename;
            if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
                document.location = save.href;
                // window event not working here
            } else {
                var evt = new MouseEvent('click', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': false
                });
                save.dispatchEvent(evt);
                (window.URL || window.webkitURL).revokeObjectURL(save.href);
            }
        }

        // for IE < 11
        else if (!!window.ActiveXObject && document.execCommand) {
            var _window = window.open(fileURL, '_blank');
            _window.document.close();
            _window.document.execCommand('SaveAs', true, fileName || fileURL)
            _window.close();
        }
    }
    // 

    $('#attachmentGrid').on('click', '.clsdownload', function (e) {
        var closestRow = $(this).closest('tr');
        var data = $('#attachmentGrid').DataTable().row(closestRow).data();

        //download_file("/Uploads/58202010105_SP8313_VC.png", "58202010105_SP8313_VC.png"); //call function
        download_file("/Uploads/" + data.AttachmentFileName, data.AttachmentFileName); //call function

    });
    //
    $('#attachmentGrid').on('click', '.clsretire', function (e) {
        var closestRow = $(this).closest('tr');
        var data = $('#attachmentGrid').DataTable().row(closestRow).data();
        var confirmationNum = data.ConfirmationNum;
        var fname = data.AttachmentFileName;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'Confirmation': confirmationNum, 'VendorAttachmentFileName': fname, 'Active': 0 }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/UpdateRetireAttachment/",
            success: function (data) {
                // REMOVE THE LINE
                // closestRow.remove();
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("This attachment retired from the Application!");

                setAttachment(data.data.attachments);

                //var t = $('#attachmentGrid').DataTable();
                //t.draw();

                $("#menuDocCount").text(data.data.length);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    });

    function setAttachment(data) {
        $("#menuDocCount").text(data.length);

        $('#attachmentGrid').DataTable().destroy();
        $('#attachmentGrid').empty();

        $('#attachmentGrid').dataTable({
            responsive: true,
            searching: false,
            paging: true,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "AttachmentFileName",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            data = '<a target="blank" href="/Uploads/' + row.AttachmentFileName + '">' + data + ' </a>';    //'58202010105_SP8313_VC.png'
                        }

                        return data;
                    },
                    "title": "File Name"
                },
                {
                    "data": "DisplayName",
                    "title": "File Type"
                },
                {
                    'data': 'UploadedDate', "title": "Uploaded Date"
                    , "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            data = '<span class="fa fa-calendar">' + data + ' </span>';
                        }
                        return data;
                    }
                },
                {
                    'data': null,
                    "bSortable": false,
                    "width": '5px'
                    , "mRender": function (o) {
                        return '<div id = "div_action "class= "pull-right btn-group" >' +
                            '<span class="glyphicon glyphicon-cog dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></span>' +
                            '<ul class="dropdown-menu context-menu-left-showOnLeft">' +
                            '<li>' +
                            '<a class="clsdownload" title="Download Document" > ' +

                            '<span class="glyphicon glyphicon-download-alt"></span>' +
                            '<span>Download</span>' +
                            '</a>' +
                            '</li>' +

                            '<li>' +
                            '<a title="Retire File" class="clsretire"  data-rowclass="documentRow">' +
                            '<span class="fa fa-trash-o"></span>' +
                            ' Retire' +
                            '</a>' +
                            ' </li>' +
                            '</ul>' +
                            '</div>'
                    }
                }
            ],

            columnDefs: [
                //{ "class": "fa fa-calendar" , "targets": [1] },
                {
                    searching: false,
                    data: null,
                    defaultContent: '',
                    orderable: false,
                },
            ],
            select: {
                selector: 'td:first-child'
            },

        });

        if (GlobalUserHasRoles.AdminRole) {
            $(".clsretire").show();
        }
        else {
            $(".clsretire").hide();
        }
    };

    function GetAttachmentDocuments(confirmationNum) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'ConfirmationNum': confirmationNum }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetAttachmentsData/",
            success: function (data) {
                setAttachment(data.data.attachments);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    function handleFileSelect(fileInput) {  ////  if sessionstorage 'uploadedfile'  works delete this key
        var file = fileInput;
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.src = reader.result;
        }
        var img = new Image();
        return img;
    };

    $('#btn_addUploadMore').click(function (e) {
        $('#file-input').click();
    });
    $('#file-input').change(handleFileSelect);

    $('input[type="file"]').change(function (e) {
        // "#btn_addUploadMore").click(function (e) {
        var ext = ['.PDF', '.DOC', '.DOCX', '.JPG', '.JPEG', '.GIF', '.PNG'];
        var fileName = e.target.files[0].name;
        var file = e.target.files[0];

        var imagefile = handleFileSelect(file);
        var fileExtenstion = '';//getFileExtenstion(fileName.toUpperCase(), ext);
        if (file) {
            if (file.size >= 10485760) {
                alert('The file size is too large. Please choose another file.');
            }
            else if (fileExtenstion == null)
                alert('The acceptable file types are .pdf, .doc, .docx, .jpg, .jpeg, .gif, .png. Please choose another file.');
            else {
                sessionStorage.setItem('selectedFile', imagefile);  //  if sessionstorage 'uploadedfile'  works delete this key

                uploadfile(file, fileName, fileExtenstion.toLowerCase());

            }
        }
    });

    function uploadfile(filetoupload, modifiedFileName, ext) {
        if (window.FormData !== undefined) {

            //var fileUpload = filetoupload;
            var files = filetoupload;

            // Create FormData object  
            var fileData = new FormData();

            // Looping over all files and add it to FormData object  
            fileData.append(files.name, files);

            // Adding one more key to FormData object for modified file name 
            fileData.append('modifiedFilename', modifiedFileName);

            $.ajax({
                url: '/helper/UploadAttachmentFile',
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    UploadDocumentAttachment(files.name);
                },
                error: function (err) {
                }
            });
        } else {
            alert("Attachment file type is not supported.");
        }
    };

    function UploadDocumentAttachment(fileName) {
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var attachmentFileName = fileName;
        var documentAttachmentTypeId = 4;	//Other Attachment in documenttype table

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/InsertDocumentAttachment/",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'VendorAttachmentFileName': attachmentFileName, 'LastUpdatedUser': userId, 'DocumentAttachmentTypeId': documentAttachmentTypeId
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                //var fullDate = new Date();
                //var currentDate = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();

                d = new Date();
                var currentDate = d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate();
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Document attachment successfully uploaded.");
                setAttachment(data.data.attachments);

                // var t = $('#attachmentGrid').DataTable();
                // t.row.add({
                //     "ConfirmationNum": confirmationNum,
                //     "AttachmentFileName": fileName,
                //     "DisplayName": fileName,
                //     "UploadedDate": currentDate,
                //}).draw();

                $("#menuDocCount").text(data.data.attachments.length);


            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error uploading documents , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    function GetDocumentCheckList(confirmationNum) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'ConfirmationNumber': confirmationNum }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetDocumentCheckList/",
            success: function (data) {
                for (var item in data.data.ChecklistItems) {
                    if (data.data.ChecklistItems[item].Active == 1) {
                        $('input[value=' + data.data.ChecklistItems[item].CheckListID + ']').attr('checked', 'checked');
                    }
                    $('a[value=' + data.data.ChecklistItems[item].CheckListID + ']').text(data.data.ChecklistItems[item].LastUpdateDateTime);
                }
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    function GetAlreadyLinkedApplicationByConfirmationNum(confirmationNum) {  //  this is called here jest to get count display at the  side menu
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetLinkedApplicationByConfirmationNum/",
            success: function (data) {
                $("#menuLinkAppCount").text(data.data.linkedApplication.length);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }
});