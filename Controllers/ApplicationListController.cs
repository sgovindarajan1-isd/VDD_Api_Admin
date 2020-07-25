using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using eCAPDDApi.Models;
using DAL;

namespace eCAPDDApi.Controllers
{
    public class ApplicationListController : ApiController
    {

        [HttpPost]
        public HttpResponseMessage GetApplicationDetailsAssigned([FromBody] VM_AdminUser VM_adminUser)
        {
            AdminDAL adminDAL = new AdminDAL();
           
            var dt = adminDAL.GetApplicationDetailsAssigned(VM_adminUser.UserId, VM_adminUser.Status, VM_adminUser.Age1, VM_adminUser.Age2, VM_adminUser.Age3);
            var data = new
            {
                vendorlst = dt,
                total = 1
            };
            var response = Request.CreateResponse(HttpStatusCode.OK, new { data = data });
            return response;
        }
    }
}