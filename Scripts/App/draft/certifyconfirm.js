$(document).ready(function () {
    //$('#menu_loggedinasUserName').text("Logged in as " + sessionStorage.getItem('userName'));
    //$('#menu_loggedinasUserName').css("display", "block");

    var vendorDetails = {};
    var LocationAddressList = new Array();
    var bankDetails = new Array();
    var locationList = new Array();

    $("#img_info_step").parent().css("border-color", "#7030A0");
    $('#lbl_userName').text("Logged in as " + sessionStorage.getItem('userName'));
    var vendorNumber = sessionStorage.getItem('vendorNumber');

    $("#liNavigation").show();
    $(".round-tab").css("border-color", "#e0e0e0");

    //$(".nav li").removeClass("active");
    if ($(location).attr('href').indexOf("_partialCertify") > -1) {
        debugger;

        $('#txtSignerPhone').mask('(000)000-0000');
        $('#txtDeptPhone').mask('(000)000-0000');

        $("#img_vendor_step").attr('src', '/Content/Images/user_step.png');
        $("#img_info_step").attr('src', '/Content/Images/info_step.png');
        $("#img_bank_verify_step").attr('src', '/Content/Images/verify_step.png');
        $("#img_certify_step").attr('src', '/Content/Images/certify_step_on.png');
        $("#img_certify_step").addClass("active");
        $("#li_certify_step").addClass("active");
        $("#img_certify_step").parent().css("border-color", "#7030A0");
        $('#lbl_header').html('Certify');

        $("#span_bankstep").removeClass("disabled");
        $("#span_attachmentstep").removeClass("disabled");
        $("#span_verify_step").removeClass("disabled");

        //getuserInfoForProxiedFields();

        ////testing values

        if ($(location).attr('href').indexOf("local") > -1) {
            $('#txtSignerName').val('Srini G');
            $('#txtSignerTitle').val('President/CEO');
            $('#txtSignerPhone').val('(123)412-4214');
            $('#txtSignerEmail').val('srini@isd.com');

            $('#txtDeptName').val('ChildCare');
            $('#txtDeptPerson').val('Dept Srini G');
            $('#txtDeptEmail').val('dept@dept.com');
            $('#txtDeptPhone').val('(123)412-4214');
        }
        //////testing values

        var certifyobj = JSON.parse(sessionStorage.getItem("certifydetailsJson"));

        if (sessionStorage.getItem('deptUser') == "false") {
            $("#lbl_disp_proxysigninfoHeader").hide();
            $("#lbl_signerName").html("Name");
            $("#lbl_signerTitle").html("Title");
            $("#lbl_signerEmail").html("Email Address");
            $("#lbl_signerPhone").html("Phone Number");
        }

        if ((certifyobj != null) && (certifyobj != 'undefined')) {
            $("#txtSignerName").val(certifyobj[0].Signername);
            $("#txtSignerTitle").val(certifyobj[0].Signertitle);
            $("#txtSignerPhone").val(certifyobj[0].Signerphone),
                $("#txtSignerEmail").val(certifyobj[0].Signeremail);

            $("#txtDeptName").val(certifyobj[0].DeptName);
            $("#txtDeptPerson").val(certifyobj[0].DeptPerson);
            $("#txtDeptEmail").val(certifyobj[0].DeptEmail);
            $("#txtDeptPhone").val(certifyobj[0].DeptPhone);
        }
    }
    else if ($(location).attr('href').indexOf("_partialSubmit") > -1) {
        $("#img_vendor_step").attr('src', '/Content/Images/user_step.png');
        $("#img_info_step").attr('src', '/Content/Images/info_step.png');
        $("#img_certify_step").attr('src', '/Content/Images/certify_step.png');
        $("#img_submit_step").attr('src', '/Content/Images/submit_step_on.png');
        $("#img_submit_step").addClass("active");
        $("#li_submit_step").addClass("active");
        $("#img_submit_step").parent().css("border-color", "#7030A0");
        $('#lbl_header').html('Submit');

        $("#span_bankstep").removeClass("disabled");
        $("#span_attachmentstep").removeClass("disabled");
        $("#span_verify_step").removeClass("disabled");
        $("#span_certify_step").removeClass("disabled");
        $("#span_submit_step").removeClass("disabled");

        getSubmitDetails();
    }
    else if ($(location).attr('href').indexOf("_partialConfirmation") > -1) {
        $("#img_vendor_step").attr('src', '/Content/Images/user_step.png');
        $("#img_info_step").attr('src', '/Content/Images/info_step.png');
        $("#img_certify_step").attr('src', '/Content/Images/certify_step.png');
        $("#img_submit_step").attr('src', '/Content/Images/submit_step.png');
        $("#img_confirmation_step").attr('src', '/Content/Images/confirmation_step_on.png');

        $("#img_confirmation_step").addClass("active");
        $("#li_confirmation_step").addClass("active");
        $("#img_confirmation_step").parent().css("border-color", "#7030A0");
        $('#lbl_header').html('Confirmation');

        $("#span_bankstep").removeClass("disabled");
        $("#span_attachmentstep").removeClass("disabled");
        $("#span_verify_step").removeClass("disabled");
        $("#span_submit_step").removeClass("disabled");
        $("#span_confirmation_step").removeClass("disabled");

        $("#confirmationNumber").html(sessionStorage.getItem('confirmationNumber'));
        $("#submittedDate").html(formatDateDisplay(sessionStorage.getItem('submittedDate')));

        //clear all other sessions since  the application is already submitted.  Otherwise, when click the "Enter application" Menu second time old information will be available.
        sessionStorage.removeItem('selectedFile');
        sessionStorage.removeItem('imagefile-selectedFile');
        sessionStorage.removeItem('originalfileName');
        sessionStorage.removeItem('uploadedfile');
        sessionStorage.removeItem('uploadedfileExtension');
        sessionStorage.removeItem('selectedFile_ddwetform');
        sessionStorage.removeItem('imagefile-selectedFile_ddwetform');
        sessionStorage.removeItem('originalfileName_ddwetform');
        sessionStorage.removeItem('uploadedfile_ddwetform');
        sessionStorage.removeItem('uploadedfileExtension_ddwetform');
        sessionStorage.removeItem("bankdetailsJson");
        sessionStorage.removeItem('certifydetailsJson');
        sessionStorage.removeItem("vendordetailsJson");
        sessionStorage.removeItem("paymentJson");
    }

    $(".form-control").on('input', function (e) {
        $(".errmessage").html("");
    });

    $("#btn_certify_back").on('click', function (e) {
        //sessionStorage.setItem('selectedFile', null);
        //sessionStorage.setItem('imagefile-selectedFile', null);
        window.history.back();
    });

    $('#btn_certify_next').on('click', function (e) {
        var signerName = $('#txtSignerName').val();
        var signerTitle = $('#txtSignerTitle').val();
        var signerPhone = $('#txtSignerPhone').val();
        var signerEmail = $('#txtSignerEmail').val();

        var deptName = $("#txtDeptName").val();
        var deptPerson = $("#txtDeptPerson").val();
        var deptEmail = $("#txtDeptEmail").val();
        var deptPhone = $("#txtDeptPhone").val();

        var bool = true;

        //if (signerName.length <= 0) {
        //    $("#signerName").html('Proxied Signer’s Name is required.');
        //    bool = false;
        //} else {
        //    $("#signerName").html('');
        //}

        //if (signerTitle.length <= 0) {
        //    $("#signerTitle").html('Proxied Signer’s Title is required.');
        //    bool = false;
        //} else {
        //    $("#signerTitle").html('');
        //}
        //debugger;
        //if (signerPhone.length <= 0) {
        //    $("#signerPhone").html('Proxied Signer’s Phone # is required.');
        //    bool = false;
        //} else

        //if (signerEmail.length <= 0) {
        //    $("#signerEmail").html('Proxied Signer’s Email is required.');
        //    bool = false;
        //}
        //else

        if ( (signerPhone.length > 0) && (!validatePhone(signerPhone))) {
            $("#signerPhone").html('Valid proxied signer’s phone # is required.');
            bool = false;
        } else {
            $("#signerPhone").html('');
        }

        if ( (signerEmail.length > 0) && (!isEmail(signerEmail)) ) {
            $("#signerEmail").html('Please enter valid Email address');
            bool = false;
        }
        else {
            $("#signerEmail").html('');
        }


        //if (deptName.length <= 0) {
        //    $("#spanDeptName").html('Department Name is required.');
        //    bool = false;
        //} else {
        //    $("#spanDeptName").html('');
        //}

        //if (deptPerson.length <= 0) {
        //    $("#spanDeptPerson").html('Department Contact Person Name is required.');
        //    bool = false;
        //} else {
        //    $("#spanDeptPerson").html('');
        //}
        debugger;
        //if (deptPhone.length <= 0) {
        //    $("#spanDeptPhone").html('Department Contact Number is required.');
        //    bool = false;
        //} else
        if ((deptPhone.length > 0) && (!validatePhone(deptPhone))) {
            $("#spanDeptPhone").html('Valid Department Contact Number is required.');
            bool = false;
        } else {
            $("#spanDeptPhone").html('');
        }

        //if (deptEmail.length <= 0) {
        //    $("#spanDeptEmail").html('Department Email Address is required.');
        //    bool = false;
        //}
        //else
        if ((deptEmail.length > 0) && (!isEmail(deptEmail))) {
            $("#spanDeptEmail").html('Please enter valid Department Email Address');
            bool = false;
        }
        else {
            $("#spanDeptEmail").html('');
        }


        if (!bool) {
            return false;
        }
        else {
            storeDetails();
            window.location.href = '/draft/_partialSubmit';
        }
    });

    function validatePhone(txtPhone) {
        debugger;
        if (txtPhone.length < 13)
            return false;
        var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
        if (filter.test(txtPhone)) {
            return true;
        }
        else {
            return false;
        }
    }

    function storeDetails() {
        var certifydetailsRow = [];
        certifydetailsRow.push({
            Signername: $("#txtSignerName").val(),
            Signertitle: $("#txtSignerTitle").val(),
            Signerphone: $("#txtSignerPhone").val(),
            Signeremail: $("#txtSignerEmail").val(),

            DeptName: $("#txtDeptName").val(),
            DeptPerson: $("#txtDeptPerson").val(),
            DeptEmail: $("#txtDeptEmail").val(),
            DeptPhone: $("#txtDeptPhone").val()

        });
        sessionStorage.setItem('certifydetailsJson', JSON.stringify(certifydetailsRow));
    }
    /*Submit Section */

    $("#btn_submit_back").on('click', function (e) {
        window.history.back();
    });
    $('#btn_submit_next').on('click', function (e) {
        $(this).attr("disabled", "disabled");
        var bool = true;

        if (!bool) {
            return false;
        }
        else {
            debugger;            
            submitDetailstoDB();  // submit/ generate confirmation number
        }
    });

    function getSubmitDetails() {
        debugger;
        var vendorobj = JSON.parse(sessionStorage.getItem("vendordetailsJson"));

        var bankobj = JSON.parse(sessionStorage.getItem("bankdetailsJson"));
        var vendorNumber = sessionStorage.getItem('vendorNumber');

        if (!(vendorobj == null) || (vendorobj == 'undefined')) {
            $("#typeofApplication").val(vendorobj[0].ApplicationType);
            if ((vendorobj[0].VendorCode == null) || (vendorobj[0].VendorCode == '')) {
                $("#vendorCode").val('Not Available now');
                $("#payeeName").val('Not Available now');
            }
            else {
                $("#vendorCode").val(vendorobj[0].VendorCode);
                $("#payeeName").val(vendorobj[0].PayeeName);
            }
            $("#firstName").val(vendorobj[0].FirstName);
            $("#middleName").val(vendorobj[0].MiddleName);
            $("#lastName").val(vendorobj[0].LastName);
            $("#companyName").val(vendorobj[0].CompanyName);
            $("#aliasDBAName").val(vendorobj[0].AliasDBAName);
            $("#tin").val(vendorobj[0].TaxpayerID);
            $("#caseNo").val(vendorobj[0].CaseNo);
            //$("#ddNotificationEmail").html(vendorobj[0].ddNotificationEmail);
            $("#phoneNumber").val(vendorobj[0].PhoneNumber);

            vendorDetails.RequestType = vendorobj[0].ApplicationType;
            vendorDetails.VendorNumber = vendorobj[0].VendorCode;
            vendorDetails.VendorName = vendorobj[0].VendorCode;
            vendorDetails.PayeeName = vendorobj[0].PayeeName;
            vendorDetails.FirstName = vendorobj[0].FirstName;
            vendorDetails.MiddleName = vendorobj[0].MiddleName;
            vendorDetails.LastName = vendorobj[0].LastName;
            vendorDetails.CompanyName = vendorobj[0].CompanyName;
            vendorDetails.AliasDBAName = vendorobj[0].AliasDBAName;
            vendorDetails.Ssn = vendorobj[0].TaxpayerID;
            vendorDetails.CaseNo = vendorobj[0].CaseNo;
            vendorDetails.PhoneNumber = vendorobj[0].PhoneNumber;
        }

        if (!(bankobj == null) || (bankobj == 'undefined')) {
            if (bankobj[0].AccountType == "2")  // changed from 2 to 1
                $("#typeofAccount").val("Checking");
            else if (bankobj[0].AccountType == "1")
                $("#typeofAccount").val("Saving");
            $("#nameonbankAc").val(bankobj[0].NameonbankAc); 
            $("#accountNumber").val(bankobj[0].BankAccountNumber);
            $("#routingNumber").val(bankobj[0].BankRoutingNo);
            $("#finInsName").val(bankobj[0].FinancialIns);
            $("#ddNotificationEmail").val(bankobj[0].DDNotifyEmail);

            vendorDetails.AccountType = bankobj[0].AccountType;
            vendorDetails.NameOnBankAccount = bankobj[0].NameonbankAc;
            vendorDetails.BankAccountNumber = bankobj[0].BankAccountNumber;
            vendorDetails.BankRoutingNo = bankobj[0].BankRoutingNo;
            vendorDetails.FinancialIns = bankobj[0].FinancialIns;
            vendorDetails.DDNotifyEmail = bankobj[0].DDNotifyEmail;
        }
        debugger;
        var paymentJsonObj = JSON.parse(sessionStorage.getItem("paymentJson"));
        $.each(paymentJsonObj, function (key, value) {
            var s = '<div class="form-group">' +
                '<div class= "col-md-12" >' +
                '<span>' + value.VendorAddress + '</span>' +
                '</div >' +
                '</div >';
            $('#banklocations').append(s);
            //var bankDetl = {};
            //bankDetl.address = value.VendorAddress;

            var payDetails = {};
            payDetails.LocationID = value.LocationID;
            payDetails.Address1 = value.PaymentAddress1;
            payDetails.Address2 = value.PaymentAddress2;
            payDetails.City = value.PaymentCity;
            payDetails.State = value.PaymentState;
            payDetails.ZipCode = value.PaymentZipCode;

            LocationAddressList.push(payDetails);
            locationList.push(value.VendorAddress);
            bankDetails.push(value.LocationID);
        });

        var certifyobj = JSON.parse(sessionStorage.getItem("certifydetailsJson"));
        if (!(certifyobj == null) || (certifyobj == 'undefined')) {
            $("#signername").val(certifyobj[0].Signername);
            $("#signertitle").val(certifyobj[0].Signertitle);
            $("#signerphone").val(certifyobj[0].Signerphone);
            $("#signeremail").val(certifyobj[0].Signeremail);

            $("#deptName").val(certifyobj[0].DeptName);
            $("#deptPerson").val(certifyobj[0].DeptPerson);
            $("#deptEmail").val(certifyobj[0].DeptEmail);
            $("#deptPhone").val(certifyobj[0].DeptPhone);

            vendorDetails.Signername = certifyobj[0].Signername;
            vendorDetails.Signertitle = certifyobj[0].Signertitle;
            vendorDetails.Signerphone = certifyobj[0].Signerphone;
            vendorDetails.Signeremail = certifyobj[0].Signeremail;

            vendorDetails.DepartmentName = certifyobj[0].DeptName;
            vendorDetails.DepartmentContactName = certifyobj[0].DeptPerson;
            vendorDetails.DepartmentEmail = certifyobj[0].DeptEmail;
            vendorDetails.DepartmentContactNo = certifyobj[0].DeptPhone;
        }
        vendorDetails.VendorAttachmentFileName = sessionStorage.getItem('uploadedfile')
        vendorDetails.AttachmentFileName_ddwetform = sessionStorage.getItem('uploadedfile_ddwetform')

        $("#span_totalAttachment").val(2);
        $("#span_TypeofAttachment").html(sessionStorage.getItem('displaywetForm') + ', ' + sessionStorage.getItem('displayBankStatements'));  ///sessionStorage.getItem('Display_TypeofAttachments'));

        vendorDetails.LocationAddressList = LocationAddressList;
        vendorDetails.locationIDs = bankDetails;
        vendorDetails.locationAddressDescList = locationList;
        vendorDetails.User_agent = sessionStorage.getItem('userName');
    }

    function getSourceip() {
        $.getJSON("http://jsonip.appspot.com?callback=?",
            function (data) {
                return (data.ip);
            });
    }

    function formatDateDisplay(dateVal) {
        var newDate = new Date(dateVal);

        var sMonth = padValue(newDate.getMonth() + 1);
        var sDay = padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = padValue(newDate.getMinutes());
        var sSecond = padValue(newDate.getSeconds());
        var sAMPM = "AM";

        var iHourCheck = parseInt(sHour);

        if (iHourCheck > 12) {
            sAMPM = "PM";
            sHour = iHourCheck - 12;
        }
        else if (iHourCheck === 0) {
            sHour = "12";
        }

        sHour = padValue(sHour);

        return sMonth + "/" + sDay + "/" + sYear + " " + sHour + ":" + sMinute + ":" + sSecond + " " + sAMPM;
    }

    function padValue(value) {
        return (value < 10) ? "0" + value : value;
    }

    function submitDetailstoDB() {
        debugger;
        vendorDetails.SubmitFromWhere = "DRAFT";
        var venDetails = JSON.stringify(vendorDetails);
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/../api/values/SubmitVendorDD/",
            dataType: 'json',
            data: venDetails,
            headers: {
                'Authorization': 'Basic ' + btoa('admin')  // This method can be called before login,  so there wont be any security token created,  hense this by pass
            },
            success: function (data) {
                debugger;
                sessionStorage.setItem('confirmationNumber', data.data.Confirmation);
                sessionStorage.setItem('submittedDate', data.data.SubmitDateTime);
                vendorDetails.Confirmation = data.data.Confirmation;
                vendorDetails.SubmitDateTime = data.data.SubmitDateTime;
                sessionStorage.setItem('VendorReportFileName', data.data.VendorReportFileName);
                window.location.href = '/draft/_partialConfirmation';


                // generate the report and store in the upload folder
                //var uniqueDatetime = getUniqueFileNameusingCurrentTime();
                //vendorDetails.VendorReportFileName = "VCM_" + vendorDetails.Confirmation + "_" + uniqueDatetime + ".pdf";
                //createReportandGettheFielName(vendorDetails);
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in submission, Please check the entry!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };
    /*Submit Section end */

    /* certify*/
    //function getuserInfoForProxiedFields() {
    //    //$('#txtSignerTitle').val('asdfasdf');

    //    $.ajax({
    //        contentType: 'application/json; charset=utf-8',
    //        type: "POST",
    //        dataType: 'json',
    //        data: JSON.stringify({ 'UserId': sessionStorage.getItem('UserId') }),
    //        headers: {
    //            'Authorization': 'Basic ' + btoa('admin')
    //        },
    //        url: "/api/values/getUserProfileByUserId/",
    //        success: function (data) {
    //            debugger;
    //            $("#txtSignerName").val(data.data.userProfileList.FirstName + ' ' + data.data.userProfileList.LastName);
    //            //$("#txt_lastName").val();
    //            $("#txtSignerEmail").val(data.data.userProfileList.Email);
    //            $("#txtSignerPhone").val(data.data.userProfileList.PhoneNumber);
    //        },
    //        error: function (_XMLHttpRequest, textStatus, errorThrown) {
    //            if (_XMLHttpRequest.status == '401') {
    //                window.location.href = "/Home/UnAuthorized";
    //            }
    //        }
    //    });
    //}
    /**

    /*Confirmation Section begin */
    function createReportandGettheFielName(vendorDetails) {
        debugger;
        $.ajax({
            url: '/report/showreport/',
            type: "POST",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            //processData: false,
            data: JSON.stringify(vendorDetails),
            success: function (result) {
                debugger;
                $.ajax({
                    url: "/../api/values/InsertVendorReportFileName/",
                    type: "POST",
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(vendorDetails),
                    headers: {
                        'Authorization': 'Basic ' + btoa('admin')  // This method can be called before login,  so there wont be any security token created,  hense this by pass
                    },
                    success: function (result) {
                        debugger;
                        sessionStorage.setItem('VendorReportFileName', vendorDetails.VendorReportFileName)
                        window.location.href = '/draft/_partialConfirmation';
                        //return result;
                    },
                    error: function (err) {
                        alert('Report Error' + err.statusText);
                    }
                });
                // return result;
            },
            error: function (err) {
                debugger;
                alert('report error -' + err.statusText);
            }
        });
    }

    $('#btn_viewReport').on('click', function (e) {
        var url = "/Uploads/" + sessionStorage.getItem('VendorReportFileName');
        window.open(url, '_blank');
    });
    /*Confirmation Section end */
});