using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web;
using System.Web.Mvc;
using eCAPDDApi.Models;
using DAL;

namespace eCAPDDApi.Controllers
{
    public class ApplicationListController :Controller
    {

        public ActionResult _partialApplication()
        {
            return View();
        }




    }


}