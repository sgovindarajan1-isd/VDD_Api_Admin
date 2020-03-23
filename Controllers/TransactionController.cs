using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eCAPDDApi.Controllers
{
    public class TransactionController : Controller
    {
        // GET: Transaction
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult TransView()
        {
            return View();
        }

        public ActionResult SummaryView()
        {
            return View();
        }

    }
}