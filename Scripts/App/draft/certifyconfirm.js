$(document).ready(function () {
    var vendorDetails = {};
    //var bankDetails = {};
    var bankDetails = new Array();
    var locationList = new Array();

    $("#img_info_step").parent().css("border-color", "#7030A0");
    $('#lbl_userName').text(sessionStorage.getItem('userName'));
    var vendorNumber = sessionStorage.getItem('vendorNumber');

    $("#liNavigation").show();
    $(".round-tab").css("border-color", "#e0e0e0");

    //$(".nav li").removeClass("active");
    if ($(location).attr('href').indexOf("_partialCertify") > -1) {

        $('#txtSignerPhone').mask('(000)000-0000');
        $('#txtDeptPhone').mask('(000)000-0000');

        $("#img_info_step").attr('src', '/Content/Images/info_step.png');
        $("#img_bank_verify_step").attr('src', '/Content/Images/info_step.png');
        $("#img_certify_step").attr('src', '/Content/Images/certify_step_on.png');
        $("#img_certify_step").addClass("active");
        $("#li_certify_step").addClass("active");
        $("#img_certify_step").parent().css("border-color", "#7030A0");
        $('#lbl_header').html('Certify');

        $("#span_bankstep").removeClass("disabled");
        $("#span_attachmentstep").removeClass("disabled");
        $("#span_verify_step").removeClass("disabled");

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

        if (sessionStorage.getItem('deptUser') == false) {
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

        if (signerName.length <= 0) {
            $("#signerName").html('Authorized Signer’s Name is required.');
            bool = false;
        } else {
            $("#signerName").html('');
        }

        if (signerTitle.length <= 0) {
            $("#signerTitle").html('Authorized Signer’s Title is required.');
            bool = false;
        } else {
            $("#signerTitle").html('');
        }
        debugger;
        if (signerPhone.length <= 0) {
            $("#signerPhone").html('Authorized Signer’s Phone # is required.');
            bool = false;
        } else if (!validatePhone(signerPhone)) {
            $("#signerPhone").html('Valid Authorized Signer’s Phone # is required.');
            bool = false;
        } else {
            $("#signerPhone").html('');
        }

        if (signerEmail.length <= 0) {
            $("#signerEmail").html('Authorized Signer’s Email is required.');
            bool = false;
        }
        else if (!isEmail(signerEmail)) {
            $("#signerEmail").html('Please enter valid Email address');
            bool = false;
        }
        else {
            $("#signerEmail").html('');
        }


        if (deptName.length <= 0) {
            $("#spanDeptName").html('Department Name is required.');
            bool = false;
        } else {
            $("#spanDeptName").html('');
        }

        if (deptPerson.length <= 0) {
            $("#spanDeptPerson").html('Department Contact Person Name is required.');
            bool = false;
        } else {
            $("#spanDeptPerson").html('');
        }
        debugger;
        if (deptPhone.length <= 0) {
            $("#spanDeptPhone").html('Department Contact Number is required.');
            bool = false;
        } else if (!validatePhone(deptPhone)) {
            $("#spanDeptPhone").html('Valid Department Contact Number is required.');
            bool = false;
        } else {
            $("#spanDeptPhone").html('');
        }

        if (deptEmail.length <= 0) {
            $("#spanDeptEmail").html('Department Email Address is required.');
            bool = false;
        }
        else if (!isEmail(deptEmail)) {
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

        //$("#vendorname").html(vendorNumber);
        //$("#payeename").html(sessionStorage.getItem('userName'));
        //$("#ssn").html(sessionStorage.getItem('tin'));
        //vendorDetails.vendorname = vendorNumber;
        //vendorDetails.payeename = sessionStorage.getItem('userName');
        //vendorDetails.ssn = sessionStorage.getItem('tin');

        if (!(vendorobj == null) || (vendorobj == 'undefined')) {
            $("#typeofApplication").html(vendorobj[0].ApplicationType);
            $("#vendorCode").html(vendorobj[0].VendorCode);
            $("#payeeName").html(vendorobj[0].PayeeName);
            $("#firstName").html(vendorobj[0].FirstName);
            $("#middleName").html(vendorobj[0].MiddleName);
            $("#lastName").html(vendorobj[0].LastName);
            $("#companyName").html(vendorobj[0].CompanyName);
            $("#aliasDBAName").html(vendorobj[0].AliasDBAName);
            $("#tin").html(vendorobj[0].TIN);
            $("#caseNo").html(vendorobj[0].CaseNo);
            //$("#ddNotificationEmail").html(vendorobj[0].ddNotificationEmail);
            $("#phoneNumber").html(vendorobj[0].PhoneNumber);

            vendorDetails.RequestType = vendorobj[0].ApplicationType;
            vendorDetails.VendorNumber = vendorobj[0].VendorCode;
            vendorDetails.VendorName = vendorobj[0].VendorCode;
            vendorDetails.PayeeName = vendorobj[0].PayeeName;
            vendorDetails.FirstName = vendorobj[0].FirstName;
            vendorDetails.MiddleName = vendorobj[0].MiddleName;
            vendorDetails.LastName = vendorobj[0].LastName;
            vendorDetails.CompanyName = vendorobj[0].CompanyName;
            vendorDetails.AliasDBAName = vendorobj[0].AliasDBAName;
            vendorDetails.Ssn = vendorobj[0].TIN;
            vendorDetails.CaseNo = vendorobj[0].CaseNo;
            //vendorDetails.DDNotificationEmail = vendorobj[0].
            vendorDetails.PhoneNumber = vendorobj[0].PhoneNumber;
        }

        if (!(bankobj == null) || (bankobj == 'undefined')) {
            if (bankobj[0].AccountType == "1")
                $("#typeofAccount").html("Checking");
            else if (bankobj[0].AccountType == "2")
                $("#typeofAccount").html("Saving");
            //$("#typeofAccount").html(bankobj[0].AccountType);
            $("#accountNumber").html(bankobj[0].BankAccountNumber);
            $("#routingNumber").html(bankobj[0].BankRoutingNo);
            $("#finInsName").html(bankobj[0].FinancialIns);
            $("#ddNotificationEmail").html(bankobj[0].DDNotifyEmail);

            vendorDetails.AccountType = bankobj[0].AccountType;
            vendorDetails.BankAccountNumber = bankobj[0].BankAccountNumber;
            vendorDetails.BankRoutingNo = bankobj[0].BankRoutingNo;
            vendorDetails.FinancialIns = bankobj[0].FinancialIns;
            vendorDetails.DDNotifyEmail = bankobj[0].DDNotifyEmail;
        }
        var paymentJsonObj = JSON.parse(sessionStorage.getItem("paymentJson"));
        $.each(paymentJsonObj, function (key, value) {
            var s = '<div class="form-group">' +
                '<div class= "col-md-12" >' +
                '<span>' + value.VendorAddress + '</span>' +
                '</div >' +
                '</div >';
            $('#banklocations').append(s);
            var bankDetl = {};
            bankDetl.address = value.VendorAddress;
            locationList.push(value.VendorAddress);
            bankDetails.push(value.LocationID);
        });

        var certifyobj = JSON.parse(sessionStorage.getItem("certifydetailsJson"));
        if (!(certifyobj == null) || (certifyobj == 'undefined')) {
            $("#signername").html(certifyobj[0].Signername);
            $("#signertitle").html(certifyobj[0].Signertitle);
            $("#signerphone").html(certifyobj[0].Signerphone);
            $("#signeremail").html(certifyobj[0].Signeremail);

            $("#deptName").html(certifyobj[0].DeptName);
            $("#deptPerson").html(certifyobj[0].DeptPerson);
            $("#deptEmail").html(certifyobj[0].DeptEmail);
            $("#deptPhone").html(certifyobj[0].DeptPhone);

            vendorDetails.Signername = certifyobj[0].Signername;
            vendorDetails.Signertitle = certifyobj[0].Signertitle;
            vendorDetails.Signerphone = certifyobj[0].Signerphone;
            vendorDetails.Signeremail = certifyobj[0].Signeremail;

            vendorDetails.DeptName = certifyobj[0].DeptName;
            vendorDetails.DeptPerson = certifyobj[0].DeptPerson;
            vendorDetails.DeptEmail = certifyobj[0].DeptEmail;
            vendorDetails.DeptPhone = certifyobj[0].DeptPhone;
        }

        //vendorDetails.Confirmation = "";
        //vendorDetails.SubmitDateTime = new Date();
        vendorDetails.VendorAttachmentFileName = sessionStorage.getItem('uploadedfile')
        vendorDetails.AttachmentFileName_ddwetform = sessionStorage.getItem('uploadedfile_ddwetform')

        $("#span_totalAttachment").html(2);
        $("#span_TypeofAttachment").html(sessionStorage.getItem('Display_TypeofAttachments'));

        //var uniqueFileName = getUniqueFileNameusingCurrentTime();
        //vendorDetails.VendorReportFileName = uniqueFileName + "_" + vendorNumber + "_VendorReport.pdf";

        vendorDetails.locationIDs = bankDetails;
        vendorDetails.locationAddressDescList = locationList;

        vendorDetails.Source_ip = "Source_ip";//getSourceip();
        vendorDetails.Source_device = "Source_device";
        vendorDetails.User_agent = navigator.userAgent;
        vendorDetails.Host_headers = "Host_headers";
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
                // generate the report and store in the upload folder

                var uniqueDatetime = getUniqueFileNameusingCurrentTime();
                vendorDetails.VendorReportFileName = "VCM_" + vendorDetails.Confirmation + "_" + uniqueDatetime + ".pdf";
              //  temporary until api side report fix to do createReportandGettheFielName(vendorDetails);
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
        //var url = '../Home/GetPDF?fileName=' + FileName;
        var url = "/Uploads/" + sessionStorage.getItem('VendorReportFileName');
        // $("#filelink").attr("href", "/Uploads/" + sessionStorage.getItem('VendorReportFileName'));
        window.open(url, '_blank');
    });
    /*Confirmation Section end */
});