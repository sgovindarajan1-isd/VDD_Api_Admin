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

namespace eCAPDDApi.Controllers
{
    public class VendorConfirmationEmail
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
        private string getMessageBody(string vendorName, string confirmNumber)
        {
            string emailBody = string.Empty;

            emailBody = "Thank you for submitting your Direct Deposit Authorization Form to the County of Los Angeles. Your request details are as follows: </br></br> Payee Name: " + vendorName + "</br>Confirmation #: " + confirmNumber + "</br>Allow up to 15 business days for your Direct Deposit Authorization Form to be processed. An email notification will be sent to you if your Direct Deposit request is Approved or Rejected.</br></br>Please reply to this email directly if further assistance is required.</br></br> ***CONFIDENTIALITY NOTICE: This email message, including any attachments, is intended for the official and confidential use of the recipient or an agent responsible for delivering this message to the intended recipient. Please be advised that any use, reproduction, or dissemination of this message or its contents is strictly prohibited and is protected by law. If this message is received in error, please immediately reply to this email and delete the message and all of its attachments.*** ";
            return emailBody;
        }

        private VendorConfirmationEmail VendorConfirmationEmail(string vendorName, string confirmNumber, string DDNotifiEmail)
        {
            VendorConfirmationEmail obj = new VendorConfirmationEmail();
            obj.MessageBody = getMessageBody(vendorName, confirmNumber);
            obj.Subject = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_Subject"] + " " + confirmNumber;
            obj.EmailFrom = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailFrom"];//"sgovindarajan@isd.lacounty.gov";
            obj.EmailTo = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailTo"]; // DDNotifiEmail  //  to do   get it from notify eamil
            obj.EmailCC = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailCC"];
           // obj.EmailBCC = System.Configuration.ConfigurationManager.AppSettings["VendorConfirm_EmailBCC"];
            return obj;
        }

        private string SendEmail(string vendorName, string confirmNumber, string DDNotifiEmail)
        {
            VendorConfirmationEmail emailObj = VendorConfirmationEmail(vendorName, confirmNumber, DDNotifiEmail);

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
        public HttpResponseMessage SubmitVendorDD([FromBody]DAL.Models.DAL_M_VendorDD vmvendorDD)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "");
            VendorDAL clsdal = new VendorDAL();

            VM_vendorDD vmvendorreturn = new VM_vendorDD();

            string confirmNumber = GenerateConfirmationNumber(6);
            DateTime updateDate = DateTime.Now;

            vmvendorDD.Confirmation = confirmNumber;
            vmvendorDD.SubmitDateTime = updateDate;

            Tuple<string, string> result = clsdal.SubmitVendor(vmvendorDD);
            if (result != null)
            {

                Tuple<string, string> resultAttach = clsdal.SubmitAttachmentFile(vmvendorDD);
                string resultRequestLog = clsdal.InsertRequestLog(vmvendorDD);
                if ((resultAttach != null) && (resultRequestLog != string.Empty))
                {
                    vmvendorreturn.Confirmation = confirmNumber;
                    vmvendorreturn.SubmitDateTime = updateDate;

                    vmvendorreturn.ReturnErrorSuccessMsg = SendEmail(vmvendorDD.Payeename, confirmNumber, vmvendorDD.DDNotifyEmail);
                }
                else
                {
                    vmvendorreturn.Confirmation = "ERROR-in attach";
                    vmvendorreturn.ReturnErrorSuccessMsg = "Error in submitting Attachment file/Request Log";
                }
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = vmvendorreturn });
            }
            else
            {
                vmvendorreturn.Confirmation = "ERROR-submit vendor confirmation";
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

                data.Add(vm_LoginData);

                response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
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
        public HttpResponseMessage LoginAdminUser([FromBody] VM_AdminUser vm_AdminUser) //(   [FromBody] VM_r_vend_user vmuser
        {
            gov.lacounty.webadminisd.Service loginServs = new gov.lacounty.webadminisd.Service();
            // just to go for demo
            //////bool bool_isAuthenicated = false;
            //////if (vm_AdminUser.UserId != string.Empty)
            //////{
            //////    //bool_accountExists = loginServs.AccountExists(vm_AdminUser.UserId);
            //////    bool_isAuthenicated = loginServs.IsAuthenticated(vm_AdminUser.UserId, vm_AdminUser.Password);

            //////}

            //////if (!bool_isAuthenicated)
            //////{
            //////    return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "Login Failed: User Id and Password not found!" });
            //////}
            ///
            // just to go for demo  -  end

            VendorDAL clsdal = new VendorDAL();
            Tuple<List<DAL.Models.DAL_M_UserProfile>, bool> result = clsdal.ValidateAdminUser(vm_AdminUser.UserId);

            if (result != null)
            {
                var v1 = loginServs.UserSearch(vm_AdminUser.UserId);
                var v3 = loginServs.GetUserProfile(vm_AdminUser.UserId);


                var data = new
                { 
                    userProfile= v1,
                    userProfile_2 = v3,
                    List_userRoles = result.Item1,
                    IsValidUser = result.Item2
                };

                return Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest, new { data = "Login Failed: Invalid Login." });
        }

        [HttpPost]
        public HttpResponseMessage GetApplicationDetailsAssigned([FromBody] VM_AdminUser VM_adminUser)
        {
            AdminDAL adminDAL = new AdminDAL();

            var dt = adminDAL.GetApplicationDetailsAssigned(VM_adminUser.UserId, VM_adminUser.PendingAssignmentStatus, VM_adminUser.MyapprovalStatus);
            var data = new
            {
                pendingMyApprovalList = dt.Item1,
                pendingAssignmentList = dt.Item2,
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

            var dt = adminDAL.GetAppliationAgeAssigned(VM_adminUser.UserId, VM_adminUser.Status, VM_adminUser.Age1, VM_adminUser.Age2, VM_adminUser.Age3 );
            var data = new
            {
                appliationAgeAssignedList = dt.Item1,
                totalApplicationCount = dt.Item2,
                totalApplicationCountOver60 = dt.Item3,
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

    }
}


