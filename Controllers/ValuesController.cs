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
            //var jData = Json.Decode(JSONData);
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
        //[BasicAuthentication]
        public HttpResponseMessage postcontactus([FromBody] VM_contactus vmcontactus)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
            ClassDAL clsdal = new ClassDAL();
            List<VM_contactus> data = new List<VM_contactus>();

            response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            
            return response;
        }

        [HttpPost]
        //[BasicAuthentication]
        public HttpResponseMessage LoginExternalVendor_authen([FromBody] VM_r_vend_user vmuser)
        {
            var response = Request.CreateResponse(HttpStatusCode.NotFound, "User not found");
            ClassDAL clsdal = new ClassDAL();
            List<VM_r_vend_user> data = new List<VM_r_vend_user>();

            VM_r_vend_user vm_LoginData = new VM_r_vend_user();

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
        //[BasicAuthentication]
        public HttpResponseMessage GetVendorDetailsByName([FromBody] VM_Vendor vmvendor)
        {
            ClassDAL clsdal = new ClassDAL();
            VM_Vendor vm_Vendor = new VM_Vendor();

            var  dt = clsdal.GetVendorDetailsByName(vmvendor.VendorNumber);
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

