$(document).ready(function () {
    debugger;
    $("#liNavigation").show();
    $(".round-tab").css("border-color", "#e0e0e0");

    $("#img_vendor_step").attr('src', '/Content/Images/user_step_on.png');
    $("#img_info_step").attr('src', '/Content/Images/info_step.png');
    
    $("#img_vendor_step").addClass("active");
    $("#li_vendorstep").addClass("active");
    $("#li_vendorstep").removeClass("disabled");
    $("#img_vendor_step").parent().css("border-color", "#7030A0");
    $('#lbl_header').html('Vendor Information');

    // testing values
    if ($(location).attr('href').indexOf("local") > -1) {
        $("#txtApplicationType").val('1');
        $("#txtVendorCode").val('1');
        $("#txtPayeeName").val('1');
        $("#txtFirstName").val('1');
        $("#txtMiddleName").val('1');
        $("#txtLastName").val('1');
        $("#txtAliasDBAName").val('1');
        $("#txtCompanyName").val('1');
        $("#txtTIN").val('1');
        $("#txtCaseNo").val('1');
        $("#txtPhoneNumber").val('1');
    }
    // testing values

    $('#lbl_userName').text(sessionStorage.getItem('userName'));

    $('#btn_vendor_next').on('click', function (e) {
        debugger;
        var txtApplicationType = $("#txtApplicationType").val();
        var txtVendorCode = $("#txtVendorCode").val();
        var txtPayeeName = $("#txtPayeeName").val();
        var txtFirstName = $("#txtFirstName").val();
        var txtMiddleName = $("#txtMiddleName").val();
        var txtLastName = $("#txtLastName").val();
        var txtCompanyName = $("#txtCompanyName").val();
        var txtAliasDBAName = $("#txtAliasDBAName").val();
        var txtTIN = $("#txtTIN").val();
        var txtCaseNo = $("#txtCaseNo").val();
        var txtPhoneNumber = $("#txtPhoneNumber").val();
        sessionStorage.setItem('vendorNumber', $("#txtVendorCode").val());

        var bool = true;

        if (parseInt(txtApplicationType) <= 0) {
            $("#span_applicationType").html('Application Type is required.');
            bool = false;
        } else {
            $("#span_applicationType").html('');
        }

        //if (txtVendorCode.length <= 0) {
        //    $("#txtVendorCode").html('txtVendorCode Account Number is required.');
        //    bool = false;
        //} else {
        //    $("#txtVendorCode").html('');
        //}

        //if (txtPayeeName.length <= 0) {
        //    $("#span_payeeName").html('Payee Name is required.');
        //    bool = false;
        //} else {
        //    $("#span_payeeName").html('');
        //}

        if (txtFirstName.length <= 0) {
            $("#span_firstName").html('First Name is required.');
            bool = false;
        } else {
            $("#span_firstName").html('');
        }

        if (txtMiddleName.length <= 0)  {
            $("#span_middleName").html('Middle Name is required.');
            bool = false;
        } else {
            $("#span_middleName").html('');
        }

        if (txtLastName.length <= 0) {
            $("#span_lastName").html('Last Name is required.');
            bool = false;
        } else {
            $("#span_lastName").html('');
        }

        if (txtCompanyName.length <= 0) {
            $("#span_companyName").html('Company Name is required.');
            bool = false;
        } else {
            $("#span_companyName").html('');
        }

        if (txtAliasDBAName .length <= 0) {
            $("#span_aliasDBAName ").html('Alias / DBA Name  is required');
            bool = false;
        } else {
            $("#span_aliasDBAName ").html('');
        }

        if (txtTIN .length <= 0) {
            $("#span_tin").html('Tax Identification Number is required.');
            bool = false;
        } else {
            $("#span_tin").html('');
        }

        if (txtCaseNo.length <= 0) {
            $("#span_CaseNo").html('Case No is required.');
            bool = false;
        } else {
            $("#span_CaseNo").html('');
        }

        if (txtPhoneNumber.length <= 0) {
            $("#span_PhoneNumber").html('Phone Number.');
            bool = false;
        } else {
            $("#span_PhoneNumber").html('');
        }

        if (!bool) {
            return false;
        } else {
            storeDetails();
            window.location.href = '/draft/_partialLocations';
        }
    });

    function storeDetails() {
        debugger;
        var vendordetailsRow = [];

        var ApplicationType = '';
        var VendorCode = '';
        var PayeeName = '';
        if ($("#txtApplicationType").val().trim().length > 0) ApplicationType = $("#txtApplicationType").val();
        if ($("#txtVendorCode").val().trim().length > 0) VendorCode = $("#txtVendorCode").val();
        if ($("#txtPayeeName").val().trim().length > 0) PayeeName = $("#txtPayeeName").val();
        //if ($("#txtFirstName").val() FirstName
        //if ($("#txtMiddleName").val() MiddleName
        //if ($("#txtLastName").val() LastName
        //if ($("#txtCompanyName").val() CompanyName
        //if ($("#txtAliasDBAName").val() AliasDBAName
        //if ($("#txtTIN").val() TIN
        //if ($("#txtCaseNo").val() CaseNo
        //if ($("#txtPhoneNumber").val() PhoneNumber


        vendordetailsRow.push({
            ApplicationType: $("#txtApplicationType").val(),
            VendorCode: $("#txtVendorCode").val(),
            PayeeName: $("#txtPayeeName").val(),
            FirstName: $("#txtFirstName").val(),
            MiddleName: $("#txtMiddleName").val(),
            LastName: $("#txtLastName").val(),
            CompanyName: $("#txtCompanyName").val(),
            AliasDBAName: $("#txtAliasDBAName").val(),
            TIN: $("#txtTIN").val(),
            CaseNo: $("#txtCaseNo").val(),
            PhoneNumber: $("#txtPhoneNumber").val()
        });
        sessionStorage.setItem('vendordetailsJson', JSON.stringify(vendordetailsRow));
    };
})