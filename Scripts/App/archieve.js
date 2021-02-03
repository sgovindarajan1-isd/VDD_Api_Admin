$(document).ready(function () {
    var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
    GetArchieveDocuments(confirmationNum);


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

    $('#ddArchieveGrid').on('click', '.clsdownload', function (e) {
        var closestRow = $(this).closest('tr');
        var data = $('#ddArchieveGrid').DataTable().row(closestRow).data();

        //download_file("/Uploads/58202010105_SP8313_VC.png", "58202010105_SP8313_VC.png"); //call function
        download_file("/Uploads/" + data.AttachmentFileName, data.AttachmentFileName); //call function

    });

    $('#ddArchieveGrid').on('click', '.clsRestoreArchieve', function (e) {
        var closestRow = $(this).closest('tr');
        var data = $('#ddArchieveGrid').DataTable().row(closestRow).data();

        var confirmationNumber = sessionStorage.getItem('selectedConfirmationNumber');
        var fname = data.AttachmentFileName;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'Confirmation': confirmationNumber, 'VendorAttachmentFileName': fname, 'Active': 1 }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/UpdateRetireAttachment/",
            success: function (data) {
                // REMOVE THE LINE
                // closestRow.remove();
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("This attachment Restored from the archieve List!");

                GetArchieveDocuments(confirmationNum);

                $("#menuDocCount").text(data.data.length);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });
    //

    function setAttachment(data) {
        $('#ddArchieveGrid').DataTable().destroy();
        $('#ddArchieveGrid').empty();

        $('#ddArchieveGrid').dataTable({
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
                //{
                //    "data": "DisplayName",
                //    "title": "File Type"
                //},
                {
                    'data': 'UploadedDate', "title": "Date"
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
                            '<a class="clsRestoreArchieve" title="Restore Document" > ' +

                            '<span class="glyphicon glyphicon-download-alt123"></span>' +
                            '<span>Restore</span>' +
                            '</a>' +
                            '</li>' +

                            //'<li>' +
                            //'<a title="Retire File" class="clsretire"  data-rowclass="documentRow">' +
                            //'<span class="fa fa-trash-o"></span>' +
                            //' Retire' +
                            //'</a>' +
                            //' </li>' +
                            '</ul>' +
                            '</div>'
                    }
                }
            ],

            columnDefs: [
                //{ "class": "fa fa-calendar" , "targets": [1] },
                { "width": "70%", "targets": [0] },
                { "width": "25%", "targets": [1] },
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

            //"createdRow": function (row, data, dataIndex) {
            //    $(row).find('td:eq(1)')
            //        .addClass('fa fa-calendar');
            //}
        });
    };

    $("#menu_archieveApplication").click(function () {
        debugger;
        GetArchieveDocuments(confirmationNum);
    });

    function GetArchieveDocuments(confirmationNum) {
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'ConfirmationNum': confirmationNum }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetArchieveDocumentsByConfirmationNUmber/",
            success: function (data) {
                setAttachment(data.data.archieveDocuments);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

});