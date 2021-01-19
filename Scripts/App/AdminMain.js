var GlobalRoles = {
    DataEntryRole: 1,
    ProcessorRole: 11,
    SupervisorRole: 12,
    AdminRole: 4
};

var GlobalUserHasRoles = {
    DataEntryRole: false,
    ProcessorRole: false,
    SupervisorRole: false,
    AdminRole: false
};

//  Pop over on question mark on mouse hover - starting
var originalLeave = $.fn.popover.Constructor.prototype.leave;
$.fn.popover.Constructor.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
        obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
    var container, timeout;

    originalLeave.call(this, obj);

    if (obj.currentTarget) {
        container = $(obj.currentTarget).siblings('.popover')
        timeout = self.timeout;
        container.one('mouseenter', function () {
            clearTimeout(timeout);
            container.one('mouseleave', function () {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
        })
    }
};

$('body').popover({ selector: '[data-popover]', trigger: 'hover', placement: 'auto', delay: { show: 50, hide: 400 } });
//  Popover on question mark on mouse hover  - Ending


function userHasDataEntryRole(userRoleObj) {
    if (userRoleObj != null) {
        for (var i = 0; i < userRoleObj.length; i++) {
            if (userRoleObj[i].RoleId == GlobalRoles.DataEntryRole) {
                GlobalUserHasRoles.DataEntryRole = true;
            }
            if (userRoleObj[i].RoleId == GlobalRoles.ProcessorRole) {
                GlobalUserHasRoles.ProcessorRole = true;
            }
            if (userRoleObj[i].RoleId == GlobalRoles.SupervisorRole) {
                GlobalUserHasRoles.SupervisorRole = true;
            }
            if (userRoleObj[i].RoleId == GlobalRoles.AdminRole) {
                GlobalUserHasRoles.AdminRole = true;
            }
        }
    }
}

$("#lnkAdvSearch").click(function (e) {
    if ($("#txt_appSearchNumber").val().length > 0) {
        navigateToSummaryPage();
        return;
    }
    window.location.href = '/applicationList/advanceSearchList?type=adv';
});


$("#btn_layout_profile").click(function (e) {
    window.location.href = '/applicationList/ManageUserList?goto=userProfile';
});

function navigateToSummaryPage() {
    if ($("#txt_appSearchNumber").val().length <= 0) {
        return;
    } else {

        $.ajax({
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            url: "/api/values/GetApplicationSummary/",
            dataType: 'json',
            data: JSON.stringify({ 'Text': $("#txt_appSearchNumber").val() }),

            headers: {
                'Authorization': 'Basic ' + btoa('admin')
            },
            success: function (data) {
                if (data.data.applicationSummary == null) {
                    //toastr.options.positionClass = "toast-top-right";
                    toastr.warning("Invalid Application Number, Please check the entry!");
                    // $("#span_invalidAppNum").text("Invalid Application Number!").show().delay(3000).fadeOut();
                    return;
                }
                else {
                    sessionStorage.setItem('selectedConfirmationNumber', $("#txt_appSearchNumber").val());
                    window.location.href = '/applicationList/applicationSummary';
                }
            }
            , complete: function (jqXHR) {
            }
            , error: function (jqXHR, textStatus, errorThrown) {
                if (textStatus == 'error') {
                    toastr.options.positionClass = "toast-bottom-right";
                    toastr.warning("Error in getting Application Summary , Please check the entry!");
                }
                else if (jqXHR.status == '401') {
                    window.location.href = "/Home/UnAuthorized";
                }
            }
        });
    }
};

$("#txt_appSearchNumber").focusout(function (e) {
    navigateToSummaryPage();
    //if ($("#txt_appSearchNumber").val().length <= 0) {
    //    return;
    //}
    //sessionStorage.setItem('selectedConfirmationNumber', $("#txt_appSearchNumber").val());
    //window.location.href = '/applicationList/applicationSummary';

}).click(function (e) {
    e.stopPropagation();
    return true;
});


$(document).ready(function () {
    // ***********  Menu Building  ******************

    var userRoleObj = JSON.parse(sessionStorage.getItem("UserRolesListJson"));
    userHasDataEntryRole(userRoleObj);


    //function userHasDataEntryRole(userRoleObj) {
    //	for (var i = 0; i < userRoleObj.length; i++) {
    //		if (userRoleObj[i].RoleId == GlobalRoles.DataEntryRole) {
    //			GlobalUserHasRoles.DataEntryRole = true;
    //		}
    //		if (userRoleObj[i].RoleId == GlobalRoles.ProcessorRole) {
    //			GlobalUserHasRoles.ProcessorRole = true;
    //		}
    //		if (userRoleObj[i].RoleId == GlobalRoles.SupervisorRole) {
    //			GlobalUserHasRoles.SupervisorRole = true;
    //		}
    //		if (userRoleObj[i].RoleId == GlobalRoles.AdminRole) {
    //			GlobalUserHasRoles.AdminRole = true;
    //		}

    //	}
    //}
    if (GlobalUserHasRoles.DataEntryRole) {
        //if (sessionStorage.getItem('RoleId') == GlobalRoles.DataEntryRole) {
        $('#menu_userName').text(sessionStorage.getItem('userName'));
        $('#div_advanceSearch').hide();
        $('#menu_applicatoinList').hide();
        $('#menu_enterApplication').show();
        $('#menu_admin').hide();
        $('#menu_reports').hide();
    }
    if (GlobalUserHasRoles.ProcessorRole) {
        $('#menu_userName').hide();
        $('#div_advanceSearch').show();
        $('#menu_applicatoinList').show();
        $('#menu_enterApplication').hide();
        $('#menu_admin').hide();
        $('#menu_reports').show();
    }
    if (GlobalUserHasRoles.SupervisorRole) {
        $('#menu_userName').hide();
        $('#div_advanceSearch').show();
        $('#menu_applicatoinList').show();
        $('#menu_enterApplication').hide();
        $('#menu_admin').hide();
        $('#menu_reports').show();
    }
    if (GlobalUserHasRoles.AdminRole) {
        $('#menu_userName').hide();
        $('#div_advanceSearch').show();
        $('#menu_applicatoinList').show();
        $('#menu_enterApplication').show();
        $('#menu_admin').show();
        $('#menu_reports').show();
    }
    if (((GlobalUserHasRoles.DataEntryRole))) {// || (GlobalUserHasRoles.AdminRole) )  && (!GlobalUserHasRoles.ProcessorRole) && (!GlobalUserHasRoles.SupervisorRole) ) {
        $('#menu_enterApplication').show();  //  if user has only Dataentry role  and admin role
    }
    else {
        $('#menu_enterApplication').hide(); 
    }

    // ***********  Menu Building  ******************

    $("#menu_applicatoinList").click(function () {

        //clear the Application list search sessions;
        clearApplicationlist_search_sessions();

        window.location.href = '/applicationList/applicationList';
    });

    function clearApplicationlist_search_sessions() {
        sessionStorage.removeItem('sessionfilterAge');
        sessionStorage.removeItem('sessionfilterReqType');
        sessionStorage.removeItem('fromPendingMyApprovalChartClick');
    }



    //  focus out and advance search click code here

    $("#btnAdvanceSearch").click(function () {
        if ($("#txt_appSearchNumber").val().length > 0) {
            navigateToSummaryPage();
            return;
        }
        window.location.href = '/applicationList/advanceSearchList?type=adv';
    });


    $("#menu_admin").click(function () {
        window.location.href = '/Administration/_partialAdministration';
    });

    $("#menu_reports").click(function () {
        window.location.href = '/ApplicationReports/_partialApplicationReports';
    });


    $("#menu_enterApplication").click(function () {
        window.location.href = '/draft/_partialVendor';
    });

    if ($(location).attr('href').indexOf("draft") > -1) {   //Only Enter application will get the navigation round buttons 
        $("#liNavigation").show();
    }
    else {
        $("#liNavigation").hide();
    }

    $("#lnkHome").click(function () {
        //window.location.href = '/home/dashboard';
        //if (sessionStorage.getItem('RoleId') == GlobalRoles.DataEntryRole) {
        //	window.location.href = '/draft/_partialDraftLanding';//'/draft/_partialVendor';
        //}
        //else if ((sessionStorage.getItem('RoleId') == GlobalRoles.ProcessorRole) || (sessionStorage.getItem('RoleId') == GlobalRoles.SupervisorRole)) {
        //	window.location.href = '/home/dashboard';
        //}
        //if (GlobalUserHasRoles.DataEntryRole) {
        //    window.location.href = '/draft/_partialDraftLanding';
        //}
        //else if ((GlobalUserHasRoles.ProcessorRole) || (GlobalUserHasRoles.SupervisorRole)) {
        //    window.location.href = '/home/dashboard';
        //}

        if ((GlobalUserHasRoles.DataEntryRole == true) && (GlobalUserHasRoles.ProcessorRole) == false && (GlobalUserHasRoles.SupervisorRole == false) && (GlobalUserHasRoles.AdminRole == false) ) {
            window.location.href = '/draft/_partialDraftLanding';
        }
        else {
            window.location.href = '/home/dashboard';
        }

    });


    $("#btn_logoutModal").click(function () {
        $('#logoutModal').modal('hide');
        sessionStorage.clear();
        GlobalUserHasRoles.DataEntryRole = false;
        GlobalUserHasRoles.ProcessorRole = false;
        GlobalUserHasRoles.SupervisorRole = false;
        GlobalUserHasRoles.AdminRole = false;

        window.location.href = "/Home/Index";
    });

    $("#btn_logout").click(function () {
        sessionStorage.clear();
        GlobalUserHasRoles.DataEntryRole = false;
        GlobalUserHasRoles.ProcessorRole = false;
        GlobalUserHasRoles.SupervisorRole = false;
        GlobalUserHasRoles.AdminRole = false;

        window.location.href = "/Home/Index";
    });

});
// start  draft master


//  session timeout begin
function IsSessionAlive() {
    $.post("/Home/IsSessionAlive", function (data) {
        if (!data.IsAlive) {
            sessionStorage.clear();
            window.location.href = "/Home/Index";
        }
    });
}


$('#img_username').on('click', function (e) {
    //$('#logoutModal').modal('show');
});


$('.liselect').on('click', function () {
    debugger;
    var paymentSelected = sessionStorage.getItem('paymentJson');
    if ((paymentSelected == null || paymentSelected == 'undefined')) {
        return;
    }
    var eId = $(this)[0].id;

    var selectedValue = parseInt($(this).attr('value'));

    var currentNavId = $('.liselect.active')[0].id;

    var currentValue = parseInt($('#' + $('.liselect.active')[0].id).attr('value'));

    if (currentValue > selectedValue) {
        switch (selectedValue) {
            case 1:
                window.location.href = '/draft/_partialVendor';
                break;
            case 2:
                window.location.href = '/draft/_partialLocations';
                break;
            case 3:
                window.location.href = '/draft/_partialBankDetails';
                break;
            case 4:
                window.location.href = '/draft/_partialAttachment';
                break;
            case 5:
                window.location.href = '/draft/_partialBankVerify';
                break;
            case 6:
                window.location.href = '/draft/_partialCertify';
                break;
            case 7:
                window.location.href = '/draft/_partialSubmit';
                break;
            
        }
    }
});



$("#btn_generalInfo").on('click', function () {
    window.location.href = "/Home/UnAuthorized";
});

function getUniqueFileNameusingCurrentTime() {
    var today = new Date();
    var cHour = today.getHours();
    var cMin = today.getMinutes();
    var cSec = today.getSeconds();
    var d = new Date($.now());
    var sfilename = d.getDate() + '' + (d.getMonth() + 1) + '' + d.getFullYear() + '' + d.getHours() + '' + d.getMinutes() + '' + d.getSeconds();
    return sfilename;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
        return false;
    } else {
        return true;
    }
}

