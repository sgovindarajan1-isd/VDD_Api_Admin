$(document).ready(function () {
    debugger;
    var userName = sessionStorage.getItem('UserName');
    var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
    var role = sessionStorage.getItem('RoleId');


    //if ($("#approveApplicationModal").hasClass('processorapprove')) {
    //    alert('has processorapprove');
    //}
    //else if ($("#approveApplicationModal").hasClass('supervisorapprove')) {
    //    alert('has supervisorapprove');
    //}
    //else {
    //    alert('no no approve clas');
    //}

    //$('#approveApplicationModal').on('shown.bs.modal', function (e) {
    //    alert('approveApplicationModal  opening');
    //})

    $(function () {
        $('#btn_proce_approve').click(function () {
            $('#approveApplicationModal').addClass("processorApprove");

        });

        $('#btn_proce_reject').click(function () {
            $('#approveApplicationModal').addClass('processorReject')
        });
    });



    getApplicationSummary(confirmationNum);
    GetProcessorsList();

    function getReviewPanelInformation(summaryData) {
        debugger;
        var status = summaryData.Status;
        var statusDesc = summaryData.StatusDesc;
        if (role == 11) {   //11	Processor
            $("#div_processor_review").show();
            $("#div_supervisor_review").hide();
            $("#div_supervisor_proce_review").hide();

            if (status == 2) {  //'pending'   2	Assigned to Processor
                statusDesc = "(Pending Approval)";
            }
            $("#span_processoreview_status").text(status);
        }
        else {          //12	Supervisor
            $("#div_supervisor_review").show();
            $("#div_processor_review").hide();


            if (status == 5 || status == 21 || status == 22) {  //'pending'    // If Pending  no needed to show "Return" button
                statusDesc = "(Application Pending)";
                $("#btn_reviewReturn").hide();
                $("#btn_reviewReject").hide();
                $("#btn_reviewPrint").show();
            }

            if (status == 21 || status == 22) {
                $("#div_supervisor_proce_review").show();
                var msg = summaryData.StatusDesc + " by " + summaryData.ProcessorID + " on " + summaryData.AssignmentDate;
                $("#span_review_processor_Approval_msg").text(msg);  //Approved by Monique Tsoi on 4/27/2020
                $("#span_review_processor_notes").text(summaryData.Comment);
            }
            else {
                $("#div_supervisor_proce_review").hide();
            }
            $("#span_suervisorreview_status").text(statusDesc);
        }
    }


    //$("#tab_Notes").click(function () {
    //    alert('asdfasf');
    //    //    $('#div_summaryContent').detach();
    //    //    $('#div_summaryContent').html($("#div_Notes_tab").html());

    //        $("#div_summary_tab").removeClass('show');
    //        $("#div_summary_tab").addClass('fade');

    //        $("#div_notes_tab").removeClass('fade');
    //        $("#div_notes_tab").addClass('show');

    //    });

    function assignDetailsFromDatabase(data) {
        debugger;
        if ((data == null) || (data == 'undefined')) {
            return;
        }
        if (data.Status == 5) {  // Pending =5
            $("#div_assignApplication").show();
            $("div_processor_review").hide();
        }
        else if (data.Status == 21 || data.Status == 22) {  // recommend approve =21 recomment reject 22
            $("#div_assignApplication").show();
            $("#btn_Assign").text("Re-Assign");
            $("div_processor_review").hide();
        }
        else {
            $("#div_assignApplication").hide();
            $("div_processor_review").show();
        }

        getReviewPanelInformation(data);  //   This section show the and hide the History information.


        $("#id_userName").text(userName);
        $("#head_confirmationNum").text(confirmationNum);
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
        //$("#ClosedDate").text();
        //$("#EnteredBy").text();
        //$("#IPAddress").text();
        //$("#IPDevice").text();
        //$("#IPLocation").text();

        // vendor Information
        $("#VI_VendorCode").text(data.VendorNumber);
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
        $("#IPAddress").text(data.Source_ip);
        $("#IPDevice").text(data.Source_device);
        $("#IPLocation").text(getTheIPLocation(data.Source_ip));
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
        var i = 1;
        $.each(data.LocationAddress, function (index, value) {

            //   $("#div_ddPaymentOptionSelected").append(index + ": " + value + '<br>');
            //$("#div_ddPaymentOptionSelected").append(index+1);
            var a = '<div> <span style="font-weight:bold; padding-right:10px" >' + i + '.    </span >' +  value + '</div>';
            $("#div_ddPaymentOptionSelected").append(a);//value);
            i = i+1;
            //$("#div_ddPaymentOptionSelected").append('<br>');
        });
    };

    function getTheIPLocation(source_ip) {
        if (source_ip == null || source_ip == 'undefined' || source_ip == "") {
            return ""
        }
        else {
            return "Test Ip location"
        }
    }

    function getApplicationSummary(confirmationNum) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetApplicationSummary/",
            dataType: 'json',
            // data: JSON.stringify({ 'Confirmation': 'PJDZBM' }),  
            data: JSON.stringify({ 'UserId': confirmationNum }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                //data.data.applicationSummary
                assignDetailsFromDatabase(data.data.applicationSummary);

                //
                //AccountType: 1
                //AccountTypeDesc: "Checking Deposit"
                //AuthorizedPhoneExt: null
                //BankAccountNumber: "049170145"
                //BankRoutingNo: "122242843"
                //Comment: null
                //Confirmation: null
                //DDNotifyEmail: "cherise@aaaflag.com"
                //FinancialIns: "BANK OF THE WEST"
                //Host_headers: null
                //LocationAddress: (3)["8955 NATIONAL BLVD., LOS ANGELES, CA, 90034-3307", "8954 W. PICO BLVD., LOS ANGELES, CA, 90035-3334", "1201 S. BROADWAY, LOS ANGELES, CA, 90015-2107"]
                //LocationIDs: null
                //OfficeNotes: null
                //Payeename: null
                //RequestDate: "6/29/2017 12:45:50 PM"
                //RequestType: "DDOL"
                //Signeremail: null
                //Signername: null
                //Signerphone: null
                //Signertitle: null
                //Source_device: null
                //Source_ip: null
                //Ssn: null
                //Status: "Assigned to Processor"
                //SubmitDateTime: "0001-01-01T00:00:00"
                //User_agent: null
                //VendorAttachmentFileName: null
                //VendorNumber: "036469"
                //VendorReportFileName: null
                //Vendorname: null

                //
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
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
        var status = 21;

        if (role == 11)  // processor
            status = 21;	//  Recommend Approve  if processor approve  it will be 21 if the Supervisor approve it will be 4
        else {
            status = 4
            assignedTo = $("#AssignedProcessor").text();; //  final approval  assigned to supervisor him self
        }

        UpdateApplicationStatus(status, '', "Approved.", comment, assignedFrom, assignedTo);//  Approve  : 4	Direct Deposit,  sending reason_type is empty as no reason for approval
    });

    $("#btn_SubmitReject").click(function () {
        var reason_type = $("#select_rejectReason option:selected").text();
        var comment = $("#txt_reject_comment").val();
        var assignedFrom = $("#AssignedProcessor").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedTo = $("#AssignedBy").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"
        var status = 22;

        if (role == 11)  // processor
            status = 22;	//  Recommend reject  if processor approve  it will be 22 if the Supervisor approve it will be 6
        else {
            status = 6
            assignedTo = $("#AssignedProcessor").text();; //  final reject  assigned to supervisor him self
        }


        UpdateApplicationStatus(status, reason_type, "Rejected.", comment, assignedFrom, assignedTo);//   reject  status = 6;
    });

    $("#btn_SubmitReturn").click(function () {
        var reason_type = $("#select_rejectReason option:selected").text();
        var comment = $("#txt_comment").val();
        var assignedFrom = $("#AssignedProcessor").text();  //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var assignedTo = $("#AssignedBy").text();         //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"

        UpdateApplicationStatus(6, reason_type, "Rejected.", comment, assignedFrom, assignedTo);//   reject  status = 6;
    });

    // Assign  the proccessors
    $("#btn_SubmitAssign").click(function () {
        debugger;
        var comment = '';
        var supervisorID = $("#AssignedProcessor").text();                       //->  if supervisor assigned to processor --> Supervisor is current AssignedProcessor 
        var processorID = $("#selectProcessorsList option:selected").text();    //->   if return to processor means : Earlier  it is coming from processor"AssignedBy"

        UpdateApplicationStatus(2, '', "Assigned to Processor " + processorID, comment, supervisorID, processorID, 'Assign');//  Status  2	Assigned to Processor
        //debugger;
        //var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        //var status = 2;//"Assigned to Processor";
        //var processorID = $("#selectProcessorsList option:selected").text();  //:  to  do this could be name of the processor
        //// var processorID = $("#selectProcessorsList  option:selected").val();
        //var assignedBy = sessionStorage.getItem('UserId');

        //$.ajax({
        //    contentType: 'application/json; charset=utf-8',
        //    type: "POST",
        //    url: "/api/values/UpdateAssignApplication/",
        //    dataType: 'json',
        //    data: JSON.stringify({ 'Confirmation': confirmationNum, 'status': status, 'ProcessorID': processorID, 'AssignedBy': assignedBy }),

        //    headers: {
        //        'Authorization': 'Basic ' + btoa('admin')
        //    },
        //    success: function (data) {
        //        debugger;
        //        toastr.options.positionClass = "toast-bottom-right";
        //        toastr.warning("Successfully Assigned to Processor " + processorID);

        //        $('#assignApplicationModal').modal('hide');
        //    }
        //    , complete: function (jqXHR) {
        //    }
        //    , error: function (jqXHR, textStatus, errorThrown) {
        //        debugger;
        //        if (textStatus == 'error') {
        //            toastr.options.positionClass = "toast-bottom-right";
        //            toastr.warning("Error in updating application status , Please check!");
        //        }
        //        else if (jqXHR.status == '401') {
        //            window.location.href = "/Home/UnAuthorized";
        //        }
        //    }
        //});

    });

    function UpdateApplicationStatus(status, reason_type, message, comment, assignedFrom, assignedTo, action) {
        debugger;
        var confirmNum = confirmationNum;

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateApplicationStatus/",
            dataType: 'json',
            // data: JSON.stringify({ 'Confirmation': 'PJDZBM' }),  
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'status': status, 'Comment': comment, 'ReasonType': reason_type, 'ProcessorID': assignedTo, 'AssignedBy': assignedFrom
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                debugger;
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Application " + message);

                if (status == 22 || status == 6) {   //reject  status = 6;  	Recommend Reject  = 22
                    $('#rejectApplicationModal').modal('hide');
                }
                else if (status == 2) {  // assign = 2  
                    $('#assignApplicationModal').modal('hide');
                }
                else if (status == 21 || status == 4) {
                    $('#approveApplicationModal').modal('hide');
                }

            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
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

    $("#btn_SubmitVendorDetails").click(function (confirmationNum) {
        debugger;
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');

        var vendorNumber = $("#txt_pop_VendorCode").val();
        var firstName = $("#txt_pop_FirstName").val();
        var lastName = $("#txt_pop_LastName").val();
        var middleName = $("#txt_pop_MiddleName").val();
        var phoneNumber = $("#txt_pop_PhoneNumber").val();
        var cellPhone = $("#txt_pop_CellPhone").val();
        // var payeeName = $("#txt_pop_PayeeName").val();
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
                //, 'payeeName': payeeName  
                , 'aliasDBA': aliasDBA, 'companyName': companyName, 'TaxpayerID': tin, 'DDnotifyEmail': ddNotify
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                debugger;
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully Vendor Details updated");

                $('#vendorDetailsModal').modal('hide');

                $("#VI_VendorCode").text(vendorNumber);
                $("#Alias_DBA").text(aliasDBA);
                $("#FirstName").text(firstName);
                $("#MiddleName").text(middleName);
                $("#LastName").text(lastName);

                $("#PhoneNumber").text(phoneNumber);
                //$("#VI_PayeeName").text(payeeName);
                $("#CompanyName").text(companyName);
                $("#TaxpayerID").text(tin);
                $("#DirectDepositNotificationEmail").text(ddNotify);
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
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
                debugger;
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully Bank Details updated");

                $('#bankDetailsModal').modal('hide');

                // $("#TypeofAccount").text(SignerName);
                $("#BankAccountNumber").text(bankAccountNumber);
                $("#BankRoutingNumber").text(bankRoutingNo);
                $("#FinancialInstitutionName").text(financialIns);
                // $("#AttachmentType").text(SignerName);
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
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
        debugger;
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
                debugger;
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully Certification Details updated");
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
                debugger;
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
        debugger;
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
                debugger;
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully Department Details updated");

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
                debugger;
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
                    debugger;
                    selectProcessorsList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
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

    //$("#bankDetailsModal").on('shown', function () {
    //    alert("I want this to appear after the modal has opened!");
    //});

    $('#bankDetailsModal').on('shown.bs.modal', function (e) {
        debugger;
        $("#txt_pop_BankAcNo").val($("#BankAccountNumber").text());
        $("#txt_pop_RoutingNo").val($("#BankRoutingNumber").text());
        $("#txt_pop_FinancialIns").val($("#FinancialInstitutionName").text());
        //$("#TypeofAccount").val();
    });

    $('#certificationDetailsModal').on('shown.bs.modal', function (e) {
        debugger;
        $("#txt_pop_SignerName").val($("#AuthorizedSignerName").text());
        $("#txt_pop_SignerTitle").val($("#AuthorizedSignerTitle").text());
        $("#txt_pop_SignerPhone").val($("#AuthorizedSignerPhone").text());
        $("#txt_pop_SignerEmail").val($("#AuthorizedSignerEmail").text());
        $("#txt_pop_Certification").val($("#CI_ConfirmationNumber").text());
    })

    $('#vendorDetailsModal').on('shown.bs.modal', function (e) {
        debugger;
        $("#txt_pop_VendorCode").val($("#VI_VendorCode").text());
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
        debugger;
        $("#txt_pop_DeptName").val($("#DeptName").text());
        $("#txt_pop_DeptcontactName").val($("#DeptContactPersonName").text());
        $("#txt_pop_DeptEmailAddress").val($("#DeptEmailAddress").text());
        $("#txt_pop_DeptContact").val($("#DeptContactNumber").text());
    })
});