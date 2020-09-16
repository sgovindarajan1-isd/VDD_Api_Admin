using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace eCAPDDApi.Controllers
{
    public class DraftController : Controller
    {
        // GET: Draft
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult _partialLocations()
        {
            return View();
        }

        public ActionResult _partialVendor()
        {
            return View();
        }

        public ActionResult _partialBankDetails()
        {
            return View();
        }

        public ActionResult _partialAttachment()
        {
            return View();
        }

        public ActionResult _partialBankVerify()
        {
            return View();
        }

        public ActionResult _partialCertify()
        {
            return View();
        }

        public ActionResult _partialSubmit()
        {
            return View();
        }


        public ActionResult _partialConfirmation()
        {
            return View();
        }
    }
}