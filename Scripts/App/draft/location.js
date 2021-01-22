$(document).ready(function () {
    debugger;
    $('#menu_loggedinasUserName').text("Logged in as " + sessionStorage.getItem('userName'));
    $('#menu_loggedinasUserName').css("display", "block");

    $('#liNavigation').show();
    $('#div_enterPaymentInfo').hide();
    $('.round-tab').css("border-color", "#e0e0e0");

    $('#img_vendor_step').attr('src', '/Content/Images/user_step.png');
    $("#img_info_step").attr('src', '/Content/Images/info_step_on.png');


    $("#img_info_step").addClass("active")
    $('#li_infostep').addClass("active");
    $('#li_infostep').removeClass("disabled");
    $("#img_info_step").parent().css("border-color", "#7030A0");

    $('#lbl_userName').text(sessionStorage.getItem('userName'));
    var vendorNumber = sessionStorage.getItem('vendorNumber');
    $('#lbl_header').html('Payment Information');
    var paymentSrNumber = 1;

    function validateNumber(event) {
        var key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46) {
            return true;
        } else if (key < 48 || key > 57) {
            return false;
        } else {
            return true;
        }
    };
    $("#div_spinner").addClass('loader');

    $('#txtZipCode').keypress(validateNumber);

    $.ajax({
        contentType: 'application/json; charset=utf-8',
        type: "POST",
        dataType: 'json',
        data: JSON.stringify({ 'vendorNumber': vendorNumber }),  // 'payeeId': payeeId 
        headers: {
            'Authorization': 'Basic ' + btoa('admin')  // This method can be called before login,  so there wont be any security token created,  hense this by pass
        },
        url: "/../api/values/GetVendorDetailsByName/",
        success: function (data) {
            $("#div_spinner").removeClass('loader');

            debugger;
            $('#div_location_grid').show();
            $('#div_enterPaymentInfo').hide();
            if (data.data.vendorlst.length > 0) {  //vendorcode exists and address info  exists){
                $('#ddGrid').dataTable({
                    responsive: true,
                    data: data.data.vendorlst,
                    columns: [
                        { 'data': '' },
                        { 'data': 'VendorAddress' },
                        {
                            'data': 'RoutingNumber',
                            "render": function (data, type, row, meta) {
                                //if (row.Status === 'Approved') {
                                    // data = '******' + row.AcccountNo.substr(row.AcccountNo.length - 4);  //'Masked';
                                  if (( data !=null) && (data !=''))
                                    data = '******' + data.substr(data.length - 4);  //'Masked';
                                //}
                                return data;
                            }
                        },
                        {
                            'data': 'AcccountNo',
                            "render": function (data, type, row, meta) {
                                //if (row.Status === 'Approved') {
                                    // data = '******' + row.AcccountNo.substr(row.AcccountNo.length - 4);  //'Masked';
                                if ((data != null) && (data != ''))
                                    data = '******' + data.substr(data.length - 4);  //'Masked';
                                //}
                                return data;
                            }

                            , "width": '12%'
                        },
                        {
                            'data': 'AccountType',
                            "render": function (data, type, row, meta) {
                                if (row.AccountType === '1') {
                                    data = 'Checking';
                                }
                                else if (row.AccountType === '2') {
                                    data = 'Savings';
                                }
                                return 'Not Available';
                            }
                        },
                        { 'data': 'RemittanceEmail' },
                        {
                            'data': 'Status', "width": '140px', 'className': 'payment-status-color'
                        }
                    ],

                    columnDefs: [
                        {
                            searchable: true,
                            width: '3%',
                            targets: 0,
                            data: null,
                            defaultContent: '',
                            orderable: false,
                            className: 'select-checkbox',
                        },
                    ],
                    select: {
                        style: 'multi',
                        selector: 'td:first-child'
                    },
                    "createdRow": function (row, data, dataIndex) {
                         if (data.Status.toLowerCase() === 'pending') {
                        //if (data.Status.toLowerCase() === 'new') {
                            $(row).css('background-color', 'lightgrey');
                            $('td', row).removeClass('select-checkbox');
                        }
                    }
                });

                var table = $('#ddGrid').DataTable();
                var someRowsArePending = false;
                table.rows(function (idx, data, node) {
                    if (data.Status.toLowerCase() === 'pending') {  // direct deposit    "pending" replaced as new
                        someRowsArePending = true;
                        return true;
                    }
                });

                if (someRowsArePending) {
                    $("#pendingMessage").text("You currently have a request that is pending review. Please allow up to 20 days to process the request.")
                    $('#btn_deposit_next').hide();
                }

            } else {  //  if show the Enter payment info screen and hide the location table
                $('#div_enterPaymentInfo').show();
                $('#div_location_grid').hide();

                //incase of coming back,  populate from session
                debugger;
                var paymentObj = JSON.parse(sessionStorage.getItem("paymentJson"));

                if (!(paymentObj == null) || (paymentObj == 'undefined')) {
                    var tbl = $('#ddLocationAddressGrid').DataTable();  //enterPaymentInfoGrid

                    paymentSrNumber = 1
                    for (var i = 0; i < paymentObj.length; i++) {
                        tbl.row.add({
                            "": true,
                            "": paymentSrNumber,
                            "Address": paymentObj[i].VendorAddress
                            , "Address1": paymentObj[i].PaymentAddress1
                            , "Address2": paymentObj[i].PaymentAddress2
                            , "City": paymentObj[i].PaymentCity
                            , "State": paymentObj[i].PaymentState
                            , "Zipcode": paymentObj[i].PaymentZipCode
                        }).draw(false);

                        paymentSrNumber++;
                    }
                }
                //END incase of coming back,  populate from session
            }
        },
        error: function (_XMLHttpRequest, textStatus, errorThrown) {
            if (_XMLHttpRequest.status == '401') {
                window.location.href = "/Home/UnAuthorized";
            }
        }
    });

    $('#btn_location_back').on('click', function (e) {
        window.history.back();
    });

    $('#btn_location_next').on('click', function (e) {
        debugger;
        var paymentRows = [];
        var table = $('#ddGrid').DataTable();

        if ($("#ddGrid").is(":visible")) {
            // if (table.rows().data().length > 0) {
            if (table.rows('.selected').any()) {
                $.each(table.rows('.selected').data(), function () {
                    paymentRows.push({
                        VendorNumber: this["VendorNumber"],
                        VendorName: this["VendorName"],
                        LocationID: this["LocationID"],
                        VendorAddress: this["VendorAddress"],
                        RoutingNumber: this["RoutingNumber"],
                        AcccountNo: this["AcccountNo"],
                        AccountType: this["AccountType"],
                        RemittanceEmail: this["RemittanceEmail"],
                        Status: this["Status"],
                    });
                })
            }
            else {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Please select atleast one Address to Continue!");
            }
        }
        else {
            var j = 1;
            var tbl = $('#ddLocationAddressGrid').DataTable();

            tbl.rows().every(function () {
                var data = this.data();
                paymentRows.push({
                    VendorNumber: vendorNumber,
                    VendorName: '',
                    LocationID: 'tmp-' + j,  //  temp loc id
                    Addressonly: true,
                    VendorAddress: data.Address1 + ' ' + data.Address2 + ' ' + data.City + ' ' + data.State + ' ' + data.Zipcode,
                    PaymentAddress1: data.Address1, //this["Address"],
                    PaymentAddress2: data.Address2,
                    PaymentCity: data.City,
                    PaymentState: data.State,
                    PaymentZipCode: data.Zipcode,
                    RoutingNumber: '',
                    AcccountNo: '',
                    AccountType: '',
                    RemittanceEmail: '',
                    Status: '',
                });
                j = j + 1;
            })
        }

        debugger;
        if (paymentRows.length > 0) {
            sessionStorage.setItem('paymentJson', JSON.stringify(paymentRows));
            window.location.href = '/draft/_partialBankDetails';
        }
    });

    $('#btn_Location_add').on('click', function (e) {
        debugger;
        if (($('#txtAddress1').val().trim().length == 0 && $('#txtAddress2').val().trim().length == 0) || $('#txtCity').val().trim().length == 0 || $('#txtState').val().trim().length == 0 || $('#txtZipCode').val().trim().length == 0) {
            toastr.options.positionClass = "toast-bottom-right";
            toastr.warning("Please enter the complete address to Continue!");
            return;
        }

        var tbl = $('#ddLocationAddressGrid').DataTable();  //enterPaymentInfoGrid
        tbl.row.add({
            "": true,
            "": paymentSrNumber,
            "Address": $('#txtAddress1').val() + ' ' + $('#txtAddress2').val() + ' ' + $('#txtCity').val() + ' ' + $('#txtState').val() + ' ' + $('#txtZipCode').val()
            , "Address1": $('#txtAddress1').val()
            , "Address2": $('#txtAddress2').val()
            , "City": $('#txtCity').val()
            , "State": $('#txtState').val()
            , "Zipcode": $('#txtZipCode').val()
        }).draw(false);

        paymentSrNumber++;
        $('#txtAddress1').val('');
        $('#txtAddress2').val('');
        $('#txtCity').val('');
        $('#txtState').val('');
        $('#txtZipCode').val('');
    });

    $('#btn_Location_reset').on('click', function (e) {
        debugger;
        $('#txtAddress1').val('');
        $('#txtAddress2').val('');
        $('#txtCity').val('');
        $('#txtState').val('');
        $('#txtZipCode').val('');
    });

    $('#ddLocationAddressGrid').on('click', '.locDelete', function () {
        debugger;
        $('#ddLocationAddressGrid').DataTable()
            .row($(this).parents('tr'))
            .remove()
            .draw();
    });

    $('#ddLocationAddressGrid').dataTable({
        responsive: true,
        searching: false,
        paging: false,
        columns: [
            //{ 'data': '' },
            { 'data': '', title: "#" },
            { 'data': 'Address' },
            { 'data': 'Address1' },
            { 'data': 'Address2' },
            { 'data': 'City' },
            { 'data': 'State' },
            { 'data': 'Zipcode' }
            , {
                "data": null,
                "render": function (data, type, row) {
                    return '<a class="btn btn-primary locDelete"> <span class="fa fa-trash-o"></span> Delete </a>';    //btn-group-xs nonFormSubmit unlinkBtn
                },
                'title': ""
            }
        ],
        columnDefs: [
            { "width": "2px", "targets": [0] },
            { "visible": false, "targets": [2, 3, 4, 5, 6] },
            { "width": "2px", "targets": [7] },
        ],



        select: {
            style: 'multi',
            selector: 'td:first-child'
        }
    });
});