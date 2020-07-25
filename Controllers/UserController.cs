using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using eCAPDDApi.Models;

namespace eCAPDDApi.Controllers
{
    public class UserController : ApiController
    {

        [HttpPost]
        public HttpResponseMessage AdminUserLogin([FromBody] IdTextClass idtext)
        {
            List<VM_login> data = new List<VM_login>();
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }
    }
}
