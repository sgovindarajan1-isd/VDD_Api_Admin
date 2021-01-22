$(document).ready(function () {
    if (sessionStorage.getItem('userName') == null || sessionStorage.getItem('userName') == '') {
        window.location.href = "/Home/Index";
        return;
    }

    $("#liNavigation").show();
    $(".round-tab").css("border-color", "#e0e0e0");

    $("#img_vendor_step").attr('src', '/Content/Images/user_step_on.png');
    $("#img_info_step").attr('src', '/Content/Images/info_step.png');

    $("#img_vendor_step").addClass("active");
    $("#li_vendorstep").addClass("active");
    $("#li_vendorstep").removeClass("disabled");
    $("#img_vendor_step").parent().css("border-color", "#7030A0");
    $('#lbl_header').html('Vendor Information');
    $('#txtPhoneNumber').mask('(000)000-0000');

    // testing values
    if ($(location).attr('href').indexOf("local") > -1) {
        $("#txtApplicationType").val('1');
        $("#txtVendorCode").val('');
        $("#txtFirstName").val('Firstname');
        $("#txtMiddleName").val('MiddleName');
        $("#txtLastName").val('LastName');
        $("#txtAliasDBAName").val('Alias Name');
        $("#txtCompanyName").val('Company Name');
        $("#txtTIN").val('123456789');
        $("#txtCaseNo").val('Case no');
        $("#txtPhoneNumber").val('(562)-331-0000');
    }
    // testing values

    $("#txtVendorCode").focusout(function () {
        if ($("#txtVendorCode").val().trim().length > 0) {
            GetVendorNameByVendorCode($("#txtVendorCode").val());
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
                $("#txtPayeeName").val(data.data.VendorName);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#txtPayeeName").val("No Payee Name found");
            }
        });
    };

    $('#id_userName').text(sessionStorage.getItem('userName'));

    $("#txtFirstName").focusout(function (e) {
        $("#txtCompanyName").val('');
    });

    $("#txtMiddleName").focusout(function (e) {
        $("#txtCompanyName").val('');
    });

    $("#txtLastName").focusout(function (e) {
        $("#txtCompanyName").val('');
    });

    $("#txtCompanyName").focusout(function (e) {
        if ($("#txtCompanyName").val().length > 0) {
            $("#txtFirstName").val('');
            $("#txtMiddleName").val('');
            $("#txtLastName").val('');
        }
    });


    $('#btn_vendor_next').on('click', function (e) {
        var txtApplicationType = $("#txtApplicationType").val();  //  to get selected text  $("#txtApplicationType option:selected").text();
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

        if (txtVendorCode.length <= 0) {  // if vendor code avaialbe no needed to check
            debugger;
            var someNameAvailable = false;
            if ((txtFirstName.length > 0) || (txtMiddleName.length > 0) || (txtLastName.length > 0)) {
                someNameAvailable = true;
            }

            if (((txtFirstName.length <= 0) && (txtCompanyName.length <= 0)) || ((txtFirstName.length <= 0) && ((txtMiddleName.length > 0) || (txtLastName.length > 0)))) {
                $("#span_firstName").html('First Name is required.');
                bool = false;
            } else {
                $("#span_firstName").html('');
            }

            if ((txtLastName.length <= 0) && ((txtFirstName.length > 0) || (txtMiddleName.length > 0))) {
                $("#span_lastName").html('Last Name is required.');
                bool = false;
            } else {
                $("#span_lastName").html('');
            }

            if ((someNameAvailable == false) && (txtCompanyName.length <= 0)) {
                $("#span_companyName").html('Company Name is required.');
                bool = false;
            } else {
                $("#span_companyName").html('');
            }

        }

        if (!bool) {
            return false;
        } else {
            storeDetails();
            window.location.href = '/draft/_partialLocations';
        }
    });

    function storeDetails() {
        var vendordetailsRow = [];

        var ApplicationType = '';
        var VendorCode = '';
        var PayeeName = '';
        if ($("#txtApplicationType").val().trim().length > 0) ApplicationType = $("#txtApplicationType option:selected").text();
        if ($("#txtVendorCode").val().trim().length > 0) {
            VendorCode = $("#txtVendorCode").val();
        }
        else {
            VendorCode = '';
        }

        if ($("#txtPayeeName").val().trim().length > 0) PayeeName = $("#txtPayeeName").val();

        vendordetailsRow.push({
            ApplicationType: $("#txtApplicationType option:selected").text(),
            VendorCode: VendorCode,
            PayeeName: $("#txtPayeeName").val(),
            FirstName: $("#txtFirstName").val(),
            MiddleName: $("#txtMiddleName").val(),
            LastName: $("#txtLastName").val(),
            CompanyName: $("#txtCompanyName").val(),
            AliasDBAName: $("#txtAliasDBAName").val(),
            TaxpayerID: $("#txtTIN").val(),
            CaseNo: $("#txtCaseNo").val(),
            PhoneNumber: $("#txtPhoneNumber").val()
        });
        sessionStorage.setItem('vendordetailsJson', JSON.stringify(vendordetailsRow));
    };
})