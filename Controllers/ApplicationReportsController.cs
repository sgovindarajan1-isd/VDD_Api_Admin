using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eCAPDDApi.Controllers
{
    public class ApplicationReportsController : Controller
    {
        // GET: Reports
        //public ActionResult Index()
        //{
        //    return View();
        //}

        public ActionResult _partialApplicationReports()
        {
            return View();
        }
    }
}