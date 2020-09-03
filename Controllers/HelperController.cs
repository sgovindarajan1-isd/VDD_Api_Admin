using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

using System.IO;
using System.Net;
using System.Xml;

namespace eCAPDDApi.Controllers
{
    public class HelperController : Controller
    {
        // GET: Helper
        public ActionResult Index()
        {
            return View();
        }



        [HttpPost]
        public ActionResult UploadAttachmentFile()
        {
            //string testanddelete = GetIPAddress();

            string fname = string.Empty;
            string Uploadpath = string.Empty;
            // Checking no of files injected in Request object  
            if (Request.Files.Count > 0)
            {
                string modifiedFilename = Request.Form["modifiedFilename"];
                try
                {
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        HttpPostedFileBase file = files[i];

                        // Checking for Internet Explorer  
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = modifiedFilename;
                        }

                        Uploadpath = System.Configuration.ConfigurationManager.AppSettings["Uploadpath"];
                        fname = Path.Combine(Server.MapPath("~/" + Uploadpath + "/ "), fname);
                        file.SaveAs(fname);
                    }
                    // Returns message that successfully uploaded  
                    return Json(modifiedFilename);
                }
                catch (Exception ex)
                {
                    return Json("Error");
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }
    }
}