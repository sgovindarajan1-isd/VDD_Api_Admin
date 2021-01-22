$(document).ready(function () {
    if (sessionStorage.getItem('userName') == null || sessionStorage.getItem('userName') == '') {
        window.location.href = "/Home/Index";
        return;
    }

    $("#lbl_userName").text(sessionStorage.getItem('userName'));
    var userId = sessionStorage.getItem('UserId');
    var editData = [];
    $("#lbl_manageUserUserId").text(userId);
    $('#txt_phoneNumber').mask('(000)000-0000');


    if ($(location).attr('href').indexOf("userProfile") > -1) {
        $("#sidemenu_userProfile").addClass('active');
        $("#div_notes_tab").addClass('active');

        $("#sidemenu_applicationLists").removeClass('active');
        $("#div_summaryContent").removeClass('active');
    }


    $("div.bhoechie-tab-menu>div.list-group>a").click(function (e) {
        e.preventDefault();
        $(this).siblings('a.active').removeClass("active");
        $(this).addClass("active");
        var index = $(this).index();
        $("div.bhoechie-tab>div.bhoechie-tab-content").removeClass("active");
        $("div.bhoechie-tab>div.bhoechie-tab-content").eq(index).addClass("active");  //.addClass("show")
    });

    getManageUserMenuList();
    getApplicationCustomFilterList();
    getUsersRoleList(userId);

    $("#tab_Notes").click(function (e) {
        $("#div_notes_tab").removeClass("fade");
        $("#div_notes_tab").addClass("show").addClass("in");

        $("#div_summaryContent").removeClass("show").removeClass("in");
        $("#div_summaryContent").addClass("fade");
    });

    function getApplicationCustomFilterList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetApplicationCustomFilterList/",
            dataType: 'json',

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                applicationTypeList = data.data.applicationTypeList;
                userList = data.data.userList;
                statusList = data.data.statusList;

                var filterUserList = $('#filterUser');
                $.each(userList, function (key, value) {
                    filterUserList.append(
                        $('<option></option>').html(value.Text).val(value.IdText)
                    );
                });

                var filterApplicationTypeList = $('#filterApplicationType');
                var advanceSearch_ApplicationTypeList = $('#advanceSearch_ApplicationTypeList');

                $.each(applicationTypeList, function (key, value) {
                    filterApplicationTypeList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                    advanceSearch_ApplicationTypeList.append(
                        $('<option></option>').val(value.Text).html(value.IdText)
                    );
                });

                var filterStatusList = $('#filterStatus');
                var advanceSearch_StatusList = $('#advanceSearch_StatusList');
                $.each(statusList, function (key, value) {
                    filterStatusList.append(
                        $('<option></option>').val(value.Id).html(value.Text)
                    );

                    advanceSearch_StatusList.append(
                        $('<option></option>').val(value.Id).html(value.Text)
                    );
                });
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in Getting Application Type List , Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    $("#btn_SubmitManageUser").click(function () {
        var manageUserMenuId = $("#txt_menuIdHidden").val();
        var menuName = $("#txt_menuName").val();

        debugger;
        if (menuName.length <= 0) {
            $("#spanmenuName").html('Menu Name required.');
            return;
        } else {
            $("#spanmenuName").html('');
        }

        var filApplicationType = $('#filterApplicationType').val();
        var filStatus = $('#filterStatus').val();
        var filUser = $('#filterUser').val();
        var filAge = $('#filerAge').val();

        if ((filApplicationType.length <= 0) && (filStatus.length <= 0) && (filUser.length <= 0) && (filAge.length <= 0)) {
            toastr.options.positionClass = "toast-bottom-right";
            toastr.warning("Please enter atleast one filter.");
            return;
        }      


        var filterApptype = $("#filterApplicationType  option:selected").text();
        var filterUser = $("#filterUser  option:selected").val();
        var filterStatus = $("#filterStatus  option:selected").val();
        var age = $("#filerAge  option:selected").val();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({
                'ManageUserMenuId': manageUserMenuId, 'ManageUserMenuName': menuName, 'UserId': userId, 'FilterApptype': filterApptype, 'FilterUser': filterUser,
                'FilterStatus': filterStatus, 'FilterAge': age, 'LastUpdatedUser': userId
            }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/InsertUpdateManageUserApplicationFilter/",
            success: function (data) {
                $('#manageUserModal').modal('hide');
                editData = [];
                setManageUserApplicationList(data.data.lst_ManageUserList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });

    $("#btn_manageUser_add").click(function () {
        editData = [];
        editData.ManageUserMenuId = 0;
        $("#txt_menuIdHidden").val(editData.ManageUserMenuId);
    });

    $("#btn_CancelManugeUser").click(function () {
        editData = [];
        editData.ManageUserMenuId = 0;
    });



    function setManageUserApplicationList(data) {
        $('#manageUserGrid').DataTable().destroy();
        $('#manageUserGrid').empty();

        $('#manageUserGrid').dataTable({
            responsive: true,
            searching: false,
            paging: true,
            lengthChange: false
            , "order": []
            , data: data,
            columns: [
                {
                    "data": "ManageUserMenuName",

                    "render": function (data, type, row, meta) {
                        if (type === 'display') {
                            data = '<a class="btn_editMUMenu" data-toggle="modal" data-target="#manageUserModal">' + data + ' </a>';
                        }

                        return data;
                    },

                    "title": "Application List"
                },
                {
                    "data": "ManageUserMenuId",
                    "title": "ManageUserMenuId"
                },
                { "data": "FilterApptype", "title": "FilterApptype" },
                { "data": "FilterUser", "title": "FilterUser" },
                { "data": "FilterStatus", "title": "FilterStatus" },
                { "data": "FilterAge", "title": "FilterAge" },
                {
                    'data': null,
                    "bSortable": false,
                    "width": '5px',
                    "render": function (data, type, row) {
                        return '<a id="btnDeleteManageuserList" class="fa fa-trash-o text-danger cls_deleteMu"> <span class="hidden" class="fa fa-trash-o"></span>  </a>';
                    },
                    'title': ""
                }
            ],

            columnDefs: [
                {
                    "targets": [1, 2, 3, 4, 5],  //,2,3,4,5
                    "visible": false,
                    "searchable": false
                },
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
    }
    function getManageUserMenuList() {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'ManageUserMenuId': 0, 'UserId': userId }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/GetManageUserMenuList/",
            success: function (data) {
                setManageUserApplicationList(data.data.manageUserMenuList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }

    $('#manageUserGrid').on('click', '.fa-trash-o', function (e) {
        debugger;
        var closestRow = $(this).closest('tr');
        var data = $('#manageUserGrid').DataTable().row(closestRow).data();

        deleteManageUserApplicationList(data.ManageUserMenuId);
    });


    $('#manageUserGrid').on('click', '.btn_editMUMenu', function (e) {
        var closestRow = $(this).closest('tr');
        editData = $('#manageUserGrid').DataTable().row(closestRow).data();
    });

    $('#manageUserModal').on('shown.bs.modal', function (e) {
        debugger;
        if (editData.ManageUserMenuId != 0) {
            debugger;
            $("#txt_menuIdHidden").val(editData.ManageUserMenuId);
            $("#txt_menuName").val(editData.ManageUserMenuName);
            //$("#filterStatus").prop('selectedIndex', editData.FilterStatus);
            //$("#filerAge").prop('selectedIndex', editData.FilterAge);

            $("#filterApplicationType option[value='" + editData.FilterApptype + "']").attr('selected', 'selected');
            $("#filterUser option[value='" + editData.FilterUser + "']").attr('selected', 'selected');
            $("#filterStatus option[value='" + editData.FilterStatus + "']").attr('selected', 'selected');
            $("#filerAge option[value='" + editData.FilterAge + "']").attr('selected', 'selected');
        }
        else {
            $("#txt_menuIdHidden").val("");
            $("#txt_menuName").val("");
            $("#filterStatus").prop('selectedIndex', 0);
            $("#filerAge").prop('selectedIndex', 0);

            $("#filterApplicationType").prop('selectedIndex', 0);
            $("#filterUser").prop('selectedIndex', 0);
        }
    });

    function deleteManageUserApplicationList(manageUserMenuId) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'ManageUserMenuId': manageUserMenuId, 'UserId': userId }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/deleteManageUserApplicationList/",
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("Successfully deleted.");
                setManageUserApplicationList(data.data.manageUserApplicationList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }


    function buildUsersRoleList(data) {
        var str = ""
        if (data != null) {
            for (var i = 0; i < data.length; i++) {
                var str = '<li>' +
                    data[i].RoleName +
                    '</li>'

                $("#ul_roleMenuList").append(str);
            }
        }
    }

    function getUsersRoleList(userId) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'UserId': userId }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/getUsersRoleList/",
            success: function (data) {
                buildUsersRoleList(data.data.roleMenuList);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    //User profile


    GetUserProfileByUserId(userId);
    function GetUserProfileByUserId(userId) {
        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: 'json',
            data: JSON.stringify({ 'UserId': userId }),
            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            url: "/api/values/getUserProfileByUserId/",
            success: function (data) {
                debugger;
                $("#txt_firstName").val(data.data.userProfileList.FirstName);
                $("#txt_lastName").val(data.data.userProfileList.LastName);
                $("#txt_email").val(data.data.userProfileList.Email);
                $("#txt_phoneNumber").val(data.data.userProfileList.PhoneNumber);
            },
            error: function (_XMLHttpRequest, textStatus, errorThrown) {
                if (_XMLHttpRequest.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    };

    $("#btn_userProfileUpdate").click(function () {
        var uId = sessionStorage.getItem('UserId');
        var phoneNumber = $("#txt_phoneNumber").val();

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/UpdateUserProfile/",
            dataType: 'json',
            data: JSON.stringify({
                'UserId': uId, 'PhoneNumber': phoneNumber
            }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                toastr.options.positionClass = "toast-bottom-right";
                toastr.warning("User Profile updated successfully.");
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in updating  User Profile, Please check!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });

    });


});