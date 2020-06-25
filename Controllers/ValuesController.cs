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
    public class RecipeInformation
    {
        public string name { get; set; }
    }

    public class BlogAndStoryComment
    {
        public string name { get; set; }
    }

    [RoutePrefix("api/values")]

    [EnableCors(origins: "*", headers: "*", methods: "*")]
    //[EnableCors("*", "*", "*")]
    //[EnableCorsAttribute("*", "*", "*")]

    [BasicAuthentication]
    public class ValuesController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage GetVendorNumber(int id)
        {
            var data = @"{ 'id': '10'}";

            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpGet]
        public HttpResponseMessage Different_get_2(int id)
        {
            var data = @"{ 'id': '10'}";

            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage GetVendorNamebyNameFromURI([FromUri] string Name)
        {
            string name = Name;
            var data = @"{ 'name': 'testname'}";

            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage LoginUser([FromBody] IdTextClass idtext)
        {
            List<VM_login> data = new List<VM_login>();
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage PostContactus([FromBody] DAL.Models.VM_contactus vmcontactus)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
            ClassDAL clsdal = new ClassDAL();
            
            string  result = clsdal.PostContactus(vmcontactus);

            List<VM_contactus> data = new List<VM_contactus>();

            response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            
            return response;
        }

        private static Random random = new Random();
        public  string GENErateConfirmationNumber(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[random.Next(s.Length)]).ToArray());
        }


        [HttpPost]
        public HttpResponseMessage SubmitVendorDD([FromBody]DAL.Models.VM_vendorDD vmvendorDD)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
            ClassDAL clsdal = new ClassDAL();

            VM_vendorDD vmvendorreturn = new VM_vendorDD();

            string confirmNumber = GENErateConfirmationNumber(6);
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
                }
                else
                {
                    vmvendorreturn.Confirmation = "ERROR";
                }
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = vmvendorreturn });
            }
            else {
                vmvendorreturn.Confirmation = "ERROR";
            }

            return response;
        }

        [HttpPost]
        public HttpResponseMessage CheckStatus([FromBody] IdTextClass confirmationNumObj)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
            ClassDAL clsdal = new ClassDAL();

            string result = clsdal.GetApplicationStatus(confirmationNumObj.Text);
            if (result != null)
            {
                response = Request.CreateResponse(HttpStatusCode.OK, new { data = result });
            }

            return response;
        }

        [HttpPost]
        public HttpResponseMessage LoginExternalVendor_authen([FromBody] VM_r_vend_user vmuser)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
            ClassDAL clsdal = new ClassDAL();
            List<VM_r_vend_user> data = new List<VM_r_vend_user>();

            VM_r_vend_user vm_LoginData = new VM_r_vend_user();

            Tuple<string,  bool> result = clsdal.ValidateUserbyuid_pwd(vmuser.UserId, vmuser.Tin);
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
            ClassDAL clsdal = new ClassDAL();
            VM_Vendor vm_Vendor = new VM_Vendor();

            var  dt = clsdal.GetVendorDetailsByName(vmVendor.VendorNumber); 
            var data = new
            {
                vendorlst = dt,
                total = 1
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        [HttpPost]
        public HttpResponseMessage LoginAdminUser([FromBody] IdTextClass idtext)
        {
            //gov.lacounty.webadminisd.Service loginServs = new gov.lacounty.webadminisd.Service();
            //return loginServs.AccountExists("C197831_s");

            List<VM_login> data = new List<VM_login>();
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }

        // POST api/values
        [HttpPost]
        public void Post(RecipeInformation information)
        {
            var data = @"{ 'id': '10'}";
        }
    }
}

