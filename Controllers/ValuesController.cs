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
    
    //[EnableCors(origins: "https://localhost:44373/api/,  https://localhost:60943/", headers: "*", methods: "*")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    [BasicAuthentication]
    public class ValuesController : ApiController
    {
        // GET api/values                

        //public IHttpActionResult GetAllSriniData()
        //{
        //    classDAL clsdal = new classDAL();
        //    List<VM_Login> data = new List<VM_Login>();

        //    VM_Login vm_LoginData = new VM_Login();

        //    vm_LoginData.Id = 101;
        //    vm_LoginData.FirstName = clsdal.getData();
        //    vm_LoginData.Location = "Downey";

        //    data.Add(vm_LoginData);

        //    return Ok(data);
        //}

      

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

        ////[HttpPost]
        ////public HttpResponseMessage GetVendorNamebyName_get([FromBody] string userToken)
        ////{
        ////    //var jData = Json.Decode(JSONData);
        ////    var data = @"{ 'name': 'testname'}";

        ////    var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
        ////    return response;
        ////}



        //[HttpPost]
        //public HttpResponseMessage GetVendorNamebyName([FromBody] string Name)
        //{
        //    //var jData = Json.Decode(JSONData);
        //    string name = Name;
        //    var data = @"{ 'name': 'testname'}";

        //    var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
        //    return response;
        //}


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

        //[HttpPost]
        //public HttpResponseMessage LoginExternalVendor([FromBody] VM_r_vend_user vmuser)
        //{
        //    //    List<VM_Login> data = new List<VM_Login>();
        //    //    var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
        //    //    return response;
        //    classDAL clsdal = new classDAL();
        //    List<VM_r_vend_user> data = new List<VM_r_vend_user>();

        //    VM_r_vend_user vm_LoginData = new VM_r_vend_user();
        //    //vm_LoginData.IsValidUser = clsdal.ValidateUserbyuid_pwd(vmuser.UserId, vmuser.Tin);
        //    Tuple<string, bool> result = clsdal.ValidateUserbyuid_pwd(vmuser.UserId, vmuser.Tin);
        //    vm_LoginData.UserName = result.Item1;
        //    vm_LoginData.IsValidUser = result.Item2;

        //    data.Add(vm_LoginData);
        //    var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
        //    return response;
        //}

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
            //else {
            //    response = Request.CreateResponse(HttpStatusCode.NotFound);
            //}

        
            return response;
        }

        [HttpPost]
        //[BasicAuthentication]
        public HttpResponseMessage GetVendorDetailsByName([FromBody] VM_Vendor vmvendor)
        {
            ClassDAL clsdal = new ClassDAL();
            //List<VM_Vendor> data = new List<VM_Vendor>();
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





        ////// GET api/values/5

        //////public string Get(int id)
        //////{
        //////    return "value";
        //////}



        ////[Route("api/values/GetAndPostBlogComments")]
        ////[HttpPost]
        ////public IHttpActionResult GetAndPostBlogComments([FromBody] BlogAndStoryComment comment)
        ////{
        ////    List<VM_Login> data = new List<VM_Login>();
        ////    return Ok(data);
        ////}

        ////public void Post([FromBody]string value)
        ////{
        ////}

        ////// PUT api/values/5
        ////public void Put(int id, [FromBody]string value)
        ////{
        ////}

        ////// DELETE api/values/5
        ////public void Delete(int id)
        ////{
        ////}


    }
}


//public IEnumerable<SriniviewModel> Get()
//{
//    //return new string[] { "value1", "value2" };

//    SriniviewModel sriniviewModeldata = new SriniviewModel();

//    sriniviewModeldata.Id = 101;
//    sriniviewModeldata.FirstName = DisplayUserName();
//    sriniviewModeldata.location = "Downey";

//    return sriniviewModeldata as IEnumerable<SriniviewModel>;
//}





//public IHttpActionResult GetVendorNumber_123()
//{
//    List<SriniviewModel> data = new List<SriniviewModel>();

//    SriniviewModel sriniviewModeldata = new SriniviewModel();

//    sriniviewModeldata.Id = 101;
//    sriniviewModeldata.FirstName = DisplayUserName();
//    sriniviewModeldata.location = "Downey";

//    data.Add(sriniviewModeldata);

//    return Ok(data);
//}

// [Route("api/values/GetVendorNumber")]
