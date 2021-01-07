$(document).ready(function () {
    $("#lbl_userName").text(sessionStorage.getItem('userName'));  //id_userName
    var userId = sessionStorage.getItem('UserId');
    getUsersList('ALL');  //  get all the users for grid list
    $('#txt_pop_gcPhoneNumber').mask('(000)000-0000');
    $('#txt_pop_PhoneNumber').mask('(000)000-0000');

    $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");  //.addClass("show")
    });

    $('#ddUserGrid').on('click', '.addeditUser', function () {
        var RowIndex = $(this).closest('tr');
        var table = $('#ddUserGrid').DataTable();
        var userId = table.row(RowIndex).data().UserId;
        getUserEditPopup(userId);                                    //  User Edit
    });

    function setData(usersList) {
        $('#ddUserGrid').DataTable().destroy();
        $('#ddUserGrid').empty();
        $('#ddUserGrid').dataTable({
            responsive: true,
            searching: true,
            paging: true,
            lengthChange: false
            , "order": []
            , data: usersList,
            columns: [
                { 'data': 'LastName', "title": "Last Name" },
                { 'data': 'FirstName', "title": "First Name" },
                { 'data': 'UserId', "title": "Employee Number" },
                { 'data': 'IsActive_Yes_No', "title": "Is Active" },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        return '<a class="btn btn-primary btn-group-xs nonFormSubmit addeditUser" data-toggle="modal" data-target="#userDetailsModal" data-additionalprocess="chosen">' +
                            '<span class="fa fa-link"> </span> Edit' +
                            '</a>';

                        //<a id="btn_addUser" class="btn btn-xs btn-success" data-toggle="modal" data-target="#userDetailsModal" data-additionalprocess="chosen">
                        //    <span class="fa fa-plus"></span>Add User
                        //</a>

                    },
                    'title': "Action"
                }
            ],

            columnDefs: [
                { "width": "30%", "targets": [0, 1] },
                { "width": "10%", "targets": [2, 3] },
                { "width": "5%", "targets": [4] },
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

    $('#userDetailsModal').on('shown.bs.modal', function (e) {
        $("#txt_pop_UserId").val('');
        $("#txt_pop_FirstName").val('');
        $("#txt_pop_LastName").val('');
        $("#txt_pop_PhoneNumber").val('');
        $("#txt_pop_Email").val('');
        $("#txt_pop_DisbursementCategory").val('');

        $("#chk_pop_isActive").prop('checked', false)
        $("#lbl_pop_isActive").removeClass('active');

        $("#chk_DataEntry").prop('checked', false)
        $("#lbl_DataEntry").removeClass('active');

        $("#chk_processor").prop('checked', false)
        $("#lbl_processor").removeClass('active');

        $("#chk_supervisor").prop('checked', false)
        $("#lbl_supervisor").removeClass('active');

        $("#chk_admin").prop('checked', false)
        $("#lbl_admin").removeClass('active');

    });

    function getUserEditPopup(userID) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'UserId': userID
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/getUsersListByUserId/",
            success: function (data) {
                $("#txt_pop_UserId").val(userID);
                $("#txt_pop_FirstName").val(data.data.usersList[0].FirstName);
                $("#txt_pop_LastName").val(data.data.usersList[0].LastName);
                $("#txt_pop_PhoneNumber").val(data.data.usersList[0].PhoneNumber);
                $("#txt_pop_Email").val(data.data.usersList[0].Email);
                $("#txt_pop_DisbursementCategory").val(data.data.usersList[0].DisbursementCategory);
                $("#chk_pop_isActive").val(data.data.usersList[0].IsActive);


                if (data.data.usersList[0].IsActive == 1) {
                    $("#chk_pop_isActive").prop('checked', true)
                    $("#lbl_pop_isActive").addClass('active');
                }

                var userRoles = data.data.list_userRoles;
                for (var item in data.data.list_userRoles) {

                    if (data.data.list_userRoles[item].RoleId == 1) {
                        $("#chk_DataEntry").prop('checked', true)
                        $("#lbl_DataEntry").addClass('active');
                    }

                    if (data.data.list_userRoles[item].RoleId == 4) {
                        $("#chk_admin").prop('checked', true)
                        $("#lbl_admin").addClass('active');
                    }

                    if (data.data.list_userRoles[item].RoleId == 11) {
                        $("#chk_processor").prop('checked', true)
                        $("#lbl_processor").addClass('active');
                    }

                    if (data.data.list_userRoles[item].RoleId == 12) {
                        $("#chk_supervisor").prop('checked', true)
                        $("#lbl_supervisor").addClass('active');
                    }
                }


            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    function getUsersList(userID) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'UserId': userID
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/getUsersListByUserId/",
            success: function (data) {
                setData(data.data.usersList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    $("#txt_pop_UserId").focusout(function () {
        if ($("#txt_pop_UserId").val().length <= 0) {
            $("#spanUserId").html('User Id is required.');
            return;
        } else {
            $("#spanUserId").html('');
        }

        GetUserDetails($("#txt_pop_UserId").val());
    }).click(function (e) {
        e.stopPropagation();
        return true;
    });

    function GetUserDetails(usrId) {
        $.ajax({

            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'UserId': usrId
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/RetrieveUserDetails/",
            success: function (data) {
                var d = data.data.userProfile;
                $('#txt_pop_FirstName').val(d.givenNameField);
                $('#txt_pop_LastName').val(d.snField);
                $('#txt_pop_PhoneNumber').val(d.telephoneNumberField);
                $('#txt_pop_Email').val(d.mailField);
                $('#txt_pop_DisbursementCategory').val(d.departmentField);

                var userRoles = data.data.list_userRoles;
                for (var item in data.data.list_userRoles) {
                    if (data.data.list_userRoles[item].RoleId == 1) {
                        $("#chk_DataEntry").prop('checked', true)
                        $("#lbl_DataEntry").addClass('active');
                    }

                    if (data.data.list_userRoles[item].RoleId == 4) {
                        $("#chk_admin").prop('checked', true)
                        $("#lbl_admin").addClass('active');
                    }

                    if (data.data.list_userRoles[item].RoleId == 11) {
                        $("#chk_processor").prop('checked', true)
                        $("#lbl_processor").addClass('active');
                    }

                    if (data.data.list_userRoles[item].RoleId == 12) {
                        $("#chk_supervisor").prop('checked', true)
                        $("#lbl_supervisor").addClass('active');
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#txtFinancialIns").val("No User found");
            }
        });
    };

    function validateUser() {
        var txtUserId = $("#txt_pop_UserId").val();
        var txtFirstName = $("#txt_pop_FirstName").val();
        var txtLastName = $("#txt_pop_LastName").val();
        var txtDisbursementCategory = $("#txt_pop_DisbursementCategory").val();

        var bool = true;

        if (txtUserId.length <= 0) {
            $("#spanUserId").html('User Id is required.');
            bool = false;
        } else {
            $("#spanUserId").html('');
        }

        if (txtFirstName.length <= 0) {
            $("#spanFirstName").html('First Name is required.');
            bool = false;
        } else {
            $("#spanFirstName").html('');
        }

        if (txtLastName.length <= 0) {
            $("#spanLastName").html('Last Name is required.');
            bool = false;
        } else {
            $("#spanLastName").html('');
        }

        if (txtDisbursementCategory.length <= 0) {
            $("#spandisbursementCategory").html('Disbursement Category is required.');
            bool = false;
        } else {
            $("#spandisbursementCategory").html('');
        }

        if (!bool) {
            return false;
        }
        else {
            return true;
        }
    }

    $('#btn_AddEditUser').on('click', function (e) {
        var userId = $("#txt_pop_UserId").val();
        var firstName = $("#txt_pop_FirstName").val();
        var lastName = $("#txt_pop_LastName").val();
        var disbursementCategory = $("#txt_pop_DisbursementCategory").val();

        if (validateUser() == false) {
            return;
        };

        var isActive = 0;
        var isAdmin = 0;
        var isSupervisor = 0;
        var isProcessor = 0;
        var isDataEntry = 0;

        if ($("#chk_pop_isActive").prop('checked') == true) {
            isActive = 1;
        }

        if ($("#chk_admin").prop('checked') == true) {
            isAdmin = 1;
        }

        if ($("#chk_supervisor").prop('checked') == true) {
            isSupervisor = 1;
        }

        if ($("#chk_processor").prop('checked') == true) {
            isProcessor = 1;
        }

        if ($("#chk_DataEntry").prop('checked') == true) {
            isDataEntry = 1;
        }


        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateUserDetails/",
            dataType: 'json',
            data: JSON.stringify({
                'UserId': userId, 'IsActive': isActive, 'FirstName': firstName, 'LastName': lastName, 'DisbursementCategory': disbursementCategory,
                'IsAdmin': isAdmin, 'IsSupervisor': isSupervisor, 'IsProcessor': isProcessor, 'IsDataEntry': isDataEntry
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully user details updated.");
                getUsersList('ALL');
                $('#userDetailsModal').modal('hide');
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating  user details , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });


    //-----------------------  General content contact us  ------------------------//

    $('#contactUsEditModal').on('shown.bs.modal', function (e) {
        GetGetGeneralContent_ContactUs();
    });
    function GetGetGeneralContent_ContactUs() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/RetrieveGeneralContent_ContactUs/",
            dataType: 'json',

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },

            success: function (data) {
                $("#txt_pop_gcEmail").val(data.data.generalContent_ContactUs.Email);
                $("#txt_pop_MailingAddress").val(data.data.generalContent_ContactUs.MailingAddress);
                $("#txt_pop_gcPhoneNumber").val(data.data.generalContent_ContactUs.Phone);
                $("#txt_pop_OfficeHours").val(data.data.generalContent_ContactUs.OfficeHours);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    function validateContactUs() {
        var txtEmail = $("#txt_pop_gcEmail").val();
        var txtMailingAddress = $("#txt_pop_MailingAddress").val();
        var txtPhoneNumber = $("#txt_pop_gcPhoneNumber").val();
        var txtOfficeHours = $("#txt_pop_OfficeHours").val();

        var bool = true;

        if (txtEmail.length <= 0) {
            $("#spangcEmail").html('Email is required.');
            bool = false;
        } else if (!isEmail(txtEmail)) {
            $("#spangcEmail").html('Please enter valid Email Address.');
            bool = false;
        } else {
            $("#spangcEmail").html('');
        }

        if (txtMailingAddress.length <= 0) {
            $("#spanMailingAddress").html('Mailing Address is required.');
            bool = false;
        } else {
            $("#spanMailingAddress").html('');
        }

        if (txtPhoneNumber.length <= 0) {
            $("#spangcPhoneNumber").html('Phone Number is required.');
            bool = false;
        } else if (!validatePhone(txtPhoneNumber)) {
            $("#spangcPhoneNumber").html('Valid Phone Number is required.');
            bool = false;
        } else {
            $("#spangcPhoneNumber").html('');
        }

        if (txtOfficeHours.length <= 0) {
            $("#spanOfficeHours").html('Office Hours is required.');
            bool = false;
        } else {
            $("#spanOfficeHours").html('');
        }

        if (!bool) {
            return false;
        }
        else {
            return true;
        }
    }

    $("#btn_AddEditContactUs").click(function () {
        debugger;
        if (validateContactUs() == false)
            return;

        var PhoneNumber = $("#txt_pop_gcPhoneNumber").val();
        var Email = $("#txt_pop_gcEmail").val();
        var MailingAddress = $("#txt_pop_MailingAddress").val();
        var OfficeHours = $("#txt_pop_OfficeHours").val();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/InsertUpdateGeneralContent_ContactUs/",
            dataType: 'json',
            data: JSON.stringify({
                'Email': Email, 'MailingAddress': MailingAddress, 'OfficeHours': OfficeHours, 'Phone': PhoneNumber
                , 'LastUpdatedUser': userId
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully Contact us details updated");

                $('#contactUsEditModal').modal('hide');
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating  General Content Contactus Details , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });

    GetDenialReasonList();
    
    function GetDenialReasonList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            //data: JSON.stringify({ 'ConfirmationNum': confirmationNum }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/RetrieveDenialReasonList/"+ 0,  //  0 means  get all the category and reasons
            success: function (data) {
                setDenialReasonList(data.data.denialReasonList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    $('#denialReasonEditModal').on('shown.bs.modal', function (e) {
        $("#txt_DenialReason").val('');
        GetDenialReasonCategoryList();
    });

    function GetDenialReasonCategoryList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetDenialReasonCategoryList/",
            dataType: 'json',
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                rrList = data.data.denialReasonCategoryList;

                var rejectReasonCategoryList = $('#select_rejectReasonCategory');
                rejectReasonCategoryList.empty();
                $.each(rrList, function (key, value) {
                    rejectReasonCategoryList.append(
                        $('<option class="dropdown-item1"></option>').val(value.DenialReasonCategoryId).html(value.DenialReasonCategoryText)
                    );
                });

                //  set the default
                var select_rejectReasonCategory = $('#select_rejectReasonCategory').val();
                RetrieveDenialReasonList(select_rejectReasonCategory);
            }
        });
    };


    function setDenialReasonList(data) {
        $('#denialReasonGrid').DataTable().destroy();
        $('#denialReasonGrid').empty();

        $('#denialReasonGrid').dataTable({
            responsive: true,
            searching: false,
            paging: true,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "DenialReasonCategoryText",
                    "title": "Category"
                },
                {
                    "data": "DenialReasonText",
                    "title": "Denial Reason"
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
                            '<a title="Retire File" class="clsretire"  data-rowclass="documentRow">' +
                            '<span class="fa fa-trash-o"></span>' +
                            ' Delete' +
                            '</a>' +
                            ' </li>' +
                            '</ul>' +
                            '</div>'
                    }
                }
            ],

            columnDefs: [
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
        });
    };


    $('#btn_SubmitDenialReason').click(function (e) {
        var denialReason = $("#txt_DenialReason").val();
        var category = $('#select_rejectReasonCategory').val();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/InsertUpdateDenialReason/",
            dataType: 'json',
            data: JSON.stringify({
                'DenialReasonCategoryId': category, 'DenialReasonText': denialReason, 'LastUpdatedUser': userId
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully added Denial Reason.");

                setDenialReasonList(data.data.denialReasonList);

                $('#denialReasonEditModal').modal('hide');

            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in Insert/ Update Denial Reason, Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    });

    $('#denialReasonGrid').on('click', '.clsretire', function (e) {
        var closestRow = $(this).closest('tr');
        var data = $('#denialReasonGrid').DataTable().row(closestRow).data();
        var denialReasonId = data.DenialReasonId;
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'DenialReasonId': denialReasonId, 'Action': 'DELETE', 'LastUpdatedUser': userId }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/InsertUpdateDenialReason/",
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("This Denial Reason deleted from the Application!");

                GetDenialReasonList();
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    });




});