function validatePhone(txtPhone) {
    if (txtPhone.length < 13) {
        return false;
    }
    var filter = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
    if (filter.test(txtPhone)) {
        return true;
    }
    else {
        return false;
    }
}

(function ($) {
    $.fn.menumaker = function (options) {
        var cssmenu = $(this), settings = $.extend({
            format: "dropdown",
            sticky: false
        }, options);
        return this.each(function () {
            $(this).find(".menu-button").on('click', function () {
                $(this).toggleClass('menu-opened');
                var mainmenu = $(this).next('ul');
                if (mainmenu.hasClass('open')) {
                    mainmenu.slideToggle().removeClass('open');
                } else {
                    mainmenu.slideToggle().addClass('open');
                    if (settings.format === "dropdown") {
                        mainmenu.find('ul').show();
                    }
                }
            });
            var $cssmenu = cssmenu.find('li ul').parent();
            $cssmenu.addClass('has-sub');
            $cssmenu.on('mouseenter', function () {
                var doc_w = $(document).width();
                var sub_pos = $(this).find('ul').offset();
                var sub_width = $(this).find('ul').width();
                if ((sub_pos.left + sub_width) > doc_w) {
                    $(this).find('ul').css('margin-left', '-' + ((sub_pos.left + sub_width) - doc_w) + 'px');
                }
            });
            multiTg = function () {
                cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
                cssmenu.find('.submenu-button').on('click', function () {
                    $(this).toggleClass('submenu-opened');
                    $(this).parents('li').toggleClass('sub-active');//mobile fix//
                    if ($(this).siblings('ul').hasClass('open')) {
                        $(this).siblings('ul').removeClass('open').slideToggle();
                    } else {
                        $(this).siblings('ul').addClass('open').slideToggle();
                    }
                });
            };

            if (settings.format === 'multitoggle') multiTg(); else cssmenu.addClass('dropdown');

            if (settings.sticky === true) cssmenu.css('position', 'fixed');
            resizeFix = function () {
                var mediasize = 1180;
                if ($(window).width() > mediasize) {
                    cssmenu.find('ul').show();
                }
                if ($(window).width() <= mediasize) {
                    cssmenu.find('ul').removeClass('open'); //.hide()
                    cssmenu.find('div.button').removeClass('menu-opened');
                }
            };
            resizeFix();
            return $(window).on('resize', resizeFix);
        });
    };
})(jQuery);


//draft end