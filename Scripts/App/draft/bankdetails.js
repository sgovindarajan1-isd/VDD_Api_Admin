$(document).ready(function () {
    debugger;
    //var displaywetForm = '';
    //var displayBankStatements = '';
    $("#liNavigation").show();
    $(".round-tab").css("border-color", "#e0e0e0");
    // testing values
    if ($(location).attr('href').indexOf("local") > -1) {
        $('#txtAccountType').val('1');
        $('#txtBankAcNo').val('66112342');
        $('#txtRe-BankAcNo').val('66112342');
        $('#txtBankRoutingNo').val('122000661');

        $('#txtDDNotifyEmail').val('ddnotify@isd.com');
        $('#txtReDDNotifyEmail').val('ddnotify@isd.com');
    }
    // testing values


    if ($(location).attr('href').indexOf("_partialBankDetails") > -1) {
        $("#img_vendor_step").attr('src', '/Content/Images/user_step.png');
        $("#img_info_step").attr('src', '/Content/Images/info_step.png');
        $("#img_bank_step").attr('src', '/Content/Images/bank_step_on.png');
        $("#img_bank_step").addClass("active");
        $("#li_bankstep").addClass("active");
        $("#li_bankstep").removeClass("disabled");
        $("#img_bank_step").parent().css("border-color", "#7030A0");
        $('#lbl_header').html('Enter Bank Information');
        $('#img_checkImage').hide();  //  by default img will be invisible

        var bankobj = JSON.parse(sessionStorage.getItem("bankdetailsJson"));
        if ((bankobj != null) && (bankobj != 'undefined')) {
            debugger;
            $("#txtAccountType").prop('selectedIndex', bankobj[0].AccountType);
            $("#txtBankAcNo").val(bankobj[0].BankAccountNumber);
            $("#txtRe-BankAcNo").val(bankobj[0].ReBankAcNo),
                $("#txtBankRoutingNo").val(bankobj[0].BankRoutingNo);
            $("#txtFinancialIns").val(bankobj[0].FinancialIns);
            $("#txtDDNotifyEmail").val(bankobj[0].DDNotifyEmail);
            $("#txtReDDNotifyEmail").val(bankobj[0].ReDDNotifyEmail);

            var accountType = $('#txtAccountType').val();
            if (parseInt(accountType) != 1) {
                $('#img_checkImage').hide();
            }
            else {
                $('#img_checkImage').show();
            }
        }
    }
    else if ($(location).attr('href').indexOf("_partialAttachment") > -1) {
        $("#img_vendor_step").attr('src', '/Content/Images/user_step.png');
        $("#img_info_step").attr('src', '/Content/Images/info_step.png');
        $("#img_bank_step").attr('src', '/Content/Images/bank_step.png');
        $("#img_bank_attachment_step").attr('src', '/Content/Images/attachment_step_on.png');
        $("#img_bank_attachment_step").parent().css("border-color", "#7030A0");
        $("#img_bank_attachment_step").addClass("active");
        $("#li_attachmentstep").addClass("active");

        $('#lbl_header').html('Add Attachment');
        var bankobj = JSON.parse(sessionStorage.getItem("bankdetailsJson"));

        if (!(bankobj == null) || (bankobj == 'undefined')) {
            if (bankobj[0].AccountType == 2)  // SAVING ACCOUNT
            {
                $("#btn_voidCheck").addClass('disabled_color');
                $("#btn_voidCheck").prop('disabled', true);
            }
        }
        $("#span_bankstep").removeClass("disabled");
        if (sessionStorage.getItem('deptUser') == "false") { //  for disbursement user, no other attachment button
            $("#div_otherAttachment").hide();
            $(".div-attachmentbuttons").removeClass('col-sm-3');
            $(".div-attachmentbuttons").addClass('col-sm-4');
        }

        var attachobj = sessionStorage.getItem('uploadedfile');
        if ((attachobj != null) && (attachobj != 'undefined')) {
            $("#divmodifiedFileName").show();
            $("#pnlAttachment").show();

            $("#txtattachment").val(sessionStorage.getItem('originalfileName'));
            $("#modifiedFileName").text(sessionStorage.getItem('uploadedfile'));
        }
        else {
            $("#pnlAttachment").hide();
            $("#divmodifiedFileName").hide();
        }

        var attachobj_ddwetform = sessionStorage.getItem('uploadedfile_ddwetform');
        if ((attachobj_ddwetform != null) && (attachobj_ddwetform != 'undefined')) {
            $("#divmodifiedFileName_ddwetform").show();

            $("#txtattachment_ddwetform").val(sessionStorage.getItem('originalfileName_ddwetform'));
            $("#modifiedFileName_ddwetform").text(sessionStorage.getItem('uploadedfile_ddwetform'));
        }
        else {
            $("#divmodifiedFileName_ddwetform").hide();
        }
    }
    else if ($(location).attr('href').indexOf("_partialBankVerify") > -1) {

        var vendordetailsJson = jQuery.parseJSON(sessionStorage.vendordetailsJson);

        $("#img_vendor_step").attr('src', '/Content/Images/user_step.png');
        $("#img_info_step").attr('src', '/Content/Images/info_step.png');
        $("#img_bank_step").attr('src', '/Content/Images/bank_step.png');

        $("#img_bank_verify_step").attr('src', '/Content/Images/verify_step_on.png');
        $("#img_bank_verify_step").parent().css("border-color", "#7030A0");
        $("#img_bank_verify_step").addClass("active");
        $("#li_verify_step").addClass("active");

        $("#span_bankstep").removeClass("disabled");
        $("#span_attachmentstep").removeClass("disabled");

        $('#lbl_header').html('Verify Banking Information');

        var bankdetailsJson = jQuery.parseJSON(sessionStorage.bankdetailsJson);
        var acType = "Error";
        if (bankdetailsJson[0].AccountType == "1")
            acType = "Checking";
        else if (bankdetailsJson[0].AccountType == "2")
            acType = "Saving";

        $("#accountType").text(acType);
        $("#nameonbankAc").text(vendordetailsJson[0].PayeeName);
        $("#bankAcNo").text(bankdetailsJson[0].BankAccountNumber);
        $("#bankRoutingNo").text(bankdetailsJson[0].BankRoutingNo);
        var img = new Image();
        img.src = sessionStorage.getItem('uploadedfile');
        $(".imagearea").html(img);

        var str = ".pdf,.doc,.docx,";
        var strarray = str.split(",");
        if (strarray.indexOf(sessionStorage.getItem('uploadedfileExtension').toLowerCase()) <= -1) {
            $("#Verifyimg").attr("src", "/Uploads/" + sessionStorage.getItem('uploadedfile'));
            $("#divBankVerifyDoc").css('display', 'block');
        }
        else {
            $("#filelink").attr("href", "/Uploads/" + sessionStorage.getItem('uploadedfile'));
            $('a#filelink').text(sessionStorage.getItem('uploadedfile'));
            $("#divBankVerifyImage").css('display', 'block');
        }
    }

    $('#lbl_userName').text(sessionStorage.getItem('userName'));
    var vendorNumber = sessionStorage.getItem('vendorNumber');

    $('#btn_bank_back').on('click', function (e) {
        storeDetails();
        window.history.back();
    });

    $('#txtAccountType').change(function (e) {
        var accountType = $('#txtAccountType').val();
        if (parseInt(accountType) != 1) {
            $('#img_checkImage').hide();
        }
        else {
            $('#img_checkImage').show();
        }
    });

    $("#txtBankRoutingNo").focusout(function () {
        verifyBank();
    }).click(function (e) {
        e.stopPropagation();
        return true;
    });

    var fileSelectytedtype = '';

    $('.buttonBig').on('click', function () {
        $("#divmodifiedFileName").hide();
        $("#pnlAttachment").show();

        sessionStorage.setItem('selectedFile', null);
        $("#txtattachment").val('');
    });

    $("#btn_voidCheck").on('click', function () {
        fileSelectytedtype = 'VC';
        //displayBankStatements = 'Voided Check';
        sessionStorage.setItem('displayBankStatements', 'Voided Check'); 


        $("#btn_voidCheck").removeClass('disabled_color');
        $("#btn_verifyLetter").addClass("disabled_color");
        $("#btn_Statement").addClass("disabled_color");
        $("#btn_otherAttachment").addClass('disabled_color');
    });
    $("#btn_Statement").on('click', function () {
        fileSelectytedtype = 'ST';
        //displayBankStatements = 'First page of Bank Statement';
        sessionStorage.setItem('displayBankStatements', 'First page of Bank Statement'); 



        $("#btn_Statement").removeClass('disabled_color');
        $("#btn_verifyLetter").addClass('disabled_color');
        $("#btn_voidCheck").addClass('disabled_color');
        $("#btn_otherAttachment").addClass('disabled_color');
    });
    $("#btn_verifyLetter").on('click', function () {
        fileSelectytedtype = 'VL';
        //displayBankStatements = 'Bank Verification Letter';
        sessionStorage.setItem('displayBankStatements', 'Bank Verification Letter'); 


        $("#btn_verifyLetter").removeClass('disabled_color');
        $("#btn_voidCheck").addClass('disabled_color');
        $("#btn_Statement").addClass('disabled_color');
        $("#btn_otherAttachment").addClass('disabled_color');
    });

    $("#btn_otherAttachment").on('click', function () {
        fileSelectytedtype = 'OA';
        //displayBankStatements = 'Other Attachment';
        sessionStorage.setItem('displayBankStatements', 'Other Attachment'); 


        $("#btn_otherAttachment").removeClass('disabled_color');
        $("#btn_voidCheck").addClass('disabled_color');
        $("#btn_Statement").addClass('disabled_color');
        $("#btn_verifyLetter").addClass('disabled_color');
    });
    $(function () {
        $("input:file[id=file-upload]").change(function () {
            $("#file-upload-value").html($(this).val());
        });
    });

    function handleFileSelect(fileInput, type) {  ////  if sessionstorage 'uploadedfile'  works delete this key
        var file = fileInput;
        var reader = new FileReader();
        reader.onload = function (e) {
            var img = new Image();
            img.src = reader.result;
            if (type == 'ddwetform') {
                sessionStorage.setItem('imagefile-selectedFile_ddwetform', reader.result);
            }
            else {
                sessionStorage.setItem('imagefile-selectedFile', reader.result);
            }

            var aa = reader.readAsDataURL(file);
            var img = new Image();
            return img;
        }
    };

    $('#input_attachment_ddwetform').change(function (e) {
        var ext = ['.PDF', '.DOC', '.DOCX', '.JPG', '.JPEG', '.GIF', '.PNG'];
        sessionStorage.setItem('displaywetForm', 'Original Direct Deposit Request Form'); 
        $("#fileError_or_Info_ddwetform").html("");
        var fileName = e.target.files[0].name;
        var file = e.target.files[0];
        fileSelectytedtype = 'RF';  //  for dd wet form type

        var imagefile = handleFileSelect(file, 'ddwetform');
        var fileExtenstion = getFileExtenstion(fileName.toUpperCase(), ext);
        if (file) {
            if (file.size >= 10485760) {
                $("#fileError_or_Info_ddwetform").html('The file size is too large. Please choose another file.');
            }
            else if (fileExtenstion == null)
                $("#fileError_or_Info_ddwetform").html('The acceptable file types are .pdf, .doc, .docx, .jpg, .jpeg, .gif, .png. Please choose another file.');
            else {
                sessionStorage.setItem('selectedFile_ddwetform', imagefile);  //  if sessionstorage 'uploadedfile'  works delete this key

                $("#txtattachment_ddwetform").val(fileName);
                sessionStorage.setItem('originalfileName_ddwetform', fileName);  //  original file name: we keep this in case coming back from  next screen 

                var uniqueFileName = getUniqueFileNameusingCurrentTime();
                var modifiedFileName = uniqueFileName + "_" + vendorNumber + "_" + fileSelectytedtype + fileExtenstion.toLowerCase();

                uploadfile(file, modifiedFileName, fileExtenstion.toLowerCase(), 'ddwetform');

                $("#divmodifiedFileName_ddwetform").show();
                $("#modifiedFileName_ddwetform").text(modifiedFileName);
            }
        }

        e.target.value = '';
    });

    // $('input[type="file"]').change(function (e) {
    $('#input_attachment').change(function (e) {
        var ext = ['.PDF', '.DOC', '.DOCX', '.JPG', '.JPEG', '.GIF', '.PNG'];
        $("#fileError_or_Info").html("");
        var fileName = e.target.files[0].name;
        var file = e.target.files[0];

        var imagefile = handleFileSelect(file, 'bankstatement');
        var fileExtenstion = getFileExtenstion(fileName.toUpperCase(), ext);
        if (file) {
            if (file.size >= 10485760) {
                $("#fileError_or_Info").html('The file size is too large. Please choose another file.');
            }
            else if (fileExtenstion == null)
                $("#fileError_or_Info").html('The acceptable file types are .pdf, .doc, .docx, .jpg, .jpeg, .gif, .png. Please choose another file.');
            else {
                sessionStorage.setItem('selectedFile', imagefile);  //  if sessionstorage 'uploadedfile'  works delete this key

                $("#txtattachment").val(fileName);
                sessionStorage.setItem('originalfileName', fileName);  //  original file name: we keep this in case coming back from  next screen 

                var uniqueFileName = getUniqueFileNameusingCurrentTime();
                var modifiedFileName = uniqueFileName + "_" + vendorNumber + "_" + fileSelectytedtype + fileExtenstion.toLowerCase();

                uploadfile(file, modifiedFileName, fileExtenstion.toLowerCase(), 'bankstatements');

                $("#divmodifiedFileName").show();
                $("#modifiedFileName").text(modifiedFileName);
            }
        }

        e.target.value = '';
    });

    $("#btn_FileAttachmentDelete").on('click', function () {
        debugger;
        sessionStorage.removeItem('selectedFile');
        sessionStorage.removeItem('imagefile-selectedFile');
        sessionStorage.removeItem('originalfileName');
        sessionStorage.removeItem('uploadedfile');
        sessionStorage.removeItem('uploadedfileExtension');

        $("#modifiedFileName").text("");
        $("#fileError_or_Info").html("");
        $("#divmodifiedFileName").hide();
        $("#txtattachment").val("");
    });

    $("#btn_FileAttachmentDelete_ddwetform").on('click', function () {
        sessionStorage.removeItem('selectedFile_ddwetform');
        sessionStorage.removeItem('imagefile-selectedFile_ddwetform');
        sessionStorage.removeItem('originalfileName_ddwetform');
        sessionStorage.removeItem('uploadedfile_ddwetform');
        sessionStorage.removeItem('uploadedfileExtension_ddwetform');

        $("#modifiedFileName_ddwetform").text("");
        $("#fileError_or_Info_ddwetform").html("");
        $("#divmodifiedFileName_ddwetform").hide();
        $("#txtattachment_ddwetform").val("");
    });

    function getFileExtenstion(target, values) {
        for (var i = 0; i < values.length; i++) {
            if (target.indexOf(values[i]) > -1) {
                return values[i];
            }
        }
        return null;
    }

    $(".form-control").on('input', function (e) {
        $(".errmessage").html("");
    });

    $('#btn_bank_next').on('click', function (e) {
        var accountType = $('#txtAccountType').val();
        var bankAcNo = $('#txtBankAcNo').val();
        var re_BankAcNo = $('#txtRe-BankAcNo').val();
        var bankRoutingNo = $('#txtBankRoutingNo').val();
        var financialIns = $('#txtFinancialIns').val().toLowerCase();
        var dDNotifyEmail = $('#txtDDNotifyEmail').val();
        var reDDNotifyEmail = $('#txtReDDNotifyEmail').val();

        var bool = true;

        if (parseInt(accountType) <= 0) {
            $("#accountType").html('Account Type is required.');
            bool = false;
        } else {
            $("#accountType").html('');
        }

        if (bankAcNo.length <= 0) {
            $("#bankAcNo").html('Bank Account Number is required.');
            bool = false;
        } else {
            $("#bankAcNo").html('');
        }

        if (re_BankAcNo.length <= 0) {
            $("#re_BankAcNo").html('Re Enter Bank Account Number is required.');
            bool = false;
        } else if (bankAcNo !== re_BankAcNo) {
            $("#re_BankAcNo").html('Bank Account Numbers do not match.');
            bool = false;
        } else {
            $("#re_BankAcNo").html('');
        }

        if (bankRoutingNo.length <= 0) {
            $("#bankRoutingNo").html('Bank Routing Number is required.');
            // $("#txtFinancialIns").css({ "background-color": "#ccc" });
            bool = false;
        } else {
            $("#bankRoutingNo").html('');
            //$("#txtFinancialIns").css({ "background-color": "#fff" });
        }

        if ((financialIns.length <= 0) || (financialIns === ("no banks found"))) {
            $("#financialIns").html('Financial Institution Name is required.');
            bool = false;
        } else {
            $("#financialIns").html('');
        }

        if (dDNotifyEmail.length <= 0) {
            $("#dDNotifyEmail").html('Email Address is required.');
            bool = false;
        } else if (!isEmail(dDNotifyEmail)) {
            $("#dDNotifyEmail").html('Please enter valid Email Address.');
            bool = false;
        } else {
            $("#dDNotifyEmail").html('');
        }

        if (reDDNotifyEmail.length <= 0) {
            $("#reDDNotifyEmail").html('Re Enter Email Address is required.');
            bool = false;
        } else if (!isEmail(reDDNotifyEmail)) {
            $("#reDDNotifyEmail").html('Please enter valid Email Address.');
            bool = false;
        } else if (dDNotifyEmail !== reDDNotifyEmail) {
            $("#reDDNotifyEmail").html('Direct Deposit Notification Email Addresses do not match.');
            bool = false;
        } else {
            $("#reDDNotifyEmail").html('');
        }

        if (!bool) {
            return false;
        } else {
            storeDetails();
            window.location.href = '/draft/_partialAttachment';
        }
    });

    $('#btn_verifyBank').on('click', function (e) {
        verifyBank();
    });

    function verifyBank() {
        var aba = 0;
        aba = $("#txtBankRoutingNo").val();

        $.ajax({
            contentType: "application/json; charset=utf-8",
            type: "post",

            url: "/helper/validateRoughtingNumber?aba=" + aba,
            success: function (data) {
                $("#txtFinancialIns").val(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $("#txtFinancialIns").val("No banks found");
            }
        });
    };

    function storeDetails() {
        var bankdetailsRow = [];
        bankdetailsRow.push({
            AccountType: $("#txtAccountType").val(),
            BankAccountNumber: $("#txtBankAcNo").val(),
            ReBankAcNo: $("#txtRe-BankAcNo").val(),
            BankRoutingNo: $("#txtBankRoutingNo").val(),
            FinancialIns: $("#txtFinancialIns").val(),
            DDNotifyEmail: $("#txtDDNotifyEmail").val(),
            ReDDNotifyEmail: $("#txtReDDNotifyEmail").val(),
        });
        sessionStorage.setItem('bankdetailsJson', JSON.stringify(bankdetailsRow));
    }

    $('#btn_voidCheck').hover(function () {
        $(this).text('Voided Check must have the holder’s name.');
    }, function () {
        $(this).text('Voided Check');
    });

    $('#btn_Statement').hover(function () {
        $(this).text('Statement must include the full bank account number and holder’s name and must be dated within 3 months. ');
    }, function () {
        $(this).text('First page of Bank Statement');
    });

    $('#btn_verifyLetter').hover(function () {
        $(this).text('Letter must include the bank account number, account type and account holder’s name. The letter must be printed on the financial institution’s letterhead which includes the authorized bank representative name, title, phone number, signature and must be dated within 3 months.');
    }, function () {
        $(this).text('Bank Verification Letter');
    });

    $('#btn_otherAttachment').hover(function () {
        $(this).text('Select this option to include other type of attachments.');
    }, function () {
        $(this).text('Other Attachment');
    });

    $('#btn_attach_next').on('click', function (e) {
        if (($("#txtattachment").val().length > 0) && ($("#txtattachment_ddwetform").val().length > 0)) {
            //sessionStorage.setItem('Display_TypeofAttachments', sessionStorage.getItem('displaywetForm') + ', ' + sessionStorage.getItem('displayBankStatements'));
            window.location.href = '/draft/_partialBankVerify';
        }
        else {
            toastr.options.positionClass = "toast-bottom-right";
            toastr.warning("You must select an attachments  to continue!");
        }
    });

    $('#btn_attach_back').on('click', function (e) {
        window.history.back();
    });


    $("#btn_alertOK").on('click', function (e) {
        $('#alertModal').modal('toggle');
    });

    $("#btn_verify_no").on('click', function (e) {
        sessionStorage.setItem('selectedFile', null);
        sessionStorage.setItem('imagefile-selectedFile', null);

        sessionStorage.setItem('selectedFile_ddwetform', null);
        sessionStorage.setItem('imagefile-selectedFile_ddwetform', null);

       // window.history.back();
        window.location.href = '/draft/_partialBankDetails';
    });

    $("#btn_verify_yes").on('click', function (e) {
        window.location.href = '/draft/_partialCertify';
    });

    function uploadfile(filetoupload, modifiedFileName, ext, docType) {
        debugger;
        if (window.FormData !== undefined) {

            //var fileUpload = filetoupload;
            var files = filetoupload;//fileUpload;//.files;

            // Create FormData object  
            var fileData = new FormData();

            // Looping over all files and add it to FormData object  
            fileData.append(files.name, files);

            //for (var i = 0; i < files.length; i++) {
            //    //fileData.append(files[i].name, files[i]);
            //}

            // Adding one more key to FormData object for modified file name 
            if (docType == 'ddwetform') {
                fileData.append('modifiedFilename_ddwetform', modifiedFileName);
            }
            else {
                fileData.append('modifiedFilename', modifiedFileName);
            }

            $.ajax({
                url: '/helper/UploadAttachmentFile',
                type: "POST",
                contentType: false, // Not to set any content header  
                processData: false, // Not to process data  
                data: fileData,
                success: function (result) {
                    if (docType == 'ddwetform') {
                        sessionStorage.setItem('uploadedfile_ddwetform', result);
                        sessionStorage.setItem('uploadedfileExtension_ddwetform', ext);    //to do get from config file
                    }
                    else {
                        sessionStorage.setItem('uploadedfile', result);
                        sessionStorage.setItem('uploadedfileExtension', ext);    //to do get from config file
                    }
                },
                error: function (err) {
                }
            });
        } else {
            alert("Attachment File type is not supported.");
        }
    };

});


