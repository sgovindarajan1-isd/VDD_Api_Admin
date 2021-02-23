using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using eCAPDDApi.Models;
using DAL;
using System.Threading;

using Microsoft.Reporting.WebForms;
//using System.Web.Mvc;
using System.Data;
using System.IO;
using System.Xml;


using Newtonsoft.Json;
using eCAPDDApi.infrastrure;
using System.Threading.Tasks;
using System.Net.Http.Headers;
using Microsoft.Ajax.Utilities;
using System.Text;

//using Microsoft.Reporting.Map.WebForms.BingMaps;

namespace eCAPDDApi.Controllers
{
    public class EmailClass
    {
        public string MessageBody { get; set; }
        public string Subject { get; set; }
        public string EmailFrom { get; set; }
        public string EmailTo { get; set; }
        public string EmailCC { get; set; }
        //public string EmailBCC { get; set; }
    }

    [RoutePrefix("api/values")]

    [EnableCors(origins: "*", headers: "*", methods: "*")]

    [BasicAuthentication]
    public class ValuesController : ApiController
    {

        LogWriter logw = new LogWriter("Values Controller entry");

        [HttpPost]
        public HttpResponseMessage LoginUser([FromBody] IdTextClass idtext)
        {
            List<VM_login> data = new List<VM_login>();
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage PostContactus([FromBody] DAL.Models.DAL_M_ContactUs vmcontactus)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
            VendorDAL clsdal = new VendorDAL();

            string result = clsdal.PostContactus(vmcontactus);

            VendorContactUSSendEmail(vmcontactus);

            // to do remove later
            List<VM_contactus> data = new List<VM_contactus>();

            response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });

