"use strict";
//  Global variables
var vdd = {};

$('#menu_loggedinasUserName').text("Logged in as " + sessionStorage.getItem('userName'));
$('#menu_loggedinasUserName').css("display", "block");

/* Intial settings */
//$(".nav li").removeClass("active");
$("#btn_loginLock").hide();

window.__INITIAL_STATE__ = {
    IsValidUser: false
};

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

//$('.liselect').on('click', function () {
//	var paymentSelected = sessionStorage.getItem('paymentJson');
//	if ((paymentSelected == null || paymentSelected == 'undefined')) {
//		return;
//	}
//	var eId = $(this)[0].id;

//	var selectedValue = parseInt($(this).attr('value'));

//	var currentNavId = $('.liselect.active')[0].id;

//	var currentValue = parseInt($('#' + $('.liselect.active')[0].id).attr('value'));

//	if (currentValue > selectedValue) {
//		switch (selectedValue) {
//			case 1:
//				window.location.href = '/draft/Index';   
//				break;
//			case 2:
//				window.location.href = '/draft/_partialBankDetails';
//				break;
//			case 3:
//				window.location.href = '/draft/_partialAttachment';
//				break;
//			case 4:
//				window.location.href = '/draft/_partialBankVerify';
//				break;
//			case 5:
//				window.location.href = '/draft/_partialCertify';
//				break;
//			case 6:
//				window.location.href = '/draft/_partialSubmit';
//				break;
//			case 6:
//				window.location.href = '/draft/_partialSubmit';
//				break;
//		}
//	}
//});

$("#btn_logout").on('click', function () {
	$('#logoutModal').modal('hide');
	sessionStorage.clear();
    window.location.href = "/Home/Index";
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