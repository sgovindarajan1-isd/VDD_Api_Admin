$(document).ready(function () {
    var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
    var userId = sessionStorage.getItem('UserId');
    var globalSelectedItemNumber = 0;
    var globalSelected_NotesIdforEdit = 0;
    var glabaleditedNotesItemtoUpdate = null;
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
        globalSelected_NotesIdforEdit = 0;
        $("#txt_checklist_comment").val('');
    });

    $("#btn_checklistSubmit").click(function () {
        debugger;
        var checklistItemNumber = globalSelectedItemNumber;
        var confirmationNum = sessionStorage.getItem('selectedConfirmationNumber');
        var notesType = "Checklist"; // to do needed  place holder to pull from 
        var notes = $("#txt_checklist_comment").val();
        if (notes.length <= 0) {
            toastr.options.positionClass = "toast-bottom-right";
            toastr.warning("Please enter Notes to add!");
            return;
        }
        InsertUpdateChecklistNotes(confirmationNum, checklistItemNumber, notesType, notes, globalSelected_NotesIdforEdit);
       
    });

    $("#noteList_cl").on("click", "a.btnedit_Checklist", function () {
        debugger;
        $("#txt_checklist_comment").val($(this).parent().attr('data-value'));
        glabaleditedNotesItemtoUpdate = $(this).parent();
        globalSelected_NotesIdforEdit = $(this).attr('value');  // this work is pending
    });

    function InsertUpdateChecklistNotes(confirmationNum, checklistItemNumber, notesType, notes, modifyOrnewNoteId) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/InsertUpdateChecklistNotes/",
            dataType: 'json',
            data: JSON.stringify({
                'ConfirmationNumber': confirmationNum, 'ChecklistId': checklistItemNumber, 'NotesType': notesType, 'Notes': notes, NotesId: modifyOrnewNoteId
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                debugger;
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully added Checklist.");
                var today = new Date();
                var tdate = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear() ;
                //var time = today.getHours() + ":" + today.getMinutes();
                var ttime = (today.getHours() > 12) ? (today.getHours() - 12 + ':' + today.getMinutes() + ' PM') : (today.getHours() + ':' + today.getMinutes() + ' AM');
                var dateTime = tdate + ' ' + ttime;

                var a = '<li class="noteRow list-group-item">'+
                    '<div style="color:#000000;">'+
                    '<span><strong>' + dateTime +' '+ '</strong></span>'+
                    '<span><strong>'+ sessionStorage.getItem('userName')+
                    '</strong></span>'+

                    '<div class="pull-right btn-group btn-group-xs" role="group" aria-label="..." data-value="' + notes + '"> ' +
                   // '<a class="btn btn-info btnedit_Checklist" value="' + checklistItemNumber +'">' +
                    '<a class="btn btn-info btnedit_Checklist" value=' + data.data.ModifiedNoteId + '>' +
                    '<span class="fa fa-edit smallRightMargin "></span>' +
                    'Edit' +
                    '</a>' +
                    '</div>' +
                    '</div>' +

                    '<div>' +
                    '<p>' + notes +
                    '</div>'+
                '</li>'

                if (modifyOrnewNoteId == 0) {  //For new update or update.
                    $("#noteList_cl").append(a);
                    $('a[value=' + checklistItemNumber + ']').text(tdate);
                }
                else {
                    //update the text box
                    //glabaleditedNotesItemtoUpdate.update(notes);//.attr('data-value', notes);
                    //glabaleditedNotesItemtoUpdate.innerHTML = notes;

                    //$(glabaleditedNotesItemtoUpdate + ' p:first').html(notes);
                    var test = glabaleditedNotesItemtoUpdate.find('p:first').html();
                    glabaleditedNotesItemtoUpdate.find('p:first').html(notes);
                }
                globalSelected_NotesIdforEdit = 0;  // resetting for add edit
               // $('#addchecklistModal').modal('hide');
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
                    //var selectedNotes = [];
                    //selectedNotes.push('selectedNoteId': data.data.ChecklistNotes[item].NotesId);
                    var a = '<li class="noteRow list-group-item">' +
                        '<div style="color:#000000;">' +
                        '<span><strong>' + data.data.ChecklistNotes[item].LastUpdatedDateTime +' - '+'</strong></span>' +
                        '<span><strong>' + data.data.ChecklistNotes[item].LastUpdatedUser +
                        '</strong></span>' +
                        '<div class="pull-right btn-group btn-group-xs" role="group" aria-label="..."  data-value="' + data.data.ChecklistNotes[item].Notes + '"> '+
                        '<a class="btn btn-info btnedit_Checklist" value=' + data.data.ChecklistNotes[item].NotesId+ '>' +
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