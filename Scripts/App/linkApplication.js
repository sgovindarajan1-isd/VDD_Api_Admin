$(document).ready(function () {
    debugger;
    var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');

    $("#menu_linkApplication").click(function () {
        debugger;
        var vendorNumber = sessionStorage.getItem('selectedVendorNumber');
        var bankAccountNumber = sessionStorage.getItem('selectedBankAccountNumber');
        GetAvailableApplicationLinkByConfirmationNum(confirmationNum, vendorNumber, bankAccountNumber);
        GetAlreadyLinkedApplicationByConfirmationNum(confirmationNum);

    });
    var userId = sessionStorage.getItem('UserId');

  
    $('#ddAvailableLinkGrid').on('click', 'tbody tr', function () {
        sessionStorage.setItem('selectedConfirmationNumber', $('#ddAvailableLinkGrid').DataTable().row(this).data().Confirmation);
        sessionStorage.setItem('selectedRequestType', $('#ddAvailableLinkGrid').DataTable().row(this).data().RequestType);
    });
    function setAvaiableApplicationData(data) {
        $('#ddAvailableLinkGrid').DataTable().destroy();
        $('#ddAvailableLinkGrid').empty();
        $('#ddAvailableLinkGrid').dataTable({
            responsive: true,
            searching: false,
            paging: false,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "Confirmation",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            //data = '<a href="applicationSummary">' + data + ' - ' + row.RequestType + ' </a>';
                            data = '<a href="applicationSummary">' + row.RequestType + ' - ' + data + ' </a>';
                        }

                        return data;
                    },
                    "title": "Application", 
                },
                { 'data': 'VendorNumber', "title": "Vendor Number" },
                { 'data': 'Payeename', "title": "Vendor Name" },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        return '<a class="btn btn-primary btn-group-xs nonFormSubmit linkBtn"> <span class="fa fa-link"></span> Link </a>';
                        //    +'<a class="btn btn-danger confirmModal" > <span class="fa fa-trash"></span>Dismiss</a>';
                    },
                    'title': "Action"
                }
            ],

            columnDefs: [
                { "width": "20%", "targets": [0, 1] },
                { "width": "50%", "targets": [2] },
                { "width": "10%", "targets": [3] },
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

    $('#ddAlreadyLinkedGrid').on('click', 'tbody tr', function () {
        sessionStorage.setItem('selectedConfirmationNumber', $('#ddAlreadyLinkedGrid').DataTable().row(this).data().Linked_ConfirmationNum);
        sessionStorage.setItem('selectedRequestType', $('#ddAlreadyLinkedGrid').DataTable().row(this).data().RequestType);
    });
    function setAlreadyLinkedApplicationData(data) {
        $('#ddAlreadyLinkedGrid').DataTable().destroy();
        $('#ddAlreadyLinkedGrid').empty();
        $('#ddAlreadyLinkedGrid').dataTable({
            responsive: true,
            searching: false,
            paging: false,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "Linked_ConfirmationNum",
                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            //data = '<a href="applicationSummary">' + data + ' - ' + row.RequestType + ' </a>';
                            data = '<a href="applicationSummary">' + row.RequestType + ' - ' + data + ' </a>';
                        }

                        return data;
                    },
                    "title": "Application",
                },
                { 'data': 'VendorNumber', "title": "Vendor Number" },
                { 'data': 'Payeename', "title": "Vendor Name" },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        return '<a class="btn btn-primary btn-group-xs nonFormSubmit unlinkBtn"> <span class="fa fa-trash-o"></span> UnLink </a>';
                    },
                    'title': "Action"
                }
            ],

            columnDefs: [
                { "width": "20%", "targets": [0, 1] },
                { "width": "50%", "targets": [2] },
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

    function GetAvailableApplicationLinkByConfirmationNum(confirmationNum, vendorNumber, bankAccountNumber) {
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'Confirmation': confirmationNum, 'VendorNumber': vendorNumber, 'BankAccountNumber': bankAccountNumber  //'Payeename': vendorName,
                //'Confirmation': '1FEGJF', 'VendorNumber': '505653', 'BankAccountNumber': '66112342'
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetAvailableApplicationLinkByConfirmationNum/",
            success: function (data) {
                debugger;
                //$("#span_countPendingAssignment").text(data.data.pendingAssignmentList.length); //sessionStorage.getItem("totalApplicationPendingCount"));
                //$("#span_appPendingOver60Days").text(sessionStorage.getItem("totalPendingMyApprovalCountOver60"));
                //$("#span_countPendingMyApproval").text(data.data.pendingMyApprovalList.length);//sessionStorage.getItem("totalPendingMyApprovalCount"));

                setAvaiableApplicationData(data.data.Available_ApplicationLinks);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }
    function GetAlreadyLinkedApplicationByConfirmationNum(confirmationNum) {
        debugger;
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
                debugger;
                $("#menuLinkAppCount").text(data.data.linkedApplication.length);
                setAlreadyLinkedApplicationData(data.data.linkedApplication);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }
       
    function UpdateLink_UnLink_ApplicationByConfirmationNum(confirmationNum, link_to_ConfirmationNum, userID, link_unlink) {
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'ConfirmationNum': confirmationNum, 'Link_ConfirmationNum': link_to_ConfirmationNum, 'Action': link_unlink , 'LastUpdatedUser': userID
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/UpdateLink_UnLink_ApplicationByConfirmationNum/",
            success: function (data) {
                debugger;

                var vendorNumber = sessionStorage.getItem('selectedVendorNumber');
                var bankAccountNumber = sessionStorage.getItem('selectedBankAccountNumber');
                GetAvailableApplicationLinkByConfirmationNum(confirmationNum, vendorNumber, bankAccountNumber);
                GetAlreadyLinkedApplicationByConfirmationNum(confirmationNum);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    $('#ddAvailableLinkGrid').on('click', '.linkBtn', function () {
        var RowIndex = $(this).closest('tr');
        var table = $('#ddAvailableLinkGrid').DataTable();
        var data1 = table.row(RowIndex).data();

        var link_to_ConfirmationNum = data1.Confirmation;
        var userId = sessionStorage.getItem('UserId');
        UpdateLink_UnLink_ApplicationByConfirmationNum(confirmationNum, link_to_ConfirmationNum, userId, 'LINK')
    });

    $('#ddAlreadyLinkedGrid').on('click', '.unlinkBtn', function () {
        debugger;
        var RowIndex = $(this).closest('tr');
        var table = $('#ddAlreadyLinkedGrid').DataTable();
        var data = table.row(RowIndex).data();

        var unlink_to_ConfirmationNum = data.Linked_ConfirmationNum;
        var userId = sessionStorage.getItem('UserId');
        UpdateLink_UnLink_ApplicationByConfirmationNum(confirmationNum, unlink_to_ConfirmationNum, userId, 'UNLINK')
    });
});