$(document).ready(function () {
    debugger;
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
                        { 'data': 'RoutingNumber' },
                        { 'data': 'AcccountNo', "width": '12%' },
                        { 'data': 'AccountType' },
                        { 'data': 'RemittanceEmail' },
                        { 'data': 'Status', "width": '140px' }
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
                    }
                });

                var table = $('#ddGrid').DataTable();
                table.rows(function (idx, data, node) {
                    if (data.Status.toLowerCase() === 'pending') {  // direct deposit
                        $("#pendingMessage").text("Your request is currently pending review. Please allow up to 15 days to process the request.")
                        $('#btn_deposit_next').hide();
                        return false;
                    }
                });
            } else {  //  if show the Enter payment info screen and hide the location table
                $('#div_enterPaymentInfo').show();
                $('#div_location_grid').hide();
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
            var tblPay = $('#enterPaymentInfoGrid').DataTable();
            var j = 1;
            //
            tbl = $('#enterPaymentInfoGrid').DataTable();
            debugger;

            var data = $('#enterPaymentInfoGrid').DataTable().rows.data();

            data.each(function (value, index) {
                debugger
            });

            return;

            tbl.rows().every(function () {
                var data = this.data();
                var id = this.id();
            });
            return;

            $.each(tblPay.rows.data(), function () {
                paymentRows.push({
                    VendorNumber: vendorNumber,
                    VendorName: '',
                    LocationID: 'tmp-' + j,  //  temp loc id
                    Addressonly: true,
                    PaymentAddress: this["Address"],
                    PaymentCity: this["City"],
                    PaymentState: this["State"],
                    PaymentZip: this["Zipcode"],
                    RoutingNumber: '',
                    AcccountNo: '',
                    AccountType: '',
                    RemittanceEmail: '',
                    Status: '',
                });
                  j = j + 1;
            })
        }
        sessionStorage.setItem('paymentJson', JSON.stringify(paymentRows));
        window.location.href = '/draft/_partialBankDetails';
    
        //else if ($('#ddLocationAddressGrid').DataTable().data().count() > 0) {
        //    window.location.href = '/draft/_partialBankDetails';
        //}
       
    });

$('#btn_Location_add').on('click', function (e) {
    debugger;
    //if ( ($('#txtAddress1').val().trim().length == 0 && $('#txtAddress2').val().trim().length == 0) || $('#txtCity').val().trim().length == 0 || $('#txtState').val().trim().length == 0 || $('#txtZipCode').val().trim().length  == 0) {
    //    toastr.options.positionClass = "toast-bottom-right";
    //    toastr.warning("Please enter the complete address to Continue!");
    //    return;
    //}

    var tbl = $('#ddLocationAddressGrid').DataTable();  //enterPaymentInfoGrid
    tbl.row.add({
        "": true,
        "": paymentSrNumber,
        "CombinedAddress": $('#txtAddress1').val() + ' ' + $('#txtAddress2').val()
        , "Address": $('#txtAddress1').val() + ' ' + $('#txtAddress2').val()
        , "City": $('#txtCity').val()
        , "State": $('#txtState').val()
        , "Zipcode": $('#txtZipCode').val()
    }).draw(false);

    paymentSrNumber++;
});

$('#btn_Location_reset').on('click', function (e) {
    debugger;
    $('#txtAddress1').val('');
    $('#txtAddress2').val('');
    $('#txtCity').val('');
    $('#txtState').val('');
    $('#txtZipCode').val('');
});

    $('#ddLocationAddressGrid').dataTable({
        responsive: true,
        columns: [   
            { 'data': '' },
            { 'data': '' },
            { 'data': 'CombinedAddress' },
            { 'data': 'Address' },
            { 'data': 'City' },
            { 'data': 'State' },
            { 'data': 'Zipcode' }
        ],
        columnDefs: [
            {
                searchable: true,
                width: '3%',
                targets: 0,
                data: true,
                defaultContent: '',
                orderable: false,               
               // className: 'select-checkbox',
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" class="selected">';
                }
            },
        ],

        //'rowCallback': function (row, data, dataIndex) {
        //    // Get row ID
        //    var rowId = data[0];

        //    // If row ID is in the list of selected row IDs
        //    if ($.inArray(rowId, rows_selected) !== -1) {
        //        $(row).find('input[type="checkbox"]').prop('checked', true);
        //        $(row).addClass('selected');
        //    }
        //},
        select: {
            style: 'multi',
            selector: 'td:first-child'
        }
    });
});