$(document).ready(function () {
    var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
    var userId = sessionStorage.getItem('UserId');
    var globalSelectedItemNumber = 0;
    var globalSelectedItemNumber_forEdit = 0;

    //  Check list
    $('.switch-input').change(function () {
        debugger;
        if ($(this).is(':checked')) {
            InsertUpdateDocumentCheckList($(this)[0].value, confirmationNum, 1);
        }
        else {
            InsertUpdateDocumentCheckList($(this)[0].value, confirmationNum, 0);
        }
    });

    function InsertUpdateDocumentCheckList(checkListID, confirmationNum, yes_no) {
        debugger;
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var notes = "test"
        var notesType = "Checklist";

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/InsertUpdateDocumentCheckList/",
            dataType: 'json',
            data: JSON.stringify({
                'CheckListID': checkListID, 'ConfirmationNumber': confirmationNum, 'Active': yes_no, 'LastUpdatedUser': userId
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                debugger;         
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully updated checklist");
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                debugger;
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in Insert/ Update checklist , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    $("a.btn-successe").click(function () {
        debugger;
        $("#txt_checklist_comment").val('');
        $("#noteList_cl").empty();

        globalSelectedItemNumber= $(this).attr('value');
        $("#header_checklistpopup").text('Item#' + globalSelectedItemNumber);
        GetChecklistNotesByChecklistIDandNotesID(confirmationNum, $(this).attr('value'));
    });

    $("#btn_checklistAdd").click(function () {
        debugger;
        var checklistItemNumber = globalSelectedItemNumber;
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var notesType = "Checklist"; // to do needed  place holder to pull from 
        var notes = $("#txt_checklist_comment").val();

        InsertUpdateChecklistNotes(confirmationNum, checklistItemNumber, notesType, notes)
    });

    $("a.btnedit_Checklist").click(function () {
        debugger;
        globalSelectedItemNumber_forEdit = $(this).attr('value');  // this work is pending
    });

    function InsertUpdateChecklistNotes(confirmationNum, checklistItemNumber, notesType, notes) {
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/InsertUpdateChecklistNotes/",
            dataType: 'json',
            data: JSON.stringify({
                'ConfirmationNumber': confirmationNum, 'ChecklistId': checklistItemNumber, 'NotesType': notesType, 'Notes': notes
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully added Checklist.");

                var a = '<li class="noteRow list-group-item">'+
                    '<div style="color:#000000;">'+
                    '<span><strong>'+Date.parse(new Date()).toString() +'</strong></span>'+
                    '<span><strong>'+ sessionStorage.getItem('userName')+
                    '</strong></span>'+

                    '<div class="pull-right btn-group btn-group-xs" role="group" aria-label="...">' +
                    '<a class="btn btn-info btnedit_Checklist" value="' + checklistItemNumber +'">' +
                    '<span class="fa fa-edit smallRightMargin "></span>' +
                    'Edit' +
                    '</a>' +
                    '</div>' +
                    '</div>' +

                    '<div>' +
                    '<p>' + notes +
                    '</div>'+
                '</li>'


                //var a = '<li class="list-group-item list-group-item-warning emptyResultMessage"> <span style="font-weight:bold; padding-right:10px" >' + '</span >' + notes + '</li>';
                $("#noteList_cl").append(a);
                $('#addchecklistModal').modal('hide');
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
    
    function GetChecklistNotesByChecklistIDandNotesID(confirmationNum, checklistItemNumber) {
        debugger;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetChecklistNotesByChecklistIDandNotesID/",
            dataType: 'json',
            data: JSON.stringify({
                'ConfirmationNumber': confirmationNum, 'ChecklistId': checklistItemNumber
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                debugger;
                for (var item in data.data.ChecklistNotes) {
                    var a = '<li class="noteRow list-group-item">' +
                        '<div style="color:#000000;">' +
                        '<span><strong>' + data.data.ChecklistNotes[item].LastUpdatedDateTime +' - '+'</strong></span>' +
                        '<span><strong>' + data.data.ChecklistNotes[item].LastUpdatedUser +
                        '</strong></span>' +

                        '<div class="pull-right btn-group btn-group-xs" role="group" aria-label="...">' +
                        '<a class="btn btn-info btnedit_Checklist" value="' + data.data.ChecklistNotes[item].ChecklistId + '">' +
                        '<span class="fa fa-edit smallRightMargin "></span>' +
                        'Edit' +
                        '</a>' +
                        '</div>' +
                        '</div>' +

                        '<div>' +
                        '<p>' + data.data.ChecklistNotes[item].Notes +
                        '</div>' +
                        '</li>'

                    $("#noteList_cl").append(a);
                }
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
});