            return response;
        }

        private static Random random = new Random();
        public string GenerateConfirmationNumber(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        private int GenerateControlNumber()  //int length
        {
            //const string chars = "0123456789";
            //return new string(Enumerable.Repeat(chars, length)
            //  .Select(s => s[random.Next(s.Length)]).ToArray());

            AdminDAL adminDAL = new AdminDAL();
            return adminDAL.GenerateControlNumber();

        }
        private string getMessageBody(string vendorName, string confirmNumber)
        {
            string emailBody = string.Empty;

            emailBody = "Thank you for submitting your Direct Deposit Authorization Form to the County of Los Angeles. Your request details are as follows: </br></br> Payee Name: " + vendorName + "</br>Confirmation #: " + confirmNumber + "</br>Allow up to 20 business days for your Direct Deposit Authorization Form to be processed. An email notification will be sent to you if your Direct Deposit request is Approved or Rejected.</br></br>Please reply to this email directly if further assistance is required.</br></br> ***CONFIDENTIALITY NOTICE: This email message, including any attachments, is intended for the official and confidential use of the recipient or an agent responsible for delivering this message to the intended recipient. Please be advised that any use, reproduction, or dissemination of this message or its contents is strictly prohibited and is protected by law. If this message is received in error, please immediately reply to this email and delete the message and all of its attachments.*** ";
            return emailBody;
        }


        private EmailClass VendorConfirmationEmail(string vendorName, string confirmNumber, string DDNotifiEmail, string userId)
        {
            EmailClass obj = new EmailClass();
            obj.MessageBody = getMessageBody(vendorName, confirmNumber);
            obj.Subject = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_Subject"] + " " + confirmNumber;
            obj.EmailFrom = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailFrom"];//"sgovindarajan@isd.lacounty.gov";
            obj.EmailTo = DDNotifiEmail;
            //else {
            //    obj.EmailTo = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailTo"]; // DDNotifiEmail  //  to do   get it from notify eamil
            //}
            obj.EmailCC = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailCC"];
            // obj.EmailBCC = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailBCC"];
            return obj;
        }


        private EmailClass Approval_Email(DAL.Models.DAL_M_VendorDD vmvendorDD) //.VendorNumber, vmvendorDD.ConfirmNumber, vmvendorDD.Signeremail,  )
        {
            EmailClass obj = new EmailClass();

            string emailBody = string.Empty;

            emailBody = "Thank you for submitting your Direct Deposit Authorization Form to the County of Los Angeles. </br></br>";
            
            emailBody += "Your status: Eligible for EFT </br></br>";

            emailBody += "Confirmation #: "+ vmvendorDD.Confirmation+ "</br></br>";
            
            emailBody += "*** CONFIDENTIALITY NOTICE: This email message, including any attachments, is intended for the official and confidential use of the recipient or an agent responsible for delivering this message to the intended recipient.Please be advised that any use, reproduction, or dissemination of this message or its contents is strictly prohibited and is protected by law.If this message is received in error, please immediately reply to this email and delete the message and all of its attachments.*** ";

            obj.MessageBody = emailBody;
            obj.Subject = System.Configuration.ConfigurationManager.AppSettings["Approval_Subject"] + " " + vmvendorDD.VendorNumber;
            obj.EmailFrom = System.Configuration.ConfigurationManager.AppSettings["Approval_EmailFrom"];
            if (vmvendorDD.ProcessorID == "e622505" || vmvendorDD.LastUpdatedUser.ToLower().Trim() == "e622505")
            {
                obj.EmailTo = vmvendorDD.Signeremail;
            }
            else
            {
                obj.EmailTo = System.Configuration.ConfigurationManager.AppSettings["Approval_EmailTo"];  // //To do   get it from authorized signer email
            }
            obj.EmailCC = System.Configuration.ConfigurationManager.AppSettings["Approval_EmailCC"];
            return obj;
        }

        private EmailClass Rejection_Email(DAL.Models.DAL_M_VendorDD vmvendorDD) 
        {
            EmailClass obj = new EmailClass();
            string emailBody = string.Empty;

            emailBody = "Dear Sir/ Madam, </br> </br>";

            emailBody += "The County of Los Angeles, Department of Auditor - Controller recently received your Direct Deposit Authorization request to issue your payments via direct deposit.  Unfortunately, the request is rejected due to the following reasons:  </br> ";

            emailBody += "<ul>  <li>";
            emailBody += vmvendorDD.ReasonType;
            emailBody += "</ul>  </li>";

            emailBody += "You may resubmit your request with the corrected information via: https://directdeposit.lacounty.gov. </br> </br>";

            emailBody += "Please feel free to contact us at DISB.DirectDeposit@auditor.lacounty.gov or call (213) 974-4870 with any questions. </br> </br>";

            emailBody += "Regards,</br> </br>";

            emailBody += "Department of Auditor-Controller, </br>";
            emailBody += "Direct Deposit Unit";



            obj.MessageBody = emailBody;
            obj.Subject = System.Configuration.ConfigurationManager.AppSettings["Rejection_Subject"] + " " + vmvendorDD.Confirmation;
            obj.EmailFrom = System.Configuration.ConfigurationManager.AppSettings["Rejection_EmailFrom"];
            if (vmvendorDD.ProcessorID == "e622505" || vmvendorDD.LastUpdatedUser == "E622505") {
                obj.EmailTo = vmvendorDD.Signeremail;
            }
            else {
                obj.EmailTo = System.Configuration.ConfigurationManager.AppSettings["Rejection_EmailTo"]; //vmvendorDD.Signeremail   //To do   get it from authorized signer email
            }
            obj.EmailCC = System.Configuration.ConfigurationManager.AppSettings["Rejection_EmailCC"];
            return obj;
        }



        //string vendorName, string confirmNumber, string toEmail,
        //, confirmNumber, vmvendorDD.DDNotifyEmail
        private string SendEmail( DAL.Models.DAL_M_VendorDD vmvendorDD)
        {
            EmailClass emailObj = new EmailClass();

            if (vmvendorDD.Status == 4) // approval  or rejection only email
            {
                emailObj = Approval_Email(vmvendorDD); 
            }
            else if (vmvendorDD.Status == 6) {
                emailObj = Rejection_Email(vmvendorDD);
            }
            else {
                emailObj = VendorConfirmationEmail(vmvendorDD.Payeename, vmvendorDD.Confirmation, vmvendorDD.DDNotifyEmail, vmvendorDD.LastUpdatedUser);
            }

            if (String.IsNullOrEmpty(emailObj.EmailTo))
            {
                return "Error - No Email id to send";
            }

            if ((String.IsNullOrEmpty(emailObj.EmailFrom) | String.IsNullOrWhiteSpace(emailObj.EmailFrom)) |
                 (String.IsNullOrEmpty(emailObj.Subject) | String.IsNullOrWhiteSpace(emailObj.Subject)) |
                 (String.IsNullOrEmpty(emailObj.MessageBody) | String.IsNullOrWhiteSpace(emailObj.MessageBody))
               )
            {
                return "Error - Missing required parameter. Message was not sent.";
            }

            System.Net.Mail.SmtpClient smtCliend = new System.Net.Mail.SmtpClient();
            System.Net.Mail.MailMessage mailMsg = new System.Net.Mail.MailMessage(emailObj.EmailFrom, emailObj.EmailTo);  //, emailObj.EmailCC.ToString()


            foreach (var address in emailObj.EmailTo.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries))
            {
                mailMsg.To.Add(address);
            }

            foreach (var address in emailObj.EmailCC.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries))
            {
                mailMsg.CC.Add(address);
            }

            //mailMsg.Bcc.Add(emailObj.EmailBCC);
            mailMsg.Subject = emailObj.Subject;
            mailMsg.Body = emailObj.MessageBody;
            mailMsg.IsBodyHtml = true;
            mailMsg.Priority = System.Net.Mail.MailPriority.Normal;
            try
            {
                smtCliend.Send(mailMsg);
            }
            catch (System.Exception ex)
            {
                return "Error - " + ex.Message;
            }

            return "Success";
        }

        [HttpPost]
        public HttpResponseMessage PrintVendorConfirmationLetter([FromBody]DAL.Models.DAL_M_VendorDD vmvendorDD)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "");
            VendorDAL clsdal = new VendorDAL();

            int controlNumber = GenerateControlNumber();
            if (vmvendorDD.Status == 23) {
                vmvendorDD.VendorReportFileName = "CONF_" + vmvendorDD.Confirmation + "_" + vmvendorDD.PayeeLocationID + "_" + controlNumber + ".pdf";  // controlnumber = caseNo 
                vmvendorDD.CaseNo = controlNumber.ToString();
            }
            else if (vmvendorDD.Status == 4)
            {
                vmvendorDD.CaseNo = controlNumber.ToString();
                vmvendorDD.VendorReportFileName = "APPR_" + vmvendorDD.Confirmation + "_" + vmvendorDD.PayeeLocationID+"_"+ controlNumber + ".pdf";  // controlnumber = caseNo
            }
            else if (vmvendorDD.Status == 6)
            {
                vmvendorDD.VendorReportFileName = "RJCT_" + vmvendorDD.Confirmation + "_" + vmvendorDD.PayeeLocationID + "_" + controlNumber + ".pdf";
            }
            else
                vmvendorDD.VendorReportFileName = "Error in File Name";


            generatePrintConfirmationLetter(vmvendorDD);
            response = Request.CreateResponse(HttpStatusCode.OK, new { data = vmvendorDD });
           
            return response;
        }

        private EmailClass FormatContactUSEmail(DAL.Models.DAL_M_ContactUs vmcontactus)
        {
            EmailClass obj = new EmailClass();

            DAL.Models.DAL_M_SourceIPInfo ipInfo = RetrieveSourceIPInfo();

            string emailBody = string.Empty;
            emailBody += "First Name: " + vmcontactus.FirstName + "</br>";
            emailBody += "Last Name: "  + vmcontactus.LastName + "</br>";
            emailBody += "Company Name: " + vmcontactus.Company + "</br>";
            emailBody += "Phone Name: " + vmcontactus.Phone + "</br></br>";
            emailBody += "Email: " + vmcontactus.Email + "</br></br>";

            emailBody += "IP Tracking Fields: </br>";

            emailBody += "IP Address: "+ ipInfo.Source_IP+ "</br></br>";

            emailBody += "ServerName: " + ipInfo.SourceServerName + "</br></br>";

            emailBody += "IP Device: "+ ipInfo.Source_Device+ "</br> </br>";
            emailBody += "Source Information: " + ipInfo.Source_Host_Headers + "</br> </br>";

            emailBody += "Track IP location: </br></br>";
            if (ipInfo.Source_Location != null)
            {
                emailBody += "City, State and Country: " + ipInfo.Source_Location + "</br> </br>";
            }

            obj.MessageBody = emailBody + "Message: " + vmcontactus.Message+ "</br>";
            obj.Subject = vmcontactus.Subject;
            obj.EmailFrom = System.Configuration.ConfigurationManager.AppSettings["VendorContactUS_EmailFrom"];
            obj.EmailTo = System.Configuration.ConfigurationManager.AppSettings["VendorContactUS_EmailTo"]; // contactusEmail   vmcontactus.Email //  to do   get it from correct eamil

            obj.EmailCC = System.Configuration.ConfigurationManager.AppSettings["VendorContactUS_EmailCC"];
            return obj;
        }

        private string VendorContactUSSendEmail(DAL.Models.DAL_M_ContactUs vmcontactus)
        {
            EmailClass emailObj = FormatContactUSEmail(vmcontactus);

            if ((String.IsNullOrEmpty(emailObj.EmailFrom) | String.IsNullOrWhiteSpace(emailObj.EmailFrom)) |
                 (String.IsNullOrEmpty(emailObj.Subject) | String.IsNullOrWhiteSpace(emailObj.Subject)) |
                 (String.IsNullOrEmpty(emailObj.MessageBody) | String.IsNullOrWhiteSpace(emailObj.MessageBody))
               )
            {
                return "Error - Missing required parameter. Message was not sent.";
            }

            System.Net.Mail.SmtpClient smtClient = new System.Net.Mail.SmtpClient();
            System.Net.Mail.MailMessage cmailMsg = new System.Net.Mail.MailMessage(emailObj.EmailFrom, emailObj.EmailTo);  //, emailObj.EmailCC.ToString()

            foreach (var address in emailObj.EmailTo.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries))
            {
                cmailMsg.To.Add(address);
            }

            foreach (var address in emailObj.EmailCC.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries))
            {
                cmailMsg.CC.Add(address);
            }

            //mailMsg.Bcc.Add(emailObj.EmailBCC);
            cmailMsg.Subject = emailObj.Subject;
            cmailMsg.Body = emailObj.MessageBody;
            cmailMsg.IsBodyHtml = true;
            cmailMsg.Priority = System.Net.Mail.MailPriority.Normal;
            try
            {
                smtClient.Send(cmailMsg);
            }
            catch (System.Exception ex)
            {
                return "Error - " + ex.Message;
            }

            return "Success";
        }

        [HttpPost]
        public HttpResponseMessage SubmitVendorDD([FromBody]DAL.Models.DAL_M_VendorDD vmvendorDD)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "");
            VendorDAL clsdal = new VendorDAL();

            string confirmNumber = GenerateConfirmationNumber(6);
            DateTime updateDate = DateTime.Now;

            //date1.ToString("g",CultureInfo.CreateSpecificCulture("en-us"))

            var uniqueDatetime = DateTime.Now.ToString("ddMMyyyyhhmmss");
            vmvendorDD.VendorReportFileName = "VCM_" + confirmNumber + "_" + uniqueDatetime + ".pdf";

            vmvendorDD.Confirmation = confirmNumber;
            vmvendorDD.SubmitDateTime = updateDate;
            Tuple<string, string> result = clsdal.SubmitVendor(vmvendorDD);

            if (result.Item1 == "SUCCESS")
            {
                string str = generateVCMPDFReport(vmvendorDD);
                DAL.Models.DAL_M_SourceIPInfo ipInfo = RetrieveSourceIPInfo();

                Tuple<string, string> resultAttach = clsdal.SubmitAttachmentFile(vmvendorDD);
                string resultRequestLog = clsdal.InsertRequestLog(vmvendorDD, ipInfo);

                if ((resultAttach != null) && (resultRequestLog != string.Empty))
                {
                    vmvendorDD.Confirmation = confirmNumber;
                    vmvendorDD.SubmitDateTime = updateDate;

                    //if ((vmvendorDD.SubmitFromWhere != null) &&  (vmvendorDD.SubmitFromWhere.ToUpper() != "DRAFT") ) {  //  For Internal submission no need of mail per user on 2/2/2021
                    if (vmvendorDD.SubmitFromWhere == null) { //  external submission :  To do send something like external
                        vmvendorDD.ReturnErrorSuccessMsg = SendEmail(vmvendorDD);
                    }
                }
                else
                {
                    vmvendorDD.VendorReportFileName = "Error-in attachment";
                    vmvendorDD.Confirmation = "ERROR-in attachment";
                    vmvendorDD.ReturnErrorSuccessMsg = "Error in submitting Attachment file/Request Log";
                }
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = vmvendorDD });
            }
            else
            {
                vmvendorDD.Confirmation = "ERROR-submit vendor confirmation";
            }
            return response;
        }


        [HttpPost]
        public HttpResponseMessage InsertVendorReportFileName([FromBody]DAL.Models.DAL_M_VendorDD vmvendorDD)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "");
            VendorDAL clsdal = new VendorDAL();

            VM_vendorDD vmvendorreturn = new VM_vendorDD();

            Tuple<string, string> resultAttach = clsdal.InsertVendorReportFileName(vmvendorDD);
            return Request.CreateResponse(HttpStatusCode.OK, new { data = resultAttach });
        }

        [HttpPost]
        public HttpResponseMessage CheckStatus([FromBody] IdTextClass confirmationNumObj)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "");
            VendorDAL clsdal = new VendorDAL();

            string result = clsdal.GetApplicationStatus(confirmationNumObj.Text);
            if (result != null)
            {
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = result });
            }

            return response;
        }

        /// --------------------------

        [HttpPost]
        public HttpResponseMessage LoginExternalVendor_authen([FromBody] VM_R_Vend_User vmuser)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");

            VendorDAL clsdal = new VendorDAL();
            List<VM_R_Vend_User> data = new List<VM_R_Vend_User>();
            VM_R_Vend_User vm_LoginData = new VM_R_Vend_User();

            Tuple<string, bool> result = clsdal.ValidateUserbyuid_pwd(vmuser.UserId, vmuser.Tin);
            if (result != null)
            {
                vm_LoginData.UserName = result.Item1;
                vm_LoginData.IsValidUser = result.Item2;
                vm_LoginData.ValidateToken = Thread.CurrentPrincipal.Identity.Name;
                vm_LoginData.SourceIP = GetIpAddress();
                vm_LoginData.Source_Device = getOSInfo();

                data.Add(vm_LoginData);

                response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            }

            return response;
        }

        [HttpPost]
        public HttpResponseMessage LoginAdminUser([FromBody] VM_AdminUser vm_AdminUser) //(   [FromBody] VM_r_vend_user vmuser
        {
            gov.lacounty.webadminisd.Service loginServs = new gov.lacounty.webadminisd.Service();
            // just to go for demo
            bool bool_isAuthenicated = false;
            if (vm_AdminUser.UserId != string.Empty)
            {
                //bool_accountExists = loginServs.AccountExists(vm_AdminUser.UserId);
                bool_isAuthenicated = loginServs.IsAuthenticated(vm_AdminUser.UserId, vm_AdminUser.Password);

            }

            if (!bool_isAuthenicated){
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "Login Failed: User Id and Password not found!" });
            }
            
            // just to go for demo  -  end GlobalRoles.DataEntryRole

            AdminDAL clsdal = new AdminDAL();
            Tuple<List<DAL.Models.DAL_M_UserProfile>, bool> result = clsdal.ValidateAdminUser(vm_AdminUser.UserId);

            if (result != null)
            {
                var v1 = loginServs.UserSearch(vm_AdminUser.UserId);
                var v3 = loginServs.GetUserProfile(vm_AdminUser.UserId);

                var data = new
                {
                    userProfile = v1,
                    userProfile_2 = v3,
                    List_userRoles = result.Item1,
                    IsValidUser = result.Item2,
                };

                return Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "Login Failed: Invalid Login." });
        }

        public HttpResponseMessage RetrieveUserDetails([FromBody] VM_AdminUser vm_AdminUser)
        {
            try
            {
                AdminDAL clsdal = new AdminDAL();
                Tuple<List<DAL.Models.DAL_M_UserProfile>, bool> result = clsdal.ValidateAdminUser(vm_AdminUser.UserId);

                List<DAL.Models.DAL_M_UserProfile> userRoles = new List<DAL.Models.DAL_M_UserProfile>();

                if (result != null)
                {
                    userRoles = result.Item1;
                }

                gov.lacounty.webadminisd.Service loginServs = new gov.lacounty.webadminisd.Service();

                var data = new
                {
                    userProfile = loginServs.GetUserProfile(vm_AdminUser.UserId),
                    list_userRoles = userRoles //result.Item1
                };

                return Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "User not found!." });
            }


        }

        [HttpPost]
        public HttpResponseMessage GetVendorNameByVendorCode([FromBody] VM_R_Vend_User vmuser)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "Vendor not found");
            AdminDAL adminDAL = new AdminDAL();

            string result = adminDAL.GetVendorNameByVendorCode(vmuser.UserId);
            if (result != null)
            {
                var data = new
                {
                    VendorName = result,
                };
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "Error" });
            }

            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetVendorDetailsByName([FromBody] VM_Vendor vmVendor)
        {
            VendorDAL clsdal = new VendorDAL();
            // VM_Vendor vm_Vendor = new VM_Vendor();

            var dt = clsdal.GetVendorDetailsByName(vmVendor.VendorNumber);
            var data = new
            {
                vendorlst = dt,
                total = 1
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }


        [HttpPost]
        public HttpResponseMessage GetApplicationListAssigned([FromBody] VM_AdminUser VM_adminUser)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetApplicationListAssigned(VM_adminUser.RoleId, VM_adminUser.UserId, VM_adminUser.PendingAssignmentStatus, VM_adminUser.MyapprovalStatus, VM_adminUser.FilterAge, VM_adminUser.FilterApptype, VM_adminUser.FilterUser, VM_adminUser.FilterStatus);
            var data = new
            {
                pendingAssignmentList = dt.Item1,  //  supervisor view only
                pendingMyApprovalList = dt.Item2,  // supervisor and processor view
                appPendingOver60Days = dt.Item3,
                total = 1
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetAppliationAgeAssigned([FromBody] VM_AdminUser VM_adminUser)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetAppliationAgeAssigned(VM_adminUser.RoleId, VM_adminUser.UserId, VM_adminUser.Status, VM_adminUser.Age1, VM_adminUser.Age2, VM_adminUser.Age3);
            var data = new
            {
                appliationAgeAssignedList = dt.Item1,
                totalApplicationCount = dt.Item2,
                totalApplicationCountOver60 = dt.Item3,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetAppliationAgeAssignedByRequestType([FromBody] VM_AdminUser VM_adminUser)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetAppliationAgeAssignedByRequestType(VM_adminUser.RoleId, VM_adminUser.UserId, VM_adminUser.Status, VM_adminUser.Age1, VM_adminUser.Age2, VM_adminUser.Age3, VM_adminUser.FilterApptype);
            var data = new
            {
                appliationAgeAssignedList = dt.Item1,
                totalApplicationCount = dt.Item2,
                totalApplicationCountOver60 = dt.Item3,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetApplicationSummary([FromBody] IdTextClass idTextClass)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetApplicationSummary(idTextClass.Text);//text = Confirmation);
            var data = new
            {
                applicationSummary = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateApplicationStatus([FromBody] DAL.Models.DAL_M_VendorDD adminModel)
        {
            AdminDAL adminDAL = new AdminDAL();


            var dt = adminDAL.UpdateApplicationStatus(adminModel.Confirmation, adminModel.Status, adminModel.Comment, adminModel.ReasonType, adminModel.ProcessorID, adminModel.AssignedBy);
            var data = new
            {
                returnValue = dt,
            };

            // approval   adminModel.Status == 4 && ( adminModel.RequestType == "DDOL" || adminModel.RequestType == "ACOT" )  ||

            //rejection only email
            if (
                 adminModel.Status == 6 && ( adminModel.RequestType == "DDOL" || adminModel.RequestType == "ACOT")
                 ) { 
                SendEmail(adminModel);
            }

            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateAssignApplication([FromBody] DAL.Models.DAL_M_VendorDD adminModel)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateAssignApplication(adminModel.Confirmation, adminModel.Status, adminModel.ProcessorID, adminModel.AssignedBy);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateVendorDetails([FromBody] DAL.Models.DAL_M_VendorDD adminModel)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateVendorDetails(adminModel);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateVendorBankDetails([FromBody] DAL.Models.DAL_M_VendorDD adminModel)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateVendorBankDetails(adminModel);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateVendorAuthorizationDetails([FromBody] DAL.Models.DAL_M_VendorDD adminModel)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateVendorAuthorizationDetails(adminModel);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateDepartmentDetails([FromBody] DAL.Models.DAL_M_VendorDD adminModel)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateDepartmentDetails(adminModel);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetProcessorsList()
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetProcessorsList();
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetApplicationCustomFilterList([FromBody] VM_AdminUser VM_adminUser)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetApplicationCustomFilterList();
            var data = new
            {
                applicationTypeList = dt.Item1,
                userList = dt.Item2,
                statusList = dt.Item3,
                //totalApplicationCountOver60 = dt.Item3,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetTimeLineByConfirmationNumber(IdTextClass idTextClass)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetTimeLineByConfirmationNumber(idTextClass.Text);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage InsertUpdateNotes([FromBody] DAL.Models.DAL_M_Notes vm_Notes)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.InsertUpdateNotes(vm_Notes);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetNotesByConfirmationNumber(IdTextClass idTextClass)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetNotesByConfirmationNumber(idTextClass.Text);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetAttachmentsData([FromBody] DAL.Models.DAL_M_AttachmentData dal_M_AttachmentData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetAttachmentsData(dal_M_AttachmentData.ConfirmationNum);
            var data = new
            {
                attachments = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateRetireAttachment([FromBody] DAL.Models.DAL_M_VendorDD attachmentModel)
        {
            AdminDAL adminDAL = new AdminDAL();

            adminDAL.UpdateRetireAttachment(attachmentModel);
            var dt = adminDAL.GetAttachmentsData(attachmentModel.Confirmation);
            var data = new
            {
                attachments = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage InsertDocumentAttachment([FromBody] DAL.Models.DAL_M_VendorDD attachmentModel)
        {
            AdminDAL adminDAL = new AdminDAL();
            //var response = new HttpResponseMessage();
            string ret = adminDAL.InsertDocumentAttachment(attachmentModel);
            if (ret == "ERROR")
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "error" });
            }

            var dt = adminDAL.GetAttachmentsData(attachmentModel.Confirmation);
            var data = new
            {
                attachments = dt
            };

            return Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            //return response;
        }

        [HttpPost]
        public HttpResponseMessage InsertUpdateDocumentCheckList([FromBody] DAL.Models.DAL_M_Checklist checklistModel)
        {
            AdminDAL adminDAL = new AdminDAL();
            string ret = adminDAL.InsertUpdateDocumentCheckList(checklistModel);
            if (ret == "ERROR")
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "error" });
            }

            var data = new
            {
                returnValue = "Success",
            };

            return Request.CreateResponse(HttpStatusCode.OK, new { data = data });
        }
        [HttpPost]
        public HttpResponseMessage GetDocumentCheckList([FromBody] DAL.Models.DAL_M_Checklist dal_M_Checklist)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetDocumentCheckList(dal_M_Checklist.ConfirmationNumber);
            var data = new
            {
                ChecklistItems = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage InsertUpdateChecklistNotes([FromBody] DAL.Models.DAL_M_Notes vm_checklistNotes)
        {

            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.InsertUpdateChecklistNotes(vm_checklistNotes);
            var data = new
            {
                ModifiedNoteId = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetChecklistNotesByChecklistIDandNotesID([FromBody] DAL.Models.DAL_M_Checklist dal_M_Checklist)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetChecklistNotesByChecklistIDandNotesID(dal_M_Checklist.ConfirmationNumber, dal_M_Checklist.CheckListID);
            var data = new
            {
                ChecklistNotes = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        private string GetIpAddress()
        {
            return System.Web.HttpContext.Current.Request.UserHostAddress;
        }

        [HttpPost]
        private DAL.Models.DAL_M_SourceIPInfo RetrieveSourceIPInfo()
        {
            string GEOLOCATION;
            string ServerName = Request.RequestUri.GetLeftPart(UriPartial.Authority); // this can be stored in the requests log table
            string IPADDR = GetIpAddress().Trim(); // Request.RequestUri.AbsoluteUri;// //localhost will have ::1. Other internal clients will have 10.*
            string Headers = Request.Headers.ToString(); // this can be stored in the requests log table

            // populate actual values if the request is not from the localhost
            DAL.Models.DAL_M_SourceIPInfo ipInfo = new DAL.Models.DAL_M_SourceIPInfo();
            ipInfo.Source_Host_Headers = Headers;
            ipInfo.SourceServerName = ServerName;
            ipInfo.Source_IP = IPADDR;
            ipInfo.Source_Device = getOSInfo();
            if ((IPADDR.IndexOf("10.") > 0) || (IPADDR.IndexOf("192.") > 0) || (ipInfo.City.IsNullOrWhiteSpace()) || (ipInfo.StateProvCode.IsNullOrWhiteSpace()))
            {
                ipInfo.Source_Location = "LA County Internal";
            }

            logw.LogWrite("RetrieveSourceIPInfo - IPADDR " + IPADDR);
            logw.LogWrite("RetrieveSourceIPInfo - ServerName " + ServerName);
            logw.LogWrite("RetrieveSourceIPInfo - Headers " + Headers);

            if (!ServerName.Contains("localhost"))
            {
                try
                {
                    string info = new WebClient().DownloadString("http://api.db-ip.com/v2/free/" + IPADDR);
                    ipInfo = JsonConvert.DeserializeObject<DAL.Models.DAL_M_SourceIPInfo>(info);

                    logw.LogWrite("RetrieveSourceIPInfo - info " + info);

                    // any IP that starts with 10. or 192. will be internal to LA County network but may show the city name differently because of the location of the edge router
                    //ViewBag.Message += "IP: " + IPADDR + Environment.NewLine + "Location: " + ipInfo.City + Environment.NewLine + ipInfo.StateProv;
                    ipInfo.Source_Host_Headers = Headers;
                    ipInfo.SourceServerName = ServerName;
                    ipInfo.Source_IP = IPADDR;
                    if ((IPADDR.IndexOf("10.") > 0) || (IPADDR.IndexOf("192.") > 0) || (ipInfo.City.IsNullOrWhiteSpace()) || (ipInfo.StateProvCode.IsNullOrWhiteSpace()))
                    {
                        ipInfo.Source_Location = "LA County Internal";
                    }
                    else
                    {
                        ipInfo.Source_Location = ipInfo.City + ", " + ipInfo.StateProvCode + " (" + ipInfo.CountryCode + ")";
                    }

                    logw.LogWrite("RetrieveSourceIPInfo - ipInfo.Source_Location " + ipInfo.Source_Location);
                    ipInfo.Source_Device = getOSInfo();
                }
                catch (Exception ex)
                {
                    logw.LogWrite("RetrieveSourceIPInfo - exception " + ex.Message.ToString());
                }
            }
            else
            {
                //Initialize with user friendly values representing localhost
                ServerName = "LOCALHOST";
                IPADDR = "127.0.0.1";
                GEOLOCATION = "VDD APPLICATION SERVER";

                ipInfo.SourceServerName = ServerName;
                ipInfo.Source_IP = IPADDR;
                ipInfo.Source_Location = GEOLOCATION;
            }

            return ipInfo;
        }

        public String GetMobileVersion(string userAgent, string device)
        {
            var temp = userAgent.Substring(userAgent.IndexOf(device) + device.Length).TrimStart();
            var version = string.Empty;

            foreach (var character in temp)
            {
                var validCharacter = false;
                int test = 0;

                if (Int32.TryParse(character.ToString(), out test))
                {
                    version += character;
                    validCharacter = true;
                }

                if (character == '.' || character == '_')
                {
                    version += '.';
                    validCharacter = true;
                }

                if (validCharacter == false)
                    break;
            }

            return version;
        }
        private String getOSInfo()
        {
            var ua = System.Web.HttpContext.Current.Request.UserAgent; // Request.UserAgent;

            if (ua.Contains("Android"))
                return string.Format("Android {0}", GetMobileVersion(ua, "Android"));

            if (ua.Contains("iPad"))
                return string.Format("iPad OS {0}", GetMobileVersion(ua, "OS"));

            if (ua.Contains("iPhone"))
                return string.Format("iPhone OS {0}", GetMobileVersion(ua, "OS"));

            if (ua.Contains("Linux") && ua.Contains("KFAPWI"))
                return "Kindle Fire";

            if (ua.Contains("RIM Tablet") || (ua.Contains("BB") && ua.Contains("Mobile")))
                return "Black Berry";

            if (ua.Contains("Windows Phone"))
                return string.Format("Windows Phone {0}", GetMobileVersion(ua, "Windows Phone"));

            if (ua.Contains("Mac OS"))
                return "Mac OS";

            if (ua.Contains("Windows NT 5.1") || ua.Contains("Windows NT 5.2"))
                return "Windows XP";

            if (ua.Contains("Windows NT 6.0"))
                return "Windows Vista";

            if (ua.Contains("Windows NT 6.1"))
                return "Windows 7";

            if (ua.Contains("Windows NT 6.2"))
                return "Windows 8";

            if (ua.Contains("Windows NT 6.3"))
                return "Windows 8.1";

            if (ua.Contains("Windows NT 10"))
                return "Windows NT 10";

            //fallback to basic platform:
            return (ua.Contains("Mobile") ? " Mobile " : "");
        }

        // ------------- Reporting 
        private string PDFExport(LocalReport report, string rptPathandFileName, string rptFileName)
        {
            try
            {
                string[] streamids;
                string mimetype;
                string encod;
                string fextension;
                string deviceInfo =
                  "<DeviceInfo>" +
                  "  <OutputFormat>EMF</OutputFormat>" +
                  "  <PageWidth>8.5in</PageWidth>" +
                  "  <PageHeight>11in</PageHeight>" +
                  "  <MarginTop>0.25in</MarginTop>" +
                  "  <MarginLeft>0.25in</MarginLeft>" +
                  "  <MarginRight>0.25in</MarginRight>" +
                  "  <MarginBottom>0.25in</MarginBottom>" +
                  "</DeviceInfo>";
                Warning[] warnings;

                byte[] bytes = report.Render("PDF", deviceInfo, out mimetype, out encod, out fextension, out streamids, out warnings);
                string localPath = AppDomain.CurrentDomain.BaseDirectory;
                System.IO.File.WriteAllBytes(rptPathandFileName, bytes);

                return rptFileName;
            }
            catch (Exception ex)
            {
                return "error " + ex.Message + " -*- " + rptPathandFileName + " -*- " + rptFileName; 
            }
        }

        public DataTable createPrintConfirmationLetterDataTable(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("ConfirmationNumber");
            dt.Columns.Add("ControlNumber");
            dt.Columns.Add("PayeeName");
            dt.Columns.Add("AddressStreetLine");
            dt.Columns.Add("CityStateZip");
            dt.Columns.Add("SubmitDate");
            dt.Columns.Add("RejectReason");  // used only in rejection letter

            DataRow dr = dt.NewRow();
            dr["ConfirmationNumber"] = vendordetails.Confirmation;
            dr["ControlNumber"] = vendordetails.CaseNo;
            dr["PayeeName"] = vendordetails.Payeename;
            if (vendordetails.PayeeLocationAddress2 != null && vendordetails.PayeeLocationAddress2 != "")
            {
                dr["AddressStreetLine"] = vendordetails.PayeeLocationAddress1 + Environment.NewLine + vendordetails.PayeeLocationAddress2;//PayeeLocationStreet;
            }
            else {
                dr["AddressStreetLine"] = vendordetails.PayeeLocationAddress1;
            }
            dr["CityStateZip"] = vendordetails.PayeeLocationCityStateZip.Trim();
            dr["SubmitDate"] = DateTime.Now.ToString("MMMM dd, yyyy");//   "dd/MM/yyyy");
            dr["RejectReason"] = vendordetails.Comment;// vendordetails.ReasonType;//

            dt.Rows.Add(dr);
            return dt;
        }

        public DataTable createVendorDataTable(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("VendorNumber");
            dt.Columns.Add("VendorName");
            dt.Columns.Add("ssn");
            dt.Columns.Add("DDNotifiEmail");
            dt.Columns.Add("AccountType");
            dt.Columns.Add("BankAccountNumber");
            dt.Columns.Add("BankRoutingNo");
            dt.Columns.Add("FinancialIns");
            dt.Columns.Add("Signeremail");
            dt.Columns.Add("Signername");
            dt.Columns.Add("Signerphone");
            dt.Columns.Add("Signertitle");
            dt.Columns.Add("VendorAttachmentFileName");
            dt.Columns.Add("SubmittedDate");
            dt.Columns.Add("TotalAttachment");
            dt.Columns.Add("ConfirmationNumber");
            DataRow dr = dt.NewRow();
            dr["VendorNumber"] = vendordetails.Vendorname;
            dr["VendorName"] = vendordetails.Payeename;

            dr["ssn"] = getMaskedSSN(vendordetails.Ssn);
            dr["DDNotifiEmail"] = vendordetails.DDNotifyEmail;
            if (vendordetails.AccountType == 1)
                dr["AccountType"] = "Checking";
            else if (vendordetails.AccountType == 2)
                dr["AccountType"] = "Saving";
            else
                dr["AccountType"] = "Error";
            dr["BankAccountNumber"] = vendordetails.BankAccountNumber;
            dr["BankRoutingNo"] = vendordetails.BankRoutingNo;
            dr["FinancialIns"] = vendordetails.FinancialIns;
            dr["Signeremail"] = vendordetails.Signeremail;
            dr["Signername"] = vendordetails.Signername;
            dr["Signerphone"] = vendordetails.Signerphone;
            dr["Signertitle"] = vendordetails.Signertitle;
            dr["VendorAttachmentFileName"] = vendordetails.VendorAttachmentFileName;
            if ( (vendordetails.SubmitFromWhere != null) && (vendordetails.SubmitFromWhere.ToUpper() == "DRAFT") ){
                dr["TotalAttachment"] = "Total: 2";
            }
            else{
                dr["TotalAttachment"] = "Total: 1";
            }
           // dr["SubmittedDate"] = "SubmittedDate: " + vendordetails.SubmitDateTime.ToString();
            dr["SubmittedDate"] = "SubmittedDate: " + vendordetails.SubmitDateTime.ToString("g", System.Globalization.CultureInfo.CreateSpecificCulture("en-us"));

            dr["ConfirmationNumber"] = vendordetails.Confirmation;
            dt.Rows.Add(dr);
            return dt;
        }

        public string getMaskedSSN(string ssn)
        {
            if (ssn.Trim().Length < 9)
            {
                return ssn;
            }
            else
            {
                return "***-**-" + ssn.Substring(ssn.Trim().Length - 4, 4);
            }
        }
        public DataTable createLocationDataTable(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            if (vendordetails.LocationAddressDescList.Count <= 0)
                return null;
            DataTable dt = new DataTable();
            dt.Clear();
            dt.Columns.Add("LocationAddress");

            int cnt = 1;
            foreach (string locadd in vendordetails.LocationAddressDescList)
            {
                if (locadd != null && locadd != string.Empty)
                {
                    DataRow dr = dt.NewRow();
                    dr["LocationAddress"] = cnt.ToString() + ". " + locadd;
                    cnt++;
                    dt.Rows.Add(dr);
                }
            }

            return dt;
        }

        private string generateVCM(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            //logw.LogWrite("Entering into show report");
            try
            {
                string localPath = AppDomain.CurrentDomain.BaseDirectory;
                string uploadPath = System.Configuration.ConfigurationManager.AppSettings["Uploadpath"];  //  here is the path where  vendorreport file will be saved

                string uploadFileName = localPath + uploadPath + "\\" + vendordetails.VendorReportFileName;

                ReportViewer viewer = new ReportViewer();
                viewer.ProcessingMode = ProcessingMode.Local;
                viewer.SizeToReportContent = true;
                viewer.SizeToReportContent = true;
                viewer.AsyncRendering = true;
                viewer.LocalReport.ReportPath = "VendorAuthorizationForm.rdlc";

                DataTable vdt = createVendorDataTable(vendordetails);
                ReportDataSource rds = new ReportDataSource("VendorDataSet", vdt);

                // location ds
                DataTable ldt = createLocationDataTable(vendordetails);
                ReportDataSource lds = new ReportDataSource("VendorDataLocDataSet", ldt);

                viewer.LocalReport.DataSources.Clear();
                viewer.LocalReport.DataSources.Add(rds);
                viewer.LocalReport.DataSources.Add(lds);

                string retFileName = PDFExport(viewer.LocalReport, uploadFileName, vendordetails.VendorReportFileName);
                //logw.LogWrite("inside generate vcm sucess file name- " + retFileName);
                return retFileName; //Json(retFileName);
            }
            catch (Exception ex)
            {
                //logw.LogWrite("inside generate vcm exception- " + ex.Message);
                return "ERROR - " + ex.Message;
            }
        }

        private string generateVCMPDFReport(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            //logw.LogWrite("entering into show report imp");
            try
            {
                string localPath = AppDomain.CurrentDomain.BaseDirectory;
                string uploadPath = System.Configuration.ConfigurationManager.AppSettings["Uploadpath"];
                //  here is the path where  vendorreport file will be saved
                //string uploadFileName = Path.Combine(Server.MapPath("~/" + uploadPath + "/ "), vendordetails.VendorReportFileName);

                string uploadFileName = localPath + uploadPath + "\\" + vendordetails.VendorReportFileName;

                ReportViewer viewer = new ReportViewer();
                viewer.ProcessingMode = ProcessingMode.Local;
                viewer.SizeToReportContent = true;
                viewer.SizeToReportContent = true;
                viewer.AsyncRendering = true;
                viewer.LocalReport.ReportPath = "VendorAuthorizationForm.rdlc";

                DataTable vdt = createVendorDataTable(vendordetails);
                ReportDataSource rds = new ReportDataSource("VendorDataSet", vdt);

                // location ds
                DataTable ldt = createLocationDataTable(vendordetails);
                ReportDataSource lds = new ReportDataSource("VendorDataLocDataSet", ldt);

                viewer.LocalReport.DataSources.Clear();
                viewer.LocalReport.DataSources.Add(rds);
                viewer.LocalReport.DataSources.Add(lds);

                string retFileName = PDFExport(viewer.LocalReport, uploadFileName, vendordetails.VendorReportFileName);
                //logw.LogWrite("inside generate vcm success file name- " + retFileName);
                return retFileName; //Json(retFileName);
            }
            catch (Exception ex)
            {
                //logw.LogWrite("inside generate vcm exception- " + ex.Message);
                return "ERROR - " + ex.Message;
            }
        }


        private string generatePrintConfirmationLetter(DAL.Models.DAL_M_VendorDD vendordetails)
        {
            try
            {
                string localPath = AppDomain.CurrentDomain.BaseDirectory;
                string uploadPath = System.Configuration.ConfigurationManager.AppSettings["Uploadpath"];
                //  here is the path where  vendorreport file will be saved
                //string uploadFileName = Path.Combine(Server.MapPath("~/" + uploadPath + "/ "), vendordetails.VendorReportFileName);

                string uploadFileName = localPath + uploadPath + "\\" + vendordetails.VendorReportFileName;

                ReportViewer viewer = new ReportViewer();
                viewer.ProcessingMode = ProcessingMode.Local;
                viewer.SizeToReportContent = true;
                viewer.SizeToReportContent = true;
                viewer.AsyncRendering = true;
                if (vendordetails.Status == 23)  //vendor confirmation letter
                {
                    viewer.LocalReport.ReportPath = "PrintConfirmationLetter.rdlc";
                }
                else if (vendordetails.Status == 4) //4   Approved
                {
                    viewer.LocalReport.ReportPath = "PrintApprovalLetter.rdlc";
                }
                else if (  (vendordetails.Status == 6)  &&  (vendordetails.RequestType == "ACSS")) {  //6   Rejected  Deaprtment - "DPSS"
                    viewer.LocalReport.ReportPath = "PrintRejectionLetter_DPSS.rdlc";
                }
                else if ((vendordetails.Status == 6) && (vendordetails.RequestType == "ACCH")) {  //6   Rejected  Deaprtment - "DCFS"
                    viewer.LocalReport.ReportPath = "PrintRejectionLetter_DCFS.rdlc";
                }
                else { 
                    viewer.LocalReport.ReportPath = "Error";
                }
                DataTable vdt = createPrintConfirmationLetterDataTable(vendordetails);
                ReportDataSource rds = new ReportDataSource("PrintVendorConfirmationDataSet", vdt);

                viewer.LocalReport.DataSources.Clear();
                viewer.LocalReport.DataSources.Add(rds);

                string retFileName = PDFExport(viewer.LocalReport, uploadFileName, vendordetails.VendorReportFileName);
                //logw.LogWrite("Inside generate vcm success file name- " + retFileName);
                return retFileName; //Json(retFileName);
            }
            catch (Exception ex)
            {
                //logw.LogWrite("Inside generate vcm exception- " + ex.Message);
                return "ERROR - " + ex.Message;
            }
        }

        [HttpPost]
        public HttpResponseMessage GetLinkedApplicationByConfirmationNum([FromBody] DAL.Models.DAL_M_VendorDD dal_M_VendorDD)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetLinkedApplicationByConfirmationNum(dal_M_VendorDD);
            var data = new
            {
                linkedApplication = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetAvailableApplicationLinkByConfirmationNum([FromBody] DAL.Models.DAL_M_VendorDD dal_M_VendorDD)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetAvailableApplicationLinkByConfirmationNum(dal_M_VendorDD);
            var data = new
            {
                Available_ApplicationLinks = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UpdateLink_UnLink_ApplicationByConfirmationNum([FromBody] DAL.Models.DAL_M_LinkApplication dal_M_LinkApplication)
        {

            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateLink_UnLink_ApplicationByConfirmationNum(dal_M_LinkApplication);
            var data = new
            {
                link_unlink = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetArchieveDocumentsByConfirmationNUmber([FromBody] DAL.Models.DAL_M_AttachmentData dal_M_AttachmentData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetArchieveDocumentsByConfirmationNUmber(dal_M_AttachmentData.ConfirmationNum);
            var data = new
            {
                archieveDocuments = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage UploadAttachmentFile()
        {
            HttpResponseMessage result = null;
            var httpRequest = System.Web.HttpContext.Current.Request;

            string uploadpath = string.Empty;

            if (httpRequest.Files.Count > 0)
            {
                string modifiedFilename = System.Web.HttpContext.Current.Request.Form["modifiedFilename"];
                if (modifiedFilename == null)
                {
                    modifiedFilename = System.Web.HttpContext.Current.Request.Form["modifiedFilename_ddwetform"];
                }

                var docfiles = new List<string>();
                foreach (string file in httpRequest.Files)
                {
                    string fname = string.Empty;
                    var postedFile = httpRequest.Files[file];

                    if (System.Web.HttpContext.Current.Request.Browser.Browser.ToUpper() == "IE" || System.Web.HttpContext.Current.Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                    {  //To-do later
                        fname = modifiedFilename;
                    }
                    else
                    {
                        fname = modifiedFilename;
                    }
                    string localPath = AppDomain.CurrentDomain.BaseDirectory;
                    uploadpath = System.Configuration.ConfigurationManager.AppSettings["Uploadpath"];
                    fname = localPath + uploadpath + "\\" + fname;

                    postedFile.SaveAs(fname);
                    docfiles.Add(fname);
                }
                result = Request.CreateResponse(HttpStatusCode.Created, modifiedFilename);
            }
            else
            {
                result = Request.CreateResponse(HttpStatusCode.BadRequest);
            }
            return result;
        }

        [HttpPost]
        public HttpResponseMessage getUsersListByUserId([FromBody] DAL.Models.DAL_M_UsersData dal_M_UsersData)
        {
            AdminDAL adminDAL = new AdminDAL();
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");

            if (dal_M_UsersData.UserId.ToLower() != "all")
            {

                AdminDAL clsdal = new AdminDAL();
                Tuple<List<DAL.Models.DAL_M_UserProfile>, bool> result = clsdal.ValidateAdminUser(dal_M_UsersData.UserId);
                List<DAL.Models.DAL_M_UserProfile> roles = null;

                if (result != null)
                {
                    roles = result.Item1;
                }

                var dt = adminDAL.getUsersListByUserId(dal_M_UsersData);
                var data = new
                {
                    usersList = dt,
                    list_userRoles = roles
                };
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            }
            else
            {
                var dt = adminDAL.getUsersListByUserId(dal_M_UsersData);
                var data = new
                {
                    usersList = dt
                };
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            }
            return response;
        }


        [HttpPost]
        public HttpResponseMessage InsertUpdateGeneralContent_ContactUs([FromBody] DAL.Models.DAL_M_GeneralContentContactUs vm_GeneralContentContactUs)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.InsertUpdateGeneralContent_ContactUs(vm_GeneralContentContactUs);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage RetrieveGeneralContent_ContactUs()
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetGeneralContent_ContactUs();
            var data = new
            {
                generalContent_ContactUs = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage InsertUpdateDenialReason([FromBody] DAL.Models.DAL_M_DenialReason vm_DenialReason)
        {
            AdminDAL adminDAL = new AdminDAL();
            //var dt = 
            adminDAL.InsertUpdateDenialReason(vm_DenialReason);
            //var data = new
            //{
            //    returnValue = dt,
            //};

            var dt = adminDAL.GetDenialReasonList(0);  //  0 means get all
            var data = new
            {
                denialReasonList = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage RetrieveDenialReasonList(int id)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetDenialReasonList(id);
            var data = new
            {
                denialReasonList = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        
        [HttpPost]
        public HttpResponseMessage GetDenialReasonCategoryList()
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetDenialReasonCategoryList();
            var data = new
            {
                denialReasonCategoryList = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }


        [HttpPost]
        public HttpResponseMessage UpdateUserDetails([FromBody] DAL.Models.DAL_M_UsersData vm_UsersData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateUserDetails(vm_UsersData);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetApplicationAdvancedSearch([FromBody] DAL.Models.DAL_M_ApplicationList dal_M_ApplicationList)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetApplicationAdvancedSearch(dal_M_ApplicationList);
            var data = new
            {
                lst_AppSearchList = dt
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetApplicationReport([FromBody] DAL.Models.DAL_M_ApplicationList dal_M_ApplicationList)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetApplicationReport(dal_M_ApplicationList);
            var data = new
            {
                lst_AppSearchList = dt.Item1,
                lst_ApplicationCountList = dt.Item2
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetVCMReport([FromBody] DAL.Models.DAL_M_ApplicationList dal_M_ApplicationList)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetVCMReport(dal_M_ApplicationList);
            var data = new
            {
                lst_VCMList = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage InsertUpdateManageUserApplicationFilter([FromBody] DAL.Models.DAL_M_ApplicationList dal_m_ManageUserData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt1 = adminDAL.InsertUpdateManageUserApplicationFilter(dal_m_ManageUserData);

            dal_m_ManageUserData.ManageUserMenuId = 0;

            var dt = adminDAL.GetManageUserMenuList(dal_m_ManageUserData);

            var data = new
            {
                lst_ManageUserList = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }
        
        [HttpPost]
        public HttpResponseMessage GetManageUserMenuList([FromBody] DAL.Models.DAL_M_ApplicationList dal_m_ManageUserData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetManageUserMenuList(dal_m_ManageUserData);
            var data = new
            {
                manageUserMenuList = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage DeleteManageUserApplicationList([FromBody] DAL.Models.DAL_M_ApplicationList dal_m_ManageUserData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dtDte = adminDAL.DeleteManageUserApplicationList(dal_m_ManageUserData);

            dal_m_ManageUserData.ManageUserMenuId = 0;

            var dt = adminDAL.GetManageUserMenuList(dal_m_ManageUserData);
            var data = new
            {
                manageUserApplicationList = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetApplicationListByManageUserMenuId([FromBody]DAL.Models.DAL_M_ApplicationList dal_m_ManageUserData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetApplicationListByManageUserMenuId(dal_m_ManageUserData);
            var data = new
            {
                manageUserApplicationList = dt  //  supervisor view only
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetUsersRoleList([FromBody]DAL.Models.DAL_M_Role dal_m_RoleData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetUsersRoleList(dal_m_RoleData);
            var data = new
            {
                roleMenuList = dt  
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }
        
        [HttpPost]
        public HttpResponseMessage GetUserProfileByUserId([FromBody]DAL.Models.DAL_M_UsersData dal_m_UserData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetUserProfileByUserId(dal_m_UserData);
            var data = new
            {
                userProfileList = dt
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        

        [HttpPost]
        public HttpResponseMessage UpdateUserProfile([FromBody] DAL.Models.DAL_M_UsersData dal_m_UserData)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.UpdateUserProfile(dal_m_UserData);
            var data = new
            {
                returnValue = dt,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage ValidateRoughtingNumberFromAPI(string aba)
        {
            string bankName = string.Empty;
            try
            {
                abaService.ABAServiceSoapClient abaWebService = new abaService.ABAServiceSoapClient("ABAServiceSoap");
                string token = abaWebService.Logon(3387, "lacounty".Trim(), "RXdqmYHg".Trim());
                bool validRouting = abaWebService.VerifyABA(token, aba);


                string xml = abaWebService.GetBanksPrimarySortXML(token, aba);
                XmlDocument xmlDoc = new XmlDocument();
                xmlDoc.LoadXml(xml);

                XmlNodeList iNodeList = xmlDoc.SelectNodes("//Institutions");

                if (iNodeList.Count > 0)
                {
                    XmlNode node = iNodeList[0];
                    bankName = node.InnerText;
                }

                var data = new
                {
                    bankName = bankName,
                };
                var response = Request.CreateResponse(HttpStatusCode.OK, new { data = bankName });
                return response;

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "No banks found" });
            }
          
        }



    }
}